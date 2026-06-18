import { useEffect, useMemo, useRef, useState } from "react";
import { CompletionCard } from "../components/CompletionCard";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { accountReasonCopy } from "../copy/accounts";
import { buildQuickRecordImpacts } from "../domain/accounts";
import { selectActiveSpace } from "../domain/selectors";
import type {
  ActivationLevel,
  ConnectionLevel,
  EnergyEffect,
  QuickRecordDraftData,
  QuickRecordPrefill,
} from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type QuickRecordPageProps = {
  navigate: (route: AppRoute) => void;
};

type EmotionChip =
  | "焦虑/害怕"
  | "委屈/难过"
  | "羞耻/内疚"
  | "生气/怨"
  | "想念"
  | "被看见/很暖"
  | "混合"
  | "说不清";
type BodyChip =
  | "胸口紧"
  | "胃缩住"
  | "发热"
  | "想哭"
  | "手心紧"
  | "头很满"
  | "身体麻"
  | "没感觉"
  | "说不清";
type NextAction =
  | "delay_10_min"
  | "record_facts"
  | "save_later_topic"
  | "return_to_self"
  | "reply_one_point"
  | "no_extra_message"
  | "not_now"
  | "not_sure";

const emotionOptions: ChipOption<EmotionChip>[] = [
  { value: "焦虑/害怕", label: "焦虑/害怕" },
  { value: "委屈/难过", label: "委屈/难过" },
  { value: "羞耻/内疚", label: "羞耻/内疚" },
  { value: "生气/怨", label: "生气/怨" },
  { value: "想念", label: "想念" },
  { value: "被看见/很暖", label: "被看见/很暖" },
  { value: "混合", label: "混合" },
  { value: "说不清", label: "说不清" },
];

const bodyOptions: ChipOption<BodyChip>[] = [
  { value: "胸口紧", label: "胸口紧" },
  { value: "胃缩住", label: "胃缩住" },
  { value: "发热", label: "发热" },
  { value: "想哭", label: "想哭" },
  { value: "手心紧", label: "手心紧" },
  { value: "头很满", label: "头很满" },
  { value: "身体麻", label: "身体麻" },
  { value: "没感觉", label: "没感觉" },
  { value: "说不清", label: "说不清" },
];

const connectionOptions: ChipOption<string>[] = [
  { value: "0", label: "没有" },
  { value: "1", label: "很弱" },
  { value: "2", label: "有一点" },
  { value: "3", label: "比较明显" },
  { value: "4", label: "很强" },
  { value: "not_sure", label: "说不清" },
];

const activationOptions: ChipOption<string>[] = [
  { value: "0", label: "平稳" },
  { value: "1", label: "轻微" },
  { value: "2", label: "有波动" },
  { value: "3", label: "很强" },
  { value: "4", label: "快被卷走" },
  { value: "not_sure", label: "说不清" },
];

const nextActionOptions: ChipOption<NextAction>[] = [
  { value: "no_extra_message", label: "先不补发" },
  { value: "delay_10_min", label: "晚点再回" },
  { value: "save_later_topic", label: "保存一个话题" },
  { value: "return_to_self", label: "回到自己" },
  { value: "reply_one_point", label: "只回应一个点" },
  { value: "record_facts", label: "记录事实" },
  { value: "not_now", label: "暂时没有" },
  { value: "not_sure", label: "说不清" },
];

const energyOptions: ChipOption<EnergyEffect>[] = [
  { value: "lighter", label: "轻一点" },
  { value: "same", label: "差不多" },
  { value: "more_tired", label: "更重" },
  { value: "not_sure", label: "说不清" },
];

