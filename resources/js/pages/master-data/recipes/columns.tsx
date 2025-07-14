import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Recipe } from '@/types';

export const columns: ColumnDef<Recipe>[] = [
    {
        accessorFn: (row) => row.menu?.name,
        id: 'menu_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Menu" />,
        cell: ({ getValue }) => <div className="w-[120px]">{getValue() as string}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'instructions',
        id: 'instructions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Instructions" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('instructions')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'image',
        id: 'image',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
        cell: ({ row }) => {
            const imageUrl = row.getValue('image') as string;
            return <div className="w-[80px]">{imageUrl ? <img src={imageUrl} alt="Recipe" className="h-10 w-10 rounded-full" /> : 'No Image'}</div>;
        },
        enableSorting: false,
    },
    {
        accessorFn: (row) =>
            row.bahan_bakus?.map((bahan) => ({
                name: bahan.bahan_baku.name,
                jumlah: bahan.jumlah,
                satuan: bahan.satuan,
            })),
        id: 'bahan_bakus',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bahan Baku" />,
        cell: ({ row }) => {
            const bahanBakus = row.getValue('bahan_bakus') as { name: string; jumlah: number; satuan: string }[];
            return (
                <div className="w-[200px]">
                    {bahanBakus.map((bahan, index) => (
                        <div key={index} className="flex justify-between">
                            <span>{bahan.name} : </span>
                            <span>
                                {bahan.jumlah} - {bahan.satuan}
                            </span>
                        </div>
                    ))}
                </div>
            );
        },
        enableSorting: false,
    },
];
