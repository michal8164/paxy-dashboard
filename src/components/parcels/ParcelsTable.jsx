import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import StatusBadge from "../dashboard/StatusBadge";
import { format } from "date-fns";

export default function ParcelsTable({ parcels, onViewParcel, page, totalPages, onPageChange }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-100 hover:bg-transparent bg-slate-50">
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tracking #</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Carrier</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Origin</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Destination</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Shipped</TableHead>
                        <TableHead className="w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {parcels.map((parcel) => (
                        <TableRow
                            key={parcel.id}
                            className="border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => onViewParcel(parcel)}
                        >
                            <TableCell className="font-mono text-sm font-medium text-slate-900">
                                {parcel.tracking_number}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{parcel.customer_name}</TableCell>
                            <TableCell>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                  {parcel.carrier}
                </span>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{parcel.origin_country || '-'}</TableCell>
                            <TableCell className="text-sm text-slate-600">
                                {parcel.destination_city ? `${parcel.destination_city}, ` : ''}{parcel.destination_country}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={parcel.status} />
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                                {parcel.shipped_date ? format(new Date(parcel.shipped_date), 'MMM d, yyyy') : '-'}
                            </TableCell>
                            <TableCell>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </TableCell>
                        </TableRow>
                    ))}
                    {parcels.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                                No parcels found matching your filters
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            className="border-slate-200"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages}
                            className="border-slate-200"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}