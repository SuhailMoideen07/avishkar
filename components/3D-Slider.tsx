import React, { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SliderItemData { 
    imageUrl: string;
    data?: any;
}

interface ThreeDSliderProps {
    items: SliderItemData[];
    speedWheel?: number;
    speedDrag?: number;
    containerStyle?: CSSProperties;
    onItemClick?: (item: SliderItemData, index: number) => void;
}

const getZindex = (length: number, activeIndex: number): number[] => {
    return Array.from({ length }).map((_, i) =>
        (activeIndex === i) ? length : length - Math.abs(activeIndex - i)
    );
};

interface SliderItemProps {
    item: SliderItemData;
    index: number;
    length: number;
    active: number;
    zIndex: number;
    onClick: () => void;
}

const SliderItem: React.FC<SliderItemProps> = ({ item, index, length, active, zIndex, onClick }) => {
    const denominator = length > 1 ? length - 1 : 1; 
    const activeRatio = (index - active) / denominator;

    const x = activeRatio * 400;
    const y = activeRatio * 100;
    const rotate = activeRatio * 60;
    const opacity = (zIndex / length) * 3 - 2;

    const motionStyle = {
        x: `${x}%`,
        y: `${y}%`,
        rotate: `${rotate}deg`,
        zIndex: zIndex,
    };

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 cursor-pointer select-none rounded-xl shadow-2xl transform-origin-[0%_100%] pointer-events-auto w-[var(--width)] h-[var(--height)] -mt-[calc(var(--height)/2)] -ml-[calc(var(--width)/2)] overflow-hidden"
            style={{ '--width': 'clamp(300px, 50vw, 600px)', '--height': 'clamp(400px, 60vw, 800px)' } as CSSProperties & { [key: string]: any }}
            initial={false}
            animate={motionStyle}
            transition={{ duration: 0.8, ease: [0, 0.02, 0, 1] }}
            onClick={onClick}
        >
            <div className="absolute inset-0 z-10 transition-opacity duration-800 ease-[cubic-bezier(0,0.02,0,1)]" style={{ opacity: opacity }}>
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent via-50% to-black/50"></div>
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover pointer-events-none" />
            </div>
        </motion.div>
    );
};

const ThreeDSlider: React.FC<ThreeDSliderProps> = ({ items, speedWheel = 0.02, speedDrag = -0.1, containerStyle = {}, onItemClick }) => {
    const [progress, setProgress] = useState(50);
    const [isDown, setIsDown] = useState(false);
    const startXRef = useRef(0);

    const numItems = items.length;
    const clampedProgress = Math.max(0, Math.min(progress, 100));
    const active = Math.floor(clampedProgress / 100 * (numItems - 1));
    const zIndices = getZindex(numItems, active);

    const handleWheel = useCallback((e: WheelEvent) => {
        const wheelProgress = e.deltaY * speedWheel;
        setProgress(p => p + wheelProgress);
    }, [speedWheel]);

    const getClientX = (e: MouseEvent | TouchEvent): number | null => {
        if ('touches' in e && e.touches.length > 0) return e.touches[0].clientX;
        if ('clientX' in e) return e.clientX;
        return null;
    };

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDown) return;
        const clientX = getClientX(e);
        if (clientX === null) return;
        const mouseProgress = (clientX - startXRef.current) * speedDrag;
        setProgress(p => p + mouseProgress);
        startXRef.current = clientX;
    }, [isDown, speedDrag]);

    const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
        setIsDown(true);
        const clientX = getClientX(e);
        if (clientX !== null) startXRef.current = clientX;
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDown(false);
    }, []);

    const handleItemClick = useCallback((item: SliderItemData, index: number) => {
        const denominator = numItems > 1 ? numItems - 1 : 1;
        const newProgress = (index / denominator) * 100;
        setProgress(newProgress);
        if (onItemClick) onItemClick(item, index);
    }, [numItems, onItemClick]);

    useEffect(() => {
        document.addEventListener('wheel', handleWheel);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchstart', handleMouseDown);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('wheel', handleWheel);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

    return (
        <div className="relative w-full h-screen overflow-hidden" style={containerStyle}>
            <div className="relative z-10 h-full overflow-hidden pointer-events-none w-full flex items-center justify-center">
                <AnimatePresence>
                    {items.map((item, index) => (
                        <SliderItem
                            key={index}
                            item={item}
                            index={index}
                            length={numItems}
                            active={active}
                            zIndex={zIndices[index]}
                            onClick={() => handleItemClick(item, index)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ThreeDSlider;
