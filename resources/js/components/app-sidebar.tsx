import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { CircleDollarSign, Database, LayoutGrid, User, Utensils } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
        isAdmin: false,
    },
    {
        title: 'Users',
        url: '/users',
        icon: User,
        isAdmin: true,
    },
    {
        title: 'Master Data',
        isAdmin: false,
        icon: Utensils,
        items: [
            {
                title: 'Menu',
                url: '/master-data/menu',
                isAdmin: false,
            },
            {
                title: 'Categories',
                url: '/master-data/categories',
                isAdmin: false,
            },
            {
                title: 'Variants',
                url: '/master-data/variants',
                isAdmin: false,
            },
            {
                title: 'Bahan Baku',
                url: '/master-data/bahan-baku',
                isAdmin: false,
            },
            {
                title: 'Recipes',
                url: '/master-data/recipes',
                isAdmin: false,
            },
        ],
    },
    {
        title: 'CashFlow',
        icon: CircleDollarSign,
        isAdmin: true,
        items: [
            {
                title: 'Cash In',
                url: '/cash-flow/cash-in',
                isAdmin: true,
            },
            {
                title: 'Cash Out',
                url: '/cash-flow/cash-out',
                isAdmin: true,
            },
            {
                title: 'Operational',
                url: '/cash-flow/operational',
                isAdmin: true,
            },
        ],
    },
    {
        title: 'Stock Opname',
        url: '/stock-opname',
        icon: Database,
        isAdmin: true,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
