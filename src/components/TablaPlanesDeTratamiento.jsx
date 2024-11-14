import React, { useState, useEffect } from 'react';
import DetallePlanModal from './DetallePlanModal';

const TablaPlanesDeTratamiento = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [turnos, setTurnos] = useState({}); // Guardar los detalles de los turnos por id_turno

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await fetch('http://localhost:5000/planesDeTratamiento');
        const data = await response.json();
        setPlanes(data);

        // Obtener detalles del turno si el plan tiene un id_turno
        const turnosDetails = {};
        for (let plan of data) {
          if (plan.id_turno) {
            const turnoResponse = await fetch(`http://localhost:5000/turnos/${plan.id_turno}`);
            const turnoData = await turnoResponse.json();
            turnosDetails[plan.id_turno] = turnoData;
          }
        }
        setTurnos(turnosDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, []);

  const handleRowClick = (plan) => {
    setSelectedPlan(plan);
  };

  const closeModal = () => {
    setSelectedPlan(null);
  };

  const formatDate = (date) => {
    // Si la fecha no es válida o es nula, retornamos una cadena vacía
    if (!date) return '';

    return new Date(date).toLocaleString('es-AR', {
      weekday: 'long', // Día de la semana
      year: 'numeric', // Año completo
      month: 'long', // Mes completo
      day: 'numeric', // Día del mes
      hour: '2-digit', // Hora en formato de dos dígitos
      minute: '2-digit' // Minutos en formato de dos dígitos
    });
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white border border-gray-300 shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">ID</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">DNI Paciente</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">Fecha Registro</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">Objetivos</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">Cantidad Sesiones</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">Fecha Inicio</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">Sesiones Semanales</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">Días de Asistencia</th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">Fecha y Hora del Turno</th> {/* Nueva columna */}
          </tr>
        </thead>
        <tbody>
          {planes.map((plan) => (
            <tr
              key={plan.id}
              onClick={() => handleRowClick(plan)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="py-2 px-4 border-b text-sm">{plan.id}</td>
              <td className="py-2 px-4 border-b text-sm">{plan.dni_paciente}</td>
              <td className="py-2 px-4 border-b text-sm">{formatDate(plan.fecha_registro)}</td> {/* Formatear la fecha de registro */}
              <td className="py-2 px-4 border-b text-sm">{plan.objetivos}</td>
              <td className="py-2 px-4 border-b text-sm">{plan.cantidad_sesiones}</td>
              <td className="py-2 px-4 border-b text-sm">{plan.fecha_inicio}</td>
              <td className="py-2 px-4 border-b text-sm">{plan.sesiones_semanales}</td>
              <td className="py-2 px-4 border-b text-sm">
                {Array.isArray(plan.dias_de_asistencia) && plan.dias_de_asistencia.length > 0
                  ? plan.dias_de_asistencia.join(' ')  // Unir los días con un espacio
                  : 'Sin días de asistencia'}
              </td>

              {/* Mostrar fecha y hora del turno */}
              <td className="py-2 px-4 border-b text-sm">
                {plan.id_turno && turnos[plan.id_turno]
                  ? `${new Date(turnos[plan.id_turno].fecha_y_hora).toLocaleString('es-AR', {
                    weekday: 'long', // Día de la semana
                    year: 'numeric', // Año completo
                    month: 'long', // Mes completo
                    day: 'numeric', // Día del mes
                    hour: '2-digit', // Hora en formato de dos dígitos
                    minute: '2-digit' // Minutos en formato de dos dígitos
                  })}`
                  : 'Sin turno'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPlan && (
        <DetallePlanModal plan={selectedPlan} closeModal={closeModal} />
      )}
    </div>
  );
};

export default TablaPlanesDeTratamiento;
