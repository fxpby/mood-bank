import { useRef, useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import { privacyCopy } from "../copy/privacy";
import { DEFAULT_SPACE_NAME } from "../domain/defaults";
import {
  buildLocalDataExportFileName,
  getLocalDataSummary,
  parseLocalDataImport,
  serializeLocalData,
  type LocalDataSummary,
} from "../domain/localDataTransfer";
import { selectActiveSpace } from "../domain/selectors";
import type { AppState } from "../domain/types";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type SettingsPageProps = {
  navigate: (route: AppRoute) => void;
};

export function SettingsPage({ navigate }: SettingsPageProps) {
  const { state, actions, status, storageStatus, lastSavedAt, lastError } = useAppStore();
  const activeSpace = selectActiveSpace(state);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<{
    state: AppState;
    fileName: string;
    summary: LocalDataSummary;
  } | null>(null);
  const [resetMessage, setResetMessage] = useState("");
  const [spaceName, setSpaceName] = useState(activeSpace?.displayName ?? DEFAULT_SPACE_NAME);
  const [spaceDescription, setSpaceDescription] = useState(activeSpace?.description ?? "");
  const [spaceMessage, setSpaceMessage] = useState("");
  const [spaceError, setSpaceError] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [transferError, setTransferError] = useState("");
  const isResetting = status === "resetting";
  const isSaving = status === "saving";
  const isWritingLocalData = status === "saving";

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

  function handleExport() {
    setTransferMessage("");
    setTransferError("");

    const blob = new Blob([serializeLocalData(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = buildLocalDataExportFileName();

    link.href = url;
    link.download = fileName;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setTransferMessage(`已准备下载 ${fileName}。这份文件只保存在你选择的位置。`);
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    setTransferMessage("");
    setTransferError("");
    setPendingImport(null);

    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseLocalDataImport(text);

      if (!parsed.ok) {
        setTransferError(getImportErrorCopy(parsed.reason));
        return;
      }

      setPendingImport({
        state: parsed.state,
        fileName: file.name,
        summary: getLocalDataSummary(parsed.state),
      });
    } catch {
      setTransferError("没有成功读取这个文件。请确认浏览器允许读取你选择的本地文件。");
    }
  }

  function handleConfirmImport() {
    if (!pendingImport) {
      return;
    }

    const result = actions.replaceLocalData(pendingImport.state);

    if (!result.ok) {
      setTransferError(result.error ?? "这次没有成功导入。当前本地数据没有被替换。");
      setPendingImport(null);
      return;
    }

    setSpaceName(selectActiveSpace(pendingImport.state)?.displayName ?? DEFAULT_SPACE_NAME);
    setSpaceDescription(selectActiveSpace(pendingImport.state)?.description ?? "");
    setTransferMessage(`已从 ${pendingImport.fileName} 导入本地数据。`);
    setPendingImport(null);
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
          <p>可以把当前浏览器里的本地数据保存成 JSON 文件，也可以从之前导出的文件恢复。文件可能包含私密记录，请只放在你信任的位置。</p>
        </div>
        <div className="settings-transfer-actions" aria-label="导出导入本地文件">
          <button className="button button--secondary" type="button" onClick={handleExport}>
            导出本地数据
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => importInputRef.current?.click()}
            disabled={isWritingLocalData}
          >
            导入本地数据
          </button>
        </div>
        <input
          ref={importInputRef}
          className="settings-file-input"
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            void handleImportFile(event);
          }}
        />
        <p className="helper-text">导入会在你确认后替换当前浏览器里的本地数据；不会上传文件，也不会合并两份数据。</p>
        {transferMessage ? <p className="helper-text" role="status">{transferMessage}</p> : null}
        {transferError ? <p className="form-error" role="alert">{transferError}</p> : null}
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
          busyLabel="正在删除"
          isBusy={isResetting}
          onConfirm={handleReset}
          onCancel={() => setIsConfirmOpen(false)}
        />
      ) : null}
      {pendingImport ? (
        <ConfirmDialog
          title="导入这份本地数据？"
          body={`将从 ${pendingImport.fileName} 替换当前浏览器里的数据：${formatImportSummary(pendingImport.summary)}。这不会上传文件，也不会保留当前数据的另一份副本。`}
          confirmLabel="确认导入"
          cancelLabel="先不导入"
          busyLabel="正在导入"
          confirmVariant="primary"
          isBusy={isWritingLocalData}
          onConfirm={handleConfirmImport}
          onCancel={() => setPendingImport(null)}
        />
      ) : null}
    </section>
  );
}

function getImportErrorCopy(reason: string): string {
  if (reason === "invalid_json") return "这个文件不是可读取的 JSON，本地数据没有被替换。";
  if (reason === "unsupported_version") return "这个文件来自更高版本，当前应用还不能导入。";
  return "这个文件不像情感储蓄罐的本地数据，本地数据没有被替换。";
}

function formatImportSummary(summary: LocalDataSummary): string {
  return [
    `${summary.spaces} 个空间`,
    `${summary.episodes} 条记录`,
    `${summary.topics} 个发现点`,
    `${summary.experiments} 个小练习`,
    `${summary.anchors} 个锚点`,
  ].join("、");
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
