import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Truck, MapPin, Clock, FileJson, ArrowRight, CheckCircle, AlertCircle, Info } from "lucide-react";
import StatusBadge from "../dashboard/StatusBadge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const eventTypeConfig = {
    created: { icon: Package, color: "text-slate-500", bg: "bg-slate-100" },
    picked_up: { icon: Truck, color: "text-blue-500", bg: "bg-blue-100" },
    departed_facility: { icon: ArrowRight, color: "text-indigo-500", bg: "bg-indigo-100" },
    arrived_facility: { icon: MapPin, color: "text-purple-500", bg: "bg-purple-100" },
    customs_clearance: { icon: FileJson, color: "text-amber-500", bg: "bg-amber-100" },
    out_for_delivery: { icon: Truck, color: "text-violet-500", bg: "bg-violet-100" },
    delivered: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100" },
    delivery_attempt: { icon: Info, color: "text-orange-500", bg: "bg-orange-100" },
    exception: { icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-100" },
    returned: { icon: Package, color: "text-slate-500", bg: "bg-slate-100" },
};

export default function ParcelDetailModal({ parcel, trackingEvents, apiLogs, open, onClose }) {
    if (!parcel) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-4">
                        <span className="font-mono text-xl">{parcel.tracking_number}</span>
                        <StatusBadge status={parcel.status} />
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Customer</p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">{parcel.customer_name}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Carrier</p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">{parcel.carrier}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Destination</p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">{parcel.destination_city}, {parcel.destination_country}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Weight</p>
                            <p className="text-sm font-semibold text-slate-900 mt-1">{parcel.weight_kg ? `${parcel.weight_kg} kg` : '-'}</p>
                        </div>
                    </div>

                    <Tabs defaultValue="tracking" className="w-full">
                        <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-lg">
                            <TabsTrigger value="tracking" className="data-[state=active]:bg-white">Tracking History</TabsTrigger>
                            <TabsTrigger value="logs" className="data-[state=active]:bg-white">API Logs</TabsTrigger>
                        </TabsList>

                        <TabsContent value="tracking" className="mt-4">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-4">
                                    {trackingEvents.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            No tracking events yet
                                        </div>
                                    ) : (
                                        trackingEvents.map((event, index) => {
                                            const config = eventTypeConfig[event.event_type] || eventTypeConfig.created;
                                            const Icon = config.icon;

                                            return (
                                                <div key={event.id} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.bg)}>
                                                            <Icon className={cn("w-5 h-5", config.color)} />
                                                        </div>
                                                        {index < trackingEvents.length - 1 && (
                                                            <div className="w-0.5 h-full bg-slate-200 mt-2" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-6">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <p className="font-medium text-slate-900 capitalize">
                                                                    {event.event_type.replace(/_/g, ' ')}
                                                                </p>
                                                                <p className="text-sm text-slate-500 mt-0.5">{event.description}</p>
                                                                {event.location && (
                                                                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {event.location}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm text-slate-500">
                                                                    {format(new Date(event.event_timestamp), 'MMM d, yyyy')}
                                                                </p>
                                                                <p className="text-xs text-slate-400">
                                                                    {format(new Date(event.event_timestamp), 'HH:mm')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="logs" className="mt-4">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-3">
                                    {apiLogs.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            No API logs available
                                        </div>
                                    ) : (
                                        apiLogs.map((log) => (
                                            <Card key={log.id} className="border-slate-200">
                                                <CardHeader className="p-4 pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant={log.direction === 'inbound' ? 'default' : 'secondary'} className={cn(
                                                                "font-medium",
                                                                log.direction === 'inbound' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                                                            )}>
                                                                {log.direction === 'inbound' ? '← Inbound' : '→ Outbound'}
                                                            </Badge>
                                                            <Badge variant="outline" className={cn(
                                                                "font-mono text-xs",
                                                                log.status_code >= 200 && log.status_code < 300 ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"
                                                            )}>
                                                                {log.status_code}
                                                            </Badge>
                                                            <span className="text-xs font-medium text-slate-500 uppercase">{log.method}</span>
                                                            <span className="text-sm text-slate-600 font-mono">{log.endpoint}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-400">
                                                                {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                                                            </p>
                                                            <p className="text-xs text-slate-400">{log.response_time_ms}ms</p>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {log.request_body && (
                                                            <div>
                                                                <p className="text-xs font-medium text-slate-500 mb-1">Request</p>
                                                                <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-32 text-slate-600">
                                  {(() => {
                                      try {
                                          return JSON.stringify(JSON.parse(log.request_body), null, 2);
                                      } catch {
                                          return log.request_body;
                                      }
                                  })()}
                                </pre>
                                                            </div>
                                                        )}
                                                        {log.response_body && (
                                                            <div>
                                                                <p className="text-xs font-medium text-slate-500 mb-1">Response</p>
                                                                <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-32 text-slate-600">
                                  {(() => {
                                      try {
                                          return JSON.stringify(JSON.parse(log.response_body), null, 2);
                                      } catch {
                                          return log.response_body;
                                      }
                                  })()}
                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-2">
                                                        <Badge variant="outline" className="text-xs border-slate-200 text-slate-500">
                                                            {log.source}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}