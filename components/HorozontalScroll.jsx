import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { pressStart2P } from '@/lib/fonts';

const Example = () => {
    return (
        <div className="">
            <div className="flex h-44 items-center justify-center">
                <span className={`font-extrabold text-left uppercase text-neutral-200 text-4xl ${pressStart2P.className} `}>
                    highlights
                </span>
            </div>
            <HorizontalScrollCarousel />
        </div>
    );
};

const HorizontalScrollCarousel = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);
    return (
        <section ref={targetRef} className="relative h-[300vh]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-4">
                    {cards.map((card) => {
                        return <Card card={card} key={card.id} />;
                    })}
                </motion.div>
            </div>
        </section>
    );
};

const Card = ({ card }) => {
    const router = useRouter();

    const handleClick = (e) => {
        e.preventDefault();
        router.push(card.path);
    };

    return (
        <div 
            onClick={handleClick}
            className="group relative h-[550px] w-[450px] md:w-[850px] overflow-hidden bg-neutral-200 cursor-pointer"
        >
            {/* Background */}
            <div
                style={{
                    backgroundImage: `url(${card.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
            ></div>

            {/* Dark fade */}
            <div className="absolute inset-0 z-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Comic Title + Button */}
            <div className="absolute z-20 flex flex-col items-center left-1/2 -translate-x-1/2 top-10">

                {/* Comic title */}
                <p
                    className={`
                        ${pressStart2P.className}
                        text-4xl md:text-6xl
                        text-white 
                        drop-shadow-[4px_4px_0px_#000]
                        rotate-[-2deg]
                        tracking-wider
                        mb-4
                        select-none
                    `}
                >
                    {card.title}
                </p>

                {/* Comic button */}
                <button 
                    className="
                        active:scale-95 
                        transition-transform 
                        hover:scale-110
                        rotate-6
                        relative
                        translate-y-10
                    "
                >
                    <Image
                        src="/images/button.png"
                        alt="btn image"
                        width={130}
                        height={130}
                        className="drop-shadow-[6px_6px_0px_#000] drop-shadow-[#410b0e] comic-outline"
                    />
                </button>

            </div>
        </div>
    );
};

export default Example;

const cards = [
    {
        url: "/images/highlights/autoShow.webp",
        title: "Auto Show",
        path: "/expo#autoshow",
        id: 1,
    },
    {
        url: "/images/highlights/proShow1.webp",
        title: "Pro Show 1",
        path: "/expo#proshow1",
        id: 2,
    },  
    {
        url: "/images/highlights/proShow2.webp",
        title: "Pro Show 2",
        path: "/expo#proshow2",
        id: 3,
    },
    {
        url: "/images/highlights/culturals.webp",
        title: "Cultural Competitions",
        path: "/expo#culturals",
        id: 4,
    }
];