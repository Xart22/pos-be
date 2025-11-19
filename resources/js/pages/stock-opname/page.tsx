// pages/BahanBakuPage.tsx
import AppLayout from '@/layouts/app-layout';
import { BahanBaku, BreadcrumbItem, SumIngredients, TransactionItem } from '@/types';
import { Head } from '@inertiajs/react';

type StockOpnameProps = {
    startDate: string;
    endDate: string;
    transactions_food: TransactionItem[];
    transactions_drink: TransactionItem[];
    sum_ingredients: SumIngredients[];
    bahan_bakus: BahanBaku[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stock Opname',
        href: '/stock-opname',
    },
];

export default function StockOpnamePage({
    startDate,
    endDate,
    transactions_food,
    transactions_drink,
    sum_ingredients,
    bahan_bakus,
}: StockOpnameProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Opname" />
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <h1 className="mb-4 text-2xl font-semibold">Stock Opname Page</h1>
                {/* Konten halaman stock opname akan ditambahkan di sini */}
            </div>
        </AppLayout>
    );
}
