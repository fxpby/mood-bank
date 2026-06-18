import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { marketOptions } from "../copy/markets";
import { privacyCopy } from "../copy/privacy";
import { DEFAULT_MARKET, DEFAULT_SPACE_NAME } from "../domain/defaults";
import type { DailyMarket, SpaceType } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type SetupPageProps = {
  navigate: (route: AppRoute) => void;
};

export function SetupPage({ navigate }: SetupPageProps) {
  const { actions, status } = useAppStore();
  const [displayName, setDisplayName] = useState(DEFAULT_SPACE_NAME);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SpaceType>("interpersonal");
  const [dailyMarket, setDailyMarket] = useState<DailyMarket>(DEFAULT_MARKET);
  const [error, setError] = useState("");

  const isSaving = status === "saving";

  function saveSetup(input: {
    displayName: string;
    description: string;
    type: SpaceType;
    dailyMarket: DailyMarket;
  }) {
    setError("");
    const result = actions.completeSetup(input);

    if (result.ok) {
      navigate("/home");
      return;
    }

    setError("这次还没有保存成功。你可以先检查浏览器是否允许本地存储。");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSetup({
      displayName,
      description,
      type,
      dailyMarket,
    });
  }

  function useDefaults() {
    saveSetup({
      displayName: DEFAULT_SPACE_NAME,
      description: "",
      type: "interpersonal",
      dailyMarket: DEFAULT_MARKET,
    });
  }

  return (
    <section className="setup-page page-stack">
      <header className="setup-hero">
        <span className="setup-hero__icon" aria-hidden="true">
          <ShieldCheck size={22} strokeWidth={1.8} />
        </span>
        <h1>情感储蓄罐</h1>
        <p>先建一个只属于你的观察空间。默认设置就可以开始，不需要填真实姓名。</p>
      </header>

      <section className="privacy-panel" aria-labelledby="privacy-title">
        <h2 id="privacy-title">本地优先</h2>
        <ul>
          <li>{privacyCopy.setupLocalNote}</li>
          <li>{privacyCopy.setupDeviceAccessNote}</li>
          <li>{privacyCopy.browserDataRisk}</li>
          <li>{privacyCopy.noExternalAccess}</li>
          <li>{privacyCopy.notTherapy}</li>
        </ul>
      </section>

      <form className="setup-form page-stack" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">这个空间叫什么</span>
          <input
            className="field-input"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            aria-describedby="space-name-help"
          />
          <span id="space-name-help" className="helper-text">
            空着也会使用“某段关系”。
          </span>
        </label>

        <label className="field">
          <span className="field-label">一点点意图，可空着</span>
          <textarea
            className="field-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="例如：先看见发生了什么，不急着下结论。"
          />
        </label>

        <div className="field">
          <span className="field-label">这个空间关于</span>
          <div className="chip-row" role="group" aria-label="空间类型">
            <button
              className="chip"
              type="button"
              aria-pressed={type === "interpersonal"}
              onClick={() => setType("interpersonal")}
            >
              我和别人
            </button>
            <button
              className="chip"
              type="button"
              aria-pressed={type === "self"}
              onClick={() => setType("self")}
            >
              我和自己
            </button>
          </div>
        </div>

        <div className="field">
          <span className="field-label">今天先用哪个状态进入</span>
          <div className="chip-row" role="group" aria-label="今日市场">
            {marketOptions.map((option) => (
              <button
                className="chip"
                key={option.value}
                type="button"
                aria-pressed={dailyMarket === option.value}
                onClick={() => setDailyMarket(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <div className="setup-actions">
          <button className="button button--primary setup-submit" type="submit" disabled={isSaving}>
            {isSaving ? "正在保存" : "开始使用"}
          </button>
          <button
            className="button button--secondary setup-submit"
            type="button"
            onClick={useDefaults}
            disabled={isSaving}
          >
            先用默认设置
          </button>
        </div>
      </form>
    </section>
  );
}
