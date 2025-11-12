import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';
import { AlertCircleIcon, CheckCircle2Icon, XIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Flash = { success?: string; error?: string };

export function AlertNotif({ duration = 3500 }: { duration?: number }) {
    // Ambil flash dari server (hanya tersedia satu request berikutnya)
    const { flash } = usePage<{ flash?: Flash }>().props;

    // Salin ke state lokal supaya bisa di-hide tanpa perlu navigasi
    const initial = useMemo<Flash>(() => ({ success: flash?.success, error: flash?.error }), [flash]);
    const [local, setLocal] = useState<Flash>(initial);

    // Jika flash berubah (mis. setelah submit), reset state lokal dan set auto-dismiss
    useEffect(() => {
        setLocal({ success: flash?.success, error: flash?.error });

        // auto-dismiss jika ada salah satu pesan
        // if (flash?.success || flash?.error) {
        //     const t = setTimeout(() => setLocal({}), duration);
        //     return () => clearTimeout(t);
        // }
    }, [flash]);

    const close = () => setLocal({});

    // Jika sudah dihapus secara lokal, tidak ditampilkan lagi
    if (!local.success && !local.error) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3" role="status" aria-live="polite">
            {local.success && (
                <Alert className="relative bg-green-50 text-green-900">
                    <CheckCircle2Icon />
                    <AlertTitle>Berhasil</AlertTitle>
                    <AlertDescription>{local.success}</AlertDescription>
                    <button type="button" onClick={close} aria-label="Tutup" className="absolute top-2 right-2 opacity-70 hover:opacity-100">
                        <XIcon className="h-4 w-4" />
                    </button>
                </Alert>
            )}

            {local.error && (
                <Alert variant="destructive" className="relative bg-red-50 text-red-900">
                    <AlertCircleIcon />
                    <AlertTitle>Gagal</AlertTitle>
                    <AlertDescription>{local.error}</AlertDescription>
                    <button type="button" onClick={close} aria-label="Tutup" className="absolute top-2 right-2 opacity-70 hover:opacity-100">
                        <XIcon className="h-4 w-4" />
                    </button>
                </Alert>
            )}
        </div>
    );
}
