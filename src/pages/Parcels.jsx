import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Package, Loader2 } from "lucide-react";

import ParcelFilters from "@/components/parcels/ParcelFilters";
import ParcelsTable from "@/components/parcels/ParcelsTable";
import ParcelDetailModal from "@/components/parcels/ParcelDetailModal";

const ITEMS_PER_PAGE = 20;

export default function Parcels() {
    const [filters, setFilters] = useState({
        trackingNumber: "",
        customer: "",
        carrier: "",
        status: "",
        country: "",
    });
    const [page, setPage] = useState(1);
    const [selectedParcel, setSelectedParcel] = useState(null);

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["parcels"],
        queryFn: () => base44.entities.Parcel.list("-created_date", 2000),
    });

    const { data: customers = [] } = useQuery({
        queryKey: ["customers"],
        queryFn: () => base44.entities.Customer.list("-created_date", 500),
    });

    const { data: trackingEvents = [] } = useQuery({
        queryKey: ["trackingEvents", selectedParcel?.id],
        queryFn: () => selectedParcel ? base44.entities.TrackingEvent.filter({ parcel_id: selectedParcel.id }, "-event_timestamp") : [],
        enabled: !!selectedParcel,
    });

    const { data: apiLogs = [] } = useQuery({
        queryKey: ["parcelApiLogs", selectedParcel?.id],
        queryFn: () => selectedParcel ? base44.entities.ApiLog.filter({ parcel_id: selectedParcel.id }, "-timestamp") : [],
        enabled: !!selectedParcel,
    });

    const filteredParcels = useMemo(() => {
        return parcels.filter(parcel => {
            if (filters.trackingNumber && !parcel.tracking_number?.toLowerCase().includes(filters.trackingNumber.toLowerCase())) {
                return false;
            }
            if (filters.customer && parcel.customer_id !== filters.customer) {
                return false;
            }
            if (filters.carrier && parcel.carrier !== filters.carrier) {
                return false;
            }
            if (filters.status && parcel.status !== filters.status) {
                return false;
            }
            if (filters.country && parcel.destination_country !== filters.country) {
                return false;
            }
            return true;
        });
    }, [parcels, filters]);

    const totalPages = Math.ceil(filteredParcels.length / ITEMS_PER_PAGE);
    const paginatedParcels = filteredParcels.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            trackingNumber: "",
            customer: "",
            carrier: "",
            status: "",
            country: "",
        });
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Parcels</h1>
                        <p className="text-slate-500">
                            {filteredParcels.length.toLocaleString()} parcels found
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <ParcelFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        customers={customers}
                        onClear={handleClearFilters}
                    />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <ParcelsTable
                        parcels={paginatedParcels}
                        onViewParcel={setSelectedParcel}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>

            <ParcelDetailModal
                parcel={selectedParcel}
                trackingEvents={trackingEvents}
                apiLogs={apiLogs}
                open={!!selectedParcel}
                onClose={() => setSelectedParcel(null)}
            />
        </div>
    );
}