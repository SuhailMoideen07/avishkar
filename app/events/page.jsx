'use client'
import ShinyText from "@/components/ShinyText";

export default function ComingSoon() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <ShinyText
        text="Coming Soon..."
        speed={2}
        delay={0}
        color="#b5b5b5"
        shineColor="#ffffff"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
      />
    </div>
  );
}