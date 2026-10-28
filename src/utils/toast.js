import { createElement } from "react";
import toast from "react-hot-toast";
import ConfirmToast from "@/components/common/ConfirmToast.jsx";

const base = {
  duration: 3000,
  style: {
    background: "var(--color-surface-card)",
    color: "var(--color-text-body)",
    border: "1px solid var(--color-border-subtle)",
    borderRadius: "12px",
    boxShadow: "var(--shadow-card)",
    padding: "12px 16px",
    fontSize: "0.9rem",
  },
};

export const toastOptions = base;

export const notify = {
  success: (msg) =>
    toast.success(msg, {
      ...base,
      iconTheme: { primary: "#5E8C61", secondary: "#fff" },
    }),

  error: (msg) =>
    toast.error(msg, {
      ...base,
      iconTheme: { primary: "#B3472F", secondary: "#fff" },
    }),

  confirm: (msg, onConfirm) =>
    toast.custom(
      (t) =>
        createElement(ConfirmToast, {
          message: msg,
          onCancel: () => toast.dismiss(t.id),
          onConfirm: () => {
            toast.dismiss(t.id);
            onConfirm?.();
          },
        }),
      { duration: Infinity }
    ),

  loading: (msg) => toast.loading(msg, base),

  dismiss: (id) => toast.dismiss(id),

  promise: (promise, msgs) => toast.promise(promise, msgs, base),
};