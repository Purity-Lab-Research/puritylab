export default function ProtocolsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mx-4 sm:mx-6 lg:mx-8 my-4 rounded-2xl bg-border h-[140px] md:h-[180px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-lg bg-border" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden bg-surface">
              <div className="p-8 space-y-3">
                <div className="h-1 w-8 bg-border rounded" />
                <div className="h-5 w-3/4 bg-border rounded" />
                <div className="h-3 w-full bg-border rounded" />
              </div>
              <div className="px-8 pb-4 space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-3 w-2/3 bg-border rounded" />
                ))}
              </div>
              <div className="p-8 border-t border-border space-y-3">
                <div className="h-8 w-1/3 bg-border rounded" />
                <div className="h-10 w-full bg-border rounded-lg" />
                <div className="h-10 w-full bg-border rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
