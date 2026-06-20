import { Compass, HeartHandshake, NotebookPen, Plus } from "lucide-react";
import { AccountSummaryCard } from "../components/AccountSummaryCard";
import { PageHeader } from "../components/PageHeader";
import { PrimaryActionPanel } from "../components/PrimaryActionPanel";
import {
  selectAccountSummaries,
  selectActiveSpace,
  selectLatestEpisode,
  selectTodayMarketLabel,
  selectTodayMarketNote,
} from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import { buildRecordRoute, type AppRoute, type RouteState } from "../utils/route";

type HomePageProps = {
  navigate: (route: AppRoute, state?: RouteState) => void;
};

export function HomePage({ navigate }: HomePageProps) {
  const { state } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const marketLabel = selectTodayMarketLabel(state);
  const marketNote = selectTodayMarketNote(state);
  const summaries = selectAccountSummaries(state);
  const latestEpisode = selectLatestEpisode(state);
  const latestAnchor = state.anchors[0] ?? null;
  const latestAnchorText = latestAnchor?.text ?? "事实可以很小，结论可以慢一点。";
  const latestAnchorSourceRoute =
    latestAnchor?.sourceType === "episode" && latestAnchor.sourceId
      ? buildRecordRoute(latestAnchor.sourceId)
      : null;

  return (
    <section className="home-page page-stack">
      <PageHeader title="情感储蓄罐" />

      <section className="home-hero" aria-label="当前空间">
        <div className="home-hero__row">
          <h2>{activeSpace?.displayName ?? "某段关系"}</h2>
          <span>{marketLabel}</span>
        </div>
        <p>{marketNote}</p>
      </section>

      <PrimaryActionPanel navigate={navigate} />

      <button className="record-action" type="button" onClick={() => navigate("/record")}>
        <Plus size={19} strokeWidth={1.9} />
        <span>
          <strong>记录互动</strong>
          <small>先存下一个可确认的事实</small>
        </span>
      </button>

      <button
        className="record-action record-action--calibration"
        type="button"
        onClick={() => navigate("/emotion-calibration")}
      >
        <Compass size={19} strokeWidth={1.8} />
        <span>
          <strong>校准一个情绪</strong>
          <small>把情绪当作信使，不急着让它开车</small>
        </span>
      </button>

      <section className="account-preview" aria-labelledby="account-preview-title">
        <div className="section-heading">
          <h2 id="account-preview-title">三个储蓄罐</h2>
          <p>这里先显示最近原因，不给关系下结论。</p>
        </div>
        <div className="account-preview__list">
          {summaries.map((summary) => (
            <AccountSummaryCard key={summary.account} summary={summary} navigate={navigate} />
          ))}
        </div>
      </section>

      {latestEpisode ? (
        <section className="latest-record">
          <span>最近存下</span>
          <h2>{latestEpisode.title}</h2>
          <p>{latestEpisode.facts}</p>
          <button
            className="button button--secondary latest-record__open"
            type="button"
            onClick={() => navigate(buildRecordRoute(latestEpisode.id))}
          >
            <NotebookPen size={16} strokeWidth={1.8} />
            打开详情
          </button>
        </section>
      ) : null}

      <section className="anchor-preview">
        <span>今天的锚点</span>
        <p>{latestAnchorText}</p>
        <div className="anchor-preview__actions">
          <button
            className="button button--primary anchor-preview__return"
            type="button"
            onClick={() => navigate("/return-to-self", { returnToSelfAnchor: latestAnchorText })}
          >
            <HeartHandshake size={16} strokeWidth={1.8} />
            带着这句回到自己
          </button>
          {latestAnchorSourceRoute ? (
            <button
              className="button button--secondary anchor-preview__source"
              type="button"
              onClick={() => navigate(latestAnchorSourceRoute)}
            >
              <NotebookPen size={16} strokeWidth={1.8} />
              打开来源记录
            </button>
          ) : null}
        </div>
      </section>
    </section>
  );
}
