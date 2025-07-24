import { useState, useEffect } from 'react';
import MobileSubMenu from './MobileSubMenu';
import pages from '../../data/pages.json';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasOpenOnMobile, setWasOpenOnMobile] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [lastActiveSubmenu, setLastActiveSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 960; // Adjust this breakpoint as needed
      if (isMobile !== newIsMobile) {
        if (newIsMobile) {
          // Transitioning to mobile
          setIsOpen(wasOpenOnMobile);
          setActiveSubmenu(lastActiveSubmenu);
        } else {
          // Transitioning to desktop
          setWasOpenOnMobile(isOpen);
          setLastActiveSubmenu(activeSubmenu);
          setIsOpen(false);
          setActiveSubmenu(null);
        }
        setIsMobile(newIsMobile);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isOpen, wasOpenOnMobile, activeSubmenu, lastActiveSubmenu]);

  useEffect(() => {
    const handleToggle = () => {
      if (isMobile) {
        setIsOpen(!isOpen);
        setWasOpenOnMobile(!isOpen);
      }
    };
    document.addEventListener('toggleMobileMenu', handleToggle);
    return () => document.removeEventListener('toggleMobileMenu', handleToggle);
  }, [isOpen, isMobile]);

  const openSubmenu = (submenu) => {
    setActiveSubmenu(submenu);
    setLastActiveSubmenu(submenu);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setWasOpenOnMobile(false);
    setActiveSubmenu(null);
    setLastActiveSubmenu(null);
  };

  const backToMainMenu = () => {
    setActiveSubmenu(null);
    setLastActiveSubmenu(null);
  };

  const handleRequestDemo = () => {
    closeMenu();
    window.dispatchEvent(new CustomEvent('openDialog'));
  };

  if (!isMobile) return null; // Don't render anything if not mobile

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
              <nav className="flex-grow overflow-y-auto">
                <ul className="divide-y divide-gray">
                  <li className="py-4">
                    <a href="/" className="block text-xl font-semibold text-dark-blue hover:text-blue">Home</a>
                  </li>
                  <li className="py-4">
                    <a href="/solutions" className="block text-xl font-semibold text-dark-blue hover:text-blue">Solutions</a>
                  </li>
                  {['products', 'partners', 'company'].map((item) => (
                    <li key={item} className="py-4">
                      <button
                        onClick={() => openSubmenu(item)}
                        className="flex items-center justify-between w-full text-xl font-semibold text-dark-blue hover:text-blue"
                      >
                        <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </li>
                  ))}
                  <li className="py-4">
                    <button 
                      onClick={handleRequestDemo} 
                      className="block w-full text-left text-xl font-semibold text-blue hover:text-orange"
                    >
                      Request a Demo
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <MobileSubMenu
              submenu={activeSubmenu}
              items={pages[activeSubmenu]?.pages || []}
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