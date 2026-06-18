import type { DailyMarket } from "../domain/types";

export const marketCopy: Record<DailyMarket, { label: string; note: string }> = {
  observe: {
    label: "先观察",
    note: "今天先存事实，结论可以慢一点。",
  },
  sensitive: {
    label: "有点敏感",
    note: "今天信号可能会被放大，先存下可确认的事。",
  },
  triggered: {
    label: "被触发了",
    note: "现在先不用分析关系，选一个能让你少加重的动作。",
  },
  sleep_deprived: {
    label: "睡少了",
    note: "睡少时信号会更尖锐，先做轻一点的判断。",
  },
  low_energy: {
    label: "能量低",
    note: "今天适合轻动作，不适合反复消耗。",
  },
  steady: {
    label: "比较安稳",
    note: "今天可以收下温暖，也不用急着证明未来。",
  },
};

export const marketOptions = Object.entries(marketCopy).map(([value, copy]) => ({
  value: value as DailyMarket,
  label: copy.label,
}));
