
import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Package, ArrowRight, Ship, Clock, 
  DollarSign, CheckCircle, AlertCircle, Info, Shield, 
  FileCheck, Leaf, Truck, User, Mail, ChevronRight, ChevronLeft, 
  CreditCard, Box, Train, Anchor, Warehouse, Star, Settings, PlusCircle, Check, XCircle, Route, Search, Plus
} from 'lucide-react';

interface BookingFlowProps {
  onComplete: (trackingId: string) => void;
}

interface Schedule {
  id: string;
  vessel: string;
  voyage: string;
  pol: string;
  pod: string;
  departure: string;
  arrival: string;
  transitTime: string;
  price: number;
  co2: string;
  type: string;
  tags?: string[];
}

type ServiceCategory = 'ORIGIN' | 'JOURNEY' | 'DESTINATION';

interface AdditionalService {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  benefit: string;
  price: number;
  icon: React.ElementType;
  promoted?: boolean;
  type?: 'customs' | 'transport' | 'addon';
}

// Mock Data for Nearby Ports and Trucking Availability
interface PortConnection {
  portName: string;
  distance: string;
  hasTruckService: boolean;
  truckingCost: number;
  transitHours: number;
  isSystemDefault?: boolean;
}

// System only knows these by default (Limitation Simulation)
const DEFAULT_CONNECTIONS: Record<string, PortConnection[]> = {
  'Shanghai Factory ABC': [
    { portName: 'Shanghai Port', distance: '45 km', hasTruckService: true, truckingCost: 350, transitHours: 2, isSystemDefault: true },
  ],
  'Hamburger Factory ABC': [
    { portName: 'Hamburger Port', distance: '30 km', hasTruckService: true, truckingCost: 400, transitHours: 1, isSystemDefault: true },
  ]
};

// Data available if user manually queries/adds these ports
const EXTRA_PORT_DATA: Record<string, Partial<PortConnection>> = {
  'Nanjing': { distance: '280 km', hasTruckService: true, truckingCost: 600, transitHours: 5 },
  'Nanjing Port': { distance: '280 km', hasTruckService: true, truckingCost: 600, transitHours: 5 },
  'Xitang': { distance: '80 km', hasTruckService: false, truckingCost: 0, transitHours: 0 },
  'Xitang Port': { distance: '80 km', hasTruckService: false, truckingCost: 0, transitHours: 0 },
  'Cheese': { distance: '120 km', hasTruckService: true, truckingCost: 550, transitHours: 3 },
  'Cheese Port': { distance: '120 km', hasTruckService: true, truckingCost: 550, transitHours: 3 },
  'Fish': { distance: '90 km', hasTruckService: false, truckingCost: 0, transitHours: 0 },
  'Fish Port': { distance: '90 km', hasTruckService: false, truckingCost: 0, transitHours: 0 },
};

const ADDITIONAL_SERVICES: AdditionalService[] = [
  // Origin Services
  { 
    id: 'trucking_origin', 
    category: 'ORIGIN',
    title: 'Origin Trucking (Export)', 
    description: 'Pickup from shipper facility to port.', 
    benefit: 'Door-to-Port',
    price: 450, 
    icon: Truck,
    type: 'transport'
  },
  { 
    id: 'rail_origin', 
    category: 'ORIGIN',
    title: 'Origin Rail Service', 
    description: 'Eco-friendly inland transport to port.', 
    benefit: 'Eco & Cost',
    price: 300, 
    icon: Train,
    type: 'transport'
  },
  { 
    id: 'customs_export', 
    category: 'ORIGIN',
    title: 'Export Customs', 
    description: 'Export filing with local authorities.', 
    benefit: 'Compliance',
    price: 120, 
    icon: FileCheck,
    promoted: true,
    type: 'customs'
  },

  // Journey Services
  { 
    id: 'insurance', 
    category: 'JOURNEY',
    title: 'Value Protect', 
    description: 'Extended cargo liability coverage.', 
    benefit: 'Safety',
    price: 45, 
    icon: Shield,
    type: 'addon'
  },
  { 
    id: 'eco', 
    category: 'JOURNEY',
    title: 'Eco Delivery', 
    description: 'Reduce carbon footprint with biofuel.', 
    benefit: 'Sustainability',
    price: 250, 
    icon: Leaf,
    promoted: true,
    type: 'addon'
  },

  // Destination Services
  { 
    id: 'customs_import', 
    category: 'DESTINATION',
    title: 'Import Customs', 
    description: 'Customs entry at destination.', 
    benefit: 'Clearance',
    price: 150, 
    icon: FileCheck,
    promoted: true,
    type: 'customs'
  },
  { 
    id: 'trucking_dest', 
    category: 'DESTINATION',
    title: 'Destination Trucking', 
    description: 'Final mile delivery to consignee door.', 
    benefit: 'Port-to-Door',
    price: 550, 
    icon: Truck,
    type: 'transport'
  },
  { 
    id: 'rail_dest', 
    category: 'DESTINATION',
    title: 'Destination Rail', 
    description: 'Long-haul inland transport from port.', 
    benefit: 'Long-haul',
    price: 380, 
    icon: Train,
    type: 'transport'
  },
];

