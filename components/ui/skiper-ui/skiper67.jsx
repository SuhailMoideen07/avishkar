"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Plus } from "lucide-react";
import {
  MediaControlBar,
  MediaController, MediaMuteButton,
  MediaPlayButton,
  MediaTimeRange,
} from "media-chrome/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export const Skiper67 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const openVideo = contextSafe(() => {
    setIsOpen(true);
    // Animation is triggered via useGSAP dependency array below
  });

  const closeVideo = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsOpen(false),
    });

    tl.to(modalRef.current, {
      clipPath: "inset(43.5% 43.5% 33.5% 43.5%)",
      opacity: 0,
      duration: 0.6, ease: "power3.inOut",
    }).to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
    }, "-=0.3");
  });

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 });
      gsap.fromTo(modalRef.current,
        { clipPath: "inset(43.5% 43.5% 33.5% 43.5%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.8, ease: "power4.out" });
    }
  }, [isOpen]);

  return (
    <section ref={containerRef} className="relative flex h-screen w-full items-center justify-center bg-[#f5f4f3] overflow-hidden">
      <div className="absolute top-1/4 flex flex-col items-center gap-6 text-center">
        <span className="relative max-w-[22ch] text-[10px] sm:text-xs uppercase tracking-widest opacity-90 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-foreground after:to-transparent after:mt-4">
          Here’s how we did it last year.
        </span>
      </div>      {/* Video Preview Trigger */}
      <div
        onClick={openVideo}
        className="relative group cursor-pointer w-[280px] aspect-video sm:w-[400px] overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 z-20 flex items-center justify-center text-white mix-blend-exclusion transition-transform duration-300 group-hover:scale-110">
          <Play className="size-5 sm:size-6 fill-current mr-2" />
          <span className="text-sm font-medium uppercase tracking-tighter">Play</span>
        </div>
        <video autoPlay muted playsInline loop className="h-full w-full object-cover">
          <source src="/videos/hero.mp4" />
        </video>
      </div>

      {/* Modal Portal-like logic */}
      {isOpen && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8">
          <div
            ref={overlayRef}
            onClick={closeVideo}
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          />

          <div
            ref={modalRef}
            className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl overflow-hidden"
          >
            <MediaController className="w-full h-full">
              <video
                slot="media"
                src="/videos/hero.mp4"
                autoPlay
                className="w-full h-full object-contain"
              />

              <button
                onClick={closeVideo}
                className="absolute right-4 top-4 z-50 p-2  transition-colors"
              >
                <Plus className="size-4 rotate-45 text-white" />
              </button>

              <MediaControlBar className="absolute bottom-0 left-0 right-0 flex items-center gap-4 px-4 py-4 bg-gradient-to-t from-black/60 to-transparent">
                <MediaPlayButton className="w-6 h-6 bg-transparent hover:scale-110 transition-transform" />
                <MediaTimeRange className="flex-1 [--media-range-track-height:2px] [--media-range-thumb-size:12px]" />
                <MediaMuteButton className="w-6 h-6 bg-transparent" />
              </MediaControlBar>
            </MediaController>
          </div>
        </div>
      )}
    </section>
  );
};