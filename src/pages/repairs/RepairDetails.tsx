import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
    ArrowLeft,
    Hammer,
    User,
    Calendar,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Scale,
    FileText,
    Clock,
    Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RepairsService, type Repair } from "@/services/repairsService";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/store";
import { PaymentModal } from "./components/PaymentModal";

export default function RepairDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currency = useAppSelector((state) => state.currency.value);

    const [repair, setRepair] = useState<Repair | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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
                navigate("/dashboard/repairs");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load repair details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!repair) return;
        setUpdating(true);
        try {
            const res = await RepairsService.updateStatus(repair.id!, newStatus);
            if (res.success) { // Note: Backend returns { success: true }
                toast.success(`Status updated to ${newStatus}`);
                fetchRepair(repair.id!);
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'in_progress': return 'bg-blue-600 hover:bg-blue-700';
            case 'ready':
            case 'completed': return 'bg-green-600 hover:bg-green-700';
            case 'delivered': return 'bg-gray-600 hover:bg-gray-700';
            case 'cancelled': return 'bg-red-600 hover:bg-red-700';
            default: return 'bg-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!repair) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link to="/dashboard/repairs" className="hover:text-orange-600 transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Back to Repairs
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Hammer className="w-8 h-8 text-orange-600" />
                            Repair #{repair.repair_number}
                        </h1>
                        <Badge className={`${getStatusColor(repair.status)} text-white capitalize px-3 py-1 shadow-sm`}>
                            {repair.status.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Status Actions */}
                    {repair.status === 'received' && (
                        <Button
                            onClick={() => handleStatusUpdate('in_progress')}
                            disabled={updating}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Start Repair
                        </Button>
                    )}
                    {repair.status === 'in_progress' && (
                        <Button
                            onClick={() => handleStatusUpdate('ready')}
                            disabled={updating}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Mark as Ready
                        </Button>
                    )}
                    {(repair.status === 'ready' || repair.status === 'completed') && (
                        <Button
                            onClick={() => handleStatusUpdate('delivered')}
                            disabled={updating}
                            className="bg-gray-800 hover:bg-gray-900 text-white"
                        >
                            Mark as Delivered
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Item Details */}
                    <Card className="shadow-sm border-t-4 border-t-orange-500 py-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-orange-600" />
                                Item Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Description</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {repair.item_description.split('\n').map((line, i) => (
                                        <li key={i} className="text-lg font-medium">{line}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                                    <div className="flex items-center gap-2 mb-1 text-orange-700 dark:text-orange-400">
                                        <Scale className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Received Weight</span>
                                    </div>
                                    <p className="text-2xl font-bold">{Number(repair.gross_weight_received).toFixed(2)} g</p>
                                    <p className="text-xs text-muted-foreground">Net: {Number(repair.net_weight_received || 0).toFixed(2)} g</p>
                                </div>
                                {repair.net_weight_received && (
                                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                                        <div className="flex items-center gap-2 mb-1 text-green-700 dark:text-green-400">
                                            <Scale className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Received Net</span>
                                        </div>
                                        <p className="text-2xl font-bold">{Number(repair.net_weight_received).toFixed(2)} g</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Issue / Work Required
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 italic">
                                    "{repair.issue_description || 'No description provided.'}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="py-6 gap-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Received Date</p>
                                        <p className="font-medium">
                                            {repair.created_at ? format(new Date(repair.created_at), "PPP") : "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                                    <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Promised Delivery</p>
                                        <p className="font-medium text-orange-600">
                                            {repair.promised_date ? format(new Date(repair.promised_date), "PPP") : "Not set"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment History - ADDED */}
                    <Card className="shadow-sm border-border/60 overflow-hidden">
                        <CardHeader className="bg-muted/30 py-4 border-b">
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Payment History
                            </CardTitle>
                        </CardHeader>
                        <div className="max-h-[400px] overflow-auto relative">
                            <table className="w-full text-sm text-left border-separate border-spacing-0">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/80 backdrop-blur-sm sticky top-0 z-10 border-b shadow-sm">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold border-b bg-muted/90 first:rounded-tl-lg whitespace-nowrap">Date</th>
                                        <th className="px-6 py-3 font-semibold border-b bg-muted/90 whitespace-nowrap">Repair #</th>
                                        <th className="px-6 py-3 font-semibold border-b bg-muted/90 whitespace-nowrap">Reference</th>
                                        <th className="px-6 py-3 font-semibold border-b bg-muted/90 whitespace-nowrap">Method</th>
                                        <th className="px-6 py-3 font-semibold text-right border-b bg-muted/90 whitespace-nowrap">Amount</th>
                                        <th className="px-6 py-3 font-semibold text-center border-b bg-muted/90 last:rounded-tr-lg whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y border-b">
                                    {/* Initial Deposit if exists */}
                                    {Number(repair.deposit_amount) > 0 && (
                                        <tr className="bg-green-50/30 dark:bg-green-900/10">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {repair.created_at ? format(new Date(repair.created_at), "PP") : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                    #{repair.repair_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                                Initial Deposit
                                            </td>
                                            <td className="px-6 py-4 capitalize whitespace-nowrap">
                                                <Badge variant="secondary" className="font-normal">{repair.deposit_method || "Cash"}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-green-600 whitespace-nowrap">
                                                {currency} {Number(repair.deposit_amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <Link to={`/dashboard/repairs/${repair.id}/payments/deposit/receipt`}>
                                                    <Button variant="outline" size="sm" className="h-8">
                                                        <Printer className="w-3.5 h-3.5 mr-1" /> Receipt
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Subsequent Payments */}
                                    {repair.payments && repair.payments.length > 0 ? (
                                        repair.payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {payment.payment_date ? format(new Date(payment.payment_date), "PP") : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                        #{repair.repair_number}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                                    {payment.notes || "-"}
                                                </td>
                                                <td className="px-6 py-4 capitalize whitespace-nowrap">
                                                    <Badge variant="secondary" className="font-normal">{payment.payment_method}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-green-600 whitespace-nowrap">
                                                    {currency} {Number(payment.amount).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <Link to={`/dashboard/repairs/${repair.id}/payments/${payment.id}/receipt`}>
                                                        <Button variant="outline" size="sm" className="h-8">
                                                            <Printer className="w-3.5 h-3.5 mr-1" /> Receipt
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        (!repair.deposit_amount || Number(repair.deposit_amount) === 0) && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                                    No payments recorded yet.
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                </div>

                {/* Right Column - Customer & Financials */}
                <div className="space-y-6">

                    {/* Customer Info */}
                    <Card className="py-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="w-5 h-5 text-indigo-600" />
                                Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {(repair.customer?.name || repair.customer_name || "G").charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{repair.customer?.name || repair.customer_name || "Guest Customer"}</p>
                                    {(repair.customer?.phone || repair.customer_phone) && (
                                        <p className="text-sm text-muted-foreground">{repair.customer?.phone || repair.customer_phone}</p>
                                    )}
                                    {repair.customer?.email && (
                                        <p className="text-sm text-muted-foreground">{repair.customer.email}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financials */}
                    <Card className="overflow-hidden border-t-4 border-t-green-600 pt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                Costs & Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Estimated Cost</span>
                                <span className="font-medium text-lg">{currency} {Number(repair.estimated_cost).toFixed(2)}</span>
                            </div>

                            {Number(repair.deposit_amount) > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-green-600" /> Initial Deposit
                                    </span>
                                    <span className="font-medium text-green-600">- {currency} {Number(repair.deposit_amount).toFixed(2)}</span>
                                </div>
                            )}

                            {repair.payments?.map((payment) => (
                                <div key={payment.id} className="flex justify-between items-center text-sm border-l-2 border-green-200 pl-2">
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs">{format(new Date(payment.payment_date), 'MMM d, yyyy')}</span>
                                        <span className="text-xs text-gray-500">{payment.payment_method}</span>
                                    </div>
                                    <span className="font-medium text-green-600">- {currency} {Number(payment.amount).toFixed(2)}</span>
                                </div>
                            ))}

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Balance Due</span>
                                <span className="font-bold text-xl text-orange-600">
                                    {currency} {(Number(repair.estimated_cost || 0) - (Number(repair.deposit_amount || 0) + (repair.payments?.reduce((s, p) => s + Number(p.amount), 0) || 0))).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => setShowPaymentModal(true)}
                                disabled={Number(repair.estimated_cost || 0) <= (Number(repair.deposit_amount || 0) + (repair.payments?.reduce((s, p) => s + Number(p.amount), 0) || 0))}
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Add Payment
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate(`/dashboard/repairs/${repair.id}/invoice`)}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Print / Generate Invoice
                            </Button>
                        </div>
                    </Card>

                    <PaymentModal
                        open={showPaymentModal}
                        onOpenChange={setShowPaymentModal}
                        repairId={repair.id!}
                        balanceDue={Number(repair.estimated_cost || 0) - (Number(repair.deposit_amount || 0) + (repair.payments?.reduce((s, p) => s + Number(p.amount), 0) || 0))}
                        onPaymentSuccess={() => fetchRepair(repair.id!)}
                    />

                </div>
            </div>
        </div>
    );
}
