import React from "react";

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
    >
      <div
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </div>
  );
};

export default Switch;
