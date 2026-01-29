import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Activity, Loader2, Search, ArrowDownLeft, ArrowUpRight, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ApiLogs() {
    const [filters, setFilters] = useState({
        search: "",
        direction: "all",
        status: "all",
        source: "all",
    });
    const [expandedLog, setExpandedLog] = useState(null);

    const { data: logs = [], isLoading } = useQuery({
        queryKey: ["apiLogs"],
        queryFn: () => base44.entities.ApiLog.list("-timestamp", 1000),
    });

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            if (filters.search &&
                !log.tracking_number?.toLowerCase().includes(filters.search.toLowerCase()) &&
                !log.endpoint?.toLowerCase().includes(filters.search.toLowerCase())
            ) {
                return false;
            }
            if (filters.direction !== "all" && log.direction !== filters.direction) {
                return false;
            }
            if (filters.status === "success" && (log.status_code < 200 || log.status_code >= 300)) {
                return false;
            }
            if (filters.status === "error" && log.status_code >= 200 && log.status_code < 300) {
                return false;
            }
            if (filters.source !== "all" && log.source !== filters.source) {
                return false;
            }
            return true;
        });
    }, [logs, filters]);

    const stats = useMemo(() => {
        const total = logs.length;
        const success = logs.filter(l => l.status_code >= 200 && l.status_code < 300).length;
        const avgResponseTime = logs.length > 0
            ? Math.round(logs.reduce((a, l) => a + (l.response_time_ms || 0), 0) / logs.length)
            : 0;
        const inbound = logs.filter(l => l.direction === 'inbound').length;
        const outbound = logs.filter(l => l.direction === 'outbound').length;

        return { total, success, avgResponseTime, inbound, outbound };
    }, [logs]);

    const sources = [...new Set(logs.map(l => l.source).filter(Boolean))];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">API Logs</h1>
                        <p className="text-slate-500">Monitor API traffic and debug issues</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-500">Total Requests</p>
                            <p className="text-2xl font-semibold text-slate-900">{stats.total.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-500">Success Rate</p>
                            <p className="text-2xl font-semibold text-emerald-600">
                                {stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0}%
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-500">Avg Response</p>
                            <p className="text-2xl font-semibold text-slate-900">{stats.avgResponseTime}ms</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-500">Inbound</p>
                            <p className="text-2xl font-semibold text-blue-600">{stats.inbound.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-slate-500">Outbound</p>
                            <p className="text-2xl font-semibold text-purple-600">{stats.outbound.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-0 shadow-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px] relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search by tracking # or endpoint..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="pl-10 border-slate-200"
                                />
                            </div>

                            <Select value={filters.direction} onValueChange={(v) => setFilters({ ...filters, direction: v })}>
                                <SelectTrigger className="w-[150px] border-slate-200">
                                    <SelectValue placeholder="Direction" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Directions</SelectItem>
                                    <SelectItem value="inbound">Inbound</SelectItem>
                                    <SelectItem value="outbound">Outbound</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                                <SelectTrigger className="w-[150px] border-slate-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.source} onValueChange={(v) => setFilters({ ...filters, source: v })}>
                                <SelectTrigger className="w-[180px] border-slate-200">
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    {sources.map(source => (
                                        <SelectItem key={source} value={source}>{source}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm">
                        <ScrollArea className="h-[600px]">
                            <div className="divide-y divide-slate-100">
                                {filteredLogs.map((log) => {
                                    const isSuccess = log.status_code >= 200 && log.status_code < 300;
                                    const isExpanded = expandedLog === log.id;

                                    return (
                                        <div
                                            key={log.id}
                                            className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                                            onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    log.direction === 'inbound' ? "bg-blue-100" : "bg-purple-100"
                                                )}>
                                                    {log.direction === 'inbound'
                                                        ? <ArrowDownLeft className="w-4 h-4 text-blue-600" />
                                                        : <ArrowUpRight className="w-4 h-4 text-purple-600" />
                                                    }
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium text-slate-500 uppercase">{log.method}</span>
                                                        <span className="text-sm font-mono text-slate-900 truncate">{log.endpoint}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        {log.tracking_number && (
                                                            <span className="font-mono">{log.tracking_number}</span>
                                                        )}
                                                        <span>•</span>
                                                        <span>{log.source}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className={cn(
                                                        "font-mono text-xs",
                                                        isSuccess ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"
                                                    )}>
                                                        {log.status_code}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 w-16 text-right">{log.response_time_ms}ms</span>
                                                    <span className="text-xs text-slate-400 w-32 text-right">
                            {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                          </span>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="mt-4 grid grid-cols-2 gap-4">
                                                    {log.request_body && (
                                                        <div>
                                                            <p className="text-xs font-medium text-slate-500 mb-2">Request Body</p>
                                                            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-auto max-h-48">
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
                                                            <p className="text-xs font-medium text-slate-500 mb-2">Response Body</p>
                                                            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-auto max-h-48">
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
                                            )}
                                        </div>
                                    );
                                })}

                                {filteredLogs.length === 0 && (
                                    <div className="text-center py-20">
                                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-900 mb-1">No logs found</h3>
                                        <p className="text-slate-500">Try adjusting your filters</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </Card>
                )}
            </div>
        </div>
    );
}