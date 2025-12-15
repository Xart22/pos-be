import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { formatQty } from '@/helper/formatQty';
import formatRupiah from '@/helper/formatRupiah';
import { CashOut, EmployeeReport, IngredientSummary } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const ingredientColumns: ColumnDef<IngredientSummary>[] = [
    {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bahan Baku" />,
        cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
        enableSorting: true,
    },
    {
        accessorFn: (row) => Number(row.quantity) || 0,
        id: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
        cell: ({ row, getValue }) => {
            const qty = getValue() as number;
            const unit = row.original.unit;
            return <span>{formatQty(qty, unit)}</span>;
        },
        enableSorting: true,
    },
    {
        accessorFn: (row) => Number(row.cost ?? 0),
        id: 'cost',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cost" />,
        cell: ({ getValue }) => {
            const cost = getValue() as number;
            if (!cost) return <span>-</span>;
            return <span>{formatRupiah(cost)}</span>;
        },
        enableSorting: true,
    },
];

export const omsetColumns: ColumnDef<{ date: string; omset: number; qris: number; cash: number }>[] = [
    {
        accessorKey: 'date',
        id: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
        cell: ({ getValue }) => <span>{getValue() as string}</span>,
        enableSorting: true,
    },
    {
        accessorKey: 'omset',
        id: 'omset',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Omset" />,
        cell: ({ getValue }) => {
            const omset = getValue() as number;
            return <span>{formatRupiah(omset)}</span>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'qris',
        id: 'qris',
        header: ({ column }) => <DataTableColumnHeader column={column} title="QRIS" />,
        cell: ({ getValue }) => {
            const qris = getValue() as number;
            return <span>{formatRupiah(qris)}</span>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'cash',
        id: 'cash',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cash" />,
        cell: ({ getValue }) => {
            const cash = getValue() as number;
            return <span>{formatRupiah(cash)}</span>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'opening_balance',
        id: 'opening_balance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Opening Balance" />,
        cell: ({ getValue }) => {
            const opening_balance = getValue() as number;
            return <span>{formatRupiah(opening_balance)}</span>;
        },
        enableSorting: true,
    },

    {
        accessorKey: 'total_cash',
        id: 'total_cash',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Cash" />,
        cell: ({ getValue }) => {
            const total_cash = getValue() as number;
            return <span>{formatRupiah(total_cash)}</span>;
        },
        enableSorting: true,
    },
];

export const cashOutColumns: ColumnDef<CashOut>[] = [
    {
        accessorKey: 'tanggal',
        id: 'tanggal',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
        cell: ({ getValue }) => <span>{getValue() as string}</span>,
        enableSorting: true,
    },
    {
        accessorKey: 'description',
        id: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
        //long text wrap if include \n character
        cell: ({ getValue }) => <pre className="font-sans whitespace-pre-line">{getValue() as string}</pre>,
        enableSorting: true,
    },
    {
        accessorKey: 'amount',
        id: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        cell: ({ getValue }) => {
            const amount = getValue() as number;
            return <span>{formatRupiah(amount)}</span>;
        },
        enableSorting: true,
    },
];

export const rekapKaryawanColumns: ColumnDef<EmployeeReport>[] = [
    {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
        cell: ({ getValue }) => <span>{getValue() as string}</span>,
        enableSorting: true,
    },
    {
        accessorKey: 'base_gaji',
        id: 'base_gaji',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Gaji Pokok" />,
        cell: ({ getValue }) => {
            const base_gaji = getValue() as number;
            return <span>{formatRupiah(base_gaji)}</span>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'hadir',
        id: 'hadir',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hadir (hari)" />,
        cell: ({ getValue }) => {
            const hadir = getValue() as number;
            return <span>{hadir}</span>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'full_time',
        id: 'full_time',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Full Shift" />,
        cell: ({ getValue }) => {
            const full_time = getValue() as number;
            return <span>{full_time}</span>;
        },
        enableSorting: true,
    },
    {
        accessorKey: 'total_gaji',
        id: 'total_gaji',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Gaji" />,
        cell: ({ getValue }) => {
            const total_gaji = getValue() as number;
            return <span>{formatRupiah(total_gaji)}</span>;
        },
        enableSorting: true,
    },
];
