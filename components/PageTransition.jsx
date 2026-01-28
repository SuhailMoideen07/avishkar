'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import anime from 'animejs/lib/anime.es.js';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  // Configuration for the slice animation
  const slicesTotal = 6;
  const slicesColor = '#111';
  const orientation = 'vertical'; // 'vertical' or 'horizontal'
  const slicesOrigin = { show: 'bottom', hide: 'bottom' }; // 'bottom' | 'top' for vertical, 'right' | 'left' for horizontal

  useEffect(() => {
    if (isAnimating) return;

    setIsAnimating(true);

    const sliceElements = document.querySelectorAll('.transition-slice');
    
    anime.remove(sliceElements);

    // Animate IN - slices cover the screen
    const coverAnimation = anime({
      targets: sliceElements,
      duration: 800,
      delay: (_el, i) => i * 80,
      easing: 'easeInOutQuart',
      translateX: orientation === 'vertical' ? '0%' : 
                  slicesOrigin.show === 'right' ? ['100%', '0%'] : ['-100%', '0%'],
      translateY: orientation === 'vertical' ? 
                  slicesOrigin.show === 'bottom' ? ['100%', '0%'] : ['-100%', '0%']
                  : '0%'
    });

    coverAnimation.finished.then(() => {
      // Update the content while screen is covered
      setDisplayChildren(children);

      // Small delay before reveal animation
      setTimeout(() => {
        const newSliceElements = document.querySelectorAll('.transition-slice');
        
        anime.remove(newSliceElements);

        // Animate OUT - slices reveal the new page
        const revealAnimation = anime({
          targets: newSliceElements,
          duration: 800,
          delay: (_el, i) => i * 80,
          easing: 'easeInOutQuart',
          translateX: orientation === 'vertical' ? '0%' : 
                      slicesOrigin.hide === 'right' ? ['0%', '100%'] : ['0%', '-100%'],
          translateY: orientation === 'vertical' ? 
                      slicesOrigin.hide === 'bottom' ? ['0%', '100%'] : ['0%', '-100%']
                      : '0%'
        });

        revealAnimation.finished.then(() => {
          setIsAnimating(false);
        });
      }, 50);
    });
  }, [pathname]);

  return (
    <>
      {/* Transition Slices Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'row' : 'column'
        }}
      >
        {Array.from({ length: slicesTotal }).map((_, i) => (
          <div
            key={i}
            className="transition-slice flex-1"
            style={{
              backgroundColor: slicesColor,
              transform: orientation === 'vertical' 
                ? (slicesOrigin.show === 'bottom' ? 'translateY(100%)' : 'translateY(-100%)')
                : (slicesOrigin.show === 'right' ? 'translateX(100%)' : 'translateX(-100%)'),
              boxShadow: orientation === 'vertical' 
                ? `1px 0 0 ${slicesColor}` 
                : `0 1px 0 ${slicesColor}`
            }}
          />
        ))}
      </div>

      {/* Page Content */}
      <div className="relative">
        {displayChildren}
      </div>
    </>
  );
}