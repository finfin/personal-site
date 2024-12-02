import Link from 'next/link';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          className={`px-4 py-2 rounded ${
            currentPage === pageNum
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          href={pageNum === 1 ? '/' : `/page/${pageNum}`}
          key={pageNum}
        >
          {pageNum}
        </Link>
      ))}
    </div>
  );
} 