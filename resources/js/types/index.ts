export interface Service {
    id: number;
    title: string;
    slug: string;
    icon: string;
    short_description: string;
    full_description?: string | null;
    features?: string[] | null;
    order: number;
    is_active: boolean;
}

export interface Project {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    image?: string | null;
    technologies?: string[] | null;
    live_url?: string | null;
    is_demo: boolean;
    order: number;
    is_featured: boolean;
}

export interface Message {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    service?: string | null;
    details: string;
    ip_address?: string | null;
    is_read: boolean;
    created_at: string;
}

export interface SiteSettings {
    [key: string]: string;
}

export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
    errors: Record<string, string>;
}
