"use client";

import {
  ColumnDef,
  SortingState,
  Table,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scn/table";
import { useState } from "react";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronUp,
  RefreshCcw,
} from "lucide-react";
import { Card } from "@scn/card";
import { cn } from "@/lib/utils";
import DTPicker from "@/components/shared/DTPicker";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@scn/dropdown-menu"; 
interface ISearchBox<TData> {
  children?: React.ReactNode | React.ReactNode[];
  onDateChange?: (date: DateRange | undefined) => void;
  table: Table<TData>;
  onRefetch?: () => void;
  msg?: string;
}
function SearchBox<TData>({
  msg,
  onRefetch,
  table,
  children,
  onDateChange,
}: ISearchBox<TData>) {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <Card className={"my-1.5 mx-0"}>
      <div className="flex justify-between items-center">
        <button
          className="rounded inline-flex gap-1 p-0.5  border border-transparent hover:border-gray-400 text-sm items-center"
          onClick={() => setShowSearch((_) => !_)}
        >
          Search/Filter{" "}
          {showSearch ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <span className="pl-3 text-sm text-orange-800">{msg}</span>
        <button
          onClick={onRefetch}
          className="rounded inline-flex gap-1 p-0.5  border border-transparent hover:border-gray-400 text-sm items-center ml-auto"
        >
          <RefreshCcw size={18} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded inline-flex gap-1 p-0.5  border border-transparent hover:border-gray-400 text-sm items-center">
              Columns <ChevronDownIcon size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={cn(`p-1 border-t`, {
          hidden: !showSearch,
        })}
      >
        {onDateChange && <DTPicker.Range onChange={onDateChange} />}
        {children}
      </div>
    </Card>
  );
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRefetch?: () => void;
  onDateChange?: (date: DateRange | undefined) => void;
  msg?: string;
  noSearch?: boolean;
  searchDom?: React.ReactNode;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  msg,
  onRefetch,
  onDateChange,
  noSearch,
  searchDom,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <>
      {!noSearch && (
        <SearchBox
          table={table}
          onDateChange={onDateChange}
          msg={msg}
          onRefetch={onRefetch}
        >
          {searchDom}
        </SearchBox>
      )}
      <div className="rounded-md border">
        <TableUI>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>
    </>
  );
}
