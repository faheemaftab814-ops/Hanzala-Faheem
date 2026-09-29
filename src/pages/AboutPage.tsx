import React from 'react';
import { ShieldCheck, Award, Flame, Snowflake, ArrowRight } from 'lucide-react';
import { ASSETS } from '../lib/seedData';

interface AboutPageProps {
  onNavigateShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateShop }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Our Story & Craft
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Elevating Everyday <br />
            <span className="gold-gradient-text">Hydration in Pakistan</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            At HYDROVA, we believe proper hydration is the bedrock of vitality, focus, and wellness.
            Designed specifically to withstand Pakistan’s harsh summer heat waves and chilly winter mornings,
            our stainless steel tumblers combine industrial-grade vacuum insulation with clean, understated minimalism.
          </p>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Every curve, weld, and thermal barrier is built from heavy-gauge 18/8 kitchen-grade alloy.
            No plastic tastes, no condensation puddles on your wooden desks, and no lukewarm water halfway through your day.
          </p>

          <div className="pt-2">
            <button
              onClick={onNavigateShop}
              className="px-8 py-3.5 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow"
            >
              <span>Explore The Tumbler Range</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#16161c] border border-[#2b2b36] p-3 shadow-2xl">
            <img
              src={ASSETS.hero}
              alt="HYDROVA Tumbler craftsmanship"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-[#121216] border border-[#222228] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Pure 18/8 Steel</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            We exclusively utilize food-grade 304 (18/8) stainless steel. It resists corrosion, eliminates metallic flavors, and will last for years of continuous use.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121216] border border-[#222228] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center">
            <Snowflake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Triple Vacuum Barrier</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            An airless vacuum pocket between the interior and exterior walls eliminates convection. Cold stays cold for 24 hours; piping heat lasts for 12 hours.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121216] border border-[#222228] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Direct & Honest Service</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            With nationwide Cash on Delivery and human support via WhatsApp, our team ensures every Pakistani household enjoys friction-free premium drinkware.
          </p>
        </div>
      </div>
    </div>
  );
};
