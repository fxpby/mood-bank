import { useEffect, useMemo, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { CompletionCard } from "../components/CompletionCard";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { StepScreen } from "../components/StepScreen";
import { accountReasonCopy } from "../copy/accounts";
import { anchorsCopy } from "../copy/anchors";
import { selectActiveSpace } from "../domain/selectors";
import type { EnergyEffect, ReturnToSelfCompletion } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type ReturnToSelfPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "body" | "anchor" | "life" | "energy" | "completion";
type BodyAction = "drink_water" | "wash_face" | "feet_ground" | "slow_breath" | "five_senses";
type ReturnToLifeAction =
  | "stop_analyzing"
  | "make_warm_drink"
  | "take_shower"
  | "put_phone_down"
  | "one_small_task";

const bodyOptions: ChipOption<BodyAction>[] = [
  { value: "drink_water", label: "喝水" },
  { value: "wash_face", label: "洗手/洗脸" },
  { value: "feet_ground", label: "脚踩地面" },
  { value: "slow_breath", label: "慢慢呼气" },
  { value: "five_senses", label: "五感观察" },
];

const lifeOptions: ChipOption<ReturnToLifeAction>[] = [
  { value: "stop_analyzing", label: "先停止分析" },
  { value: "make_warm_drink", label: "泡一杯喝的" },
  { value: "take_shower", label: "洗澡" },
  { value: "put_phone_down", label: "手机放远一点" },
  { value: "one_small_task", label: "做一件小事" },
];

const energyOptions: ChipOption<EnergyEffect>[] = [
  { value: "lighter", label: "轻一点" },
  { value: "same", label: "差不多" },
  { value: "more_tired", label: "更重" },
  { value: "not_sure", label: "说不清" },
];

const stepOrder: StepId[] = ["body", "anchor", "life", "energy", "completion"];

export function ReturnToSelfPage({ navigate }: ReturnToSelfPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [routeAnchor] = useState(() => getReturnToSelfAnchor());
  const [step, setStep] = useState<StepId>("body");
  const [bodyAction, setBodyAction] = useState<BodyAction | undefined>();
  const [anchor, setAnchor] = useState(routeAnchor ?? anchorsCopy.return_then_decide);
  const [anchorSaved, setAnchorSaved] = useState(false);
  const [returnToLifeAction, setReturnToLifeAction] = useState<ReturnToLifeAction | undefined>();
  const [energyEffect, setEnergyEffect] = useState<EnergyEffect>("not_sure");
  const [completion, setCompletion] = useState<ReturnToSelfCompletion | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (routeAnchor) {
      clearReturnToSelfAnchorState();
    }
  }, [routeAnchor]);

  const anchorOptions = useMemo(() => {
    const savedAnchors = state.anchors.slice(0, 3).map((item) => item.text);
    return Array.from(
      new Set([
        ...(routeAnchor ? [routeAnchor] : []),
        ...savedAnchors,
        anchorsCopy.return_then_decide,
        anchorsCopy.facts_slow_conclusion,
        "少加重一点，也是一种回到自己。",
      ]),
    );
  }, [routeAnchor, state.anchors]);

  function goNext() {
    const currentIndex = stepOrder.indexOf(step);
    setStep(stepOrder[Math.min(currentIndex + 1, stepOrder.length - 1)]);
  }

  function goBack() {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex <= 0) {
      navigate("/home");
      return;
    }

    setStep(stepOrder[currentIndex - 1]);
  }

  function savePractice(nextCompletion: ReturnToSelfCompletion) {
    if (!activeSpace) {
      setSaveError("还没有可以保存的空间。");
      return;
    }

    const result = actions.saveReturnToSelfPractice({
      spaceId: activeSpace.id,
      completion: nextCompletion,
      bodyAction: bodyAction ? getBodyLabel(bodyAction) : undefined,
      anchor,
      anchorSaved,
      returnToLifeAction: returnToLifeAction ? getLifeLabel(returnToLifeAction) : undefined,
      energyEffect: nextCompletion === "full" ? energyEffect : undefined,
    });

    if (!result.ok) {
      setSaveError(result.error ?? "这次还没有存下。");
      return;
    }

    setSaveError(null);
    setCompletion(nextCompletion);
    setStep("completion");
  }

  if (step === "body") {
    return (
      <StepScreen
        eyebrow="1/4 回到自己"
        title="先让身体有一个落点"
        helper="不用把情绪处理好，先做一个不会加重的小动作。"
        primaryLabel={bodyAction ? "继续" : "我只是需要暂停"}
        onPrimary={() => (bodyAction ? goNext() : savePractice("noticed_need"))}
        secondaryLabel={bodyAction ? "只保存这个动作" : undefined}
        onSecondary={bodyAction ? () => savePractice("body_only") : undefined}
        tertiaryLabel="回到首页"
        onTertiary={() => navigate("/home")}
      >
        <ChipGroup
          label="选一个身体动作"
          helper="选最容易做的，不选最正确的。"
          options={bodyOptions}
          value={bodyAction}
          onChange={setBodyAction}
        />
        {saveError ? <p className="form-error">{saveError}</p> : null}
      </StepScreen>
    );
  }

  if (step === "anchor") {
    return (
      <StepScreen
        eyebrow="2/4 回到自己"
        title="带一句不会逼你的锚点"
        helper="这句话不是保证未来，只是帮你把注意力带回此刻。"
        primaryLabel="带着这句继续"
        onPrimary={goNext}
        secondaryLabel="只保存我需要暂停"
        onSecondary={() => savePractice("noticed_need")}
        tertiaryLabel="跳过"
        onTertiary={goNext}
        onBack={goBack}
      >
        <div className="anchor-options">
          {anchorOptions.map((item) => (
            <button
              className="anchor-option"
              type="button"
              aria-pressed={anchor === item}
              key={item}
              onClick={() => setAnchor(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="field">
          <span className="field-label">也可以改成自己的话</span>
          <textarea
            className="field-textarea"
            value={anchor}
            onChange={(event) => setAnchor(event.target.value)}
            rows={3}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={anchorSaved}
            onChange={(event) => setAnchorSaved(event.target.checked)}
          />
          <span>保存为锚点</span>
        </label>
        {saveError ? <p className="form-error">{saveError}</p> : null}
      </StepScreen>
    );
  }

  if (step === "life") {
    return (
      <StepScreen
        eyebrow="3/4 回到自己"
        title="回到一个现实动作"
        helper="选轻一点的，不选最正确的。"
        primaryLabel="继续"
        onPrimary={goNext}
        secondaryLabel="只保存我需要暂停"
        onSecondary={() => savePractice("noticed_need")}
        tertiaryLabel="跳过"
        onTertiary={goNext}
        onBack={goBack}
      >
        <ChipGroup
          label="下一步"
          options={lifeOptions}
          value={returnToLifeAction}
          onChange={setReturnToLifeAction}
        />
        {saveError ? <p className="form-error">{saveError}</p> : null}
      </StepScreen>
    );
  }

  if (step === "energy") {
    return (
      <StepScreen
        eyebrow="4/4 回到自己"
        title="现在能量有什么变化"
        helper="更重也可以先被看见。完成不是必须感觉变好。"
        primaryLabel={status === "saving" ? "正在存下" : "完成并存下"}
        onPrimary={() => savePractice("full")}
        secondaryLabel="只保存我需要暂停"
        onSecondary={() => savePractice("noticed_need")}
        onBack={goBack}
      >
        <ChipGroup
          label="能量变化"
          options={energyOptions}
          value={energyEffect}
          onChange={setEnergyEffect}
        />
        {energyEffect === "more_tired" ? (
          <p className="helper-text">更重也可以先被看见。现在不适合继续深挖。</p>
        ) : null}
        {saveError ? <p className="form-error">{saveError}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
      </StepScreen>
    );
  }

  return (
    <section className="return-page page-stack">
      <CompletionCard
        title="已经存下一个回到自己的动作"
        body="这次只进入自己和能量储蓄罐，不会被算作连接证据。"
        rows={[
          { label: "自己", value: getCompletionReason(completion) },
          { label: "能量", value: getEnergyReason(completion, energyEffect) },
          { label: "连接", value: "这次不创建连接影响。" },
        ]}
      >
        <button className="button button--primary" type="button" onClick={() => navigate("/home")}>
          回到首页
        </button>
        <button className="button button--secondary" type="button" onClick={() => setStep("body")}>
          再做一次
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/self-compassion")}>
          自我关怀一下
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/rich-incoming")}>
          <MessageSquareText size={16} strokeWidth={1.8} />
          我收到很多内容，不知道怎么接
        </button>
      </CompletionCard>
    </section>
  );
}

function getBodyLabel(value: BodyAction): string {
  return bodyOptions.find((option) => option.value === value)?.label ?? value;
}

function getLifeLabel(value: ReturnToLifeAction): string {
  return lifeOptions.find((option) => option.value === value)?.label ?? value;
}

function getCompletionReason(completion: ReturnToSelfCompletion | null): string {
  return completion === "full"
    ? accountReasonCopy.return_to_self_completed
    : accountReasonCopy.return_to_self_partial_pause;
}

function getEnergyReason(
  completion: ReturnToSelfCompletion | null,
  energyEffectValue: EnergyEffect,
): string {
  if (completion !== "full") {
    return "这次没有单独保存能量变化。";
  }

  if (energyEffectValue === "lighter") {
    return accountReasonCopy.energy_restored;
  }

  if (energyEffectValue === "more_tired") {
    return accountReasonCopy.energy_depleted;
  }

  return accountReasonCopy.energy_neutral;
}

function getReturnToSelfAnchor(): string | undefined {
  const routeState = window.history.state as { returnToSelfAnchor?: unknown } | null;
  const anchor = routeState?.returnToSelfAnchor;
  if (typeof anchor !== "string") {
    return undefined;
  }

  const trimmedAnchor = anchor.trim();
  return trimmedAnchor.length > 0 ? trimmedAnchor : undefined;
}

function clearReturnToSelfAnchorState() {
  const routeState = window.history.state as Record<string, unknown> | null;
  if (!routeState || typeof routeState !== "object") {
    return;
  }

  const nextState = { ...routeState };
  delete nextState.returnToSelfAnchor;
  window.history.replaceState(nextState, "", window.location.href);
}
