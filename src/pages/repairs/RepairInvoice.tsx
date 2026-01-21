import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Printer, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RepairsService, type Repair } from "@/services/repairsService";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAppSelector } from "@/store/store";
import { Loader2 } from "lucide-react";

export default function RepairInvoice() {
    const { id } = useParams();
    const currency = useAppSelector((state) => state.currency.value);
    const [repair, setRepair] = useState<Repair | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchRepair(Number(id));
    }, [id]);

    const fetchRepair = async (repairId: number) => {
        setLoading(true);
        try {
            const res = await RepairsService.getById(repairId);
            if (res.success && res.data) {
                setRepair(res.data);
            } else {
                toast.error("Repair not found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load request");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!repair) return <div className="p-8 text-center text-red-500">Repair record not found.</div>;

    const totalPaid = Number(repair.deposit_amount || 0) + (repair.payments?.reduce((s, p) => s + Number(p.amount), 0) || 0);
    const balanceDue = Number(repair.estimated_cost || 0) - totalPaid;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 print:p-0 print:m-0 print:bg-white">
            <div className="max-w-4xl mx-auto space-y-6 print:space-y-2 print:p-0 print:max-w-full">

                {/* No-Print Actions */}
                <div className="flex justify-between items-center print:hidden">
                    <Link to={`/dashboard/repairs/${id}`}>
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Details
                        </Button>
                    </Link>
                    <Button onClick={() => window.print()} className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Printer className="w-4 h-4" /> Print Invoice
                    </Button>
                </div>

                {/* INVOICE PAPER */}
                <div className="bg-white text-black p-10 shadow-lg rounded-sm print:shadow-none print:w-full print:h-full print:rounded-none print:p-4">

                    {/* Invoice Header */}
                    <div className="flex justify-between items-start border-b pb-8 mb-8 print:pb-4 print:mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-orange-600 mb-2">
                                <Hammer className="w-8 h-8" />
                                <span className="text-2xl font-bold tracking-tight">GOLD SHOP REPAIRS</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                123 Gold Souk Street<br />
                                Jewelry Quarter, Dubai, UAE<br />
                                Phone: +971 4 123 4567<br />
                                Email: repairs@goldshop.com
                            </p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-2">Invoice</h1>
                            <p className="font-mono font-medium text-lg">#{repair.repair_number}</p>
                            <p className="text-sm text-gray-500 mt-1">Date: {format(new Date(), "PPP")}</p>
                        </div>
                    </div>

                    {/* Bill To & Details */}
                    <div className="flex justify-between gap-10 mb-10 print:mb-6">
                        <div className="w-1/2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Bill To</h3>
                            <div className="bg-gray-50 p-4 rounded border border-gray-100 print:bg-transparent print:border-none print:p-0">
                                <p className="font-bold text-lg">{repair.customer?.name || repair.customer_name || "Guest Customer"}</p>
                                <p className="text-gray-600">{repair.customer?.phone || repair.customer_phone}</p>
                                <p className="text-gray-600">{repair.customer?.email}</p>
                            </div>
                        </div>
                        <div className="w-1/2 text-right">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Job Details</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Received Date:</span>
                                    <span className="font-medium">{repair.created_at ? format(new Date(repair.created_at), "PP") : "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Promised Date:</span>
                                    <span className="font-medium">{repair.promised_date ? format(new Date(repair.promised_date), "PP") : "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="font-medium uppercase">{repair.status?.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mb-10 print:mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Service Description</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-3 font-semibold text-gray-600 w-1/2">Item & Description</th>
                                    <th className="py-3 font-semibold text-gray-600 text-center">Gross Wt.</th>
                                    <th className="py-3 font-semibold text-gray-600 text-center">Net Wt.</th>
                                    <th className="py-3 font-semibold text-gray-600 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-50">
                                    <td className="py-4 align-top">
                                        <p className="font-medium text-gray-900 mb-1 whitespace-pre-wrap">{repair.item_description}</p>
                                        <p className="text-sm text-gray-500 italic">Issue: {repair.issue_description}</p>
                                    </td>
                                    <td className="py-4 text-center align-top font-mono">{Number(repair.gross_weight_received).toFixed(2)} g</td>
                                    <td className="py-4 text-center align-top font-mono">{Number(repair.net_weight_received).toFixed(2)} g</td>
                                    <td className="py-4 text-right align-top font-mono font-medium">{currency} {Number(repair.estimated_cost).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-12 print:mb-6">
                        <div className="w-1/2 space-y-2">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="font-medium text-gray-600">Total Service Amount</span>
                                <span className="font-bold">{currency} {Number(repair.estimated_cost).toFixed(2)}</span>
                            </div>

                            {(repair.deposit_amount || 0) > 0 && (
                                <div className="flex justify-between text-green-700">
                                    <span>Initial Deposit</span>
                                    <span>- {currency} {Number(repair.deposit_amount).toFixed(2)}</span>
                                </div>
                            )}

                            {repair.payments?.map(p => (
                                <div key={p.id} className="flex justify-between text-green-700 text-sm">
                                    <span>Payment ({format(new Date(p.payment_date), 'dd/MM/yy')})</span>
                                    <span>- {currency} {Number(p.amount).toFixed(2)}</span>
                                </div>
                            ))}

                            <div className="flex justify-between border-t border-gray-200 pt-3 text-lg">
                                <span className="font-bold text-gray-800">Balance Due</span>
                                <span className="font-black text-orange-600">{currency} {balanceDue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Terms */}
                    <div className="border-t pt-8 mt-12 grid grid-cols-2 gap-12 print:mt-6 print:pt-4">
                        <div>
                            <h4 className="text-sm font-bold mb-2">Terms & Conditions</h4>
                            <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                                <li>Items left for more than 90 days after completion will be sold to recover costs.</li>
                                <li>Original receipt must be presented for collection.</li>
                                <li>We are not responsible for damage to treated or fragile stones during repair.</li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-end items-center">
                            <div className="w-48 border-b border-gray-300 mb-2"></div>
                            <p className="text-xs text-gray-400">Authorized Signature</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
