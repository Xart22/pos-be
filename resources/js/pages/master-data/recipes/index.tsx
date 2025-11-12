import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BahanBaku, BreadcrumbItem, Menu, Recipe } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import type { Resolver } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';
import { columns } from './columns';

type RecipesProps = {
    recipes: Recipe[];
    bahanBaku: BahanBaku[];
    menus: Menu[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Recipes', href: '/master-data/recipes' }];

// ---- Zod schemas
const rowSchema = z.object({
    ingredienId: z.number({ error: 'Ingredient wajib diisi' }),
    quantity: z.coerce.number().min(0.0001, { error: 'Quantity harus > 0' }),
    unit: z.string().min(1, { error: 'Unit wajib diisi' }),
});

const formSchema = z.object({
    rows: z.array(rowSchema).min(1, { error: 'Minimal satu baris resep' }),
    instruction: z.string().optional().default(''),
    menuId: z.number().optional(),
    menuName: z.string({ error: 'Menu wajib diisi' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecipesPage({ recipes, bahanBaku, menus }: RecipesProps) {
    // ---- options (memoized)
    const ingredientOptions = useMemo(() => bahanBaku.map((b) => ({ label: b.name, value: b.id })), [bahanBaku]);

    const unitOptions = useMemo(
        () =>
            Array.from(new Set(bahanBaku.map((b) => b.satuan).filter((u): u is string => typeof u === 'string' && u.trim().length > 0))).map((u) => ({
                label: u,
                value: u,
            })),
        [bahanBaku],
    );

    const menuOptions = useMemo(() => menus.map((m) => ({ label: m.name, value: m.id })), [menus]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        defaultValues: {
            rows: [{ ingredienId: undefined, quantity: 0, unit: '' }],
            instruction: '',
            menuId: undefined,
        },
        mode: 'onChange',
    });

    const { control, handleSubmit, setValue, watch } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'rows',
    });

    const thead: string[] = ['#', 'Ingredient', 'Quantity', 'Unit', 'Actions'];

    const onIngredientChange = (rowIndex: number, newIngredient: any) => {
        setValue(`rows.${rowIndex}.ingredienId`, newIngredient);

        // Cek kecocokan unik untuk set unit
        const selectedBahan = bahanBaku.find((b) => b.id === newIngredient);
        if (selectedBahan) {
            const matchingUnits = bahanBaku.filter((b) => b.name === selectedBahan.name).map((b) => b.satuan);
            const uniqueUnits = Array.from(new Set(matchingUnits));
            if (uniqueUnits.length === 1 && uniqueUnits[0]) {
                setValue(`rows.${rowIndex}.unit`, uniqueUnits[0]);
            }
        }
    };

    const onSubmit = (data: FormValues) => {
        console.log('Submit data:', data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipes" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Recipes</h1>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Menu selector */}
                        <FormField
                            control={control}
                            name="menuId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Menu</FormLabel>
                                    <FormControl>
                                        {menuOptions.length > 0 ? (
                                            <Select
                                                options={menuOptions}
                                                value={menuOptions.find((opt) => opt.value === field.value) ?? null}
                                                onChange={(opt) => field.onChange(opt ? (opt as { value: number }).value : undefined)}
                                                placeholder="Pilih menu…"
                                                isClearable={false}
                                                menuPosition="fixed"
                                            />
                                        ) : (
                                            // fallback bila belum ada data menu (jarang dipakai)
                                            <Input
                                                placeholder="Masukkan ID menu (number)"
                                                type="number"
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tabel rows */}
                        <div className="w-full overflow-x-auto rounded-lg border">
                            <table className="w-full table-auto border-collapse">
                                <thead className="bg-muted/50 text-center">
                                    <tr>
                                        {thead.map((item, idx) => (
                                            <th key={idx} className="px-3 py-2 text-sm font-semibold">
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
                                                    name={`rows.${index}.ingredienId`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select
                                                                    options={ingredientOptions}
                                                                    value={ingredientOptions.find((opt) => opt.value === field.value) ?? null}
                                                                    onChange={(opt) =>
                                                                        onIngredientChange(index, opt ? (opt as { value: number }).value : undefined)
                                                                    }
                                                                    isClearable
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
                                                                    isClearable
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
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Actions rows */}
                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={() => append({ ingredienId: NaN, quantity: 0, unit: '' })}>
                                Add Row
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fields.length > 1 && remove(fields.length - 1)}
                                disabled={fields.length === 1}
                            >
                                Delete Last Row
                            </Button>
                        </div>

                        {/* Instruction */}
                        <FormField
                            control={control}
                            name="instruction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instruction</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Langkah-langkah pembuatan…" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <div className="flex justify-end">
                            <Button type="submit">Save Recipe</Button>
                        </div>
                    </form>
                </Form>

                {/* DataTable */}
                <div className="relative w-full overflow-hidden rounded-xl border">
                    <div className="px-4 py-8 md:px-8">
                        <DataTable columns={columns} data={recipes} filterColumn={[]} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
