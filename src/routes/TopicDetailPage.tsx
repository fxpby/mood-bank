import {
  ArrowLeft,
  BookmarkPlus,
  NotebookPen,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import {
  discoveryPointKindCopy,
  discoveryPointSourceCopy,
  discoveryPointStatusCopy,
  discoveryPointThemeCopy,
} from "../copy/topics";
import { buildDiscoveryPointExperimentInput } from "../domain/experiments";
import { selectDiscoveryPointSourceDetail } from "../domain/selectors";
import type {
  DiscoveryPoint,
  DiscoveryPointKind,
  DiscoveryPointStatus,
  DiscoveryPointTheme,
} from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import { buildExperimentRoute, buildRecordRoute, getTopicRouteId, type AppRoute } from "../utils/route";

type TopicDetailPageProps = {
  navigate: (route: AppRoute) => void;
};

const detailStatusActions: Array<{ status: DiscoveryPointStatus; label: string; helper: string }> = [
  {
    status: "reviewed",
    label: "看过一次",
    helper: "我已经回来看过它，不需要现在得出结论。",
  },
  {
    status: "leave_for_now",
    label: "先放着",
    helper: "它还可以继续待在稍后，不急着处理。",
  },
  {
    status: "no_longer_needed",
    label: "不用了",
    helper: "这个点已经不需要占用注意力了。",
  },
];

const discoveryPointKindOptions: DiscoveryPointKind[] = [
  "topic",
  "discovery",
  "question",
  "action_idea",
];

const discoveryPointThemeOptions: DiscoveryPointTheme[] = [
  "emotion",
  "boundary",
  "old_echo",
  "relationship_learning",
  "expression",
  "self_care",
  "action_experiment",
];

export function TopicDetailPage({ navigate }: TopicDetailPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const topicId = getTopicRouteId(window.location.pathname);
  const point = useMemo(
    () => state.topics.find((item) => item.id === topicId),
    [state.topics, topicId],
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [anchorText, setAnchorText] = useState("");
  const [anchorMessage, setAnchorMessage] = useState<string | null>(null);
  const [anchorError, setAnchorError] = useState<string | null>(null);
  const [experimentFocus, setExperimentFocus] = useState("");
  const [experimentTinyAction, setExperimentTinyAction] = useState("");
  const [experimentMarker, setExperimentMarker] = useState("");
  const [experimentError, setExperimentError] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editKind, setEditKind] = useState<DiscoveryPointKind>("discovery");
  const [editTheme, setEditTheme] = useState<DiscoveryPointTheme | "">("");
  const [editNote, setEditNote] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const nextReviewNote = point?.note ?? "";
    const experimentInput = point ? buildDiscoveryPointExperimentInput(point) : null;
    setReviewNote(nextReviewNote);
    setAnchorText(nextReviewNote || point?.title || "");
    setExperimentFocus(experimentInput?.focus ?? "");
    setExperimentTinyAction(experimentInput?.tinyAction ?? "");
    setExperimentMarker(experimentInput?.completionMarker ?? "");
    setEditTitle(point?.title ?? "");
    setEditKind(point?.kind ?? "discovery");
    setEditTheme(point?.theme ?? "");
    setEditNote(nextReviewNote);
    setEditQuestion(point?.exploreQuestion ?? "");
    setStatusMessage(null);
    setStatusError(null);
    setReviewMessage(null);
    setReviewError(null);
    setAnchorMessage(null);
    setAnchorError(null);
    setExperimentError(null);
    setEditMessage(null);
    setEditError(null);
    setIsDeleteConfirmOpen(false);
    setDeleteError(null);
  }, [point?.id]);

  function updateStatus(nextStatus: DiscoveryPointStatus) {
    if (!point) return;

    const result = actions.updateDiscoveryPointStatus({ id: point.id, status: nextStatus });

    if (!result.ok) {
      setStatusError(result.error ?? "这次还没有更新成功。");
      setStatusMessage(null);
      return;
    }

    setStatusError(null);
    setStatusMessage(`已标记为：${discoveryPointStatusCopy[nextStatus]}`);
  }

  function saveReviewNote() {
    if (!point) return;

    const result = actions.updateDiscoveryPointReviewNote({
      id: point.id,
      note: reviewNote,
    });

    if (!result.ok) {
      setReviewError(result.error ?? "这次还没有保存成功，补记还没有写进本机。");
      setReviewMessage(null);
      return;
    }

    const savedNote = result.value?.note ?? "";
    setReviewNote(savedNote);
    setReviewError(null);
    setReviewMessage(
      savedNote
        ? "补记已存下，只更新了这个发现点。"
        : "补记已清空，只更新了这个发现点。",
    );
  }

  function savePointEdit() {
    if (!point) return;

    const result = actions.updateDiscoveryPoint({
      id: point.id,
      title: editTitle,
      kind: editKind,
      theme: editTheme || undefined,
      note: editNote,
      exploreQuestion: editQuestion,
    });

    if (!result.ok) {
      setEditError(result.error ?? "这次还没有保存成功，发现点还没有写进本机。");
      setEditMessage(null);
      return;
    }

    const savedNote = result.value?.note ?? "";
    setEditTitle(result.value?.title ?? (editTitle.trim() || "一个稍后再看的点"));
    setEditKind(result.value?.kind ?? editKind);
    setEditTheme(result.value?.theme ?? "");
    setEditNote(savedNote);
    setReviewNote(savedNote);
    setEditQuestion(result.value?.exploreQuestion ?? "");
    setEditError(null);
    setEditMessage("发现点已更新，只整理了这个点本身。");
  }

  function deletePoint() {
    if (!point) return;

    const result = actions.deleteDiscoveryPoint({ id: point.id });

    if (!result.ok) {
      setDeleteError(result.error ?? "这次没有删除成功，发现点还留在本机。");
      setIsDeleteConfirmOpen(false);
      return;
    }

    setDeleteError(null);
    setIsDeleteConfirmOpen(false);
    navigate("/topics");
  }

  function useReviewNoteAsAnchor() {
    const text = reviewNote.trim();
    if (!text) return;

    setAnchorText(text);
    setAnchorError(null);
    setAnchorMessage("已放到锚点草稿，还没有保存。");
  }

  function saveAnchor() {
    if (!point) return;

    if (!anchorText.trim()) {
      setAnchorError("先留一句能托住自己的话。");
      setAnchorMessage(null);
      return;
    }

    const result = actions.saveAnchor({
      spaceId: point.spaceId,
      text: anchorText,
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

  function saveExperiment() {
    if (!point) return;

    if (!experimentFocus.trim() || !experimentTinyAction.trim() || !experimentMarker.trim()) {
      setExperimentError("先把三个小问题都留一句。");
      return;
    }

    const result = actions.savePersonalExperiment({
      spaceId: point.spaceId,
      focus: experimentFocus,
      tinyAction: experimentTinyAction,
      completionMarker: experimentMarker,
      source: "discovery_point",
      sourceActionId: point.id,
    });

    if (!result.ok) {
      setExperimentError(result.error ?? "这次还没有存下，小练习还没有写进本机。");
      return;
    }

    if (!result.value) {
      setExperimentError("这次还没有存下，小练习还没有写进本机。");
      return;
    }

    setExperimentError(null);
    navigate(buildExperimentRoute(result.value.id));
  }

  if (!point) {
    return (
      <section className="topic-detail-page page-stack">
        <PageHeader
          title="这个点暂时找不到"
          kicker="它可能已经被清理，或这个链接不是现在这只储蓄罐里的内容。"
          onBack={() => navigate("/topics")}
        />
        <section className="topics-empty">
          <h2>回到稍后再看</h2>
          <p>你可以继续查看其他发现点，或重新存一个很小的线索。</p>
          <button className="button button--primary" type="button" onClick={() => navigate("/topics")}>
            <ArrowLeft size={16} strokeWidth={1.8} />
            回到稍后
          </button>
        </section>
      </section>
    );
  }

  const sourceRows = buildSourceRows(point);
  const detailRows = buildDetailRows(point);
  const sourceDetail = selectDiscoveryPointSourceDetail(state, point);
  const sourceRecordRoute =
    sourceDetail.canOpenSourceRecord && point.sourceId ? buildRecordRoute(point.sourceId) : null;

  return (
    <section className="topic-detail-page page-stack">
      <PageHeader
        title="回看一个点"
        kicker="只需要看见一点点，不需要把它马上想完。"
        onBack={() => navigate("/topics")}
      />

      <section className="topic-detail-hero panel">
        <div className="topic-detail-hero__meta">
          <span>{discoveryPointKindCopy[point.kind]}</span>
          {point.theme ? <span>{discoveryPointThemeCopy[point.theme]}</span> : null}
          <span>{discoveryPointSourceCopy[point.sourceType]}</span>
        </div>
        <h1>{point.title}</h1>
        <div className="topic-detail-hero__status">
          <strong>{discoveryPointStatusCopy[point.status]}</strong>
          <span>存于 {formatDate(point.createdAt)}</span>
        </div>
      </section>

      {sourceRows.length ? (
        <section className="panel page-stack">
          <div className="section-heading">
            <h2>它从哪里来</h2>
            <p>这里只保留当时存下的上下文，不反推对方心理。</p>
          </div>
          <div className="topic-detail-facts">
            {sourceRows.map((row) => (
              <div key={row.label}>
                <span>{row.label}</span>
                <p>{row.value}</p>
              </div>
            ))}
          </div>
          {sourceDetail.isDeletedEpisodeSource ? (
            <p className="source-missing-note">来源记录已删除。这个点会继续保留在稍后再看里。</p>
          ) : null}
          {sourceRecordRoute ? (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => navigate(sourceRecordRoute)}
            >
              <NotebookPen size={16} strokeWidth={1.8} />
              打开来源记录
            </button>
          ) : null}
        </section>
      ) : null}

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>整理这个点</h2>
          <p>只修改稍后再看里的文字和分类，不会改来源记录、小练习或储蓄罐明细。</p>
        </div>
        <label className="field">
          <span className="field-label">标题</span>
          <input
            className="field-input"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            placeholder="一个稍后再看的点"
          />
        </label>
        <div className="topic-detail-edit-grid">
          <label className="field">
            <span className="field-label">类型</span>
            <select
              className="field-input"
              value={editKind}
              onChange={(event) => setEditKind(event.target.value as DiscoveryPointKind)}
            >
              {discoveryPointKindOptions.map((kind) => (
                <option key={kind} value={kind}>
                  {discoveryPointKindCopy[kind]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">主题，可空着</span>
            <select
              className="field-input"
              value={editTheme}
              onChange={(event) =>
                setEditTheme(event.target.value ? (event.target.value as DiscoveryPointTheme) : "")
              }
            >
              <option value="">暂不分类</option>
              {discoveryPointThemeOptions.map((theme) => (
                <option key={theme} value={theme}>
                  {discoveryPointThemeCopy[theme]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span className="field-label">备注，可空着</span>
          <textarea
            className="field-textarea"
            value={editNote}
            rows={4}
            onChange={(event) => setEditNote(event.target.value)}
            placeholder="例如：这个点提醒我先慢一点。"
          />
        </label>
        <label className="field">
          <span className="field-label">想探寻的问题，可空着</span>
          <textarea
            className="field-textarea"
            value={editQuestion}
            rows={3}
            onChange={(event) => setEditQuestion(event.target.value)}
            placeholder="例如：我现在真正想保护什么？"
          />
        </label>
        <button className="button button--primary" type="button" onClick={savePointEdit}>
          <Pencil size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在存下" : "存下整理"}
        </button>
        {editMessage ? <p className="helper-text">{editMessage}</p> : null}
        {editError ? <p className="form-error">{editError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>这次看见了什么</h2>
          <p>可以只停在原来的文字上。回看不是复盘考试。</p>
        </div>
        {detailRows.length ? (
          <div className="topic-detail-facts">
            {detailRows.map((row) => (
              <div key={row.label}>
                <span>{row.label}</span>
                <p>{row.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="helper-text">这个点只留下了标题。标题本身也已经够用。</p>
        )}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>转成小练习</h2>
          <p>如果这个点已经指向一个动作，可以把它存成今天能试一次的小练习。</p>
        </div>
        <label className="field">
          <span className="field-label">我想练习什么</span>
          <input
            className="field-input"
            value={experimentFocus}
            onChange={(event) => setExperimentFocus(event.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">小到今天能试一次的动作</span>
          <input
            className="field-input"
            value={experimentTinyAction}
            onChange={(event) => setExperimentTinyAction(event.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">什么算练习过一次</span>
          <input
            className="field-input"
            value={experimentMarker}
            onChange={(event) => setExperimentMarker(event.target.value)}
          />
        </label>
        <button className="button button--primary" type="button" onClick={saveExperiment}>
          <Plus size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在存下" : "存成小练习"}
        </button>
        <p className="helper-text">创建小练习本身不会改变储蓄罐；只有之后记录一次练习，才可能产生透明影响。</p>
        {experimentError ? <p className="form-error">{experimentError}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>回看补记</h2>
          <p>把这次多看见的一点留在这个点里，不需要写完整。</p>
        </div>
        <label className="field">
          <span className="field-label">一点新的看见，可空着</span>
          <textarea
            className="field-textarea"
            value={reviewNote}
            rows={4}
            onChange={(event) => setReviewNote(event.target.value)}
            placeholder="例如：我现在发现，这个点其实是在提醒我慢一点。"
          />
        </label>
        <button className="button button--primary" type="button" onClick={saveReviewNote}>
          <Save size={16} strokeWidth={1.8} />
          存下补记
        </button>
        {reviewMessage ? <p className="helper-text">{reviewMessage}</p> : null}
        {reviewMessage && reviewNote.trim() ? (
          <button className="button button--secondary" type="button" onClick={useReviewNoteAsAnchor}>
            <BookmarkPlus size={16} strokeWidth={1.8} />
            放到锚点草稿
          </button>
        ) : null}
        {reviewError ? <p className="form-error">{reviewError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>保存为锚点</h2>
          <p>如果有一句话想之后带在身边，可以单独存成锚点。</p>
        </div>
        <label className="field">
          <span className="field-label">一句能托住自己的话</span>
          <textarea
            className="field-textarea"
            value={anchorText}
            rows={3}
            onChange={(event) => setAnchorText(event.target.value)}
            placeholder="例如：我可以先回到自己，再决定下一步。"
          />
        </label>
        <button className="button button--secondary" type="button" onClick={saveAnchor}>
          <BookmarkPlus size={16} strokeWidth={1.8} />
          保存为锚点
        </button>
        {anchorMessage ? <p className="helper-text">{anchorMessage}</p> : null}
        {anchorMessage ? (
          <button className="button button--secondary" type="button" onClick={() => navigate("/home")}>
            <Sparkles size={16} strokeWidth={1.8} />
            回到首页看锚点
          </button>
        ) : null}
        {anchorError ? <p className="form-error">{anchorError}</p> : null}
      </section>

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>现在怎么放它</h2>
          <p>只改这个点的状态，不会改变任何账户明细。</p>
        </div>
        <div className="topic-detail-actions">
          {detailStatusActions.map((action) => (
            <button
              className="topic-detail-action"
              type="button"
              aria-pressed={point.status === action.status}
              key={action.status}
              onClick={() => updateStatus(action.status)}
            >
              <strong>{action.label}</strong>
              <span>{action.helper}</span>
            </button>
          ))}
        </div>
        {statusMessage ? <p className="helper-text">{statusMessage}</p> : null}
        {statusError ? <p className="form-error">{statusError}</p> : null}
      </section>

      <section className="danger-zone page-stack">
        <div className="section-heading">
          <h2>移出稍后再看</h2>
          <p>只删除这个发现点。来源记录、已保存的锚点和已经创建的小练习都会保留。</p>
        </div>
        <button
          className="button button--danger"
          type="button"
          onClick={() => setIsDeleteConfirmOpen(true)}
        >
          <Trash2 size={16} strokeWidth={1.8} />
          删除这个发现点
        </button>
        {deleteError ? <p className="form-error" role="alert">{deleteError}</p> : null}
      </section>

      <button className="button button--secondary" type="button" onClick={() => navigate("/topics")}>
        <Sparkles size={16} strokeWidth={1.8} />
        回到稍后
      </button>

      {isDeleteConfirmOpen ? (
        <ConfirmDialog
          title="删除这个发现点？"
          body="删除后，它只会从“稍后再看”里移除。来源记录、锚点、已经创建的小练习和储蓄罐明细都会保留。"
          confirmLabel="删除发现点"
          busyLabel="正在删除"
          isBusy={status === "saving"}
          onConfirm={deletePoint}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      ) : null}
    </section>
  );
}

function buildSourceRows(point: DiscoveryPoint): Array<{ label: string; value: string }> {
  return [
    { label: "来源标题", value: point.sourceTitle?.trim() ?? "" },
    { label: "来源片段", value: point.sourceSnippet?.trim() ?? "" },
  ].filter((row) => row.value);
}

function buildDetailRows(point: DiscoveryPoint): Array<{ label: string; value: string }> {
  return [
    { label: "备注", value: point.note?.trim() ?? "" },
    { label: "想探寻的问题", value: point.exploreQuestion?.trim() ?? "" },
    { label: "最近更新", value: formatDate(point.updatedAt) },
  ].filter((row) => row.value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
