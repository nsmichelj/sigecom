import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function Container({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full px-6 md:px-8 max-w-6xl relative mx-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
