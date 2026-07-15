"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Phone, ArrowRight, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get("register") === "true");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mobile: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://pgms-nu.vercel.app/api";
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      
      // Build request body
      const body: Record<string, string> = {
        email: formData.email,
        password: formData.password
      };
      if (isRegister && formData.mobile) {
        body.mobile = formData.mobile;
      }
      
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `${isRegister ? "Registration" : "Login"} failed`);
      }
      
      if (isRegister) {
        setSuccess("Account created successfully! Please sign in.");
        setIsRegister(false);
        setFormData(prev => ({ ...prev, password: "", mobile: "" }));
      } else {
        // Token is inside data.user.token (backend returns { user: { ...userData, token } })
        const token = data.user?.token || data.token;
        if (token) {
          localStorage.setItem("admin_token", token);
          // Also store user info for display
          if (data.user) {
            localStorage.setItem("admin_user", JSON.stringify({
              user_id: data.user.user_id,
              email: data.user.email,
              display_name: data.user.display_name,
              pg_name: data.user.pg_name,
              status: data.user.status
            }));
          }
          router.push("/requests");
        } else {
          throw new Error("No token received from server");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-forest/70 hover:text-forest transition-colors font-medium z-10">
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-forest/5 border border-white max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-terracotta flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            P
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-heading font-bold text-forest">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-forest/60 mt-2">
                {isRegister 
                  ? "Join PGMS to find your perfect home away from home." 
                  : "Sign in to manage your bookings and saved properties."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm text-center"
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-green-50 text-green-600 border border-green-100 rounded-xl text-sm text-center"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-forest/80 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-forest/10 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all text-forest placeholder:text-forest/40"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Mobile Number - only shown during registration */}
          <AnimatePresence>
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="text-sm font-medium text-forest/80 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" size={18} />
                  <input 
                    type="tel" 
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-forest/10 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all text-forest placeholder:text-forest/40"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-forest/80">Password</label>
              {!isRegister && (
                <Link href="#" className="text-xs font-medium text-terracotta hover:text-terracotta/80 transition-colors">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" size={18} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={isRegister ? 6 : undefined}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-forest/10 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all text-forest placeholder:text-forest/40"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-white py-3.5 rounded-xl font-medium mt-6 hover:bg-forest/90 transition-colors shadow-lg shadow-forest/20 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading 
              ? (isRegister ? "Creating Account..." : "Signing In...") 
              : (isRegister ? "Create Account" : "Sign In")}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
          
          <div className="mt-6 text-center text-sm text-forest/60">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="text-terracotta font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="text-terracotta font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
