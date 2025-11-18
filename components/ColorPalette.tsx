import React from 'react';
import { Color } from '../types';

interface Props {
  colors: Color[];
}

const ColorPalette: React.FC<Props> = ({ colors }) => {
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    // Could add a toast here
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-6 font-serif">Color Palette</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {colors.map((color, idx) => (
          <div key={idx} className="group relative cursor-pointer" onClick={() => copyToClipboard(color.hex)}>
            <div 
              className="h-32 w-full rounded-xl shadow-inner mb-3 transition-transform transform group-hover:scale-105" 
              style={{ backgroundColor: color.hex }}
            >
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                 <span className="text-white font-medium text-sm">Copy</span>
               </div>
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-gray-800">{color.hex}</p>
              <p className="text-sm font-semibold text-gray-700">{color.name}</p>
              <p className="text-xs text-gray-500 mt-1">{color.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
