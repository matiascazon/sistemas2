import { Link, useLocation, useParams } from "react-router-dom";
import MenuMobile from "./MenuMobile";
import { useContext, useEffect, useState } from "react";

//Este componente debera ser estilado como "dark" o "light" dependiendo del theme del Context

const Navbar = () => {
  const location = useLocation()
  




  return (
    <nav className=" bg-gray-200 w-full px-8 py-6 flex justify-between items-center font-semibold ">
      {/* Aqui deberan agregar los liks correspondientes a las rutas definidas */}
      {/* Deberan implementar ademas la logica para cambiar de Theme con el button */}
      <div className=''>
        <MenuMobile/>
      </div>
      
      <div>
        <h1>Logo</h1>
      </div>

      <div className='hidden md:block'>
        <ul className='flex gap-x-6 text-lg font-medium'>
          <li className={`${location.pathname === '/' && 'after:absolute after:bottom-0 after:left-0 after:w-full after:bg-indigo-400 after:h-1'} pt-2 rounded-lg relative cursor-pointer group`}>
            <Link className='hover:text-black m-0 w-full h-full dark:hover:text-gray-300' to={'/'}>Home</Link>
            <span className="absolute bottom-0 left-0 w-full bg-indigo-400 h-1 transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
          </li>
          <li className={`${location.pathname === '/contacto' && 'after:absolute after:bottom-0 after:left-0 after:w-full after:bg-indigo-400 after:h-1'} pt-2 rounded-lg relative cursor-pointer group`}>
            <Link className='hover:text-black m-0 w-full h-full dark:hover:text-gray-300' to={'/contacto'}>Contacto</Link>
            <span className="absolute bottom-0 left-0 w-full bg-indigo-400 h-1 transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
          </li>
          <li className={`${location.pathname === '/favoritos' && 'after:absolute after:bottom-0 after:left-0 after:w-full after:bg-indigo-400 after:h-1'} pt-2 rounded-lg relative cursor-pointer group`}>
            <Link className='hover:text-black m-0 w-full h-full dark:hover:text-gray-300' to={'/favoritos'}>Favoritos</Link>
            <span className="absolute bottom-0 left-0 w-full bg-indigo-400 h-1 transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
          </li>
          
        </ul>
      </div>

    </nav>
  );
};

export default Navbar;