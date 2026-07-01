import React, { useState, useEffect, useRef, useCallback } from "react";
import { feature } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Feature, Geometry } from "geojson";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapMarker {
  id: string;
  coords: [number, number];
  code: string;
  label: string;
  isActive: boolean;
  isHovered: boolean;
}

interface WorldMapProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
  onMarkerHover: (id: string | null) => void;
  selectedId: string | null;
}

const WorldMap: React.FC<WorldMapProps> = ({
  markers,
  onMarkerClick,
  onMarkerHover,
  selectedId,
}) => {
  const [features, setFeatures] = useState<Feature<Geometry>[]>([]);
  const [dim, setDim] = useState({ w: 800, h: 500 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topo: Topology) => {
        const world = feature(topo, topo.objects.countries as unknown as GeometryObject) as FeatureCollection;
        setFeatures(world.features);
      })
      .catch((err) => console.warn("Failed to load world map topology:", err));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDim({ w: width || 800, h: height || 500 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => { e.preventDefault(); };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const projection = geoMercator()
    .center([105, 10])
    .scale(dim.w * 1.3)
    .translate([dim.w / 2 + offset.x, dim.h / 2 + offset.y]);

  const pathGen = geoPath().projection(projection);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.5), 8));
  }, []);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    dragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  }, []);

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    lastPos.current = { x: clientX, y: clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }, []);

  const endDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      moveDrag(e.clientX, e.clientY);
    },
    [moveDrag]
  );

  const handleMouseUp = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [startDrag]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [moveDrag]);

  const handleTouchEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const projScale = dim.w * 1.3 * scale;

  const scaledProjection = geoMercator()
    .center([105, 10])
    .scale(projScale)
    .translate([dim.w / 2 + offset.x, dim.h / 2 + offset.y]);

  const scaledPathGen = geoPath().projection(scaledProjection);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: "none" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {dim.w > 0 && (
        <svg width={dim.w} height={dim.h} className="w-full h-full">
          {features.map((f, i) => (
            <path
              key={i}
              d={scaledPathGen(f) ?? undefined}
              fill="var(--bg-primary)"
              stroke="var(--border-color)"
              strokeWidth={0.4}
            />
          ))}
          {markers.map((m) => {
            const pt = scaledProjection(m.coords);
            if (!pt) return null;
            const [cx, cy] = pt;
            const active = m.isActive || m.isHovered;
            const r = active ? 14 : 10;
            return (
              <g
                key={m.id}
                onMouseEnter={() => onMarkerHover(m.id)}
                onMouseLeave={() => onMarkerHover(null)}
                onClick={() => onMarkerClick(m.id)}
                style={{ cursor: "pointer" }}
              >
                {active && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r + 8}
                    fill="none"
                    stroke="rgba(0, 212, 255, 0.25)"
                    strokeWidth={2}
                  >
                    <animate
                      attributeName="r"
                      values={`${r + 4};${r + 14};${r + 4}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={active ? "#00D4FF" : "rgba(148, 163, 184, 0.6)"}
                  stroke={active ? "#ffffff" : "rgba(255,255,255,0.3)"}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r * 0.4}
                  fill="#ffffff"
                />
                <text
                  x={cx}
                  y={cy + r + 16}
                  textAnchor="middle"
                  fill={active ? "#00D4FF" : "var(--text-secondary)"}
                  fontSize={active ? 12 : 10}
                  fontWeight={active ? "bold" : "normal"}
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {m.code}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default WorldMap;
