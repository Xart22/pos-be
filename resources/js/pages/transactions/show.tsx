import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Calendar, CreditCard, FileText, Printer, User } from 'lucide-react';

interface TransactionVariant {
    variant_name: string;
    name: string;
    price: number;
}

interface TransactionItem {
    menu: string;
    category: number;
    quantity: number;
    base_price: number;
    variant_price: number;
    total_price: number;
    variants: TransactionVariant[];
}

interface TransactionDetail {
    order_number: string;
    order_date: string;
    type: 'dine-in' | 'takeaway';
    customer_name: string | null;
    table_number: string | null;
    sub_total: number;
    discount: number;
    total: number;
    payment_method: string;
    cash: number;
    change: number;
    payment_proof: string | null;
    data: TransactionItem[];
}

interface TransactionShowProps {
    transaction: TransactionDetail;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
    {
        title: 'Detail',
        href: '#',
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
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const TransactionShow = ({ transaction }: TransactionShowProps) => {
    const handleBack = () => {
        window.history.back();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi - ${transaction.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Detail Transaksi</h1>
                            <p className="font-mono text-sm text-muted-foreground">{transaction.order_number}</p>
                        </div>
                    </div>
                    <Button onClick={handlePrint} className="print:hidden">
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Struk
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Order Items */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Item Pesanan</CardTitle>
                                <CardDescription>Total {transaction.data.length} item</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {transaction.data.map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-semibold">{item.menu}</span>
                                                        <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{formatCurrency(item.base_price)}</p>
                                                    {item.variants.length > 0 && (
                                                        <div className="mt-2 space-y-1">
                                                            {item.variants.map((variant, vIndex) => (
                                                                <div
                                                                    key={vIndex}
                                                                    className="flex items-center justify-between text-sm text-muted-foreground"
                                                                >
                                                                    <span className="ml-4">
                                                                        • {variant.variant_name}: {variant.name}
                                                                    </span>
                                                                    {variant.price > 0 && <span>+{formatCurrency(variant.price)}</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatCurrency(item.total_price)}</p>
                                                </div>
                                            </div>
                                            {index < transaction.data.length - 1 && <Separator className="my-2" />}
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-6" />

                                {/* Subtotal & Total Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatCurrency(transaction.sub_total)}</span>
                                    </div>
                                    {transaction.discount > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Diskon</span>
                                            <span className="text-destructive">-{formatCurrency(transaction.discount)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formatCurrency(transaction.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Transaction Info */}
                    <div className="space-y-6">
                        {/* Order Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Informasi Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Order Number</label>
                                    <p className="font-mono font-semibold">{transaction.order_number}</p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Waktu Transaksi
                                    </label>
                                    <p className="font-medium">{formatDate(transaction.order_date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Tipe Pesanan</label>
                                    <span
                                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${transaction.type === 'dine-in' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                                    >
                                        {transaction.type === 'dine-in' ? 'Dine In' : 'Take Away'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Nama Customer</label>
                                    <p className="font-medium">{transaction.customer_name || '-'}</p>
                                </div>
                                {transaction.table_number && (
                                    <div>
                                        <label className="text-sm text-muted-foreground">Nomor Meja</label>
                                        <p className="font-medium">Meja {transaction.table_number}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Informasi Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Metode Pembayaran</label>
                                    <p className="font-medium capitalize">{transaction.payment_method}</p>
                                </div>
                                {transaction.payment_method === 'cash' && (
                                    <>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Jumlah Bayar</label>
                                            <p className="font-medium">{formatCurrency(transaction.cash)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-muted-foreground">Kembalian</label>
                                            <p className="font-medium">{formatCurrency(transaction.change)}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TransactionShow;
