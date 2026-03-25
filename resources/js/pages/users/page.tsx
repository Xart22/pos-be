import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { FormEvent, useMemo, useState } from 'react';

type UserRow = {
    id: number;
    name: string;
    nip: string | number;
    role: 'admin' | 'kasir' | 'owner' | 'waiters' | 'helper' | 'barista';
    base_gaji: number;
    created_at?: string;
    updated_at?: string;
};

type UsersPageProps = {
    users: UserRow[];
};

type UserForm = {
    name: string;
    nip: string;
    role: 'admin' | 'kasir' | 'owner' | 'waiters' | 'helper' | 'barista';
    base_gaji: string;
    password: string;
    password_confirmation: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

const defaultForm: UserForm = {
    name: '',
    nip: '',
    role: 'kasir',
    base_gaji: '0',
    password: '',
    password_confirmation: '',
};

export default function UsersPage({ users }: UsersPageProps) {
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm<UserForm>(defaultForm);

    const resetForm = () => {
        setEditMode(false);
        setEditingId(null);
        reset();
    };

    const handleEdit = (user: UserRow) => {
        setEditMode(true);
        setEditingId(user.id);

        setData({
            name: String(user.name ?? ''),
            nip: String(user.nip ?? ''),
            role: user.role,
            base_gaji: String(user.base_gaji ?? 0),
            password: '',
            password_confirmation: '',
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editMode && editingId) {
            put(`/users/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => resetForm(),
            });
            return;
        }

        post('/users', {
            preserveScroll: true,
            onSuccess: () => resetForm(),
        });
    };

    const columns = useMemo<ColumnDef<UserRow>[]>(
        () => [
            {
                accessorKey: 'name',
                id: 'name',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
            },
            {
                accessorKey: 'nip',
                id: 'nip',
                header: ({ column }) => <DataTableColumnHeader column={column} title="NIP" />,
            },
            {
                accessorKey: 'role',
                id: 'role',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
                cell: ({ getValue }) => {
                    const role = String(getValue() ?? '');
                    return <span className="uppercase">{role}</span>;
                },
            },
            {
                accessorKey: 'base_gaji',
                id: 'base_gaji',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Gaji Pokok" />,
                cell: ({ getValue }) => <span>{formatRupiah(Number(getValue() ?? 0))}</span>,
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <div className="flex gap-2">
                            <Button type="button" size="sm" className="bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => handleEdit(user)}>
                                Edit
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    if (confirm(`Hapus user ${user.name}?`)) {
                                        destroy(`/users/${user.id}`, { preserveScroll: true });
                                    }
                                }}
                            >
                                Hapus
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [destroy],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Manajemen User</h1>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama user"
                                disabled={processing}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nip">NIP</Label>
                            <Input
                                id="nip"
                                value={data.nip}
                                onChange={(e) => setData('nip', e.target.value)}
                                placeholder="Nomor induk pegawai"
                                disabled={processing}
                            />
                            <InputError message={errors.nip} />
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={data.role} onValueChange={(value) => setData('role', value as UserForm['role'])}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="kasir">Kasir</SelectItem>
                                    <SelectItem value="waiters">Waiters</SelectItem>
                                    <SelectItem value="helper">Helper</SelectItem>
                                    <SelectItem value="barista">Barista</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="base_gaji">Gaji Pokok</Label>
                            <Input
                                id="base_gaji"
                                type="number"
                                min="0"
                                value={data.base_gaji}
                                onChange={(e) => setData('base_gaji', e.target.value)}
                                placeholder="Contoh: 2500000"
                                disabled={processing}
                            />
                            <InputError message={errors.base_gaji} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password {editMode ? '(Opsional)' : ''}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={editMode ? 'Kosongkan jika tidak diganti' : 'Password'}
                                disabled={processing}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password {editMode ? '(Opsional)' : ''}</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder={editMode ? 'Isi jika ganti password' : 'Ulangi password'}
                                disabled={processing}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {editMode ? <span className="text-sm text-muted-foreground">Mode edit user #{editingId}</span> : <span />}
                        <div className="flex gap-2">
                            {editMode && (
                                <Button type="button" variant="secondary" onClick={resetForm} disabled={processing}>
                                    Batal
                                </Button>
                            )}
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : editMode ? 'Update User' : 'Tambah User'}
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="mt-4 rounded-xl border border-border p-4">
                    <DataTable columns={columns} data={users} enableSearching={true} filterColumn={['name', 'nip', 'role']} />
                </div>
            </div>
        </AppLayout>
    );
}
