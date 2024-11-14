import React, { useState, useEffect } from 'react';

const RegistrarEvolucionModal = ({ plan, closeModal, refreshEvoluciones }) => {
  const [fechaEvolucion, setFechaEvolucion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fechaInvalida, setFechaInvalida] = useState(false);
  const [fechaExistente, setFechaExistente] = useState(false);
  const [evolucionesRegistradas, setEvolucionesRegistradas] = useState(0); // Estado para contar las evoluciones
  const [sesionesPendientes, setSesionesPendientes] = useState(true); // Estado para validar si hay espacio para más evoluciones

  // Función para validar que la fecha sea mayor que la actual
  const validarFecha = (fecha) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    return fecha > fechaActual;
  };

  useEffect(() => {
    const verificarEvolucionExistente = async () => {
      if (fechaEvolucion) {
        try {
          // Consultamos si ya existe una evolución para la fecha seleccionada
          const response = await fetch(`http://localhost:5000/evoluciones?fecha_evolucion=${fechaEvolucion}&id_plan=${plan.id}`);
          const data = await response.json();
          setFechaExistente(data.length > 0); // Si hay registros, fecha ya está tomada
        } catch (error) {
          setError(error.message);
        }
      }
    };

    // Consultamos la cantidad de evoluciones registradas para este plan y la cantidad de sesiones
    const obtenerEvolucionesRegistradas = async () => {
      try {
        const response = await fetch(`http://localhost:5000/evoluciones?id_plan=${plan.id}`);
        const data = await response.json();
        setEvolucionesRegistradas(data.length);
        setSesionesPendientes(data.length < plan.cantidad_sesiones); // Validamos si hay espacio
      } catch (error) {
        setError(error.message);
      }
    };

    if (fechaEvolucion) {
      setFechaInvalida(!validarFecha(fechaEvolucion)); // Validación de fecha mayor a la actual
      verificarEvolucionExistente();
    }

    obtenerEvolucionesRegistradas();
  }, [fechaEvolucion, plan.id, plan.cantidad_sesiones]); // Dependencia de plan.id y cantidad_sesiones

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validamos que la fecha sea válida y que no se haya alcanzado el límite de evoluciones
    if (fechaInvalida || fechaExistente || !sesionesPendientes) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/evoluciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_plan: plan.id,
          fecha_evolucion: fechaEvolucion,
          descripcion: descripcion,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la evolución');
      }

      // Refrescar la lista de evoluciones
      refreshEvoluciones();
      closeModal();  // Cerrar el modal de registrar evolución
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Registrar Nueva Evolución</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {fechaExistente && (
          <div className="text-red-500 mb-4">
            Ya existe una evolución registrada para esta fecha.
          </div>
        )}
        {fechaInvalida && (
          <div className="text-red-500 mb-4">
            La fecha debe ser mayor que la fecha actual.
          </div>
        )}
        {!sesionesPendientes && (
          <div className="text-red-500 mb-4">
            Ya se han registrado todas las evoluciones permitidas para este plan.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fechaEvolucion" className="block text-sm font-medium">Fecha de Evolución</label>
            <input
              type="date"
              id="fechaEvolucion"
              value={fechaEvolucion}
              onChange={(e) => setFechaEvolucion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading || fechaInvalida || fechaExistente || !sesionesPendientes}
            >
              {loading ? 'Registrando...' : 'Registrar Evolución'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded ml-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarEvolucionModal;
