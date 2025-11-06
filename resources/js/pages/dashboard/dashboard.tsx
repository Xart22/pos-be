import LineBarChart from '@/components/chart/line-bar-chart';
import { DataTable } from '@/components/data-table';
import PeriodPicker from '@/components/date-range';
import { Card } from '@/components/ui/card';
import formatRupiah from '@/helper/formatRupiah';
import AppLayout from '@/layouts/app-layout';
import { Category, OmsetChartData, TxMenu, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
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
    dataOmsetLastMonth: OmsetChartData[];
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
    dataOmsetLastMonth,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <PeriodPicker />
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
            </div>
            <h2 className="text-center text-2xl font-bold text-muted-foreground">Penjualan</h2>
            <div className="flex flex-col justify-between gap-2 p-2 md:flex-row md:p-4 lg:p-6">
                <div className="rounded-xl dark:border-gray-700">
                    <Card className="h-full text-center">
                        <h2 className="text-base font-semibold text-muted-foreground">Penjualan Minuman Hari ini </h2>
                        <div className="flex justify-center gap-2">
                            <Card className="px-2 text-sm">
                                Total Cup Regular:
                                {txDrink.filter((item) => item.menu.includes('Reguler')).reduce((acc, item) => acc + item.quantity, 0)}
                            </Card>
                            <Card className="px-2 text-sm">
                                Total Cup Large: {txDrink.filter((item) => item.menu.includes('Large')).reduce((acc, item) => acc + item.quantity, 0)}
                            </Card>
                        </div>
                        <div className="flex justify-center gap-2">
                            <Card className="px-2 text-sm">Total Quantity: {txDrink.reduce((acc, item) => acc + item.quantity, 0)}</Card>
                            <Card className="px-2 text-sm">
                                Total Omset: {formatRupiah(txDrink.reduce((acc, item) => acc + item.total_price, 0))}
                            </Card>
                        </div>
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
            <div className="flex gap-2 p-4 md:p-6 lg:p-8">
                <Card className="h-96 w-full p-4">
                    <h2 className="text-base font-semibold text-muted-foreground">Omset Bulan Ini</h2>
                    <LineBarChart data={dataOmset} />
                </Card>
                <Card className="w-full p-4">
                    <h2 className="text-base font-semibold text-muted-foreground">Omset Bulan Lalu</h2>
                    <LineBarChart data={dataOmsetLastMonth} />
                </Card>
            </div>
        </AppLayout>
    );
}
