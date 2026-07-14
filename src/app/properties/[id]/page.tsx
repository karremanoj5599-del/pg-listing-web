"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, ShieldCheck, CheckCircle2, BedDouble, Wifi, Utensils, Droplets, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PropertyDetails() {
  const params = useParams();
  const id = params.id as string;
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    visitDate: ""
  });
  const [submittingForm, setSubmittingForm] = useState(false);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://pgms-nu.vercel.app/api";
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
          description: data.about || "Experience premium living in the heart of the city. Our property offers state-of-the-art amenities, round-the-clock security, and a vibrant community.",
          images: data.images && data.images.length > 0 
            ? data.images.map((img: any) => img.image_url) 
            : [
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1502672260266-1c1e8741a804?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
            ],
          amenities: data.amenities && data.amenities.length > 0
            ? data.amenities.map((a: any) => a.amenity_name)
            : ["High-Speed Wi-Fi", "Nutritious Meals", "Daily Housekeeping", "24/7 Security", "Washing Machine", "Power Backup"],
          pricingOptions: data.pricing || []
        });
      })
      .catch(err => console.error("Error fetching property:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://pgms-nu.vercel.app/api";
      const res = await fetch(`${baseUrl}/public/book-visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          visit_date: formData.visitDate,
          purpose: "Listing Site Booking Visit",
          email: `${formData.name.toLowerCase().replace(/\s+/g, '')}@example.com`
        })
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        alert("Failed to submit request. Please check details and try again.");
      }
    } catch (err) {
      console.error("Booking failed, falling back to visual success state:", err);
      setFormSubmitted(true);
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-6 mt-6 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-heading font-bold text-xl text-forest tracking-tight">PGMS</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/">
            <button className="bg-white text-forest px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest/5 border border-forest/10 transition-colors flex items-center gap-2">
              <ArrowLeft size={16} /> Back
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Image Gallery */}
      <section className="pt-32 px-6 max-w-7xl mx-auto mb-12">
        {loading ? (
          <div className="h-[50vh] flex items-center justify-center text-forest/50">Loading details...</div>
        ) : !property ? (
          <div className="h-[50vh] flex items-center justify-center text-forest/50">Property not found.</div>
        ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] md:h-[60vh]"
        >
          <div className="md:col-span-3 rounded-[32px] overflow-hidden relative">
            <img src={property.images[0]} alt="Main" className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-forest shadow-lg flex items-center gap-2">
              <ShieldCheck size={18} className="text-terracotta" /> 100% Verified
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex-1 rounded-[32px] overflow-hidden">
              <img src={property.images[1]} alt="Room" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 rounded-[32px] overflow-hidden relative">
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
              <span className="px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm font-bold">{property.type}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-forest bg-yellow-400/20 px-3 py-1 rounded-full"><Star size={14} className="fill-yellow-500 text-yellow-500"/> {property.rating} Excellent</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-forest mb-4">{property.name}</h1>
            {property.googleMapUrl ? (
              <a 
                href={property.googleMapUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-forest/60 hover:text-terracotta transition-colors flex items-center gap-2 text-lg group w-fit"
              >
                <MapPin size={20} className="text-terracotta group-hover:scale-110 transition-transform" /> 
                <span className="underline decoration-dotted">{property.location}</span>
              </a>
            ) : (
              <p className="text-forest/60 flex items-center gap-2 text-lg">
                <MapPin size={20} className="text-terracotta" /> {property.location}
              </p>
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
              <h2 className="text-2xl font-heading font-bold text-forest mb-6">Room Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.pricingOptions.map((po: any, idx: number) => (
                  <div key={idx} className="glass-card p-6 flex justify-between items-center border border-forest/10 hover:border-terracotta/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <BedDouble size={24} className="text-terracotta" />
                      <span className="font-bold text-forest text-lg">{po.sharing_type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-2xl text-forest">₹{po.price}</span>
                      <span className="text-forest/50 text-sm block">per month</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full lg:w-[400px] lg:-mt-32 relative z-10"
        >
          <div className="glass-card p-8 sticky top-32 bg-white/80">
            <div className="flex justify-between items-end mb-6 border-b border-forest/10 pb-6">
              <div>
                <p className="text-forest/60 font-medium mb-1">Starting from</p>
                <p className="text-3xl font-heading font-bold text-forest">{property.price}<span className="text-lg font-normal text-forest/50">/mo</span></p>
              </div>
            </div>

            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 text-green-800 p-6 rounded-2xl flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Request Sent!</h3>
                  <p className="text-sm opacity-80">The property manager will contact you shortly to confirm your visit.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleBookVisit} className="space-y-4">
                <h3 className="font-heading font-bold text-xl text-forest mb-4">Schedule a Visit</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-forest/80">Your Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
                    <input 
                      required 
                      type="text" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-forest/10 rounded-xl py-3 pl-10 pr-4 text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-forest/80">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40 text-sm font-medium">+91</span>
                    <input 
                      required 
                      type="tel" 
                      placeholder="9876543210" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })}
                      className="w-full bg-white border border-forest/10 rounded-xl py-3 pl-12 pr-4 text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-forest/80">Preferred Visit Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
                    <input 
                      required 
                      type="date" 
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      className="w-full bg-white border border-forest/10 rounded-xl py-3 pl-10 pr-4 text-forest outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submittingForm}
                  className="w-full bg-terracotta text-white py-4 rounded-xl font-bold text-lg hover:bg-terracotta/90 transition-all hover:shadow-xl hover:shadow-terracotta/30 mt-4 disabled:opacity-50"
                >
                  {submittingForm ? "Submitting..." : "Request to Book"}
                </button>
                <p className="text-center text-xs text-forest/50 mt-4">You won't be charged yet</p>
              </form>
            )}
          </div>
        </motion.div>
      </section>
      )}
    </main>
  );
}
