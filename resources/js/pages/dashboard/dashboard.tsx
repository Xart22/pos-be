import LineBarChart from '@/components/chart/line-bar-chart';
import { DataTable } from '@/components/data-table';
import { Card } from '@/components/ui/card';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { Category, OmsetChartData, TxMenu, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './columns';

type DashboardProps = {
    omsetToday: string;
    jumlahTransaksiToday: string;
    totalTransaksiQris: string;
    totalTransaksiCash: string;
    omsetThisMonth: string;
    jumlahTransaksiThisMonth: string;
    totalTransaksiQrisThisMonth: string;
    totalTransaksiCashThisMonth: string;
    period: {
        start: string;
        end: string;
    };
    categories: Category[];
    txDrink: TxMenu[];
    txFood: TxMenu[];
    txUnknown: TxMenu[];
    dataOmset: OmsetChartData[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    omsetToday,
    jumlahTransaksiToday,
    totalTransaksiQris,
    totalTransaksiCash,
    omsetThisMonth,
    jumlahTransaksiThisMonth,
    totalTransaksiQrisThisMonth,
    totalTransaksiCashThisMonth,
    period,
    categories,
    txDrink,
    txFood,
    txUnknown,
    dataOmset,
}: DashboardProps) {
    console.log({ txDrink, txFood, txUnknown });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <h1 className="text-1xl text-center font-bold md:text-2xl lg:text-3xl">
                Periode: {period.start} / {period.end}
            </h1>
            <div className="flex flex-col gap-2 p-4 md:p-6 lg:p-8">
                <h1 className="text-center text-2xl font-bold text-muted-foreground">Omset</h1>
                <div className="grid auto-rows-[1fr] grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Pendapatan Hari ini</h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl">
                                {formatRupiah(parseFloat(omsetToday))} / {jumlahTransaksiToday}
                            </p>
                        </Card>
                    </div>
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Pengeluaran Hari ini</h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl"> Transaksi</p>
                        </Card>
                    </div>
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Total Pendapatan Bulan ini </h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl">
                                {formatRupiah(parseFloat(omsetThisMonth))} / {jumlahTransaksiThisMonth}
                            </p>
                        </Card>
                    </div>
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Total Pengeluaran Bulan ini</h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl"> Transaksi</p>
                        </Card>
                    </div>
                </div>
                <h2 className="text-center text-2xl font-bold text-muted-foreground">Transaksi</h2>
                <div className="grid auto-rows-[1fr] grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Transaksi Qris/Debit Hari ini</h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl">{formatRupiah(parseFloat(totalTransaksiQris))} </p>
                        </Card>
                    </div>
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Transaksi Cash Hari ini</h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl">{formatRupiah(parseFloat(totalTransaksiCash))} </p>
                        </Card>
                    </div>
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Total Transaksi Qris/Debit Bulan ini</h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl">{formatRupiah(parseFloat(totalTransaksiQrisThisMonth))} </p>
                        </Card>
                    </div>
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Total Transaksi Cash Bulan ini</h2>
                            <p className="text-1xl font-bold text-primary md:text-2xl">{formatRupiah(parseFloat(totalTransaksiCashThisMonth))} </p>
                        </Card>
                    </div>
                </div>

                <h2 className="text-center text-2xl font-bold text-muted-foreground">Penjualan</h2>
                <div className="flex flex-col justify-between gap-2 p-2 md:flex-row md:p-4 lg:p-6">
                    <div className="rounded-xl dark:border-gray-700">
                        <Card className="h-full text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Penjualan Minuman Hari ini </h2>
                            <p className="text-sm">Total Menu: {txDrink.length}</p>
                            <p className="text-sm">Total Quantity: {txDrink.reduce((acc, item) => acc + item.quantity, 0)}</p>
                            <p className="text-sm">Total Omset: {formatRupiah(txDrink.reduce((acc, item) => acc + item.total_price, 0))}</p>
                            {txDrink.length > 0 && <DataTable columns={columns} data={txDrink} enableSearching={false} />}
                        </Card>
                    </div>
                    <div className="rounded-xl dark:border-gray-700">
                        <Card className="h-full text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Penjualan Minuman Hari ini </h2>
                            <p className="text-sm">Total Menu: {txFood.length}</p>
                            <p className="text-sm">Total Quantity: {txFood.reduce((acc, item) => acc + item.quantity, 0)}</p>
                            <p className="text-sm">Total Omset: {formatRupiah(txFood.reduce((acc, item) => acc + item.total_price, 0))}</p>
                            {txFood.length > 0 && <DataTable columns={columns} data={txFood} enableSearching={false} />}
                        </Card>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 p-4 md:p-6 lg:p-8">
                <Card className="h-96 w-full p-4">
                    <LineBarChart data={dataOmset} />
                </Card>
                <Card className="w-full p-4">
                    <LineBarChart data={dataOmset} />
                </Card>
            </div>
        </AppLayout>
    );
}
