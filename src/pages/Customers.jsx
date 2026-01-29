import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Users, Loader2, Search, Building2, Mail, Activity, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-slate-50 text-slate-700 border-slate-200",
    suspended: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Customers() {
    const [search, setSearch] = useState("");

    const { data: customers = [], isLoading } = useQuery({
        queryKey: ["customers"],
        queryFn: () => base44.entities.Customer.list("-created_date", 500),
    });

    const { data: parcels = [] } = useQuery({
        queryKey: ["parcels"],
        queryFn: () => base44.entities.Parcel.list("-created_date", 2000),
    });

    const customerStats = useMemo(() => {
        const stats = {};
        parcels.forEach(p => {
            if (!stats[p.customer_id]) {
                stats[p.customer_id] = { total: 0, delivered: 0 };
            }
            stats[p.customer_id].total++;
            if (p.status === 'delivered') stats[p.customer_id].delivered++;
        });
        return stats;
    }, [parcels]);

    const filteredCustomers = useMemo(() => {
        if (!search) return customers;
        return customers.filter(c =>
            c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
            c.contact_email?.toLowerCase().includes(search.toLowerCase())
        );
    }, [customers, search]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Customers</h1>
                            <p className="text-slate-500">
                                {customers.length.toLocaleString()} total customers
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCustomers.map((customer) => {
                            const stats = customerStats[customer.id] || { total: 0, delivered: 0 };

                            return (
                                <Card key={customer.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                                    {customer.company_name?.[0]?.toUpperCase() || 'C'}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{customer.company_name}</h3>
                                                    <p className="text-sm text-slate-500">{customer.country || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={cn("border", statusColors[customer.status] || statusColors.active)}>
                                                {customer.status || 'active'}
                                            </Badge>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                {customer.contact_email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                Since {format(new Date(customer.created_date), 'MMM yyyy')}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <p className="text-xl font-semibold text-slate-900">{stats.total.toLocaleString()}</p>
                                                <p className="text-xs text-slate-500">Total Parcels</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                                                    <Activity className="w-4 h-4" />
                                                </div>
                                                <p className="text-xl font-semibold text-slate-900">
                                                    {customer.api_calls_this_month?.toLocaleString() || 0}
                                                </p>
                                                <p className="text-xs text-slate-500">API Calls</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {!isLoading && filteredCustomers.length === 0 && (
                    <div className="text-center py-20">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No customers found</h3>
                        <p className="text-slate-500">Try adjusting your search</p>
                    </div>
                )}
            </div>
        </div>
    );
}