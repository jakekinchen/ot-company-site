import { useState } from "react";

function MenuItem({ href, iconSrc, label, subLinks, linkRefs }) {
  const [isHovered, setIsHovered] = useState(false);

  const MainContent = () => (
    <>
      <img 
        src={iconSrc} 
        alt={label} 
        className={`w-6 h-6 rounded-none ${isHovered ? 'filter-dark-blue' : 'filter-blue'}`} 
      />
      <span>{label}</span>
    </>
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {subLinks ? (
        <div className="flex items-center space-x-2 text-md font-medium text-dark-blue cursor-default">
          <MainContent />
        </div>
      ) : (
        <a
          href={href}
          ref={(el) => el && linkRefs.current.push(el)}
          className="flex items-center space-x-2 text-md font-medium cursor-pointer text-dark-blue hover:text-dark-blue"
        >
          <MainContent />
        </a>
      )}
      {subLinks && (
        <div className="ml-8 mt-2 space-y-1">
          {subLinks.map((subLink, index) => (
            <a
              key={index}
              href={`${href}/${subLink.toLowerCase().replace(/ /g, '-')}`}
              ref={(el) => el && linkRefs.current.push(el)}
              className="block text-sm text-dark-blue hover:text-blue cursor-pointer"
            >
              {subLink}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuItem;