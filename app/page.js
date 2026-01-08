'use client'
import { GridScan } from '@/components/GridScan';

export default function Home() {
  return (
    <section className='relative text-neutral-600'>
      <div className='w-full h-screen fixed -z-10 top-0 left-0 bg-black' >
        <GridScan
          sensitivity={0.55}
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
      <div className="h-screen">
        hero content
      </div>
      <div className="h-screen">
        cultural
      </div>
      <div className="h-screen">
        events
      </div>
    </section>
  );
}
