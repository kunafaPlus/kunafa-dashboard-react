import React from 'react';
import { BiChevronDown } from 'react-icons/bi';

function ButtonDropDown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-3 px-4 py-2 max-h-[40px] text-center text-text-secondary bg-bg-secondary rounded-xl">
      <span>{label}</span>
      <BiChevronDown />
    </button>
  );
}

export default ButtonDropDown;
