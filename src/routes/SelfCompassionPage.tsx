import { HeartHandshake, NotebookPen, Save, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ChipGroup, type ChipOption } from "../components/ChipGroup";
import { CompletionCard } from "../components/CompletionCard";
import { PageHeader } from "../components/PageHeader";
import { StepScreen } from "../components/StepScreen";
import { SupportBoundaryCard } from "../components/SupportBoundaryCard";
import {
  buildSelfCompassionDiscoveryPointInput,
  getSelfCompassionSummary,
  selfCompassionNextActionCopy,
  selfCompassionPainCopy,
  selfCompassionReminderCopy,
  selfKindnessActionCopy,
  type SelfCompassionInput,
  type SelfCompassionNextAction,
  type SelfCompassionPain,
  type SelfCompassionReminder,
  type SelfKindnessAction,
} from "../domain/selfCompassion";
import { getSupportBoundaryKind } from "../domain/safety";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type SelfCompassionPageProps = {
  navigate: (route: AppRoute) => void;
};

type StepId = "gate" | "pain" | "humanity" | "rewrite" | "kindness" | "nextAction" | "completion";

const painOptions: ChipOption<SelfCompassionPain>[] = [
  { value: "hard", label: selfCompassionPainCopy.hard },
  { value: "shame", label: selfCompassionPainCopy.shame },
  { value: "self_blame", label: selfCompassionPainCopy.self_blame },
  { value: "too_much", label: selfCompassionPainCopy.too_much },
  { value: "not_enough", label: selfCompassionPainCopy.not_enough },
  { value: "perfectionism", label: selfCompassionPainCopy.perfectionism },
  { value: "noticed_not_done", label: selfCompassionPainCopy.noticed_not_done },
  { value: "not_sure", label: selfCompassionPainCopy.not_sure },
];

const reminderOptions: ChipOption<SelfCompassionReminder>[] = [
  { value: "need_not_bad", label: selfCompassionReminderCopy.need_not_bad },
  { value: "one_miss_not_identity", label: selfCompassionReminderCopy.one_miss_not_identity },
  { value: "shame_not_fact", label: selfCompassionReminderCopy.shame_not_fact },
  { value: "many_people_struggle", label: selfCompassionReminderCopy.many_people_struggle },
  { value: "responsible_no_attack", label: selfCompassionReminderCopy.responsible_no_attack },
  { value: "just_read", label: selfCompassionReminderCopy.just_read },
];

const kindnessOptions: ChipOption<SelfKindnessAction>[] = [
  { value: "hand_chest", label: selfKindnessActionCopy.hand_chest },
  { value: "warm_palm_arm", label: selfKindnessActionCopy.warm_palm_arm },
  { value: "self_hug", label: selfKindnessActionCopy.self_hug },
  { value: "soften_jaw_shoulders", label: selfKindnessActionCopy.soften_jaw_shoulders },
  { value: "slow_exhale", label: selfKindnessActionCopy.slow_exhale },
  { value: "drink_water", label: selfKindnessActionCopy.drink_water },
  { value: "non_attack_sentence", label: selfKindnessActionCopy.non_attack_sentence },
  { value: "self_appreciation", label: selfKindnessActionCopy.self_appreciation },
  { value: "return_to_self", label: selfKindnessActionCopy.return_to_self },
];

const nextActionOptions: ChipOption<SelfCompassionNextAction>[] = [
  { value: "do_not_send", label: selfCompassionNextActionCopy.do_not_send },
  { value: "save_draft", label: selfCompassionNextActionCopy.save_draft },
  { value: "stabilize_before_repair", label: selfCompassionNextActionCopy.stabilize_before_repair },
  { value: "one_small_action", label: selfCompassionNextActionCopy.one_small_action },
  { value: "save_discovery", label: selfCompassionNextActionCopy.save_discovery },
  { value: "boundary_clarity", label: selfCompassionNextActionCopy.boundary_clarity },
  { value: "return_to_self", label: selfCompassionNextActionCopy.return_to_self },
  { value: "rest_ten_min", label: selfCompassionNextActionCopy.rest_ten_min },
  { value: "stop_self_attack", label: selfCompassionNextActionCopy.stop_self_attack },
];

