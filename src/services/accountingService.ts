const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export interface Account {
    id: number;
    code: string;
    name: string;
    type: string;
    parent?: number;
    level: number;
    balance?: number;
}

export interface Transaction {
    id: number;
    date: string;
    type: string;
    amount: string;
    description?: string;
    payment_mode?: string;
}

export interface LedgerEntry {
    date: string;
    narration: string;
    debit: number;
    credit: number;
    balance: number;
    type: string;
}

export interface LedgerReportData {
    account: number | string;
    opening_balance: number;
    closing_balance: number;
    transactions: LedgerEntry[];
}


export const AccountingService = {
    // Accounts
    getAccounts: async (params?: any) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/accounting/accounts?${query}`, {
            headers: getHeaders()
        });
        return await response.json();
    },

    getAccountTree: async () => {
        const response = await fetch(`${API_URL}/accounting/accounts/tree`, {
            headers: getHeaders()
        });
        return await response.json();
    },

    // Transactions
    getTransactions: async (params?: any) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/accounting/transactions?${query}`, {
            headers: getHeaders()
        });
        return await response.json();
    },

    // Reports
    getLedgerReport: async (accountId: number, params?: any) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/accounting/reports/ledger/${accountId}?${query}`, {
            headers: getHeaders()
        });
        return await response.json();
    },

    getJournalReport: async (params?: any) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/accounting/reports/journal?${query}`, {
            headers: getHeaders()
        });
        return await response.json();
    },

    getTrialBalance: async (date?: string) => {
        const query = date ? `?date=${date}` : '';
        const response = await fetch(`${API_URL}/accounting/reports/trial-balance${query}`, {
            headers: getHeaders()
        });
        return await response.json();
    },

    getProfitAndLoss: async (params?: any) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/accounting/reports/profit-and-loss?${query}`, {
            headers: getHeaders()
        });
        return await response.json();
    }
};
