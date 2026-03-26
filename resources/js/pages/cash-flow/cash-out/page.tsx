import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo } from 'react';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { cashOutColumns } from '@/pages/report/colums';
import { BahanBaku, BreadcrumbItem, CashOut } from '@/types';

type CashOutProps = {
    bahanBaku: BahanBaku[];
    cashOutData: CashOut[]; // Tambahkan tipe untuk data cash out
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Cash Out', href: '/cash-flow/cash-out' }];

// ==== Schema
const rowSchema = z.object({
    bahan_baku_id: z.number({ error: 'Bahan baku wajib dipilih' }).min(1, { message: 'Bahan baku wajib dipilih' }),
    quantity: z.coerce.number({ error: 'Quantity harus berupa angka' }).gt(0, { message: 'Quantity harus > 0' }),
    satuan: z.string({ error: 'Satuan wajib diisi' }).min(1, { message: 'Satuan wajib diisi' }),
    harga: z.coerce.number({ error: 'Harga harus berupa angka' }).gt(0, { message: 'Harga harus > 0' }),
    total: z.coerce.number({ error: 'Total harus berupa angka' }).gt(0, { message: 'Total harus > 0' }),
});

const formSchema = z.object({
    tanggal: z.string({ error: 'Tanggal wajib diisi' }).min(1, { message: 'Tanggal wajib diisi' }),
    rows: z.array(rowSchema).optional(),
    total: z.coerce.number({ error: 'Total harus berupa angka' }).min(0, { message: 'Total harus >= 0' }),
    description: z.string({ error: 'Deskripsi wajib diisi' }).min(1, { message: 'Deskripsi wajib diisi' }),
    kategori: z.string(),
    source: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const createDefaultRow = () => ({
    bahan_baku_id: 0,
    quantity: 0,
    satuan: '',
    harga: 0,
    total: 0,
});

const createDefaultValues = (): FormValues => ({
    tanggal: new Date().toLocaleDateString('ID-id', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'),
    rows: [createDefaultRow()],
    total: 0,
    description: '',
    kategori: '',
    source: '',
});

export default function CashOutPage({ bahanBaku, cashOutData }: CashOutProps) {
    // Options select bahan baku
    const ingredientOptions = useMemo(
        () =>
            bahanBaku.map((b) => ({
                label: b.name,
                value: b.id,
            })),
        [bahanBaku],
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        mode: 'onChange',
        defaultValues: createDefaultValues(),
    });

    const { control, handleSubmit, reset, watch, setValue, getValues } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'rows',
    });

    // Watch ALL rows - ini penting untuk trigger recalculation
    const watchedRows = watch('rows');

    // Hitung grand total otomatis dari semua baris
    // Gunakan JSON.stringify untuk deep comparison agar perubahan nilai di dalam rows ter-detect
    const grandTotal = useMemo(() => {
        if (!watchedRows || watchedRows.length === 0) return 0;

        const total = watchedRows.reduce((acc: number, row: any) => {
            const rowTotal = Number(row?.total ?? 0);
            return acc + (isNaN(rowTotal) ? 0 : rowTotal);
        }, 0);

        return total;
    }, [JSON.stringify(watchedRows)]);

    // Sinkronkan grandTotal ke field "total" secara otomatis
    useEffect(() => {
        setValue('total', grandTotal, { shouldDirty: false });
    }, [grandTotal, setValue]);

    const handleReset = useCallback(() => {
        reset(createDefaultValues());
    }, [reset]);

    // Helper function untuk menghitung total per baris
    const calculateRowTotal = useCallback(
        (quantity: number, harga: number, bahanId: number) => {
            const bahan = bahanBaku.find((b) => b.id === bahanId);
            if (bahan && bahanId > 0) {
                const realQty = bahan.per_unit > 0 ? quantity / bahan.per_unit : quantity;
                const total = harga * realQty;
                return total;
            }
            return 0;
        },
        [bahanBaku],
    );

    const onSubmit = (data: FormValues) => {
        const payload: FormValues = {
            ...data,
            rows: data.rows?.map((r) => ({
                ...r,
                bahan_baku_id: Number(r.bahan_baku_id),
                quantity: Number(r.quantity),
                harga: Number(r.harga),
                total: Number(r.total),
            })),
            total: Number(data.total),
        };

        router.post('/cash-flow/cash-out', payload, {
            preserveScroll: true,
            onSuccess: handleReset,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cash Out" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Cash Out</h1>
                    <p className="text-sm text-muted-foreground">Catat pengeluaran bahan baku dengan rapi dan biarkan sistem yang hitung totalnya.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        {/* TANGGAL */}
                        <FormField
                            control={control}
                            name="tanggal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* TABLE */}
                        <div className="w-full overflow-x-auto rounded-lg border bg-muted/10">
                            <table className="w-full table-auto border-collapse text-sm">
                                <thead className="bg-muted/60 text-center">
                                    <tr className="border-b">
                                        {['#', 'Bahan Baku', 'Quantity', 'Unit', 'Harga', 'Total', 'Actions'].map((item) => (
                                            <th key={item} className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                {item}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {fields.map((fieldItem, index) => {
                                        const selectedId = watch(`rows.${index}.bahan_baku_id`);
                                        const selectedBahan = bahanBaku.find((b) => b.id === selectedId);

                                        return (
                                            <tr key={fieldItem.id} className="border-t transition-colors hover:bg-muted/40">
                                                {/* # */}
                                                <td className="px-3 py-2 align-middle text-xs font-medium text-muted-foreground">{index + 1}</td>

                                                {/* BAHAN BAKU */}
                                                <td className="min-w-[220px] px-3 py-2 align-middle">
                                                    <FormField
                                                        control={control}
                                                        name={`rows.${index}.bahan_baku_id`}
                                                        render={({ field }) => (
                                                            <FormItem className="text-left">
                                                                <FormControl>
                                                                    <Select
                                                                        options={ingredientOptions}
                                                                        value={ingredientOptions.find((opt) => opt.value === field.value) ?? null}
                                                                        onChange={(option) => {
                                                                            const value = option?.value ?? 0;
                                                                            field.onChange(value);

                                                                            const bahan = bahanBaku.find((b) => b.id === value);
                                                                            const qty = Number(watch(`rows.${index}.quantity`)) || 0;

                                                                            if (bahan) {
                                                                                setValue(`rows.${index}.satuan`, bahan.satuan);
                                                                                setValue(`rows.${index}.harga`, bahan.harga);

                                                                                const total = calculateRowTotal(qty, bahan.harga, value);
                                                                                setValue(`rows.${index}.total`, total);
                                                                            } else {
                                                                                setValue(`rows.${index}.satuan`, '');
                                                                                setValue(`rows.${index}.harga`, 0);
                                                                                setValue(`rows.${index}.total`, 0);
                                                                            }
                                                                        }}
                                                                        placeholder="Pilih bahan…"
                                                                        menuPosition="fixed"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>

                                                {/* QUANTITY */}
                                                <td className="min-w-[120px] px-3 py-2 align-middle">
                                                    <FormField
                                                        control={control}
                                                        name={`rows.${index}.quantity`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        inputMode="decimal"
                                                                        value={field.value ?? ''}
                                                                        onChange={(e) => {
                                                                            const quantity = Number(e.target.value) || 0;
                                                                            field.onChange(quantity);

                                                                            const harga = Number(watch(`rows.${index}.harga`)) || 0;
                                                                            const bahanId = Number(watch(`rows.${index}.bahan_baku_id`)) || 0;

                                                                            const total = calculateRowTotal(quantity, harga, bahanId);
                                                                            setValue(`rows.${index}.total`, total);
                                                                        }}
                                                                        placeholder="0"
                                                                        className="text-right"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>

                                                {/* UNIT */}
                                                <td className="min-w-[100px] px-3 py-2 align-middle">
                                                    <FormField
                                                        control={control}
                                                        name={`rows.${index}.satuan`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="text"
                                                                        value={field.value ?? ''}
                                                                        readOnly
                                                                        className="bg-muted/60 text-center"
                                                                        placeholder="Satuan"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>

                                                {/* HARGA */}
                                                <td className="min-w-[140px] px-3 py-2 align-middle">
                                                    <FormField
                                                        control={control}
                                                        name={`rows.${index}.harga`}
                                                        render={({ field }) => (
                                                            <FormItem className="text-left">
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        value={field.value ?? ''}
                                                                        onChange={(e) => {
                                                                            const harga = Number(e.target.value) || 0;
                                                                            field.onChange(harga);

                                                                            const quantity = Number(watch(`rows.${index}.quantity`)) || 0;
                                                                            const bahanId = Number(watch(`rows.${index}.bahan_baku_id`)) || 0;

                                                                            const total = calculateRowTotal(quantity, harga, bahanId);
                                                                            setValue(`rows.${index}.total`, total);
                                                                        }}
                                                                        placeholder="Harga"
                                                                        className="text-right"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>

                                                {/* TOTAL */}
                                                <td className="min-w-[160px] px-3 py-2 align-middle">
                                                    <FormField
                                                        control={control}
                                                        name={`rows.${index}.total`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="text"
                                                                        value={field.value ? formatRupiah(Number(field.value)) : ''}
                                                                        readOnly
                                                                        className="bg-muted/60 text-right font-semibold"
                                                                        placeholder="Total"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="px-3 py-2 align-middle">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        disabled={fields.length === 1}
                                                    >
                                                        ✕
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* GRAND TOTAL DISPLAY */}
                        <div className="flex flex-col items-end gap-1 rounded-lg bg-muted/40 px-4 py-3">
                            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Grand Total</span>
                            <span className="text-2xl font-bold">{formatRupiah(grandTotal)}</span>
                        </div>

                        {/* BARIS ACTIONS */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Button type="button" onClick={() => append(createDefaultRow())}>
                                Tambah Baris
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fields.length > 1 && remove(fields.length - 1)}
                                disabled={fields.length === 1}
                            >
                                Hapus Baris Terakhir
                            </Button>
                            <Button type="button" variant="outline" onClick={handleReset} className="ml-auto">
                                Reset Form
                            </Button>
                        </div>

                        {/* KATEGORI */}
                        <FormField
                            control={control}
                            name="kategori"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <FormControl>
                                        <Select
                                            options={[
                                                { label: 'Operasional', value: 'Operasional' },
                                                { label: 'RND', value: 'RND' },
                                                { label: 'Dapur', value: 'Kitchen' },
                                                { label: 'Bar', value: 'Bar' },
                                            ]}
                                            value={
                                                [
                                                    { label: 'Operasional', value: 'Operasional' },
                                                    { label: 'RND', value: 'RND' },
                                                    { label: 'Dapur', value: 'Kitchen' },
                                                    { label: 'Bar', value: 'Bar' },
                                                ].find((opt) => opt.value === field.value) ?? null
                                            }
                                            onChange={(option) => {
                                                const value = option?.value ?? '';
                                                field.onChange(value);
                                            }}
                                            placeholder="Pilih kategori…"
                                            menuPosition="fixed"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* KATEGORI */}
                        <FormField
                            control={control}
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sumber Dana</FormLabel>
                                    <FormControl>
                                        <Select
                                            options={[
                                                { label: 'Cash', value: 'Cash' },
                                                { label: 'Debit', value: 'Debit' },
                                            ]}
                                            value={
                                                [
                                                    { label: 'Cash', value: 'Cash' },
                                                    { label: 'Debit', value: 'Debit' },
                                                ].find((opt) => opt.value === field.value) ?? null
                                            }
                                            onChange={(option) => {
                                                const value = option?.value ?? '';
                                                field.onChange(value);
                                            }}
                                            placeholder="Pilih sumber dana…"
                                            menuPosition="fixed"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* DESCRIPTION */}
                        <FormField
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Contoh: Belanja harian bahan baku tanggal xx/xx/xxxx"
                                            className="min-h-[90px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* TOTAL (sinkron dengan grandTotal, read-only) */}
                        <FormField
                            control={control}
                            name="total"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Cash Out</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={grandTotal} readOnly className="bg-muted/60 font-semibold" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="submit">Simpan Cash Out</Button>
                        </div>
                    </form>
                </Form>{' '}
                <div className="rounded-xl border bg-card">
                    <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
                        <div>
                            <h2 className="text-lg font-semibold">Laporan Cash Out</h2>
                            <p className="text-xs text-muted-foreground">Rekap pengeluaran kas (cash out) selama periode ini.</p>
                        </div>
                    </div>

                    <div className="px-2 pt-2 pb-4 md:px-6 md:pb-6">
                        <DataTable columns={cashOutColumns} data={cashOutData} enableSearching={true} />
                        <div className="mt-4 flex flex-row justify-end gap-6">
                            <span className="text-sm font-semibold">
                                Total Cash :
                                {formatRupiah(cashOutData.reduce((sum, record) => (record.source === 'Cash' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Debit :
                                {formatRupiah(cashOutData.reduce((sum, record) => (record.source === 'Debit' ? sum + record.amount : sum), 0))}
                            </span>
                        </div>
                        <div className="mt-4 flex flex-row justify-end gap-6">
                            <span className="text-sm font-semibold">
                                Total Bar :
                                {formatRupiah(cashOutData.reduce((sum, record) => (record.kategori === 'Bar' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Kitchen :
                                {formatRupiah(cashOutData.reduce((sum, record) => (record.kategori === 'Kitchen' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Operasional :
                                {formatRupiah(
                                    cashOutData.reduce((sum, record) => (record.kategori === 'Operasional' ? sum + record.amount : sum), 0),
                                )}
                            </span>
                            <span className="text-sm font-semibold">
                                Total RND :
                                {formatRupiah(cashOutData.reduce((sum, record) => (record.kategori === 'RND' ? sum + record.amount : sum), 0))}
                            </span>
                            <span className="text-sm font-semibold">
                                Total Cash Out :{formatRupiah(cashOutData.reduce((sum, record) => sum + Number(record.amount), 0))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
