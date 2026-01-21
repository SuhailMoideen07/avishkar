'use client'
import ThreeDSlider from '@/components/3D-Slider'
import FuzzyText from '@/components/FuzzyText'
import ImageSlices from '@/components/RevealProShow'
import { Vortex } from '@/components/ui/vortex'
import React from 'react'

const sliderItems = [
    { imageUrl: "images/proShow/zeropause3.png", data: { id: 1 } },
    { imageUrl: "images/proshow/zeropause4.png", data: { id: 2 } },
    { imageUrl: "images/proShow/zeropause5.png", data: { id: 3 } },
    { imageUrl: "images/proShow/zeropause6.png", data: { id: 4 } },
    { imageUrl: "images/proshow/zeropause7.png", data: { id: 5 } },
];

const Page = () => {
    return (
        <>
            <div className="fixed inset-0 -z-10 bg-black pointer-events-auto">
                <Vortex
                    backgroundColor="black"
                    rangeY={300}
                    particleCount={500}
                    baseHue={299}
                    className="flex items-center flex-col justify-center w-full h-full"
                />
            </div>

            <section
                id="proshow1"
                className="w-screen min-h-screen flex flex-col items-center justify-center gap-10 pt-24"
            >
                {/* Centered FuzzyText */}
                <div className="text-center">
                    <FuzzyText baseIntensity={0.15} hoverIntensity={0.2} enableHover>
                        ZeroPause
                    </FuzzyText>
                </div>

                {/* Centered ImageSlices */}
                <div className="w-full max-w-[600px] flex justify-center">
                    <ImageSlices
                        imageUrl="images/proshow/zeropause.png"
                        revealImageUrl="images/proshow/zeropause2.jpg"
                    />
                </div>

                {/* Completely responsive 3D slider */}
                <div className="w-full flex justify-center items-center">
                    <ThreeDSlider
                        items={sliderItems}
                        speedWheel={0.03}
                        speedDrag={-0.15}
                        containerStyle={{ width: '100%', height: '80vh' }}
                    />
                </div>
            </section>

            <section
                id="proshow2"
                className="flex items-center flex-col justify-center w-screen h-screen"
            >
                <FuzzyText baseIntensity={0.15} hoverIntensity={0.2} enableHover>
                    जी 𝗟𝗶𝘃𝗲
                </FuzzyText>
            </section>
        </>
    );
};

export default Page;
