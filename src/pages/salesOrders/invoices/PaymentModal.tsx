import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddSalesPaymentMutation } from "@/store/features/salesOrder/salesOrder";

const paymentSchema = z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    payment_method: z.string().min(1, "Payment method is required"),
    payment_date: z.string().min(1, "Payment date is required"),
    reference_number: z.string().optional(),
    notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
    invoiceId: number;
    orderId: number;
    balanceDue: number;
    currency: string;
}

export function PaymentModal({ invoiceId, orderId, balanceDue, currency }: PaymentModalProps) {
    const [open, setOpen] = useState(false);
    const [addPayment, { isLoading }] = useAddSalesPaymentMutation();

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            amount: balanceDue,
            payment_method: "cash",
            payment_date: new Date().toISOString().split("T")[0],
            reference_number: "",
            notes: "",
        },
    });

    const onSubmit = async (values: PaymentFormValues) => {
        try {
            const payload = {
                order_id: orderId,
                invoice_id: invoiceId,
                amount: values.amount, // Keep as number
                payment_method: values.payment_method,
                reference_number: values.reference_number || undefined,
            };

            const res = await addPayment(payload as any).unwrap();

            if (res.status) {
                toast.success("Payment recorded successfully");
                setOpen(false);
                form.reset();
            } else {
                toast.error(res.message || "Failed to record payment");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to record payment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700">
                    <CreditCard className="w-4 h-4" /> Record Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                        Record a new payment for this invoice. Balance due: {currency} {balanceDue.toFixed(2)}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="payment_method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="card">Card</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                            <SelectItem value="online">Online Payment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="payment_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Date *</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reference_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reference Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., TXN123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Additional notes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Record Payment
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
