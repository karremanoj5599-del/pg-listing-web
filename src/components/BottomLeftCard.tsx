import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface BottomLeftCardProps {
  onExplore: () => void;
}

export default function BottomLeftCard({ onExplore }: BottomLeftCardProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute bottom-28 right-4 left-auto md:left-6 md:right-auto md:bottom-6 lg:bottom-10 lg:left-10 p-3 md:p-4 lg:p-5 rounded-[1.2rem] md:rounded-[1.5rem] lg:rounded-[2.2rem] bg-white/30 backdrop-blur-xl flex flex-col gap-2 lg:gap-3 min-w-[140px] md:min-w-[150px] lg:min-w-[180px] w-fit z-10"
    >
      <div className="flex flex-col">
        <span className="text-2xl md:text-3xl font-normal text-[rgba(20,40,75,0.9)] tracking-tight">
          1.8K+
        </span>
        <span className="text-[10px] md:text-[12px] font-normal text-[rgba(20,40,75,0.6)] uppercase tracking-wider">
          Verified Spaces
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onExplore}
        className="flex items-center bg-white rounded-full pl-1.5 pr-5 py-1.5 gap-2 hover:bg-white/90 transition-colors self-start group cursor-pointer"
      >
        <div className="bg-[rgba(20,40,75,0.1)] p-1 rounded-full flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-[rgba(20,40,75,0.9)] group-hover:rotate-45 transition-transform" />
        </div>
        <span className="text-[14px] font-normal text-[rgba(20,40,75,0.9)]">
          Explore Rooms
        </span>
      </motion.button>
    </motion.div>
  );
}
