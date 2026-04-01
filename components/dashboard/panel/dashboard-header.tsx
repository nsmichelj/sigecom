import { cn } from "@/lib/utils";

export function DashboardHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-primary/5 p-6 rounded-2xl flex gap-4 flex-col md:flex-row items-start md:items-center md:justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
