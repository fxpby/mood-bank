import { NotebookPen } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { episodeSourceCopy } from "../copy/episodes";
import { selectEpisodesNewestFirst } from "../domain/selectors";
import type { Episode } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import { buildRecordRoute, type AppRoute } from "../utils/route";

type RecordPageProps = {
  navigate: (route: AppRoute) => void;
};

export function RecordPage({ navigate }: RecordPageProps) {
  const { state } = useAppStore();
  const episodes = selectEpisodesNewestFirst(state);

  return (
    <section className="record-page page-stack">
      <PageHeader title="记录" kicker="先存事实和感受，不急着判定关系。" />

      {episodes.length ? (
        <section className="record-list panel">
          <div className="section-heading">
            <h2>已经存下</h2>
            <p>按时间从近到远排列，回看时只看当时留下的事实和感受。</p>
          </div>
          <div className="record-list__items">
            {episodes.map((episode) => (
              <RecordListItem
                key={episode.id}
                episode={episode}
                onOpen={() => navigate(buildRecordRoute(episode.id))}
              />
            ))}
          </div>
          <button className="button button--primary" type="button" onClick={() => navigate("/record/new")}>
            <NotebookPen size={18} strokeWidth={1.8} />
            存下新的记录
          </button>
        </section>
      ) : (
        <section className="record-empty panel">
          <NotebookPen size={24} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>先记录一次互动</h2>
            <p>这里还没有记录。可以先存一个可确认的事实，之后首页会显示最近存下的内容。</p>
          </div>
          <button className="button button--primary" type="button" onClick={() => navigate("/record/new")}>
            开始记录
          </button>
        </section>
      )}
    </section>
  );
}

function RecordListItem({ episode, onOpen }: { episode: Episode; onOpen: () => void }) {
  return (
    <article className="record-list__item">
      <div className="record-list__meta">
        <span>{episodeSourceCopy[episode.source]}</span>
        <time dateTime={episode.createdAt}>{formatDate(episode.createdAt)}</time>
      </div>
      <h3>{episode.title}</h3>
      <p>{getFactsPreview(episode.facts)}</p>
      <button className="button button--secondary" type="button" onClick={onOpen}>
        打开详情
      </button>
    </article>
  );
}

function getFactsPreview(facts: string): string {
  const text = facts.trim();
  if (text.length <= 92) {
    return text;
  }

  return `${text.slice(0, 92)}...`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
