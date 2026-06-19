import { ArrowLeft, BookmarkPlus, NotebookPen, Save, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import {
  discoveryPointKindCopy,
  discoveryPointSourceCopy,
  discoveryPointStatusCopy,
  discoveryPointThemeCopy,
} from "../copy/topics";
import type { DiscoveryPoint, DiscoveryPointStatus } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import { buildRecordRoute, getTopicRouteId, type AppRoute } from "../utils/route";

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

export function TopicDetailPage({ navigate }: TopicDetailPageProps) {
  const { state, actions } = useAppStore();
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

  useEffect(() => {
    const nextReviewNote = point?.note ?? "";
    setReviewNote(nextReviewNote);
    setAnchorText(nextReviewNote || point?.title || "");
    setStatusMessage(null);
    setStatusError(null);
    setReviewMessage(null);
    setReviewError(null);
    setAnchorMessage(null);
    setAnchorError(null);
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
  const sourceRecordRoute =
    point.sourceType === "episode" && point.sourceId ? buildRecordRoute(point.sourceId) : null;

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

      <button className="button button--secondary" type="button" onClick={() => navigate("/topics")}>
        <Sparkles size={16} strokeWidth={1.8} />
        回到稍后
      </button>
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
