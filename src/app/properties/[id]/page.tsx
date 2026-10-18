"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  BedDouble, 
  Wifi, 
  Utensils, 
  Droplets, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  CreditCard,
  Sparkles,
  Lock,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PropertyDetails() {
  const params = useParams();
  const rawId = params?.id;
  const id = (typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "") || "";

  const [bookingMode, setBookingMode] = useState<"visit" | "token">("visit");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    visitDate: "",
    preferredSharing: "2 Sharing"
  });
  const [submittingForm, setSubmittingForm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
    fetch(`${baseUrl}/public/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty({
          id: data.id,
          name: data.name,
          type: data.type || "Co-ed",
          price: data.pricing && data.pricing.length > 0 ? `₹${data.pricing[0].price}` : "Contact for price",
          rating: 4.8,
          location: data.address || "Hyderabad",
          googleMapUrl: data.google_map_url || null,
          contactNumber: data.contact_number || null,
          contactEmail: data.contact_email || null,
          description: data.about || "Experience premium living in the heart of the city. Our property offers state-of-the-art amenities, round-the-clock biometric security, and a vibrant community.",
          images: data.images && data.images.length > 0 
            ? data.images.map((img: any) => img.image_url) 
            : [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1502672260266-1c1e8741a804?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
            ],
          amenities: data.amenities && data.amenities.length > 0
            ? data.amenities.map((a: any) => a.amenity_name)
            : ["High-Speed Wi-Fi", "Nutritious Meals", "Daily Housekeeping", "24/7 Biometric Security", "Washing Machine", "Power Backup"],
          pricingOptions: data.pricing || []
        });

        if (data.pricing && data.pricing.length > 0) {
          setFormData(prev => ({ ...prev, preferredSharing: data.pricing[0].sharing_type }));
        }
      })
      .catch(err => console.error("Error fetching property:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      setSubmitError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmittingForm(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${baseUrl}/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: property?.id ? parseInt(property.id) : parseInt(id),
          visitor_name: formData.name,
          mobile: cleanPhone,
          expected_date: formData.visitDate,
          type: "Visit"
        })
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setSubmitError(errorData.error || errorData.message || "Failed to submit request. Please check details and try again.");
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      setSubmitError("Cannot connect to server. Please check your internet connection or call the PG directly.");
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleTokenAdvanceBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      setSubmitError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmittingForm(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setSubmitError("Payment gateway could not be loaded. Please check your internet connection.");
        setSubmittingForm(false);
        return;
      }

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";
      const amountInPaise = 1000 * 100; // ₹1,000 token advance

      const options = {
        key: key,
        amount: amountInPaise,
        currency: "INR",
        name: property?.name || "PGMS Bed Reservation",
        description: `7-Day Bed Hold & Token Advance (${formData.preferredSharing})`,
        image: property?.images?.[0] || undefined,
        prefill: {
          name: formData.name,
          contact: cleanPhone,
        },
        theme: {
          color: "#C85A32",
        },
        handler: async function (response: any) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
            await fetch(`${baseUrl}/public/leads`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                property_id: property?.id ? parseInt(property.id) : parseInt(id),
                visitor_name: formData.name,
                mobile: cleanPhone,
                expected_date: formData.visitDate,
                type: "Booking"
              })
            });

            setBookingReference(response.razorpay_payment_id || `TOKEN-${Date.now().toString().slice(-6)}`);
            setFormSubmitted(true);
          } catch (postErr) {
            console.error("Failed to record booking lead after payment:", postErr);
            setBookingReference(response.razorpay_payment_id || `TOKEN-${Date.now().toString().slice(-6)}`);
            setFormSubmitted(true);
          } finally {
            setSubmittingForm(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmittingForm(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setSubmitError(response.error?.description || "Payment was not completed. Please try again.");
        setSubmittingForm(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Token advance booking failed:", err);
      setSubmitError(err.message || "Failed to initialize payment.");
      setSubmittingForm(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 relative bg-[#F9F9F9]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-6 mt-6 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm border border-forest/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-heading font-bold text-xl text-forest tracking-tight">PGMS</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/properties">
            <button className="bg-white text-forest px-4 py-2 rounded-full text-sm font-medium hover:bg-forest/5 border border-forest/10 transition-colors flex items-center gap-2">
              <ArrowLeft size={16} /> All Properties
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Image Gallery */}
      <section className="pt-32 px-6 max-w-7xl mx-auto mb-12">
        {loading ? (
          <div className="h-[50vh] flex items-center justify-center text-forest/50 font-medium">Loading property details...</div>
        ) : !property ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-forest/60 gap-4">
            <p className="text-xl font-bold">Property not found</p>
            <Link href="/properties" className="text-terracotta underline font-medium">
              Browse all available properties
            </Link>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] md:h-[60vh]"
          >
            <div className="md:col-span-3 rounded-[32px] overflow-hidden relative shadow-lg">
              <img src={property.images[0]} alt="Main" className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-forest shadow-lg flex items-center gap-2">
                <ShieldCheck size={18} className="text-terracotta" /> 100% Verified Accommodation
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <div className="flex-1 rounded-[32px] overflow-hidden shadow-sm">
                <img src={property.images[1]} alt="Room" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 rounded-[32px] overflow-hidden relative shadow-sm">
                <img src={property.images[2]} alt="Dining" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-forest/40 flex items-center justify-center cursor-pointer hover:bg-forest/50 transition-colors">
                  <span className="text-white font-bold text-lg">+12 Photos</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Content & Booking Form */}
      {property && (
        <section className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 relative">
          <div className="flex-1 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3.5 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm font-bold">
                  {property.type}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-forest bg-yellow-400/20 px-3.5 py-1 rounded-full">
                  <Star size={14} className="fill-yellow-500 text-yellow-500"/> {property.rating} Exceptional
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  <Lock size={12} /> Biometric Gate Access
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-heading font-bold text-forest mb-4">
                {property.name}
              </h1>

              {property.googleMapUrl ? (
                <a 
                  href={property.googleMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-forest/70 hover:text-terracotta transition-colors flex items-center gap-2 text-lg group w-fit"
                >
                  <MapPin size={20} className="text-terracotta group-hover:scale-110 transition-transform" /> 
                  <span className="underline decoration-dotted">{property.location}</span>
                </a>
              ) : (
                <p className="text-forest/70 flex items-center gap-2 text-lg">
                  <MapPin size={20} className="text-terracotta" /> {property.location}
                </p>
              )}
              
              {(property.contactNumber || property.contactEmail) && (
                <div className="flex flex-wrap items-center gap-6 mt-6">
                  {property.contactNumber && (
                    <a href={`tel:${property.contactNumber}`} className="text-forest/80 hover:text-terracotta transition-colors flex items-center gap-3 text-base font-medium group">
                      <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center group-hover:bg-terracotta/10 transition-colors">
                        <Phone size={18} className="text-terracotta" />
                      </div>
                      {property.contactNumber}
                    </a>
                  )}
                  {property.contactEmail && (
                    <a href={`mailto:${property.contactEmail}`} className="text-forest/80 hover:text-terracotta transition-colors flex items-center gap-3 text-base font-medium group">
                      <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center group-hover:bg-terracotta/10 transition-colors">
                        <Mail size={18} className="text-terracotta" />
                      </div>
                      {property.contactEmail}
                    </a>
                  )}
                </div>
              )}
            </motion.div>

            <div className="h-px bg-forest/10 w-full" />

            <div>
              <h2 className="text-2xl font-heading font-bold text-forest mb-4">About this property</h2>
              <p className="text-forest/70 leading-relaxed text-lg whitespace-pre-wrap">{property.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-forest mb-6">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {property.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-forest/80 font-medium">
                    <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-terracotta">
                      <CheckCircle2 size={20} />
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
            
            {property.pricingOptions && property.pricingOptions.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-heading font-bold text-forest mb-6">Room Pricing & Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.pricingOptions.map((po: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="glass-card p-6 flex justify-between items-center border border-forest/10 hover:border-terracotta/50 transition-colors bg-white/60 rounded-2xl shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <BedDouble size={24} className="text-terracotta" />
                        <div>
                          <span className="font-bold text-forest text-lg block">{po.sharing_type}</span>
                          <span className="text-xs text-green-700 font-semibold flex items-center gap-1 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Available for Booking
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-2xl text-forest">₹{po.price}</span>
                        <span className="text-forest/50 text-xs block">per month</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking & Token Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full lg:w-[420px] lg:-mt-32 relative z-10"
          >
            <div className="glass-card p-6 md:p-8 sticky top-32 bg-white/95 backdrop-blur-xl border border-forest/10 rounded-3xl shadow-2xl">
              {/* Header Price Banner */}
              <div className="flex justify-between items-end mb-6 border-b border-forest/10 pb-5">
                <div>
                  <p className="text-forest/60 text-xs font-semibold uppercase tracking-wider mb-1">Starting from</p>
                  <p className="text-3xl font-heading font-bold text-forest">{property.price}<span className="text-base font-normal text-forest/50">/mo</span></p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-1 bg-green-100 text-green-800 rounded-full">
                    Instant Confirmation
                  </span>
                </div>
              </div>

              {/* Mode Toggle Pills */}
              <div className="grid grid-cols-2 p-1 bg-forest/5 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => { setBookingMode("visit"); setSubmitError(""); }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    bookingMode === "visit" 
                      ? "bg-white text-forest shadow-md" 
                      : "text-forest/60 hover:text-forest"
                  }`}
                >
                  Schedule Free Visit
                </button>
                <button
                  type="button"
                  onClick={() => { setBookingMode("token"); setSubmitError(""); }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    bookingMode === "token" 
                      ? "bg-terracotta text-white shadow-md shadow-terracotta/25" 
                      : "text-forest/60 hover:text-forest"
                  }`}
                >
                  <Sparkles size={13} />
                  Book Bed (₹1,000)
                </button>
              </div>

              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 text-green-900 p-6 rounded-2xl flex flex-col items-center text-center gap-4 border border-green-200"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">
                      {bookingMode === "token" ? "Bed Reserved Successfully!" : "Visit Scheduled!"}
                    </h3>
                    <p className="text-xs text-green-800/80 mb-3">
                      {bookingMode === "token" 
                        ? "Your refundable ₹1,000 token deposit has been received. Your bed is reserved for 7 days."
                        : "The property manager has received your visit request and will call you shortly."}
                    </p>

                    {bookingReference && (
                      <div className="bg-white/80 p-2.5 rounded-xl text-xs font-mono font-bold text-forest/80 border border-green-200 mb-3">
                        Ref: {bookingReference}
                      </div>
                    )}

                    <div className="text-left text-xs bg-white/60 p-3 rounded-xl space-y-1.5 text-forest/80">
                      <p><span className="font-bold">Property:</span> {property.name}</p>
                      <p><span className="font-bold">Contact:</span> {formData.name} ({formData.phone})</p>
                      <p><span className="font-bold">Scheduled:</span> {formData.visitDate || "To be confirmed"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setBookingReference("");
                    }}
                    className="text-xs font-bold text-terracotta hover:underline mt-2"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={bookingMode === "token" ? handleTokenAdvanceBooking : handleBookVisit} 
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-heading font-bold text-lg text-forest mb-1">
                      {bookingMode === "token" ? "Reserve Bed with Token Advance" : "Schedule an In-Person Visit"}
                    </h3>
                    <p className="text-xs text-forest/60">
                      {bookingMode === "token" 
                        ? "Pay ₹1,000 refundable advance to hold your preferred bed for 7 days."
                        : "Pick a date and our warden will give you a guided walk-through."}
                    </p>
                  </div>
                  
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest/80">Full Name</label>
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
                    <label className="text-xs font-semibold text-forest/80">Phone Number (10 digits)</label>
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

                  {bookingMode === "token" && property.pricingOptions && property.pricingOptions.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-forest/80">Preferred Sharing Type</label>
                      <div className="relative">
                        <select
                          value={formData.preferredSharing}
                          onChange={(e) => setFormData({ ...formData, preferredSharing: e.target.value })}
                          className="w-full bg-white border border-forest/15 rounded-xl py-2.5 px-3.5 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all font-medium"
                        >
                          {property.pricingOptions.map((po: any, idx: number) => (
                            <option key={idx} value={po.sharing_type}>
                              {po.sharing_type} — ₹{po.price}/mo
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest/80">
                      {bookingMode === "token" ? "Expected Move-In Date" : "Preferred Visit Date"}
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                      <input 
                        required 
                        type="date" 
                        value={formData.visitDate}
                        onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                        className="w-full bg-white border border-forest/15 rounded-xl py-2.5 pl-10 pr-4 text-sm text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                      />
                    </div>
                  </div>

                  {bookingMode === "token" ? (
                    <button 
                      type="submit" 
                      disabled={submittingForm}
                      className="w-full bg-terracotta text-white py-3.5 rounded-xl font-bold text-base hover:bg-terracotta/90 transition-all hover:shadow-xl hover:shadow-terracotta/30 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CreditCard size={18} />
                      {submittingForm ? "Opening Checkout..." : "Pay ₹1,000 & Reserve Bed"}
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={submittingForm}
                      className="w-full bg-forest text-white py-3.5 rounded-xl font-bold text-base hover:bg-forest/90 transition-all hover:shadow-xl hover:shadow-forest/30 mt-2 disabled:opacity-50"
                    >
                      {submittingForm ? "Submitting Request..." : "Request In-Person Visit"}
                    </button>
                  )}

                  <div className="text-center text-[11px] text-forest/50 mt-3 flex items-center justify-center gap-1.5">
                    <Clock size={12} />
                    {bookingMode === "token" 
                      ? "100% Refundable within 48 hours of visit if not satisfied"
                      : "Free service • You won't be charged anything"}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </section>
      )}
    </main>
  );
}
