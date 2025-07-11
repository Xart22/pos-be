import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { convertToRupiah } from '@/lib/utils';
import { Absensi } from '@/types';

export const columns: ColumnDef<Absensi>[] = [
    {
        accessorKey: 'tanggal',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('tanggal')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'shift',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Shift" />,
        cell: ({ row }) => <div className="w-[20px]">{row.getValue('shift')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'jam_masuk',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jam Masuk" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('jam_masuk')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'jam_keluar',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jam Keluar" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('jam_keluar')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('status')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'take_home_pay',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Take Home Pay" />,
        cell: ({ row }) => {
            const value = row.getValue('take_home_pay') as string;
            return <div className="w-[80px]">{convertToRupiah(value.toString(), 'Rp. ')}</div>;
        },
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'keterangan',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Keterangan" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('keterangan')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
];
