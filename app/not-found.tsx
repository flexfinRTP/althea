import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Page not found.</h1>
      <p>That route is not part of the Althea patient journey.</p>
      <Link className="inline-flex rounded-md bg-green px-5 py-3 text-white" href="/">
        Home
      </Link>
    </div>
  );
}