export function QuickRecordPage({ navigate }: QuickRecordPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const prefill = getQuickRecordPrefill();
  const initialDraft = useMemo(() => getLatestQuickRecordDraft(state.drafts, activeSpace?.id, prefill), [
    activeSpace?.id,
    prefill,
    state.drafts,
  ]);
  const [draftId, setDraftId] = useState<string | undefined>(initialDraft?.id);
  const [title, setTitle] = useState(initialDraft?.data.title ?? prefill?.title ?? "收到一段很暖的邮件");
  const [facts, setFacts] = useState(initialDraft?.data.facts ?? prefill?.facts ?? "");
  const [interpretation, setInterpretation] = useState(initialDraft?.data.interpretation ?? "");
  const [interpretationSkipped, setInterpretationSkipped] = useState(
    Boolean(initialDraft?.data.interpretationSkipped),
  );
  const [emotion, setEmotion] = useState<EmotionChip>(
    (initialDraft?.data.emotions?.[0] as EmotionChip | undefined) ??
      (prefill?.emotions?.[0] as EmotionChip | undefined) ??
      "说不清",
  );
  const [body, setBody] = useState<BodyChip>(
    (initialDraft?.data.bodySensations?.[0] as BodyChip | undefined) ??
      (prefill?.bodySensations?.[0] as BodyChip | undefined) ??
      "说不清",
  );
  const [connectionLevel, setConnectionLevel] = useState<string>(
    initialDraft?.data.connectionLevel === undefined ? "not_sure" : String(initialDraft.data.connectionLevel),
  );
  const [activationLevel, setActivationLevel] = useState<string>(
    initialDraft?.data.activationLevel === undefined
      ? prefill?.activationLevel === undefined
        ? "not_sure"
        : String(prefill.activationLevel)
      : String(initialDraft.data.activationLevel),
  );
  const [nextAction, setNextAction] = useState<NextAction>(
    normalizeNextAction(initialDraft?.data.nextAction ?? prefill?.nextAction),
  );
  const [connectionEvidence, setConnectionEvidence] = useState(initialDraft?.data.connectionEvidence ?? "");
  const [selfContactEvidence, setSelfContactEvidence] = useState(initialDraft?.data.selfContactEvidence ?? "");
  const [energyEffect, setEnergyEffect] = useState<EnergyEffect>(
    initialDraft?.data.energyEffect ?? "not_sure",
  );
  const [error, setError] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<string | null>(
    initialDraft ? "已恢复一条未完成记录。" : null,
  );
  const [savedTitle, setSavedTitle] = useState<string | null>(null);
  const didMountDraftEffect = useRef(false);
  const lastSavedDraftSignature = useRef(
    initialDraft ? getDraftSignature(initialDraft.spaceId, initialDraft.data) : "",
  );

  const modeCopy =
    prefill?.source === "trigger_support"
      ? {
          title: "存成一条快速记录",
          helper: "刚才看见的部分已经帮你带进来了，可以少填一点。",
        }
      : {
          title: "存下这次发生的事",
          helper: "先存事实和感受，不急着判定关系。",
        };

  const previewImpacts = useMemo(() => {
    if (!activeSpace || !facts.trim()) return [];

    return buildQuickRecordImpacts(
      {
        spaceId: activeSpace.id,
        spaceType: activeSpace.type,
        source: prefill?.source ?? "quick_record",
        facts,
        interpretation,
        interpretationSkipped,
        nextAction,
        connectionEvidence,
        selfContactEvidence,
        energyEffect,
      },
      { sourceId: "preview", createdAt: new Date(0).toISOString() },
    );
  }, [
    activeSpace,
    connectionEvidence,
    energyEffect,
    facts,
    interpretation,
    interpretationSkipped,
    nextAction,
    prefill?.source,
    selfContactEvidence,
  ]);

  const currentDraftData = useMemo<QuickRecordDraftData>(
    () => ({
      source: prefill?.source ?? "quick_record",
      title,
      facts,
      interpretation,
      interpretationSkipped,
      emotions: [emotion],
      bodySensations: [body],
      connectionLevel: parseLevel(connectionLevel) as ConnectionLevel,
      activationLevel: parseLevel(activationLevel) as ActivationLevel,
      nextAction,
      connectionEvidence,
      selfContactEvidence,
      energyEffect,
    }),
    [
      activationLevel,
      body,
      connectionEvidence,
      connectionLevel,
      emotion,
      energyEffect,
      facts,
      interpretation,
      interpretationSkipped,
      nextAction,
      prefill?.source,
      selfContactEvidence,
      title,
    ],
  );

  useEffect(() => {
    if (!didMountDraftEffect.current) {
      didMountDraftEffect.current = true;
      return;
    }

    if (!activeSpace || savedTitle || !hasMeaningfulDraftData(currentDraftData)) {
      return;
    }

    const signature = getDraftSignature(activeSpace.id, currentDraftData);
    if (lastSavedDraftSignature.current === signature) {
      return;
    }

    const timer = window.setTimeout(() => {
      const result = actions.saveDraft({
        draftId,
        spaceId: activeSpace.id,
        kind: "quick_record",
        data: currentDraftData,
      });

      if (result.ok) {
        setDraftId(result.value?.id);
        lastSavedDraftSignature.current = signature;
        setDraftStatus("已保存草稿，只保存在本地。");
        return;
      }

      setDraftStatus("草稿暂时没有保存成功。");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [actions, activeSpace, currentDraftData, draftId, savedTitle]);

  function save() {
    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      return;
    }

    if (!facts.trim()) {
      setError("至少存一个可确认的事实，哪怕很小。");
      return;
    }

    const result = actions.saveQuickRecord({
      spaceId: activeSpace.id,
      spaceType: activeSpace.type,
      draftId,
      source: prefill?.source ?? "quick_record",
      title,
      facts,
      interpretation,
      interpretationSkipped,
      emotions: [emotion],
      bodySensations: [body],
      connectionLevel: parseLevel(connectionLevel) as ConnectionLevel,
      activationLevel: parseLevel(activationLevel) as ActivationLevel,
      nextAction,
      connectionEvidence,
      selfContactEvidence,
      energyEffect,
    });

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      return;
    }

    setError(null);
    setSavedTitle(result.value?.title ?? title);
  }

  function saveDraftAndClose() {
    if (!activeSpace) {
      navigate("/home");
      return;
    }

    if (!hasMeaningfulDraftData(currentDraftData)) {
      navigate("/home");
      return;
    }

    const result = actions.saveDraft({
      draftId,
      spaceId: activeSpace.id,
      kind: "quick_record",
      data: currentDraftData,
    });

    if (!result.ok) {
      setError(result.error ?? "草稿暂时没有保存成功。");
      return;
    }

    lastSavedDraftSignature.current = getDraftSignature(activeSpace.id, currentDraftData);
    navigate("/home");
  }

  if (savedTitle) {
    return (
      <section className="quick-record-page page-stack">
        <CompletionCard
          title="已经存下"
          body="这次不用现在整理完。你之后可以回来慢慢看。"
          rows={[
            { label: "标题", value: savedTitle },
            { label: "事实", value: facts },
            { label: "下一步", value: getNextActionLabel(nextAction) },
          ]}
        >
          <button className="button button--primary" type="button" onClick={() => navigate("/home")}>
            回到首页
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => navigate("/accounts/self")}
          >
            打开明细
          </button>
          {parseLevel(activationLevel) === 3 || parseLevel(activationLevel) === 4 ? (
            <button
              className="button button--ghost"
              type="button"
              onClick={() => navigate("/return-to-self")}
            >
              继续回到自己
            </button>
          ) : null}
        </CompletionCard>
      </section>
    );
  }

  return (
    <section className="quick-record-page page-stack">
      <header className="quick-record-header">
        <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
          关闭
        </button>
        <h1>{modeCopy.title}</h1>
        <p>{modeCopy.helper}</p>
      </header>

      <section className="record-form">
        <label className="field">
          <span className="field-label">给这次一个短标题</span>
          <input
            className="field-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="field fact-field">
          <span className="field-label">可确认的事实</span>
          <span className="meta-text">摄像头能拍到的部分。</span>
          <textarea
            className="field-textarea"
            value={facts}
            onChange={(event) => setFacts(event.target.value)}
            rows={3}
            placeholder="例如：对方具体回应了我提到的勇气。"
          />
        </label>

        <label className="field interpretation-field">
          <span className="field-label">我脑中出现的解释</span>
          <span className="meta-text">解释可以被记录，但暂时不用当成事实。</span>
          <textarea
            className="field-textarea"
            value={interpretation}
            onChange={(event) => setInterpretation(event.target.value)}
            rows={3}
            placeholder="我猜它可能意味着..."
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={interpretationSkipped}
            onChange={(event) => setInterpretationSkipped(event.target.checked)}
          />
          <span>暂时不解释</span>
        </label>

        <ChipGroup label="情绪" options={emotionOptions} value={emotion} onChange={setEmotion} />
        <ChipGroup label="身体" options={bodyOptions} value={body} onChange={setBody} />

        <div className="split-controls">
          <ChipGroup
            label="连接感"
            options={connectionOptions}
            value={connectionLevel}
            onChange={setConnectionLevel}
            helper="连接感和激活可以同时很高。"
          />
          <ChipGroup
            label="激活程度"
            options={activationOptions}
            value={activationLevel}
            onChange={setActivationLevel}
            helper="激活程度不是关系结论。"
          />
        </div>

        {activeSpace?.type === "self" ? (
          <label className="field">
            <span className="field-label">和自己的真实接触证据</span>
            <input
              className="field-input"
              value={selfContactEvidence}
              onChange={(event) => setSelfContactEvidence(event.target.value)}
              placeholder="例如：我看见自己其实很害怕。"
            />
          </label>
        ) : (
          <label className="field">
            <span className="field-label">可观察的连接证据，可空着</span>
            <input
              className="field-input"
              value={connectionEvidence}
              onChange={(event) => setConnectionEvidence(event.target.value)}
              placeholder="例如：对方具体回应了我的勇气。"
            />
          </label>
        )}

        <ChipGroup
          label="下一步我能做什么"
          helper="选一个由我能完成的动作。"
          options={nextActionOptions}
          value={nextAction}
          onChange={setNextAction}
        />
        <ChipGroup
          label="这次对能量的影响"
          options={energyOptions}
          value={energyEffect}
          onChange={setEnergyEffect}
        />

        <section className="impact-preview" aria-label="账户影响预览">
          <h2>这次可能会存进哪里</h2>
          <PreviewRow
            label="连接"
            reason={
              previewImpacts.find((impact) => impact.account === "connection")?.reason ??
              accountReasonCopy.no_connection_evidence
            }
          />
          <PreviewRow
            label="自己"
            reason={
              previewImpacts.find((impact) => impact.account === "self")?.reason ??
              "暂时没有自己的影响。"
            }
          />
          <PreviewRow
            label="能量"
            reason={
              previewImpacts.find((impact) => impact.account === "energy")?.reason ??
              accountReasonCopy.energy_neutral
            }
          />
        </section>

        {draftStatus ? <p className="helper-text">{draftStatus}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}

        <div className="record-form__actions">
          <button className="button button--primary" type="button" onClick={save}>
            {status === "saving" ? "正在存下" : "存下"}
          </button>
          <button className="button button--ghost" type="button" onClick={saveDraftAndClose}>
            保存草稿，稍后
          </button>
        </div>
      </section>
    </section>
  );
}

