'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, ScrambleTextPlugin);
}

export default function ContactAnimation() {
  const logoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const textElements = document.querySelectorAll('.el');
      const logoEl = logoRef.current?.querySelector('span');

      if (!logoEl) {
        console.warn('Logo element not found');
        return;
      }

      // Cache original text
      const logoText = logoEl.textContent;

    // Store original text content
    textElements.forEach((el) => {
      el.dataset.text = el.textContent;
    });
    logoEl.dataset.text = logoText;

    // Reset function
    function resetTextElements() {
      textElements.forEach((el) => {
        gsap.set(el, {
          clearProps: 'all',
        });
      });
    }

    // FLIP animation setup
    function initFlips() {
      resetTextElements();

      textElements.forEach((el) => {
        const originalClass = [...el.classList].find((c) => c.startsWith('pos-'));
        const targetClass = el.dataset.altPos;
        const flipEase = el.dataset.flipEase || 'none';

        if (!targetClass) return;

        el.classList.add(targetClass);
        el.classList.remove(originalClass);

        const flipState = Flip.getState(el, {
          props: 'opacity, filter',
          simple: true,
        });

        el.classList.add(originalClass);
        el.classList.remove(targetClass);

        Flip.to(flipState, {
          ease: flipEase,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: 'bottom bottom-=10%',
            end: 'center center',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        
        Flip.from(flipState, {
          ease: flipEase,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: 'center center',
            end: 'top top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }

    // Scramble function
    const scrambleChars = 'upperAndLowerCase';

    function scramble(el, { duration, revealDelay = 0 } = {}) {
      const text = el.dataset.text ?? el.textContent;
      const finalDuration =
        duration ??
        (el.dataset.scrambleDuration ? parseFloat(el.dataset.scrambleDuration) : 1);

      gsap.killTweensOf(el);

      gsap.fromTo(
        el,
        { scrambleText: { text: '', chars: '' } },
        {
          scrambleText: {
            text,
            chars: scrambleChars,
            revealDelay,
            speed: 0.3,
          },
          duration: finalDuration,
          ease: 'none',
        }
      );
    }

    // Scramble ScrollTriggers setup
    function initScramble() {
      killScrambleTriggers();

      textElements.forEach((el) => {
        ScrollTrigger.create({
          id: 'scramble',
          trigger: el,
          start: 'top bottom-=100px',
          end: 'bottom top+=100px',
          once: false,
          onEnter: () => scramble(el),
          onEnterBack: () => scramble(el),
        });
      });

      scramble(logoEl, { revealDelay: 0.5 });
    }

    // Cleanup scramble triggers
    function killScrambleTriggers() {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id === 'scramble') {
          st.kill();
        }
      });
    }

    // Initialize
    initFlips();
    initScramble();

    // Resize handler
    const handleResize = () => {
      ScrollTrigger.refresh(true);
      initFlips();
      initScramble();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style jsx>{`
        .contact-animation-container {
          font-size: 13px;
          color: #fff;
          background-color: #000;
          font-family: -apple-system, BlinkMacSystemFont, 'Courier New', monospace;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-transform: uppercase;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .logo-fixed {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          position: fixed;
          left: 0;
          top: 0;
          font-size: clamp(2rem, 10vw, 4rem);
          font-family: 'Courier New', Courier, monospace;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .content {
          padding: 100vh 1.5rem 25vh;
        }

        .group {
          display: grid;
          margin-bottom: 10vh;
          display: flex;
          flex-direction: column;
          flex: 1 1 100px;
        }

        .el {
          white-space: nowrap;
          filter: blur(0px);
          text-transform: uppercase;
          opacity: 0.9;
          font-size: clamp(1.2rem, 3vw, 2.5rem);
          font-weight: 700;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
          position: relative;
        }

        .el.heading {
          font-size: clamp(1.8rem, 4vw, 3.5rem);
          font-weight: 900;
          opacity: 1;
          color: #EF4444;
          letter-spacing: 0.1em;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }

        .el--xl {
          font-size: clamp(2rem, 20vw, 15rem);
          opacity: 1;
          font-family: 'Courier New', Courier, monospace;
          font-weight: 700;
          letter-spacing: 0.05em;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .pos-1 {
          transform: translate3d(0, 0, 0);
        }

        .pos-2 {
          transform: translate3d(25vw, 0, 0);
        }

        .pos-3 {
          transform: translate3d(70vw, 0, 0);
        }

        .pos-4 {
          margin-left: auto;
        }

        .pos-5 {
          transform: translate3d(0, 200px, 0);
          opacity: 1;
        }

        .pos-6 {
          margin-left: auto;
          transform: translate3d(0, 200px, 0);
          opacity: 1;
        }

        .pos-7 {
          transform: translate3d(0, 200px, 0);
          opacity: 1;
          filter: blur(1.2px);
        }

        .pos-8 {
          transform: translate3d(25vw, 50px, 0);
          opacity: 1;
          filter: blur(2px);
        }

        .pos-9 {
          transform: translate3d(25vw, 250px, 0);
        }

        .pos-10 {
          transform: translate3d(70vw, 40vh, 0);
        }

        @keyframes blink-cursor {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .typing-indicator {
          display: inline-block;
          animation: blink-cursor 0.7s linear infinite;
          font-size: clamp(1.5rem, 3.5vw, 3rem);
        }
      `}</style>

      <div className="contact-animation-container h-full">
        <div className="logo-fixed" ref={logoRef}>
          <span>Contact Us</span>
        </div>

        <main id="smooth-content">
          <div className="content" ref={contentRef}>
            <div className="group">
              <div className="el heading pos-4" data-alt-pos="pos-2">
                Staff Convener
              </div>
            </div>

            <div className="group">
              <div className="el pos-1" data-alt-pos="pos-3">
                Dr Lijesh L
              </div>
              <div className="el pos-1" data-alt-pos="pos-3">
                9995791799
              </div>
            </div>

            <div className="group">
              <div
                className="el el--xl pos-1"
                data-alt-pos="pos-2"
                data-scramble-duration="2.5"
              >
                P
              </div>
            </div>

            <div className="group">
              <div className="el heading pos-4" data-alt-pos="pos-2">
                Main Coordinators
              </div>
              <div
                className="el pos-1 typing-indicator"
                data-alt-pos="pos-2"
                data-scramble-duration="0"
              >
                █
              </div>
            </div>

            <div className="group">
              <div className="el pos-2" data-alt-pos="pos-5">
                Ajin Babu M
              </div>
              <div className="el pos-2" data-alt-pos="pos-5">
                7510500415
              </div>
            </div>

            <div className="group">
              <div
                className="el el--xl pos-3"
                data-alt-pos="pos-9"
                data-scramble-duration="2.5"
              >
                O
              </div>
            </div>

            <div className="group">
              <div className="el pos-3" data-alt-pos="pos-2">
                Abith Asharaf
              </div>
              <div className="el pos-3" data-alt-pos="pos-2">
                8547981494
              </div>
            </div>


            <div className="group">
              <div className="el pos-2" data-alt-pos="pos-4">
                Arjun Shyju
              </div>
              <div className="el pos-2" data-alt-pos="pos-4">
                8590566118
              </div>
            </div>

            <div className="group">
              <div
                className="el el--xl pos-1"
                data-alt-pos="pos-3"
                data-scramble-duration="2.5"
              >
                O
              </div>
            </div>

            <div className="group">
              <div className="el pos-2" data-alt-pos="pos-9">
                Ambady Sunil
              </div>
              <div className="el pos-2" data-alt-pos="pos-9">
                7559973524
              </div>
            </div>

            <div className="group">
              <div
                className="el el--xl pos-3"
                data-alt-pos="pos-10"
                data-scramble-duration="2.5"
                data-flip-ease="expo.in"
              >
                L
              </div>
            </div>

            <div className="group">
               <div className="el pos-2" data-alt-pos="pos-4">
                Muhammed Yaseen
              </div>
               <div className="el pos-2" data-alt-pos="pos-4">
                6235735438
              </div>
            </div>


            <div className="group">
              <div className="el pos-3" data-alt-pos="pos-5">
                Nitheesh
              </div>
              <div className="el pos-3" data-alt-pos="pos-5">
                9567454886
              </div>
            </div>

            <div className="group">
              <div
                className="el el--xl pos-2"
                data-alt-pos="pos-3"
                data-scramble-duration="2.5"
              >
                .
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}