import { ItemMenu } from '@/components/card-product';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, Menu } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    category_id: z.string().min(1, 'Kategori wajib dipilih'),
    name: z.string().min(2, 'Nama menu minimal 2 karakter'),
    price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
    description: z.string().min(2, 'Deskripsi wajib diisi'),
    stock: z.coerce.number().int().min(0, 'Stok tidak boleh negatif'),
    is_active: z.enum(['1', '0']),
    is_online: z.enum(['1', '0']),
    image: z.string().optional().default(''),
});

type FormValues = z.infer<typeof formSchema>;

type MenuProps = {
    menus: Menu[];
    categories: Category[];
};

const defaultValues: FormValues = {
    category_id: '',
    name: '',
    price: 0,
    description: '',
    stock: 0,
    is_active: '1',
    is_online: '0',
    image: '',
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: '/master-data/menu',
    },
];

const resolveImageUrl = (image?: string) => {
    if (!image) {
        return 'https://placehold.co/400x300?text=No+Image';
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }

    return image.startsWith('/') ? image : `/${image}`;
};

const menu = ({ menus, categories }: MenuProps) => {
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        mode: 'onChange',
        defaultValues,
    });

    const { control, handleSubmit, reset, formState } = form;
    const { isSubmitting } = formState;

    const handleReset = () => {
        reset(defaultValues);
        setEditMode(false);
        setEditingId(null);
        setSelectedFile(null);
    };

    const filteredMenus = menus.filter((m) => {
        const query = searchQuery.toLowerCase();
        const matchesName = String(m.name ?? '')
            .toLowerCase()
            .includes(query);
        const matchesCategory = String(m.category?.name ?? '')
            .toLowerCase()
            .includes(query);
        return matchesName || matchesCategory;
    });

    const handleEdit = (selectedMenu: Menu) => {
        setEditMode(true);
        setEditingId(Number(selectedMenu.id));
        setSelectedFile(null);

        reset({
            category_id: String((selectedMenu as any).category_id ?? selectedMenu.category?.id ?? ''),
            name: String(selectedMenu.name ?? ''),
            price: Number(selectedMenu.price ?? 0),
            description: String(selectedMenu.description ?? ''),
            stock: Number(selectedMenu.stock ?? 0),
            is_active: selectedMenu.is_active ? '1' : '0',
            is_online: selectedMenu.is_online ? '1' : '0',
            image: String(selectedMenu.image ?? ''),
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSubmit = (data: FormValues) => {
        const formData = new FormData();
        formData.append('category_id', data.category_id);
        formData.append('name', data.name);
        formData.append('price', String(data.price));
        formData.append('description', data.description);
        formData.append('stock', String(data.stock));
        formData.append('is_active', data.is_active === '1' ? '1' : '0');
        formData.append('is_online', data.is_online === '1' ? '1' : '0');
        formData.append('image', data.image ?? '');

        if (selectedFile) {
            formData.append('image_file', selectedFile);
        }

        if (editMode && editingId) {
            formData.append('_method', 'put');
            router.post(`/master-data/menu/${editingId}`, formData, {
                preserveScroll: true,
                onSuccess: () => handleReset(),
            });
            return;
        }

        router.post('/master-data/menu', formData, {
            preserveScroll: true,
            onSuccess: () => handleReset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Menu</h1>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={String(category.id)}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                        <FormLabel>Nama Menu</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Contoh: Americano" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                                placeholder="Contoh: 25000"
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
                                        <FormLabel>Stok</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.value)}
                                                placeholder="Contoh: 50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status Aktif</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih status aktif" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Aktif</SelectItem>
                                                    <SelectItem value="0">Nonaktif</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="is_online"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status Online</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih status online" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Online</SelectItem>
                                                    <SelectItem value="0">Offline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>URL Gambar (opsional)</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} placeholder="Contoh: https://domain.com/menu.jpg" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Upload Gambar (opsional)
                                </label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        setSelectedFile(file);
                                    }}
                                />
                            </div>

                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Deskripsi menu" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            {editMode ? (
                                <span className="text-sm text-muted-foreground">Mode edit{editingId ? ` (ID: ${editingId})` : ''}</span>
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
                                    {isSubmitting ? 'Menyimpan...' : editMode ? 'Update Menu' : 'Tambah Menu'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>

                <div className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Cari menu atau kategori..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {filteredMenus.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            <p className="text-sm">Tidak ada menu yang sesuai dengan pencarian.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {filteredMenus.map((menu: Menu) => (
                                <div key={menu.id} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-2">
                                    <ItemMenu
                                        image={resolveImageUrl(String(menu.image ?? ''))}
                                        title={String(menu.name ?? '-')}
                                        price={`Rp ${Number(menu.price ?? 0).toLocaleString('id-ID')}`}
                                        item={`${Number(menu.stock ?? 0)} item`}
                                        edit={true}
                                        onTap={() => handleEdit(menu)}
                                    />

                                    <div className="space-y-1 px-1 text-xs text-muted-foreground">
                                        <p>Kategori: {menu.category?.name ?? '-'}</p>
                                        <p>Online: {menu.is_online ? 'Ya' : 'Tidak'}</p>
                                        <p>Aktif: {menu.is_active ? 'Ya' : 'Tidak'}</p>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => {
                                            if (confirm(`Hapus menu ${menu.name}?`)) {
                                                router.delete(`/master-data/menu/${menu.id}`, { preserveScroll: true });
                                            }
                                        }}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default menu;
