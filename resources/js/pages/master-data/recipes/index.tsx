import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { BahanBaku, BreadcrumbItem, Menu, Recipe, SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';
import { columns as baseColumns } from './columns';

type RecipesProps = {
    recipes: Recipe[];
    bahanBaku: BahanBaku[];
    menus: Menu[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Recipes', href: '/master-data/recipes' }];

type RowValue = { ingredien_id: number; quantity: number; unit: string };
type FormValues = {
    rows: RowValue[];
    instruction?: string;
    menu_id: number;
};

// ==== Schema
const rowSchema = z.object({
    ingredien_id: z.number({ error: 'Ingredient wajib diisi' }),
    quantity: z.coerce.number().min(0.0001, { error: 'Quantity harus > 0' }),
    unit: z.string().min(1, { error: 'Unit wajib diisi' }),
});
const formSchema = z.object({
    rows: z.array(rowSchema).min(1, { error: 'Minimal satu baris resep' }),
    instruction: z.string().optional().default(''),
    menu_id: z.number({ error: 'Menu wajib dipilih' }),
});

const defaultValues: FormValues = {
    rows: [{ ingredien_id: undefined as unknown as number, quantity: 1, unit: '' }],
    instruction: '',
    menu_id: undefined as unknown as number,
};

export default function RecipesPage({ recipes, bahanBaku, menus }: RecipesProps) {
    const { auth } = usePage<SharedData>().props;

    // ==== Options
    const ingredientOptions = useMemo(() => bahanBaku.map((b) => ({ label: b.name, value: b.id })), [bahanBaku]);
    const unitOptions = useMemo(
        () =>
            Array.from(new Set(bahanBaku.map((b) => b.satuan).filter((u): u is string => typeof u === 'string' && u.trim().length > 0))).map((u) => ({
                label: u,
                value: u,
            })),
        [bahanBaku],
    );

    const menuOptions = useMemo(() => {
        const usedMenuIds = new Set(recipes.map((r) => r.menu_id));
        return menus.filter((m) => !usedMenuIds.has(m.id)).map((m) => ({ label: m.name, value: m.id }));
    }, [menus, recipes]);

    // ==== Form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        mode: 'onChange',
        defaultValues,
    });

    const { control, handleSubmit, reset } = form;
    const { fields, append, remove, replace } = useFieldArray({ control, name: 'rows' });

    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const thead: string[] = ['#', 'Ingredient', 'Quantity', 'Unit', 'Actions'];

    // Handler reset
    const handleReset = () => {
        reset(defaultValues);
        setEditMode(false);
        setEditingId(null);
    };

    // ==== Submit
    const onSubmit = (data: FormValues) => {
        if (editMode && editingId != null) {
            router.put(`/master-data/recipes/${editingId}`, data, {
                preserveScroll: true,
                onSuccess: handleReset,
            });
        } else {
            router.post('/master-data/recipes', data, {
                preserveScroll: true,
                onSuccess: handleReset,
            });
        }
    };

    // Handler edit
    const handleEdit = (recipe: Recipe) => {
        setEditMode(true);
        setEditingId(recipe.id);

        const rows: RowValue[] =
            (recipe as any).bahan_bakus?.map((ing: any) => ({
                ingredien_id: Number(ing.ingredien_id ?? ing.ingredient_id ?? ing.bahan_baku_id ?? ing.id),
                quantity: Number(ing.quantity ?? ing.jumlah ?? 1),
                unit: String(ing.unit ?? ing.satuan ?? ''),
            })) ?? [];

        reset({
            menu_id: recipe.menu_id,
            instruction: recipe.instructions || '',
            rows: rows.length ? rows : [{ ingredien_id: undefined as unknown as number, quantity: 1, unit: '' }],
        });
    };

    // ==== Kolom + Aksi
    const columns = useMemo(() => {
        const cols = [...baseColumns];

        // Tambahkan kolom HPP jika admin
        if (auth.user && auth.user.role && String(auth.user.role).toLowerCase().includes('admin')) {
            cols.push({
                accessorFn: (row) => {
                    const bahanBakuList =
                        row.bahan_bakus?.map((bahan) => {
                            const computedPrice = Math.round((bahan.bahan_baku.harga / bahan.bahan_baku.per_unit) * bahan.jumlah);
                            return {
                                name: bahan.bahan_baku.name,
                                jumlah: bahan.jumlah,
                                satuan: bahan.satuan,
                                price: computedPrice,
                            };
                        }) || [];

                    const totalHpp = bahanBakuList.reduce((sum, bahan) => sum + (Number(bahan.price) || 0), 0);
                    const hargaJual = Number(row.menu?.price || 0);
                    const margin = hargaJual - totalHpp;
                    const marginPercentage = hargaJual > 0 ? ((margin / hargaJual) * 100).toFixed(2) : '0.00';

                    return {
                        bahanBakuList,
                        totalHpp,
                        hargaJual,
                        margin,
                        marginPercentage,
                    };
                },
                id: 'hpp',
                header: 'HPP & Margin',
                cell: ({ getValue }: any) => {
                    const data: {
                        bahanBakuList: { name: string; jumlah: number; satuan: string; price: number }[];
                        totalHpp: number;
                        hargaJual: number;
                        margin: number;
                        marginPercentage: string;
                    } = getValue();

                    const isPositiveMargin = data.margin >= 0;

                    return (
                        <div className="min-w-[250px] space-y-2 text-sm">
                            {/* Detail Bahan Baku */}
                            <div className="space-y-1">
                                {data.bahanBakuList.map((bahan, index) => (
                                    <div key={index} className="flex justify-between text-xs text-muted-foreground">
                                        <span className="font-medium">{bahan.name}</span>
                                        <span>
                                            {bahan.jumlah} {bahan.satuan} = {formatRupiah(bahan.price)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-2" />

                            {/* Total HPP */}
                            <div className="flex justify-between font-semibold">
                                <span>Total HPP:</span>
                                <span className="text-blue-600 dark:text-blue-400">{formatRupiah(data.totalHpp)}</span>
                            </div>

                            {/* Harga Jual */}
                            <div className="flex justify-between font-semibold">
                                <span>Harga Jual:</span>
                                <span className="text-green-600 dark:text-green-400">{formatRupiah(data.hargaJual)}</span>
                            </div>

                            <hr className="my-2" />

                            {/* Margin */}
                            <div className="flex justify-between font-bold">
                                <span>Margin:</span>
                                <span className={isPositiveMargin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                    {formatRupiah(data.margin)}
                                </span>
                            </div>

                            {/* Margin Percentage */}
                            <div className="flex justify-between text-xs font-medium">
                                <span>Persentase:</span>
                                <span className={isPositiveMargin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                    {data.marginPercentage}%
                                </span>
                            </div>
                        </div>
                    );
                },
                enableSorting: false,
            });
        }

        // Kolom Actions
        cols.push({
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }: any) => {
                const recipe = row.original as Recipe;

                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                if (confirm('Yakin ingin menghapus resep ini?')) {
                                    router.delete(`/master-data/recipes/${recipe.id}`, { preserveScroll: true });
                                }
                            }}
                        >
                            Hapus
                        </Button>
                        <Button size="sm" className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => handleEdit(recipe)}>
                            Edit
                        </Button>
                    </div>
                );
            },
        });

        return cols;
    }, [auth.user]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipes" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Recipes</h1>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        {/* Menu */}
                        <FormField
                            control={control}
                            name="menu_id"
                            render={({ field }) => {
                                const currentMenuId = Number(field.value);
                                return (
                                    <FormItem>
                                        <FormLabel>Menu</FormLabel>
                                        <FormControl>
                                            <Select
                                                options={menuOptions}
                                                value={menuOptions.find((opt) => opt.value === currentMenuId) ?? null}
                                                onChange={(opt) => field.onChange(opt ? (opt as { value: number }).value : undefined)}
                                                isDisabled={editMode}
                                                placeholder={
                                                    editMode ? (menus.find((m) => m.id === currentMenuId)?.name ?? 'Pilih menu…') : 'Pilih menu…'
                                                }
                                                menuPosition="fixed"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        {/* Tabel rows */}
                        <div className="w-full overflow-x-auto rounded-lg border">
                            <table className="w-full table-auto border-collapse">
                                <thead className="bg-muted/50 text-center">
                                    <tr>
                                        {thead.map((item) => (
                                            <th key={item} className="px-3 py-2 text-sm font-semibold">
                                                {item}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="text-center">
                                    {fields.map((field, index) => (
                                        <tr key={field.id} className="border-t">
                                            <td className="px-3 py-2">{index + 1}</td>

                                            {/* Ingredient */}
                                            <td className="px-3 py-2">
                                                <FormField
                                                    control={control}
                                                    name={`rows.${index}.ingredien_id`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select
                                                                    options={ingredientOptions}
                                                                    value={
                                                                        ingredientOptions.find(
                                                                            (opt: { value: number }) => opt.value === field.value,
                                                                        ) ?? null
                                                                    }
                                                                    onChange={(opt) =>
                                                                        field.onChange(
                                                                            opt ? (opt as { value: number }).value : (undefined as unknown as number),
                                                                        )
                                                                    }
                                                                    placeholder="Pilih bahan…"
                                                                    menuPosition="fixed"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            {/* Quantity */}
                                            <td className="px-3 py-2">
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
                                                                    onChange={(e) => field.onChange(e.target.value)}
                                                                    placeholder="0"
                                                                    className="text-right"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            {/* Unit */}
                                            <td className="px-3 py-2">
                                                <FormField
                                                    control={control}
                                                    name={`rows.${index}.unit`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select
                                                                    options={unitOptions}
                                                                    value={field.value ? { label: field.value, value: field.value } : null}
                                                                    onChange={(opt) => field.onChange(opt ? (opt as { value: string }).value : '')}
                                                                    placeholder="Pilih unit…"
                                                                    menuPosition="fixed"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>

                                            {/* Actions */}
                                            <td className="px-3 py-2">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    Hapus
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Row actions */}
                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={() => append({ ingredien_id: undefined as unknown as number, quantity: 1, unit: '' })}>
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
                        </div>

                        {/* Instruction */}
                        <FormField
                            control={control}
                            name="instruction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instruksi</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Langkah-langkah pembuatan…" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <div className="flex justify-end gap-2">
                            {editMode && (
                                <Button type="button" variant="secondary" onClick={handleReset}>
                                    Batal
                                </Button>
                            )}
                            <Button type="submit">{editMode ? 'Update Resep' : 'Simpan Resep'}</Button>
                        </div>
                    </form>
                </Form>

                {/* DataTable */}
                <div className="relative w-full overflow-hidden rounded-xl border">
                    <div className="px-4 py-8 md:px-8">
                        <DataTable columns={columns} data={recipes} filterColumn={['menu_name']} enableSearching />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
