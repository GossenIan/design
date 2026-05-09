/**
 * Módulo de autenticación compartido.
 * Lee la sesión almacenada en sessionStorage ('squatgym-user')
 * y expone helpers para verificar permisos por rol.
 */

const AUTH_SESSION_KEY = 'squatgym-user';

const ROLES = {
  ADMINISTRADOR: 'Administrador',
  ENCARGADO: 'Encargado',
  SECRETARIA: 'Secretaria'
};

function obtenerSesion() {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);

    if (!raw) {
      return null;
    }

    const sesion = JSON.parse(raw);

    return {
      user: String(sesion.user || ''),
      role: String(sesion.role || ''),
      sucursal: sesion.sucursal || null
    };
  } catch (error) {
    return null;
  }
}

function obtenerRol() {
  const sesion = obtenerSesion();

  return sesion?.role || '';
}

function obtenerSucursalUsuario() {
  const sesion = obtenerSesion();

  if (!sesion || sesion.role === ROLES.ADMINISTRADOR) {
    return null;
  }

  return sesion.sucursal || 'SquatGym Central';
}

function obtenerNombreUsuario() {
  const sesion = obtenerSesion();

  return sesion?.user || 'Usuario';
}

function esAdmin() {
  return obtenerRol() === ROLES.ADMINISTRADOR;
}

function esEncargado() {
  return obtenerRol() === ROLES.ENCARGADO;
}

function esSecretaria() {
  return obtenerRol() === ROLES.SECRETARIA;
}

function esEncargadoOSuperior() {
  const rol = obtenerRol();

  return rol === ROLES.ADMINISTRADOR || rol === ROLES.ENCARGADO;
}

function tieneSucursalFija() {
  const sesion = obtenerSesion();

  return Boolean(sesion && sesion.role !== ROLES.ADMINISTRADOR);
}

function aplicarPermisoVisibilidad(elementId, visible) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  if (visible) {
    element.classList.remove('hidden');
    element.removeAttribute('data-auth-hidden');
  } else {
    element.classList.add('hidden');
    element.setAttribute('data-auth-hidden', 'true');
  }
}

function obtenerRutaLogin() {
  const partes = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
  const indiceHome = partes.lastIndexOf('home');

  if (indiceHome === -1) {
    return 'index.html';
  }

  const profundidadDesdeHome = partes.length - indiceHome - 1;
  return profundidadDesdeHome > 1 ? '../../index.html' : '../index.html';
}

function requerirAutenticacion() {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = obtenerRutaLogin();
  }
}

function actualizarHeaderUsuario() {
  const sesion = obtenerSesion();

  if (!sesion) {
    return;
  }

  const nombreDisplay = sesion.user.charAt(0).toUpperCase() + sesion.user.slice(1);

  document.querySelectorAll('[data-auth-user-name]').forEach((element) => {
    element.textContent = nombreDisplay;
  });

  document.querySelectorAll('[data-auth-user-role]').forEach((element) => {
    element.textContent = sesion.role;
  });
}
