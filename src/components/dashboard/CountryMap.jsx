import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#22c55e'];

const countryNames = {
    DE: "Germany", FR: "France", NL: "Netherlands", BE: "Belgium", ES: "Spain",
    IT: "Italy", PL: "Poland", AT: "Austria", CZ: "Czech Republic", PT: "Portugal",
    GB: "United Kingdom", IE: "Ireland", DK: "Denmark", SE: "Sweden", NO: "Norway",
    FI: "Finland", CH: "Switzerland", HU: "Hungary", RO: "Romania", SK: "Slovakia"
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{payload[0].payload.fullName}</p>
                <p className="text-sm text-slate-600">
                    <span className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].value}</span> parcels
                </p>
            </div>
        );
    }
    return null;
};

export default function CountryMap({ data }) {
    const chartData = data.slice(0, 8).map((item, index) => ({
        ...item,
        fullName: countryNames[item.country] || item.country,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Top Destinations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="count"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value, entry) => <span className="text-sm text-slate-600">{entry.payload.fullName}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}