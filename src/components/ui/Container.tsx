import { createElement } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return createElement(
    as,
    { className: cn("mx-auto w-full max-w-[1440px] px-[var(--grid-margin)]", className) },
    children
  );
}
