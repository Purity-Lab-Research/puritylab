export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A2B4A]" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