export function SelfCompassionPage({ navigate }: SelfCompassionPageProps) {
  const { state, actions, status, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [step, setStep] = useState<StepId>("gate");
  const [pain, setPain] = useState<SelfCompassionPain>("self_blame");
  const [painText, setPainText] = useState("");
  const [reminder, setReminder] = useState<SelfCompassionReminder>("responsible_no_attack");
  const [criticSentence, setCriticSentence] = useState("");
  const [caringRewrite, setCaringRewrite] = useState("");
  const [kindnessAction, setKindnessAction] = useState<SelfKindnessAction>("non_attack_sentence");
  const [nextAction, setNextAction] = useState<SelfCompassionNextAction>("stop_self_attack");
  const [hasSaved, setHasSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useMemo<SelfCompassionInput>(
    () => ({
      spaceId: activeSpace?.id ?? "",
      pain,
      painText,
      reminder,
      criticSentence,
      caringRewrite,
      kindnessAction,
      nextAction,
    }),
    [
      activeSpace?.id,
      caringRewrite,
      criticSentence,
      kindnessAction,
      nextAction,
      pain,
      painText,
      reminder,
    ],
  );
  const summary = getSelfCompassionSummary(input);
  const supportBoundaryKind = getSupportBoundaryKind({
    selected: [pain, kindnessAction, nextAction],
    overwhelmValues: ["shame", "self_blame", "too_much", "return_to_self", "rest_ten_min"],
  });

  function resetSaveState() {
    setHasSaved(false);
    setMessage(null);
    setError(null);
  }

  function goBack() {
    setMessage(null);
    setError(null);

    if (step === "gate") {
      navigate("/home");
      return;
    }

    setStep(getPreviousStep(step));
  }

  function saveDiscoveryPoint() {
    if (hasSaved) {
      setMessage("这个发现点已经存进稍后。");
      setError(null);
      return;
    }

    if (!activeSpace) {
      setError("还没有可以保存的空间。");
      setMessage(null);
      return;
    }

    const result = actions.saveDiscoveryPoint(buildSelfCompassionDiscoveryPointInput(input));

    if (!result.ok) {
      setError(result.error ?? "这次还没有存下。");
      setMessage(null);
      return;
    }

    setHasSaved(true);
    setError(null);
    setMessage("已存为发现点。储蓄罐没有因为这次保存而变化。");
  }

  if (step === "gate") {
    return (
      <section className="self-compassion-page page-stack">
        <PageHeader
          title="自我关怀暂停"
          kicker="不是给自己打分，也不是跳过责任，只是先停止攻击自己。"
          onBack={goBack}
        />
        <section className="self-compassion-landing panel page-stack">
          <Sparkles size={26} strokeWidth={1.8} />
          <div className="section-heading">
            <h2>这很难，可以先被看见</h2>
            <p>
              这里不做自尊评分，也不要求你立刻变积极。先承认痛苦，再选一个不伤害自己的回应。
            </p>
          </div>
          <div className="self-compassion-note">
            <span>三句话</span>
            <p>这很难。痛苦、需要和不完美是人类经验的一部分。此刻我能怎样对自己温柔一点？</p>
          </div>
          <div className="self-compassion-actions">
            <button className="button button--primary" type="button" onClick={() => setStep("pain")}>
              轻轻暂停一下
            </button>
            <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
              <HeartHandshake size={16} strokeWidth={1.8} />
              先回到自己
            </button>
            <button className="button button--ghost" type="button" onClick={() => navigate("/home")}>
              现在不想关怀自己
            </button>
          </div>
        </section>
      </section>
    );
  }

  if (step === "pain") {
    return (
      <StepScreen
        eyebrow="1/5 静观"
        title="先看见：这很难"
        helper="不用把痛苦讲完整，只先承认它在。"
        primaryLabel="继续"
        onPrimary={() => setStep("humanity")}
        onBack={goBack}
      >
        <ChipGroup
          label="我现在看见"
          options={painOptions}
          value={pain}
          onChange={(value) => {
            setPain(value);
            resetSaveState();
          }}
        />
        <label className="field">
          <span className="field-label">我现在看见的痛苦是，可空着</span>
          <textarea
            className="field-textarea self-compassion-textarea"
            value={painText}
            onChange={(event) => {
              setPainText(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我很怕自己又做得不够好。"
            rows={4}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "humanity") {
    return (
      <StepScreen
        eyebrow="2/5 共通人性"
        title="这不是只有我会有的时刻"
        helper="痛苦、需要、不完美和失误，都是人类经验的一部分。"
        primaryLabel="继续"
        onPrimary={() => setStep("rewrite")}
        onBack={goBack}
      >
        <ChipGroup
          label="选一句提醒"
          options={reminderOptions}
          value={reminder}
          onChange={(value) => {
            setReminder(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "rewrite") {
    return (
      <StepScreen
        eyebrow="3/5 严厉声音"
        title="把严厉的话改成不伤害我的话"
        helper="可以空着。目标不是漂亮，而是既诚实又不攻击自己。"
        primaryLabel="继续"
        onPrimary={() => setStep("kindness")}
        onBack={goBack}
      >
        <label className="field">
          <span className="field-label">严厉的声音在说，可空着</span>
          <textarea
            className="field-textarea self-compassion-textarea"
            value={criticSentence}
            onChange={(event) => {
              setCriticSentence(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我是不是太麻烦了。"
            rows={3}
          />
        </label>
        <label className="field">
          <span className="field-label">不伤害我的回应，可空着</span>
          <textarea
            className="field-textarea self-compassion-textarea"
            value={caringRewrite}
            onChange={(event) => {
              setCaringRewrite(event.target.value);
              resetSaveState();
            }}
            placeholder="例如：我确实害怕，但不用攻击自己来证明认真。"
            rows={3}
          />
        </label>
      </StepScreen>
    );
  }

  if (step === "kindness") {
    return (
      <StepScreen
        eyebrow="4/5 善待自己"
        title="此刻我能怎样对自己温柔一点？"
        helper="只选一个舒服的小动作。任何身体动作都可以跳过。"
        primaryLabel="继续"
        onPrimary={() => setStep("nextAction")}
        onBack={goBack}
      >
        <ChipGroup
          label="我可以"
          options={kindnessOptions}
          value={kindnessAction}
          onChange={(value) => {
            setKindnessAction(value);
            resetSaveState();
          }}
        />
      </StepScreen>
    );
  }

  if (step === "nextAction") {
    return (
      <StepScreen
        eyebrow="5/5 负责的一步"
        title="温柔之后，我负责的一小步是什么？"
        helper="自我关怀不是逃避责任，是少一点攻击地行动。"
        primaryLabel="看总结"
        onPrimary={() => setStep("completion")}
        onBack={goBack}
      >
        <ChipGroup
          label="下一小步"
          options={nextActionOptions}
          value={nextAction}
          onChange={(value) => {
            setNextAction(value);
            resetSaveState();
          }}
        />
        {supportBoundaryKind ? (
          <SupportBoundaryCard
            kind={supportBoundaryKind}
            onReturnToSelf={() => navigate("/return-to-self")}
          />
        ) : null}
      </StepScreen>
    );
  }

  return (
    <section className="self-compassion-page page-stack">
      <CompletionCard
        title="这一步先够了"
        body="你不需要立刻变好。少一点攻击，已经是在把自己接回来。"
        rows={[
          { label: "我看见的痛苦", value: summary.pain },
          { label: "此刻具体是", value: summary.painText },
          { label: "我选择的提醒", value: summary.reminder },
          { label: "严厉声音", value: summary.criticSentence },
          { label: "不伤害我的回应", value: summary.caringRewrite },
          { label: "善待自己的动作", value: summary.kindnessAction },
          { label: "我负责的一小步", value: summary.nextAction },
        ]}
      >
        {supportBoundaryKind ? (
          <SupportBoundaryCard
            kind={supportBoundaryKind}
            onReturnToSelf={() => navigate("/return-to-self")}
          />
        ) : null}
        {message ? <p className="helper-text">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {lastError && status === "save_error" ? <p className="form-error">{lastError}</p> : null}
        <button className="button button--secondary" type="button" onClick={saveDiscoveryPoint}>
          <Save size={16} strokeWidth={1.8} />
          {status === "saving" ? "正在存下" : "存为发现点"}
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/boundary-clarity")}>
          回到边界清晰
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/record/new")}>
          <NotebookPen size={16} strokeWidth={1.8} />
          记录一下
        </button>
        <button className="button button--secondary" type="button" onClick={() => navigate("/return-to-self")}>
          <HeartHandshake size={16} strokeWidth={1.8} />
          回到自己
        </button>
        <button className="button button--primary" type="button" onClick={() => navigate("/home")}>
          完成
        </button>
      </CompletionCard>
    </section>
  );
}

function getPreviousStep(step: StepId): StepId {
  if (step === "pain") return "gate";
  if (step === "humanity") return "pain";
  if (step === "rewrite") return "humanity";
  if (step === "kindness") return "rewrite";
  if (step === "nextAction") return "kindness";
  if (step === "completion") return "nextAction";
  return "gate";
}
