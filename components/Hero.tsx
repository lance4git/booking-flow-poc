import React, { useState } from 'react';
import { ArrowRight, Search, Ship, Calendar, MapPin, Anchor } from 'lucide-react';

interface HeroProps {
  onTrack: (id: string) => void;
  onBook: () => void;
}

const Hero: React.FC<HeroProps> = ({ onTrack, onBook }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'track' | 'schedule'>('book');
  const [trackingInput, setTrackingInput] = useState('');
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'track' && trackingInput.trim()) {
      onTrack(trackingInput.trim());
    } else {
      onBook();
    }
  };

  return (
    <div className="relative bg-nordic-dark h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-50"
          src="https://images.unsplash.com/photo-1494412574643-35d324688b33?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Container terminal"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-nordic-dark/80 via-nordic-dark/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center md:items-start">
        
        <div className="w-full max-w-xl md:max-w-2xl mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-md">
            Digital Logistics, <br/>
            <span className="text-nordic-light">Simplified.</span>
          </h1>
          <p className="text-lg text-gray-100 max-w-lg mx-auto md:mx-0 drop-shadow">
            Instant quotes, real-time tracking, and seamless end-to-end supply chain solutions.
          </p>
        </div>

        {/* Tabbed Search Widget */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
           {/* Tabs */}
           <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('book')}
                className={`flex-1 py-4 text-sm md:text-base font-bold text-center flex items-center justify-center transition-colors ${activeTab === 'book' ? 'bg-white text-nordic border-t-4 border-nordic' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                 <Ship className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Rate & Booking
              </button>
              <button 
                onClick={() => setActiveTab('track')}
                className={`flex-1 py-4 text-sm md:text-base font-bold text-center flex items-center justify-center transition-colors ${activeTab === 'track' ? 'bg-white text-nordic border-t-4 border-nordic' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                 <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Tracking
              </button>
              <button 
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-4 text-sm md:text-base font-bold text-center flex items-center justify-center transition-colors ${activeTab === 'schedule' ? 'bg-white text-nordic border-t-4 border-nordic' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                 <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Schedule
              </button>
           </div>

           {/* Tab Content */}
           <div className="p-6 md:p-8">
              {activeTab === 'book' && (
                 <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Origin</label>
                        <div className="relative">
                            <Anchor className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="City or Port" 
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-nordic focus:border-nordic transition"
                                value={origin}
                                onChange={e => setOrigin(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="hidden md:block text-gray-400 pb-3">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destination</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="City or Port" 
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-nordic focus:border-nordic transition"
                                value={dest}
                                onChange={e => setDest(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded shadow-md transition-colors uppercase tracking-wide">
                        Search Rates
                    </button>
                 </form>
              )}

              {activeTab === 'track' && (
                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-grow w-full">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shipment / Container / B/L Number</label>
                          <input 
                            type="text" 
                            placeholder="e.g., COSU62839123" 
                            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-nordic focus:border-nordic transition uppercase"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                          />
                      </div>
                      <button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded shadow-md transition-colors uppercase tracking-wide">
                          Track
                      </button>
                  </form>
              )}
              
               {activeTab === 'schedule' && (
                 <div className="text-center py-4">
                     <p className="text-gray-500 mb-4">Find vessel schedules by point to point or vessel name.</p>
                     <button onClick={onBook} className="text-nordic font-bold hover:underline">Go to Advanced Schedule Search &rarr;</button>
                 </div>
              )}
           </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium text-white/80">
            <span className="flex items-center"><span className="w-2 h-2 bg-accent rounded-full mr-2"></span> 24/7 Instant Quotes</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> Real-time Visibility</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-nordic-light rounded-full mr-2"></span> Carbon Neutral Options</span>
        </div>

      </div>
    </div>
  );
};

export default Hero;