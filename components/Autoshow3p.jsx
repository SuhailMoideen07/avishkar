'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(Flip, ScrollTrigger);
}

const ScrollFilterEffect = () => {
    const contentRefs = useRef([]);

    useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true
    });

    lenis.on('scroll', () => ScrollTrigger.update());

    const scrollFn = (time) => {
        lenis.raf(time);
        requestAnimationFrame(scrollFn);
    };
    requestAnimationFrame(scrollFn);

    // Add a small timeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
        // Initialize each content item
        contentRefs.current.forEach(element => {
            if (element) {
                initItem(element);
            }
        });
    }, 100); // 100ms delay

    return () => {
        clearTimeout(timeoutId);
        lenis.destroy();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
}, []);

    const initItem = (domEl) => {
      
        const titleWrap = domEl.querySelector('.title-wrap');
        const titleUp = titleWrap.querySelector('.title--up');
        const titleDown = titleWrap.querySelector('.title--down');
        const content = domEl.querySelectorAll('.content');
        const svg = domEl.querySelector('.content__img');
        const mask = svg.querySelector('.mask');
        const image = svg.querySelector('image');

        // Save current state
        const flipstate = Flip.getState([titleUp, titleDown]);

        // Change layout
        content[1].prepend(titleUp, titleDown);

        // Check if the mask element is a circle or a path
        const isCircle = mask.tagName.toLowerCase() === 'circle';

        // Create the Flip animation
        const flip = Flip.from(flipstate, {
            ease: 'none',
            simple: true
        })
            .fromTo(mask, {
                attr: isCircle ? { r: mask.getAttribute('r') } : { d: mask.getAttribute('d') },
            }, {
                ease: 'none',
                attr: isCircle ? { r: mask.dataset.valueFinal } : { d: mask.dataset.valueFinal },
            }, 0)
            .fromTo(image, {
                transformOrigin: '50% 50%',
                filter: 'brightness(100%)'
            }, {
                ease: 'none',
                scale: isCircle ? 1.2 : 1,
                filter: 'brightness(150%)'
            }, 0);

        ScrollTrigger.create({
            trigger: titleWrap,
            ease: 'none',
            start: 'clamp(top bottom-=10%)',
            end: '+=40%',
            scrub: true,
            animation: flip,
        });
    };

    const addToRefs = (el) => {
        if (el && !contentRefs.current.includes(el)) {
            contentRefs.current.push(el);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-10">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Bebas+Neue&display=swap');
        
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .content-wrap {
          display: grid;
          place-items: center;
          grid-template-areas: 'main';
        }

        .content {
          grid-area: main;
          display: grid;
          place-items: center;
          line-height: 1.2;
          grid-template-areas: 'content';
        }

        .content-wrap .content:first-child {
          height: 60vh;
        }

        .content--layout {
          grid-template-areas: 'title-up title-down' 
                              'img img'
                              'text text';
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .content__img {
          grid-area: img;
          max-width: 50%;
          height: auto;
        }

        .content__img--1 {
          aspect-ratio: 896/1344;
        }

        .content__img--5 {
          aspect-ratio: 680/920;
        }

        .content__img--6 {
          aspect-ratio: 1;
        }

        .title-wrap {
          display: flex;
          gap: 1em;
          align-items: center;
          justify-content: center;
        }

        .title {
          padding-top: 0.3em;
          line-height: 0.525;
          font-size: 2rem;
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 300;
          position: relative;
          z-index: 100;
          text-indent: -0.1em;
        }

        .title--up {
          grid-area: title-up;
          font-style: italic;
        }

        .title--down {
          grid-area: title-down;
          font-weight: 400;
        }

        .content__text {
          grid-area: text;
          text-transform: uppercase;
          margin: 0;
          opacity: 0.5;
          font-size: 0.9rem;
        }

        @media screen and (min-width: 53em) {
          .title {
            font-size: clamp(2rem, 15vw, 9rem);
          }

          .content-wrap:not(:last-child) {
            margin-bottom: 20vmax;
          }

          .content__img {
            max-width: none;
          }

          .content__img--1 {
            height: auto;
            width: 100%;
            max-width: 100%;
            max-height: 100vh;
          }

          .content__img--5 {
            height: auto;
            width: 100%;
            max-width: 100%;
            max-height: 100vh;
          }

          .content__img--6 {
            max-width: 100%;
          }

          .content--layout-1 {
            grid-template-areas: 'title-up img ...' 
                                'text img title-down';
            grid-template-columns: 30% auto 30%;
            grid-template-rows: 1fr 1fr;
            column-gap: 2vw;
          }

          .content--layout-1 .title--up {
            justify-self: end;
            align-self: start;
          }

          .content--layout-1 .title--down {
            justify-self: start;
            align-self: end;
          }

          .content--layout-1 .content__text {
            max-width: 250px;
            text-align: right;
            justify-self: end;
            align-self: end;
          }

          .content--layout-5 {
            grid-template-areas: 'title-up img ...' 
                                'text img title-down';
            grid-template-columns: 30% auto 30%;
            grid-template-rows: 1fr 1fr;
            column-gap: 3vw;
          }

          .content--layout-5 .title--up {
            justify-self: end;
            align-self: start;
          }

          .content--layout-5 .title--down {
            justify-self: start;
            align-self: end;
          }

          .content--layout-5 .content__text {
            max-width: 250px;
            text-align: right;
            justify-self: end;
            align-self: end;
          }

          .content--layout-6 {
            grid-template-areas: 'title-up img' 
                                'title-down img'
                                'text img';
            grid-template-columns: 1fr 50%;
            grid-template-rows: auto auto 1fr;
            column-gap: 3vw;
            row-gap: 0;
          }

          .content--layout-6 .title--up {
            justify-self: end;
            align-self: start;
          }

          .content--layout-6 .title--down {
            justify-self: end;
            align-self: start;
          }

          .content--layout-6 .content__text {
            max-width: 250px;
            justify-self: end;
            align-self: end;
            text-align: right;
          }
        }
        @media screen and (max-width: 52.99em) {
            .content--layout {
                grid-template-areas: 'title-up' 
                                    'title-down'
                                    'img'
                                    'text';
                grid-template-columns: 1fr;
            }
            
            .content--layout .title--up,
            .content--layout .title--down {
                justify-self: center;
            }
            }
      `}</style>

            {/* FootPrint Section */}


            <div className="content-wrap" ref={addToRefs}>
                <div className="content">
                    <div className="title-wrap">
                        <span className="title title--up">Joji</span>
                        <span className="title title--down">Thampi</span>
                    </div>
                </div>
                <div className="content content--layout content--layout-6">
                    <svg className="content__img content__img--6" width="1000" height="1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 1000">
                        <defs>
                            <filter id="displacementFilter6">
                                <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" result="displacement" scale="150" xChannelSelector="R" yChannelSelector="G" />
                                <feGaussianBlur in="displacement" stdDeviation="10" />
                            </filter>
                            <mask id="circleMask6">
                                <circle cx="50%" cy="50%" r="0" data-value-final="720" fill="white" className="mask" style={{ filter: 'url(#displacementFilter6)' }} />
                            </mask>
                        </defs>
                        <image xlinkHref="/images/pistonia/jojiDP.webp" width="1000" height="1000" mask="url(#circleMask6)" />
                    </svg>
                    <p className="content__text font-extrabold">Chief Guest</p>
                </div>
            </div>

            {/* NightFall Section */}
            <div className="content-wrap" ref={addToRefs}>
                <div className="content">
                    <div className="title-wrap">
                        <span className="title title--up">A R</span>
                        <span className="title title--down">shiva</span>
                    </div>
                </div>
                <div className="content content--layout content--layout-5">
                    <svg className="content__img content__img--5" width="680" height="920" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 680 920">
                        <defs>
                            <filter id="displacementFilter5">
                                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                            <mask id="circleMask5">
                                <circle cx="50%" cy="50%" r="0" data-value-final="580" fill="white" className="mask" style={{ filter: 'url(#displacementFilter5)' }} />
                            </mask>
                        </defs>
                        <image xlinkHref="/images/pistonia/abay.webp" width="680" height="920" mask="url(#circleMask5)" />
                    </svg>
                    <p className="content__text"></p>
                </div>
            </div>

            {/* FireStorm Section */}
            <div className="content-wrap" ref={addToRefs}>
                <div className="content">
                    <div className="title-wrap">
                        <span className="title title--up">AbinBabs</span>
                        <span className="title title--down">Abraham</span>
                    </div>
                </div>
                <div className="content content--layout content--layout-1">
                    <svg className="content__img content__img--1" width="896" height="1344" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 896 1344">
                        <defs>
                            <filter id="displacementFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                            <mask id="circleMask">
                                <circle cx="50%" cy="50%" r="0" data-value-final="820" fill="white" className="mask" style={{ filter: 'url(#displacementFilter)' }} />
                            </mask>
                        </defs>
                        <image xlinkHref="/images/pistonia/abin.webp" width="896" height="1344" mask="url(#circleMask)" />
                    </svg>
                    <p className="content__text"></p>
                </div>
            </div>
        </div>
    );
};

export default ScrollFilterEffect;