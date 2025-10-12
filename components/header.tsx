import Link from "next/link";

export function Header() {
  return (
    <nav className="flex items-center justify-center gap-6 py-4">
      <Link href="/context" className="text-lg hover:underline">
        Context
      </Link>
      <Link href="/dashboard" className="text-lg hover:underline">
        Dashboard
      </Link>
    </nav>
  );
}
