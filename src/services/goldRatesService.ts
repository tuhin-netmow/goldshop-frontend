export interface GoldRate {
    id?: number;
    purity: string;
    rate_per_gram: number;
    effective_date?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const GoldRatesService = {
    async getTodayRates() {
        const response = await fetch(`${API_URL}/gold-rates/today`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const result = await response.json();
        return result.data;
    },

    async setRate(data: { purity: string; rate_per_gram: number }) {
        const response = await fetch(`${API_URL}/gold-rates`, {
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
