import React, { useState, useEffect } from 'react';
import pages from '../../data/pages.json';

const MobileSubMenu = ( submenu ) => {
  const [isOpen, setIsOpen] = useState(false);

  // destructure submenu into menuLabel=submenu.label items=submenu.items

  useEffect(() => {
    const handleToggle = () => setIsOpen(!isOpen);
    document.addEventListener('toggleMobileMenu', handleToggle);
    return () => document.removeEventListener('toggleMobileMenu', handleToggle);
  }, [isOpen]);

  const toggleSubmenu = (submenu) => setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

    // main parent div should take up 95% of width and height, rounded-xl white background
  // main child div takes up 95% width, should contain all content inside menu
  // first grandchild div needs < back button in the top left corner (full width) (if clicked exit to main menu)
  // x exit button in the top right in the same div (if clicked exit menu's), horizontal line spanning the width at the bottom of the div
  // in the second grandchild div (spanning full width of container), we need to display each subLink with its icon to the left of it (all items left justified)
  // if clicked, go to that page route

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
    <div className={`fixed inset-0 bg-white z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      {isOpen && (
        
        <button
          onClick={closeMenu}
          className=" top-4 left-4 z-51 p-3 bg-blue text-black rounded-sm shadow-lg hover:bg-blue border-5 border-orange"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="black">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {isOpen && (
        <nav className="fixed inset-0 bg-white z-40 overflow-y-auto pt-16">
          <ul className="p-4 space-y-4">
            <li><a href="/" className="text-xl font-semibold text-gray-800 hover:text-blue">Home</a></li>
            {['solutions', 'products', 'partners', 'company'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => toggleSubmenu(item)}
                  className="text-xl font-semibold text-gray-800 hover:text-blue flex items-center justify-between w-full"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <svg className={`w-4 h-4 transition-transform ${activeSubmenu === item ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeSubmenu === item && renderSubmenu(pages[item])}
              </li>
            ))}
            <li>
              <a href="/request-demo" className="text-xl font-semibold text-blue hover:text-blue">
                Request a Demo
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;