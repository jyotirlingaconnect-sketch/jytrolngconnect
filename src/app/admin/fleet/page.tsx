"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function FleetDashboard() {
  const [fleets, setFleets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFleets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fleet")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching fleets:", error);
    } else {
      setFleets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFleets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fleet?")) return;
    const { error } = await supabase.from("fleet").delete().eq("id", id);
    if (!error) {
      setFleets(fleets.filter(f => f.id !== id));
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("fleet")
      .update({ show_on_website: !currentStatus })
      .eq("id", id);

    if (!error) {
      setFleets(fleets.map(f => f.id === id ? { ...f, show_on_website: !currentStatus } : f));
    }
  };

  const filteredFleets = fleets.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Fleet Management</h1>
          <p className="text-sm text-ink-muted">Manage your vehicles, pricing, and availability.</p>
        </div>
        <Link
          href="/admin/fleet/new"
          className="flex items-center gap-2 bg-accent-primary text-surface px-4 py-2 rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add Fleet
        </Link>
      </div>

      {/* ── Filters and Search ───────────────────────────────────────── */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
          <input
            type="text"
            placeholder="Search fleets by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:border-accent-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium text-ink hover:bg-bg transition-colors w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          MOBILE CARD GRID  (below md)
      ════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {loading ? (
          <div className="py-12 text-center text-ink-muted">Loading fleets...</div>
        ) : filteredFleets.length === 0 ? (
          <div className="py-12 text-center text-ink-muted bg-surface rounded-xl border border-border border-dashed">
            No fleets found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFleets.map((fleet) => (
              <div key={fleet.id} className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
                {/* Vehicle image */}
                <div className="h-40 w-full bg-bg border-b border-border relative">
                  {fleet.cover_image ? (
                    <img src={fleet.cover_image} alt={fleet.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-muted/40 text-sm">
                      No image
                    </div>
                  )}
                  {/* Featured badge */}
                  {fleet.is_featured && (
                    <span className="absolute top-2 left-2 text-[10px] font-semibold bg-accent-primary text-surface px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-semibold text-ink leading-snug">{fleet.name}</div>
                      <div className="text-xs text-ink-muted">{fleet.brand}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {fleet.show_on_website ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-ink-muted" />
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category + Capacity tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-1 bg-bg border border-border rounded-md text-xs font-medium text-ink-muted">
                      {fleet.category}
                    </span>
                    <span className="px-2 py-1 bg-bg border border-border rounded-md text-xs font-medium text-ink-muted">
                      {fleet.min_passengers}–{fleet.max_passengers} Guests
                    </span>
                  </div>

                  {/* Action buttons — always visible, min 44px touch target */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisibility(fleet.id, fleet.show_on_website)}
                      className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg border border-border text-ink-muted hover:text-ink hover:bg-bg transition-colors text-xs font-medium"
                      title={fleet.show_on_website ? "Hide from website" : "Show on website"}
                    >
                      {fleet.show_on_website ? <EyeOff size={15} /> : <Eye size={15} />}
                      {fleet.show_on_website ? "Hide" : "Show"}
                    </button>
                    <Link
                      href={`/admin/fleet/${fleet.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg border border-border text-ink-muted hover:text-accent-primary hover:border-accent-primary transition-colors text-xs font-medium"
                      title="Edit"
                    >
                      <Edit size={15} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(fleet.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg border border-error/30 text-error hover:bg-error/10 transition-colors text-xs font-medium"
                      title="Delete"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          DESKTOP TABLE VIEW  (md+)
      ════════════════════════════════════════════════ */}
      <div className="hidden md:block bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-bg border-b border-border text-ink-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-ink-muted">
                    Loading fleets...
                  </td>
                </tr>
              ) : filteredFleets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-ink-muted">
                    No fleets found.
                  </td>
                </tr>
              ) : (
                filteredFleets.map((fleet) => (
                  <tr key={fleet.id} className="hover:bg-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-bg border border-border overflow-hidden shrink-0 relative">
                          {fleet.cover_image ? (
                            <img src={fleet.cover_image} alt={fleet.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink-muted/50">No img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-ink">{fleet.name}</div>
                          <div className="text-xs text-ink-muted">{fleet.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-bg border border-border rounded-md text-xs font-medium text-ink-muted">
                        {fleet.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {fleet.min_passengers}-{fleet.max_passengers} Guests
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {fleet.show_on_website ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
                            <span className="w-1.5 h-1.5 rounded-full bg-ink-muted" />
                            Hidden
                          </span>
                        )}
                        {fleet.is_featured && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-primary">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisibility(fleet.id, fleet.show_on_website)}
                          className="p-1.5 text-ink-muted hover:text-ink hover:bg-bg rounded transition-colors"
                          title={fleet.show_on_website ? "Hide from website" : "Show on website"}
                        >
                          {fleet.show_on_website ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <Link
                          href={`/admin/fleet/${fleet.id}`}
                          className="p-1.5 text-ink-muted hover:text-accent-primary hover:bg-bg rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(fleet.id)}
                          className="p-1.5 text-ink-muted hover:text-error hover:bg-error/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
