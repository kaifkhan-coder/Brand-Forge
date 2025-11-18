import React, { useEffect } from 'react';
import { Typography } from '../types';

interface Props {
  typography: Typography;
}

const TypographyCard: React.FC<Props> = ({ typography }) => {
  
  // Dynamically load fonts from Google
  useEffect(() => {
    const loadFont = (fontName: string) => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    
    loadFont(typography.headerFont);
    loadFont(typography.bodyFont);
  }, [typography]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-xl font-semibold mb-6 font-serif">Typography System</h3>
      
      <div className="space-y-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Header Font</span>
          <h2 
            className="text-4xl mt-2 border-b pb-4" 
            style={{ fontFamily: typography.headerFont }}
          >
            {typography.headerFont}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Used for headlines and titles.</p>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Body Font</span>
          <p 
            className="text-lg mt-2 leading-relaxed" 
            style={{ fontFamily: typography.bodyFont }}
          >
            The quick brown fox jumps over the lazy dog. This font, {typography.bodyFont}, 
            is designed to be legible and comfortable for long-form reading sections within your brand materials.
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-bold text-gray-700 mb-1">Designer's Note</h5>
            <p className="text-sm text-gray-600 italic">"{typography.reasoning}"</p>
        </div>
      </div>
    </div>
  );
};

export default TypographyCard;
