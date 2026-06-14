import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start px-4 py-24">
      <h1 className="font-serif text-4xl font-bold text-stone-900">Page not found</h1>
      <p className="mt-4 text-lg text-stone-600">
        That page doesn&apos;t exist on Eastsider.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-amber-800 px-5 py-2 text-sm font-medium text-white hover:bg-amber-900"
      >
        Back to home
      </Link>
    </div>
  );
}
