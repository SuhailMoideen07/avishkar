'use client'

import { GridScan } from '@/components/GridScan';
import ScrollMorphComponent from '@/components/HorozontalScroll';
import { Skiper67 } from '@/components/ui/skiper-ui/skiper67';
import { pressStart2P } from '@/lib/fonts';
import Image from 'next/image';
import { useRef, useEffect, useLayoutEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Page = () => {
  const starsRef = useRef([]);
  const heroRef = useRef(null);
  const router = useRouter();

  useLayoutEffect(() => {
    // Force scroll to top immediately on mount (before paint)
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    // Additional scroll to top after mount
    window.scrollTo(0, 0);
    
    // Set scroll restoration to manual to prevent Next.js from restoring scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      // Clean up
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  useGSAP(() => {
    starsRef.current.forEach((star, i) => {
      const speed = (i + 1) * 100;
      gsap.to(star, {
        y: -speed,
        ease: "none",
        scrollTrigger: {
          trigger: star,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    ScrollTrigger.config({ ignoreMobileResize: false });
    ScrollTrigger.refresh();
  }, { scope: heroRef });

  return (
    <>

      <section className='relative text-[#AD242C] w-full'>
        <div className='fixed inset-0 -z-10 bg-black pointer-events-auto'>
          <GridScan
            sensitivity={0.75}
            lineThickness={1}
            linesColor="#AD242C"
            gridScale={0.15}
            scanColor="#AD242C"
            scanOpacity={0.5}
            enablePost={true}
            enableGyro={true}
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
            scanDirection='forward'
            scanDelay={2}
            enableWebcam={false}
            scanGlow={0.25}
            />
            </div>

        {/* Hero Section with Stars and Shuffle */}
        <div ref={heroRef} className="relative h-[100lvh] flex justify-center items-center overflow-hidden pointer-events-none">
          <Image
            ref={el => (starsRef.current[0] = el)}
            src="/images/star.svg"
            alt="star1"
            width={60}
            height={60}
            className="absolute top-40 right-10"
          />

          <Image
            ref={el => (starsRef.current[1] = el)}
            src="/images/star.svg"
            alt="star2"
            width={90}
            height={90}
            className="absolute top-[60%] -right-10"
          />

          <Image
            ref={el => (starsRef.current[2] = el)}
            src="/images/star.svg"
            alt="star3"
            width={180}
            height={180}
            className="absolute top-[33%] -left-32 rotate-45"
          />

          <Image
            ref={el => (starsRef.current[3] = el)}
            src="/images/star.svg"
            alt="star4"
            width={50}
            height={50}
            className="absolute bottom-10 right-60 rotate-12"
          />

          <Image
            ref={el => (starsRef.current[4] = el)}
            src="/images/star.svg"
            alt="star5"
            width={120}
            height={120}
            className="absolute bottom-40 left-10 -rotate-12"
          />

          <Image
            ref={el => (starsRef.current[5] = el)}
            src="/images/star.svg"
            alt="star6"
            width={105}
            height={105}
            className="absolute top-[80%] left-[60%] -rotate-45"
          />

          <div className="flex flex-col items-center">
            <Image
              className='z-10'
              src='/images/logoName.PNG'
              alt='logo'
              width={400}
              height={400}
            />
            <h3 className={`${pressStart2P.className} text-xl drop-shadow-[2px_2px_0px_#000] drop-shadow-[#f87f85] text-center`}>FEB 5,6,7 <br />2026</h3>
          </div>
        </div>
        <ScrollMorphComponent />

        <Skiper67 />
      </section>
    </>
  );
};

export default Page;