'use client'
import ScrollFilterEffect from '@/components/Autoshow3p';
import ParallaxComponent from '@/components/AutoShowLanding';
import ThreeDCarousel from '@/components/CarPics';
import React from 'react'

const page = () => {
    return (
        <>
            <section id='autoshow' className=''>
                <ParallaxComponent />

                <ScrollFilterEffect />

                <ThreeDCarousel/>
            </section>
        </>
    )
}

export default page