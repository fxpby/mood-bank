# State Management

> State contracts for the local-first emotional account PWA.

---

## Overview

The app uses React context for app-level local state and route-local React state for in-progress form steps. There is no server state in P0.

The authoritative persisted object is `AppState`. It is loaded and saved through `StorageAdapter`, then exposed to routes through `AppStoreProvider`.

---

## State Categories

### Route-Local State

Use route-local `useState` for transient UI state:

- current step in a flow
- selected chips before save
- text input drafts before the debounced draft write
- local validation errors

### App Store State

Use `AppStoreContext` for state that must survive route changes or refresh:

- setup state and emotional spaces
- daily markets
- episodes
- return-to-self practices
- anchors
- drafts
- storage status and last save/reset error

### Derived State

Do not persist derived storage-jar summaries. They must be computed from saved source records:

```ts
const summaries = deriveAllAccountSummaries(state);
```

`deriveAllAccountSummaries` collects account impacts from episodes and return-to-self practices only. Drafts and placeholders must not contribute to summaries.

Account detail screens are also derived read models:

```ts
const detail = selectAccountDetail(state, "self");
```

`selectAccountDetail` must derive rows from `AccountImpact[]` plus readable source context from `episodes` and `returnToSelfPractices`. It must not persist detail rows, cached summaries, or route-local action choices. Suggested personal actions on detail pages are transient UI state only unless a future PRD adds an explicit durable action model.

---

## Write Contract

All durable writes go through `AppActions` in `src/store/AppStoreContext.tsx`.

Required action behavior:

| Action | May Persist | Notes |
|---|---:|---|
| `completeSetup` | Yes | Replaces initial state with setup state. |
| `updateDailyMarket` | Yes | Upserts today's market by date key. |
| `saveQuickRecord` | Yes | Creates an episode and clears a matching draft id after successful state construction. May also create one source-linked discovery point when `nextAction === "save_later_topic"`; this must happen in the same `commitState` call. |
| `saveReturnToSelfPractice` | Yes | Creates a practice and optional anchor. Never creates connection impact. |
| `saveTriggerCompletion` | No in P0 | Returns no-write result so Trigger -> Quick Record does not double-count Self. |
| `saveDiscoveryPoint` | Yes | Creates a manual or source-linked discovery point. Must not create account impacts by default. |
| `saveDiscoveryPoints` | Yes | Creates multiple discovery points in one commit. Must not create account impacts by default. |
| `updateDiscoveryPointStatus` | Yes | Updates one discovery point status. Unknown ids return no-op success. Must not create account impacts. |
| `saveDraft` | Yes | Saves route draft data only; drafts never create account impacts. |
| `deleteDraft` | Yes | No-op success if the draft is already absent. |
| `resetLocalData` | Yes | Resets storage only after adapter reset succeeds. |

If storage save fails, return `{ ok: false, inMemoryOnly: true }` and do not update `state` as if the write were durable. UI copy must not claim the record was saved.

---

## Storage Contract

Only `src/storage/storageAdapter.ts` may call `window.localStorage`.

The adapter must return typed result objects:

```ts
type LoadResult =
  | { ok: true; state: AppState; status: "available" }
  | { ok: false; fallbackState: AppState; status: StorageStatus; error?: string };

type StorageWriteResult =
  | { ok: true }
  | { ok: false; status: StorageStatus; error?: string };
```

Validation/error behavior:

| Condition | Expected Result |
|---|---|
| Storage unavailable | `ok: false`, `status: "unavailable"`, fallback initial state on load. |
| Empty storage | `ok: true`, initial state. |
| Invalid JSON or invalid minimum shape | `ok: false`, `status: "corrupted"`, fallback initial state. |
| Future schema version | `ok: false`, `status: "unsupported_version"`, fallback initial state. |
| Save/reset throws | `ok: false`, `status: "unavailable"` with error text. |

---

## Common Mistakes

### Wrong: Persisting Summaries

```ts
// Wrong: this makes stored summaries authoritative.
state.accountSummaries = deriveAllAccountSummaries(state);
```

### Correct: Derive at Read Time

