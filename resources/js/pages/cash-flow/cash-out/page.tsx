// pages/CashoutPage.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BahanBaku } from '@/types';
import Select from 'react-select';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

// Server props
export type CashoutProps = {
    cashouts: unknown[]; // TODO: replace with concrete type when table is implemented
    bahanBaku: BahanBaku[];
};

// ===== Validation =====
const formSchema = z.object({
    // keep as string for react-select compatibility, coerce on submit if backend expects number
    bahan_baku_id: z.string().min(1, 'Bahan Baku wajib dipilih'),
    harga: z
        .union([z.string().min(1, 'Harga wajib diisi'), z.number()])
        .transform((val) => (typeof val === 'string' ? Number(val) : val))
        .pipe(z.number({ message: 'Harga harus berupa angka' }).positive('Harga harus lebih dari 0')),
    deskripsi: z.string().optional(),
    qty: z.number().optional(),
    satuan: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

// ===== Breadcrumbs =====
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cash Flow', href: '/cash-flow' },
    { title: 'Cashout', href: '/cash-flow/cashout' },
];

// ===== Component =====
export default function CashoutPage({ cashouts, bahanBaku }: CashoutProps) {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
        defaultValues: {
            bahan_baku_id: '',
            harga: 0,
            deskripsi: '',
        },
    });

    const options = useMemo(
        () =>
            bahanBaku.map((bahan) => ({
                value: String(bahan.id),
                label: bahan.name + ' - ' + bahan.kode + ' (Stock: ' + bahan.stock + ' ' + bahan.satuan + ')',
            })),
        [bahanBaku],
    );

    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            // If your backend expects number for bahan_baku_id, parse it here
            const payload = {
                ...values,
                bahan_baku_id: values.bahan_baku_id, // change to Number(values.bahan_baku_id) if needed
            };

            // Inertia request (adjust endpoint to your backend route)
            router.post('/cash-flow/cashout', payload, {
                onSuccess: () => reset(),
                onFinish: () => setLoading(false),
            });
        } catch (err) {
            console.error('Gagal mengirim data', err);
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cashout" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Cashout</h1>

                {/* === Form Input Cashout === */}
                <form className="space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="bahan_baku_id" className="mb-1 block">
                                Bahan Baku
                            </label>
                            <Controller
                                name="bahan_baku_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        inputId="bahan_baku_id"
                                        isDisabled={loading}
                                        options={options}
                                        placeholder="Pilih Bahan Baku"
                                        value={options.find((o) => o.value === field.value) || null}
                                        onChange={(opt) => field.onChange(opt ? (opt as any).value : '')}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                            {errors.bahan_baku_id && <p className="text-sm text-red-500">{errors.bahan_baku_id.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="harga" className="mb-1 block">
                                Harga
                            </label>
                            <Input id="harga" type="number" step="1" disabled={loading} placeholder="Contoh: 50000" {...register('harga')} />
                            {errors.harga && <p className="text-sm text-red-500">{errors.harga.message as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="qty" className="mb-1 block">
                                Qty
                            </label>
                            <Input id="qty" type="number" step="1" disabled={loading} placeholder="Contoh: 100" {...register('qty')} />
                            {errors.qty && <p className="text-sm text-red-500">{errors.qty.message as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="satuan" className="mb-1 block">
                                Satuan
                            </label>
                            <Input id="satuan" type="text" disabled={loading} placeholder="Contoh: kg" {...register('satuan')} />
                            {errors.satuan && <p className="text-sm text-red-500">{errors.satuan.message as string}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="deskripsi" className="mb-1 block">
                                Deskripsi
                            </label>
                            <Textarea id="deskripsi" disabled={loading} placeholder="Opsional: keterangan bahan baku" {...register('deskripsi')} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Menyimpan…' : 'Simpan'}
                        </Button>
                    </div>
                </form>

                {/* === Table Daftar Cashout === */}
                <div className="mt-6 rounded-xl border border-border">
                    <div className="px-4 py-8 md:px-8">
                        {/* TODO: Implement DataTable here */}
                        {/* <DataTable columns={columns} data={cashouts} filterColumn={["kode", "name", "satuan"]} /> */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
