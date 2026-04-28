import { useRef, useCallback, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { MAP_CONFIG } from './config';
import type { MapViewState } from './types';

interface MapViewportProps {
  children: React.ReactNode;
  viewState: MapViewState;
  setViewState: (state: MapViewState) => void;
  enabled?: boolean;
}

export function MapViewport({
  children,
  viewState,
  setViewState,
  enabled = true,
}: MapViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isPinchingRef = useRef(false);
  const lastScaleRef = useRef(1);
  const touchStartDistRef = useRef(0);

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: viewState.offsetX,
    y: viewState.offsetY,
    scale: viewState.scale,
    config: { tension: 300, friction: 30 },
  }));

  useEffect(() => {
    api.start({
      x: viewState.offsetX,
      y: viewState.offsetY,
      scale: viewState.scale,
      immediate: false,
    });
  }, [viewState.offsetX, viewState.offsetY, viewState.scale, api]);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!enabled) return;
      e.preventDefault();

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(
        MAP_CONFIG.maxScale,
        Math.max(MAP_CONFIG.minScale, viewState.scale * delta)
      );

      const scaleFactor = newScale / viewState.scale;
      const newOffsetX = mouseX - (mouseX - viewState.offsetX) * scaleFactor;
      const newOffsetY = mouseY - (mouseY - viewState.offsetY) * scaleFactor;

      setViewState({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    },
    [enabled, viewState, setViewState]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Get distance between two touches
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get center point between two touches
  const getTouchCenter = (touches: TouchList) => {
    if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!enabled) return;
    isDraggingRef.current = false;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [enabled]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!enabled || !lastPosRef.current) return;

    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current && !isPinchingRef.current) {
      setViewState({
        ...viewState,
        offsetX: viewState.offsetX + dx,
        offsetY: viewState.offsetY + dy,
      });
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [enabled, viewState, setViewState]);

  const handlePointerUp = useCallback(() => {
    lastPosRef.current = null;
    isDraggingRef.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinchingRef.current = true;
      const touches = Array.from(e.touches);
      touchStartDistRef.current = getTouchDistance(touches as unknown as TouchList);
      lastScaleRef.current = viewState.scale;
    }
  }, [viewState.scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled || !isPinchingRef.current || e.touches.length < 2) return;
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const touches = Array.from(e.touches);
    const newDist = getTouchDistance(touches as unknown as TouchList);
    const center = getTouchCenter(touches as unknown as TouchList);

    if (touchStartDistRef.current > 0) {
      const scaleDelta = newDist / touchStartDistRef.current;
      const newScale = Math.min(
        MAP_CONFIG.maxScale,
        Math.max(MAP_CONFIG.minScale, lastScaleRef.current * scaleDelta)
      );

      const rect = container.getBoundingClientRect();
      const touchX = center.x - rect.left;
      const touchY = center.y - rect.top;

      const scaleFactor = newScale / viewState.scale;
      const newOffsetX = touchX - (touchX - viewState.offsetX) * scaleFactor;
      const newOffsetY = touchY - (touchY - viewState.offsetY) * scaleFactor;

      setViewState({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    }
  }, [enabled, viewState, setViewState]);

  const handleTouchEnd = useCallback(() => {
    isPinchingRef.current = false;
    touchStartDistRef.current = 0;
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden touch-none select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <animated.div
        className="w-full h-full"
        style={{
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </animated.div>
    </div>
  );
}
