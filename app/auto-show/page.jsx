'use client'
import ChromaGrid from '@/components/ChromaGrid';
import { SmoothScrollHero } from '@/components/SmoothHero'
import React from 'react'

const items = [
    {
        image: "/images/pistonia/joji.jpg",
        title: "Joji Thampi",
        handle: "@joji_thampi",
        subtitle: "Chief Guest",
        borderColor: "#FFD700",
        gradient: "linear-gradient(165deg, #FFD700, #000)",
        url: "https://www.instagram.com/joji_thampi/"
    },
    {
        image: "/images/pistonia/abay.webp",
        title: "A R Shiva",
        handle: "@a_r_shiva",
        borderColor: "#FFD700",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://www.instagram.com/a_r_shiva/"
    },
    {
        image: "/images/pistonia/abin.png",
        title: "Abin Babs Abraham",
        handle: "@abinbabsabraham",
        borderColor: "#FFD700",
        gradient: "linear-gradient(180deg, #10B981, #000)",
        url: "https://www.instagram.com/abinbabsabraham/"
    },
];

const page = () => {
    return (
        <>
            <section id='autoshow' className=''>
                <SmoothScrollHero />
                <ChromaGrid
                    className='bg-black'
                    items={items}
                    radius={300}
                    damping={0.45}
                    fadeOut={0.6}
                    ease="power3.out"
                />
            </section>
        </>
    )
}

export default page