import { ArrowLeft, BookmarkPlus, NotebookPen, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import { accountCopy, accountReasonCopy, getAccountEvidenceCopy } from "../copy/accounts";
import { episodeSourceCopy } from "../copy/episodes";
import {
  discoveryPointKindCopy,
  discoveryPointStatusCopy,
  discoveryPointThemeCopy,
} from "../copy/topics";
import { buildQuickRecordImpacts } from "../domain/accounts";
import { selectEpisodeDetail, type AccountDetailSourceRow } from "../domain/selectors";
import {
  buildBatchDiscoveryPointInputs,
  MAX_BATCH_DISCOVERY_POINTS,
  type BatchDiscoveryPointDraft,
} from "../domain/topics";
import type {
  ActivationLevel,
  ConnectionLevel,
  DiscoveryPoint,
  DiscoveryPointKind,
  DiscoveryPointTheme,
  EnergyEffect,
  Episode,
} from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import { buildTopicRoute, getRecordRouteId, type AppRoute } from "../utils/route";

type RecordDetailPageProps = {
  navigate: (route: AppRoute) => void;
};

type TopicCreateMode = "single" | "batch";

type BatchTopicRow = BatchDiscoveryPointDraft & {
  id: string;
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

const discoveryPointKindOptions: ChipOption<DiscoveryPointKind>[] = [
  { value: "discovery", label: discoveryPointKindCopy.discovery },
  { value: "topic", label: discoveryPointKindCopy.topic },
  { value: "question", label: discoveryPointKindCopy.question },
  { value: "action_idea", label: discoveryPointKindCopy.action_idea },
];

const discoveryPointThemeOptions: ChipOption<DiscoveryPointTheme>[] = [
  { value: "emotion", label: discoveryPointThemeCopy.emotion },
  { value: "boundary", label: discoveryPointThemeCopy.boundary },
  { value: "old_echo", label: discoveryPointThemeCopy.old_echo },
  { value: "relationship_learning", label: discoveryPointThemeCopy.relationship_learning },
  { value: "expression", label: discoveryPointThemeCopy.expression },
  { value: "self_care", label: discoveryPointThemeCopy.self_care },
  { value: "action_experiment", label: discoveryPointThemeCopy.action_experiment },
];

function createBatchTopicRow(): BatchTopicRow {
  return {
    id: `record_batch_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    title: "",
    kind: "discovery",
    theme: undefined,
    note: "",
    exploreQuestion: "",
  };
}

export function RecordDetailPage({ navigate }: RecordDetailPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const episodeId = getRecordRouteId(window.location.pathname);
  const detail = useMemo(() => selectEpisodeDetail(state, episodeId), [episodeId, state]);
  const activeSpace = detail
    ? state.spaces.find((space) => space.id === detail.episode.spaceId)
    : null;
  const [anchorText, setAnchorText] = useState("");
  const [anchorMessage, setAnchorMessage] = useState<string | null>(null);
  const [anchorError, setAnchorError] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFacts, setEditFacts] = useState("");
  const [editInterpretation, setEditInterpretation] = useState("");
  const [editEmotion, setEditEmotion] = useState<EmotionChip>("说不清");
  const [editBody, setEditBody] = useState<BodyChip>("说不清");
  const [editConnectionLevel, setEditConnectionLevel] = useState<string>("not_sure");
  const [editActivationLevel, setEditActivationLevel] = useState<string>("not_sure");
  const [editNextAction, setEditNextAction] = useState<NextAction>("not_now");
  const [editConnectionEvidence, setEditConnectionEvidence] = useState("");
  const [editSelfContactEvidence, setEditSelfContactEvidence] = useState("");
  const [editEnergyEffect, setEditEnergyEffect] = useState<EnergyEffect>("not_sure");
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicCreateMode, setTopicCreateMode] = useState<TopicCreateMode>("single");
  const [topicKind, setTopicKind] = useState<DiscoveryPointKind>("discovery");
  const [topicTheme, setTopicTheme] = useState<DiscoveryPointTheme | undefined>();
  const [topicNote, setTopicNote] = useState("");
  const [topicQuestion, setTopicQuestion] = useState("");
  const [batchTopicRows, setBatchTopicRows] = useState<BatchTopicRow[]>(() => [createBatchTopicRow()]);
  const [topicMessage, setTopicMessage] = useState<string | null>(null);
  const [topicError, setTopicError] = useState<string | null>(null);
  const [latestCreatedTopic, setLatestCreatedTopic] = useState<DiscoveryPoint | null>(null);

  const previewImpacts = useMemo(() => {
    if (!detail || !activeSpace || !editFacts.trim()) return [];

    return buildQuickRecordImpacts(
      {
        spaceId: detail.episode.spaceId,
        spaceType: activeSpace.type,
        source: detail.episode.source,
        title: editTitle,
        facts: editFacts,
        interpretation: editInterpretation,
        emotions: [editEmotion],
        bodySensations: [editBody],
        connectionLevel: parseLevel(editConnectionLevel) as ConnectionLevel,
        activationLevel: parseLevel(editActivationLevel) as ActivationLevel,
        nextAction: editNextAction,
        connectionEvidence: editConnectionEvidence,
        selfContactEvidence: editSelfContactEvidence,
        energyEffect: editEnergyEffect,
      },
      { sourceId: detail.episode.id, createdAt: new Date(0).toISOString() },
    );
  }, [
    activeSpace,
    detail,
    editActivationLevel,
    editBody,
    editConnectionEvidence,
    editConnectionLevel,
    editEmotion,
    editEnergyEffect,
    editFacts,
    editInterpretation,
    editNextAction,
    editSelfContactEvidence,
    editTitle,
  ]);

  useEffect(() => {
    const episode = detail?.episode;
    setAnchorText(detail ? getInitialAnchorText(detail.episode, detail.linkedAnchors[0]) : "");
    setAnchorMessage(null);
    setAnchorError(null);
    setIsDeleteConfirmOpen(false);
    setDeleteError(null);
    setEditTitle(episode?.title ?? "");
    setEditFacts(episode?.facts ?? "");
    setEditInterpretation(episode?.interpretation ?? "");
    setEditEmotion(normalizeEmotion(episode?.emotions[0]));
    setEditBody(normalizeBody(episode?.bodySensations[0]));
    setEditConnectionLevel(episode?.connectionLevel === undefined ? "not_sure" : String(episode.connectionLevel));
    setEditActivationLevel(episode?.activationLevel === undefined ? "not_sure" : String(episode.activationLevel));
    setEditNextAction(normalizeNextAction(episode?.nextAction));
    setEditConnectionEvidence(getEpisodeEvidence(detail?.episode, "connection"));
    setEditSelfContactEvidence(getEpisodeEvidence(detail?.episode, "self_contact"));
    setEditEnergyEffect(getEpisodeEnergyEffect(detail?.episode));
    setEditMessage(null);
    setEditError(null);
    setTopicTitle("");
    setTopicCreateMode("single");
    setTopicKind("discovery");
    setTopicTheme(undefined);
    setTopicNote("");
    setTopicQuestion("");
    setBatchTopicRows([createBatchTopicRow()]);
    setTopicMessage(null);
    setTopicError(null);
    setLatestCreatedTopic(null);
  }, [detail?.episode.id]);

  function saveRecordAnchor() {
    if (!detail) return;

    if (!anchorText.trim()) {
      setAnchorError("先留一句能托住自己的话。");
      setAnchorMessage(null);
      return;
    }

    const result = actions.saveAnchor({
      spaceId: detail.episode.spaceId,
      text: anchorText,
      sourceType: "episode",
      sourceId: detail.episode.id,
    });

    if (!result.ok) {
      setAnchorError(result.error ?? "这次还没有保存成功，锚点还没有写进本机。");
      setAnchorMessage(null);
      return;
    }

    setAnchorText(result.value?.text ?? anchorText.trim());
    setAnchorError(null);
    setAnchorMessage("锚点已存下，首页会优先显示这句话。");
  }

  function deleteRecord() {
    if (!detail) return;

    const result = actions.deleteEpisode({
      id: detail.episode.id,
      deleteLinkedAnchors: true,
    });

    if (!result.ok) {
      setDeleteError(result.error ?? "这次没有删除成功，记录还留在本机。");
      setIsDeleteConfirmOpen(false);
      return;
    }

    setDeleteError(null);
    setIsDeleteConfirmOpen(false);
    navigate("/record");
  }

  function saveRecordEdit() {
    if (!detail) return;

    if (!editFacts.trim()) {
      setEditError("至少保留一个可确认的事实。");
      setEditMessage(null);
      return;
    }

    const result = actions.updateEpisode({
      id: detail.episode.id,
      title: editTitle,
      facts: editFacts,
      interpretation: editInterpretation,
      emotions: [editEmotion],
      bodySensations: [editBody],
      connectionLevel: parseLevel(editConnectionLevel) as ConnectionLevel,
      activationLevel: parseLevel(editActivationLevel) as ActivationLevel,
      nextAction: editNextAction,
      connectionEvidence: editConnectionEvidence,
      selfContactEvidence: editSelfContactEvidence,
      energyEffect: editEnergyEffect,
    });

    if (!result.ok) {
      setEditError(result.error ?? "这次还没有保存成功，记录还没有写进本机。");
      setEditMessage(null);
      return;
    }

    setEditTitle(result.value?.title ?? (editTitle.trim() || "一次互动"));
    setEditFacts(result.value?.facts ?? editFacts.trim());
    setEditInterpretation(result.value?.interpretation ?? "");
    setEditEmotion(normalizeEmotion(result.value?.emotions[0]));
    setEditBody(normalizeBody(result.value?.bodySensations[0]));
    setEditConnectionLevel(
      result.value?.connectionLevel === undefined ? "not_sure" : String(result.value.connectionLevel),
    );
    setEditActivationLevel(
      result.value?.activationLevel === undefined ? "not_sure" : String(result.value.activationLevel),
    );
    setEditNextAction(normalizeNextAction(result.value?.nextAction));
    setEditConnectionEvidence(getEpisodeEvidence(result.value, "connection"));
    setEditSelfContactEvidence(getEpisodeEvidence(result.value, "self_contact"));
    setEditEnergyEffect(getEpisodeEnergyEffect(result.value));
    setEditError(null);
    setEditMessage("记录已更新，这条记录带来的储蓄罐明细也已按当前内容重新计算。");
  }

  function saveRecordTopic() {
    if (!detail) return;

    if (!topicTitle.trim()) {
      setTopicError("先给这个点一个很短的名字。");
      setTopicMessage(null);
      setLatestCreatedTopic(null);
      return;
    }

    const result = actions.saveDiscoveryPoint({
      spaceId: detail.episode.spaceId,
      title: topicTitle,
      kind: topicKind,
      theme: topicTheme,
      note: topicNote,
      exploreQuestion: topicQuestion,
      sourceType: "episode",
      sourceId: detail.episode.id,
      sourceTitle: detail.episode.title,
      sourceSnippet: detail.episode.facts,
    });

    if (!result.ok) {
      setTopicError(result.error ?? "这次还没有存下，发现点还没有写进本机。");
      setTopicMessage(null);
      setLatestCreatedTopic(null);
      return;
    }

    setTopicTitle("");
    setTopicKind("discovery");
    setTopicTheme(undefined);
    setTopicNote("");
    setTopicQuestion("");
    setTopicError(null);
    setTopicMessage("已存入稍后，并和这条记录关联。之后可以慢慢回看。");
    setLatestCreatedTopic(result.value ?? null);
  }

  function addBatchTopicRow() {
    setBatchTopicRows((rows) =>
      rows.length >= MAX_BATCH_DISCOVERY_POINTS ? rows : [...rows, createBatchTopicRow()],
    );
  }

  function updateBatchTopicRow(id: string, fields: Partial<BatchTopicRow>) {
    setBatchTopicRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...fields } : row)));
  }

  function removeBatchTopicRow(id: string) {
    setBatchTopicRows((rows) => {
      const nextRows = rows.filter((row) => row.id !== id);
      return nextRows.length ? nextRows : [createBatchTopicRow()];
    });
  }

  function saveRecordTopicsBatch() {
    if (!detail) return;

    const inputs = buildBatchDiscoveryPointInputs(detail.episode.spaceId, batchTopicRows, {
      sourceType: "episode",
      sourceId: detail.episode.id,
      sourceTitle: detail.episode.title,
      sourceSnippet: detail.episode.facts,
    });

    if (!inputs.length) {
      setTopicError("至少给一个看见的点写下短标题。");
      setTopicMessage(null);
      setLatestCreatedTopic(null);
      return;
    }

    const result = actions.saveDiscoveryPoints(inputs);

    if (!result.ok) {
      setTopicError(result.error ?? "这次还没有存下，发现点还没有写进本机。");
      setTopicMessage(null);
      setLatestCreatedTopic(null);
      return;
    }

    const savedCount = result.value?.length ?? inputs.length;
    setBatchTopicRows([createBatchTopicRow()]);
    setTopicError(null);
    setTopicMessage(`已存入稍后 ${savedCount} 个点，并和这条记录关联。之后可以慢慢回看。`);
    setLatestCreatedTopic(result.value?.[0] ?? null);
  }

  if (!detail) {
    return (
      <section className="record-detail-page page-stack">
        <PageHeader
          title="这条记录暂时找不到"
          kicker="它可能已经被清理，或这个链接不是现在这只储蓄罐里的内容。"
          onBack={() => navigate("/record")}
        />
        <section className="record-empty panel">
          <NotebookPen size={24} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>回到记录</h2>
            <p>可以继续查看其他已经存下的内容，或重新存一次眼前的事实。</p>
          </div>
          <button className="button button--primary" type="button" onClick={() => navigate("/record")}>
            <ArrowLeft size={16} strokeWidth={1.8} />
            回到记录
          </button>
        </section>
      </section>
    );
  }

  const recordRows = buildRecordRows(detail.episode);
  const latestAnchor = detail.linkedAnchors[0] ?? null;
  const savedAnchorText = latestAnchor?.text ?? detail.episode.anchor?.trim() ?? "";

  return (
    <section className="record-detail-page page-stack">
      <PageHeader
        title="记录详情"
        kicker="回看当时存下的事实、感受和一点点选择。"
        onBack={() => navigate("/record")}
      />

      <section className="record-detail-hero panel">
        <div className="record-detail-hero__meta">
          <span>{episodeSourceCopy[detail.episode.source]}</span>
          <span>存于 {formatDate(detail.episode.createdAt)}</span>
        </div>
        <h1>{detail.episode.title}</h1>
        <p>{detail.episode.facts}</p>
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>这次存下的内容</h2>
          <p>事实、解释和身体信号分开放，帮助你回到可确认的地方。</p>
        </div>
        <div className="record-detail-facts">
          {recordRows.map((row) => (
            <div key={row.label}>
              <span>{row.label}</span>
              <p>{row.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>整理这条记录</h2>
          <p>只整理这条记录本身。储蓄罐明细会按这些字段重新计算，已保存的发现点和锚点不会被改写。</p>
        </div>
        <label className="field">
          <span className="field-label">短标题</span>
          <input
            className="field-input"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            placeholder="一次互动"
          />
        </label>
        <section className="record-form__fact-card" aria-label="编辑事实和解释">
          <label className="field fact-field">
            <span className="record-form__label-row">
              <span className="field-label">可确认的事实</span>
              <span className="meta-text">至少保留一个事实。</span>
            </span>
            <textarea
              className="field-textarea"
              value={editFacts}
              onChange={(event) => setEditFacts(event.target.value)}
              rows={3}
              placeholder="例如：对方具体回应了我提到的勇气。"
            />
          </label>
          <label className="field interpretation-field">
            <span className="record-form__label-row">
              <span className="field-label">我脑中出现的解释</span>
              <span className="meta-text">可以空着，不需要补成结论。</span>
            </span>
            <textarea
              className="field-textarea"
              value={editInterpretation}
              onChange={(event) => setEditInterpretation(event.target.value)}
              rows={3}
              placeholder="我猜它可能意味着..."
            />
          </label>
        </section>
        <ChipGroup label="情绪" options={emotionOptions} value={editEmotion} onChange={setEditEmotion} />
        <ChipGroup label="身体" options={bodyOptions} value={editBody} onChange={setEditBody} />
        <div className="split-controls">
          <ChipGroup
            label="连接感"
            options={connectionOptions}
            value={editConnectionLevel}
            onChange={setEditConnectionLevel}
            helper="连接感和激活可以同时存在。"
          />
          <ChipGroup
            label="激活程度"
            options={activationOptions}
            value={editActivationLevel}
            onChange={setEditActivationLevel}
            helper="激活程度不是关系结论。"
          />
        </div>
        {activeSpace?.type === "self" ? (
          <label className="field">
            <span className="field-label">和自己的真实接触证据</span>
            <input
              className="field-input"
              value={editSelfContactEvidence}
              onChange={(event) => setEditSelfContactEvidence(event.target.value)}
              placeholder="例如：我看见自己其实很害怕。"
            />
          </label>
        ) : (
          <label className="field">
            <span className="field-label">可观察的连接证据，可空着</span>
            <input
              className="field-input"
              value={editConnectionEvidence}
              onChange={(event) => setEditConnectionEvidence(event.target.value)}
              placeholder="例如：对方具体回应了我的勇气。"
            />
          </label>
        )}
        <ChipGroup
          label="下一步我能做什么"
          helper="选一个由我能完成的动作。"
          options={nextActionOptions}
          value={editNextAction}
          onChange={setEditNextAction}
        />
        <ChipGroup
          label="这次对能量的影响"
          options={energyOptions}
          value={editEnergyEffect}
          onChange={setEditEnergyEffect}
        />
        <section className="impact-preview" aria-label="编辑后的账户影响预览">
          <h2>更新后可能会存进哪里</h2>
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
        <button className="button button--primary" type="button" onClick={saveRecordEdit}>
          <Save size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在保存" : "保存整理"}
        </button>
        {editMessage ? <p className="helper-text">{editMessage}</p> : null}
        {editError ? <p className="form-error">{editError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>锚点</h2>
          <p>把这条记录里能托住自己的话单独放出来，之后需要时可以直接带走。</p>
        </div>
        {savedAnchorText ? (
          <article className="record-anchor-card">
            <span>{latestAnchor ? `最近存于 ${formatDate(latestAnchor.createdAt)}` : "记录里的一句"}</span>
            <p>{savedAnchorText}</p>
          </article>
        ) : (
          <p className="helper-text">这条记录还没有单独存过锚点。可以留一句话给之后的自己。</p>
        )}
        {detail.linkedAnchors.length > 1 ? (
          <p className="helper-text">还有 {detail.linkedAnchors.length - 1} 句也和这条记录关联。</p>
        ) : null}
        <label className="field">
          <span className="field-label">一句能托住自己的话</span>
          <textarea
            className="field-textarea"
            value={anchorText}
            rows={3}
            onChange={(event) => setAnchorText(event.target.value)}
            placeholder="例如：我可以先回到事实，再决定下一步。"
          />
        </label>
        <button className="button button--secondary" type="button" onClick={saveRecordAnchor}>
          <BookmarkPlus size={16} strokeWidth={1.8} />
          存为锚点
        </button>
        {anchorMessage ? <p className="helper-text">{anchorMessage}</p> : null}
        {anchorError ? <p className="form-error">{anchorError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>这次让罐子怎么动了</h2>
          <p>这里只显示这条记录当前对应的明细。整理记录后会同步更新，但不会改写发现点和锚点。</p>
        </div>
        {detail.accountRows.length ? (
          <div className="record-impact-list">
            {detail.accountRows.map((row) => (
              <RecordImpactRow key={row.impact.id} row={row} />
            ))}
          </div>
        ) : (
          <p className="helper-text">这条记录没有让储蓄罐变化。没有变化也可以，它仍然保存了当时的线索。</p>
        )}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>这次看见的点</h2>
          <p>从这条记录延伸出来、适合稍后再看的内容。不需要现在想完。</p>
        </div>
        <section className="record-topic-compose" aria-label="从这条记录存一个看见的点">
          <div className="section-heading">
            <h3>存下看见的点</h3>
            <p>先留标题就够了，它会带着这条记录的来源一起进入稍后再看。</p>
          </div>
          <div className="topic-create-mode" role="group" aria-label="保存方式">
            <button
              className="topic-status-button"
              type="button"
              aria-pressed={topicCreateMode === "single"}
              onClick={() => {
                setTopicCreateMode("single");
                setTopicError(null);
                setTopicMessage(null);
                setLatestCreatedTopic(null);
              }}
            >
              存一个
            </button>
            <button
              className="topic-status-button"
              type="button"
              aria-pressed={topicCreateMode === "batch"}
              onClick={() => {
                setTopicCreateMode("batch");
                setTopicError(null);
                setTopicMessage(null);
                setLatestCreatedTopic(null);
              }}
            >
              批量保存
            </button>
          </div>
          {topicCreateMode === "single" ? (
            <>
              <label className="field">
                <span className="field-label">短标题</span>
                <input
                  className="field-input"
                  value={topicTitle}
                  onChange={(event) => setTopicTitle(event.target.value)}
                  placeholder="例如：我想解释很多，是怕被误解"
                />
              </label>
              <ChipGroup
                label="类型"
                options={discoveryPointKindOptions}
                value={topicKind}
                onChange={setTopicKind}
              />
              <ChipGroup
                label="主题，可不选"
                options={discoveryPointThemeOptions}
                value={topicTheme}
                onChange={setTopicTheme}
              />
              <label className="field">
                <span className="field-label">一句备注，可空着</span>
                <textarea
                  className="field-textarea"
                  value={topicNote}
                  rows={2}
                  onChange={(event) => setTopicNote(event.target.value)}
                  placeholder="它为什么被我看见了？"
                />
              </label>
              <label className="field">
                <span className="field-label">想探寻的问题，可空着</span>
                <textarea
                  className="field-textarea"
                  value={topicQuestion}
                  rows={2}
                  onChange={(event) => setTopicQuestion(event.target.value)}
                  placeholder="例如：我在保护什么？"
                />
              </label>
              <button className="button button--secondary" type="button" onClick={saveRecordTopic}>
                <Plus size={16} strokeWidth={1.8} />
                {status === "saving" ? "正在存下" : "存入稍后"}
              </button>
            </>
          ) : (
            <div className="topic-batch page-stack">
              <p className="helper-text">
                一次最多存 {MAX_BATCH_DISCOVERY_POINTS} 个。空白行不会保存，每个点都会带上这条记录的来源。
              </p>
              <div className="topic-batch__rows">
                {batchTopicRows.map((row, index) => (
                  <RecordBatchTopicRow
                    key={row.id}
                    index={index}
                    row={row}
                    canRemove={batchTopicRows.length > 1}
                    onChange={(fields) => updateBatchTopicRow(row.id, fields)}
                    onRemove={() => removeBatchTopicRow(row.id)}
                  />
                ))}
              </div>
              <div className="inline-actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={addBatchTopicRow}
                  disabled={batchTopicRows.length >= MAX_BATCH_DISCOVERY_POINTS}
                >
                  <Plus size={16} strokeWidth={1.8} />
                  再加一个
                </button>
                <button className="button button--secondary" type="button" onClick={saveRecordTopicsBatch}>
                  {status === "saving" ? "正在存下" : "批量存入稍后"}
                </button>
              </div>
            </div>
          )}
          <div className="inline-actions">
            {latestCreatedTopic ? (
              <button
                className="button button--ghost"
                type="button"
                onClick={() => navigate(buildTopicRoute(latestCreatedTopic.id))}
              >
                打开刚存的点
              </button>
            ) : null}
          </div>
          {topicMessage ? <p className="helper-text">{topicMessage}</p> : null}
          {topicError ? <p className="form-error">{topicError}</p> : null}
        </section>
        {detail.linkedTopics.length ? (
          <div className="record-topic-list">
            {detail.linkedTopics.map((point) => (
              <article className="record-topic-card" key={point.id}>
                <div className="record-topic-card__meta">
                  <span>{discoveryPointKindCopy[point.kind]}</span>
                  {point.theme ? <span>{discoveryPointThemeCopy[point.theme]}</span> : null}
                  <strong>{discoveryPointStatusCopy[point.status]}</strong>
                </div>
                <h3>{point.title}</h3>
                {point.note || point.exploreQuestion || point.sourceSnippet ? (
                  <p>{point.note || point.exploreQuestion || point.sourceSnippet}</p>
                ) : null}
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => navigate(buildTopicRoute(point.id))}
                >
                  <Sparkles size={16} strokeWidth={1.8} />
                  打开回看
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="helper-text">这条记录暂时没有关联的发现点。之后可以在稍后再看里继续存。</p>
        )}
      </section>

      <section className="danger-zone page-stack">
        <div className="section-heading">
          <h2>删除这条记录</h2>
          <p>删除后，这条记录和它带来的储蓄罐明细会一起移除。已保存的稍后话题会继续保留。</p>
        </div>
        <button
          className="button button--danger"
          type="button"
          onClick={() => setIsDeleteConfirmOpen(true)}
        >
          <Trash2 size={16} strokeWidth={1.8} />
          删除记录
        </button>
        {deleteError ? <p className="form-error" role="alert">{deleteError}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
      </section>

      {isDeleteConfirmOpen ? (
        <ConfirmDialog
          title="删除这条记录？"
          body="删除后，这条记录和它带来的储蓄罐明细会一起移除；这条记录保存过的锚点也会移除。已保存的稍后话题会保留，并显示来源记录已删除。"
          confirmLabel="删除记录"
          busyLabel="正在删除"
          isBusy={status === "saving"}
          onConfirm={deleteRecord}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      ) : null}
    </section>
  );
}

function getInitialAnchorText(
  episode: Episode,
  latestAnchor: { text: string } | undefined,
): string {
  return (
    latestAnchor?.text.trim() ||
    episode.anchor?.trim() ||
    "我可以先带着这条记录，不急着把它想完。"
  );
}

function RecordImpactRow({ row }: { row: AccountDetailSourceRow }) {
  return (
    <article className="record-impact-row">
      <div className="record-impact-row__top">
        <span>{accountCopy[row.impact.account].label}</span>
        <strong>{formatSignedValue(row.impact.value)}</strong>
      </div>
      <dl>
        <div>
          <dt>原因</dt>
          <dd>{row.impact.reason}</dd>
        </div>
        {row.evidence ? (
          <div>
            <dt>依据</dt>
            <dd>{row.evidence}</dd>
          </div>
        ) : null}
      </dl>
    </article>
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

function RecordBatchTopicRow({
  index,
  row,
  canRemove,
  onChange,
  onRemove,
}: {
  index: number;
  row: BatchTopicRow;
  canRemove: boolean;
  onChange: (fields: Partial<BatchTopicRow>) => void;
  onRemove: () => void;
}) {
  return (
    <article className="topic-batch-row">
      <div className="topic-batch-row__header">
        <strong>看见的点 {index + 1}</strong>
        <button
          className="topic-status-button"
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
        >
          移除
        </button>
      </div>
      <label className="field">
        <span className="field-label">短标题</span>
        <input
          className="field-input"
          value={row.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="例如：语言切换像缓冲"
        />
      </label>
      <ChipGroup
        label="类型"
        options={discoveryPointKindOptions}
        value={row.kind ?? "discovery"}
        onChange={(kind) => onChange({ kind })}
      />
      <ChipGroup
        label="主题，可不选"
        options={discoveryPointThemeOptions}
        value={row.theme}
        onChange={(theme) => onChange({ theme })}
      />
      <label className="field">
        <span className="field-label">一句备注，可空着</span>
        <textarea
          className="field-textarea"
          value={row.note ?? ""}
          onChange={(event) => onChange({ note: event.target.value })}
          rows={2}
          placeholder="它为什么被我看见了？"
        />
      </label>
      <label className="field">
        <span className="field-label">想探寻的问题，可空着</span>
        <textarea
          className="field-textarea"
          value={row.exploreQuestion ?? ""}
          onChange={(event) => onChange({ exploreQuestion: event.target.value })}
          rows={2}
          placeholder="例如：我在保护什么？"
        />
      </label>
    </article>
  );
}

function buildRecordRows(episode: Episode): Array<{ label: string; value: string }> {
  return [
    { label: "事实", value: episode.facts.trim() },
    { label: "解释", value: episode.interpretation.trim() },
    { label: "情绪", value: episode.emotions.join("、") },
    { label: "身体信号", value: episode.bodySensations.join("、") },
    { label: "连接感", value: formatLevel(episode.connectionLevel) },
    { label: "激活程度", value: formatLevel(episode.activationLevel) },
    { label: "下一步", value: getAccountEvidenceCopy(episode.nextAction) },
  ].filter((row) => row.value);
}

function formatLevel(value: ConnectionLevel): string {
  if (value === "not_sure") {
    return "说不清";
  }

  return `${value} / 4`;
}

function parseLevel(value: string): ConnectionLevel | ActivationLevel {
  if (value === "not_sure") {
    return "not_sure";
  }

  const numberValue = Number(value);
  return numberValue >= 0 && numberValue <= 4 ? (numberValue as ConnectionLevel | ActivationLevel) : "not_sure";
}

function normalizeEmotion(value: string | undefined): EmotionChip {
  return emotionOptions.some((option) => option.value === value) ? (value as EmotionChip) : "说不清";
}

function normalizeBody(value: string | undefined): BodyChip {
  return bodyOptions.some((option) => option.value === value) ? (value as BodyChip) : "说不清";
}

function normalizeNextAction(value: string | undefined): NextAction {
  return nextActionOptions.some((option) => option.value === value) ? (value as NextAction) : "not_now";
}

function getEpisodeEvidence(
  episode: Episode | undefined,
  kind: "connection" | "self_contact",
): string {
  if (!episode) return "";

  const reasonCode =
    kind === "connection" ? "observable_connection_evidence" : "self_contact_evidence";
  return episode.accountImpacts.find((impact) => impact.reasonCode === reasonCode)?.evidence ?? "";
}

function getEpisodeEnergyEffect(episode: Episode | undefined): EnergyEffect {
  const energyImpact = episode?.accountImpacts.find((impact) => impact.account === "energy");

  if (energyImpact?.evidence === "lighter" || energyImpact?.evidence === "more_tired") {
    return energyImpact.evidence;
  }

  return "not_sure";
}

function formatSignedValue(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
