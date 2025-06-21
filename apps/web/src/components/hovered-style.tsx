import { useState } from 'react';

export const HoveredStyle = ({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={isHovered ? style : {}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
