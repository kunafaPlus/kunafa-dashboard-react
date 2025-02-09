export function LabelWithIcon({ label, icon, subLabel,border=true }: { label: string, subLabel?: string, icon?: React.ReactNode,border?:boolean }) {
    return (
      <div className={`flex justify-between px-1 ${border?'border-b':''}  center pt-4`}>
        <div className=' flex-col'>
          <p className='text-[18px] font-bold'>{label}</p>
          <p className='text-[14px] font-bold mt-4'>{subLabel}</p>
        </div>
        <p>{icon}</p>
      </div>
    )
  }