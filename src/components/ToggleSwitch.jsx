import React from 'react';

const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div
        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none
       rounded-full peer peer-checked:after:translate-x-full dark:bg-gray-200
       rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
       after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white 
       after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
       after:transition-all peer-checked:bg-primary"
      ></div>
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
    </label>
  );
};

export default ToggleSwitch;