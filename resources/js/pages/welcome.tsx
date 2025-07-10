import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Button } from '@headlessui/react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFC] p-6 text-[#1b1b18] dark:bg-[#0a0a0a]">
                <AppLogoIcon className="h-24 fill-current text-black md:h-32 dark:text-white" />
                <h1 className="mt-6 text-2xl font-bold md:text-3xl">Welcome to Outside Coffee</h1>
                <Button className="mt-4 rounded-lg bg-[#F75D33] px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-[#e0e0e0] dark:bg-[#1b1b18] dark:text-white dark:hover:bg-[#333333]">
                    <Link href="/login" className="text-white dark:text-white">
                        Login to your account
                    </Link>
                </Button>
            </div>
        </>
    );
}
