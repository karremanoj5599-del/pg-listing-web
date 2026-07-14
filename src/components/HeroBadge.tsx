import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface HeroBadgeProps {
  onClick: () => void;
}

export default function HeroBadge({ onClick }: HeroBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-lg border border-white/20 mx-auto mb-3 w-fit shadow-md hover:bg-white/25 transition-all cursor-pointer group"
    >
      <Sparkles className="w-4 h-4 text-terracotta fill-terracotta/20 group-hover:rotate-12 transition-transform" />
      <span className="text-[14px] font-medium text-white">Smart Booking Open</span>
    </motion.div>
  );
}
