// pages/BahanBakuPage.tsx
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BahanBaku, BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { z } from 'zod';
import { columns as baseColumns } from './columns';

// --- Schema: gunakan number & uppercase transform untuk kode
const formSchema = z.object({
    kode: z
        .string()
        .min(1, 'Kode wajib diisi')
        .transform((v) => v.toUpperCase()),
    name: z.string().min(1, 'Nama wajib diisi'),
    harga: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    stock: z.coerce.number().min(0, 'Stock tidak boleh negatif'),
    satuan: z.string().min(1, 'Satuan wajib dipilih'),
    deskripsi: z.string().optional().default(''),
});

type FormValues = z.infer<typeof formSchema>;

type BahanBakuProps = {
    bahanBakus: BahanBaku[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Bahan Baku', href: '/master-data/bahan-baku' }];

export default function BahanBakuPage({ bahanBakus }: BahanBakuProps) {
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues: {
            kode: '',
            name: '',
            harga: 0,
            stock: 0,
            satuan: undefined as unknown as FormValues['satuan'],
            deskripsi: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (data: FormValues) => {
        // data.kode sudah di-transform uppercase oleh zod
        try {
            if (editMode) {
                if (editingId != null) {
                    router.put(`/master-data/bahan-baku/${editingId}`, data, {
                        preserveScroll: true,
                        onSuccess: () => {
                            reset();
                            setEditMode(false);
                            setEditingId(null);
                        },
                    });
                } else {
                    router.put(`/master-data/bahan-baku/${data.kode}`, data, {
                        preserveScroll: true,
                        onSuccess: () => {
                            reset();
                            setEditMode(false);
                        },
                    });
                }
            } else {
                router.post('/master-data/bahan-baku', data, {
                    preserveScroll: true,
                    onSuccess: () => reset(),
                });
            }
        } catch (err) {
            console.error('Gagal kirim:', err);
        }
    };

    // --- Kolom tabel + kolom aksi, tanpa memutasi `columns` global
    const columns = useMemo(() => {
        return [
            ...baseColumns,
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }: any) => {
                    const bahanBaku = row.original as BahanBaku;
                    return (
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    if (confirm(`Hapus bahan baku ${bahanBaku.name}?`)) {
                                        router.delete(`/master-data/bahan-baku/${bahanBaku.id}`, {
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                            >
                                Hapus
                            </Button>
                            <Button
                                className="bg-yellow-500 text-white hover:bg-yellow-600"
                                size="sm"
                                onClick={() => {
                                    setEditMode(true);
                                    setEditingId(bahanBaku.kode ?? null); // jika backend update by id
                                    reset({
                                        kode: bahanBaku.kode ?? '',
                                        name: bahanBaku.name ?? '',
                                        harga: Number(bahanBaku.harga ?? 0),
                                        stock: Number(bahanBaku.stock ?? 0),
                                        satuan: (bahanBaku.satuan as FormValues['satuan']) ?? undefined,
                                        deskripsi: bahanBaku.deskripsi ?? '',
                                    });
                                }}
                            >
                                Edit
                            </Button>
                        </div>
                    );
                },
            },
        ];
    }, [reset]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bahan Baku" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Bahan Baku</h1>

                {/* === Form Input / Edit Bahan Baku === */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Kode: pakai Controller agar UI selalu uppercase tanpa ngoprek DOM */}
                        <div>
                            <label className="mb-1 block">Kode</label>
                            <Controller
                                control={control}
                                name="kode"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        placeholder="Contoh: CRM001"
                                    />
                                )}
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
                            <Controller
                                control={control}
                                name="harga"
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        inputMode="decimal"
                                        step="any"
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder="Contoh: 50000"
                                    />
                                )}
                            />
                            {errors.harga && <p className="text-sm text-red-500">{errors.harga.message}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block">Stock</label>
                            <Controller
                                control={control}
                                name="stock"
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder="Contoh: 1000"
                                    />
                                )}
                            />
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

                    <div className="flex items-center justify-between">
                        {editMode ? (
                            <span className="text-sm text-muted-foreground">Mode edit{editingId ? ` (ID: ${editingId})` : ''}</span>
                        ) : (
                            <span />
                        )}
                        <div className="flex gap-2">
                            {editMode && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        reset();
                                        setEditMode(false);
                                        setEditingId(null);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </Button>
                            )}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Menyimpan…' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* === Tabel Daftar Bahan Baku === */}
                <div className="mt-6 rounded-xl border border-border">
                    <div className="px-4 py-8 md:px-8">
                        <DataTable columns={columns} data={bahanBakus} filterColumn={['kode', 'name', 'satuan']} enableSearching />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
