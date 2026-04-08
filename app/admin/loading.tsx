import { SkeletonCard, SkeletonTable } from "@/components/admin/ui/AdminSkeleton";
import { Skeleton } from "@/components/admin/ui/AdminSkeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="admin-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {/* Tab bar placeholder */}
      <Skeleton className="mb-6 h-10 w-96 rounded-xl" />

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Secondary stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SkeletonTable rows={5} cols={2} />
        <div className="lg:col-span-2">
          <SkeletonTable rows={5} cols={5} />
        </div>
      </div>
    </div>
  );
}
