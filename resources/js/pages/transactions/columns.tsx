import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export interface Transaction {
    id: number;
    order_id: string;
    customer_name: string | null;
    table_number: string | null;
    type: 'DINE_IN' | 'TAKEAWAY';
    sub_total: number;
    discount: number;
    total_price: number;
    payment_method: string;
    cash: number;
    change: number;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    details: Array<{
        id: number;
        menu_id: number;
        quantity: number;
    }>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'order_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
        cell: ({ row }) => <div className="font-mono text-sm font-medium">{row.getValue('order_id')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Waktu" />,
        cell: ({ row }) => <div className="text-sm">{formatDate(row.getValue('created_at'))}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'customer_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
        cell: ({ row }) => {
            const customerName = row.getValue('customer_name') as string | null;
            const tableNumber = row.original.table_number;
            return (
                <div className="text-sm">
                    {customerName || '-'}
                    {tableNumber && <span className="ml-1 text-muted-foreground">(Meja {tableNumber})</span>}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            return (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${type === 'DINE_IN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                >
                    {type === 'DINE_IN' ? 'Dine In' : 'Take Away'}
                </span>
            );
        },
        enableSorting: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'payment_method',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Pembayaran" />,
        cell: ({ row }) => <div className="text-sm capitalize">{(row.getValue('payment_method') as string).toLowerCase()}</div>,
        enableSorting: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'total_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" className="justify-end" />,
        cell: ({ row }) => <div className="text-right font-semibold">{formatCurrency(row.getValue('total_price'))}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'user.name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kasir" />,
        cell: ({ row }) => <div className="text-sm">{row.original.user.name}</div>,
        enableSorting: true,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const transaction = row.original;
            return (
                <div className="text-center">
                    <Button size="icon-sm" variant="ghost" onClick={() => router.get(`/transactions/detail/${transaction.id}`)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        meta: {
            skipExport: true,
        },
    },
];
