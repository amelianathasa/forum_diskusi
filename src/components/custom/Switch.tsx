import React from "react";

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className={`relative inline-block w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
    >
      <div
        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 transform ${checked ? 'translate-x-full' : 'translate-x-0'}`}
      />
    </div>
  );
};

export default Switch;
