'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Sparkles, Check, Info, Droplet, Zap, Dna, Activity, Scale, Compass, Cpu, Wrench } from 'lucide-react';

interface SimulatorProps {
  type: string;
  accentColor: string;
  subjectName: string;
}

export default function SubjectInteractiveSimulator({ type, accentColor, subjectName }: SimulatorProps) {
  // ── 1. Chemistry: Acid-Base Titration & pH Meter ──────────────────────────
  const [naohVolume, setNaohVolume] = useState<number>(0); // 0 to 50 mL
  const [isDripping, setIsDripping] = useState<boolean>(false);

  // Calculate pH based on strong acid (25mL 0.1M HCl) + strong base (0.1M NaOH)
  const calcPh = (vol: number) => {
    const vAcid = 25; // 25ml 0.1M HCl (0.0025 moles)
    const nAcid = 0.0025;
    const nBase = (vol * 0.1) / 1000;
    const totalVol = (vAcid + vol) / 1000;

    if (vol < 25) {
      const remH = (nAcid - nBase) / totalVol;
      return Math.max(1.0, Math.min(6.5, -Math.log10(Math.max(1e-7, remH))));
    } else if (vol === 25) {
      return 7.0;
    } else {
      const excessOH = (nBase - nAcid) / totalVol;
      const pOH = -Math.log10(Math.max(1e-7, excessOH));
      return Math.min(13.5, 14 - pOH);
    }
  };

  const currentPh = calcPh(naohVolume);

  // Indicator color (Universal indicator)
  const getIndicatorColor = (ph: number) => {
    if (ph < 3) return 'rgba(239, 68, 68, 0.85)'; // Red
    if (ph < 6) return 'rgba(249, 115, 22, 0.85)'; // Orange
    if (ph < 7.5) return 'rgba(34, 197, 94, 0.85)'; // Green
    if (ph < 10) return 'rgba(59, 130, 246, 0.85)'; // Blue
    return 'rgba(147, 51, 234, 0.85)'; // Purple
  };

  // ── 2. Physics: Pendulum & Gravity Simulator ──────────────────────────────
  const [lengthM, setLengthM] = useState<number>(1.5);
  const [gravityPreset, setGravityPreset] = useState<number>(9.8);
  const [isPlayingPhysics, setIsPlayingPhysics] = useState<boolean>(true);
  const pendulumCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const periodT = 2 * Math.PI * Math.sqrt(lengthM / gravityPreset);
  const frequencyHz = 1 / periodT;

  useEffect(() => {
    if (type !== 'physics_pendulum') return;
    const canvas = pendulumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const maxAngle = Math.PI / 6; // 30 deg

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const originX = canvas.width / 2;
      const originY = 30;
      const pixelLength = lengthM * 80;

      const omega = Math.sqrt(gravityPreset / lengthM);
      const theta = maxAngle * Math.cos(omega * t);

      const bobX = originX + pixelLength * Math.sin(theta);
      const bobY = originY + pixelLength * Math.cos(theta);

      // Draw Support Pivot
      ctx.fillStyle = '#334155';
      ctx.fillRect(originX - 30, originY - 8, 60, 8);

      // Draw dashed reference line
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#94a3b8';
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, originY + pixelLength + 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw String
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0284c7';
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Draw Bob Shadow & Glow
      ctx.beginPath();
      ctx.arc(bobX, bobY, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      if (isPlayingPhysics) {
        t += 0.025;
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [type, lengthM, gravityPreset, isPlayingPhysics]);

  // ── 3. Biology: DNA Base Pairing & Transcription ──────────────────────────
  const DNA_TEMPLATE = ['A', 'T', 'G', 'C', 'G', 'A', 'T', 'C', 'C', 'A'];
  const [transcribed, setTranscribed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBaseClick = (base: string) => {
    const currentIndex = transcribed.length;
    if (currentIndex >= DNA_TEMPLATE.length) return;

    const targetBase = DNA_TEMPLATE[currentIndex];
    // Complementary mRNA pairing: A->U, T->A, C->G, G->C
    const expected = targetBase === 'A' ? 'U' : targetBase === 'T' ? 'A' : targetBase === 'C' ? 'G' : 'C';

    if (base === expected) {
      const next = [...transcribed, base];
      setTranscribed(next);
      setFeedback(`✓ Base ${base} correctly paired with ${targetBase}!`);
      if (next.length === DNA_TEMPLATE.length) {
        setFeedback('🎉 Full mRNA Strand Transcribed Successfully!');
      }
    } else {
      setFeedback(`❌ Incorrect: Base ${targetBase} pairs with ${expected}, not ${base}.`);
    }
  };

  // ── 4. Math: Pythagorean & Fibonacci Visualizer ───────────────────────────
  const [sideA, setSideA] = useState<number>(3);
  const [sideB, setSideB] = useState<number>(4);
  const hypotenuseC = Math.sqrt(sideA * sideA + sideB * sideB);

  // ── 5. Art: Color Harmonies & RGB Mixer ───────────────────────────────────
  const [colorR, setColorR] = useState<number>(245);
  const [colorG, setColorG] = useState<number>(120);
  const [colorB, setColorB] = useState<number>(60);

  const rgbString = `rgb(${colorR}, ${colorG}, ${colorB})`;
  const compR = 255 - colorR;
  const compG = 255 - colorG;
  const compB = 255 - colorB;
  const complementaryString = `rgb(${compR}, ${compG}, ${compB})`;

  // ── 6. Technology: Digital Logic Gate Simulator ───────────────────────────
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);
  const [gateType, setGateType] = useState<'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR'>('AND');

  const calcGateOutput = () => {
    switch (gateType) {
      case 'AND': return inputA && inputB;
      case 'OR': return inputA || inputB;
      case 'XOR': return inputA !== inputB;
      case 'NAND': return !(inputA && inputB);
      case 'NOR': return !(inputA || inputB);
    }
  };
  const gateOutput = calcGateOutput();

  // ── 7. Engineering: Truss Bridge Stress Tester ────────────────────────────
  const [bridgeLoad, setBridgeLoad] = useState<number>(20); // kN
  const maxSafeLoad = 60; // kN
  const loadPercentage = Math.round((bridgeLoad / maxSafeLoad) * 100);
  const isOverstressed = bridgeLoad > maxSafeLoad;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Glow ambient background */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
              Interactive STEAM Simulator
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
            {type === 'chemistry_titration' && '🧪 Virtual Acid-Base Titration & pH Analyzer'}
            {type === 'physics_pendulum' && '⚡ Harmonic Pendulum & Gravity Oscillator'}
            {type === 'biology_dna' && '🧬 Molecular DNA Transcription & Base Pairing Lab'}
            {type === 'math_fractal' && '📐 Real-time Pythagorean & Area Ratio Geometry'}
            {type === 'art_color' && '🎨 Chromatic Color Theory & Harmonizer Studio'}
            {type === 'tech_logic' && '💻 Boolean Digital Logic Gate Interactive Circuit'}
            {type === 'eng_bridge' && '🌉 Warren Truss Bridge Structural Stress Simulator'}
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300">
          Live Physics Engine
        </span>
      </div>

      {/* ── 1. Chemistry Titration Simulator View ──────────────────────── */}
      {type === 'chemistry_titration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Beaker & Visualizer */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <div className="relative w-48 h-64 border-b-4 border-l-4 border-r-4 border-slate-400 rounded-b-3xl flex flex-col justify-end p-2 overflow-hidden bg-slate-900/50 shadow-inner">
              {/* Liquid inside beaker */}
              <div
                className="w-full rounded-b-2xl transition-all duration-300 flex items-center justify-center text-xs font-black text-white shadow-lg"
                style={{
                  height: `${Math.min(90, 40 + (naohVolume / 50) * 45)}%`,
                  backgroundColor: getIndicatorColor(currentPh),
                }}
              >
                pH {currentPh.toFixed(2)}
              </div>

              {/* Burette Tip Dripping */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-slate-400/80 rounded-b-md">
                {naohVolume > 0 && (
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mx-auto mt-7 animate-bounce" />
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400">Beaker Contents: </span>
              <span className="text-xs font-bold text-slate-200">
                25 mL HCl (0.1M) + {naohVolume.toFixed(1)} mL NaOH (0.1M)
              </span>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-300">Burette NaOH Added:</span>
                <span className="text-sm font-mono font-bold text-amber-400">{naohVolume.toFixed(1)} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={naohVolume}
                onChange={(e) => setNaohVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0 mL (Acidic)</span>
                <span className="text-emerald-400 font-bold">25 mL (Equivalence Point)</span>
                <span>50 mL (Basic)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400">Current pH Reading</p>
                <p className="text-2xl font-black font-mono mt-0.5" style={{ color: getIndicatorColor(currentPh) }}>
                  {currentPh.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {currentPh < 6.8 ? 'Acidic Solution (HCl excess)' : currentPh > 7.2 ? 'Basic Solution (NaOH excess)' : 'Neutral Salt (NaCl + H2O)'}
                </p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400">Neutralization State</p>
                <p className="text-base font-bold text-white mt-1">
                  {naohVolume === 25 ? '🎯 100% Equivalence' : `${Math.round((Math.min(naohVolume, 25) / 25) * 100)}% Neutralized`}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  HCl + NaOH &rarr; NaCl + H₂O
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNaohVolume(25)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Jump to Equivalence (25mL)
              </button>
              <button
                type="button"
                onClick={() => setNaohVolume(0)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Physics Pendulum Simulator View ─────────────────────────── */}
      {type === 'physics_pendulum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <canvas ref={pendulumCanvasRef} width={340} height={280} className="w-full max-w-[340px] h-[280px]" />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-300">Pendulum Length (L):</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{lengthM.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={lengthM}
                onChange={(e) => setLengthM(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <span className="text-xs font-bold text-slate-300 block mb-2">Gravitational Acceleration (g):</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { name: 'Earth', g: 9.8 },
                  { name: 'Moon', g: 1.6 },
                  { name: 'Mars', g: 3.7 },
                  { name: 'Jupiter', g: 24.8 },
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setGravityPreset(p.g)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      gravityPreset === p.g ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p.name} <span className="block text-[9px] font-mono opacity-80">{p.g}m/s²</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400">Time Period (T)</p>
                <p className="text-2xl font-black font-mono text-cyan-400 mt-0.5">{periodT.toFixed(2)} s</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">T = 2π√(L/g)</p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400">Oscillation Frequency</p>
                <p className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{frequencyHz.toFixed(2)} Hz</p>
                <p className="text-[10px] text-slate-500 mt-1">Cycles per second</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlayingPhysics(!isPlayingPhysics)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              {isPlayingPhysics ? 'Pause Oscillator' : 'Start Oscillator'}
            </button>
          </div>
        </div>
      )}

      {/* ── 3. Biology DNA Transcription View ──────────────────────────── */}
      {type === 'biology_dna' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 mb-2 font-mono">DNA Coding Strand (3&apos; to 5&apos;):</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {DNA_TEMPLATE.map((base, idx) => (
                <div
                  key={idx}
                  className="w-10 h-12 rounded-xl bg-slate-800 border-2 border-emerald-500/60 flex flex-col items-center justify-center shrink-0"
                >
                  <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                  <span className="text-sm font-black text-emerald-400">{base}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-4 mb-2 font-mono">Synthesized mRNA Transcript (5&apos; to 3&apos;):</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {DNA_TEMPLATE.map((_, idx) => {
                const isFilled = idx < transcribed.length;
                const baseVal = transcribed[idx];
                return (
                  <div
                    key={idx}
                    className={`w-10 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border-2 ${
                      isFilled ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300' : 'bg-slate-900/40 border-dashed border-slate-700 text-slate-600'
                    }`}
                  >
                    <span className="text-sm font-black font-mono">{isFilled ? baseVal : '?'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Select Complementary RNA Base:</span>
              <div className="flex gap-2">
                {['A', 'U', 'C', 'G'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBaseClick(b)}
                    disabled={transcribed.length >= DNA_TEMPLATE.length}
                    className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs disabled:opacity-40"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {feedback && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-300">
                {feedback}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setTranscribed([]);
                setFeedback(null);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset Strand
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Math Pythagorean View ───────────────────────────────────── */}
      {type === 'math_fractal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="relative w-64 h-64 border border-slate-800 rounded-2xl flex items-center justify-center">
              {/* Scaled Right Triangle */}
              <svg viewBox="0 0 100 100" className="w-48 h-48">
                <polygon
                  points="20,80 80,80 20,30"
                  fill="rgba(139, 92, 246, 0.2)"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />
                <text x="50" y="92" fill="#cbd5e1" fontSize="8" textAnchor="middle">a = {sideA}</text>
                <text x="12" y="55" fill="#cbd5e1" fontSize="8" textAnchor="middle">b = {sideB}</text>
                <text x="58" y="50" fill="#a855f7" fontSize="9" fontWeight="bold" textAnchor="middle">c = {hypotenuseC.toFixed(2)}</text>
              </svg>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Base (a):</span>
                <span className="font-mono text-purple-400">{sideA}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sideA}
                onChange={(e) => setSideA(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Height (b):</span>
                <span className="font-mono text-purple-400">{sideB}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sideB}
                onChange={(e) => setSideB(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 font-mono text-center">
              <p className="text-xs text-slate-400">Pythagorean Equation</p>
              <p className="text-lg font-black text-purple-300 mt-1">
                {sideA}² + {sideB}² = {sideA * sideA + sideB * sideB} &rArr; c = {hypotenuseC.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Art Color Mixer View ────────────────────────────────────── */}
      {type === 'art_color' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div
              className="h-44 rounded-2xl border-2 border-white/20 shadow-xl flex flex-col items-center justify-center p-3 text-center transition-colors"
              style={{ backgroundColor: rgbString }}
            >
              <span className="text-xs font-bold text-white drop-shadow-md">Primary Base Swatch</span>
              <span className="text-sm font-mono font-black text-white drop-shadow-md mt-1">{rgbString}</span>
            </div>

            <div
              className="h-44 rounded-2xl border-2 border-white/20 shadow-xl flex flex-col items-center justify-center p-3 text-center transition-colors"
              style={{ backgroundColor: complementaryString }}
            >
              <span className="text-xs font-bold text-white drop-shadow-md">Complementary Opposite</span>
              <span className="text-sm font-mono font-black text-white drop-shadow-md mt-1">{complementaryString}</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-red-400">Red Channel (R):</span>
                <span className="font-mono text-red-400">{colorR}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={colorR}
                onChange={(e) => setColorR(parseInt(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-green-400">Green Channel (G):</span>
                <span className="font-mono text-green-400">{colorG}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={colorG}
                onChange={(e) => setColorG(parseInt(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-400">Blue Channel (B):</span>
                <span className="font-mono text-blue-400">{colorB}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={colorB}
                onChange={(e) => setColorB(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Tech Digital Logic Gate View ────────────────────────────── */}
      {type === 'tech_logic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-6">
              {/* Inputs */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setInputA(!inputA)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    inputA ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Input A: {inputA ? '1 (HIGH)' : '0 (LOW)'}
                </button>
                <button
                  type="button"
                  onClick={() => setInputB(!inputB)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    inputB ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Input B: {inputB ? '1 (HIGH)' : '0 (LOW)'}
                </button>
              </div>

              {/* Logic Gate Block */}
              <div className="w-20 h-20 rounded-2xl bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center text-sm font-black font-mono text-indigo-200 shadow-xl">
                {gateType}
              </div>

              {/* Output LED */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-mono font-black transition-all ${
                    gateOutput
                      ? 'bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-400/80 scale-110'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {gateOutput ? '1' : '0'}
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1">LED Out</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-slate-300 block">Select Boolean Gate:</span>
            <div className="grid grid-cols-5 gap-2">
              {(['AND', 'OR', 'XOR', 'NAND', 'NOR'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGateType(g)}
                  className={`py-2 text-xs font-mono font-bold rounded-xl transition-all ${
                    gateType === g ? 'bg-indigo-500 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700 text-xs">
              <p className="font-bold text-indigo-300">Boolean Equation:</p>
              <p className="font-mono text-slate-200 mt-1">
                Output = {gateType}({inputA ? '1' : '0'}, {inputB ? '1' : '0'}) &rArr; <strong className={gateOutput ? 'text-emerald-400' : 'text-slate-400'}>{gateOutput ? '1 (TRUE)' : '0 (FALSE)'}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Engineering Bridge Stress Tester ────────────────────────── */}
      {type === 'eng_bridge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800">
            <svg viewBox="0 0 200 80" className="w-full max-w-[320px] h-36">
              {/* Abutments */}
              <rect x="0" y="60" width="30" height="20" fill="#475569" />
              <rect x="170" y="60" width="30" height="20" fill="#475569" />

              {/* Bottom Chords */}
              <line x1="20" y1="60" x2="180" y2="60" stroke="#0ea5e9" strokeWidth="3" />

              {/* Top Chords */}
              <line x1="50" y1="25" x2="150" y2="25" stroke="#ef4444" strokeWidth="3" />

              {/* Web Members (Tension / Compression) */}
              <line x1="20" y1="60" x2="50" y2="25" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="50" y1="25" x2="80" y2="60" stroke="#0ea5e9" strokeWidth="2.5" />
              <line x1="80" y1="60" x2="110" y2="25" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="110" y1="25" x2="140" y2="60" stroke="#0ea5e9" strokeWidth="2.5" />
              <line x1="140" y1="60" x2="170" y2="25" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="170" y1="25" x2="180" y2="60" stroke="#ef4444" strokeWidth="2.5" />

              {/* Load Vector Arrow */}
              <path d="M100 5 L100 55 M95 48 L100 55 L105 48" stroke="#f59e0b" strokeWidth="3" fill="none" />
              <text x="100" y="0" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">{bridgeLoad} kN</text>
            </svg>

            <div className="flex gap-4 text-[10px] text-slate-400 mt-2 font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Compression Member</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Tension Member</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Applied Mid-Span Load:</span>
                <span className="font-mono text-amber-400">{bridgeLoad} kN</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={bridgeLoad}
                onChange={(e) => setBridgeLoad(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400">Stress Capacity</p>
                <p className={`text-2xl font-black font-mono mt-0.5 ${isOverstressed ? 'text-red-400' : 'text-emerald-400'}`}>
                  {loadPercentage}%
                </p>
                <p className="text-[10px] text-slate-500 mt-1">{isOverstressed ? '⚠️ Buckling Risk Exceeded' : 'Safe Working Stress'}</p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400">Safety Factor (SF)</p>
                <p className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                  {(maxSafeLoad / bridgeLoad).toFixed(2)}x
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Design Standard: &ge; 1.5x</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
