
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: null;
    created_at?: string;
    updated_at?: string;
}

export interface State {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Finance {
    id: number;
    title: string;
    organization: string;
    total_value: number;
    added_value: number;
    id_state: number;
    id_category: number;
    state_name: string;
    category_name: string;
}