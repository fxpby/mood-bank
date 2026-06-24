import { HeartHandshake } from "lucide-react";
import {
  getBranchActivationContext,
  type BranchActivationContext,
} from "../utils/route";

type BranchActivationNudgeProps = {
  onReturnToSelf: () => void;
  onContinue: () => void;
  continueLabel?: string;
};

const sourceCopy: Record<BranchActivationContext["source"], string> = {
  draft_check: "刚才的自检里，波动已经有点高。",
  signal_check: "刚才的信号检查里，确认冲动已经有点响。",
  emotion_calibration: "刚才的情绪校准里，情绪推力已经有点强。",
  rich_incoming: "刚才整理长消息时，心里已经接住了很多东西。",
  quick_record: "刚才这条记录里，激活程度已经有点高。",
};

export function BranchActivationNudge({
  onReturnToSelf,
  onContinue,
  continueLabel = "我现在能继续看",
}: BranchActivationNudgeProps) {
  const context = getBranchActivationContext(window.history.state);

  if (!context) {
    return null;
  }

  return (
    <aside className="branch-activation-nudge" aria-labelledby="branch-activation-title">
      <span className="branch-activation-nudge__icon" aria-hidden="true">
        <HeartHandshake size={22} strokeWidth={1.8} />
      </span>
      <div className="branch-activation-nudge__copy">
        <h2 id="branch-activation-title">可以先不用继续分析</h2>
        <p>{sourceCopy[context.source]}如果身体还很满，先回到自己，比继续想明白更优先。</p>
      </div>
      <div className="branch-activation-nudge__actions">
        <button className="button button--primary" type="button" onClick={onReturnToSelf}>
          <HeartHandshake size={16} strokeWidth={1.8} />
          先回到自己
        </button>
        <button className="button button--secondary" type="button" onClick={onContinue}>
          {continueLabel}
        </button>
      </div>
    </aside>
  );
}
