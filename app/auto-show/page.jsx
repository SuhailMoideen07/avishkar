'use client'
import ScrollFilterEffect from '@/components/Autoshow3p';
import ParallaxComponent from '@/components/AutoShowLanding';
import React from 'react'

const page = () => {
    return (
        <>
            <section id='autoshow' className=''>
                <ParallaxComponent />

                <ScrollFilterEffect />
            </section>
        </>
    )
}

export default page