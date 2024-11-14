import React, { useState } from 'react';
import TablaPlanesDeTratamiento from '../components/TablaPlanesDeTratamiento';
import NuevoPlanModal from '../components/NuevoPlanModal';

const Planes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Planes de Tratamiento</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openModal}
      >
        Agregar Nuevo Plan
      </button>
      
      <TablaPlanesDeTratamiento />
      
      {isModalOpen && <NuevoPlanModal closeModal={closeModal} />}
    </div>
  );
};

export default Planes;
