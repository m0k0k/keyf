import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <nav className="flex items-center justify-between gap-6 py-4">
      <div className="flex flex-row items-center gap-2">
        <Link href="/context" className="text-lg hover:underline">
          Context
        </Link>
        <Link href="/dashboard" className="text-lg hover:underline">
          Dashboard
        </Link>
      </div>
      <div className="flex flex-row items-center gap-2">L</div>
    </nav>
  );
}
