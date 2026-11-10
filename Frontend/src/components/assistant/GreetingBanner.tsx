import React, { useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

export const GreetingBanner: React.FC = () => {
  const { greetingData, fetchGreeting, isLoading } = useAssistantStore();
  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();

  useEffect(() => {
    if (!greetingData) {
      fetchGreeting();
    }
  }, [greetingData, fetchGreeting]);

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else if (greetingData?.greeting) {
      speak(greetingData.greeting);
    }
  };

  return (
    <div className="mx-3 mt-2 mb-1 p-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg text-xs flex flex-col space-y-1.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-purple-700 font-bold text-[11px]">
          <Sparkles size={13} className="text-purple-600 animate-pulse" />
          <span>Dynamic Operator Greeting</span>
        </div>

        <div className="flex items-center space-x-1">
          {isSupported && (
            <button
              onClick={handleSpeak}
              title={isSpeaking ? 'Stop Audio' : 'Play Greeting'}
              className="p-1 hover:bg-purple-100 rounded text-purple-700 transition-colors"
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          )}

          <button
            onClick={() => fetchGreeting()}
            disabled={isLoading}
            title="Regenerate context-aware greeting"
            className="p-1 hover:bg-purple-100 rounded text-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-700 leading-snug">
        {greetingData?.greeting ||
          'Analyzing live approvals queue... Level 2 Drone Patrol Video Demo flagged as critical priority.'}
      </p>

      {greetingData?.queueContext && (
        <div className="text-[10px] font-medium text-purple-600">
          ● {greetingData.queueContext}
        </div>
      )}
    </div>
  );
};

