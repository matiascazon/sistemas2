import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const MenuMobile = () => {
  const [open,setOpen] = useState(false)
  const handleMenu = () => {
    setOpen(!open)
  }
  const location = useLocation()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    };
  }, [open])


  return (
    <>
    {/* Falta poner icons y logo del sitio */}
      <button onClick={handleMenu}>Menu</button>
      <div className={`${open ? ' z-20 w-2/12 h-screen bg-gray-200 absolute top-0 left-0' : 'w-0 hidden'} `}>
        <div className='w-full h-full flex flex-col'>
          <div className='w-full flex justify-between items-center p-6' >
            <div>logo</div>
            <button onClick={handleMenu}>cerrar</button>
          </div>
          <div className='px-5 mt-24'>
            <ul className='flex flex-col gap-y-5 text-lg font-semibold'>
              <li className={`${location.pathname === '/' && ' bg-indigo-400'} p-2 rounded-lg hover:bg-indigo-400 transition-colors w-full`}>
                <Link className='hover:text-black block' to={'/'} onClick={handleMenu}>Home</Link>
              </li>
              <li className={`${location.pathname === '/contacto' && ' bg-indigo-400'} p-2 rounded-lg hover:bg-indigo-400 transition-colors`}>
                <Link className='hover:text-black block' to={'/contacto'} onClick={handleMenu}>Contacto</Link>
              </li>
              <li className={`${location.pathname === '/favoritos' && ' bg-indigo-400'} p-2 rounded-lg hover:bg-indigo-400 transition-colors`}>
                <Link className='hover:text-black block' to={'/favoritos'} onClick={handleMenu}> Favoritos</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={`${open ? 'z-10 absolute top-0 left-0 h-screen w-screen bg-slate-500 bg-opacity-70' : 'hidden'}  `}
        onClick={handleMenu}
      ></div> 
    </>
  )
}

export default MenuMobile