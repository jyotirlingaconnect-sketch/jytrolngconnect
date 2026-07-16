"use client";

import { useMemo } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

interface AnalyticsChartsProps {
  bookings: any[];
  days: number;
}

const STATUS_COLORS = {
  pending: "#f97316",   // orange-500
  confirmed: "#3b82f6", // blue-500
  completed: "#22c55e", // green-500
  cancelled: "#ef4444", // red-500
};

export function AnalyticsCharts({ bookings, days }: AnalyticsChartsProps) {
  
  // Aggregate data for Line Chart
  const trendData = useMemo(() => {
    const data = [];
    const today = startOfDay(new Date());
    
    // Generate array of last 'days' days
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayBookings = bookings.filter(b => b.created_at && isSameDay(new Date(b.created_at), date));
      data.push({
        date: format(date, "MMM dd"),
        total: dayBookings.length,
      });
    }
    return data;
  }, [bookings, days]);

  // Aggregate data for Pie Chart
  const statusData = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    bookings.forEach(b => {
      if (counts[b.status as keyof typeof counts] !== undefined) {
        counts[b.status as keyof typeof counts]++;
      }
    });
    
    return [
      { name: 'Pending', value: counts.pending, color: STATUS_COLORS.pending },
      { name: 'Confirmed', value: counts.confirmed, color: STATUS_COLORS.confirmed },
      { name: 'Completed', value: counts.completed, color: STATUS_COLORS.completed },
      { name: 'Cancelled', value: counts.cancelled, color: STATUS_COLORS.cancelled },
    ].filter(item => item.value > 0);
  }, [bookings]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Line Chart */}
      <Card className="lg:col-span-2 bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm">
        <CardHeader className="p-6 border-b border-border/50">
          <CardTitle className="text-xl font-display font-bold text-ink flex items-center gap-2">
            <TrendingUp size={20} className="text-accent-primary" />
            Booking Trends ({days} Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} dy={10} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: 'var(--accent-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                name="Bookings"
                stroke="var(--accent-primary)" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: 'var(--accent-secondary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm">
        <CardHeader className="p-6 border-b border-border/50">
          <CardTitle className="text-xl font-display font-bold text-ink flex items-center gap-2">
            <PieChartIcon size={20} className="text-accent-secondary" />
            Booking Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-[350px] flex flex-col items-center justify-center">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'var(--ink)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex flex-col items-center justify-center text-ink-muted/50 h-full">
               <PieChartIcon size={48} className="mb-4 opacity-20" />
               <p>No status data available</p>
             </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
