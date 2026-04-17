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
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => navigateToPage(pageNumber)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              pageNumber === currentPage
                ? "border-blue-600 bg-blue-600 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}
