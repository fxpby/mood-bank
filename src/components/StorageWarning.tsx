import { AlertTriangle } from "lucide-react";
import { errorCopy } from "../copy/errors";
import { useAppStore } from "../store/AppStoreContext";
import type { AppRoute } from "../utils/route";

type StorageWarningProps = {
  navigate: (route: AppRoute) => void;
};

export function StorageWarning({ navigate }: StorageWarningProps) {
  const { status, storageStatus, actions } = useAppStore();

  if (status !== "storage_warning" && status !== "save_error" && status !== "reset_error") {
    return null;
  }

  const copy =
    storageStatus === "unsupported_version"
      ? errorCopy.unsupportedVersion
      : storageStatus === "corrupted"
        ? errorCopy.loadCorrupted
        : status === "reset_error"
          ? errorCopy.resetFailed
          : errorCopy.storageUnavailable;

  return (
    <section className="warning" aria-live="polite">
      <p style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 760 }}>
        <AlertTriangle size={18} strokeWidth={1.8} />
        现在可能无法保存到本地
      </p>
      <p>{copy}</p>
      <div className="chip-row">
        <button className="button button--secondary" type="button" onClick={() => navigate("/settings")}>
          查看设置
        </button>
        {status === "storage_warning" ? (
          <button className="button button--ghost" type="button" onClick={actions.acknowledgeStorageWarning}>
            先继续看
          </button>
        ) : null}
      </div>
    </section>
  );
}
