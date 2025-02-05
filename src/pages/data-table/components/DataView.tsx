import * as React from "react";
import { cn } from "../../../utils/cn";

interface DataViewProps<T> {
  data: T[];
  layout?: "grid" | "list";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  paginator?: boolean;
  rows?: number;
  first?: number;
  totalRecords?: number;
  pageLinks?: number;
  rowsPerPageOptions?: number[];
  paginatorPosition?: "top" | "bottom" | "both";
  emptyMessage?: React.ReactNode;
  className?: string;
  gridClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  onPage?: (event: { first: number; rows: number }) => void;
  itemTemplate: (item: T, layout: "grid" | "list") => React.ReactNode;
}

function DataView<T>({
  data,
  layout = "list",
  header,
  footer,
  paginator = false,
  rows = 0,
  first = 0,
  totalRecords,
  pageLinks = 5,
  rowsPerPageOptions,
  paginatorPosition = "bottom",
  emptyMessage = "No records found.",
  className,
  gridClassName,
  listClassName,
  itemClassName,
  onPage,
  itemTemplate,
}: DataViewProps<T>) {
  const [currentFirst, setCurrentFirst] = React.useState(first);
  const [currentRows, setCurrentRows] = React.useState(rows);
  const [currentLayout, setCurrentLayout] = React.useState(layout);

  const getTotalRecords = () => {
    return totalRecords || data.length;
  };

  const getPageCount = () => {
    return Math.ceil(getTotalRecords() / currentRows);
  };

  const calculatePageLinkBoundaries = () => {
    const numberOfPages = getPageCount();
    const visiblePages = Math.min(pageLinks, numberOfPages);
    const currentPage = Math.floor(currentFirst / currentRows);
    let start = Math.max(0, Math.min(currentPage - Math.floor(visiblePages / 2), numberOfPages - visiblePages));
    let end = Math.min(numberOfPages, start + visiblePages);
    return { start, end };
  };

  const onPageChange = (first: number, rows: number) => {
    setCurrentFirst(first);
    setCurrentRows(rows);
    onPage?.({ first, rows });
  };

  const renderPaginator = (position: "top" | "bottom") => {
    if (!paginator || (paginatorPosition !== position && paginatorPosition !== "both")) {
      return null;
    }

    const { start, end } = calculatePageLinkBoundaries();
    const pageCount = getPageCount();
    const currentPage = Math.floor(currentFirst / currentRows);

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentFirst - currentRows, currentRows)}
            disabled={currentPage === 0}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentFirst + currentRows, currentRows)}
            disabled={currentPage >= pageCount - 1}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{currentFirst + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentFirst + currentRows, getTotalRecords())}
              </span>{" "}
              of <span className="font-medium">{getTotalRecords()}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentFirst - currentRows, currentRows)}
                disabled={currentPage === 0}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: end - start }).map((_, i) => {
                const pageNumber = start + i;
                const isCurrentPage = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber * currentRows, currentRows)}
                    className={cn(
                      "relative inline-flex items-center px-4 py-2 text-sm font-semibold",
                      isCurrentPage
                        ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    )}
                  >
                    {pageNumber + 1}
                  </button>
                );
              })}
              <button
                onClick={() => onPageChange(currentFirst + currentRows, currentRows)}
                disabled={currentPage >= pageCount - 1}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    if (!header) {
      return null;
    }

    return <div className="mb-4">{header}</div>;
  };

  const renderFooter = () => {
    if (!footer) {
      return null;
    }

    return <div className="mt-4">{footer}</div>;
  };

  const renderContent = () => {
    if (!data || data.length === 0) {
      return <div className="p-4 text-center text-gray-500">{emptyMessage}</div>;
    }

    const items = rows ? data.slice(currentFirst, currentFirst + currentRows) : data;

    if (currentLayout === "grid") {
      return (
        <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", gridClassName)}>
          {items.map((item, index) => (
            <div key={index} className={cn("", itemClassName)}>
              {itemTemplate(item, "grid")}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={cn("space-y-4", listClassName)}>
        {items.map((item, index) => (
          <div key={index} className={cn("", itemClassName)}>
            {itemTemplate(item, "list")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("", className)}>
      {renderHeader()}
      {renderPaginator("top")}
      {renderContent()}
      {renderPaginator("bottom")}
      {renderFooter()}
    </div>
  );
}

DataView.displayName = "DataView";

export { DataView };
