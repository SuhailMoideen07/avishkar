'use client'
import { GridScan } from '@/components/GridScan';
import Shuffle from '@/components/Shuffle';
import StaggeredMenu from '@/components/StaggeredMenu';
import { pressStart2P } from '@/lib/fonts';
import Image from 'next/image';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import dynamic from "next/dynamic"
const DecayCard = dynamic(
  () => import("@/components/DecayCard"),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger, useGSAP);

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Events', ariaLabel: 'View our events', link: '/events' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Website', link: 'https://musaliarcollege.com/' },
];

export default function Home() {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);

  useGSAP(() => {
    const images = imagesRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    images.forEach((img, index) => {
      // Initial state: Off-screen bottom, full size
      gsap.set(img, {
        yPercent: 100,
        scale: 1,
        opacity: 1,
        filter: "blur(0px) brightness(1)"
      });

      // 1. Slide In to Center from bottom
      tl.to(img, {
        yPercent: 0,
        duration: 1,
        ease: "power2.out"
      }, index === 0 ? 0 : "-=0.5");

      // 2. Recede into Depth (shrink, move up slightly, fade and blur)
      if (index < images.length) {
        tl.to(img, {
          scale: 0.3,
          // yPercent: -25,
          opacity: 0,
          filter: "blur(8px) brightness(0.4)",
          duration: 1.5,
          ease: "power1.inOut"
        }, ">-0.3");
      }
    });
  }, { scope: containerRef });

  return (
    <section className='relative text-[#FED700] w-full overflow-x-hidden'>
      <div className='fixed inset-0 -z-10 bg-black' >
        <GridScan
          sensitivity={0.75}
          lineThickness={1}
          linesColor="#FFF800"
          gridScale={0.15}
          scanColor="#FFF800"
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
      <div className='h-[100dvh] fixed inset-0 z-20 '>
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#000000"
          changeMenuColorOnOpen={true}
          colors={['#FFFFE0', '#FFF800']}
          logoUrl="/images/star.svg"
          accentColor="#FFF800"
          onMenuOpen={() => console.log('Menu opened')}
          onMenuClose={() => console.log('Menu closed')}
        />
      </div>
      <div className="relative h-screen flex justify-center items-center overflow-hidden">
        <Image src='/images/star.svg' alt='star1' width={60} height={60} className='absolute top-40 right-10' />
        <Image src='/images/star.svg' alt='star2' width={100} height={100} className='absolute top-3/5 -right-10' />
        <Image src='/images/star.svg' alt='star3' width={180} height={180} className='absolute top-2/6 -left-32 -translate-y-1/2 rotate-45' />
        <Image src='/images/star.svg' alt='star4' width={50} height={50} className='absolute bottom-32 right-20 rotate-90' />
        <Image src='/images/star.svg' alt='star5' width={120} height={120} className='absolute bottom-40 left-10 -rotate-12' />
        <div className="">
        <Shuffle
          className={`${pressStart2P.className} `}
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
        <h3 className={`${pressStart2P.className} text-lg `}>2026</h3>
        </div>
      </div>

      {/* Cinematic Image Sequence Section */}
      <div
        ref={containerRef}
        className="relative h-screen w-full flex justify-center items-center overflow-hidden bg-transparent"
      >
        <div className="relative w-full h-full flex justify-center items-center">
          {[1, 2, 3].map((num, i) => (
            <div
              key={num}
              ref={(el) => (imagesRef.current[i] = el)}
              className="absolute w-full h-full flex justify-center items-center px-4"
              style={{ zIndex: 10 + i }}
            >
              <div className="relative w-full max-w-2xl aspect-square">
                <Image
                  src={`/images/event (${num}).png`}
                  alt={`event-${num}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer for scroll depth */}
      <div className="h-screen" />
    </section>
  );
}