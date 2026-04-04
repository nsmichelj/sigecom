import { cn } from "@/lib/utils";

export function DashboardDescription({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground font-light text-lg", className)}
      {...props}
    >
      {children}
    </p>
  );
}
