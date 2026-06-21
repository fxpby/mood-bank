# Mobile PWA Emotional Account App

## Goal

Build a mobile-first PWA that helps a person observe emotionally significant relationship interactions, separate facts from interpretations, track self-stability, and choose grounding actions. The MVP should act as a "relationship interaction observer + self-stabilization system", not a scorekeeper for judging who loves whom more.

## Implementation Start Here

For implementation, read these sections first:

1. `First Coding Pass Scope Lock` defines the exact P0-only implementation boundary.
2. `First Coding Pass Implementation Slices` defines the recommended P0-A through P0-E build order.
3. `P0 Route And Placeholder Matrix` defines which routes are real, which are honest placeholders, and which routes can write data.
4. `P0 Data Write Contract`, `P0 Local Storage And Migration Contract`, and `P0 Flow State Machine Contract` define the data and persistence rules.
5. `P0 UI Blueprint And Microcopy`, especially `P0 Visual Tokens And Component Contracts`, defines the mobile UI target.
6. `P0 Copy Tables For Implementation` defines the first copy tables under `src/copy/*`.
7. `P0 End-To-End Acceptance Script` and `First Release Acceptance Criteria` define the release gate.
8. `Technical Approach` defines the local-first architecture, route map, persistence shape, and testing strategy.
9. `Out of Scope` defines product and safety red lines.

The implementation priority is:

* Prove the P0 trigger-first loop before building deep reflection modules.
* Keep data local, deterministic, and inspectable.
* Make all account movement explainable through user-owned actions or recorded observable evidence.
* Treat P2 psychological material as compact optional branches in the first build, not as separate courses or primary tabs.
* Preserve the name/metaphor **情感储蓄罐** in user-facing copy while keeping technical model names clear and boring.

### P0 Developer Handoff Summary

Build a local-first mobile PWA that proves one loop:

1. User completes local-first setup.
2. Home opens with trigger-first actions and three storage-jar summaries.
3. User can use "回到自己" and save a full or partial practice.
4. User can use "我被触发了", choose an owned next action, and optionally save a Quick Record.
5. Saved records/practices persist across refresh and update derived Connection / Self / Energy summaries with visible reason copy.
6. User can reset/delete local data from Settings with confirmation.

P0 implementation order:

1. P0-A: app shell, tokens, setup, storage, minimal settings.
2. P0-B: domain model, defaults, derived account summaries, unit tests.
3. P0-C: Home and Return-To-Self vertical slice.
4. P0-D: Trigger flow and Quick Record vertical slice.
5. P0-E: edge states, mobile QA, P0 acceptance scripts.

P0 must not implement:

* AI analysis, chat import, backend sync, login, telemetry, or push.
* Signal Check, Draft Self-Check, Rich Incoming Review, Topics, Experiments, Personal Action Menu, or P2 branches as real flows.
* Account Detail beyond an honest placeholder if needed.
* Any score/verdict about the relationship, partner intent, attachment style, self-worth, safety, or lovability.
* Any reward-store, redemption, debt, "balance insufficient", or exchange-for-response mechanic.

The first useful release is complete when the P0 acceptance scripts pass on a narrow mobile viewport and storage failure states do not make false persistence claims.

## What I Already Know

* The source material is `docs/chatlog1.md` and `docs/chatlog2.md`, which contain historical AI conversations about relationship dynamics, attachment activation, self-soothing, DBT-style reflection, comment drafting, boundaries, and the emotional-account product idea.
* The user initially imagined a "bank / savings jar" metaphor with deposits, withdrawals, investment projects, relationship temperature, market exchange rates, wishlist rewards, and game-like mechanisms.
* The conversations later converged on a safer MVP: a single-user observation tool before any couple/shared-account experience.
* The product should record the user's experience, reactions, needs, boundaries, and next actions rather than cataloging or monitoring the other person's behavior.
* The app should avoid turning intimacy into performance, prediction, surveillance, or a transaction where points purchase another person's behavior.
* This repository currently has no application code. It contains Trellis config/specs plus `docs/chatlog1.md` and `docs/chatlog2.md`.
* Project specs exist but are still mostly placeholder documents. Relevant layer: frontend.

## Assumptions

* First release is a local-first mobile PWA for one user on one device.
* First release does not require login, cloud sync, AI analysis, push notifications, or backend services.
* Private relationship details from the chatlogs should inform product design but should not be copied into UI seed data, docs, or code comments.
* The target user may be emotionally activated while using the app, so copy, layout, and flows should reduce cognitive load and avoid judgmental language.

## Requirements

### Product Positioning

* The app helps users observe relationship interactions and return to themselves.
* It should emphasize "what happened, what I felt, what I inferred, what I can do next" over a single relationship balance.
* It should support mixed states: an interaction can be warm and activating, meaningful and inconclusive, connecting and energy-consuming.
* Recommended user-facing product name for implementation discussion: **情感储蓄罐**.
* Naming rationale:
  * "情感储蓄罐" feels warmer and more protective than "心账本" or "情感账户".
  * It keeps the useful saving metaphor without foregrounding audit, debt, settlement, or relationship scoring.
  * It fits the personal MVP because the user is collecting moments, agency, care, and self-support rather than balancing a mutual ledger.
* "情感账户" can remain an internal concept for account dimensions. Developer-facing model names can still use Account / Ledger where technically useful.
* The storage-jar metaphor should stay quiet and mature:
  * user-facing copy can use "存下", "打开罐子", "取一个支持自己的小动作", and "明细".
  * avoid "记账", "对账", "消费", "余额不足", "还债", or "兑换对方回应" in primary UI.
  * avoid making the visual design childish, toy-like, or reward-store-like.
* First UI copy should be Chinese-first. Internal type names and developer-facing docs can stay English.

### MVP Scope Boundary

* MVP should feel like a usable personal tool, not just a form demo.
* MVP should be trigger-first: the first experience should help users pause when they want to check ambiguous signals, over-explain, send a high-stakes draft, or spiral into rumination.
* MVP should include enough structure to change the user's loop from:
  * stimulus -> emotion -> guessing -> checking -> more rumination
  * into: stimulus -> fact record -> interpretation label -> emotion/body awareness -> account impact -> chosen action -> return to self
* MVP should not attempt to solve the relationship, interpret the other person's intention, or produce advice that sounds clinically authoritative.
* MVP should bias toward user-owned actions: rest, draft later, ground, name a need, preserve a topic, or hold a boundary.

### Mobile PWA Shell

* Provide a mobile-first installable PWA shell.
* The first screen should be the usable app experience, not a marketing landing page.
* The app should work locally in the browser, with persistence across refreshes.
* The UI should feel like a quiet personal tool: restrained, readable, private, and fast to use on a phone.
* Navigation should be simple enough for one-handed mobile use:
  * Home
  * Record
  * Topics
  * Experiments
  * Archive / Settings
* The home dashboard should be useful even with no data by showing today's market check-in, quick actions, and a gentle first-record prompt.

### First-Run Setup

* User sees a short privacy/local-first note before entering personal content.
* User creates or accepts one emotional space with:
  * display name
  * optional description / intention
  * optional space type: relationship with another person / relationship with myself
  * preferred default recording depth: quick or full
* Default example names should be generic and non-identifying.
* Setup should not ask the user to classify the other person's attachment style.

### Home Dashboard

* The dashboard should show:
  * active emotional space
  * today's emotional market
  * trigger-first emergency panel
  * connection and activation state
  * account cards
  * quick actions
  * latest episode
  * current experiment
  * one anchor sentence
* First-screen information hierarchy should be locked as:
  * Top status strip: active emotional space + today's emotional market.
  * Market note: one sentence that reduces conclusion-making pressure.
  * Main panel: trigger support actions.
  * Secondary action: record interaction.
  * Lower section: storage-jar/account summaries.
  * Below or after scroll: latest episode, active experiment, and anchor.
* The top status strip should be compact. Example: "某段关系 · 今天有点敏感".
* The market note should be practical and non-dramatic. Example: "今天不适合做重大结论，先存下事实。"
* Account cards should use short explanatory subtitles, not just numbers.
* The dashboard should avoid a large global "balance" or "health score".
* The first visible action area should prioritize trigger support over account review.
* Primary trigger actions:
  * 我被触发了
  * 想检查信号
  * 草稿自检
  * 回到自己
* "记录互动" should be available on Home, but as a secondary action below the trigger panel rather than one of the primary emergency buttons.
* Home should not add "收到长消息" as a primary emergency button in MVP. Rich incoming message review should be accessible from Record and lightly from Return-to-Self.
* The dashboard should include a low-pressure "today is not for major conclusions" style note when market state is tired, triggered, sleep-deprived, or high-expectation.
* Account cards should sit below the trigger panel so the app does not train the user to open it primarily to inspect scores.
* Account cards can show a subtle "明细" or "打开罐子" entry that opens account detail. This preserves the saving metaphor without making balances the home focus.
* Home storage-jar summaries should use qualitative copy rather than large numbers. Example:
  * Connection: "最近有被看见的时刻。"
  * Self: "今天需要少一点过度承担。"
  * Energy: "偏低，适合轻动作。"

### Emotional Space

* User can create or edit at least one emotional space with an anonymized name.
* An emotional space can represent:
  * a relationship with another person
  * the user's relationship with themself
* Default language should avoid exposing private real-world details. Example: "某段关系", "我和自己", "最近的我", "评论区", or user-provided nickname.
* The default first space can be "某段关系", but UI copy should clarify that it can mean "我和别人" or "我和自己".
* The emotional space is a container for interaction episodes, account state, topics, experiments, anchors, and personal actions.

### Interaction Episode Recording

* User can create an interaction episode card.
* Episode recording should support two depths:
  * Quick record: title, facts, emotions, connection/activation, next action.
  * Full record: all required fields below.
  * Rich incoming message review: for long, warm, emotionally dense incoming messages.
* Required episode fields:
  * title or short event label
  * verifiable facts
  * my interpretation / story
  * what this can mean now
  * what this cannot prove yet
  * emotions with optional intensity, confidence, and body cues
  * body sensations
  * next action
  * anchor sentence
* Optional episode fields:
  * happened at
  * location/context label
  * draft text or message reference
  * linked later topics
  * linked experiment
  * calm closure action taken
* Episode can be categorized by initiation and stage:
  * initiation examples: I shared, they shared, they replied, conflict repair, quiet daily interaction
  * stage examples: invitation, being seen, self-disclosure, resonance, boundary negotiation, care returned, calm closure, left open
* Episode outcome should support:
  * closer and calm
  * closer but activated
  * no closer but stable
  * uncertain and ruminating
  * depleted
  * needs repair
* Episode detail should always keep "can mean" and "cannot prove" close together so the user does not convert warmth, silence, or ambiguity into a future contract.

### Emotion Identification

* MVP should treat emotion identification as a core skill, not just a form field.
* The app should help users move from vague activation to:
  * broad emotion family
  * optional more precise emotion label
  * body signal
  * story / interpretation attached to the feeling
  * need, value, or action tendency
* The emotion picker should be two-step and lightweight:
  * Step 1: choose a broad family.
  * Step 2: optionally refine into a nearby word.
* The app should allow "not sure" and "mixed" because forced precision can increase shame or overthinking.
* Recommended copy:
  * "先粗略命名就够了。"
  * "如果愿意，再选一个更贴近的词。"
  * "我可能不是 X，而更像 Y。"
* MVP emotion families:
  * stress / overwhelm
  * anxiety / worry / fear
  * vulnerability / exposure
  * shame / guilt / embarrassment / humiliation
  * anger / resentment / contempt / disgust
  * sadness / grief / heartbreak / longing
  * disappointment / regret / discouragement / frustration
  * envy / jealousy / comparison
  * loneliness / disconnection / invisibility
  * belonging / connection / being seen
  * joy / happiness / calm / contentment / gratitude / relief
  * curiosity / confusion / awe / wonder
  * pride / humility / defensiveness
* The app should support common near-emotion distinctions:
  * anxiety vs excitement: similar body activation, different story and direction
  * stress vs overwhelm: pressure vs "I cannot function right now"
  * worry vs fear: future thought-chain vs present threat response
  * shame vs guilt: "I am bad" vs "I did something misaligned"
  * guilt vs responsibility boundary: useful repair signal vs over-carrying
  * anger vs hurt/fear/betrayal: anger may be a signal to inspect what is underneath
  * resentment vs boundary/need: "what do I need but have not asked for?"
  * envy vs jealousy: wanting what someone has vs fearing loss of an existing connection
  * sadness vs grief vs heartbreak: sadness as emotion, grief as loss process, heartbreak as love/connection loss
  * loneliness vs solitude: painful lack of meaningful connection vs restorative aloneness
  * fitting in vs belonging: changing self to be accepted vs being accepted as self
  * sympathy vs empathy: distance/pity vs feeling-with and understanding
  * joy vs happiness vs contentment: brief intense connection, broader pleasant state, enoughness
  * calm vs relief: regulated response vs tension leaving after threat passes
  * pride vs hubris: grounded pride in effort vs inflated self-protection
* Mixed emotions should be first-class:
  * moved and scared
  * warm and overwhelmed
  * happy and sad
  * connected and activated
  * relieved and disappointed
* Emotion labels should never become diagnosis, personality typing, or proof of relationship truth.
* Account impact:
  * accurate emotion naming can support Self +1 when it leads to fact separation or an owned next action
  * naming overwhelm can route toward Return-to-Self and Energy support
  * naming belonging, being seen, empathy, repair, or self-contact can support Connection only when there is real evidence in the episode
* Safety boundary:
  * if the user selects despair/hopelessness or writes self-harm content, the app should not continue ordinary reflection as if it is sufficient
  * the app should suggest immediate human/professional/crisis support without claiming to assess risk or provide treatment

### Emotion Calibration

* MVP should include emotion calibration after emotion identification in relevant moments.
* Emotion identification asks: "What is this feeling?"
* Emotion calibration asks: "How am I relating to this feeling?"
* The purpose is to help users see emotions as signals, messengers, or protective energy rather than enemies, commands, identities, or objective proof about the relationship.
* Fear should be the clearest seed pattern:
  * fear is not the enemy
  * fear may be telling me that something or someone matters
  * fear may be protecting attachment, safety, dignity, belonging, or self-trust
  * the risky part is suppressing fear, denying it, or turning it into control, anger, attack, checking, or self-abandonment
* Recommended prompts:
  * "这个情绪想保护什么？"
  * "它在提醒我，我很在乎什么？"
  * "它最害怕失去什么？"
  * "如果我不压下它，也不让它开车，我能选择什么？"
  * "这个情绪本身可以被允许；我需要约束的是被它驱动的动作。"
* Calibration should be especially available for:
  * fear -> controlling/checking/anger
  * sadness -> shutdown/self-abandonment
  * anger -> attack/contempt or boundary clarity
  * shame -> hiding/perfectionism/self-attack
  * guilt -> repair or over-responsibility
  * jealousy -> signal of care and fear of loss, not permission to monitor or control
  * loneliness -> need for meaningful connection, not proof of unlovability
  * vulnerability -> courage and exposure, not weakness
* The output should be one wise, loving, or self-respecting next action, not a positive reframe that erases the feeling.
* Account impact:
  * calibrating an emotion without suppressing it can support Self +1
  * choosing a wise action while fear/sadness/anger/shame is present can support Self +1 or +2
  * if calibration reduces overload or checking, Energy can be user-rated +1
  * calibration should not increase Connection unless the episode also records real self-contact or interpersonal contact
* Copy should avoid "negative emotion" as a primary label. Prefer "hard emotion", "protective signal", or the specific emotion name.

### Rich Incoming Message Review

* MVP should support a high-connection, high-density incoming message scenario: the user receives a long, warm, emotionally rich reply and feels moved, activated, responsible to respond well, or afraid of missing something.
* This should not be treated as an emergency only. It is a "warm but dense" review mode that helps the user receive the message without turning it into an obligation to answer everything immediately.
* Entry points:
  * primary: Record -> "收到一段很长/很暖/信息很多的话"
  * secondary: Return-to-Self -> "我收到很多内容，不知道怎么接"
* It should not be a primary Home emergency-panel button in MVP, because the scenario is often warm/dense rather than urgent/dangerous.
* User can break an incoming message into emotional threads:
  * being seen / being understood
  * explanation or clarification
  * vulnerability / self-disclosure
  * expression difficulty or communication buffer
  * rumination / insomnia / cognitive overload
  * perfectionism / procrastination / stuckness
  * values or meaning-making
  * self-care / mutual care
  * topics for later
* For each thread, user can mark:
  * received now
  * respond now
  * save for later
  * no response needed
* The review should ask:
  * What did I receive from this message?
  * Which parts genuinely need a reply now?
  * Which parts can safely become later topics?
  * What feeling or urge did this message activate in me?
  * Is this a mixed emotion, such as warm but overwhelmed, seen but scared, grateful but pressured, moved but tired?
  * What would be "enough" for one response?
  * Do I need to answer, advise, or simply show that I received it?
  * What is one thing I can reflect back before adding my own story?
* The flow should produce:
  * one episode summary
  * optional later topics
  * optional anchor sentence
  * optional draft-check entry if the user wants to respond
* This flow should strengthen Connection when there is real mutuality, Self when the user does not over-carry or over-answer, and Energy according to whether the message leaves the user nourished, depleted, or both.

### Dual-Axis State

* Show current interaction state using two dimensions:
  * connection level: distant, contact, understood, mutual exchange, deep disclosure
  * activation level: relaxed, lightly moved, excited, anxious activation, rumination overload
* The UI should communicate that high connection with high activation may still require rest and grounding.
* Suggested quadrant labels:
  * high connection + low activation: warm and sustainable
  * high connection + high activation: meaningful but needs landing
  * low connection + low activation: ordinary space
  * low connection + high activation: ambiguity is amplified
* The dashboard state should derive from the latest episode plus today's emotional market, but the user should be able to override it manually.

### Accounts

* MVP should use three account dimensions:
  * Connection account: real, observable connection and contact.
  * Self account: whether the user kept self-respect, boundaries, rhythm, and authenticity.
  * Energy account: whether the interaction charged or depleted the user.
* Account meaning should adapt to emotional space type:
  * Interpersonal space: Connection means observable mutuality, being seen, resonance, repair, or contact with another person.
  * Self-facing space: Connection means contact with one's own feelings, needs, body, values, rhythm, or present reality.
  * Self account remains about agency, boundaries, responsibility, and authenticity in both space types.
  * Energy account remains about cost, restoration, depletion, or charge in both space types.
* Safety should not be a separate MVP account. Represent safety through tags, daily emotional market, connection/activation state, trigger prompts, and "can mean / cannot prove" fields.
* Account changes should not collapse into one large "relationship score".
* The same episode can increase one account and decrease another.
* Account impacts should be lightweight and editable. Recommended MVP input:
  * -2 strongly drains / decreases
  * -1 slightly drains / decreases
  * 0 no clear effect
  * +1 slightly supports / increases
  * +2 strongly supports / increases
* Home account cards should show status summary + light trend + recent source, not large balances.
* Numeric balances can exist in account detail / ledger view.
* If numeric display is used, it should be framed as "recorded balance", "recent trend", or "current signal", not objective truth.
* The app should show the last few reasons behind account movement, so the user can see how scores were produced.
* Account detail should include:
  * current balance for the selected account
  * recent change, such as this week / last 7 records
  * recent sources and reasons
  * copy reminder: "余额是观察记录，不是关系裁判。"
  * future-use placeholder for personal action exchange / growth cards
* In the personal MVP, redemption is not an interpersonal transaction. The product model should not contain "redeem the other person's behavior" as a possible object; that belongs outside the personal version.
* "Redeem" means converting recorded self-support into a user-owned action, reminder, or growth marker. Examples:
  * Self account: boundary pass, draft-saved badge, "I chose one owned action" growth card, permission-to-not-over-answer card.
  * Energy account: rest ritual, five-senses grounding card, low-stimulation time, sleep-protection reminder.
  * Connection account: receive-warmth card, save-a-warm-memory ritual, appreciation note kept privately, later-topic bookmark.
* Personal rewards should activate or reinforce the user's own behavior:
  * self-care rewards
  * growth cards
  * personal rituals
  * reflection milestones
  * chosen next actions
* Personal rewards should never imply that enough points can obtain another person's response, affection, time, apology, certainty, or behavior.
* Rationale for three accounts:
  * The drama-triangle / empowerment work makes subjectivity and responsibility boundaries central.
  * A standalone safety account can unintentionally become a new externally driven score the user watches for certainty.
  * The Self account is the right place to reward empowerment shifts: Victim -> Creator, Rescuer -> Guide / 引导者, Persecutor -> Challenger.
  * Safety remains important, but in MVP it should appear as context and reflection rather than a top-level balance.
* The Self account is not a self-esteem, self-worth, or "am I good enough" score. It records owned action, responsibility boundaries, self-respect, and reduced self-attack.
* Boundary work belongs primarily to the Self account:
  * it clarifies what is mine and what is not mine
  * it supports saying no and receiving no without collapse or retaliation
  * it records user-owned limits and next actions, not attempts to control the other person

### Personal Action Menu

* MVP should include a lightweight personal action menu in Account Detail / Ledger and after selected completion moments such as Return-to-Self, experiment completion, or calm closure.
* The action menu is the MVP version of "redeeming" value, but it should feel like choosing one supportive next action, not shopping, optimizing, or spending points.
* The menu must account for choice difficulty:
  * show one recommended action first
  * show at most two alternative actions at the same level
  * include a one-tap "就这个" / "choose this one" action
  * include "换一个" for users who dislike the recommendation
  * include "稍后再说" so skipping does not feel like failure
* The app should not show a large grid, store, catalogue, or long reward list in MVP.
* The app should not require users to compare point costs across many rewards in MVP.
* Recommended MVP interaction:
  * Header copy: "把这一步换成一个照顾自己的小动作。"
  * Primary recommendation card: one action title, 1-line reason, estimated time, and source account.
  * Secondary row: two small alternatives.
  * Actions: "就这个", "换一个", "稍后".
  * After choosing: show a low-pressure completion control such as "完成了" and "先放着".
* Choosing an action and completing an action are separate states:
  * choosing means "I picked a supportive next action" and can be saved as intention / selected action.
  * completion means "I actually did it" and can create a small Self or Energy signal.
  * if the user chooses but does not complete, the app should not create a positive account impact by default.
  * if the user later completes it, the account impact reason should name the completed action, not the earlier choice.
* Recommendations should be deterministic and transparent:
  * If Self recently increased: suggest boundary, authenticity, draft-saving, or not-over-answering actions.
  * If Energy is low: suggest rest, sensory grounding, hydration, short walk, low-stimulation time, or sleep-protection actions.
  * If Connection increased with high activation: suggest receiving warmth, saving an anchor, moving threads to later topics, or stopping escalation.
  * If the daily market is sleep-deprived, triggered, or high-expectation: prefer low-cognitive-load actions over reflective writing.
  * If guilt, resentment, over-carrying, rescuing, or pressure to reply is selected: suggest a boundary clarity action before any outward message.
* Action examples by account:
  * Self: "今晚不补发解释", "把一个话题放进稍后", "写下什么是我的责任/什么不是", "保存草稿不发送", "给自己一句不攻击的话", "允许先做一个不完美的 2 分钟版本", "练习一个小小的拒绝", "不确定时先不答应".
  * Energy: "洗手或洗脸", "喝水", "走动 1 分钟", "今晚减少复盘", "做一个五感落地", "手放胸口慢慢呼气".
  * Connection: "保存一句我收到的温暖", "允许这次连接先到这里", "只回应一个最重要的点", "把其余内容放进稍后".
* Completing a personal action can create a small Self or Energy signal, but choosing alone should not. Personal actions should not change Connection unless they record a real relationship interaction.
* MVP should treat actions as "claim / choose / complete", not "spend / consume / lose balance". Full point-cost redemption can be revisited later after user testing.
* The action menu should reinforce agency:
  * good copy: "我选择一个能支持自己的小动作。"
  * avoid copy: "余额不足", "兑换对方回应", "再赚一点才能被爱".

### Deposit Type Tags

* Episode can be tagged with deposit or process types such as:
  * being seen
  * trust
  * vulnerability
  * resonance
  * rhythm
  * care returned
  * boundary held
  * boundary clarity
  * calm closure
  * self-return
  * self-compassion
  * self-appreciation
  * clarification
  * expression buffer
  * vulnerability shared
  * perfectionism named
  * self-care resonance
* Tags should be descriptive labels, not proof of future relationship outcomes.
* Tags can be positive, protective, or mixed. Example:
  * positive: being seen, trust, resonance
  * protective: boundary held, calm closure, self-return
  * mixed: warm but activating, meaningful but unfinished

### Fact vs Interpretation

* Every episode should separate:
  * facts
  * interpretations
  * current meaning
  * conclusions not yet supported
* The UI should nudge the user to avoid turning a warm interaction, silence, or ambiguous signal into a prediction about the future.
* Field prompts should be concrete:
  * Fact: "What could be verified without reading minds?"
  * Interpretation: "What story did my mind add?"
  * Current meaning: "What can I reasonably receive from this?"
  * Not proven yet: "What would be too much to conclude?"

### State Check / Trigger Triage

* MVP should include a lightweight state check that helps users identify whether they are responding to the present moment, an attachment/connection alarm, an old echo, an inner critic loop, boundary pressure, or body overload.
* This should be a routing layer, not a psychological assessment. The app should not ask "is this childhood trauma?" as a required diagnostic question.
* User-facing framing:
  * "我现在是在回应当下，还是有旧感觉被带起来？"
  * "这不是为了分析我哪里有问题，只是为了选对下一步。"
  * "说不清也可以，先选一个最安全的小动作。"
* Entry points:
  * after Fact + Body/Emotion in "我被触发了"
  * after Step 1 in "想检查信号" when the target is connection, rejection, or self-blame
  * before Draft Checker analysis when the draft is written from high activation, shame, urgency, or fear of losing connection
  * inside full episode review as an optional section
* The check should ask for momentary state, not identity, diagnosis, or history.
* Suggested quick choices:
  * "主要是当下这件事"
  * "连接警报响了"
  * "像旧感觉被碰到"
  * "内部审判者很响"
  * "边界/责任被压到了"
  * "身体已经过载"
  * "我说不清"
* Optional scale:
  * "这件事本身大概多大？我的反应大概多大？"
  * Choices: small / medium / big / not sure
  * Copy: "这只是主观感受，不是分析结果。"
* Routing rules:
  * present event + stable enough -> continue current flow
  * connection alarm -> connection-continuity check
  * old echo -> mosquito/elephant branch, without asking for trauma details
  * inner critic / shame -> self-compassion pause or critic rewrite
  * boundary / responsibility pressure -> boundary clarity check
  * body overload -> Return-to-Self before deeper reflection
  * not sure -> low-cognitive next action, such as water, five-senses grounding, or save draft
* This step should protect against over-processing:
  * If activation is high, the app should prefer grounding over reflection.
  * If the user chooses "not ready to look deeper", this is a valid completion.
  * If the content feels unsafe, dissociative, self-harm-related, violent, coercive, or professionally complex, the app should suggest outside support and not continue ordinary reflection as sufficient.
* Account impact:
  * completing state check can support Self +1 when it leads to a user-owned next action or an appropriate branch
  * Return-to-Self can affect Self/Energy according to existing rules
  * state check should not increase Connection unless there is real self-contact in a self-facing space or observable interpersonal contact in an episode

### Connection Continuity Check

* MVP should include a lightweight "connection continuity" check for moments when connection, care, or self-contact feels like it has disappeared under silence, ambiguity, distance, intensity, or conflict.
* This covers the product need behind object-constancy instability without making clinical claims or asking users to diagnose attachment style.
* User-facing copy should avoid "object constancy", "anxious attachment", "avoidant attachment", "fearful-avoidant", "disorganized", or "attachment disorder" as primary UI labels.
* Recommended user-facing language:
  * "连接感现在还在吗？"
  * "我现在还能记得什么？"
  * "此刻消失的是事实，还是我的连接感？"
  * "我和自己还接得上什么？"
* The check should appear only when relevant:
  * trigger flow after fact/body/urge if the urge involves checking, withdrawing, cutting off, sending again, deleting, rereading, or reassurance seeking
  * "想检查信号"
  * warm interaction landing with high activation
  * draft self-check when the user may send to restore certainty
  * full episode review as an optional section
  * self-facing emotional spaces when the user feels disconnected from self
* The check should ask the user to rate the current moment, not their personality:
  * "此刻连接感像是：还在 / 变远了 / 消失了 / 变危险了 / 我想切断 / 我一边想靠近一边想逃"
  * "我最想做的是：确认、追问、补发、撤回、装作不在乎、消失、攻击、照顾自己一下"
  * "现在有什么证据说明连接还曾经存在？"
  * "现在有什么不能证明连接已经消失？"
  * "我能先靠什么维持 10 分钟的稳定？"
* MVP can map answers to momentary patterns without naming them as attachment types:
  * alarm/checking: connection feels gone, urge is to verify or get reassurance
  * shutdown/deactivation: connection feels unsafe or irrelevant, urge is to numb, minimize, disappear, or cut off
  * push-pull: urge contains both approach and escape
  * self-disconnection: the user cannot feel body, needs, values, or present reality
* Output should be a short reflection and one owned next action, not a diagnosis:
  * "这是连接感变远的时刻，不一定是连接本身消失。"
  * "我可以先存下已经发生过的事实，再决定要不要行动。"
  * "我现在需要先和自己接上，再判断关系。"
* The check can suggest anchors from previous episodes, but anchors must be framed as memory support, not proof of future outcomes.
* Account impact:
  * noticing a continuity collapse can support Self +1 if the user records facts or chooses a stabilizing action
  * completing a grounding or return-to-self action can support Self/Energy according to Return-to-Self rules
  * it should not increase Connection unless the episode contains real connection/contact evidence
* The app should not generate an "attachment type", "object constancy score", or "connection permanence score" in MVP.

### Mosquito / Elephant, Old Echo, And Inner Critic Awareness

* MVP should help users notice that a trigger may include both present facts and an older emotional echo.
* The book `躲在蚊子后面的大象` adds a useful metaphor:
  * Mosquito: the small visible event that happened today.
  * Elephant: the larger touched need, old wound, protective program, or self/other image behind the reaction.
* MVP should support a lightweight "mosquito / elephant" split:
  * "蚊子：今天看得见的小事是什么？"
  * "大象：它碰到的更大东西可能是什么？"
  * "如果别人觉得这是小事，为什么它对我不是小事？"
  * "这件事背后哪个需要被碰到了？"
* This should be trauma-informed but not trauma-processing. The app should help users see patterns without pushing them to retrieve, relive, or explain childhood memories.
* The product should normalize disproportionate reactions as information: if the reaction feels larger than the visible event, the app helps look for the touched need rather than shame the user for being sensitive.
* User-facing language should be gentle and optional:
  * "这件事里，哪些是今天真的发生的？"
  * "哪些像是旧感觉被碰到了？"
  * "如果不用讲细节，这像哪一种熟悉的痛？"
  * "现在的体验里，今天的部分大概占多少？旧感觉大概占多少？"
  * "它可能在保护我不要再次经历什么？"
  * "现在的我能给那个旧感觉一点什么？"
* The app can support a simple "today / old echo" split, but should not claim a precise percentage. If percentage input is used, it should be framed as subjective felt proportion, not analysis.
* MVP should add basic-need chips for the "elephant" layer:
  * 安全感
  * 被看见
  * 被尊重
  * 自主
  * 边界
  * 公平
  * 归属
  * 被照顾
  * 稳定回应
  * 能力感
  * 休息
  * 好奇和自由
* MVP should add protective-program chips:
  * 检查/确认
  * 解释/证明
  * 指责/攻击
  * 退缩/消失
  * 讨好/顺从
  * 控制/安排
  * 麻木/切断
  * 拯救/过度承担
  * 追求完美
* Prompt: "这个旧保护程序短期在保护什么？长期会让我更靠近还是更远离需要？"
* The app should include an optional inner-critic check inspired by parts work / IFS, without claiming to provide IFS therapy:
  * "此刻有没有一个很严厉的声音在评价我？"
  * "它在说我哪里不够好、太多、太麻烦、太需要、太丢脸？"
  * "它可能想防止我经历什么羞耻或受伤？"
  * "我能不能先不跟它打架，只和它拉开一点距离？"
  * "如果由更稳的我来回应一句，会是什么？"
* Inner critic should be framed as a protective but harsh inner part, not as the user's true self or an enemy to destroy.
* This check should be available:
  * after trigger support if activation remains high
  * inside full episode review
  * inside self-facing emotional spaces
  * after draft self-check when shame, self-proving, or over-explaining is present
* Practice loop:
  * See the mosquito.
  * Name the elephant signal.
  * Separate present facts from old echo.
  * Identify the touched need.
  * Notice the inner critic or protective strategy.
  * Choose one small new response during the wave.
  * Mark completion later.
  * Save a repetition marker when a similar pattern is noticed again.
* MVP can include a lightweight "need tension" check inspired by the book's need/value quadrant, but not a full required worksheet:
  * Need A: the need most activated now.
  * Need B: another need that also matters.
  * Old ineffective expression.
  * One more balanced expression.
  * Example tensions: safety vs autonomy, respect from others vs self-respect, belonging vs independence, fairness vs flexibility, being cared for vs not over-carrying.
* Account impact:
  * noticing old echo or inner critic can support Self +1 when paired with fact separation, self-compassion, or an owned action.
  * completing a new response during the wave can support Self +1 or +2, and Energy according to felt effect.
  * the app should reward repeated noticing and practice, not only emotional relief.
* Safety boundaries:
  * do not ask for detailed trauma memories
  * do not suggest specific abuse, neglect, or family narratives
  * do not use "heal your trauma", "rewire your brain", or similar clinical promises
  * allow "not ready to look deeper" as a valid completion
  * suggest professional support if content feels overwhelming, unsafe, dissociative, or connected to self-harm

#### Old Echo / Mosquito-Elephant / Inner Critic Page-Level Flow

* This is an optional deeper-awareness flow for moments when the current reaction feels larger, older, more familiar, or more self-attacking than the visible event alone.
* It should appear only after basic stabilization or from user choice, not as the first emergency screen.
* Entry points:
  * trigger support after fact/body/urge when intensity is high
  * state check routes to old echo or inner critic
  * draft checker when shame, self-proving, over-explaining, or perfectionism is high
  * Return-to-Self completion when the user still feels an old pain
  * self-compassion pause
  * discovery point detail
  * full episode review
* The goal is repeated awareness and one new response, not trauma processing.
* Layout rules:
  * show a pacing reminder before starting
  * one small question per screen
  * every screen includes "现在不看这么深" and "先回到自己"
  * no requirement to write childhood details
  * no percentage result should be shown as analysis or truth
* Step 0: Pacing and safety gate
  * Title: "可以只看一点点"
  * Copy: "这里不是为了挖创伤，只是看看今天的小事有没有碰到熟悉的旧感觉。"
  * Chips:
    * "我愿意轻轻看一下"
    * "我现在只想回到自己"
    * "这太多了，先不看"
    * "我可能需要真人支持"
  * If "真人支持" is selected, route to outside-support copy.
* Step 1: Mosquito / visible event
  * Title: "蚊子：今天看得见的小事是什么？"
  * Helper copy: "只写可观察的，不读心。"
  * Input or chips:
    * "对方没回复"
    * "收到一段很长的话"
    * "一句话让我刺痛"
    * "我想补发解释"
    * "我被拒绝/被延迟"
    * "我没有做到"
    * "其他"
* Step 2: Today / old echo split
  * Title: "这是当下，还是旧感觉也被碰到了？"
  * Helper copy: "这是主观感受，不是诊断。"
  * Chips:
    * "主要是当下"
    * "当下和旧感觉都有"
    * "更像旧感觉"
    * "我说不清"
  * Optional felt proportion:
    * "今天更多"
    * "一半一半"
    * "旧感觉更多"
    * "不估了"
* Step 3: Elephant / touched need
  * Title: "大象：它可能碰到了什么需要？"
  * Chips:
    * "安全感"
    * "被看见"
    * "被尊重"
    * "自主"
    * "边界"
    * "公平"
    * "归属"
    * "被照顾"
    * "稳定回应"
    * "能力感"
    * "休息"
    * "好奇和自由"
    * "说不清"
  * Optional prompt:
    * "如果不用讲故事，它像哪一种熟悉的痛？"
* Step 4: Old protective program
  * Title: "旧保护程序想让我怎么做？"
  * Helper copy: "它可能曾经保护过我，但不一定适合现在。"
  * Chips:
    * "检查/确认"
    * "解释/证明"
    * "指责/攻击"
    * "退缩/消失"
    * "讨好/顺从"
    * "控制/安排"
    * "麻木/切断"
    * "拯救/过度承担"
    * "追求完美"
    * "说不清"
  * Reflection:
    * "它短期在保护什么？长期会让我更靠近还是更远离需要？"
* Step 5: Inner critic, optional
  * Title: "有没有一个很严厉的声音？"
  * Chips:
    * "我不够好"
    * "我太多了"
    * "我太需要了"
    * "我很麻烦"
    * "我很丢脸"
    * "我不值得被爱"
    * "我太蠢了"
    * "没有"
    * "不想看"
  * Optional prompts:
    * "它可能想防止我经历什么羞耻或受伤？"
    * "我能不能先不跟它打架，只和它拉开一点距离？"
* Step 6: Present-self response
  * Title: "现在的我能给它一点什么？"
  * Chips:
    * "一句不攻击自己的话"
    * "一个边界"
    * "10 分钟不检查"
    * "保存草稿"
    * "把发现点存起来"
    * "回到自己"
    * "自我关怀一下"
    * "找真人支持"
    * "创建小练习"
  * Prompt:
    * "我不需要一次修好旧感觉，只需要这次多一个选择。"
* Completion screen
  * Title: "这次先看见到这里"
  * Summary:
    * "今天的小事"
    * "可能碰到的需要"
    * "旧保护程序"
    * "严厉声音，若有"
    * "现在的一个新回应"
  * Actions:
    * "保存到记录"
    * "存为发现点"
    * "自我关怀一下"
    * "回到自己"
    * "创建小练习"
    * "完成"
* Account impact rules:
  * Completed mosquito / visible event:
    * Self +1 if paired with fact separation
  * Identified touched need or protective program:
    * Self +1
  * Noticed inner critic and chose distance or caring response:
    * Self +1
  * Chose one new response during the wave:
    * Self +1 or +2 depending on difficulty
    * Energy user-rated
  * Completed only "not ready to look deeper":
    * Self +1 if the user chooses Return-to-Self or another stabilizing action
  * No automatic Connection impact.
* MVP exclusions:
  * no trauma diagnosis
  * no childhood-source determination
  * no memory retrieval prompts
  * no parts therapy, unburdening, or inner-child healing claims
  * no neural rewiring claims
  * no percentage analysis or trauma score
  * no suggestion that disproportionate pain means the user is broken

### Self-Compassion Pause

* MVP should include a short self-compassion pause that can follow trigger support, inner-critic awareness, old-echo work, draft self-check, Return-to-Self, or any high-shame moment.
* The pause should use three components:
  * mindfulness / 静观: notice pain without over-identifying with it
  * common humanity / 共通人性: remember pain, need, shame, and imperfection are human
  * self-kindness / 善待自己: answer with warmth instead of attack
* Recommended 3-step copy:
  * "这很难。"
  * "痛苦、需要和不完美是人类经验的一部分。"
  * "此刻我能怎样对自己温柔一点？"
* The app should offer one short rewrite when inner critic is present:
  * Critic sentence: "我哪里太差/太多/太麻烦？"
  * Caring rewrite: "这句话如果既诚实又不伤害我，可以怎么说？"
  * Friend lens: "如果这是一个很关心我的朋友，会怎么说？"
* The app can offer conservative body-based soothing:
  * hand on chest
  * warm palm on arm
  * gentle self-hug
  * soften jaw / shoulders
  * slow exhale
* User-facing copy should not make biological claims such as "release oxytocin", "lower cortisol", or "rewire the brain".
* Self-compassion is not self-indulgence or avoiding accountability. The app should pair warmth with one responsible next action when relevant.
* Self-compassion should be especially available for shame, perfectionism, procrastination, fear of failure, post-conflict self-attack, and "I am too much / not enough" loops.
* The app should distinguish self-compassion from self-esteem chasing:
  * self-esteem asks "am I good enough compared with a standard?"
  * self-compassion asks "can I meet this hard moment without attacking myself?"
  * MVP should not add any self-worth, self-esteem, or attractiveness score.
* The app can support self-appreciation as the positive side of self-compassion:
  * "我刚刚有什么值得被我看见？"
  * "这一步里，我欣赏自己的哪一点？"
  * "我可以存下一点对自己的认可，不用把它变成比较。"
* Account impact:
  * noticing pain without attacking self can support Self +1
  * rewriting harsh self-talk into a caring but honest sentence can support Self +1
  * completing a soothing action can support Energy +1 if the user reports it helped
  * saving a grounded self-appreciation moment can support Self +1
  * in a self-facing emotional space, it can support Connection only when the user explicitly records contact with their own feeling, need, body, value, or present reality
  * the app should not require the user to feel better immediately

#### Self-Compassion Pause Page-Level Flow

* This is a short pause for shame, harsh self-talk, perfectionism, fear of failure, post-conflict self-attack, unfinished experiments, and moments when the user feels "too much" or "not enough".
* Entry points:
  * trigger support old-echo / inner-critic branch
  * draft checker when shame, self-proving, or over-explaining is present
  * Return-to-Self completion when the user still feels bad
  * personal experiment completion when result is partial / noticed only / not suitable
  * full episode review
  * self-facing emotional spaces
  * personal action menu
* The goal is to reduce self-attack enough to choose one responsible next action. It is not a positivity exercise, self-esteem rating, or accountability bypass.
* Layout rules:
  * one short screen per component
  * chip-first choices with optional text
  * user can choose "只读这一句" and complete without writing
  * "现在不想关怀自己" is valid and should not be punished
  * no long meditation timer in MVP
* Step 1: Mindfulness / 静观
  * Title: "先看见：这很难"
  * Helper copy: "不用把痛苦讲完整，只先承认它在。"
  * Chips:
    * "我现在很难受"
    * "我在羞耻"
    * "我在自责"
    * "我怕自己太多"
    * "我怕自己不够好"
    * "我在完美主义里卡住"
    * "我没做到，但我看见了"
    * "我现在说不清"
  * Optional text: "我现在看见的痛苦是..."
* Step 2: Common humanity / 共通人性
  * Title: "这不是只有我会有的时刻"
  * Helper copy: "痛苦、需要、不完美和失误，都是人类经验的一部分。"
  * Seed reminders:
    * "有需要不代表我很糟。"
    * "没做到一次，不等于我没有在练习。"
    * "羞耻会让我想躲起来，但它不是事实本身。"
    * "很多人在关系里都会害怕、笨拙、想证明自己。"
    * "我可以负责，但不用攻击自己。"
  * User can select one reminder or skip.
* Step 3: Inner critic rewrite, optional
  * Show when user selected shame, self-attack, not enough, too much, burdensome, foolish, unlovable, or inner critic in state check.
  * Title: "把严厉的话改成不伤害我的话"
  * Input: "严厉的声音在说..."
  * Rewrite helpers:
    * "如果这是一个很关心我的朋友，会怎么说？"
    * "这句话既诚实又不伤害我，可以怎么说？"
    * "它想保护我不经历什么？"
  * Output examples:
    * "我确实害怕没被接住，但我不用用攻击自己来证明认真。"
    * "我这次没做到，不等于我不能继续练习。"
    * "我可以承认我想要靠近，也慢一点行动。"
* Step 4: Self-kindness / 善待自己
  * Title: "此刻我能怎样对自己温柔一点？"
  * Chips:
    * "手放胸口"
    * "温热手掌贴手臂"
    * "轻轻抱住自己"
    * "放松下巴/肩膀"
    * "慢慢呼一口气"
    * "喝一口水"
    * "给自己一句不攻击的话"
    * "保存一点自我欣赏"
    * "先回到自己"
  * Copy boundary:
    * no biological claims
    * user can skip any body action that feels uncomfortable
* Step 5: Responsible next action
  * Title: "温柔之后，我负责的一小步是什么？"
  * Helper copy: "自我关怀不是逃避责任，是少一点攻击地行动。"
  * Chips:
    * "先不发送"
    * "保存草稿"
    * "道歉/修复前先稳定"
    * "只做一个小行动"
    * "把一个发现点存起来"
    * "回到边界清晰"
    * "回到自己"
    * "休息 10 分钟"
    * "什么都不做，先停止攻击自己"
* Completion screen
  * Title: "这一步先够了"
  * Summary:
    * "我看见的痛苦"
    * "我选择的提醒"
    * "我给自己的回应"
    * "我负责的一小步"
  * Actions:
    * "保存到记录"
    * "保存为锚点"
    * "存一个发现点"
    * "回到自己"
    * "完成"
* Account impact rules:
  * Noticed pain without self-attack:
    * Self +1
  * Rewrote inner critic into a caring but honest sentence:
    * Self +1
  * Completed a soothing action:
    * Energy +1/0/-1 based on felt effect
  * Saved non-comparative self-appreciation:
    * Self +1
  * Chose a responsible next action:
    * Self +1
  * Connection impact:
    * no interpersonal Connection impact by default
    * in self-facing spaces, Connection +1 only if the user explicitly records contact with their own feeling, body, need, value, or present reality
* MVP exclusions:
  * no self-compassion score
  * no self-esteem, self-worth, attractiveness, or lovability score
  * no biological claims
  * no long meditation course
  * no "forgive yourself and skip accountability" framing
  * no trauma treatment, parts therapy, or inner-child healing claims

### Boundary Clarity Check

* MVP should include a lightweight boundary clarity check for moments involving guilt, resentment, over-responsibility, rescuing, pressure to reply, fear of disappointing someone, or anger that may signal a crossed boundary.
* The check should be short and optional. It should not become a boundary course or multi-page worksheet.
* Recommended prompts:
  * "这件事里，什么是我的责任？"
  * "什么不是我的责任，但我正在背起来？"
  * "我真正能给出的是什么？"
  * "我需要说的一个清楚边界是什么？"
  * "如果对方失望，我能不能允许那是对方的感受？"
* The app should distinguish boundary from control:
  * boundary: "如果对话开始攻击，我先暂停并离开。"
  * control: "你必须用我想要的方式回应我。"
  * boundary: "我今晚不补发解释。"
  * control: "我要让对方马上消除我的不安。"
* Boundary forms can be represented as chips:
  * language: say no, ask, name a feeling
  * time: delay, pause, answer later
  * attention: stop checking, stop rereading
  * emotional distance: let the feeling cool before deciding
  * physical distance: leave a situation or take space
  * support: ask a safe person for perspective
  * consequence: state what the user will do if the pattern repeats
  * digital: no immediate reply, no nighttime checking, no extra message today
* Guilt and anger should be treated as information, not failure:
  * "这个内疚是在提醒我有爱，还是在逼我越过自己的界限？"
  * "这个愤怒可能在保护哪个边界？"
  * "我可以共情对方的失望，但不把它变成我的责任。"
* The app should support both saying no and receiving no:
  * "我可以拒绝，也可以继续关心。"
  * "对方可以拒绝，这不等于我不存在。"
  * "不确定时，我可以先不答应。"
* Consequences should be user-owned actions, not threats or punishment:
  * "如果我今晚还想补发解释，我先保存草稿到明天。"
  * "如果对话开始攻击，我先暂停并离开。"
  * "如果我想反复检查，我做一个 10 分钟非检查动作。"
* Digital boundaries should be available as personal actions because many trigger loops happen through phones, messages, social media, rereading, and response checking.
* Account impact:
  * identifying what is mine / not mine can support Self +1
  * completing a small boundary action can support Self +1 or +2 depending on difficulty
  * reducing checking or over-explaining can support Energy +1 if the user reports less depletion
  * boundary work should not increase Connection unless there is real self-contact in a self-facing space or observable mutual respect in an interpersonal episode
* Safety boundaries:
  * the app should not encourage users to confront unsafe people alone
  * if a boundary scenario includes violence, coercion, stalking, threats, or fear for physical safety, the app should suggest outside support and not proceed as ordinary relationship reflection
  * the app should not provide legal, emergency, or domestic violence planning advice in MVP

#### Boundary Clarity Page-Level Flow

* This is a short Self-account flow for clarifying responsibility, limits, and user-owned next actions.
* It should appear from trigger support, draft checker, full episode review, personal action menu, discovery point detail, repair/understanding check, and experiment creation.
* The goal is not to make the other person change. The goal is to help the user stop over-carrying, stop controlling, and choose one honest limit or request.
* Layout rules:
  * one question per screen
  * chip-first choices with optional short text
  * "现在说不清" and "先回到自己" are valid exits
  * no long boundary scripts in MVP
* Step 0: Safety and coercion boundary
  * Show when the user selects violence, threat, stalking, coercion, physical safety fear, or "我害怕拒绝会不安全".
  * Title: "这可能不是普通边界练习"
  * Copy: "如果拒绝可能带来现实危险，请优先联系可信任的人、专业支持或当地紧急服务。"
  * Actions:
    * "我先去找真人支持"
    * "继续做普通边界检查"
  * MVP should not ask for evidence, assess danger level, or provide legal/safety planning.
* Step 1: Boundary signal
  * Title: "是什么提醒我需要边界？"
  * Helper copy: "内疚、怨气、愤怒、压力，都可能是在提醒界限。"
  * Chips:
    * "内疚"
    * "怨气"
    * "愤怒"
    * "压力很大"
    * "害怕对方失望"
    * "害怕连接消失"
    * "想解释很多"
    * "想拯救/接住对方"
    * "想控制结果"
    * "不想答应但说不出口"
    * "对方说了不，我很难承受"
    * "说不清"
* Step 2: Responsibility split
  * Title: "什么是我的？什么不是我的？"
  * Two fields or chip groups:
    * Mine:
      * "我的感受"
      * "我的表达"
      * "我的选择"
      * "我的道歉/修复"
      * "我的时间和精力"
      * "我的真实限度"
    * Not mine:
      * "对方的感受"
      * "对方是否立刻理解"
      * "对方是否失望"
      * "对方的选择"
      * "对方要不要回应"
      * "关系结果"
  * Optional text prompts:
    * "我正在背起什么其实不完全属于我的东西？"
    * "我愿意负责哪一小部分？"
* Step 3: Real limit or request
  * Title: "我真实能给出的是什么？"
  * Helper copy: "边界不是冷漠，是把能给和不能给说清楚。"
  * Chips:
    * "我需要晚点回复"
    * "我不能现在接住全部"
    * "我只能回应一个重点"
    * "我需要先睡觉/休息"
    * "我不想继续这个语气"
    * "我需要对方说具体请求"
    * "我愿意修复，但不接受攻击"
    * "我现在不能答应"
    * "我可以关心，但不接管"
    * "我需要先想清楚"
  * Optional input: "我的一句真实限度 / 请求"
* Step 4: Boundary form
  * Title: "这更像哪一种边界？"
  * Chips:
    * "语言：说不/提出请求"
    * "时间：晚点回复/延迟决定"
    * "注意力：不反复检查/不重读"
    * "情绪距离：先冷却再决定"
    * "身体距离：离开现场/换个空间"
    * "支持：找真人支持"
    * "后果：我会采取的下一步"
    * "数字边界：不补发/不夜间检查"
* Step 5: Say no / receive no practice
  * Title: "这次更需要练习哪一边？"
  * Chips:
    * "我需要说不"
    * "我需要晚点答应"
    * "我需要少解释一点"
    * "我需要允许对方失望"
    * "我需要接住对方的 no"
    * "我需要不把 no 当成消失"
    * "我需要不反击/不讨好"
    * "说不清"
  * Copy:
    * "我可以拒绝，也可以继续关心。"
    * "对方可以拒绝，这不等于我不存在。"
* Step 6: User-owned consequence / next action
  * Title: "我负责的下一步是什么？"
  * Helper copy: "后果是我会做什么，不是威胁对方必须怎样。"
  * Chips:
    * "保存草稿到明天"
    * "今晚不补发"
    * "10 分钟不检查"
    * "只回应一个重点"
    * "暂停对话"
    * "离开让我失控的场景"
    * "找一个可信任的人聊"
    * "把话题放进稍后"
    * "进入草稿自检"
    * "回到自己"
    * "创建小练习"
* Completion screen
  * Title: "边界先清楚了一点"
  * Summary:
    * "我的部分"
    * "不是我的部分"
    * "真实限度 / 请求"
    * "我负责的下一步"
  * Actions:
    * "保存到记录"
    * "去草稿自检"
    * "创建小练习"
    * "回到自己"
    * "完成"
* Account impact rules:
  * Completed responsibility split:
    * Self +1 if user records both mine and not-mine
  * Chose a user-owned boundary or next action:
    * Self +1
    * Self +2 if user marks it as difficult
  * Chose a digital boundary and later completed it:
    * Self +1
    * Energy +1/0/-1 based on felt effect
  * Practiced receiving no without collapse, retaliation, or extra checking:
    * Self +1
  * Boundary flow should not create Connection impact by itself.
  * Connection can change only if a separate episode records observable mutual respect, repair, or contact.
* MVP exclusions:
  * no boundary score
  * no legal advice or safety planning
  * no "how to make them respect my boundary" tactics
  * no punishment, ultimatum, testing, surveillance, or manipulation scripts
  * no claim that a clear boundary guarantees connection
  * no pressure to repair when boundary, waiting, or outside support is wiser

### Healthy Love And Repair Literacy

* MVP should include a lightweight healthy-love literacy layer for interpersonal spaces and high-meaning self-facing reflections.
* This layer is based on a key product assumption: love and being loved are learned capacities, especially for users who did not grow up with reliable understanding, repair, emotional attunement, or healthy models of care.
* The app should not become a relationship course, "true love test", or relationship verdict engine. It should help the user practice one healthier response in the current moment.
* The app should gently challenge media-shaped or trauma-shaped love templates:
  * high tension is not necessarily deep love
  * loss of novelty is not automatically loss of love
  * conflict is not automatically incompatibility
  * ordinary care and repair are part of intimacy, not a downgrade from passion
  * being loved may feel unfamiliar or even activating when the user's old model of love was inconsistent, conditional, or emotionally neglectful
* Recommended entry points:
  * full episode review when the stage is conflict repair, boundary negotiation, care returned, quiet daily interaction, or left open
  * rich incoming message review when warmth creates pressure, fantasy, or fear
  * draft checker when the user wants to send from panic, control, self-proving, or repair impulse
  * trigger support after emotion calibration, boundary clarity, or empowerment shift
  * calm closure after a meaningful but unfinished interaction
* The check should be optional and short. It should not be required for quick record or urgent Return-to-Self.

#### Love Vs Attachment / Control / Novelty

* MVP should help the user distinguish love/care from attachment, control, and novelty-chasing without shaming the need underneath.
* Recommended prompts:
  * "这是爱，还是想抓紧来降低不安？"
  * "我想靠近，还是想让对方按我的方式存在？"
  * "我是在表达真实关心，还是在用行动换确定感？"
  * "我是在珍惜这段连接，还是只是在追逐新鲜感/高峰感？"
  * "这个动作会增加自由和理解，还是增加控制和压力？"
* Output should be one freedom-preserving action:
  * pause before sending another message
  * ask one honest question without pressure
  * name one boundary
  * receive warmth without escalating
  * let a topic wait
  * choose one self-care action while still caring
* This check can support Self +1 when the user chooses care without control, closeness without pressure, or pause without self-abandonment.
* It should not increase Connection unless the episode also contains real contact, repair, mutual understanding, or self-contact.

#### Relationship Phase Awareness

* MVP can include optional relationship-learning phase chips, but should not present them as fixed stages or a deterministic relationship model.
* Recommended phase chips:
  * attraction / resonance
  * disillusionment / mismatch noticing
  * self-reflection
  * repair / negotiation
  * integration / insight
  * ordinary care / maintenance
* Purpose:
  * help the user not treat first conflict, mismatch, or loss of novelty as automatic failure
  * help the user notice whether they are skipping self-reflection or repair and jumping straight to conclusion
  * help ordinary, steady care register as meaningful relationship data
  * help the user see that mature intimacy includes repair, patience, and repeated learning
* Copy should stay humble:
  * "这只是给这次互动找一个位置，不是给整段关系下结论。"
  * "幻灭不一定是结束，也可能是看见真实差异的开始。"
  * "平淡的照顾也可以被存下。"

#### Repair And Understanding Check

* Conflict-related episodes should offer a short repair/understanding check.
* The check should shift the goal from winning, proving, or diagnosing to understanding, responsibility, and next action.
* Recommended prompts:
  * "这次我想被理解的是什么？"
  * "我可能还没有理解对方的是什么？"
  * "我能为自己的哪一部分负责？"
  * "这里需要修复、边界、等待，还是先放进稍后？"
  * "如果目标不是赢，而是理解，下一句/下一步会有什么不同？"
* Repair should not mean self-abandonment, pressure to keep engaging, or ignoring harm. The app should always keep boundary and waiting as valid outcomes.
* Account impact:
  * Self can increase when the user takes responsibility without self-attack, attempts repair without control, or chooses a boundary without punishment.
  * Connection can increase only when there is observable mutual understanding, respectful repair, honest contact, or ordinary care.
  * Energy should capture whether repair work was nourishing, depleting, or mixed.

#### Care Literacy

* MVP should distinguish "I love / I care" from "I know how to care well".
* The app should support learning care preferences without turning them into demands.
* Recommended prompts:
  * "我希望被爱的方式是什么？"
  * "我能清楚表达一个偏好吗，而不是期待对方猜到？"
  * "我正在怎样学习照顾这段关系，而不失去自己？"
  * "这次我收到的关怀是什么？我还需要什么不能从这一次推出？"
* In self-facing spaces, care literacy can become:
  * "我现在怎样照顾自己，才不是逼自己表现更好？"
  * "我能给自己的关怀是什么，而不是等外界证明我值得？"
* This should connect to later topics, personal actions, and anchors rather than become a long care-language questionnaire in MVP.

#### Growth Signals Without Partner Scoring

* The app can let users mark episode-scoped growth signals, but should not score the other person or predict the future.
* Growth-signal chips:
  * honesty
  * kindness
  * willingness to understand
  * willingness to repair
  * respect for boundaries
  * accountability
  * non-control
  * mutual presence
  * ordinary care
* Recommended copy:
  * "这次互动里，有没有一个可观察的成长信号？"
  * "这只是这一刻的证据，不是未来保证。"
* The app should also allow "没有看见 / 说不清 / 现在不想评估" without penalty.

### Seeing And Being Seen Practice

* MVP should include a lightweight "seeing / being seen" practice for moments involving warmth, misunderstanding, repair, hard conversation, or a wish to respond well.
* This practice should extend existing Connection, Rich Incoming Message Review, Healthy Love, and Repair flows. It should not become a people-reading tool, personality test, or standalone Home primary action.
* Core distinction:
  * being seen: "What did I experience as received, understood, respected, or witnessed?"
  * seeing the other: "What can I do to understand more accurately without guessing, diagnosing, rescuing, or controlling?"
* Recommended prompts:
  * "这次我被看见了什么？"
  * "我还想更看见对方什么？"
  * "我是在理解，还是急着回应/证明/建议？"
  * "我可以先确认我听懂了，而不是马上解决。"
  * "我有没有用一个标签替代一个人？"
  * "我能不能承认：我现在只知道一部分？"
* The practice should keep "understanding" separate from agreement, approval, obligation, or future promise.
* The practice should support "I do not have capacity to listen more right now" as a valid outcome.

#### Listening And Question Micro-Actions

* When the user wants to respond, repair, or understand, the app can offer small "see better" action chips:
  * ask one open question
  * reflect back what I heard
  * name the feeling I think I heard and ask if it fits
  * ask for the story, not the conclusion
  * pause before giving advice
  * ask "然后呢？"
  * ask "这件事对你来说意味着什么？"
  * ask "我有没有听漏什么？"
* These can appear in draft checker, rich incoming message review, repair/understanding check, and personal action menu.
* The app should not force the user to interrogate the other person or keep a conversation going when rest, boundary, or waiting is wiser.

#### Two-Layer Hard Conversation Check

* Hard conversations should optionally distinguish:
  * content layer: what are we talking about?
  * undercurrent layer: what seems emotionally at stake?
  * respect check: is respect still present?
  * frame check: are we trying to win, defend, understand, repair, set a boundary, or pause?
  * next step: clarify, mirror, ask, repair, boundary, pause, or later topic
* This check should extend Repair And Understanding, not create a separate heavy workflow.
* The app should remind the user that understanding the undercurrent does not mean mind-reading or accepting disrespect.

#### Companioning Instead Of Fixing

* The app should help users distinguish advice-giving, rescuing, and over-carrying from quiet presence.
* Recommended prompts:
  * "这里需要建议，还是陪伴？"
  * "我能不能表达：我在，不急着让你变好？"
  * "对方是否需要回应，还是只需要被接住一点？"
  * "如果我没有能力接住，我能诚实表达自己的限度吗？"
* This is especially relevant for rich incoming messages, despair-heavy content, shame-heavy content, and moments where the user feels responsible to make the other person feel better.
* Safety boundary:
  * If the content suggests crisis, self-harm, violence, coercion, or professional-level need, the app should not frame companionship as sufficient.
  * It can suggest human/professional/crisis support without becoming a crisis workflow.
* Account impact:
  * Connection can increase when there is real being seen, being understood, respectful presence, mutual listening, or repair.
  * Self can increase when the user chooses humility, non-labeling, open questioning, reflective listening, boundary-aware presence, or pause instead of control.
  * Energy should reflect whether seeing/being-seen work was nourishing, depleting, or mixed.

### Empowerment Shift

* The MVP should include a lightweight way to notice when the user is drifting into a Karpman drama-triangle stance and move toward The Empowerment Dynamic (TED) stance:
  * Victim -> Creator
  * Rescuer -> Guide / 引导者
  * Persecutor -> Challenger
* This should be framed as "interaction stance" or "where am I standing now", not as a diagnosis or moral judgment.
* The app should not ask the user to label the other person as victim, rescuer, or persecutor in MVP.
* Episode and trigger flows can ask an optional self-check:
  * Am I feeling powerless and waiting for the other person to decide my state?
  * Am I trying to rescue, soothe, explain, or carry responsibility that is not mine?
  * Am I turning pain into accusation, control, or a demand that the other person must change?
* If a drama-triangle stance is selected, the app should offer an empowerment reframe:
  * Creator: "What is one next action I can choose?"
  * Guide / 引导者: "What question, boundary, or support can I offer without taking over?"
  * Challenger: "What truth or limit can I state clearly without attacking?"
* The empowerment shift should feed the Self account more than the Connection account. The product should reward regained agency and boundary clarity even when the relationship outcome remains uncertain.
* This mechanism should appear in high-activation flows such as "我被触发了", "想检查信号", "草稿自检", and full episode review.
* The copy should make room for real hurt: moving from Victim to Creator does not mean denying harm; it means finding the user's next owned choice.

### Daily Emotional Market

* User can set a daily state such as calm, tired, sensitive, sleep-deprived, triggered, fulfilled, lonely, high-expectation, or low-energy.
* The app shows a lightweight "market note" explaining how the user's current state may amplify ambiguous relationship signals.
* Market notes should bring control back to the user's state and choices, not rate the other person's warmth.
* Market notes should be deterministic copy in MVP. Example mappings:
  * sleep-deprived: "Today ambiguous signals may feel sharper. Record facts before conclusions."
  * triggered: "This is a high-sensitivity market. Delay checking loops when possible."
  * fulfilled: "You may have more room to reflect without forcing an answer."
  * high-expectation: "Warmth may be easy to turn into a future contract. Keep 'can mean' and 'cannot prove' separate."
* Market state can influence suggested prompts, but should not automatically rewrite episode scores without the user's visibility.

### Calm Closure

* After recording an episode, the app should offer a calm-closure action:
  * save the warmth
  * save one thing I appreciate about how I handled this
  * add a later topic
  * return to my life
  * record body state
  * do a five-senses grounding action
* Completion copy should reinforce that unfinished topics can remain safely unfinished.
* Calm closure should be available even when the episode is negative, uncertain, or unresolved.
* Example completion copy direction: "This record is enough for now. You can come back later without solving all of it tonight."

### Return To Self

* Return-to-Self should be the common landing path for high-activation flows: trigger support, signal-checking, draft self-check, rich incoming message review, and warm interaction landing.
* This flow should be DBT-informed but not presented as therapy or medical care.
* The design should draw from the local workbook's REST structure:
  * Relax -> body landing.
  * Evaluate -> fact + emotion/body awareness.
  * Set an intention -> owned next action.
  * Take action -> return-to-self completion or continue into a chosen flow.
* The flow should take roughly 3 minutes and contain three stages:
  * body landing
  * attention anchor
  * next real-life action
* Stage 1: body landing
  * Prompt: "先让身体有一个落点。"
  * Options:
    * drink water
    * wash hands / wash face
    * stand up and walk for 1 minute
    * look outside for 30 seconds
    * hold something soft
    * five-senses observation
    * paced breath
    * unclench jaw / relax shoulders
    * cold water on hands or face
    * hand on chest
    * warm palm on arm
    * gentle self-hug
  * User can mark one action as done or choose "not now".
  * Five-senses observation should be selectable by sense:
    * see: name 3 things in view
    * hear: name 2 sounds
    * smell: notice one scent or fresh air
    * taste: sip water/tea slowly
    * touch: notice fabric, table, cup, or feet on the floor
  * Physiological options should stay conservative in MVP:
    * offer slow breathing, cold water on hands/face, jaw/shoulder release, short walk, hand on chest, warm palm on arm, or gentle self-hug
    * avoid intense cold exposure, breath-holding instructions, or intense exercise guidance
    * avoid biological claims such as "this releases oxytocin" in primary UI
    * include copy that users can skip anything that feels unsafe or uncomfortable
* Stage 2: attention anchor
  * Prompt: "给注意力一个可以回来的句子。"
  * Options can include saved anchors and seed anchors.
  * Seed anchors:
    * "事实可以很小，结论可以慢一点。"
    * "我可以接收温暖，也不急着加码。"
    * "我不用一次接住全部。"
    * "我先回到自己，再决定下一步。"
    * "这不是现在必须解决完的事。"
    * "这很难，但我不需要再攻击自己。"
* Stage 3: next real-life action
  * Prompt: "接下来 10-30 分钟，我回到哪一件现实小事？"
  * Options:
    * eat something
    * shower
    * read / study
    * walk
    * make a drink
    * sleep
    * write personal content
    * tidy a small area
    * stop analyzing for now
* Return-to-Self should create a positive Self account signal when completed, even if the original relationship event remains unresolved.
* Return-to-Self should not shame users who cannot complete an action. The app can save "I noticed the need to return" as partial progress.
* Return-to-Self should not affect the Connection account. It is a user-owned stabilization action, not a relationship connection event.
* Return-to-Self account impact rules:
  * Noticed the need to return, but did not complete an action:
    * Self +1
    * Energy 0
    * Copy: "你已经看见自己需要停一下，这也是一步。"
  * Completed one body landing action:
    * Self +1
    * Energy +1
  * Completed body landing + anchor + next real-life action:
    * Self +2
    * Energy +1 or +2, chosen by the user based on felt effect
  * Completed the flow but still feels bad:
    * Self remains +1 or +2
    * Energy may be 0 or -1
    * Copy: "没有立刻变轻，不代表这一步无效。你没有继续加重它。"
* The account logic should reward owned action and responsibility boundaries, not immediate emotional relief.

### Later Topic Vault

* User can save topics that do not need to be addressed immediately.
* This vault should also hold "发现点 / 探寻点": small insights or questions that appear during one event and may be worth understanding later.
* Topic states:
  * stored for later
  * want to understand
  * want to share
  * leave for now
  * reviewed
  * naturally reached
  * no longer needed
* This feature exists to reduce perfectionism and the feeling that every interaction must be fully processed now.
* Topics can be created from an episode, rich incoming message review, draft checker, trigger support, calm-closure screen, Return-to-Self completion, or directly from the Topics tab.
* Topic list should not look like a task backlog with overdue pressure.
* No due date is required in MVP.
* Topics created from a rich incoming message should preserve source context and why it matters, but should not become obligations. Example later topics:
  * language switching as emotional buffer
  * insomnia and nighttime rumination
  * perfectionism and starting difficulty
  * learning to live in the present
  * self-care as a shared life task
* Batch capture:
  * after a dense event, user can quickly save multiple discovered points without writing full notes
  * default title can be short, such as "语言切换像缓冲", "失眠里的复盘", "完美主义让我停住"
  * each point can optionally keep source snippet, why it matters, and one question to explore later
  * if the user saves more than three points, the app should show "先存住，不需要现在分析完"
* Review entry:
  * Topics tab should show later topics and discovery points together, with filters for status, source, and type
  * Episode detail should show "这次看见的点"
  * Rich incoming message summary should show "已存入稍后的线索"
* Lightweight review prompts:
  * "我现在还想理解它吗？"
  * "它更像情绪线索、边界线索、旧感觉、关系学习、表达问题，还是行动实验？"
  * "它最近重复出现了吗？"
  * "我现在只需要存着，还是要选一个小动作？"
* Review boundaries:
  * Review should help the user notice patterns, not diagnose trauma, diagnose the other person, or produce relationship verdicts.
  * Review should not create overdue pressure, streak pressure, or "unprocessed debt".
  * Old discovery points can be marked "no longer needed" without explanation.

#### Topics / Discovery Points Page-Level Flow

* This is the home for saved later topics, discovery points, questions to explore, and small action ideas.
* The goal is retrieval and gentle review, not productivity tracking.
* Mobile layout rules:
  * first screen shows a compact header, filter chips, and a scrollable list
  * no calendar, deadline, overdue badge, or task-completion progress bar in MVP
  * list items should show source and theme before status pressure
  * empty state should invite one saved point, not a full organization system
* Topics tab header:
  * Title: "稍后再看"
  * Helper copy: "这里存放还不需要马上想完的点。"
  * Primary action: "存一个发现点"
  * Secondary action: "只看最近"
* Filter chips:
  * "全部"
  * "发现点"
  * "想理解"
  * "想分享"
  * "先放着"
  * "已回看"
  * "不用了"
  * Theme filters: "情绪", "边界", "旧感觉", "关系学习", "表达", "自我照顾", "行动实验"
* List item content:
  * title
  * kind chip: "话题" / "发现点" / "探寻问题" / "行动想法"
  * theme chip when present
  * source chip: "来自长消息" / "来自一次记录" / "来自草稿自检" / "来自触发" / "手动存入"
  * one-line note, source snippet, or explore question
  * status copy:
    * stored_for_later -> "先存着"
    * want_to_understand -> "想理解"
    * want_to_share -> "想分享"
    * leave_for_now -> "先放着"
    * reviewed -> "看过一次"
    * naturally_reached -> "自然聊到了"
    * no_longer_needed -> "不用了"
* Batch capture entry:
  * Appears after rich incoming message review, full episode save, trigger support, draft checker, and calm closure.
  * Title: "这次看见了哪些点？"
  * Helper copy: "先存标题就够了，不用现在分析完。"
  * User can add 1-8 discovery rows.
  * Each row has:
    * title
    * optional source snippet
    * optional theme
    * optional explore question
  * If user adds more than three rows, show supportive copy:
    * "先存住就好，之后可以慢慢看。"
  * Completion copy:
    * "已存入稍后，不会变成待办。"
* Discovery point detail:
  * Title is editable.
  * Sections:
    * "来自哪里": source event/thread link and optional source snippet
    * "为什么当时重要": why-it-matters note
    * "我想探寻的问题": explore question
    * "主题": one theme chip
    * "回看记录": review notes
  * Primary action should change by status:
    * stored_for_later -> "回看一下"
    * want_to_understand -> "加一条理解"
    * want_to_share -> "去草稿自检"
    * leave_for_now -> "继续先放着"
    * reviewed -> "再记一点"
  * Secondary actions:
    * "打开来源记录"
    * "转成小行动"
    * "转成实验想法"
    * "标记不用了"
* Lightweight review screen:
  * Title: "现在只看一点点"
  * Prompts:
    * "现在我还想理解它吗？"
    * "它最近有没有重复出现？"
    * "它更像哪类线索？"
    * "下一步是继续存着、记一点理解，还是转成小行动？"
  * Outcomes:
    * add review note
    * update theme
    * mark reviewed
    * leave for now
    * convert to action idea
    * convert to experiment idea
    * no longer needed
* Source episode integration:
  * Episode detail should show a section "这次看见的点".
  * Each linked topic opens the detail page.
  * If the source record is deleted, linked topics should keep their text but show "来源记录已删除".
* Account impact rules:
  * Saving discovery points:
    * no account impact by default
    * optional Self +1 only when the user explicitly marks "这帮我先放下了"
  * Reviewing without solving:
    * Self +1 if user adds a review note, marks leave for now, or marks no longer needed without self-attack
  * Converting to a personal action or experiment:
    * no immediate account impact
    * follows personal action / experiment completion rules later
  * No Connection impact from saved discovery points unless a separate episode records observable connection evidence.
* MVP exclusions:
  * no due dates or reminders for discovery points
  * no streaks or completion rates
  * no automatic clustering or AI pattern analysis
  * no trauma-source inference
  * no partner dossier or repeated-behavior accusation board
  * no "unprocessed backlog" language

### Personal Relationship Experiments

* User can create small self-facing experiments, such as:
  * do not answer every thread at once
  * land calmly after a warm interaction
  * receive care without immediately over-giving
  * delay checking ambiguous signals
  * draft before sending
* Experiment fields:
  * name
  * intention
  * completion criteria
  * reward / growth marker
  * status
* Rewards should celebrate user growth and behavior activation, not imply that the other person owes a response.
* In personal mode, an experiment reward is a self-owned completion marker or next-action cue. Example: completing "Draft Before Sending" can unlock "今晚不补发解释" or "把一个话题放进稍后", not "换来对方回应".
* Experiment statuses:
  * idea
  * active
  * completed
  * paused
  * retired
* Recommended first seed experiments:
  * Warm Interaction Landing: after a meaningful interaction, do not add a new message just to prolong it.
  * Signal Checking Delay: when wanting to check ambiguous signals, wait 10 minutes and record the urge first.
  * Draft Before Sending: save a high-stakes draft before deciding whether to send.
  * Receive Care: when care is offered, acknowledge receiving it before returning to care-taking.
  * Find My Elephant: choose one recurring mosquito, identify the touched need and old protective program, then practice one new response when it appears again.
  * Small No Practice: choose one low-risk moment to say no, delay, or not answer immediately, then record what happened inside.
  * Conflict As Understanding: after a conflict or mismatch, record one thing I want understood and one thing I may not yet understand.
  * How Can I Love Better: choose one low-pressure way to ask or reflect on how to care better, without turning it into self-blame or performance.
  * Love Without Control: when activated, choose one action that preserves both care and freedom.
  * Repair Before Conclusion: before deciding "this is doomed", check facts, expectation, repair possibility, and boundary need.
  * Ordinary Care Counts: intentionally save one small, steady care moment that is not dramatic or novel.
  * Reflect Before Reply: before answering a dense or vulnerable message, reflect back one thing I heard without adding advice.
  * Ask One Better Question: replace one assumption or analysis with one open, respectful question.

#### Personal Experiment Page-Level Flow

* Experiments are low-risk intentional practices, not productivity tasks or relationship tests.
* The goal is repeated awareness and one different action in real moments.
* Experiments can start from:
  * Experiments tab
  * a discovery point detail
  * personal action menu
  * trigger support completion
  * rich incoming message review
  * draft checker
  * boundary clarity check
  * Return-to-Self completion
* Mobile layout rules:
  * active experiment card should be compact enough for Home
  * creation should fit in 3 short steps
  * completion reflection should be possible in under 60 seconds
  * no daily streaks, perfect-score rings, or missed-day penalties
* Experiments tab:
  * Title: "小练习"
  * Helper copy: "用一个很小的动作，练习新的关系方式。"
  * Sections:
    * "正在练习"
    * "想法"
    * "完成过"
    * "暂停/退休"
  * Primary action: "新建小练习"
  * Secondary entry: "从发现点生成"
* Experiment creation Step 1: Choose focus
  * Title: "我想练习哪一种新反应？"
  * Chips:
    * "收到温暖后不加码"
    * "不急着检查信号"
    * "先存草稿再决定"
    * "只回应一个重点"
    * "把话题放进稍后"
    * "表达一个小边界"
    * "收到照顾前先承认我收到了"
    * "问一个更好的问题"
    * "先回到自己"
    * "自定义"
* Experiment creation Step 2: Define the tiny action
  * Title: "这次练习具体做什么？"
  * Inputs:
    * name
    * intention
    * trigger situation: "什么时候想起它"
    * one tiny action
  * Helper copy: "越小越好，小到你在高浪里也可能做得到。"
* Experiment creation Step 3: Completion marker
  * Title: "怎样算练习过一次？"
  * Chips:
    * "我停了 10 分钟"
    * "我没有补发"
    * "我只回应一个点"
    * "我保存了草稿"
    * "我说了一个限度"
    * "我把一个点放进稍后"
    * "我做了一个落地动作"
    * "我问了一个问题"
    * "自定义"
  * Optional reward/growth marker:
    * "我选择了一个属于自己的动作。"
    * "我没有让焦虑替我决定。"
    * "我练习了照顾，而不是控制。"
  * Actions:
    * "开始练习"
    * "先存为想法"
* Active experiment card:
  * Shows name, intention, tiny action, and one button "记录一次".
  * Secondary actions:
    * "先暂停"
    * "编辑"
    * "退休"
  * Home should show at most one active experiment card, preferably the most recent or pinned one.
* Completion reflection:
  * Title: "这次练习发生了什么？"
  * Quick chips:
    * "做到了"
    * "做到一部分"
    * "没做到，但我看见了"
    * "这次不适合"
  * Optional prompts:
    * "我做了哪个小动作？"
    * "身体/能量感觉怎样？"
    * "我学到什么？"
    * "下一次要更小一点吗？"
  * Completion actions:
    * "保存这次练习"
    * "转成发现点"
    * "回到自己"
* Account impact rules:
  * Experiment created:
    * no account impact by default
  * User records "没做到，但我看见了":
    * Self +1 only if user chooses "把看见也存下"
    * no negative impact
  * User completes or partially completes one tiny action:
    * Self +1 for agency, boundary, non-control, reduced self-attack, or seeing practice
    * Energy +1/0/-1 based on felt effect
  * User completes a grounding/rest action:
    * Self +1
    * Energy user-rated
  * User completes a real interpersonal repair/listening action:
    * Self +1
    * Connection only if a separate episode records observable mutual contact
  * Pausing or retiring an experiment:
    * no negative impact
    * optional Self +1 if the user records a boundary-aware reason such as "现在不适合"
* MVP exclusions:
  * no streaks
  * no missed-day penalties
  * no public sharing
  * no "relationship challenge" framing
  * no claim that an experiment will change the other person
  * no using experiment completion to predict relationship outcome

### Trigger Support Flows

* Include quick actions for common activated states:
  * I was triggered
  * I want to check for signals
  * I want to draft a message/comment
  * I miss them
  * I need to return to myself
* These flows should slow the loop from stimulus to checking/rumination by asking for facts, feelings, likely consequences, and one self-supporting action.
* The 4-step trigger support flow is the urgent version of REST:
  * Relax: pause and name one body signal.
  * Evaluate: name one fact and one emotion.
  * Set an intention: identify the urge and the desired direction.
  * Take action: choose one owned next action.
* Trigger support should use a short 4-step flow. It should be possible to complete without creating a full episode.
* Step 1: Fact
  * Prompt: "发生了什么可确认的事？"
  * Input can be a one-line text field or quick chips.
  * Examples: "收到一封长邮件", "看到没有回复", "我想去检查动态", "我想补发解释".
* Step 2: Body / emotion
  * Prompt: "我现在身体和情绪是什么？"
  * User can select emotions/body signals and optional intensity.
  * Examples: chest tightness, heat, urge to cry, happy, anxious, sour, moved, ashamed, angry.
  * User can optionally separate:
    * broad emotion family
    * emotion label
    * intensity
    * confidence / not sure
    * body location
    * thought/story attached to the emotion
  * If the user is unsure, the app can offer near-emotion nudges:
    * "更像焦虑，还是兴奋？"
    * "更像羞耻，还是内疚？"
    * "更像愤怒，还是受伤？"
    * "更像孤独，还是需要独处？"
  * The user can select "混合" or "说不清" and continue without penalty.
  * Optional calibration prompt after naming an emotion:
    * "这个情绪想保护什么？"
    * "它在提醒我，我很在乎什么？"
    * "我可以允许这个情绪存在，同时不让它替我决定动作。"
* Step 3: Urge
  * Prompt: "我现在最想做什么？"
  * Examples: reply immediately, check signals, reread repeatedly, add another message, explain myself, withdraw, ask for reassurance.
* Conditional connection-continuity check:
  * Show only when the urge suggests checking, reassurance seeking, withdrawal, cutting off, deleting, rereading, sending again, or push-pull.
  * Prompt: "此刻消失的是事实，还是我的连接感？"
  * Quick choices:
    * "连接还在，只是变远了。"
    * "我感觉它消失了。"
    * "我想马上确认。"
    * "我想切断/装作不在乎。"
    * "我一边想靠近一边想逃。"
  * Follow-up: "有什么事实能说明连接曾经存在？有什么还不能证明它已经消失？"
* Optional mosquito / elephant / inner-critic check:
  * Show after body/emotion + urge when intensity is high, shame is selected, the user reports disproportionate pain, or the user chooses to look deeper.
  * Prompt: "蚊子是什么？大象可能是什么？"
  * Follow-up: "这件事里，哪些是今天的，哪些像是旧感觉被碰到了？"
  * Quick choices:
    * "主要是今天的事。"
    * "有一点旧感觉。"
    * "旧感觉很强。"
    * "我现在不想看这么深。"
  * Need prompt: "这件事背后哪个需要被碰到了？"
  * Protective-program prompt: "我的旧保护程序想让我怎么做？"
  * Optional inner critic prompt: "此刻有没有一个很严厉的声音在评价我？"
  * This branch should end with either Return-to-Self, one gentle sentence to self, or "not ready to look deeper"; it should not ask for trauma details.
* Optional boundary clarity check:
  * Show when the urge involves rescuing, over-explaining, pleasing, resentment, guilt, anger, pressure to reply, or fear that saying no will destroy connection.
  * Prompt: "这件事里，什么是我的责任，什么不是我的责任？"
  * Follow-up: "我能给出的一个真实限度是什么？"
  * This branch should end with one boundary form and one owned next action.
* Step 4: Owned next action
  * Prompt: "我选择一个能把我带回自己的下一步。"
  * Examples: delay 10 minutes, save a draft, record facts first, move topics to later, five-senses grounding, drink water, close the app, create a quick episode.
* TED empowerment shift should be conditional, not mandatory:
  * If the urge indicates helpless waiting, show Creator prompt: "我仍然能选择的一件小事是？"
  * If the urge indicates rescuing/over-carrying, show Guide / 引导者 prompt: "什么是我的责任，什么该留给对方？"
  * If the urge indicates accusation/control, show Challenger prompt: "我能清楚表达的事实或边界是什么？"
* The flow should end with one of three outcomes:
  * close after choosing an action
  * save as a quick episode
  * continue into full record / draft checker / rich incoming message review
* High-activation trigger completions should offer Return-to-Self as the preferred final action.
* "I want to check for signals" flow should ask:
  * What am I hoping to find?
  * What will I do if the signal feels good?
  * What will I do if it feels bad?
  * Is there one non-checking action that can support me for 10 minutes?
* The flow may offer choices:
  * delay 10 minutes
  * record facts first
  * do five-senses grounding
  * continue anyway and record the result
* The app should not shame the user if they continue checking. It should make the pattern visible.
* Trigger flows should include an optional empowerment shift when relevant:
  * powerless -> one choice I still have
  * rescuing -> what is mine / what is theirs
  * blaming -> clear boundary or request

#### "我被触发了" Page-Level Flow

* This is the primary urgent path from Home. It should be optimized for one-handed mobile use, low reading load, and completion in 60-120 seconds.
* The flow should not require a full episode. It can save a quick trigger record if the user chooses.
* Layout rules:
  * one question per screen
  * one primary action at the bottom
  * chips before text input
  * "跳过" or "说不清" where precision may increase shame or rumination
  * progress copy should be soft, such as "1/4 先抓住事实"
  * avoid large text blocks, explanations, or educational copy while the user is activated
* Persistent mini-reminder across the flow:
  * "先不用下结论。"
  * "我只需要找到下一步。"
* Step 0: entry state
  * Home button label: "我被触发了"
  * Landing title: "先停一下"
  * Landing copy: "不用现在解决整件事。先抓住一个事实、一个感觉、一个下一步。"
  * Primary action: "开始 1 分钟急救"
  * Secondary action: "直接回到自己"
* Step 1: Fact
  * Title: "发生了什么可确认的事？"
  * Helper copy: "只写摄像头能拍到的部分，不读心。"
  * Chips:
    * "没有回复"
    * "收到一段长消息"
    * "看到一个动态/信号"
    * "我想补发解释"
    * "发生了争执"
    * "我突然很想确认"
    * "说不清"
  * Optional text input placeholder: "例如：我看到消息还没回。"
  * Primary action: "下一步"
* Step 2: Body / Emotion
  * Title: "现在身体和情绪是什么？"
  * Helper copy: "粗略命名就够了。"
  * Body chips:
    * "胸口紧"
    * "胃缩住"
    * "发热"
    * "想哭"
    * "手心紧"
    * "头很满"
    * "身体麻"
    * "没感觉"
  * Emotion chips:
    * "焦虑/害怕"
    * "委屈/难过"
    * "羞耻/内疚"
    * "生气/怨"
    * "想念"
    * "被看见/很暖"
    * "混合"
    * "说不清"
  * Optional intensity control:
    * low / medium / high
  * Optional state check:
    * Show after body/emotion if intensity is high, the user selects shame/fear/anger, or the user chooses "说不清".
    * Prompt: "我现在是在回应当下，还是有旧感觉/连接警报/内部审判者被带起来？"
    * Choices: "主要是当下", "连接警报", "旧感觉", "内部审判者", "边界压力", "身体过载", "说不清".
    * If body overload is selected, prefer Return-to-Self before deeper analysis.
  * Conditional micro-calibration:
    * Show when fear, shame, anger, guilt, or jealousy is selected.
    * Prompt: "这个情绪可能在保护什么？"
    * Chips: "连接", "尊严", "边界", "被看见", "稳定", "不再受伤", "说不清"
  * Primary action: "看见冲动"
* Step 3: Urge
  * Title: "我现在最想做什么？"
  * Helper copy: "冲动不是命令，只是线索。"
  * Chips:
    * "马上回复"
    * "检查信号"
    * "反复重读"
    * "补发解释"
    * "问清楚/要确认"
    * "撤回/删除"
    * "装作不在乎"
    * "消失/切断"
    * "指责/攻击"
    * "安抚或拯救对方"
    * "睡不着一直想"
  * Primary action: "选择下一步"
* Conditional branch rules after Step 3:
  * Connection continuity branch:
    * Trigger when state check selects connection alarm, or when urge includes checking, reassurance seeking, rereading, sending again, withdrawal, cutting off, or push-pull.
    * Title: "此刻消失的是事实，还是连接感？"
    * Required output: remembered evidence, not proven yet, one 10-minute stabilizing action.
  * Boundary branch:
    * Trigger when state check selects boundary pressure, or when urge includes rescuing, pleasing, over-explaining, guilt, resentment, pressure to reply, or fear of disappointing.
    * Title: "什么是我的责任？什么不是？"
    * Required output: one real limit or one boundary form.
  * Old echo / inner critic branch:
    * Trigger when state check selects old echo or inner critic, when intensity is high, shame is selected, user marks "反应比事情大", or user explicitly chooses "看深一点".
    * Title: "这像不像旧感觉被碰到了？"
    * Required output: present/old-echo selection, touched need, or "现在不看这么深".
  * Empowerment branch:
    * Trigger when urge maps to helpless waiting, rescuing/over-carrying, or accusation/control.
    * Title: "我现在站在哪里？"
    * Required output: Creator / 引导者 / Challenger prompt and one owned action.
  * Seeing branch:
    * Trigger when the user selected "收到一段长消息", "被看见/很暖", repair-related emotions, or the urge to respond perfectly.
    * Title: "我需要回应全部，还是先确认我收到了？"
    * Required output: reflect back, ask one question, later topic, or no response needed.
* Step 4: Owned next action
  * Title: "我选择一个能把我带回自己的下一步"
  * Helper copy: "这一步不需要解决关系，只需要减少失控。"
  * Recommended action card:
    * Show one recommendation based on Step 2/3 and branch results.
    * Include a one-line reason.
  * Default action chips:
    * "延迟 10 分钟"
    * "保存草稿不发"
    * "记录事实"
    * "把话题放进稍后"
    * "做五感落地"
    * "喝水/洗手"
    * "只回应一个点"
    * "不再补发"
    * "回到自己"
    * "保存为快速记录"
  * Primary action: "就这个"
  * Secondary actions:
    * "换一个"
    * "稍后"
* Completion screen
  * Title: "这一步先够了"
  * Copy variants:
    * If user chose a stabilizing action: "你没有让冲动直接开车。"
    * If user saved facts: "事实已经被存下，结论可以慢一点。"
    * If user chose boundary: "你可以关心，也可以不越过自己的限度。"
    * If user still feels activated: "还没变轻也没关系，先别继续加重它。"
  * Primary action:
    * high activation: "进入回到自己"
    * medium/low activation: "完成"
  * Secondary actions:
    * "保存为快速记录"
    * "继续完整记录"
    * "去草稿自检"
    * "收到很多内容，不知道怎么接"
* Account impact rules for "我被触发了":
  * Completed Step 1-4 and chose one owned action:
    * Self +1
    * Energy 0 by default
  * Completed a grounding / Return-to-Self action:
    * Self +1
    * Energy +1 if user reports it helped
  * Completed a boundary, delay, no-extra-message, or save-draft action:
    * Self +1 or +2 depending on difficulty selected by user
    * Energy 0 or +1 if it reduces checking/over-explaining
  * Completed connection-continuity check without checking immediately:
    * Self +1
    * Connection 0 unless real contact evidence is recorded
  * Completed seeing / reflect-back action:
    * Self +1 for not over-answering or not advising too soon
    * Connection +1 only if the episode records real mutual listening / being seen
  * User continues checking, sends, or does the impulsive action:
    * no shame copy
    * app can save "我看见了这个模式"
    * Self +0 or +1 if the user records the pattern honestly
    * Energy impact should be user-rated
* MVP exclusions for this flow:
  * no AI-generated interpretation
  * no automatic branch based on message content
  * no required trauma detail
  * no relationship verdict
  * no partner diagnosis
  * no penalty for skipping branches

#### "想检查信号" Page-Level Flow

* This is the primary path for ambiguous-signal checking, rereading, refreshing, social-media checking, response-time checking, or reassurance seeking.
* The goal is not to forbid checking. The goal is to insert one conscious pause before the checking loop, make the expected payoff visible, and offer a 10-minute non-checking action.
* The flow should be completable in 45-90 seconds and should not require a full episode.
* Layout rules:
  * one question per screen
  * chips before text input
  * no moralizing copy about checking
  * always include "我还是想检查" as a valid choice
  * make "记录模式" available whether or not the user checks
* Step 0: entry state
  * Home button label: "想检查信号"
  * Landing title: "先看见这个想确认的冲动"
  * Landing copy: "你可以检查，也可以先给自己 10 分钟。这里不评判，只帮你看清楚。"
  * Primary action: "开始缓冲"
  * Secondary action: "直接回到自己"
* Step 1: What am I trying to confirm?
  * Title: "我想通过检查确认什么？"
  * Helper copy: "不是问你该不该检查，只是先看见期待。"
  * Chips:
    * "对方还在不在乎"
    * "连接有没有变冷"
    * "我有没有被忽略"
    * "我是不是做错了"
    * "对方有没有新动作"
    * "我是不是需要再发一句"
    * "这段关系有没有希望"
    * "我只是想缓解不安"
    * "说不清"
  * Optional text input placeholder: "我希望看到..."
  * Primary action: "预演结果"
* Step 2: If the signal feels good
  * Title: "如果看到好信号，我接下来可能会怎样？"
  * Helper copy: "好信号也可能让人继续加码。"
  * Chips:
    * "松一口气"
    * "想继续看更多"
    * "想马上回应/靠近"
    * "开始幻想未来"
    * "担心好信号会消失"
    * "还是不够确定"
    * "可以停下"
    * "说不清"
  * Prompt: "好信号最多能说明什么？不能说明什么？"
  * Current meaning chips:
    * "此刻有一点连接"
    * "我可以先接收"
    * "这不是未来保证"
    * "还不能证明关系走向"
  * Primary action: "再看另一种结果"
* Step 3: If the signal feels bad or absent
  * Title: "如果没有看到想要的信号，我可能会怎样？"
  * Helper copy: "先保护自己，不让一个信号决定全部。"
  * Chips:
    * "继续刷新"
    * "想补发解释"
    * "想质问"
    * "觉得连接消失"
    * "开始自责"
    * "想切断"
    * "睡不着复盘"
    * "可以先停一下"
    * "说不清"
  * Prompt: "坏信号最多能说明什么？不能说明什么？"
  * Not-proven-yet chips:
    * "不能证明我不重要"
    * "不能证明连接消失"
    * "不能证明我做错了"
    * "不能证明未来"
    * "只能说明我现在很不安"
  * Primary action: "选择 10 分钟"
* Step 4: Choose a 10-minute non-checking action
  * Title: "先给自己 10 分钟，不把决定交给信号"
  * Helper copy: "10 分钟后你仍然可以决定。"
  * Recommended action card:
    * Pick one based on state:
      * high activation -> five-senses grounding
      * sleep-deprived / late night -> no-night-checking + Return-to-Self
      * shame / self-blame -> self-compassion pause
      * over-explaining urge -> save draft until tomorrow
      * loneliness -> one self-contact or safe-support action
  * Action chips:
    * "五感落地"
    * "喝水/洗手"
    * "走动 1 分钟"
    * "把手机扣下 10 分钟"
    * "保存草稿到明天"
    * "写下事实，不写结论"
    * "看一个已存下的温暖证据"
    * "回到自己"
    * "我还是想检查"
  * Primary action:
    * If non-checking action selected: "就这个，10 分钟"
    * If checking selected: "继续检查并记录"
  * Secondary actions:
    * "换一个"
    * "稍后"
* Optional connection-continuity mini-check:
  * Show after Step 1 or Step 3 if the user selects "连接有没有变冷", "觉得连接消失", "想切断", or "继续刷新".
  * Title: "此刻消失的是事实，还是连接感？"
  * Prompt: "现在有什么证据说明连接曾经存在？有什么还不能证明它已经消失？"
  * Output:
    * remembered evidence
    * not proven yet
    * one stabilizing action
* Optional digital-boundary mini-check:
  * Show if the user selects late-night checking, repeated refreshing, rereading, or sending again.
  * Title: "我需要一个手机边界吗？"
  * Chips:
    * "10 分钟不刷新"
    * "睡前不检查"
    * "今晚不补发"
    * "把草稿存到明天"
    * "检查一次就停"
    * "现在做不到"
  * Output: one user-owned digital boundary, never a demand on the other person.
* Completion screen
  * If user chose a non-checking action:
    * Title: "你把主动权拿回来了一点"
    * Copy: "10 分钟不是放弃关系，是不让不安直接开车。"
    * Primary action: "开始回到自己"
    * Secondary actions: "保存这个选择", "完成"
  * If user chose to check:
    * Title: "也可以。我们把模式存下"
    * Copy: "检查不是失败。重要的是看见：我在期待什么，检查后发生了什么。"
    * Follow-up chips:
      * "检查后轻了一点"
      * "检查后更想继续看"
      * "检查后更不安"
      * "没有变化"
      * "我不想记录"
    * Primary action: "保存结果"
    * Secondary action: "回到自己"
  * If user skipped:
    * Title: "先放着也可以"
    * Copy: "你已经看见了这个冲动，不需要表现得完美。"
* Account impact rules for "想检查信号":
  * Completed Step 1-4 and selected a 10-minute non-checking action:
    * Self +1
    * Energy 0 by default
  * Completed the 10-minute action and reports lower checking urge:
    * Self +1
    * Energy +1
  * Created a digital boundary and followed it:
    * Self +1 or +2 depending on difficulty
    * Energy +1 if it reduces rumination or sleep disruption
  * Completed connection-continuity mini-check:
    * Self +1 for distinguishing connection feeling from facts
    * Connection 0 unless real contact evidence is recorded
  * User checked anyway and recorded the result:
    * Self +1 if the pattern is recorded honestly
    * Energy user-rated
    * No negative account impact by default
  * User checked anyway and did not record:
    * no account change
    * no shame copy
* MVP exclusions for this flow:
  * no blocking the user from checking
  * no streaks for "not checking"
  * no shame, failure, or relapse language
  * no automatic monitoring of apps, messages, social media, read receipts, response speed, or online status
  * no interpretation of another person's silence, activity, or response timing
  * no relationship verdict based on signal presence or absence

#### "收到很多内容，不知道怎么接" Page-Level Flow

* This is the primary path for long, warm, emotionally dense incoming messages, especially when the user feels moved, seen, grateful, overwhelmed, pressured to respond well, or afraid of missing an important thread.
* The goal is to help the user receive the message without turning every thread into an immediate response obligation.
* MVP should implement this as manual user-guided threading, not AI parsing or psychological analysis of the sender.
* Entry points:
  * Record -> "收到一段很长/很暖/信息很多的话"
  * Return-to-Self -> "我收到很多内容，不知道怎么接"
  * Trigger support completion -> secondary action "收到很多内容，不知道怎么接"
  * Episode detail -> "拆成几条线索"
* Layout rules:
  * paste / summarize incoming message is optional
  * chip-first thread creation with optional short notes
  * show a maximum of three active threads before asking the user to continue, to reduce overwhelm
  * each thread gets one handling choice only
  * no requirement to produce a reply
  * no AI summary or sender interpretation in MVP
* Step 0: Message container
  * Title: "先不用一次接住全部"
  * Helper copy: "可以只存你收到的部分，不急着决定怎么回。"
  * Optional input placeholder: "可以贴一小段，或只写一句：这段大概在说什么。"
  * Chips for message shape:
    * "很暖"
    * "信息很多"
    * "很脆弱"
    * "对方解释了很多"
    * "让我想认真回应"
    * "让我有压力"
    * "我被看见了"
    * "我怕漏掉什么"
    * "说不清"
  * Primary action: "拆成几条线索"
  * Secondary action: "直接回到自己"
* Step 1: What did I receive?
  * Title: "这段里，我先收到了什么？"
  * Helper copy: "不是总结全文，只是选你心里有反应的几条。"
  * Thread chips:
    * "被看见/被理解"
    * "澄清/解释"
    * "脆弱/自我暴露"
    * "表达困难/语言缓冲"
    * "失眠/反复复盘"
    * "完美主义/拖延"
    * "价值观/意义"
    * "自我照顾/互相照顾"
    * "需要稍后再聊的话题"
    * "其他"
  * User can add an optional short note per selected thread.
  * For any thread that may affect Connection, ask one lightweight evidence prompt:
    * "这条来自哪句/哪个可观察线索？"
    * This can be skipped, but skipped evidence should not create automatic Connection impact.
  * If more than three threads are selected:
    * ask "现在先处理哪三条？"
    * save the rest as candidate later topics.
* Step 2: Mixed emotion check
  * Title: "收到这些以后，我现在是什么状态？"
  * Helper copy: "温暖和压力可以同时存在。"
  * Chips:
    * "温暖"
    * "被看见"
    * "感动"
    * "感激"
    * "安心"
    * "兴奋"
    * "怕回应不好"
    * "有压力"
    * "信息过载"
    * "想马上认真回"
    * "想逃开"
    * "有点失眠/复盘"
    * "混合"
    * "说不清"
  * Routing:
    * information overload / sleep-rumination / pressure high -> offer Return-to-Self before response decisions
    * warm + low activation -> continue to thread handling
    * fear of missing something -> keep "enough-for-now response" bias
* Step 3: Thread handling
  * Title: "每一条线索，现在怎么放？"
  * For each active thread, user chooses one:
    * "我先收到了"
    * "这条需要回应"
    * "放进稍后"
    * "不需要回应"
  * Suggested defaults:
    * being seen / being understood -> "我先收到了"
    * clarification / explanation -> "这条需要回应" or "放进稍后"
    * vulnerability -> "先确认我收到了" before advice
    * expression buffer -> "我先收到了"
    * rumination / insomnia -> "放进稍后" or Return-to-Self
    * perfectionism / procrastination -> "放进稍后" or personal action
    * values / meaning -> "放进稍后"
    * self-care / mutual care -> "我先收到了"
  * The app should not decide the handling automatically. Suggested defaults are visible as hints only.
* Step 4: Enough-for-now response direction
  * Title: "如果要回，一次够不够只回一个方向？"
  * Helper copy: "回应不必覆盖所有线索，先让对方知道你收到了也可以。"
  * Options:
    * "只确认我收到了"
    * "先回应最重要的一条"
    * "先表达感谢/被触动"
    * "问一个开放问题"
    * "反映我听到的重点"
    * "先不回复，存下"
    * "去草稿自检"
    * "先回到自己"
  * If user chooses a response direction, no draft is generated in this flow. It can route to Draft Checker if the user wants to write.
* Step 5: Save summary
  * Title: "这次先存到这里"
  * Summary sections:
    * "我收到的温暖/理解"
    * "现在需要回应的一条"
    * "可以稍后再聊/再理解的发现点"
    * "我身体/情绪的状态"
    * "一个足够的下一步"
  * If multiple threads were saved for later:
    * show "已存住 X 个发现点"
    * allow quick edit of each title
    * do not ask the user to analyze them now
  * Actions:
    * "保存为记录"
    * "把发现点存进稍后"
    * "保存一句锚点"
    * "进入草稿自检"
    * "回到自己"
    * "完成"
* Account impact rules for this flow:
  * User identifies at least one received warmth / being seen thread:
    * Connection +1 if the thread is grounded in observable incoming content
    * Copy: "这是这一刻收到的连接，不是未来保证。"
  * User marks "received now" instead of answering every thread:
    * Self +1 for not over-carrying or over-answering
  * User saves later topics instead of forcing a full response:
    * Self +1
    * Energy 0 or +1 if it reduces overload
  * User chooses a reflective listening / open question direction:
    * Self +1
    * Connection 0 now, unless a later episode records real mutual exchange
  * Energy is always user-rated:
    * can be +1/+2 if nourished
    * 0 if mixed
    * -1/-2 if depleted or overwhelmed
* MVP exclusions for this flow:
  * no automatic AI summary of the incoming message
  * no sender psychology analysis
  * no prediction of what the sender expects
  * no requirement to answer every thread
  * no generated reply optimized for connection or response
  * no partner profile, empathy score, or relationship verdict
  * no "warm message proves commitment" framing

### Draft Checker

* User can paste a draft message/comment and run a self-check.
* Draft checker should be an intention/risk self-checker, not an AI rewriting tool in MVP.
* The checker asks whether the draft contains:
  * real-world mapping that may expose privacy
  * expectation of response
  * self-proving or over-explaining
  * guilt-driven yes, rescue, or responsibility that is not mine
  * analysis of the other person's psychology
  * language that may leave the user destabilized after sending
  * enough authenticity and boundary
* MVP self-check questions:
  * "我现在适合判断这段草稿吗？"
    * mostly present
    * connection alarm is loud
    * old feeling is touched
    * inner critic is loud
    * boundary / responsibility pressure
    * body overloaded
    * not sure
  * "我写这段主要是为了什么？"
    * express real feeling
    * maintain presence
    * hope for response
    * explain myself
    * soothe/rescue the other person
    * express a boundary
  * "发出去以后，我能不能承受暂时没有回应？"
    * yes
    * somewhat hard
    * very hard
  * "这段有没有把现实关系、隐私或对方心理分析暴露得太多？"
    * no
    * a little
    * clearly
  * "这段更像哪种姿态？"
    * Creator: I express what I can choose.
    * Guide / 引导者: I support without taking over.
    * Challenger: I state a clear boundary.
    * Victim: I am waiting for the other person to decide my state.
    * Rescuer: I want to rescue, fix, or carry the other person.
    * Persecutor: I want the other person to know they are wrong.
  * "发完以后我可能会怎样？"
    * return to life
    * repeatedly check
    * regret / add another message
    * lose sleep / ruminate
  * "这段里有没有我正在替对方承担的东西？"
    * no
    * a little
    * clearly
  * "这段有没有清楚表达我的限度，而不是暗中期待对方猜到？"
    * clear enough
    * not clear yet
    * I am avoiding a boundary
* Output should be a reflective recommendation category:
  * ready enough: real, low-pressure, and the user can tolerate no immediate response
  * lighten it: valuable expression, but emotional pressure is high
  * save as draft: response expectation or rumination risk is high
  * private record first: the content is more for the user than for the other person right now
  * boundary expression: if the core is a need or limit, do not hide it inside warm small talk
  * return to self first: body overload, old echo, inner critic, or connection alarm is too loud for a send/no-send decision
* MVP can implement this as deterministic prompts and user self-rating, not AI generation.
* The recommendation should be transparent. Example:
  * High response expectation + high destabilization risk -> save as draft.
  * Clear expression + low pressure + enough authenticity -> ready enough.
  * Heavy reality mapping + public/privacy risk -> lighten it or do not send today.
  * Body overload / old echo / inner critic loud -> return to self first, then review later.
* The checker should never say "send this to get a response".
* Draft text should stay local and should not be sent to any external service in MVP.

#### "草稿自检" Page-Level Flow

* This is the primary path for moments when the user wants to send, explain, repair, apologize, ask, set a boundary, or regain connection through a message/comment.
* The goal is not to polish the message. The goal is to help the user decide whether now is a good time to send, save, lighten, privately record, clarify a boundary, or return to self first.
* The flow should be deterministic and local. MVP should not rewrite the user's draft or infer the other person's psychology.
* Layout rules:
  * paste / type draft first, but allow "我还没写，只想先自检"
  * one question per screen after draft input
  * chip-first answers
  * no send button inside the app in MVP
  * recommendations explain the rule that produced them
  * user can save the draft locally, discard, or continue to full record
* Step 0: Draft input
  * Home button label: "草稿自检"
  * Title: "先不急着发"
  * Helper copy: "这里不会帮你写得更会获得回应，只帮你看：现在适不适合发。"
  * Input placeholder: "把想发的话放在这里，或先跳过。"
  * Primary action: "开始自检"
  * Secondary actions:
    * "还没写，先检查状态"
    * "直接回到自己"
* Step 1: State check
  * Title: "我现在适合判断这段草稿吗？"
  * Helper copy: "如果浪太大，先不要让草稿替情绪做决定。"
  * Chips:
    * "基本在当下"
    * "连接警报很响"
    * "旧感觉被碰到"
    * "内部审判者很响"
    * "边界/责任压力"
    * "身体过载"
    * "说不清"
  * Routing:
    * body overload -> recommend "先回到自己"
    * old echo / inner critic loud -> recommend "先私下记录" or "先回到自己"
    * connection alarm loud -> continue only if user wants, but keep save-draft bias
    * mostly present -> continue
* Step 2: Send motivation
  * Title: "我写这段主要是为了什么？"
  * Helper copy: "可以有多个动机，先选最强的那个。"
  * Chips:
    * "表达真实感受"
    * "修复/道歉"
    * "提出一个请求"
    * "说明边界"
    * "维持在场"
    * "希望得到回应"
    * "解释/证明自己"
    * "安抚或拯救对方"
    * "降低自己的不安"
    * "让对方知道 TA 错了"
  * Primary action: "看承受度"
* Step 3: No-response tolerance
  * Title: "如果暂时没有回应，我能承受吗？"
  * Helper copy: "不是要求你不在乎，而是看发送后会不会更失控。"
  * Chips:
    * "可以回到生活"
    * "会有点难，但能等"
    * "会反复检查"
    * "会想补发"
    * "会睡不着/复盘"
    * "会很崩"
    * "说不清"
  * Primary action: "看内容风险"
* Step 4: Content risk check
  * Title: "这段话里有没有高风险内容？"
  * Helper copy: "风险不是说不能说，而是看现在适不适合这样说。"
  * Chips:
    * "暴露太多隐私"
    * "分析对方心理"
    * "暗含必须回应"
    * "过度解释/自证"
    * "把很多话题塞在一起"
    * "边界不清"
    * "攻击/讽刺/控诉"
    * "没有明显风险"
    * "说不清"
  * Optional prompt if "很多话题" selected:
    * "哪一个点是现在最必要的？其余可以放进稍后。"
  * Primary action: "看姿态"
* Step 5: Stance check
  * Title: "这段更像哪种姿态？"
  * Helper copy: "这不是给你贴标签，只是看它会把你带向哪里。"
  * Empowered chips:
    * "创造者：我表达我能选择的部分"
    * "引导者：我支持，但不接管"
    * "挑战者：我清楚表达事实/边界"
  * Drama-triangle chips:
    * "受害者：等对方决定我的状态"
    * "拯救者：想修好/接住/负责太多"
    * "迫害者：想让对方知道 TA 错了"
  * Other chips:
    * "看不出来"
  * Primary action: "预演发送后"
* Step 6: After-send preview
  * Title: "发出去以后，我可能会怎样？"
  * Helper copy: "先照顾发送后的自己。"
  * Chips:
    * "能回到生活"
    * "会一直看回复"
    * "会后悔/想撤回"
    * "会想再补一段"
    * "会失眠/复盘"
    * "会更清楚"
    * "会更有边界"
    * "说不清"
  * Primary action: "看建议"
* Recommendation results
  * ready enough:
    * Title: "可以发：足够真实，也足够低压"
    * Rule: mostly present state + expression/request/boundary motivation + can tolerate no immediate response + no major content risk + empowered stance.
    * Copy: "这不是保证对方会怎样，只是说明你发送后比较不容易把自己交出去。"
  * lighten it:
    * Title: "减轻一点：表达有价值，但压力偏高"
    * Rule: meaningful content + some response expectation / many topics / privacy exposure / mild over-explaining.
    * Suggested action chips: "只留一个重点", "删掉心理分析", "去掉必须回应的压力", "把其余放进稍后".
  * save as draft:
    * Title: "先存草稿：现在回应期待太高"
    * Rule: high no-response intolerance, repeated checking risk, connection alarm loud, desire to reduce anxiety, or strong urge to add more.
    * Copy: "存下不是压抑，是不让这一刻替你决定。"
  * private record first:
    * Title: "先私下记录：这段可能更像写给自己看的"
    * Rule: self-proving, old echo, inner critic, shame, many threads, or content mainly clarifies the user's own feeling.
    * Suggested action: save as episode, later topic, or self-compassion pause.
  * boundary expression:
    * Title: "改成边界表达：核心是需要或限度"
    * Rule: resentment, guilt, unclear limit, pressure to reply, avoidance of saying no, or hidden expectation that the other person guesses the need.
    * Suggested action chips: "说一个真实限度", "提出一个具体请求", "去掉惩罚/威胁", "写明我会做什么".
  * return to self first:
    * Title: "先回到自己：现在不适合做发送决定"
    * Rule: body overload, old echo, inner critic loud, shame/fear high, connection alarm loud, or user says "说不清" with high activation.
    * Copy: "不是不能发，是先不要让高浪替你发。"
* Completion screen
  * If ready enough:
    * Primary action: "保存检查结果"
    * Secondary actions: "复制草稿", "保存为记录", "回到自己"
    * Reminder: "发送后仍然可以不马上检查。"
  * If lighten it:
    * Primary action: "保存轻一点版本的方向"
    * Secondary actions: "把多余话题放进稍后", "保存草稿"
  * If save as draft:
    * Primary action: "保存草稿"
    * Secondary actions: "设置明天再看", "回到自己"
  * If private record first:
    * Primary action: "转成私下记录"
    * Secondary actions: "自我关怀一下", "稍后再说"
  * If boundary expression:
    * Primary action: "进入边界清晰检查"
    * Secondary actions: "保存草稿", "稍后"
  * If return to self first:
    * Primary action: "进入回到自己"
    * Secondary actions: "保存草稿不发", "关闭"
* Account impact rules for "草稿自检":
  * Completing state check and choosing not to send from high activation:
    * Self +1
    * Energy 0 or +1 if it reduces urgency
  * Saving a draft instead of sending from response expectation / self-proving:
    * Self +1
    * Energy user-rated
  * Converting a draft into private record, later topic, or self-compassion:
    * Self +1
    * Energy 0 or +1 if user reports relief
  * Clarifying a boundary expression:
    * Self +1 or +2 depending on difficulty
    * Connection 0 unless there is real mutual respect/contact in a later episode
  * Sending after "ready enough":
    * No automatic account impact from sending itself
    * Self +1 only if the user completed the check and chose from agency rather than compulsion
  * Sending despite high-risk recommendation:
    * no shame copy
    * no negative impact by default
    * user can record what happened after sending
* MVP exclusions for this flow:
  * no AI rewriting or optimization
  * no "send this to get a response" strategy
  * no prediction of how the other person will react
  * no analysis of the other person's psychology
  * no send button or external messaging integration
  * no automatic privacy detection from pasted text
  * no penalty for sending anyway

#### "回到自己" Page-Level Flow

* This is the common low-cognitive exit for high-activation paths, including trigger support, signal checking, draft self-check, rich incoming message review, warm interaction landing, and calm closure.
* The goal is not to solve the relationship event or make the user feel good immediately. The goal is to help the user stop escalating, land in the body, choose one anchor, and return to one real-life action.
* The flow should be DBT-informed but not presented as therapy, diagnosis, or medical treatment.
* Layout rules:
  * one screen per stage
  * large touch targets and chip-first choices
  * no long typing requirement
  * "不想选 / 先跳过" is always available
  * completing part of the flow is valid
  * no countdown that creates pressure in MVP
* Entry context:
  * from Home: title "先回到自己"
  * from "我被触发了": title "先让浪过去一点"
  * from "想检查信号": title "先不用把答案交给外面"
  * from "草稿自检": title "先不要让高浪替你发"
  * from rich incoming message review: title "不用一次接住全部"
  * from warm interaction landing: title "可以收下温暖，也慢一点"
  * from calm closure: title "这次记录先到这里"
* Step 0: Quick safety / support boundary
  * Show only when the user arrives with very high activation, violence/self-harm wording, coercion/stalking/physical safety tags, or chooses "我可能会伤害自己/别人".
  * Title: "这可能需要真人支持"
  * Copy: "这个小工具不能处理危机。请优先联系身边可信任的人、专业支持或当地紧急服务。"
  * Actions:
    * "我现在去联系真人支持"
    * "我只是很难受，继续回到自己"
  * This screen should not ask for details or assess risk level in MVP.
* Step 1: Body landing
  * Title: "先让身体有一个落点"
  * Helper copy: "不用做对，选一个现在不排斥的小动作。"
  * Chips:
    * "喝一口水"
    * "洗手/洗脸"
    * "站起来走 1 分钟"
    * "看窗外 30 秒"
    * "摸一个柔软的东西"
    * "脚踩地面"
    * "放松下巴/肩膀"
    * "慢慢呼一口气"
    * "冷水冲手"
    * "手放胸口"
    * "温热手掌贴手臂"
    * "轻轻抱住自己"
    * "五感观察"
    * "现在不想做"
  * If "五感观察" is chosen, show one compact selector:
    * "我看到 3 个东西"
    * "我听到 2 个声音"
    * "我摸到 1 个触感"
    * "我闻到一个气味/空气"
    * "我慢慢喝一口水/茶"
  * Conservative body-skill boundary:
    * no breath-holding instructions
    * no intense cold exposure
    * no intense exercise guidance
    * no biological claims such as "this releases oxytocin"
    * copy should allow skipping anything that feels unsafe or uncomfortable
* Step 2: Attention anchor
  * Title: "给注意力一个可以回来的句子"
  * Helper copy: "这不是说服自己没事，只是给自己一个扶手。"
  * Seed anchor chips:
    * "事实可以很小，结论可以慢一点。"
    * "我不用一次接住全部。"
    * "我先回到自己，再决定下一步。"
    * "这不是现在必须解决完的事。"
    * "我可以接收温暖，也不急着加码。"
    * "没有立刻变轻，也不代表我做错了。"
    * "这很难，但我不需要再攻击自己。"
  * User can:
    * choose one seed anchor
    * use a saved anchor
    * save a selected anchor
    * skip anchor
* Step 3: Return to life
  * Title: "接下来 10-30 分钟，我回到哪一件现实小事？"
  * Helper copy: "不用选最正确的，只选最容易开始的一件。"
  * Recommended action rule:
    * show one recommended action first based on daily market, activation, time of day, and recent Energy movement
    * show no more than two alternatives to reduce choice overload
    * allow "换一个" and "先不选"
  * Candidate actions:
    * "吃点东西"
    * "洗澡"
    * "睡觉/闭眼休息"
    * "出门走一小段"
    * "泡一杯喝的"
    * "整理一个小区域"
    * "读/学 10 分钟"
    * "写自己的内容"
    * "暂停分析"
    * "联系一个真人支持"
* Step 4: Completion / partial completion
  * If user completed all three stages:
    * Title: "已经存下一个回到自己的动作"
    * Copy: "事情可以还没解决，但你没有继续把自己交出去。"
    * Ask: "现在能量感觉怎么样？"
    * Chips: "轻一点", "差不多", "更累了", "说不清"
    * Primary action: "回到首页"
    * Secondary actions: "保存为记录", "取一个支持自己的小动作"
  * If user completed only body landing:
    * Title: "先做到这里也可以"
    * Copy: "身体先有一个落点，就是一步。"
    * Actions: "保存这一步", "继续选一句话", "关闭"
  * If user only noticed the need to pause:
    * Title: "你看见了自己需要停一下"
    * Copy: "看见本身也是一次转向。"
    * Actions: "保存这个看见", "再试一个小动作", "关闭"
  * If user says it feels worse or more activated:
    * Title: "没有变轻，也不代表这一步无效"
    * Copy: "先不要继续深挖。选择一个低认知动作，或联系真人支持。"
    * Actions: "选一个低认知动作", "联系真人支持", "关闭"
* Account impact rules for "回到自己":
  * Noticed the need to return, but did not complete an action:
    * Self +1
    * Energy 0
    * Reason: "看见自己需要停一下"
  * Completed one body landing action:
    * Self +1
    * Energy +1, 0, or -1 based on user-rated felt effect
  * Completed body landing + anchor + next real-life action:
    * Self +2
    * Energy +2, +1, 0, or -1 based on user-rated felt effect
  * Completed the flow but still feels bad:
    * keep Self impact
    * allow Energy 0 or -1
    * Copy: "没有立刻变轻，不代表你做错了。你已经少加重一点。"
  * No automatic Connection impact:
    * Return-to-Self is a user-owned stabilization action, not evidence of relational contact.
* MVP exclusions for this flow:
  * no trauma analysis or childhood-source determination
  * no clinical scoring
  * no claim that grounding heals trauma or rewires the brain
  * no forced breathing, intense body practice, or exposure-like exercise
  * no requirement to feel better before completion
  * no punishment for closing early

### Anchors

* User can save short anchor sentences from episodes or reflections.
* Example anchor pattern: "I can receive warmth without turning it into a future contract."
* Anchors should be accessible from the home screen or episode detail.
* Anchors can be created manually, copied from a saved episode, or chosen from seed anchors.
* Seed anchors should be generic and non-clinical, such as:
  * "事实可以很小，结论可以慢一点。"
  * "我可以开心，也可以不急着加码。"
  * "没有一次聊完，不等于连接消失。"
  * "我先回到自己，再决定下一步。"

### Empty, Error, and Edge States

* Empty dashboard should invite one small action, not a full setup burden.
* If local storage is unavailable, the app should clearly warn that records may not persist.
* If a long form is partially filled, the app should preserve draft state locally.
* Deleting records should require confirmation because records may be emotionally meaningful.
* The app should include a privacy reminder in settings: this is local self-reflection data, and users should avoid storing information they would not want visible on an unlocked device.

### Future Evolution To Preserve

* Data model should leave room for:
  * multiple emotional spaces
  * export/import
  * optional AI reflection later
  * optional encrypted storage later
  * optional couple/shared mode later
* MVP should not implement these, but naming and data shapes should not block them.

## First Release Scope

The PRD describes the product system broadly. The first implementable release should be smaller: one local-first PWA that proves the trigger-first loop, local record persistence, and user-owned next action mechanics.

### First Release Product Slice

* P0 must deliver a complete user loop:
  * open Home while activated
  * choose one primary flow
  * reduce activation through fact/body/urge or Return-to-Self
  * save a lightweight record
  * see the result reflected in account summaries and recent history
  * reopen later and continue from local data
* P1 should deliver supporting loops that make the app feel useful beyond the first trigger:
  * save and review later topics / discovery points
  * run draft self-check
  * run rich incoming message review
  * open account detail and personal action menu
  * create and complete one small experiment
* P2 should be preserved in model and copy, but can be implementation-light in the first build:
  * healthy love literacy
  * seeing / being seen practice
  * old echo / mosquito-elephant
  * self-compassion
  * boundary clarity
  * connection-continuity
  * emotion calibration
* P2 does not mean "unimportant". It means the first build can expose these as short optional branches, seeded copy, or stored data shapes before making every branch a full standalone surface.

### First Coding Pass Scope Lock

The first coding pass should implement **P0 only**. It should prove one narrow but complete loop before adding the richer P1 surfaces.

P0 included:

* First-run setup:
  * local-first privacy note
  * one default emotional space
  * daily market default
* Home:
  * active space / market strip
  * one market note
  * four trigger buttons visible, with only "我被触发了" and "回到自己" fully implemented in the first coding pass
  * secondary "记录互动"
  * compact Connection / Self / Energy summaries
  * latest record preview when data exists
* "我被触发了":
  * fact
  * body/emotion
  * urge
  * owned next action
  * completion with close, Return-To-Self, or save quick record
* "回到自己":
  * body landing
  * anchor
  * return-to-life action
  * energy-effect feedback
  * partial completion
* Quick Record:
  * title
  * facts
  * interpretation
  * emotion/body
  * connection level
  * activation level
  * next action
  * save and show on Home
* Account summaries:
  * derived Connection / Self / Energy values
  * short reason text
  * no account-detail route required in first coding pass
* Minimal Settings:
  * local-first privacy copy
  * reset/delete local data with confirmation
  * no full archive management
* Local persistence:
  * setup
  * records
  * return-to-self practices
  * account-impact sources
  * anchors
  * drafts when needed

Explicitly deferred from the first coding pass:

* Account Detail / storage-jar detail.
* Episode Detail beyond a latest-record preview or simple read-only summary.
* Personal Action Menu.
* Topics / discovery points.
* Experiments.
* Signal Check.
* Draft Self-Check.
* Rich Incoming Message Review.
* P2 branches such as old echo, self-compassion, boundary clarity, emotion calibration, healthy love literacy, and seeing practice.
* Export/import.
* Multi-space management beyond one editable/default space if implementation chooses to support rename.

P0 Home placeholder rule:

* "想检查信号" and "草稿自检" may remain visible in the Home primary panel to preserve the intended product IA, but in the first coding pass they must either:
  * show honest placeholder copy such as "这个入口下一阶段支持，可以先用'我被触发了'或'回到自己'", or
  * be visually marked as "稍后支持".
* They must not:
  * open fake flows
  * create fake records or account impacts
  * silently route into unrelated screens
  * imply Signal Check or Draft Self-Check is implemented in P0

P0 completion rule:

* If a user can install/open the PWA, complete setup, use Home, complete "我被触发了", complete "回到自己", save a Quick Record, refresh the app, see account summaries update, and delete local data, P0 is complete enough to move to P1.

### First Coding Pass Implementation Slices

The first coding pass should be delivered as small P0 slices, not as one large feature batch. Each slice should leave the app runnable and should avoid starting later surfaces before the previous slice is stable.

#### P0-A: App Shell, Tokens, Setup, And Storage

Build:

* Vite / React / TypeScript PWA shell, or the nearest equivalent if implementation discovery chooses another lightweight frontend setup.
* `src/styles/tokens.css` and `src/styles/global.css` with the P0 visual token contract.
* `AppShell`, `PageHeader`, `BottomNav`, basic route structure.
* First-run setup:
  * local-first privacy note
  * one emotional space
  * default daily market
* Storage adapter and migration layer:
  * load
  * save
  * reset
  * corrupted / unsupported fallback
  * storage unavailable status
* Minimal Settings:
  * privacy copy
  * storage status
  * reset/delete confirmation

Acceptance:

* A fresh user can complete setup and land on Home.
* Reload preserves setup.
* Reset/delete returns the app to setup only if local reset succeeds.
* Storage failure does not show false saved copy.
* The app has the mobile visual foundation, safe-area handling, and bottom nav in place.

Do not build in P0-A:

* Trigger flow.
* Return-To-Self flow.
* Quick Record form.
* Account detail.
* P1 placeholders beyond route-safe empty states.

#### P0-B: Domain Model, Defaults, And Derived Account Summaries

Build:

* Domain types for `AppState`, `EmotionalSpace`, `Episode`, `AccountImpact`, `Anchor`, `Draft`, `Settings`, and `ReturnToSelfPractice`.
* Default state creation with seed anchors and daily market options.
* Pure account summary helpers:
  * collect impacts
  * derive per-account qualitative state
  * derive all three summaries
  * expose recent reason/source copy
* Episode and Return-To-Self source ownership rules.
* Unit tests for the account derivation and local migration boundary.

Acceptance:

* Account summaries are derived from source-owned impacts, not stored as separate balances.
* Connection impact requires observable evidence or explicit self-contact/interpersonal-contact selection.
* Return-To-Self can never create Connection impact.
* Skips/placeholders/unfinished flows create no negative impact.
* Reason copy exists for every visible account change.

Do not build in P0-B:

* Full UI flows.
* Charts or analytics.
* Account editing.
* Relationship health or safety score.

#### P0-C: Home And Return-To-Self Vertical Slice

Build:

* Home first viewport in the locked order:
  * top space/market strip
  * market note
  * four trigger actions with honest P1 placeholders
  * secondary "记录互动"
  * compact account summaries
* Shared UI primitives needed by Home and Return-To-Self:
  * `PrimaryActionPanel`
  * `AccountSummaryCard`
  * `ChipGroup`
  * `StepScreen`
  * `CompletionCard`
  * `ReturnToSelfCta`
* Return-To-Self flow:
  * body landing
  * anchor
  * return-to-life action
  * energy-effect feedback
  * partial completion
* Save Return-To-Self practice with transparent Self/Energy impacts.

Acceptance:

* Home is useful on 360px mobile width with no text overflow.
* "回到自己" works end to end from Home.
* Full and partial Return-To-Self completion persist across refresh.
* Completion copy does not require the user to feel better.
* Account summaries reflect Self/Energy changes with reason copy.

Do not build in P0-C:

* Trigger flow beyond a route placeholder if needed.
* Quick Record save.
* Personal action menu.
* Deep old-echo, trauma-source, or self-compassion branches.

#### P0-D: Trigger Flow And Quick Record Vertical Slice

Build:

* "我被触发了" flow:
  * fact
  * body/emotion
  * urge
  * owned next action
  * completion
* Quick Record route:
  * independent entry from Home/Record
  * prefilled entry from Trigger completion
  * title
  * facts
  * interpretation
  * emotion/body
  * connection level
  * activation level
  * next action
  * account-impact preview
* Save quick record as an `Episode`.
* Latest record preview on Home.
* Close-with-meaningful-input guard and draft behavior if implementation scope allows.

Acceptance:

* User can complete "我被触发了" in four short steps.
* User can save a quick record and see it after refresh.
* Trigger -> Quick Record does not double-count Self impact.
* Facts and interpretation are adjacent and visually distinct.
* Connection and activation remain separate and can both be high.
* High activation offers Return-To-Self without forcing it.

Do not build in P0-D:

* Draft self-check.
* Signal check.
* Rich incoming review.
* Reply generation or rewrite suggestions.
* Automatic chat import or parsing.

#### P0-E: P0 QA, Edge States, And Release Gate

Build/fix:

* Storage unavailable, save error, reset error, empty state, and placeholder state UI.
* PWA manifest basics and mobile viewport metadata.
* Mobile text wrapping and touch-target fixes.
* Unit tests for pure logic and storage fallback.
* Manual QA using the P0 End-To-End Acceptance Script.

Acceptance:

* Scripts 0-9 pass on a narrow mobile viewport.
* P1 placeholders write no persistent data.
* Reset/delete is confirmed and honest.
* No hidden scores, partner inference, diagnosis, surveillance prompts, or reward-store language appears in P0 UI.
* The app remains fully local and makes no network call for core behavior.

Do not build in P0-E:

* New P1/P2 functionality.
* Export/import unless a separate decision is made.
* Dark-mode polish beyond token readiness, unless it is nearly free and does not delay P0.

### P0 Route And Placeholder Matrix

P0 routes should be explicit so the app does not accidentally grow half-built P1 surfaces. A route can exist as a placeholder only when it is honest, non-persistent, and gives the user a working P0 alternative.

| Entry / Route | P0 behavior | Writes persistent data? | Required copy/state |
|---|---|---:|---|
| `/setup` | First-run setup, privacy note, one emotional space. | Yes, only setup/default state. | "数据只保存在这个浏览器/设备里。" |
| `/` or `/home` | Home with trigger-first first viewport. | No by itself. | P1 buttons marked "稍后支持" if tapped. |
| `/trigger` | Full "我被触发了" flow. | Only on explicit save/completion action. | One question per screen, Return-To-Self available. |
| `/return-to-self` | Full Return-To-Self flow. | Yes on explicit completion or partial save. | Self/Energy only, never Connection. |
| `/record/new` | Independent Quick Record. | Yes on explicit "存下". | Facts and interpretation split. |
| `/record/new?source=trigger` | Prefilled Quick Record from trigger completion. | Yes on explicit "存下". | No double-counting of trigger impact. |
| `/settings` | Minimal privacy, storage status, reset/delete. | Yes only for reset/delete or settings changes. | Confirmation required for destructive action. |
| `/record` | P0 can open Quick Record first or show a simple latest-record list. | No by itself. | If list is not built, show clear "先记录一次互动". |
| `/topics` | Placeholder or low-pressure empty state. | No. | "这个入口下一阶段支持。" |
| `/experiments` | Placeholder or low-pressure empty state. | No. | "之后可以在这里放一个很小的练习。" |
| `/signal-check` | Placeholder only in P0. | No. | Offer "我被触发了" and "回到自己". |
| `/draft-check` | Placeholder only in P0. | No. | Offer "我被触发了" and "回到自己". |
| `/accounts/:account` | Deferred in first coding pass. Optional placeholder. | No. | "明细下一阶段支持，首页先显示最近原因。" |

Placeholder rules:

* Placeholder screens can be routed, but they must be shallow:
  * one short title
  * one sentence explaining "下一阶段支持"
  * one or two working P0 actions
* Placeholder taps must not:
  * create records
  * create account impacts
  * create drafts
  * mutate daily market
  * change account summaries
* Placeholder copy should not apologize, shame, or over-explain. Preferred copy:
  * "这个入口下一阶段支持。现在可以先用'我被触发了'或'回到自己'。"
  * "这里之后会整理发现点。现在可以先把这次发生的事存下来。"
  * "这里之后会放很小的练习。现在可以先取一个能支持自己的动作。"

Navigation guard rules:

* If storage load is `empty`, route to setup.
* If storage load is `ok` and setup is complete, route `/` to Home.
* If storage load is `corrupted`, `unsupportedVersion`, or `unavailable`, show the relevant storage warning before claiming setup or records are available.
* User can still navigate to non-destructive placeholders during storage warning, but any save action must show honest persistence status.
* Back/close from P0 flows should return to the previous route or Home without creating negative impact.

### P0 End-To-End Acceptance Script

This script is the concrete user-path test for the first coding pass. It can be used for manual QA first and later translated into Playwright tests. The test should run on a narrow mobile viewport such as 390 x 844.

#### Script 0: Fresh Install / Empty Storage

Preconditions:

* Browser storage for the app is empty.
* The app is opened at `/`.

Expected:

* User is routed to first-run setup or sees setup as the first actionable screen.
* No marketing page, hero page, product pitch, social proof, or long explanation appears before the usable setup.
* The visible copy says data is local to this browser/device.
* The visible copy does not claim encryption, cloud backup, therapy, or crisis support.

Pass if:

* User can complete setup in under 60 seconds using default choices.
* Setup creates a generic emotional space such as "某段关系" without requiring real names.
* Setup does not ask for attachment style, partner personality, trauma history, or relationship diagnosis.

#### Script 1: Setup To Home

Steps:

1. Open `/`.
2. Read the local-first privacy note.
3. Keep the default space name or enter "某段关系".
4. Choose or keep default space type.
5. Keep default daily market "普通 / 先观察" or choose "有点敏感".
6. Tap "开始使用" or "先用默认设置".

Expected Home first viewport:

* Compact top strip shows active space and daily market.
* One market note appears below the strip.
* Four primary buttons are visible:
  * "我被触发了"
  * "想检查信号"
  * "草稿自检"
  * "回到自己"
* In the first coding pass, "想检查信号" and "草稿自检" are clearly marked as "稍后支持" or open an honest placeholder.
* Secondary "记录互动" appears below primary trigger actions.
* Three compact storage-jar summaries appear after the trigger/record actions:
  * Connection / 连接
  * Self / 自己
  * Energy / 能量

Pass if:

* Home is usable on first viewport without scrolling through onboarding content.
* Home does not show a global relationship-health score, partner verdict, large balance, reward store, or "余额不足".
* Empty summaries use gentle copy rather than error states.
* P1 placeholder buttons do not create fake data or dead-end confusion.

#### Script 2: Trigger Support Without Saving

Steps:

1. From Home, tap "我被触发了".
2. On Fact screen, choose a fact chip such as "收到/没收到消息" or enter a short fact.
3. On Body / Emotion screen, choose one body chip and one emotion chip, or choose "说不清".
4. On Urge screen, choose an urge such as "想检查", "想马上解释", or "想反复看".
5. On Owned Next Action screen, choose the recommended action or one short alternative.
6. Finish without saving a record.

Expected:

* Each screen asks one main question.
* Chips appear before or alongside optional text input.
* "跳过", "说不清", or close behavior is available where precision could increase rumination.
* Completion copy does not shame the user.
* Completion offers at least:
  * return Home / close
  * "进入回到自己"
  * "保存为快速记录"

Pass if:

* The user can complete the flow without creating an Episode.
* No Connection impact is created merely from completing trigger support.
* If an account impact is created, it is Self/Energy only and has a visible reason.
* The flow never interprets the other person's psychology.

#### Script 3: Trigger Support To Quick Record

Steps:

1. From Home, open "我被触发了".
2. Complete fact, body/emotion, urge, and owned next action.
3. Choose "保存为快速记录".
4. Confirm Quick Record opens with relevant fields prefilled.
5. Add or accept:
   * title
   * fact
   * emotion/body
   * activation
   * next action
6. Leave interpretation empty or enter "我担心连接变冷".
7. Save.

Expected:

* Quick Record title indicates this is a fast save, such as "存成一条快速记录".
* Facts and interpretation are adjacent and visually distinct.
* Interpretation is allowed to be empty.
* Connection and activation are separate controls.
* Account-impact preview, if shown, explains reasons and does not use score/verdict language.

Pass if:

* Saved record appears on Home as latest record or latest-record preview.
* Home account summaries update after save.
* Connection remains 0 unless the saved record includes observable connection evidence.
* Self can increase when the user separated fact/interpretation or chose an owned next action.
* Energy reflects user-rated depletion/restoration or stays neutral.

#### Script 4: Return-To-Self Full Completion

Steps:

1. From Home, tap "回到自己".
2. Choose one body landing action, such as "喝水", "洗手/洗脸", or "脚踩地面".
3. Choose or read one anchor sentence.
4. Choose one return-to-life action, such as "洗澡", "泡一杯喝的", or "先停止分析".
5. Select energy effect:
   * "轻一点"
   * "差不多"
   * "更重"
   * "说不清"
6. Complete the flow.

Expected:

* User is never required to feel better.
* Body actions are conservative and skippable.
* Completion copy validates partial relief or no relief.
* The user can return Home.

Pass if:

* A `ReturnToSelfPractice` is saved.
* Self/Energy impacts are transparent.
* Connection impact is always 0 for this practice unless a separate observable contact episode exists.
* Home summaries update after completion.

#### Script 5: Return-To-Self Partial Completion

Steps:

1. Open "回到自己".
2. Choose only "我需要暂停" or one body landing action.
3. Skip anchor or return-to-life action if offered.
4. Tap "只保存我需要暂停" or equivalent partial completion.

Expected:

* Partial completion is treated as valid.
* Copy does not say "失败", "未完成", "任务失败", or "坚持打卡".
* User can return Home without filling the rest.

Pass if:

* App saves a partial `ReturnToSelfPractice` or closes without penalty according to user choice.
* If saved, Self/Energy impact is small and reasoned.
* No negative account impact is created for skipping.

#### Script 6: Independent Quick Record

Steps:

1. From Home, tap "记录互动".
2. Enter title: "收到一段很暖的邮件".
3. Enter fact: "对方具体回应了我提到的勇气。"
4. Enter interpretation: "我担心这份温暖会不会很快消失。"
5. Choose emotion/body chips:
   * "暖"
   * "焦虑"
   * "脑子很忙"
   * or "混合"
6. Set connection to 3.
7. Set activation to 3.
8. Choose next action: "晚点再回" or "回到自己".
9. Save.

Expected:

* The page title is "存下这次发生的事" or equivalent.
* Helper says not to rush into relationship judgment.
* Facts and interpretation remain separate.
* Connection and activation can both be high.

Pass if:

* Record saves successfully.
* Home latest record preview updates.
* Account summaries update:
  * Connection can increase because there is observable being-seen evidence.
  * Self can increase because fact/interpretation separation and owned next action are present.
  * Energy can decrease or remain neutral based on saved effect.
* Copy does not state that warmth proves future safety, commitment, or permanence.

#### Script 7: Persistence After Refresh

Steps:

1. Complete setup.
2. Save at least one Quick Record.
3. Complete at least one Return-To-Self practice.
4. Refresh the browser.
5. Reopen `/`.

Expected:

* User remains past setup.
* Active space and daily market persist.
* Latest record preview persists.
* Account summaries remain consistent with saved impacts.
* No duplicated records or duplicated account impacts appear after refresh.

Pass if:

* Derived summaries after refresh match summaries before refresh.
* The app does not crash if optional fields are missing.
* A storage-unavailable warning appears only if storage actually fails.

#### Script 8: Minimal Settings Reset

Steps:

1. From Home, open Settings.
2. Read local-first privacy copy.
3. Open delete/reset local data.
4. Cancel once.
5. Reopen delete/reset local data.
6. Confirm deletion.
7. Return to app.

Expected:

* Settings states:
  * data is stored in this browser/device
  * it is not uploaded or synced in MVP
  * anyone with access to the unlocked device/browser profile may see it
  * clearing browser data may delete it
* Delete confirmation explains that records and account sources will be removed.
* Confirmation is deliberate and not a single accidental tap.

Pass if:

* Cancel preserves data.
* Confirm clears local app data.
* App returns to setup after deletion.
* No recovery, cloud backup, encryption, or clinical confidentiality promise is shown.

#### Script 9: P0 Exclusion Checks

During P0 QA, verify these are absent or disabled:

* Account Detail route as a required flow.
* Personal Action Menu.
* Topics / discovery point management.
* Experiments.
* Signal Check implementation beyond disabled/placeholder button behavior.
* Draft Self-Check implementation beyond disabled/placeholder button behavior.
* Rich Incoming Message Review.
* P2 psychological branches.
* AI analysis, automatic chat import, message rewriting, partner psychology inference, or external app monitoring.
* Reward store, streaks, point costs, or redemption for another person's behavior.

Pass if:

* P1/P2 buttons, if visible on Home, are either implemented later or use honest placeholder copy such as "稍后支持".
* Placeholder buttons do not create fake data, fake scores, or dead-end confusion.
* The P0 app still feels complete enough through Trigger Support, Return-To-Self, Quick Record, Home summaries, and Settings reset.

Rationale:

* This cut protects the trigger-first MVP from becoming a broad reflection archive before the urgent loop works.
* It gives implementation a small vertical slice with real persistence, account derivation, and mobile UI.
* It keeps the deeper psychological material in the PRD but prevents it from blocking the first usable app.

### First Release Navigation

* Bottom navigation should have five tabs:
  * Home
  * Record
  * Topics
  * Experiments
  * Settings
* Account Detail / Ledger should not be a bottom tab in the first release. It should open from Home account cards.
* Emergency / Return flows should be route/modal stack entries from Home and completion screens, not a persistent tab.
* Archive can live inside Settings for the first release.

### Home First View

The first mobile viewport should contain, in order:

1. Active space + daily market compact strip.
2. One market note.
3. Primary trigger panel with four buttons:
   * 我被触发了
   * 想检查信号
   * 草稿自检
   * 回到自己
4. Secondary action: "记录互动".
5. Compact storage-jar summaries for Connection / Self / Energy.

Below the first viewport:

* latest record
* active experiment card
* one anchor
* recent discovery points

### P0 Required Surfaces

* First-run setup:
  * local-first privacy note
  * one emotional space
  * default daily market
* Home:
  * trigger-first layout
  * account summaries
  * latest record
* "我被触发了":
  * fact
  * body/emotion
  * urge
  * owned next action
  * completion with save quick record / Return-to-Self
* "回到自己":
  * body landing
  * anchor
  * return-to-life action
  * partial completion
* Quick record:
  * title
  * facts
  * interpretation
  * emotion/body
  * connection/activation
  * next action
* Local persistence:
  * records
  * spaces
  * accounts
  * anchors
  * topics as empty reserved collection only; no P0 UI required
  * experiments as empty reserved collection only; no P0 UI required
  * drafts

### P0 First-Build Screen Specs

These specs are the implementation target for the first usable vertical slice. They intentionally repeat a small amount of earlier product logic so the P0 build can be started without rereading the full PRD.

#### P0.1 First-Run Setup

Purpose:

* Establish local-first privacy expectations before the user enters sensitive content.
* Create the minimum state needed for Home to work.

Required content:

* Short privacy note:
  * data is stored locally in this browser/device
  * anyone with access to the unlocked device/browser profile may see it
  * deleting browser data may delete records
  * this is a self-reflection tool, not therapy or crisis support
* Emotional space setup:
  * default name: "某段关系"
  * optional type choice: "我和别人" / "我和自己"
  * optional intention text
* Daily market setup:
  * default: "普通 / 先观察"
  * optional chips: calm, tired, sensitive, sleep-deprived, triggered, fulfilled, lonely, high-expectation, low-energy

Primary actions:

* "开始使用"
* "先用默认设置"

Persisted output:

* `EmotionalSpace`
* `activeSpaceId`
* today's `DailyMarketState`
* `Settings.hasCompletedSetup = true`

Do not include:

* attachment-style questions
* partner/personality diagnosis
* onboarding course
* account balance explanation longer than one short paragraph

#### P0.2 Home

Purpose:

* Give the user a one-tap entry when emotionally activated.
* Show the storage-jar state without making balance checking the primary behavior.

First viewport order:

1. Compact top strip:
   * active space name
   * today's market chip
2. Market note:
   * one sentence based on daily market
   * example: "今天不适合做重大结论，先存下事实。"
3. Primary trigger panel:
   * "我被触发了"
   * "想检查信号"
   * "草稿自检"
   * "回到自己"
4. Secondary action:
   * "记录互动"
5. Compact storage-jar summaries:
   * Connection
   * Self
   * Energy

Below first viewport:

* latest record
* active experiment, if any
* one anchor
* recent discovery points

Interaction rules:

* account cards open `/accounts/:account`
* "记录互动" opens `/record`
* "我被触发了" and "回到自己" open their flow routes
* in P0, "想检查信号" and "草稿自检" show honest "稍后支持" placeholder behavior unless implemented in a later phase
* empty state should invite one small action, not full setup

Do not include:

* large global balance
* relationship health score
* partner verdict
* reward store
* "收到长消息" as a fifth primary emergency button

#### P0.3 "我被触发了"

Purpose:

* Interrupt the stimulus -> guessing -> checking / over-explaining -> rumination loop.
* Help the user reach one owned next action without requiring a full episode.

Step structure:

1. Fact:
   * prompt: "发生了什么可确认的事？"
   * chips before text input
   * helper: "只写摄像头能拍到的部分，不读心。"
2. Body / emotion:
   * prompt: "现在身体和情绪是什么？"
   * body chips, broad emotion chips, optional intensity
   * allow "混合" and "说不清"
3. Urge:
   * prompt: "我现在最想做什么？"
   * examples: check, reply immediately, reread, explain, withdraw, ask for reassurance, rescue, accuse
4. Owned next action:
   * prompt: "我选择一个能把我带回自己的下一步"
   * one recommended action with reason
   * alternatives kept short

Completion options:

* "完成"
* "进入回到自己"
* "保存为快速记录"
* "继续完整记录"
* "去草稿自检"

Persisted output:

* no object if user closes without saving
* optional quick `Episode`
* optional `ReturnToSelfPractice` if routed and completed
* optional `AccountImpact[]` only when an owned action or saved record supports it

Account rules:

* completing the four-step flow and choosing one owned next action can create Self +1
* no automatic Connection impact
* Energy is user-rated or defaults to 0
* continuing to check or send is allowed and should not create penalty points

Do not include:

* AI interpretation
* partner diagnosis
* trauma-source analysis
* forced branch completion
* penalty for acting impulsively

#### P0.4 "回到自己"

Purpose:

* Provide the common stabilizing path for high activation.
* Let the user complete partially without failure language.

Step structure:

1. Body landing:
   * prompt: "先让身体有一个落点。"
   * actions: drink water, wash hands/face, stand/walk 1 minute, look outside, hold something soft, five-senses observation, slow breath, relax jaw/shoulders, hand on chest, warm palm on arm, gentle self-hug
   * all actions skippable
2. Attention anchor:
   * prompt: "给注意力一个可以回来的句子。"
   * show saved anchors plus seed anchors
3. Return-to-life action:
   * prompt: "接下来 10-30 分钟，我回到哪一件现实小事？"
   * actions: eat, shower, read/study, walk, make a drink, sleep, write, tidy small area, stop analyzing for now
4. Energy effect:
   * prompt: "现在能量变化更像？"
   * choices: lighter, same, heavier, not sure

Completion options:

* "完成"
* "只保存我需要暂停"
* "保存一个身体动作"
* "回到首页"

Persisted output:

* `ReturnToSelfPractice`
* optional linked `Episode`
* `AccountImpact[]` for Self/Energy only

Account rules:

* completed flow: Self +1
* partial completion: Self +1 if the user saved a pause/body action
* Energy +1 / 0 / -1 based on user-reported effect
* Connection always 0 unless a separate observable contact episode exists

Do not include:

* biological effect claims
* intense body practices
* requirement to feel calmer
* crisis assessment or risk scoring

#### P0.5 Quick Record

Purpose:

* Save a meaningful interaction or trigger without forcing a full reflection.
* Preserve fact / interpretation separation as the core data habit.

Required fields:

* title
* facts
* interpretation
* emotion/body
* connection level 0-4
* activation level 0-4
* next action

Optional fields:

* anchor
* tags
* one later topic / discovery point
* account-impact preview

Save behavior:

* user can save with only required fields
* long text drafts should be preserved locally while editing
* saved record appears on Home latest record
* saved record updates derived account summaries

Account rules:

* Connection impact requires observable contact, self-contact, being seen, mutual listening, repair, care, or real connection evidence.
* Self impact can come from fact/interpretation separation, owned next action, boundary, delay, no-extra-message, or honest pattern recognition.
* Energy impact is based on user-rated cost/restoration.

Do not include:

* mandatory full episode fields
* automatic score from text length
* automatic emotion detection
* relationship conclusion

#### P0.6 Local Persistence And Reset

Purpose:

* Make the app usable across refresh while staying local-first and honest about privacy limits.

Required behavior:

* all P0 objects persist across page reload:
  * spaces
  * daily market
  * episodes
  * anchors
  * return-to-self practices
  * account-impact sources
  * drafts
* corrupted or missing storage falls back to setup/default state without crashing
* settings include reset/delete data with confirmation
* reset/delete returns to first-run setup

Do not include:

* backend calls
* cloud sync
* telemetry
* crash reporting
* import/export implementation beyond placeholder copy

#### P0.7 Account Summary Rules

Purpose:

* Give Home enough feedback to make saving feel meaningful without turning the app into a score dashboard.
* Keep account movement transparent, deterministic, and tied to saved user-owned actions or observable evidence.

P0 summary inputs:

* Quick Record `AccountImpact[]`.
* Trigger Support completion only if the user saves a quick record or explicitly completes one owned next action.
* Return-To-Self completion / partial completion.
* No P0 summary should depend on hidden text analysis, message length, response timing, or external app signals.

Home display:

* Show three compact cards:
  * "连接"
  * "自己"
  * "能量"
* Each card shows:
  * qualitative status
  * small recent movement or source count if useful
  * one short reason or empty-state copy
* Numeric value is allowed only as secondary small metadata, never as the dominant Home element.
* Cards can be tappable later, but P0 does not need full account detail.

P0 qualitative labels:

* Connection:
  * empty: "还没有记录连接证据。"
  * positive: "有被看见/真实接触的时刻。"
  * neutral: "这次还不能算连接证据。"
* Self:
  * empty: "先从一个由我能做的动作开始。"
  * positive: "你把自己拿回来了一点。"
  * neutral: "先看见，也算开始。"
* Energy:
  * empty: "记录后会看见消耗和恢复。"
  * restored: "有一点恢复。"
  * depleted: "这次比较消耗，适合轻动作。"
  * neutral: "能量变化不明显。"

P0 derived summary shape:

`deriveAccountSummary(state, account, spaceId)` should return a derived object, not persisted state:

```ts
type AccountSummary = {
  account: "connection" | "self" | "energy";
  total: number;
  recentTotal: number;
  sourceCount: number;
  recentSourceCount: number;
  qualitativeState:
    | "empty"
    | "positive"
    | "mixed"
    | "neutral"
    | "depleted"
    | "restored";
  label: string;
  subtitle: string;
  latestReason?: string;
  latestEvidence?: string;
  latestSourceId?: string;
};
```

Summary calculation rules:

* `total`: sum persisted non-zero impacts for the selected account and space.
* `recentTotal`: sum persisted non-zero impacts from the latest 7 days or latest 7 sources, whichever is easier in P0. Choose one rule and keep it deterministic.
* `sourceCount`: number of persisted non-zero impacts for the account.
* `recentSourceCount`: number of recent persisted non-zero impacts for the account.
* `latestReason`: reason copy from the most recent relevant impact.
* 0-value explanations such as `no_connection_evidence` and `energy_neutral` should not lower totals.
* Summaries should be recomputed on render or selector call, not saved as authoritative balances.
* `mixed` is reserved for P1/P2 when account detail can show richer source composition. P0 Home should prefer `positive`, `restored`, `depleted`, `neutral`, or `empty` so the copy stays simple.

Qualitative state rules:

| Account | Condition | qualitativeState | Home subtitle |
|---|---|---|---|
| Connection | no persisted positive Connection impacts | `empty` | "还没有记录连接证据。" |
| Connection | recentTotal > 0 | `positive` | "有被看见/真实接触的时刻。" |
| Connection | total > 0 but recentTotal = 0 | `neutral` | "曾经存下过连接证据，最近先继续观察。" |
| Self | no persisted Self impacts | `empty` | "先从一个由我能做的动作开始。" |
| Self | recentTotal > 0 | `positive` | "你把自己拿回来了一点。" |
| Self | total > 0 but recentTotal = 0 | `neutral` | "这里记录选择和边界，不评价你够不够好。" |
| Energy | no persisted Energy impacts | `empty` | "记录后会看见消耗和恢复。" |
| Energy | recentTotal > 0 | `restored` | "有一点恢复。" |
| Energy | recentTotal < 0 | `depleted` | "这次比较消耗，适合轻动作。" |
| Energy | recentTotal = 0 and sourceCount > 0 | `neutral` | "能量变化不明显。" |

Home metadata rules:

* Allowed metadata:
  * "来自 1 条记录"
  * "最近 +1"
  * "最近比较消耗"
  * latest reason copy
* Avoid metadata:
  * "净值"
  * "收益"
  * "亏损"
  * "等级"
  * "关系健康"
  * "余额不足"
* If a number appears on Home, it must be smaller than the qualitative subtitle and should not dominate the card.
* The most important Home feedback is the reason sentence, not the total.

P0 impact rules:

| Source | Condition | Connection | Self | Energy | Reason copy |
|---|---:|---:|---:|---:|---|
| Quick Record | observable being-seen / real contact evidence | +1 | 0 or +1 | user-rated | "有一条可观察的被看见/真实接触证据。" |
| Quick Record | fact and interpretation both saved distinctly | 0 | +1 | 0 | "你把事实和解释分开了。" |
| Quick Record | owned next action selected | 0 | +1 | 0 | "你选择了一个由自己能完成的下一步。" |
| Quick Record | high activation or depletion marked | 0 | 0 | -1 | "这次明显消耗你。" |
| Quick Record | restorative effect marked | 0 | 0 | +1 | "这次给你留了一点恢复空间。" |
| Trigger Support | completed without saving, owned action selected | 0 | +1 | 0 | "你在被触发时选了一个自己的动作。" |
| Return-To-Self | full completion | 0 | +1 | by effect | "你完成了一次回到自己的动作。" |
| Return-To-Self | partial completion / pause saved | 0 | +1 | 0 | "你看见自己需要暂停。" |
| Placeholder / P1 button | "稍后支持" only | 0 | 0 | 0 | no impact |

Connection guardrails:

* Connection +1 requires a saved observable evidence field or explicit user selection that names real contact / being seen / mutual listening / care / repair / self-contact.
* Connection does not increase from:
  * hope
  * fantasy
  * waiting
  * checking
  * saving a discovery point
  * completing Return-To-Self
  * choosing a personal action
  * receiving no new observable information
* High connection and high activation can coexist; do not turn them into a safety guarantee.

Self guardrails:

* Self reflects agency, boundary, responsibility split, fact/interpretation separation, reduced self-attack, or user-owned next action.
* Self is not a self-worth, attractiveness, lovability, maturity, or "am I good enough" score.
* Self should never decrease in P0 because the user skipped, checked, did not feel better, or left a flow incomplete.

Energy guardrails:

* Energy is user-rated or derived only from explicit saved effect choices.
* Energy can decrease when a saved event is marked clearly depleting.
* Failed or skipped practices do not create Energy penalties.
* Energy low copy should suggest lighter action, not failure.

P0 account summary acceptance:

* [ ] Account summaries are derived from saved impacts, not manually stored balances.
* [ ] Home account cards show qualitative status before any number.
* [ ] Connection never increases from Return-To-Self alone.
* [ ] Fact/interpretation split can create Self +1 with visible reason.
* [ ] High activation can coexist with high Connection without producing a safety guarantee.
* [ ] Skips, placeholders, and unfinished flows create no negative account impact.
* [ ] P0 summaries avoid "关系分数", "余额不足", "收益/亏损", "兑换", "值得被爱", or partner-verdict language.

#### P0 Data Write Contract

Purpose:

* Make every P0 write explicit before implementation.
* Prevent accidental hidden scoring, duplicate impacts, or fake data from placeholder routes.
* Keep persisted data small, local, and explainable.

Root persisted object:

* `schemaVersion`
* `spaces`
* `activeSpaceId`
* `dailyMarkets`
* `episodes`
* `returnToSelfPractices`
* `anchors`
* `drafts`
* `topics` as empty reserved collection in P0
* `experiments` as empty reserved collection in P0
* `personalActions` as empty reserved collection in P0
* `settings`

P0 write rules by surface:

| Surface | User action | Writes | Must not write |
|---|---|---|---|
| First-run setup | complete setup | `EmotionalSpace`, `activeSpaceId`, today's `DailyMarketState`, `Settings.hasCompletedSetup` | `Episode`, `AccountImpact`, diagnosis labels |
| Home | view dashboard | no write, except optional daily market edit if implemented | fake summaries, fake records, P1 placeholder data |
| P1 placeholder button | tap "想检查信号" or "草稿自检" in P0 | no persistent write | `Episode`, `Draft`, `AccountImpact`, `LaterTopic` |
| Trigger Support | close before completion | no persistent write unless draft autosave is explicitly implemented | account impact, episode |
| Trigger Support | complete owned next action without saving record | optional lightweight trigger completion event or Self impact source | Connection impact, partner inference |
| Trigger Support | save quick record | `Episode` with source `trigger_support`, account impacts derived from saved fields | duplicate trigger impact if the episode already contains the Self impact |
| Return-To-Self | full completion | `ReturnToSelfPractice`, Self/Energy impacts | Connection impact |
| Return-To-Self | partial completion | `ReturnToSelfPractice` with partial completion marker, optional Self impact | failure/penalty impact |
| Quick Record | save record | `Episode`, `AccountImpact[]`, optional `anchor` | hidden AI summary, relationship verdict |
| Quick Record | close with meaningful text | optional local `Draft` if autosave is implemented | account impact |
| Minimal Settings | reset/delete confirmed | clears local root state and returns to setup/defaults | remote deletion call, recovery promise |

ID and timestamp rules:

* Every persisted object uses a stable `id`.
* Prefer `crypto.randomUUID()` where available.
* Every persisted object has `createdAt` and `updatedAt`.
* Completion timestamps should use `completedAt` where the model has one.
* Derived account summaries are not persisted.

Episode source contract:

P0 `Episode` should include a `source` or equivalent field with one of:

* `quick_record`
* `trigger_support`
* `return_to_self_linked` only if a Return-To-Self practice is saved as a record-like entry

P0 required `Episode` fields:

* `id`
* `spaceId`
* `source`
* `title`
* `facts`
* `interpretation` can be empty string
* `emotions`
* `bodySensations`
* `connectionLevel`
* `activationLevel`
* `nextAction`
* `accountImpacts`
* `createdAt`
* `updatedAt`

P0 optional `Episode` fields:

* `anchor`
* `tags`
* `returnToSelfPracticeId`
* `draftId`

P0 should not require full-model fields such as:

* initiation
* stages
* outcome
* currentMeaning
* unsupportedConclusions
* linked topics
* linked experiments
* rich incoming review
* P2 branch outputs

AccountImpact contract:

P0 `AccountImpact` should include:

* `id` or stable source-local key
* `sourceType`: `episode` / `return_to_self` / `trigger_completion`
* `sourceId`
* `account`: `connection` / `self` / `energy`
* `value`: -1 / 0 / +1 in P0
* `reasonCode`
* `reason`
* optional `evidence`
* `createdAt`

P0 reason codes:

* `observable_connection_evidence`
* `self_contact_evidence`
* `fact_interpretation_split`
* `owned_next_action`
* `trigger_owned_action`
* `return_to_self_completed`
* `return_to_self_partial_pause`
* `energy_depleted`
* `energy_restored`
* `energy_neutral`
* `no_connection_evidence`

P0 AccountImpact reasonCode registry:

| reasonCode | Account | Value | P0 source types | Creation rule | Evidence requirement | Reason copy | Persistence rule |
|---|---|---:|---|---|---|---|---|
| `observable_connection_evidence` | `connection` | +1 | `episode` | User records observable interpersonal contact, being seen, mutual listening, repair, care, or respectful presence. | Required. Store an evidence snippet, selected evidence chip, or short user-entered note. | "有一条可观察的被看见/真实接触证据。" | Persist at most once per episode unless the UI explicitly shows multiple separate evidence rows. |
| `self_contact_evidence` | `connection` | +1 | `episode` | In a self-facing space, user records contact with their own feeling, need, body, value, rhythm, or present reality. | Required. Must be explicit user selection or text, not inferred from generic emotion selection alone. | "你和自己的感受/需要有了一点真实接触。" | Persist at most once per episode. Do not also create `observable_connection_evidence` for the same self-contact evidence. |
| `fact_interpretation_split` | `self` | +1 | `episode` | User saves a fact separately from interpretation, or explicitly marks "暂时不解释". | Facts required. Interpretation can be text or an explicit no-interpretation choice. | "你把事实和解释分开了。" | P0 default: at most one Self impact per episode. If another Self reason is higher priority, keep this as evidence text rather than a second impact. |
| `owned_next_action` | `self` | +1 | `episode` | User saves a next action they can complete themselves, such as delay, rest, record, no extra message, one-point reply, boundary, or Return-To-Self. | Required selected action. The action must be user-owned, not a demand for the other person to respond. | "你选择了一个由自己能完成的下一步。" | P0 default: preferred Self reason for Quick Record when both fact split and owned action are present. |
| `trigger_owned_action` | `self` | +1 | `trigger_completion` | User completes "我被触发了" and chooses one owned next action without saving a Quick Record. | Required selected action. | "你在被触发时选了一个自己的动作。" | Do not persist if the user saves a Quick Record from the same trigger completion and that episode already carries `owned_next_action`. |
| `return_to_self_completed` | `self` | +1 | `return_to_self` | User completes the full Return-To-Self flow. | Required completion state `full`. | "你完成了一次回到自己的动作。" | Persist once per completed practice. Never creates Connection impact. |
| `return_to_self_partial_pause` | `self` | +1 | `return_to_self` | User saves a meaningful partial practice, such as noticed need to pause or one body landing action. | Required completion state `noticed_need` or `body_only`. | "你看见自己需要暂停。" | Persist once per partial practice. No failure or penalty if user closes without saving. |
| `energy_restored` | `energy` | +1 | `episode`, `return_to_self` | User explicitly marks the event/practice as lighter, restorative, or leaving some recovery space. | Required user-rated effect. | "这个动作让你感觉轻了一点。" | Persist once per source. Do not infer from successful completion alone. |
| `energy_neutral` | `energy` | 0 | `episode`, `return_to_self` | User marks same / not sure, or no clear energy effect is selected. | Optional user-rated effect. | "能量变化不明显。" | UI-only by default. Persist only if the source needs a visible neutral explanation. |
| `energy_depleted` | `energy` | -1 | `episode`, `return_to_self` | User explicitly marks the event/practice as clearly depleting or "更重". | Required user-rated depletion. High activation alone is not enough. | "这次明显消耗你。" | Persist once per source. Copy must suggest lighter action, not failure. |
| `no_connection_evidence` | `connection` | 0 | `episode`, `return_to_self`, `trigger_completion` | The UI needs to explain why Connection did not move. | No evidence required. | "这次还没有单独的连接证据。" | UI-only by default. For Return-To-Self, prefer not persisting any Connection impact. |

P0 generation priority:

* Do not create more than one impact per `account` per source by default.
* If multiple Self conditions are true in one Quick Record, choose one persisted Self reason in this priority:
  1. `owned_next_action`
  2. `fact_interpretation_split`
* If Trigger Support routes into Quick Record, the Quick Record `Episode` should own the Self impact. The trigger completion should not also persist `trigger_owned_action`.
* If a source has both Connection evidence and Self practice, it may create one Connection impact and one Self impact, because they explain different accounts.
* Energy is independent and can coexist with Connection and Self. A warm interaction can still be Energy -1 if the user explicitly marks it as depleting.
* 0-value impacts are explanatory, not balance movement. They should usually be rendered from rules instead of persisted.

P0 impact builder rules:

`buildQuickRecordImpacts(record)`:

* Connection:
  * create `observable_connection_evidence` when the user explicitly selects or writes observable interpersonal evidence.
  * create `self_contact_evidence` only in a self-facing space when the user explicitly selects or writes self-contact evidence.
  * otherwise create no persisted Connection impact; UI may display `no_connection_evidence` as an explanation.
* Self:
  * if `nextAction` is user-owned, create `owned_next_action`.
  * else if facts are saved and interpretation is separately saved or explicitly skipped, create `fact_interpretation_split`.
  * else create no Self impact.
* Energy:
  * if user marks lighter/restorative, create `energy_restored`.
  * if user marks clearly depleted/heavier, create `energy_depleted`.
  * if user marks same/not sure, usually create no persisted Energy impact and display `energy_neutral` only in preview.
* Never infer impacts from:
  * text length
  * sentiment
  * response speed
  * the other person's presumed intent
  * current relationship anxiety

`buildTriggerCompletionImpacts(triggerCompletion)`:

* If user closes, skips, or chooses "稍后", create no impact.
* If user completes four steps and chooses an owned next action without saving a Quick Record, create one Self impact: `trigger_owned_action`.
* If user saves a Quick Record from the trigger completion, do not persist `trigger_owned_action`; the episode should own `owned_next_action` or `fact_interpretation_split`.
* Trigger completion never creates Connection impact.
* Energy impact is absent in P0 unless the UI explicitly asks for and saves a user-rated effect.

`buildReturnToSelfImpacts(practice)`:

* If `completion = full`, create one Self impact: `return_to_self_completed`.
* If `completion = noticed_need` or `body_only` and user explicitly saves it, create one Self impact: `return_to_self_partial_pause`.
* If `completion = closed_early`, create no impact.
* Energy:
  * `lighter` -> `energy_restored`
  * `more_tired` -> `energy_depleted`
  * `same` / `not_sure` -> no persisted impact by default; preview may show `energy_neutral`
* Return-To-Self never creates Connection impact, including in self-facing spaces. It is stabilization, not connection evidence.

P0 impact preview rules:

* Preview rows must say "可能会存进哪里" or similar tentative copy before save.
* Preview must use the same builder rules as saving, not a separate looser UI-only heuristic.
* Preview can show 0-value explanations, but save should persist only meaningful movement unless a neutral row is needed for source detail.
* Preview should let the user see and understand Connection 0 without feeling rejected:
  * "这不是说没有意义，只是这次还没有单独的连接证据。"
* Preview should never say:
  * "关系变好了"
  * "关系变差了"
  * "你做得不够"
  * "余额不足"
  * "需要再多存一点"

Impact deduplication:

* One saved source should not create two impacts with the same `account` + `reasonCode` unless the UI explicitly shows two separate reasons.
* If Trigger Support routes into Quick Record, prefer the Quick Record `Episode` as the single source of account impacts.
* If Return-To-Self is saved independently, its impacts belong to `ReturnToSelfPractice`.
* If Return-To-Self is attached to an Episode, avoid duplicating Self/Energy impacts unless the UI shows both sources separately.

P0 impact builder test matrix:

| Test case | Input summary | Expected impacts |
|---|---|---|
| Quick Record with observable warm contact | facts + evidence "对方具体回应了我的勇气" + owned next action + energy same | Connection `observable_connection_evidence` +1, Self `owned_next_action` +1, no persisted Energy by default. |
| Quick Record with fact split only | facts + interpretation separated, no owned next action, no connection evidence, energy not sure | Self `fact_interpretation_split` +1 only. |
| Quick Record with owned next action and fact split | facts + interpretation + next action "晚点再回" | Self `owned_next_action` +1 only; fact split can appear as supporting evidence, not second Self impact. |
| Quick Record in self-facing space | explicit self-contact evidence "我看见自己其实很害怕" + owned next action | Connection `self_contact_evidence` +1, Self `owned_next_action` +1. |
| Quick Record with hope/fantasy only | "我希望这代表关系变好了", no observable evidence | No Connection impact; preview may show `no_connection_evidence`. |
| Quick Record marked depleting | no connection evidence + owned next action + energy "更重/消耗" | Self `owned_next_action` +1, Energy `energy_depleted` -1. |
| Quick Record marked restorative | facts + owned next action + energy "轻一点" | Self `owned_next_action` +1, Energy `energy_restored` +1. |
| Trigger complete without saving record | trigger answers + owned action "延迟 10 分钟" + no Quick Record save | Self `trigger_owned_action` +1 only. |
| Trigger saved as Quick Record | trigger answers + Quick Record save with owned next action | Episode owns Self `owned_next_action`; no separate `trigger_owned_action`. |
| Trigger closed or postponed | user closes, skips, or chooses "稍后" | No impacts. |
| Return-To-Self full, lighter | completion `full`, energyEffect `lighter` | Self `return_to_self_completed` +1, Energy `energy_restored` +1, no Connection. |
| Return-To-Self partial pause | completion `noticed_need`, no energy effect | Self `return_to_self_partial_pause` +1, no Connection, no Energy by default. |
| Return-To-Self body-only, more tired | completion `body_only`, energyEffect `more_tired` | Self `return_to_self_partial_pause` +1, Energy `energy_depleted` -1, no Connection. |
| Return-To-Self closed early | completion `closed_early` | No impacts. |
| P1 placeholder tapped | Signal Check / Draft Self-Check placeholder | No persisted write and no impacts. |

P0 impact builder acceptance:

* [ ] Unit tests cover every row in the matrix above.
* [ ] Tests assert exact `reasonCode`, `account`, and `value`, not only summary totals.
* [ ] Tests assert that unsupported conditions do not create impacts.
* [ ] Tests assert Trigger -> Quick Record deduplication.
* [ ] Tests assert Return-To-Self never creates Connection impact, including self-facing spaces.
* [ ] Tests assert 0-value explanations are not persisted by default.
* [ ] Tests assert every persisted impact has reason copy from `src/copy/accounts.ts`.

ReturnToSelfPractice contract:

P0 required fields:

* `id`
* `spaceId`
* `source`
* `completion`: `noticed_need` / `body_only` / `full` / `closed_early`
* `accountImpacts`
* `createdAt`
* `updatedAt`

P0 optional fields:

* `bodyAction`
* `anchor`
* `anchorSaved`
* `returnToLifeAction`
* `energyEffect`
* `completedAt`

Return-To-Self impact rules:

* `completion = full`: Self +1.
* `completion = noticed_need` or `body_only`: Self +1 if saved.
* `energyEffect = lighter`: Energy +1.
* `energyEffect = same` or `not_sure`: Energy 0.
* `energyEffect = more_tired`: Energy -1 only if user explicitly selected it; copy must not frame it as failure.
* Connection is always 0 / absent for Return-To-Self in P0.

Draft contract:

P0 drafts are only for preventing accidental loss of meaningful text.

* Drafts can store partial Quick Record fields.
* Drafts should be local only.
* Drafts create no account impact.
* Drafts should be deleted or marked resolved after the record is saved.
* P0 does not need Draft Self-Check drafts.

Anchor contract:

* Seed anchors can live in copy/defaults and do not need persisted IDs.
* User-saved anchors should include:
  * `id`
  * `spaceId`
  * `text`
  * optional `sourceType`
  * optional `sourceId`
  * `createdAt`
  * `updatedAt`
* Saving an anchor creates no account impact by itself in P0.

Settings reset contract:

* Reset/delete clears:
  * spaces
  * activeSpaceId
  * dailyMarkets
  * episodes
  * returnToSelfPractices
  * anchors
  * drafts
  * reserved topics/experiments/personalActions
  * settings
* After reset, app should route to setup and recreate only default app shell state.
* Reset must not leave orphan account impacts because impacts are source-owned and summaries are derived.

P0 data contract acceptance:

* [ ] Every saved impact has visible reason copy.
* [ ] Derived summaries recompute from source objects after refresh.
* [ ] No derived balance is stored as authoritative state.
* [ ] P1 placeholder taps do not write persistent data.
* [ ] Reset/delete leaves no orphan source or impact data.
* [ ] Trigger -> Quick Record does not double-count Self impact.
* [ ] Return-To-Self never creates Connection impact in P0.
* [ ] Drafts and anchors do not create account impact by themselves.

#### P0 Local Storage And Migration Contract

Purpose:

* Make local-first persistence predictable and testable.
* Keep domain logic independent from `localStorage`.
* Fail honestly when storage is unavailable instead of silently pretending records are saved.

Storage adapter interface:

```ts
type StorageStatus = "available" | "unavailable" | "corrupted" | "unsupported_version";

type LoadResult =
  | { ok: true; state: AppState; status: "available" }
  | { ok: false; fallbackState: AppState; status: StorageStatus; error?: string };

type StorageAdapter = {
  load(): LoadResult;
  save(state: AppState): { ok: true } | { ok: false; status: StorageStatus; error?: string };
  reset(): { ok: true } | { ok: false; status: StorageStatus; error?: string };
  isAvailable(): boolean;
};
```

P0 localStorage keys:

* Primary key: `mood-bank:v1:app-state`
* Optional draft key if separating drafts is simpler later: `mood-bank:v1:drafts`
* P0 should prefer one root state key unless draft write frequency creates noticeable complexity.
* Do not store derived account summaries under a separate key.

Schema version:

* P0 starts with `schemaVersion: 1`.
* `createInitialState()` returns a valid empty `AppState` with `schemaVersion: 1`.
* `migrate(raw)` should:
  * accept version 1
  * reject unknown future versions with `unsupported_version`
  * fallback for missing/corrupted data without crashing
* P0 does not need historical migrations, but the migration function should exist.

Load behavior:

* On app start:
  * call `storageAdapter.load()`
  * if ok, hydrate app state
  * if no stored data, use `createInitialState()`
  * if corrupted data, use fallback state and show a storage warning
* Corrupted data means:
  * invalid JSON
  * missing `schemaVersion`
  * unsupported schemaVersion
  * root object not matching minimum shape
* The app should not attempt to repair private user content heuristically in P0.

Save behavior:

* Save the full root state after meaningful changes:
  * setup complete
  * quick record saved
  * Return-To-Self practice saved
  * draft saved/deleted
  * settings reset/delete
* Avoid saving on every keystroke except debounced draft persistence.
* If save fails:
  * keep in-memory state for the current session if possible
  * show honest copy:
    * "现在可能无法保存到本地。你可以先复制内容，或稍后再试。"
  * do not show "已存下" if persistence failed

Reset behavior:

* `reset()` removes P0 storage keys.
* After reset, app should:
  * clear in-memory state
  * create fresh initial state
  * route to `/setup`
* If reset fails:
  * keep user on Settings
  * show copy:
    * "这次没有删成功。你可以稍后再试，或在浏览器设置里清理本网站数据。"
  * do not claim deletion succeeded.

Storage unavailable behavior:

* `isAvailable()` should fail when:
  * `localStorage` access throws
  * write/read/delete roundtrip fails
  * browser mode prevents persistence
* If unavailable at first run:
  * setup can continue only with clear warning, or app can show a blocking warning if implementation chooses.
  * recommended P0 behavior: allow exploration, but warn before saving meaningful text.
* If unavailable during Quick Record:
  * do not lose entered text.
  * offer:
    * "继续编辑"
    * "复制内容"
    * "关闭"
* If unavailable during reset:
  * explain that app could not verify deletion.

Validation minimum shape:

* `schemaVersion` is `1`.
* `spaces`, `episodes`, `returnToSelfPractices`, `anchors`, `drafts`, `topics`, `experiments`, and `personalActions` are arrays.
* `dailyMarkets` is an object.
* `settings` exists and has `hasCompletedSetup`.
* Missing reserved arrays can be defaulted to empty arrays.
* Missing source-owned optional fields should not crash route rendering.

Privacy and security limits:

* P0 local storage is not encrypted.
* P0 has no password lock.
* P0 has no backup or sync.
* P0 data can be removed by browser data clearing.
* These limits must be visible in setup and Settings.

Storage warning UI:

* Warning should be compact and actionable, not alarming.
* Use:
  * "现在可能无法保存到本地。"
  * "重要内容可以先复制出来。"
  * "查看设置"
* Avoid:
  * "数据已安全备份"
  * "绝对隐私"
  * "永久保存"

Storage tests:

* `load()` with empty storage returns initial state.
* `load()` with valid v1 state returns that state.
* `load()` with invalid JSON returns fallback state and `corrupted`.
* `load()` with future schemaVersion returns fallback state and `unsupported_version`.
* `save()` writes the root state under `mood-bank:v1:app-state`.
* `reset()` removes the root key.
* Derived account summaries after reload match summaries before reload.
* Storage failure prevents "已存下" success copy.

P0 storage acceptance:

* [ ] The app can load with empty storage.
* [ ] The app persists setup, Quick Record, and Return-To-Self across refresh.
* [ ] The app handles corrupted storage without crashing.
* [ ] Save failure is visible and does not show false success.
* [ ] Reset/delete removes local app data and routes to setup.
* [ ] No backend, telemetry, remote logging, or cloud sync is used for P0 persistence.

#### P0 App Store And Action Contract

Purpose:

* Define the React state boundary between UI flows, domain helpers, and storage.
* Prevent page components from mutating `AppState` ad hoc.
* Make persistence status visible to the UI so the app never claims data was saved when storage failed.

Recommended store shape:

```ts
type AppStoreStatus =
  | "loading"
  | "ready"
  | "saving"
  | "save_error"
  | "storage_warning"
  | "resetting"
  | "reset_error";

type AppStore = {
  state: AppState;
  status: AppStoreStatus;
  storageStatus: StorageStatus | "available";
  lastError?: string;
  lastSavedAt?: string;
  actions: AppActions;
};
```

Store ownership rules:

* `appStore` owns the root `AppState` object and calls `StorageAdapter`.
* Domain modules build new objects and impacts, but do not call storage directly.
* Route components and flow components call typed store actions, not `localStorage`.
* Flow-local answers stay in flow state until the user explicitly saves/completes.
* Derived account summaries are selectors over `state`, not saved store fields.

Required P0 store actions:

```ts
type AppActions = {
  completeSetup(input: SetupInput): StoreWriteResult;
  updateDailyMarket(input: DailyMarketInput): StoreWriteResult;
  saveQuickRecord(input: QuickRecordInput): StoreWriteResult<Episode>;
  saveReturnToSelfPractice(input: ReturnToSelfInput): StoreWriteResult<ReturnToSelfPractice>;
  saveTriggerCompletion(input: TriggerCompletionInput): StoreWriteResult | StoreNoWriteResult;
  saveDraft(input: DraftInput): StoreWriteResult<Draft>;
  deleteDraft(draftId: string): StoreWriteResult;
  resetLocalData(): StoreWriteResult;
  acknowledgeStorageWarning(): void;
};

type StoreWriteResult<T = void> =
  | { ok: true; value?: T; savedAt: string }
  | { ok: false; status: StorageStatus; error?: string; inMemoryOnly?: boolean };

type StoreNoWriteResult = {
  ok: true;
  kind: "no_write";
  reason: "closed" | "placeholder" | "not_saved" | "skipped";
};
```

Action responsibilities:

| Action | Builds / validates | Writes persistent data? | On save failure |
|---|---|---:|---|
| `completeSetup` | `EmotionalSpace`, daily market, `Settings.hasCompletedSetup` | Yes | Keep input visible; do not route to saved Home as if persistence succeeded unless explicit temporary mode is shown. |
| `updateDailyMarket` | Today's `DailyMarketState` | Optional yes | Keep old market or show unsaved warning; no emotional penalty. |
| `saveQuickRecord` | `Episode`, `AccountImpact[]`, optional draft resolution | Yes | Keep form answers in memory/draft; show save error; do not show "已经存下". |
| `saveReturnToSelfPractice` | `ReturnToSelfPractice`, Self/Energy impacts | Yes | Show "这次还没有存下"; allow returning Home only as unsaved completion if user chooses. |
| `saveTriggerCompletion` | Optional `trigger_completion` Self impact when no Quick Record is saved | Optional yes | If save fails, show no false success; if no write intended, return `no_write`. |
| `saveDraft` | Local `Draft` for meaningful text | Yes | Keep text in current component; show draft not saved copy. |
| `deleteDraft` | Remove resolved/abandoned draft | Yes | Keep draft listed if deletion fails. |
| `resetLocalData` | Clear root state through adapter reset | Yes | Stay on Settings; do not clear UI until reset succeeds. |
| `acknowledgeStorageWarning` | UI acknowledgement only | No | n/a |

Save sequencing rules:

* Build the next `AppState` in memory first.
* Call `storageAdapter.save(nextState)`.
* If save succeeds:
  * commit `state = nextState`
  * set `status = ready`
  * set `lastSavedAt`
  * return `{ ok: true }`
* If save fails:
  * keep enough in-memory data to prevent immediate user loss
  * set `status = save_error` or `storage_warning`
  * return `{ ok: false }`
  * do not show saved completion copy
* P0 should prefer the conservative UX: persistence success is required before showing "已经存下".

No-write action rules:

* These events must return `no_write` and not call `storageAdapter.save()`:
  * viewing Home
  * tapping P1 placeholders
  * closing a flow before meaningful save
  * skipping a step
  * choosing "稍后" without save
  * opening account detail placeholder
* These events can update in-memory route/flow state but must not mutate root `AppState`.

Draft handling rules:

* Drafts are only for preventing accidental loss of meaningful text.
* Draft writes should be debounced if connected to text input.
* Drafts must not create account impacts.
* Saving a Quick Record from a draft should either:
  * delete the draft after episode save succeeds, or
  * mark it resolved if deletion would risk losing recovery context.
* If episode save succeeds but draft deletion fails, the saved episode remains valid; show a low-priority cleanup warning, not a failed save.

Store selector contract:

Recommended selectors:

* `selectActiveSpace(state)`
* `selectTodayMarket(state, spaceId)`
* `selectLatestEpisode(state, spaceId)`
* `selectRecentAnchors(state, spaceId)`
* `selectDraftById(state, draftId)`
* `selectAccountSummary(state, account, spaceId)`
* `selectAllAccountSummaries(state, spaceId)`
* `selectStorageWarning(store)`

Selector rules:

* Selectors must be pure and must not write storage.
* Account selectors call `collectAccountImpacts` / `deriveAccountSummary`.
* Selectors must tolerate missing reserved arrays and corrupted fallback defaults.

Store action test matrix:

| Test case | Setup | Action | Expected |
|---|---|---|---|
| Setup save succeeds | empty initial state, adapter save ok | `completeSetup(defaultInput)` | state has space + setup complete, status `ready`, result ok, savedAt set. |
| Setup save fails | adapter save returns unavailable | `completeSetup(defaultInput)` | result not ok, status `save_error` or `storage_warning`, UI must not claim setup is saved. |
| Quick Record save succeeds | setup complete | `saveQuickRecord(validInput)` | episode appended, impacts built, draft resolved if present, saved success allowed. |
| Quick Record save fails | adapter save fails | `saveQuickRecord(validInput)` | episode not committed as persisted success, user input recoverable, "已经存下" forbidden. |
| Return-To-Self save succeeds | setup complete | `saveReturnToSelfPractice(fullInput)` | practice appended, Self/Energy impacts built, Connection absent. |
| Trigger no-write close | trigger flow closed before save | `saveTriggerCompletion(closedInput)` | `no_write`, adapter save not called. |
| Trigger completion saved | owned action, no Quick Record | `saveTriggerCompletion(completedInput)` | Self `trigger_owned_action` stored if implementation chooses trigger source persistence. |
| P1 placeholder tap | Home placeholder action | placeholder handler / `no_write` | no state mutation, adapter save not called. |
| Draft save succeeds | meaningful text | `saveDraft(input)` | draft stored, no impacts. |
| Draft save fails | adapter save fails | `saveDraft(input)` | text remains in component memory, no false draft-saved copy. |
| Reset succeeds | existing data | `resetLocalData()` | adapter reset ok, in-memory state becomes fresh initial state, route can go setup. |
| Reset fails | existing data, adapter reset fails | `resetLocalData()` | state remains, status `reset_error`, Settings shows failure copy. |
| Selector after reload | saved episodes/practices loaded | `selectAllAccountSummaries` | summaries match pre-reload derived summaries. |

Store action acceptance:

* [ ] Page components do not call `localStorage` directly.
* [ ] All persisted P0 writes go through typed store actions.
* [ ] Save success UI appears only after `StorageAdapter.save()` succeeds.
* [ ] Save failure leaves user-entered content recoverable in memory where possible.
* [ ] P1 placeholders return `no_write`.
* [ ] Drafts never create account impacts.
* [ ] Reset/delete does not clear in-memory app state until adapter reset succeeds.
* [ ] Account summaries are exposed through selectors, not stored as root state.

#### P0 Flow State Machine Contract

Purpose:

* Make P0 flows implementable as small reducers or state-machine-like components.
* Ensure close, skip, partial completion, save, and route-to-next behavior are consistent.
* Keep activated-use flows predictable and testable.

Shared P0 flow state:

```ts
type P0FlowState<StepId extends string, Answers> = {
  flowId: string;
  source: "home" | "trigger_support" | "return_to_self" | "quick_record";
  currentStep: StepId;
  history: StepId[];
  answers: Partial<Answers>;
  startedAt: string;
  updatedAt: string;
  activationLevel?: 0 | 1 | 2 | 3 | 4;
  canGoBack: boolean;
  canClose: boolean;
  canComplete: boolean;
  recommendedNext?: {
    action: string;
    reason: string;
  };
};
```

Shared actions:

* `answer(stepId, value)`
* `next()`
* `back()`
* `skip(stepId)`
* `close()`
* `complete(mode)`
* `saveDraft()` only for long text surfaces
* `saveRecord()` only for Quick Record or trigger-to-record path
* `routeToReturnToSelf()`

Shared rules:

* `close()` never creates account impact.
* `skip(stepId)` never creates negative impact.
* `complete(mode)` can create impact only when the mode maps to an explicit completed/partial action.
* Flow state can be in memory by default.
* Only long text fields need draft persistence.
* Each flow must expose a clear completion object, even when it writes no persistent data.

Shared completion result:

```ts
type P0CompletionResult =
  | {
      kind: "no_write";
      reason: "closed" | "placeholder" | "not_saved";
    }
  | {
      kind: "trigger_completed";
      sourceType: "trigger_completion";
      accountImpacts: AccountImpact[];
    }
  | {
      kind: "return_to_self_saved";
      practice: ReturnToSelfPractice;
    }
  | {
      kind: "episode_saved";
      episode: Episode;
    }
  | {
      kind: "draft_saved";
      draft: Draft;
    };
```

##### Trigger Support State Machine

Step ids:

* `fact`
* `body_emotion`
* `urge`
* `owned_next_action`
* `completion`

Answers:

```ts
type TriggerSupportAnswers = {
  fact?: string;
  factChip?: string;
  bodySensations?: string[];
  emotionFamilies?: EmotionFamily[];
  intensity?: 0 | 1 | 2 | 3 | 4;
  urge?: "check" | "reply_now" | "reread" | "explain" | "withdraw" | "ask_reassurance" | "rescue" | "accuse" | "control" | "not_sure";
  ownedNextAction?: string;
  wantsToSaveRecord?: boolean;
};
```

Step transitions:

| Current | Primary action | Next | Can skip? | Completion allowed? |
|---|---|---|---:|---:|
| `fact` | "继续" | `body_emotion` | yes, with "说不清" | no |
| `body_emotion` | "继续" | `urge` | yes | no |
| `urge` | "继续" | `owned_next_action` | yes | no |
| `owned_next_action` | "就这个" | `completion` | no, but "暂时没有" is allowed | yes |
| `completion` | route / save / close | end | n/a | yes |

Minimum completion:

* `fact` or `factChip`, unless user chose "说不清".
* at least one body/emotion marker or "说不清".
* `urge` or "not_sure".
* `ownedNextAction` or "暂时没有".

Completion modes:

* `close_no_write`
  * returns `no_write`.
* `complete_owned_action`
  * returns `trigger_completed` with optional Self +1.
* `save_quick_record`
  * opens Quick Record with prefilled answers.
  * does not also persist trigger impact unless Quick Record is abandoned and user explicitly completes owned action.
* `route_return_to_self`
  * opens Return-To-Self with source `trigger_support`.
* `placeholder_draft_check`
  * P0 only: returns `no_write` and shows "稍后支持" if Draft Self-Check is not implemented.

Trigger Support reducer acceptance:

* [ ] User can go back one step without losing answers.
* [ ] Closing before completion creates no persistent object.
* [ ] Saving a quick record does not double-count Self impact.
* [ ] "说不清" and "暂时没有" allow completion without shame.
* [ ] P0 does not route to real Draft Self-Check unless P1 is implemented.

##### Return-To-Self State Machine

Step ids:

* `body_landing`
* `anchor`
* `return_to_life`
* `energy_effect`
* `completion`

Answers:

```ts
type ReturnToSelfAnswers = {
  bodyAction?: BodyLandingAction;
  fiveSensesChoice?: FiveSensesChoice;
  anchor?: string;
  anchorSaved?: boolean;
  returnToLifeAction?: ReturnToLifeAction;
  energyEffect?: "lighter" | "same" | "more_tired" | "not_sure";
};
```

Step transitions:

| Current | Primary action | Next | Can skip? | Partial save? |
|---|---|---|---:|---:|
| `body_landing` | "继续" | `anchor` | yes | yes, as `body_only` if body action selected |
| `anchor` | "带着这句继续" | `return_to_life` | yes | yes, as `noticed_need` |
| `return_to_life` | "继续" | `energy_effect` | yes | yes |
| `energy_effect` | "完成" | `completion` | yes, "说不清" | yes |
| `completion` | "回到首页" | end | n/a | already saved or no-write |

Completion modes:

* `noticed_need`
  * user chooses "只保存我需要暂停".
  * Self +1 if persisted.
* `body_only`
  * user saves one body landing action.
  * Self +1 if persisted.
* `full`
  * body/anchor/return-to-life path completed enough.
  * Self +1.
  * Energy from user-reported `energyEffect`.
* `closed_early`
  * no write unless user explicitly saves partial.

Return-To-Self reducer acceptance:

* [ ] Partial completion is available from the first step after one meaningful selection.
* [ ] "更重" does not block completion.
* [ ] `energyEffect = more_tired` can create Energy -1 only through explicit user selection.
* [ ] Connection impact is never created.
* [ ] Closing before save creates no penalty.

##### Quick Record State Machine

For P0, Quick Record can be implemented as one scrollable form rather than multi-step. It still needs a state contract.

Modes:

* `independent`
* `from_trigger`
* `from_return_to_self`

Form state:

```ts
type QuickRecordFormState = {
  mode: "independent" | "from_trigger" | "from_return_to_self";
  title: string;
  facts: string;
  interpretation: string;
  emotionFamilies: EmotionFamily[];
  bodySensations: string[];
  connectionLevel?: 0 | 1 | 2 | 3 | 4;
  activationLevel?: 0 | 1 | 2 | 3 | 4;
  nextAction: string;
  anchor?: string;
  hasObservableConnectionEvidence: boolean;
  energyEffect?: "restored" | "neutral" | "depleted" | "not_sure";
  draftId?: string;
};
```

Save eligibility:

* Required:
  * title or auto-generated title
  * facts or explicit "说不清"
  * emotion/body marker or "说不清"
  * connection level or "说不清" mapped to 0 with reason
  * activation level or "说不清" mapped to 0 with reason
  * next action or "暂时没有"
* Optional:
  * interpretation
  * anchor
  * energy effect

Save behavior:

* `independent`
  * creates `Episode.source = "quick_record"`.
* `from_trigger`
  * creates `Episode.source = "trigger_support"`.
  * absorbs eligible trigger Self impact into episode impacts.
* `from_return_to_self`
  * P0 should prefer saving `ReturnToSelfPractice` directly.
  * if saved as Episode, `Episode.source = "return_to_self_linked"` and Connection impact remains absent/0.

Quick Record reducer acceptance:

* [ ] Save is possible with interpretation empty.
* [ ] Facts and interpretation are stored separately.
* [ ] Connection/activation are stored separately.
* [ ] Observable connection evidence is a deliberate field/selection, not inferred from high connection alone.
* [ ] Closing with meaningful text offers draft save.
* [ ] Draft save creates no account impact.

##### Minimal Settings State Machine

Step ids:

* `settings_home`
* `confirm_delete`
* `final_confirm_delete`
* `deleted`

Transitions:

| Current | Action | Next | Write |
|---|---|---|---|
| `settings_home` | "删除本地数据" | `confirm_delete` | none |
| `confirm_delete` | "取消" | `settings_home` | none |
| `confirm_delete` | "继续删除" | `final_confirm_delete` | none |
| `final_confirm_delete` | "取消" | `settings_home` | none |
| `final_confirm_delete` | "删除并回到初始状态" | `deleted` -> `/setup` | clear root state |

Settings reducer acceptance:

* [ ] Cancel at either confirmation step preserves all data.
* [ ] Confirm clears local data and routes to setup.
* [ ] Reset does not call a backend.
* [ ] Reset does not claim recovery is possible.

P0 reducer/test mapping:

* `src/flows/trigger/triggerReducer.ts`
  * tests: completing owned action, close no-write, trigger-to-quick-record prefill, no duplicate Self impact.
* `src/flows/returnToSelf/returnToSelfReducer.ts`
  * tests: full completion, partial completion, "more_tired" energy effect, no Connection impact.
* `src/routes/QuickRecord.tsx` can start with local component state, but derivation should call:
  * `src/domain/episodes.ts`
  * `src/domain/accounts.ts`
  * tests: empty interpretation allowed, observable evidence required for Connection, draft no-impact.
* `src/routes/Settings.tsx`
  * tests: cancel preserves data, confirm clears state, routes to setup.
* Domain tests should assert reducer outputs before UI tests assert button behavior.

### P0 UI Blueprint And Microcopy

This section defines the first-build interface shape. It should be treated as the practical UI brief for the initial implementation.

#### UI Design Read

Design read, adapted from `design-taste-frontend`:

* Page kind: mobile-first product UI / local PWA, not a marketing landing page.
* Audience: one person using the app while emotionally activated, tired, uncertain, or trying not to ruminate.
* Vibe: quiet, tactile, private, steady, emotionally safe.
* Design family: small custom product UI system, closer to a calm pocket tool than a dashboard, therapy portal, or playful game.
* Dials for this product:
  * `DESIGN_VARIANCE: 4` - predictable enough for activated use, with small tactile asymmetry only where it improves hierarchy.
  * `MOTION_INTENSITY: 2` - mostly static; motion is limited to press feedback, step transitions, and saved-state feedback.
  * `VISUAL_DENSITY: 5` - denser than a landing page, lighter than a dashboard.

How to apply the `design-taste-frontend` skill here:

* Use its anti-default discipline: no generic AI-purple gradients, no fake dashboards, no decorative blobs, no excessive cards, no performative microcopy.
* Use its product-quality checks: state coverage, button contrast, form labels, explicit mobile fallback, reduced motion, dark-mode/token readiness.
* Do not apply landing-page-specific rules that conflict with this being a real app:
  * no hero section
  * no large marketing image requirement
  * no social proof/logo wall
  * no scrolltelling, marquee, or portfolio-style composition

UI system decisions:

* Use one theme family across the app; do not invert section themes mid-page.
* Use semantic color tokens rather than ad hoc colors in components.
* Use one corner-radius rule:
  * cards and panels: 8px
  * chips and compact buttons: 999px or a consistent pill style
  * text inputs: 8px
* Use one icon family. If implementation adds icons, check existing project dependencies first, choose one family, and avoid hand-rolled SVG paths.
* Every interactive component needs states:
  * default
  * pressed
  * selected
  * disabled
  * focus-visible
  * loading/saving when persistence is involved
  * error or unavailable state where relevant

#### P0 Visual Direction

The P0 interface should feel like a private, steady mobile tool:

* quiet, tactile, and readable
* more like a personal pocket notebook / storage jar than a finance dashboard
* warm but not childish
* calm but not flat
* low contrast enough to feel gentle, high contrast enough to remain readable while activated

Recommended visual patterns:

* use full-width sections rather than nested cards
* reserve cards for repeated records, account summaries, and completion summaries
* keep card radius at 8px or less unless the future design system chooses otherwise
* use chips for state choices and emotion choices
* use icon buttons for simple actions such as back, close, delete, refresh, and detail
* use one primary button per flow step
* keep destructive actions in Settings or confirmation dialogs, never on the trigger-first surface

Avoid:

* banking dashboard visuals
* large numbers on Home
* childlike piggy-bank illustration as the primary identity
* reward-store layout
* heavy gradients or decorative blobs
* therapy-clinic styling or diagnostic labels

#### P0 Home Blueprint

Top strip:

* Left: active space name
  * default: "某段关系"
  * if self-facing: "我和自己"
* Right: daily market chip
  * default: "先观察"
  * examples: "有点敏感", "睡少了", "能量低", "比较安稳"
* Tap market chip:
  * opens a small selector or route for changing today's market

Market note:

* Component: one-sentence note under top strip.
* Default: "今天先存事实，结论可以慢一点。"
* Sensitive / triggered: "今天不适合做重大结论，先把自己带回来。"
* Sleep-deprived: "睡少时信号会更尖锐，先存下可确认的事。"
* High-expectation: "温暖可以被接收，但不急着变成未来保证。"
* Low-energy: "今天适合轻动作，不适合反复消耗。"

Primary trigger panel:

* Section title: "现在最需要什么？"
* Helper copy: "不用一次想清楚，先选一个入口。"
* Buttons:
  * "我被触发了"
  * "想检查信号"
  * "草稿自检"
  * "回到自己"
* Button subtitles:
  * "先停一下，抓住事实和下一步。"
  * "给确认冲动一个 10 分钟缓冲。"
  * "发送前看一眼状态和边界。"
  * "先让身体和注意力落回来。"

Secondary record entry:

* Button: "记录互动"
* Subtitle: "把这次发生的事存下来。"
* Placement: below trigger panel, visually secondary but easy to tap.

Storage-jar summaries:

* Section title: "罐子里最近存下了什么"
* Connection card:
  * label: "连接"
  * subtitle examples:
    * empty: "还没有记录连接证据。"
    * positive: "最近有被看见或真实接触的时刻。"
    * mixed: "有连接，也有不确定。"
* Self card:
  * label: "自己"
  * subtitle examples:
    * empty: "从一个小动作开始。"
    * positive: "你有几次没有把自己交给冲动。"
    * low: "今天需要少一点自我攻击。"
* Energy card:
  * label: "能量"
  * subtitle examples:
    * empty: "记录后会看见消耗和恢复。"
    * positive: "有一些动作在帮你恢复。"
    * low: "适合轻动作，不适合深挖。"
* Card action text: "明细"
* Home should show qualitative state and latest reason, not a dominant numeric balance.

Below-fold modules:

* Latest record:
  * empty copy: "还没有记录。可以先从一次触发或一个事实开始。"
* Active experiment:
  * empty copy: "之后可以放一个很小的练习在这里。"
* Anchor:
  * default: "事实可以很小，结论可以慢一点。"
* Discovery points:
  * empty copy: "看见的点可以之后再慢慢整理。"

#### P0 Home Visual Information Architecture

The Home screen must fit the core loop into the first mobile viewport without feeling like a dashboard. The user should be able to act before analyzing.

Target viewport assumptions:

* Design for a 360px wide mobile viewport first.
* First viewport should work at roughly 640-740px height after browser chrome and safe areas.
* Bottom navigation must be visible or reachable without covering primary actions.
* The first viewport should show at least the top of the account summaries so the user knows they exist, but the trigger panel must remain visually dominant.

Vertical order and approximate density:

1. Top app area, 44-56px:
   * active space
   * market chip
   * optional settings/detail icon only if needed
2. Market note, 44-64px:
   * one sentence
   * no paragraph copy
3. Trigger panel, 220-280px:
   * title and helper
   * four actions
4. Secondary record action, 48-56px:
   * single compact row or secondary button
5. Account summaries preview, 96-140px visible in first viewport:
   * three compact cards or horizontal row
   * qualitative copy first
6. Below fold:
   * latest record
   * active experiment
   * anchor
   * discovery points

Recommended first viewport layout:

```text
┌────────────────────────────┐
│ 某段关系              有点敏感 │
│ 今天不适合做重大结论，先存下事实。 │
│                            │
│ 现在最需要什么？              │
│ 不用一次想清楚，先选一个入口。    │
│ ┌──────────┐ ┌──────────┐ │
│ │ 我被触发了 │ │ 想检查信号 │ │
│ │ 抓事实下一步│ │ 10分钟缓冲 │ │
│ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ │
│ │ 草稿自检  │ │ 回到自己   │ │
│ │ 发送前看状态│ │ 身体落回来 │ │
│ └──────────┘ └──────────┘ │
│                            │
│ ＋ 记录互动                  │
│                            │
│ 罐子里最近存下了什么           │
│ 连接   自己   能量             │
└────────────────────────────┘
```

Trigger button layout:

* Use a 2x2 grid on common mobile widths.
* Each trigger button should have:
  * short label
  * one-line subtitle
  * optional icon
* Minimum touch target: 44px height; recommended 72-88px.
* Primary visual weight:
  * "我被触发了" and "回到自己" can be slightly stronger than "想检查信号" and "草稿自检" when activation is high.
  * In normal state, all four actions can be equal weight.
* Do not use red emergency styling. Use steady emphasis, not alarm.

Suggested icon meanings:

* "我被触发了": pause / alert-circle style icon
* "想检查信号": search / radar style icon
* "草稿自检": pencil / message-square style icon
* "回到自己": home / anchor / hand-heart style icon

Market note behavior:

* The note should never say "you are unsafe" or "this relationship is unsafe".
* It should frame the user's current state as a lens:
  * "今天信号可能会被放大。"
  * "先存下事实。"
  * "不适合做重大结论。"
* If daily market is calm/fulfilled, note can invite receiving without conclusion:
  * "今天可以收下温暖，也不用急着证明未来。"

Account summaries layout:

* Home should show three small summaries as a row or horizontally scrollable cards.
* Each card should contain:
  * account label
  * qualitative state sentence
  * tiny trend indicator or latest source count
  * "明细" affordance
* Avoid:
  * large balance
  * red/green financial profit-loss styling
  * "withdrawal" language
  * "score improved/dropped" copy
* Preferred compact copy:
  * Connection: "有真实接触" / "还没有证据" / "有连接，也有不确定"
  * Self: "有把自己带回来" / "需要少一点自责" / "今天先轻一点"
  * Energy: "偏低，适合轻动作" / "有一点恢复" / "消耗较多"

High-activation Home variant:

* Trigger condition:
  * daily market is `triggered`, `sleep_deprived`, `low_energy`, or the user returns from an unfinished high-activation flow.
* Changes:
  * market note becomes slightly more prominent
  * "回到自己" can appear as an additional sticky mini action near the bottom above nav
  * account summaries become more compact
  * below-fold modules should not show dense text previews
* Copy:
  * "现在先不用分析关系。选一个能让你少加重的动作。"
* Do not:
  * hide all record/account access
  * lock the user into grounding
  * show crisis copy unless high-risk content is actually detected or selected

Empty Home state:

* Empty state should not look broken or lonely.
* Show:
  * one default anchor
  * one suggested first action
  * empty account summaries with gentle explanatory copy
* Suggested first action:
  * if market is calm: "记录一次互动"
  * if market is sensitive/triggered: "我被触发了" or "回到自己"
  * if market is low energy: "回到自己"
* Empty account copy:
  * Connection: "有真实接触时，再慢慢存进来。"
  * Self: "一次回到自己的动作也算。"
  * Energy: "先观察什么消耗你，什么恢复你。"

Navigation:

* Bottom tabs:
  * Home
  * Record
  * Topics
  * Experiments
  * Settings
* Home should be the only tab with trigger-first urgency.
* Record tab should open quick record first, not a dense archive.
* Topics and Experiments can show low-pressure empty states.
* Settings should contain privacy/reset/export-placeholder, not emotional work.

Responsive constraints:

* On very small screens, trigger button subtitles may wrap to two lines, but labels must remain visible.
* Account cards can become horizontally scrollable if three columns become cramped.
* Text inside chips/buttons must not overflow. Long labels should wrap, not shrink below readable size.
* Avoid viewport-based font scaling. Use fixed type scale with responsive spacing.
* Keep bottom spacing enough for iOS safe area and PWA standalone mode.

#### P0 Minimal Visual System

The first release can use a small custom visual system instead of a full design system. The goal is consistency and emotional safety, not visual novelty.

Color direction:

* Base:
  * warm off-white / very light neutral background
  * dark neutral text
  * soft border color
* Accent palette:
  * one grounding green or teal for stabilizing actions
  * one warm amber or muted gold for storage-jar accents
  * one calm blue for facts / clarity / signal-checking
  * one soft rose or clay accent for high-activation indicators, used sparingly
* Account color semantics:
  * Connection: warm amber / muted gold
  * Self: grounding green / teal
  * Energy: calm blue / soft slate
* Avoid:
  * financial red/green profit-loss semantics
  * all-purple / all-blue gradient theme
  * beige-only palette that makes everything feel flat
  * saturated alarm red for "我被触发了"

Type scale:

* Page title: 22-24px, medium/semibold.
* Section title: 16-18px, semibold.
* Body copy: 14-16px.
* Helper copy: 13-14px.
* Chip/button label: 14-15px.
* Tiny metadata: 12-13px.
* Do not scale type with viewport width.
* Letter spacing should remain 0.

Spacing:

* Page horizontal padding: 16px on 360px mobile width.
* Section vertical gap: 16-20px.
* Inside card padding: 12-14px.
* Chip gap: 8px.
* Bottom nav safe area: include iOS standalone mode.
* Avoid large hero spacing on Home; the primary experience is the app itself.

Component density:

* Trigger buttons:
  * height: 72-88px
  * label + subtitle + optional icon
  * stable dimensions so subtitle wrapping does not shift layout unexpectedly
* Account cards:
  * compact, 96-120px tall if stacked or 88-112px if row-based
  * no large numerals on Home
  * support one-line or two-line qualitative state
* Chips:
  * min height 36-40px
  * wrap naturally
  * selected state should be visible without relying only on color
* Primary button:
  * min height 48px
  * sticky bottom inside flows when helpful, but not covering content

Motion:

* Use minimal motion:
  * small press states
  * gentle screen transitions
  * no attention-grabbing pulsing, shaking, or confetti
* High-activation states should reduce animation, not increase it.
* Completion should feel quiet:
  * no celebratory streak animation
  * no reward burst
  * optional subtle saved-state feedback only

Icon style:

* Use a single icon family for the whole app.
* Dependency decision:
  * if the eventual app scaffold already includes an icon family, use that consistently
  * if no icon family exists, choose one simple line-icon family during implementation and document it
  * do not mix icon families in the same component tree
* Icons should clarify actions, not decorate the app.
* Prefer simple line icons:
  * pause / circle-alert
  * search
  * pencil / message-square
  * home / anchor / hand-heart
  * jar / archive only if it does not look childish
* Always keep text labels visible beside or under icons for primary actions.

Accessibility and readability:

* Maintain readable contrast for text and chips.
* Do not communicate account movement only through color.
* All primary actions should be reachable with one thumb on common mobile sizes.
* Touch targets should be at least 44px.
* Important text should not be placed over images or complex backgrounds.
* Avoid small low-contrast helper text for safety/privacy warnings.

Storage-jar metaphor in UI:

* Use "罐子" as light language, not a literal toy visual system.
* Acceptable:
  * subtle jar icon
  * "罐子里最近存下了什么"
  * "打开明细"
  * "存下这次"
* Avoid:
  * piggy-bank mascot
  * coin shower
  * reward shelf
  * wallet/bank card visuals
  * debt/payment/payment-due metaphors

#### P0 Visual Tokens And Component Contracts

This section turns the visual direction above into implementation contracts. P0 should feel designed, but the implementation should stay small: shared tokens, reusable primitives, explicit states, and no bespoke styling per screen.

Current design system target: **Emotional Ceramic / Functional Calm**.

The UI should feel like a quiet, tactile, private holding space: closer to a high-quality personal notebook or a small ceramic object than a dashboard, social app, therapy portal, or fintech account. It should reduce cognitive load while the user is emotionally activated.

Token principles:

* Components should consume semantic tokens from `src/styles/tokens.css`, not hard-coded colors, spacing, shadows, or radii.
* Token names should describe product meaning or UI role, not visual guesses:
  * use `--color-surface-raised`, not `--color-card-beige`
  * use `--account-self-bg`, not `--color-green-50`
  * use `--state-storage-error`, not `--color-red`
* Component-level CSS can compose tokens, but should not create new color systems.
* P0 can ship light-first, but token naming should allow later dark/system theme without rewriting component APIs.
* Account colors are semantic accents, not a multi-accent marketing palette. They should appear as small surfaces, borders, icons, and labels, not as large saturated blocks.
* Visual density should stay mobile-tool appropriate: enough structure to scan, enough whitespace to avoid pressure.

Required color tokens:

| Token group | Required tokens | Usage |
|---|---|---|
| Base surfaces | `--color-bg`, `--color-bg-depth`, `--color-surface`, `--color-surface-raised`, `--color-surface-subtle`, `--color-surface-glass` | Linen page background, ceramic cards, quiet bands. `--color-surface-glass` may remain as a compatibility alias, but should render as a solid/near-solid ceramic surface rather than heavy glassmorphism. |
| Text | `--color-text`, `--color-text-muted`, `--color-text-soft`, `--color-text-inverse` | Primary text, helper copy, metadata, text on filled buttons. |
| Borders | `--color-border`, `--color-border-strong`, `--color-divider` | Cards, chips, inputs, list separation. |
| Action | `--color-action`, `--color-action-text`, `--color-action-soft`, `--color-action-border` | Primary button, selected chips, focus anchors. |
| Focus | `--color-focus-ring`, `--focus-ring` | Keyboard focus-visible state. |
| Account: Connection | `--account-connection`, `--account-connection-bg`, `--account-connection-border` | Connection card, source rows, compact markers. |
| Account: Self | `--account-self`, `--account-self-bg`, `--account-self-border` | Self card, Return-To-Self completion, owned action markers. |
| Account: Energy | `--account-energy`, `--account-energy-bg`, `--account-energy-border` | Energy card, energy effect rows, recovery/depletion markers. |
| State | `--state-activation`, `--state-activation-bg`, `--state-warning`, `--state-danger`, `--state-success` | High activation note, storage warning, destructive reset, saved state. |

Emotional Ceramic color target:

| Meaning | Target direction |
|---|---|
| Background / linen | `#fbf9f4`, warm off-white rather than pure white or green-grey. |
| Raised surface | `#ffffff` with subtle `#E5E1D8`-family border. |
| Text | deep charcoal such as `#1b1c19` / `#2D2D2D`, with muted copy around `#6B6B6B`. |
| Self / agency | sage or moss green, e.g. `#4e614b` token core with soft sage tint. |
| Connection | muted terracotta, e.g. `#8a4f37` token core with warm tint. |
| Energy | soft slate blue, e.g. `#476066` token core with blue-grey tint. |
| Activation | steady clay/coral such as `#C97B6D`; never alarm red. |

Color application rules:

* Primary app action should use the Action token family, not account colors.
* "我被触发了" should not use alarm red. Use Action or `--state-activation-bg` with steady text and border.
* "回到自己" can lean on Self tokens, but should still read as an app action, not a separate brand color.
* Connection / Self / Energy summary cards should be distinguishable by a small marker, tinted background, or border. The label and reason copy must carry the meaning even if color is unavailable.
* Destructive actions should use danger tokens only inside Settings and confirmation dialogs.
* Storage warnings use warning/error tokens with plain copy. They must not look like emotional emergency alerts.

Required size and rhythm tokens:

| Token group | Required tokens | Default direction |
|---|---|---|
| Spacing | `--space-1` through `--space-8` | 4px base scale; mobile container margin should be 20px where the layout can afford it. Form/flow vertical gaps usually use 24px. |
| Radius | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` | 4px, 12px, 16px, 999px. Cards and inputs use `md`; larger floating drawers/dialogs can use `lg`; chips/buttons use `pill`. |
| Shadow | `--shadow-soft`, `--shadow-panel`, `--shadow-inset` | Very subtle, tinted to surface. Ceramic cards use shallow shadows such as `0 4px 12px rgba(45, 45, 45, 0.05)`. No heavy black shadow. |
| Type | `--font-sans`, `--text-xs`, `--text-sm`, `--text-md`, `--text-lg`, `--text-xl` | Fixed type scale. No viewport-width font scaling. |
| Touch | `--touch-min`, `--touch-comfortable` | 48px minimum for buttons, chips, inputs, and icon controls. |
| Layout | `--app-max-width`, `--bottom-nav-height`, `--safe-bottom` | Mobile frame, bottom nav, PWA safe area. |

Shape contract:

* Page sections are unframed unless they need interaction or repeated-item grouping.
* Cards and panels use 12px radius in P0.
* Inputs use 12px radius and a clear focus border.
* Buttons and chips use pill shapes to read as tactile, touchable pebbles.
* Chips, segmented controls, and small choice buttons can use pill radius.
* Do not put cards inside cards on Home or flow screens.
* Completion cards can be framed, but should not contain additional nested cards unless the nested item is a source row.

Typography contract:

* Use a Manrope-first, highly readable sans-serif stack with system fallback. Do not network-load fonts in P0 unless explicitly approved; the token stack can name Manrope even when the runtime falls back locally.
* Do not use display-serif styling, decorative typography, viewport-scaled type, or negative letter spacing beyond subtle token-level headline tracking.
* Typography should be spacious, not oversized:
  * Home page title/top context: 22-24px.
  * Flow prompt title: 22-24px on mobile, around 28-32px line-height.
  * Section title: 17px / 24px / 600.
  * Body/helper copy: 14-16px with generous 1.5-1.6 line-height.
  * Metadata: 12px / 16px, slight positive tracking is acceptable.
* Helper copy should be short enough to scan while activated. If a helper sentence needs two lines on 360px width, it should still not push primary actions out of reach.

Surface contract:

* Prefer solid or near-solid ceramic surfaces over heavy blur/glass.
* `panel`, `card`, flow bodies, account rows, and topic rows should feel like physical objects resting on linen: subtle border, white or low container tint, and shallow shadow.
* Decorative gradients should be restrained. Avoid obvious gradient-orb, bokeh, or AI-purple/blue-glow treatment.
* Bottom navigation can be a raised ceramic tray with blur as progressive enhancement, but it should still work as an opaque surface.

Motion contract:

* Required motion:
  * pressed state for buttons/chips
  * simple route/step transition if inexpensive
  * saved-state feedback that does not celebrate or gamify
* Forbidden motion:
  * pulsing emergency indicators
  * shaking controls
  * confetti, streaks, reward bursts
  * infinite decorative loops
* High-activation mode should reduce motion. It should not add more attention-grabbing animation.
* Any non-trivial animation must respect `prefers-reduced-motion`.

Shared component contracts:

| Component | Required responsibilities | Must not do |
|---|---|---|
| `AppShell` | Provide mobile frame, safe-area bottom padding, route outlet, optional storage warning, bottom nav. | Do not create a desktop dashboard layout or hide primary content behind nav. |
| `BottomNav` | Show Home, Record, Topics, Experiments, Settings with stable touch targets. | Do not make Topics/Experiments look fully available if they are P0 placeholders. |
| `PageHeader` | Compact title, back/close action, optional space/market context. | Do not become a hero header or contain long education copy. |
| `PrimaryActionPanel` | Render four Home actions in a stable 2x2 grid with labels, subtitles, and optional icons. | Do not create fake flows for P1 placeholders. |
| `AccountSummaryCard` | Show account label, qualitative status, latest reason/source hint, and "明细" affordance. | Do not show large balances, score verdicts, or red/green profit-loss styling. |
| `StepScreen` | Provide shared flow shell: top actions, progress, one prompt, helper, content slot, bottom actions. | Do not allow multiple primary questions on one screen. |
| `ChipGroup` | Support single/multi select, selected state, disabled state, focus-visible, "说不清"/"跳过" where configured. | Do not rely on color alone for selected state. |
| `ActivationSelector` | Capture activation level with plain labels and "说不清". | Do not imply activation is a relationship verdict. |
| `ConnectionSelector` | Capture connection level separately from activation. | Do not collapse connection and safety into one score. |
| `EmotionPicker` | Offer broad emotion/body families, optional refinement, and uncertainty. | Do not require exact emotion correctness or show diagnostic labels. |
| `TextCapture` | Label above input, helper text, draft state, error text, keyboard-safe layout. | Do not use placeholder as the only label. |
| `CompletionCard` | Show saved/complete state, compact summary, one primary next action, optional secondary actions. | Do not use streaks, reward copy, or account movement animation. |
| `ReturnToSelfCta` | Provide consistent, low-friction route into Return-To-Self from high activation. | Do not force grounding or block other user-owned options. |
| `ConfirmDialog` | Confirm delete/reset with consequence copy and explicit cancel. | Do not use vague destructive labels such as "确定" alone. |
| `StorageWarning` | Explain local persistence failure honestly and offer temporary continuation/reset where relevant. | Do not claim data is saved when persistence failed. |

Component state contract:

Every interactive primitive should define these states before it is considered complete:

* default
* pressed
* selected, when selectable
* focus-visible
* disabled, only when technically necessary
* loading/saving, when persistence or async work is involved
* error/unavailable, when the action can fail

P0 component acceptance checks:

* [ ] `tokens.css` contains the required token groups above or an equivalent clearly named set.
* [ ] Home, Quick Record, Trigger Flow, Return-To-Self, and Settings use shared primitives instead of ad hoc button/chip/input styling.
* [ ] P1 placeholders for Signal Check, Draft Self-Check, Topics, and Experiments are visually honest and write no fake data.
* [ ] Components remain usable at 360px width with iOS safe-area bottom padding.
* [ ] Text does not overflow trigger buttons, chips, account cards, bottom nav, or completion actions.
* [ ] Selected chips and account cards communicate meaning through text/icon/border, not color alone.
* [ ] Destructive reset/delete states are visually separated from emotional trigger surfaces.
* [ ] Storage unavailable, save error, and reset error states are represented with honest copy.
* [ ] UI copy in shared primitives avoids diagnosis, relationship verdicts, surveillance prompts, and transaction metaphors.

#### P0 Home Component Priority

The first Home implementation should be built in priority order. Lower-priority blocks can use simple placeholders until P0 flows work.

| Priority | Component | Required for first runnable P0? | Purpose | Notes |
|---|---|---:|---|---|
| P0-A | `HomeTopStrip` | Yes | Shows active space and daily market | Must fit one line on 360px width. |
| P0-A | `MarketNote` | Yes | Reduces conclusion-making pressure | One sentence only. |
| P0-A | `PrimaryActionPanel` | Yes | Main trigger-first entry | Four buttons, 2x2 grid. |
| P0-A | `SecondaryRecordAction` | Yes | Opens quick record | Secondary visual weight. |
| P0-A | `AccountSummaryPreview` | Yes | Shows three accounts exist | Qualitative copy; no large numbers. |
| P0-B | `LatestRecordCard` | Yes after quick record exists | Confirms persistence and review | Empty state is acceptable in M3. |
| P0-B | `AnchorPreview` | Yes after anchors exist | Gives one stabilizing sentence | Can start with seed anchor. |
| P0-C | `ActiveExperimentCard` | No for P0 | Future P1/P2 support | Placeholder or hidden until experiments exist. |
| P0-C | `RecentDiscoveryPoints` | No for P0 | Future P1 support | Placeholder or hidden until topics exist. |
| P0-C | `HighActivationStickyCta` | Optional | Fast route to Return-To-Self | Add after main Home is stable. |

Implementation rule:

* P0-A components must be complete before styling below-fold modules.
* P0-B components should be simple but real enough to verify persistence.
* P0-C components should not block the trigger flow, Return-To-Self, or quick record.

#### P0 Home State Variants

Home needs a small number of explicit state variants so the UI does not become ad hoc.

`empty_setup_complete`:

* User has completed setup but has no records.
* Show:
  * default market note
  * primary trigger panel
  * secondary record action
  * empty account summaries
  * seed anchor
* Do not show:
  * empty archive-like lists
  * "no data" technical copy

`normal_with_records`:

* User has at least one record.
* Show:
  * latest record
  * account summary derived from impacts
  * one latest source reason per account if available
* Do not show:
  * full ledger on Home
  * all record details

`high_activation`:

* User selected triggered/sleep-deprived/low-energy market, returned from high activation flow, or selected high activation in a flow.
* Show:
  * stronger market note
  * trigger panel first
  * optional sticky "回到自己"
  * compact account summaries
* Do not show:
  * dense latest-record excerpt
  * multi-paragraph discovery previews

`post_completion`:

* User just completed trigger support, Return-To-Self, or quick record.
* Show:
  * subtle saved/complete confirmation
  * latest record or practice summary
  * one next action
* Do not show:
  * celebratory reward state
  * streaks
  * large account movement animation

`storage_unavailable_or_error`:

* Local storage cannot be read/written or migrated.
* Show:
  * clear warning that records may not persist
  * option to continue temporarily
  * option to reset local data if relevant
* Do not:
  * silently fail
  * claim data is saved when it is not

#### P0 Home Acceptance Additions

Add these checks to the Home acceptance pass:

* [ ] At 360px width, Home first viewport shows top strip, market note, four trigger buttons, record action, and at least part of account summaries.
* [ ] The four trigger buttons are tappable, stable in size, and do not shift when subtitles wrap.
* [ ] Account summaries are visible but not visually stronger than the trigger panel.
* [ ] Home does not show a global relationship score, large numeric balance, or reward-store entry.
* [ ] High-activation variant makes Return-To-Self easier to access without hiding other user-owned options.
* [ ] Empty Home invites one small action and does not look like an error state.
* [ ] Bottom navigation does not cover primary actions or sticky flow buttons.

#### UI Preflight Checklist

Before marking any UI milestone complete, run this adapted design preflight:

Design read and scope:

* [ ] The screen reads as a real mobile product UI, not a landing page, dashboard, therapy portal, or game.
* [ ] The first visible screen is usable app functionality, not a hero or marketing explanation.
* [ ] Visual density matches the user state: enough structure to act, not enough density to overwhelm.

Theme and tokens:

* [ ] Color choices come from semantic tokens, not ad hoc per-component colors.
* [ ] One theme family is used across the app; sections do not randomly invert.
* [ ] Dark mode or system-theme readiness is considered before implementation finishes, even if MVP ships light-first.
* [ ] Button text, chip text, helper text, warning text, and form labels meet readable contrast.
* [ ] Account colors are not the only way account meaning or movement is communicated.

Shape and layout:

* [ ] Radius rules are consistent: cards/panels, inputs, chips/buttons.
* [ ] No nested cards inside cards on Home or flow screens.
* [ ] Text does not overflow buttons, chips, cards, or bottom navigation on 360px width.
* [ ] Multi-column layouts explicitly collapse on mobile.
* [ ] No viewport-height traps such as fixed `h-screen` that break on mobile browser chrome; prefer dynamic viewport handling during implementation.

Interaction states:

* [ ] Every button/chip/input has default, pressed, selected, focus-visible, disabled, and error/unavailable states where applicable.
* [ ] Save actions have a saving/saved/error state.
* [ ] Delete/reset actions require confirmation and clear consequence copy.
* [ ] Empty states invite one small action.
* [ ] Error states are contextual and do not shame the user.

Motion:

* [ ] Motion communicates feedback or state transition, not decoration.
* [ ] High-activation states reduce motion.
* [ ] `prefers-reduced-motion` is honored for any non-trivial motion.
* [ ] No pulsing emergency UI, shake effects, confetti, reward bursts, or attention-grabbing loops.

Copy audit:

* [ ] Visible copy is plain, grammatical, and not performative.
* [ ] No em dash characters in user-facing UI copy.
* [ ] No diagnosis, relationship verdict, partner inference, surveillance encouragement, or shame/failure language.
* [ ] No "balance insufficient", "redeem response", debt, payment, or reward-store language.
* [ ] Every high-activation screen ends with one user-owned next action.

Visual anti-patterns:

* [ ] No AI-purple gradient default.
* [ ] No decorative blobs/orbs.
* [ ] No fake dashboard preview.
* [ ] No childish piggy-bank mascot.
* [ ] No bank-card, wallet, transaction, or profit-loss styling.
* [ ] No generic three-card marketing layout where product workflow hierarchy matters.

#### P0 Flow Screen Layout System

P0 flows should share a single mobile screen skeleton so the user does not need to relearn interaction patterns while activated.

Base flow shell:

```text
┌────────────────────────────┐
│ ←                      关闭 │
│ 1/4 先抓住事实              │
│ ━━━━━━━░░░░░░░░░            │
│                            │
│ 发生了什么可确认的事？        │
│ 只写摄像头能拍到的部分，不读心。 │
│                            │
│ [ 没有回复 ] [ 收到长消息 ]    │
│ [ 看到信号 ] [ 想补发解释 ]    │
│ [ 发生争执 ] [ 说不清 ]       │
│                            │
│ 可选输入框                   │
│                            │
│                 [ 下一步 ]   │
│              跳过 / 回到自己  │
└────────────────────────────┘
```

Screen regions:

* Top bar:
  * left: back icon or close icon
  * right: "关闭" text action for clarity
  * height: 44-52px
* Progress area:
  * soft step text such as "1/4 先抓住事实"
  * thin progress bar or step dots
  * no gamified progress ring
* Prompt area:
  * one title
  * one helper sentence
  * no educational paragraph in P0
* Input area:
  * chips first
  * optional text input below chips
  * secondary controls kept low-contrast but readable
* Bottom action area:
  * one primary button
  * at most two secondary text actions
  * safe-area padding for PWA standalone mode

Layout constraints:

* One primary question per screen.
* Primary button should be sticky at the bottom when content is scrollable.
* Bottom button must never cover chips or text input.
* On a 360px viewport, two medium chips per row is preferred; long chips can span full width.
* Chip labels may wrap to two lines but should not become cramped.
* Helper text should stay under 24 Chinese characters where possible.
* The screen should remain usable if the keyboard opens for optional text.

Shared bottom actions:

* Fact / body / urge steps:
  * primary: next step
  * secondary: "说不清" or "跳过"
  * tertiary: "回到自己" when activation is high
* Recommendation step:
  * primary: "就这个"
  * secondary: "换一个"
  * tertiary: "稍后"
* Completion:
  * primary: context-specific completion action
  * secondary: save / continue / return actions

Interaction states:

* Chip default:
  * soft border, neutral surface
* Chip selected:
  * filled or tinted surface
  * visible check or stronger border
  * not color-only
* Disabled:
  * use only when technically necessary; avoid emotional blocking
* Pressed:
  * subtle scale or translate feedback
* Saving:
  * primary button shows saving state
  * no spinner-only UI; include text such as "保存中"
* Error:
  * inline under the relevant input
  * plain copy, no shame

High-activation flow adjustments:

* Reduce visual density:
  * fewer visible chips per group
  * show "更多选项" only if needed
* Make Return-To-Self more available:
  * show a persistent low-contrast "回到自己" action under the primary button
* Avoid:
  * dense branch suggestions
  * account previews mid-flow
  * long explanations
  * animated progress

Skip and uncertainty rules:

* "说不清" should be a valid chip, not an error.
* "跳过" is allowed when precision may increase shame or rumination.
* Skipping should not create negative account impact.
* If too much is skipped, completion copy should say:
  * "先看见一点也可以。"
  * "不用现在整理完整。"

Persistence rules inside flows:

* Flow state can be in memory while short flows are open.
* Optional text inputs should autosave as local draft after a short debounce if implementation supports it.
* Closing a flow with meaningful input should offer:
  * "保存为稍后"
  * "不保存"
  * "继续"
* Closing an empty flow should close directly.

#### P0 "我被触发了" Screen Layout

This section refines the existing "我被触发了" blueprint into implementable screen layouts.

Step 0 entry:

* Purpose:
  * reduce the shock of entering the flow
  * set the frame that this is short and not a relationship verdict
* Layout:
  * title: "先停一下"
  * helper: "不用现在解决整件事。先抓住一个事实、一个感觉、一个下一步。"
  * primary: "开始 1 分钟急救"
  * secondary: "直接回到自己"
* Optional:
  * show a tiny "约 4 步" line, not a timer.
* Do not:
  * show account scores
  * show branch options
  * show psychological education

Step 1 fact:

* Layout:
  * progress: "1/4 先抓住事实"
  * title: "发生了什么可确认的事？"
  * helper: "只写摄像头能拍到的部分，不读心。"
  * chip grid:
    * two columns for short chips
    * full width for "收到一段长消息" if needed
  * optional text input:
    * label: "也可以写一句"
    * placeholder: "例如：我看到消息还没回。"
  * primary: "下一步"
  * secondary: "说不清"
* Validation:
  * no hard required text if a chip is selected
  * if nothing selected, primary can still continue after user taps "说不清"

Step 2 body / emotion:

* Layout:
  * progress: "2/4 看见身体和情绪"
  * title: "现在身体和情绪是什么？"
  * helper: "粗略命名就够了。"
  * first group: body chips
  * second group: emotion chips
  * optional intensity segmented control:
    * "低" / "中" / "高"
  * primary: "看见冲动"
  * secondary: "说不清"
* Density rule:
  * show body chips first; emotion chips below.
  * if the screen gets too tall, collapse body chips after selection and keep selected chips visible.
* High activation:
  * if "高" is selected, show low-key "回到自己" link below primary.

Step 3 urge:

* Layout:
  * progress: "3/4 看见冲动"
  * title: "我现在最想做什么？"
  * helper: "冲动不是命令，只是线索。"
  * chip grid:
    * use vertical grouping if chips exceed two rows:
      * contact/checking urges
      * withdrawal/cutoff urges
      * attack/rescue urges
      * rumination/sleep urges
  * primary: "选择下一步"
  * secondary: "说不清"
* Branch hints:
  * Do not show P2 branch cards here.
  * Store branch eligibility in state and use it to shape the recommendation on Step 4.

Step 4 owned next action:

* Layout:
  * progress: "4/4 选一个下一步"
  * title: "我选择一个能把我带回自己的下一步"
  * helper: "这一步不需要解决关系，只需要减少失控。"
  * recommendation card:
    * one action
    * one reason
    * no score
  * alternative chips:
    * no more than 6 visible at once
    * put "更多" if needed
  * primary: "就这个"
  * secondary: "换一个"
  * tertiary: "稍后"
* Recommendation examples:
  * checking urge + high activation:
    * action: "先延迟 10 分钟"
    * reason: "现在更需要把主动权拿回来。"
  * over-explaining:
    * action: "保存草稿不发"
    * reason: "现在先不让焦虑替你加码。"
  * long warm message:
    * action: "只回应一个点"
    * reason: "不用一次接住全部。"
  * body overload:
    * action: "进入回到自己"
    * reason: "身体已经在请求先落地。"

Completion:

* Layout:
  * title: "这一步先够了"
  * one copy variant
  * summary strip:
    * fact chip
    * emotion/body chip
    * chosen action
  * primary:
    * high activation: "进入回到自己"
    * otherwise: "完成"
  * secondary actions:
    * "保存为快速记录"
    * "继续完整记录"
    * "去草稿自检"
    * "收到很多内容，不知道怎么接"
* Account preview:
  * optional and compact
  * only show Self/Energy reason if impact will be saved
  * never show Connection impact unless an episode with observable evidence exists
* Save behavior:
  * "保存为快速记录" opens a lightweight save sheet prefilled from flow answers.

#### P0 "回到自己" Screen Layout

This section refines the existing "回到自己" blueprint into implementable screen layouts.

Implementation baseline note:

* The current PWA implementation uses a 4-step Return-To-Self flow: body landing, anchor, return-to-life action, energy effect, then completion.
* Older 3-step progress examples in this section are layout sketches, not permission to remove the separate energy-effect step.
* Design-system implementation may adjust surfaces, spacing, typography, and controls, but must not change the step count, saved payload, or account-impact behavior without a separate product decision.

Step 0 optional source-aware entry:

* If entered from Home:
  * title: "先回到自己"
  * helper: "不用先解释原因，先让身体和注意力有个落点。"
* If entered from trigger flow:
  * title: "先让浪过去一点"
  * helper: "还没变轻也没关系，先别继续加重它。"
* If entered from draft checker:
  * title: "先不要让高浪替你发"
  * helper: "草稿可以等一会儿，身体先回来。"
* Layout:
  * primary: "开始"
  * secondary: "只保存我需要暂停"

Step 1 body landing:

* Layout:
  * progress: "1/3 身体先有落点"
  * title: "先让身体有一个落点"
  * helper: "选一个现在不勉强的小动作。"
  * chip grid:
    * body actions as chips
    * "现在做不到" as a valid chip
  * optional detail:
    * if "五感观察" selected, show a compact inline expansion:
      * "看见 3 个东西"
      * "听见 2 个声音"
      * "碰到 1 个触感"
  * primary: "下一步"
  * secondary: "只保存这个动作"
* Do not:
  * force breathing
  * use medical claims
  * require a timer

Step 2 anchor:

* Layout:
  * progress: "2/3 给注意力一句话"
  * title: "给注意力一个可以回来的句子"
  * helper: "读一句就可以，不需要相信到 100%。"
  * anchor cards:
    * one selected by default
    * swipe/next button or "换一句"
    * saved anchors appear before seed anchors if available
  * primary: "带着这句继续"
  * secondary: "换一句"
* Card style:
  * one anchor visible at a time when activation is high
  * no carousel animation required
  * preserve text readability

Step 3 return-to-life:

* Layout:
  * progress: "3/3 回到一件现实小事"
  * title: "接下来 10-30 分钟，我回到哪一件现实小事？"
  * helper: "选轻一点的，不选最正确的。"
  * action chips:
    * eat, shower, read/study, walk, make drink, sleep, write, tidy, stop analyzing
  * energy effect segmented control:
    * "轻一点"
    * "差不多"
    * "更重"
    * "说不清"
  * primary: "完成"
  * secondary: "只保存我需要暂停"
* Keyboard:
  * no text input required on this screen in P0.

Completion:

* Layout:
  * title: "已经回到一点点了"
  * copy variant by completion type
  * selected body action
  * selected anchor
  * selected return-to-life action
  * primary: "回到首页"
  * secondary:
    * "保存为记录"
    * "取一个支持自己的小动作"
* If energy is "更重":
  * show copy: "更重也可以先被看见。现在不适合继续深挖。"
  * primary remains "回到首页"
  * secondary can include "联系真人支持" only if high-risk wording or explicit support need appears
* Account preview:
  * Self +1 for completion or meaningful partial completion
  * Energy from user-rated effect
  * Connection hidden or shown as "不影响连接罐子"

Partial completion:

* User can complete with:
  * only noticing need to pause
  * one body landing action
  * one anchor
* Completion title:
  * "先停住一点，也算"
* Copy:
  * "你已经看见自己需要停一下，这也是一步。"
* Account impact:
  * Self +1 if a concrete pause/body action is saved
  * Energy user-rated or 0

#### P0 Flow Layout Acceptance Additions

Add these checks to the P0 flow acceptance pass:

* [ ] Each P0 flow screen has one primary question and one primary action.
* [ ] On 360px width, chips wrap cleanly without text overflow or layout jump.
* [ ] Primary bottom action remains reachable without covering content or keyboard input.
* [ ] "说不清", "跳过", or equivalent uncertainty actions are available where precision may increase shame.
* [ ] High activation exposes Return-To-Self without forcing the user into it.
* [ ] Completion screens offer a user-owned next action and do not show reward bursts, streaks, or score celebrations.
* [ ] Saving, saved, and local-storage-error states are represented in the UI.
* [ ] Account-impact preview is compact, reason-based, and never implies relationship verdict.

#### P0 "我被触发了" Blueprint

Global flow frame:

* Top: close/back action
* Progress copy:
  * "1/4 先抓住事实"
  * "2/4 看见身体和情绪"
  * "3/4 看见冲动"
  * "4/4 选一个下一步"
* Persistent microcopy:
  * "不用现在解决整件事。"
  * "先找到一个能由我完成的动作。"

Step 1 fact:

* Title: "发生了什么可确认的事？"
* Helper: "只写摄像头能拍到的部分，不读心。"
* Chips:
  * "没有回复"
  * "收到一段长消息"
  * "看到一个动态/信号"
  * "我想补发解释"
  * "发生了争执"
  * "我突然很想确认"
  * "说不清"
* Text placeholder: "例如：我看到消息还没回。"
* Primary button: "下一步"

Step 2 body / emotion:

* Title: "现在身体和情绪是什么？"
* Helper: "粗略命名就够了。"
* Body chips:
  * "胸口紧"
  * "胃缩住"
  * "发热"
  * "想哭"
  * "手心紧"
  * "头很满"
  * "身体麻"
  * "没感觉"
* Emotion chips:
  * "焦虑/害怕"
  * "委屈/难过"
  * "羞耻/内疚"
  * "生气/怨"
  * "想念"
  * "被看见/很暖"
  * "混合"
  * "说不清"
* Intensity choices:
  * "低"
  * "中"
  * "高"
* Primary button: "看见冲动"

Step 3 urge:

* Title: "我现在最想做什么？"
* Helper: "冲动不是命令，只是线索。"
* Chips:
  * "马上回复"
  * "检查信号"
  * "反复重读"
  * "补发解释"
  * "问清楚/要确认"
  * "撤回/删除"
  * "装作不在乎"
  * "消失/切断"
  * "指责/攻击"
  * "安抚或拯救对方"
  * "睡不着一直想"
* Primary button: "选择下一步"

Step 4 owned next action:

* Title: "我选择一个能把我带回自己的下一步"
* Helper: "这一步不需要解决关系，只需要减少失控。"
* Recommended action card:
  * show one recommendation
  * include one-line reason
* Default action chips:
  * "延迟 10 分钟"
  * "保存草稿不发"
  * "记录事实"
  * "把话题放进稍后"
  * "做五感落地"
  * "喝水/洗手"
  * "只回应一个点"
  * "不再补发"
  * "回到自己"
  * "保存为快速记录"
* Primary button: "就这个"
* Secondary buttons:
  * "换一个"
  * "稍后"

Completion:

* Title: "这一步先够了"
* Copy variants:
  * stabilizing action: "你没有让冲动直接开车。"
  * saved facts: "事实已经被存下，结论可以慢一点。"
  * boundary/delay: "你可以在乎，也可以不越过自己的限度。"
  * still activated: "还没变轻也没关系，先别继续加重它。"
* Primary action:
  * high activation: "进入回到自己"
  * medium/low activation: "完成"
* Secondary actions:
  * "保存为快速记录"
  * "继续完整记录"
  * "去草稿自检"
  * "收到很多内容，不知道怎么接"

#### P0 "回到自己" Blueprint

Global flow frame:

* Top: close/back action
* Progress copy:
  * "1/3 身体先有落点"
  * "2/3 给注意力一句话"
  * "3/3 回到一件现实小事"
* Persistent microcopy:
  * "不需要马上变好。"
  * "少加重一点，也是一种回到自己。"

Step 1 body landing:

* Title: "先让身体有一个落点"
* Helper: "选一个现在不勉强的小动作。"
* Chips:
  * "喝水"
  * "洗手/洗脸"
  * "站起来走 1 分钟"
  * "看窗外 30 秒"
  * "摸一个柔软的东西"
  * "五感观察"
  * "慢一点呼吸"
  * "松开下巴/肩膀"
  * "手放胸口"
  * "温热手掌贴住手臂"
  * "轻轻抱一下自己"
  * "现在做不到"
* Primary button: "下一步"

Step 2 anchor:

* Title: "给注意力一个可以回来的句子"
* Helper: "读一句就可以，不需要相信到 100%。"
* Seed anchors:
  * "事实可以很小，结论可以慢一点。"
  * "我可以接收温暖，也不急着加码。"
  * "我不用一次接住全部。"
  * "我先回到自己，再决定下一步。"
  * "这不是现在必须解决完的事。"
  * "这很难，但我不需要再攻击自己。"
* Primary button: "带着这句继续"
* Secondary: "换一句"

Step 3 return-to-life:

* Title: "接下来 10-30 分钟，我回到哪一件现实小事？"
* Helper: "选轻一点的，不选最正确的。"
* Chips:
  * "吃点东西"
  * "洗澡"
  * "读/学一点"
  * "走一走"
  * "泡一杯喝的"
  * "睡觉"
  * "写自己的东西"
  * "整理一个小角落"
  * "先停止分析"
* Energy effect choices:
  * "轻一点"
  * "差不多"
  * "更重"
  * "说不清"
* Primary button: "完成"
* Secondary: "只保存我需要暂停"

Completion:

* Title: "已经回到一点点了"
* Copy variants:
  * completed: "没有立刻变轻，不代表这一步无效。你已经少加重一点。"
  * partial: "你已经看见自己需要停一下，这也是一步。"
  * energy lower: "更重也可以先被看见。现在不适合继续深挖。"
* Primary action: "回到首页"
* Secondary actions:
  * "保存为记录"
  * "取一个支持自己的小动作"

#### P0 Quick Record Screen Layout

Quick Record is the bridge between urgent flows and account summaries. It should capture enough structure for useful reflection without turning recording into a long worksheet.

Entry modes:

* From Home / Record tab:
  * title: "存下这次发生的事"
  * helper: "先存事实和感受，不急着判定关系。"
  * mode: independent quick record
* From "我被触发了" completion:
  * title: "存成一条快速记录"
  * helper: "刚才看见的部分已经帮你带进来了，可以少填一点。"
  * mode: prefilled from trigger flow
* From Return-To-Self completion:
  * title: "要不要存下这个回到自己的动作？"
  * helper: "这可以进入自己的罐子，不会算作连接证据。"
  * mode: self-stabilization record

Recommended layout:

```text
┌────────────────────────────┐
│ ←                      关闭 │
│ 存下这次发生的事              │
│ 先存事实和感受，不急着判定关系。 │
│                            │
│ 标题                         │
│ [ 收到一段很暖的邮件        ] │
│                            │
│ 可确认的事实                  │
│ [ 摄像头能拍到的部分...      ] │
│                            │
│ 我脑中出现的解释               │
│ [ 我猜它可能意味着...        ] │
│                            │
│ 情绪和身体                    │
│ [焦虑] [很暖] [胸口紧] [混合] │
│                            │
│ 连接感       激活程度          │
│ [ 0 1 2 3 4 ] [ 0 1 2 3 4 ] │
│                            │
│ 下一步我能做什么               │
│ [晚点再回] [回到自己] [休息]   │
│                            │
│                  [ 存下 ]    │
└────────────────────────────┘
```

Screen structure:

* Top bar:
  * back / close
  * optional "保存草稿" if meaningful text exists
* Header:
  * title
  * one helper sentence
* Form sections:
  * title
  * fact
  * interpretation
  * emotion/body
  * connection/activation
  * next action
  * optional account-impact preview
* Bottom action:
  * sticky "存下"
  * secondary "稍后" or "不保存"

Form density:

* Use stacked sections, not a multi-column form.
* Labels must be above inputs.
* Place helper copy directly under labels or inputs, not as placeholders only.
* Use progressive disclosure for optional fields.
* Account-impact preview should appear near the save button or after connection/activation, not at the top.
* Avoid requiring keyboard input beyond title/fact/interpretation; chips should carry emotion/body and next action where possible.

Required fields for save:

* `title`
* `facts` or one fact chip/prefilled fact
* `interpretation` can be empty but the field must be visible
* at least one emotion/body chip or "说不清"
* connection level
* activation level
* next action or "暂时没有"

Validation:

* If title is empty:
  * auto-suggest from fact or source flow, such as "一次触发", "一次回到自己", or "一段长消息".
* If facts are empty:
  * show inline copy: "至少存一个可确认的部分，哪怕很小。"
* If interpretation is empty:
  * allow save; show placeholder "暂时不下解释也可以。"
* If connection/activation is not selected:
  * default to "说不清" only if user explicitly chooses it.
* Do not block save because optional fields are blank.

Prefill behavior:

* From trigger flow:
  * title: derive from selected fact chip or "一次触发"
  * facts: selected fact chip + optional text
  * emotion/body: selected chips
  * activation: derived from selected intensity if available
  * next action: selected owned action
  * interpretation remains visible and editable, not auto-inferred
* From Return-To-Self:
  * title: "一次回到自己"
  * facts: "我完成/部分完成了一个回到自己的动作。"
  * emotion/body: selected body action or "说不清"
  * activation: optional source activation, otherwise "说不清"
  * next action: selected return-to-life action
  * Connection impact must stay 0
* From rich incoming review later:
  * title: from message shape or chosen thread
  * facts: user-entered observable content only
  * Connection impact only if observable received/being-seen evidence is present

Autosave and close:

* If user typed meaningful content and taps close:
  * show a bottom sheet:
    * "保存草稿"
    * "不保存"
    * "继续编辑"
* If the record is prefilled but user made no edits:
  * "不保存" can close without warning.
* Draft copy:
  * "这条还没存进罐子，只是先放着。"
* Autosave should be local only.

Section-by-section layout:

Title section:

* Label: "给这次一个短标题"
* Placeholder examples:
  * "收到一段很暖的邮件"
  * "我想检查信号"
  * "一次回到自己"
* Constraint:
  * one line preferred; allow wrap but keep compact

Fact section:

* Label: "可确认的事实"
* Helper: "摄像头能拍到的部分。"
* Input:
  * textarea, 2-4 visible lines
  * chips can appear above input if coming from a flow
* Avoid:
  * "对方是不是..." prompts
  * "TA 真实意思是..." prompts

Interpretation section:

* Label: "我脑中出现的解释"
* Helper: "解释可以被记录，但暂时不用当成事实。"
* Placeholder: "我猜它可能意味着..."
* Optional chips:
  * "我怕连接变冷"
  * "我担心自己做错"
  * "我觉得被看见"
  * "我开始想很多"
  * "暂时不解释"
* Layout:
  * place immediately after facts to reinforce the split.

Emotion/body section:

* Label: "情绪和身体"
* Helper: "粗略命名就够了。"
* Reuse chips from trigger flow:
  * body chips
  * emotion chips
  * "混合"
  * "说不清"
* Optional:
  * intensity segmented control if not already captured.
* Do not:
  * require exact emotion labels
  * show emotion correctness scoring

Connection/activation section:

* Label: "这次的连接感和激活程度"
* Use two compact segmented controls or sliders with clear labels.
* Connection scale:
  * 0: "没有"
  * 1: "很弱"
  * 2: "有一点"
  * 3: "比较明显"
  * 4: "很强"
  * "说不清"
* Activation scale:
  * 0: "平稳"
  * 1: "轻微"
  * 2: "有波动"
  * 3: "很强"
  * 4: "快被卷走"
  * "说不清"
* Helper:
  * "连接感和激活可以同时很高。"
* Do not:
  * collapse them into one relationship score.
  * visually imply high connection means safe/future-proof.

Next action section:

* Label: "下一步我能做什么"
* Helper: "选一个由我能完成的动作。"
* Chips:
  * "先不补发"
  * "晚点再回"
  * "保存一个话题"
  * "回到自己"
  * "表达一个边界"
  * "只回应一个点"
  * "休息"
  * "暂时没有"
  * "说不清"
* If activation is high:
  * surface "回到自己" as recommended, but do not force it.

Account-impact preview:

* Title: "这次可能会存进哪里"
* Show after required fields are mostly filled.
* Layout:
  * three compact rows:
    * Connection
    * Self
    * Energy
  * each row has:
    * tentative value or qualitative change
    * one reason
    * editable / "不确定" option if needed
* Rules:
  * Connection should show 0 by default unless observable evidence exists.
  * Self can show +1 when fact/interpretation split, boundary, delay, Return-To-Self, or owned action is present.
  * Energy should ask user-rated effect when not clear.
* Copy examples:
  * Connection 0: "还没有单独的连接证据。"
  * Connection +1: "有一条可观察的被看见/真实接触证据。"
  * Self +1: "你把事实和解释分开了。"
  * Energy -1: "这次明显消耗你。"
* Do not:
  * call this "score"
  * show "balance insufficient"
  * imply a saved action buys future response

Save completion:

* Title: "已经存下"
* Copy: "这次不用现在整理完。你之后可以回来慢慢看。"
* Summary:
  * title
  * one fact
  * one emotion/body chip
  * next action
* Primary:
  * "回到首页"
* Secondary:
  * "添加发现点"
  * "保存锚点"
  * "打开明细"
  * "取一个支持自己的小动作"
* If saved from trigger flow:
  * include "继续回到自己" when activation is high.

Quick Record edge states:

* Storage unavailable:
  * copy: "现在可能无法保存到本地。你可以先复制内容，或稍后再试。"
  * actions: "继续编辑" / "复制内容" / "关闭"
* Empty save:
  * copy: "至少存一个可确认的事实，哪怕很小。"
* Very high activation:
  * do not block recording
  * show gentle banner: "如果现在很难填写，可以先回到自己。"
* Deleting a saved record:
  * require confirmation
  * copy: "删除后，这条记录和它带来的账户明细会一起移除。"

#### P0 Quick Record Acceptance Additions

Add these checks to the Quick Record acceptance pass:

* [ ] Quick Record can open independently from Home / Record tab.
* [ ] Quick Record can open prefilled from "我被触发了" completion.
* [ ] Quick Record can save a Return-To-Self practice without creating Connection impact.
* [ ] Facts and interpretation are adjacent and visually distinct.
* [ ] User can save without filling optional fields.
* [ ] Connection and activation are separate controls and can both be high.
* [ ] Account-impact preview shows reasons and does not use score/verdict language.
* [ ] Local draft/close behavior prevents accidental loss of meaningful text.
* [ ] Storage unavailable state is visible and honest.
* [ ] Save completion offers Home, discovery point, anchor, account detail, or personal action without reward-store language.

#### Account Detail / Storage Jar Detail Layout

Account Detail is the place where a user can inspect why a storage-jar summary changed. It should be explanatory and calming, not a score-checking destination.

Entry points:

* Home account summary card:
  * Connection -> `/accounts/connection`
  * Self -> `/accounts/self`
  * Energy -> `/accounts/energy`
* Quick Record completion:
  * "打开明细"
* Personal action completion:
  * optional "看看这次存到了哪里"
* Episode detail:
  * account impact source row opens the relevant account detail filtered to that episode

Top-level purpose by account:

* Connection:
  * "看见真实接触、被看见、自我接触或互相理解的证据。"
  * Reminder: "连接记录不是未来保证。"
* Self:
  * "看见我有没有把自己、边界和选择拿回来。"
  * Reminder: "自己罐子不是自我价值分。"
* Energy:
  * "看见什么消耗我，什么帮助我恢复。"
  * Reminder: "能量低不是失败，只是需要换轻一点。"

Recommended layout:

```text
┌────────────────────────────┐
│ ←  连接明细                 │
│ 连接记录不是未来保证。         │
│                            │
│ 当前状态                     │
│ 有真实接触，也有不确定          │
│ 本周 +2 · 来自 3 条记录        │
│                            │
│ 为什么这样算                  │
│ +1 收到一段被看见的表达         │
│  证据：对方具体回应了我的勇气     │
│  来源：收到长邮件              │
│                            │
│ 0 回到自己                    │
│  原因：这是稳定动作，不算连接证据  │
│                            │
│ 取一个支持自己的小动作           │
│ [ 保存一句温暖 ]               │
└────────────────────────────┘
```

Screen structure:

* Top bar:
  * back
  * account title
  * optional filter icon
* Account header:
  * qualitative status
  * short reminder copy
  * small balance/trend metadata
* Explanation section:
  * "为什么这样算"
  * recent sources grouped by record/action
* Source list:
  * one row per `AccountImpact`
  * shows value, reason, source title, date, and evidence if relevant
* Personal action section:
  * one recommended action
  * at most two alternatives or "换一个"
* Empty state:
  * account-specific copy and one small action

Header details:

* Title labels:
  * "连接明细"
  * "自己明细"
  * "能量明细"
* Qualitative status should be more prominent than the numeric balance.
* Numeric balance can be shown as small metadata:
  * "当前 +4"
  * "最近 7 条 +2"
  * "来自 3 条记录"
* Reminder copy:
  * Connection: "这是记录到的连接证据，不是关系裁判。"
  * Self: "这里记录的是选择和边界，不是你够不够好。"
  * Energy: "这里只看消耗和恢复，不评价你做得好不好。"

Balance and trend display:

* Allowed:
  * small numeric balance
  * recent change
  * source count
  * qualitative label
* Preferred labels:
  * "当前记录"
  * "最近变化"
  * "来自哪些记录"
* Avoid:
  * "净值"
  * "收益"
  * "亏损"
  * red/green financial styling
  * relationship health score
  * "余额不足"
  * "需要多赚一点"

Source row layout:

* Each row should show:
  * impact value or qualitative marker
  * reason copy
  * source type:
    * quick record
    * trigger flow
    * Return-To-Self
    * personal action completion
    * experiment completion
    * rich incoming review
  * source title
  * date/time
  * optional evidence snippet
* Example rows:
  * Connection +1:
    * reason: "有一条可观察的被看见证据。"
    * evidence: "对方具体回应了我的勇气。"
    * source: "收到一段很暖的邮件"
  * Self +1:
    * reason: "你把事实和解释分开了。"
    * source: "一次触发"
  * Self +1:
    * reason: "你选择了不立刻补发解释。"
    * source: "草稿自检"
  * Energy -1:
    * reason: "这次让你明显消耗。"
    * source: "收到很多内容"
  * Connection 0:
    * reason: "这是回到自己的动作，不是连接证据。"
    * source: "一次回到自己"

Filtering:

* MVP filters can be simple chips:
  * "全部"
  * "+ 支持"
  * "- 消耗"
  * "最近 7 天"
  * "只看记录"
  * "只看动作"
* Avoid advanced analytics, charts, or custom date range in first release.

Empty states:

* Connection empty:
  * title: "还没有连接证据"
  * copy: "有真实接触、被看见、自我接触或互相理解时，再慢慢存进来。"
  * action: "记录一次互动"
* Self empty:
  * title: "还没有自己的动作"
  * copy: "一次暂停、一次边界、一次没有补发解释，都可以从这里开始。"
  * action: "回到自己"
* Energy empty:
  * title: "还没有能量记录"
  * copy: "先观察什么消耗你，什么恢复你。"
  * action: "做一个轻动作"

High-activation account detail variant:

* If user enters account detail while activation is high:
  * show a compact banner:
    * "如果你现在是在查确定感，可以先回到自己。"
  * offer "回到自己"
  * keep source list collapsed to recent 3 rows
* Do not:
  * hide detail entirely
  * shame the user for checking
  * show more charts or numeric breakdowns

Personal action section:

* Section title: "取一个支持自己的小动作"
* Show one recommendation based on selected account:
  * Connection:
    * "保存一句我收到的温暖"
    * "允许这次连接先到这里"
    * "只回应一个最重要的点"
  * Self:
    * "今晚不补发解释"
    * "写下什么是我的责任/什么不是"
    * "保存草稿不发送"
  * Energy:
    * "喝水"
    * "洗手/洗脸"
    * "走动 1 分钟"
    * "今晚减少复盘"
* Required controls:
  * "就这个"
  * "换一个"
  * "稍后"
* Choosing an action:
  * creates intention only
  * no account impact yet
* Completing an action:
  * may create Self/Energy impact with reason
  * never creates Connection unless a separate real interaction record supports it

Editing and deletion:

* MVP can defer editing account impacts if implementation scope is tight.
* If impact editing is included:
  * make it source-row-level, not global balance editing
  * require reason selection or note
  * preserve original source record
* If a source record is deleted:
  * remove its account impacts from derived balance
  * show no orphaned balance
  * linked topics may remain with "来源记录已删除"

Account detail copy do / do not:

Use:

* "这次为什么存进来"
* "来自哪些记录"
* "记录到的连接证据"
* "选择和边界"
* "消耗和恢复"
* "余额是观察记录，不是关系裁判"

Avoid:

* "关系分数"
* "余额不足"
* "收益/亏损"
* "你需要多存一点才值得被爱"
* "用连接点兑换回应"
* "对方欠你"
* "你欠对方"

#### Account Detail Acceptance Additions

Add these checks to the Account Detail acceptance pass:

* [ ] User can open account detail from each Home account card.
* [ ] Account detail shows qualitative status before numeric balance.
* [ ] Account detail shows recent source rows with reason copy.
* [ ] Connection rows only show positive impact when observable evidence exists.
* [ ] Return-To-Self source rows never create Connection impact.
* [ ] User can open the source record/action from a source row.
* [ ] Account detail includes one personal action recommendation plus at most two alternatives.
* [ ] Choosing a personal action creates intention only, not account impact.
* [ ] Account detail does not use financial profit/loss styling, relationship score, or redemption-for-response language.
* [ ] Empty account states invite one small action without shame.

#### Episode Detail / Record Detail Layout

Episode Detail is the user's place to revisit one saved moment without having to reprocess everything. It should show what was recorded, why it affected the storage jars, and what was saved for later. It should not become a long therapy worksheet or a place that forces a relationship verdict.

Entry points:

* Latest record card on Home.
* Record list / archive.
* Quick Record save completion: "打开记录".
* Account Detail source row.
* Topic / discovery point source link.
* Anchor source link.
* Experiment or personal action source link when the completion generated or referenced an episode.

Primary purposes:

* Let the user see the event as a bounded moment, not as proof of the whole relationship.
* Keep "facts", "interpretation", "emotion/body", "connection", and "activation" visible together.
* Explain account impacts with transparent reasons.
* Preserve later topics / discovery points so the user does not need to carry them in working memory.
* Offer one calm next step when the user reopens the record while activated.

Recommended layout:

```text
┌────────────────────────────┐
│ ←  记录详情             ⋯   │
│ 收到一段很暖的邮件            │
│ 昨晚 23:40 · 关系：安         │
│                            │
│ 这次先怎么看                  │
│ 有温暖，也有激活。不需要变成结论。│
│                            │
│ 可确认的事实                  │
│ 对方具体回应了我的勇气。        │
│                            │
│ 我脑中出现的解释               │
│ 我担心这份温暖会不会很快消失。   │
│                            │
│ 情绪和身体                    │
│ [暖] [焦虑] [脑子很忙] [混合]  │
│                            │
│ 连接感 3 · 激活 3             │
│                            │
│ 存进了哪里                    │
│ 连接 +1 有一条被看见的证据      │
│ 自己 +1 把事实和解释分开了      │
│ 能量 -1 这次明显消耗           │
│                            │
│ 这次看见的点                  │
│ · 为什么温暖也会让我紧张？      │
│ · 我想稍后理解语言切换          │
│                            │
│ 锚点                         │
│ 我可以接收温暖，也不急着加码。   │
│                            │
│ [回到自己] [编辑]             │
└────────────────────────────┘
```

Screen structure:

* Top bar:
  * back
  * title "记录详情"
  * overflow menu for edit, delete, duplicate as new record, or export text later
* Header:
  * record title
  * timestamp
  * emotional space name
  * source type chip when relevant, such as "来自触发", "来自回到自己", "来自长消息", "手动记录"
* Moment summary:
  * one short non-verdict sentence generated from saved state or deterministic copy
* Core record sections:
  * facts
  * interpretation
  * emotions/body
  * connection and activation
  * chosen next action
* Account impact section:
  * transparent impact rows with reasons
* Follow-up objects:
  * discovery points / later topics
  * anchors
  * linked experiment or personal action
* Bottom actions:
  * one grounding action if activation is medium/high
  * edit
  * add discovery point
  * save anchor

Header and moment summary:

* Title should be user-editable.
* If title was auto-generated, mark it only through subtle copy in edit mode, not on the detail page.
* Moment summary examples:
  * warm + activated: "有温暖，也有激活。不需要变成结论。"
  * uncertain signal: "这里有事实，也有还不能证明的解释。"
  * self-stabilization: "这是一次回到自己的动作，不需要证明给谁看。"
  * conflict / boundary: "这次先看见边界和责任，不急着判定谁对谁错。"
  * depleted: "这次很消耗。能量低不是失败。"
* Avoid:
  * "这段关系很好/不好"
  * "对方很在乎/不在乎你"
  * "你做对了/做错了"
  * "你应该立刻回应/修复/离开"

Facts and interpretation:

* Facts must appear before interpretation.
* The two sections should be visually adjacent but distinct.
* Facts label: "可确认的事实"
* Facts helper in collapsed/info state: "摄像头能拍到、消息里确实出现、我确实做了的部分。"
* Interpretation label: "我脑中出现的解释"
* Interpretation helper: "解释可以被看见，但暂时不用当成事实。"
* If interpretation is empty:
  * show "这次没有保存解释，也可以。"
* If facts are sparse:
  * allow it, but show one small prompt: "下次可以多存一个可确认的部分。"

Emotion and body section:

* Title: "情绪和身体"
* Show chips, not long paragraphs by default.
* Include "混合" and "说不清" as valid states.
* If an emotion calibration branch was completed, show a compact row:
  * "这份情绪可能在保护：我很在乎这段连接"
  * "更智慧的动作：先接住恐惧，不急着控制"
* Do not:
  * score emotion accuracy
  * label emotions as good/bad
  * imply fear, sadness, anger, vulnerability should be eliminated

Connection and activation:

* Show connection and activation as two separate chips or compact meters.
* Copy:
  * "连接感和激活可以同时很高。"
* Examples:
  * "连接感 3 · 比较明显"
  * "激活 3 · 很强"
* If connection is high and activation is high:
  * show a small reminder: "温暖被接收后，也可能激活害怕失去。"
* If connection is low and activation is high:
  * show: "没有确定感时，身体可能会想找证据。"
* Do not:
  * merge into a relationship score
  * present high connection as future safety proof
  * present high activation as a failure

Account impact section:

* Section title: "这次存进了哪里"
* Show one row per account impact:
  * account label
  * impact value or neutral marker
  * reason
  * optional evidence
  * "打开明细"
* Example rows:
  * "连接 +1：有一条可观察的被看见证据。"
  * "自己 +1：你把事实和解释分开了。"
  * "自己 +1：你选择了不立刻补发解释。"
  * "能量 -1：这次明显消耗你。"
  * "连接 0：这是回到自己的动作，不算连接证据。"
* Impact rows are derived from saved data and should stay explainable.
* If impact editing is deferred:
  * allow "编辑记录" to update source fields and recompute impacts.
* If direct impact editing is included:
  * require a reason and show that it changes this record's derived impact only.

Discovery points and later topics:

* Section title: "这次看见的点"
* Show linked items with:
  * title
  * type chip: "稍后话题" / "发现点" / "想探索的问题" / "行动想法"
  * status chip: "先放着" / "已看过" / "变成行动" / "不需要了"
* Empty state:
  * "如果这次突然看见很多点，可以先存下来，不用现在想完。"
* Actions:
  * "添加发现点"
  * "批量添加"
* Constraints:
  * no due date by default
  * no overdue language
  * no pressure to review everything
* If source record is deleted later:
  * linked topics remain and show "来源记录已删除".

Anchor section:

* Section title: "锚点"
* Show one saved anchor if attached.
* If no anchor:
  * action: "保存一句锚点"
* Anchor candidates can come from:
  * user's own sentence in facts/interpretation
  * seed anchors
  * completion copy
* Anchor copy must be present-oriented and non-contractual:
  * allowed: "我可以接收温暖，也不急着加码。"
  * allowed: "这不是现在必须解决完的事。"
  * avoid: "这证明对方不会离开。"

High-activation revisit variant:

* If activation is high or user enters repeatedly from account/detail checking:
  * show a top banner:
    * "如果你现在是在找确定感，可以先回到自己，再回来慢慢看。"
  * primary action: "回到自己"
  * collapse long text sections after the first few lines.
  * keep account numbers visually small.
* Do not:
  * block access to the record
  * shame repeated checking
  * surface more analytics as the first response

Editing:

* Edit should use the Quick Record form pattern with existing values prefilled.
* Editable:
  * title
  * facts
  * interpretation
  * emotions/body
  * connection level
  * activation level
  * next action
  * tags
  * linked topics / anchor associations
* Editing should recompute derived account impacts using the same transparent rules.
* If an edit changes a Connection impact:
  * show confirmation copy:
    * "连接变化只来自可观察证据。修改后，这条记录的明细会一起更新。"

Deletion:

* Delete requires confirmation.
* Confirmation copy:
  * "删除后，这条记录和它带来的账户明细会一起移除。已保存的稍后话题可以保留。"
* Options:
  * "删除记录，保留稍后话题"
  * "删除记录和关联锚点"
  * "取消"
* Do not silently delete discovery points unless the user explicitly chooses it.

Overflow menu:

* P1:
  * "编辑记录"
  * "添加发现点"
  * "保存锚点"
  * "删除"
* Later:
  * "导出为文本"
  * "复制摘要"
* Avoid:
  * share-to-social defaults
  * public link
  * AI partner analysis

Record list entry card:

* The list card should be compact and bounded:
  * title
  * date
  * source type chip
  * 1-2 emotion/body chips
  * connection/activation small chips
  * account impact preview limited to three tiny labels
* It should not show full sensitive text unless the user opens the detail.
* Empty state:
  * "还没有记录。可以先从一次触发或一个可确认事实开始。"

Episode detail copy do / do not:

Use:

* "这次"
* "这一刻"
* "可确认的事实"
* "我脑中出现的解释"
* "还不能证明"
* "可以稍后再看"
* "存为发现点"

Avoid:

* "最终结论"
* "关系真相"
* "对方真实想法"
* "复盘到完全清楚"
* "你必须处理完"
* "证明你值得被爱"

#### Episode Detail Acceptance Additions

Add these checks to the Episode Detail acceptance pass:

* [ ] User can open a saved record from Home latest record, record list, account source row, topic source link, and anchor source link.
* [ ] Episode detail shows title, timestamp, space, and source type.
* [ ] Facts appear before interpretation, and both remain visually distinct.
* [ ] Connection and activation are shown as separate states and can both be high.
* [ ] Account impact rows show account, value/neutral marker, reason, and link to account detail.
* [ ] Return-To-Self records show Connection 0 unless separate observable contact evidence exists.
* [ ] User can add one or multiple discovery points from the record without due dates or overdue language.
* [ ] User can save an anchor from the record using non-contractual copy.
* [ ] High-activation revisit shows "回到自己" before deeper analysis.
* [ ] Edit recomputes derived account impacts through transparent rules.
* [ ] Delete confirmation explains impact removal and lets linked later topics remain.
* [ ] Episode detail avoids relationship verdicts, partner mind-reading, future guarantees, and self-worth scoring.

#### P1 Personal Action Menu Layout

The Personal Action Menu is the warm, agency-centered version of "using" what has been stored. It should feel like taking one small support from the jar, not spending points, optimizing rewards, or buying another person's response.

Entry points:

* Account Detail:
  * "取一个支持自己的小动作"
* Return-To-Self completion:
  * "取一个支持自己的小动作"
* Quick Record completion:
  * "取一个支持自己的小动作"
* Episode Detail:
  * "下一步轻一点"
* Topic / discovery point detail:
  * "转成一个小动作"
* Experiment completion:
  * "把这次练习接成一个小动作"
* Draft self-check, rich incoming review, boundary clarity, and self-compassion pause:
  * optional completion action when the user needs a user-owned next step.

Product purpose:

* Convert reflection into one user-owned action.
* Reduce choice difficulty by showing one recommendation first.
* Separate intention from completion.
* Let the user skip without penalty.
* Create Self/Energy impact only when the action is completed, not when it is merely chosen.
* Avoid any implication that stored value can redeem another person's attention, care, apology, certainty, or behavior.

Recommended bottom-sheet layout:

```text
┌────────────────────────────┐
│ 取一个支持自己的小动作      关闭 │
│ 只选一个，别把照顾自己也变成任务。│
│                            │
│ 推荐                         │
│ ┌────────────────────────┐ │
│ │ 今晚不补发解释           │ │
│ │ 因为你已经把事实和解释分开了。│ │
│ │ 约 10 分钟 · 自己罐子     │ │
│ └────────────────────────┘ │
│                            │
│ 也可以                       │
│ [喝水] [把一个话题放进稍后]    │
│                            │
│ [ 就这个 ]                   │
│ [ 换一个 ]        [ 稍后 ]     │
└────────────────────────────┘
```

After choosing:

```text
┌────────────────────────────┐
│ 已放进今天的小动作             │
│ 今晚不补发解释                 │
│ 完成一点就算。不是为了表现，      │
│ 是为了把自己带回来。            │
│                            │
│ [完成了] [先放着] [换一个]      │
└────────────────────────────┘
```

Screen structure:

* Header:
  * title: "取一个支持自己的小动作"
  * helper: "只选一个，别把照顾自己也变成任务。"
* Recommendation card:
  * action title
  * one-line reason
  * estimated time or effort
  * source account / source state label
* Alternatives:
  * at most two chips or small buttons
* Controls:
  * primary: "就这个"
  * secondary: "换一个"
  * tertiary: "稍后"
* Selected state:
  * show the selected action and low-pressure completion controls
* Completed state:
  * show completion copy and optional account impact reason

Choice difficulty constraints:

* Default surface shows exactly one recommendation.
* Show no more than two alternatives.
* "换一个" cycles to another recommendation, but should not open a catalogue.
* After 2 refreshes in one session, show copy:
  * "如果现在都不合适，也可以稍后。"
* "稍后" must be always visible.
* Avoid categories, filters, point costs, shopping grids, streak goals, or comparison-heavy cards in MVP.
* Do not ask the user to choose from more than 3 visible actions at once.

Recommendation card content:

* Title:
  * imperative but gentle, such as "喝水", "今晚不补发解释", "把一个话题放进稍后".
* Reason:
  * transparent and tied to recent state.
  * examples:
    * "因为你现在激活有点高，先降低输入量。"
    * "因为你已经把事实和解释分开了。"
    * "因为这次连接很暖，也容易让你想继续确认。"
    * "因为你把很多点看见了，不需要一次处理完。"
* Effort:
  * "约 1 分钟"
  * "约 3 分钟"
  * "今晚"
  * "不用写字"
* Source label:
  * "来自自己罐子"
  * "来自能量罐子"
  * "来自连接罐子"
  * "来自这次记录"
  * "来自稍后话题"

Source-account recommendation logic:

* Connection source:
  * recommend receiving, anchoring, or reducing escalation.
  * examples:
    * "保存一句我收到的温暖"
    * "允许这次连接先到这里"
    * "只回应一个最重要的点"
    * "把其余内容放进稍后"
  * completion impact:
    * usually Self or Energy, not Connection.
    * Connection changes only if the user records a separate observable interaction or self-contact episode.
* Self source:
  * recommend agency, boundary, responsibility split, or self-attack reduction.
  * examples:
    * "今晚不补发解释"
    * "写下什么是我的责任/什么不是"
    * "保存草稿不发送"
    * "给自己一句不攻击的话"
    * "允许先做一个不完美的 2 分钟版本"
  * completion impact:
    * Self +1 when completed with transparent reason.
* Energy source:
  * recommend restoration, reduced stimulation, or body landing.
  * examples:
    * "喝水"
    * "洗手或洗脸"
    * "走动 1 分钟"
    * "今晚减少复盘"
    * "做一个五感落地"
  * completion impact:
    * Energy +1 if user reports lighter/same-but-supported.
    * Energy 0 if no effect or not sure.
    * No penalty if it did not help.

State-aware rules:

* If activation is high:
  * prefer body landing, delay, reduced checking, and "回到自己".
  * avoid reflective writing as the first recommendation.
* If daily market is sleep-deprived:
  * prefer sleep protection, low-stimulation, and short physical actions.
* If user selected guilt, resentment, over-carrying, rescuing, or pressure to reply:
  * prefer boundary clarity or "no extra message tonight".
* If user just received warmth and activation is also high:
  * prefer receiving and anchoring, not extra pursuit.
* If user has many discovery points:
  * prefer "选一个存到稍后，其余先放着".
* If user is in self-facing space:
  * recommendations can support self-contact, body contact, values contact, or reduced self-attack.

Choosing vs completing:

* Choosing:
  * creates a `PersonalAction` with status `selected`.
  * records intention and source context.
  * creates no account impact.
  * copy: "已放进今天的小动作。"
* Completing:
  * changes status to `completed`.
  * may create a small Self/Energy impact with a reason.
  * asks only one optional effect question if needed:
    * "做完以后更像哪一种？"
    * chips: "轻一点" / "差不多" / "更累" / "说不清"
* Skipping:
  * status can be `skipped` only for the suggestion instance.
  * creates no negative account impact.
  * copy: "现在不选也可以。"
* Leaving for later:
  * keep status `selected`.
  * no reminder or overdue state in MVP.

Completion copy:

* Completed Self action:
  * "这次存进自己罐子：你完成了一个由自己能决定的动作。"
* Completed Energy action:
  * "这次存进能量罐子：你给身体或注意力留了一点空间。"
* Completed but not lighter:
  * "没有变轻也不代表没用。你至少看见了什么不适合现在。"
* Not completed:
  * "先放着也可以，不会扣掉什么。"

Account impact rules:

* `selected`:
  * no account impact.
* `completed`:
  * Self +1 if the action expresses agency, boundary, responsibility split, draft-saving, reduced self-attack, or non-compulsive delay.
  * Energy +1 if the action supports rest, grounding, lower stimulation, sleep protection, nourishment, or reduced rumination.
  * Energy 0 when user says "差不多" or "说不清" and no clear restorative effect is recorded.
  * Energy -1 should not be generated from a failed action; the original episode can already capture depletion.
  * Connection 0 by default.
  * Connection can change only through a separate saved episode with observable contact / being-seen / mutuality evidence, or explicit self-contact in a self-facing space.

Action library constraints:

* Keep actions tiny:
  * 1-10 minutes by default.
  * "tonight" is allowed for non-action commitments such as not sending more messages.
* Prefer concrete verbs:
  * "喝水", "保存草稿", "放进稍后", "走动 1 分钟".
* Avoid vague improvement goals:
  * "变得更好", "提升自尊", "修复关系", "停止焦虑".
* Avoid outward-control actions:
  * "让对方回复", "测试对方", "发消息让对方愧疚", "证明自己".
* Avoid high-effort therapy-like tasks:
  * long journaling
  * detailed childhood analysis
  * multi-step trauma processing
  * forced gratitude lists

Empty / no-fit states:

* If no recommendation fits:
  * show "现在可能不需要动作，只需要停一下。"
  * actions: "回到自己" / "稍后"
* If user keeps refreshing:
  * show "选择本身也可能很累。可以先不选。"
* If storage is unavailable:
  * allow completing without persistence, with copy:
    * "这次可能无法保存，但你仍然可以先做这个动作。"

Microcopy do / do not:

Use:

* "取一个支持自己的小动作"
* "就这个"
* "换一个"
* "稍后"
* "已放进今天的小动作"
* "完成一点就算"
* "不会扣掉什么"

Avoid:

* "兑换"
* "消费"
* "花费"
* "余额不足"
* "解锁对方回应"
* "再赚一点"
* "任务失败"
* "连续打卡"

#### Personal Action Menu Acceptance Additions

Add these checks to the Personal Action Menu acceptance pass:

* [ ] User can open the menu from account detail and selected completion surfaces.
* [ ] The menu shows exactly one primary recommendation and no more than two alternatives.
* [ ] User can choose, refresh, skip, or close without penalty.
* [ ] Refresh does not reveal a catalogue, store, or point-cost comparison.
* [ ] Choosing an action creates intention only and no account impact.
* [ ] Completing an action can create only transparent Self/Energy impact by default.
* [ ] Connection impact is never created by completing a personal action unless a separate observable episode supports it.
* [ ] High-activation state recommends body landing / delay before reflection.
* [ ] Sleep-deprived or high-expectation daily market prefers low-cognitive-load actions.
* [ ] The menu includes no reward-store, spending, balance-insufficient, streak, or redemption-for-response language.
* [ ] Skipping or leaving an action unfinished creates no negative account impact and no shame copy.

#### Settings / Privacy / Reset Layout

Settings is not an emotional-work surface. It exists to make local-first data behavior explicit, give the user control over emotionally meaningful records, and avoid hidden product promises.

Entry points:

* Bottom navigation or Home secondary icon.
* First-run setup link: "隐私和本地数据".
* Storage warning banner: "查看设置".
* Delete/reset confirmation flows.

Primary purposes:

* Explain where data is stored.
* Explain what the app does not do.
* Let the user reset/delete local data with clear confirmation.
* Provide export/import placeholders without implying cloud sync exists.
* Keep archive management light in first release.

Recommended layout:

```text
┌────────────────────────────┐
│ ←  设置                     │
│                            │
│ 本地和隐私                    │
│ 数据保存在这个浏览器/设备里。    │
│ 不会上传到服务器，也不会自动同步。│
│ [了解更多]                    │
│                            │
│ 我的空间                      │
│ 当前：安                      │
│ [修改名称]                    │
│                            │
│ 数据                          │
│ [导出数据（稍后支持）]          │
│ [导入数据（稍后支持）]          │
│ [删除本地数据]                 │
│                            │
│ 关于                          │
│ 这不是心理治疗或危机干预工具。   │
└────────────────────────────┘
```

Sections:

* Local and privacy:
  * short local-first note
  * limitations
  * what the app does not access
* Emotional spaces:
  * current space name
  * rename current space
  * advanced multi-space management can wait
* Data controls:
  * storage status
  * export/import placeholder
  * reset/delete data
* Boundaries:
  * not therapy / not crisis intervention
  * no AI analysis / no partner inference in MVP
* App info:
  * version
  * schema version if useful for debugging

Local-first privacy copy:

* Primary copy:
  * "你的记录保存在这个浏览器/设备里。MVP 不上传服务器，也不自动同步到其他设备。"
* Device-access limitation:
  * "如果别人能打开你的设备、浏览器或同一个用户账号，也可能看到这些记录。"
* Browser-clearing limitation:
  * "清理浏览器数据、无痕模式、换设备或卸载 PWA 可能会让记录丢失。"
* Storage warning:
  * "当前浏览器可能无法稳定保存数据。重要内容可以先复制出来。"
* Do not claim:
  * end-to-end encryption
  * password protection
  * cloud backup
  * cross-device sync
  * clinical confidentiality

What the app does not access:

* Section title: "它不会做什么"
* Bullets:
  * "不会读取你的聊天软件。"
  * "不会监控已读、在线状态、回复速度或社交媒体。"
  * "不会把草稿发送给任何人。"
  * "不会分析对方真实想法。"
  * "不会用分数判断你值不值得被爱。"

Data controls:

* Storage status:
  * "可以保存到本地"
  * "可能无法保存"
  * "还没有记录"
  * "已保存 X 条记录 / X 个稍后话题 / X 个锚点"
* Export/import:
  * first release placeholder labels:
    * "导出数据（稍后支持）"
    * "导入数据（稍后支持）"
  * disabled helper:
    * "第一版先保证本地记录稳定，完整导出/导入稍后再做。"
* Reset/delete:
  * button label: "删除本地数据"
  * destructive color but visually calmer than emergency UI.

Reset/delete confirmation:

* First confirmation bottom sheet:
  * title: "删除这个设备上的本地数据？"
  * copy: "这会删除记录、稍后话题、锚点、小动作、练习和设置。删除后无法在应用里恢复。"
  * options:
    * "取消"
    * "继续删除"
* Second confirmation for all-data delete:
  * title: "最后确认"
  * copy: "如果你只是想换一个空间，可以先返回修改名称。确定删除后，会回到第一次打开的状态。"
  * confirmation input:
    * require typing "删除" or checking "我知道这会删除本地数据"
  * destructive action:
    * "删除并回到初始状态"
* After deletion:
  * clear local root state
  * route to `/setup`
  * show first-run setup, not a success celebration

Partial reset:

* MVP may skip partial reset to reduce complexity.
* If included, keep options few:
  * "只清空草稿"
  * "删除所有记录"
  * "删除全部本地数据"
* Do not include complex per-account deletion because account summaries are derived and should not be edited separately.

Emotional space settings:

* MVP supports one active space with rename.
* Copy:
  * "这个空间可以是一段关系，也可以是我和自己的关系。"
* Default names:
  * interpersonal: "这段关系"
  * self-facing: "我和自己"
* Rename should not affect saved records except display label.
* Multi-space creation, archive, merge, and transfer can remain later work unless implementation scope allows a simple version.

Clinical / crisis boundary in Settings:

* Section title: "边界"
* Copy:
  * "情感储蓄罐是自我记录和回到自己的工具，不是心理治疗、医疗建议或危机干预。"
  * "如果你担心自己或他人的即时安全，请联系身边可信的人、当地紧急服务或专业支持。"
* Do not:
  * provide danger scoring
  * offer legal/safety planning
  * imply the app can handle crisis alone

Settings copy do / do not:

Use:

* "本地数据"
* "这个浏览器/设备"
* "删除本地数据"
* "稍后支持"
* "不会上传服务器"
* "不会自动同步"

Avoid:

* "绝对安全"
* "完全私密"
* "永久保存"
* "云端已备份"
* "医疗级保密"
* "恢复所有删除数据"

#### Settings Acceptance Additions

Add these checks to the Settings acceptance pass:

* [ ] User can open Settings from app navigation.
* [ ] Settings clearly says data is stored in this browser/device.
* [ ] Settings explains device/browser access and browser-data-clearing limitations.
* [ ] Settings states that MVP does not upload, sync, monitor external apps, analyze partner psychology, or send drafts.
* [ ] User can rename the active emotional space.
* [ ] User can see reset/delete local data controls.
* [ ] Deleting all local data requires confirmation and returns to first-run setup.
* [ ] Export/import appears only as placeholder if not implemented.
* [ ] Settings includes non-clinical boundary copy without claiming therapy, crisis care, encryption, or cloud backup.
* [ ] Settings avoids emotional-work prompts, relationship verdicts, and account-score management.

#### P0 Quick Record Blueprint

Frame:

* Title: "存下这次发生的事"
* Helper: "先存事实和感受，不急着判定关系。"
* Save button: "存下"
* Close copy: "不保存也可以。"

Fields:

* Title:
  * label: "给这次一个短标题"
  * placeholder: "例如：收到一段很暖的邮件"
* Facts:
  * label: "可确认的事实"
  * placeholder: "摄像头能拍到的部分..."
* Interpretation:
  * label: "我脑中出现的解释"
  * placeholder: "我猜它可能意味着..."
  * helper: "解释可以被记录，但暂时不用当成事实。"
* Emotion/body:
  * label: "情绪和身体"
  * chips reused from trigger flow
* Connection level:
  * label: "这次连接感"
  * 0: "没有"
  * 1: "很弱"
  * 2: "有一点"
  * 3: "比较明显"
  * 4: "很强"
* Activation level:
  * label: "这次激活程度"
  * 0: "平稳"
  * 1: "轻微"
  * 2: "有波动"
  * 3: "很强"
  * 4: "快被卷走"
* Next action:
  * label: "下一步我能做什么"
  * chips:
    * "先不补发"
    * "晚点再回"
    * "保存一个话题"
    * "回到自己"
    * "表达一个边界"
    * "只回应一个点"
    * "休息"
    * "说不清"

Completion:

* Title: "已经存下"
* Copy: "这次不用现在整理完。你之后可以回来慢慢看。"
* Primary: "回到首页"
* Secondary:
  * "添加发现点"
  * "保存锚点"
  * "打开明细"

#### P0 Copy Do / Do Not

Use:

* "先存事实"
* "结论可以慢一点"
* "回到自己"
* "不需要一次接住全部"
* "这是一个线索，不是命令"
* "你可以在乎，也可以不越过自己的限度"
* "没有立刻变轻，不代表你做错了"

Avoid:

* "你又失控了"
* "不要焦虑"
* "你太敏感了"
* "这说明对方不在乎"
* "关系健康分"
* "余额不足"
* "兑换回应"
* "疗愈创伤"
* "重塑大脑"
* "判断对方真实意图"

#### P0 Enum And Validation Freeze

This section freezes P0 option sets and validation behavior so implementation does not invent new labels or hidden rules while coding. P1/P2 can expand these tables later, but P0 should stay small and deterministic.

P0 enum policy:

* Labels are Chinese-first in UI.
* Internal values are stable English snake_case.
* "说不清" / "不确定" is a valid value, not an error.
* P0 should not add new enum values during implementation unless required to fix a blocker.
* P0 enum labels should live in `src/copy/*`; internal values should live in `src/domain/types.ts` or adjacent domain modules.

Daily market enum:

| Value | UI label | Home note key | P0 use |
|---|---|---|---|
| `observe` | "先观察" | `observe` | Default. |
| `sensitive` | "有点敏感" | `sensitive` | Home note reduces conclusion-making. |
| `triggered` | "被触发了" | `triggered` | High-activation Home variant. |
| `sleep_deprived` | "睡少了" | `sleep_deprived` | Bias toward light actions. |
| `low_energy` | "能量低" | `low_energy` | Bias toward Return-To-Self / light actions. |
| `steady` | "比较安稳" | `steady` | Allows receiving warmth without future proof. |

Space type enum:

| Value | UI label | Meaning |
|---|---|---|
| `interpersonal` | "我和别人" | Connection means observable interpersonal contact, being seen, care, repair, mutual listening. |
| `self` | "我和自己" | Connection means explicit self-contact with feeling, need, body, value, rhythm, or present reality. |

Connection level enum:

| Value | UI label |
|---:|---|
| 0 | "没有" |
| 1 | "很弱" |
| 2 | "有一点" |
| 3 | "比较明显" |
| 4 | "很强" |
| `not_sure` | "说不清" |

Activation level enum:

| Value | UI label |
|---:|---|
| 0 | "平稳" |
| 1 | "轻微" |
| 2 | "有波动" |
| 3 | "很强" |
| 4 | "快被卷走" |
| `not_sure` | "说不清" |

Body sensation enum:

| Value | UI label |
|---|---|
| `chest_tight` | "胸口紧" |
| `stomach_tight` | "胃缩住" |
| `hot` | "发热" |
| `want_to_cry` | "想哭" |
| `palms_tense` | "手心紧" |
| `head_full` | "头很满" |
| `numb` | "身体麻" |
| `no_sensation` | "没感觉" |
| `not_sure` | "说不清" |

Emotion family enum:

| Value | UI label |
|---|---|
| `anxious_afraid` | "焦虑/害怕" |
| `hurt_sad` | "委屈/难过" |
| `shame_guilt` | "羞耻/内疚" |
| `anger_resentment` | "生气/怨" |
| `longing` | "想念" |
| `seen_warm` | "被看见/很暖" |
| `mixed` | "混合" |
| `not_sure` | "说不清" |

Trigger urge enum:

| Value | UI label | P0 recommendation tendency |
|---|---|---|
| `reply_now` | "马上回复" | delay / one-point reply |
| `check_signal` | "检查信号" | 10-minute delay / Return-To-Self |
| `reread` | "反复重读" | save facts / stop rereading |
| `over_explain` | "补发解释" | save draft / no extra message |
| `ask_reassurance` | "问清楚/要确认" | delay / write need privately |
| `delete_withdraw` | "撤回/删除" | pause before action |
| `act_indifferent` | "装作不在乎" | name feeling privately |
| `cut_off` | "消失/切断" | Return-To-Self / boundary later |
| `attack` | "指责/攻击" | pause / do not send in high activation |
| `rescue` | "安抚或拯救对方" | capacity check / not over-carry |
| `sleep_ruminate` | "睡不着一直想" | low-cognitive action / sleep protection |
| `not_sure` | "说不清" | choose light stabilizing action |

Owned next action enum:

| Value | UI label | User-owned? | P0 account impact candidate |
|---|---|---:|---|
| `delay_10_min` | "延迟 10 分钟" | Yes | Self |
| `save_draft_do_not_send` | "保存草稿不发" | Yes | Self |
| `record_facts` | "记录事实" | Yes | Self |
| `save_later_topic` | "把话题放进稍后" | Yes | No impact in P0 unless saved as episode action. |
| `five_senses` | "做五感落地" | Yes | Self/Energy if completed through Return-To-Self. |
| `drink_water_wash_hands` | "喝水/洗手" | Yes | Self/Energy if completed through Return-To-Self. |
| `reply_one_point` | "只回应一个点" | Yes | Self if saved as owned action. |
| `no_extra_message` | "不再补发" | Yes | Self if saved as owned action. |
| `return_to_self` | "回到自己" | Yes | Through Return-To-Self practice only. |
| `save_quick_record` | "保存为快速记录" | Yes | Through saved episode only. |
| `not_now` | "暂时没有" | Valid | No impact. |
| `not_sure` | "说不清" | Valid | No impact by itself. |

Energy effect enum:

| Value | UI label | P0 energy impact |
|---|---|---:|
| `lighter` | "轻一点" | +1 |
| `same` | "差不多" | 0, usually not persisted |
| `more_tired` | "更重" | -1 only when explicitly selected |
| `not_sure` | "说不清" | 0, usually not persisted |

Return-To-Self completion enum:

| Value | UI label / meaning | P0 impact |
|---|---|---|
| `full` | Body action + anchor + return-to-life action completed. | Self +1, Energy user-rated. |
| `body_only` | User saved one body landing action. | Self +1 if saved. |
| `noticed_need` | User saved "我需要暂停". | Self +1 if saved. |
| `closed_early` | User left without saving. | No impact. |

Quick Record validation:

| Field | Required? | Valid empty behavior | Error / helper copy |
|---|---:|---|---|
| `title` | Soft required | Auto-suggest from fact/source: "一次触发", "一次回到自己", "一次互动". | "可以给这次一个短标题，之后更容易找到。" |
| `facts` | Required unless fact chip/prefill exists | Cannot save totally empty fact. | "至少存一个可确认的事实，哪怕很小。" |
| `interpretation` | No | Empty is allowed; explicit "暂时不解释" is valid. | "暂时不下解释也可以。" |
| `emotion/body` | Required as chip or "说不清" | "说不清" is valid. | "粗略命名就够了，也可以选说不清。" |
| `connectionLevel` | Required as value or "说不清" | "说不清" is valid. | "连接感可以不确定，但不要和激活程度合并。" |
| `activationLevel` | Required as value or "说不清" | "说不清" is valid. | "激活程度只是此刻状态，不是关系结论。" |
| `nextAction` | Required as action or "暂时没有" | "暂时没有" is valid and creates no Self impact. | "下一步只选一个由你能完成的动作。" |

Setup validation:

* Space name:
  * default: "某段关系"
  * empty input should fall back to default
  * no real name required
* Space type:
  * default: `interpersonal`
  * user can choose `self`
* Daily market:
  * default: `observe`
* Setup should be completable with defaults in under 60 seconds.
* Setup should not block because optional intention/description is empty.

Return-To-Self validation:

* User can complete full flow with one selected value per step.
* User can save partial `noticed_need` without selecting body action.
* User can save `body_only` with one body action and no anchor.
* Energy effect can be `not_sure`.
* No step should require text input.
* Skipping a step should not create penalty or failure copy.

Validation acceptance:

* [ ] P0 enum values are centralized and stable.
* [ ] User can complete setup with defaults.
* [ ] Quick Record cannot save without any fact or fact chip.
* [ ] "说不清" and "暂时没有" are accepted where defined.
* [ ] Optional fields never block saving.
* [ ] Validation errors are plain, local, and non-shaming.
* [ ] Validation does not infer partner intent, attachment style, trauma source, or relationship outcome.

#### P0 Copy Tables For Implementation

P0 repeated copy should live under `src/copy/` so tone and safety language can be reviewed without searching through components. These tables are starter content, not final brand copy.

`src/copy/privacy.ts`:

| Key | Copy |
|---|---|
| setupLocalNote | "你的记录保存在这个浏览器/设备里。MVP 不上传服务器，也不自动同步到其他设备。" |
| setupDeviceAccessNote | "如果别人能打开你的设备或浏览器，也可能看到这些记录。" |
| notTherapy | "这不是心理治疗或危机干预工具。" |
| noExternalAccess | "应用不会读取聊天软件、在线状态、已读回执或社交媒体。" |
| resetConfirmTitle | "删除本地数据？" |
| resetConfirmBody | "这会删除记录、锚点、草稿、回到自己的练习和设置。删除后无法在应用里恢复。" |
| resetFailed | "现在没有成功删除本地数据，请稍后再试或检查浏览器权限。" |

`src/copy/markets.ts`:

| Market | Label | Home note |
|---|---|---|
| `observe` | "先观察" | "今天先存事实，结论可以慢一点。" |
| `sensitive` | "有点敏感" | "今天信号可能会被放大，先存下可确认的事。" |
| `triggered` | "被触发了" | "现在先不用分析关系，选一个能让你少加重的动作。" |
| `sleep_deprived` | "睡少了" | "睡少时信号会更尖锐，先做轻一点的判断。" |
| `low_energy` | "能量低" | "今天适合轻动作，不适合反复消耗。" |
| `steady` | "比较安稳" | "今天可以收下温暖，也不用急着证明未来。" |

`src/copy/accounts.ts`:

| Account | Label | Empty | Positive/mixed | Reminder |
|---|---|---|---|---|
| `connection` | "连接" | "还没有连接证据。" | "有真实接触，也有不确定。" | "连接记录不是未来保证。" |
| `self` | "自己" | "从一个小动作开始。" | "你有几次把自己带回来。" | "这里记录选择和边界，不是你够不够好。" |
| `energy` | "能量" | "先观察什么消耗你，什么恢复你。" | "有一些动作在帮你恢复。" | "能量低不是失败，只是需要换轻一点。" |

Account reason copy starter set:

| Reason code | Copy |
|---|---|
| `observable_connection_evidence` | "有一条可观察的被看见/真实接触证据。" |
| `self_contact_evidence` | "你和自己的感受/需要有了一点真实接触。" |
| `fact_interpretation_split` | "你把事实和解释分开了。" |
| `owned_next_action` | "你选择了一个由自己能完成的下一步。" |
| `trigger_owned_action` | "你在被触发时选了一个自己的动作。" |
| `return_to_self_completed` | "你完成了一个回到自己的动作。" |
| `return_to_self_partial_pause` | "你看见自己需要停一下，并保存了这一点。" |
| `energy_restored` | "这个动作让你感觉轻了一点。" |
| `energy_depleted` | "这次让你明显消耗。" |
| `energy_neutral` | "能量变化不明显。" |
| `no_connection_evidence` | "这次还没有单独的连接证据。" |

`src/copy/emotions.ts`:

| Group | P0 chips |
|---|---|
| Body | "胸口紧", "胃缩住", "发热", "想哭", "手心紧", "头很满", "身体麻", "没感觉", "说不清" |
| Emotion | "焦虑/害怕", "委屈/难过", "羞耻/内疚", "生气/怨", "想念", "被看见/很暖", "混合", "说不清" |
| Urge | "马上回复", "检查信号", "反复重读", "补发解释", "问清楚/要确认", "撤回/删除", "装作不在乎", "消失/切断", "指责/攻击", "安抚或拯救对方", "睡不着一直想" |

Emotion calibration microcopy for P0:

* "冲动不是命令，只是线索。"
* "粗略命名就够了。"
* "说不清也可以先被记录。"
* "恐惧可以是在提醒我很在乎，不代表我必须马上控制什么。"

`src/copy/anchors.ts`:

| Key | Anchor |
|---|---|
| `facts_slow_conclusion` | "事实可以很小，结论可以慢一点。" |
| `receive_warmth` | "我可以接收温暖，也不急着加码。" |
| `not_all_at_once` | "我不用一次接住全部。" |
| `return_then_decide` | "我先回到自己，再决定下一步。" |
| `not_solve_now` | "这不是现在必须解决完的事。" |
| `no_self_attack` | "这很难，但我不需要再攻击自己。" |

`src/copy/placeholders.ts`:

| Surface | Copy | Working actions |
|---|---|---|
| Signal Check | "这个入口下一阶段支持。现在可以先用'我被触发了'或'回到自己'。" | "我被触发了", "回到自己" |
| Draft Self-Check | "草稿自检下一阶段支持。现在可以先保存草稿，或回到自己。" | "我被触发了", "回到自己" |
| Topics | "这里之后会整理发现点。现在可以先把这次发生的事存下来。" | "记录互动" |
| Experiments | "这里之后会放很小的练习。现在可以先取一个能支持自己的动作。" | "回到自己" |
| Account Detail | "明细下一阶段支持，首页先显示最近原因。" | "回到首页" |

`src/copy/errors.ts`:

| State | Copy |
|---|---|
| storageUnavailable | "现在可能无法保存到本地。你可以先继续看，但不要把这里当作已经存下。" |
| saveFailed | "这次还没有存下。可以先复制内容，或稍后再试。" |
| loadCorrupted | "本地数据暂时无法读取。你可以重置本地数据，或先不要继续写入新的记录。" |
| unsupportedVersion | "这份本地数据来自较新的版本，当前版本不能安全读取。" |
| emptyFact | "至少存一个可确认的事实，哪怕很小。" |
| resetFailed | "删除没有成功。为了避免误导，这里不会说已经清空。" |

Copy table acceptance:

* [ ] Repeated user-facing strings live in `src/copy/*`, not scattered through components.
* [ ] Copy tables use Chinese-first labels and avoid clinical primary labels.
* [ ] Error copy never claims success before persistence succeeds.
* [ ] Placeholder copy always offers a working P0 alternative.
* [ ] Account reason copy is deterministic and can be referenced by tests.

### P1 Required Surfaces

* "想检查信号" flow.
* "草稿自检" flow.
* "收到很多内容，不知道怎么接" flow.
* Topics / discovery points list and detail.
* Account Detail / Ledger with recent sources.
* Personal action menu.
* Experiments list, create, and completion reflection.
* Settings:
  * privacy note
  * reset/delete data
  * export/import placeholder only

### P1 First-Build Constraints

P1 should make the app useful beyond the first urgent trigger, but should still feel light on mobile.

General constraints:

* Each P1 flow should be completable in under 3 minutes.
* Each step should ask one primary question.
* Chips should appear before free text.
* Long text input must preserve local draft state.
* Recommendations must be deterministic and show reason copy.
* P1 flows may create records, topics, drafts, personal actions, or experiments, but should never require all of them.

Specific constraints:

* "想检查信号":
  * must include shame-free "我还是想检查"
  * must offer one 10-minute non-checking action
  * must not monitor, request, or infer external app status
* "草稿自检":
  * must not rewrite the draft
  * must not predict the other person's response
  * must support save draft, Return-To-Self, boundary placeholder, private record, and later topic
* "收到很多内容，不知道怎么接":
  * must use manual thread selection
  * must allow no response needed / save for later / respond to one point
  * must not require answering every emotional thread
* Topics:
  * must avoid overdue, debt, streak, or unfinished-pressure language
  * must preserve source context when possible
* Account detail:
  * must show sources and reasons beside balance/trend
  * must not become the Home primary focus
* Personal action menu:
  * one recommendation plus at most two alternatives
  * choosing creates intention only
  * completion may create Self/Energy impact
* Experiments:
  * tiny action, clear completion marker, no streaks, no penalties
  * "noticed only" and "not suitable" are valid outcomes

### P1 UI Blueprint And Microcopy

P1 expands the app beyond urgent stabilization. These screens should still feel like short mobile tools, not worksheets.

#### P1 "想检查信号" Blueprint

Purpose:

* Help the user notice the checking impulse before opening external apps, rereading, refreshing, or seeking reassurance.
* Offer one 10-minute non-checking action without shaming the user if they still check.

Global frame:

* Entry title: "先看见这个想确认的冲动"
* Helper: "你可以检查，也可以先给自己 10 分钟。这里不评判，只帮你看清楚。"
* Primary start: "开始缓冲"
* Secondary: "直接回到自己"
* Progress:
  * "1/4 想确认什么"
  * "2/4 如果是好信号"
  * "3/4 如果没有信号"
  * "4/4 给自己 10 分钟"

Step 1 confirmation target:

* Title: "我想通过检查确认什么？"
* Helper: "不是问你该不该检查，只是先看见期待。"
* Chips:
  * "对方还在不在乎"
  * "连接有没有变冷"
  * "我有没有被忽略"
  * "我是不是做错了"
  * "对方有没有新动作"
  * "我是不是需要再发一句"
  * "这段关系有没有希望"
  * "我只是想缓解不安"
  * "说不清"
* Primary: "预演结果"

Step 2 good-signal preview:

* Title: "如果看到好信号，我接下来可能会怎样？"
* Helper: "好信号也可能让人继续加码。"
* Chips:
  * "松一口气"
  * "想继续看更多"
  * "想马上回应/靠近"
  * "开始幻想未来"
  * "担心好信号会消失"
  * "还是不够确定"
  * "可以停下"
  * "说不清"
* Calibration copy: "好信号可以说明此刻有一点连接，但不能保证未来。"
* Primary: "再看另一种结果"

Step 3 bad/absent-signal preview:

* Title: "如果没有看到想要的信号，我可能会怎样？"
* Helper: "先保护自己，不让一个信号决定全部。"
* Chips:
  * "继续刷新"
  * "想补发解释"
  * "想质问"
  * "觉得连接消失"
  * "开始自责"
  * "想切断"
  * "睡不着复盘"
  * "可以先停一下"
  * "说不清"
* Calibration copy: "没有信号也不能证明我不重要、连接消失、未来结束。"
* Primary: "选择 10 分钟"

Step 4 non-checking action:

* Title: "先给自己 10 分钟，不把决定交给信号"
* Helper: "10 分钟后你仍然可以决定。"
* Recommended action card:
  * high activation: "五感落地"
  * sleep-deprived / late night: "今晚先不检查，去回到自己"
  * shame / self-blame: "先写一句不攻击自己的话"
  * over-explaining urge: "草稿存到明天"
  * loneliness: "做一个自我接触或真人支持动作"
* Action chips:
  * "五感落地"
  * "喝水/洗手"
  * "走动 1 分钟"
  * "把手机扣下 10 分钟"
  * "保存草稿到明天"
  * "写下事实，不写结论"
  * "看一个已存下的温暖证据"
  * "回到自己"
  * "我还是想检查"
* Primary:
  * non-checking selected: "就这个，10 分钟"
  * checking selected: "继续检查并记录"
* Secondary:
  * "换一个"
  * "稍后"

Completion:

* Non-checking path:
  * title: "你把主动权拿回来了一点"
  * copy: "10 分钟不是放弃关系，是不让不安直接开车。"
  * primary: "开始回到自己"
  * secondary: "保存这个选择" / "完成"
* Checking path:
  * title: "也可以。我们把模式存下"
  * copy: "检查不是失败。重要的是看见：我在期待什么，检查后发生了什么。"
  * follow-up chips: "轻了一点" / "更想继续看" / "更不安" / "没有变化" / "我不想记录"
  * primary: "保存结果"
  * secondary: "回到自己"

Do not include:

* "连续 X 天没检查"
* "检查失败"
* blocking access to other app behavior
* any request for read receipts, online status, response speed, or social feed data

#### P1 "草稿自检" Blueprint

Purpose:

* Help the user decide whether to send, save, lighten, privately record, clarify a boundary, or return to self.
* Keep the draft local and avoid reply optimization.

Global frame:

* Entry title: "先不急着发"
* Helper: "这里不会帮你写得更会获得回应，只帮你看：现在适不适合发。"
* Draft placeholder: "把想发的话放在这里，或先跳过。"
* Primary start: "开始自检"
* Secondary:
  * "还没写，先检查状态"
  * "直接回到自己"
* No send button inside the app.

Step sequence:

1. State:
   * title: "我现在适合判断这段草稿吗？"
   * chips: "基本在当下" / "连接警报很响" / "旧感觉被碰到" / "内部审判者很响" / "边界/责任压力" / "身体过载" / "说不清"
2. Motivation:
   * title: "我写这段主要是为了什么？"
   * chips: "表达真实感受" / "修复/道歉" / "提出请求" / "说明边界" / "维持在场" / "希望得到回应" / "解释/证明自己" / "安抚或拯救对方" / "降低不安" / "让对方知道 TA 错了"
3. No-response tolerance:
   * title: "如果暂时没有回应，我能承受吗？"
   * chips: "可以回到生活" / "会有点难，但能等" / "会反复检查" / "会想补发" / "会睡不着/复盘" / "会很崩" / "说不清"
4. Content risk:
   * title: "这段话里有没有高风险内容？"
   * chips: "暴露太多隐私" / "分析对方心理" / "暗含必须回应" / "过度解释/自证" / "很多话题塞一起" / "边界不清" / "攻击/讽刺/控诉" / "没有明显风险" / "说不清"
5. Stance:
   * title: "这段更像哪种姿态？"
   * empowered chips: "创造者" / "引导者" / "挑战者"
   * drama chips: "受害者" / "拯救者" / "迫害者"
   * helper: "这不是贴标签，只是看它会把你带向哪里。"
6. After-send preview:
   * title: "发出去以后，我可能会怎样？"
   * chips: "能回到生活" / "会一直看回复" / "会后悔/想撤回" / "会想再补一段" / "会失眠/复盘" / "会更清楚" / "会更有边界" / "说不清"

Recommendation cards:

* `ready_enough`
  * title: "可以发：足够真实，也足够低压"
  * copy: "这不是保证对方会怎样，只是说明你发送后比较不容易把自己交出去。"
  * actions: "保存检查结果" / "复制草稿" / "回到自己"
* `lighten_it`
  * title: "减轻一点：表达有价值，但压力偏高"
  * chips: "只留一个重点" / "删掉心理分析" / "去掉必须回应的压力" / "把其余放进稍后"
  * actions: "保存轻一点版本的方向" / "把多余话题放进稍后" / "保存草稿"
* `save_as_draft`
  * title: "先存草稿：现在回应期待太高"
  * copy: "存下不是压抑，是不让这一刻替你决定。"
  * actions: "保存草稿" / "明天再看" / "回到自己"
* `private_record_first`
  * title: "先私下记录：这段可能更像写给自己看的"
  * actions: "转成私下记录" / "自我关怀一下" / "稍后再说"
* `boundary_expression`
  * title: "改成边界表达：核心是需要或限度"
  * chips: "说一个真实限度" / "提出一个具体请求" / "去掉惩罚/威胁" / "写明我会做什么"
  * actions: "进入边界清晰检查" / "保存草稿" / "稍后"
* `return_to_self_first`
  * title: "先回到自己：现在不适合做发送决定"
  * copy: "不是不能发，是先不要让高浪替你发。"
  * actions: "进入回到自己" / "保存草稿不发" / "关闭"

Do not include:

* AI rewriting
* "这样发更容易让 TA 回你"
* prediction of recipient reaction
* send integration
* automatic privacy detection claims
* penalty for sending anyway

#### P1 "收到很多内容，不知道怎么接" Blueprint

Purpose:

* Help the user receive a dense warm or complex incoming message without turning every thread into an immediate response obligation.
* Save emotional threads and discovery points before they are forgotten.

Global frame:

* Entry title: "先不用一次接住全部"
* Helper: "可以只存你收到的部分，不急着决定怎么回。"
* Optional input placeholder: "可以贴一小段，或只写一句：这段大概在说什么。"
* Primary: "拆成几条线索"
* Secondary: "直接回到自己"

Step 1 message shape:

* Chips:
  * "很暖"
  * "信息很多"
  * "很脆弱"
  * "对方解释了很多"
  * "让我想认真回应"
  * "让我有压力"
  * "我被看见了"
  * "我怕漏掉什么"
  * "说不清"

Step 2 received threads:

* Title: "这段里，我先收到了什么？"
* Helper: "不是总结全文，只是选你心里有反应的几条。"
* Thread chips:
  * "被看见/被理解"
  * "澄清/解释"
  * "脆弱/自我暴露"
  * "表达困难/语言缓冲"
  * "失眠/反复复盘"
  * "完美主义/拖延"
  * "价值观/意义"
  * "自我照顾/互相照顾"
  * "需要稍后再聊的话题"
  * "其他"
* If more than three threads are selected:
  * ask: "现在先处理哪三条？"
  * save the rest as candidate discovery points.
* Evidence prompt for Connection impact:
  * "这条来自哪句/哪个可观察线索？"
  * skippable; skipped evidence creates no automatic Connection impact.

Step 3 mixed emotion:

* Title: "收到这些以后，我现在是什么状态？"
* Helper: "温暖和压力可以同时存在。"
* Chips:
  * "温暖"
  * "被看见"
  * "感动"
  * "感激"
  * "安心"
  * "兴奋"
  * "怕回应不好"
  * "有压力"
  * "信息过载"
  * "想马上认真回"
  * "想逃开"
  * "有点失眠/复盘"
  * "混合"
  * "说不清"

Step 4 thread handling:

* Title: "每一条线索，现在怎么放？"
* Handling choices per thread:
  * "我先收到了"
  * "这条需要回应"
  * "放进稍后"
  * "不需要回应"
* Helper: "每条只选一个处理方式，减少过载。"

Step 5 enough-for-now direction:

* Title: "如果要回，一次够不够只回一个方向？"
* Helper: "回应不必覆盖所有线索，先让对方知道你收到了也可以。"
* Options:
  * "只确认我收到了"
  * "先回应最重要的一条"
  * "先表达感谢/被触动"
  * "问一个开放问题"
  * "反映我听到的重点"
  * "先不回复，存下"
  * "去草稿自检"
  * "先回到自己"

Completion:

* Title: "这次先存到这里"
* Summary sections:
  * "我收到的温暖/理解"
  * "现在需要回应的一条"
  * "可以稍后再聊/再理解的发现点"
  * "我身体/情绪的状态"
  * "一个足够的下一步"
* Actions:
  * "保存为记录"
  * "把发现点存进稍后"
  * "保存一句锚点"
  * "进入草稿自检"
  * "回到自己"
  * "完成"

Do not include:

* automatic message summary
* sender psychology analysis
* response expectation prediction
* generated reply optimized for connection
* requirement to answer every thread
* "warm message proves commitment" framing

#### P1 Supporting Screen Blueprints

Topics:

* Title: "稍后再看"
* Empty copy: "看见的点可以先放在这里，不需要马上处理。"
* Tabs or filters:
  * "发现点"
  * "想探索的问题"
  * "行动想法"
  * "已看过"
* Item actions:
  * "加一点笔记"
  * "转成小练习"
  * "先放着"
  * "不需要了"
* Avoid overdue, debt, or unfinished-pressure language.

Account detail:

* Title pattern:
  * "连接明细"
  * "自己明细"
  * "能量明细"
* Top summary:
  * qualitative status first
  * numeric balance only as secondary detail
* Required sections:
  * "最近变化"
  * "来自哪些记录"
  * "为什么这样算"
  * "取一个支持自己的小动作"
* Avoid relationship score or redemption framing.

Personal action menu:

* Title: "取一个支持自己的小动作"
* Helper: "只选一个，别把照顾自己也变成任务。"
* Structure:
  * one recommended card
  * at most two alternatives
  * "换一个"
  * "稍后"
* Choosing action copy:
  * "已放进今天的小动作"
* Completion copy:
  * "完成一点就算。不是为了表现，是为了把自己带回来。"

Experiments:

* Title: "小练习"
* Empty copy: "这里可以放一个很小的练习，不需要连续打卡。"
* Create steps:
  * focus: "我想练习什么？"
  * tiny action: "小到今天能试一次的动作是什么？"
  * completion marker: "什么算练习过一次？"
* Attempt outcomes:
  * "完成了"
  * "完成一部分"
  * "只是看见了"
  * "不适合"
* Avoid streaks and missed-day copy.

### P2 Light Surfaces In First Build

These can appear as optional compact branches or chips in P0/P1 flows:

* connection-continuity check
* emotion calibration
* boundary clarity
* self-compassion pause
* old echo / mosquito-elephant / inner critic
* empowerment shift
* healthy love literacy
* seeing / being seen practice

### P2 First-Build Constraints

P2 exists to preserve depth without turning the first release into a therapy workbook or course.

P2 branch rules:

* Branches are optional and contextual, not Home primary entries.
* Branches should be 1-3 screens in the first release.
* Branches can save structured output, but should not require long narrative writing.
* Branches should always offer "不确定", "先不看这么深", or Return-To-Self.
* High activation should bias toward Return-To-Self instead of deeper reflection.
* P2 completion should return to the original flow or close with one owned next action.

P2 must not:

* diagnose attachment type, object constancy, trauma source, inner parts, or the other person
* produce a score of self-worth, boundary quality, relationship health, empathy, compatibility, or love
* turn healthy love literacy into a course before P0/P1 loops work
* turn seeing / being seen into people-reading or obligation to keep listening
* turn emotion calibration into forced positive reframing
* turn boundary clarity into control, punishment, or testing

### P2 Compact Branch Template

All P2 branches in the first release should share this structure:

1. Pacing gate:
   * title acknowledges the branch softly
   * offers "只轻轻看一下", "先不看这么深", and "回到自己"
2. One core question:
   * chip-first, optional short text
   * no demand for a full story
3. One owned next action:
   * return to original flow
   * save a structured note
   * save a later topic
   * go to Return-To-Self
4. Completion:
   * one sentence summary
   * optional account-impact preview
   * no score, diagnosis, or verdict

Shared branch controls:

* "不确定"
* "先不看这么深"
* "存到稍后"
* "回到自己"
* "完成"

Shared saved fields:

* `sourceFlow`
* `sourceEpisodeId?`
* `branchType`
* `selectedChips`
* `note?`
* `ownedNextAction?`
* `accountImpacts`
* `createdAt`

#### P2 Connection-Continuity Branch

Trigger from:

* checking signals
* urge to reread, refresh, send again, withdraw, cut off, or push-pull
* state check selects connection alarm

Screens:

1. Gate:
   * title: "连接感现在很响"
   * copy: "这里不判断关系，只看事实和感觉有没有混在一起。"
2. Core question:
   * title: "此刻消失的是事实，还是连接感？"
   * chips:
     * "连接还在，只是变远了"
     * "我感觉它消失了"
     * "我想马上确认"
     * "我想切断/装作不在乎"
     * "我一边想靠近一边想逃"
     * "说不清"
3. Evidence split:
   * prompt: "有什么事实能说明连接曾经存在？有什么还不能证明它已经消失？"
   * optional short inputs
4. Next action:
   * "延迟 10 分钟"
   * "看一个已存下的连接证据"
   * "回到自己"
   * "保存为稍后话题"

Account impact:

* Self +1 when the user separates feeling from fact and chooses a stabilizing action.
* Connection 0 unless the user records observable contact / mutuality evidence in an episode.

Do not:

* diagnose attachment style
* create object-constancy score
* promise connection permanence

#### P2 Emotion Calibration Branch

Trigger from:

* user selects fear, shame, guilt, anger, jealousy, vulnerability, or mixed emotion
* user selects "情绪很强" or "说不清"

Screens:

1. Gate:
   * title: "这个情绪不是敌人"
   * copy: "它可能是在保护什么，也可能会推你做过快的动作。"
2. Core question:
   * title: "这个情绪可能在保护什么？"
   * chips:
     * "连接"
     * "尊严"
     * "边界"
     * "被看见"
     * "稳定"
     * "不再受伤"
     * "重要的人/事"
     * "说不清"
3. Risky impulse:
   * title: "它可能会推我做什么？"
   * chips:
     * "控制"
     * "攻击"
     * "讨好"
     * "逃开"
     * "补发解释"
     * "反复确认"
     * "压下去"
     * "说不清"
4. Wiser action:
   * "允许情绪在，但先不让它开车"
   * "记录事实"
   * "做一个身体落点"
   * "说一个边界"
   * "存到稍后"

Account impact:

* Self +1 when the user names the signal and chooses a wiser action.
* Energy user-rated.

Do not:

* label emotions as good/bad
* tell the user to eliminate fear, sadness, anger, or vulnerability
* force positive reframing

#### P2 Boundary Clarity Branch

Trigger from:

* guilt, resentment, anger, rescuing, pleasing, pressure to reply, over-explaining, unclear no, or fear of disappointing

Screens:

1. Gate:
   * title: "这里可能有一个界限"
   * copy: "界限不是惩罚对方，是看清我能负责什么。"
2. Responsibility split:
   * title: "什么是我的？什么不是我的？"
   * chips for mine:
     * "我的感受"
     * "我的表达"
     * "我的限度"
     * "我的下一步"
   * chips for not mine:
     * "对方的情绪"
     * "对方是否理解"
     * "对方是否回应"
     * "对方的选择"
3. Boundary form:
   * title: "我能给出的一个真实限度是什么？"
   * chips:
     * "晚点再回"
     * "只回应一个点"
     * "不解释更多"
     * "不接住全部"
     * "说一个请求"
     * "说一个不"
     * "允许对方失望"
     * "先暂停"
4. Next action:
   * "保存边界句"
   * "去草稿自检"
   * "回到自己"
   * "存到稍后"

Account impact:

* Self +1 or +2 based on user-rated difficulty.
* Energy user-rated.
* Connection 0 unless later episode records mutual respect/contact.

Do not:

* use boundary as control, threat, punishment, or test
* provide legal or safety planning
* score boundary quality

#### P2 Self-Compassion Branch

Trigger from:

* shame, inner critic, self-attack, regret, failure language, or harsh self-judgment

Screens:

1. Gate:
   * title: "先少攻击自己一点"
   * copy: "这不是开脱，是在难的时候不再补刀。"
2. Pain noticing:
   * title: "这一下哪里很难？"
   * chips:
     * "怕不被要"
     * "觉得自己做错了"
     * "很羞耻"
     * "很孤单"
     * "很想证明自己"
     * "很累"
     * "说不清"
3. Inner critic rewrite:
   * title: "那个严厉声音在说什么？"
   * optional input
   * rewrite prompt: "能不能改成一句诚实但不攻击的话？"
4. Kind next action:
   * "读一句不攻击自己的话"
   * "喝水/休息"
   * "保存草稿不发"
   * "回到自己"
   * "做一个负责但温和的动作"

Account impact:

* Self +1 when the user reduces self-attack or chooses a caring but responsible action.
* Energy user-rated.

Do not:

* create self-esteem or self-worth score
* force gratitude or positivity
* remove accountability

#### P2 Old Echo / Inner Critic Branch

Trigger from:

* user says reaction feels bigger than event
* old echo, inner critic, familiar pain, or high shame is selected

Screens:

1. Gate:
   * title: "可能有旧感觉被碰到了"
   * copy: "这里不是为了挖创伤，只是轻轻分清今天和旧感觉。"
2. Mosquito:
   * title: "今天的蚊子是什么？"
   * prompt: "只写今天可确认的小事。"
3. Elephant:
   * title: "它碰到的可能是什么需要？"
   * chips:
     * "被看见"
     * "被选择"
     * "安全"
     * "尊重"
     * "不被丢下"
     * "不被羞辱"
     * "能做自己"
     * "说不清"
4. Protective program:
   * title: "旧保护程序想让我怎么做？"
   * chips:
     * "检查"
     * "证明"
     * "攻击"
     * "撤退"
     * "讨好"
     * "控制"
     * "麻木"
     * "拯救"
     * "完美主义"
5. Present-self response:
   * "给自己一句话"
   * "回到自己"
   * "保存发现点"
   * "边界清晰"
   * "找真人支持"

Account impact:

* Self +1 when the user distinguishes present fact from old echo and chooses a present-self response.
* Energy user-rated.

Do not:

* ask for trauma details
* determine childhood source
* provide trauma score or percentage analysis
* claim IFS therapy or parts unburdening

#### P2 Empowerment Shift Branch

Trigger from:

* helpless waiting
* rescuing / over-carrying
* accusation / control urge
* draft stance check selects victim, rescuer, or persecutor

Screens:

1. Gate:
   * title: "我想把主动权拿回来一点"
   * copy: "不是责备自己，而是找回一个我能选择的小动作。"
2. Stance:
   * title: "我现在更像站在哪里？"
   * chips:
     * "受害者：等对方决定我的状态"
     * "拯救者：想替对方负责太多"
     * "迫害者：想让对方知道 TA 错了"
     * "说不清"
3. Shift:
   * Victim -> Creator:
     * prompt: "我仍然能选择的一件小事是？"
   * Rescuer -> 引导者:
     * prompt: "什么是我的责任，什么该留给对方？"
   * Persecutor -> Challenger:
     * prompt: "我能清楚表达的事实或边界是什么？"
4. Next action:
   * "选一个我能做的动作"
   * "保存为草稿提醒"
   * "回到自己"
   * "存到稍后"

Account impact:

* Self +1 for completing an empowerment shift with an owned next action.
* Connection 0 unless later observable mutual contact is recorded.

Do not:

* label the other person as victim/rescuer/persecutor
* use the shift to bypass pain or accountability

#### P2 Healthy Love Literacy Branch

Trigger from:

* warm interaction, conflict, disillusionment, repair, fear of novelty fading, or media-shaped love assumptions

Screens:

1. Gate:
   * title: "这可能是学习怎么爱/被爱的一刻"
   * copy: "这里只看这一刻，不给整段关系下判决。"
2. Moment phase:
   * chips:
     * "吸引/共鸣"
     * "幻灭/差异被看见"
     * "自省"
     * "修复/磨合"
     * "启示/整合"
     * "普通照顾"
     * "说不清"
3. Care vs control:
   * title: "这个动作更像爱、依恋、控制，还是新鲜感？"
   * chips:
     * "照顾/关心"
     * "依恋焦虑"
     * "想控制结果"
     * "追新鲜感"
     * "真实修复"
     * "说不清"
4. Next direction:
   * "修复"
   * "边界"
   * "等待"
   * "存为稍后话题"
   * "回到自己"

Account impact:

* Self +1 for non-control, repair ownership, or boundary clarity.
* Connection only for episode-scoped observable mutuality/care.
* Energy user-rated.

Do not:

* true-love test
* compatibility score
* stay/leave advice
* claim novelty loss means love is gone

#### P2 Seeing / Being Seen Branch

Trigger from:

* rich incoming message, repair, draft checker, hard conversation, warm being-seen moment, or urge to advise/fix too fast

Screens:

1. Gate:
   * title: "我想更准确地看见"
   * copy: "看见不是看穿，也不是必须一直接住。"
2. Focus:
   * chips:
     * "我被看见了"
     * "我想看见对方"
     * "两者都有"
     * "说不清"
3. Micro-action:
   * chips:
     * "反映我听到的重点"
     * "问一个开放问题"
     * "说一个可能的感受并确认"
     * "先不建议"
     * "问这对你意味着什么"
     * "问我漏掉了什么"
     * "保存为稍后话题"
4. Capacity:
   * title: "我现在还有容量继续听/回吗？"
   * chips:
     * "可以"
     * "有限"
     * "现在不行"
5. Next direction:
   * "轻回应"
   * "存草稿"
   * "稍后话题"
   * "边界"
   * "回到自己"
   * "关闭"

Account impact:

* Connection +1 only for recorded observable being-seen, mutual listening, or respectful presence.
* Self +1 for humility, non-labeling, capacity awareness, or choosing not to fix.
* Energy user-rated.

Do not:

* people-reading
* empathy score
* psychological profile
* obligation to keep listening when capacity is low

Implementation guidance:

* A P2 branch can initially be 1-3 screens with saved structured output rather than a full independent page.
* If activation is high, P2 branches should route back to Return-to-Self instead of deepening reflection.
* P2 branches should never block completion of a P0/P1 flow.

### P1 / P2 Implementation Status Matrix

This matrix records the current first-release implementation state as of 2026-06-21. It is the source of truth for deciding whether the next step is product development, PRD refinement, QA, or deliberate deferral.

Status meanings:

* **Done**: the route or flow exists, can be completed, writes only the intended local data, and respects the core safety/copy constraints.
* **Partial**: the first useful loop exists, but one acceptance sub-loop or cross-entry behavior is still missing.
* **Deliberately excluded**: the capability conflicts with first-release scope or product safety boundaries and should not be built unless the product direction changes.
* **Backlog**: useful later work that does not block the current MVP if the above safety constraints remain true.

#### P1 Surface Status

| Surface | Status | Current implementation | Remaining decision / backlog |
|---|---|---|---|
| Signal Check | Done | `/signal-check` supports confirmation target, good-signal preview, absent-signal preview, 10-minute non-checking action, shame-free "still check" path, and optional save to Topics without account impact. It can route to Return-to-Self and connection-continuity when relevant. | Keep mobile QA focused on copy fit and route return behavior. Do not add external-app monitoring or checking streaks. |
| Draft Self-Check | Done | `/draft-check` supports draft input, state check, motivation, no-response tolerance, content risk, stance check, after-send preview, deterministic recommendation, save draft, save discovery point, private record conversion, Return-to-Self, boundary clarity, and contextual P2 branch entry. | Preserve the no-rewrite rule. Any future "lighten it" support should stay as direction/chips, not generated reply wording. |
| Rich Incoming Review | Done | `/rich-incoming` uses manual message shape, thread selection, mixed emotion, per-thread handling, enough-for-now direction, batch-saves discovery points, and can explicitly save one standalone support anchor from the completion state. It does not auto-summarize, infer sender psychology, require replying to every thread, or create account impact from anchor/discovery saves. | Keep direct anchor save standalone unless a future PRD widens `Anchor.sourceType` and adds linked-anchor UI. |
| Topics List | Done | `/topics` shows discovery points, questions, topics, action ideas, filters, low-pressure status copy, manual creation, and inline status changes. | Keep avoiding due dates, overdue states, streaks, or unfinished-debt language. |
| Topic Detail | Done | `/topics/:id` shows source context, detail rows, review note, anchor save, low-pressure status actions, and can turn a discovery point into a small practice with `source: "discovery_point"`. | Preserve no account impact for saving/reviewing/converting by default. Do not add due dates, task debt, or automatic status changes. |
| Account Detail | Done | `/accounts/:account` shows qualitative status, numeric value as secondary detail, recent sources, readable reasons, evidence labels, and a lightweight personal action menu. Selection remains route-local; "存成小练习" creates a practice without impact; "完成一点" creates a practice plus one completed attempt through the experiment rules. | Keep any future additions source-owned and transparent. Do not turn account detail into earning balance, reward redemption, or relationship scoring. |
| Personal Action Menu | Done | Experiments page and Account Detail support one recommendation plus two alternatives, refresh/skip, Quick Record prefill, conversion to a saved experiment, and explicit completion through a completed experiment attempt. | A separate persisted intention model is deliberately not in MVP. Choosing remains no-impact and local unless the user explicitly saves or completes. |
| Experiments | Done | `/experiments` creates a small experiment from three short fields or selected personal action, can save manual practices as active or idea, filters by lifecycle status, and `/experiments/:id` records completed, partial, noticed-only, and not-suitable attempts. Detail also supports editing the three practice sentences, status changes, and saving learning as a discovery point. Attempts create transparent Self/Energy impact only when appropriate. | Keep lifecycle states low-pressure. Do not add streaks, missed-day penalties, reminders, delete flows, or partner-facing rewards. |
| Settings | Done | `/settings` includes privacy note, active-space edit, storage status, local JSON export/import, reset/delete confirmation, and local-first framing. Import validates the file and requires confirmation before replacing local data. | Keep export/import local-file only. No login, sync, telemetry, cloud storage, merge restore, or external chat import in MVP. |
| First-release safety support copy | Done | Shared `SupportBoundaryCard`, `src/copy/safety.ts`, and `src/domain/safety.ts` provide consistent human-support boundary copy across Trigger, Return-to-Self, Draft Check, Boundary Clarity, Old Echo, Self-Compassion, and Emotion Calibration when relevant. | Keep it non-diagnostic and non-blocking. Do not add danger scoring, hotline directory, legal advice, safety planning, telemetry, or crisis workflow behavior. |

#### P2 Light Surface Status

| Branch | Status | Current implementation | Remaining decision / backlog |
|---|---|---|---|
| Emotion Calibration | Done | `/emotion-calibration` frames emotion as signal/protector, captures protected value, risky impulse, wiser action, note, saves one discovery point, and routes to Return-to-Self / old-echo / boundary / healthy-love / connection-continuity when relevant. | Do not expand into a full emotion course or forced positive reframing. |
| Connection Continuity | Done | `/connection-continuity` separates felt disappearance from observable evidence, supports optional note/evidence split, saves one relationship-learning discovery point, and creates no account impact. | Keep it moment-level. No attachment diagnosis, object-constancy score, or connection-permanence promise. |
| Boundary Clarity | Done | `/boundary-clarity` supports mine / not-mine responsibility split, boundary form, owned next action, difficulty, note, save as discovery point, shared support-boundary copy when relevant, and routes to healthy-love / Return-to-Self. | Do not add legal advice, danger scoring, or coercive boundary templates. |
| Self-Compassion Pause | Done | `/self-compassion` supports pain noticing, common-humanity/self-kindness framing, inner-critic rewrite, kind and responsible next action, save as discovery point, and route to boundary / Return-to-Self. | Do not add self-esteem, self-worth, attractiveness, or likability scores. |
| Old Echo / Inner Critic | Done | `/old-echo` uses a paced gate, present trigger, touched need, protective program, optional inner-critic note, present-self response, save as discovery point, and route to boundary / self-compassion / Return-to-Self. | Do not determine childhood source, ask for trauma details, or claim trauma treatment / IFS therapy. |
| Empowerment Shift | Done | `/empowerment-shift` maps drama-triangle stances to Creator / 引导者 / Challenger, prompts one owned next action, saves a discovery point, and can route to boundary / Return-to-Self. | Keep labels self-facing only. Do not label the other person or bypass pain/accountability. |
| Healthy Love Literacy | Done | `/healthy-love` covers moment phase, care-vs-control/attachment/novelty leaning, one freedom-preserving action, saves one discovery point, and routes to boundary / connection-continuity / Return-to-Self. | Do not add true-love tests, compatibility scores, stay/leave advice, or relationship verdicts. |
| Seeing / Being Seen | Done | `/seeing-evidence` supports being-seen / seeing-other / both focus, observable evidence, micro-action, capacity check, next direction, save as discovery point, and Return-to-Self. | Do not turn this into people-reading, empathy scoring, or obligation to keep listening when capacity is low. |
| P2 shared primitives | Partial | Branches follow the same compact pattern in copy and behavior, and support-boundary UI/copy is now shared. The branch-specific chips, summaries, and save flows remain mostly page-specific. | Refactor branch primitives only if duplication starts causing inconsistent behavior. Generic branch abstraction is not required for the MVP. |
| High-activation routing from P2 | Done | Draft Check, Signal Check, and Emotion Calibration can pass transient high-activation route context into P2 branches. Branch landing pages then show a first-position Return-to-Self nudge before deeper reflection, without blocking branch use or writing durable state. | Keep this route-state only. Do not persist activation context, create scores, or require grounding before the user can continue. |

#### Deliberately Excluded From P1 / P2

These are not backlog items. They are product safety boundaries for the MVP:

| Excluded capability | Reason |
|---|---|
| External app monitoring, response-speed tracking, read receipts, online status, social-feed checks | Would reinforce surveillance/checking loops and violate local self-reflection scope. |
| AI chat parsing, sender psychology inference, response prediction, or optimized reply generation | Would turn the app into partner-reading or response-optimization tooling. |
| Attachment-type diagnosis, object-constancy score, trauma-source determination, IFS treatment claims | Current MVP can support awareness and pacing, not clinical assessment or trauma processing. |
| Relationship score, true-love test, compatibility score, stay/leave recommendation, partner green/red-flag scoring | Would convert the product into verdict machinery rather than user-owned reflection. |
| Reward store or redemption mechanics aimed at another person's affection, apology, response, time, or certainty | Conflicts with the personal-version framing: actions can support the user, not buy or pressure another person's behavior. |
| Full courses, long worksheets, required 87-emotion glossary, book-style self-tests | Too heavy for a trigger-first mobile MVP and likely to increase rumination/choice load. |
| Backend, login, cloud sync, telemetry, push reminders, imported chat histories | Outside the local-first first-release scope. |

#### Research Absorption Status

The research files have been absorbed into the PRD as compact product decisions rather than expanded theory modules.

| Research source | Absorbed into MVP | Boundary / backlog decision |
|---|---|---|
| `research/dbt-informed-return-to-self.md` | Return-to-Self uses DBT-informed grounding, body landing, anchor, return-to-life action, and shared support-boundary copy when the route-local state suggests more human support. | Do not claim DBT therapy. Keep physiological options conservative. Support copy must remain a boundary, not a crisis workflow or risk score. |
| `research/emotion-language-product-mapping.md` | Emotion granularity, mixed/not-sure states, and emotion calibration are represented in Trigger, Record, Rich Incoming, and Emotion Calibration. | Do not build required 87-emotion UI, automatic emotion detection, or emotion accuracy scoring. |
| `research/self-compassion-product-mapping.md` | Self-compassion pause includes pain noticing, common humanity, inner-critic rewrite, and kind/responsible next action. | Do not score self-worth or use forced positivity. |
| `research/boundaries-product-mapping.md` | Boundary clarity includes responsibility split, boundary forms, saying no / receiving no framing, and user-owned next action. | Do not provide legal advice, danger scoring, punishment/control scripts, or coercive consequences. |
| `research/mosquito-elephant-product-mapping.md` and `research/trauma-informed-parts-awareness.md` | Old-echo / inner-critic branch uses mosquito/elephant, touched need, protective program, and present-self response as optional awareness. | Do not ask for trauma memories, determine childhood source, claim neural rewiring, or provide IFS/trauma treatment. |
| `research/attachment-continuity-awareness.md` | Connection-continuity branch supports moment-level awareness of collapsed felt connection vs observable evidence. | Do not ask the user to diagnose attachment type or create object-constancy scores. |
| `research/love-better-product-mapping.md` | Healthy Love branch captures moment phase, care vs attachment/control/novelty, repair/boundary/wait directions. | Do not turn it into a course, love test, compatibility score, or stay/leave guidance. |
| `research/seeing-and-being-seen-product-mapping.md` | Seeing / Being Seen branch supports observable evidence, listening micro-actions, capacity check, and not-fixing stance. | Do not build people-reading, psychological profiles, empathy scores, or obligation to keep listening. |

#### Next Development Backlog

Recommended order:

1. P2 branch abstraction remains optional. Refactor only if page-specific duplication starts causing inconsistent behavior or bugs.
2. UI/Figma redesign work is paused and should remain separate from product behavior changes.

### Implementation Order

1. App shell, routing, local storage, seed data, and first-run setup.
2. Domain model and account-impact helpers.
3. Home dashboard with P0 layout.
4. Return-to-Self flow.
5. Trigger support flow and quick record save.
6. Record list/detail and account summaries/detail.
7. Signal checking and draft self-check.
8. Rich incoming message review and discovery point capture.
9. Topics and experiments.
10. P2 compact branches and copy polish.
11. PWA install basics, persistence verification, mobile QA.

### First Release Implementation Milestones

Implementation should be split into small vertical slices. Each milestone should leave the app runnable on mobile viewport and should avoid building deeper psychological branches before the trigger-first loop works end to end.

#### M1: App Shell, PWA Frame, And First-Run Setup

* Build:
  * Vite / React / TypeScript app shell.
  * Mobile-first layout frame with bottom navigation.
  * Route structure for Home, Record, Topics, Experiments, Settings, and flow routes.
  * PWA manifest and basic app metadata.
  * First-run setup with local-first privacy note, one emotional space, and default daily market.
  * Local storage adapter with `load`, `save`, `reset`, and schema-version handling.
  * Minimal Settings surface with privacy note and delete/reset local data.
* Acceptance:
  * App opens directly to usable Home or setup, never a marketing page.
  * Completing setup persists data across refresh.
  * Reset/delete clears local data and returns to setup.
* Do not build yet:
  * Account math beyond placeholder derived summaries.
  * Full Settings management, deep flows, AI analysis, import/export, or cloud sync.

#### M2: Domain Model And Account Derivation

* Build:
  * Typed models for spaces, episodes, account impacts, anchors, topics, experiments, personal actions, drafts, and settings.
  * Pure helpers for creating timestamps/ids, loading defaults, and deriving account summaries.
  * Account summary logic for Connection / Self / Energy from `AccountImpact[]`.
  * Reason-copy support for every account impact source.
* Acceptance:
  * Account summaries are deterministic and derived from saved records/actions, not separately persisted as authoritative balances.
  * Home can show compact storage-jar summaries with reason text available in detail.
  * Unit tests cover account-impact derivation and default-data migration/fallback.
* Do not build yet:
  * Relationship health score, safety account, global score, partner verdict, or hidden scoring.

#### M3: Home Dashboard And Return-To-Self

* Build:
  * Home first viewport in required order: active space/market, one market note, four trigger buttons, "记录互动", and compact account summaries.
  * Return-To-Self flow with body landing, anchor, return-to-life action, and energy-effect feedback.
  * Partial completion path for "只注意到我需要暂停" or one body action.
  * Completion surface with save/close/next-action options.
* Acceptance:
  * User can enter Return-To-Self from Home with one tap.
  * User can complete or partially complete without being forced to feel better.
  * Completion can create transparent Self/Energy impact, never automatic Connection impact.
* Do not build yet:
  * Old-echo analysis, trauma-source prompts, or intensive physiological exercises.

#### M4: Trigger Support And Quick Record

* Build:
  * "我被触发了" flow with fact, body/emotion, urge, owned next action, and completion.
  * Quick record entry with title, facts, interpretation, emotion/body, connection/activation, and next action.
  * Save quick trigger record from completion.
  * Basic skip / not sure / close-without-penalty behavior.
* Acceptance:
  * User can complete the trigger flow in four short steps.
  * User can save a quick record and see it on Home after refresh.
  * Saved records update account summaries through visible reason rules.
  * High activation always offers Return-To-Self or one user-owned next action.
* Do not build yet:
  * Draft rewriting, partner inference, response prediction, or required full episode entry.

#### M5: Records, Account Detail, And Anchors

* Build:
  * Record list and episode detail.
  * Account detail / ledger route opened from Home account summaries.
  * Recent account sources with reason text.
  * Anchor creation and display from Home or episode detail.
  * Delete confirmation for emotionally meaningful records.
* Acceptance:
  * User can inspect why Connection / Self / Energy moved.
  * Numeric or qualitative balance is only shown in account detail, not as the Home primary focus.
  * Deleting a record updates derived account summaries after confirmation.
* Do not build yet:
  * Reward store, redemption mechanics, or any exchange for another person's behavior.

#### M6: Signal Check And Draft Self-Check

* Build:
  * "想检查信号" flow with target confirmation, possible signal outcomes, and one 10-minute non-checking action.
  * Shame-free "我还是想检查" completion.
  * "草稿自检" flow with draft input, state check, motivation, no-response tolerance, content risk, stance check, after-send preview, and deterministic recommendation.
  * Local draft save and routes to Return-To-Self, boundary clarity placeholder, private record, or later topic.
* Acceptance:
  * Signal check does not monitor external apps or punish checking.
  * Draft self-check explains recommendation reasons and does not rewrite text for response optimization.
  * User can save or close a draft locally without sending anything.
* Do not build yet:
  * Automatic chat parsing, sender psychology inference, or "best reply" generation.

#### M7: Rich Incoming Review And Discovery Points

* Build:
  * "收到很多内容，不知道怎么接" flow.
  * Manual thread selection, mixed emotion check, per-thread handling, enough-for-now direction, and save summary.
  * Batch-save 1-8 discovery points from one dense event.
  * Topics tab list/detail for later topics, discovery points, questions to explore, and action ideas.
* Acceptance:
  * User can receive a dense warm message without needing to answer every thread.
  * Discovery points preserve source context without becoming overdue tasks.
  * Rich incoming review creates Connection impact only from user-recorded observable evidence.
* Do not build yet:
  * Automatic summarization, emotional accuracy scoring, or required response drafting.

#### M8: Personal Action Menu And Experiments

* Build:
  * Personal action menu from account detail and completion surfaces.
  * One recommended action plus no more than two alternatives, with choose / refresh / skip.
  * Experiments list, create flow, and completion reflection.
  * Completion states: completed, partial, noticed only, not suitable.
* Acceptance:
  * Choosing an action records intention only; completing an action may create small Self/Energy impact.
  * Experiments can be paused, retired, or converted into a discovery point without penalty.
  * Choice load remains low on mobile.
* Do not build yet:
  * Large action marketplace, streak pressure, gamified penalties, or partner-facing rewards.

#### M9: P2 Compact Branches, Safety Copy, And Mobile QA

* Build:
  * Compact optional branches for connection-continuity, emotion calibration, boundary clarity, self-compassion, old echo / mosquito-elephant / inner critic, empowerment shift, healthy love literacy, and seeing / being seen.
  * Shared P2 primitives: chip question, short text input, completion summary, account-impact preview, and route-to-next-action buttons.
  * Crisis/human-support boundary copy for self-harm, violence, coercion, stalking, physical safety, or overwhelming/dissociative content.
  * Mobile QA pass for narrow viewport, touch targets, text wrapping, refresh persistence, and reset/delete.
* Acceptance:
  * P2 branches never block P0/P1 completion.
  * High activation can route out of P2 branches into Return-To-Self.
  * P2 branches save structured output without diagnosing attachment, trauma source, object constancy, self-worth, or the other person.
* Do not build yet:
  * Full courses, clinical workflows, trauma treatment flows, attachment scoring, or relationship verdict systems.

### Build Gates

* Gate 1: M1-M2 complete before building any psychologically dense flow, so records and account impacts have a stable data foundation.
* Gate 2: M3-M4 complete before P1 flows, so the app proves the trigger-first loop and Return-To-Self safety path.
* Gate 3: M5 complete before personal actions, so the user can inspect where account movement came from.
* Gate 4: M6-M7 complete before broad P2 work, so the app supports the two common high-load scenarios: checking signals and receiving dense content.
* Gate 5: M9 cannot ship until mobile QA, persistence verification, reset/delete, and safety-boundary copy pass.

### First Release Non-Goals

* No backend, auth, cloud sync, social sharing, push reminders, or AI analysis.
* No full reward store.
* No couple/shared mode.
* No automatic parsing of chats or monitoring external apps.
* No clinical, attachment, trauma, or relationship diagnosis.
* No attempt to implement every P2 branch as a fully separate feature before the P0/P1 loops work end to end.

## Information Architecture

* Home: compact status strip, market note, trigger-first emergency panel, secondary record interaction entry, storage-jar/account summaries, then anchor, latest episode, and active experiment.
* Emergency / Return: focused flows for triggered, signal-checking, draft self-check, return-to-self moments, and a light "I received a lot and don't know how to hold it" entry into rich incoming message review. This can be a dedicated route or modal stack in implementation.
* Record: quick/full episode recording, rich incoming message review, plus calm closure.
* Account Detail / Ledger: account balance, recent trends, recent sources, and a lightweight personal action menu.
* Topics: later-topic vault with status updates.
* Experiments: personal relationship experiments and completion reflections.
* Archive / Settings: emotional spaces, anchors, privacy note, data export placeholder, reset/delete controls.

## Core User Flows

### Flow 1: Trigger First Landing

1. User opens the app while activated.
2. Home shows the emergency panel before account summaries.
3. User chooses "我被触发了", "想检查信号", "草稿自检", or "回到自己".
4. App asks for one fact.
5. App asks for one feeling/body signal.
6. App asks for the current urge.
7. App offers an empowerment shift when the urge matches helpless waiting, rescuing, or accusation/control.
8. User chooses one owned next action.
9. App offers Return-to-Self when activation is medium/high.
10. App optionally closes, saves a quick episode, or continues into full record / draft checker / rich incoming message review.

### Flow 2: First Record

1. User creates or accepts a generic emotional space, either interpersonal or self-facing.
2. User selects today's emotional market.
3. User taps "记录互动".
4. User records facts, interpretation, emotions, connection/activation, account impact, and next action.
5. User saves the episode.
6. App shows calm closure and offers an anchor or later topic.

### Flow 3: Triggered By Ambiguous Signal

1. User taps "想检查信号" or "我被触发了".
2. App asks what is fact, what is interpretation, and what checking is expected to provide.
3. User chooses delay, grounding, record-first, or continue-and-record.
4. App records the choice without judgment.
5. Dashboard reflects the event as self-awareness even if the user still checked.

### Flow 4: Warm Interaction Landing

1. User records a meaningful interaction.
2. User marks high connection and medium/high activation.
3. App highlights that warmth can be received without being converted into a future prediction.
4. User adds unfinished topics to the vault.
5. User chooses a closure action and returns to home.

### Flow 5: Draft Self-Check

1. User pastes a draft.
2. User answers risk/intention prompts.
3. App returns one transparent recommendation.
4. User can save as draft, convert to an episode, go to Return-to-Self, or close without action.

### Flow 6: Rich Incoming Message Review

1. User receives a long warm message and opens Record -> "收到一段很长/很暖/信息很多的话", or Return-to-Self -> "我收到很多内容，不知道怎么接".
2. User marks it as a high-density incoming message.
3. App helps split the message into emotional threads.
4. User marks each thread as received now, respond now, save for later, or no response needed.
5. App summarizes connection, activation, account impact, and possible later topics / discovery points.
6. User chooses one enough-for-now response direction, goes to Return-to-Self, or closes without drafting.

### Flow 7: Return To Self

1. User enters from Home, trigger support, draft self-check, rich incoming message review, or calm closure.
2. User chooses one body landing action.
3. User chooses or reads one attention anchor.
4. User chooses one 10-30 minute real-life action.
5. User optionally reports felt energy effect.
6. App records completion or partial completion as Self/Energy account impact, never Connection impact.

### Flow 8: Personal Action Menu

1. User opens Account Detail / Ledger or completes Return-to-Self, calm closure, or a personal experiment.
2. App shows one recommended personal action based on recent account movement, daily market, and activation level.
3. User can tap "就这个", choose one of no more than two alternatives, tap "换一个", or tap "稍后".
4. If user chooses an action, app records it as a selected personal action without account impact.
5. User can later mark "完成了" or leave it as "先放着".
6. If user marks it complete, app may create a small Self or Energy signal with a transparent reason.
7. If user skips or leaves it unfinished, app closes without penalty or negative account effect.

### Flow 9: Discovery Point Capture And Review

1. User finishes a dense event, rich incoming message review, trigger support, draft checker, or calm closure and notices multiple points worth exploring later.
2. App offers "把发现点存进稍后".
3. User selects or edits several short titles, optionally adding source snippet, why it matters, and one explore question.
4. App saves them as LaterTopic items with kind `discovery_point` or `question_to_explore`.
5. Episode detail shows "这次看见的点" with links back to each saved point.
6. Topics tab shows discovery points without due dates, overdue states, or unfinished-pressure language.
7. During review, user can add a note, mark it reviewed, turn it into a small experiment/action, leave it for now, or mark it no longer needed.

### Flow 10: Personal Experiment

1. User enters from Experiments tab, discovery point detail, personal action menu, trigger support, draft checker, boundary clarity, rich incoming message review, or Return-to-Self.
2. User chooses one focus, defines one tiny action, and chooses what counts as practicing once.
3. User starts the experiment or saves it as an idea.
4. Home may show one active experiment card with "记录一次".
5. User records a completion as completed, partial, noticed only, or not suitable.
6. App saves a short reflection and applies transparent Self/Energy account rules only when relevant.
7. User can pause, retire, edit, or convert learning into a discovery point without penalty.

### Flow 11: Boundary Clarity

1. User enters from trigger support, draft checker, full episode review, personal action menu, discovery point detail, repair/understanding check, or experiment creation.
2. App checks whether this is an unsafe/coercive boundary situation and routes to outside support copy if needed.
3. User identifies the boundary signal: guilt, resentment, anger, fear of disappointing, over-carrying, control urge, difficulty receiving no, or not sure.
4. User splits what is mine and what is not mine.
5. User names one real limit or request.
6. User chooses the boundary form and whether this is about saying no, delaying yes, explaining less, allowing disappointment, or receiving no.
7. User chooses one user-owned next action such as save draft, no extra message, pause conversation, save later topic, draft self-check, Return-to-Self, or create experiment.
8. App saves the check and applies Self/Energy impact only through transparent rules; Connection impact requires a separate observable episode.

### Flow 12: Self-Compassion Pause

1. User enters from trigger support, inner-critic/old-echo check, draft checker, Return-to-Self, experiment completion, full episode review, self-facing space, or personal action menu.
2. App asks the user to notice the pain without over-identifying with it.
3. App offers one common-humanity reminder or lets the user skip.
4. If inner critic is present, user can rewrite one harsh sentence into a caring but honest sentence.
5. User chooses one self-kindness action or simply reads one non-attacking sentence.
6. User chooses one responsible next action, such as save draft, stabilize before repair, boundary clarity, Return-to-Self, rest, or stop self-attack for now.
7. App saves the pause and applies transparent Self/Energy rules without requiring the user to feel better.

### Flow 13: Old Echo / Mosquito-Elephant / Inner Critic

1. User enters from trigger support, state check, draft checker, Return-to-Self, self-compassion pause, discovery point detail, or full episode review.
2. App shows pacing copy and allows the user to choose "只轻轻看一下", Return-to-Self, not ready, or human support.
3. User names the visible mosquito: today's observable event.
4. User marks whether the felt reaction seems mostly present, mixed, mostly old echo, or not sure.
5. User optionally names the elephant: touched need or familiar pain without details.
6. User identifies an old protective program such as checking, proving, attacking, withdrawing, pleasing, controlling, numbing, rescuing, or perfectionism.
7. User optionally notices the inner critic and creates distance from it.
8. User chooses one present-self response such as kind sentence, boundary, no checking, save draft, save discovery point, Return-to-Self, self-compassion, human support, or experiment.
9. App saves the check and applies transparent Self/Energy rules without trauma diagnosis or childhood-source determination.

### Flow 14: Love And Repair Literacy

1. User enters from a full episode, draft checker, rich incoming message review, conflict repair stage, boundary negotiation stage, or calm closure.
2. App asks the user to optionally place this moment in a relationship-learning phase: attraction/resonance, disillusionment/mismatch noticing, self-reflection, repair/negotiation, integration/insight, or ordinary care/maintenance.
3. App reminds the user that the phase chip describes this moment, not the whole relationship.
4. If the user is activated, app asks whether the current impulse is closer to care, attachment, control, novelty-chasing, or "not sure".
5. App asks one repair/understanding prompt: what I want understood, what I may not yet understand, and what part is mine to own.
6. User chooses the next direction: repair, boundary, wait, save as later topic, or Return-to-Self.
7. If the user marks a growth signal, the app asks for observable evidence and frames it as this-episode evidence, not future proof.
8. Account impact follows the three-account rules: Self for owned repair/non-control/boundary, Connection only for real mutuality or self-contact, Energy based on felt cost or restoration.

### Flow 15: Seeing / Being Seen Practice

1. User enters from rich incoming message review, draft checker, repair/understanding check, full episode review, or calm closure.
2. App asks whether this moment is more about being seen, seeing the other person, or both.
3. If being seen, user records what felt received, understood, respected, witnessed, or not seen.
4. If seeing the other person, user chooses one micro-action: reflect back, ask one open question, name a possible feeling and check, ask what it means, pause before advice, or save as later topic.
5. If the conversation is hard, app can show the two-layer check: content layer, emotional undercurrent, respect, frame, and next step.
6. App asks whether the user has capacity to continue listening/responding now. "Not right now" is a valid completion.
7. User chooses one next direction: respond lightly, save draft, later topic, boundary, Return-to-Self, or close.
8. Account impact follows three-account rules: Connection only for real being seen / mutual listening / respectful presence; Self for humility, non-labeling, boundary-aware presence, or choosing not to fix; Energy by user-rated effect.

## Domain Model Draft

```ts
type AppState = {
  schemaVersion: 1;
  spaces: EmotionalSpace[];
  activeSpaceId?: string;
  dailyMarkets: Record<string, DailyMarketState>;
  episodes: Episode[];
  returnToSelfPractices: ReturnToSelfPractice[];
  anchors: Anchor[];
  drafts: Draft[];
  topics: LaterTopic[];
  experiments: Experiment[];
  personalActions: PersonalAction[];
  settings: Settings;
};

type EmotionalSpace = {
  id: string;
  kind: "self" | "interpersonal";
  name: string;
  intention?: string;
  createdAt: string;
  updatedAt: string;
};

type DailyMarketState =
  | "calm"
  | "tired"
  | "sensitive"
  | "sleep_deprived"
  | "triggered"
  | "fulfilled"
  | "lonely"
  | "high_expectation"
  | "low_energy";

type Episode = {
  id: string;
  spaceId: string;
  source: "quick_record" | "trigger_support" | "return_to_self_linked" | "rich_incoming_review" | "draft_self_check" | "manual";
  title: string;
  facts: string;
  interpretation: string;
  currentMeaning?: string;
  unsupportedConclusions?: string;
  emotions: EmotionRating[];
  bodySensations: string[];
  initiation?: EpisodeInitiation;
  stages?: EpisodeStage[];
  outcome?: EpisodeOutcome;
  connectionLevel: 0 | 1 | 2 | 3 | 4;
  activationLevel: 0 | 1 | 2 | 3 | 4;
  accountImpacts: AccountImpact[];
  tags?: DepositTag[];
  stateCheck?: StateCheck;
  connectionContinuityCheck?: ConnectionContinuityCheck;
  oldEchoCheck?: OldEchoCheck;
  innerCriticCheck?: InnerCriticCheck;
  selfCompassionPause?: SelfCompassionPause;
  boundaryClarityCheck?: BoundaryClarityCheck;
  relationshipLearningCheck?: RelationshipLearningCheck;
  seeingPractice?: SeeingPractice;
  empowermentShift?: EmpowermentShift;
  returnToSelf?: ReturnToSelfPractice;
  returnToSelfPracticeId?: string;
  draftId?: string;
  nextAction: string;
  anchor?: string;
  linkedTopicIds?: string[];
  linkedExperimentId?: string;
  closureAction?: ClosureAction;
  richIncomingReview?: RichIncomingReview;
  emotionalThreads?: EmotionalThread[];
  createdAt: string;
  updatedAt: string;
};

type AccountImpact = {
  id?: string;
  sourceType?: "episode" | "return_to_self" | "trigger_completion" | "personal_action" | "experiment";
  sourceId?: string;
  account: "connection" | "self" | "energy";
  value: -2 | -1 | 0 | 1 | 2;
  reasonCode?:
    | "observable_connection_evidence"
    | "self_contact_evidence"
    | "fact_interpretation_split"
    | "owned_next_action"
    | "trigger_owned_action"
    | "return_to_self_completed"
    | "return_to_self_partial_pause"
    | "energy_depleted"
    | "energy_restored"
    | "energy_neutral"
    | "no_connection_evidence";
  reason?: string;
  evidence?: string;
  createdAt?: string;
};

type Anchor = {
  id: string;
  spaceId: string;
  text: string;
  sourceType?: "episode" | "return_to_self" | "manual";
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
};

type Draft = {
  id: string;
  spaceId: string;
  kind: "quick_record";
  fields: Partial<Pick<Episode, "title" | "facts" | "interpretation" | "emotions" | "bodySensations" | "connectionLevel" | "activationLevel" | "nextAction">>;
  createdAt: string;
  updatedAt: string;
};

type Settings = {
  hasCompletedSetup: boolean;
  reducedMotion?: boolean;
  createdAt: string;
  updatedAt: string;
};

type EmotionFamily =
  | "stress_overwhelm"
  | "anxiety_worry_fear"
  | "vulnerability_exposure"
  | "shame_guilt_embarrassment_humiliation"
  | "anger_resentment_contempt_disgust"
  | "sadness_grief_heartbreak_longing"
  | "disappointment_regret_discouragement_frustration"
  | "envy_jealousy_comparison"
  | "loneliness_disconnection_invisibility"
  | "belonging_connection_seen"
  | "joy_happiness_calm_contentment_gratitude_relief"
  | "curiosity_confusion_awe_wonder"
  | "pride_humility_defensiveness"
  | "mixed"
  | "not_sure";

type EmotionLabel =
  | "stress"
  | "overwhelm"
  | "anxiety"
  | "worry"
  | "fear"
  | "excitement"
  | "vulnerability"
  | "shame"
  | "guilt"
  | "embarrassment"
  | "humiliation"
  | "anger"
  | "resentment"
  | "contempt"
  | "disgust"
  | "hurt"
  | "betrayal"
  | "sadness"
  | "grief"
  | "heartbreak"
  | "longing"
  | "despair"
  | "hopelessness"
  | "hope"
  | "disappointment"
  | "regret"
  | "discouragement"
  | "frustration"
  | "envy"
  | "jealousy"
  | "loneliness"
  | "solitude"
  | "disconnection"
  | "invisibility"
  | "belonging"
  | "being_seen"
  | "connection"
  | "love"
  | "trust"
  | "joy"
  | "happiness"
  | "calm"
  | "contentment"
  | "gratitude"
  | "relief"
  | "curiosity"
  | "confusion"
  | "awe"
  | "wonder"
  | "pride"
  | "humility"
  | "defensiveness"
  | "flooded"
  | "other";

type EmotionGranularityCheck = {
  pair:
    | "anxiety_vs_excitement"
    | "stress_vs_overwhelm"
    | "worry_vs_fear"
    | "shame_vs_guilt"
    | "guilt_vs_over_responsibility"
    | "anger_vs_hurt_fear_betrayal"
    | "resentment_vs_boundary_need"
    | "envy_vs_jealousy"
    | "sadness_vs_grief_heartbreak"
    | "despair_vs_disappointment"
    | "loneliness_vs_solitude"
    | "fitting_in_vs_belonging"
    | "sympathy_vs_empathy"
    | "joy_vs_happiness_contentment"
    | "calm_vs_relief"
    | "pride_vs_hubris";
  selected?: EmotionLabel;
  note?: string;
};

type EmotionCalibration = {
  stance: "messenger" | "protector" | "signal" | "command" | "enemy" | "identity" | "objective_truth";
  protects?: BasicNeed | "attachment" | "dignity" | "self_trust" | "love" | "belonging" | "meaning" | "other";
  caresAbout?: string;
  fearedLoss?: string;
  riskyReaction?: "suppress" | "deny" | "control" | "attack" | "check" | "withdraw" | "self_attack" | "over_explain" | "please" | "rescue" | "numb";
  wiserAction?: string;
  reminder?: string;
};

type EmotionRating = {
  family: EmotionFamily;
  label?: EmotionLabel;
  intensity?: 0 | 1 | 2 | 3 | 4;
  confidence?: 0 | 1 | 2 | 3 | 4;
  mixedWith?: EmotionLabel[];
  bodyCues?: string[];
  storyAttached?: string;
  needOrValue?: BasicNeed | "belonging" | "truth" | "repair" | "meaning" | "self_trust" | "other";
  actionTendency?: "approach" | "avoid" | "freeze" | "fight" | "please" | "check" | "repair" | "rest" | "express" | "set_boundary" | "seek_support";
  granularityCheck?: EmotionGranularityCheck;
  calibration?: EmotionCalibration;
};

type EmpowermentShift = {
  dramaRole?: "victim" | "rescuer" | "persecutor";
  empoweredRole?: "creator" | "guide" | "challenger";
  prompt: string;
  nextOwnedAction?: string;
};

type StateCheck = {
  feltSource?:
    | "mostly_present_event"
    | "connection_alarm"
    | "old_echo"
    | "inner_critic"
    | "boundary_pressure"
    | "body_overload"
    | "not_sure";
  eventSize?: "small" | "medium" | "big" | "not_sure";
  reactionSize?: "small" | "medium" | "big" | "not_sure";
  routedTo?:
    | "continue_current_flow"
    | "connection_continuity"
    | "old_echo"
    | "self_compassion"
    | "boundary_clarity"
    | "return_to_self"
    | "low_cognitive_action"
    | "outside_support";
  notReadyToLookDeeper?: boolean;
  note?: string;
};

type ConnectionContinuityCheck = {
  feltState:
    | "still_present"
    | "distant"
    | "disappeared"
    | "dangerous"
    | "urge_to_cut_off"
    | "approach_escape";
  pattern?: "alarm_checking" | "shutdown" | "push_pull" | "self_disconnection";
  rememberedEvidence?: string;
  notProvenYet?: string;
  stabilizingAction?: string;
};

type OldEchoCheck = {
  source?:
    | "trigger_support"
    | "state_check"
    | "draft_self_check"
    | "return_to_self"
    | "self_compassion"
    | "discovery_point"
    | "full_episode_review";
  mosquitoElephant?: MosquitoElephantCheck;
  presentShare?: "mostly_present" | "mixed" | "mostly_old_echo" | "unknown";
  feltProportion?: "today_more" | "half_half" | "old_echo_more" | "not_estimating";
  oldEchoTheme?:
    | "abandonment"
    | "shame"
    | "invisibility"
    | "not_enough"
    | "too_much"
    | "control"
    | "unreliable_care"
    | "other";
  noteWithoutDetails?: string;
  protectivePurpose?: string;
  presentSelfResponse?: "kind_sentence" | "boundary" | "ten_minute_no_checking" | "save_draft" | "save_discovery_point" | "return_to_self" | "self_compassion" | "seek_human_support" | "create_experiment";
  accountImpacts: AccountImpact[];
  notReadyToLookDeeper?: boolean;
};

type BasicNeed =
  | "safety"
  | "being_seen"
  | "respect"
  | "autonomy"
  | "boundary"
  | "fairness"
  | "belonging"
  | "care"
  | "reliable_response"
  | "competence"
  | "rest"
  | "curiosity_freedom";

type ProtectiveProgram =
  | "checking"
  | "explaining_proving"
  | "blaming_attacking"
  | "withdrawing_disappearing"
  | "pleasing_compliance"
  | "controlling_arranging"
  | "numbing_cutting_off"
  | "rescuing_overcarrying"
  | "perfectionism";

type MosquitoElephantCheck = {
  mosquito?: string;
  elephant?: string;
  touchedNeeds: BasicNeed[];
  protectivePrograms: ProtectiveProgram[];
  shortTermProtection?: string;
  longTermDirection?: "closer_to_need" | "farther_from_need" | "mixed" | "not_sure";
  needTension?: {
    needA: BasicNeed;
    needB: BasicNeed;
    oldIneffectiveExpression?: string;
    balancedExpression?: string;
  };
};

type InnerCriticCheck = {
  source?: "old_echo" | "state_check" | "draft_self_check" | "self_compassion" | "full_episode_review";
  present: boolean;
  message?: string;
  shameTheme?: "not_enough" | "too_much" | "needy" | "burdensome" | "foolish" | "unlovable" | "other";
  protectivePurpose?: string;
  selfLedResponse?: string;
  distanceFromCritic?: 0 | 1 | 2 | 3 | 4;
  accountImpacts?: AccountImpact[];
};

type SelfCompassionPause = {
  source?:
    | "trigger_support"
    | "inner_critic"
    | "old_echo"
    | "draft_self_check"
    | "return_to_self"
    | "experiment_completion"
    | "full_episode_review"
    | "self_space"
    | "personal_action_menu";
  painNoticed?: "distress" | "shame" | "self_blame" | "too_much" | "not_enough" | "perfectionism_stuck" | "noticed_not_completed" | "not_sure";
  mindfulnessNoticed?: string;
  commonHumanityReminder?: string;
  kindnessResponse?: string;
  criticRewrite?: {
    original?: string;
    caringRewrite?: string;
  };
  soothingAction?: "hand_on_chest" | "warm_palm_on_arm" | "gentle_self_hug" | "soften_jaw_shoulders" | "slow_exhale" | "drink_water" | "kind_sentence" | "self_appreciation" | "return_to_self";
  energyEffect?: "lighter" | "same" | "more_tired" | "not_sure";
  responsibleNextAction?: "do_not_send_yet" | "save_draft" | "stabilize_before_repair" | "one_tiny_action" | "save_discovery_point" | "boundary_clarity" | "return_to_self" | "rest_ten_minutes" | "stop_self_attack";
  selfAppreciation?: string;
  accountImpacts: AccountImpact[];
  completed: boolean;
};

type BoundaryForm =
  | "language"
  | "time"
  | "attention"
  | "emotional_distance"
  | "physical_distance"
  | "support"
  | "consequence"
  | "digital";

type BoundaryClarityCheck = {
  triggerSignals: Array<"guilt" | "resentment" | "anger" | "pressure" | "over_explaining" | "over_carrying" | "rescuing" | "control_urge" | "pressure_to_reply" | "fear_of_disappointing" | "fear_connection_loss" | "difficulty_receiving_no" | "not_sure">;
  supportBoundaryShown?: boolean;
  mine?: string;
  notMine?: string;
  realLimit?: string;
  requestOrBoundary?: string;
  boundaryForm?: BoundaryForm;
  practiceSide?: "say_no" | "delay_yes" | "explain_less" | "allow_disappointment" | "receive_no" | "no_does_not_mean_disappearance" | "no_retaliation_or_pleasing" | "not_sure";
  userOwnedConsequence?: string;
  nextAction?: "save_draft_tomorrow" | "no_extra_message_tonight" | "ten_minute_no_checking" | "respond_one_thread" | "pause_conversation" | "leave_scene" | "seek_human_support" | "save_later_topic" | "draft_self_check" | "return_to_self" | "create_experiment";
  difficulty?: 0 | 1 | 2 | 3 | 4;
  receivingNoPractice?: boolean;
  digitalBoundary?: "no_immediate_reply" | "no_night_checking" | "no_extra_message_today" | "save_draft_until_tomorrow" | "ten_minute_no_reread";
  accountImpacts: AccountImpact[];
  completed: boolean;
};

type RelationshipLearningPhase =
  | "attraction_resonance"
  | "disillusionment_mismatch"
  | "self_reflection"
  | "repair_negotiation"
  | "integration_insight"
  | "ordinary_care_maintenance"
  | "not_sure";

type LoveMotivationLeaning =
  | "care"
  | "attachment"
  | "control"
  | "novelty_chasing"
  | "repair"
  | "boundary"
  | "not_sure";

type GrowthSignal =
  | "honesty"
  | "kindness"
  | "willingness_to_understand"
  | "willingness_to_repair"
  | "boundary_respect"
  | "accountability"
  | "non_control"
  | "mutual_presence"
  | "ordinary_care";

type RelationshipLearningCheck = {
  phase?: RelationshipLearningPhase;
  loveVsAttachment?: {
    leaning?: LoveMotivationLeaning;
    note?: string;
    freedomPreservingAction?: string;
  };
  repairUnderstanding?: {
    whatIWantUnderstood?: string;
    whatIMayNotUnderstandYet?: string;
    myPart?: string;
    nextDirection?: "repair" | "boundary" | "wait" | "later_topic" | "return_to_self";
    nextRepairAction?: string;
  };
  careLiteracy?: {
    howIWantToBeLoved?: string;
    preferenceToExpress?: string;
    howICanCareWithoutSelfAbandoning?: string;
    receivedCare?: string;
    notProvenYet?: string;
  };
  growthSignals?: Array<{
    signal: GrowthSignal;
    evidence?: string;
  }>;
  reminder?: string;
};

type SeeingPractice = {
  focus?: "being_seen" | "seeing_other" | "both" | "not_sure";
  beingSeen?: {
    received?: string;
    understood?: string;
    respected?: string;
    witnessed?: string;
    notSeenYet?: string;
  };
  seeingOther?: {
    stance?: "illuminating" | "diminishing" | "labeling" | "advising" | "rescuing" | "defending" | "not_sure";
    whatIKnow?: string;
    whatIDoNotKnow?: string;
    microAction?: SeeingMicroAction;
    questionOrReflection?: string;
  };
  hardConversation?: HardConversationCheck;
  capacity?: "can_continue" | "limited" | "not_now";
  nextDirection?: "respond_lightly" | "save_draft" | "later_topic" | "boundary" | "return_to_self" | "close";
  reminder?: string;
};

type SeeingMicroAction =
  | "ask_open_question"
  | "reflect_back"
  | "name_possible_feeling_and_check"
  | "ask_for_story_not_conclusion"
  | "pause_before_advice"
  | "ask_then_what"
  | "ask_meaning"
  | "ask_what_i_missed";

type HardConversationCheck = {
  contentLayer?: string;
  emotionalUndercurrent?: string;
  respectPresent?: "yes" | "partly" | "no" | "not_sure";
  frame?: "win" | "defend" | "understand" | "repair" | "set_boundary" | "pause" | "not_sure";
  nextStep?: "clarify" | "mirror" | "ask" | "repair" | "boundary" | "pause" | "later_topic";
};

type ReturnToSelfSource =
  | "home"
  | "trigger_support"
  | "signal_checking"
  | "draft_self_check"
  | "rich_incoming_message"
  | "warm_interaction"
  | "calm_closure";

type BodyLandingAction =
  | "drink_water"
  | "wash_hands_face"
  | "walk_one_minute"
  | "look_outside"
  | "hold_soft_object"
  | "feet_on_floor"
  | "relax_jaw_shoulders"
  | "slow_exhale"
  | "cold_water_hands"
  | "hand_on_chest"
  | "warm_palm_on_arm"
  | "gentle_self_hug"
  | "five_senses"
  | "not_now";

type FiveSensesChoice =
  | "see_three_things"
  | "hear_two_sounds"
  | "touch_one_texture"
  | "smell_one_scent"
  | "taste_slow_sip";

type ReturnToLifeAction =
  | "eat_something"
  | "shower"
  | "sleep_or_rest"
  | "walk_outside"
  | "make_drink"
  | "tidy_small_area"
  | "read_or_study"
  | "write_personal_content"
  | "pause_analysis"
  | "contact_human_support"
  | "not_now";

type ReturnToSelfPractice = {
  id: string;
  spaceId: string;
  source: ReturnToSelfSource;
  linkedEpisodeId?: string;
  bodyAction?: BodyLandingAction;
  fiveSensesChoice?: FiveSensesChoice;
  anchor?: string;
  anchorSaved?: boolean;
  returnToLifeAction?: ReturnToLifeAction;
  energyEffect?: "lighter" | "same" | "more_tired" | "not_sure";
  completion: "noticed_need" | "body_only" | "full" | "closed_early";
  supportBoundaryShown?: boolean;
  accountImpacts: AccountImpact[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

type RichIncomingMessageShape =
  | "warm"
  | "high_information"
  | "vulnerable"
  | "much_explanation"
  | "invites_careful_response"
  | "pressure"
  | "being_seen"
  | "fear_missing_something"
  | "not_sure";

type RichIncomingEmotionState =
  | "warm"
  | "being_seen"
  | "moved"
  | "grateful"
  | "settled"
  | "excited"
  | "afraid_response_not_good_enough"
  | "pressured"
  | "overloaded"
  | "urge_to_reply_perfectly"
  | "urge_to_escape"
  | "ruminating"
  | "mixed"
  | "not_sure";

type ResponseDirection =
  | "acknowledge_received"
  | "respond_one_thread"
  | "express_gratitude_moved"
  | "ask_open_question"
  | "reflect_back"
  | "save_without_replying"
  | "draft_self_check"
  | "return_to_self";

type RichIncomingReview = {
  messageNote?: string;
  shapes: RichIncomingMessageShape[];
  emotionStates: RichIncomingEmotionState[];
  threads: EmotionalThread[];
  enoughForNowDirection?: ResponseDirection;
  anchor?: string;
  accountImpacts: AccountImpact[];
  createdLaterTopicIds: string[];
  routedTo?: "draft_self_check" | "return_to_self" | "completed";
};

type EmotionalThread = {
  id: string;
  label:
    | "being_seen"
    | "clarification"
    | "vulnerability"
    | "expression_buffer"
    | "rumination"
    | "perfectionism"
    | "values"
    | "self_care"
    | "later_topic";
  note?: string;
  observableEvidence?: string;
  selectedAsActive?: boolean;
  handling: "received_now" | "respond_now" | "save_for_later" | "no_response_needed";
  linkedTopicId?: string;
};

type LaterTopic = {
  id: string;
  spaceId: string;
  kind: "conversation_topic" | "discovery_point" | "question_to_explore" | "action_idea";
  source:
    | "manual"
    | "episode"
    | "rich_incoming_message"
    | "draft_self_check"
    | "trigger_support"
    | "return_to_self"
    | "calm_closure";
  sourceEpisodeId?: string;
  sourceThreadId?: string;
  sourceDeleted?: boolean;
  title: string;
  note?: string;
  sourceSnippet?: string;
  whyItMatters?: string;
  exploreQuestion?: string;
  theme?:
    | "emotion"
    | "boundary"
    | "old_echo"
    | "inner_critic"
    | "relationship_learning"
    | "communication"
    | "self_care"
    | "experiment"
    | "other";
  status:
    | "stored_for_later"
    | "want_to_understand"
    | "want_to_share"
    | "leave_for_now"
    | "reviewed"
    | "naturally_reached"
    | "no_longer_needed";
  reviewNotes?: Array<{
    note: string;
    createdAt: string;
  }>;
  convertedToActionId?: string;
  convertedToExperimentId?: string;
  createdAt: string;
  updatedAt: string;
};

type PersonalAction = {
  id: string;
  spaceId: string;
  source:
    | "account_detail"
    | "quick_record_completion"
    | "episode_detail"
    | "topic_detail"
    | "draft_self_check"
    | "rich_incoming_review"
    | "boundary_clarity"
    | "self_compassion"
    | "return_to_self"
    | "calm_closure"
    | "experiment_completion";
  sourceAccount?: "connection" | "self" | "energy";
  sourceEpisodeId?: string;
  sourceTopicId?: string;
  sourceExperimentId?: string;
  title: string;
  reason: string;
  estimatedMinutes?: number;
  effortLabel?: "under_1_minute" | "one_to_three_minutes" | "three_to_ten_minutes" | "tonight" | "no_writing";
  alternatives?: Array<{
    title: string;
    reason?: string;
    estimatedMinutes?: number;
  }>;
  refreshCount?: number;
  status: "suggested" | "selected" | "completed" | "skipped";
  accountImpactOnCompletion?: AccountImpact;
  completionEffect?: "lighter" | "same" | "more_tired" | "not_sure";
  selectedAt?: string;
  completedAt?: string;
  skippedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type Experiment = {
  id: string;
  spaceId: string;
  source:
    | "manual"
    | "discovery_point"
    | "personal_action"
    | "trigger_support"
    | "rich_incoming_message"
    | "draft_self_check"
    | "boundary_clarity"
    | "return_to_self";
  sourceTopicId?: string;
  sourceEpisodeId?: string;
  focus:
    | "receive_without_escalating"
    | "delay_checking"
    | "draft_before_sending"
    | "respond_one_thread"
    | "save_later_topic"
    | "small_boundary"
    | "receive_care"
    | "ask_better_question"
    | "return_to_self"
    | "custom";
  name: string;
  intention: string;
  triggerSituation?: string;
  tinyAction: string;
  completionMarkers: string[];
  rewardMarker?: string;
  status: "idea" | "active" | "completed" | "paused" | "retired";
  pinned?: boolean;
  completions: ExperimentCompletion[];
  createdAt: string;
  updatedAt: string;
};

type ExperimentCompletion = {
  id: string;
  experimentId: string;
  result: "completed" | "partial" | "noticed_only" | "not_suitable";
  actionTaken?: string;
  energyEffect?: "lighter" | "same" | "more_tired" | "not_sure";
  learning?: string;
  nextAdjustment?: string;
  accountImpacts: AccountImpact[];
  createdAt: string;
};
```

Note: safety is intentionally not a persisted MVP account. If later user testing shows that users need a separate stability/security trend without becoming score-fixated, it can be added as a fourth account in a later version.

## Copy Principles

* Use first-person prompts where possible: "我现在能确认的是..." rather than "对方是否..."
* Avoid clinical diagnosis and attachment labels in primary UI.
* Avoid language that frames the user as failing when they ruminate or check.
* Prefer "pause", "record", "receive", "return", "leave for later" over "fix", "score", "win", "lose".
* Prefer storage-jar language such as "存下", "打开罐子", "取一个支持自己的小动作", and "明细" over colder accounting language.
* Avoid "记账", "对账", "消费", "余额不足", "还债", or exchange language that sounds like buying relationship outcomes.
* Prefer "旧感觉", "熟悉的痛", "严厉的声音", "保护我的一部分", and "更稳的我" over diagnostic or pathologizing trauma/parts language.
* Treat emotion words as temporary maps, not identities. Prefer "我现在有焦虑/羞耻/怨恨" over "我是一个焦虑/羞耻/怨恨的人".
* Do not frame fear, sadness, anger, or vulnerability as enemies to eliminate. Frame them as signals that can be seen, understood, and carried while choosing a wiser action.
* Avoid promising "疗愈创伤", "神经重塑", "重写大脑", or "治好内在小孩". The app can support repeated awareness and practice, not guarantee clinical change.
* Never imply that a warm interaction proves future commitment.
* Never imply that a negative or ambiguous interaction proves rejection.
* Never imply that loss of novelty, conflict, or disillusionment automatically means the relationship is wrong.
* Never imply that repair means self-abandonment, enduring harm, or giving up boundaries.
* Prefer "学习怎么更好地爱/被爱", "修复", "理解", "磨合", "普通的照顾" over "真爱测试", "匹配度", or "关系判决".
* When showing growth signals, always frame them as episode evidence, not a partner score or future guarantee.
* Prefer "我想更准确地理解", "我听到的是...", "我可能只知道一部分" over "我已经看穿了你" or "对方就是这样的人".
* Do not frame seeing or empathy as an obligation to keep listening when the user has no capacity, needs a boundary, or faces unsafe content.
* Always end high-activation flows with one next action the user controls.

## Success Measures

* User can start a trigger support flow from the first screen with one tap.
* User can reach one owned next action from a triggered state without filling a full episode.
* User can complete the trigger support flow in four short steps unless they choose to continue into a deeper flow.
* User can create a record in under 2 minutes using quick mode.
* User can complete a full reflection without needing to fill every optional field.
* User can identify facts and interpretations as separate fields in every full episode.
* User can identify at least one broad emotion family and optionally refine it into a more precise emotion label.
* User can calibrate at least one hard emotion as a signal/protector and choose one action without suppressing the emotion or obeying its risky impulse.
* User can record mixed emotions without being forced to resolve them into one feeling.
* User can preserve an unfinished topic without creating urgency.
* User can save multiple discovery points from one dense event before they are forgotten.
* User can later review a discovery point with its source context without turning it into an overdue task.
* User can split a dense incoming message into emotional threads and save some as later topics.
* User can run a draft check and understand why a recommendation was shown.
* User can see at least one self-supporting action after a trigger.
* User can complete a Return-to-Self flow with body action, anchor, and next real-life action.
* DBT-informed grounding is represented through short, conservative actions rather than long workbook-style exercises.
* User can identify a responsibility boundary and choose a user-owned limit without turning it into control of the other person.
* User can optionally reframe a high-activation record from victim/rescuer/persecutor stance into creator/guide/challenger stance, with user-facing Chinese copy using 创造者 / 引导者 / 挑战者.
* User can optionally distinguish love/care from attachment, control, and novelty-chasing in a specific episode.
* User can optionally run a repair/understanding check before converting conflict, mismatch, or loss of novelty into a relationship conclusion.
* User can save ordinary care, repair, and mutual understanding as meaningful connection data without treating them as future proof.
* User can optionally practice being seen / seeing the other person through one reflective listening, open question, or companioning action without analyzing the other person.
* User can identify whether a hard conversation needs clarification, mirroring, repair, boundary, pause, or later topic.
* The app reduces, rather than increases, attention on ambiguous external signals.

## First Release Acceptance Criteria

These are the criteria required before starting implementation handoff for the first release. The first coding pass gates on P0 only. P1 criteria define the next implementation phase and should not block the first runnable P0 app.

### P0 Must Pass

* [ ] App opens on a mobile viewport directly to Home, not a marketing page.
* [ ] First-run setup shows a local-first privacy note and creates one emotional space with a generic default name.
* [ ] Home first viewport shows active space, daily market, one market note, four trigger buttons, secondary "记录互动", and compact Connection / Self / Energy summaries.
* [ ] In P0, "想检查信号" and "草稿自检" are honest placeholders or marked "稍后支持"; they do not create fake data or account impacts.
* [ ] User can complete "我被触发了" through fact, body/emotion, urge, owned next action, and completion without creating a full episode.
* [ ] User can save a quick trigger record from completion.
* [ ] User can complete "回到自己" through body landing, anchor, return-to-life action, and energy-effect feedback.
* [ ] User can partially complete "回到自己" by saving only noticed need to pause or one body action without penalty.
* [ ] User can create a quick record with title, facts, interpretation, emotion/body, connection/activation, and next action.
* [ ] Saved records persist locally across refresh.
* [ ] Account summaries update from saved records using transparent Connection / Self / Energy reasons.
* [ ] Minimal Settings shows local-first privacy copy and can reset/delete local data with confirmation.
* [ ] Home never shows a single relationship-health score, global balance, or partner verdict.
* [ ] High-activation flows always offer one user-owned next action.

### P1 Must Pass

* [ ] User can complete "想检查信号" through target confirmation, previewing good/bad/absent signals, and choosing one 10-minute non-checking action.
* [ ] "想检查信号" allows "我还是想检查" without shame, penalties, streaks, or blocked access.
* [ ] User can complete "草稿自检" through draft input, state check, motivation, no-response tolerance, content risk, stance check, after-send preview, and deterministic recommendation.
* [ ] "草稿自检" can save a local draft, route to Return-to-Self, route to boundary clarity, or convert to a private record / later topic.
* [ ] User can complete "收到很多内容，不知道怎么接" through manual thread selection, mixed emotion check, per-thread handling, enough-for-now direction, and save summary.
* [ ] Rich incoming message review can save later topics / discovery points and never requires responding to every thread.
* [ ] Topics tab shows later topics, discovery points, questions to explore, and action ideas with low-pressure status copy.
* [ ] User can batch-save 1-8 discovery points from a dense event without long notes.
* [ ] User can open account detail from a Home account card and see current balance, recent change, recent sources, and reason copy.
* [ ] User can open a personal action menu from account detail or completion moments, see one recommendation plus no more than two alternatives, and choose, refresh, or skip.
* [ ] Choosing a personal action creates no account impact; only completion can create a small Self or Energy signal.
* [ ] User can create one personal experiment in three short steps and record an attempt as completed, partial, noticed only, or not suitable.
* [ ] Settings include privacy note, reset/delete data controls, and export/import placeholder only.

### P2 Light Acceptance

* [ ] Optional P2 branches can be entered from relevant P0/P1 flows but never block completion.
* [ ] P2 branches use compact screens or chips and can save structured output.
* [ ] If activation is high, P2 branches can route back to Return-to-Self.
* [ ] P2 branches do not diagnose attachment type, trauma source, object constancy, self-worth, or the other person.

### First Release Safety Acceptance

* [ ] App does not monitor external apps, messages, social media, response speed, read receipts, or online status.
* [ ] App does not automatically summarize pasted text, infer sender psychology, predict reactions, or generate reply wording optimized to obtain a response.
* [ ] App does not use points, balances, or actions to imply the user can obtain another person's affection, response, apology, certainty, or behavior.
* [ ] App shows human/professional/crisis support copy when self-harm, violence, coercion, stalking, physical safety, or overwhelming/dissociative content appears, without attempting risk scoring.
* [ ] UI copy avoids diagnosis, relationship verdicts, surveillance encouragement, and shame/failure language.

## Full Product Acceptance Backlog

* [ ] On a mobile viewport, the app opens directly to a usable dashboard.
* [ ] On the first mobile viewport, Home shows compact emotional-space/market status, market note, and primary trigger actions before storage-jar/account summaries.
* [ ] User can create/edit an emotional space with an anonymized name and mark it as self-facing or interpersonal.
* [ ] User can record an interaction episode with fact, interpretation, meaning, unsupported conclusion, emotion, body, next action, and anchor fields.
* [ ] User can choose a broad emotion family, optional precise label, intensity, confidence, body cue, and mixed emotion state.
* [ ] User can optionally complete emotion calibration that records what the emotion may protect, what risky reaction it may trigger, and one wiser action.
* [ ] User can optionally complete a state check that routes the moment to current-flow continuation, connection-continuity, old-echo, self-compassion, boundary clarity, Return-to-Self, low-cognitive action, or outside support without producing a diagnosis.
* [ ] User can complete the "我被触发了" urgent flow through Fact, Body/Emotion, Urge, and Owned Next Action screens without creating a full episode.
* [ ] The "我被触发了" flow shows one question per screen, chip-first input, and skip/not-sure options where precision may increase shame or rumination.
* [ ] The "我被触发了" flow can route to connection-continuity, boundary, old-echo/inner-critic, empowerment, or seeing branches only when relevant, and all branches can be skipped.
* [ ] The "我被触发了" completion screen offers Return-to-Self for high activation and can save a quick trigger record.
* [ ] User can complete the "想检查信号" flow through confirmation target, good-signal preview, bad/absent-signal preview, and one 10-minute non-checking action.
* [ ] The "想检查信号" flow lets the user choose "我还是想检查" and record the result without shame, penalty, or blocked access.
* [ ] The "想检查信号" flow can offer connection-continuity and digital-boundary mini-checks when relevant.
* [ ] The app does not monitor external apps, message status, social media, response speed, read receipts, or online status for the "想检查信号" flow.
* [ ] User can complete the "收到很多内容，不知道怎么接" flow through optional message note, message-shape selection, thread selection, mixed emotion check, per-thread handling, enough-for-now response direction, and save summary.
* [ ] The rich incoming message flow supports at least these thread labels: being seen, clarification, vulnerability, expression buffer, rumination, perfectionism, values, self-care, and later topic.
* [ ] User can mark each rich-message thread as received now, respond now, save for later, or no response needed.
* [ ] User can convert rich-message threads into later topics, save an anchor, route to Draft Checker, route to Return-to-Self, or close without drafting.
* [ ] The rich incoming message flow only creates Connection impact from a thread when the user records an observable sentence or cue as evidence.
* [ ] The rich incoming message flow does not automatically summarize the message, infer sender psychology, predict sender expectations, generate optimized replies, or require every thread to receive a response.
* [ ] User can complete the "草稿自检" flow through draft input, state check, send motivation, no-response tolerance, content risk, stance check, after-send preview, and recommendation.
* [ ] The "草稿自检" flow can return ready enough, lighten it, save as draft, private record first, boundary expression, or return to self first using deterministic rules.
* [ ] The "草稿自检" flow can save the draft locally, convert it into a private record/later topic, route to boundary clarity, or route to Return-to-Self.
* [ ] The "草稿自检" flow does not rewrite the draft, predict the other person's reaction, or recommend wording designed to obtain a response.
* [ ] Trigger flow supports "not sure" / "mixed" emotion states and offers at least three near-emotion nudges such as anxiety vs excitement, shame vs guilt, and anger vs hurt.
* [ ] User can tag an episode with deposit/process types.
* [ ] User can assign connection and activation levels to an episode.
* [ ] User can see connection, self, and energy account summaries without a single relationship-health score.
* [ ] User can open account detail to view balance, recent change, and recent sources.
* [ ] User can open a lightweight personal action menu from account detail or a completion moment, see one recommended action plus no more than two alternatives, and choose, refresh, or skip it.
* [ ] Choosing a personal action records intention without account impact; only marking the action complete can create a small Self or Energy signal.
* [ ] User can set today's emotional market state and see a contextual note.
* [ ] User can add later topics and update their status.
* [ ] Topics tab shows later topics, discovery points, questions to explore, and action ideas with filters by type, status, theme, and source.
* [ ] User can batch-save multiple discovery points from a dense event, each with title, optional source snippet, why-it-matters note, explore question, and theme.
* [ ] User can batch-save 1-8 discovery points without being required to fill long notes or analyze them immediately.
* [ ] User can open a discovery point from Topics or from the source episode, view source context, add review notes, mark it reviewed, leave it for now, turn it into an action/experiment idea, or mark it no longer needed.
* [ ] Source episode detail shows linked discovery points under "这次看见的点"; if the source record is deleted, discovery points keep their text and show "来源记录已删除".
* [ ] Discovery points do not show due dates, overdue states, streaks, or unprocessed-debt language.
* [ ] Saving a discovery point creates no account impact by default; review and conversion follow transparent Self/action/experiment rules.
* [ ] User can create at least one personal relationship experiment and mark it complete.
* [ ] User can create a personal experiment in three short steps: focus, tiny action, and completion marker.
* [ ] User can create an experiment from a discovery point, personal action, trigger support, draft checker, boundary clarity, rich incoming message review, or Return-to-Self.
* [ ] User can record an experiment attempt as completed, partial, noticed only, or not suitable without negative account impact.
* [ ] Experiment completion can create Self/Energy impact with transparent reasons, but does not create Connection impact unless a separate episode records observable mutual contact.
* [ ] User can pause, retire, edit, or save an experiment as an idea without streaks, missed-day penalties, or relationship-outcome promises.
* [ ] User can use a draft-check flow that returns a reflective recommendation.
* [ ] User can use a calm-closure flow after saving an episode.
* [ ] User can enter Return-to-Self from Home and from high-activation paths such as trigger support, signal checking, or draft self-check.
* [ ] User can complete Return-to-Self through body landing, attention anchor, return-to-life action, and energy-effect feedback.
* [ ] User can partially complete Return-to-Self by saving only "noticed need to pause" or one body landing action without penalty.
* [ ] Return-to-Self creates Self/Energy impacts using transparent rules and never creates automatic Connection impact.
* [ ] Return-to-Self shows crisis/human-support copy when high-risk safety wording appears, without attempting diagnosis or risk scoring.
* [ ] User can optionally complete a connection-continuity check in relevant high-activation moments without receiving an attachment-type diagnosis or object-constancy score.
* [ ] User can complete an old-echo / mosquito-elephant flow through pacing gate, visible mosquito, present/old-echo split, touched need, old protective program, optional inner critic, present-self response, and completion summary.
* [ ] Old-echo flow can be reached from trigger support, state check, draft checker, Return-to-Self, self-compassion pause, discovery point detail, or full episode review.
* [ ] Old-echo flow allows "not ready to look deeper" and Return-to-Self as valid completions without penalty.
* [ ] User can optionally record a subjective present/old-echo felt proportion without receiving a trauma score, percentage analysis, or childhood-source determination.
* [ ] User can optionally notice inner critic content without being asked to retrieve trauma details or receiving IFS/trauma-treatment claims.
* [ ] Old-echo flow can save a discovery point, route to self-compassion, Return-to-Self, human support, or create a small experiment.
* [ ] User can complete a self-compassion pause through mindfulness/pain noticing, common-humanity reminder, optional inner-critic rewrite, self-kindness action, responsible next action, and completion summary.
* [ ] Self-compassion pause can be reached from trigger support, inner-critic/old-echo check, draft checker, Return-to-Self, experiment completion, full episode review, self-facing space, or personal action menu.
* [ ] Self-compassion pause supports "just read this sentence" / skip behavior without requiring writing, meditation, or immediate emotional relief.
* [ ] Self-compassion pause can rewrite harsh self-talk into a caring but honest sentence without avoiding accountability.
* [ ] Self-compassion pause creates Self/Energy impacts through transparent rules and does not create interpersonal Connection impact by default.
* [ ] User can save one non-comparative self-appreciation moment without creating a self-esteem or self-worth score.
* [ ] User can complete a boundary clarity check through boundary signal, responsibility split, real limit/request, boundary form, say-no/receive-no practice, user-owned consequence/next action, and completion summary.
* [ ] Boundary clarity check can be reached from trigger support, draft checker, full episode review, personal action menu, discovery point detail, repair/understanding check, and experiment creation.
* [ ] Boundary clarity check can show unsafe/coercive-situation outside-support copy without providing legal advice, safety planning, or danger scoring.
* [ ] Boundary clarity check records what is mine, what is not mine, one boundary form, one user-owned next action, and optional difficulty.
* [ ] Boundary clarity check can support saying no and receiving no without treating no as disappearance, retaliation, or collapse.
* [ ] Boundary clarity check creates Self/Energy impacts only through transparent rules and never creates automatic Connection impact.
* [ ] Draft self-check can detect over-carrying, guilt-driven yes, and unclear limits without rewriting the user's message.
* [ ] User can optionally record an empowerment shift without labeling the other person.
* [ ] User can optionally mark a relationship-learning phase for an episode without receiving a relationship verdict.
* [ ] User can complete a love-vs-attachment/control/novelty check that records a leaning, note, and one freedom-preserving action.
* [ ] User can complete a repair/understanding check that records what they want understood, what they may not yet understand, their part, and one next direction: repair, boundary, wait, later topic, or Return-to-Self.
* [ ] User can mark growth signals only with episode-scoped evidence and without partner scoring.
* [ ] User can optionally complete a seeing / being seen practice that records focus, one micro-action, capacity, and next direction.
* [ ] User can choose a listening/question micro-action such as reflect back, ask one open question, pause before advice, or ask what they may have missed.
* [ ] User can complete a two-layer hard conversation check without receiving a mind-reading interpretation of the other person.
* [ ] User can review a long warm incoming message without needing to respond to every thread immediately.
* [ ] User can use quick record and full record paths.
* [ ] User can save draft state while filling a long form.
* [ ] User data persists locally across refreshes.
* [ ] Local-only/private-data positioning is visible before or during first setup.
* [ ] UI copy avoids diagnosing the other person, predicting relationship outcomes, encouraging surveillance, or framing personal actions as a way to obtain another person's behavior.
* [ ] App can be installed as a PWA or at least provides valid manifest/service-worker basics if supported by the chosen stack.

## Definition of Done

* First release acceptance criteria pass; full product acceptance backlog is not required to block first release.
* Tests added/updated where appropriate for state logic and persistence.
* Lint and type-check pass.
* Mobile layout verified manually in at least one narrow viewport.
* Docs/notes updated if behavior or setup expectations change.
* Private chatlog details are not embedded in shipped seed data.

## Out of Scope

### MVP Non-Goals

These are not in the first release, but may be evaluated later if they do not violate the product safety boundaries.

* Couple/shared accounts.
* Cloud sync, login, user accounts, backend API, or cross-device storage.
* Push notifications and scheduled reminders.
* Public social/sharing features.
* Importing chat histories.
* AI-assisted summarization, reflection, or export.
* Rich data export/import.
* Advanced multi-space management.
* Full reward store, wishlist, or complex gamification.
* Full relationship courses, long care-language questionnaires, or required multi-page repair worksheets.
* Long book-style self-tests or required multi-page need-quadrant worksheets.
* Required 87-emotion glossary UI.
* Homepage balance-first UI.

### Product Safety Boundaries

These are product red lines, not merely "later" items. They should remain out of scope unless the product direction is explicitly redefined.

* AI-powered psychological analysis, partner interpretation, or message rewriting designed to obtain a response.
* Automatic scoring from message length, response speed, online status, read receipts, platform activity, or social-media signals.
* Reading, monitoring, or scraping external apps, chats, social feeds, online status, response speed, or read receipts.
* Attachment-personality diagnosis of the other person.
* Attachment-type diagnosis of the user.
* Object-constancy diagnosis, object-constancy score, or connection-permanence score.
* Childhood-trauma determination, trauma-source scoring, or prompts that require the user to identify a childhood cause before continuing.
* Treating "old echo" as proof that a specific family-of-origin event caused the current reaction.
* Self-compassion score, self-esteem/self-worth score, attractiveness score, or any score that implies the user's worth.
* Boundary score or prompts that turn boundaries into control, punishment, testing, or manipulation.
* True-love tests, relationship compatibility scores, deterministic relationship-stage systems, partner green-flag/red-flag scoring, or advice about whether to stay or leave.
* Relationship future prediction.
* "Relationship health 82%" or any single authoritative relationship score.
* Claims that passion fading, conflict, disillusionment, or mismatch automatically proves love is gone or the relationship is wrong.
* Prompts that pressure the user to repair when the appropriate next step is boundary, waiting, outside support, or disengagement.
* People-reading tools, partner dossiers, personality tests, empathy scores, or psychological profiles of another person.
* Claims that the app can know what the other person really means, feels, intends, or needs.
* Advice that the user must always listen longer, ask more questions, provide companionship, or stay emotionally available.
* Automatic emotion detection from message text, emotion accuracy scoring, or diagnostic mood labels.
* Moral ranking of emotions as good/bad, prompts to eliminate fear/sadness/anger/vulnerability, or forced positive reframing.
* Any redemption concept where points buy, request, pressure, or predict another person's behavior.
* Reward mechanics that treat the other person's response, affection, time, apology, or certainty as an exchangeable item.

### Clinical / Crisis Boundary

The product can be trauma-informed and DBT-informed, but it is a self-reflection PWA, not therapy, medical care, or crisis intervention.

* Trauma processing, exposure therapy, memory recovery, parts unburdening, IFS therapy, or claims that the app rewires the brain.
* Crisis assessment, suicide risk scoring, or treatment workflows.
* Legal advice, emergency/safety planning, domestic-violence planning, or instructions for confronting unsafe people.
* Crisis/medical/therapy claims.
* Claiming to deliver DBT treatment. DBT-inspired grounding structures can inform copy and flow design, but the app is not therapy.
* Biological effect claims such as lowering cortisol, releasing oxytocin, or rewiring the nervous system.
* Intensive physiological exercises or medicalized instructions. The app should keep grounding options conservative and skippable.
* If despair, hopelessness, self-harm, violence, coercion, stalking, or fear for physical safety appears, MVP should stop ordinary reflection and suggest immediate human/professional/crisis support.

## Technical Approach

* Implement as a mobile-first frontend-only PWA.
* Use local browser persistence for MVP data.
* Prefer explicit typed domain models for emotional spaces, episodes, accounts, tags, topics, experiments, anchors, personal actions, and daily market state.
* Keep account calculations transparent and editable enough that the user does not treat them as objective truth.
* If a framework is scaffolded, choose a conservative modern stack that supports quick PWA setup, type safety, and offline-capable static deployment.

### Recommended First-Release Stack

* Use a Vite + React + TypeScript app unless implementation discovery finds a stronger local convention.
* Use a small client router such as React Router for page/tab routing.
* Use plain CSS modules, a small utility CSS setup, or a lightweight component layer; avoid introducing a heavy design system before the app shape stabilizes.
* Use local browser storage only:
  * start with `localStorage` for first implementation if data volume remains small and synchronous access keeps implementation simple
  * keep a storage adapter boundary so IndexedDB can replace it later without changing domain logic
* Use a generated app data version such as `schemaVersion: 1` to allow local migrations later.
* PWA requirements:
  * manifest with name, short name, icons, theme color, display mode, and start URL
  * service worker or Vite PWA plugin if adopted during implementation
  * app should remain usable after refresh and basic offline reload

### P0 PWA Technical Decision

P0 should implement the simplest PWA layer that supports installability and local use without increasing privacy or cache complexity.

Decision for P0:

* Use Vite + React + TypeScript unless implementation discovery finds an existing scaffold.
* Use a PWA manifest in P0.
* Use simple generated/local icons in P0 if no brand icon exists yet.
* Do not require offline-first service-worker caching for P0 if it delays the trigger-first loop.
* If `vite-plugin-pwa` is added, use it conservatively:
  * cache app shell assets only
  * do not cache user data outside the storage adapter
  * do not add background sync
  * do not add push notifications
* P0 can ship as installable-ish web app with valid manifest before a full service-worker strategy.

P0 manifest fields:

| Field | P0 value direction |
|---|---|
| `name` | "情感储蓄罐" or "Mood Bank" if ASCII-only asset tooling blocks Chinese. |
| `short_name` | "储蓄罐" or "MoodBank". |
| `start_url` | `/` |
| `scope` | `/` |
| `display` | `standalone` |
| `background_color` | match `--color-bg` light token |
| `theme_color` | match app top/background token, not a saturated alarm color |
| `icons` | 192 and 512 sizes; simple non-childish jar/abstract mark acceptable |

P0 service worker policy:

* Recommended first implementation:
  * add manifest and mobile metadata first
  * defer service worker until the app shell and storage failure states are stable
* If service worker is implemented:
  * app reload should work offline after first load
  * storage remains browser-local through the same adapter
  * updates should not trap the user on stale app code that cannot read current schema
* Do not implement:
  * push
  * background sync
  * notification permission
  * remote crash reporting
  * telemetry
  * server caching of personal data

PWA acceptance:

* [ ] `manifest.webmanifest` exists with P0 fields.
* [ ] Mobile browser shows correct app name/theme color where supported.
* [ ] App remains usable after refresh.
* [ ] If service worker is not implemented, PRD/README notes that P0 is local-first but not fully offline-first.
* [ ] If service worker is implemented, update/cache behavior does not touch personal data outside the storage adapter.
* [ ] No push, background sync, analytics, or remote logging is added in P0.

### Suggested Route Map

This is the full first-release route map. The first coding pass should implement only the routes marked P0 in the table below plus minimal `/settings`; P1 routes can be placeholders or omitted until the P0 loop is working.

* `/` -> Home
* `/setup` -> first-run setup
* `/record` -> quick/full record entry
* `/record/:id` -> episode detail
* `/flow/trigger` -> "我被触发了"
* `/flow/signal-check` -> "想检查信号"
* `/flow/draft-check` -> "草稿自检"
* `/flow/return-to-self` -> "回到自己"
* `/flow/rich-incoming` -> "收到很多内容，不知道怎么接"
* `/topics` -> topics / discovery points
* `/topics/:id` -> topic detail
* `/experiments` -> experiments
* `/experiments/:id` -> experiment detail
* `/accounts/:account` -> account detail / ledger
* `/settings` -> settings, privacy note, reset/delete controls
* P2 compact branches can be modal steps or nested flow states rather than standalone routes in the first release.

### MVP Route / Screen / Model Map

| Route / Entry | Primary screen or flow | Priority | Backing model | Creates account impact? | Notes |
|---|---|---:|---|---|---|
| `/setup` | First-run setup | P0 | `EmotionalSpace`, `DailyMarketState`, `Settings` | No | Creates a default space and explains local privacy. |
| `/` | Home dashboard | P0 | derived summaries from root app state | No | Trigger-first first viewport; account cards open detail. |
| `/flow/return-to-self` | Return-To-Self | P0 | `ReturnToSelfPractice`, optional `Episode` link | Yes, Self/Energy only | Supports partial completion and no automatic Connection impact. |
| `/flow/trigger` | "我被触发了" | P0 | flow draft, optional `Episode`, `AccountImpact[]` | Optional | Completion can save quick trigger record or close without penalty. |
| `/record` | Quick/full record | P0 | `Episode`, `EmotionRating[]`, `AccountImpact[]`, `DepositTag[]` | Yes | Must separate facts, interpretation, connection, activation, and next action. |
| `/record/:id` | Episode detail | P1 | `Episode`, linked topics/anchors/experiments | Derived only | Shows source context and links to follow-up objects. |
| `/accounts/:account` | Account detail / ledger | P1 | derived account summary from `AccountImpact[]` | No | Shows balance, recent change, sources, and reason copy. |
| account detail / completion entry | Personal action menu | P1 | `PersonalAction` | No on choose; optional on complete | One recommendation plus at most two alternatives. |
| `/flow/signal-check` | "想检查信号" | P1 | flow draft, optional `Episode` or `LaterTopic` | Optional Self only | Does not monitor external apps or punish checking. |
| `/flow/draft-check` | "草稿自检" | P1 | `Draft`, optional `Episode` / `LaterTopic` | Optional Self/Energy | Deterministic recommendation; no reply optimization. |
| `/flow/rich-incoming` | Rich incoming review | P1 | `RichIncomingReview`, `EmotionalThread[]`, `LaterTopic[]` | Optional | Manual thread handling; no automatic summarization or sender inference. |
| `/topics` | Topic list | P1 | `LaterTopic[]` | No | Low-pressure statuses; no overdue/task shame language. |
| `/topics/:id` | Topic detail | P1 | `LaterTopic`, linked source objects | Optional via action only | Can add notes, review, convert to action/experiment, or leave for now. |
| `/experiments` | Experiments list/create | P1 | `PersonalExperiment[]` | No on create | Starts or stores practice ideas. |
| `/experiments/:id` | Experiment detail/completion | P1 | `PersonalExperiment`, completion attempts | Optional Self/Energy | Completed/partial/noticed/not-suitable all valid. |
| nested P2 branch | Connection-continuity | P2 light | optional check object on `Episode` | Optional Self | Non-diagnostic; helps distinguish evidence from absence panic. |
| nested P2 branch | Emotion calibration | P2 light | `EmotionCalibration`-like structured output | Optional Self | Frames emotions as signals/protectors, not enemies. |
| nested P2 branch | Boundary clarity | P2 light | `BoundaryClarityCheck` | Optional Self/Energy | Splits mine / not mine; no control or punishment framing. |
| nested P2 branch | Self-compassion pause | P2 light | `SelfCompassionPause` | Optional Self/Energy | Caring but honest; no forced positivity. |
| nested P2 branch | Old echo / inner critic | P2 light | `OldEchoCheck`, `InnerCriticCheck` | Optional Self/Energy | No trauma-source determination. |
| nested P2 branch | Empowerment shift | P2 light | `EmpowermentShift` | Optional Self | Victim/Rescuer/Persecutor -> Creator/引导者/Challenger. |
| nested P2 branch | Healthy love literacy | P2 light | `RelationshipLearningCheck` | Optional | Moment-level literacy only; no true-love test. |
| nested P2 branch | Seeing / being seen practice | P2 light | `SeeingPractice` | Optional Connection/Self/Energy | Connection only from recorded observable being-seen / mutual listening evidence. |
| `/settings` | Minimal settings | P0/P1 | `Settings` and storage adapter | No | P0 privacy note + reset/delete; P1 rename, storage status, export/import placeholder, and fuller boundary copy. |

### Suggested Frontend Module Boundaries

The first implementation should keep domain logic out of page components. Suggested module boundaries:

* `src/domain/`
  * `types.ts`: shared domain types from the PRD.
  * `defaults.ts`: seed app state, seed anchors, default daily market, default actions.
  * `accounts.ts`: pure account-impact derivation, account summaries, recent-source grouping.
  * `flows.ts`: shared flow result types and completion helpers.
  * `recommendations.ts`: deterministic rules for draft check, signal check, and personal action menu.
  * `safety.ts`: non-diagnostic routing helpers for high-risk copy and activation-based Return-To-Self routing.
* `src/storage/`
  * `storageAdapter.ts`: interface plus localStorage implementation.
  * `migrations.ts`: schema-version load/migration/fallback.
  * `appStore.tsx` or equivalent: React state boundary that loads/saves one root object.
* `src/routes/`
  * page-level route components only; avoid embedding domain rules directly in routes.
* `src/components/`
  * app frame, bottom nav, account cards, chips, sliders, text areas, step headers, completion surfaces, empty states, and confirmation dialogs.
* `src/flows/`
  * state-machine-like components for trigger, return-to-self, signal-check, draft-check, rich-incoming, and compact P2 branches.
* `src/copy/`
  * user-facing Chinese copy tables for emotion labels, anchors, market notes, action suggestions, and safety-boundary copy.

Implementation guardrail:

* Domain helpers should be testable without React.
* Components can be simple and pragmatic, but flow logic should not become untestable page-local branching.
* User-facing strings that are repeated across flows should live in copy tables so tone can be revised without hunting through components.

### First Implementation File Map

This map is a suggested starting point for the first code pass. It should be adjusted if implementation discovery finds an existing project convention, but the domain/UI separation should stay intact.

Root and app shell:

* `package.json`: scripts for dev, build, lint, typecheck, and test.
* `index.html`: PWA document shell.
* `public/manifest.webmanifest`: name, short name, start URL, display mode, theme color, and icons.
* `src/main.tsx`: React root and router provider.
* `src/App.tsx`: route definitions and setup-vs-app gate.
* `src/styles/tokens.css`: semantic color, spacing, radius, shadow, and typography tokens.
* `src/styles/global.css`: reset, safe-area handling, mobile viewport defaults, and base typography.

Domain:

* `src/domain/types.ts`
  * `AppState`
  * `EmotionalSpace`
  * `Episode`
  * `AccountImpact`
  * `LaterTopic`
  * `Anchor`
  * `ReturnToSelfPractice`
  * `PersonalAction`
  * `Experiment`
  * `Draft`
  * `Settings`
* `src/domain/defaults.ts`
  * `createInitialState()`
  * seed anchors
  * default daily market options
  * default personal actions
  * default setup values
* `src/domain/accounts.ts`
  * `collectAccountImpacts(state, spaceId)`
  * `deriveAccountSummary(state, account, spaceId)`
  * `deriveAllAccountSummaries(state, spaceId)`
  * `getRecentAccountSources(state, account, spaceId)`
  * account reason copy helpers
* `src/domain/episodes.ts`
  * create/update/delete episode helpers
  * quick-record-to-episode mapping
  * episode detail summary helpers
  * deletion cascade rules for impacts and linked source flags
* `src/domain/returnToSelf.ts`
  * completion / partial-completion impact rules
  * anchor selection helpers
  * energy-effect mapping
* `src/domain/recommendations.ts`
  * trigger next-action recommendations
  * personal action menu recommendation rules
  * draft-check and signal-check deterministic recommendation rules in later milestones
* `src/domain/safety.ts`
  * high activation routing helper
  * support-boundary copy trigger helper
  * no risk scoring
* `src/domain/validation.ts`
  * quick record required-field checks
  * safe defaults for missing/corrupted values

Storage:

* `src/storage/storageAdapter.ts`
  * `StorageAdapter` interface
  * `localStorageAdapter`
  * `isStorageAvailable()`
* `src/storage/migrations.ts`
  * schema-version migration and fallback
* `src/storage/appStore.tsx`
  * load once on app mount
  * save root state after meaningful changes
  * expose typed actions for setup, records, settings reset, and flow completions
  * expose `AppStoreStatus`, `storageStatus`, `lastError`, and `lastSavedAt`
  * expose selectors for active space, today market, latest record, drafts, anchors, and account summaries
  * prevent page components from calling `localStorage` directly
  * require storage success before showing persisted-success copy such as "已经存下"

Routes:

* `src/routes/Setup.tsx`: local-first privacy note and first emotional space setup.
* `src/routes/Home.tsx`: trigger-first dashboard.
* `src/routes/QuickRecord.tsx`: quick/full record entry.
* `src/routes/EpisodeDetail.tsx`: P1 saved record detail and delete/edit entry.
* `src/routes/AccountDetail.tsx`: P1 storage-jar detail and source rows.
* `src/routes/Topics.tsx`: P1 later topics / discovery points list.
* `src/routes/TopicDetail.tsx`: P1 topic review and conversion actions.
* `src/routes/Experiments.tsx`: P1 experiment list/create entry.
* `src/routes/ExperimentDetail.tsx`: P1 experiment detail and completion reflection.
* `src/routes/Settings.tsx`: P0 privacy/delete; P1 storage status, rename, placeholders.

Flows:

* `src/flows/trigger/TriggerFlow.tsx`
* `src/flows/returnToSelf/ReturnToSelfFlow.tsx`
* `src/flows/signalCheck/SignalCheckFlow.tsx`: P1
* `src/flows/draftCheck/DraftCheckFlow.tsx`: P1
* `src/flows/richIncoming/RichIncomingFlow.tsx`: P1
* `src/flows/shared/flowTypes.ts`
* `src/flows/shared/useFlowDraft.ts`

Components:

* `src/components/app/AppShell.tsx`
* `src/components/app/BottomNav.tsx`
* `src/components/app/PageHeader.tsx`
* `src/components/home/PrimaryActionPanel.tsx`
* `src/components/accounts/AccountSummaryCard.tsx`
* `src/components/accounts/AccountSourceList.tsx`
* `src/components/records/LatestRecordCard.tsx`
* `src/components/records/RecordListItem.tsx`
* `src/components/forms/ChipGroup.tsx`
* `src/components/forms/TextCapture.tsx`
* `src/components/forms/ActivationSelector.tsx`
* `src/components/forms/ConnectionSelector.tsx`
* `src/components/forms/EmotionPicker.tsx`
* `src/components/flows/StepScreen.tsx`
* `src/components/flows/CompletionCard.tsx`
* `src/components/flows/ReturnToSelfCta.tsx`
* `src/components/actions/PersonalActionSheet.tsx`
* `src/components/feedback/EmptyState.tsx`
* `src/components/feedback/ConfirmDialog.tsx`
* `src/components/feedback/StorageWarning.tsx`

P0 file subset:

* Required P0 routes:
  * `Setup.tsx`
  * `Home.tsx`
  * `QuickRecord.tsx`
  * `Settings.tsx`
  * `TriggerFlow.tsx`
  * `ReturnToSelfFlow.tsx`
* Required P0 domain/storage:
  * `types.ts`
  * `defaults.ts`
  * `accounts.ts`
  * `episodes.ts`
  * `returnToSelf.ts`
  * `recommendations.ts` for trigger and simple next actions only
  * `safety.ts`
  * `validation.ts`
  * `storageAdapter.ts`
  * `migrations.ts`
  * `appStore.tsx`
* P0 may use lightweight inline previews instead of building:
  * `EpisodeDetail.tsx`
  * `AccountDetail.tsx`
  * `PersonalActionSheet.tsx`
  * `Topics.tsx`
  * `Experiments.tsx`

Copy:

* `src/copy/accounts.ts`: account labels, reminders, reason copy.
* `src/copy/actions.ts`: personal action titles, reasons, effort labels.
* `src/copy/anchors.ts`: seed anchors and anchor categories.
* `src/copy/emotions.ts`: emotion families, near-emotion nudges, body chips.
* `src/copy/markets.ts`: daily market options and Home notes.
* `src/copy/privacy.ts`: first-run and Settings privacy/boundary copy.
* `src/copy/safety.ts`: support-boundary copy for crisis/high-risk content.

Tests:

* `src/domain/accounts.test.ts`
* `src/domain/episodes.test.ts`
* `src/domain/returnToSelf.test.ts`
* `src/domain/recommendations.test.ts`
* `src/storage/migrations.test.ts`
* Component/integration tests can start after the first runnable shell exists.

### Milestone-To-File Mapping

M1 should touch only:

* app shell files
* styles/tokens
* setup route
* minimal Home placeholder
* minimal Settings privacy/delete
* storage adapter and migrations
* initial state defaults

M2 should touch:

* `src/domain/types.ts`
* `src/domain/defaults.ts`
* `src/domain/accounts.ts`
* `src/domain/episodes.ts`
* `src/domain/returnToSelf.ts`
* first domain tests

M3 should add:

* Home real layout components
* Return-To-Self flow
* account summary cards wired to derived summaries
* anchor preview

M4 should add:

* Trigger flow
* Quick Record route
* quick-record-to-episode helpers
* saved latest record card

M5 should add:

* Record list/detail
* Account detail
* account source list
* anchor creation from episode detail
* delete confirmation and derived-summary update

M6-M9 should layer P1/P2 flows after P0 persistence and account derivation are stable.

### Shared UI Primitives

Build these once and reuse them across flows:

* `AppShell`: mobile app frame with bottom navigation and safe-area spacing.
* `PageHeader`: compact title, optional back/close action, optional space/market context.
* `PrimaryActionPanel`: Home trigger panel with four urgent buttons.
* `AccountSummaryCard`: Home storage-jar card for Connection / Self / Energy.
* `AccountSourceList`: ledger source rows with reason copy.
* `StepScreen`: one-question flow screen with progress, prompt, helper copy, and action row.
* `ChipGroup`: single/multi-select chips with "不确定" / "跳过" support.
* `ActivationSelector`: compact 0-4 activation choice.
* `ConnectionSelector`: compact 0-4 connection choice.
* `EmotionPicker`: broad emotion-family chips plus optional refinement.
* `TextCapture`: short/long text input with draft preservation.
* `CompletionCard`: summary, saved output, suggested next actions.
* `ReturnToSelfCta`: consistent route into Return-To-Self from high-activation moments.
* `ConfirmDialog`: delete/reset confirmation for local emotionally meaningful data.

### Flow State Contract

Each P0/P1 flow should follow the same implementation contract:

* `flowId`: stable identifier for analytics-free local debugging and draft keys.
* `currentStep`: current screen id.
* `answers`: partial user inputs keyed by step id.
* `activationLevel`: optional current activation level when available.
* `canComplete`: whether the user can finish now without filling more fields.
* `recommendedNext`: deterministic next direction with reason copy.
* `completion`: structured result that can create an episode, topic, draft, action, experiment, or no persisted object.

Every flow must support:

* close without penalty
* skip or not sure where precision could increase shame or rumination
* save partial result when useful
* route to Return-To-Self when activation is high
* deterministic reason copy for recommendations and account impacts

### Pure Logic To Test First

Unit tests should prioritize logic that protects the product boundaries:

* account summary derivation from `AccountImpact[]`
* "Connection impact requires observable evidence" rules
* Return-To-Self impact rules: Self/Energy only, no automatic Connection
* trigger completion to quick record creation
* draft-check recommendation rules and reason text
* signal-check outcomes including shame-free "我还是想检查"
* personal action menu recommendation limit: one primary plus at most two alternatives
* experiment completion impact rules
* local storage load/save/reset and schema fallback
* storage unavailable / corrupted / unsupported-version fallback behavior
* high-risk keyword routing to support copy without risk scoring

### State And Persistence Shape

* Keep one root persisted object:
  * `schemaVersion`
  * `spaces`
  * `activeSpaceId`
  * `dailyMarkets`
  * `episodes`
  * `returnToSelfPractices`
  * `topics`
  * `experiments`
  * `anchors`
  * `personalActions`
  * `drafts`
  * `settings`
* Keep derived values out of persisted state where possible:
  * account balances
  * recent trends
  * current dashboard summaries
  * recommended personal action
* Persist account-impact events as part of episodes/actions/completions, then derive account summaries from those impacts.
* For P0, account-impact events are source-owned by `episodes`, `returnToSelfPractices`, or optional trigger completion results; they are not stored as a global authoritative balance list.
* Every persisted item should include `id`, `createdAt`, and `updatedAt`.
* IDs can be generated client-side with `crypto.randomUUID()` where available.
* Store only user-entered or deterministic local content. Do not embed private chatlog examples as seed data.

### Account Calculation

* Account balances are derived from `AccountImpact[]` entries attached to records, Return-to-Self completions, personal-action completions, and experiment completions.
* Calculation should be deterministic:
  * sum impacts by account for selected emotional space
  * compute recent change from recent records / last 7 days / latest N entries
  * expose recent sources with reason text
* Account UI should always show reason copy near numeric or qualitative output.
* Sending a message, checking a signal, or saving a discovery point should not automatically create positive impact unless the PRD explicitly defines a user-owned action as completed.
* Connection impact requires observable self-contact or interpersonal contact evidence; never infer it from hope, fantasy, or point totals.

### Flow Implementation Pattern

* Implement each major P0/P1 flow as a small state machine:
  * `currentStep`
  * per-step answers
  * derived recommendation / route
  * completion result
* Flow state can live in memory while the flow is open, with local draft persistence for long text inputs.
* Every flow should support:
  * skip / not sure where relevant
  * close without penalty
  * save partial result when emotionally meaningful
  * route to Return-to-Self when activation is high
* P2 branch implementations should share common primitives:
  * chip question
  * short text input
  * completion summary
  * account-impact preview
  * route-to-next-action buttons

### Data Safety And Privacy

* First-run setup must explain that data is local to the browser/device and may be visible to anyone with access to the unlocked device/browser profile.
* Settings must include reset/delete data.
* Export/import is a placeholder in first release unless explicitly implemented later.
* No network calls are required for app behavior in MVP.
* Do not add analytics, telemetry, remote logging, or crash reporting without a separate privacy decision.

### Testing Strategy

P0 test scope:

* Unit tests are required for pure domain and storage logic.
* Component/integration tests should cover the critical user path, but do not need to cover every visual state before P0 is runnable.
* Manual mobile QA is required because P0 is a mobile emotional-use tool and layout/keyboard/safe-area issues can break the product even when unit tests pass.

P0 unit tests:

| File | Required coverage |
|---|---|
| `src/domain/accounts.test.ts` | `collectAccountImpacts`, `deriveAccountSummary`, reason copy lookup, no persisted derived balances. |
| `src/domain/episodes.test.ts` | Quick Record -> Episode mapping, required fields, fact/interpretation split, deletion cascade if implemented. |
| `src/domain/returnToSelf.test.ts` | Full/partial/closed completion, Self/Energy impacts, never Connection. |
| `src/domain/recommendations.test.ts` | Trigger owned next-action recommendations only for P0. |
| `src/domain/validation.test.ts` | Setup defaults, Quick Record required facts, "说不清" and "暂时没有" valid states. |
| `src/storage/migrations.test.ts` | empty load, valid v1 load, invalid JSON, future version, missing arrays defaulted. |
| `src/storage/appStore.test.ts` | typed actions, save failure semantics, reset failure semantics, no-write placeholders. |

P0 component / integration tests:

| Flow | Required coverage |
|---|---|
| First-run setup | User can complete setup with defaults and land on Home. |
| Home | First viewport renders top strip, market note, four trigger buttons, record action, three account summaries. |
| P1 placeholders | "想检查信号" and "草稿自检" show honest placeholder and write no data. |
| Trigger Support | User completes four steps, chooses owned action, saves Quick Record, Home latest record appears. |
| Return-To-Self | User completes full flow and partial flow; summaries update Self/Energy only. |
| Quick Record | Independent save with facts/interpretation/emotion/connection/activation/next action persists. |
| Settings reset | Reset requires confirmation and returns to setup after success. |
| Storage failure | Save failure does not show "已经存下"; reset failure does not clear UI. |

P0 manual mobile QA matrix:

| Area | Check |
|---|---|
| Viewports | 360 x 740, 390 x 844, and one narrow short viewport around 360 x 640. |
| Safe area | Bottom nav and sticky buttons do not collide with iOS safe area / standalone mode. |
| Keyboard | Quick Record text inputs remain usable when keyboard opens. |
| Touch targets | Primary buttons, chips, nav tabs, close/back controls are at least 44px. |
| Text wrapping | Chinese labels do not overflow chips, trigger cards, account cards, bottom nav, or completion actions. |
| Reduced motion | No required flow depends on animation; no pulsing/shaking/confetti. |
| Focus | Keyboard focus-visible is present for buttons, chips, inputs, dialogs. |
| Storage | Reload preserves setup, records, Return-To-Self practices, anchors/drafts if saved. |
| Reset | Delete/reset clears app data only after confirmation and verified success. |
| PWA | Manifest loads; app title/theme color are reasonable; service-worker behavior is verified if implemented. |
| Privacy copy | Setup and Settings both disclose local-only storage and no cloud sync. |
| Safety copy | High-risk wording routes to support-boundary copy if implemented in P0. |

P0 test non-goals:

* No need to automate every P1/P2 placeholder.
* No need for visual snapshot testing before the first stable UI.
* No need for E2E testing across browsers before P0 works locally.
* No need to test AI/network behavior because P0 has none.

### Implementation Guardrails

* Do not implement AI analysis, network sync, external app monitoring, or automatic chat parsing.
* Do not introduce large dependencies for scoring, therapy content, or chat import.
* Do not implement P2 branches as blocking dependencies for P0/P1.
* Prefer deterministic rule functions and visible reason text over hidden scoring.
* Keep user-facing copy Chinese-first and avoid clinical labels in primary UI.

## Decision (ADR-lite)

**Context**: The original idea included a richer couple-oriented bank/game metaphor with deposits, withdrawals, investment projects, rewards, market rates, and shared relationship temperature. The chatlogs show that this could be powerful but also risky for an emotionally activated user: it may encourage monitoring, performance, prediction, or turning care into a transaction.

**Decision**: MVP will be a single-user relationship interaction observer and self-stabilization PWA. It will keep the useful financial metaphor only as soft account language, while centering interaction episodes, fact/interpretation separation, dual-axis connection/activation state, self-facing experiments, later topics, calm closure, and three accounts: connection, self, and energy.

**Consequences**: The MVP is safer, smaller, and better matched to personal growth. It postpones more game-like couple features until the product proves it can reduce rumination and improve self-return rather than amplify attachment activation.

## Decision (ADR-lite): Three Accounts Over Four

**Context**: The four-account model would track safety, self, connection, and energy separately. This is psychologically precise because a user can experience connection without safety, safety without intensity, or warmth with depletion. However, the drama-triangle material makes one risk clearer: when safety is presented as a top-level score, the user may treat it as another external signal to monitor and may outsource agency back to the other person's behavior.

**Decision**: Use three MVP accounts: connection, self, and energy. Safety will be represented through non-score mechanisms: daily emotional market, connection/activation quadrant, safety-related tags, trigger flow prompts, and fact/interpretation/conclusion separation. Empowerment shifts primarily affect the Self account because the desired movement is toward owned choice, responsibility boundaries, and clear action.

**Consequences**: The app stays aligned with TED: Victim -> Creator, Rescuer -> Guide / 引导者, Persecutor -> Challenger. It avoids over-centering "do I feel safe because of what they did?" and instead asks "what connection occurred, did I keep myself, and what did this cost or restore?" A fourth safety account can be added later if real use shows it helps more than it amplifies checking.

## Decision (ADR-lite): Trigger-First MVP

**Context**: The product can start from three plausible first experiences: account review, full reflection, or trigger support. Account review best matches the "emotional account" metaphor but risks score-checking. Full reflection is complete but too heavy when the user is activated. Trigger support best matches the real moment where the app can interrupt checking, over-explaining, and rumination loops.

**Decision**: MVP will be trigger-first. The first screen hierarchy is: compact relationship/market status, one market note, primary trigger support panel, secondary record interaction entry, then storage-jar/account summaries. The first visible action area should help the user pause, name facts and feelings, notice a drama-triangle stance if relevant, and choose one owned next action. Account summaries and full episode recording remain available but are not the primary first-screen focus.

**Consequences**: The product will feel less like a ledger and more like a self-stabilization tool. This better supports the TED direction and reduces the risk that account scores become another object of monitoring. "记录互动" remains accessible, but it does not compete with urgent return-to-self actions.

## Decision (ADR-lite): Rich Incoming Message Entry

**Context**: Long, warm, emotionally dense incoming messages can create a distinct user state: high connection, high information load, and pressure to respond perfectly. This is not always an emergency, but it can become activating if the user feels responsible for answering every thread.

**Decision**: Rich incoming message review will be a Record enhancement, with a light entry from Return-to-Self. It will not be a primary Home emergency button in MVP.

**Consequences**: The Home emergency panel stays focused on immediate trigger loops, while the app still supports dense warm-message processing. This keeps the first screen simple and routes the user into richer review only when the scenario calls for it.

## Decision (ADR-lite): Balance Visibility And Rewards

**Context**: The account metaphor benefits from balances and may later support rewards or wishlists. But showing large balances on Home would encourage score-checking and could turn the app into another certainty-seeking surface. In a personal version, reward language also needs a stricter boundary: there is no shared counterparty who can be redeemed from the ledger.

**Decision**: Home shows status summaries, light trends, and recent sources. Numeric balances are available only in Account Detail / Ledger. MVP will include a lightweight personal action menu rather than a reward store: one recommended action, at most two alternatives, and clear choose / refresh / skip controls. Future reward mechanics are framed as personal action exchange: the user can turn recorded self-support into self-care, growth cards, rituals, reflection milestones, or chosen next actions.

**Consequences**: The product keeps its "account" identity and future extensibility while protecting the trigger-first MVP from becoming a score dashboard or a choice-heavy shop. Rewards reinforce agency and self-care instead of creating an interpersonal transaction. The other person's response, affection, time, apology, or certainty is not an exchangeable item in the personal product model.

## Decision (ADR-lite): Healthy Love Literacy As Optional Context

**Context**: The `How to Love Better` outline reinforces that love, care, repair, honesty, and being loved are learned capacities. This matters for users shaped by emotional neglect, unstable care, or media narratives that overvalue passion, novelty, and effortless certainty. However, turning this into a course, compatibility test, or partner-scoring system would conflict with the MVP's trigger-first and self-stabilization goals.

**Decision**: MVP will include healthy love and repair literacy as optional context inside relevant flows, not as a Home primary entry. The app can help users distinguish love from attachment/control/novelty, mark a relationship-learning phase for the current episode, run a repair/understanding check, and save ordinary care or growth signals as episode evidence. It will not tell users whether the relationship is "true love", whether to stay or leave, or whether the other person is emotionally mature.

**Consequences**: The product can teach healthier relationship perception without becoming directive or judgmental. It supports the three accounts: Connection for real mutuality/repair/care, Self for honesty, boundary, responsibility, and non-control, and Energy for the cost or restoration of relationship work. It also preserves the MVP boundary: urgent users still land in trigger support first, and deeper love literacy appears only when it helps the current reflection.

## Decision (ADR-lite): Seeing As A Micro-Skill

**Context**: The `如何了解一个人` outline overlaps with existing concepts of being seen, empathy, repair, and healthy love, but adds practical social skills: patient presence, open questions, reflective listening, avoiding labels, and recognizing the emotional undercurrent of hard conversations. These are useful for the MVP because many trigger loops come from guessing, over-answering, advising too soon, or trying to be understood without first confirming understanding.

**Decision**: MVP will add seeing / being seen practice as an optional micro-skill inside rich incoming message review, draft checker, repair/understanding, full episode review, and calm closure. It will not become a people-reading tool, personality test, empathy score, or profile of the other person.

**Consequences**: The app can strengthen Connection through real being-seen and mutual listening while reinforcing Self through humility, non-labeling, capacity awareness, and boundary-aware presence. It also protects the user from confusing empathy with over-carrying: "I can try to understand" does not mean "I must keep listening, fixing, or absorbing everything."

## Decision (ADR-lite): First Release Slice

**Context**: The PRD now captures a broad psychological product system: trigger support, signal checking, draft self-check, Return-to-Self, rich incoming review, discovery points, experiments, boundaries, self-compassion, old echo, love literacy, and seeing practice. Implementing every branch as a full standalone surface in the first build would create scope bloat and delay the core value: interrupting activation loops.

**Decision**: First coding pass will implement P0 only: setup, Home, Trigger Support, Return-To-Self, Quick Record, local persistence, derived account summaries, and minimal Settings reset/delete. P1 adds signal checking, draft self-check, rich incoming review, topics/discovery points, account detail, personal actions, and experiments after P0 works end to end. P2 modules remain in the PRD and data model, but can start as compact optional branches rather than full standalone surfaces.

**Consequences**: The first implementation can become usable quickly while preserving the deeper product architecture. The app can prove whether users actually return during activated moments before investing in every deeper reflection module. This also protects the UX from over-processing: deeper branches remain available but never block the main flow.

## Decision (ADR-lite): Local-First Frontend Architecture

**Context**: The first release is personal, private, and intentionally avoids backend services, login, cloud sync, AI analysis, and external monitoring. The repo currently has no app source, so the implementation needs a conservative default architecture that can be built quickly while preserving future migration paths.

**Decision**: First release should be a frontend-only TypeScript PWA, preferably Vite + React unless implementation discovery finds a stronger local convention. Data will be persisted through a local storage adapter boundary. The first implementation may use `localStorage` for simplicity, but domain logic must not depend directly on it so IndexedDB, encryption, export/import, or sync can be added later. Account summaries are derived from persisted impact events rather than stored as authoritative balances.

**Consequences**: The MVP can ship quickly and remain fully local/private. The storage adapter prevents early localStorage choices from becoming permanent architecture. Derived account summaries keep the product honest: balances are transparent observations, not hidden judgments. The trade-off is that first release data is browser/device-local and not protected against device access, browser clearing, or cross-device loss; the UI must say this clearly.

## Open Questions

* None for P0 implementation.

## PRD Closure And Implementation Handoff

P0 PRD status:

* P0 scope is locked.
* P0 route behavior is locked.
* P0 account model and impact rules are locked.
* P0 storage and app-store write semantics are locked.
* P0 UI tokens, component contracts, copy tables, enums, and validation rules are locked.
* P0 testing and manual mobile QA requirements are defined.

Implementation can start when:

* The user confirms P0 should move from planning to implementation.
* Trellis implementation context is configured or the inline implementation workflow loads `trellis-before-dev`.
* The first implementation slice is limited to P0-A unless explicitly changed:
  * app shell
  * visual tokens
  * setup
  * storage adapter / migrations
  * app store
  * minimal Settings

Implementation should not revisit during P0 unless a blocker appears:

* account count: three accounts only
* product metaphor: "情感储蓄罐"
* P0 local-first, no backend
* no AI analysis / chat import / external monitoring
* trigger-first Home
* P1/P2 placeholders only
* Return-To-Self creates Self/Energy only
* Connection requires observable evidence or explicit self-contact evidence

Recommended next step:

1. Start implementation with P0-A.
2. Run lint/typecheck/test once scaffolding exists.
3. Keep PRD changes limited to discovered implementation blockers.

## Technical Notes

* Source context:
  * `docs/chatlog2.md` lines around product ideation and MVP refinement.
  * `docs/chatlog1.md` as broader historical context for real use cases, triggers, boundaries, and self-soothing patterns.
* Research references:
  * `.trellis/tasks/06-17-emotional-account-pwa/research/dbt-informed-return-to-self.md` — DBT-informed grounding structure for Return-to-Self, based on local workbook sections in `docs/DBT-skills-work-book.md`.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/attachment-continuity-awareness.md` — non-diagnostic connection-continuity check for attachment activation and object-constancy instability.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/trauma-informed-parts-awareness.md` — trauma-informed old-echo and inner-critic awareness with non-treatment boundaries.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/mosquito-elephant-product-mapping.md` — product mapping from `docs/躲在蚊子后面的大象.md`: visible trigger, hidden need, protective program, and new response practice.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/self-compassion-product-mapping.md` — product mapping from `docs/自我关怀的力量.md`: self-compassion pause, inner-critic rewrite, body-based soothing, self-appreciation, and non-bypass accountability.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/boundaries-product-mapping.md` — product mapping from `docs/过犹不及（升级增订版）.md`: responsibility split, boundary forms, guilt/anger signals, digital boundaries, and user-owned consequences.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/emotion-language-product-mapping.md` — product mapping from `Atlas of the Heart`: emotion granularity, near-emotion distinctions, mixed emotions, connection language, and high-risk emotion boundaries.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/love-better-product-mapping.md` — product mapping from `How to Love Better`: healthy love literacy, love vs attachment/control/novelty, repair/understanding, care literacy, and ordinary care as meaningful relationship data.
  * `.trellis/tasks/06-17-emotional-account-pwa/research/seeing-and-being-seen-product-mapping.md` — product mapping from `docs/如何了解一个人.md`: being seen, illuminator stance, listening/question micro-actions, two-layer hard conversation checks, and companioning without fixing.
* Repository inspection:
  * No app source exists yet.
  * `.trellis/spec/frontend/index.md` exists but guidelines are placeholders.
  * `.trellis/spec/guides/index.md` lists cross-layer and reuse thinking guides.
* Privacy handling:
  * Requirements intentionally abstract away names, platforms, and identifying narrative details from the chatlogs.
