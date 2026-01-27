import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Link from 'next/link';

// Lenis smooth scroll
if (typeof window !== 'undefined') {
    import('@studio-freight/lenis').then((Lenis) => {
        const lenis = new Lenis.default();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    });
}

// EmergeMaterial Shader
const EmergeMaterial = shaderMaterial(
    {
        uTime: 0,
        uFillColor: new THREE.Color("#8B0000"),
        uProgress: 0,
        uTexture: null,
        uTextureSize: new THREE.Vector2(1, 1),
        uElementSize: new THREE.Vector2(1, 1),
    },
    // vertex shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // fragment shader
    `
    uniform float uTime;
    uniform vec3 uFillColor;
    uniform float uProgress;
    uniform vec2 uTextureSize;
    uniform vec2 uElementSize;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    
    float hashwithoutsine12(vec2 p){
      vec3 p3  = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    
    float cnoise(vec2 P){
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0);
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 * 
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
    }
    
    float cubicInOut(float t) {
      return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    
    float parabola( float x, float k ) {
      return pow( 4. * x * ( 1. - x ), k );
    }
    
    void main() {
      vec2 uv = vUv - vec2(0.5);
      float aspect1 = uTextureSize.x/uTextureSize.y;
      float aspect2 = uElementSize.x/uElementSize.y;
      if(aspect1>aspect2){uv *= vec2( aspect2/aspect1,1.);} 
      else{uv *= vec2( 1.,aspect1/aspect2);}
      uv += vec2(0.5);

      vec4 defaultColor = texture2D(uTexture, uv);

      float hash = hashwithoutsine12(vUv*1000. + floor(uTime*3.)*0.1);
      vec3 fillColor = uFillColor;
      fillColor += (vec3(hash)-vec3(0.5))*0.2;

      float n = (cnoise(vUv*vec2(35.,1.)) + 1.)*0.5;
      
      float dt = parabola( cubicInOut(uProgress),1.);
      vec2 distUV = uv;
      distUV.y = 1.-(1.-uv.y)*(1. -dt*0.3) ;
      defaultColor = texture2D(uTexture, distUV);
      float width = 1.;
      float w = width*dt;

      float maskvalue = smoothstep(1. - w,1.,vUv.y + mix(-w/2., 1. - w/2., cubicInOut(uProgress)));

      float mask = maskvalue + maskvalue*n;

      float final = smoothstep(1.,1.+0.01,mask);
      float dist = -0.5;
      float final1 = smoothstep(1.,1.+0.01,mask-dist);
      if(final1==0.) discard;

      vec3 finalColor = mix(fillColor,defaultColor.rgb,final);
      gl_FragColor = vec4(finalColor,1.);
    //   gl_FragColor.rgb = pow(gl_FragColor.rgb,vec3(1./2.2));
    }
  `
);

extend({ EmergeMaterial });

// Hook for screen size
const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
};

// ImagePlane component - THIS MUST BE INSIDE CANVAS
function ImagePlane({ imageData }) {
    const meshRef = useRef();
    const [texture, setTexture] = useState(null);
    const [textureSize, setTextureSize] = useState([1, 1]);

    useEffect(() => {
        if (imageData.url) {
            new THREE.TextureLoader().load(imageData.url, (tex) => {
                setTextureSize([tex.image.width, tex.image.height]);
                setTexture(tex);
            });
        }
    }, [imageData.url]);

    useFrame((state) => {
        if (meshRef.current && imageData.containerRef.current) {
            const rect = imageData.containerRef.current.getBoundingClientRect();
            meshRef.current.position.set(
                rect.left + rect.width / 2 - window.innerWidth / 2,
                -rect.top - rect.height / 2 + window.innerHeight / 2,
                0
            );
            meshRef.current.scale.set(rect.width, rect.height, 1);

            if (meshRef.current.material) {
                meshRef.current.material.uTime = state.clock.elapsedTime;
                meshRef.current.material.uElementSize = new THREE.Vector2(rect.width, rect.height);
            }
        }
    });

    useEffect(() => {
        if (meshRef.current?.material && imageData.isIntersecting !== undefined) {
            gsap.to(meshRef.current.material, {
                uProgress: imageData.isIntersecting ? 1 : 0,
                duration: 1.5,
                ease: "none",
            });
        }
    }, [imageData.isIntersecting]);

    if (!texture) return null;

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1]} />
            <emergeMaterial
                uFillColor={new THREE.Color("#8B0000")}
                transparent={true}
                uTexture={texture}
                uTextureSize={new THREE.Vector2(textureSize[0], textureSize[1])}
                uElementSize={new THREE.Vector2(1, 1)}
            />
        </mesh>
    );
}

