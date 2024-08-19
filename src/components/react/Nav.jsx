import { useRef, useState, useEffect } from 'react';
import CompanyMenu from './CompanyMenu';
import PartnersMenu from './PartnersMenu';
import ProductsMenu from './ProductsMenu';
//import SolutionsMenu from './SolutionsMenu';
import SlideWrapper from './SlideWrapper';


const MENU_ITEMS = [ 
'Products', 'Partners', 'Company'];

const Nav = () => {
  const [pathname, setPathname] = useState('/');
  const refs = useRef([]);
  const [hovering, setHovering] = useState(null);
  const [caretLeft, setCaretLeft] = useState(0);
  const [popoverHeight, setPopoverHeight] = useState(null);
  const closeTimeoutRef = useRef(null);
  const navBarRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const focusMenu = (index) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setHovering(index);

    const navElement = navBarRef.current;
    const menuItem = document.getElementById(`nav-${MENU_ITEMS[index].toLowerCase()}`);

    if (navElement && menuItem) {
      const navRect = navElement.getBoundingClientRect();
      const itemRect = menuItem.getBoundingClientRect();

      setCaretLeft(itemRect.left - navRect.left + itemRect.width / 2);
    }

    const menuElement = refs.current[index];
    if (menuElement) {
      setPopoverHeight(menuElement.offsetHeight);
    }
  };

  const startCloseTimer = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHovering(null);
    }, 300);
  };

  const cancelCloseTimer = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const isActive = (item) => {
  const path = pathname.toLowerCase();
  const checkPath = (p) => path === p || path === p + '/';

  if (item === 'Home') {
    return checkPath('/') || path === '';
  }
  if (item === 'Solutions') {
    return checkPath('/solutions');
  }
  if (item === 'Partners') {
    return checkPath('/become-a-partner');
  }
  if (item === 'Company') {
    return checkPath('/company') || checkPath('/events');
  }
  if (item === 'Products') {
    const productPages = [
      '/risk-engagement',
      '/kubezt-secure-apps',
      '/anycloud-orchestration',
      '/secure-access',
      '/stealth-networking',
      '/analytics-hq',
      '/global-data-security',
      '/security-overwatch'
    ];
    return productPages.some(page => checkPath(page));
  }
  return false;
};

    return (
    <nav ref={navRef} className="mb:hidden w-full py-4 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-center relative">
        <div id="navBar" ref={navBarRef} className="flex space-x-1 font-medium drop-shadow-md bg-off-white rounded-full p-2">
          <a
            href="/"
            className={`flex items-center justify-center px-4 py-2 text-dark-blue no-underline rounded-full hover:bg-light-blue hover:text-white active:bg-blue active:text-white transition-colors duration-200 ${
              isActive('Home') ? 'bg-blue text-white' : ''
            }`}
          >
            Home
          </a>
          <a
            href="/solutions"
            className={`flex items-center justify-center px-4 py-2 text-dark-blue no-underline rounded-full hover:bg-light-blue hover:text-white active:bg-blue active:text-white transition-colors duration-200 ${
              isActive('Solutions') ? 'bg-blue text-white' : ''}
              `}
          >
            Solutions
          </a>
          {MENU_ITEMS.map((item, index) => (
            <span
              key={item}
              id={`nav-${item.toLowerCase()}`}
              onMouseEnter={() => focusMenu(index)}
              onMouseLeave={startCloseTimer}
              onFocus={() => focusMenu(index)}
              href={`/${item.toLowerCase()}`}
              className={`flex items-center justify-center px-4 py-2 text-dark-blue no-underline rounded-full hover:bg-light-blue hover:text-white active:bg-blue active:text-white cursor-default transition-colors duration-200 ${
                isActive(item) ? 'bg-blue text-white' : ''
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      {typeof hovering === 'number' && (
        <div
          onMouseEnter={cancelCloseTimer}
          onMouseLeave={startCloseTimer}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: navBarRef.current ? navBarRef.current.offsetWidth : 'auto',
            height: popoverHeight ?? 'auto',
          }}
          className="bg-white shadow-lg transition-all duration-300 mt-2 z-50"
        >
          <div 
            className="submenu-caret absolute w-4 h-4 bg-white transform rotate-45 -top-2 z-50 rounded-md"
            style={{ 
              left: `${caretLeft}px`,
              marginLeft: '-8px' 
            }}
          />
          <div className="relative bg-white w-full h-full">

            <SlideWrapper index={0} hovering={hovering}>
              <ProductsMenu ref={refs.current[0]} />
            </SlideWrapper>
            <SlideWrapper index={1} hovering={hovering}>
              <PartnersMenu ref={refs.current[1]} />
            </SlideWrapper>
            <SlideWrapper index={2} hovering={hovering}>
              <CompanyMenu ref={refs.current[2]} />
            </SlideWrapper> 
            
            {/*
            <SlideWrapper index={0} hovering={hovering}>
              <ProductsMenu ref={refs.current[0]} />
            </SlideWrapper>
            <SlideWrapper index={1} hovering={hovering}>
              <PartnersMenu ref={refs.current[1]} />
            </SlideWrapper>
            <SlideWrapper index={2} hovering={hovering}>
              <CompanyMenu ref={refs.current[2]} />
            </SlideWrapper> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;