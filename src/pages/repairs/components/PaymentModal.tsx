import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DollarSign, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RepairsService } from "@/services/repairsService";
import { useAppSelector } from "@/store/store";

const paymentSchema = z.object({
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    payment_method: z.string().min(1, "Payment method is required"),
    notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    repairId: number;
    balanceDue: number;
    onPaymentSuccess: () => void;
}

export function PaymentModal({ open, onOpenChange, repairId, balanceDue, onPaymentSuccess }: PaymentModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const currency = useAppSelector((state) => state.currency.value);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            amount: balanceDue > 0 ? balanceDue : 0,
            payment_method: "Cash",
            notes: "",
        },
    });

    const onSubmit = async (values: PaymentFormValues) => {
        setSubmitting(true);
        try {
            const res = await RepairsService.addPayment(repairId, values);
            if (res.success) {
                toast.success("Payment added successfully");
                onOpenChange(false);
                onPaymentSuccess();
                form.reset();
            } else {
                toast.error(res.message || "Failed to add payment");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Add Payment
                    </DialogTitle>
                    <DialogDescription>
                        Record a new payment for this repair job.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Current Balance Due:</span>
                            <span className="text-lg font-bold text-orange-600">{currency} {balanceDue.toFixed(2)}</span>
                        </div>

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount ({currency})</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="font-bold text-lg"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
                                    <FormLabel>Payment Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                                            <SelectItem value="Debit Card">Debit Card</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g. Receipt #1234"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700">
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Payment
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
