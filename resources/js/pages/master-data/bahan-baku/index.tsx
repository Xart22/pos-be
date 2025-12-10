// pages/BahanBakuPage.tsx
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { convertToRupiah } from '@/lib/utils';
import { BahanBaku, BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { z } from 'zod';
import { columns as baseColumns } from './columns';

const formSchema = z.object({
    kode: z
        .string()
        .min(1, 'Kode wajib diisi')
        .transform((v) => v.toUpperCase()),
    name: z.string().min(4, 'Nama wajib diisi'),
    harga: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    stock: z.coerce.number().min(0, 'Stock tidak boleh negatif'),
    satuan: z.string().min(1, 'Satuan wajib dipilih'),
    deskripsi: z.string().optional().default(''),
    per_unit: z.coerce.number().min(0, 'Per Unit tidak boleh negatif'),
});

type FormValues = z.infer<typeof formSchema>;

type BahanBakuProps = {
    bahanBakus: BahanBaku[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Bahan Baku', href: '/master-data/bahan-baku' }];

// Default values untuk form
const defaultValues: FormValues = {
    kode: '',
    name: '',
    harga: 0,
    stock: 0,
    satuan: '',
    deskripsi: '',
    per_unit: 0,
};

export default function BahanBakuPage({ bahanBakus }: BahanBakuProps) {
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        mode: 'onChange',
        defaultValues, // Tambahkan default values
    });

    const { control, handleSubmit, reset, formState } = form;
    const { isSubmitting } = formState;

    // Handler untuk reset form
    const handleReset = () => {
        reset(defaultValues);
        setEditMode(false);
        setEditingId(null);
    };

    const onSubmit = (data: FormValues) => {
        if (editMode && editingId) {
            router.put(`/master-data/bahan-baku/${editingId}`, data, {
                preserveScroll: true,
                onSuccess: () => {
                    handleReset();
                },
            });
        } else {
            router.post('/master-data/bahan-baku', data, {
                preserveScroll: true,
                onSuccess: () => {
                    handleReset();
                },
            });
        }
    };

    // Handler untuk edit
    const handleEdit = (bb: BahanBaku) => {
        setEditMode(true);
        setEditingId(bb.kode ?? null);

        //scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reset dengan data yang akan diedit
        reset({
            kode: bb.kode ?? '',
            name: bb.name ?? '',
            harga: Number(bb.harga ?? 0),
            stock: Number(bb.stock ?? 0),
            satuan: bb.satuan ?? '',
            deskripsi: bb.deskripsi ?? '',
            per_unit: Number(bb.per_unit ?? 0),
        });
    };

    // === Columns + Actions ===
    const columns = useMemo(() => {
        return [
            ...baseColumns,
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }: any) => {
                    const bb = row.original as BahanBaku;
                    return (
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    if (confirm(`Hapus bahan baku ${bb.name}?`)) {
                                        router.delete(`/master-data/bahan-baku/${bb.id}`, { preserveScroll: true });
                                    }
                                }}
                            >
                                Hapus
                            </Button>
                            <Button className="bg-yellow-500 text-white hover:bg-yellow-600" size="sm" onClick={() => handleEdit(bb)}>
                                Edit
                            </Button>
                        </div>
                    );
                },
            },
        ];
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bahan Baku" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Bahan Baku</h1>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={control}
                                name="kode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kode</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} placeholder="Contoh: CRM001" disabled={editMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Contoh: Creamer" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="harga"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                step="any"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(val === '' ? '' : val);
                                                }}
                                                placeholder="Contoh: 50000"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                inputMode="numeric"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(val === '' ? '' : val);
                                                }}
                                                placeholder="Contoh: 1000"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="satuan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Satuan</FormLabel>
                                        <FormControl>
                                            <Select value={field.value ?? ''} onValueChange={field.onChange}>
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="per_unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Per Unit</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                inputMode="numeric"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(val === '' ? '' : val);
                                                }}
                                                placeholder="Contoh: 250"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="deskripsi"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Opsional: keterangan bahan baku" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            {editMode ? (
                                <span className="text-sm text-muted-foreground">Mode edit{editingId ? ` (Kode: ${editingId})` : ''}</span>
                            ) : (
                                <span />
                            )}
                            <div className="flex gap-2">
                                {editMode && (
                                    <Button type="button" variant="secondary" onClick={handleReset} disabled={isSubmitting}>
                                        Batal
                                    </Button>
                                )}
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Menyimpan…' : editMode ? 'Update' : 'Simpan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>

                {/* === Table === */}
                <div className="mt-6 rounded-xl border border-border">
                    <div className="px-4 py-8 md:px-8">
                        {/* estimasi assets */}
                        <div className="mb-4 flex justify-end gap-4">
                            <div className="mb-4 text-sm font-medium text-muted-foreground">
                                Estimasi Assets: {convertToRupiah(bahanBakus.reduce((acc, bahan) => acc + (bahan.total || 0), 0).toFixed(0), 'Rp. ')}
                            </div>
                            <div className="mb-4 text-sm font-medium text-muted-foreground">
                                Estimasi Omset:
                                {/* margin 60% */}
                                {convertToRupiah((bahanBakus.reduce((acc, bahan) => acc + (bahan.total || 0), 0) * 1.6).toFixed(0), 'Rp. ')}
                            </div>
                        </div>
                        <DataTable columns={columns} data={bahanBakus} filterColumn={['kode', 'name']} enableSearching />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
