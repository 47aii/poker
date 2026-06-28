import { motion } from "framer-motion";

type PotDisplayProps = {
  pot: number;
};

export function PotDisplay({ pot }: PotDisplayProps) {
  return (
    <motion.div
      layout
      className="scene-pot-panel flex flex-col items-center rounded-2xl backdrop-blur-xl"
      style={{
        padding: "clamp(5px, 0.9vw, 10px) clamp(18px, 2.8vw, 34px)",
        background:
          "linear-gradient(135deg, rgba(255,220,140,0.04) 0%, rgba(16,10,4,0.88) 40%, rgba(5,3,1,0.96) 100%)",
        border: "1.5px solid rgba(212,175,55,0.50)",
        borderTopColor: "rgba(255,220,140,0.62)",
        lineHeight: 1,
      }}
    >
      <span
        className="font-bold uppercase tracking-[0.24em]"
        style={{
          fontSize: "clamp(8px, 1.0vw, 12px)",
          color: "rgba(240,195,58,0.76)",
        }}
      >
        Total Pot
      </span>
      <motion.span
        key={pot}
        initial={{ scale: 1.22, color: "#ffffff" }}
        animate={{ scale: 1, color: "#f0c23a" }}
        transition={{ type: "spring", stiffness: 380, damping: 20 }}
        className="font-black font-mono mt-1"
        style={{
          fontSize: "clamp(15px, 2.2vw, 26px)",
          textShadow: "0 0 14px rgba(240,195,58,0.38)",
        }}
      >
        ${pot.toLocaleString()}
      </motion.span>
    </motion.div>
  );
}
