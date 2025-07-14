import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Recipe } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './columns';
type RecipesProps = {
    recipes: Recipe[]; // Adjust the type as per your actual data structure
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recipes',
        href: '/master-data/recipes',
    },
];

export default function RecipesPage({ recipes }: RecipesProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bahan Baku" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Bahan Baku</h1>
                <p>Halaman ini menampilkan daftar bahan baku yang tersedia.</p>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl border border-border dark:border-gray-700">
                <div className="px-4 py-8 md:px-8">
                    <DataTable columns={columns} data={recipes} filterColumn={[]} />
                </div>
            </div>
        </AppLayout>
    );
}
