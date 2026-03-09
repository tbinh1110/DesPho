import React, { useState, useRef } from 'react';
import { ScanEye } from 'lucide-react';

const MagicLens = ({ original, processed, lensSize = 200 }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden cursor-crosshair select-none bg-black rounded-xl border border-white/10"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80" />
            {!isHovering && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-3 border border-white/20 shadow-2xl animate-bounce">
                        <ScanEye size={20} className="text-blue-400" />
                        <span className="text-sm font-bold tracking-wide">DI CHUỘT ĐỂ SOI CHI TIẾT</span>
                    </div>
                </div>
            )}

            {isHovering && processed && (
                <>
                    <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{ clipPath: `circle(${lensSize / 2}px at ${pos.x}px ${pos.y}px)` }}
                    >
                        <img src={processed} alt="Processed" className="absolute inset-0 w-full h-full object-contain" />
                    </div>
                    <div
                        className="absolute z-20 rounded-full border-[3px] border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.6)] pointer-events-none"
                        style={{
                            top: pos.y - lensSize / 2,
                            left: pos.x - lensSize / 2,
                            width: lensSize,
                            height: lensSize,
                        }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/80">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="0" x2="12" y2="24" />
                                <line x1="0" y1="12" x2="24" y2="12" />
                            </svg>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MagicLens;