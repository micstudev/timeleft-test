import { useState, useMemo, useEffect } from "react";

interface UsePaginationReturn<T> {
  paginatedItems: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function usePagination<T>(items: T[], itemsPerPage: number): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousItemsLength, setPreviousItemsLength] = useState(items.length);

  useEffect(() => {
    const currentLength = items.length;
    if (currentLength !== previousItemsLength) {
      setPreviousItemsLength(currentLength);
      setCurrentPage(1);
    }
  }, [items.length, previousItemsLength]);

  const { paginatedItems, totalPages, startIndex, endIndex } = useMemo(() => {
    if (!items || items.length === 0) {
      return { paginatedItems: [], totalPages: 0, startIndex: 0, endIndex: 0 };
    }

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const paginatedItems = items.slice(startIndex, endIndex);

    return { paginatedItems, totalPages, startIndex, endIndex };
  }, [items, currentPage, itemsPerPage]);

  return { paginatedItems, totalPages, startIndex, endIndex, currentPage, setCurrentPage };
}
