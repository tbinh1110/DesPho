import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Columns } from "lucide-react";

export default function ImageSlider({ original, processed, isLoading }) {
    const containerRef = useRef(null);
    const sliderX = useMotionValue(50);
    const clipPath = useTransform(sliderX, (v) => `inset(0 ${100 - v}% 0 0)`);
    const leftPos = useTransform(sliderX, (v) => `calc(${v}% - 1px)`);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (processed) sliderX.set(50);
    }, [processed, sliderX]);

    const handlePointer = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        sliderX.set(Math.min(100, Math.max(0, (x / rect.width) * 100)));
    };

    if (!original) return null;

    return (
        <div className="relative w-full h-full bg-[#0b0f19] select-none group">
            <div
                ref={containerRef}
                className="relative w-full h-full cursor-col-resize touch-none"
                onPointerDown={(e) => { setDragging(true); handlePointer(e); }}
                onPointerMove={(e) => dragging && handlePointer(e)}
                onPointerUp={() => setDragging(false)}
                onPointerLeave={() => setDragging(false)}
            >
                <img
                    src={original}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />

                <img
                    src={original}
                    alt="Original Base"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {processed && (
                    <motion.div
                        className="absolute inset-0 z-10 overflow-hidden"
                        style={{ clipPath }}
                    >
                
                        <div
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundColor: '#e5e7eb',
                                backgroundImage: `
                                    linear-gradient(45deg, #fff 25%, transparent 25%), 
                                    linear-gradient(-45deg, #fff 25%, transparent 25%), 
                                    linear-gradient(45deg, transparent 75%, #fff 75%), 
                                    linear-gradient(-45deg, transparent 75%, #fff 75%)
                                `,
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                                opacity: 1
                            }}
                        />

                        <img
                            src={processed}
                            alt="Processed"
                            crossOrigin="anonymous"
                            className=" inset-0 w-full h-full object-contain pointer-events-none  z-20"
                        />
                    </motion.div>
                )}

                {processed && !isLoading && (
                    <motion.div
                        className="absolute top-0 bottom-0 z-30  bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                        style={{ left: leftPos }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full p-2 shadow-xl cursor-col-resize hover:scale-110 transition-transform">
                            <Columns size={16} className="text-white" />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}