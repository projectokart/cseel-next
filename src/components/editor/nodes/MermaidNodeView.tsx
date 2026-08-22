'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Network, Edit3, Copy, Check, Trash2, Code2, AlertTriangle } from 'lucide-react';

export default function MermaidNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const code = node.attrs.code || 'flowchart TD\n  A[Start] --> B[Process]\n  B --> C[Result]';
  const [isEditing, setIsEditing] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);

  // Render Mermaid Diagram via dynamic import
  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });

        const { svg } = await mermaid.render(idRef.current, code);
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Syntax error in Mermaid diagram');
        }
      }
    };

    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateAttributes({ code: currentCode });
    setIsEditing(false);
  };

  const PRESETS = [
    {
      label: 'Flowchart',
      code: 'flowchart TD\n  A[Start Experiment] --> B[Take Reading]\n  B --> C{Within Tolerance?}\n  C -- Yes --> D[Record in Lab Sheet]\n  C -- No --> E[Recalibrate Apparatus]',
    },
    {
      label: 'Sequence',
      code: 'sequenceDiagram\n  autonumber\n  Student->>Sensor: Initialize I2C Bus\n  Sensor-->>Student: ACK (0x48)\n  Student->>Microcontroller: Read 16-bit ADC\n  Microcontroller-->>Cloud: Post Telemetry',
    },
    {
      label: 'Architecture',
      code: 'classDiagram\n  class Experiment {\n    +String title\n    +Array apparatus\n    +execute()\n  }\n  class Sensor {\n    +float readVoltage()\n  }\n  Experiment o-- Sensor',
    },
  ];

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`rounded-2xl border transition-all ${
          selected
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300'
        } p-4 sm:p-5`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
            <Network className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-wider font-black">Mermaid Science Diagram</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              title="Copy Mermaid Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentCode(code);
                setIsEditing(!isEditing);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isEditing ? 'Close' : 'Edit Diagram'}</span>
            </button>

            <button
              type="button"
              onClick={deleteNode}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
              title="Delete Diagram"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* View Mode: Rendered SVG */}
        {!isEditing ? (
          <div className="w-full flex justify-center items-center py-3 overflow-x-auto min-h-[100px]">
            {error ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Diagram error: Click &quot;Edit Diagram&quot; to adjust Mermaid code syntax.</span>
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="max-w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
              />
            )}
          </div>
        ) : (
          /* Edit Mode: Code Textarea */
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400">Diagram Presets:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setCurrentCode(p.code)}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <textarea
              rows={7}
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              className="w-full p-3 bg-slate-950 text-slate-100 font-mono text-xs rounded-xl border border-slate-700 outline-none focus:border-indigo-500 leading-relaxed"
              placeholder="flowchart TD\n  A --> B"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
              >
                Update Diagram
              </button>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
