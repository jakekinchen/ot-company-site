import React, { useRef, useEffect } from 'react';
import MenuItem from './MenuItem';
import { partners } from '../../data/pages.json';

const PartnersMenu = React.forwardRef((props, ref) => {
  const linkRefs = useRef([]);

  useEffect(() => {
    if (props.active) {
      linkRefs.current[0]?.focus();
    }
  }, [props.active]);

  function onKeyPress(event) {
    const currentIndex = linkRefs.current.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') {
      const newFocused = linkRefs.current[currentIndex + 1] || linkRefs.current[0];
      newFocused?.focus();
    } else if (event.key === 'ArrowUp') {
      const newFocused = linkRefs.current[currentIndex - 1] || linkRefs.current[linkRefs.current.length - 1];
      newFocused?.focus();
    }
  }

  // Reset the links array per render
  linkRefs.current = [];

  // Use partners.pages directly, no need for columns as there are only 2 items
  const PARTNERS_ITEMS = partners.pages;

  return (
    <nav className="flex space-x-8" onKeyDown={onKeyPress}>
      <div className="flex flex-col space-y-4">
        {PARTNERS_ITEMS.map((item) => (
          <MenuItem
            key={item.href}
            href={item.href}
            iconSrc={item.iconSrc}
            label={item.label}
            linkRefs={linkRefs}
          />
        ))}
      </div>
    </nav>
  );
});

export default PartnersMenu;