import { ArrowLeft, BookmarkPlus, NotebookPen, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { accountCopy, getAccountEvidenceCopy } from "../copy/accounts";
import { episodeSourceCopy } from "../copy/episodes";
import {
  discoveryPointKindCopy,
  discoveryPointStatusCopy,
  discoveryPointThemeCopy,
} from "../copy/topics";
import { selectEpisodeDetail, type AccountDetailSourceRow } from "../domain/selectors";
import type { ConnectionLevel, Episode } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import { buildTopicRoute, getRecordRouteId, type AppRoute } from "../utils/route";

type RecordDetailPageProps = {
  navigate: (route: AppRoute) => void;
};

export function RecordDetailPage({ navigate }: RecordDetailPageProps) {
  const { state, actions } = useAppStore();
  const episodeId = getRecordRouteId(window.location.pathname);
  const detail = useMemo(() => selectEpisodeDetail(state, episodeId), [episodeId, state]);
  const [anchorText, setAnchorText] = useState("");
  const [anchorMessage, setAnchorMessage] = useState<string | null>(null);
  const [anchorError, setAnchorError] = useState<string | null>(null);

  useEffect(() => {
    setAnchorText(detail ? getInitialAnchorText(detail.episode, detail.linkedAnchors[0]) : "");
    setAnchorMessage(null);
    setAnchorError(null);
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
          <p>这里只显示当时已经存下的来源，不重新计算，也不下关系结论。</p>
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
          <p>从这条记录延伸出来、适合稍后再看的内容。</p>
        </div>
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
