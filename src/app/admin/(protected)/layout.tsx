import Link from "next/link";
import { signOut } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-xl font-bold text-stone-900">
              Eastsider Admin
            </Link>
            <nav className="hidden gap-4 text-sm font-medium text-stone-700 sm:flex">
              <Link href="/admin" className="hover:text-amber-800">
                Dashboard
              </Link>
              <Link href="/admin/articles" className="hover:text-amber-800">
                Articles
              </Link>
              <Link href="/admin/places" className="hover:text-amber-800">
                Places
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-stone-600 hover:text-stone-900">
              View site
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
