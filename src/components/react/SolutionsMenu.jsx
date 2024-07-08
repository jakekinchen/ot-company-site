import React, { useRef, useEffect } from 'react';
import MenuItem from './MenuItem';
import { solutions } from '../../data/pages.json';

const SolutionsMenu = React.forwardRef((props, ref) => {
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

  // Split items into columns (4 items per column)
  const columns = [];
  for (let i = 0; i < solutions.length; i += 4) {
    columns.push(solutions.slice(i, i + 4));
  }

  return (
    <nav className="flex space-x-8" onKeyPress={onKeyPress}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col space-y-4">
          {column.map((item) => (
            <MenuItem
              key={item.href}
              href={item.href}
              iconSrc={item.iconSrc}
              label={item.label}
              linkRefs={linkRefs}
              iconClassName="filter-dark-blue" // Apply the dark-blue filter to icons
            />
          ))}
        </div>
      ))}
    </nav>
  );
});

export default SolutionsMenu;
