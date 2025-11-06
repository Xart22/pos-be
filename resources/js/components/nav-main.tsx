import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

type NavItem = {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    isAdmin: boolean;
    items?: {
        isAdmin: boolean;
        title: string;
        url: string;
        isActive?: boolean;
    }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
    const { auth } = usePage<SharedData>().props;

    // Normalisasi role user → aman jika string / array / undefined
    const userRoles = Array.isArray((auth as any)?.user?.roles) ? (auth as any).user.roles : [(auth as any)?.user?.role ?? null].filter(Boolean);

    const canSeeAdmin = userRoles.some((r: string) => String(r).toLowerCase().includes('admin'));

    // Saring root & child berdasarkan isAdmin
    const visibleItems: NavItem[] = items
        .filter((i) => !i.isAdmin || canSeeAdmin)
        .map((i) => ({
            ...i,
            items: (i.items ?? []).filter((s) => !s.isAdmin || canSeeAdmin),
        }));

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {visibleItems.map((item) => {
                    const hasChildren = !!item.items?.length;
                    const defaultOpen = !!item.isActive || !!item.items?.some((s) => s.isActive);

                    if (hasChildren) {
                        // GROUP (nav with children)
                        return (
                            <Collapsible key={item.url} asChild defaultOpen={defaultOpen} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title} asChild>
                                            {item.url ? (
                                                <Link
                                                    href={item.url}
                                                    className="flex w-full items-center gap-2"
                                                    aria-current={item.isActive ? 'page' : undefined}
                                                >
                                                    {item.icon ? <item.icon /> : null}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </Link>
                                            ) : (
                                                <div className="flex w-full cursor-pointer items-center gap-2">
                                                    {item.icon ? <item.icon /> : null}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </div>
                                            )}
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items!.map((sub) => (
                                                <SidebarMenuSubItem key={sub.url}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={sub.url} aria-current={sub.isActive ? 'page' : undefined}>
                                                            <span>{sub.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    // SINGLE ITEM
                    return (
                        <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                {item.url ? (
                                    <Link
                                        href={item.url}
                                        className="flex w-full items-center gap-2"
                                        aria-current={item.isActive ? 'page' : undefined}
                                    >
                                        {item.icon ? <item.icon /> : null}
                                        <span>{item.title}</span>
                                    </Link>
                                ) : (
                                    <div className="flex w-full cursor-pointer items-center gap-2">
                                        {item.icon ? <item.icon /> : null}
                                        <span>{item.title}</span>
                                    </div>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
