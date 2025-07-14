// pages/BahanBakuPage.tsx
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BahanBaku, BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { columns } from './columns';

// Schema validasi
const formSchema = z.object({
    kode: z.string().min(1, 'Kode wajib diisi'),
    name: z.string().min(1, 'Nama wajib diisi'),
    harga: z.string().min(1, 'Harga wajib diisi'),
    stock: z.string().min(1, 'Stock wajib diisi'),
    satuan: z.string().min(1, 'Satuan wajib diisi'),
    deskripsi: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type BahanBakuProps = {
    bahanBakus: BahanBaku[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bahan Baku',
        href: '/master-data/bahan-baku',
    },
];

export default function BahanBakuPage({ bahanBakus }: BahanBakuProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            // TODO: Ganti dengan request ke backend
            console.log('Data dikirim:', data);
            // reset form setelah submit
            reset();
        } catch (error) {
            console.error('Gagal kirim:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bahan Baku" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Bahan Baku</h1>

                {/* === Form Input Bahan Baku Baru === */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block">Kode</label>
                            <Input
                                {...register('kode')}
                                placeholder="Contoh: CRM001"
                                onChange={(e) => (e.target.value = e.target.value.toUpperCase())}
                            />
                            {errors.kode && <p className="text-sm text-red-500">{errors.kode.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block">Nama</label>
                            <Input {...register('name')} placeholder="Contoh: Creamer" />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block">Harga</label>
                            <Input type="number" {...register('harga')} placeholder="Contoh: 50000" />
                            {errors.harga && <p className="text-sm text-red-500">{errors.harga.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block">Stock</label>
                            <Input type="number" {...register('stock')} placeholder="Contoh: 1000" />
                            {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block">Satuan</label>
                            <Controller
                                control={control}
                                name="satuan"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih satuan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mililiter">Mililiter</SelectItem>
                                            <SelectItem value="Gram">Gram</SelectItem>
                                            <SelectItem value="Kilogram">Kilogram</SelectItem>
                                            <SelectItem value="Pcs">Pcs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.satuan && <p className="text-sm text-red-500">{errors.satuan.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block">Deskripsi</label>
                            <Textarea {...register('deskripsi')} placeholder="Opsional: keterangan bahan baku" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>

                {/* === Table Daftar Bahan Baku === */}
                <div className="mt-6 rounded-xl border border-border">
                    <div className="px-4 py-8 md:px-8">
                        <DataTable columns={columns} data={bahanBakus} filterColumn={['kode', 'name', 'satuan']} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
