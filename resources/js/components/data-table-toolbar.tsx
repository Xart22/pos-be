import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterColumns: string[]; // multiple column names
    placeholder?: string;
    showResetButton?: boolean;
    exportToExcel?: () => void;
}

export function DataTableToolbar<TData>({
    table,
    filterColumns = ['name'],
    placeholder = 'Search...',
    showResetButton = true,
    exportToExcel,
}: DataTableToolbarProps<TData>) {
    // Gunakan global filter value
    const globalFilter = table.getState().globalFilter ?? '';

    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== '';

    const handleChange = (value: string) => {
        // Set global filter yang akan mencari di semua kolom yang ditentukan
        table.setGlobalFilter(value);
    };

    const handleReset = () => {
        table.setGlobalFilter('');
        table.resetColumnFilters();
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={placeholder}
                    value={globalFilter}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && showResetButton && (
                    <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </div>
            <Button variant="outline" onClick={() => exportToExcel && exportToExcel()}>
                Export to Excel
            </Button>
        </div>
    );
}
