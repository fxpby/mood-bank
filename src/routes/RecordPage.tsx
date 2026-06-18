import { NotebookPen } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { selectLatestEpisode } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type RecordPageProps = {
  navigate: (route: AppRoute) => void;
};

export function RecordPage({ navigate }: RecordPageProps) {
  const { state } = useAppStore();
  const latestEpisode = selectLatestEpisode(state);

  return (
    <section className="record-page page-stack">
      <PageHeader title="记录" kicker="先存事实和感受，不急着判定关系。" />

      {latestEpisode ? (
        <section className="record-list panel">
          <div className="section-heading">
            <h2>最近存下</h2>
            <p>这里只显示最近一条，完整列表下一阶段支持。</p>
          </div>
          <article className="record-list__item">
            <span>{latestEpisode.source === "trigger_support" ? "来自触发" : "快速记录"}</span>
            <h3>{latestEpisode.title}</h3>
            <p>{latestEpisode.facts}</p>
          </article>
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
