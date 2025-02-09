import React from 'react'
import { CiCalendarDate } from 'react-icons/ci'

export default function TitleWithSubTitleBorder({title,subTitle}:{title:string,subTitle:string}) {
  return (
    <section className=" border-l-2 pe-6 leading-7 mt-4">
    <div className="flex items-center gap-1 text-text-secondary">
      <CiCalendarDate />
      <p className="text-[14px] ">{title}</p>
    </div>
    <p className="text-[14px] font-bold">{subTitle}</p>
  </section>  )
}
