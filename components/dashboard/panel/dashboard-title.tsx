import { cn } from "@/lib/utils";

export function DashboardTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-2xl md:text-3xl tracking-tight font-bold text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
