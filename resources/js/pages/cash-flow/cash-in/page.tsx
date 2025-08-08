import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Menu } from '@/types';
import { Head } from '@inertiajs/react';

type MenuProps = {
    menus: Menu[];
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cash In',
        href: '/cash-flow/cash-in',
    },
];

const Cashin = ({ menus }: MenuProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cash In" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"></div>
        </AppLayout>
    );
};

export default Cashin;
