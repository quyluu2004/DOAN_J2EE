/**
 * Lanyard Component - Reliable Drag with Pointer Capture
 * 
 * Uses setPointerCapture for reliable drag tracking.
 * No Matter.js (gravity causes falling), no Framer Motion drag (can't activate mid-gesture).
 * Pure pointer events + Framer Motion animate for bounce-back.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const Lanyard = ({ children, ropeColor = "#1a1a1a", ropeWidth = 3, onModeChange }) => {
    const containerRef = useRef(null);
    const [isLanyardMode, setIsLanyardMode] = useState(false);
    const isLanyardModeRef = useRef(false); // Ref for event handlers
    const isDraggingRef = useRef(false);
    const pressTimer = useRef(null);
    const startPos = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });
    const lastTime = useRef(0);
    const velocity = useRef({ x: 0, y: 0 });

    // Card position
    const cardX = useMotionValue(0);
    const cardY = useMotionValue(0);

    // Rotation
    const rotate = useTransform(cardX, [-200, 200], [-25, 25]);

    // Rope anchor - positioned near top of container
    const ropeAnchorY = 10;

    // Rope path
    // Card top edge in SVG coordinates (paddingTop = 80, so card starts at y=80)
    const cardTopY = 80;

    const ropePathD = useTransform(
        [cardX, cardY],
        (latest) => {
            const xVal = Number(latest[0]);
            const yVal = Number(latest[1]);
            // Rope goes from anchor to card top-center
            const endX = 130 + xVal;
            const endY = cardTopY + yVal;
            // Natural sag/curve control points
            const cp1x = 130 + xVal * 0.15;
            const cp1y = ropeAnchorY + (cardTopY - ropeAnchorY) * 0.3;
            const cp2x = 130 + xVal * 0.55;
            const cp2y = ropeAnchorY + (cardTopY - ropeAnchorY) * 0.65 + yVal * 0.3;
            return `M 130 ${ropeAnchorY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        }
    );

    // Initial swing
    useEffect(() => {
        const swing = async () => {
            await animate(cardX, 30, { duration: 0.5, ease: "easeOut" });
            await animate(cardX, -20, { duration: 0.4, ease: "easeInOut" });
            await animate(cardX, 10, { duration: 0.3, ease: "easeInOut" });
            await animate(cardX, 0, { duration: 0.3, ease: "easeOut" });
        };
        setTimeout(swing, 200);
    }, [cardX]);

    // Sync mode
    useEffect(() => {
        isLanyardModeRef.current = isLanyardMode;
        if (onModeChange) onModeChange(isLanyardMode);
    }, [isLanyardMode, onModeChange]);

    // --- Pointer Event Handlers ---
    const handlePointerDown = useCallback((e) => {
        // Don't capture immediately - it blocks children's clicks and swipes
        startPos.current = { x: e.clientX, y: e.clientY };
        lastPos.current = { x: 0, y: 0 };
        lastTime.current = Date.now();
        velocity.current = { x: 0, y: 0 };
        const pointerId = e.pointerId;
        const target = e.currentTarget;

        // Start long-press timer
        pressTimer.current = setTimeout(() => {
            // Activate lanyard mode
            isLanyardModeRef.current = true;
            setIsLanyardMode(true);
            isDraggingRef.current = true;
            
            // Now capture pointer to handle the rest of the drag reliably
            try {
                target.setPointerCapture(pointerId);
            } catch (err) {}

            // Quick pulse feedback
            animate(cardY, 8, { duration: 0.08 }).then(() => animate(cardY, 0, { duration: 0.08 }));
        }, 220); // responsiveness
    }, [cardY]);

    const handlePointerMove = useCallback((e) => {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;

        // If moved before timer fires, cancel (it's a swipe for Stack)
        if (!isLanyardModeRef.current && pressTimer.current) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 8) {
                clearTimeout(pressTimer.current);
                pressTimer.current = null;
            }
            return; // Don't move card in non-lanyard mode
        }

        // In lanyard mode: move card
        if (isLanyardModeRef.current && isDraggingRef.current) {
            cardX.set(dx);
            cardY.set(dy);

            // Track velocity
            const now = Date.now();
            const dt = Math.max(now - lastTime.current, 1) / 1000;
            velocity.current = {
                x: (dx - lastPos.current.x) / dt,
                y: (dy - lastPos.current.y) / dt,
            };
            lastPos.current = { x: dx, y: dy };
            lastTime.current = now;
        }
    }, [cardX, cardY]);

    const handlePointerUp = useCallback((e) => {
        // Cancel timer
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }

        // Release pointer capture
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch (err) { }

        // Bounce back if we were dragging
        if (isLanyardModeRef.current && isDraggingRef.current) {
            isDraggingRef.current = false;

            const currentX = cardX.get();
            const currentY = cardY.get();
            const velX = velocity.current.x;
            const velY = velocity.current.y;

            // Overshoot in opposite direction
            const oX = Math.max(-100, Math.min(100, -currentX * 0.35 + velX * 0.015));
            const oY = Math.max(-60, Math.min(60, -currentY * 0.25 + velY * 0.01));

            // Bounce X
            const bx = async () => {
                await animate(cardX, oX, { type: "spring", stiffness: 400, damping: 18, velocity: velX * 0.3 });
                await animate(cardX, -oX * 0.4, { type: "spring", stiffness: 350, damping: 16 });
                await animate(cardX, oX * 0.15, { type: "spring", stiffness: 300, damping: 18 });
                await animate(cardX, 0, { type: "spring", stiffness: 250, damping: 22 });
            };

            // Bounce Y
            const by = async () => {
                await animate(cardY, oY, { type: "spring", stiffness: 400, damping: 18, velocity: velY * 0.3 });
                await animate(cardY, -oY * 0.3, { type: "spring", stiffness: 350, damping: 16 });
                await animate(cardY, 0, { type: "spring", stiffness: 250, damping: 22 });
            };

            bx();
            by();
        }

        // Reset mode
        isLanyardModeRef.current = false;
        setIsLanyardMode(false);
        velocity.current = { x: 0, y: 0 };
    }, [cardX, cardY]);

    return (
        <div
            className="relative flex flex-col items-center"
            style={{ paddingTop: 80, minHeight: 420 }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Dedicated Lanyard Handle (The "Pin") */}
            <div 
                className="absolute top-0 w-8 h-8 bg-gray-900 rounded-full cursor-grab active:cursor-grabbing z-50 flex items-center justify-center border-2 border-white/20 shadow-lg group"
                style={{ touchAction: "none" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:bg-white transition-colors" />
            </div>

            {/* Rope SVG */}
            <svg
                className="absolute top-0 left-0 pointer-events-none"
                width="260"
                height="420"
                style={{ overflow: "visible" }}
            >
                {/* Anchor */}
                <circle cx={130} cy={ropeAnchorY} r={6} fill="#333" stroke="#555" strokeWidth={2} />
                <circle cx={130} cy={ropeAnchorY} r={3} fill="#666" />

                {/* Rope */}
                <motion.path
                    d={ropePathD}
                    fill="none"
                    stroke={ropeColor}
                    strokeWidth={ropeWidth}
                    strokeLinecap="round"
                />

                {/* Card connection point - at card top-center */}
                <motion.g style={{ x: cardX, y: cardY }}>
                    <circle cx={130} cy={cardTopY} r={4} fill="none" stroke="#888" strokeWidth={2} />
                    <circle cx={130} cy={cardTopY} r={2} fill="#999" />
                </motion.g>
            </svg>

            {/* Card Container */}
            <motion.div
                style={{
                    x: cardX,
                    y: cardY,
                    rotate,
                    scale: isLanyardMode ? 1.04 : 1,
                    cursor: isLanyardMode ? "grabbing" : "grab",
                }}
                className="relative z-10"
                transition={{ scale: { duration: 0.15 } }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default Lanyard;