type LocationType = 'PORT' | 'DOOR';

interface ServiceCardProps {
  service: AdditionalService;
  isSelected: boolean;
  onToggle: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`
      relative rounded border transition-all duration-200 cursor-pointer group bg-white
      ${isSelected 
        ? 'border-nordic ring-1 ring-nordic shadow-sm' 
        : 'border-gray-200 hover:border-nordic hover:shadow-md'}
    `}
  >
     {service.promoted && (
        <div className={`absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded-bl ${isSelected ? 'bg-nordic text-white' : 'bg-gray-100 text-gray-500'}`}>
           Recommended
        </div>
     )}
     
     <div className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded flex-shrink-0 ${isSelected ? 'bg-nordic/10 text-nordic' : 'bg-gray-50 text-gray-400 group-hover:text-nordic'}`}>
           <service.icon className="w-5 h-5" />
        </div>

        <div className="flex-grow">
           <div className="flex justify-between items-center mb-1">
              <h4 className={`text-sm font-bold ${isSelected ? 'text-nordic' : 'text-gray-800'}`}>
                {service.title}
              </h4>
              <span className="text-sm font-bold text-gray-900">
                ${service.price}
              </span>
           </div>
           
           <p className="text-xs text-gray-500 leading-relaxed mb-2">
             {service.description}
           </p>
           
           <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 font-medium">
                    {service.benefit}
                </span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-nordic border-nordic' : 'border-gray-300'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
           </div>
        </div>
     </div>
  </div>
);

const BookingFlow: React.FC<BookingFlowProps> = ({ onComplete }) => {
  // 1 = Search, 1.5 = Route Optimization, 2 = Schedule...
  const [step, setStep] = useState<number>(1);
  
  // Form State
  const [formData, setFormData] = useState({
    origin: 'Shanghai Factory ABC',
    destination: 'Hamburger Factory ABC',
    date: '',
    commodity: 'General Cargo',
    containerType: '40 Dry Standard',
    shipperName: '',
    shipperEmail: '',
    consigneeName: '',
  });

  // E2E Configuration
  const [originType, setOriginType] = useState<LocationType>('DOOR');
  const [destType, setDestType] = useState<LocationType>('DOOR');

  // Step 1.5: Route Optimization State
  const [activePols, setActivePols] = useState<string[]>([]);
  const [activePods, setActivePods] = useState<string[]>([]);
  const [originConnections, setOriginConnections] = useState<PortConnection[]>([]);
  const [destConnections, setDestConnections] = useState<PortConnection[]>([]);

  // Inputs for adding manual ports
  const [manualOriginInput, setManualOriginInput] = useState('');
  const [manualDestInput, setManualDestInput] = useState('');

  // Step 2 Temporary Configuration (Scenario Planning)
  const [scenarioOriginType, setScenarioOriginType] = useState<LocationType>('PORT');
  const [scenarioDestType, setScenarioDestType] = useState<LocationType>('PORT');
  const [scenarioIncludeCustoms, setScenarioIncludeCustoms] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [generatedId, setGeneratedId] = useState<string>('');

  // Generated Schedules based on active Pols/Pods
  const [visibleSchedules, setVisibleSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    if (step === 2) {
        setScenarioOriginType(originType);
        setScenarioDestType(destType);
        generateSchedules();
    }
  }, [step, originType, destType, activePols, activePods]);

  useEffect(() => {
    const newSelected = [...selectedServices];
    if (originType === 'DOOR') {
       if (!newSelected.includes('trucking_origin') && !newSelected.includes('rail_origin')) {
          newSelected.push('trucking_origin');
       }
    }
    if (destType === 'DOOR') {
        if (!newSelected.includes('trucking_dest') && !newSelected.includes('rail_dest')) {
           newSelected.push('trucking_dest');
        }
    }
    setSelectedServices(newSelected);
  }, [originType, destType, step]); 

  const generateSchedules = () => {
    const results: Schedule[] = [];
    
    // Logic: Generate combinations based on selected Ports (POLs) and PODs
    // Default/Fallback if nothing selected
    const pols = activePols.length > 0 ? activePols : ['Shanghai Port'];
    const pods = activePods.length > 0 ? activePods : ['Hamburger Port'];

    let idCounter = 100;

    pols.forEach(pol => {
        pods.forEach(pod => {
            // Clean up name for logic checks
            const cleanPol = pol.replace(' Port', '');
            const cleanPod = pod.replace(' Port', '');

            // Base Schedule Logic for Demo
            let vessel = 'Nordic Queen';
            let price = 1800;
            let transit = 24;
            let voyage = '243E';
            let type = 'Direct';
            const tags = [];

            if (cleanPol === 'Nanjing') {
                vessel = 'Nordic Feeder 2';
                price = 1650; // Cheaper from Nanjing?
                transit = 28; // Slower
                tags.push('Transshipment via Shanghai');
                type = 'Combined Transport';
            }

            if (cleanPod === 'Cheese') {
                price += 100;
                transit += 2;
            }

            // Specific overrides for the user's requested routes
            if (cleanPol === 'Shanghai' && cleanPod === 'Hamburger') {
                // Route A
                vessel = 'Nordic Copenhagen';
                price = 1850;
                transit = 23;
                tags.push('Fastest');
            } else if (cleanPol === 'Nanjing' && cleanPod === 'Hamburger') {
                // Route B
                vessel = 'Yangtze Spirit';
                price = 1720;
                transit = 27;
                tags.push('Eco Saver');
            } else if (cleanPol === 'Nanjing' && cleanPod === 'Cheese') {
                // Route C
                vessel = 'Yangtze Spirit';
                voyage = '998A';
                price = 1950;
                transit = 30;
                tags.push('Max Coverage');
            } else if (cleanPol === 'Shanghai' && cleanPod === 'Cheese') {
                // Implicit Option
                vessel = 'Nordic Copenhagen';
                price = 2100;
                transit = 26;
            }

            results.push({
                id: `SCH-${idCounter++}`,
                vessel,
                voyage,
                pol: pol.includes('Port') ? pol : `${pol} Port`,
                pod: pod.includes('Port') ? pod : `${pod} Port`,
                departure: '2024-11-05',
                arrival: `2024-11-${5 + transit}`,
                transitTime: `${transit} Days`,
                price,
                co2: transit < 25 ? 'Low' : 'Normal',
                type,
                tags
            });
        });
    });

    setVisibleSchedules(results);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // INTERVENTION: For Door-to-Door moves, always offer optimization step 
    // because system data might be incomplete.
    const originOpts = DEFAULT_CONNECTIONS[formData.origin];
    const destOpts = DEFAULT_CONNECTIONS[formData.destination];

    if (originType === 'DOOR' || destType === 'DOOR') {
        setOriginConnections(originOpts || []);
        setDestConnections(destOpts || []);
        
        // Pre-select valid trucking routes from default system knowledge
        if (originOpts) setActivePols(originOpts.filter(p => p.hasTruckService).map(p => p.portName));
        if (destOpts) setActivePods(destOpts.filter(p => p.hasTruckService).map(p => p.portName));
        
        setStep(1.5); // Go to Route Optimization
    } else {
        setStep(2);
    }
    window.scrollTo(0, 0);
  };

  const togglePol = (name: string) => {
    setActivePols(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);
  };

  const togglePod = (name: string) => {
    setActivePods(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);
  };

  const handleAddPort = (type: 'ORIGIN' | 'DESTINATION') => {
    const input = type === 'ORIGIN' ? manualOriginInput : manualDestInput;
    if (!input.trim()) return;

    // Look up mock data for validation
    const extraData = EXTRA_PORT_DATA[input.trim()] || EXTRA_PORT_DATA[input.trim() + ' Port'];
    
    // Fallback if completely unknown
    const newPort: PortConnection = {
        portName: input.includes('Port') ? input : `${input} Port`,
        distance: extraData?.distance || 'Unknown',
        hasTruckService: extraData?.hasTruckService ?? true, // Assume true for demo if unknown, or strict false
        truckingCost: extraData?.truckingCost || 0,
        transitHours: extraData?.transitHours || 0,
        isSystemDefault: false
    };

    if (type === 'ORIGIN') {
        setOriginConnections(prev => [...prev, newPort]);
        if (newPort.hasTruckService) setActivePols(prev => [...prev, newPort.portName]);
        setManualOriginInput('');
    } else {
        setDestConnections(prev => [...prev, newPort]);
        if (newPort.hasTruckService) setActivePods(prev => [...prev, newPort.portName]);
        setManualDestInput('');
    }
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setOriginType(scenarioOriginType);
    setDestType(scenarioDestType);
    
    let newServices = [...selectedServices];
    if (scenarioIncludeCustoms) {
        if (!newServices.includes('customs_export')) newServices.push('customs_export');
        if (!newServices.includes('customs_import')) newServices.push('customs_import');
    }

    setSelectedServices(newServices);
    setSelectedSchedule(schedule);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const toggleService = (id: string) => {
    setSelectedServices(prev => {
        const service = ADDITIONAL_SERVICES.find(s => s.id === id);
        if (!service) return prev;
        let newSelection = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
        if (id === 'rail_origin' && newSelection.includes('rail_origin')) newSelection = newSelection.filter(s => s !== 'trucking_origin');
        if (id === 'trucking_origin' && newSelection.includes('trucking_origin')) newSelection = newSelection.filter(s => s !== 'rail_origin');
        if (id === 'rail_dest' && newSelection.includes('rail_dest')) newSelection = newSelection.filter(s => s !== 'trucking_dest');
        if (id === 'trucking_dest' && newSelection.includes('trucking_dest')) newSelection = newSelection.filter(s => s !== 'rail_dest');
        return newSelection;
    });
  };

  const handleConfirmBooking = () => {
    const id = `NLG-${Math.floor(Math.random() * 1000000)}`;
    setGeneratedId(id);
    setStep(6); 
    window.scrollTo(0, 0);
  };

  const getTotalPrice = () => {
    let total = selectedSchedule ? selectedSchedule.price : 0;
    ADDITIONAL_SERVICES.forEach(svc => {
      if (selectedServices.includes(svc.id)) {
        total += svc.price;
      }
    });
    return total;
  };

  const getScenarioPrice = (basePrice: number) => {
      let total = basePrice;
      if (scenarioOriginType === 'DOOR') total += 450;
      if (scenarioDestType === 'DOOR') total += 550;
      if (scenarioIncludeCustoms) total += (120 + 150);
      return total;
  };

  const StepIndicator = () => (
    <div className="bg-white border-b border-gray-200 mb-8 sticky top-20 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
                { s: 1, label: 'Search' },
                ...(step === 1.5 ? [{ s: 1.5, label: 'Route Optimization' }] : []),
                { s: 2, label: 'Schedule' }, 
                { s: 3, label: 'Services' },
                { s: 4, label: 'Details' },
                { s: 5, label: 'Payment' }
            ].map((item, idx, arr) => {
                 const isActive = step >= item.s;
                 const isCurrent = step === item.s;
                 return (
                    <div key={item.s} className={`relative flex-1 flex items-center py-4 min-w-[120px] ${idx !== arr.length - 1 ? 'border-r border-gray-100' : ''}`}>
                         <div className={`
                             flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mr-3 ml-4 flex-shrink-0
                             ${isActive ? 'bg-nordic text-white' : 'bg-gray-200 text-gray-500'}
                         `}>
                             {Math.floor(item.s) === item.s ? item.s : '1+'}
                         </div>
                         <span className={`text-sm font-bold whitespace-nowrap ${isActive ? 'text-nordic' : 'text-gray-400'}`}>
                            {item.label}
                         </span>
                         {/* Arrow Indicator for current step */}
                         {isCurrent && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent"></div>
                         )}
                    </div>
                 )
            })}
          </div>
      </div>
    </div>
  );

  const PriceSidebar = () => {
    if (!selectedSchedule) return null;
    return (
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="bg-white rounded shadow-sm border border-gray-200 sticky top-40">
          <div className="bg-nordic text-white p-4 rounded-t">
              <h3 className="font-bold flex items-center">
                <DollarSign className="w-4 h-4 mr-1" /> Booking Estimate
              </h3>
          </div>
          
          <div className="p-4">
              <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 border-b border-gray-100 pb-2">
                 <span>{originType}</span>
                 <ArrowRight className="w-3 h-3" />
                 <span>{destType}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-800 text-sm font-medium">
                  <span>Ocean Freight</span>
                  <span>${selectedSchedule.price}</span>
                </div>
                {ADDITIONAL_SERVICES.filter(s => selectedServices.includes(s.id)).map(s => (
                   <div key={s.id} className="flex justify-between text-gray-600 text-sm animate-in fade-in">
                      <span className="max-w-[160px] truncate">{s.title}</span>
                      <span>${s.price}</span>
                   </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-3 rounded border border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">Total (USD)</span>
                  <span className="text-xl font-bold text-accent">${getTotalPrice()}</span>
              </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Render Methods ---

  const renderSearch = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded shadow-card border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
             <h2 className="text-xl font-bold text-nordic flex items-center">
                <Ship className="w-5 h-5 mr-2" /> New Shipment Request
             </h2>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSearch} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Origin */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase">From</label>
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => setOriginType('PORT')} className={`text-xs font-bold ${originType === 'PORT' ? 'text-nordic underline' : 'text-gray-400'}`}>Port</button>
                                <button type="button" onClick={() => setOriginType('DOOR')} className={`text-xs font-bold ${originType === 'DOOR' ? 'text-nordic underline' : 'text-gray-400'}`}>Door</button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {originType === 'DOOR' ? <MapPin className="h-5 w-5 text-accent" /> : <Anchor className="h-5 w-5 text-nordic" />}
                            </div>
                            <input
                                required
                                type="text"
                                placeholder={originType === 'DOOR' ? "Pickup Address" : "Port of Loading"}
                                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded focus:border-nordic focus:ring-1 focus:ring-nordic transition-colors text-gray-900"
                                value={formData.origin}
                                onChange={(e) => setFormData({...formData, origin: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                             <label className="text-xs font-bold text-gray-500 uppercase">To</label>
                             <div className="flex space-x-2">
                                <button type="button" onClick={() => setDestType('PORT')} className={`text-xs font-bold ${destType === 'PORT' ? 'text-nordic underline' : 'text-gray-400'}`}>Port</button>
                                <button type="button" onClick={() => setDestType('DOOR')} className={`text-xs font-bold ${destType === 'DOOR' ? 'text-nordic underline' : 'text-gray-400'}`}>Door</button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {destType === 'DOOR' ? <MapPin className="h-5 w-5 text-accent" /> : <Anchor className="h-5 w-5 text-nordic" />}
                            </div>
                            <input
                                required
                                type="text"
                                placeholder={destType === 'DOOR' ? "Delivery Address" : "Port of Discharge"}
                                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded focus:border-nordic focus:ring-1 focus:ring-nordic transition-colors text-gray-900"
                                value={formData.destination}
                                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                            />
                        </div>
                    </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Ready Date</label>
                <input required type="date" className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:ring-nordic focus:border-nordic" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Commodity</label>
                <select className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:ring-nordic focus:border-nordic" value={formData.commodity} onChange={(e) => setFormData({...formData, commodity: e.target.value})}>
                    <option>General Cargo</option><option>Electronics</option><option>Textiles</option>
                </select>
              </div>
              <div className="space-y-1">
                 <label className="block text-xs font-bold text-gray-500 uppercase">Container</label>
                 <select className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:ring-nordic focus:border-nordic" value={formData.containerType} onChange={(e) => setFormData({...formData, containerType: e.target.value})}>
                     <option>20 Dry Standard</option><option>40 Dry Standard</option>
                  </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-gray-100">
              <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded shadow-sm transition-colors flex items-center uppercase tracking-wide text-sm">
                Search Schedules <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderRouteOptimization = () => (
    <div className="max-w-5xl mx-auto">
       <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-nordic mb-2">Smart Route Optimization</h2>
            <p className="text-gray-600 max-w-2xl">
                We've identified default gateways for your door locations. 
                <br/><span className="text-sm font-bold text-gray-500">System Limitation:</span> 
                <span className="text-sm text-gray-500"> Some nearby ports may not appear automatically. Add them manually to check truck availability and optimize costs.</span>
            </p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Origin Optimization */}
          <div className="bg-white rounded shadow-card border border-gray-200 overflow-hidden flex flex-col">
                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center"><MapPin className="w-4 h-4 mr-2 text-nordic"/> Origin Gateways</h3>
                    <span className="text-xs text-gray-500">{formData.origin}</span>
                 </div>
                 <div className="divide-y divide-gray-100 flex-grow">
                    {originConnections.map((conn) => {
                        const isActive = activePols.includes(conn.portName);
                        return (
                            <div key={conn.portName} className={`p-4 transition-colors ${isActive ? 'bg-blue-50/30' : 'bg-white'}`}>
                                <div className="flex items-start gap-3">
                                    <div 
                                      onClick={() => conn.hasTruckService && togglePol(conn.portName)}
                                      className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer ${
                                          !conn.hasTruckService ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 
                                          isActive ? 'bg-nordic border-nordic' : 'bg-white border-gray-300 hover:border-nordic'
                                      }`}
                                    >
                                        {isActive && <Check className="w-3 h-3 text-white" />}
                                        {!conn.hasTruckService && <XCircle className="w-3 h-3 text-gray-400" />}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <span className={`font-bold text-sm ${conn.hasTruckService ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {conn.portName}
                                                {conn.isSystemDefault && <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1 rounded border border-gray-200">DEFAULT</span>}
                                            </span>
                                            {conn.hasTruckService ? (
                                                <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded"><Truck className="w-3 h-3 mr-1"/> Available</span>
                                            ) : (
                                                <span className="text-xs font-bold text-red-500 flex items-center bg-red-50 px-2 py-0.5 rounded">No Service</span>
                                            )}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500 flex items-center space-x-3">
                                            <span>Distance: {conn.distance}</span>
                                            {conn.hasTruckService && <span>• Est. Cost: ${conn.truckingCost}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                 </div>
                 {/* Manual Add Origin */}
                 <div className="p-4 bg-gray-50 border-t border-gray-200 mt-auto">
                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Check Alternative Port</label>
                     <div className="flex gap-2">
                         <input 
                            type="text" 
                            placeholder="e.g. Nanjing" 
                            className="flex-grow text-sm px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-nordic outline-none"
                            value={manualOriginInput}
                            onChange={e => setManualOriginInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddPort('ORIGIN')}
                         />
                         <button 
                            onClick={() => handleAddPort('ORIGIN')}
                            className="bg-white border border-gray-300 hover:border-nordic text-nordic font-bold px-3 py-2 rounded text-sm flex items-center transition-colors"
                         >
                            <Plus className="w-4 h-4" />
                         </button>
                     </div>
                 </div>
          </div>

          {/* Destination Optimization */}
          <div className="bg-white rounded shadow-card border border-gray-200 overflow-hidden flex flex-col">
                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center"><Anchor className="w-4 h-4 mr-2 text-nordic"/> Destination Gateways</h3>
                    <span className="text-xs text-gray-500">{formData.destination}</span>
                 </div>
                 <div className="divide-y divide-gray-100 flex-grow">
                    {destConnections.map((conn) => {
                        const isActive = activePods.includes(conn.portName);
                        return (
                            <div key={conn.portName} className={`p-4 transition-colors ${isActive ? 'bg-blue-50/30' : 'bg-white'}`}>
                                <div className="flex items-start gap-3">
                                    <div 
                                      onClick={() => conn.hasTruckService && togglePod(conn.portName)}
                                      className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer ${
                                          !conn.hasTruckService ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 
                                          isActive ? 'bg-nordic border-nordic' : 'bg-white border-gray-300 hover:border-nordic'
                                      }`}
                                    >
                                        {isActive && <Check className="w-3 h-3 text-white" />}
                                        {!conn.hasTruckService && <XCircle className="w-3 h-3 text-gray-400" />}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <span className={`font-bold text-sm ${conn.hasTruckService ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {conn.portName}
                                                {conn.isSystemDefault && <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1 rounded border border-gray-200">DEFAULT</span>}
                                            </span>
                                            {conn.hasTruckService ? (
                                                <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded"><Truck className="w-3 h-3 mr-1"/> Available</span>
                                            ) : (
                                                <span className="text-xs font-bold text-red-500 flex items-center bg-red-50 px-2 py-0.5 rounded">No Service</span>
                                            )}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500 flex items-center space-x-3">
                                            <span>Distance: {conn.distance}</span>
                                            {conn.hasTruckService && <span>• Est. Cost: ${conn.truckingCost}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                 </div>
                 {/* Manual Add Dest */}
                 <div className="p-4 bg-gray-50 border-t border-gray-200 mt-auto">
                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Check Alternative Port</label>
                     <div className="flex gap-2">
                         <input 
                            type="text" 
                            placeholder="e.g. Cheese" 
                            className="flex-grow text-sm px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-nordic outline-none"
                            value={manualDestInput}
                            onChange={e => setManualDestInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddPort('DESTINATION')}
                         />
                         <button 
                            onClick={() => handleAddPort('DESTINATION')}
                            className="bg-white border border-gray-300 hover:border-nordic text-nordic font-bold px-3 py-2 rounded text-sm flex items-center transition-colors"
                         >
                            <Plus className="w-4 h-4" />
                         </button>
                     </div>
                 </div>
          </div>
       </div>

       <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="text-gray-500 font-bold hover:text-nordic">Back to Search</button>
            <button 
                onClick={() => { setStep(2); window.scrollTo(0,0); }}
                className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded shadow-sm uppercase tracking-wide text-sm flex items-center"
            >
                View optimized Schedules <ChevronRight className="ml-2 w-4 h-4" />
            </button>
       </div>
    </div>
  );

  const renderSchedules = () => (
    <div className="max-w-6xl mx-auto">
      
      {/* Toolbar */}
      <div className="bg-white rounded shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
              <h2 className="text-lg font-bold text-nordic">Search Results</h2>
              <p className="text-xs text-gray-500">{formData.origin} to {formData.destination} • {formData.containerType}</p>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded border border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase">Quote Type:</span>
              <button 
                onClick={() => { setScenarioOriginType('PORT'); setScenarioDestType('PORT'); }}
                className={`px-3 py-1 text-xs font-bold rounded border ${scenarioOriginType === 'PORT' ? 'bg-white border-nordic text-nordic shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
              >
                  Port-to-Port
              </button>
              <button 
                onClick={() => { setScenarioOriginType('DOOR'); setScenarioDestType('DOOR'); }}
                className={`px-3 py-1 text-xs font-bold rounded border ${scenarioOriginType === 'DOOR' ? 'bg-white border-nordic text-nordic shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
              >
                  Door-to-Door
              </button>
              <div className="h-4 w-px bg-gray-300 mx-2"></div>
               <button 
                    onClick={() => setScenarioIncludeCustoms(!scenarioIncludeCustoms)}
                    className={`flex items-center px-3 py-1 text-xs font-bold rounded border transition-colors ${scenarioIncludeCustoms ? 'bg-blue-50 border-blue-200 text-nordic' : 'bg-white border-gray-200 text-gray-500'}`}
                  >
                     {scenarioIncludeCustoms && <Check className="w-3 h-3 mr-1" />} Customs
                  </button>
          </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {visibleSchedules.map((sch) => {
          const totalPrice = getScenarioPrice(sch.price);
          return (
            <div key={sch.id} className="bg-white rounded border border-gray-200 hover:border-nordic hover:shadow-card-hover transition-all duration-200">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                
                {/* Left Info */}
                <div className="flex-grow space-y-4">
                    <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 rounded flex items-center justify-center bg-nordic-light/10 text-nordic">
                             <Ship className="w-6 h-6" />
                         </div>
                         <div>
                             <div className="font-bold text-gray-900 text-lg">{sch.vessel}</div>
                             <div className="text-xs text-gray-500">Voyage: {sch.voyage} • {sch.type} Service</div>
                         </div>
                         <div className="ml-auto md:ml-4 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-100 flex items-center">
                             <Leaf className="w-3 h-3 mr-1" /> {sch.co2} CO₂
                         </div>
                         {sch.tags?.map(tag => (
                             <div key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">
                                 {tag}
                             </div>
                         ))}
                    </div>

                    {/* Timeline Graphic */}
                    <div className="flex items-center justify-between text-sm pt-2">
                         <div className="text-center w-24">
                             <div className="font-bold text-gray-800 truncate" title={scenarioOriginType === 'DOOR' ? 'Pickup' : sch.pol}>
                                {scenarioOriginType === 'DOOR' ? 'Pickup' : sch.pol}
                             </div>
                             {scenarioOriginType === 'DOOR' && <div className="text-[10px] text-gray-400">via {sch.pol}</div>}
                             <div className="text-xs text-gray-500">{sch.departure}</div>
                         </div>
                         
                         <div className="flex-grow mx-4 relative flex items-center">
                             <div className="h-0.5 bg-gray-300 w-full"></div>
                             <div className="absolute inset-0 flex justify-center -top-2">
                                 <span className="bg-white px-2 text-xs font-bold text-gray-500">{sch.transitTime}</span>
                             </div>
                             <div className="w-2 h-2 bg-gray-300 rounded-full absolute left-0"></div>
                             <div className="w-2 h-2 bg-gray-300 rounded-full absolute right-0"></div>
                         </div>

                         <div className="text-center w-24">
                             <div className="font-bold text-gray-800 truncate" title={scenarioDestType === 'DOOR' ? 'Delivery' : sch.pod}>
                                 {scenarioDestType === 'DOOR' ? 'Delivery' : sch.pod}
                             </div>
                             {scenarioDestType === 'DOOR' && <div className="text-[10px] text-gray-400">via {sch.pod}</div>}
                             <div className="text-xs text-gray-500">{sch.arrival}</div>
                         </div>
                    </div>

                    {/* Scenario Badges */}
                    {(scenarioOriginType === 'DOOR' || scenarioIncludeCustoms) && (
                        <div className="flex gap-2 pt-2">
                             {scenarioOriginType === 'DOOR' && <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">INLAND HAULAGE</span>}
                             {scenarioIncludeCustoms && <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">CUSTOMS CLEARANCE</span>}
                        </div>
                    )}
                </div>

                {/* Right Action */}
                <div className="md:border-l border-gray-100 md:pl-6 flex flex-col justify-center items-end min-w-[180px]">
                     <div className="text-right mb-3">
                         <div className="text-xs text-gray-500 font-medium uppercase">Total Est.</div>
                         <div className="text-2xl font-bold text-nordic">${totalPrice}</div>
                     </div>
                     <button 
                        onClick={() => handleSelectSchedule(sch)}
                        className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded shadow-sm transition-colors text-sm uppercase tracking-wide"
                     >
                         Book
                     </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6">
          <button onClick={() => setStep(1.5)} className="text-sm font-bold text-gray-500 hover:text-nordic">&larr; Back to Route Optimization</button>
      </div>
    </div>
  );

  const renderCustomization = () => (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-grow">
        <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Additional Services</h2>
                <p className="text-sm text-gray-500">Enhance your shipment with value-added logistics solutions.</p>
            </div>
            <button onClick={() => setStep(2)} className="text-sm font-bold text-nordic hover:underline">Change Schedule</button>
        </div>

        {/* Upsell Banner */}
        {originType === 'PORT' && destType === 'PORT' && (
             <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-8 flex items-start gap-4">
                 <div className="bg-white p-2 rounded-full border border-blue-100 shadow-sm text-nordic">
                     <Star className="w-5 h-5 fill-current" />
                 </div>
                 <div>
                     <h4 className="font-bold text-nordic text-sm">Complete the Chain</h4>
                     <p className="text-xs text-gray-600 mt-1 max-w-lg">
                         Customers who add inland transport and customs clearance save an average of 15% on administrative costs and reduce delay risks.
                     </p>
                 </div>
             </div>
        )}

        <div className="space-y-8">
             {['ORIGIN', 'JOURNEY', 'DESTINATION'].map((cat, idx) => (
                <section key={cat}>
                     <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
                         {idx + 1}. {cat.charAt(0) + cat.slice(1).toLowerCase()} Services
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ADDITIONAL_SERVICES.filter(s => s.category === cat).map(service => (
                            <ServiceCard 
                                key={service.id} 
                                service={service} 
                                isSelected={selectedServices.includes(service.id)} 
                                onToggle={() => toggleService(service.id)} 
                            />
                        ))}
                     </div>
                </section>
             ))}
        </div>

        <div className="flex justify-end mt-10 pt-6 border-t border-gray-200">
           <button 
             onClick={() => { setStep(4); window.scrollTo(0,0); }}
             className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-10 rounded shadow-md flex items-center uppercase tracking-wide text-sm"
           >
             Next Step <ChevronRight className="w-4 h-4 ml-2" />
           </button>
        </div>
      </div>
      <PriceSidebar />
    </div>
  );

  const renderDetails = () => (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-grow">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Parties & Reference</h2>
        
        <div className="bg-white p-6 rounded border border-gray-200 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center">
               Shipper Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">Company Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-nordic focus:border-nordic" value={formData.shipperName} onChange={e => setFormData({...formData, shipperName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">Email Address</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-nordic focus:border-nordic" value={formData.shipperEmail} onChange={e => setFormData({...formData, shipperEmail: e.target.value})} />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
             <h4 className="text-sm font-bold text-gray-700 uppercase mb-4">
               Consignee Details
             </h4>
             <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">Company Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-nordic focus:border-nordic" value={formData.consigneeName} onChange={e => setFormData({...formData, consigneeName: e.target.value})} />
             </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
           <button onClick={() => setStep(3)} className="text-gray-500 hover:text-nordic font-bold text-sm">
             &larr; Back
           </button>
           <button 
             onClick={() => { setStep(5); window.scrollTo(0,0); }}
             disabled={!formData.shipperName || !formData.shipperEmail}
             className="bg-accent hover:bg-accent-hover disabled:bg-gray-300 text-white font-bold py-3 px-10 rounded shadow-md flex items-center uppercase tracking-wide text-sm"
           >
             Proceed to Review
           </button>
        </div>
      </div>
      <PriceSidebar />
    </div>
  );

  const renderReview = () => (
     <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-grow">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Review Booking</h2>
        
        <div className="bg-white rounded border border-gray-200 overflow-hidden mb-6">
           <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-bold text-gray-800 text-sm uppercase">Route Summary</h4>
              <span className="text-xs font-bold text-nordic bg-white px-2 py-1 border border-gray-200 rounded">{originType} &rarr; {destType}</span>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Origin</span>
                  <span className="text-base font-bold text-gray-900 block">{formData.origin}</span>
                  {originType === 'DOOR' && <span className="text-xs text-green-600 font-bold mt-1 block">+ Pickup Service (via {selectedSchedule?.pol})</span>}
              </div>
              <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Destination</span>
                  <span className="text-base font-bold text-gray-900 block">{formData.destination}</span>
                   {destType === 'DOOR' && <span className="text-xs text-green-600 font-bold mt-1 block">+ Delivery Service (via {selectedSchedule?.pod})</span>}
              </div>
              <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Vessel / Voyage</span>
                  <span className="text-sm font-medium text-gray-900">{selectedSchedule?.vessel} / {selectedSchedule?.voyage}</span>
              </div>
              <div>
                  <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Cargo</span>
                  <span className="text-sm font-medium text-gray-900">{formData.commodity} ({formData.containerType})</span>
              </div>
           </div>
        </div>

        <div className="bg-white rounded border border-gray-200 overflow-hidden p-6 mb-6">
           <h4 className="font-bold text-gray-800 text-sm uppercase mb-4">Services Configuration</h4>
           <ul className="space-y-2">
              <li className="flex justify-between text-sm text-gray-700 border-b border-gray-100 pb-2">
                  <span>Ocean Freight (Standard)</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
              </li>
              {selectedServices.map(sid => {
                  const s = ADDITIONAL_SERVICES.find(ser => ser.id === sid);
                  return (
                    <li key={sid} className="flex justify-between text-sm text-gray-700 border-b border-gray-100 pb-2">
                        <span>{s?.title}</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    </li>
                  )
              })}
           </ul>
        </div>

        <div className="flex justify-between mt-8">
           <button onClick={() => setStep(4)} className="text-gray-500 hover:text-nordic font-bold text-sm">
             &larr; Back
           </button>
           <button 
             onClick={handleConfirmBooking}
             className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-12 rounded shadow-md flex items-center uppercase tracking-wide text-sm"
           >
             Confirm Booking
           </button>
        </div>
      </div>
      <PriceSidebar />
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-3xl mx-auto pt-8">
      <div className="bg-white rounded shadow-card border border-gray-200 overflow-hidden">
        <div className="bg-nordic p-8 text-center text-white">
           <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle className="h-8 w-8 text-white" />
           </div>
           <h2 className="text-3xl font-bold mb-2">Booking Confirmed</h2>
           <p className="text-white/80">Thank you for booking with Nordic Logistics.</p>
        </div>
        <div className="p-8 text-center">
           <div className="mb-8">
               <p className="text-xs text-gray-500 uppercase font-bold mb-1">Booking Reference</p>
               <p className="text-3xl font-mono font-bold text-nordic">{generatedId}</p>
           </div>
           <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto">
               A confirmation email has been sent to <strong>{formData.shipperEmail}</strong>. You can track this shipment immediately.
           </p>
           
           <div className="flex justify-center space-x-4">
              <button onClick={() => onComplete(generatedId)} className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-6 rounded shadow-sm uppercase tracking-wide text-sm">Track Shipment</button>
              <button onClick={() => window.print()} className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded hover:bg-gray-50 uppercase tracking-wide text-sm">Print Confirmation</button>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
       <StepIndicator />
       <div className="px-4 sm:px-6 lg:px-8 mt-8 animate-in fade-in duration-500">
          {step === 1 && renderSearch()}
          {step === 1.5 && renderRouteOptimization()}
          {step === 2 && renderSchedules()}
          {step === 3 && renderCustomization()}
          {step === 4 && renderDetails()}
          {step === 5 && renderReview()}
          {step === 6 && renderConfirmation()}
       </div>
    </div>
  );
};

export default BookingFlow;
