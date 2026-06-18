import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import { privacyCopy } from "../copy/privacy";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type SettingsPageProps = {
  navigate: (route: AppRoute) => void;
};

export function SettingsPage({ navigate }: SettingsPageProps) {
  const { actions, status, storageStatus, lastSavedAt, lastError } = useAppStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const isResetting = status === "resetting";

  function handleReset() {
    const result = actions.resetLocalData();

    if (result.ok) {
      setIsConfirmOpen(false);
      navigate("/setup");
      return;
    }

    setResetMessage(privacyCopy.resetFailed);
  }

  return (
    <section className="settings-page page-stack">
      <PageHeader title="设置" kicker="本地数据、隐私边界和删除入口。" />

      <section className="panel page-stack">
        <div className="section-heading">
          <h2>本地保存</h2>
          <p>{privacyCopy.setupLocalNote}</p>
        </div>
        <ul className="settings-list">
          <li>{privacyCopy.setupDeviceAccessNote}</li>
          <li>{privacyCopy.browserDataRisk}</li>
          <li>{privacyCopy.noExternalAccess}</li>
          <li>{privacyCopy.notTherapy}</li>
        </ul>
      </section>

      <section className="subtle-panel page-stack">
        <div className="section-heading">
          <h2>存储状态</h2>
          <p>当前状态：{storageStatusLabel(storageStatus)}</p>
        </div>
        {lastSavedAt ? <p className="meta-text">最近一次保存：{formatTime(lastSavedAt)}</p> : null}
        {lastError ? <p className="form-error">最近错误：{lastError}</p> : null}
      </section>

      <section className="danger-zone page-stack">
        <div className="section-heading">
          <h2>删除本地数据</h2>
          <p>删除只影响这个浏览器里的本地数据。应用不会发起远程删除。</p>
        </div>
        <button className="button button--danger" type="button" onClick={() => setIsConfirmOpen(true)}>
          删除本地数据
        </button>
        {resetMessage ? <p className="form-error" role="alert">{resetMessage}</p> : null}
      </section>

      {isConfirmOpen ? (
        <ConfirmDialog
          title={privacyCopy.resetConfirmTitle}
          body={privacyCopy.resetConfirmBody}
          confirmLabel="删除本地数据"
          isBusy={isResetting}
          onConfirm={handleReset}
          onCancel={() => setIsConfirmOpen(false)}
        />
      ) : null}
    </section>
  );
}

function storageStatusLabel(status: string): string {
  if (status === "available") return "可以保存到本地";
  if (status === "corrupted") return "本地数据暂时无法读取";
  if (status === "unsupported_version") return "当前版本不能读取这份数据";
  return "可能无法保存";
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
