// pages/BahanBakuPage.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Operational } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema validasi
const formSchema = z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    harga: z.string().min(1, 'Harga wajib diisi'),
    deskripsi: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type OperationalProps = {
    operationals: Operational[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Operational',
        href: '/cash-flow/operational',
    },
];

export default function OperationalPage({ operationals }: OperationalProps) {
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
            <Head title="Operational" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Operational</h1>

                {/* === Form Input Bahan Baku Baru === */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block">Nama</label>
                            <Input {...register('name')} placeholder="Contoh: Listrik" />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block">Harga</label>
                            <Input type="number" {...register('harga')} placeholder="Contoh: 50000" />
                            {errors.harga && <p className="text-sm text-red-500">{errors.harga.message}</p>}
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
                        Total :
                        {operationals
                            .reduce((sum, item) => sum + Number(item.price), 0)
                            .toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