```ts
const summaries = deriveAllAccountSummaries(state);
```

### Wrong: Storage in Routes

```ts
// Wrong: bypasses storage validation and error copy.
window.localStorage.setItem("mood-bank:v1:app-state", JSON.stringify(nextState));
```

### Correct: Commit Through Store Action

```ts
const result = actions.saveQuickRecord(input);
```

### Discovery Point Contract

`topics` in `AppState` stores `DiscoveryPoint[]`, not task backlog items. The Topics page may use route-local state for filters and form fields, but durable changes must go through:

```ts
actions.saveDiscoveryPoint(input);
actions.updateDiscoveryPointStatus({ id, status });
```

Saving or reviewing a discovery point must not change Connection / Self / Energy summaries unless a future PRD adds an explicit account-impact rule. Tests should assert that topic helpers leave derived storage-jar summaries unchanged.

## Scenario: Quick Record Captures A Later Topic

### 1. Scope / Trigger

- Trigger: route UI lets the user choose `save_later_topic` as the owned next action in Quick Record.
- Scope: `QuickRecordInput` -> `saveQuickRecord` -> `Episode` plus optional `DiscoveryPoint`.

### 2. Signatures

```ts
type QuickRecordInput = {
  // existing episode fields...
  nextAction?: string;
  laterTopic?: {
    title?: string;
    note?: string;
  };
};

saveQuickRecord(input: QuickRecordInput): StoreWriteResult<Episode>;
```

### 3. Contracts

When `input.nextAction === "save_later_topic"`:

- create the `Episode` exactly as a normal quick record would
- create one `DiscoveryPoint` with `kind: "topic"`
- set `sourceType: "episode"`
- set `sourceId` to the new episode id
- set `sourceTitle` to the saved episode title
- set `sourceSnippet` to the saved episode facts
- use `laterTopic.title` / `laterTopic.note` when provided, otherwise use gentle defaults
- write episode, linked topic, and draft removal atomically in one `commitState(nextState)`

The linked topic must not add or modify any `AccountImpact[]`.

### 4. Validation & Error Matrix

| Condition | Expected Result |
|---|---|
| `nextAction !== "save_later_topic"` | Save only the episode. |
| `nextAction === "save_later_topic"` | Save the episode and exactly one linked topic in the same commit. |
| Storage save fails | Return `{ ok: false, inMemoryOnly: true }`; do not update React state or show success copy. |
| `laterTopic.title` blank or missing | Topic title falls back to the saved episode title or discovery-point fallback. |

### 5. Good/Base/Bad Cases

- Good: user chooses "保存一个话题", saves a quick record, refreshes, and sees a source-linked topic in `/topics`.
- Base: user saves a normal quick record; no topic is created.
- Bad: route calls `saveQuickRecord` successfully, then separately calls `saveDiscoveryPoint`; a second write can fail and create false persistence semantics.

### 6. Tests Required

- Domain tests for building source-linked discovery points.
- Regression test or manual browser check that linked topics do not change derived Connection / Self / Energy summaries.
- Browser check for Quick Record -> `/topics` persistence when the route behavior changes.

### 7. Wrong vs Correct

#### Wrong

```ts
const episodeResult = actions.saveQuickRecord(input);
actions.saveDiscoveryPoint(topicInput);
```

#### Correct

```ts
const result = actions.saveQuickRecord({
  ...input,
  nextAction: "save_later_topic",
  laterTopic: { title, note },
});
```

## Scenario: Signal Check Saves A Discovery Point

### 1. Scope / Trigger

- Trigger: `/signal-check` lets the user complete a buffering flow and optionally save the pattern/result for later review.
- Scope: route-local `SignalCheck*` choices -> `buildSignalCheckDiscoveryPointInput(...)` -> `actions.saveDiscoveryPoint(...)`.

### 2. Signatures

```ts
type SignalCheckSaveInput = {
  spaceId: string;
  target: SignalCheckTarget;
  goodReaction: GoodSignalReaction;
  absentReaction: AbsentSignalReaction;
  action: SignalCheckAction;
  result?: SignalCheckResult;
};

buildSignalCheckDiscoveryPointInput(input: SignalCheckSaveInput): DiscoveryPointInput;
```

