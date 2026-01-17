'use client'

import HorizontalScrollCarousel from '@/components/HorozontalScroll';
import { SmoothScrollHero } from '@/components/SmoothHero'
import { Skiper67 } from '@/components/ui/skiper-ui/skiper67';
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col'>
      <SmoothScrollHero />
      <HorizontalScrollCarousel />
      <Skiper67 />
    </div>
  )
}

export default page
