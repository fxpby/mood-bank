import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import { privacyCopy } from "../copy/privacy";
import { DEFAULT_SPACE_NAME } from "../domain/defaults";
import { selectActiveSpace } from "../domain/selectors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type SettingsPageProps = {
  navigate: (route: AppRoute) => void;
};

export function SettingsPage({ navigate }: SettingsPageProps) {
  const { state, actions, status, storageStatus, lastSavedAt, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [spaceName, setSpaceName] = useState(activeSpace?.displayName ?? DEFAULT_SPACE_NAME);
  const [spaceDescription, setSpaceDescription] = useState(activeSpace?.description ?? "");
  const [spaceMessage, setSpaceMessage] = useState("");
  const [spaceError, setSpaceError] = useState("");
  const isResetting = status === "resetting";
  const isSaving = status === "saving";

  function handleSpaceSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSpaceMessage("");
    setSpaceError("");

    if (!activeSpace) {
      setSpaceError("现在还没有可以编辑的空间。");
      return;
    }

    const result = actions.updateActiveSpace({
      displayName: spaceName,
      description: spaceDescription,
    });

    if (!result.ok) {
      setSpaceError(result.error ?? "这次还没有保存成功。");
      return;
    }

    if (!result.value) {
      setSpaceError("现在还没有可以编辑的空间。");
      return;
    }

    setSpaceName(result.value.displayName);
    setSpaceDescription(result.value.description);
    setSpaceMessage("空间信息已保存。");
  }

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
          <h2>当前空间</h2>
          <p>这个名称只保存在本机，用来帮你分辨现在观察的是哪段关系或哪部分自己。</p>
        </div>
        {activeSpace ? (
          <form className="settings-space-form page-stack" onSubmit={handleSpaceSubmit}>
            <label className="field">
              <span className="field-label">空间名称</span>
              <input
                className="field-input"
                value={spaceName}
                onChange={(event) => {
                  setSpaceName(event.target.value);
                  setSpaceMessage("");
                  setSpaceError("");
                }}
                aria-describedby="settings-space-name-help"
              />
              <span id="settings-space-name-help" className="helper-text">
                空着会保存为“{DEFAULT_SPACE_NAME}”。
              </span>
            </label>
            <label className="field">
              <span className="field-label">一点点意图，可空着</span>
              <textarea
                className="field-textarea"
                value={spaceDescription}
                onChange={(event) => {
                  setSpaceDescription(event.target.value);
                  setSpaceMessage("");
                  setSpaceError("");
                }}
                placeholder="例如：先看见发生了什么，不急着下结论。"
                rows={3}
              />
            </label>
            <button className="button button--primary" type="submit" disabled={isSaving}>
              {isSaving ? "正在保存" : "保存空间信息"}
            </button>
            {spaceMessage ? <p className="helper-text">{spaceMessage}</p> : null}
            {spaceError ? <p className="form-error" role="alert">{spaceError}</p> : null}
          </form>
        ) : (
          <div className="settings-empty-state">
            <p>现在还没有可以编辑的空间。可以重新完成初始设置，再回到这里调整名称。</p>
            <button className="button button--primary" type="button" onClick={() => navigate("/setup")}>
              回到设置入口
            </button>
          </div>
        )}
      </section>

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

      <section className="subtle-panel page-stack">
        <div className="section-heading">
          <h2>导出 / 导入</h2>
          <p>这个 MVP 版本还没有开放导出或导入。现在的数据只在这个浏览器里，清理浏览器数据后可能无法恢复。</p>
        </div>
        <div className="settings-placeholder-actions" aria-label="导出导入占位">
          <button className="button button--secondary" type="button" disabled>
            导出数据（暂未开放）
          </button>
          <button className="button button--secondary" type="button" disabled>
            导入数据（暂未开放）
          </button>
        </div>
        <p className="helper-text">这里不会创建文件、读取文件或上传任何内容。</p>
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
