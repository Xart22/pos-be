import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { columns, Transaction } from './columns';

interface CashDrawer {
    id: number;
    opening_balance: number;
    closing_balance: number | null;
    expected_balance: number | null;
    difference: number | null;
    created_at: string;
}

interface TransactionsPageProps {
    transactions: Transaction[];
    cashDrawer: CashDrawer | null;
    selectedDate?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const TransactionsPage = ({ transactions, cashDrawer, selectedDate: initialDate }: TransactionsPageProps) => {
    const [selectedDate, setSelectedDate] = useState(() => {
        if (initialDate) return initialDate;
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    // Sync selectedDate with initialDate when prop changes
    useEffect(() => {
        if (initialDate && initialDate !== selectedDate) {
            setSelectedDate(initialDate);
        }
    }, [initialDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get(`/transactions/${newDate}`);
    };

    const totalOmset = transactions.reduce((sum, tx) => sum + tx.total_price, 0);
    const totalTransactions = transactions.length;
    const totalCash = transactions.filter((tx) => tx.payment_method === 'CASH').reduce((sum, tx) => sum + tx.total_price, 0);
    const totalNonCash = transactions.filter((tx) => tx.payment_method !== 'CASH').reduce((sum, tx) => sum + tx.total_price, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Transaksi</h1>
                        <p className="text-sm text-muted-foreground">Kelola dan lihat riwayat transaksi</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <Input type="date" value={selectedDate} onChange={handleDateChange} className="w-auto" />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Transaksi</CardDescription>
                            <CardTitle className="text-3xl">{totalTransactions}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Omset</CardDescription>
                            <CardTitle className="text-2xl">{formatCurrency(totalOmset)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Pembayaran Cash</CardDescription>
                            <CardTitle className="text-2xl">{formatCurrency(totalCash)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Pembayaran Non-Cash</CardDescription>
                            <CardTitle className="text-2xl">{formatCurrency(totalNonCash)}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Cash Drawer Info */}
                {cashDrawer && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Cash Drawer</CardTitle>
                            <CardDescription>Dibuka pada {formatDate(cashDrawer.created_at)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Saldo Awal</p>
                                    <p className="text-lg font-semibold">{formatCurrency(cashDrawer.opening_balance)}</p>
                                </div>
                                {cashDrawer.closing_balance && (
                                    <>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Saldo Akhir</p>
                                            <p className="text-lg font-semibold">{formatCurrency(cashDrawer.closing_balance)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Selisih</p>
                                            <p
                                                className={`text-lg font-semibold ${cashDrawer.difference && cashDrawer.difference !== 0 ? 'text-destructive' : 'text-green-600'}`}
                                            >
                                                {formatCurrency(cashDrawer.difference || 0)}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Transaksi</CardTitle>
                        <CardDescription>Menampilkan {transactions.length} transaksi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={transactions}
                            filterColumn={['order_id', 'customer_name', 'payment_method']}
                            enableSearching={true}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default TransactionsPage;
