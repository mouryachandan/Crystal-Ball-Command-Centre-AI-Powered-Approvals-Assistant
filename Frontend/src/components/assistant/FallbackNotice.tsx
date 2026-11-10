import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FallbackNoticeProps {
  message?: string;
}

export const FallbackNotice: React.FC<FallbackNoticeProps> = ({
  message = 'AI Layer operating in Graceful Fallback Mode (Deterministic offline guidance active; 8s threshold protected).',
}) => {
  return (
    <div className="mx-3 my-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-800 flex items-start space-x-2">
      <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
      <div>
        <span className="font-semibold">Offline Fallback Engaged: </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

