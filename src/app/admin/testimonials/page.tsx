"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Testimonial {
  id: string;
  created_at: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  profile_image_url?: string;
  gallery_images?: string[];
  package_name?: string;
  fleet_name?: string;
  travel_date?: string;
  overall_rating: number;
  driver_rating?: number;
  vehicle_rating?: number;
  support_rating?: number;
  darshan_rating?: number;
  experience: string;
  recommendation?: string;
  consent_to_publish: boolean;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchTestimonials = async () => {
    setLoading(true);
    let query = supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    const { data, error } = await query;
    
    if (error) toast.error("Failed to load testimonials");
    else setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const { error } = await supabase.from("testimonials").update({ status: newStatus }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Testimonial ${newStatus}`);
      fetchTestimonials();
    }
  };

  const updateAdminNotes = async (id: string, notes: string) => {
    const { error } = await supabase.from("testimonials").update({ admin_notes: notes }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Admin notes saved");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Testimonial deleted");
      fetchTestimonials();
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="px-2.5 py-1 rounded-full bg-success/20 text-success text-xs font-bold border border-success/30 flex items-center gap-1"><CheckCircle size={12}/> Approved</span>;
      case 'rejected': return <span className="px-2.5 py-1 rounded-full bg-error/20 text-error text-xs font-bold border border-error/30 flex items-center gap-1"><XCircle size={12}/> Rejected</span>;
      default: return <span className="px-2.5 py-1 rounded-full bg-warning/20 text-warning text-xs font-bold border border-warning/30 flex items-center gap-1"><Clock size={12}/> Pending</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink mb-2">Testimonials</h1>
          <p className="text-ink-muted">Manage pilgrim reviews, approve testimonials, and moderate content</p>
        </div>
        <div className="flex bg-surface border border-border rounded-lg overflow-hidden shrink-0">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${statusFilter === f ? 'bg-accent-primary text-white' : 'text-ink hover:bg-bg'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-12 text-center text-ink-muted bg-surface rounded-xl border border-border">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-center text-ink-muted bg-surface rounded-xl border border-border border-dashed">
            No {statusFilter !== 'all' ? statusFilter : ''} testimonials found.
          </div>
        ) : (
          testimonials.map((test) => {
            const isExpanded = expandedId === test.id;
            return (
              <Card key={test.id} className={`overflow-hidden transition-all ${test.status === 'approved' ? 'border-success/40' : test.status === 'pending' ? 'border-warning/40' : 'border-border'}`}>
                <CardContent className="p-0">
                  {/* Summary Row */}
                  <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="w-14 h-14 rounded-full bg-bg border border-border overflow-hidden shrink-0">
                      {test.profile_image_url ? (
                        <img src={test.profile_image_url} alt={test.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-ink-muted bg-accent-primary/10">
                          {test.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-bold text-lg text-ink truncate">{test.name}</h3>
                        {getStatusBadge(test.status)}
                        <span className="text-accent-secondary text-sm flex items-center">{"★".repeat(test.overall_rating)}{"☆".repeat(5 - (test.overall_rating || 0))}</span>
                      </div>
                      <div className="text-sm text-ink-muted flex items-center gap-2 flex-wrap">
                        {test.city && <span>{test.city}</span>}
                        {test.package_name && <><span className="text-border">•</span> <span className="font-medium text-ink/80">{test.package_name}</span></>}
                        <span className="text-border">•</span> 
                        <span>{new Date(test.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => setExpandedId(isExpanded ? null : test.id)} className="w-full sm:w-auto">
                        {isExpanded ? <><ChevronUp size={16} className="mr-2"/> Less</> : <><ChevronDown size={16} className="mr-2"/> View Details</>}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border bg-bg/30 p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      <div className="md:col-span-2 space-y-6">
                        <div>
                          <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Experience</h4>
                          <div className="p-4 bg-surface rounded-xl border border-border text-ink italic leading-relaxed">
                            "{test.experience}"
                          </div>
                        </div>

                        {test.gallery_images && test.gallery_images.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Journey Photos ({test.gallery_images.length})</h4>
                            <div className="flex flex-wrap gap-3">
                              {test.gallery_images.map((img, i) => (
                                <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 rounded-lg overflow-hidden border border-border hover:border-accent-primary transition-colors">
                                  <img src={img} alt="Journey" className="w-full h-full object-cover" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-ink-muted mb-1">Driver Rating</p>
                            <p className="font-medium text-ink">{test.driver_rating ? `★ ${test.driver_rating}/5` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-ink-muted mb-1">Vehicle Rating</p>
                            <p className="font-medium text-ink">{test.vehicle_rating ? `★ ${test.vehicle_rating}/5` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-ink-muted mb-1">Support Rating</p>
                            <p className="font-medium text-ink">{test.support_rating ? `★ ${test.support_rating}/5` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-ink-muted mb-1">Darshan Rating</p>
                            <p className="font-medium text-ink">{test.darshan_rating ? `★ ${test.darshan_rating}/5` : 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 border-l border-border pl-0 md:pl-6 pt-6 md:pt-0">
                        
                        <div>
                          <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">Moderation Actions</h4>
                          <div className="flex flex-col gap-2">
                            {test.status !== 'approved' && (
                              <Button onClick={() => updateStatus(test.id, 'approved')} className="w-full bg-success hover:bg-success/90 text-white">
                                <CheckCircle size={16} className="mr-2" /> Approve & Publish
                              </Button>
                            )}
                            {test.status !== 'rejected' && (
                              <Button variant="outline" onClick={() => updateStatus(test.id, 'rejected')} className="w-full text-error border-error/50 hover:bg-error hover:text-white">
                                <XCircle size={16} className="mr-2" /> Reject
                              </Button>
                            )}
                            <Button variant="ghost" onClick={() => handleDelete(test.id)} className="w-full text-error hover:bg-error/10">
                              <Trash2 size={16} className="mr-2" /> Delete Permanently
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Internal Notes</h4>
                          <Textarea 
                            defaultValue={test.admin_notes || ""}
                            onBlur={(e) => updateAdminNotes(test.id, e.target.value)}
                            placeholder="Add private notes here (auto-saves on blur)..."
                            className="text-sm min-h-[100px] resize-y"
                          />
                        </div>

                        <div className="text-xs space-y-1.5 text-ink-muted">
                          <p><strong>Contact:</strong> {test.email || 'N/A'} {test.phone ? `| ${test.phone}` : ''}</p>
                          <p><strong>Fleet:</strong> {test.fleet_name || 'N/A'}</p>
                          <p><strong>Travel Date:</strong> {test.travel_date ? new Date(test.travel_date).toLocaleDateString() : 'N/A'}</p>
                          <p><strong>Would Recommend:</strong> {test.recommendation || 'N/A'}</p>
                          <p><strong>Consent Provided:</strong> {test.consent_to_publish ? 'Yes' : 'No'}</p>
                        </div>
                        
                      </div>

                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
