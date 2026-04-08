import { SpringBootPagination } from "@/domain/domain";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimplePaginationProps<T> {
  pagination: SpringBootPagination<T>;
  onPageChange: (page: number) => void;
}

export function SimplePagination<T>({
  pagination,
  onPageChange,
}: SimplePaginationProps<T>) {
  const currentPage = pagination.number;
  const totalPages = pagination.totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-full px-4 py-2">
      <Button
        size="sm"
        variant="ghost"
        className="cursor-pointer h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={pagination.first}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      <span className="text-sm text-gray-400">
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="cursor-pointer h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={pagination.last}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}
