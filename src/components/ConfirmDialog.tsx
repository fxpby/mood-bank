type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = "先不删",
  isBusy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
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
          <button className="button button--danger" type="button" onClick={onConfirm} disabled={isBusy}>
            {isBusy ? "正在删除" : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
