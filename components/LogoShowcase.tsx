import React from 'react';
import { DownloadIcon } from './Icons';

interface Props {
  images: {
    primary: string | null;
    secondary1: string | null;
    secondary2: string | null;
  };
  prompts: {
    primary: string;
    secondary1: string;
    secondary2: string;
  };
}

const LogoShowcase: React.FC<Props> = ({ images, prompts }) => {
  const downloadImage = (url: string | null, name: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Primary Logo */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 font-serif">Primary Logomark</h3>
        <div className="flex-grow bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-4 aspect-square relative group">
          {images.primary ? (
            <>
              <img src={images.primary} alt="Primary Logo" className="w-full h-full object-contain p-4" />
              <button 
                onClick={() => downloadImage(images.primary, 'primary-logo')}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                title="Download"
              >
                <DownloadIcon className="w-5 h-5 text-gray-700" />
              </button>
            </>
          ) : (
            <div className="animate-pulse w-full h-full bg-gray-200"></div>
          )}
        </div>
        <p className="text-xs text-gray-400 line-clamp-2" title={prompts.primary}>{prompts.primary}</p>
      </div>

      {/* Secondary Marks */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 font-serif">Secondary Icon</h3>
            <div className="flex-grow bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-4 aspect-square relative group">
              {images.secondary1 ? (
                <>
                  <img src={images.secondary1} alt="Secondary Icon" className="w-full h-full object-contain p-8" />
                   <button 
                    onClick={() => downloadImage(images.secondary1, 'secondary-icon')}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                  >
                    <DownloadIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              ) : (
                <div className="animate-pulse w-full h-full bg-gray-200"></div>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-2" title={prompts.secondary1}>{prompts.secondary1}</p>
         </div>
         
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 font-serif">Wordmark / Badge</h3>
            <div className="flex-grow bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-4 aspect-square relative group">
              {images.secondary2 ? (
                <>
                  <img src={images.secondary2} alt="Badge" className="w-full h-full object-contain p-8" />
                   <button 
                    onClick={() => downloadImage(images.secondary2, 'badge-logo')}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                  >
                    <DownloadIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              ) : (
                 <div className="animate-pulse w-full h-full bg-gray-200"></div>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-2" title={prompts.secondary2}>{prompts.secondary2}</p>
         </div>
      </div>
    </div>
  );
};

export default LogoShowcase;
