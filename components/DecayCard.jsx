import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const DecayCard = ({ 
  width = 300, 
  height = 400, 
  image = 'https://picsum.photos/300/400?grayscale', 
  children,
  enableGyro = false,
  gyroSensitivity = 0.55,
  smoothTime = 0.25,
  snapBackDelay = 250
}) => {
  const svgRef = useRef(null);
  const displacementMapRef = useRef(null);
  
  // Mouse cursor position
  const cursor = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cachedCursor = useRef({ ...cursor.current });
  const winsize = useRef({ width: window.innerWidth, height: window.innerHeight });
  
  // Gyro state
  const [isGyroActive, setIsGyroActive] = useState(false);
  
  // Smooth damping targets and current values (similar to GridScan)
  const posTarget = useRef({ x: 0, y: 0 });
  const posCurrent = useRef({ x: 0, y: 0 });
  const posVelocity = useRef({ x: 0, y: 0 });

  // Smooth damping function from GridScan
  const smoothDamp = (current, target, velocity, smoothTime, maxSpeed, deltaTime) => {
    smoothTime = Math.max(0.0001, smoothTime);
    const omega = 2 / smoothTime;
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

    let changeX = current.x - target.x;
    let changeY = current.y - target.y;
    const originalToX = target.x;
    const originalToY = target.y;

    const maxChange = maxSpeed * smoothTime;
    const changeLen = Math.sqrt(changeX * changeX + changeY * changeY);
    if (changeLen > maxChange && changeLen > 0) {
      const scale = maxChange / changeLen;
      changeX *= scale;
      changeY *= scale;
    }

    target.x = current.x - changeX;
    target.y = current.y - changeY;

    const tempX = (velocity.x + omega * changeX) * deltaTime;
    const tempY = (velocity.y + omega * changeY) * deltaTime;
    
    velocity.x = (velocity.x - omega * tempX) * exp;
    velocity.y = (velocity.y - omega * tempY) * exp;

    const outX = target.x + (changeX + tempX) * exp;
    const outY = target.y + (changeY + tempY) * exp;

    const origMinusCurrentX = originalToX - current.x;
    const origMinusCurrentY = originalToY - current.y;
    const outMinusOrigX = outX - originalToX;
    const outMinusOrigY = outY - originalToY;

    if (origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY > 0) {
      return { x: originalToX, y: originalToY };
    }

    return { x: outX, y: outY };
  };

  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;
  const distance = (x1, x2, y1, y2) => Math.hypot(x1 - x2, y1 - y2);
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // Mouse move handler
  useEffect(() => {
    let leaveTimer = null;

    const handleMouseMove = (ev) => {
      if (isGyroActive) return;
      
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }

      const nx = (ev.clientX / winsize.current.width) * 2 - 1;
      const ny = (ev.clientY / winsize.current.height) * 2 - 1;
      
      posTarget.current = { x: nx, y: ny };
    };

    const handleMouseLeave = () => {
      if (isGyroActive) return;
      
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        posTarget.current = { x: 0, y: 0 };
      }, snapBackDelay);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [isGyroActive, snapBackDelay]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      winsize.current = { width: window.innerWidth, height: window.innerHeight };
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main render loop with smooth damping
  useEffect(() => {
    const imgValues = {
      imgTransforms: { x: 0, y: 0, rz: 0 },
      displacementScale: 0
    };

    let lastTime = performance.now();
    const maxSpeed = Infinity;

    const render = () => {
      const now = performance.now();
      const deltaTime = Math.max(0, Math.min(0.1, (now - lastTime) / 1000));
      lastTime = now;

      // Apply smooth damping to position
      const smoothed = smoothDamp(
        posCurrent.current,
        posTarget.current,
        posVelocity.current,
        smoothTime,
        maxSpeed,
        deltaTime
      );

      posCurrent.current = smoothed;

      // Map smoothed normalized coordinates to pixel space
      const mappedX = map(posCurrent.current.x, -1, 1, 0, winsize.current.width);
      const mappedY = map(posCurrent.current.y, -1, 1, 0, winsize.current.height);

      // Update cursor for distance calculation
      cursor.current = { x: mappedX, y: mappedY };

      // Calculate transforms
      let targetX = lerp(imgValues.imgTransforms.x, map(mappedX, 0, winsize.current.width, -120, 120), 0.1);
      let targetY = lerp(imgValues.imgTransforms.y, map(mappedY, 0, winsize.current.height, -120, 120), 0.1);
      let targetRz = lerp(imgValues.imgTransforms.rz, map(mappedX, 0, winsize.current.width, -10, 10), 0.1);

      const bound = 50;
      if (targetX > bound) targetX = bound + (targetX - bound) * 0.2;
      if (targetX < -bound) targetX = -bound + (targetX + bound) * 0.2;
      if (targetY > bound) targetY = bound + (targetY - bound) * 0.2;
      if (targetY < -bound) targetY = -bound + (targetY + bound) * 0.2;

      imgValues.imgTransforms.x = targetX;
      imgValues.imgTransforms.y = targetY;
      imgValues.imgTransforms.rz = targetRz;

      if (svgRef.current) {
        gsap.set(svgRef.current, {
          x: imgValues.imgTransforms.x,
          y: imgValues.imgTransforms.y,
          rotateZ: imgValues.imgTransforms.rz
        });
      }

      // Calculate displacement based on movement
      const cursorTravelledDistance = distance(
        cachedCursor.current.x,
        cursor.current.x,
        cachedCursor.current.y,
        cursor.current.y
      );

      imgValues.displacementScale = lerp(
        imgValues.displacementScale,
        map(cursorTravelledDistance, 0, 200, 0, 400),
        0.06
      );

      if (displacementMapRef.current) {
        gsap.set(displacementMapRef.current, { attr: { scale: imgValues.displacementScale } });
      }

      cachedCursor.current = { ...cursor.current };

      requestAnimationFrame(render);
    };

    const rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [smoothTime]);

  // Gyroscope support with smooth damping
  useEffect(() => {
    if (!enableGyro) return;

    const s = clamp(gyroSensitivity, 0, 1);
    const gyroScale = lerp(0.6, 1.8, s);

    const handleOrientation = (event) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;

      const isPortrait = window.innerHeight > window.innerWidth;

      let nx, ny;
      if (isPortrait) {
        nx = clamp(-beta / 30, -1, 1) * gyroScale;
        ny = clamp(gamma / 45, -1, 1) * gyroScale;
      } else {
        nx = clamp(gamma / 45, -1, 1) * gyroScale;
        ny = clamp(-beta / 30, -1, 1) * gyroScale;
      }

      // Update target, not current position (smooth damping will handle it)
      posTarget.current = { x: nx, y: ny };
      
      if (!isGyroActive) {
        setIsGyroActive(true);
      }
    };

    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.error('DeviceOrientation permission denied:', error);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enableGyro, gyroSensitivity, isGyroActive]);

  // Click handler for iOS permission
  const handleClick = async () => {
    if (
      enableGyro &&
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setIsGyroActive(true);
        }
      } catch (error) {
        console.error('Permission request failed:', error);
      }
    }
  };

  return (
    <div 
      ref={svgRef} 
      className="relative" 
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={handleClick}
    >
      <svg
        viewBox="-60 -75 720 900"
        preserveAspectRatio="xMidYMid slice"
        className="relative w-full h-full block [will-change:transform]"
      >
        <filter id="imgFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.015"
            numOctaves="5"
            seed="4"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence1"
          />
          <feDisplacementMap
            ref={displacementMapRef}
            in="SourceGraphic"
            in2="turbulence1"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="B"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="displacementMap3"
          />
        </filter>
        <g>
          <image
            href={image}
            x="0"
            y="0"
            width="600"
            height="750"
            filter="url(#imgFilter)"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
      <div className="absolute bottom-[1.2em] left-[1em] tracking-[-0.5px] font-black text-[2.5rem] leading-[1.5em] first-line:text-[6rem]">
        {children}
      </div>
      {enableGyro && isGyroActive && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
          Gyro Active
        </div>
      )}
    </div>
  );
};

export default DecayCard;