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
    type: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ absensis, totalEarnings, type }: DashboardProps) {
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Card className="absolute inset-0 flex items-center justify-center p-4">
                            <h2 className="text-lg font-semibold">Total Absensi</h2>
                            <p className="text-2xl font-bold">{data.length} Hari</p>
                        </Card>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Card className="absolute inset-0 flex items-center justify-center p-4">
                            {type == 'Absen Masuk' ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>{type}</Button>
                                    </DialogTrigger>
                                    <DialogContent className="mt-3 sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>{type}</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            {location ? (
                                                <>
                                                    <p>Latitude: {location.latitude}</p>
                                                    <p>Longitude: {location.longitude}</p>
                                                </>
                                            ) : error ? (
                                                <p>Error: {error}</p>
                                            ) : (
                                                <p>Loading location...</p>
                                            )}

                                            <Label className="mt-3 mb-2 block" htmlFor="shift">
                                                Shift
                                            </Label>
                                            <Select onValueChange={handleShiftChange} value={selectedShift}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select shift" />
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
                                            <DialogFooter>
                                                <Button variant="default" className="mt-4 w-full bg-[#4CAF50] hover:bg-[#45A049]" type="submit">
                                                    Submit
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                        {/* error */}
                                        {error && <p className="mt-2 text-red-500">Error: {error}</p>}
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <>
                                    <p className="text-2xl font-bold">{type}</p>
                                    <Button className="mt-4 w-full bg-[#4CAF50] hover:bg-[#45A049]" disabled>
                                        {type}
                                    </Button>
                                </>
                            )}
                        </Card>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Card className="absolute inset-0 flex items-center justify-center p-4">
                            <h2 className="text-lg font-semibold">Total Earnings</h2>
                            <p className="text-2xl font-bold">{convertToRupiah(totalEarnings.toString(), 'Rp ')}</p>
                        </Card>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="container mx-auto py-10">
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
