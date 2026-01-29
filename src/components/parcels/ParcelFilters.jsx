import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const carriers = ["DHL", "UPS", "FedEx", "DPD", "GLS", "PostNL", "Hermes", "TNT", "Colissimo", "InPost"];
const statuses = [
    { value: "pending", label: "Pending" },
    { value: "picked_up", label: "Picked Up" },
    { value: "in_transit", label: "In Transit" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
    { value: "returned", label: "Returned" },
];

export default function ParcelFilters({ filters, onFilterChange, customers, onClear }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by tracking number..."
                        value={filters.trackingNumber || ""}
                        onChange={(e) => onFilterChange({ ...filters, trackingNumber: e.target.value })}
                        className="pl-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <Select
                    value={filters.customer || "all"}
                    onValueChange={(value) => onFilterChange({ ...filters, customer: value === "all" ? "" : value })}
                >
                    <SelectTrigger className="w-[200px] border-slate-200">
                        <SelectValue placeholder="All Customers" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.company_name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.carrier || "all"}
                    onValueChange={(value) => onFilterChange({ ...filters, carrier: value === "all" ? "" : value })}
                >
                    <SelectTrigger className="w-[150px] border-slate-200">
                        <SelectValue placeholder="All Carriers" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Carriers</SelectItem>
                        {carriers.map((carrier) => (
                            <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => onFilterChange({ ...filters, status: value === "all" ? "" : value })}
                >
                    <SelectTrigger className="w-[180px] border-slate-200">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.country || "all"}
                    onValueChange={(value) => onFilterChange({ ...filters, country: value === "all" ? "" : value })}
                >
                    <SelectTrigger className="w-[150px] border-slate-200">
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="NL">Netherlands</SelectItem>
                        <SelectItem value="BE">Belgium</SelectItem>
                        <SelectItem value="ES">Spain</SelectItem>
                        <SelectItem value="IT">Italy</SelectItem>
                        <SelectItem value="PL">Poland</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AT">Austria</SelectItem>
                        <SelectItem value="CZ">Czech Republic</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={onClear} className="border-slate-200 text-slate-600 hover:bg-slate-100">
                    <X className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>
        </div>
    );
}