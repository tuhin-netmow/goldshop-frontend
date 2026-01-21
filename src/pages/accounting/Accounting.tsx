"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Plus, Calendar, CalendarDays, CalendarRange, CalendarClock, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router";
import { useAppSelector } from "@/store/store";
import { useGetAccountingChartDataQuery, useGetAccountingOverviewQuery } from "@/store/features/accounting/accoutntingApiService";
import type { Overview } from "@/types/accounting.types";
import { format } from "date-fns";

// Helper to generate random numbers for dummy data
const randomAmount = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// Generate dummy trend data for the last 30 days
const generateTrendData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      income: randomAmount(2000, 5000),
      expense: randomAmount(500, 2000),
    });
  }
  return data;
};

const trendData = generateTrendData();

// Dummy Expense Breakdown Data
const expenseBreakdownData = [
  { name: 'Rent', value: 2000 },
  { name: 'Salaries', value: 8000 },
  { name: 'Utilities', value: 1500 },
  { name: 'Supplies', value: 500 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Dummy Recent Activity
const recentActivity = [
  { id: 1, date: new Date(), description: "Consulting Fee Received", amount: 1500, type: "income" },
  { id: 2, date: new Date(), description: "Office Rent Payment", amount: 2000, type: "expense" },
  { id: 3, date: new Date(Date.now() - 86400000), description: "Client Payment", amount: 3500, type: "income" },
  { id: 4, date: new Date(Date.now() - 86400000 * 2), description: "Stationery Purchase", amount: 200, type: "expense" },
  { id: 5, date: new Date(Date.now() - 86400000 * 3), description: "Utility Bill", amount: 450, type: "expense" },
];


export default function AccountingOverview() {
  const { data: accountingOverview } = useGetAccountingOverviewQuery();

  const summaryData = accountingOverview?.data;

  const periods: (keyof Overview)[] = ["daily", "weekly", "monthly", "yearly"];

  const currency = useAppSelector((state) => state.currency.value);

  const { data: chartData } = useGetAccountingChartDataQuery();

  console.log("chartData", chartData);

  const chartTrendData = chartData?.data || trendData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Accounting Overview</h2>

        <div className="flex gap-2">
          <Link to={"/dashboard/accounting/add-income"}>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/40 active:translate-y-0 active:shadow-none">
              <Plus size={18} /> Add Income
            </button>
          </Link>

          <Link to={"/dashboard/accounting/add-expanse"}>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-rose-500/40 active:translate-y-0 active:shadow-none">
              <Plus size={18} /> Add Expense
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {summaryData &&
          periods.map((period) => {
            const data = summaryData[period] || { income: 0, expense: 0 };
            const periodLabel =
              period === "daily"
                ? "Today"
                : period === "weekly"
                  ? "This Week"
                  : period === "monthly"
                    ? "This Month"
                    : "This Year";

            const income = Number(data.income) || 0;
            const expense = Number(data.expense) || 0;

            let incomePercent = 0;
            let expensePercent = 0;

            if (income === 0 && expense === 0) {
              incomePercent = 0;
              expensePercent = 0;
            } else if (income > 0 && expense === 0) {
              incomePercent = 100;
              expensePercent = 0;
            } else if (expense > 0 && income === 0) {
              incomePercent = 0;
              expensePercent = 100;
            } else {
              const total = income + expense;
              incomePercent = Math.round((income / total) * 100);
              expensePercent = 100 - incomePercent; // GUARANTEED consistency
            }

            const netProfit = data.income - data.expense;

            // Assign gradient & icon based on period
            let gradientStr = "";
            let shadowStr = "";
            let IconComp = null;

            if (period === "daily") {
              gradientStr = "from-blue-600 to-blue-400";
              shadowStr = "shadow-blue-500/30";
              IconComp = <Calendar className="w-6 h-6 text-white" />;
            } else if (period === "weekly") {
              gradientStr = "from-emerald-600 to-emerald-400";
              shadowStr = "shadow-emerald-500/30";
              IconComp = <CalendarDays className="w-6 h-6 text-white" />;
            } else if (period === "monthly") {
              gradientStr = "from-amber-600 to-amber-400";
              shadowStr = "shadow-amber-500/30";
              IconComp = <CalendarRange className="w-6 h-6 text-white" />;
            } else { // yearly
              gradientStr = "from-violet-600 to-violet-400";
              shadowStr = "shadow-violet-500/30";
              IconComp = <CalendarClock className="w-6 h-6 text-white" />;
            }


            return (
              <div
                key={period}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientStr} p-6 shadow-lg ${shadowStr} transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]`}
              >
                {/* Background Pattern */}
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

                <div className="relative flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-white/90 uppercase tracking-widest">{periodLabel}</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      Net: {currency} {netProfit.toLocaleString()}.00
                    </h3>
                  </div>
                  <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                    {IconComp}
                  </div>
                </div>

                <div className="relative space-y-2">
                  <div className="flex justify-between text-white/90 text-sm">
                    <span>Income</span>
                    <span className="font-semibold">{currency} {data.income.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-1.5 mb-1">
                    <div className="bg-white/80 h-1.5 rounded-full" style={{ width: `${incomePercent}%` }}></div>
                  </div>

                  <div className="flex justify-between text-white/90 text-sm pt-1">
                    <span>Expense</span>
                    <span className="font-semibold">{currency} {data.expense.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-1.5">
                    <div className="bg-white/40 h-1.5 rounded-full" style={{ width: `${expensePercent}%` }}></div>
                  </div>
                </div>

              </div>
            );
          })}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trend Chart (Bar/Line) */}
        <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border-b-1 border-blue-100 dark:border-blue-900 py-3 gap-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Income vs Expense Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-6 pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartTrendData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie Chart */}
        <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-orange-200 hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-orange-950/30 border-b-1 border-orange-100 dark:border-orange-900 py-3 gap-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/30">
                <CalendarRange className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Expense Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-6 pt-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdownData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg py-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${activity.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {activity.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{format(activity.date, "PPP")}</p>
                  </div>
                </div>
                <div className={`font-semibold ${activity.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {activity.type === 'income' ? '+' : '-'} {currency} {activity.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
