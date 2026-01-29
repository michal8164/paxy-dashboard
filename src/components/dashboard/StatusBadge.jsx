import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
    pending: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" },
    picked_up: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Picked Up" },
    in_transit: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "In Transit" },
    out_for_delivery: { color: "bg-violet-50 text-violet-700 border-violet-200", label: "Out for Delivery" },
    delivered: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Delivered" },
    failed: { color: "bg-rose-50 text-rose-700 border-rose-200", label: "Failed" },
    returned: { color: "bg-slate-50 text-slate-700 border-slate-200", label: "Returned" },
};

export default function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <Badge variant="outline" className={cn("font-medium border", config.color)}>
            {config.label}
        </Badge>
    );
}