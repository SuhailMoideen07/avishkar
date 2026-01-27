'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SplitText } from 'gsap/dist/SplitText';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText);
}

const ThreeDCarousel = () => {
    const smoothContentRef = useRef(null);
    const splitMapRef = useRef(new Map());

    const carouselData = [
        {
            title: 'LANCER_EVO_6',
            images: [
                '/images/pistonia/cars/lancer1-1.webp',
                '/images/pistonia/cars/car-1.webp',
                '/images/pistonia/cars/lancer1-3.webp',
                '/images/pistonia/cars/lancer1-2.webp',
            ],
            radius: 500,
        },
        {
            title: 'Swift - Cocacola',
            images: [
                '/images/pistonia/cars/swift2-1.webp',
                '/images/pistonia/cars/car-2.webp',
                '/images/pistonia/cars/swift2-2.webp',
                '/images/pistonia/cars/swift2-3.webp',
            ],
            radius: 500,
        },
        {
            title: 'Polo - Turbosnail',
            images: [
                '/images/pistonia/cars/polo3-1.webp',
                '/images/pistonia/cars/car-3.webp',
                '/images/pistonia/cars/polo3-3.webp',
                '/images/pistonia/cars/polo3-2.webp',
            ],
            radius: 500,
        },
    ];

    useEffect(() => {
        // Initialize SplitText for titles
        const initTextsSplit = () => {
            document.querySelectorAll('.scene__title span').forEach((span) => {
                const split = new SplitText(span, {
                    type: 'chars',
                    charsClass: 'char',
                });
                splitMapRef.current.set(span, split);
            });
        };

        // Get carousel cell transforms
        const getCarouselCellTransforms = (count, radius) => {
            const angleStep = 360 / count;
            return Array.from({ length: count }, (_, i) => {
                const angle = i * angleStep;
                return `rotateY(${angle}deg) translateZ(${radius}px)`;
            });
        };

        // Setup carousel cells
        const setupCarouselCells = (carousel) => {
            const wrapper = carousel.closest('.scene');
            const radius = parseFloat(wrapper.dataset.radius) || 500;
            const cells = carousel.querySelectorAll('.carousel__cell');

            const transforms = getCarouselCellTransforms(cells.length, radius);
            cells.forEach((cell, i) => {
                cell.style.transform = transforms[i];
            });
        };

        // Create scroll animation for carousel
        const createScrollAnimation = (carousel) => {
            const wrapper = carousel.closest('.scene');
            const cards = carousel.querySelectorAll('.card');
            const titleSpan = wrapper.querySelector('.scene__title span');
            const split = splitMapRef.current.get(titleSpan);
            const chars = split?.chars || [];

            const timeline = gsap.timeline({
                defaults: { ease: 'sine.inOut' },
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            timeline
                .fromTo(carousel, { rotationY: 0 }, { rotationY: -180 }, 0)
                .fromTo(
                    carousel,
                    { rotationZ: 3, rotationX: 3 },
                    { rotationZ: -3, rotationX: -3 },
                    0
                )
                .fromTo(
                    cards,
                    { filter: 'brightness(250%)' },
                    { filter: 'brightness(80%)', ease: 'power3' },
                    0
                )
                .fromTo(cards, { rotationZ: 10 }, { rotationZ: -10, ease: 'none' }, 0);

            // Animate title characters
            if (chars.length > 0) {
                gsap.fromTo(
                    chars,
                    { autoAlpha: 0 },
                    {
                        autoAlpha: 1,
                        duration: 0.02,
                        ease: 'none',
                        stagger: { each: 0.04, from: 'start' },
                        scrollTrigger: {
                            trigger: wrapper,
                            start: 'top center',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }

            return timeline;
        };

        // Initialize carousels
        const initCarousels = () => {
            document.querySelectorAll('.carousel').forEach((carousel) => {
                setupCarouselCells(carousel);
                createScrollAnimation(carousel);
            });
        };

        // Wait for images to load
        const images = document.querySelectorAll('.card__face');
        let loadedCount = 0;
        const totalImages = images.length;

        const imageLoaded = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                document.body.classList.remove('loading');
                initTextsSplit();
                initCarousels();
            }
        };

        images.forEach((img) => {
            const bgImage = window.getComputedStyle(img).backgroundImage;
            const url = bgImage.match(/url\(["']?([^"']*)["']?\)/)?.[1];
            if (url) {
                const image = new Image();
                image.onload = imageLoaded;
                image.onerror = imageLoaded;
                image.src = url;
            } else {
                imageLoaded();
            }
        });

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            splitMapRef.current.forEach((split) => split.revert());
            splitMapRef.current.clear();
        };
    }, []);

    return (
        <div className="w-full min-h-screen bg-[#0f0e0e] text-white font-mono uppercase overflow-x-hidden">
            <style jsx>{`
        .loading::before,
        .loading::after {
          content: '';
          position: fixed;
          z-index: 10000;
        }
        .loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0f0e0e;
        }
        .loading::after {
          top: 50%;
          left: 50%;
          width: 100px;
          height: 1px;
          margin: 0 0 0 -50px;
          background: #ffffff;
          animation: loaderAnim 1.5s ease-in-out infinite alternate forwards;
        }
        @keyframes loaderAnim {
          0% {
            transform: scaleX(0);
            transform-origin: 0% 50%;
          }
          50% {
            transform: scaleX(1);
            transform-origin: 0% 50%;
          }
          50.1% {
            transform: scaleX(1);
            transform-origin: 100% 50%;
          }
          100% {
            transform: scaleX(0);
            transform-origin: 100% 50%;
          }
        }
        .line {
          display: inline-block;
          overflow: hidden;
          position: relative;
          vertical-align: top;
        }
        .line::before {
          background: rgba(255, 255, 255, 0.6);
          bottom: 0;
          content: '';
          height: 1px;
          left: 0;
          position: absolute;
          transition: transform 0.4s ease;
          width: 100%;
          transform: scaleX(0);
          transform-origin: right center;
        }
        .line:hover::before {
          transform: scaleX(1);
          transform-origin: left center;
        }
        .scene {
          perspective: 900px;
          position: relative;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .scene__title {
          position: relative;
          z-index: 10;
          margin: 0;
          font-size: 1rem;
        }
        .scene__title span {
          display: inline-block;
        }
        .scene__title .char {
          display: inline-block;
          transform-style: preserve-3d;
          transform-origin: 50% 0%;
        }
        .carousel {
          width: 400px;
          height: 500px;
          top: 50%;
          left: 50%;
          margin: -250px 0 0 -200px;
          position: absolute;
          transform-style: preserve-3d;
          will-change: transform;
          transform: translateZ(-550px) rotateY(0deg);
        }
        .scene:nth-child(even) .carousel {
          transform: translateZ(-550px) rotateY(45deg);
        }
        .carousel__cell {
          position: absolute;
          width: 350px;
          height: 420px;
          left: 0;
          top: 0;
          transform-style: preserve-3d;
        }
        .card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        .card__face {
          width: 100%;
          height: 100%;
          position: absolute;
          backface-visibility: hidden;
          background-size: cover;
          background-position: center;
          border-radius: 4px;
        }
        .card__face--back {
          transform: rotateY(180deg);
        }
      `}</style>

            {/* Main Content */}
            <main id="smooth-content" ref={smoothContentRef}>
                <div className="scene-wrapper">
                    {carouselData.map((carousel, index) => (
                        <div
                            key={index}
                            className="scene"
                            data-radius={carousel.radius}
                        >
                            <h2 className="scene__title" data-speed="0.7">
                                <span>{carousel.title}</span>
                            </h2>
                            <div className="carousel">
                                {carousel.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="carousel__cell">
                                        <div className="card">
                                            <div
                                                className="card__face card__face--front"
                                                style={{ backgroundImage: `url(${image})` }}
                                            ></div>
                                            <div
                                                className="card__face card__face--back"
                                                style={{ backgroundImage: `url(${image})` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ThreeDCarousel;