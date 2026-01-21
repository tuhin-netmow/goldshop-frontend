import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Calendar as CalendarIcon,
    Save,
    User,
    CheckCircle2,
    Hammer,
    Scale,
    FileText,
    DollarSign,
    Search,
    Plus,
    Trash2,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RepairsService } from "@/services/repairsService";
import { useGetCustomersQuery } from "@/store/features/customers/customersApi";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { BackButton } from "@/components/BackButton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/store";

// --- Schema Definitions ---

const repairItemSchema = z.object({
    description: z.string().min(1, "Description is required"),
    gross_weight: z.number().min(0, "Required"),
    net_weight: z.number().optional(),
    issue: z.string().optional(),
    cost: z.number().optional(),
});

const repairSchema = z.object({
    customer_id: z.number().min(1, "Customer is required"),
    items: z.array(repairItemSchema).min(1, "Add at least one item"),
    deposit_amount: z.number().optional(),
    deposit_method: z.string().optional(),
    expected_delivery_date: z.date().optional(),
});

type RepairFormValues = z.infer<typeof repairSchema>;

// --- Components ---

const CustomerSelect = ({ field }: { field: { value: number; onChange: (val: number) => void } }) => {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const { data } = useGetCustomersQuery({ page: 1, limit: 10, search: q });
    const list = data?.data || [];
    const selected = list.find((c) => c.id === field.value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-full justify-between h-12 text-base",
                        !field.value && "text-muted-foreground"
                    )}
                >
                    {selected ? (
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                                {selected.name.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{selected.name}</span>
                            <span className="text-xs text-muted-foreground ml-1">({selected.phone})</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            <span>Select Customer...</span>
                        </div>
                    )}
                    <User className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Search customer (name or phone)..." onValueChange={setQ} />
                    <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            {list.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    value={c.name}
                                    onSelect={() => {
                                        field.onChange(c.id);
                                        setOpen(false);
                                    }}
                                    className="cursor-pointer py-3"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                            {c.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{c.name}</span>
                                            <span className="text-xs text-muted-foreground">{c.phone}</span>
                                        </div>
                                        {field.value === c.id && <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default function CreateRepair() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const currency = useAppSelector((state) => state.currency.value);
    const [repairNumber, setRepairNumber] = useState("Generating...");

    useEffect(() => {
        const fetchNextNumber = async () => {
            try {
                const res = await RepairsService.getNextNumber();
                if (res.success) setRepairNumber(res.data);
                else setRepairNumber("REP-????");
            } catch (e) {
                console.error(e);
                setRepairNumber("REP-????");
            }
        };
        fetchNextNumber();
    }, []);

    // Default dates
    const today = new Date();
    const defaultDelivery = new Date(today);
    defaultDelivery.setDate(today.getDate() + 3);

    const form = useForm<RepairFormValues>({
        resolver: zodResolver(repairSchema),
        defaultValues: {
            customer_id: 0,
            items: [
                { description: "", gross_weight: 0, net_weight: 0, issue: "", cost: 0 }
            ],
            deposit_amount: 0,
            deposit_method: "cash",
            expected_delivery_date: defaultDelivery,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    // watch for live calculations
    const watchedItems = form.watch("items");
    const depositAmount = form.watch("deposit_amount") || 0;

    const totalEstimatedCost = watchedItems.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    const totalGrossWeight = watchedItems.reduce((acc, curr) => acc + (curr.gross_weight || 0), 0);
    const balanceDue = Math.max(0, totalEstimatedCost - depositAmount);

    const onSubmit = async (values: RepairFormValues) => {
        setSubmitting(true);
        try {
            // Aggregate data for backend
            const totalGross = values.items.reduce((s, i) => s + i.gross_weight, 0);
            const totalNet = values.items.reduce((s, i) => s + (i.net_weight || 0), 0);
            const totalCost = values.items.reduce((s, i) => s + (i.cost || 0), 0);

            const itemDesc = values.items.map((i, idx) =>
                `${idx + 1}. ${i.description} | GW: ${i.gross_weight}g${i.net_weight ? ` | NW: ${i.net_weight}g` : ''}`
            ).join('\n');

            const issueDesc = values.items.map((i, idx) =>
                i.issue ? `${idx + 1}. ${i.issue}` : null
            ).filter(Boolean).join('\n');

            const payload = {
                customer_id: values.customer_id,
                item_description: itemDesc,
                gross_weight_received: totalGross,
                net_weight_received: totalNet,
                issue_description: issueDesc,
                estimated_cost: totalCost,
                deposit_amount: values.deposit_amount,
                deposit_method: values.deposit_method,
                status: 'received' as const,
                promised_date: values.expected_delivery_date
                    ? format(values.expected_delivery_date, 'yyyy-MM-dd')
                    : undefined
            };

            const res = await RepairsService.create(payload);
            if (res.success) {
                toast.success("Repair Job Created Successfully");
                navigate("/dashboard/repairs");
            } else {
                toast.error(res.message || "Failed to create repair");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Hammer className="w-8 h-8 text-orange-600" />
                        New Repair Job
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Record items, weights, and estimate costs
                    </p>
                </div>
                <BackButton />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT: Items & Customer (8 Cols) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Ticket Info Card */}
                            <Card className="shadow-sm border-l-4 border-l-slate-600 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border shadow-xs">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Ticket Number</p>
                                            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-wider font-mono">
                                                {repairNumber}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block h-10 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Start Date</p>
                                            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                                                <CalendarIcon className="w-4 h-4 text-orange-600" />
                                                {format(new Date(), "PPP")}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="px-3 py-1 bg-yellow-100 text-yellow-800 border-yellow-200 shadow-xs">
                                        DRAFT
                                    </Badge>
                                </CardContent>
                            </Card>

                            {/* Customer Select */}
                            <Card className="shadow-sm border-l-4 border-l-orange-500">
                                <CardHeader className="bg-orange-50/50 dark:bg-orange-950/10 py-4 gap-0">
                                    <div className="flex items-center gap-2 text-xl font-semibold text-orange-900 dark:text-orange-100">
                                        <User className="w-5 h-5" />
                                        Customer Information
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2 pb-6">
                                    <FormField
                                        control={form.control}
                                        name="customer_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <CustomerSelect field={field} />
                                                </FormControl>
                                                <FormMessage />
                                                <div className="mt-2 text-xs text-right text-muted-foreground">
                                                    Can't find customer? <span className="text-orange-600 font-medium cursor-pointer hover:underline" onClick={() => navigate('/dashboard/customers/create')}>Add New Customer</span>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* ITEM LIST */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Repair Items ({fields.length})
                                    </h2>
                                    <Button
                                        type="button"
                                        onClick={() => append({ description: "", gross_weight: 0, net_weight: 0, issue: "", cost: 0 })}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <Plus className="w-4 h-4" /> Add Item
                                    </Button>
                                </div>

                                {fields.map((field, index) => (
                                    <Card key={field.id} className="relative shadow-sm border-l-4 border-l-blue-400 overflow-hidden transition-all hover:shadow-md">
                                        <div className="absolute top-0 right-0 p-2 z-10">
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <CardContent className="p-5 space-y-4">
                                            {/* Row 1: Description & Issue */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase text-muted-foreground font-bold">Item {index + 1} Description</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="e.g. Gold Ring" {...field} className="font-medium" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.issue`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs uppercase text-muted-foreground font-bold">Issue / Work</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="e.g. Broken Shank, Polish" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Row 2: Weights & Cost */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.gross_weight`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-orange-600 font-bold flex items-center gap-1">
                                                                <Scale className="w-3 h-3" /> GROSS WT (g)
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number" step="0.01"
                                                                    className="bg-white dark:bg-slate-800 font-bold"
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
                                                    name={`items.${index}.net_weight`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs text-blue-600 font-bold flex items-center gap-1">
                                                                <Scale className="w-3 h-3" /> NET WT (g)
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number" step="0.01"
                                                                    className="bg-white dark:bg-slate-800"
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
                                                    name={`items.${index}.cost`}
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-2 md:col-span-1">
                                                            <FormLabel className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                                <DollarSign className="w-3 h-3" /> EST. COST
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number" step="0.01"
                                                                    className="bg-white dark:bg-slate-800 font-bold"
                                                                    {...field}
                                                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <Button
                                    type="button"
                                    onClick={() => append({ description: "", gross_weight: 0, net_weight: 0, issue: "", cost: 0 })}
                                    variant="outline"
                                    className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-primary hover:border-primary"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> Add Another Item
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Summary & Submit (4 Cols) */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Summary Card */}
                            <Card className="shadow-md border-t-4 border-t-green-600 bg-slate-50 dark:bg-slate-900 sticky top-6 gap-4">
                                <CardHeader className="py-4 gap-0">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="w-5 h-5 text-green-600" />
                                        Job Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pb-6">

                                    {/* Weight Summary */}
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-muted-foreground">Total Gross Wt.</span>
                                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                            {totalGrossWeight.toFixed(2)} g
                                        </span>
                                    </div>

                                    <Separator />

                                    {/* Cost Summary */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium">Total Est. Cost</span>
                                            <span className="font-bold">{currency} {totalEstimatedCost.toFixed(2)}</span>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="deposit_amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-green-700">Advance / Deposit ({currency})</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            className="h-10 font-bold bg-green-50 dark:bg-green-950/20 text-green-800 border-green-200"
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
                                            name="deposit_method"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Payment Method</FormLabel>
                                                    <FormControl>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['cash', 'bank', 'card', 'transfer'].map((m) => (
                                                                <Button
                                                                    key={m}
                                                                    type="button"
                                                                    variant={field.value === m ? "default" : "outline"}
                                                                    size="sm"
                                                                    className={cn(
                                                                        "flex-1 capitalize h-8 text-xs",
                                                                        field.value === m && "bg-blue-600 hover:bg-blue-700"
                                                                    )}
                                                                    onClick={() => field.onChange(m)}
                                                                >
                                                                    {m}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100">
                                            <span className="font-bold text-orange-800 text-sm">Balance Due</span>
                                            <span className="text-xl font-extrabold text-orange-600">
                                                {currency} {balanceDue.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Date */}
                                    <FormField
                                        control={form.control}
                                        name="expected_delivery_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-xs uppercase font-bold text-blue-600">Expected Delivery</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date()
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-md"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <span className="flex items-center gap-2">Creating...</span>
                                        ) : (
                                            <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Job</span>
                                        )}
                                    </Button>

                                </CardContent>
                            </Card>

                        </div>

                    </div>
                </form>
            </Form>
        </div>
    );
}
