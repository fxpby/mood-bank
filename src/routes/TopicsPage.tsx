import { Plus, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { PageHeader } from "../components/PageHeader";
import {
  discoveryPointKindCopy,
  discoveryPointSourceCopy,
  discoveryPointStatusCopy,
  discoveryPointThemeCopy,
} from "../copy/topics";
import {
  filterDiscoveryPoints,
  type TopicFilters,
  type TopicKindFilter,
  type TopicSourceFilter,
  type TopicStatusFilter,
  type TopicThemeFilter,
} from "../domain/topics";
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

const kindFilterOptions: ChipOption<TopicKindFilter>[] = [
  { value: "all", label: "全部类型" },
  { value: "topic", label: discoveryPointKindCopy.topic },
  { value: "discovery", label: discoveryPointKindCopy.discovery },
  { value: "question", label: discoveryPointKindCopy.question },
  { value: "action_idea", label: discoveryPointKindCopy.action_idea },
];

const statusFilterOptions: ChipOption<TopicStatusFilter>[] = [
  { value: "all", label: "全部状态" },
  { value: "want_to_understand", label: "想理解" },
  { value: "want_to_share", label: "想分享" },
  { value: "leave_for_now", label: "先放着" },
  { value: "reviewed", label: "已回看" },
  { value: "no_longer_needed", label: "不用了" },
];

const themeFilterOptions: ChipOption<TopicThemeFilter>[] = [
  { value: "all", label: "全部主题" },
  { value: "emotion", label: discoveryPointThemeCopy.emotion },
  { value: "boundary", label: discoveryPointThemeCopy.boundary },
  { value: "old_echo", label: discoveryPointThemeCopy.old_echo },
  { value: "relationship_learning", label: discoveryPointThemeCopy.relationship_learning },
  { value: "expression", label: discoveryPointThemeCopy.expression },
  { value: "self_care", label: discoveryPointThemeCopy.self_care },
  { value: "action_experiment", label: discoveryPointThemeCopy.action_experiment },
];

const sourceFilterOptions: ChipOption<TopicSourceFilter>[] = [
  { value: "all", label: "全部来源" },
  { value: "manual", label: discoveryPointSourceCopy.manual },
  { value: "episode", label: discoveryPointSourceCopy.episode },
  { value: "return_to_self", label: discoveryPointSourceCopy.return_to_self },
  { value: "trigger", label: discoveryPointSourceCopy.trigger },
  { value: "draft_check", label: discoveryPointSourceCopy.draft_check },
  { value: "rich_incoming", label: discoveryPointSourceCopy.rich_incoming },
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
  const [filters, setFilters] = useState<TopicFilters>({
    kind: "all",
    status: "all",
    theme: "all",
    source: "all",
    query: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<DiscoveryPointKind>("discovery");
  const [theme, setTheme] = useState<DiscoveryPointTheme | undefined>();
  const [note, setNote] = useState("");
  const [exploreQuestion, setExploreQuestion] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latestCreatedPoint, setLatestCreatedPoint] = useState<DiscoveryPoint | null>(null);

  const filteredTopics = useMemo(
    () => filterDiscoveryPoints(state.topics, filters),
    [filters, state.topics],
  );
  const hasSearchQuery = Boolean(filters.query?.trim());
  const hasFacetFilters =
    filters.kind !== "all" ||
    filters.status !== "all" ||
    filters.theme !== "all" ||
    filters.source !== "all";

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
      setLatestCreatedPoint(null);
      return;
    }

    setTitle("");
    setKind("discovery");
    setTheme(undefined);
    setNote("");
    setExploreQuestion("");
    setError(null);
    setMessage("已存入稍后，可以之后再看。");
    setLatestCreatedPoint(result.value ?? null);
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
            setLatestCreatedPoint(null);
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
        <div className="topic-filter-grid">
          <label className="topic-search field">
            <span className="field-label">搜索已存下的点</span>
            <span className="topic-search__control">
              <Search size={17} strokeWidth={1.8} aria-hidden="true" />
              <input
                className="field-input"
                value={filters.query ?? ""}
                onChange={(event) => setFilters((value) => ({ ...value, query: event.target.value }))}
                placeholder="搜标题、备注、问题或来源片段"
              />
              {hasSearchQuery ? (
                <button
                  className="topic-search__clear"
                  type="button"
                  aria-label="清空搜索"
                  onClick={() => setFilters((value) => ({ ...value, query: "" }))}
                >
                  <X size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
              ) : null}
            </span>
          </label>
          <ChipGroup
            label="类型"
            options={kindFilterOptions}
            value={filters.kind}
            onChange={(kind) => setFilters((value) => ({ ...value, kind }))}
          />
          <ChipGroup
            label="状态"
            options={statusFilterOptions}
            value={filters.status}
            onChange={(status) => setFilters((value) => ({ ...value, status }))}
          />
          <ChipGroup
            label="主题"
            options={themeFilterOptions}
            value={filters.theme}
            onChange={(theme) => setFilters((value) => ({ ...value, theme }))}
          />
          <ChipGroup
            label="来源"
            options={sourceFilterOptions}
            value={filters.source}
            onChange={(source) => setFilters((value) => ({ ...value, source }))}
          />
        </div>

        {message ? (
          <div className="topic-feedback">
            <p className="helper-text">{message}</p>
            {latestCreatedPoint ? (
              <button
                className="button button--secondary"
                type="button"
                onClick={() => navigate(buildTopicRoute(latestCreatedPoint.id))}
              >
                打开刚存的点
              </button>
            ) : null}
          </div>
        ) : null}
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
            <h2>{getEmptyTitle(state.topics.length, hasSearchQuery)}</h2>
            <p>
              {getEmptyDescription(state.topics.length, hasSearchQuery)}
            </p>
            {state.topics.length ? (
              <div className="topics-empty__actions">
                {hasSearchQuery ? (
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => setFilters((value) => ({ ...value, query: "" }))}
                  >
                    清空搜索
                  </button>
                ) : null}
                {hasFacetFilters ? (
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() =>
                      setFilters((value) => ({
                        ...value,
                        kind: "all",
                        status: "all",
                        theme: "all",
                        source: "all",
                      }))
                    }
                  >
                    清空筛选
                  </button>
                ) : null}
              </div>
            ) : (
              <button className="button button--secondary" type="button" onClick={() => navigate("/record")}>
                去记录一次
              </button>
            )}
          </div>
        )}
      </section>
    </section>
  );
}

function getEmptyTitle(topicCount: number, hasSearchQuery: boolean): string {
  if (!topicCount) {
    return "先存一个很小的发现点";
  }

  return hasSearchQuery ? "没有找到这个词相关的点" : "这个筛选下暂时没有内容";
}

function getEmptyDescription(topicCount: number, hasSearchQuery: boolean): string {
  if (!topicCount) {
    return "比如一句话、一个问题、一个以后想理解的线索。";
  }

  if (hasSearchQuery) {
    return "可以换一个词，或清空搜索再慢慢翻看。没找到不代表这个点不重要。";
  }

  return "可以换一个筛选组合，或先让这些点继续安静放着。";
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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
