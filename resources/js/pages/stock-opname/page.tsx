import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';

type UsedIngredient = {
    bahan_baku_id: number;
    name: string;
    unit: string;
    quantity: number;
};

type StockRow = {
    name: string;
    category: number | null;
    quantity: number;
    base_price: number;
    variant_price: number;
    total_price: number;
    variants: any[];
    recipe: any;
    used_ingredients: UsedIngredient[];
    menu: string;
};

type IngredientSummary = {
    bahan_baku_id: number;
    name: string;
    unit: string;
    quantity: number;
};

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

    // ====== HELPER FORMAT QTY ======
    const formatQty = (qty: number, unit?: string) => `${qty % 1 === 0 ? qty.toFixed(0) : qty.toFixed(2)}${unit ? ' ' + unit : ''}`;

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
                        <table className="w-full table-auto border-collapse text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold">#</th>
                                    <th className="px-3 py-2 text-left font-semibold">Bahan Baku</th>
                                    <th className="px-3 py-2 text-right font-semibold">Quantity</th>
                                    <th className="px-3 py-2 text-left font-semibold">Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sum_ingredients.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">
                                            Belum ada pemakaian bahan baku pada periode ini.
                                        </td>
                                    </tr>
                                )}
                                {sum_ingredients.map((ing, idx) => (
                                    <tr key={ing.bahan_baku_id} className="border-t">
                                        <td className="px-3 py-2">{idx + 1}</td>
                                        <td className="px-3 py-2">{ing.name}</td>
                                        <td className="px-3 py-2 text-right">{formatQty(Number(ing.quantity), ing.unit)}</td>
                                        <td className="px-3 py-2">{ing.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* =================== TABEL FOOD & DRINK =================== */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* FOOD */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h2 className="mb-3 text-lg font-semibold">Penjualan Food</h2>
                        <div className="max-h-[350px] w-full overflow-auto rounded-lg border">
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
                                    {transactions_food.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">
                                                Tidak ada transaksi food pada periode ini.
                                            </td>
                                        </tr>
                                    )}
                                    {transactions_food.map((row, idx) => (
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

                    {/* DRINK */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <h2 className="mb-3 text-lg font-semibold">Penjualan Drink</h2>
                        <div className="max-h-[350px] w-full overflow-auto rounded-lg border">
                            <DataTable
                                columns={[
                                    { accessorKey: 'menu', header: 'Menu' },
                                    { accessorKey: 'quantity', header: 'Qty', cell: (info) => info.getValue<number>().toString() },
                                    { accessorKey: 'base_price', header: 'Base Price', cell: (info) => formatRupiah(info.getValue<number>()) },
                                    { accessorKey: 'variant_price', header: 'Variant Price', cell: (info) => formatRupiah(info.getValue<number>()) },
                                    { accessorKey: 'total_price', header: 'Total', cell: (info) => formatRupiah(info.getValue<number>()) },
                                ]}
                                data={transactions_drink}
                                enableSearching={true}
                            />
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
