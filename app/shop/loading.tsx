export default function ShopLoading() {
  return (
    <div className="animate-pulse">
      <div className="mx-4 sm:mx-6 lg:mx-8 my-4 rounded-2xl bg-border h-[140px] md:h-[180px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-[220px] flex-shrink-0 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-full rounded-full bg-border" />
            ))}
          </aside>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden bg-surface">
                  <div className="aspect-[5/4] bg-border" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-3/4 bg-border rounded" />
                    <div className="h-3 w-1/2 bg-border rounded" />
                    <div className="h-5 w-1/3 bg-border rounded" />
                    <div className="h-10 w-full bg-border rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
