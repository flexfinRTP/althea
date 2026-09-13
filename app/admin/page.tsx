import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Admin</h1>
      <Link href="/admin/treasury">Treasury</Link>
    </div>
  );
}
