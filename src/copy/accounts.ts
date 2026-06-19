import type { AccountId, AccountImpactReasonCode } from "../domain/types";

export const accountCopy: Record<
  AccountId,
  { label: string; empty: string; positive: string; reminder: string }
> = {
  connection: {
    label: "连接",
    empty: "还没有连接证据。",
    positive: "有真实接触，也有不确定。",
    reminder: "连接记录不是未来保证。",
  },
  self: {
    label: "自己",
    empty: "从一个小动作开始。",
    positive: "你有几次把自己带回来。",
    reminder: "这里记录选择和边界，不是你够不够好。",
  },
  energy: {
    label: "能量",
    empty: "先观察什么消耗你，什么恢复你。",
    positive: "有一些动作在帮你恢复。",
    reminder: "能量低不是失败，只是需要换轻一点。",
  },
};

export const accountReasonCopy: Record<AccountImpactReasonCode, string> = {
  observable_connection_evidence: "有一条可观察的被看见/真实接触证据。",
  self_contact_evidence: "你和自己的感受/需要有了一点真实接触。",
  fact_interpretation_split: "你把事实和解释分开了。",
  owned_next_action: "你选择了一个由自己能完成的下一步。",
  trigger_owned_action: "你在被触发时选了一个自己的动作。",
  return_to_self_completed: "你完成了一个回到自己的动作。",
  return_to_self_partial_pause: "你看见自己需要停一下，并保存了这一点。",
  energy_restored: "这个动作让你感觉轻了一点。",
  energy_depleted: "这次让你明显消耗。",
  energy_neutral: "能量变化不明显。",
  no_connection_evidence: "这次还没有单独的连接证据。",
};

const accountEvidenceCopy = {
  delay_10_min: "晚点再回",
  save_draft_do_not_send: "先存下，不发送",
  record_facts: "记录事实",
  not_now: "暂时没有",
  save_later_topic: "保存一个话题",
  five_senses: "五感观察",
  drink_water_wash_hands: "喝水或洗手",
  reply_one_point: "只回应一个点",
  no_extra_message: "先不补发",
  return_to_self: "回到自己",
  save_quick_record: "存成快速记录",
  full: "完成整段回到自己",
  body_only: "先照顾了身体",
  noticed_need: "看见自己需要停一下",
  lighter: "轻一点",
  more_tired: "更重",
} as const satisfies Record<string, string>;

export function getAccountEvidenceCopy(evidence: string): string {
  return accountEvidenceCopy[evidence as keyof typeof accountEvidenceCopy] ?? evidence;
}
