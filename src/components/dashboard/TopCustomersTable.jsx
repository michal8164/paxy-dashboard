import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TopCustomersTable({ data }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={item.customer_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{item.customer_name}</p>
                                    <p className="text-sm text-slate-500">{item.count} parcels</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-0">
                                {((item.count / data.reduce((a, b) => a + b.count, 0)) * 100).toFixed(1)}%
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}