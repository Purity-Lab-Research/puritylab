export default function CoaLoading() {
  return (
    <div className="animate-pulse">
      <div className="mx-4 sm:mx-6 lg:mx-8 my-4 rounded-2xl bg-border h-[140px] md:h-[180px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Batch tracker skeleton */}
        <div className="bg-primary/20 rounded-2xl p-10 max-w-3xl mx-auto mb-16 -mt-8">
          <div className="h-6 w-48 bg-border rounded mx-auto mb-4" />
          <div className="h-4 w-72 bg-border rounded mx-auto mb-6" />
          <div className="h-14 w-full max-w-lg bg-border rounded-xl mx-auto" />
        </div>
        {/* Grid skeleton */}
        <div className="h-6 w-64 bg-border rounded mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-6 space-y-3">
              <div className="h-5 w-3/4 bg-border rounded" />
              <div className="h-3 w-1/3 bg-border rounded" />
              <div className="h-10 w-1/2 bg-border rounded mt-2" />
              <div className="h-3 w-2/3 bg-border rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
