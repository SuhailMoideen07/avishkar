import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SlicedImageReveal - Middle-Out Expansion with Scroll Flip
 */
const SlicedImageReveal = ({ imageUrl, revealImageUrl, slicesCount = 7 }) => {
  const containerRef = useRef(null);
  const slicesRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state: Hidden and scaled down
      gsap.set(slicesRef.current, { 
        scaleY: 0, 
        opacity: 0,
        transformOrigin: 'center center',
        rotationY: 0
      });

      // Set initial zoom state for container
      gsap.set(containerRef.current, {
        scale: 0.85
      });

      // Timeline for reveal + zoom
      const tl = gsap.timeline();

      // Animation: Reveal from center outwards
      tl.to(slicesRef.current, {
        scaleY: 1,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: {
          each: 0.1,
          from: 'center'
        }
      })
      // Zoom in effect after reveal completes
      .to(containerRef.current, {
        scale: 1,
        duration: 0.8,
        ease: 'power4.inOut'
      }, '+=0.2')
      .call(() => {
        // Create flip animation on scroll after reveal completes
        slicesRef.current.forEach((slice, i) => {
          if (!slice) return;

          // Store the initial progress when ScrollTrigger is created
          let initialProgress = null;

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            onUpdate: (self) => {
              // Capture initial progress on first update
              if (initialProgress === null) {
                initialProgress = self.progress;
              }

              // Calculate progress relative to when animation started
              const relativeProgress = Math.max(0, (self.progress - initialProgress) / (1 - initialProgress));
              const delay = i / slicesCount;
              const sliceProgress = Math.max(0, (relativeProgress - delay) / (1 - delay));
              gsap.set(slice, { rotationY: Math.min(sliceProgress, 1) * 180 });
            }
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [slicesCount]);   

  const slices = Array.from({ length: slicesCount });

  return (
    <div 
      ref={containerRef}
      className="relative aspect-[3/4] w-full max-w-4xl mx-auto flex gap-1 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {slices.map((_, i) => (
        <div
          key={i}
          ref={(el) => (slicesRef.current[i] = el)}
          className="relative h-full flex-1"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${slicesCount * 100}% auto`,
              backgroundPosition: `${(i * 100) / (slicesCount - 1)}% center`,
              backgroundRepeat: 'no-repeat',
              borderRadius: '14px',
              backfaceVisibility: 'hidden'
            }}
          />
          
          {/* Back face */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${revealImageUrl})`,
              backgroundSize: `${slicesCount * 100}% auto`,
              backgroundPosition: `${(i * 100) / (slicesCount - 1)}% center`,
              backgroundRepeat: 'no-repeat',
              borderRadius: '14px',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SlicedImageReveal;