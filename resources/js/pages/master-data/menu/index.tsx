import { ItemMenu } from '@/components/card-product';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Menu } from '@/types';
import { Head } from '@inertiajs/react';

type MenuProps = {
    menus: Menu[];
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: '/master-data/menu',
    },
];

const menu = ({ menus }: MenuProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8">
                    {menus.map((menu: Menu) => (
                        <ItemMenu
                            key={menu.id}
                            image={'https://outsidecoffee.id/' + menu.image}
                            title={menu.name}
                            price={`Rp ${menu.price.toLocaleString('id-ID')}`}
                            item={`${menu.stock} item`}
                            edit={true}
                            onTap={() => {
                                window.location.href = `/master-data/menu/${menu.id}/edit`;
                            }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default menu;
