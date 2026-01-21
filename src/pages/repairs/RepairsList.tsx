// Updated to match Payroll Overview Design
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
    Hammer,
    PlusCircle,
    RotateCcw,
    CheckCircle2,
    PackageCheck,
    Eye,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Repair, RepairsService } from "@/services/repairsService";
import { format } from "date-fns";
import { toast } from "sonner";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function RepairsList() {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // Client-side limit simulation if API doesn't support it
    const navigate = useNavigate();

    // Since API might not support pagination yet, we fetch all
    useEffect(() => {
        fetchRepairs();
    }, [search]);

    const fetchRepairs = async () => {
        setLoading(true);
        try {
            const res = await RepairsService.getAll({ search });
            if (res.success && Array.isArray(res.data)) {
                setRepairs(res.data);
            } else {
                setRepairs([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch repairs");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------
    //  STATS CALCULATION
    // -----------------------------------------
    const stats = useMemo(() => {
        const total = repairs.length;
        const inProgress = repairs.filter(r => ['in_progress', 'received'].includes(r.status)).length;
        const ready = repairs.filter(r => ['ready', 'completed'].includes(r.status)).length;
        const delivered = repairs.filter(r => r.status === 'delivered').length;

        return [
            {
                label: "Total Repairs",
                value: total,
                gradient: "from-blue-600 to-blue-400",
                shadow: "shadow-blue-500/30",
                icon: <Hammer className="w-6 h-6 text-white" />,
            },
            {
                label: "In Progress",
                value: inProgress,
                gradient: "from-amber-600 to-amber-400",
                shadow: "shadow-amber-500/30",
                icon: <RotateCcw className="w-6 h-6 text-white" />,
            },
            {
                label: "Ready / Completed",
                value: ready,
                gradient: "from-emerald-600 to-emerald-400",
                shadow: "shadow-emerald-500/30",
                icon: <CheckCircle2 className="w-6 h-6 text-white" />,
            },
            {
                label: "Delivered",
                value: delivered,
                gradient: "from-violet-600 to-violet-400",
                shadow: "shadow-violet-500/30",
                icon: <PackageCheck className="w-6 h-6 text-white" />,
            },
        ];
    }, [repairs]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ready':
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100';
        }
    };

    // -----------------------------------------
    //  COLUMNS DEFINITION
    // -----------------------------------------
    const columns: ColumnDef<Repair>[] = [
        {
            accessorKey: "repair_number",
            header: "Ticket #",
            meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[120px]" } as any,
            cell: ({ row }) => (
                <span className="font-bold text-blue-600 font-mono">
                    {row.getValue("repair_number")}
                </span>
            ),
        },
        {
            accessorKey: "customer",
            header: "Customer",
            meta: { className: "md:sticky md:left-[120px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
            cell: ({ row }) => {
                const customer = row.original.customer;
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold">{customer?.name || row.original.customer_name || "Guest"}</span>
                        <span className="text-xs text-muted-foreground">{customer?.phone || row.original.customer_phone}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "item_description",
            header: "Item & Issue",
            cell: ({ row }) => (
                <div className="max-w-[250px]">
                    <p className="text-sm font-medium truncate" title={row.original.item_description}>
                        {row.original.item_description?.split('\n')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                        {row.original.issue_description || "No issue info"}
                    </p>
                </div>
            )
        },
        {
            accessorKey: "estimated_cost",
            header: () => <div className="text-right">Est. Cost</div>,
            cell: ({ row }) => (
                <div className="text-right font-mono font-medium">
                    {Number(row.getValue("estimated_cost") || 0).toFixed(2)}
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = (row.getValue("status") as string);
                return (
                    <Badge variant="outline" className={`${getStatusColor(status)} text-[10px] uppercase font-bold shadow-sm whitespace-nowrap`}>
                        {status === 'ready' ? 'READY' : status.replace('_', ' ')}
                    </Badge>
                );
            }
        },
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => (
                <div className="flex flex-col text-xs">
                    <span className="text-muted-foreground">In: {format(new Date(row.original.created_at || new Date()), "MMM d")}</span>
                    <span className={`font-medium ${new Date(row.original.promised_date || "") < new Date() && row.original.status !== 'delivered' ? 'text-red-500' : 'text-blue-500'}`}>
                        Due: {row.original.promised_date ? format(new Date(row.original.promised_date), "MMM d") : "-"}
                    </span>
                </div>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/dashboard/repairs/${row.original.id}`)}
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/repairs/${row.original.id}`)}>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/repairs/${row.original.id}/invoice`)}>
                                Generate Invoice
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ];

    // Client-side pagination logic since API is currently 'getAll'
    // In a real scenario, API would handle this
    const paginatedRepairs = useMemo(() => {
        const startIndex = (page - 1) * limit;
        return repairs.slice(startIndex, startIndex + limit);
    }, [repairs, page, limit]);

    return (
        <div className="w-full space-y-6 pb-20">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                        Repair Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage jobs, track status and invoices</p>
                </div>

                <Link to="/dashboard/repairs/create">
                    <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none">
                        <PlusCircle size={18} />
                        New Repair Job
                    </button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {stats.map((item, idx) => (
                    <div
                        key={idx}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]`}
                    >
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/90">{item.label}</p>
                                <h3 className="mt-2 text-3xl font-bold text-white">
                                    {item.value}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DataTable Card */}
            <Card className="pt-6 pb-2 border shadow-md">
                <CardHeader className="px-6 border-b pb-4 gap-0">
                    <CardTitle>Recent Repair Jobs</CardTitle>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    <DataTable
                        columns={columns}
                        data={paginatedRepairs}
                        pageIndex={page - 1}
                        pageSize={limit}
                        totalCount={repairs.length}
                        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
                        onSearch={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        isFetching={loading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
