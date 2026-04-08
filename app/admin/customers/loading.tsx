import { Skeleton, SkeletonTable } from "@/components/admin/ui/AdminSkeleton";

export default function CustomersLoading() {
  return (
    <div className="admin-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-48 rounded-xl" />
      </div>
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <SkeletonTable rows={10} cols={5} />
    </div>
  );
}
