import { cn } from "@/utils/cn";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl bg-cream-soft px-6 py-14 text-center",
        className
      )}
    >
      {Icon && <Icon aria-hidden="true" className="h-10 w-10 text-clay" strokeWidth={1.5} />}
      <h3 className="font-heading text-xl font-semibold text-display">{title}</h3>
      {description && <p className="max-w-md font-body text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}