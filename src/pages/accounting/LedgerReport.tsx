"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AccountingService, type LedgerReportData, type Account } from "@/services/accountingService";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

export default function LedgerReport() {
    const currency = useAppSelector((state) => state.currency.value);
    const [fromDate, setFromDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [reportData, setReportData] = useState<LedgerReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [openCombobox, setOpenCombobox] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setAccountsLoading(true);
        try {
            const res = await AccountingService.getAccounts({ limit: 1000 }); // Fetch all for dropdown
            if (res.data && res.data.rows) {
                setAccounts(res.data.rows);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load accounts");
        } finally {
            setAccountsLoading(false);
        }
    };

    const generateReport = async () => {
        if (!selectedAccount) {
            toast.error("Please select an account");
            return;
        }

        setLoading(true);
        try {
            const params = {
                from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
                to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
            };
            const res = await AccountingService.getLedgerReport(Number(selectedAccount), params);
            if (res.success && res.data) {
                setReportData(res.data);
            } else {
                toast.error(res.message || "Failed to generate report");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while generating report");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ledger Report</h2>
                    <p className="text-muted-foreground">View detailed transaction history for a specific account.</p>
                </div>
                <Button variant="outline" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
            </div>

            <Card className="print:hidden">
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Select Account</label>
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className="w-full justify-between"
                                        disabled={accountsLoading}
                                    >
                                        {accountsLoading ? "Loading accounts..." : (selectedAccount
                                            ? accounts.find((account) => String(account.id) === selectedAccount)?.name
                                            : "Select account...")}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search account..." />
                                        <CommandEmpty>No account found.</CommandEmpty>
                                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                                            {accounts.map((account) => (
                                                <CommandItem
                                                    key={account.id}
                                                    value={account.name}
                                                    onSelect={() => {
                                                        setSelectedAccount(String(account.id));
                                                        setOpenCombobox(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedAccount === String(account.id) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <span>{account.name} ({account.code})</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">From Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !fromDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={fromDate}
                                        onSelect={setFromDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">To Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !toDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={toDate}
                                        onSelect={setToDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button onClick={generateReport} disabled={loading || !selectedAccount}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Generate Report
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {reportData && (
                <div className="space-y-6">
                    <div className="hidden print:block mb-6">
                        <h1 className="text-2xl font-bold">Ledger Report</h1>
                        <p>Account: {accounts.find(a => String(a.id) === selectedAccount)?.name}</p>
                        <p>Period: {fromDate ? format(fromDate, 'dd/MM/yyyy') : 'Start'} - {toDate ? format(toDate, 'dd/MM/yyyy') : 'End'}</p>
                    </div>

                    {/* Summary Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Opening Balance</CardDescription>
                                <CardTitle className="text-2xl">{currency} {reportData.opening_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Debit</CardDescription>
                                <CardTitle className="text-2xl text-emerald-600">
                                    {currency} {reportData.transactions.reduce((acc, curr) => acc + (curr.debit || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Credit</CardDescription>
                                <CardTitle className="text-2xl text-red-600">
                                    {currency} {reportData.transactions.reduce((acc, curr) => acc + (curr.credit || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardDescription>Closing Balance</CardDescription>
                                <CardTitle className="text-2xl text-primary">{currency} {reportData.closing_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Particulars</TableHead>
                                        <TableHead className="text-right text-emerald-600">Debit</TableHead>
                                        <TableHead className="text-right text-red-600">Credit</TableHead>
                                        <TableHead className="text-right font-bold">Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No transactions found in this period.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reportData.transactions.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell>{row.narration}</TableCell>
                                                <TableCell className="text-right">{row.debit > 0 ? row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}</TableCell>
                                                <TableCell className="text-right">{row.credit > 0 ? row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}</TableCell>
                                                <TableCell className="text-right font-medium">{row.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
