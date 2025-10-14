"use client";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-background animate-pulse", className)}
      {...props}
    />
  );
}

export { Skeleton };

export function WithSkeleton({
  children,
  className,
  isLoading,
  ...props
}: React.ComponentProps<"div"> & {
  isLoading?: boolean;
}) {
  const mounted = useMounted();

  return (
    <div className={cn("relative w-fit", className)} {...props}>
      {children}

      {(!mounted || isLoading) && (
        <>
          <div className={cn("absolute inset-0 bg-neutral-400", className)} />

          <Skeleton className={cn("absolute inset-0", className)} />
        </>
      )}
    </div>
  );
}
