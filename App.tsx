import React from 'react';
import { useLiveAudio } from './hooks/useLiveAudio';
import AudioVisualizer from './components/AudioVisualizer';
import Terminal from './components/Terminal';
import { ConnectionStatus } from './types';

const App: React.FC = () => {
  const { connect, disconnect, status, terminalText, analyser } = useLiveAudio();

  const handleMicClick = () => {
    if (status === ConnectionStatus.CONNECTED || status === ConnectionStatus.CONNECTING) {
      disconnect();
    } else {
      connect();
    }
  };

  const isConnected = status === ConnectionStatus.CONNECTED;
  const isConnecting = status === ConnectionStatus.CONNECTING;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 border-b border-cyan-dim bg-dark-deep/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              alt="Timeless Droid Logo" 
              className="h-12 w-12 rounded-full border border-cyan shadow-neon" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_ocRJ5TWu5EhGDMyupnsRJ4YZSFT3V0tDLtb1d7yJcg0uh79Jy9WjMHCw5qD0dRGiMqykXm7s2ozPrZ0n5-FtJ8YIaUkTq2D86sqrIMAjyuwY9yTspGl8KdWn9PyDm9utI3B43OlZceeLK6myIclDOX09-QPyxbT-yZpm_w4EQtUn0aGLpuBOgJ2GECLdxvbFCrVHh5fmAnUAJKaTLlb9A7bUmXDC05dPYDEuZwdtltnFGHyT9_GHqdEFE7uOQjRKa-32kRk-8Bum"
            />
            <div className="flex flex-col">
              <span className="font-orbitron font-bold text-xl tracking-widest text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">TIMELESS DROID</span>
              <span className="text-xs text-cyan tracking-[0.2em] font-bold">AI SYSTEM ONLINE</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['HOME', 'MUSIC', 'VIDEOS', 'GALLERY', 'ABOUT'].map((item) => (
              <a key={item} className="font-orbitron text-sm tracking-widest hover:text-cyan hover:shadow-neon-text transition-all duration-300" href="#">{item}</a>
            ))}
          </nav>

          <a className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full border border-cyan text-cyan hover:bg-cyan hover:text-black transition-all duration-300 font-orbitron text-sm font-bold shadow-neon" href="#">
            <i className="fa-brands fa-instagram"></i>
            <span>@astrodroids</span>
          </a>
          
          <button className="md:hidden text-cyan text-2xl">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
          
          {/* HERO SECTION (Interactive) */}
          <section className="hud-panel lg:col-span-2 p-6 flex flex-col md:flex-row gap-6 items-center scanlines relative">
            <span className="corner-bracket corner-tl"></span>
            <span className="corner-bracket corner-tr"></span>
            <span className="corner-bracket corner-bl"></span>
            <span className="corner-bracket corner-br"></span>

            {/* Left: Badge */}
            <div className="w-full md:w-5/12 flex justify-center items-center">
              <div className="relative group">
                <div className={`absolute inset-0 bg-cyan blur-2xl opacity-20 transition-opacity duration-500 rounded-full ${isConnected ? 'animate-pulse' : ''}`}></div>
                <img 
                  alt="Hero Badge" 
                  className="relative z-10 w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2s2BtQsOwVPuLwTIhboDDR5QPVNPOMdkSeBoHikYRC9zGkTHaKR6_v6TTMmIzzuS9eNF3ek33njkrwvJlaGw8MmWr_IooxvrALDhJDXLsU_AGGp_OgkkGyw-wVOPG8Ntmm_mwJHnusx7c8QRF-is-Nv4F0r6Gbv6wYbThT3hPZWSxv0cdoW9yN2Y4M0-EY2fgK53QdcQhU0J-yoVbO5MU-J-UAl8R60WNYlDKI4ubZ-rcdelY0nVbjtkViUUgk16F_VzIgEFf_4qW"
                />
              </div>
            </div>

            {/* Right: Interface */}
            <div className="w-full md:w-7/12 flex flex-col justify-between h-full space-y-4">
              <div className="border-l-2 border-cyan pl-4">
                <h3 className="text-xs font-orbitron text-gray-400 tracking-widest mb-1">SYSTEM ONLINE // V.2.0.4</h3>
                <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white uppercase tracking-wide leading-none drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                  Native Audio <span className="text-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">AI</span>
                </h1>
                <h2 className="text-lg font-rajdhani font-bold text-blue-300 uppercase mt-1 tracking-wider">
                  G. Droid &amp; Rick Gillespie
                </h2>
              </div>

              {/* Visualizer */}
              <div className="w-full h-24 relative overflow-hidden rounded bg-black/30 border border-cyan-dim/20">
                <AudioVisualizer analyser={analyser} isConnected={isConnected} />
                <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan">Hz: 44100</div>
              </div>

              {/* Terminal & Mic Button */}
              <div className="relative">
                <Terminal text={terminalText} />
                
                <button 
                  onClick={handleMicClick}
                  disabled={isConnecting}
                  className={`absolute bottom-2 right-2 h-10 w-10 flex items-center justify-center rounded border transition-all shadow-neon group z-20 
                    ${isConnected ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : 'border-cyan text-cyan hover:bg-cyan hover:text-black'}
                    ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <i className={`fa-solid ${isConnected ? 'fa-microphone-slash' : 'fa-microphone'} group-hover:scale-110 transition-transform`}></i>
                </button>
              </div>
            </div>
          </section>

          {/* New Release */}
          <section className="hud-panel flex flex-col justify-between h-full pt-10 px-6 pb-6">
             <span className="corner-bracket corner-tl"></span>
             <span className="corner-bracket corner-tr"></span>
             <span className="corner-bracket corner-bl"></span>
             <span className="corner-bracket corner-br"></span>
             
             <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h3 className="font-orbitron font-bold text-lg text-white tracking-widest">NEW RELEASE</h3>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Distrokid</span>
             </div>
             
             <div className="flex-grow flex flex-col items-center justify-center gap-4">
               <div className="relative w-full aspect-square max-w-[220px] mx-auto group cursor-pointer">
                 <div className="absolute inset-0 border border-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded scale-105"></div>
                 <img alt="New Album Art" className="w-full h-full object-cover rounded shadow-2xl group-hover:sepia-[.3] transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjNlIa-rps5JD-nK-JD2i7ZG1-QRopWhKh_eBbEnQqnzw9a5zCGSPSIdqeROioqViQQpZPcgI1rLQ5KSEMy5cYZoKhAjFXQVYRTNzoK7oHcF6mc1tk_O5KMnnD9xRjHXdWwhj2RxA4ZFmQVXTj0ktlkAVemYeEvklPA02Xpa1uma-mAdqMXN3W0D1uvAv7DCKk7io1dvVaGzHENtgALHxoJRl1-QBbOEZ0gE7SDwpTyJORS0EhviG6Vc3nouINEMrqV2TsQajNwTYB" />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <i className="fa-solid fa-compact-disc text-4xl text-cyan drop-shadow-lg"></i>
                 </div>
               </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-white/10 text-center">
               <p className="text-xs font-orbitron text-cyan mb-3 tracking-[0.2em] animate-pulse">NOW AVAILABLE</p>
               <div className="flex justify-center gap-6 text-2xl text-gray-400">
                  <a className="hover:text-[#1DB954] transition-colors" href="#"><i className="fa-brands fa-spotify"></i></a>
                  <a className="hover:text-[#FA243C] transition-colors" href="#"><i className="fa-brands fa-apple"></i></a>
                  <a className="hover:text-[#FF0000] transition-colors" href="#"><i className="fa-brands fa-youtube"></i></a>
               </div>
             </div>
          </section>

          {/* Album List */}
          <section className="hud-panel lg:col-span-2 p-6 flex flex-col">
            <span className="corner-bracket corner-tl"></span>
            <span className="corner-bracket corner-tr"></span>
            <span className="corner-bracket corner-bl"></span>
            <span className="corner-bracket corner-br"></span>
            
            <h3 className="font-orbitron font-bold text-lg text-white tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-list-ul text-cyan text-sm"></i> THE ALBUM EXPERIENCE
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div className="w-full md:w-32 flex-shrink-0 hidden md:block">
                <img alt="Small Album Art" className="w-full h-auto rounded border border-white/20 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjNlIa-rps5JD-nK-JD2i7ZG1-QRopWhKh_eBbEnQqnzw9a5zCGSPSIdqeROioqViQQpZPcgI1rLQ5KSEMy5cYZoKhAjFXQVYRTNzoK7oHcF6mc1tk_O5KMnnD9xRjHXdWwhj2RxA4ZFmQVXTj0ktlkAVemYeEvklPA02Xpa1uma-mAdqMXN3W0D1uvAv7DCKk7io1dvVaGzHENtgALHxoJRl1-QBbOEZ0gE7SDwpTyJORS0EhviG6Vc3nouINEMrqV2TsQajNwTYB" />
                <div className="mt-2 text-center text-xs font-mono text-gray-400">STATUS: READY</div>
              </div>
              
              <div className="flex-grow space-y-2">
                 {[
                   { id: '01', title: 'Album Sebst', time: '3:42' },
                   { id: '02', title: 'The Frection', time: '4:10' },
                   { id: '03', title: 'Blonthy Boys', time: '2:55' },
                 ].map(track => (
                   <div key={track.id} className="group flex items-center justify-between p-3 bg-white/5 hover:bg-cyan/10 border border-transparent hover:border-cyan/30 rounded transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                       <span className="font-mono text-cyan text-sm w-6">{track.id}</span>
                       <span className="font-rajdhani font-bold text-lg tracking-wide group-hover:text-cyan transition-colors">{track.title}</span>
                     </div>
                     <span className="font-mono text-xs text-gray-400">{track.time}</span>
                   </div>
                 ))}
              </div>
            </div>
          </section>

          {/* Featured Video */}
          <section className="hud-panel p-6 flex flex-col h-full">
            <span className="corner-bracket corner-tl"></span>
            <span className="corner-bracket corner-tr"></span>
            <span className="corner-bracket corner-bl"></span>
            <span className="corner-bracket corner-br"></span>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-orbitron font-bold text-lg text-white tracking-widest">TRACKLIST</h3>
              <i className="fa-solid fa-video text-cyan/50"></i>
            </div>
            
            <div className="relative w-full h-full min-h-[200px] bg-black rounded border border-white/10 overflow-hidden group cursor-pointer">
              <img alt="Video Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2BqQaXtMTdYF7HDjGgFmoOaF_rPrybKWMa8nJ1zRj6paKyd32b0b4m4V27TzuTueHI4V5iGXQnZF_-vyScshv6o0Gwct3TrZbndIkT8winUqJoob4oLbsdva00kRpO3jOlPvAvxEiv0Wf-aupXvRuwPQH9RxVChZjaU_RqSr7tGsNKrfrJtoNWmUrqcdANte-PstWECLPHcwEOodcoj9Sqcjlku1necGLROz-usTMiUIkgM-mxr_1gbqNn-DI07s1mADWbWl9GeAG" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-play text-white text-xl pl-1"></i>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-3">
                <p className="font-rajdhani font-bold text-white text-lg leading-tight">Cyborg Genesis</p>
                <p className="font-mono text-xs text-gray-400">Official Music Video</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-cyan-dim bg-dark-deep/90 mt-8 opacity-70">
        <p className="font-rajdhani text-sm text-gray-500">
          © 2023 TIMELESS DROID. All Systems Operational. <span className="text-cyan">Constructed by AI.</span>
        </p>
      </footer>
    </>
  );
};

export default App;
