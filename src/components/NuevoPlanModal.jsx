import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const NuevoPlanModal = ({ closeModal }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [pacientes, setPacientes] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [selectedDni, setSelectedDni] = useState('');
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  
  // Ver la cantidad de sesiones semanales seleccionadas para validaciones
  const sesionesSemanales = watch('sesiones_semanales', 0);

  // Cargar la lista de pacientes desde el endpoint
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch('http://localhost:5000/Pacientes');
        const data = await response.json();
        setPacientes(data);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
      }
    };
    fetchPacientes();
  }, []);

  // Cargar los turnos del paciente según el DNI
  useEffect(() => {
    if (selectedDni) {
      const fetchTurnos = async () => {
        try {
          const response = await fetch(`http://localhost:5000/Turnos?dni_paciente=${selectedDni}`);
          const data = await response.json();
          setTurnos(data);
        } catch (error) {
          console.error("Error al cargar los turnos:", error);
        }
      };
      fetchTurnos();
    }
  }, [selectedDni]);

  const onSubmit = async (data) => {
    // Agregar la fecha actual al objeto de datos
    const fechaActual = new Date().toISOString(); 
    const datosConFecha = { ...data, fecha_registro: fechaActual, dias_de_asistencia: diasSeleccionados };

    try {
      const response = await fetch('http://localhost:5000/PlanesDeTratamiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosConFecha),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Nuevo plan de tratamiento guardado:', result);
        closeModal();
      } else {
        console.error('Error al guardar el plan de tratamiento:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  // Validaciones personalizadas
  const validateDniPaciente = (dni) => {
    if (!/^\d+$/.test(dni)) {
      return 'El DNI debe contener solo números';
    }
    if (dni.length > 9) {
      return 'El DNI no puede tener más de 9 dígitos';
    }
    const pacienteExiste = pacientes.some((paciente) => paciente.dni === dni);
    return pacienteExiste || 'El DNI no está registrado';
  };

  const validateFechaInicio = (fechaInicio) => {
    const fechaActual = new Date();
    return new Date(fechaInicio) > fechaActual || 'La fecha de inicio debe ser mayor a la fecha actual';
  };

  const validateSesionesSemanales = (value) => {
    if (value > 5) {
      return 'Las sesiones semanales no pueden ser más de 5';
    }
    if (value > sesionesSemanales) {
      return 'Las sesiones semanales no pueden ser mayores a la cantidad de sesiones';
    }
    return true;
  };

  const handleDiaChange = (dia) => {
    setDiasSeleccionados(prevState => {
      if (prevState.includes(dia)) {
        return prevState.filter(d => d !== dia);  // Eliminar el día si ya estaba seleccionado
      }
      if (prevState.length < sesionesSemanales) {
        return [...prevState, dia];  // Agregar el día si no se ha alcanzado el límite
      }
      return prevState;
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Plan de Tratamiento</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* DNI Paciente */}
          <div>
            <input
              type="text"
              {...register('dni_paciente', { 
                required: 'El DNI es obligatorio', 
                validate: validateDniPaciente
              })}
              placeholder="DNI del Paciente"
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setSelectedDni(e.target.value)}
            />
            {errors.dni_paciente && (
              <p className="text-red-500 text-sm">{errors.dni_paciente.message}</p>
            )}
          </div>

          {/* Select de Turnos */}
          {selectedDni && (
            <div>
              <label htmlFor="turno" className="block text-sm font-medium text-gray-700">
                Selecciona un Turno
              </label>
              <select
                {...register('id_turno', { required: 'Debes seleccionar un turno' })}
                className="w-full px-3 py-2 mt-1 border rounded"
              >
                <option value="">Seleccione un turno</option>
                {turnos.map((turno) => (
                  <option key={turno.id} value={turno.id}>
                  {new Date(turno.fecha_y_hora).toLocaleString('es-AR', {
                    weekday: 'long', // Día de la semana
                    year: 'numeric', // Año
                    month: 'long', // Mes
                    day: 'numeric', // Día
                    hour: 'numeric', // Hora
                    minute: 'numeric', // Minutos
                    second: 'numeric', // Segundos (opcional)
                    hour12: false, // Para formato de 24 horas
                  })}
                </option>
                
                ))}
              </select>
              {errors.id_turno && (
                <p className="text-red-500 text-sm">{errors.id_turno.message}</p>
              )}
            </div>
          )}

          {/* Objetivos */}
          <div>
            <input
              type="text"
              {...register('objetivos', { required: 'Los objetivos son obligatorios' })}
              placeholder="Objetivos"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.objetivos && (
              <p className="text-red-500 text-sm">{errors.objetivos.message}</p>
            )}
          </div>

          {/* Cantidad de Sesiones */}
          <div>
            <input
              type="number"
              {...register('cantidad_sesiones', {
                required: 'La cantidad de sesiones es obligatoria',
                valueAsNumber: true,
                min: { value: 1, message: 'Debe ser un número mayor que 0' },
                pattern: { value: /^[0-9]+$/, message: 'Debe ser un número entero positivo' }
              })}
              placeholder="Cantidad de Sesiones"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.cantidad_sesiones && (
              <p className="text-red-500 text-sm">{errors.cantidad_sesiones.message}</p>
            )}
          </div>

          {/* Fecha de Inicio */}
          <div className="mt-2">
            <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
              Fecha de inicio
            </label>
            <input
              type="date"
              {...register('fecha_inicio', {
                required: 'La fecha de inicio es obligatoria',
                validate: validateFechaInicio
              })}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
            {errors.fecha_inicio && (
              <p className="text-red-500 text-sm">{errors.fecha_inicio.message}</p>
            )}
          </div>

          {/* Sesiones Semanales */}
          <div>
            <input
              type="number"
              {...register('sesiones_semanales', {
                required: 'Las sesiones semanales son obligatorias',
                valueAsNumber: true,
                validate: validateSesionesSemanales
              })}
              placeholder="Sesiones Semanales"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.sesiones_semanales && (
              <p className="text-red-500 text-sm">{errors.sesiones_semanales.message}</p>
            )}
          </div>

          {/* Días de Asistencia (checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Días de Asistencia</label>
            <div className="grid grid-cols-2 gap-2">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
                <label key={dia} className="flex items-center">
                  <input
                    type="checkbox"
                    value={dia}
                    checked={diasSeleccionados.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                    disabled={diasSeleccionados.length >= sesionesSemanales && !diasSeleccionados.includes(dia)}
                    className="mr-2"
                  />
                  {dia}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">
            Registrar Plan de Tratamiento
          </button>
          <button
              type="button"
              onClick={closeModal}
              className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancelar
            </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoPlanModal;
