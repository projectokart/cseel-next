import type { Metadata } from 'next';
import Client from '../Client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Template 2 | CSEEL Academic & STEM School Portal Demo",
  description: "Live interactive demo preview of CSEEL official academic, STEM and experiential learning web portal for schools.",
};

export default function Template2Page() {
  return (
    <>
      {/* Demo Switcher Bar */}
      <div 
        id="cseel-template-switcher" 
        style={{
          position: 'fixed',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '6px 10px',
          borderRadius: '50px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.18)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', paddingLeft: '8px' }}>
          Demos:
        </span>
        <a 
          href="https://design.cseel.org" 
          style={{
            background: '#1e293b',
            color: '#cbd5e1',
            padding: '6px 14px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          <span>🎨</span>
          Template 1 (Design Studio)
        </a>
        <a 
          href="/template-2" 
          style={{
            background: '#0284c7',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(2,132,199,0.4)',
          }}
        >
          <span style={{ width: '7px', height: '7px', background: '#38bdf8', borderRadius: '50%' }}></span>
          Template 2 (CSEEL Academic)
        </a>
        <a 
          href="https://design.cseel.org/#contact" 
          style={{
            background: 'linear-gradient(135deg, #00AF90 0%, #008770 100%)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,175,144,0.4)',
          }}
        >
          <span>✨</span>
          Get This Website For Your School
        </a>
      </div>

      <Client />
    </>
  );
}
