"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Printer, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RepairsService, type Repair, type RepairPayment } from "@/services/repairsService";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import { useAppSelector } from "@/store/store";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function RepairPaymentReceipt() {
    const { id, paymentId } = useParams();
    const [repair, setRepair] = useState<Repair | null>(null);
    const [loading, setLoading] = useState(true);
    const currency = useAppSelector((state) => state.currency.value);
    const { data: settingsData } = useGetSettingsInfoQuery();
    const company = settingsData?.data;

    useEffect(() => {
        if (id) fetchRepair(Number(id));
    }, [id]);

    const fetchRepair = async (repairId: number) => {
        setLoading(true);
        try {
            const res = await RepairsService.getById(repairId);
            if (res.success && res.data) {
                setRepair(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!repair) return <div className="p-8 text-center text-red-500">Repair record not found.</div>;

    // Find the specific payment
    const isDeposit = paymentId === "deposit";
    const payment = isDeposit
        ? ({
            id: 0,
            amount: Number(repair.deposit_amount),
            payment_method: repair.deposit_method || "Cash",
            payment_date: repair.created_at || new Date().toISOString(),
            notes: "Initial Deposit"
        } as RepairPayment)
        : repair.payments?.find(p => p.id === Number(paymentId));

    if (!payment) return <div className="p-8 text-center text-red-500">Payment record not found.</div>;

    // Calculate totals
    const totalRepairAmount = Number(repair.estimated_cost || 0);
    const totalPaid = Number(repair.deposit_amount || 0) + (repair.payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0);
    const balanceDue = totalRepairAmount - totalPaid;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 print:p-0 print:m-0 print:bg-white">
            <div className="max-w-4xl mx-auto space-y-6 print:space-y-2 print:p-0 print:max-w-full">

                {/* No-Print Actions */}
                <div className="flex justify-between items-center print:hidden">
                    <Link to={`/dashboard/repairs/${id}`}>
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Repair Details
                        </Button>
                    </Link>
                    <Button onClick={() => window.print()} className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Printer className="w-4 h-4" /> Print Receipt
                    </Button>
                </div>

                {/* RECEIPT PAPER */}
                <div className="bg-white text-black p-10 shadow-lg rounded-sm print:shadow-none print:w-full print:h-full print:rounded-none print:p-4">

                    {/* Receipt Header */}
                    <div className="flex justify-between items-start border-b pb-8 mb-8 print:pb-2 print:mb-2">
                        <div>
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                <CreditCard className="w-8 h-8" />
                                <span className="text-2xl font-bold tracking-tight">{company?.company_name || "GOLD SHOP"}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                {company?.address || "123 Gold Souk Street"}<br />
                                Phone: {company?.phone || "+971 4 123 4567"}<br />
                                Email: {company?.email || "sales@goldshop.com"}
                            </p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-2">RECEIPT</h1>
                            <p className="font-mono font-medium text-lg">#{isDeposit ? `DEP-${repair.id}` : (payment as any).reference_number || `PAY-${payment.id}`}</p>
                            <p className="text-sm text-gray-500 mt-1">Date: {format(new Date(payment.payment_date), "PPP")}</p>
                        </div>
                    </div>

                    {/* Bill To & Payment Details */}
                    <div className="flex justify-between gap-10 mb-10 print:mb-3 print:gap-6">
                        <div className="w-1/2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Received From</h3>
                            <div className="bg-gray-50 p-4 rounded border border-gray-100 print:bg-transparent print:border-none print:p-0">
                                <p className="font-bold text-lg">{repair.customer?.name || repair.customer_name || "Guest Customer"}</p>
                                <p className="text-gray-600">{repair.customer?.phone || repair.customer_phone}</p>
                                <p className="text-gray-600">{repair.customer?.email}</p>
                            </div>
                        </div>
                        <div className="w-1/2 text-right">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Details</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Repair No:</span>
                                    <span className="font-medium font-mono text-xs uppercase">#{repair.repair_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Method:</span>
                                    <span className="font-medium uppercase">{payment.payment_method?.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Collected By:</span>
                                    <span className="font-medium">Administrator</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Confirmation Box */}
                    <div className="mb-10 print:mb-3 bg-green-50 border-2 border-green-200 rounded-lg p-6 print:p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Amount Received</h3>
                                <p className="text-4xl font-black text-green-700">{currency} {Number(payment.amount || 0).toFixed(2)}</p>
                            </div>
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                    </div>

                    {/* Payment History Table */}
                    <div className="mb-10 print:mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment History</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-3 font-semibold text-gray-600">Date</th>
                                    <th className="py-3 font-semibold text-gray-600">Reference</th>
                                    <th className="py-3 font-semibold text-gray-600">Method</th>
                                    <th className="py-3 font-semibold text-gray-600 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Initial Deposit row */}
                                {Number(repair.deposit_amount) > 0 && (
                                    <tr className={`border-b border-gray-50 ${isDeposit ? 'bg-blue-50 font-bold' : ''}`}>
                                        <td className="py-3">{format(new Date(repair.created_at || new Date()), 'dd/MM/yyyy')}</td>
                                        <td className="py-3 font-mono text-sm">Initial Deposit</td>
                                        <td className="py-3 capitalize text-sm">{repair.deposit_method || "Cash"}</td>
                                        <td className="py-3 text-right font-mono">{currency} {Number(repair.deposit_amount).toFixed(2)}</td>
                                    </tr>
                                )}

                                {repair.payments?.map((p, idx) => (
                                    <tr key={idx} className={`border-b border-gray-50 ${p.id === (payment as any).id ? 'bg-blue-50 font-bold' : ''}`}>
                                        <td className="py-3">{format(new Date(p.payment_date), 'dd/MM/yyyy')}</td>
                                        <td className="py-3 font-mono text-sm">{p.notes || '-'}</td>
                                        <td className="py-3 capitalize text-sm">{p.payment_method?.replace('_', ' ')}</td>
                                        <td className="py-3 text-right font-mono">{currency} {Number(p.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-12 print:mb-3">
                        <div className="w-1/2 space-y-2">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="font-medium text-gray-600">Invoice Total</span>
                                <span className="font-bold">{currency} {totalRepairAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-green-700">
                                <span>Total Paid</span>
                                <span>- {currency} {totalPaid.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between border-t border-gray-200 pt-3 text-lg">
                                <span className="font-bold text-gray-800">Balance Due</span>
                                <span className={`font-black ${balanceDue > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {currency} {balanceDue.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {payment.notes && (
                        <div className="mb-8 print:mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <h4 className="text-sm font-bold mb-1">Notes</h4>
                            <p className="text-sm text-gray-700">{payment.notes}</p>
                        </div>
                    )}

                    {/* Footer / Terms */}
                    <div className="border-t pt-8 mt-12 grid grid-cols-2 gap-12 print:mt-3 print:pt-2 print:gap-6">
                        <div>
                            <h4 className="text-sm font-bold mb-2">Payment Terms</h4>
                            <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                                <li>This receipt is valid proof of payment.</li>
                                <li>Please retain this receipt for your records.</li>
                                <li>All payments are non-refundable unless otherwise stated.</li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-end items-center">
                            <div className="w-48 border-b border-gray-300 mb-2"></div>
                            <p className="text-xs text-gray-400">Authorized Signature</p>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center mt-8 print:mt-2 text-xs text-gray-400">
                        <p>Thank you for trusting us with your jewelry!</p>
                        <p className="mt-1">This is a computer-generated receipt for repair services.</p>
                    </div>

                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            margin: 0.3cm;
            size: A4;
          }
          * {
            overflow: visible !important;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
        </div>
    );
}
