import { Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { PageHeader } from "../components/PageHeader";
import {
  discoveryPointKindCopy,
  discoveryPointSourceCopy,
  discoveryPointStatusCopy,
  discoveryPointThemeCopy,
} from "../copy/topics";
import type {
  DiscoveryPoint,
  DiscoveryPointKind,
  DiscoveryPointStatus,
  DiscoveryPointTheme,
} from "../domain/types";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import { buildTopicRoute, type AppRoute } from "../utils/route";

type TopicsPageProps = {
  navigate: (route: AppRoute) => void;
};

type TopicFilter =
  | "all"
  | "discovery"
  | "want_to_understand"
  | "want_to_share"
  | "leave_for_now"
  | "reviewed"
  | "no_longer_needed";

const filterOptions: ChipOption<TopicFilter>[] = [
  { value: "all", label: "全部" },
  { value: "discovery", label: "发现点" },
  { value: "want_to_understand", label: "想理解" },
  { value: "want_to_share", label: "想分享" },
  { value: "leave_for_now", label: "先放着" },
  { value: "reviewed", label: "已回看" },
  { value: "no_longer_needed", label: "不用了" },
];

const kindOptions: ChipOption<DiscoveryPointKind>[] = [
  { value: "discovery", label: discoveryPointKindCopy.discovery },
  { value: "topic", label: discoveryPointKindCopy.topic },
  { value: "question", label: discoveryPointKindCopy.question },
  { value: "action_idea", label: discoveryPointKindCopy.action_idea },
];

const themeOptions: ChipOption<DiscoveryPointTheme>[] = [
  { value: "emotion", label: discoveryPointThemeCopy.emotion },
  { value: "boundary", label: discoveryPointThemeCopy.boundary },
  { value: "old_echo", label: discoveryPointThemeCopy.old_echo },
  { value: "relationship_learning", label: discoveryPointThemeCopy.relationship_learning },
  { value: "expression", label: discoveryPointThemeCopy.expression },
  { value: "self_care", label: discoveryPointThemeCopy.self_care },
  { value: "action_experiment", label: discoveryPointThemeCopy.action_experiment },
];

const rowStatusActions: Array<{ status: DiscoveryPointStatus; label: string }> = [
  { status: "want_to_understand", label: "想理解" },
  { status: "want_to_share", label: "想分享" },
  { status: "leave_for_now", label: "先放着" },
  { status: "reviewed", label: "看过一次" },
  { status: "no_longer_needed", label: "不用了" },
];

export function TopicsPage({ navigate }: TopicsPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [filter, setFilter] = useState<TopicFilter>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<DiscoveryPointKind>("discovery");
  const [theme, setTheme] = useState<DiscoveryPointTheme | undefined>();
  const [note, setNote] = useState("");
  const [exploreQuestion, setExploreQuestion] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredTopics = useMemo(
    () => state.topics.filter((point) => matchesFilter(point, filter)),
    [filter, state.topics],
  );

  function savePoint() {
    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      return;
    }

    if (!title.trim()) {
      setError("先给这个点一个很短的名字。");
      return;
    }

    const result = actions.saveDiscoveryPoint({
      spaceId: activeSpace.id,
      title,
      kind,
      theme,
      note,
      exploreQuestion,
    });

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setTitle("");
    setKind("discovery");
    setTheme(undefined);
    setNote("");
    setExploreQuestion("");
    setError(null);
    setMessage("已存入稍后，可以之后再看。");
    setIsCreating(false);
  }

  function updateStatus(point: DiscoveryPoint, nextStatus: DiscoveryPointStatus) {
    const result = actions.updateDiscoveryPointStatus({ id: point.id, status: nextStatus });

    if (!result.ok) {
      setError(result.error ?? "这次还没有更新成功。");
      setMessage(null);
      return;
    }

    setError(null);
    setMessage(`已标记为：${discoveryPointStatusCopy[nextStatus]}`);
  }

  return (
    <section className="topics-page page-stack">
      <PageHeader title="稍后再看" kicker="这里存放还不需要马上想完的点。" />

      <section className="topics-toolbar panel">
        <div className="section-heading">
          <h2>不用现在处理完</h2>
          <p>先存标题就够了。之后想看时，再慢慢理解。</p>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={() => {
            setIsCreating((value) => !value);
            setError(null);
            setMessage(null);
          }}
        >
          {isCreating ? <RotateCcw size={17} strokeWidth={1.8} /> : <Plus size={17} strokeWidth={1.8} />}
          {isCreating ? "先收起" : "存一个发现点"}
        </button>
      </section>

      {isCreating ? (
        <section className="topic-compose panel page-stack">
          <div className="section-heading">
            <h2>这次看见了什么</h2>
            <p>只写一个点也可以，不需要现在分析完整。</p>
          </div>
          <label className="field">
            <span className="field-label">短标题</span>
            <input
              className="field-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：语言切换像缓冲"
            />
          </label>
          <ChipGroup label="类型" options={kindOptions} value={kind} onChange={setKind} />
          <ChipGroup
            label="主题，可不选"
            options={themeOptions}
            value={theme}
            onChange={setTheme}
          />
          <label className="field">
            <span className="field-label">一句备注，可空着</span>
            <textarea
              className="field-textarea"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              placeholder="它为什么被我看见了？"
            />
          </label>
          <label className="field">
            <span className="field-label">想探寻的问题，可空着</span>
            <textarea
              className="field-textarea"
              value={exploreQuestion}
              onChange={(event) => setExploreQuestion(event.target.value)}
              rows={2}
              placeholder="例如：我在夜里反复想保护什么？"
            />
          </label>
          <button className="button button--primary" type="button" onClick={savePoint}>
            {status === "saving" ? "正在存下" : "存入稍后"}
          </button>
        </section>
      ) : null}

      <section className="panel page-stack">
        <ChipGroup label="筛选" options={filterOptions} value={filter} onChange={setFilter} />

        {message ? <p className="helper-text">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}

        {filteredTopics.length ? (
          <div className="topic-list">
            {filteredTopics.map((point) => (
              <DiscoveryPointRow
                key={point.id}
                point={point}
                onStatusChange={(nextStatus) => updateStatus(point, nextStatus)}
                onOpen={() => navigate(buildTopicRoute(point.id))}
              />
            ))}
          </div>
        ) : (
          <div className="topics-empty">
            <h2>{state.topics.length ? "这个筛选下暂时没有内容" : "先存一个很小的发现点"}</h2>
            <p>
              {state.topics.length
                ? "可以切回全部，或先让这个点继续放着。"
                : "比如一句话、一个问题、一个以后想理解的线索。"}
            </p>
            <button className="button button--secondary" type="button" onClick={() => navigate("/record")}>
              去记录一次
            </button>
          </div>
        )}
      </section>
    </section>
  );
}

