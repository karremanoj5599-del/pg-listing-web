"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Building, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  Lock,
  Camera,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SelfRegisterPage() {
  const [mode, setMode] = useState<"register" | "lookup">("register");
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    aadhaar_number: "",
    property_id: "",
    preferred_room_id: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  // Status Lookup state
  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(`${baseUrl}/public/properties`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProperties(data);
            setFormData(prev => ({ ...prev, property_id: data[0].id.toString() }));
          }
        }
      } catch (err) {
        console.error("Failed to load properties for self-registration:", err);
      } finally {
        setLoadingProps(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const payload: any = {
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim() || null,
        aadhaar_number: formData.aadhaar_number.trim() || null,
        property_id: formData.property_id ? parseInt(formData.property_id, 10) : null
      };

      const res = await fetch(`${baseUrl}/public/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit self-registration. Please check your details and try again.");
      } else {
        setRegistrationResult(data.data || { id: "NEW", name: formData.name, phone: cleanPhone, status: "PENDING" });
      }
    } catch (err: any) {
      console.error("Self-registration error:", err);
      setErrorMessage("Cannot connect to server. Please verify your internet connection or register in-person at the PG.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookupStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    setLookupResult(null);

    const cleanId = lookupId.trim();
    if (!cleanId) {
      setLookupError("Please enter your Registration ID.");
      return;
    }

    setLookingUp(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${baseUrl}/public/registrations/${cleanId}/status`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLookupError(data.error || "No registration request found for this ID.");
      } else {
        setLookupResult(data.data);
      }
    } catch (err: any) {
      console.error("Lookup error:", err);
      setLookupError("Failed to check status. Please check connection and try again.");
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Navigation & Title */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-forest/70 hover:text-forest transition-colors font-medium mb-4">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-forest">
                Tenant Self-Registration
              </h1>
              <p className="text-forest/60 mt-1.5 text-sm md:text-base">
                Moving into a PG? Complete your biometric onboarding and identity verification in 2 minutes.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-forest/5 rounded-2xl shrink-0 self-start md:self-auto border border-forest/10">
              <button
                type="button"
                onClick={() => { setMode("register"); setErrorMessage(""); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === "register" ? "bg-white text-forest shadow-sm" : "text-forest/60 hover:text-forest"
                }`}
              >
                New Registration
              </button>
              <button
                type="button"
                onClick={() => { setMode("lookup"); setLookupError(""); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === "lookup" ? "bg-white text-forest shadow-sm" : "text-forest/60 hover:text-forest"
                }`}
              >
                Track Status
              </button>
            </div>
          </div>
        </div>

        {mode === "register" ? (
          registrationResult ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-forest/10 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-forest mb-2">
                Registration Submitted!
              </h2>
              <p className="text-sm text-forest/70 max-w-md mx-auto mb-6">
                Your onboarding profile has been submitted to the PG Warden. Once approved, your biometric gate access will be activated immediately.
              </p>

              <div className="bg-forest/5 p-4 rounded-2xl max-w-sm mx-auto text-left space-y-2 mb-6 border border-forest/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-forest/60">Registration ID:</span>
                  <span className="font-mono font-bold text-forest text-sm">#{registrationResult.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-forest/60">Applicant:</span>
                  <span className="font-bold text-forest">{registrationResult.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-forest/60">Mobile:</span>
                  <span className="font-bold text-forest">{registrationResult.phone}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-forest/60">Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    PENDING APPROVAL
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setRegistrationResult(null);
                    setFormData({ name: "", phone: "", email: "", aadhaar_number: "", property_id: properties[0]?.id?.toString() || "", preferred_room_id: "" });
                  }}
                  className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-bold hover:bg-forest/90 transition-colors"
                >
                  Register Another Tenant
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 bg-white text-forest border border-forest/15 rounded-xl text-xs font-bold hover:bg-forest/5 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-xl border border-white"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl w-fit mb-6">
                <ShieldCheck size={16} /> Official PGMS Zero-Touch Onboarding Portal
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitRegistration} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest/80">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                      <input 
                        required 
                        type="text" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-forest/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest/80">Mobile Number (10 Digits) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/50 text-xs font-bold">+91</span>
                      <input 
                        required 
                        type="tel" 
                        maxLength={10}
                        placeholder="9876543210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })}
                        className="w-full bg-white border border-forest/15 rounded-xl py-2.5 pl-12 pr-4 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest/80">Email Address (Optional)</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-forest/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest/80">Aadhaar / ID Number (Optional)</label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                      <input 
                        type="text" 
                        maxLength={16}
                        placeholder="1234 5678 9012" 
                        value={formData.aadhaar_number}
                        onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
                        className="w-full bg-white border border-forest/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-forest/80">Select PG Branch *</label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                    <select
                      value={formData.property_id}
                      onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                      className="w-full bg-white border border-forest/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all font-medium"
                    >
                      {properties.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.address || "Hyderabad"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-forest/5 p-4 rounded-2xl border border-forest/10 flex items-start gap-3">
                  <Lock size={18} className="text-terracotta shrink-0 mt-0.5" />
                  <p className="text-xs text-forest/70 leading-relaxed">
                    By submitting, you consent to store your KYC details for PG accommodation verification under India Digital Personal Data Protection guidelines. Biometric face capture will be completed via the PG warden kiosk or the Tenant Mobile App upon check-in.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest/90 transition-all shadow-md shadow-forest/15 disabled:opacity-50"
                >
                  {submitting ? "Submitting Registration..." : "Submit Self-Registration"}
                </button>
              </form>
            </motion.div>
          )
        ) : (
          /* Track Registration Status Form */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-xl border border-white"
          >
            <h2 className="text-xl font-heading font-bold text-forest mb-2">Check Registration Status</h2>
            <p className="text-xs text-forest/60 mb-6">
              Enter your Registration Reference ID received upon submission to see current approval progress.
            </p>

            {lookupError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-medium">
                {lookupError}
              </div>
            )}

            <form onSubmit={handleLookupStatus} className="space-y-4 mb-8">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-forest/80">Registration ID</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. 14" 
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    className="w-full bg-white border border-forest/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={lookingUp}
                className="w-full bg-terracotta text-white py-3 rounded-xl font-bold text-xs hover:bg-terracotta/90 transition-all disabled:opacity-50"
              >
                {lookingUp ? "Searching..." : "Track Status"}
              </button>
            </form>

            {lookupResult && (
              <div className="bg-forest/5 p-5 rounded-2xl border border-forest/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-forest/60">Applicant:</span>
                  <span className="font-bold text-forest text-sm">{lookupResult.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-forest/60">Phone:</span>
                  <span className="font-bold text-forest text-sm">{lookupResult.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-forest/60">Submitted On:</span>
                  <span className="text-xs text-forest/80">{new Date(lookupResult.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-forest/10">
                  <span className="text-xs font-semibold text-forest/80">Verification Status:</span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    lookupResult.status === "APPROVED" 
                      ? "bg-green-100 text-green-800" 
                      : lookupResult.status === "REJECTED" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {lookupResult.status}
                  </span>
                </div>

                {lookupResult.rejection_reason && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl mt-2">
                    Note: {lookupResult.rejection_reason}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
