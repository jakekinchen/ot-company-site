import React from 'react';

const MobileSubMenu = ({ submenu, items, onBack, onClose }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center w-full py-4">
        <button
          onClick={onBack}
          className="p-2 flex items-center text-blue text-xl font-semibold hover:text-dark-blue"
          aria-label="Back to main menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={onClose}
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
        <ul className="space-y-4 mt-4">
          {items.map((item, index) => (
            <li key={index}>
              <a href={item.href} className="flex items-center py-2 text-xl font-semibold text-dark-blue hover:text-blue">
                <img src={item.iconSrc} alt={item.label} className="w-6 h-6 mr-3 filter-dark-blue" />
                <span>{item.label}</span>
              </a>
              {item.subLinks && (
                <ul className="pl-9 mt-1 space-y-1">
                  {item.subLinks.map((subLink, subIndex) => (
                    <li key={subIndex} className="text-sm text-gray hover:text-blue cursor-pointer">{subLink}</li>
                  ))}
                </ul>
              )}
              <hr className="w-full border-gray-200 mt-2" />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MobileSubMenu;