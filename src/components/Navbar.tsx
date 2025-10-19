"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Logo / App Name */}
      <Link href="/" className="text-2xl font-bold">
        Bridge
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link href="/opportunities" className="hover:underline">
          Opportunities
        </Link>
        <Link href="/profile" className="hover:underline">
          Profile
        </Link>
        <Link href="/auth" className="hover:underline">
          Login
        </Link>
      </div>
    </nav>
  );
}
