import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';

import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { BahanBaku, BreadcrumbItem, Menu, Recipe, SharedData } from '@/types';
import { columns as baseColumns } from './columns';

type RecipesProps = {
    recipes: Recipe[];
    bahanBaku: BahanBaku[];
    menus: Menu[];
    variantOptions: { id: number; name: string; price: number }[];
};
type HppCellData = {
    bahanBakuList: {
        name: string;
        jumlah: number;
        satuan: string;
        price: number;
    }[];
    totalHpp: number;
    hargaJual: number;
    margin: number;
    marginPercentage: string;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Recipes', href: '/master-data/recipes' }];

// ==== Schema
const rowSchema = z.object({
    ingredien_id: z
        .number({
            error: 'Ingredient wajib diisi',
        })
        .min(1, { message: 'Ingredient wajib dipilih' }),
    quantity: z.coerce
        .number({
            error: 'Quantity harus berupa angka',
        })
        .gt(0, { message: 'Quantity harus > 0' }),
    unit: z
        .string({
            error: 'Unit wajib diisi',
        })
        .min(1, { message: 'Unit wajib diisi' }),
});

const formSchema = z.object({
    menu_id: z
        .number({
            error: 'Menu wajib dipilih',
        })
        .min(1, { message: 'Menu wajib dipilih' }),
    variant_id: z.number().optional(),
    instruction: z.string().optional().default(''),
    rows: z.array(rowSchema).min(1, { message: 'Minimal satu baris resep' }),
});

type FormValues = z.infer<typeof formSchema>;

const createDefaultValues = (): FormValues => ({
    menu_id: 0, // invalid sampai user pilih menu
    variant_id: undefined,
    instruction: '',
    rows: [
        {
            ingredien_id: 0,
            quantity: 1,
            unit: '',
        },
    ],
});

export default function RecipesPage({ recipes, bahanBaku, menus, variantOptions }: RecipesProps) {
    const { auth } = usePage<SharedData>().props;

    // ==== Options (memoized)
    const ingredientOptions = useMemo(
        () =>
            bahanBaku.map((b) => ({
                label: b.name,
                value: b.id,
            })),
        [bahanBaku],
    );

    const unitOptions = useMemo(() => {
        const units = Array.from(new Set(bahanBaku.map((b) => b.satuan).filter((u): u is string => typeof u === 'string' && u.trim().length > 0)));

        return units.map((u) => ({
            label: u,
            value: u,
        }));
    }, [bahanBaku]);

    const menuOptions = useMemo(
        () =>
            menus.map((m) => ({
                label: m.name,
                value: m.id,
            })),
        [menus],
    );

    const isAdmin = useMemo(() => {
        const role = auth.user?.role;
        if (!role) return false;

        if (typeof role === 'string') {
            return role.toLowerCase().includes('admin');
        }

        // kalau role object, misalnya { name: 'Admin' }
        const name = (role as any).name ?? '';
        return String(name).toLowerCase().includes('admin');
    }, [auth.user]);

    // ==== Form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        mode: 'onChange',
        defaultValues: createDefaultValues(),
    });

    const { control, handleSubmit, reset, watch } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'rows',
    });

    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const thead: string[] = ['#', 'Ingredient', 'Quantity', 'Unit', 'Actions'];

    const watchedMenuId = watch('menu_id');
    const selectedMenu = useMemo(() => menus.find((m) => m.id === Number(watchedMenuId)), [menus, watchedMenuId]);

    // Handler reset
    const handleReset = useCallback(() => {
        reset(createDefaultValues());
        setEditMode(false);
        setEditingId(null);
    }, [reset]);

    // ==== Submit
    const onSubmit = (data: FormValues) => {
        const payload: FormValues = {
            ...data,
            // Pastikan menu_id & ingredien_id yang default 0 tidak lolos
            menu_id: Number(data.menu_id),
            variant_id: data.variant_id ? Number(data.variant_id) : undefined,
            rows: data.rows.map((r) => ({
                ...r,
                ingredien_id: Number(r.ingredien_id),
                quantity: Number(r.quantity),
            })),
        };

        if (editMode && editingId != null) {
            router.put(`/master-data/recipes/${editingId}`, payload, {
                preserveScroll: true,
                onSuccess: handleReset,
            });
        } else {
            router.post('/master-data/recipes', payload, {
                preserveScroll: true,
                onSuccess: handleReset,
            });
        }
    };

    // Handler edit
    const handleEdit = useCallback(
        (recipe: Recipe) => {
            setEditMode(true);
            setEditingId(recipe.id);

            const rawRows = (recipe as any).bahan_bakus ?? (recipe as any).bahanBakus ?? [];

            const rows =
                rawRows.map((ing: any) => ({
                    ingredien_id: Number(ing.ingredien_id ?? ing.ingredient_id ?? ing.bahan_baku_id ?? ing.bahanBakuId ?? ing.id),
                    quantity: Number(ing.quantity ?? ing.jumlah ?? 1),
                    unit: String(ing.unit ?? ing.satuan ?? ''),
                })) ?? [];

            const instructionValue = (recipe as any).instruction ?? (recipe as any).instructions ?? '';

            reset({
                menu_id: Number((recipe as any).menu_id ?? recipe.menu?.id ?? 0),
                variant_id: (recipe as any).variant_id ? Number((recipe as any).variant_id) : undefined,
                instruction: instructionValue,
                rows:
                    rows.length > 0
                        ? rows
                        : [
                              {
                                  ingredien_id: 0,
                                  quantity: 1,
                                  unit: '',
                              },
                          ],
            });
        },
        [reset],
    );

    // ==== Kolom + Aksi
    const columns = useMemo(() => {
        const cols = [...baseColumns];

        if (isAdmin) {
            // 1) Kolom visual HPP & Margin (tetap seperti sekarang)
            cols.push({
                accessorFn: (row: any) => {
                    const bahanBakuList =
                        row.bahan_bakus?.map((bahan: any) => {
                            const harga = Number(bahan.bahan_baku?.harga ?? 0);
                            const perUnit = Number(bahan.bahan_baku?.per_unit ?? 1) || 1;
                            const jumlah = Number(bahan.jumlah ?? bahan.quantity ?? 0);

                            const computedPrice = Math.round((harga / perUnit) * jumlah);

                            return {
                                name: bahan.bahan_baku?.name ?? '',
                                jumlah,
                                satuan: bahan.satuan,
                                price: computedPrice,
                            };
                        }) || [];

                    const totalHpp = bahanBakuList.reduce((sum: number, bahan: any) => sum + (Number(bahan.price) || 0), 0);
                    const hargaVariant = Number(row.variant_option?.price || 0);
                    const hargaJual = Number(row.menu?.price || 0) + hargaVariant;
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
                header: ({ column }) => <DataTableColumnHeader column={column} title="HPP & Margin" />,
                enableSorting: true,
                cell: ({ getValue }: any) => {
                    const data = getValue() as {
                        bahanBakuList: {
                            name: string;
                            jumlah: number;
                            satuan: string;
                            price: number;
                        }[];
                        totalHpp: number;
                        hargaJual: number;
                        margin: number;
                        marginPercentage: string;
                    };

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
            });

            // 2) Kolom numerik khusus untuk Excel
            cols.push(
                {
                    id: 'total_hpp',
                    header: 'Total HPP (Rp)',
                    enableSorting: true,
                    accessorFn: (row: any) => {
                        const bahanBakuList =
                            row.bahan_bakus?.map((bahan: any) => {
                                const harga = Number(bahan.bahan_baku?.harga ?? 0);
                                const perUnit = Number(bahan.bahan_baku?.per_unit ?? 1) || 1;
                                const jumlah = Number(bahan.jumlah ?? bahan.quantity ?? 0);
                                return Math.round((harga / perUnit) * jumlah);
                            }) || [];

                        const totalHpp = bahanBakuList.reduce((sum: number, price: number) => sum + (price || 0), 0);

                        return totalHpp; // <- number, aman untuk Excel
                    },
                    cell: ({ getValue }: any) => formatRupiah(Number(getValue() || 0)),
                },
                {
                    id: 'margin_rp',
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Margin (Rp)" />,
                    enableSorting: true,
                    accessorFn: (row: any) => {
                        const bahanBakuList =
                            row.bahan_bakus?.map((bahan: any) => {
                                const harga = Number(bahan.bahan_baku?.harga ?? 0);
                                const perUnit = Number(bahan.bahan_baku?.per_unit ?? 1) || 1;
                                const jumlah = Number(bahan.jumlah ?? bahan.quantity ?? 0);
                                return Math.round((harga / perUnit) * jumlah);
                            }) || [];

                        const totalHpp = bahanBakuList.reduce((sum: number, price: number) => sum + (price || 0), 0);
                        const hargaVariant = Number(row.variant_option?.price || 0);
                        const hargaJual = Number(row.menu?.price || 0) + hargaVariant;
                        const margin = hargaJual - totalHpp;

                        return margin; // <- number
                    },
                    cell: ({ getValue }: any) => formatRupiah(Number(getValue() || 0)),
                },
                {
                    id: 'margin_percent',
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Margin (%)" />,
                    enableSorting: true,
                    accessorFn: (row: any) => {
                        const bahanBakuList =
                            row.bahan_bakus?.map((bahan: any) => {
                                const harga = Number(bahan.bahan_baku?.harga ?? 0);
                                const perUnit = Number(bahan.bahan_baku?.per_unit ?? 1) || 1;
                                const jumlah = Number(bahan.jumlah ?? bahan.quantity ?? 0);
                                return Math.round((harga / perUnit) * jumlah);
                            }) || [];

                        const totalHpp = bahanBakuList.reduce((sum: number, price: number) => sum + (price || 0), 0);
                        const hargaVariant = Number(row.variant_option?.price || 0);
                        const hargaJual = Number(row.menu?.price || 0) + hargaVariant;
                        const margin = hargaJual - totalHpp;

                        if (!hargaJual) return 0;
                        return Number(((margin / hargaJual) * 100).toFixed(2)); // <- number
                    },
                    cell: ({ getValue }: any) => `${getValue() || 0}%`,
                },
            );
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
                                    router.delete(`/master-data/recipes/${recipe.id}`, {
                                        preserveScroll: true,
                                    });
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
    }, [isAdmin, handleEdit]);

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
                                const currentMenuId = Number(field.value || 0);
                                return (
                                    <FormItem>
                                        <FormLabel>Menu</FormLabel>
                                        <FormControl>
                                            <Select
                                                options={menuOptions}
                                                value={menuOptions.find((opt) => opt.value === currentMenuId) ?? null}
                                                onChange={(opt) => field.onChange(opt ? (opt as { value: number }).value : 0)}
                                                isDisabled={editMode}
                                                placeholder="Pilih menu…"
                                                menuPosition="fixed"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        {/* Variant (opsional, jika menu punya variant) */}
                        {selectedMenu && selectedMenu.variants && selectedMenu.variants.length > 0 && (
                            <FormField
                                control={control}
                                name="variant_id"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Variant (opsional)</FormLabel>
                                            <FormControl>
                                                <Select
                                                    options={variantOptions.map((v) => ({
                                                        label: `${v.name} (${formatRupiah(v.price)})`,
                                                        value: v.id,
                                                    }))}
                                                    value={
                                                        field.value
                                                            ? {
                                                                  label:
                                                                      variantOptions.find((v) => v.id === Number(field.value))?.name +
                                                                      ' (' +
                                                                      formatRupiah(
                                                                          variantOptions.find((v) => v.id === Number(field.value))?.price || 0,
                                                                      ) +
                                                                      ')',
                                                                  value: Number(field.value),
                                                              }
                                                            : null
                                                    }
                                                    onChange={(opt) => field.onChange(opt ? (opt as { value: number }).value : undefined)}
                                                    isClearable
                                                    placeholder="Pilih variant…"
                                                    menuPosition="fixed"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}

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
                                    {fields.map((fieldItem, index) => (
                                        <tr key={fieldItem.id} className="border-t">
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
                                                                    value={ingredientOptions.find((opt) => opt.value === field.value) ?? null}
                                                                    onChange={(opt) => field.onChange(opt ? (opt as { value: number }).value : 0)}
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
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label: field.value,
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
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
                            <Button
                                type="button"
                                onClick={() =>
                                    append({
                                        ingredien_id: 0,
                                        quantity: 1,
                                        unit: '',
                                    })
                                }
                            >
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
                        <DataTable columns={columns} data={recipes} filterColumn={['menu_name', 'bahan_bakus']} enableSearching />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
