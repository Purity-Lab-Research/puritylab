import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center px-6 max-w-lg">
        <img src="/images/logo.svg" alt="Purity Lab" width={48} height={48} className="h-12 w-12 mx-auto mb-6" />
        <p className="text-8xl font-extrabold text-[#F0F0F0] tracking-tight mb-2">
          404
        </p>
        <h1 className="text-2xl font-bold text-[#111111] mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block bg-[#111111] text-white rounded-full px-7 py-3 font-semibold hover:opacity-90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/protocols"
            className="inline-block border border-[#F0F0F0] text-[#111111] rounded-full px-7 py-3 font-medium hover:border-[#111111] transition-colors"
          >
            Browse Protocols
          </Link>
        </div>
      </div>
    </section>
  );
}
