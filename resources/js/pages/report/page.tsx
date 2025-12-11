// resources/js/Pages/Report/Index.tsx (misal)
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { formatQty } from '@/helper/formatQty';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CashOut, IngredientSummary, Operational, StockRow } from '@/types';

type ReportProps = {
    operational: Operational[];
    sum_operational: string;
    cash_out: CashOut[];
    data_karyawan: {
        name: string;
        total_gaji: string;
        base_gaji: string;
        cashbon: {
            id: number;
            jumlah: string;
            tanggal: string;
        }[];
        total_cashbon: string;
    }[];
    transactions_food: StockRow[];
    transactions_drink: StockRow[];
    transactions_unknown: StockRow[];
    sum_ingredients: IngredientSummary[];
    period: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report',
        href: '/report',
    },
];

// =====================
// KOLUM TABEL BAHAN BAKU
// =====================
const ingredientColumns: ColumnDef<IngredientSummary>[] = [
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

export default function ReportPage({
    operational,
    sum_operational,
    cash_out,
    data_karyawan,
    transactions_food,
    transactions_drink,
    transactions_unknown,
    sum_ingredients,
    period,
}: ReportProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />

            <div className="space-y-6 px-4 py-6 md:px-8">
                {/* HEADER PERIODE */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Report</h1>
                    <p className="text-sm text-muted-foreground">
                        Periode: <span className="font-semibold">{period}</span>
                    </p>
                </div>

                {/* CONTOH SUMMARY KECIL DI ATAS (OPSIONAL) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Total Operational</p>
                        <p className="text-lg font-semibold">{formatRupiah(Number(sum_operational || 0))}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Jumlah Cash Out</p>
                        <p className="text-lg font-semibold">{cash_out.length} transaksi</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Menu Terjual (Food & Drink)</p>
                        <p className="text-lg font-semibold">{transactions_food.length + transactions_drink.length} item</p>
                    </div>
                </div>

                {/* SECTION: PEMAKAIAN BAHAN BAKU */}
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
                        <div>
                            <h2 className="text-lg font-semibold">Pemakaian Bahan Baku</h2>
                            <p className="text-xs text-muted-foreground">
                                Rekap total penggunaan bahan baku berdasarkan penjualan selama periode ini.
                            </p>
                        </div>
                    </div>

                    <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                        <DataTable columns={ingredientColumns} data={sum_ingredients} enableSearching={true} />
                    </div>
                </div>

                {/* SECTION LAIN (FOOD / DRINK / GAJI / DLL) BISA DITAMBAH DI SINI */}
                {/* Contoh placeholder: */}
                {/* <YourFoodTableComponent data={transactions_food} /> */}
                {/* <YourDrinkTableComponent data={transactions_drink} /> */}
                {/* <YourStaffCostComponent data={data_karyawan} /> */}
            </div>
        </AppLayout>
    );
}
