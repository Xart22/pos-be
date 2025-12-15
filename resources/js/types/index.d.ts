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

export interface Variants {
    id: number;
    position: number;
    variant: Variant[];
}

export interface Variant {
    id: number;
    name: string;
    options: OptionsVariant[];
}

export interface OptionsVariant {
    id: number;
    name: string;
    price: number;
    position: number;
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
    variants?: Variants[];
    recipes?: Recipe[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface TxMenu {
    menu: string;
    category: number;
    quantity: number;
    base_price: number;
    variant_price: number;
    total_price: number;
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

export interface BahanBaku {
    id: number;
    kode: string;
    name: string;
    harga: number;
    stock: number;
    satuan: string;
    deskripsi?: string; // Optional field
    per_unit: number;
    total?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Bahan {
    id: number;
    recipe_id: number;
    bahan_baku_id: number;
    bahan_baku: BahanBaku;
    jumlah: number;
    satuan: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Recipe {
    id: number;
    menu_id: number;
    instructions: string;
    bahan_bakus: Bahan[];
    menu: Menu;
    variant_option?: OptionsVariant | null;
}

export interface Category {
    id: number;
    position: number;
    name: string;
    icon: string;
}

export interface OmsetChartData {
    data: {
        date: string;
        omset: number;
    };
}
export interface Operational {
    id: number;
    name: string;
    harga: number;
    deskripsi?: string; // Optional field
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface TransactionDetails {
    id: number;
    transaction_id: number;
    menu_id: number;
    quantity: number;
    [key: string]: unknown; // This allows for additional properties...
    menu: Menu;
}

export interface SumIngredients {
    bahan_baku_id: number;
    name: string;
    unit: string;
    quantity: number;
}

export interface TransactionItem {
    name: string;
    quantity: number;
}

export interface CashOut {
    id: number;
    desc: string;
    amount: number;
    tanggal: string;
}

export type UsedIngredient = {
    bahan_baku_id: number;
    name: string;
    unit: string;
    quantity: number;
    cost: number;
};

export type StockRow = {
    name: string;
    category: number | null;
    quantity: number;
    base_price: number;
    variant_price: number;
    total_price: number;
    variants: any[];
    recipe: any;
    used_ingredients: UsedIngredient[];
    menu: string;
};

export type IngredientSummary = {
    bahan_baku_id: number;
    name: string;
    unit: string;
    quantity: number;
    cost?: number;
};

export type CashBon = {
    id: number;
    jumlah: number;
    tanggal: string;
};

export type EmployeeReport = {
    name: string;
    total_gaji: number;
    base_gaji: number;
    cashbon: CashBon[];
    total_cashbon: number;
    full_time: number;
    gaji_bersih: number;
};
