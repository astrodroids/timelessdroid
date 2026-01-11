import React from 'react';

interface TerminalProps {
  text: string;
}

const Terminal: React.FC<TerminalProps> = ({ text }) => {
  return (
    <div className="bg-black/60 border border-cyan-dim p-3 rounded flex justify-between items-end relative min-h-[60px]">
      <div className="font-mono text-sm text-green-400 w-full pr-12">
        <span className="block text-xs text-gray-500 mb-1">&gt;_ terminal.exe</span>
        <p className="inline-block break-words w-full">
            <span className="text-cyan font-bold mr-2">G. Droid:</span>
            {text}
            <span className="animate-pulse text-cyan ml-1">|</span>
        </p>
      </div>
    </div>
  );
};

export default Terminal;
