"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { CalendarClock, MapPin, Clock } from "lucide-react";
import LottieAnimation from "@/components/LottieAnimation";

interface TodayScheduleProps {
  bookings: any[];
}

export function TodaySchedule({ bookings }: TodayScheduleProps) {
  const today = new Date();
  
  const todaysTrips = bookings.filter(
    (b) => b.travel_date && isSameDay(new Date(b.travel_date), today) && b.status !== 'cancelled'
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <Card className="bg-surface/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-sm overflow-hidden h-full">
      <CardHeader className="p-6 border-b border-border/50">
        <CardTitle className="text-xl font-display font-bold text-ink flex items-center gap-2">
          <CalendarClock size={20} className="text-accent-secondary" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {todaysTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
             <div className="w-32 h-32 opacity-80 mb-4">
                <CalendarClock size={64} className="w-full h-full text-ink-muted/30" />
             </div>
             <p className="font-semibold text-ink">No trips scheduled for today</p>
             <p className="text-sm text-ink-muted mt-1">Take a break or review pending bookings!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {todaysTrips.map((trip) => (
              <div key={trip.id} className="p-6 hover:bg-bg/50 transition-colors flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-ink">{trip.full_name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> Morning
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {trip.pickup_location || "Ujjain"}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    trip.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'
                  }`}>
                    {trip.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm p-3 bg-bg border border-border/50 rounded-xl">
                  <div>
                    <p className="text-xs text-ink-muted">Vehicle</p>
                    <p className="font-medium text-ink">{trip.vehicle_preference || "Assigned by Admin"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-muted">Passengers</p>
                    <p className="font-medium text-ink">{trip.no_of_passengers || 2} Pax</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
