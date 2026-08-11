import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header Banner */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-12 text-center sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#707070] uppercase">
            OUR STORY
          </span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
            ABOUT FASHIONIFY
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-[#555555]">
            Crafting minimalist, high-quality apparel designed for timeless style, everyday comfort, and effortless elegance.
          </p>
        </div>
      </section>

      {/* Concise Highlights Grid */}
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="border border-neutral-200 p-6 rounded-lg text-center hover:border-neutral-400 transition-colors shadow-sm">
            <Sparkles className="mx-auto h-7 w-7 text-[#111111]" />
            <h3 className="mt-3 font-bold text-[#111111] uppercase text-sm font-['Plus_Jakarta_Sans']">Premium Quality</h3>
            <p className="mt-2 text-xs text-[#707070] leading-relaxed">Curated materials engineered for durability and style.</p>
          </div>

          <div className="border border-neutral-200 p-6 rounded-lg text-center hover:border-neutral-400 transition-colors shadow-sm">
            <ShieldCheck className="mx-auto h-7 w-7 text-[#111111]" />
            <h3 className="mt-3 font-bold text-[#111111] uppercase text-sm font-['Plus_Jakarta_Sans']">Ethical Sourcing</h3>
            <p className="mt-2 text-xs text-[#707070] leading-relaxed">Sustainable practices and fair manufacturing.</p>
          </div>

          <div className="border border-neutral-200 p-6 rounded-lg text-center hover:border-neutral-400 transition-colors shadow-sm">
            <Heart className="mx-auto h-7 w-7 text-[#111111]" />
            <h3 className="mt-3 font-bold text-[#111111] uppercase text-sm font-['Plus_Jakarta_Sans']">Customer First</h3>
            <p className="mt-2 text-xs text-[#707070] leading-relaxed">Dedicated to a seamless shopping experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
