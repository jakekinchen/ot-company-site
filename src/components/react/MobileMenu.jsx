import React, { useState, useEffect } from 'react';
import MobileSubMenu from './MobileSubMenu';
import pages from '../../data/pages.json';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(!isOpen);
    document.addEventListener('toggleMobileMenu', handleToggle);
    return () => document.removeEventListener('toggleMobileMenu', handleToggle);
  }, [isOpen]);

  const openSubmenu = (submenu) => setActiveSubmenu(submenu);
  const closeMenu = () => setIsOpen(false);
  const backToMainMenu = () => setActiveSubmenu(null);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'visible' : 'invisible'}`}>
      <div className="bg-white w-[95%] h-[95%] rounded-xl relative">
        <div className="w-[95%] mx-auto h-full flex flex-col">
          {!activeSubmenu ? (
            <>
              <div className="flex justify-between items-center w-full py-4">
                <img 
                  src="/ot-gradient-logo.svg" 
                  alt="OneTier Logo" 
                  style={{ width: '10rem' }}
                />
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
              <hr className="w-full border-gray" />
              <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-4">
                  <li><a href="/" className="block py-2 text-xl font-semibold text-dark-blue hover:text-blue">Home</a>
                  <hr className="w-full border-gray" />
                  </li>
                  
                  {['solutions', 'products', 'partners', 'company'].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => openSubmenu(item)}
                        className="flex items-center justify-between w-full py-2 text-xl font-semibold text-dark-blue hover:text-blue"
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <hr className="w-full border-gray" />
                    </li>
                  ))}
                  <li>
                    <a href="/request-demo" className="block py-2 text-xl font-semibold text-blue hover:text-blue">
                      Request a Demo
                    </a>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <MobileSubMenu 
              submenu={activeSubmenu} 
              items={pages[activeSubmenu]} 
              onBack={backToMainMenu} 
              onClose={closeMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;