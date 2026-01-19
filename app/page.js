'use client'

import { GridScan } from '@/components/GridScan';
import HorizontalScrollCarousel from '@/components/HorozontalScroll';
import { SmoothScrollHero } from '@/components/SmoothHero';
import { Skiper67 } from '@/components/ui/skiper-ui/skiper67';
import Shuffle from '@/components/Shuffle';
import { pressStart2P } from '@/lib/fonts';
import Image from 'next/image';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Page = () => {
  const starsRef = useRef([]);
  const heroRef = useRef(null);

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
    <section className='relative text-[#AD242C] w-full'>
      <div className='fixed inset-0 -z-10 bg-black'>
        <GridScan
          sensitivity={0.75}
          lineThickness={1}
          linesColor="#AD242C"
          gridScale={0.15}
          scanColor="#AD242C"
          scanOpacity={0.5}
          enablePost={false}
          enableGyro={true}
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          scanDirection='forward'
          scanDelay={2}
          enableWebcam={false}
        />
      </div>

      {/* Hero Section with Stars and Shuffle */}
      <div ref={heroRef} className="relative h-[100dvh] flex justify-center items-center overflow-hidden">
        {/* Star 1 */}
        <Image
          ref={el => (starsRef.current[0] = el)}
          src="/images/star.svg"
          alt="star1"
          width={60}
          height={60}
          className="absolute top-40 right-10"
        />

        {/* Star 2 */}
        <Image
          ref={el => (starsRef.current[1] = el)}
          src="/images/star.svg"
          alt="star2"
          width={90}
          height={90}
          className="absolute top-[60%] -right-10"
        />

        {/* Star 3 */}
        <Image
          ref={el => (starsRef.current[2] = el)}
          src="/images/star.svg"
          alt="star3"
          width={180}
          height={180}
          className="absolute top-[33%] -left-32 rotate-45"
        />

        {/* Star 4 */}
        <Image
          ref={el => (starsRef.current[3] = el)}
          src="/images/star.svg"
          alt="star4"
          width={50}
          height={50}
          className="absolute bottom-10 right-60 rotate-12"
        />

        {/* Star 5 */}
        <Image
          ref={el => (starsRef.current[4] = el)}
          src="/images/star.svg"
          alt="star5"
          width={120}
          height={120}
          className="absolute bottom-40 left-10 -rotate-12"
        />

        {/* Star 6 */}
        <Image
          ref={el => (starsRef.current[5] = el)}
          src="/images/star.svg"
          alt="star6"
          width={105}
          height={105}
          className="absolute top-[80%] left-[60%] -rotate-45"
        />

        <div className="">
          <Shuffle
            className={`${pressStart2P.className}`}
            text="Avishkar"
            shuffleDirection="right"
            duration={0.45}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
            loop
            loopDelay={3}
          />
          <h3 className={`${pressStart2P.className} text-lg`}>2026</h3>
        </div>
      </div>

      <HorizontalScrollCarousel />
      <Skiper67 />
    </section>
  );
};

export default Page;