### 3. Contracts

- Completing the flow without explicit save is route-local only and must not persist data.
- Explicit save creates exactly one `DiscoveryPoint` through `actions.saveDiscoveryPoint(...)`.
- Saved signal-check output uses `sourceType: "manual"` unless a future PRD adds a durable `signal_check` source model.
- Non-checking actions should save as `kind: "action_idea"` with `theme: "action_experiment"`.
- Checking-anyway results should save as `kind: "discovery"` with emotion/old-echo theme based on selected content.
- Signal Check must not create `Episode`, `Draft`, `AccountImpact`, or derived storage-jar summary changes.

### 4. Validation & Error Matrix

| Condition | Expected Result |
|---|---|
| User completes and taps "完成" | No persisted data. |
| User explicitly saves a non-checking action | One manual discovery point/action idea is saved. |
| User chooses "我还是想检查" and result is "我不想记录" | No persisted data; copy says it was not saved. |
| Storage save fails | Return/show honest failure copy and do not claim the pattern was saved. |

### 5. Good/Base/Bad Cases

- Good: user completes Signal Check, saves a 10-minute action, and sees it in `/topics` without storage-jar movement.
- Base: user completes Signal Check and closes it; no state changes.
- Bad: saving Signal Check writes an account impact, creates an episode, or interprets another person's silence/activity.

### 6. Tests Required

- Unit test `buildSignalCheckDiscoveryPointInput(...)` for non-checking and checking paths.
- Regression test that adding the resulting discovery point leaves `deriveAllAccountSummaries(...)` unchanged.
- Browser check for Home -> Signal Check -> save -> Topics, plus a no-save completion path.

### 7. Wrong vs Correct

#### Wrong

```ts
actions.saveQuickRecord({ facts: "想检查对方有没有回应", nextAction: "phone_down_10" });
```

#### Correct

```ts
const input = buildSignalCheckDiscoveryPointInput(signalCheckState);
actions.saveDiscoveryPoint(input);
```

## Scenario: Draft Self Check Saves Only Explicit User Choices

### 1. Scope / Trigger

- Trigger: `/draft-check` helps the user check whether a message draft is ready enough, should be softened, saved, turned into a private record, or paused with Return-To-Self.
- Scope: route-local `DraftCheck*` choices -> `buildDraftCheck*Input(...)` -> explicit `AppActions` calls.

### 2. Signatures

```ts
type DraftCheckSaveInput = {
  spaceId: string;
  spaceType: SpaceType;
  draftText: string;
  state: DraftCheckState;
  motivation: DraftCheckMotivation;
  noResponseTolerance: DraftNoResponseTolerance;
  contentRisk: DraftContentRisk;
  stance: DraftStance;
  afterSend: DraftAfterSend;
};

buildDraftCheckDiscoveryPointInput(input, recommendation): DiscoveryPointInput;
buildDraftCheckDraftInput(input): DraftInput;
buildDraftCheckPrivateRecordInput(input): QuickRecordInput;
```

### 3. Contracts

- Completing Draft Self Check without an explicit save is route-local only and must not persist data.
- Explicit recommendation/topic save creates exactly one `DiscoveryPoint` through `actions.saveDiscoveryPoint(...)`.
- Explicit draft save creates one `Draft` through `actions.saveDraft(...)`.
- Explicit private-record conversion may call `actions.saveQuickRecord(...)`, but the payload must avoid connection evidence, self-contact evidence, energy effect, owned next action, and interpretation-split fields unless a future PRD deliberately adds account movement.
- Draft Self Check must not rewrite the draft, optimize for a reply, predict the other person's reaction, include a send button, or inspect external apps.
- Draft Self Check saves must not create account impacts by default.

### 4. Validation & Error Matrix

| Condition | Expected Result |
|---|---|
| User completes and taps "完成" | No persisted data. |
| User taps "保存检查结果" / "保存轻一点方向" / "保存边界方向" / "放进稍后" | One `DiscoveryPoint` with `sourceType: "draft_check"`. |
| User taps "保存草稿" / "保存草稿不发" | One `Draft`; no account impacts. |
| User taps "转成私下记录" with non-empty draft | One `Episode`; no account impacts by default. |
| Storage save fails | Return/show honest failure copy and do not claim the item was saved. |

