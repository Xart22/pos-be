import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { convertToRupiah } from '@/lib/utils';
import { BahanBaku } from '@/types';

export const columns: ColumnDef<BahanBaku>[] = [
    {
        accessorKey: 'kode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('kode')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <div className="w-[20px]">{row.getValue('name')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'harga',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga" />,

        cell: ({ row }) => {
            const value = row.getValue('harga') as string;
            return <div className="w-[80px]">{convertToRupiah(value.toString(), 'Rp. ')}</div>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'stock',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('stock')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'satuan',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Satuan" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('satuan')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'per_unit',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Per Unit" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('per_unit')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'total',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => {
            const value = row.getValue('total') as number;
            return <div className="w-[80px]">{convertToRupiah((value || 0).toFixed(0), 'Rp. ')}</div>;
        },
        enableSorting: true,
    },
];
