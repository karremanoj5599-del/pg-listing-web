"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: ""
  });

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, mobile: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in with:", formData.email, formData.password);
      // Implement login API call here
    } else {
      console.log("Registering with:", formData);
      // Implement registration API call here
    }
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
          <h2 className="text-3xl font-heading font-bold text-forest">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-forest/60 mt-2">
            {isLogin 
              ? "Sign in to manage your bookings and saved properties." 
              : "Join PGMS to find your perfect home away from home."}
          </p>
        </div>

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

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                <label className="text-sm font-medium text-forest/80 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" size={18} />
                  <input 
                    type="tel" 
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleMobileChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-forest/10 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all text-forest placeholder:text-forest/40"
                    placeholder="Enter your 10-digit number"
                    maxLength={10}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-forest/80">Password</label>
              {isLogin && <a href="#" className="text-xs text-terracotta hover:underline">Forgot password?</a>}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" size={18} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-forest/10 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all text-forest placeholder:text-forest/40"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-forest text-white py-3.5 rounded-xl font-medium mt-6 hover:bg-forest/90 transition-colors shadow-lg shadow-forest/20 flex items-center justify-center gap-2 group"
          >
            {isLogin ? "Sign In" : "Create Account"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-forest/60">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-terracotta font-medium hover:underline focus:outline-none"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
