import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { convertToRupiah } from '@/lib/utils';
import { TxMenu } from '@/types';

export const columns: ColumnDef<TxMenu>[] = [
    {
        accessorKey: 'menu',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Menu" className="text-center" />,
        cell: ({ row }) => <div>{row.getValue('menu')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,

        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'total_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Price" />,
        cell: ({ row }) => {
            const value = row.getValue('total_price') as string;
            return <div className="w-[80px]">{convertToRupiah(value.toString(), 'Rp. ')}</div>;
        },

        enableSorting: true,
        enableHiding: false,
    },
];
