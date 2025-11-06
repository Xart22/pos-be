import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { convertToRupiah } from '@/lib/utils';
import { Operational } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Operational>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'harga',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga" />,
        cell: ({ row }) => <div className="font-medium">{convertToRupiah(row.getValue('harga') as string, 'Rp. ')}</div>,
    },
    {
        accessorKey: 'deskripsi',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('deskripsi')}</div>,
    },
];