### 5. Good/Base/Bad Cases

- Good: user checks a draft, saves a boundary direction, and sees it in `/topics` without storage-jar movement.
- Base: user completes the check and closes it; no state changes.
- Bad: route saves a draft automatically, creates an account impact for checking, or adds a send/copy button that implies message delivery.

### 6. Tests Required

- Unit test deterministic recommendation rules and payload builders.
- Regression test that saved discovery points and private-record conversion do not change derived storage-jar summaries by default.
- Browser check Home -> Draft Self Check -> recommendation, save draft, save topic, private record conversion, Return-To-Self, and no-save finish.

## Scenario: Personal Action Menu Is Route-Local Until A Durable Model Exists

### 1. Scope / Trigger

- Trigger: `/experiments` or account detail surfaces let the user pick a small self-owned action for today.
- Scope: deterministic action recommendation helpers -> route-local selection/completion UI.

### 2. Signatures

```ts
type PersonalAction = {
  id: string;
  category: PersonalActionCategory;
  label: string;
  helper: string;
  completionMarker: string;
};

getPersonalActionSet(input: { market: DailyMarket; rotationIndex?: number }): PersonalActionSet;
getNextPersonalActionRotation(currentIndex: number): number;
```

### 3. Contracts

- Choosing a personal action is route-local only unless a future PRD introduces a durable `PersonalAction` / `PersonalExperiment` model.
- Completing a lightweight personal action in the menu must not call `AppActions`, persist `personalActions`, persist `experiments`, or create account impacts.
- The menu should show one recommended action and at most two alternatives to reduce choice load.
- Copy must avoid streaks, missed-day pressure, scores, due dates, relationship tests, or rewards that imply partner behavior.
- Completion copy can affirm a small self-owned action, but must not claim anything was saved unless a store action actually succeeded.

### 4. Validation & Error Matrix

| Condition | Expected Result |
|---|---|
| User opens `/experiments` | No persisted write. |
| User chooses an action | Route-local selected state only. |
| User taps "完成一点" | Route-local completion state only; no account impacts. |
| User rotates actions | Deterministic local selection changes; no persisted write. |

### 5. Good/Base/Bad Cases

- Good: user chooses "喝水或洗手", sees completion copy, and leaves without storage changes.
- Base: user taps "稍后" and returns home; no state changes.
- Bad: choosing an action creates a durable backlog item, streak, score, or Self impact without an explicit future contract.

### 6. Tests Required

- Unit test action-set size, deterministic rotation, and no derived storage-jar changes from helper use.
- Browser check `/experiments` choose/complete/rotate and 360px layout.

## Scenario: Rich Incoming Review Saves Selected Threads Only

### 1. Scope / Trigger

- Trigger: `/rich-incoming` helps the user receive a long, warm, vulnerable, or dense incoming message without turning every thread into an immediate reply obligation.
- Scope: route-local message-shape/thread/emotion/handling choices -> `buildRichIncomingDiscoveryPointInputs(...)` -> `actions.saveDiscoveryPoints(...)`.

### 2. Signatures

```ts
type RichIncomingInput = {
  spaceId: string;
  messageNote: string;
  shapes: RichIncomingShape[];
  selectedThreads: RichIncomingThread[];
  emotions: RichIncomingEmotion[];
  handlingByThread: Partial<Record<RichIncomingThread, RichIncomingHandling>>;
  direction: RichIncomingDirection;
};

buildRichIncomingDiscoveryPointInputs(input: RichIncomingInput): DiscoveryPointInput[];
saveDiscoveryPoints(input: DiscoveryPointInput[]): StoreWriteResult<DiscoveryPoint[]>;
```

### 3. Contracts

