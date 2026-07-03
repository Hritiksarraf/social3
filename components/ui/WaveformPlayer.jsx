"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@components/icons";

const BAR_COUNT = 40;
const peaksCache = new Map();
let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    sharedAudioCtx = Ctx ? new Ctx() : null;
  }
  return sharedAudioCtx;
}

function fallbackPeaks(seed) {
  let x = 0;
  for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0;
  if (!x) x = 1;
  const peaks = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    x = (x * 1103515245 + 12345) >>> 0;
    peaks.push(0.22 + ((x >> 8) % 1000) / 1000 * 0.78);
  }
  return peaks;
}

async function getPeaks(url) {
  if (peaksCache.has(url)) return peaksCache.get(url);

  const promise = (async () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) throw new Error("Web Audio API unavailable");
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const raw = audioBuffer.getChannelData(0);
      const blockSize = Math.max(1, Math.floor(raw.length / BAR_COUNT));
      const peaks = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        const start = i * blockSize;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) sum += Math.abs(raw[start + j] || 0);
        peaks.push(sum / blockSize);
      }
      const max = Math.max(...peaks, 0.0001);
      return peaks.map((p) => Math.max(0.12, p / max));
    } catch {
      return fallbackPeaks(url);
    }
  })();

  peaksCache.set(url, promise);
  return promise;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function WaveformPlayer({ src, gradientFrom = "#7857FF", gradientTo = "#FF0073" }) {
  const audioRef = useRef(null);
  const [peaks, setPeaks] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    getPeaks(src).then((p) => {
      if (!cancelled) setPeaks(p);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const bars = peaks || Array(BAR_COUNT).fill(0.3);
  const activeIndex = Math.floor(progress * bars.length);

  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
      style={{ background: `linear-gradient(90deg, ${gradientFrom}24, ${gradientTo}1a)` }}
    >
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          boxShadow: `0 8px 18px -6px ${gradientTo}cc`,
        }}
      >
        {playing ? <PauseIcon size={13} color="#fff" /> : <PlayIcon size={13} color="#fff" />}
      </button>
      <div className="flex-1 flex items-center gap-[2px] h-7">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm transition-[background] ${
              playing && i === activeIndex ? "animate-yv-eq" : ""
            }`}
            style={{
              height: `${Math.max(12, h * 100)}%`,
              background: i <= activeIndex ? "#fff" : "rgba(255,255,255,0.28)",
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-extrabold text-ink-2 tabular-nums">
        {currentTime > 0 ? formatTime(currentTime) : formatTime(duration)}
      </span>
    </div>
  );
}
