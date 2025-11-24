import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-nordic-dark text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center space-x-2 mb-4">
                 <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                 </svg>
                 <span className="font-bold text-lg tracking-wide text-white">NORDIC</span>
             </div>
             <p className="text-sm mb-4">
               Connecting the world through intelligent, sustainable logistics.
             </p>
             <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition"><Linkedin className="w-5 h-5"/></a>
                <a href="#" className="hover:text-white transition"><Twitter className="w-5 h-5"/></a>
                <a href="#" className="hover:text-white transition"><Facebook className="w-5 h-5"/></a>
                <a href="#" className="hover:text-white transition"><Instagram className="w-5 h-5"/></a>
             </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-nordic-light transition">Ocean Transport</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Air Freight</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Inland Transport</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Supply Chain Management</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-nordic-light transition">About Us</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Sustainability</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Careers</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Investor Relations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-nordic-light transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Help Center</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-nordic-light transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Nordic Logistics Global A/S. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;