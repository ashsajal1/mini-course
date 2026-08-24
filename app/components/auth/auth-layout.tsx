import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <main className="flex-1 grid place-items-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <div className="p-6 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
