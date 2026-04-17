import Link from "next/link";

export default function LeadNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Lead not found</h2>
        <p className="mt-2 text-gray-600">
          The lead you are looking for does not exist.
        </p>
        <Link
          href="/leads"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Leads
        </Link>
      </div>
    </main>
  );
}
