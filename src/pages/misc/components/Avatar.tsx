import React from 'react'

export default function Avatar({title,subTitle}:{title:string,subTitle:string}) {
  return (
    <div className="flex gap-4 items-center">
    <img src="/images/Ellipse 97.png" className="rounded-full object-cover" alt="Avatar" width={40} height={40}/>

    <section>
      <p className="text-base font-500">{title}</p>
      <p className="text-[14px] text-text-secondary">{subTitle}</p>
    </section>
  </div>  )
}
