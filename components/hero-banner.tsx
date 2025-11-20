'use client';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-80 mb-12 rounded-2xl overflow-hidden group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: 'url(/images/banner-hero.jpg)',
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-purple-900/60 to-black/80" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 text-balance leading-tight drop-shadow-lg">
          HALO WELCOME TO GUSWANSTORE
        </h1>
        <p className="text-lg md:text-xl text-purple-200 text-balance drop-shadow-md">
          premium roblox scripts, and more digital products at affordable prices!
        </p>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/30 to-pink-500/30 via-transparent pointer-events-none" />
      </div>
    </div>
  );
}
