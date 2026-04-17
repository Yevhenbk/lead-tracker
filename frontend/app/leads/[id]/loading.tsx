export default function LeadDetailLoading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-6 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
