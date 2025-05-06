import * as React from "react"
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from "lucide-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  title?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  title = "Data Table",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [pageSize, setPageSize] = React.useState(5)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  })

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const totalRows = table.getFilteredRowModel().rows.length
  const displayedRows = table.getRowModel().rows.length

  return (
    <div className="w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          <div className="bg-white dark:bg-gray-700 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-200">
            <span className="mr-1">{totalRows}</span><span>Data</span>
          </div>
        </div>
      </div>

      {/* Search */}
      {searchKey && (
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-600">
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9 w-full md:max-w-sm bg-slate-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const isSorted = header.column.getIsSorted()

                  return (
                    <th
                      key={header.id}
                      className={`text-left font-semibold text-gray-700 dark:text-gray-200 px-6 py-3 text-sm ${canSort ? 'cursor-pointer' : ''}`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {canSort && (
                          <div className="flex flex-col ml-1 -mr-1">
                            <ChevronUp className={`h-3 w-3 ${isSorted === 'asc' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-gray-500'}`} />
                            <ChevronDown className={`h-3 w-3 ${isSorted === 'desc' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-gray-500'}`} />
                          </div>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`hover:bg-slate-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-slate-50/30 dark:bg-gray-750'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 dark:text-gray-400">
                    <p className="text-lg font-medium">Tidak ada data yang tersedia.</p>
                    <p className="text-sm">Silakan ubah pencarian atau filter Anda</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 px-6 py-3">
        <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4">
          <div className="flex items-center text-sm text-slate-600 dark:text-gray-300">
             Halaman : {displayedRows > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalRows)} dari {totalRows} Total data
          </div>

          <div className="flex items-center gap-2">
            {/* Page Size Selector */}
            <div className="flex items-center mr-4">
              <span className="text-sm mr-2 dark:text-gray-300">Data per halaman :</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  table.setPageSize(Number(e.target.value))
                }}
                className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md p-1 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                className="hidden sm:flex items-center justify-center h-8 w-8 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Number */}
              <div className="flex items-center mx-2">
                <span className="text-sm font-medium dark:text-gray-200">
                  {currentPage} / {totalPages || 1}
                </span>
              </div>

              {/* Next Page */}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex items-center justify-center h-8 w-8 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                className="hidden sm:flex items-center justify-center h-8 w-8 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
