import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center px-6 max-w-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mx-auto mb-6">
          <span className="font-heading text-sm font-bold text-white tracking-tight">
            PL
          </span>
        </div>
        <p className="font-heading text-7xl font-extrabold text-border tracking-tight mb-2">
          404
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-block bg-primary text-white rounded-lg px-7 py-3 font-semibold hover:bg-primary-hover transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/protocols"
            className="inline-block border border-border text-primary rounded-lg px-7 py-3 font-medium hover:border-primary transition-colors"
          >
            Browse Protocols
          </Link>
        </div>
      </div>
    </section>
  );
}