function DiscoveryPointRow({
  point,
  onStatusChange,
  onOpen,
}: {
  point: DiscoveryPoint;
  onStatusChange: (status: DiscoveryPointStatus) => void;
  onOpen: () => void;
}) {
  const description = point.note || point.exploreQuestion || point.sourceSnippet;

  return (
    <article className="topic-card">
      <div className="topic-card__meta">
        <span>{discoveryPointKindCopy[point.kind]}</span>
        {point.theme ? <span>{discoveryPointThemeCopy[point.theme]}</span> : null}
        <span>{discoveryPointSourceCopy[point.sourceType]}</span>
      </div>
      <h2>{point.title}</h2>
      {description ? <p>{description}</p> : null}
      <div className="topic-card__status">
        <strong>{discoveryPointStatusCopy[point.status]}</strong>
        <time dateTime={point.createdAt}>{formatDate(point.createdAt)}</time>
      </div>
      <div className="topic-card__actions" aria-label={`${point.title} 状态`}>
        <button className="topic-status-button" type="button" onClick={onOpen}>
          打开回看
        </button>
        {rowStatusActions.map((action) => (
          <button
            className="topic-status-button"
            type="button"
            aria-pressed={point.status === action.status}
            key={action.status}
            onClick={() => onStatusChange(action.status)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function matchesFilter(point: DiscoveryPoint, filter: TopicFilter): boolean {
  if (filter === "all") return true;
  if (filter === "discovery") return point.kind === "discovery";
  if (filter === "reviewed") return point.status === "reviewed" || point.status === "naturally_reached";
  return point.status === filter;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