// All image planes inside Canvas
function AllImagePlanes({ imageDataList }) {
    return (
        <>
            {imageDataList.map((data, idx) => (
                <ImagePlane key={idx} imageData={data} />
            ))}
        </>
    );
}

// EmergingImage Component - just creates the DOM container
function EmergingImage({ url, className, onMount }) {
    const containerRef = useRef();
    const [isIntersecting, setIsIntersecting] = useState(false);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    setIsIntersecting(entry.isIntersecting);
                },
                { threshold: 0.1 }
            );
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, []);

    useEffect(() => {
        if (containerRef.current && onMount) {
            onMount({
                url,
                containerRef,
                isIntersecting,
            });
        }
    }, [isIntersecting]);

    return <div ref={containerRef} className={className} />;
}

// Gallery data
const images = [
    { url: "/images/mainpage/pistonia.webp", title: "Autoshow", year: "pistonia", path: "/auto-show", r: 1, c: 1, s: 4 },
    { url: "/images/mainpage/bikestunt.webp", title: "Bike stunt", year: "Free style", path: "/auto-show", r: 2, c: 5, s: 4 },
    { url: "/images/mainpage/g-live.webp", title: "Proshow", year: "जी-LIVE", path: "/pro-show/g-live", r: 5, c: 3, s: 4 },
    { url: "/images/mainpage/zeropause.webp", title: "Proshow", year: "ZEROPAUSE", path: "/pro-show/zero-pause", r: 7, c: 3, s: 5 },
    { url: "/images/mainpage/events.webp", title: "", year: "Cultural & Technical Events", path: "/events", r: 8, c: 5, s: 4 },
    // { url: "/images/mainpage/", title: "", year: "Technical Events", path: "/events/dept", r: 9, c: 1, s: 5 },
];

// Main App Component
export default function HorizontalScroll() {
    const [imageDataList, setImageDataList] = useState([]);
    const screenSize = useScreenSize();

    const handleImageMount = (index, data) => {
        setImageDataList(prev => {
            const newList = [...prev];
            newList[index] = data;
            return newList;
        });
    };

    return (
        <>
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700;900&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          background-color: #101014;
          color: #f0f0f0;
          font-family: 'Space Grotesk', ui-monospace, monospace;
          font-weight: 600;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }
        
        a {
          color: #818798;
          text-decoration: none;
        }
        
        a:hover {
          color: #fff;
        }
      `}</style>

            <Canvas
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                }}
                orthographic
                camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
            >
                <AllImagePlanes imageDataList={imageDataList.filter(Boolean)} />
            </Canvas>

            <main className="relative w-full">
                <div className="relative px-12 py-8 grid w-full min-h-[20vh]">
                    <h1 className="text-5xl md:text-7xl lg:text-7xl font-black leading-tight deadpool-heading" >
                        THE ATTRACTIONS
                    </h1>
                </div>

                <div className="w-full relative my-[10vh] mb-[10vh] px-12 grid gap-12 md:gap-[3vw] md:grid-cols-10 md:auto-rows-auto deadpool-heading  ">
                    {images.map((img, idx) => (
                        <figure
                            key={idx}
                            className="relative m-0 "
                            style={{
                                gridColumn: screenSize.width >= 768 ? `${img.c} / span ${img.s || 1}` : 'auto',
                                gridRow: screenSize.width >= 768 ? img.r : 'auto',
                            }}
                        >
                            <h3 className="font-bold text-xl m-0">
                                {img.title}
                            </h3>
                            <Link href={img.path} className='hover:'>
                                <div className="relative overflow-hidden grid place-items-center w-full h-auto" style={{ aspectRatio: '0.7' }}>
                                    <EmergingImage
                                        url={img.url}
                                        className="w-full h-full bg-cover bg-center relative"
                                        onMount={(data) => handleImageMount(idx, data)}
                                    />
                                </div>
                                <figcaption className="absolute p-2 flex flex-wrap gap-2">
                                    <h3 className="font-bold text-xl m-0 text-[#ef4444]" >
                                        {img.year}
                                    </h3>
                                    <h3 className="font-bold text-base m-0 underline text-[#b9b3af] hover:text-[#afb1b9]"  >
                                        See Details
                                    </h3>
                                </figcaption>
                            </Link>
                        </figure>
                    ))}
                </div>
            </main>
        </>
    );
}