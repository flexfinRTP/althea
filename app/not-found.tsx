export default function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Page not found.</h1>
      <p>That route is not part of the Althea patient journey.</p>
      <a className="inline-flex rounded-md bg-[#1f4a43] px-5 py-3 text-[#fffdf8]" href="/">
        Home
      </a>
    </div>
  );
}
