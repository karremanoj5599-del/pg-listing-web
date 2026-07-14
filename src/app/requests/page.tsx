"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Phone, User, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RequestsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchLeads = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://pgms-nu.vercel.app/api";
        const res = await fetch(`${baseUrl}/admin/website-leads`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch visit requests");
        }

        const data = await res.json();
        setLeads(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "contacted": return "bg-blue-100 text-blue-700";
      case "converted": return "bg-green-100 text-green-700";
      case "closed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock size={14} className="mr-1" />;
      case "converted": return <CheckCircle size={14} className="mr-1" />;
      case "closed": return <XCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-6 md:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-forest/70 hover:text-forest transition-colors font-medium mb-4">
              <ArrowLeft size={20} /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-forest">
              Tenant Visit Requests
            </h1>
            <p className="text-forest/60 mt-2">
              Manage all leads and visit bookings from your public website.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="px-6 py-2.5 bg-white text-terracotta border border-terracotta/20 rounded-xl font-medium hover:bg-terracotta hover:text-white transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-forest/5 border border-white overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-forest/60">
              Loading requests...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-forest/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-forest/40" />
              </div>
              <h3 className="text-xl font-medium text-forest mb-2">No Requests Yet</h3>
              <p className="text-forest/60">When tenants book visits on the website, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-forest/5 text-forest/80 border-b border-forest/10">
                    <th className="p-4 font-medium">Visitor Details</th>
                    <th className="p-4 font-medium">Property</th>
                    <th className="p-4 font-medium">Expected Date</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Requested On</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: any, idx: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      key={lead.id} 
                      className="border-b border-forest/5 hover:bg-white transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-forest flex items-center gap-2">
                            <User size={16} className="text-forest/50" /> {lead.visitor_name}
                          </span>
                          <a href={`tel:${lead.mobile}`} className="text-sm text-terracotta flex items-center gap-2 mt-1 hover:underline">
                            <Phone size={14} /> {lead.mobile}
                          </a>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-forest/80 font-medium">{lead.property_name || "Unknown Property"}</span>
                        <div className="text-xs text-forest/50 mt-1 uppercase tracking-wider">{lead.type}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-forest flex items-center gap-2">
                          <Calendar size={16} className="text-forest/50" /> 
                          {lead.expected_date ? new Date(lead.expected_date).toLocaleDateString() : "Not specified"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)}
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-forest/60 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
