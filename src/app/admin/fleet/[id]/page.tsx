"use client";

import { useEffect, useState } from "react";
import { FleetForm } from "@/components/admin/FleetForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EditFleetPage() {
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFleet() {
      const { data, error } = await supabase
        .from("fleet")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Error fetching fleet:", error);
      } else {
        setInitialData(data);
      }
      setLoading(false);
    }
    
    if (id) fetchFleet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
        <p className="text-ink-muted text-sm">Loading fleet details...</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/fleet" className="p-2 hover:bg-bg rounded-lg transition-colors text-ink-muted hover:text-ink">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-display font-bold text-ink">Fleet Not Found</h1>
        </div>
        <div className="p-8 bg-surface rounded-xl border border-border text-center text-ink-muted">
          The requested fleet vehicle could not be found. It may have been deleted.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/fleet"
          className="p-2 hover:bg-bg rounded-lg transition-colors text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Edit Fleet</h1>
          <p className="text-sm text-ink-muted">Update details for {initialData.name}</p>
        </div>
      </div>
      
      <FleetForm initialData={initialData} />
    </div>
  );
}
