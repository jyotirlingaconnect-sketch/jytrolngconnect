import { FleetForm } from "@/components/admin/FleetForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Add New Fleet | Admin | Jyotirling Connect",
};

export default function NewFleetPage() {
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
          <h1 className="text-2xl font-display font-bold text-ink">Add New Fleet</h1>
          <p className="text-sm text-ink-muted">Create a new vehicle listing for your fleet.</p>
        </div>
      </div>
      
      <FleetForm />
    </div>
  );
}
