'use client';

import {
    CellContext,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import * as XLSX from 'xlsx';

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        skipExport?: boolean;
        exportValue?: (context: CellContext<TData, TValue>) => any;
    }
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from '@/components/data-table-pagination';
import { DataTableToolbar } from '@/components/data-table-toolbar';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterColumn?: string[];
    enableSearching?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, filterColumn, enableSearching }: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });
    const handleExportXLSX = () => {
        // Kalau mau semua hasil filter (tidak peduli pagination):
        const rows = table.getFilteredRowModel().rows;

        // Kalau mau hanya yang tampil di page sekarang:
        // const rows = table.getRowModel().rows;

        const visibleLeafColumns = table.getAllLeafColumns().filter((col) => col.getIsVisible() && !(col.columnDef.meta as any)?.skipExport);

        const exportData = rows.map((row) => {
            const rowObj: Record<string, any> = {};

            visibleLeafColumns.forEach((col) => {
                const cell = row.getAllCells().find((c) => c.column.id === col.id);
                const meta = col.columnDef.meta as any;

                const value =
                    meta?.exportValue && cell
                        ? meta.exportValue(cell.getContext()) // pakai formatter custom kalau ada
                        : cell?.getValue(); // fallback ke nilai accessor

                const header = typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id; // fallback kalau header berupa component

                rowObj[header] = value ?? '';
            });

            return rowObj;
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, 'Recipes');
        XLSX.writeFile(wb, 'recipes.xlsx');
    };

    return (
        <div className="space-y-4">
            {enableSearching && (
                <DataTableToolbar
                    table={table}
                    filterColumns={filterColumn ?? []}
                    placeholder="Search..."
                    showResetButton={true}
                    exportToExcel={handleExportXLSX}
                />
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan} className="px-3 py-2 text-left font-semibold">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
