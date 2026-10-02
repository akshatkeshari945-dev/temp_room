import React from 'react';

/**
 * Reusable DemoRoomBadge component.
 * Only rendered when room.isDemo === true.
 * Used exclusively on individual sample room listings during development/hackathon.
 */
export default function DemoRoomBadge({ isDemo = true, className = '' }) {
  if (!isDemo) return null;

  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-100 border border-slate-700/80 shadow-xs backdrop-blur-xs ${className}`}
      title="Sample room listing for development"
    >
      Demo Room
    </span>
  );
}
