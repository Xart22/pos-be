import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterColumns: string[]; // multiple column names
    placeholder?: string;
    showResetButton?: boolean;
}

export function DataTableToolbar<TData>({
    table,
    filterColumns = ['name'],
    placeholder = 'Search...',
    showResetButton = true,
}: DataTableToolbarProps<TData>) {
    const currentValue = (table.getColumn(filterColumns[0])?.getFilterValue() as string) ?? '';

    const isFiltered = table.getState().columnFilters.length > 0;

    const handleChange = (value: string) => {
        filterColumns.forEach((col) => {
            console.log(`Setting filter for column: ${col} with value: ${value}`);
            const column = table.getColumn(col);
            if (column) {
                column.setFilterValue(value);
            }
        });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={placeholder}
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && showResetButton && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
