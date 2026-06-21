type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  busyLabel?: string;
  isBusy?: boolean;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = "先不删",
  busyLabel,
  isBusy = false,
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmClassName = confirmVariant === "primary" ? "button button--primary" : "button button--danger";

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{body}</p>
        <div className="dialog__actions">
          <button className="button button--secondary" type="button" onClick={onCancel} disabled={isBusy}>
            {cancelLabel}
          </button>
          <button className={confirmClassName} type="button" onClick={onConfirm} disabled={isBusy}>
            {isBusy ? (busyLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
