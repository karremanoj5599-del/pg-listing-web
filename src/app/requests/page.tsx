"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  UserPlus, 
  ExternalLink,
  ChevronDown,
  Filter,
  Check
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "Contacted", label: "Contacted", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "Visit Completed", label: "Visit Completed", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "Converted", label: "Converted", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "Closed", label: "Closed", color: "bg-gray-100 text-gray-700 border-gray-200" },
];

export default function RequestsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchLeads = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(`${baseUrl}/admin/website-leads`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch visit requests");
        }

        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setUpdatingId(leadId);
    const previousLeads = [...leads];
    // Optimistic update
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${baseUrl}/admin/website-leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error("Failed to update status on server");
      }
      showToast(`Lead status updated to ${newStatus}`);
    } catch (err: any) {
      console.error("Status update error:", err);
      setLeads(previousLeads);
      showToast("Error updating status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConvertToTenant = (lead: any) => {
    // Construct PGMS Admin URL or copy structured tenant details
    const adminUrl = `http://localhost:5173/tenants?action=new&name=${encodeURIComponent(lead.visitor_name)}&phone=${encodeURIComponent(lead.mobile)}&property=${lead.property_id}`;
    
    // Copy to clipboard for easy pasting into any registration form
    const clipboardText = `Name: ${lead.visitor_name}\nMobile: ${lead.mobile}\nProperty: ${lead.property_name || 'PG'}\nExpected Date: ${lead.expected_date || 'N/A'}`;
    navigator.clipboard?.writeText(clipboardText).catch(() => {});

    showToast(`Copied ${lead.visitor_name}'s info to clipboard! Redirecting to tenant onboarding...`);
    
    // Also try opening Admin portal in a new tab if running
    setTimeout(() => {
      window.open(adminUrl, "_blank");
    }, 600);
  };

  const getStatusColor = (status: string) => {
    const matched = STATUS_OPTIONS.find(s => s.value.toLowerCase() === status?.toLowerCase());
    return matched ? matched.color : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const filteredLeads = useMemo(() => {
    if (selectedFilter === "All") return leads;
    return leads.filter(l => l.status?.toLowerCase() === selectedFilter.toLowerCase());
  }, [leads, selectedFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: leads.length };
    STATUS_OPTIONS.forEach(s => {
      map[s.value] = leads.filter(l => l.status?.toLowerCase() === s.value.toLowerCase()).length;
    });
    return map;
  }, [leads]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 md:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-forest text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 text-sm font-medium"
          >
            <Check size={18} className="text-terracotta" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-forest/70 hover:text-forest transition-colors font-medium mb-4">
              <ArrowLeft size={20} /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-forest">
              Tenant Visit Requests & Bookings
            </h1>
            <p className="text-forest/60 mt-2">
              Manage website leads, initiate instant WhatsApp chats, and convert prospects directly to tenants.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/properties"
              className="px-5 py-2.5 bg-white text-forest border border-forest/15 rounded-xl font-medium hover:bg-forest/5 transition-colors shadow-sm text-sm"
            >
              View Property Discovery
            </Link>
            <button 
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white text-terracotta border border-terracotta/20 rounded-xl font-medium hover:bg-terracotta hover:text-white transition-colors shadow-sm text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Status Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-semibold text-forest/60 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter size={14} /> Filter:
          </span>
          {["All", ...STATUS_OPTIONS.map(s => s.value)].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedFilter === status 
                  ? "bg-forest text-white shadow-md shadow-forest/20" 
                  : "bg-white text-forest/70 hover:bg-forest/5 border border-forest/10"
              }`}
            >
              {status}
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedFilter === status ? "bg-white/20 text-white" : "bg-forest/10 text-forest/70"
              }`}>
                {counts[status] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-forest/5 border border-white overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-forest/60">
              Loading requests...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-forest/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-forest/40" />
              </div>
              <h3 className="text-xl font-medium text-forest mb-2">No Requests Found</h3>
              <p className="text-forest/60">
                {selectedFilter === "All" 
                  ? "When tenants book visits on the website, they will appear here." 
                  : `No requests with status '${selectedFilter}'.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-forest/5 text-forest/80 border-b border-forest/10">
                    <th className="p-4 font-medium text-sm">Visitor Details</th>
                    <th className="p-4 font-medium text-sm">Property & Type</th>
                    <th className="p-4 font-medium text-sm">Expected Date</th>
                    <th className="p-4 font-medium text-sm">Status Lifecycle</th>
                    <th className="p-4 font-medium text-sm text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead: any, idx: number) => {
                    const cleanPhone = (lead.mobile || "").replace(/[^0-9]/g, "");
                    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
                    const whatsappMessage = encodeURIComponent(
                      `Hi ${lead.visitor_name}, thank you for your interest in ${lead.property_name || 'our PG'}! We would love to host you for a visit. Please let us know if your expected date works for you.`
                    );
                    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;

                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        key={lead.id} 
                        className="border-b border-forest/5 hover:bg-white transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-forest flex items-center gap-2">
                              <User size={16} className="text-forest/50" /> {lead.visitor_name}
                            </span>
                            <div className="flex items-center gap-3 mt-1.5">
                              <a 
                                href={`tel:${lead.mobile}`} 
                                className="text-xs text-forest/70 flex items-center gap-1 hover:text-terracotta transition-colors"
                              >
                                <Phone size={12} /> {lead.mobile}
                              </a>
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-0.5 rounded-full transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={12} className="text-green-600" /> WhatsApp
                              </a>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="text-forest/90 font-medium text-sm block">{lead.property_name || "Unknown Property"}</span>
                          <span className={`inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            lead.type === "Booking" 
                              ? "bg-purple-100 text-purple-800" 
                              : "bg-forest/10 text-forest/70"
                          }`}>
                            {lead.type || "Visit"}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-forest/80 text-sm flex items-center gap-1.5">
                            <Calendar size={14} className="text-forest/40" /> 
                            {lead.expected_date ? new Date(lead.expected_date).toLocaleDateString() : "Not specified"}
                          </span>
                          <span className="text-[11px] text-forest/50 block mt-1">
                            Rec'd {new Date(lead.created_at).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="relative inline-block">
                            <select
                              value={lead.status || "Pending"}
                              disabled={updatingId === lead.id}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`appearance-none text-xs font-bold px-3 py-1.5 pr-7 rounded-xl border outline-none cursor-pointer transition-colors shadow-sm ${getStatusColor(lead.status)}`}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleConvertToTenant(lead)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white hover:bg-forest/90 rounded-xl text-xs font-bold transition-all shadow-sm shadow-forest/10"
                              title="Register as tenant in PGMS Admin"
                            >
                              <UserPlus size={13} />
                              <span>Convert to Tenant</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
