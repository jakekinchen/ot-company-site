import React, { useState, useEffect } from 'react';
import pages from '../../data/pages.json';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(!isOpen);
    document.addEventListener('toggleMobileMenu', handleToggle);
    return () => document.removeEventListener('toggleMobileMenu', handleToggle);
  }, [isOpen]);

  const toggleSubmenu = (submenu) => setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const renderSubmenu = (items) => (
    <ul className="pl-4 mt-2 space-y-2">
      {items.map((item, index) => (
        <li key={index}>
          <a href={item.href} className="flex items-center text-gray hover:text-blue">
            <img src={item.iconSrc} alt={item.label} className="w-6 h-6 mr-3" />
            <span>{item.label}</span>
          </a>
          {item.subLinks && (
            <ul className="pl-9 mt-1 space-y-1">
              {item.subLinks.map((subLink, subIndex) => (
                <li key={subIndex} className="text-sm text-gray hover:text-blue">{subLink}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'visible' : 'invisible'}`}>
      <div className="bg-white w-[95%] h-[95%] rounded-xl relative">
        <div className="w-[95%] mx-auto h-full flex flex-col">
          <div className="flex justify-between items-center w-full py-4">
            <img src="/public/ot-gradient-logo.svg" alt="OneTier Logo" style="width: 30%;" />
            <button
              onClick={closeMenu}
              className="p-2"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <hr className="w-full border-gray-200" />
          <nav className="flex-grow overflow-y-auto">
            <ul className="space-y-4">
              <li><a href="/" className="block py-2 text-xl font-semibold text-gray-800 hover:text-blue">Home</a></li>
              {['solutions', 'products', 'partners', 'company'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => toggleSubmenu(item)}
                    className="flex items-center justify-between w-full py-2 text-xl font-semibold text-gray-800 hover:text-blue"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    <svg className={`w-4 h-4 transition-transform ${activeSubmenu === item ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {activeSubmenu === item && renderSubmenu(pages[item])}
                  <hr className="w-full border-gray-200" />
                </li>
              ))}
              <li>
                <a href="/request-demo" className="block py-2 text-xl font-semibold text-blue hover:text-blue">
                  Request a Demo
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;