import React, { useState } from 'react';
import { BrandIdentity, GenerationStep } from './types';
import { generateBrandStrategy, initChatSession } from './services/geminiService';
import { generateLogoImage } from './services/imageService';
import { SparklesIcon, LoadingSpinner } from './components/Icons';

import ColorPalette from './components/ColorPalette';
import TypographyCard from './components/TypographyCard';
import LogoShowcase from './components/LogoShowcase';
import ChatWidget from './components/ChatWidget';

const App = () => {
  const [mission, setMission] = useState('');
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [brandData, setBrandData] = useState<BrandIdentity | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!mission.trim()) return;

    setStep(GenerationStep.STRATEGIZING);
    setErrorMsg(null);
    setBrandData(null);

    try {
      // 1. Text Generation
      const data = await generateBrandStrategy(mission);
      setBrandData(data); // Show partial data (text) immediately

      // Initialize chat with this context
      initChatSession(data);

      // 2. Image Generation
      setStep(GenerationStep.DESIGNING);
      
      // Run image generations in parallel
      const [primaryImg, sec1Img, sec2Img] = await Promise.all([
        generateLogoImage(data.logoPrompts.primary),
        generateLogoImage(data.logoPrompts.secondary1),
        generateLogoImage(data.logoPrompts.secondary2)
      ]);

      setBrandData(prev => prev ? ({
        ...prev,
        images: {
          primary: primaryImg,
          secondary1: sec1Img,
          secondary2: sec2Img
        }
      }) : null);

      setStep(GenerationStep.COMPLETE);

    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong while forging your brand. Please try again.");
      setStep(GenerationStep.ERROR);
    }
  };

  // Render Home / Input Screen
  if (step === GenerationStep.IDLE || (step === GenerationStep.ERROR && !brandData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-center text-gray-900 mb-4">BrandForge AI</h1>
          <p className="text-center text-gray-500 text-lg mb-10">
            Transform your vision into a complete brand identity. Describe your mission, and we'll generate your logos, colors, and typography instantly.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="e.g. We are a sustainable coffee roaster based in Seattle focusing on fair trade beans and cozy, modern community spaces..."
                className="w-full h-40 p-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all text-lg resize-none outline-none"
              />
            </div>
            
            {errorMsg && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm">
                    {errorMsg}
                </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!mission.trim()}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Generate Brand Bible
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Loading / Dashboard Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(GenerationStep.IDLE)}>
            <SparklesIcon className="w-6 h-6 text-blue-600" />
            <span className="font-serif text-xl font-bold text-gray-900">BrandForge AI</span>
          </div>
          
          {step !== GenerationStep.COMPLETE && (
             <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full">
                <LoadingSpinner className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                    {step === GenerationStep.STRATEGIZING ? "Developing Strategy..." : "Designing Assets..."}
                </span>
             </div>
          )}
          
           {step === GenerationStep.COMPLETE && brandData && (
            <button 
                onClick={() => setStep(GenerationStep.IDLE)}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
                New Project
            </button>
           )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {brandData ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Brand Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-5xl font-serif text-gray-900 mb-4">{brandData.companyName}</h1>
                    <p className="text-xl text-gray-500 font-light">{brandData.vibe}</p>
                    <p className="text-sm text-gray-400 mt-4 max-w-xl mx-auto border-t pt-4 border-gray-200">
                        {brandData.mission}
                    </p>
                </div>

                {/* Logos */}
                <LogoShowcase 
                    images={brandData.images || { primary: null, secondary1: null, secondary2: null }} 
                    prompts={brandData.logoPrompts}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colors */}
                    <div className="lg:col-span-2">
                        <ColorPalette colors={brandData.colors} />
                    </div>
                    
                    {/* Typography */}
                    <div className="lg:col-span-1">
                        <TypographyCard typography={brandData.typography} />
                    </div>
                </div>
            </div>
        ) : (
            // Fallback empty state if step is loading but no data yet (rare race condition handling)
            <div className="h-96 flex items-center justify-center">
                <LoadingSpinner className="w-10 h-10 text-gray-300" />
            </div>
        )}
      </main>

      {/* Chat Bot */}
      {step === GenerationStep.COMPLETE && brandData && (
        <ChatWidget companyName={brandData.companyName} />
      )}
    </div>
  );
};

export default App;
