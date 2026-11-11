import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { StaggerItem } from '@/components/shared/overview'

// Mock chart data for Analytics Growth
const PERFORMANCE_DATA = [
    { name: 'Jan', users: 10000 },
    { name: 'Feb', users: 30000 },
    { name: 'Mar', users: 20000 },
    { name: 'Apr', users: 80000 },
    { name: 'May', users: 40000 },
    { name: 'Jun', users: 35000 },
    { name: 'Jul', users: 15000 },
    { name: 'Aug', users: 35000 },
    { name: 'Sep', users: 60000 },
    { name: 'Oct', users: 40000 },
    { name: 'Nov', users: 28000 },
    { name: 'Dec', users: 45000 },
]

export function AnalyticsGrowthChart() {
    return (
        <StaggerItem>
            <Card className="border border-border/50 shadow-sm bg-card">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <CardTitle className="text-lg font-bold text-foreground">Analytics Growth</CardTitle>
                            <CardDescription>Cumulative users over time (Investor View)</CardDescription>
                        </div>
                        <div className="w-[100px]">
                            <Select defaultValue="2026">
                                <SelectTrigger className="h-8 bg-background border-border text-foreground focus:ring-primary/20 focus:ring-2">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2026">2026</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-6 pt-0">
                    <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PERFORMANCE_DATA} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <Tooltip cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </StaggerItem>
    )
}
