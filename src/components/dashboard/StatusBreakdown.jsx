import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusConfig = {
    pending: { color: "bg-amber-500", label: "Pending" },
    picked_up: { color: "bg-blue-500", label: "Picked Up" },
    in_transit: { color: "bg-indigo-500", label: "In Transit" },
    out_for_delivery: { color: "bg-violet-500", label: "Out for Delivery" },
    delivered: { color: "bg-emerald-500", label: "Delivered" },
    failed: { color: "bg-rose-500", label: "Failed" },
    returned: { color: "bg-slate-500", label: "Returned" },
};

export default function StatusBreakdown({ data, total }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item) => {
                        const config = statusConfig[item.status] || { color: "bg-slate-500", label: item.status };
                        const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;

                        return (
                            <div key={item.status} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700">{config.label}</span>
                                    <span className="text-slate-500">
                    {item.count} <span className="text-slate-400">({percentage}%)</span>
                  </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500", config.color)}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}