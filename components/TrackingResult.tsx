import React from 'react';
import { ShipmentData, TrackingEvent } from '../types';
import { CheckCircle, Circle, Truck, Ship, MapPin, AlertTriangle } from 'lucide-react';

interface TrackingResultProps {
  data: ShipmentData;
  onClose: () => void;
}

const TrackingResult: React.FC<TrackingResultProps> = ({ data, onClose }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={onClose}
        className="mb-6 text-sm text-gray-500 hover:text-nordic flex items-center"
      >
        ← Back to search
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-nordic p-6 text-white flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Shipment {data.id}</h2>
            <p className="text-nordic-light opacity-90">Via Ocean • Standard Dry Container</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
             <div className="text-3xl font-bold">{data.status}</div>
             <div className="text-sm opacity-80">ETA: {data.eta}</div>
          </div>
        </div>

        {/* Route Map Visualization (Placeholder) */}
        <div className="bg-gray-100 h-48 relative flex items-center justify-center border-b border-gray-200">
           <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#42B0D5 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           <div className="flex items-center space-x-8 z-10">
              <div className="text-center">
                  <div className="font-bold text-nordic text-lg">{data.origin}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Origin</div>
              </div>
              <div className="w-32 md:w-64 h-1 bg-gray-300 relative rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-nordic-light" style={{ width: `${data.progress}%` }}></div>
              </div>
              <div className="text-center">
                  <div className="font-bold text-nordic text-lg">{data.destination}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Destination</div>
              </div>
           </div>
        </div>

        {/* Timeline Events */}
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Shipment Milestones</h3>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {data.events.map((event, index) => (
              <div key={index} className="relative flex items-start group is-active">
                
                {/* Icon Container */}
                <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200 group-hover:border-nordic transition-colors z-10">
                   {event.status === 'Completed' ? (
                       <CheckCircle className="w-6 h-6 text-green-500" />
                   ) : event.status === 'Active' ? (
                       <div className="w-4 h-4 bg-nordic-light rounded-full animate-pulse" />
                   ) : (
                       <Circle className="w-5 h-5 text-gray-300" />
                   )}
                </div>

                {/* Content */}
                <div className="ml-16 w-full">
                    <div className="flex flex-col md:flex-row md:justify-between">
                        <div>
                            <h4 className="text-base font-bold text-gray-900">{event.description}</h4>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" /> {event.location}
                            </p>
                        </div>
                        <div className="mt-1 md:mt-0 text-sm text-gray-500 font-medium">
                            {event.date}
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingResult;