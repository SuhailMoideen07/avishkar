'use client'
import ShinyText from '@/components/ShinyText'
import React from 'react'

const page = () => {
    return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center bg-black">
            <ShinyText
                text="Updating Soon..."
                speed={2}
                delay={0}
                color="#b5b5b5"
                shineColor="#ffffff"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
            />
        </div>
    )
}

export default page
