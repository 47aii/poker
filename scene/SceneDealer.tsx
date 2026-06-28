import { motion } from "framer-motion";

type SceneDealerProps = {
  isDealing?: boolean;
};

export function SceneDealer({ isDealing = false }: SceneDealerProps) {
  return (
    /*
     * Screen-space dealer. Positioned so only the upper body (head + shoulders)
     * shows above the back rail of the table. The mask fades her torso out so
     * she never overlaps the playing surface.
     *
     * top: 5% → head clears the viewport top, rail hides the lower body.
     * z-index 6 → behind seat pods (z-index 40) so she stays behind the table.
     */
    <div
      className="pointer-events-none absolute select-none"
      style={{
        left: "50%",
        top: "5%",
        width: "clamp(150px, 18vw, 280px)",
        transform: "translateX(-50%)",
        zIndex: 6,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="scene-dealer-idle relative"
      >
        {/* Very soft overhead key light */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-6% -16% auto",
            height: "40%",
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,195,100,0.07) 0%, transparent 72%)",
            filter: "blur(20px)",
            zIndex: -1,
          }}
        />

        {/* Ground-contact shadow where dealer meets the rail */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "65%",
            height: "14px",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.85) 0%, transparent 72%)",
            filter: "blur(12px)",
            zIndex: -1,
          }}
        />

        {/* Subtle felt-red bounce from below */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "52% -6% -3%",
            background:
              "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(90,0,0,0.12) 0%, transparent 72%)",
            filter: "blur(16px)",
            zIndex: -1,
          }}
        />

        {/* Dealer image */}
        <motion.div
          animate={
            isDealing
              ? { rotate: [-1, 1.4, -0.7, 0.7, 0], y: [0, -4, 0] }
              : {}
          }
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <img
            src="/assets/dealer-royal-nobg.png"
            alt="Dealer"
            className="w-full"
            style={{
              /*
               * Mask: solid from top through shoulders; fade to transparent
               * at mid-torso so lower body is hidden behind the back rail.
               */
              maskImage:
                "linear-gradient(to bottom, black 0%, black 38%, rgba(0,0,0,0.55) 56%, rgba(0,0,0,0.1) 70%, transparent 82%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 38%, rgba(0,0,0,0.55) 56%, rgba(0,0,0,0.1) 70%, transparent 82%)",
              filter:
                "drop-shadow(0 20px 38px rgba(0,0,0,0.97)) brightness(1.01) contrast(1.03) saturate(1.03)",
              transform: "perspective(900px) rotateX(3deg)",
              transformOrigin: "bottom center",
              display: "block",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
