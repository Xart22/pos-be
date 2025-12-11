import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { formatQty } from '@/helper/formatQty';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { IngredientSummary, StockRow } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';

type PageProps = {
    startDate: string;
    endDate: string;
    transactions_food: StockRow[];
    transactions_drink: StockRow[];
    transactions_unknown: StockRow[];
    sum_ingredients: IngredientSummary[];
};

export default function StockOpnamePage() {
    const { startDate, endDate, transactions_food, transactions_drink, transactions_unknown, sum_ingredients } = usePage<PageProps>().props;

    // ====== STATE FILTER TANGGAL ======
    const [start, setStart] = useState(startDate ?? '');
    const [end, setEnd] = useState(endDate ?? '');

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();

        // Bangun URL sesuai optional param: /stock-opname/{start?}/{end?}
        const segments: string[] = ['/stock-opname'];

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
        router.get('/stock-opname', {}, { preserveScroll: true });
    };

    // ====== COMPUTED SUMMARY INGREDIENT ======
    const { totalIngredient, totalQtyAll } = useMemo(() => {
        const totalIngredient = sum_ingredients.length;
        const totalQtyAll = sum_ingredients.reduce((sum, ing) => sum + Number(ing.quantity || 0), 0);
        return { totalIngredient, totalQtyAll };
    }, [sum_ingredients]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Stock Opname', href: '/stock-opname' }]}>
            <Head title="Stock Opname" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <h1 className="text-2xl font-bold">Stock Opname</h1>
                    <span className="text-sm text-muted-foreground">
                        Periode: {startDate} s/d {endDate}
                    </span>
                </div>

                {/* =================== FILTER TANGGAL =================== */}
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

                {/* =================== SUMMARY BAHAN BAKU =================== */}
                <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <p className="text-xs font-medium text-muted-foreground">Total Jenis Bahan Dipakai</p>
                        <p className="mt-2 text-2xl font-bold">{totalIngredient}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <p className="text-xs font-medium text-muted-foreground">Total Qty Bahan (Semua Unit)</p>
                        <p className="mt-2 text-2xl font-bold">{totalQtyAll % 1 === 0 ? totalQtyAll.toFixed(0) : totalQtyAll.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <p className="text-xs font-medium text-muted-foreground">Total Item Penjualan (Food + Drink)</p>
                        <p className="mt-2 text-2xl font-bold">{transactions_food.length + transactions_drink.length}</p>
                    </div>
                </div>

                {/* =================== TABEL SUMMARY INGREDIENT =================== */}
                <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                    <h2 className="mb-3 text-lg font-semibold">Rekap Pemakaian Bahan Baku</h2>
                    <div className="max-h-[400px] w-full overflow-auto rounded-lg border">
                        <DataTable
                            columns={[
                                // === Kolom Bahan Baku ===
                                {
                                    accessorKey: 'name', // harus sesuai field data
                                    id: 'name', // id optional tapi bagus dikasih
                                    header: ({ column }) => <DataTableColumnHeader column={column} title="Bahan Baku" />,
                                    cell: ({ getValue }) => <span>{getValue() as unknown as string}</span>,
                                    enableSorting: true,
                                },

                                // === Kolom Quantity (sort by angka) ===
                                {
                                    accessorFn: (row: IngredientSummary) => Number(row.quantity) || 0,
                                    id: 'quantity', // id wajib kalau pakai accessorFn
                                    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
                                    cell: ({ row, getValue }) => {
                                        const qty = getValue() as number;
                                        const unit = (row.original as IngredientSummary).unit;
                                        return formatQty(qty, unit);
                                    },
                                    enableSorting: true,
                                },

                                // === Kolom Cost (sort by angka) ===
                                {
                                    accessorFn: (row: IngredientSummary) => Number(row.cost ?? 0),
                                    id: 'cost',
                                    header: ({ column }) => <DataTableColumnHeader column={column} title="Cost" />,
                                    cell: ({ getValue }) => {
                                        const cost = getValue() as number;
                                        return cost ? formatRupiah(cost) : '-';
                                    },
                                    enableSorting: true,
                                },
                            ]}
                            data={sum_ingredients}
                            enableSearching={true}
                        />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">*Cost dihitung berdasarkan harga bahan baku per unit.</p>
                    {/* Total Cost */}
                    <div className="mt-4 flex justify-end">
                        <span className="font-semibold">Total Cost: </span>
                        <span className="ml-2 font-bold">
                            {formatRupiah(sum_ingredients.reduce((sum, ing) => sum + (ing.cost ? Number(ing.cost) : 0), 0))}
                        </span>
                    </div>
                </div>
                {/* =================== TABEL FOOD & DRINK =================== */}
                <div className="grid gap-4 lg:grid-cols-1">
                    {/* DRINK */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h2 className="mb-3 text-lg font-semibold">Penjualan Drink</h2>
                        <div className="max-h-[350px] w-full overflow-auto rounded-lg border">
                            <DataTable
                                columns={[
                                    { accessorKey: 'menu', header: 'Menu' },
                                    {
                                        accessorKey: 'quantity',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,

                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'base_price',
                                        header: 'Base Price',
                                        cell: (info) => formatRupiah(info.getValue<number>()),
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'variant_price',
                                        header: 'Variant Price',
                                        cell: (info) => formatRupiah(info.getValue<number>()),
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'total_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Price" />,
                                        cell: (info) => formatRupiah(info.getValue<number>()),
                                        enableSorting: true,
                                    },
                                ]}
                                data={transactions_drink}
                                enableSearching={true}
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <span className="font-semibold">Total : </span>
                            <span className="ml-2 font-bold">
                                {formatRupiah(transactions_drink.reduce((sum, item) => sum + Number(item.total_price || 0), 0))}
                            </span>
                        </div>
                    </div>
                    {/* FOOD */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h2 className="mb-3 text-lg font-semibold">Penjualan Food</h2>
                        <div className="max-h-[350px] w-full overflow-auto rounded-lg border">
                            <DataTable
                                columns={[
                                    { accessorKey: 'name', header: 'Menu' },
                                    {
                                        accessorKey: 'quantity',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'base_price',
                                        header: 'Base Price',
                                        cell: (info) => formatRupiah(info.getValue<number>()),
                                        enableSorting: true,
                                    },
                                    {
                                        accessorKey: 'total_price',
                                        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Price" />,
                                        cell: (info) => formatRupiah(info.getValue<number>()),
                                        enableSorting: true,
                                    },
                                ]}
                                data={transactions_food}
                                enableSearching={true}
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <span className="font-semibold">Total : </span>
                            <span className="ml-2 font-bold">
                                {formatRupiah(transactions_food.reduce((sum, item) => sum + Number(item.total_price || 0), 0))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* =================== TABEL UNKNOWN (OPTIONAL) =================== */}
                {transactions_unknown.length > 0 && (
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h2 className="mb-3 text-lg font-semibold">Transaksi Tanpa Kategori (Unknown)</h2>
                        <div className="max-h-[300px] w-full overflow-auto rounded-lg border">
                            <table className="w-full table-auto border-collapse text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold">Menu</th>
                                        <th className="px-3 py-2 text-right font-semibold">Qty</th>
                                        <th className="px-3 py-2 text-right font-semibold">Base Price</th>
                                        <th className="px-3 py-2 text-right font-semibold">Variant Price</th>
                                        <th className="px-3 py-2 text-right font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions_unknown.map((row, idx) => (
                                        <tr key={`${row.name}-${idx}`} className="border-t">
                                            <td className="px-3 py-2">{row.name}</td>
                                            <td className="px-3 py-2 text-right">{row.quantity}</td>
                                            <td className="px-3 py-2 text-right">{formatRupiah(row.base_price)}</td>
                                            <td className="px-3 py-2 text-right">{formatRupiah(row.variant_price)}</td>
                                            <td className="px-3 py-2 text-right">{formatRupiah(row.total_price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
