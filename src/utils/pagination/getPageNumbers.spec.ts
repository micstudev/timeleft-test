import { getPageNumbers } from "./getPageNumbers";

describe("getPageNumbers", () => {
  describe("when total pages is less than or equal to maxVisible (7)", () => {
    it("should return all page numbers when totalPages is 1", () => {
      expect(getPageNumbers(1, 1)).toEqual([1]);
    });

    it("should return all page numbers when totalPages is 5", () => {
      expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it("should return all page numbers when totalPages is exactly 7", () => {
      expect(getPageNumbers(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe("when total pages is greater than maxVisible (7)", () => {
    describe("when current page is near the beginning (currentPage <= 4)", () => {
      it("should show first 5 pages, ellipsis, and last page when currentPage is 1", () => {
        expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
      });

      it("should show first 5 pages, ellipsis, and last page when currentPage is 4", () => {
        expect(getPageNumbers(4, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
      });
    });

    describe("when current page is near the end (currentPage >= totalPages - 3)", () => {
      it("should show first page, ellipsis, and last 5 pages when currentPage is 7 of 10", () => {
        expect(getPageNumbers(7, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
      });

      it("should show first page, ellipsis, and last 5 pages when currentPage is 10 of 10", () => {
        expect(getPageNumbers(10, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
      });
    });

    describe("when current page is in the middle", () => {
      it("should show first page, ellipsis, current page with neighbors, ellipsis, and last page", () => {
        expect(getPageNumbers(6, 15)).toEqual([1, "...", 5, 6, 7, "...", 15]);
      });

      it("should show first page, ellipsis, current page with neighbors, ellipsis, and last page when currentPage is 8", () => {
        expect(getPageNumbers(8, 20)).toEqual([1, "...", 7, 8, 9, "...", 20]);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle totalPages of 8 correctly", () => {
      expect(getPageNumbers(1, 8)).toEqual([1, 2, 3, 4, 5, "...", 8]);
      expect(getPageNumbers(5, 8)).toEqual([1, "...", 4, 5, 6, 7, 8]);
      expect(getPageNumbers(6, 8)).toEqual([1, "...", 4, 5, 6, 7, 8]);
    });
  });
});
