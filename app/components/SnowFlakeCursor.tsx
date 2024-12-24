'use client'

import { useEffect, useRef } from 'react'

const IMAGE_URLS = [
  'https://i.imgur.com/ATIK70z.png',
  'https://i.imgur.com/j1Ji19r.png',
  'https://i.imgur.com/7OONoPN.png',
  'https://i.imgur.com/CVUTdtG.png',
  'https://i.imgur.com/YOxgfxw.png',
  'https://i.imgur.com/55Vsqji.png',
  'https://i.imgur.com/rP46Ovp.png',
  'https://i.imgur.com/KYoL6oi.png',
]

interface ParticleType {
  x: number;
  y: number;
  img: HTMLImageElement;
  speed: number;
  life: number;
  size: number;
  lifeSpan: number;
  update: (context: CanvasRenderingContext2D) => void;
}

class Particle implements ParticleType {
  x: number;
  y: number;
  img: HTMLImageElement;
  speed: number;
  life: number;
  size: number;
  lifeSpan: number;
  velocity: { x: number; y: number };

  constructor(x: number, y: number, img: HTMLImageElement, speed: number, life: number, size: number) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.speed = speed;
    this.life = life;
    this.size = size;
    this.lifeSpan = life * 60;
    this.velocity = {
      x: (Math.random() - 0.5) * this.speed,
      y: Math.random() * this.speed
    };
  }

  update(context: CanvasRenderingContext2D) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.lifeSpan--;

    const scale = Math.max(0, this.lifeSpan / (this.life * 60));
    const currentSize = this.size * scale;

    context.globalAlpha = scale;
    context.drawImage(
      this.img,
      this.x - currentSize / 2,
      this.y - currentSize / 2,
      currentSize,
      currentSize
    );
  }
}

// 添加位置介面
interface Position {
  x: number;
  y: number;
}

function getRelativePosition(position: Position, canvas: HTMLCanvasElement): Position {
  const rect = canvas.getBoundingClientRect()
  const x = position.x - rect.left
  const y = position.y - rect.top
  return { x, y }
}

interface SnowflakeCursorProps {
  container?: HTMLElement;
  images?: string[];
  rate?: number;
  size?: number;
  life?: number;
  speed?: number;
}

const SnowflakeCursor = ({
  container,
  images = IMAGE_URLS,
  rate = 1,
  size = 30,
  life = 2,
  speed = 0.5,
}: SnowflakeCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<ParticleType[]>([]);
  const canvasImagesRef = useRef<HTMLImageElement[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    containerRef.current = container || document.body;
    const hasWrapperEl = containerRef.current !== document.body;

    function addParticle(x: number, y: number) {
      if (rate > Math.random() && canvasImagesRef.current.length > 0) {
        const img = canvasImagesRef.current[Math.floor(Math.random() * canvasImagesRef.current.length)];
        if (img) {
          particlesRef.current.push(new Particle(x, y, img, speed, life, size));
        }
      }
    }

    function updateParticles() {
      if (!contextRef.current || !canvasRef.current || particlesRef.current.length === 0) {
        return;
      }

      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update(contextRef.current);
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        if (particlesRef.current[i].lifeSpan < 0) {
          particlesRef.current.splice(i, 1);
        }
      }
    }

    function onWindowResize() {
      if (!canvasRef.current || !containerRef.current) {return;}

      if (hasWrapperEl) {
        canvasRef.current.width = containerRef.current.clientWidth
        canvasRef.current.height = containerRef.current.clientHeight
      } else {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    function onTouchMove(e) {
      if (!canvasRef.current) {return;}

      if (e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          const { x, y } = getRelativePosition(
            { x: e.touches[i].clientX, y: e.touches[i].clientY },
            canvasRef.current
          )
          addParticle(x, y)
        }
      }
    }

    function onMouseMove(e) {
      if (!canvasRef.current) {return;}

      const { x, y } = getRelativePosition(
        { x: e.clientX, y: e.clientY },
        canvasRef.current
      )
      addParticle(x, y)
    }

    function bindEvents() {
      if (!containerRef.current) {return;}

      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

      if (isTouchDevice) {
        containerRef.current.addEventListener('touchmove', onTouchMove)
        containerRef.current.addEventListener('touchstart', onTouchMove)
      } else {
        containerRef.current.addEventListener('mousemove', onMouseMove)
      }
      window.addEventListener('resize', onWindowResize)
    }

    function loop() {
      updateParticles()
      requestAnimationFrame(loop)
    }

    function init() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {return;}

      canvasRef.current = canvas;
      contextRef.current = context;

      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.pointerEvents = 'none';

      if (hasWrapperEl && containerRef.current) {
        canvas.style.position = 'absolute';
        containerRef.current.appendChild(canvas);
        containerRef.current.style.position = 'relative';
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      } else {
        canvas.style.position = 'fixed';
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      bindEvents();
      loop();
    }

    function loadImage(url: string): Promise<HTMLImageElement | null> {
      return new Promise(((resolve) => {
        const img = new Image()
        img.onload = function onloadHandler() {
          resolve(img)
        }
        img.onerror = () => resolve(null)
        img.src = url
      }))
    }

    // 載入圖片並初始化
    Promise.all(images.map(url => loadImage(url))).then((results) => {
      canvasImagesRef.current = results.filter((result): result is HTMLImageElement => result !== null)
      if (results.length) {
        init()
      }
    })

    // 清理函數
    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
      }
      window.removeEventListener('resize', onWindowResize);

      if (containerRef.current) {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) {
          containerRef.current.removeEventListener('touchmove', onTouchMove);
          containerRef.current.removeEventListener('touchstart', onTouchMove);
        } else {
          containerRef.current.removeEventListener('mousemove', onMouseMove);
        }
      }
    }
  }, [container, images, rate, size, life, speed])

  return null
}

export default SnowflakeCursor
