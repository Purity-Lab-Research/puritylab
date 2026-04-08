import { Skeleton, SkeletonTable } from "@/components/admin/ui/AdminSkeleton";

export default function OrdersLoading() {
  return (
    <div className="admin-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Filter pills */}
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>

      <SkeletonTable rows={10} cols={7} />
    </div>
  );
}
