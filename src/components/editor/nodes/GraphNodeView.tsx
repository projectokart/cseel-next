'use client';

import React, { useState, useMemo } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
  TrendingUp, Edit3, Plus, Trash2, Check,
  BarChart2, Activity, Settings2, RefreshCw, Layers
} from 'lucide-react';
import { GraphDataPoint, GraphDataset } from '../types';

export default function GraphNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const title = node.attrs.title || "Ohm's Law: Voltage vs Current (V = IR)";
  const graphType = node.attrs.graphType || 'line';
  const xLabel = node.attrs.xLabel || 'Current';
  const yLabel = node.attrs.yLabel || 'Voltage';
  const xUnit = node.attrs.xUnit || 'A';
  const yUnit = node.attrs.yUnit || 'V';
  const showGrid = node.attrs.showGrid !== false;
  const showBestFit = node.attrs.showBestFit !== false;
  const datasets: GraphDataset[] = node.attrs.datasets || [
    {
      name: 'Observations',
      color: '#006fcc',
      data: [
        { x: 0.1, y: 0.5 },
        { x: 0.2, y: 1.0 },
        { x: 0.3, y: 1.5 },
        { x: 0.4, y: 2.0 },
        { x: 0.5, y: 2.5 },
      ],
    },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);

  // Edit buffer states
  const [editTitle, setEditTitle] = useState(title);
  const [editGraphType, setEditGraphType] = useState(graphType);
  const [editXLabel, setEditXLabel] = useState(xLabel);
  const [editYLabel, setEditYLabel] = useState(yLabel);
  const [editXUnit, setEditXUnit] = useState(xUnit);
  const [editYUnit, setEditYUnit] = useState(yUnit);
  const [editDatasets, setEditDatasets] = useState<GraphDataset[]>(datasets);

  const activePoints = (datasets[0]?.data || []).map((p) => ({
    x: typeof p.x === 'string' ? parseFloat(p.x) || 0 : p.x,
    y: typeof p.y === 'string' ? parseFloat(p.y) || 0 : p.y,
  }));

  // Linear Regression Calculation (Best fit slope & intercept)
  const regression = useMemo(() => {
    if (activePoints.length < 2) return null;
    const n = activePoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (const p of activePoints) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    }
    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return null;
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
    return {
      slope: Number(slope.toFixed(3)),
      intercept: Number(intercept.toFixed(3)),
      formula: `y = ${slope.toFixed(2)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(2)}`,
    };
  }, [activePoints]);

  // SVG Dimension & Bounds calculation
  const svgWidth = 540;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const minX = 0;
  const maxX = Math.max(...activePoints.map((p) => p.x), 1) * 1.1;
  const minY = 0;
  const maxY = Math.max(...activePoints.map((p) => p.y), 1) * 1.1;

  const getSvgX = (val: number) => padding.left + (val / maxX) * plotWidth;
  const getSvgY = (val: number) => padding.top + plotHeight - (val / maxY) * plotHeight;

  // Grid tick lines
  const xTicks = [0, maxX * 0.25, maxX * 0.5, maxX * 0.75, maxX];
  const yTicks = [0, maxY * 0.25, maxY * 0.5, maxY * 0.75, maxY];

  const handleSaveConfig = () => {
    updateAttributes({
      title: editTitle,
      graphType: editGraphType,
      xLabel: editXLabel,
      yLabel: editYLabel,
      xUnit: editXUnit,
      yUnit: editYUnit,
      datasets: editDatasets,
    });
    setIsEditing(false);
  };

  const handleAddRow = () => {
    const nextX = (editDatasets[0]?.data.length || 0) * 0.2 + 0.1;
    const nextY = nextX * 5;
    const updated = [...editDatasets];
    updated[0].data.push({ x: Number(nextX.toFixed(2)), y: Number(nextY.toFixed(2)) });
    setEditDatasets(updated);
  };

  const handleRemoveRow = (idx: number) => {
    const updated = [...editDatasets];
    updated[0].data.splice(idx, 1);
    setEditDatasets(updated);
  };

  const handlePointChange = (idx: number, field: 'x' | 'y', val: string) => {
    const num = parseFloat(val) || 0;
    const updated = [...editDatasets];
    updated[0].data[idx][field] = num;
    setEditDatasets(updated);
  };

  const applyPreset = (type: 'ohms' | 'gravity' | 'boyles') => {
    if (type === 'ohms') {
      setEditTitle("Ohm's Law: Voltage vs Current (V = IR)");
      setEditXLabel('Current');
      setEditYLabel('Voltage');
      setEditXUnit('A');
      setEditYUnit('V');
      setEditDatasets([
        {
          name: 'Resistor R = 5Ω',
          color: '#006fcc',
          data: [{ x: 0.1, y: 0.5 }, { x: 0.2, y: 1.0 }, { x: 0.3, y: 1.5 }, { x: 0.4, y: 2.0 }, { x: 0.5, y: 2.5 }],
        },
      ]);
    } else if (type === 'gravity') {
      setEditTitle('Free Fall: Velocity vs Time (v = gt)');
      setEditXLabel('Time');
      setEditYLabel('Velocity');
      setEditXUnit('s');
      setEditYUnit('m/s');
      setEditDatasets([
        {
          name: 'Earth (g ≈ 9.8 m/s²)',
          color: '#9333ea',
          data: [{ x: 0, y: 0 }, { x: 1, y: 9.8 }, { x: 2, y: 19.6 }, { x: 3, y: 29.4 }, { x: 4, y: 39.2 }],
        },
      ]);
    } else if (type === 'boyles') {
      setEditTitle("Boyle's Law: Pressure vs Volume (P vs 1/V)");
      setEditXLabel('1 / Volume');
      setEditYLabel('Pressure');
      setEditXUnit('1/L');
      setEditYUnit('kPa');
      setEditDatasets([
        {
          name: 'Constant T',
          color: '#059669',
          data: [{ x: 1, y: 100 }, { x: 2, y: 200 }, { x: 3, y: 300 }, { x: 4, y: 400 }, { x: 5, y: 500 }],
        },
      ]);
    }
  };

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`rounded-2xl border transition-all ${
          selected
            ? 'border-[#006fcc] ring-2 ring-[#006fcc]/20 bg-blue-50/20 dark:bg-blue-950/20'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300'
        } p-4 sm:p-5`}
      >
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#006fcc] font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">{title}</h4>
              <p className="text-[10px] text-slate-500 font-semibold">
                Interactive Scientific Data Plot • {graphType.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {regression && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200">
                Fit: {regression.formula} (Slope = {regression.slope})
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setEditTitle(title);
                setEditGraphType(graphType);
                setEditXLabel(xLabel);
                setEditYLabel(yLabel);
                setEditXUnit(xUnit);
                setEditYUnit(yUnit);
                setEditDatasets(datasets);
                setIsEditing(!isEditing);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#006fcc]" />
              <span>{isEditing ? 'Close Editor' : 'Edit Data & Axes'}</span>
            </button>

            <button
              type="button"
              onClick={deleteNode}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
              title="Delete Graph"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── VIEW MODE: Interactive SVG Canvas ── */}
        {!isEditing ? (
          <div className="w-full overflow-x-auto flex justify-center py-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full max-w-[560px] h-auto select-none font-sans"
            >
              {/* Background */}
              <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="transparent" />

              {/* Grid Lines */}
              {showGrid && (
                <g className="opacity-25 stroke-slate-400">
                  {xTicks.map((val, idx) => (
                    <line
                      key={`x-grid-${idx}`}
                      x1={getSvgX(val)}
                      y1={padding.top}
                      x2={getSvgX(val)}
                      y2={padding.top + plotHeight}
                      strokeDasharray="3 3"
                    />
                  ))}
                  {yTicks.map((val, idx) => (
                    <line
                      key={`y-grid-${idx}`}
                      x1={padding.left}
                      y1={getSvgY(val)}
                      x2={padding.left + plotWidth}
                      y2={getSvgY(val)}
                      strokeDasharray="3 3"
                    />
                  ))}
                </g>
              )}

              {/* Axes lines */}
              <line
                x1={padding.left}
                y1={padding.top + plotHeight}
                x2={padding.left + plotWidth}
                y2={padding.top + plotHeight}
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + plotHeight}
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Y Axis Labels */}
              {yTicks.map((val, idx) => (
                <text
                  key={`y-text-${idx}`}
                  x={padding.left - 8}
                  y={getSvgY(val) + 4}
                  textAnchor="end"
                  fontSize="10"
                  className="fill-slate-500 font-mono font-medium"
                >
                  {val.toFixed(1)}
                </text>
              ))}

              {/* X Axis Labels */}
              {xTicks.map((val, idx) => (
                <text
                  key={`x-text-${idx}`}
                  x={getSvgX(val)}
                  y={padding.top + plotHeight + 16}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-slate-500 font-mono font-medium"
                >
                  {val.toFixed(1)}
                </text>
              ))}

              {/* Axis Titles */}
              <text
                x={padding.left + plotWidth / 2}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize="11"
                className="fill-slate-800 dark:fill-slate-200 font-bold"
              >
                {xLabel} ({xUnit})
              </text>
              <text
                x={14}
                y={padding.top + plotHeight / 2}
                textAnchor="middle"
                fontSize="11"
                transform={`rotate(-90 14 ${padding.top + plotHeight / 2})`}
                className="fill-slate-800 dark:fill-slate-200 font-bold"
              >
                {yLabel} ({yUnit})
              </text>

              {/* Best Fit Line */}
              {showBestFit && regression && activePoints.length > 1 && (
                <line
                  x1={getSvgX(0)}
                  y1={getSvgY(regression.intercept)}
                  x2={getSvgX(maxX)}
                  y2={getSvgY(regression.slope * maxX + regression.intercept)}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-70"
                />
              )}

              {/* Line graph polyline */}
              {graphType === 'line' && activePoints.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#006fcc"
                  strokeWidth="2.5"
                  points={activePoints.map((p) => `${getSvgX(p.x)},${getSvgY(p.y)}`).join(' ')}
                />
              )}

              {/* Bar graph rectangles */}
              {graphType === 'bar' &&
                activePoints.map((p, i) => {
                  const barW = Math.max(plotWidth / (activePoints.length * 2.5), 14);
                  const bY = getSvgY(p.y);
                  const bH = padding.top + plotHeight - bY;
                  return (
                    <rect
                      key={`bar-${i}`}
                      x={getSvgX(p.x) - barW / 2}
                      y={bY}
                      width={barW}
                      height={bH}
                      fill="#006fcc"
                      rx="3"
                      className="opacity-80 hover:opacity-100 transition-opacity"
                    />
                  );
                })}

              {/* Scatter/Line Points */}
              {activePoints.map((p, i) => (
                <g key={`pt-${i}`} className="group/dot cursor-pointer">
                  <circle
                    cx={getSvgX(p.x)}
                    cy={getSvgY(p.y)}
                    r="5"
                    fill="#006fcc"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="drop-shadow-xs hover:scale-125 transition-transform"
                  />
                  <title>{`(${p.x} ${xUnit}, ${p.y} ${yUnit})`}</title>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          /* ── EDIT MODE: Dataset Table & Configuration ── */
          <div className="space-y-4 pt-2">
            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-500">Quick Science Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset('ohms')}
                className="px-2 py-1 rounded-lg bg-blue-50 text-[#006fcc] font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                Ohm&apos;s Law (V vs I)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('gravity')}
                className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition-colors"
              >
                Free Fall (v = gt)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('boyles')}
                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                Boyle&apos;s Law (P vs 1/V)
              </button>
            </div>

            {/* Graph Meta inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Graph Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Graph Type</label>
                <select
                  value={editGraphType}
                  onChange={(e) => setEditGraphType(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs"
                >
                  <option value="line">Line Graph</option>
                  <option value="scatter">Scatter Plot</option>
                  <option value="bar">Bar Chart</option>
                </select>
              </div>
            </div>

            {/* Axes inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">X Axis Label</label>
                <input
                  type="text"
                  value={editXLabel}
                  onChange={(e) => setEditXLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">X Unit</label>
                <input
                  type="text"
                  value={editXUnit}
                  onChange={(e) => setEditXUnit(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Y Axis Label</label>
                <input
                  type="text"
                  value={editYLabel}
                  onChange={(e) => setEditYLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Y Unit</label>
                <input
                  type="text"
                  value={editYUnit}
                  onChange={(e) => setEditYUnit(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            {/* Data Point Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Observed Data Points ({editDatasets[0]?.data.length || 0})</span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#006fcc] rounded-lg text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Data Point</span>
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase text-slate-500 font-bold sticky top-0">
                    <tr>
                      <th className="p-2 pl-3">#</th>
                      <th className="p-2">{editXLabel || 'X'} ({editXUnit || 'Unit'})</th>
                      <th className="p-2">{editYLabel || 'Y'} ({editYUnit || 'Unit'})</th>
                      <th className="p-2 text-right pr-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {(editDatasets[0]?.data || []).map((pt, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2 pl-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-1.5">
                          <input
                            type="number"
                            step="any"
                            value={pt.x}
                            onChange={(e) => handlePointChange(idx, 'x', e.target.value)}
                            className="w-24 px-2 py-1 border rounded-md text-xs font-bold"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="number"
                            step="any"
                            value={pt.y}
                            onChange={(e) => handlePointChange(idx, 'y', e.target.value)}
                            className="w-24 px-2 py-1 border rounded-md text-xs font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right pr-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-4 py-1.5 bg-[#006fcc] hover:bg-[#005bb8] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply & Render Graph</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
