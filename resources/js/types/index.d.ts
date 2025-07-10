import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    nip: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    base_gaji: number;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Menu {
    id: number;
    categoryId: string;
    name: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    is_active: boolean;
    is_online: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Absensi {
    id: number;
    user: User;
    tanggal: string;
    jam_masuk: string;
    jam_keluar: string;
    status: string;
    keterangan: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
