"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number): void => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`/leads?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border border-sand-200 px-3 py-1.5 text-xs text-ink-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-sand-100 transition-colors"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => navigateToPage(pageNumber)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              pageNumber === currentPage
                ? "border-coffee-500 bg-coffee-500 text-white"
                : "border-sand-200 text-ink-600 hover:bg-sand-100"
            }`}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg border border-sand-200 px-3 py-1.5 text-xs text-ink-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-sand-100 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
