// resources/js/Pages/Report/Index.tsx (misal)
import { Head, router } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CashOut, EmployeeReport, IngredientSummary, Operational, StockRow } from '@/types';
import { FormEvent, useState } from 'react';
import { cashOutColumns, ingredientColumns, omsetColumns, rekapKaryawanColumns } from './colums';

type ReportProps = {
    operational: Operational[];
    sum_operational: string;
    cash_out: CashOut[];
    data_karyawan: EmployeeReport[];
    transactions_food: StockRow[];
    transactions_drink: StockRow[];
    transactions_unknown: StockRow[];
    sum_ingredients: IngredientSummary[];
    redem_ingredients: IngredientSummary[];
    period: string;
    data_omset_daily: {
        date: string;
        omset: number;
        qris: number;
        cash: number;
        opening_balance: number;
        total_cash: number;
        bar: number;
        kitchen: number;
    }[];
    startDate?: string;
    endDate?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report',
        href: '/report',
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
    redem_ingredients,
    period,
    data_omset_daily,
    startDate,
    endDate,
}: ReportProps) {
    // ====== STATE FILTER TANGGAL ======
    const [start, setStart] = useState(startDate ?? '');
    const [end, setEnd] = useState(endDate ?? '');

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();

        // Bangun URL sesuai optional param: /stock-opname/{start?}/{end?}
        const segments: string[] = ['/report'];

        if (start) segments.push(start);
        if (end) segments.push(end);

        const url = segments.join('/');

        router.get(
            url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };
    const handleReset = () => {
        setStart(startDate ?? '');
        setEnd(endDate ?? '');
        router.get('/report', {}, { preserveScroll: true });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <span className="text-sm text-muted-foreground">
                        Periode: {startDate} s/d {endDate}
                    </span>
                </div>
            </div>

            <div className="space-y-6 px-4 py-6 md:px-8">
                {/* HEADER PERIODE */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Report</h1>
                    <p className="text-sm text-muted-foreground">
                        Periode: <span className="font-semibold">{period}</span>
                    </p>
                </div>
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-end dark:bg-gray-900"
                >
                    <div className="flex flex-1 flex-col gap-1">
                        <label className="text-sm font-medium">Start Date</label>
                        <input
                            type="date"
                            className="h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-900"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                        <label className="text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            className="h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-900"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" className="mt-1 md:mt-0">
                            Terapkan
                        </Button>
                        <Button type="button" variant="secondary" className="mt-1 md:mt-0" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </form>
                {/* CONTOH SUMMARY KECIL DI ATAS (OPSIONAL) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Total Omset</p>
                        <p className="text-lg font-semibold">{formatRupiah(data_omset_daily.reduce((sum, record) => sum + record.omset, 0))}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Total Cash Out</p>
                        <p className="text-lg font-semibold">{formatRupiah(cash_out.reduce((sum, record) => sum + Number(record.amount), 0))}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Total Operasional</p>
                        <p className="text-lg font-semibold">
                            {formatRupiah(Number(sum_operational + data_karyawan.reduce((sum, record) => sum + record.gaji_bersih, 0)))}
                        </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Total Profit</p>
                        <p className="text-lg font-semibold">
                            {formatRupiah(data_omset_daily.reduce((sum, record) => sum + record.omset, 0))} -{' '}
                            {formatRupiah(cash_out.reduce((sum, record) => sum + Number(record.amount), 0))} + {formatRupiah(Number(sum_operational))}{' '}
                            + {formatRupiah(data_karyawan.reduce((sum, record) => sum + record.gaji_bersih, 0))} ={' '}
                            {formatRupiah(
                                data_omset_daily.reduce((sum, record) => sum + record.omset, 0) -
                                    cash_out.reduce((sum, record) => sum + Number(record.amount), 0) -
                                    Number(sum_operational) -
                                    data_karyawan.reduce((sum, record) => sum + record.gaji_bersih, 0),
                            )}
                        </p>
                    </div>
                </div>
                {/* SECTION: LAPORAN OMSET HARIAN & Cash Out */}
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
                        <div>
                            <h2 className="text-lg font-semibold">Laporan Omset Harian</h2>
                            <p className="text-xs text-muted-foreground">Rekap omset harian berdasarkan transaksi yang terjadi selama periode ini.</p>
                        </div>
                    </div>

                    <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                        <DataTable columns={omsetColumns} data={data_omset_daily} enableSearching={true} />
                        {/* Total Omset */}
                        <div className="mt-4 flex flex-row justify-end gap-6">
                            <span className="text-sm font-semibold">
                                Total Omset: {formatRupiah(data_omset_daily.reduce((sum, record) => sum + record.omset, 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Qris: {formatRupiah(data_omset_daily.reduce((sum, record) => sum + record.qris, 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Cash: {formatRupiah(data_omset_daily.reduce((sum, record) => sum + record.cash, 0))}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
                        <div>
                            <h2 className="text-lg font-semibold">Rekap Penjualan</h2>
                            <p className="text-xs text-muted-foreground">Rekap penjualan menu makanan dan minuman selama periode ini.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                            <DataTable
                                columns={[
                                    {
                                        id: 'menu_name',
                                        accessorFn: (row) => row.menu ?? row.name ?? '',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Menu" />,
                                        cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'quantity',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'base_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Base Price" />,
                                        cell: ({ getValue }) => formatRupiah(getValue<number>()),
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'variant_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Variant Price" />,
                                        cell: ({ getValue }) => formatRupiah(getValue<number>()),
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'total_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Price" />,
                                        cell: ({ getValue }) => formatRupiah(getValue<number>()),
                                        enableSorting: true,
                                    },
                                ]}
                                data={transactions_drink}
                                enableSearching
                            />
                            <div className="mt-4 flex flex-row justify-end gap-6">
                                <span className="text-sm font-semibold">
                                    Total Penjualan:
                                    {formatRupiah(transactions_drink.reduce((sum, record) => sum + record.total_price, 0))}
                                </span>
                                <span className="text-sm font-semibold">
                                    Total est cost:
                                    {formatRupiah(transactions_drink.reduce((sum, record) => sum + record.total_price, 0) * 0.4)}
                                </span>
                                <span className="text-sm font-semibold">
                                    Total est profit:
                                    {formatRupiah(
                                        transactions_drink.reduce((sum, record) => sum + record.total_price, 0) -
                                            transactions_drink.reduce((sum, record) => sum + record.total_price, 0) * 0.4,
                                    )}
                                </span>
                            </div>
                            <div className="mt-4 flex flex-row justify-end gap-6">
                                <span className="text-sm font-semibold">
                                    Total Penjualan:
                                    {formatRupiah(transactions_drink.reduce((sum, record) => sum + record.total_price, 0))}
                                </span>
                                {/* where CashOut Kategori = 'Bar' */}
                                <span className="text-sm font-semibold">
                                    Total CashOut:
                                    {formatRupiah(cash_out.reduce((sum, record) => (record.kategori === 'Bar' ? sum + record.amount : sum), 0))}
                                </span>
                                <span className="text-sm font-semibold">
                                    Total profit:
                                    {formatRupiah(
                                        transactions_drink.reduce((sum, record) => sum + record.total_price, 0) -
                                            cash_out.reduce((sum, record) => (record.kategori === 'Bar' ? sum + record.amount : sum), 0),
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                            <DataTable
                                columns={[
                                    {
                                        id: 'menu_name',
                                        accessorFn: (row) => row.menu ?? row.name ?? '',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Menu" />,
                                        cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'quantity',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'base_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Base Price" />,
                                        cell: ({ getValue }) => formatRupiah(getValue<number>()),
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'variant_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Variant Price" />,
                                        cell: ({ getValue }) => formatRupiah(getValue<number>()),
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'total_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Price" />,
                                        cell: ({ getValue }) => formatRupiah(getValue<number>()),
                                        enableSorting: true,
                                    },
                                ]}
                                data={transactions_food}
                                enableSearching
                            />
                            <div className="mt-4 flex flex-row justify-end gap-6">
                                <span className="text-sm font-semibold">
                                    Total Penjualan:
                                    {formatRupiah(transactions_food.reduce((sum, record) => sum + record.total_price, 0))}
                                </span>
                                <span className="text-sm font-semibold">
                                    Total est cost:
                                    {formatRupiah(transactions_food.reduce((sum, record) => sum + record.total_price, 0) * 0.35)}
                                </span>
                                <span className="text-sm font-semibold">
                                    Total est profit:
                                    {formatRupiah(
                                        transactions_food.reduce((sum, record) => sum + record.total_price, 0) -
                                            transactions_food.reduce((sum, record) => sum + record.total_price, 0) * 0.35,
                                    )}
                                </span>
                            </div>
                            <div className="mt-4 flex flex-row justify-end gap-6">
                                <span className="text-sm font-semibold">
                                    Total Penjualan:
                                    {formatRupiah(transactions_food.reduce((sum, record) => sum + record.total_price, 0))}
                                </span>
                                <span className="text-sm font-semibold">
                                    Total cost:
                                    {formatRupiah(cash_out.reduce((sum, record) => (record.kategori === 'Kitchen' ? sum + record.amount : sum), 0))}
                                </span>
                                <span className="text-sm font-semibold">
                                    Total profit:
                                    {formatRupiah(
                                        transactions_food.reduce((sum, record) => sum + record.total_price, 0) -
                                            cash_out.reduce((sum, record) => (record.kategori === 'Kitchen' ? sum + record.amount : sum), 0),
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
                        <div>
                            <h2 className="text-lg font-semibold">Rekap Gaji Karyawan</h2>
                            <p className="text-xs text-muted-foreground">Rekap total gaji karyawan beserta potongan cashbon selama periode ini.</p>
                        </div>
                    </div>

                    <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                        <DataTable columns={rekapKaryawanColumns} data={data_karyawan} enableSearching={true} />

                        <div className="mt-4 flex justify-end">
                            <span className="text-sm font-semibold">
                                Total Gaji: {formatRupiah(data_karyawan.reduce((sum, record) => sum + record.gaji_bersih, 0))}
                            </span>
                        </div>
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                            <span className="mb-2 block font-semibold">Total Penjualan Bahan Baku</span>
                            <DataTable columns={ingredientColumns} data={sum_ingredients} enableSearching={true} />

                            <div className="mt-4 flex justify-end">
                                <span className="text-sm font-semibold">
                                    Total Cost: {formatRupiah(sum_ingredients.reduce((sum, item) => sum + (Number(item.cost) || 0), 0))}
                                </span>
                            </div>
                        </div>
                        <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                            <span className="mb-2 block font-semibold">Total Redem Bahan Baku</span>
                            <DataTable columns={ingredientColumns} data={redem_ingredients} enableSearching={true} />
                            <div className="mt-4 flex justify-end">
                                <span className="text-sm font-semibold">
                                    Total Cost: {formatRupiah(redem_ingredients.reduce((sum, item) => sum + (Number(item.cost) || 0), 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
                        <div>
                            <h2 className="text-lg font-semibold">Laporan Cash Out</h2>
                            <p className="text-xs text-muted-foreground">Rekap pengeluaran kas (cash out) selama periode ini.</p>
                        </div>
                    </div>

                    <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                        <DataTable columns={cashOutColumns} data={cash_out} enableSearching={true} />
                        {/* Total Omset */}
                        <div className="mt-4 flex flex-row justify-end gap-6">
                            <span className="text-sm font-semibold">
                                Total Bar :
                                {formatRupiah(cash_out.reduce((sum, record) => (record.kategori === 'Bar' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Kitchen :
                                {formatRupiah(cash_out.reduce((sum, record) => (record.kategori === 'Kitchen' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Operasional :
                                {formatRupiah(cash_out.reduce((sum, record) => (record.kategori === 'Operasional' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total RND :
                                {formatRupiah(cash_out.reduce((sum, record) => (record.kategori === 'RND' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Cash Out :{formatRupiah(cash_out.reduce((sum, record) => sum + Number(record.amount), 0))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
