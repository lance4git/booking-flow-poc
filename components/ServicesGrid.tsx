import React from 'react';
import { Anchor, Truck, Plane, Box, ClipboardCheck, BarChart3 } from 'lucide-react';

interface ServicesGridProps {
  onBook?: () => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ onBook }) => {
  const services = [
    {
      title: 'Ocean Transport',
      description: 'Reliable and sustainable ocean transportation for any cargo.',
      icon: <Anchor className="h-8 w-8 text-nordic-light" />,
    },
    {
      title: 'Inland Delivery',
      description: 'Seamless connection from port to door via truck, rail, or barge.',
      icon: <Truck className="h-8 w-8 text-nordic-light" />,
    },
    {
      title: 'Air Freight',
      description: 'When speed is crucial, our air freight solutions deliver.',
      icon: <Plane className="h-8 w-8 text-nordic-light" />,
    },
    {
      title: 'Supply Chain Management',
      description: 'End-to-end visibility and control over your cargo flow.',
      icon: <BarChart3 className="h-8 w-8 text-nordic-light" />,
    },
    {
      title: 'Customs Services',
      description: 'Navigate complex regulations with our expert support.',
      icon: <ClipboardCheck className="h-8 w-8 text-nordic-light" />,
    },
    {
      title: 'LCL (Less than Container)',
      description: 'Flexible consolidation services for smaller shipments.',
      icon: <Box className="h-8 w-8 text-nordic-light" />,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-nordic mb-4">Integrated Logistics Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From the factory floor to the customer's door, we provide the comprehensive services you need to succeed in a global market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
                key={index} 
                onClick={onBook}
                className="group border border-gray-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gray-50 hover:bg-white"
            >
              <div className="mb-6 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:bg-nordic group-hover:text-white transition-colors">
                 <div className="group-hover:text-white text-nordic-light transition-colors">
                   {service.icon}
                 </div>
              </div>
              <h3 className="text-xl font-bold text-nordic mb-3 group-hover:text-nordic-light transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;