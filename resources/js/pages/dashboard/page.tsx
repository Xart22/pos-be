import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { convertToRupiah } from '@/lib/utils';
import { Absensi, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './columns';

type DashboardProps = {
    absensis: Absensi[];
    totalEarnings: number;
    paid: number;
    type: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ absensis, totalEarnings, paid, type }: DashboardProps) {
    const data: Absensi[] = [...absensis];
    // check the time today
    const today = new Date();
    const currentHour = today.getHours();
    console.log('Current Hour:', currentHour);
    const disabledPagi = currentHour >= 12;
    const disabledSiang = currentHour < 12 || currentHour >= 18;
    const [location, setLocation] = useState<{
        latitude: number | null;
        longitude: number | null;
    }>({
        latitude: null,
        longitude: null,
    });
    const [selectedShift, setSelectedShift] = useState<string | undefined>(undefined);

    const handleShiftChange = (value: string) => {
        setSelectedShift(value);
    };
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!location.latitude || !location.longitude) {
            console.error('Location not available');
            return;
        }
        if (!selectedShift) {
            console.error('Shift not selected');
            return;
        }

        const formData = new FormData();
        formData.append('latitude', navigator.geolocation ? location.latitude.toString() : '');
        formData.append('longitude', navigator.geolocation ? location.longitude.toString() : '');
        formData.append('shift', selectedShift);
        formData.append('type', type);
        router.post('/dashboard/absensi', formData, {
            onSuccess: () => {},
            onError: (error) => {
                console.error('Error submitting absensi:', error);
                setError(error.location || 'An error occurred while submitting absensi.');
            },
        });
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => {
                    setError(err.message);
                    console.error('Error getting location:', err);
                },
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
                {/* Cards Section */}
                <div className="grid auto-rows-[1fr] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Total Absensi */}
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            <h2 className="text-base font-semibold text-muted-foreground">Total Absensi</h2>
                            <p className="mt-2 text-3xl font-bold text-primary">{data.length} Hari</p>
                        </Card>
                    </div>

                    {/* Card 2: Absen Masuk / Button */}
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                            {type === 'Absen Masuk' ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="lg" className="w-full max-w-xs">
                                            {type}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="mt-3 sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>{type}</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {location ? (
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Latitude: {location.latitude}</p>
                                                    <p>Longitude: {location.longitude}</p>
                                                </div>
                                            ) : error ? (
                                                <p className="text-sm text-red-500">Error: {error}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Loading location...</p>
                                            )}

                                            <div>
                                                <Label htmlFor="shift">Shift</Label>
                                                <Select onValueChange={handleShiftChange} value={selectedShift}>
                                                    <SelectTrigger className="mt-1 w-full">
                                                        <SelectValue placeholder="Pilih shift" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Pagi" disabled={disabledPagi}>
                                                            Pagi
                                                        </SelectItem>
                                                        <SelectItem value="Siang" disabled={disabledSiang}>
                                                            Siang
                                                        </SelectItem>
                                                        <SelectItem value="Full Time" disabled={disabledPagi}>
                                                            Full Time
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <DialogFooter>
                                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                                    Submit
                                                </Button>
                                            </DialogFooter>

                                            {error && <p className="mt-2 text-sm text-red-500">Error: {error}</p>}
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <>
                                    <p className="text-2xl font-bold text-muted-foreground">{type}</p>
                                    <Button className="mt-4 w-full max-w-xs bg-green-600 hover:bg-green-700" disabled>
                                        {type}
                                    </Button>
                                </>
                            )}
                        </Card>
                    </div>

                    {/* Card 3: Earnings Summary */}
                    <div className="rounded-xl border border-border dark:border-gray-700">
                        <Card className="flex h-full flex-col justify-center gap-4 p-6 text-center">
                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground">Total Unpaid</h2>
                                <p className="text-base font-bold text-red-600">{convertToRupiah((totalEarnings - paid).toString(), 'Rp ')}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground">Total Paid Off</h2>
                                <p className="text-base font-bold text-green-600">{convertToRupiah(paid.toString(), 'Rp ')}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground">Total Earnings</h2>
                                <p className="text-base font-bold text-blue-600">{convertToRupiah(totalEarnings.toString(), 'Rp ')}</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Table Section */}
                <div className="relative w-full overflow-hidden rounded-xl border border-border dark:border-gray-700">
                    <div className="px-4 py-8 md:px-8">
                        <DataTable
                            columns={columns}
                            data={data}
                            filterColumn={['tanggal', 'shift', 'jam_masuk', 'jam_keluar', 'status', 'take_home_pay']}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
