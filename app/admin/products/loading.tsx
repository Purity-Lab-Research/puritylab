import { Skeleton, SkeletonTable } from "@/components/admin/ui/AdminSkeleton";

export default function ProductsLoading() {
  return (
    <div className="admin-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <SkeletonTable rows={8} cols={6} />
    </div>
  );
}
