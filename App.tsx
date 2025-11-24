import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import TrackingResult from './components/TrackingResult';
import BookingFlow from './components/BookingFlow';
import AIChatAssistant from './components/AIChatAssistant';
import Footer from './components/Footer';
import { ViewState, ShipmentData } from './types';

// Mock data generator
const getMockShipmentData = (id: string): ShipmentData => {
  const now = new Date();
  // Deterministic "randomness" based on ID char codes for demo consistency
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isCompleted = hash % 2 === 0;
  
  return {
    id: id.toUpperCase(),
    origin: 'Shanghai, CN',
    destination: 'Rotterdam, NL',
    eta: isCompleted ? 'Delivered' : 'Oct 24, 2024',
    status: isCompleted ? 'Delivered' : 'In Transit',
    progress: isCompleted ? 100 : 65,
    events: [
      {
        date: 'Oct 02, 2024 08:30',
        location: 'Shanghai, CN',
        description: 'Gate In Full',
        status: 'Completed',
        icon: 'check'
      },
      {
        date: 'Oct 04, 2024 14:15',
        location: 'Shanghai Port',
        description: 'Vessel Departed',
        status: 'Completed',
        icon: 'ship'
      },
      {
        date: 'Oct 12, 2024 09:00',
        location: 'Singapore',
        description: 'Transshipment arrived',
        status: 'Completed',
        icon: 'check'
      },
      {
        date: 'Oct 15, 2024',
        location: 'Indian Ocean',
        description: 'En route to Suez',
        status: 'Active',
        icon: 'ship'
      },
      {
        date: 'Est. Oct 24, 2024',
        location: 'Rotterdam, NL',
        description: 'Vessel Arrival',
        status: 'Pending',
        icon: 'check'
      }
    ]
  };
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [trackingData, setTrackingData] = useState<ShipmentData | null>(null);

  const handleTrack = (id: string) => {
    // In a real app, fetch from API. Here, generate mock data.
    const data = getMockShipmentData(id);
    setTrackingData(data);
    setCurrentView(ViewState.TRACKING);
    window.scrollTo(0, 0);
  };

  const handleBook = () => {
    setCurrentView(ViewState.BOOKING);
    window.scrollTo(0, 0);
  };

  const handleNavChange = (view: ViewState) => {
    setCurrentView(view);
    if (view === ViewState.HOME) {
        window.scrollTo(0, 0);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.TRACKING:
        return trackingData ? (
          <div className="min-h-screen bg-gray-50">
             <TrackingResult data={trackingData} onClose={() => setCurrentView(ViewState.HOME)} />
             <ServicesGrid onBook={handleBook} /> 
          </div>
        ) : (
          // Fallback if someone navigates to tracking without an ID (nav click)
          <div className="min-h-screen">
            <Hero onTrack={handleTrack} onBook={handleBook} />
            <ServicesGrid onBook={handleBook} />
          </div>
        );
      case ViewState.BOOKING:
        return (
          <BookingFlow onComplete={handleTrack} />
        );
      case ViewState.SERVICES:
        return (
            <div className="pt-8">
                <ServicesGrid onBook={handleBook} />
                <div className="bg-nordic text-white py-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to ship?</h2>
                    <button onClick={handleBook} className="bg-white text-nordic font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition">Get a Quote</button>
                </div>
            </div>
        );
      case ViewState.SUSTAINABILITY:
        return (
           <div className="min-h-screen bg-white">
               <div className="bg-[#004B49] text-white py-24 px-4">
                   <div className="max-w-4xl mx-auto text-center">
                       <h1 className="text-5xl font-bold mb-6">Towards Zero</h1>
                       <p className="text-xl opacity-90">We are committed to net-zero emissions across our entire business by 2040.</p>
                   </div>
               </div>
               <div className="max-w-5xl mx-auto py-16 px-4">
                   <div className="grid md:grid-cols-2 gap-12 items-center">
                       <img src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2041&q=80" className="rounded-lg shadow-xl" alt="Green energy" />
                       <div>
                           <h3 className="text-3xl font-bold text-nordic mb-4">Green Fuels</h3>
                           <p className="text-gray-600 leading-relaxed mb-6">
                               The technology to decarbonize shipping exists. We are investing heavily in green methanol vessels and infrastructure to lead the way for the industry.
                           </p>
                           <button className="text-nordic font-bold hover:underline">Read our ESG Report &rarr;</button>
                       </div>
                   </div>
               </div>
           </div>
        );
      case ViewState.HOME:
      default:
        return (
          <>
            <Hero onTrack={handleTrack} onBook={handleBook} />
            <ServicesGrid onBook={handleBook} />
            {/* Banner */}
            <div className="bg-nordic-dark py-16 px-4 border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold text-white mb-2">Stay ahead of the curve</h2>
                        <p className="text-gray-400">Get the latest market insights delivered to your inbox.</p>
                    </div>
                    <div className="flex w-full md:w-auto">
                        <input type="email" placeholder="Enter your email" className="p-3 rounded-l-md w-full md:w-64 focus:outline-none text-gray-900" />
                        <button className="bg-nordic text-white font-bold px-6 rounded-r-md hover:bg-nordic-light transition">Subscribe</button>
                    </div>
                </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Header currentView={currentView} onChangeView={handleNavChange} />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <AIChatAssistant />
      <Footer />
    </div>
  );
};

export default App;