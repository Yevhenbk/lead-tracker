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

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => {
    if (totalPages <= 5) return true;
    return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
  });

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border border-sand-200 px-3 py-1.5 text-xs text-ink-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-sand-100 transition-colors"
      >
        Previous
      </button>

      {pages.map((pageNumber, idx) => (
        <>
          {idx > 0 && pages[idx - 1] !== pageNumber - 1 && (
            <span key={`ellipsis-${pageNumber}`} className="px-1 text-xs text-ink-400">…</span>
          )}
          <button
            key={pageNumber}
            onClick={() => navigateToPage(pageNumber)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              pageNumber === currentPage
                ? "border-accent bg-accent text-white"
                : "border-sand-200 text-ink-600 hover:bg-sand-100"
            }`}
          >
            {pageNumber}
          </button>
        </>
      ))}

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
