import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const Example = () => {
    return (
        <div className=""
            style={{
                background: "linear-gradient(0deg, rgba(255,252,252,1) 0%, rgba(0,0,0,0.98) 67%)",
            }}
        >
            <div className="flex h-44 items-center justify-center">
                <span className="font-extrabold text-left uppercase text-neutral-500 text-4xl">
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
    return (
        <div
            key={card.id}
            className="group relative h-[550px] w-[450px] md:w-[850px] overflow-hidden bg-neutral-200"
        >
            <div
                style={{
                    backgroundImage: `url(${card.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
            ></div>
            <div className="absolute inset-0 z-10 grid place-content-center">
                <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
                    {card.title}
                </p>
            </div>
        </div>
    );
};

export default Example;

const cards = [
    {
        url: "/images/highlights/autoShow.webp",
        title: "Auto Show",
        id: 1,
    },
    {
        url: "/images/highlights/proShow1.webp",
        title: "Pro Show 1",
        id: 2,
    },
    {
        url: "/images/highlights/proShow2.webp",
        title: "Pro Show 2",
        id: 3,
    },
    {
        url: "/images/highlights/culturals.webp",
        title: "Cultural Competitions",
        id: 4,
    }
];