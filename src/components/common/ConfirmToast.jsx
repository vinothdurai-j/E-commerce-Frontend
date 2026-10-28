export default function ConfirmToast({ message, onConfirm, onCancel }) {
  return (
    <div className="w-80 rounded-xl border border-line bg-card p-4 shadow-soft">
      <p className="mb-4 text-sm text-body">{message}</p>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line px-3 py-2 text-sm text-body transition hover:bg-stage"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-terracotta px-3 py-2 text-sm text-white transition hover:opacity-90"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}