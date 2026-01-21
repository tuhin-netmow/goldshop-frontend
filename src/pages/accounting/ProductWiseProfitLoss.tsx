"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Package, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetProductWiseProfitLossQuery } from "@/store/features/reports/reportApiService";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductWiseProfitLoss() {
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
        to: new Date(),
    });

    const { data: reportData, isLoading, isFetching } = useGetProductWiseProfitLossQuery({
        start_date: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        end_date: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    });

    const productData = reportData?.data?.products || [];
    const summary = reportData?.data?.summary || {
        total_sales: 0,
        total_cost: 0,
        total_profit: 0,
        overall_margin: 0
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-80" />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Product Wise Profit & Loss</h2>
                    <p className="text-muted-foreground">Analyze profitability by individual products.</p>
                </div>

                <div className="flex items-center gap-2">
                    {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[140px] justify-start text-left font-normal",
                                    !dateRange.from && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? format(dateRange.from, "PP") : <span>From Date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={dateRange.from}
                                onSelect={(d) => setDateRange(prev => ({ ...prev, from: d }))}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <span className="text-muted-foreground">-</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[140px] justify-start text-left font-normal",
                                    !dateRange.to && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.to ? format(dateRange.to, "PP") : <span>To Date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={dateRange.to}
                                onSelect={(d) => setDateRange(prev => ({ ...prev, to: d }))}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="py-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">RM {summary.total_sales.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="py-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">RM {summary.total_cost.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="py-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">RM {summary.total_profit.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="py-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{summary.overall_margin}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Product Table */}
            <Card className="py-6">
                <CardHeader>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>Detailed breakdown of profit and loss by product</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-semibold">Product</th>
                                    <th className="text-left p-4 font-semibold">SKU</th>
                                    <th className="text-right p-4 font-semibold">Units Sold</th>
                                    <th className="text-right p-4 font-semibold">Total Sales</th>
                                    <th className="text-right p-4 font-semibold">Total Cost</th>
                                    <th className="text-right p-4 font-semibold">Profit</th>
                                    <th className="text-right p-4 font-semibold">Margin %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {productData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            No sales data found for the selected period.
                                        </td>
                                    </tr>
                                ) : (
                                    productData.map((product: any) => (
                                        <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-sm sm:text-base">{product.name}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs sm:text-sm text-muted-foreground font-mono">{product.sku}</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Badge variant="outline">{product.units_sold}</Badge>
                                            </td>
                                            <td className="p-4 text-right font-medium text-sm">
                                                RM {product.total_sales.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right text-muted-foreground text-sm">
                                                RM {product.total_cost.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={cn(
                                                    "font-bold text-sm",
                                                    product.profit >= 0 ? "text-green-600" : "text-red-600"
                                                )}>
                                                    RM {product.profit.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Badge
                                                    variant={product.profit_margin >= 15 ? "default" : "secondary"}
                                                    className={cn(
                                                        product.profit_margin >= 15 ? "bg-green-600" : "bg-yellow-600"
                                                    )}
                                                >
                                                    {product.profit_margin.toFixed(2)}%
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot className="bg-muted/30">
                                <tr className="border-t-2 font-bold">
                                    <td className="p-4" colSpan={3}>TOTAL</td>
                                    <td className="p-4 text-right">RM {summary.total_sales.toLocaleString()}</td>
                                    <td className="p-4 text-right">RM {summary.total_cost.toLocaleString()}</td>
                                    <td className="p-4 text-right text-green-600">RM {summary.total_profit.toLocaleString()}</td>
                                    <td className="p-4 text-right text-blue-600">{summary.overall_margin}%</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
