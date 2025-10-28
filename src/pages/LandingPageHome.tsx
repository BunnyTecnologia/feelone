import React from 'react';
import LandingHeader from '@/components/LandingHeader';
import RescueForm from '@/components/RescueForm';
import SponsorsSection from '@/components/SponsorsSection';
import { Button } from '@/components/ui/button';
import DesktopOnlyWrapper from '@/components/DesktopOnlyWrapper';

const LandingPageHome = () => {
  return (
    <DesktopOnlyWrapper>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <LandingHeader />

        {/* Hero Section */}
        <section className="py-16 border-b border-dashed border-blue-500/50">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h1 className="text-5xl font-extrabold text-blue-900 dark:text-blue-400 leading-tight">
                FeelOne: Compartilhe seus dados com um toque
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
                Basta encostar a pulseira em um celular com tecnologia NFC para compartilhar instantaneamente seus contatos, redes sociais, portfólio e mais.
              </p>
              
              {/* Pulseiras Placeholder */}
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 rounded-lg">
                [Pulseiras FeelOne Placeholder]
              </div>
            </div>

            {/* Image/App Screenshot Placeholder */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm h-[400px] bg-gray-300 dark:bg-gray-700 rounded-xl shadow-2xl flex items-center justify-center text-gray-500">
                [Imagem/Screenshot do App Placeholder]
              </div>
            </div>
          </div>
        </section>

        {/* Rescue Form Section */}
        <RescueForm />

        {/* Mobile Mockups Section */}
        <section className="py-16 border-t border-dashed border-blue-500/50">
          <div className="max-w-6xl mx-auto px-4 flex justify-around">
            {/* Mockup 1 */}
            <div className="w-48 h-96 border-4 border-black rounded-[3rem] flex items-center justify-center bg-white dark:bg-gray-800 shadow-xl">
              <div className="w-44 h-80 border border-gray-300 rounded-[2.5rem]"></div>
            </div>
            {/* Mockup 2 */}
            <div className="w-48 h-96 border-4 border-black rounded-[3rem] flex items-center justify-center bg-white dark:bg-gray-800 shadow-xl mx-8">
              <div className="w-44 h-80 border border-gray-300 rounded-[2.5rem]"></div>
            </div>
            {/* Mockup 3 */}
            <div className="w-48 h-96 border-4 border-black rounded-[3rem] flex items-center justify-center bg-white dark:bg-gray-800 shadow-xl">
              <div className="w-44 h-80 border border-gray-300 rounded-[2.5rem]"></div>
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <SponsorsSection />
      </div>
    </DesktopOnlyWrapper>
  );
};

export default LandingPageHome;