'use client'
import { GridScan } from '@/components/GridScan';
import Shuffle from '@/components/Shuffle';
import StaggeredMenu from '@/components/StaggeredMenu';
import { pressStart2P } from '@/lib/fonts';
import Image from 'next/image';
// import DecayCard from '@/components/DecayCard';

import dynamic from "next/dynamic"
const DecayCard = dynamic(
  () => import("@/components/DecayCard"),
  { ssr: false }
)


const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Events', ariaLabel: 'View our events', link: '/events' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Website', link: 'https://musaliarcollege.com/' },
];

export default function Home() {
  return (
    <section className='relative text-[#FED700] w-full overflow-x-hidden'>
      <div className='fixed inset-0 -z-10 bg-black' >
        <GridScan
          sensitivity={0.75}
          lineThickness={1}
          linesColor="#FFF800"
          gridScale={0.15}
          scanColor="#FFF800"
          scanOpacity={0.5}
          enablePost={false}
          enableGyro={true}
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          scanDirection='forward'
          scanDelay={2}
          enableWebcam={false}
        />
      </div>
      <div className='h-[100dvh] fixed inset-0 z-20 '>
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#000000"
          changeMenuColorOnOpen={true}
          colors={['#FFFFE0', '#FFF800']}
          logoUrl="/images/star.svg"
          accentColor="#FFF800"
          onMenuOpen={() => console.log('Menu opened')}
          onMenuClose={() => console.log('Menu closed')}
        />
      </div>
      <div className="relative h-screen flex justify-center items-center overflow-hidden">
        <Image
          src='/images/star.svg'
          alt='star1'
          width={60}
          height={60}
          className='absolute top-40 right-10'
        />
        <Image
          src='/images/star.svg'
          alt='star2'
          width={100}
          height={100}
          className='absolute top-3/5 -right-10'
        />
        <Image
          src='/images/star.svg'
          alt='star3'
          width={180}
          height={180}
          className='absolute top-2/6 -left-32 -translate-y-1/2 rotate-45'
        />
        <Image
          src='/images/star.svg'
          alt='star4'
          width={50}
          height={50}
          className='absolute bottom-32 right-20 rotate-90'
        />
        <Image
          src='/images/star.svg'
          alt='star5'
          width={120}
          height={120}
          className='absolute bottom-40 left-10 -rotate-12'
        />
        <Shuffle
          className={`${pressStart2P.className} `}
          text="Avishkar 2026"
          shuffleDirection="right"
          duration={0.45}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
          loop
          loopDelay={3}
        />
      </div>
      <div className="">

        {/* <Image src='/images/event (1).png' alt='evnt' height={450} width={450} />
        <Image src='/images/event (2).png' alt='evnt' height={450} width={450} />
        <Image src='/images/event (3).png' alt='evnt' height={450} width={450} /> */}
        <DecayCard
          image="/images/event (1).png"
          enableGyro={true}
          gyroSensitivity={0.8}
        >
        </DecayCard>

      </div>
    </section>
  );
}
