import React, { useState } from 'react';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { cn } from "../../../utils/cn";
import CustomButton from '../../Button/components/CustomButton';

const CounterWithLabel = ({title}:{title:string}) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div className="flex justify-between items-center border-b-2  px-4">
      {/* العنوان والقيمة */}
        <p className="text-[18px] font-medium">{title}</p>

      {/* أيقونات الزيادة والنقصان */}
      <div className="flex gap-3 items-center">
        <CustomButton variant='ghost' icon={<CiCirclePlus />} iconSize='2xl' onClick={increment} className='h-16 w-16 py-1'/>
        <p className='text-[24px]'>{count}</p>
        <CustomButton variant='ghost' icon={<CiCircleMinus />} iconSize='2xl' onClick={decrement} className='h-16 w-16 py-1'/>
      </div>

      {/* الخط الفاصل */}
    </div>
  );
};

export default CounterWithLabel;