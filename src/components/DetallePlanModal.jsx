import React, { useState, useEffect } from 'react';
import RegistrarEvolucionModal from './RegistrarEvolucionModal';  // Importamos el modal para registrar evolución

const DetallePlanModal = ({ plan, closeModal }) => {
  const [registrosEvolucion, setRegistrosEvolucion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);  // Estado para controlar la apertura del modal de registro de evolución

  useEffect(() => {
    const fetchRegistrosEvolucion = async () => {
      try {
        const response = await fetch(`http://localhost:5000/evoluciones?id_plan=${plan.id}`);
        const data = await response.json();
        setRegistrosEvolucion(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrosEvolucion();
  }, [plan.id]);

  const handleOpenRegistrarModal = () => {
    setShowRegistrarModal(true);  // Abrir el modal de registrar evolución
  };

  const handleCloseRegistrarModal = () => {
    setShowRegistrarModal(false);  // Cerrar el modal de registrar evolución
  };

  const refreshEvoluciones = async () => {
    const response = await fetch(`http://localhost:5000/evoluciones?id_plan=${plan.id}`);
    const data = await response.json();
    setRegistrosEvolucion(data);
  };

  const formatDate = (date, withTime = false) => {
    const options = withTime
      ? {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      : {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

    return new Date(date).toLocaleString('es-AR', options);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Detalles del Plan de Tratamiento</h2>

        <div className="mb-4">
          <p><strong>ID:</strong> {plan.id}</p>
          <p><strong>DNI Paciente:</strong> {plan.dni_paciente}</p>
          <p><strong>Fecha Registro:</strong> {formatDate(plan.fecha_registro, true)}</p>
          <p><strong>Objetivos:</strong> {plan.objetivos}</p>
          <p><strong>Cantidad Sesiones:</strong> {plan.cantidad_sesiones}</p>
          <p><strong>Fecha Inicio:</strong> {formatDate(plan.fecha_inicio)}</p>
          <p><strong>Sesiones Semanales:</strong> {plan.sesiones_semanales}</p>
          <p><strong>Días de Asistencia:</strong> {plan.dias_de_asistencia}</p>
        </div>

        <h3 className="text-lg font-semibold mb-2">Registros de Evolución</h3>
        <ul className="space-y-2">
          {registrosEvolucion.length > 0 ? (
            registrosEvolucion.map((registro) => (
              <li key={registro.id} className="border-b py-2">
                <p><strong>Fecha:</strong> {formatDate(registro.fecha_evolucion, false)}</p>
                <p><strong>Descripción:</strong> {registro.descripcion}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No hay registros de evolución disponibles.</li>
          )}
        </ul>

        <div className="flex justify-end mt-4">
          <button onClick={handleOpenRegistrarModal} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
            Registrar Evolución
          </button>
          <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal para registrar evolución */}
      {showRegistrarModal && (
        <RegistrarEvolucionModal
          plan={plan}
          closeModal={handleCloseRegistrarModal}
          refreshEvoluciones={refreshEvoluciones}
        />
      )}
    </div>
  );
};

export default DetallePlanModal;
