import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...rest }: DivProps) {
  return <div className={cn("rounded-lg border border-grey-200 bg-paper", className)} {...rest} />;
}
export function CardHeader({ className, ...rest }: DivProps) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...rest} />;
}
export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-ink", className)} {...rest} />;
}
export function CardBody({ className, ...rest }: DivProps) {
  return <div className={cn("p-5 text-sm text-grey-700", className)} {...rest} />;
}
export function CardFooter({ className, ...rest }: DivProps) {
  return <div className={cn("flex items-center gap-2 border-t border-grey-200 p-5", className)} {...rest} />;
}
