'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Image from 'next/image';



// Hero Section Component
const HeroSection = () => {
  return (
    <section className="sticky top-0 bg-black h-screen">
      <div className="relative flex justify-between items-end w-[99vw] h-screen">
        <div className="fixed inset-0 h-full z-0">
          <img
            src="/images/proshow/zeropause/landing.webp"
            alt=""
            className="w-full h-full object-cover brightness-[55%]"
            style={{ filter: 'brightness(55%)' }}
          />
        </div>
        <div className="fixed inset-0 flex flex-col justify-between items-stretch w-full h-screen px-[3.5vw] py-20 pb-10 text-white uppercase font-['Doner_Display',Arial,sans-serif] text-[12vw] leading-none z-0">
          <div className="overflow-hidden">
            <div className="overflow-hidden">
              <div className="relative" data-line>Zero</div>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="relative text-center flex justify-center items-center">
              <Image
                src='/images/proshow/zeropause/logo.webp'
                alt='logo'
                width={250}
                height={250}
              />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="relative text-right text-[#e6b8b8]" data-line>Pause</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Work Item Component
const WorkItem = ({ background, images, title, subtitle, colorClass }) => {
  return (
    <div className="relative flex items-stretch w-screen h-screen bg-black overflow-hidden" data-work="item">
      <div className="relative flex w-full h-full" data-work="item-container">
        <div
          className="absolute w-full h-full aspect-video"
          data-work="item-background"
          style={{ filter: 'brightness(1)' }}
        >
          <img src={background} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative flex flex-col flex-1 justify-around items-stretch w-full px-[4vw] py-20 pb-10 gap-4">
          <div className="absolute inset-x-0 inset-y-0 flex flex-row justify-center items-center w-full">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-[21vw] h-full max-[767px]:w-[35vw] max-[479px]:w-[45vw]"
                data-work="item-image"
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[4/5] w-[25vw] max-[767px]:w-[40vw] max-[479px]:w-[50vw] bg-white/75 p-[0.35em]"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
          <div className="relative flex flex-1 justify-between items-center w-full max-[479px]:flex-col max-[479px]:items-start max-[479px]:gap-8">
            <div className="relative flex flex-col flex-1 justify-between items-stretch h-full mx-auto text-white uppercase tracking-[0.5rem] font-['Doner_Display',Arial,sans-serif] text-[12.5vw] font-normal leading-none max-[479px]:text-[12.5vw]">
              <div className="overflow-hidden">
                <div className="relative" data-line>{title}</div>
              </div>
              <div className="overflow-hidden text-right">
                <div className="relative" data-line>
                  <span className={colorClass}>{subtitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 z-[99] w-[105%] h-[105%] bg-black opacity-0 pointer-events-none"
          data-work="item-overlay"
        />
      </div>
    </div>
  );
};

// Footer Section Component
const FooterSection = () => {
  return (
    <section className="sticky z-[1] bg-black">
      <div className="relative flex justify-between items-end w-[99vw] h-screen">
        <div className="absolute w-full h-full">
          <img
            src="/images/proshow/zeropause/landing5.webp"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative flex flex-col justify-between items-stretch w-full h-full px-[3.5vw] py-20 pb-10 text-white uppercase tracking-[0.5rem] font-['Doner_Display',Arial,sans-serif] text-[11.5vw] font-normal leading-none max-[479px]:text-[12.5vw]">
          <div className="overflow-hidden">
            <div data-line>
              <span className="text-[#e6b8b8]">A NIGHT</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="relative text-center">TO</div>
          </div>
          <div className="overflow-hidden">
            <div className="relative text-right" data-line>
              <span className="text-[#e6b8b8]">remember</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Component
export default function ScrollGSAPComponent() {
  const workSectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const workSection = workSectionRef.current;
    const workItems = workSection.querySelectorAll('[data-work="item"]');

    // Create ghost container and items for scroll tracking
    const ghostContainer = document.createElement('div');
    ghostContainer.className = 'relative';
    workSection.appendChild(ghostContainer);

    const ghostItems = Array.from(workItems).map(() => {
      const ghostItem = document.createElement('div');
      ghostItem.style.cssText = 'width: 100%; height: 300vh;';
      ghostContainer.appendChild(ghostItem);
      return ghostItem;
    });

    // Initial setup for work items
    gsap.set(workItems, {
      position: 'fixed',
      top: '0',
      clipPath: 'inset(0 0% 0 100%)',
    });

    // Animation configurations
    const getBaseScrollTrigger = ghostItem => ({
      trigger: ghostItem,
      scrub: true,
      start: 'top bottom',
      end: '+200vh top',
    });

    const getImageInitialPosition = (index, imageIndex) => {
      const positions = {
        0: {
          scale: 0.8,
          y: index % 2 === 0 ? '175vh' : '-120vh',
          rotateZ: index % 2 === 0 ? '-5deg' : '5deg',
          zIndex: index % 2 === 0 ? '3' : '1',
        },
        1: {
          scale: 0.8,
          y: index % 2 === 0 ? '-225vh' : '300vh',
          zIndex: index % 2 === 0 ? '1' : '3',
          rotateZ: index % 2 === 0 ? '5deg' : '-5deg',
        },
        2: {
          scale: 0.8,
          y: index % 2 === 0 ? '300vh' : '-120vh',
          zIndex: index % 2 === 0 ? '3' : '3',
          rotateZ: index % 2 === 0 ? '5deg' : '5deg',
        },
        3: {
          scale: 0.8,
          y: index % 2 === 0 ? '-100vh' : '175vh',
          zIndex: index % 2 === 0 ? '1' : '1',
          rotateZ: index % 2 === 0 ? '-5deg' : '-5deg',
        },
      };
      return positions[imageIndex];
    };

    const getImageFinalPosition = (index, imageIndex) => ({
      scale: 1,
      y:
        index % 2 === 0
          ? imageIndex % 2 === 0
            ? '2vh'
            : '-2vh'
          : imageIndex % 2 === 0
            ? '-2vh'
            : '2vh',
      rotateZ:
        index % 2 === 0
          ? imageIndex % 2 === 0
            ? '2.5deg'
            : '-2.5deg'
          : imageIndex % 2 === 0
            ? '-2.5deg'
            : '2.5deg',
    });

    // Process each work item
    workItems.forEach((element, index) => {
      const lines = element.querySelectorAll('[data-line]');
      const itemBackground = element.querySelector('[data-work="item-background"]');
      const itemContainer = element.querySelector('[data-work="item-container"]');
      const itemOverlay = element.querySelectorAll('[data-work="item-overlay"]');
      const itemImages = gsap.utils.toArray(
        element.querySelectorAll('[data-work="item-image"]')
      );

      // Initial states
      gsap.set(itemBackground, { scale: 1.2 });
      gsap.set(itemContainer, { xPercent: 40 });

      // Base animations
      gsap.to(element, {
        clipPath: 'inset(0 0 0 0%)',
        scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
      });
      gsap.to(itemContainer, {
        xPercent: 0,
        scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
      });
      gsap.to(itemBackground, {
        scale: 1,
        scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
      });

      // Text animations
      [0, 1].forEach(i => {
        gsap.set(lines[i], {
          zIndex: 2,
          opacity: 0.9,
        });
        gsap.from(lines[i], {
          opacity: i === 0 ? 0.95 : 0.5,
          yPercent: i === 0 ? 125 : -125,
          ease: 'power2.inOut',
          duration: 1.25,
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: '-25% top',
            end: '15% top',
            toggleActions: 'play reverse restart reverse',
          },
        });
      });

      // Image animations
      itemImages.forEach((image, imageIndex) => {
        gsap.set(image, getImageInitialPosition(index, imageIndex));
        gsap.to(image, {
          ...getImageFinalPosition(index, imageIndex),
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: '5% top',
            end: '50% top',
          },
        });
      });

      // Background and final animations
      gsap.to(itemBackground, {
        filter: 'brightness(0.2) blur(7.5px)',
        scrollTrigger: {
          trigger: ghostItems[index],
          scrub: true,
          start: '20% top',
          end: '55% top',
        },
      });

      gsap.to(element, {
        xPercent: index === workItems.length - 1 ? 0 : -40,
        yPercent: index === workItems.length - 1 ? -40 : 0,
        scrollTrigger: {
          trigger: ghostItems[index],
          scrub: true,
          start: '100% bottom',
          toggleActions: 'play reverse play reverse',
        },
      });

      gsap.to(itemOverlay, {
        opacity: 0.85,
        scrollTrigger: {
          trigger: ghostItems[index],
          scrub: true,
          start: '100% bottom',
          toggleActions: 'play reverse play reverse',
        },
      });
    });

    // Initialize smooth scrolling
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.05,
      wheelMultiplier: 0.7,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      lenis.destroy();
    };
  }, []);

  const workItemsData = [
    {
      background: '/images/proshow/zeropause/landing2.webp',
      images: [
        '/images/proshow/zeropause/l2 (4).webp',
        '/images/proshow/zeropause/l2 (1).webp',
        '/images/proshow/zeropause/l2 (3).webp',
        '/images/proshow/zeropause/l2 (2).webp',
      ],
      title: 'Musaliar',
      subtitle: 'college',
      colorClass: 'text-[#7ABECD]',
    },
    {
      background: '/images/proshow/zeropause/landing3.webp',
      images: [
        '/images/proshow/zeropause/l3 (1).webp',
        '/images/proshow/zeropause/l3 (2).webp',
        '/images/proshow/zeropause/l3 (3).webp',
        '/images/proshow/zeropause/l3 (4).webp',
      ],
      title: 'Feb-7',
      subtitle: '2026',
      colorClass: 'text-[#FBD16E]',
    },
    {
      background: '/images/proshow/zeropause/landing4.webp',
      images: [
        '/images/proshow/zeropause/l4 (1).webp',
        '/images/proshow/zeropause/l4 (3).webp',
        '/images/proshow/zeropause/l4 (2).webp',
        '/images/proshow/zeropause/l4 (4).webp',
      ],
      title: 'saturday',
      subtitle: '6:30pm',
      colorClass: 'text-[#FDA2FD]',
    },
  ];

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'Doner Display';
          src: url('https://moussamamadou.github.io/scroll-trigger-gsap-gently/fonts/Doner-RegularTextItalic.otf') format('opentype');
          font-weight: 400;
          font-style: italic;
          font-display: swap;
        }
        @font-face {
          font-family: 'Doner';
          src: url('https://moussamamadou.github.io/scroll-trigger-gsap-gently/fonts/Doner-RegularDisplayItalic.otf') format('opentype');
          font-weight: 400;
          font-style: italic;
          font-display: swap;
        }
        @font-face {
          font-family: 'Doner';
          src: url('https://moussamamadou.github.io/scroll-trigger-gsap-gently/fonts/Doner-RegularText.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Doner Display';
          src: url('https://moussamamadou.github.io/scroll-trigger-gsap-gently/fonts/Doner-RegularDisplay.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        body {
          background-color: #001;
          overflow-x: hidden;
        }
      `}</style>

      <div className="overflow-x-hidden bg-[#000]">
        <HeroSection />
        <section className="relative" ref={workSectionRef} data-work="section">
          <div className="relative">
            {workItemsData.map((item, index) => (
              <WorkItem key={index} {...item} />
            ))}
          </div>
        </section>
        <FooterSection />
      </div>
    </>
  );
}