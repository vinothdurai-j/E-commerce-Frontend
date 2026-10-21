import { cn } from "@/utils/cn";

export default function Button({ children, className, variant = "primary", ...props }) {
  const styles = {
    primary: "bg-pill text-inverse hover:bg-terracotta",
    outline: "border border-line-card text-display hover:border-terracotta hover:text-terracotta",
  };

  return (
    <button
      className={cn(
        "rounded-full px-5 py-2 text-sm font-medium transition duration-200",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}