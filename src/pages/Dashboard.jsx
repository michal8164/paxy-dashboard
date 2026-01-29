import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Package, Users, Truck, Activity, TrendingUp } from "lucide-react";
import { format, subDays, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear, isAfter } from "date-fns";

import StatsCard from "@/components/dashboard/StatsCard";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import ParcelChart from "@/components/dashboard/ParcelChart";
import CarrierBreakdown from "@/components/dashboard/CarrierBreakdown";
import CountryMap from "@/components/dashboard/CountryMap";
import StatusBreakdown from "@/components/dashboard/StatusBreakdown";
import CustomerGrowthChart from "@/components/dashboard/CustomerGrowthChart";
import RecentParcelsTable from "@/components/dashboard/RecentParcelsTable";
import TopCustomersTable from "@/components/dashboard/TopCustomersTable";
import ParcelDetailModal from "@/components/parcels/ParcelDetailModal";

export default function Dashboard() {
    const [dateRange, setDateRange] = useState("month");
    const [selectedParcel, setSelectedParcel] = useState(null);

    const { data: parcels = [] } = useQuery({
        queryKey: ["parcels"],
        queryFn: () => base44.entities.Parcel.list("-created_date", 1000),
    });

    const { data: customers = [] } = useQuery({
        queryKey: ["customers"],
        queryFn: () => base44.entities.Customer.list("-created_date", 500),
    });

    const { data: apiLogs = [] } = useQuery({
        queryKey: ["apiLogs"],
        queryFn: () => base44.entities.ApiLog.list("-timestamp", 1000),
    });

    const { data: trackingEvents = [] } = useQuery({
        queryKey: ["trackingEvents", selectedParcel?.id],
        queryFn: () => selectedParcel ? base44.entities.TrackingEvent.filter({ parcel_id: selectedParcel.id }, "-event_timestamp") : [],
        enabled: !!selectedParcel,
    });

    const { data: parcelApiLogs = [] } = useQuery({
        queryKey: ["parcelApiLogs", selectedParcel?.id],
        queryFn: () => selectedParcel ? base44.entities.ApiLog.filter({ parcel_id: selectedParcel.id }, "-timestamp") : [],
        enabled: !!selectedParcel,
    });

    const getDateRangeStart = () => {
        const now = new Date();
        switch (dateRange) {
            case "today": return startOfDay(now);
            case "week": return startOfWeek(now, { weekStartsOn: 1 });
            case "month": return startOfMonth(now);
            case "quarter": return startOfQuarter(now);
            case "year": return startOfYear(now);
            default: return startOfMonth(now);
        }
    };

    const filteredParcels = useMemo(() => {
        const rangeStart = getDateRangeStart();
        return parcels.filter(p => {
            const parcelDate = new Date(p.created_date);
            return isAfter(parcelDate, rangeStart) || parcelDate.getTime() === rangeStart.getTime();
        });
    }, [parcels, dateRange]);

    const stats = useMemo(() => {
        const statusCounts = {};
        const carrierCounts = {};
        const countryCounts = {};
        const customerCounts = {};
        const dailyCounts = {};

        filteredParcels.forEach(parcel => {
            statusCounts[parcel.status] = (statusCounts[parcel.status] || 0) + 1;
            carrierCounts[parcel.carrier] = (carrierCounts[parcel.carrier] || 0) + 1;
            countryCounts[parcel.destination_country] = (countryCounts[parcel.destination_country] || 0) + 1;

            if (parcel.customer_id) {
                if (!customerCounts[parcel.customer_id]) {
                    customerCounts[parcel.customer_id] = { customer_id: parcel.customer_id, customer_name: parcel.customer_name, count: 0 };
                }
                customerCounts[parcel.customer_id].count++;
            }

            const date = format(new Date(parcel.created_date), 'MMM d');
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });

        return {
            total: filteredParcels.length,
            delivered: statusCounts['delivered'] || 0,
            inTransit: statusCounts['in_transit'] || 0,
            failed: statusCounts['failed'] || 0,
            statusData: Object.entries(statusCounts).map(([status, count]) => ({ status, count })).sort((a, b) => b.count - a.count),
            carrierData: Object.entries(carrierCounts).map(([carrier, count]) => ({ carrier, count })).sort((a, b) => b.count - a.count),
            countryData: Object.entries(countryCounts).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count),
            customerData: Object.values(customerCounts).sort((a, b) => b.count - a.count).slice(0, 5),
            dailyData: Object.entries(dailyCounts).map(([name, parcels]) => ({ name, parcels })).slice(-14),
        };
    }, [filteredParcels]);

    const customerGrowthData = useMemo(() => {
        const last12Months = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = format(date, 'MMM yyyy');
            const monthStart = startOfMonth(date);
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);

            const customersInMonth = customers.filter(c => {
                const created = new Date(c.created_date);
                return created < monthEnd;
            }).length;

            const apiCallsInMonth = apiLogs.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate >= monthStart && logDate < monthEnd;
            }).length;

            last12Months.push({
                name: format(date, 'MMM'),
                customers: customersInMonth,
                apiCalls: apiCallsInMonth,
            });
        }
        return last12Months;
    }, [customers, apiLogs]);

    const deliveryRate = stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Overview of your parcel operations across Europe</p>
                    </div>
                    <DateRangeFilter value={dateRange} onChange={setDateRange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Parcels"
                        value={stats.total.toLocaleString()}
                        icon={Package}
                        subtitle={`${dateRange === 'today' ? 'Today' : `This ${dateRange}`}`}
                    />
                    <StatsCard
                        title="Delivered"
                        value={stats.delivered.toLocaleString()}
                        icon={Truck}
                        trend={`${deliveryRate}% rate`}
                        trendUp={deliveryRate > 90}
                    />
                    <StatsCard
                        title="In Transit"
                        value={stats.inTransit.toLocaleString()}
                        icon={TrendingUp}
                    />
                    <StatsCard
                        title="Active Customers"
                        value={customers.filter(c => c.status === 'active').length.toLocaleString()}
                        icon={Users}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ParcelChart data={stats.dailyData} title="Parcels Over Time" />
                    <CustomerGrowthChart data={customerGrowthData} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <CarrierBreakdown data={stats.carrierData} />
                    <CountryMap data={stats.countryData} />
                    <StatusBreakdown data={stats.statusData} total={stats.total} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RecentParcelsTable
                            parcels={parcels.slice(0, 10)}
                            onViewParcel={setSelectedParcel}
                        />
                    </div>
                    <TopCustomersTable data={stats.customerData} />
                </div>
            </div>

            <ParcelDetailModal
                parcel={selectedParcel}
                trackingEvents={trackingEvents}
                apiLogs={parcelApiLogs}
                open={!!selectedParcel}
                onClose={() => setSelectedParcel(null)}
            />
        </div>
    );
}