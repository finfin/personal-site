'use client'

import { useEffect, useRef } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

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

/**
 * 定義雪花粒子的介面
 * @interface ParticleType
 * @property {number} x - 粒子的 X 座標
 * @property {number} y - 粒子的 Y 座標
 * @property {HTMLImageElement} img - 粒子的圖片元素
 * @property {number} speed - 粒子的移動速度
 * @property {number} life - 粒子的生命週期（秒）
 * @property {number} size - 粒子的大小（像素）
 * @property {number} lifeSpan - 當前剩餘生命值
 */
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
  createdAt: number;
  lastUpdate: number;

  constructor(x: number, y: number, img: HTMLImageElement, speed: number, life: number, size: number) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.speed = speed;
    this.life = life;
    this.size = size;
    this.lifeSpan = life;
    this.createdAt = performance.now();
    this.velocity = {
      x: ((Math.random() - 0.5) * 0.5) * this.speed,
      y: ((1 + Math.random()) / 2) * this.speed
    };
    this.lastUpdate = this.createdAt;
  }

  update(context: CanvasRenderingContext2D) {
    const now = performance.now();
    const deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;

    const elapsed = (now - this.createdAt) / 1000;
    this.lifeSpan = Math.max(0, this.life - elapsed);

    this.x += this.velocity.x * deltaTime * 60;
    this.y += this.velocity.y * deltaTime * 60;

    const scale = Math.max(0, this.lifeSpan / this.life);
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

/**
 * 雪花游標組件屬性
 * @interface SnowflakeCursorProps
 * @property {HTMLElement} [container] - 容器元素，默認為 document.body
 * @property {string[]} [images] - 雪花圖片URL數組
 * @property {number} [rate=1] - 產生雪花的機率 (0-1)
 * @property {number} [size=30] - 雪花大小（像素）
 * @property {number} [life=2] - 雪花存在時間（秒）
 * @property {number} [speed=0.5] - 雪花移動速度
 */
interface SnowflakeCursorProps {
  container?: HTMLElement;
  images?: string[];
  rate?: number;
  size?: number;
  life?: number;
  speed?: number;
}

const MAX_PARTICLES = 500; // 限制最大粒子數量

const SnowFlakeEffect = ({
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
  const animationFrameRef = useRef<number>();

  // Canvas 初始化
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {return;}

    canvasRef.current = canvas;
    contextRef.current = context;

    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.position = 'fixed';
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
      if (contextRef.current) {
        contextRef.current = null;
      }
    };
  }, []);

  // 主要邏輯
  useEffect(() => {
    if (!canvasRef.current || !contextRef.current) {return;}

    containerRef.current = container || document.body;
    const hasWrapperEl = containerRef.current !== document.body;

    // 如果有容器，重新設置 canvas 位置
    if (hasWrapperEl && containerRef.current) {
      canvasRef.current.style.position = 'absolute';
      containerRef.current.appendChild(canvasRef.current);
      containerRef.current.style.position = 'relative';
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    }

    function addParticle(x: number, y: number) {
      if (!canvasImagesRef.current.length) {return;}

      const img = canvasImagesRef.current[Math.floor(Math.random() * canvasImagesRef.current.length)];
      if (img) {
        particlesRef.current.push(new Particle(x, y, img, speed, life, size));
        // 如果當前沒有運行動畫循環，就啟動它
        if (!animationFrameRef.current) {
          loop();
        }
      }
    }

    function addParticleWithRate(x: number, y: number) {
      requestAnimationFrame(() => {
        if (rate > Math.random() && particlesRef.current.length < MAX_PARTICLES) {
          addParticle(x, y);
        }
      });
    }

    function updateParticles() {
      if (!contextRef.current || !canvasRef.current || particlesRef.current.length === 0) {
        return false;  // 返回 false 表示沒有粒子需要更新
      }

      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // 先過濾掉已經結束生命週期的粒子
      particlesRef.current = particlesRef.current.filter(particle => particle.lifeSpan > 0);

      // 更新剩餘的粒子
      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update(contextRef.current);
      }

      return particlesRef.current.length > 0;  // 返回是否還有活著的粒子
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

    function onTouchEnd(e: TouchEvent) {
      if (!canvasRef.current) {return;}

      e.preventDefault();

      const touch = e.changedTouches[0];
      if (touch) {
        const { x, y } = getRelativePosition(
          { x: touch.clientX, y: touch.clientY },
          canvasRef.current
        );

        // 在觸控點周圍直接生成雪花，不需要機率檢查
        const randomOffset = 20;
        const randomX = x + (Math.random() - 0.5) * randomOffset;
        const randomY = y + (Math.random() - 0.5) * randomOffset;
        addParticle(randomX, randomY);
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvasRef.current) {return;}

      const { x, y } = getRelativePosition(
        { x: e.clientX, y: e.clientY },
        canvasRef.current
      )
      addParticleWithRate(x, y);
    }

    function onScroll() {
      if (!canvasRef.current) {return;}

      const numFlakes = 5;
      for (let i = 0; i < numFlakes; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight / 2);
        addParticleWithRate(x, y);
      }
    }

    function bindEvents() {
      if (!containerRef.current) {return;}

      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

      if (isTouchDevice) {
        containerRef.current.addEventListener('touchend', onTouchEnd, { passive: false });
      } else {
        containerRef.current.addEventListener('mousemove', onMouseMove);
      }
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('scroll', onScroll);
    }

    function loop() {
      // 如果沒有粒子需要更新，就停止動畫循環
      if (!updateParticles()) {
        animationFrameRef.current = undefined;
        return;
      }
      animationFrameRef.current = requestAnimationFrame(loop);
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

    // 載入圖片並開始動畫
    Promise.all(images.map(url => loadImage(url))).then((results) => {
      canvasImagesRef.current = results.filter((result): result is HTMLImageElement => result !== null)
      if (results.length) {
        bindEvents();
        loop();
      }
    })

    // 修改清理函數
    return () => {
      // 停止動畫循環
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // 清理 canvas
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }

      // 清理 context
      if (contextRef.current) {
        contextRef.current = null;
      }

      // 清理粒子陣列
      if (particlesRef.current) {
        particlesRef.current = [];
      }

      // 清理圖片陣列
      if (canvasImagesRef.current) {
        canvasImagesRef.current = [];
      }

      // 移除事件監聽器
      window.removeEventListener('resize', onWindowResize);

      if (containerRef.current) {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) {
          containerRef.current.removeEventListener('touchend', onTouchEnd);
        } else {
          containerRef.current.removeEventListener('mousemove', onMouseMove);
        }
        containerRef.current = null;
      }

      window.removeEventListener('scroll', onScroll);
    }
  }, [container, images, rate, size, life, speed]);

  return null;
}

// 包裝導出的組件
export default function WrappedSnowFlakeEffect(props: SnowflakeCursorProps) {
  return (
    <ErrorBoundary>
      <SnowFlakeEffect {...props} />
    </ErrorBoundary>
  );
}
