document.addEventListener('DOMContentLoaded', () => {
  requerirAutenticacion();
  actualizarHeaderUsuario();

  const sesion = obtenerSesion();
  const greetingName = document.getElementById('home-greeting-name');
  const roleSummary = document.getElementById('home-role-summary');

  if (!sesion) {
    return;
  }

  const resumenPorRol = {
    Administrador: 'Gestiona el flujo completo del gimnasio: ventas, inventario, asistencias y usuarios.',
    Encargado: 'Gestiona ventas, asistencias e inventario de la sucursal asignada.',
    Secretaria: 'Registra ventas, asistencias y pedidos de reposicion de la sucursal asignada.'
  };

  if (greetingName) {
    greetingName.textContent = sesion.role || 'Usuario';
  }

  if (roleSummary) {
    roleSummary.textContent = resumenPorRol[sesion.role] || 'Gestiona las operaciones principales del gimnasio.';
  }
});
