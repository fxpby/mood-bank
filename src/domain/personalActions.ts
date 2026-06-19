import type { DailyMarket } from "./types";

export type PersonalActionCategory =
  | "lower_activation"
  | "self_kindness"
  | "boundary"
  | "expression"
  | "receiving_care"
  | "delay_checking";

export type PersonalAction = {
  id: string;
  category: PersonalActionCategory;
  label: string;
  helper: string;
  completionMarker: string;
};

export type PersonalActionSet = {
  recommended: PersonalAction;
  alternatives: [PersonalAction, PersonalAction];
};

export const personalActionCategoryCopy: Record<PersonalActionCategory, string> = {
  lower_activation: "先降一点浪",
  self_kindness: "对自己轻一点",
  boundary: "把边界放清楚",
  expression: "表达得更小一点",
  receiving_care: "练习收下照顾",
  delay_checking: "先不把自己交给信号",
};

export const personalActions: PersonalAction[] = [
  {
    id: "drink_water_wash_hands",
    category: "lower_activation",
    label: "喝水或洗手",
    helper: "先让身体知道：我现在不用马上解决全部。",
    completionMarker: "我先照顾了一下身体。",
  },
  {
    id: "five_senses_one_minute",
    category: "lower_activation",
    label: "做一分钟五感观察",
    helper: "找 3 个看见的东西、2 个听见的声音、1 个身体接触点。",
    completionMarker: "我把注意力带回了当下。",
  },
  {
    id: "kind_sentence",
    category: "self_kindness",
    label: "给自己一句不攻击的话",
    helper: "比如：我现在很不安，但这不等于我做错了。",
    completionMarker: "我没有继续攻击自己。",
  },
  {
    id: "inner_judge_name",
    category: "self_kindness",
    label: "写下内部审判者在说什么",
    helper: "只写一句，不急着反驳它。先把它和我分开。",
    completionMarker: "我看见了内部审判者，而不是直接相信它。",
  },
  {
    id: "one_small_boundary",
    category: "boundary",
    label: "写一个小边界",
    helper: "用一句话分清：这是我的部分，那不是我的部分。",
    completionMarker: "我把一点边界放回来了。",
  },
  {
    id: "delay_answer",
    category: "boundary",
    label: "先不立刻答应",
    helper: "给自己一句缓冲：我需要想一下，晚点再回复。",
    completionMarker: "我给自己留了缓冲。",
  },
  {
    id: "one_point_reply",
    category: "expression",
    label: "只保留一个重点",
    helper: "把最想表达的一点留下，其余先放进稍后。",
    completionMarker: "我让表达变小了一点。",
  },
  {
    id: "facts_not_analysis",
    category: "expression",
    label: "只写事实，不分析对方",
    helper: "先写我看见了什么、我感到什么，不替对方下结论。",
    completionMarker: "我把事实和分析分开了一点。",
  },
  {
    id: "receive_before_returning",
    category: "receiving_care",
    label: "先承认我收到了",
    helper: "收到温暖时，先停一下：这句话我收到了。",
    completionMarker: "我允许自己先收下一点照顾。",
  },
  {
    id: "ordinary_care_counts",
    category: "receiving_care",
    label: "存下一件普通的照顾",
    helper: "不需要很戏剧化，小小的稳定也算被看见。",
    completionMarker: "我看见了普通但真实的照顾。",
  },
  {
    id: "phone_down_ten",
    category: "delay_checking",
    label: "把手机扣下 10 分钟",
    helper: "10 分钟后仍然可以决定，现在先把主动权拿回来一点。",
    completionMarker: "我没有马上把自己交给信号。",
  },
  {
    id: "save_draft_first",
    category: "delay_checking",
    label: "先存草稿，不发送",
    helper: "把话放到一个安全位置，等浪小一点再看。",
    completionMarker: "我先存下了草稿，而不是让高浪替我决定。",
  },
];

const recommendedCategoryByMarket: Record<DailyMarket, PersonalActionCategory> = {
  observe: "expression",
  sensitive: "self_kindness",
  triggered: "lower_activation",
  sleep_deprived: "lower_activation",
  low_energy: "lower_activation",
  steady: "receiving_care",
};

const categoryOrder: PersonalActionCategory[] = [
  "lower_activation",
  "self_kindness",
  "boundary",
  "expression",
  "receiving_care",
  "delay_checking",
];

export function getPersonalActionSet(input: {
  market: DailyMarket;
  rotationIndex?: number;
}): PersonalActionSet {
  const rotationIndex = normalizeIndex(input.rotationIndex ?? 0);
  const recommendedCategory = recommendedCategoryByMarket[input.market];
  const recommended = pickFromCategory(recommendedCategory, rotationIndex);
  const alternativeCategories = getAlternativeCategories(recommendedCategory, rotationIndex);
  const alternatives = alternativeCategories.map((category, index) =>
    pickFromCategory(category, rotationIndex + index),
  ) as [PersonalAction, PersonalAction];

  return { recommended, alternatives };
}

export function getNextPersonalActionRotation(currentIndex: number): number {
  return normalizeIndex(currentIndex + 1);
}

function getAlternativeCategories(
  recommendedCategory: PersonalActionCategory,
  rotationIndex: number,
): [PersonalActionCategory, PersonalActionCategory] {
  const ordered = categoryOrder.filter((category) => category !== recommendedCategory);
  const firstIndex = normalizeIndex(rotationIndex) % ordered.length;
  const first = ordered[firstIndex];
  const second = ordered[(firstIndex + 2) % ordered.length];

  return [first, second];
}

function pickFromCategory(category: PersonalActionCategory, rotationIndex: number): PersonalAction {
  const actions = personalActions.filter((action) => action.category === category);
  return actions[normalizeIndex(rotationIndex) % actions.length];
}

function normalizeIndex(value: number): number {
  return Math.abs(Math.trunc(value));
}
