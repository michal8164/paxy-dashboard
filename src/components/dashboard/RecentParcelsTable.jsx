import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";

export default function RecentParcelsTable({ parcels, onViewParcel }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Recent Parcels</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tracking #</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Carrier</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Destination</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</TableHead>
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
                                <TableCell className="text-sm text-slate-600">
                                    {parcel.destination_city}, {parcel.destination_country}
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
                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                    No parcels found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}