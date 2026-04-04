import { cn } from "@/lib/utils";

export function DashboardHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DashboardHeaderContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-1 relative", className)} {...props}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full hidden md:block" />
      <div className="ms-0 md:ms-6">{children}</div>
    </div>
  );
}

export function DashboardHeaderActions({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
