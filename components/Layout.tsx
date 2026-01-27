
import React, { useState, useEffect } from 'react';
import { ThemeType } from '../types';

interface LayoutProps {
  left: React.ReactNode;
  middle: React.ReactNode;
  right: React.ReactNode;
  theme: ThemeType;
}

export const Layout: React.FC<LayoutProps> = ({ left, middle, right, theme }) => {
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(380);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(220, Math.min(e.clientX - 64, 500));
        setLeftWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.max(300, Math.min(window.innerWidth - e.clientX, 600));
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = 'default';
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  const borderClass = {
    white: 'border-[#D2D2D7]',
    blue: 'border-[#003354]',
    grey: 'border-[#333333]'
  }[theme];

  const leftPanelBg = {
    white: 'bg-white',
    blue: 'bg-[#001424]/60',
    grey: 'bg-[#1D1D1F]'
  }[theme];

  const middlePanelBg = {
    white: 'bg-[#F5F5F7]',
    blue: 'bg-[#000C14]',
    grey: 'bg-[#161617]'
  }[theme];

  return (
    <div className="flex h-full w-full relative">
      {/* Left Column */}
      <div style={{ width: leftWidth }} className={`h-full border-r shrink-0 transition-all duration-700 ${borderClass} ${leftPanelBg}`}>
        {left}
      </div>

      {/* Divider 1 */}
      <div
        className={`w-1 hover:bg-blue-500/50 transition-colors cursor-col-resize shrink-0 z-10 flex items-center justify-center group`}
        onMouseDown={() => setIsResizingLeft(true)}
      >
        <div className="w-[1px] h-8 bg-zinc-500/20 group-hover:h-full group-hover:bg-blue-500 transition-all duration-300"></div>
      </div>

      {/* Middle Column */}
      <div className={`flex-1 h-full min-w-0 transition-all duration-700 ${middlePanelBg}`}>
        {middle}
      </div>

      {/* Divider 2 */}
      <div
        className={`w-1 hover:bg-blue-500/50 transition-colors cursor-col-resize shrink-0 z-10 flex items-center justify-center group`}
        onMouseDown={() => setIsResizingRight(true)}
      >
        <div className="w-[1px] h-8 bg-zinc-500/20 group-hover:h-full group-hover:bg-blue-500 transition-all duration-300"></div>
      </div>

      {/* Right Column */}
      <div style={{ width: rightWidth }} className={`h-full border-l shrink-0 transition-all duration-700 ${borderClass} ${leftPanelBg}`}>
        {right}
      </div>
    </div>
  );
};
