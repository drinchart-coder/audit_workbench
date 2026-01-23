
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  left: React.ReactNode;
  middle: React.ReactNode;
  right: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ left, middle, right }) => {
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(380);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(200, Math.min(e.clientX, 500));
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

  return (
    <div className="flex h-full w-full relative">
      {/* Left Column */}
      <div style={{ width: leftWidth }} className="h-full border-r border-zinc-800 bg-[#0f0f0f] shrink-0">
        {left}
      </div>

      {/* Divider 1 */}
      <div
        className="w-1 hover:bg-blue-600 transition-colors cursor-col-resize shrink-0 z-10"
        onMouseDown={() => setIsResizingLeft(true)}
      />

      {/* Middle Column */}
      <div className="flex-1 h-full min-w-0 bg-[#050505]">
        {middle}
      </div>

      {/* Divider 2 */}
      <div
        className="w-1 hover:bg-blue-600 transition-colors cursor-col-resize shrink-0 z-10"
        onMouseDown={() => setIsResizingRight(true)}
      />

      {/* Right Column */}
      <div style={{ width: rightWidth }} className="h-full border-l border-zinc-800 bg-[#0f0f0f] shrink-0">
        {right}
      </div>
    </div>
  );
};
