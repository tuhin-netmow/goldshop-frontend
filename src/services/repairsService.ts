export interface Repair {
    id?: number;
    repair_number: string;
    customer_id: number;
    item_description: string;
    gross_weight_received: number;
    net_weight_received?: number;
    issue_description?: string;
    estimated_cost?: number;
    deposit_amount?: number;
    deposit_method?: string;
    status: 'received' | 'in_progress' | 'completed' | 'delivered' | 'cancelled' | 'ready';
    promised_date?: string;
    images?: string[];
    customer_name?: string;
    customer_phone?: string;
    customer?: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    created_at?: string;
    payments?: RepairPayment[];
}

export interface RepairPayment {
    id: number;
    repair_id: number;
    amount: number;
    payment_method: string;
    notes?: string;
    payment_date: string;
    created_at: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const RepairsService = {
    async getAll(params?: { page?: number; limit?: number; search?: string; status?: string }) {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.search) query.append('search', params.search);
        if (params?.status) query.append('status', params.status);

        const response = await fetch(`${API_URL}/repairs?${query.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await response.json();
    },

    async getById(id: number) {
        const response = await fetch(`${API_URL}/repairs/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await response.json();
    },

    async getNextNumber() {
        const response = await fetch(`${API_URL}/repairs/next-number`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await response.json();
    },

    async create(data: Partial<Repair>) {
        const response = await fetch(`${API_URL}/repairs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async updateStatus(id: number, status: string) {
        const response = await fetch(`${API_URL}/repairs/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        });
        return await response.json();
    },

    async addPayment(id: number, data: { amount: number; payment_method: string; notes?: string }) {
        const response = await fetch(`${API_URL}/repairs/${id}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
};