function PreviewRow({ label, reason }: { label: string; reason: string }) {
  return (
    <div>
      <strong>{label}</strong>
      <span>{reason}</span>
    </div>
  );
}

function getQuickRecordPrefill(): QuickRecordPrefill | undefined {
  const routeState = window.history.state as { quickRecordPrefill?: QuickRecordPrefill } | null;
  return routeState?.quickRecordPrefill;
}

function getLatestQuickRecordDraft(
  drafts: Array<{ id: string; kind: "quick_record"; spaceId: string; data: QuickRecordDraftData; updatedAt: string }>,
  spaceId: string | undefined,
  prefill: QuickRecordPrefill | undefined,
) {
  if (!spaceId || prefill) {
    return undefined;
  }

  return drafts
    .filter((draft) => draft.kind === "quick_record" && draft.spaceId === spaceId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

function hasMeaningfulDraftData(data: QuickRecordDraftData): boolean {
  return Boolean(data.facts?.trim() || data.interpretation?.trim() || data.connectionEvidence?.trim() || data.selfContactEvidence?.trim());
}

function getDraftSignature(spaceId: string, data: QuickRecordDraftData): string {
  return JSON.stringify({ spaceId, data });
}

function normalizeNextAction(value: string | undefined): NextAction {
  return nextActionOptions.some((option) => option.value === value)
    ? (value as NextAction)
    : "delay_10_min";
}

function parseLevel(value: string): ConnectionLevel | ActivationLevel {
  return value === "not_sure" ? "not_sure" : (Number(value) as 0 | 1 | 2 | 3 | 4);
}

function getNextActionLabel(value: NextAction): string {
  return nextActionOptions.find((option) => option.value === value)?.label ?? "说不清";
}
