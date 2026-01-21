import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type GoldRate, GoldRatesService } from "@/services/goldRatesService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PURITIES = ['999', '916', '835', '750', '375'];

export default function GoldRatesSettings() {
    const [rates, setRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadRates();
    }, []);

    const loadRates = async () => {
        setLoading(true);
        try {
            const data = await GoldRatesService.getTodayRates();
            // Transform array to object { '916': 350, ... }
            const ratesMap: Record<string, number> = {};
            if (Array.isArray(data)) {
                data.forEach((r: GoldRate) => {
                    ratesMap[r.purity] = r.rate_per_gram;
                });
            }
            setRates(ratesMap);
        } catch (error) {
            console.error("Failed to load rates", error);
            toast.error("Failed to load today's rates");
        } finally {
            setLoading(false);
        }
    };

    const handleRateChange = (purity: string, value: string) => {
        setRates(prev => ({
            ...prev,
            [purity]: parseFloat(value) || 0
        }));
    };

    const handleSave = async (purity: string) => {
        setSaving(true);
        try {
            if (!rates[purity]) {
                toast.error("Please enter a valid rate");
                return;
            }
            await GoldRatesService.setRate({
                purity,
                rate_per_gram: rates[purity]
            });
            toast.success(`Rate for ${purity} updated successfully`);
        } catch (error) {
            console.error("Failed to save rate", error);
            toast.error("Failed to update rate");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="py-6 px-4 space-y-6 max-w-[700px] w-full">
            <div>
                <h1 className="text-2xl font-semibold">Gold Rates (Today)</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Set the daily gold rates for different purities. These rates will be used in POS.
                </p>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    PURITIES.map((purity) => (
                        <Card key={purity} className="py-6 gap-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">Gold {purity}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor={`rate-${purity}`} className="sr-only">Rate per Gram</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rate / g</span>
                                            <Input
                                                id={`rate-${purity}`}
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-20"
                                                value={rates[purity] || ''}
                                                onChange={(e) => handleRateChange(purity, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleSave(purity)}
                                        disabled={saving}
                                        size="sm"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
