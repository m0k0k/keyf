"use client";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-background animate-pulse rounded-md", className)}
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
          <div className={cn("bg-background absolute inset-0", className)} />

          <Skeleton className={cn("absolute inset-0", className)} />
        </>
      )}
    </div>
  );
}
