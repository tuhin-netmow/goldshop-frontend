import { useParams, Link } from "react-router";
import { ArrowLeft, Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetInvoiceByIdQuery } from "@/store/features/salesOrder/salesOrder";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import { useAppSelector } from "@/store/store";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function InvoicePrintPreview() {
  const { invoiceId } = useParams();
  const { data: invoiceData, isLoading } = useGetInvoiceByIdQuery(Number(invoiceId), { skip: !invoiceId });
  const invoice = invoiceData?.data;
  const currency = useAppSelector((state) => state.currency.value);
  const { data: settingsData } = useGetSettingsInfoQuery();
  const company = settingsData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!invoice) return <div className="p-8 text-center text-red-500">Invoice not found.</div>;

  const total = (
    Number(invoice?.order?.total_amount || 0) -
    Number(invoice?.order?.discount_amount || 0) +
    Number(invoice?.order?.tax_amount || 0)
  ).toFixed(2);

  const totalPaid = invoice?.payments?.reduce((acc, cur) => acc + Number(cur.amount), 0)?.toFixed(2) || "0.00";
  const balance = Number(total) - Number(totalPaid);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 print:p-0 print:m-0 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-6 print:space-y-2 print:p-0 print:max-w-full">

        {/* No-Print Actions */}
        <div className="flex justify-between items-center print:hidden">
          <Link to={`/dashboard/sales/invoices/${invoiceId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Invoice
            </Button>
          </Link>
          <Button onClick={() => window.print()} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Printer className="w-4 h-4" /> Print Invoice
          </Button>
        </div>

        {/* INVOICE PAPER */}
        <div className="bg-white text-black p-10 shadow-lg rounded-sm print:shadow-none print:w-full print:h-full print:rounded-none print:p-4">

          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b pb-8 mb-8 print:pb-2 print:mb-2">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FileText className="w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight">{company?.company_name || "GOLD SHOP"}</span>
              </div>
              <p className="text-sm text-gray-500">
                {company?.address || "123 Gold Souk Street"}<br />
                Phone: {company?.phone || "+971 4 123 4567"}<br />
                Email: {company?.email || "sales@goldshop.com"}
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-2">INVOICE</h1>
              <p className="font-mono font-medium text-lg">#{invoice?.invoice_number}</p>
              <p className="text-sm text-gray-500 mt-1">Date: {format(new Date(invoice?.invoice_date || new Date()), "PPP")}</p>
            </div>
          </div>

          {/* Bill To & Details */}
          <div className="flex justify-between gap-10 mb-10 print:mb-3 print:gap-6">
            <div className="w-1/2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Bill To</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-100 print:bg-transparent print:border-none print:p-0">
                <p className="font-bold text-lg">{invoice?.order?.customer?.name || "Guest Customer"}</p>
                <p className="text-gray-600">{invoice?.order?.customer?.phone}</p>
                <p className="text-gray-600">{invoice?.order?.customer?.email}</p>
                <p className="text-gray-600">{invoice?.order?.customer?.address}</p>
              </div>
            </div>
            <div className="w-1/2 text-right">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Invoice Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Invoice Date:</span>
                  <span className="font-medium">{invoice?.invoice_date ? format(new Date(invoice.invoice_date), "PP") : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date:</span>
                  <span className="font-medium">{invoice?.due_date ? format(new Date(invoice.due_date), "PP") : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order No:</span>
                  <span className="font-medium">#{invoice?.order?.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium uppercase">{invoice?.status?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-10 print:mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Line Items</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-3 font-semibold text-gray-600 w-1/2">Product</th>
                  <th className="py-3 font-semibold text-gray-600 text-center">Unit Price</th>
                  <th className="py-3 font-semibold text-gray-600 text-center">Qty</th>
                  <th className="py-3 font-semibold text-gray-600 text-center">Discount</th>
                  <th className="py-3 font-semibold text-gray-600 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.order?.items?.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-4 align-top">
                      <p className="font-medium text-gray-900 mb-1">{item?.product?.name}</p>
                      <p className="text-sm text-gray-500 italic">SKU: {item?.product?.sku}</p>
                    </td>
                    <td className="py-4 text-center align-top font-mono">{currency} {Number(item?.unit_price).toFixed(2)}</td>
                    <td className="py-4 text-center align-top font-mono">{item?.quantity}</td>
                    <td className="py-4 text-center align-top font-mono">{currency} {Number(item?.discount || 0).toFixed(2)}</td>
                    <td className="py-4 text-right align-top font-mono font-medium">{currency} {Number(item?.line_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12 print:mb-3">
            <div className="w-1/2 space-y-2">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-600">Subtotal</span>
                <span className="font-bold">{currency} {Number(invoice?.order?.total_amount).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-red-700">
                <span>Discount</span>
                <span>- {currency} {Number(invoice?.order?.discount_amount || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>+ {currency} {Number(invoice?.order?.tax_amount || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3 text-lg">
                <span className="font-bold text-gray-800">Grand Total</span>
                <span className="font-black">{currency} {total}</span>
              </div>

              {invoice?.payments && invoice.payments.length > 0 && (
                <>
                  <div className="flex justify-between text-green-700">
                    <span>Total Paid</span>
                    <span>- {currency} {totalPaid}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-3 text-lg">
                    <span className="font-bold text-gray-800">Balance Due</span>
                    <span className={`font-black ${balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {currency} {balance.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer / Terms */}
          <div className="border-t pt-8 mt-12 grid grid-cols-2 gap-12 print:mt-3 print:pt-2 print:gap-6">
            <div>
              <h4 className="text-sm font-bold mb-2">Terms & Conditions</h4>
              <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                <li>Payment is due within 30 days of invoice date.</li>
                <li>Please include invoice number with payment.</li>
                <li>Late payments may incur additional charges.</li>
              </ul>
            </div>
            <div className="flex flex-col justify-end items-center">
              <div className="w-48 border-b border-gray-300 mb-2"></div>
              <p className="text-xs text-gray-400">Authorized Signature</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 print:mt-2 text-xs text-gray-400">
            <p>Thank you for your business!</p>
            <p className="mt-1">This is a computer-generated invoice.</p>
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
