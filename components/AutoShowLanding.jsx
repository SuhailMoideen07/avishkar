'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export default function ParallaxComponent() {
  const parallaxLayersRef = useRef(null);

  useEffect(() => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Lenis Smooth Scroll
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Parallax Layers Animation
    if (parallaxLayersRef.current) {
      const triggerElement = parallaxLayersRef.current;
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @font-face {
          font-family: 'PP Neue Corp Wide';
          src: url('https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717e399d30a606fed425914_PPNeueCorp-WideUltrabold.woff2') format('woff2');
          font-weight: 800;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'PP Neue Montreal';
          src: url('https://cdn.prod.website-files.com/6819ed8312518f61b84824df/6819ed8312518f61b84825ba_PPNeueMontreal-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div className="relative w-full overflow-hidden">
        {/* Parallax Header Section */}
        <section className="relative min-h-screen flex items-center justify-center py-20 px-8 z-[2]">
          <div className="absolute top-0 left-0 w-full h-[120%] object-cover">
            {/* Black Line Overflow */}
            <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-black z-[20]"></div>
            
            {/* Parallax Layers */}
            <div 
              ref={parallaxLayersRef}
              data-parallax-layers
              className="absolute top-0 left-0 w-full h-full object-cover overflow-hidden"
            >
              <img 
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp"
                loading="eager"
                width={800}
                data-parallax-layer="1"
                alt=""
                className="pointer-events-none object-cover w-full max-w-none h-[117.5%] absolute top-[-17.5%] left-0"
              />
              <img 
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp"
                loading="eager"
                width={800}
                data-parallax-layer="2"
                alt=""
                className="pointer-events-none object-cover w-full max-w-none h-[117.5%] absolute top-[-17.5%] left-0"
              />
              <div 
                data-parallax-layer="3"
                className="absolute top-0 left-0 w-full h-screen flex items-center justify-center"
              >
                <h2 
                  className="pointer-events-auto text-center m-0 relative text-[#520504] "
                  style={{
                    fontFamily: 'PP Neue Corp Wide, sans-serif',
                    fontSize: '11vw',
                    fontWeight: 800,
                    lineHeight: 1,
                    textTransform: 'none',
                    marginBottom: '.1em',
                    marginRight: '.075em'
                  }}
                >
                  Pistonia
                </h2>
              </div>
              <img 
                src="/images/pistonia/landing.webp"
                loading="eager"
                width={800}
                data-parallax-layer="4"
                alt=""
                className="pointer-events-none object-cover w-full max-w-none h-[117.5%] absolute top-[-17.5%] left-0"
              />
            </div>

            {/* Fade Gradient */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[20%] object-cover z-[30]"
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.738) 19%, rgba(0, 0, 0, 0.541) 34%, rgba(0, 0, 0, 0.382) 47%, rgba(0, 0, 0, 0.278) 56.5%, rgba(0, 0, 0, 0.194) 65%, rgba(0, 0, 0, 0.126) 73%, rgba(0, 0, 0, 0.075) 80.2%, rgba(0, 0, 0, 0.042) 86.1%, rgba(0, 0, 0, 0.021) 91%, rgba(0, 0, 0, 0.008) 95.2%, rgba(0, 0, 0, 0.002) 98.2%, transparent 100%)'
              }}
            ></div>
          </div>
        </section>

        {/* Content Section */}
        {/* <section className="relative min-h-screen flex items-center justify-center py-20 px-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="100%" 
            viewBox="0 0 160 160" 
            fill="none" 
            className="relative"
            style={{ width: '8em' }}
          >
            <path 
              d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" 
              fill="currentColor"
            />
          </svg>
        </section> */}

        {/* Radial Gradient Overlay */}
        <div 
          className="fixed inset-0 pointer-events-none z-[10]"
          style={{
            backgroundImage: 'radial-gradient(circle farthest-corner at 50% 50%, transparent, #000000)',
            opacity: 0.1,
            mixBlendMode: 'multiply'
          }}
        ></div>
      </div>
    </>
  );
}