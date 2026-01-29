import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ranges = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
];

export default function DateRangeFilter({ value, onChange }) {
    return (
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {ranges.map((range) => (
                <Button
                    key={range.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange(range.key)}
                    className={cn(
                        "text-sm font-medium transition-all",
                        value === range.key
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                    )}
                >
                    {range.label}
                </Button>
            ))}
        </div>
    );
}