- Completing Rich Incoming Review without explicit save is route-local only and must not persist data.
- Explicit save creates one or more `DiscoveryPoint` records through a single `actions.saveDiscoveryPoints(...)` commit.
- Saved points use `sourceType: "rich_incoming"` and may use `sourceTitle: "收到很多内容"`.
- The route may show default handling choices, but save input must include those effective defaults so the persisted result matches the UI.
- More than three selected threads may be reduced to three active handling cards; overflow threads may be saved as later discovery points.
- Rich Incoming Review must not create `Episode`, `Draft`, `Anchor`, `AccountImpact`, or a durable review model by default.
- It must not parse/summarize the incoming text with AI, infer sender psychology, generate replies, optimize for response, or integrate send/copy behavior.

### 4. Validation & Error Matrix

| Condition | Expected Result |
|---|---|
| User completes and taps "完成" | No persisted data. |
| User taps "把发现点存进稍后" with no later threads | No persisted data; copy says there was nothing selected for later. |
| User taps "把发现点存进稍后" with later/overflow threads | One atomic write creates all selected discovery points. |
| Storage save fails | Return/show honest failure copy and do not claim the points were saved. |

### 5. Good/Base/Bad Cases

- Good: user selects five received threads, handles three active ones, saves later threads, and sees all saved points in `/topics` without storage-jar movement.
- Base: user completes the flow and leaves; no state changes.
- Bad: route loops `saveDiscoveryPoint(...)` for multiple points, causing later writes to overwrite earlier writes from the same render-state snapshot.

### 6. Tests Required

- Unit test active/overflow thread selection and discovery-point payload builders.
- Regression test that saved rich incoming discovery points leave derived storage-jar summaries unchanged.
- Browser check `/rich-incoming` direct route, Record entry, Return-To-Self completion entry, save-to-topics, no-save finish, and 360px layout.

## Scenario: Emotion Calibration Saves One Discovery Point Only

### 1. Scope / Trigger

- Trigger: `/emotion-calibration` lets the user reframe one strong emotion as a signal, protector, or care cue before choosing a wiser action.
- Scope: route-local emotion/signal/impulse/wise-action choices -> `buildEmotionCalibrationDiscoveryPointInput(...)` -> `actions.saveDiscoveryPoint(...)`.

### 2. Signatures

```ts
type EmotionCalibrationInput = {
  spaceId: string;
  emotion: CalibrationEmotion;
  signal: EmotionSignal;
  impulse: EmotionImpulse;
  wiseAction: WiseAction;
};

buildEmotionCalibrationDiscoveryPointInput(input: EmotionCalibrationInput): DiscoveryPointInput;
```

### 3. Contracts

- Completing Emotion Calibration without explicit save is route-local only and must not persist data.
- Explicit save creates exactly one `DiscoveryPoint` through `actions.saveDiscoveryPoint(...)`.
- Saved points use `sourceType: "manual"` unless a future durable emotion-calibration source model is added.
- Saved point theme is derived from the selected signal, such as `emotion`, `boundary`, `old_echo`, `self_care`, or `relationship_learning`.
- Emotion Calibration must not create `Episode`, `Draft`, `Anchor`, `AccountImpact`, or a durable calibration model by default.
- It must not diagnose trauma, attachment style, pathology, or the true source of an emotion; copy should frame emotion as allowed information and constrain only the emotion-driven action.

### 4. Validation & Error Matrix

| Condition | Expected Result |
|---|---|
| User completes and taps "完成" | No persisted data. |
| User taps "存为发现点" | One manual discovery point is saved. |
| User taps "存为发现点" again | Route copy says it was already saved; no duplicate write. |
| Storage save fails | Return/show honest failure copy and do not claim the point was saved. |

### 5. Good/Base/Bad Cases

- Good: user names fear, sees it as care/loss signal, notices a control impulse, chooses to name/allow it, and optionally saves one discovery point without storage-jar movement.
- Base: user completes the flow and leaves; no state changes.
- Bad: route claims to identify a childhood wound, creates account impacts for insight, or tells the user to control another person to reduce fear.

### 6. Tests Required

- Unit test summary copy and discovery-point payload builder.
- Regression test that adding the resulting discovery point leaves derived storage-jar summaries unchanged.
- Browser check `/emotion-calibration` direct route, Home entry, save-to-topics, no-save finish, and 360px layout.
