import { motion, useMotionTemplate } from "framer-motion";
import { useColorContext } from "../context/ColorContext";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Aurora() {
  const { color } = useColorContext();

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  const border = useMotionTemplate`1px solid ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="absolute inset-0 overflow-hidden bg-gray-950"
    >
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2000} factor={2} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
}

export default Aurora;
