import { useState } from "react";
import { CiStar } from "react-icons/ci";

export  function CustomRating() {
    const [value, setValue] =useState<number | null>(2);
  
    return (
  <div className='flex gap-1'>
    <CiStar/>
    <CiStar/>
    <CiStar/>
    <CiStar/>
    <CiStar/>
  </div>
    );
  }