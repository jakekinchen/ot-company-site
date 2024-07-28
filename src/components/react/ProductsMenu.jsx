import React, { useRef, useEffect } from 'react';
import MenuItem from './MenuItem';
import { products } from '../../data/pages.json';

const ProductsMenu = React.forwardRef((props, ref) => {
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

  linkRefs.current = [];

  const columns = [];
  for (let i = 0; i < products.length; i += 4) {
    columns.push(products.slice(i, i + 4));
  }

  return (
    <nav className="flex space-x-8" onKeyDown={onKeyPress}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col space-y-4">
          {column.map((product) => (
            <MenuItem
              key={product.href}
              href={product.href}
              iconSrc={product.iconSrc}
              label={product.label}
              linkRefs={linkRefs}
            />
          ))}
        </div>
      ))}
    </nav>
  );
});

export default ProductsMenu;
