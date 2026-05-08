const ROLES_USUARIO = [
  'Administrador',
  'Encargado',
  'Secretaria'
];

const PERMISOS_USUARIO = [
  { id: 'kiosco', label: 'Kiosco' },
  { id: 'inventario', label: 'Inventario' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'auditoria', label: 'Auditoria' },
  { id: 'caja', label: 'Cierre de caja' },
  { id: 'asistencias', label: 'Asistencias' }
];
const USUARIOS_PAGE_SIZE = 3;
const SUCURSAL_USUARIO_DEFAULT = 'SquatGym Central';
const AUDITORIAS_STORAGE_KEY = 'squatgym-users-audits';

const usuariosDemo = [
  {
    id: 'u-1',
    usuario: 'amoreno',
    contrasena: 'Admin2026!',
    nombre: 'Alejandro Moreno',
    email: 'amoreno@squatgym.com',
    rol: 'Administrador',
    sucursal: 'SquatGym Central',
    estado: 'Activo',
    iniciales: 'AM',
    permisos: ['kiosco', 'inventario', 'usuarios', 'auditoria', 'caja', 'asistencias']
  },
  {
    id: 'u-2',
    usuario: 'bsanchez',
    contrasena: 'Kiosco2026!',
    nombre: 'Beatriz Sanchez',
    email: 'bsanchez@squatgym.com',
    rol: 'Encargado',
    sucursal: 'SquatGym Central',
    estado: 'Activo',
    iniciales: 'BS',
    permisos: ['kiosco', 'caja', 'auditoria']
  },
  {
    id: 'u-3',
    usuario: 'cruiz',
    contrasena: 'Operativo2026!',
    nombre: 'Carlos Ruiz',
    email: 'cruiz@squatgym.com',
    rol: 'Secretaria',
    sucursal: 'Sucursal Sur',
    estado: 'Inactivo',
    iniciales: 'CR',
    permisos: ['asistencias']
  },
  {
    id: 'u-4',
    usuario: 'dlopez',
    contrasena: 'Inventario2026!',
    nombre: 'Diana Lopez',
    email: 'dlopez@squatgym.com',
    rol: 'Encargado',
    sucursal: 'Sucursal Sur',
    estado: 'Activo',
    iniciales: 'DL',
    permisos: ['inventario', 'auditoria']
  }
];

let usuarios = usuariosDemo.map((usuario) => ({ ...usuario, permisos: [...usuario.permisos] }));
let usuarioSeleccionadoId = usuarios[0]?.id || '';
let busquedaUsuarios = '';
let filtroRol = 'todos';
let paginaUsuariosActual = 1;
let auditSuggestionIndex = -1;
let usersSearchSuggestionIndex = -1;
let auditCalendarMonthDate = new Date();
let auditRangeDraftStart = '';
let cambiosUsuariosPendientes = [];
let cambioUsuarioEnConfirmacion = null;
const auditoriasDemo = [
  {
    id: 'a-1',
    userId: 'u-1',
    fechaISO: '2026-05-04T08:15:00',
    modulo: 'Seguridad',
    accion: 'Login Exitoso',
    detalle: 'IP: 192.168.1.15'
  },
  {
    id: 'a-2',
    userId: 'u-2',
    fechaISO: '2026-05-04T09:00:00',
    modulo: 'Kiosco',
    accion: 'Venta',
    detalle: 'Venta Proteina Gold Standard #1777901206880'
  },
  {
    id: 'a-3',
    userId: 'u-4',
    fechaISO: '2026-05-04T10:30:00',
    modulo: 'Inventario',
    accion: 'Reposicion',
    detalle: 'Carga de stock PED-GENERAL-001 - Sede Central'
  },
  {
    id: 'a-4',
    userId: 'u-2',
    fechaISO: '2026-05-04T11:45:00',
    modulo: 'Kiosco',
    accion: 'Cierre de caja',
    detalle: 'Cierre de caja 04/05/2026 12:00'
  }
];
let auditorias = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buscarUsuarioPorId(id) {
  return usuarios.find((usuario) => usuario.id === id) || null;
}

function obtenerUsuario(id = usuarioSeleccionadoId) {
  return buscarUsuarioPorId(id) || usuarios[0] || null;
}

function buscarUsuarioPorTexto(value = '') {
  const query = String(value || '').trim().toLowerCase();

  if (!query) {
    return null;
  }

  return usuarios.find((usuario) => [
    usuario.usuario,
    usuario.nombre,
    usuario.email,
    `@${usuario.usuario}`
  ].some((campo) => String(campo || '').toLowerCase() === query)) || null;
}

function obtenerCamposBusquedaUsuario(usuario) {
  return [
    usuario.usuario,
    `@${usuario.usuario}`,
    usuario.nombre,
    usuario.email,
    usuario.rol,
    ...obtenerPermisosTexto(usuario.permisos)
  ];
}

function obtenerUsuariosCoincidentes(value = '') {
  const query = String(value || '').trim().toLowerCase();

  if (!query) {
    return usuarios.slice(0, 6);
  }

  return usuarios
    .map((usuario) => {
      const campos = obtenerCamposBusquedaUsuario(usuario).map((campo) => String(campo || '').toLowerCase());
      const exacto = campos.some((campo) => campo === query);
      const inicio = campos.some((campo) => campo.startsWith(query));
      const contiene = campos.some((campo) => campo.includes(query));

      if (!contiene) {
        return null;
      }

      const score = exacto ? 0 : inicio ? 1 : usuario.usuario.toLowerCase().includes(query) ? 2 : usuario.nombre.toLowerCase().includes(query) ? 3 : 4;

      return {
        usuario,
        score
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.usuario.nombre.localeCompare(b.usuario.nombre))
    .slice(0, 7)
    .map((resultado) => resultado.usuario);
}

function resaltarCoincidencia(value, query) {
  const text = String(value || '');
  const cleanQuery = String(query || '').trim().toLowerCase();

  if (!cleanQuery) {
    return escapeHtml(text);
  }

  const index = text.toLowerCase().indexOf(cleanQuery);

  if (index < 0) {
    return escapeHtml(text);
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + cleanQuery.length);
  const after = text.slice(index + cleanQuery.length);

  return `${escapeHtml(before)}<strong>${escapeHtml(match)}</strong>${escapeHtml(after)}`;
}

function ocultarSugerenciasAuditoria() {
  const panel = document.getElementById('audit-user-suggestions');
  const input = document.getElementById('audit-user-search');

  auditSuggestionIndex = -1;
  panel?.classList.add('hidden');
  input?.setAttribute('aria-expanded', 'false');
}

function renderizarSugerenciasAuditoria(value = '', visible = true) {
  const panel = document.getElementById('audit-user-suggestions');
  const input = document.getElementById('audit-user-search');

  if (!panel || !input) {
    return;
  }

  if (!visible) {
    ocultarSugerenciasAuditoria();
    return;
  }

  const query = String(value || '').trim();
  const resultados = obtenerUsuariosCoincidentes(query);

  input.setAttribute('aria-expanded', 'true');
  panel.classList.remove('hidden');

  if (!resultados.length) {
    auditSuggestionIndex = -1;
    panel.innerHTML = `
      <div class="users-suggestion-row users-suggestion-row-empty">
        <span class="material-symbols-outlined text-lg">search_off</span>
        <span>No hay usuarios coincidentes</span>
      </div>
    `;
    return;
  }

  if (auditSuggestionIndex < 0 || auditSuggestionIndex >= resultados.length) {
    auditSuggestionIndex = 0;
  }

  panel.innerHTML = resultados
    .map((usuario, index) => `
      <button type="button" class="users-suggestion-row ${index === auditSuggestionIndex ? 'users-suggestion-row-active' : ''}" data-user-id="${escapeHtml(usuario.id)}" role="option" aria-selected="${index === auditSuggestionIndex ? 'true' : 'false'}">
        <span class="material-symbols-outlined text-lg">search</span>
        <span class="min-w-0">
          <span class="block truncate">${resaltarCoincidencia(usuario.usuario, query)} - ${resaltarCoincidencia(usuario.nombre, query)}</span>
          <span class="users-suggestion-row-meta">${escapeHtml(usuario.rol)} - ${escapeHtml(usuario.email)}</span>
        </span>
      </button>
    `)
    .join('');
}

function moverSugerenciaAuditoria(delta) {
  const input = document.getElementById('audit-user-search');
  const resultados = obtenerUsuariosCoincidentes(input?.value || '');

  if (!resultados.length) {
    return;
  }

  auditSuggestionIndex = (auditSuggestionIndex + delta + resultados.length) % resultados.length;
  renderizarSugerenciasAuditoria(input?.value || '', true);
}

function seleccionarSugerenciaAuditoria(id) {
  const usuario = obtenerUsuario(id);
  const input = document.getElementById('audit-user-search');
  const select = document.getElementById('audit-user-select');

  if (!usuario) {
    return false;
  }

  usuarioSeleccionadoId = usuario.id;

  if (input) {
    input.value = usuario.usuario;
  }

  if (select) {
    select.value = usuario.id;
  }

  mostrarErrorAuditoriaInline('');
  ocultarSugerenciasAuditoria();
  renderizarTodoUsuarios();
  return true;
}

function confirmarSugerenciaAuditoria() {
  const input = document.getElementById('audit-user-search');
  const resultados = obtenerUsuariosCoincidentes(input?.value || '');
  const usuario = resultados[auditSuggestionIndex] || resultados[0];

  return usuario ? seleccionarSugerenciaAuditoria(usuario.id) : false;
}

function ocultarSugerenciasBusquedaUsuarios() {
  const panel = document.getElementById('users-search-suggestions');
  const input = document.getElementById('users-search');

  usersSearchSuggestionIndex = -1;
  panel?.classList.add('hidden');
  input?.setAttribute('aria-expanded', 'false');
}

function renderizarSugerenciasBusquedaUsuarios(value = '', visible = true) {
  const panel = document.getElementById('users-search-suggestions');
  const input = document.getElementById('users-search');

  if (!panel || !input) {
    return;
  }

  if (!visible) {
    ocultarSugerenciasBusquedaUsuarios();
    return;
  }

  const query = String(value || '').trim();
  const resultados = obtenerUsuariosCoincidentes(query);

  input.setAttribute('aria-expanded', 'true');
  panel.classList.remove('hidden');

  if (!resultados.length) {
    usersSearchSuggestionIndex = -1;
    panel.innerHTML = `
      <div class="users-suggestion-row users-suggestion-row-empty">
        <span class="material-symbols-outlined text-lg">search_off</span>
        <span>No hay usuarios coincidentes</span>
      </div>
    `;
    return;
  }

  if (usersSearchSuggestionIndex < 0 || usersSearchSuggestionIndex >= resultados.length) {
    usersSearchSuggestionIndex = 0;
  }

  panel.innerHTML = resultados
    .map((usuario, index) => `
      <button type="button" class="users-suggestion-row ${index === usersSearchSuggestionIndex ? 'users-suggestion-row-active' : ''}" data-user-id="${escapeHtml(usuario.id)}" role="option" aria-selected="${index === usersSearchSuggestionIndex ? 'true' : 'false'}">
        <span class="material-symbols-outlined text-lg">search</span>
        <span class="min-w-0">
          <span class="block truncate">${resaltarCoincidencia(usuario.usuario, query)} - ${resaltarCoincidencia(usuario.nombre, query)}</span>
          <span class="users-suggestion-row-meta">${escapeHtml(usuario.rol)} - ${escapeHtml(usuario.email)}</span>
        </span>
      </button>
    `)
    .join('');
}

function moverSugerenciaBusquedaUsuarios(delta) {
  const input = document.getElementById('users-search');
  const resultados = obtenerUsuariosCoincidentes(input?.value || '');

  if (!resultados.length) {
    return;
  }

  usersSearchSuggestionIndex = (usersSearchSuggestionIndex + delta + resultados.length) % resultados.length;
  renderizarSugerenciasBusquedaUsuarios(input?.value || '', true);
}

function seleccionarSugerenciaBusquedaUsuarios(id) {
  const usuario = obtenerUsuario(id);
  const input = document.getElementById('users-search');

  if (!usuario) {
    return false;
  }

  usuarioSeleccionadoId = usuario.id;
  busquedaUsuarios = usuario.usuario;
  paginaUsuariosActual = 1;

  if (input) {
    input.value = usuario.usuario;
  }

  ocultarSugerenciasBusquedaUsuarios();
  renderizarTodoUsuarios();
  return true;
}

function confirmarSugerenciaBusquedaUsuarios() {
  const input = document.getElementById('users-search');
  const resultados = obtenerUsuariosCoincidentes(input?.value || '');
  const usuario = resultados[usersSearchSuggestionIndex] || resultados[0];

  return usuario ? seleccionarSugerenciaBusquedaUsuarios(usuario.id) : false;
}

function generarIniciales(nombre = '') {
  const partes = String(nombre || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (partes[0]?.[0] || 'U') + (partes[1]?.[0] || partes[0]?.[1] || '');
}

function normalizarUsuarioLogin(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '');
}

function formatFechaAuditoria(value = new Date()) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function normalizarAuditoria(audit) {
  const userId = String(audit?.userId || '').trim();
  const modulo = String(audit?.modulo || '').trim();
  const accion = String(audit?.accion || '').trim();
  const detalle = String(audit?.detalle || '').trim();
  const fechaISO = String(audit?.fechaISO || '').trim();

  if (!userId || !modulo || !accion || !detalle || !fechaISO) {
    return null;
  }

  return {
    id: String(audit?.id || `audit-${Date.now()}`),
    userId,
    fechaISO,
    modulo,
    accion,
    detalle,
    sucursal: String(audit?.sucursal || '').trim()
  };
}

function cargarAuditorias() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUDITORIAS_STORAGE_KEY) || '[]');
    const normalizadas = Array.isArray(saved)
      ? saved.map(normalizarAuditoria).filter(Boolean)
      : [];

    auditorias = normalizadas.length
      ? normalizadas
      : auditoriasDemo.map((audit) => ({ ...audit }));
  } catch (error) {
    auditorias = auditoriasDemo.map((audit) => ({ ...audit }));
  }
}

function guardarAuditorias() {
  try {
    localStorage.setItem(AUDITORIAS_STORAGE_KEY, JSON.stringify(auditorias));
  } catch (error) {
    return false;
  }

  return true;
}

function normalizarFechaInput(value) {
  return String(value || '').slice(0, 10);
}

function obtenerRangoReporte() {
  const fromInput = document.getElementById('audit-report-date-from');
  const toInput = document.getElementById('audit-report-date-to');

  return {
    desde: normalizarFechaInput(fromInput?.value),
    hasta: normalizarFechaInput(toInput?.value)
  };
}

function crearFechaLocal(value) {
  const fecha = normalizarFechaInput(value);

  if (!fecha) {
    return null;
  }

  const date = new Date(`${fecha}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatearFechaInputLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDiaRango(value) {
  const date = crearFechaLocal(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  }).format(date);
}

function formatFechaReporteLabel(value) {
  const date = crearFechaLocal(value);

  if (!date) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

function actualizarEtiquetasRangoReporte() {
  const rango = obtenerRangoReporte();
  const fromLabel = document.getElementById('audit-report-date-from-label');
  const toLabel = document.getElementById('audit-report-date-to-label');

  if (fromLabel) {
    fromLabel.textContent = formatFechaReporteLabel(rango.desde);
  }

  if (toLabel) {
    toLabel.textContent = formatFechaReporteLabel(rango.hasta);
  }
}

function formatTituloCalendarioReporte(date) {
  return new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function cerrarCalendarioReporte() {
  document.getElementById('audit-date-calendar')?.classList.add('hidden');
  document.getElementById('audit-date-range-trigger')?.setAttribute('aria-expanded', 'false');
}

function abrirCalendarioReporte() {
  const rango = obtenerRangoReporte();
  auditCalendarMonthDate = crearFechaLocal(rango.desde) || auditCalendarMonthDate || new Date();
  document.getElementById('audit-date-calendar')?.classList.remove('hidden');
  document.getElementById('audit-date-range-trigger')?.setAttribute('aria-expanded', 'true');
  renderizarCalendarioReporte();
}

function alternarCalendarioReporte() {
  const calendar = document.getElementById('audit-date-calendar');

  if (calendar?.classList.contains('hidden')) {
    abrirCalendarioReporte();
  } else {
    cerrarCalendarioReporte();
  }
}

function setRangoReporte(desde = '', hasta = '') {
  const fromInput = document.getElementById('audit-report-date-from');
  const toInput = document.getElementById('audit-report-date-to');

  if (fromInput) {
    fromInput.value = normalizarFechaInput(desde);
  }

  if (toInput) {
    toInput.value = normalizarFechaInput(hasta);
  }

  renderizarDiasRangoReporte();
}

function renderizarCalendarioReporte() {
  const grid = document.getElementById('audit-calendar-grid');
  const title = document.getElementById('audit-calendar-title');

  if (!grid || !title) {
    return;
  }

  const monthDate = new Date(auditCalendarMonthDate);
  monthDate.setDate(1);
  const rango = obtenerRangoReporte();
  const desdeDate = crearFechaLocal(rango.desde);
  const hastaDate = crearFechaLocal(rango.hasta);
  const todayValue = formatearFechaInputLocal(new Date());
  const firstDayOffset = (monthDate.getDay() + 6) % 7;
  const gridStart = new Date(monthDate);
  gridStart.setDate(monthDate.getDate() - firstDayOffset);

  title.textContent = formatTituloCalendarioReporte(monthDate);

  grid.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const dayDate = new Date(gridStart);
    dayDate.setDate(gridStart.getDate() + index);
    const value = formatearFechaInputLocal(dayDate);
    const isCurrentMonth = dayDate.getMonth() === monthDate.getMonth();
    const isToday = value === todayValue;
    const isStart = value === rango.desde;
    const isEnd = value === rango.hasta;
    const isInRange = Boolean(desdeDate && hastaDate && dayDate >= desdeDate && dayDate <= hastaDate);
    const classes = [
      'users-calendar-day',
      isCurrentMonth ? '' : 'users-calendar-day-muted',
      isToday ? 'users-calendar-day-today' : '',
      isInRange ? 'users-calendar-day-in-range' : '',
      isStart || isEnd ? 'users-calendar-day-selected' : ''
    ].filter(Boolean).join(' ');

    return `
      <button type="button" class="${classes}" data-date="${escapeHtml(value)}" aria-pressed="${isStart || isEnd ? 'true' : 'false'}">
        ${dayDate.getDate()}
      </button>
    `;
  }).join('');
}

function cambiarMesCalendarioReporte(delta) {
  const next = new Date(auditCalendarMonthDate);
  next.setDate(1);
  next.setMonth(next.getMonth() + delta);
  auditCalendarMonthDate = next;
  renderizarCalendarioReporte();
}

function seleccionarDiaCalendarioReporte(value) {
  const selected = normalizarFechaInput(value);
  const rango = obtenerRangoReporte();

  if (!selected) {
    return;
  }

  if (!auditRangeDraftStart || (rango.desde && rango.hasta)) {
    auditRangeDraftStart = selected;
    setRangoReporte(selected, '');
    return;
  }

  const startDate = crearFechaLocal(auditRangeDraftStart);
  const selectedDate = crearFechaLocal(selected);
  const desde = selectedDate < startDate ? selected : auditRangeDraftStart;
  const hasta = selectedDate < startDate ? auditRangeDraftStart : selected;

  auditRangeDraftStart = '';
  setRangoReporte(desde, hasta);
}

function limpiarRangoCalendarioReporte() {
  auditRangeDraftStart = '';
  setRangoReporte('', '');
}

function seleccionarHoyCalendarioReporte() {
  const today = formatearFechaInputLocal(new Date());
  auditRangeDraftStart = '';
  auditCalendarMonthDate = crearFechaLocal(today) || new Date();
  setRangoReporte(today, today);
}

function obtenerDiasRangoReporte(desde, hasta) {
  const desdeDate = crearFechaLocal(desde);
  const hastaDate = crearFechaLocal(hasta);

  if (!desdeDate || !hastaDate) {
    return {
      estado: 'incompleto',
      dias: []
    };
  }

  if (desdeDate > hastaDate) {
    return {
      estado: 'invalido',
      dias: []
    };
  }

  const dias = [];
  const actual = new Date(desdeDate);

  while (actual <= hastaDate) {
    dias.push(formatearFechaInputLocal(actual));
    actual.setDate(actual.getDate() + 1);
  }

  return {
    estado: 'ok',
    dias
  };
}

function renderizarDiasRangoReporte() {
  const container = document.getElementById('audit-report-days');

  actualizarEtiquetasRangoReporte();
  renderizarCalendarioReporte();

  if (!container) {
    return;
  }

  const rango = obtenerRangoReporte();
  const resultado = obtenerDiasRangoReporte(rango.desde, rango.hasta);

  if (resultado.estado === 'incompleto') {
    container.innerHTML = `
      <div class="users-date-range-panel users-date-range-panel-muted">
        <span class="material-symbols-outlined text-lg">date_range</span>
        Seleccione desde y hasta para marcar los dias del reporte.
      </div>
    `;
    return;
  }

  if (resultado.estado === 'invalido') {
    container.innerHTML = `
      <div class="users-date-range-panel users-date-range-panel-error">
        <span class="material-symbols-outlined text-lg">warning</span>
        El rango de fechas no es valido.
      </div>
    `;
    return;
  }

  const diasHtml = resultado.dias
    .map((dia, index) => `
      <span class="users-date-chip" title="${escapeHtml(dia)}">
        <span class="users-date-chip-index">${index + 1}</span>
        ${escapeHtml(formatDiaRango(dia))}
      </span>
    `)
    .join('');

  container.innerHTML = `
    <div class="users-date-range-panel">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 font-black text-primary">
          <span class="material-symbols-outlined text-lg">event_available</span>
          Dias incluidos
        </div>
        <strong class="text-xs uppercase tracking-wider text-on-surface-variant">${resultado.dias.length} dias marcados</strong>
      </div>
      <div class="mt-3 flex max-h-28 flex-wrap gap-2 overflow-y-auto pr-1">
        ${diasHtml}
      </div>
    </div>
  `;
}

function filtrarRegistrosPorRango(registros, desde = '', hasta = '') {
  const desdeDate = desde ? new Date(`${desde}T00:00:00`) : null;
  const hastaDate = hasta ? new Date(`${hasta}T23:59:59`) : null;

  return registros.filter((audit) => {
    const fecha = new Date(audit.fechaISO);
    const cumpleDesde = !desdeDate || fecha >= desdeDate;
    const cumpleHasta = !hastaDate || fecha <= hastaDate;

    return cumpleDesde && cumpleHasta;
  });
}

function obtenerPermisosTexto(permisos = []) {
  return permisos
    .map((permisoId) => PERMISOS_USUARIO.find((permiso) => permiso.id === permisoId)?.label)
    .filter(Boolean);
}

function obtenerPermisosPorRol(rol) {
  const permisosPorRol = {
    Administrador: PERMISOS_USUARIO.map((permiso) => permiso.id),
    Encargado: ['kiosco', 'inventario', 'caja', 'asistencias'],
    Secretaria: ['kiosco', 'inventario', 'caja', 'asistencias']
  };

  return permisosPorRol[rol] || ['asistencias'];
}

function registrarAuditoria(userId, modulo, accion, detalle) {
  auditorias = [
    {
      id: `audit-${Date.now()}`,
      userId,
      fechaISO: new Date().toISOString(),
      sucursal: buscarUsuarioPorId(userId)?.sucursal || SUCURSAL_USUARIO_DEFAULT,
      modulo,
      accion,
      detalle
    },
    ...auditorias
  ];
  guardarAuditorias();
}

function mostrarToastUsuarios(message, error = false) {
  const toast = document.getElementById('users-toast');

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.toggle('hidden', !message);
  toast.classList.toggle('text-error', error);
  toast.classList.toggle('text-primary', !error);

  window.clearTimeout(mostrarToastUsuarios.timeout);
  mostrarToastUsuarios.timeout = window.setTimeout(() => toast.classList.add('hidden'), 2800);
}

function registrarCambioUsuarioPendiente(userId, descripcion, motivo = '') {
  const usuario = obtenerUsuario(userId);

  cambiosUsuariosPendientes = [
    {
      id: `change-${Date.now()}-${cambiosUsuariosPendientes.length + 1}`,
      userId,
      usuario: usuario?.usuario || 'usuario',
      descripcion,
      motivo,
      fechaISO: new Date().toISOString()
    },
    ...cambiosUsuariosPendientes
  ];
}

function renderizarCambiosPendientesUsuarios() {
  const button = document.getElementById('confirm-users-changes');
  const count = document.getElementById('users-pending-count');
  const total = cambiosUsuariosPendientes.length;

  if (button) {
    button.disabled = total === 0;
    button.title = total
      ? `${total} cambios pendientes de confirmacion`
      : 'No hay cambios pendientes';
  }

  if (count) {
    count.textContent = String(total);
  }
}

function confirmarCambiosUsuarios() {
  if (!cambiosUsuariosPendientes.length) {
    mostrarToastUsuarios('No hay cambios pendientes para confirmar.');
    return;
  }

  registrarAuditoria(
    usuarioSeleccionadoId,
    'Usuarios',
    'Confirmacion de cambios',
    `Se confirmaron ${cambiosUsuariosPendientes.length} cambios: ${cambiosUsuariosPendientes.map((cambio) => `${cambio.usuario}: ${cambio.descripcion}`).join(' | ')}`
  );
  cambiosUsuariosPendientes = [];
  renderizarTodoUsuarios();
  mostrarToastUsuarios('Cambios confirmados correctamente.');
}

function mostrarErrorAuditoriaInline(message) {
  const box = document.getElementById('audit-inline-error');

  if (!box) {
    return;
  }

  box.textContent = message;
  box.classList.toggle('hidden', !message);
}

function renderizarMetricasUsuarios() {
  const roles = new Set(usuarios.map((usuario) => usuario.rol));

  document.getElementById('metric-active-users').textContent = String(usuarios.filter((usuario) => usuario.estado === 'Activo').length);
  document.getElementById('metric-roles').textContent = String(roles.size);
  document.getElementById('metric-audits').textContent = String(auditorias.length);
}

function renderizarFiltrosUsuarios() {
  const roleFilter = document.getElementById('users-role-filter');
  const auditSelect = document.getElementById('audit-user-select');
  const auditSearch = document.getElementById('audit-user-search');
  const auditEntryUser = document.getElementById('audit-entry-user');
  const newUserRole = document.getElementById('new-user-role');
  const roleOptions = ['<option value="todos">Todos los roles</option>']
    .concat(ROLES_USUARIO.map((rol) => `<option value="${escapeHtml(rol)}">${escapeHtml(rol)}</option>`))
    .join('');
  const formRoleOptions = ROLES_USUARIO
    .map((rol) => `<option value="${escapeHtml(rol)}">${escapeHtml(rol)}</option>`)
    .join('');
  const userOptions = usuarios
    .map((usuario) => `<option value="${escapeHtml(usuario.id)}">${escapeHtml(usuario.nombre)} - ${escapeHtml(usuario.rol)}</option>`)
    .join('');

  if (roleFilter) {
    roleFilter.innerHTML = roleOptions;
    roleFilter.value = filtroRol;
  }

  if (auditSelect) {
    auditSelect.innerHTML = userOptions;
    auditSelect.value = usuarioSeleccionadoId;
  }

  if (auditSearch && document.activeElement !== auditSearch) {
    auditSearch.value = obtenerUsuario()?.usuario || '';
  }

  if (auditEntryUser) {
    auditEntryUser.innerHTML = userOptions;
    auditEntryUser.value = usuarioSeleccionadoId;
  }

  if (newUserRole) {
    newUserRole.innerHTML = formRoleOptions;
  }

  inicializarRangoReporte();
}

function renderizarCheckboxesPermisos(containerId, inputName, permisosSeleccionados = []) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.innerHTML = PERMISOS_USUARIO
    .map((permiso) => `
      <label class="flex items-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-low px-3 py-3 text-sm font-bold text-on-surface">
        <input class="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" name="${escapeHtml(inputName)}" value="${escapeHtml(permiso.id)}" ${permisosSeleccionados.includes(permiso.id) ? 'checked' : ''}>
        ${escapeHtml(permiso.label)}
      </label>
    `)
    .join('');
}

function inicializarRangoReporte() {
  const fromInput = document.getElementById('audit-report-date-from');
  const toInput = document.getElementById('audit-report-date-to');

  if (!fromInput || !toInput) {
    return;
  }

  if (!fromInput.value && !toInput.value) {
    const fechas = auditorias
      .map((audit) => normalizarFechaInput(audit.fechaISO))
      .filter(Boolean)
      .sort();

    fromInput.value = fechas[0] || normalizarFechaInput(new Date().toISOString());
    toInput.value = fechas[fechas.length - 1] || normalizarFechaInput(new Date().toISOString());
  }

  auditCalendarMonthDate = crearFechaLocal(fromInput.value) || new Date();
  renderizarDiasRangoReporte();
}

function obtenerUsuariosFiltrados() {
  const query = busquedaUsuarios.trim().toLowerCase();

  return usuarios.filter((usuario) => {
    const permisos = obtenerPermisosTexto(usuario.permisos).join(' ').toLowerCase();
    const coincideBusqueda = !query
      || usuario.nombre.toLowerCase().includes(query)
      || usuario.usuario.toLowerCase().includes(query)
      || usuario.email.toLowerCase().includes(query)
      || usuario.rol.toLowerCase().includes(query)
      || permisos.includes(query);
    const coincideRol = filtroRol === 'todos' || usuario.rol === filtroRol;

    return coincideBusqueda && coincideRol;
  });
}

function obtenerPaginasUsuarios(totalPaginas) {
  if (totalPaginas <= 6) {
    return Array.from({ length: totalPaginas }, (_, index) => index + 1);
  }

  return [1, 2, 3, 4, 5, 'ellipsis', totalPaginas];
}

function renderizarPaginacionUsuarios(totalPaginas) {
  const pagination = document.getElementById('users-pagination');

  if (!pagination) {
    return;
  }

  const paginas = obtenerPaginasUsuarios(totalPaginas);

  pagination.innerHTML = `
    <button type="button" class="users-page-button" ${paginaUsuariosActual <= 1 ? 'disabled' : ''} onclick="cambiarPaginaUsuarios(${paginaUsuariosActual - 1})" aria-label="Pagina anterior">
      <span class="material-symbols-outlined text-base">chevron_left</span>
    </button>
    ${paginas.map((pagina) => pagina === 'ellipsis'
      ? '<span class="px-2 text-sm font-black text-secondary">...</span>'
      : `
        <button type="button" class="users-page-button ${paginaUsuariosActual === pagina ? 'users-page-button-active' : ''}" onclick="cambiarPaginaUsuarios(${pagina})">
          ${pagina}
        </button>
      `).join('')}
    <button type="button" class="users-page-button" ${paginaUsuariosActual >= totalPaginas ? 'disabled' : ''} onclick="cambiarPaginaUsuarios(${paginaUsuariosActual + 1})" aria-label="Pagina siguiente">
      <span class="material-symbols-outlined text-base">chevron_right</span>
    </button>
  `;
}

function cambiarPaginaUsuarios(page) {
  const totalPaginas = Math.max(1, Math.ceil(obtenerUsuariosFiltrados().length / USUARIOS_PAGE_SIZE));
  paginaUsuariosActual = Math.min(Math.max(Number(page) || 1, 1), totalPaginas);
  renderizarTablaUsuarios();
}

function renderizarTablaUsuarios() {
  const body = document.getElementById('users-table-body');
  const count = document.getElementById('users-count');
  const usuariosFiltrados = obtenerUsuariosFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / USUARIOS_PAGE_SIZE));
  const inicio = (Math.min(paginaUsuariosActual, totalPaginas) - 1) * USUARIOS_PAGE_SIZE;
  const usuariosPagina = usuariosFiltrados.slice(inicio, inicio + USUARIOS_PAGE_SIZE);

  paginaUsuariosActual = Math.min(paginaUsuariosActual, totalPaginas);
  renderizarPaginacionUsuarios(totalPaginas);

  if (count) {
    const desde = usuariosFiltrados.length ? inicio + 1 : 0;
    const hasta = Math.min(inicio + usuariosPagina.length, usuariosFiltrados.length);
    count.textContent = `Mostrando ${desde}-${hasta} de ${usuariosFiltrados.length} usuarios`;
  }

  if (!body) {
    return;
  }

  if (!usuariosPagina.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5" class="px-5 py-10 text-center text-secondary">
          <span class="material-symbols-outlined text-4xl">person_search</span>
          <p class="mt-2 font-bold text-on-surface">No hay usuarios para mostrar</p>
        </td>
      </tr>
    `;
    return;
  }

  body.innerHTML = usuariosPagina
    .map((usuario) => {
      const permisos = obtenerPermisosTexto(usuario.permisos);
      const activo = usuario.estado === 'Activo';
      const seleccionado = usuario.id === usuarioSeleccionadoId;
      const cambiosPendientesUsuario = cambiosUsuariosPendientes.filter((cambio) => cambio.userId === usuario.id).length;

      return `
        <tr class="${seleccionado ? 'bg-primary-container/10' : 'hover:bg-surface-container-low'} transition-colors">
          <td class="px-5 py-4">
            <button type="button" class="flex items-center gap-3 text-left" onclick="seleccionarUsuario('${escapeHtml(usuario.id)}')">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container/15 font-black text-primary">${escapeHtml(usuario.iniciales)}</span>
              <span>
                <span class="flex flex-wrap items-center gap-2 font-headline font-black text-on-surface">
                  ${escapeHtml(usuario.nombre)}
                  ${cambiosPendientesUsuario ? `<span class="users-change-chip">${cambiosPendientesUsuario} pendiente${cambiosPendientesUsuario === 1 ? '' : 's'}</span>` : ''}
                </span>
                <span class="block text-xs font-semibold text-secondary">@${escapeHtml(usuario.usuario)} - ${escapeHtml(usuario.email)}</span>
              </span>
            </button>
          </td>
          <td class="px-5 py-4 text-sm font-bold text-on-surface">${escapeHtml(usuario.rol)}</td>
          <td class="px-5 py-4">
            <div class="flex max-w-sm flex-wrap gap-1.5">
              ${permisos.slice(0, 3).map((permiso) => `<span class="users-chip">${escapeHtml(permiso)}</span>`).join('')}
              ${permisos.length > 3 ? `<span class="users-chip">+${permisos.length - 3}</span>` : ''}
            </div>
          </td>
          <td class="px-5 py-4">
            <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${activo ? 'bg-primary-container/15 text-primary' : 'bg-error-container text-error'}">
              <span class="h-2 w-2 rounded-full ${activo ? 'bg-primary' : 'bg-error'}"></span>
              ${escapeHtml(usuario.estado)}
            </span>
          </td>
          <td class="px-5 py-4">
            <div class="flex justify-end gap-2">
              <button type="button" onclick="abrirModalPermisos('${escapeHtml(usuario.id)}')" class="users-icon-button text-primary" title="Modificar permisos">
                <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
              </button>
              <button type="button" onclick="abrirModalResetPassword('${escapeHtml(usuario.id)}')" class="users-icon-button text-[#7a5700]" title="Restablecer contrasena">
                <span class="material-symbols-outlined text-lg">key</span>
              </button>
              <button type="button" onclick="imprimirReporteAuditoria()" class="users-icon-button text-on-surface" title="Imprimir reporte general">
                <span class="material-symbols-outlined text-lg">print</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderizarUsuarioSeleccionado() {
  const card = document.getElementById('selected-user-card');
  const usuario = obtenerUsuario();

  if (!card || !usuario) {
    return;
  }

  const permisos = obtenerPermisosTexto(usuario.permisos);

  card.innerHTML = `
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-3">
        <span class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/15 font-black text-primary">${escapeHtml(usuario.iniciales)}</span>
        <div>
          <p class="font-headline text-lg font-black text-on-surface">${escapeHtml(usuario.nombre)}</p>
          <p class="text-sm font-semibold text-secondary">@${escapeHtml(usuario.usuario)} - ${escapeHtml(usuario.rol)} - ${escapeHtml(usuario.email)}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        ${permisos.map((permiso) => `<span class="users-chip">${escapeHtml(permiso)}</span>`).join('')}
      </div>
    </div>
  `;
}

function renderizarPanelAuditoriaUsuario() {
  const hint = document.getElementById('audit-selected-hint');
  const usuario = obtenerUsuario();

  if (!hint || !usuario) {
    return;
  }

  hint.textContent = `Usuario seleccionado: ${usuario.nombre} (@${usuario.usuario})`;
  hint.classList.remove('text-secondary');
  hint.classList.add('text-primary');
}

function renderizarAuditorias() {
  const list = document.getElementById('audit-log-list');
  const usuario = obtenerUsuario();

  if (!list || !usuario) {
    return;
  }

  const registros = auditorias.filter((audit) => audit.userId === usuario.id);

  if (!registros.length) {
    list.innerHTML = `
      <div class="rounded-lg border border-dashed border-outline-variant/30 bg-surface-container-low p-6 text-center text-secondary">
        <span class="material-symbols-outlined text-3xl">history</span>
        <p class="mt-2 font-bold text-on-surface">Sin registros para ${escapeHtml(usuario.nombre)}</p>
      </div>
    `;
    return;
  }

  list.innerHTML = registros
    .map((audit) => `
      <article class="rounded-lg border border-outline-variant/15 bg-surface-container-low p-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm font-black text-on-surface">${escapeHtml(audit.accion)}</p>
            <p class="mt-1 text-xs font-semibold text-secondary">${escapeHtml(audit.modulo)} - ${escapeHtml(audit.detalle)}</p>
          </div>
          <p class="text-xs font-black text-primary">${escapeHtml(formatFechaAuditoria(audit.fechaISO))}</p>
        </div>
      </article>
    `)
    .join('');
}

function renderizarTodoUsuarios() {
  renderizarMetricasUsuarios();
  renderizarFiltrosUsuarios();
  renderizarTablaUsuarios();
  renderizarCambiosPendientesUsuarios();
}

function seleccionarUsuario(id, scrollAudit = false) {
  usuarioSeleccionadoId = id;
  mostrarErrorAuditoriaInline('');
  ocultarSugerenciasAuditoria();
  ocultarSugerenciasBusquedaUsuarios();
  renderizarTodoUsuarios();

  if (scrollAudit) {
    document.getElementById('audit-report-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function abrirModalPermisos(id = usuarioSeleccionadoId) {
  const usuario = obtenerUsuario(id);
  const modal = document.getElementById('permissions-modal');
  const title = document.getElementById('permissions-modal-title');
  const roleSelect = document.getElementById('permissions-role');
  const checks = document.getElementById('permissions-checkboxes');

  if (!usuario || !modal || !roleSelect || !checks) {
    return;
  }

  usuarioSeleccionadoId = usuario.id;

  if (title) {
    title.textContent = `Permisos de ${usuario.nombre}`;
  }

  roleSelect.innerHTML = ROLES_USUARIO
    .map((rol) => `<option value="${escapeHtml(rol)}">${escapeHtml(rol)}</option>`)
    .join('');
  roleSelect.value = usuario.rol;

  renderizarCheckboxesPermisos('permissions-checkboxes', 'permissions', usuario.permisos);

  modal.classList.remove('hidden');
}

function cerrarModalPermisos() {
  document.getElementById('permissions-modal')?.classList.add('hidden');
}

function abrirModalMotivoCambio(cambio) {
  const modal = document.getElementById('change-reason-modal');
  const summary = document.getElementById('change-reason-summary');
  const textarea = document.getElementById('change-reason-text');

  if (!modal) {
    return;
  }

  cambioUsuarioEnConfirmacion = cambio;

  if (summary) {
    summary.textContent = `${cambio.descripcion}. El motivo es opcional.`;
  }

  if (textarea) {
    textarea.value = '';
  }

  modal.classList.remove('hidden');
  window.setTimeout(() => textarea?.focus(), 0);
}

function cerrarModalMotivoCambio() {
  document.getElementById('change-reason-modal')?.classList.add('hidden');
  document.getElementById('change-reason-form')?.reset();
  cambioUsuarioEnConfirmacion = null;
}

function aplicarCambioUsuarioConfirmado(motivo = '') {
  const cambio = cambioUsuarioEnConfirmacion;

  if (!cambio) {
    return;
  }

  if (cambio.tipo === 'permisos') {
    const usuario = obtenerUsuario(cambio.userId);

    if (!usuario) {
      cerrarModalMotivoCambio();
      return;
    }

    usuario.rol = cambio.rol;
    usuario.permisos = [...cambio.permisos];
    registrarAuditoria(
      usuario.id,
      'Usuarios',
      'Cambio de permisos',
      `${cambio.descripcion}. Motivo: ${motivo || 'Sin motivo declarado'}.`
    );
    registrarCambioUsuarioPendiente(usuario.id, cambio.descripcion, motivo);
  }

  cerrarModalMotivoCambio();
  cerrarModalPermisos();
  renderizarTodoUsuarios();
  mostrarToastUsuarios('Cambio guardado. Queda pendiente de confirmacion final.');
}

function guardarMotivoCambio(event) {
  event.preventDefault();
  aplicarCambioUsuarioConfirmado(document.getElementById('change-reason-text')?.value.trim() || '');
}

function guardarPermisos(event) {
  event.preventDefault();

  const usuario = obtenerUsuario();
  const roleSelect = document.getElementById('permissions-role');
  const permisosSeleccionados = [...document.querySelectorAll('input[name="permissions"]:checked')]
    .map((input) => input.value);

  if (!usuario) {
    return;
  }

  const nuevoRol = roleSelect?.value || usuario.rol;
  const permisosActuales = [...usuario.permisos].sort().join('|');
  const permisosNuevos = [...permisosSeleccionados].sort().join('|');

  if (nuevoRol === usuario.rol && permisosActuales === permisosNuevos) {
    mostrarToastUsuarios('No hay cambios para guardar.');
    return;
  }

  abrirModalMotivoCambio({
    tipo: 'permisos',
    userId: usuario.id,
    rol: nuevoRol,
    permisos: permisosSeleccionados,
    descripcion: `Permisos/rol actualizados para ${usuario.usuario}`
  });
}

function mostrarErrorNuevoUsuario(message) {
  const box = document.getElementById('new-user-error');

  if (!box) {
    return;
  }

  box.textContent = message;
  box.classList.toggle('hidden', !message);
}

function mostrarErrorResetPassword(message) {
  const box = document.getElementById('reset-password-error');

  if (!box) {
    return;
  }

  box.textContent = message;
  box.classList.toggle('hidden', !message);
}

function abrirModalNuevoUsuario() {
  document.getElementById('new-user-form')?.reset();
  mostrarErrorNuevoUsuario('');
  renderizarFiltrosUsuarios();
  renderizarCheckboxesPermisos('new-user-permissions', 'new-user-permissions', obtenerPermisosPorRol(ROLES_USUARIO[0]));
  document.getElementById('new-user-modal')?.classList.remove('hidden');
  window.setTimeout(() => document.getElementById('new-user-username')?.focus(), 0);
}

function cerrarModalNuevoUsuario() {
  document.getElementById('new-user-modal')?.classList.add('hidden');
  document.getElementById('new-user-form')?.reset();
  mostrarErrorNuevoUsuario('');
}

function crearUsuarioDesdeDatos({ usuario, contrasena, nombre, email, rol = ROLES_USUARIO[0], estado = 'Activo', permisos = [] }) {
  const usuarioNormalizado = normalizarUsuarioLogin(usuario);
  const nombreLimpio = String(nombre || usuarioNormalizado).trim();
  const rolValido = ROLES_USUARIO.includes(rol) ? rol : ROLES_USUARIO[0];

  if (!usuarioNormalizado || !contrasena || !nombreLimpio) {
    return { ok: false, reason: 'faltan-datos' };
  }

  if (usuarios.some((item) => item.usuario === usuarioNormalizado)) {
    return { ok: false, reason: 'duplicado' };
  }

  const nuevoUsuario = {
    id: `u-${Date.now()}-${usuarios.length + 1}`,
    usuario: usuarioNormalizado,
    contrasena: String(contrasena),
    nombre: nombreLimpio,
    email: String(email || `${usuarioNormalizado}@squatgym.com`).trim(),
    rol: rolValido,
    sucursal: SUCURSAL_USUARIO_DEFAULT,
    estado: estado === 'Inactivo' ? 'Inactivo' : 'Activo',
    iniciales: generarIniciales(nombreLimpio).toUpperCase(),
    permisos: permisos.length ? permisos : obtenerPermisosPorRol(rolValido)
  };

  usuarios = [...usuarios, nuevoUsuario];
  usuarioSeleccionadoId = nuevoUsuario.id;
  registrarAuditoria(nuevoUsuario.id, 'Usuarios', 'Alta de usuario', `Usuario ${nuevoUsuario.usuario} creado.`);

  return { ok: true, usuario: nuevoUsuario };
}

function guardarNuevoUsuario(event) {
  event.preventDefault();

  const permisos = [...document.querySelectorAll('input[name="new-user-permissions"]:checked')]
    .map((input) => input.value);
  const resultado = crearUsuarioDesdeDatos({
    usuario: document.getElementById('new-user-username')?.value,
    contrasena: document.getElementById('new-user-password')?.value,
    nombre: document.getElementById('new-user-name')?.value,
    email: document.getElementById('new-user-email')?.value,
    rol: document.getElementById('new-user-role')?.value,
    estado: document.getElementById('new-user-status')?.value,
    permisos
  });

  if (!resultado.ok) {
    mostrarErrorNuevoUsuario(resultado.reason === 'duplicado'
      ? 'Ya existe un usuario con ese nombre de usuario.'
      : 'Completa usuario, contrasena y nombre para crear el registro.');
    return;
  }

  cerrarModalNuevoUsuario();
  registrarCambioUsuarioPendiente(resultado.usuario.id, `Alta de usuario ${resultado.usuario.usuario}`);
  renderizarTodoUsuarios();
  mostrarToastUsuarios(`Usuario ${resultado.usuario.usuario} creado correctamente.`);
}

function abrirModalResetPassword(id = usuarioSeleccionadoId) {
  const usuario = obtenerUsuario(id);

  if (!usuario) {
    return;
  }

  usuarioSeleccionadoId = usuario.id;
  document.getElementById('reset-password-form')?.reset();
  document.getElementById('reset-password-user-id').value = usuario.id;
  document.getElementById('reset-password-title').textContent = `Restablecer contrasena de ${usuario.nombre}`;
  mostrarErrorResetPassword('');
  document.getElementById('reset-password-modal')?.classList.remove('hidden');
  window.setTimeout(() => document.getElementById('reset-password-value')?.focus(), 0);
}

function cerrarModalResetPassword() {
  document.getElementById('reset-password-modal')?.classList.add('hidden');
  document.getElementById('reset-password-form')?.reset();
  mostrarErrorResetPassword('');
}

function guardarResetPassword(event) {
  event.preventDefault();

  const userId = document.getElementById('reset-password-user-id')?.value;
  const password = document.getElementById('reset-password-value')?.value || '';
  const confirm = document.getElementById('reset-password-confirm')?.value || '';
  const usuario = obtenerUsuario(userId);

  if (!usuario) {
    mostrarErrorResetPassword('No se encontro el usuario seleccionado.');
    return;
  }

  if (password.length < 4) {
    mostrarErrorResetPassword('La contrasena debe tener al menos 4 caracteres.');
    return;
  }

  if (password !== confirm) {
    mostrarErrorResetPassword('Las contrasenas no coinciden.');
    return;
  }

  usuario.contrasena = password;
  registrarAuditoria(usuario.id, 'Seguridad', 'Restablecimiento de contrasena', `Contrasena restablecida para ${usuario.usuario}.`);
  registrarCambioUsuarioPendiente(usuario.id, `Contrasena restablecida para ${usuario.usuario}`);
  cerrarModalResetPassword();
  renderizarTodoUsuarios();
  mostrarToastUsuarios('Contrasena restablecida y auditoria registrada.');
}

function parsearLineaUsuarioTxt(linea) {
  const partes = linea
    .split(/[;,]/)
    .map((parte) => parte.trim());
  const [usuario, contrasena, rol, nombre, email] = partes;

  if (!usuario || !contrasena || usuario.toLowerCase() === 'usuario') {
    return null;
  }

  return {
    usuario,
    contrasena,
    rol: rol || 'Secretaria',
    nombre: nombre || usuario.replace(/[._-]+/g, ' '),
    email: email || ''
  };
}

function procesarArchivoUsuariosTxt(file) {
  const status = document.getElementById('bulk-users-status');

  if (!file) {
    return;
  }

  if (!file.name.toLowerCase().endsWith('.txt') && file.type !== 'text/plain') {
    if (status) {
      status.textContent = 'Selecciona un archivo .txt valido.';
      status.classList.add('text-error');
    }
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const lineas = String(reader.result || '')
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter(Boolean);
    let creados = 0;
    let omitidos = 0;

    lineas.forEach((linea) => {
      const data = parsearLineaUsuarioTxt(linea);

      if (!data) {
        omitidos += 1;
        return;
      }

      const resultado = crearUsuarioDesdeDatos({
        ...data,
        permisos: obtenerPermisosPorRol(ROLES_USUARIO.includes(data.rol) ? data.rol : 'Secretaria')
      });

    if (resultado.ok) {
      creados += 1;
      registrarCambioUsuarioPendiente(resultado.usuario.id, `Alta automatica de ${resultado.usuario.usuario}`);
    } else {
      omitidos += 1;
    }
  });

    paginaUsuariosActual = Math.max(1, Math.ceil(usuarios.length / USUARIOS_PAGE_SIZE));

    if (status) {
      status.textContent = `${creados} usuarios creados desde ${file.name}. ${omitidos} lineas omitidas.`;
      status.classList.toggle('text-error', creados === 0);
      status.classList.toggle('text-primary', creados > 0);
    }

    renderizarTodoUsuarios();
    mostrarToastUsuarios(`${creados} usuarios generados automaticamente desde TXT.`, creados === 0);
  });

  reader.addEventListener('error', () => {
    if (status) {
      status.textContent = 'No se pudo leer el archivo.';
      status.classList.add('text-error');
    }
  });

  reader.readAsText(file);
}

function abrirModalAuditoria() {
  document.getElementById('audit-entry-modal')?.classList.remove('hidden');
  document.getElementById('audit-entry-user').value = usuarioSeleccionadoId;
}

function cerrarModalAuditoria() {
  document.getElementById('audit-entry-modal')?.classList.add('hidden');
  document.getElementById('audit-entry-form')?.reset();
}

function guardarAuditoriaManual(event) {
  event.preventDefault();

  const userId = document.getElementById('audit-entry-user')?.value || usuarioSeleccionadoId;
  const modulo = document.getElementById('audit-entry-module')?.value.trim() || 'Usuarios';
  const accion = document.getElementById('audit-entry-action')?.value.trim() || 'Registro manual';
  const detalle = document.getElementById('audit-entry-detail')?.value.trim() || 'Registro de auditoria generado manualmente.';

  usuarioSeleccionadoId = userId;
  registrarAuditoria(userId, modulo, accion, detalle);
  cerrarModalAuditoria();
  renderizarTodoUsuarios();
  mostrarToastUsuarios('Registro de auditoria agregado.');
}

function manejarBusquedaUsuarioAuditoria(value, force = false, showSuggestions = true) {
  if (showSuggestions) {
    renderizarSugerenciasAuditoria(value, true);
  }

  const usuario = buscarUsuarioPorTexto(value);

  if (!usuario) {
    if (force) {
      mostrarErrorAuditoriaInline('No se encontro un usuario con ese nombre. Escribi el usuario completo o elegilo en el selector.');
    }

    return null;
  }

  usuarioSeleccionadoId = usuario.id;
  mostrarErrorAuditoriaInline('');
  ocultarSugerenciasAuditoria();
  renderizarTodoUsuarios();
  return usuario;
}

function guardarAuditoriaInline(event) {
  event.preventDefault();

  const searchValue = document.getElementById('audit-user-search')?.value || '';
  const usuarioEscrito = searchValue.trim() ? buscarUsuarioPorTexto(searchValue) : null;

  if (searchValue.trim() && !usuarioEscrito) {
    mostrarErrorAuditoriaInline('Para escribirlo manualmente, ingresa el usuario completo, nombre completo o email exacto.');
    return;
  }

  const usuario = usuarioEscrito || obtenerUsuario(document.getElementById('audit-user-select')?.value);

  if (!usuario) {
    mostrarErrorAuditoriaInline('Elegi un usuario o escribi el nombre completo antes de guardar.');
    return;
  }

  const modulo = document.getElementById('audit-inline-module')?.value.trim() || 'Usuarios';
  const accion = document.getElementById('audit-inline-action')?.value.trim() || 'Registro manual';
  const detalle = document.getElementById('audit-inline-detail')?.value.trim() || 'Registro de auditoria generado manualmente.';

  usuarioSeleccionadoId = usuario.id;
  registrarAuditoria(usuario.id, modulo, accion, detalle);
  document.getElementById('audit-inline-detail').value = '';
  mostrarErrorAuditoriaInline('');
  renderizarTodoUsuarios();
  mostrarToastUsuarios('Registro de auditoria agregado.');
}

function obtenerSucursalAuditoria(audit) {
  const usuario = buscarUsuarioPorId(audit.userId);

  return audit.sucursal || usuario?.sucursal || SUCURSAL_USUARIO_DEFAULT;
}

function construirReporteAuditoria(rango = obtenerRangoReporte()) {
  const registros = filtrarRegistrosPorRango(auditorias, rango.desde, rango.hasta)
    .map((audit) => ({
      ...audit,
      usuario: buscarUsuarioPorId(audit.userId),
      sucursal: obtenerSucursalAuditoria(audit)
    }))
    .sort((a, b) => a.sucursal.localeCompare(b.sucursal) || new Date(a.fechaISO) - new Date(b.fechaISO));
  const registrosPorSucursal = registros.reduce((groups, audit) => {
    groups[audit.sucursal] = groups[audit.sucursal] || [];
    groups[audit.sucursal].push(audit);
    return groups;
  }, {});
  const sucursales = Object.keys(registrosPorSucursal).sort((a, b) => a.localeCompare(b));
  const desde = rango.desde ? `${rango.desde}T00:00:00` : registros[0]?.fechaISO || new Date().toISOString();
  const hasta = rango.hasta ? `${rango.hasta}T23:59:59` : registros[registros.length - 1]?.fechaISO || new Date().toISOString();
  const seccionesSucursal = sucursales.length
    ? sucursales.map((sucursal) => {
      const filas = registrosPorSucursal[sucursal]
        .map((audit) => {
          const usuario = audit.usuario || { nombre: 'Usuario no encontrado', rol: 'Sin rol' };

          return `
            <tr>
              <td>${escapeHtml(formatFechaAuditoria(audit.fechaISO))}</td>
              <td>${escapeHtml(usuario.nombre)} (${escapeHtml(usuario.rol)})</td>
              <td>${escapeHtml(audit.modulo)}</td>
              <td>${escapeHtml(audit.accion)}</td>
              <td>${escapeHtml(audit.detalle)}</td>
            </tr>
          `;
        })
        .join('');

      return `
        <section class="audit-print-branch">
          <h2>Sucursal: ${escapeHtml(sucursal)}</h2>
          <table class="print-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario (Rol)</th>
                <th>Modulo</th>
                <th>Accion</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
          <p class="audit-print-total"><strong>Total sucursal:</strong> ${registrosPorSucursal[sucursal].length} registros</p>
        </section>
      `;
    }).join('')
    : `
      <section class="audit-print-branch">
        <h2>Sin registros</h2>
        <table class="print-table">
          <tbody>
            <tr>
              <td>Sin registros para el periodo seleccionado.</td>
            </tr>
          </tbody>
        </table>
      </section>
    `;

  return `
    <div class="audit-print-document">
      <div class="audit-print-date">${escapeHtml(formatFechaAuditoria(new Date()))}</div>
      <h1>Reporte de Auditoria de Actividad del Sistema</h1>
      <p><strong>Generado por:</strong> Administrador</p>
      <p><strong>Periodo evaluado:</strong> ${escapeHtml(formatFechaAuditoria(desde))} - ${escapeHtml(formatFechaAuditoria(hasta))}</p>
      <p><strong>Alcance:</strong> Todas las personas registradas</p>
      <p><strong>Orden:</strong> Corte por sucursal y fecha/hora</p>
      ${seccionesSucursal}
      <p class="audit-print-total"><strong>Total general de accesos registrados:</strong> ${registros.length}</p>
      <p class="audit-print-page">Pagina 1 de 1</p>
    </div>
  `;
}

function imprimirReporteAuditoria() {
  const printArea = document.getElementById('audit-print-area');
  const rango = obtenerRangoReporte();
  const desdeDate = crearFechaLocal(rango.desde);
  const hastaDate = crearFechaLocal(rango.hasta);

  if (!printArea) {
    return;
  }

  if (desdeDate && hastaDate && desdeDate > hastaDate) {
    mostrarToastUsuarios('El rango de fechas no es valido.', true);
    renderizarDiasRangoReporte();
    return;
  }

  printArea.innerHTML = construirReporteAuditoria(rango);
  document.body.classList.add('users-print-mode');
  window.print();
}

document.addEventListener('DOMContentLoaded', () => {
  cargarAuditorias();
  renderizarTodoUsuarios();

  document.getElementById('users-search')?.addEventListener('input', (event) => {
    busquedaUsuarios = event.target.value;
    paginaUsuariosActual = 1;
    usersSearchSuggestionIndex = -1;
    renderizarSugerenciasBusquedaUsuarios(event.target.value, true);
    renderizarTablaUsuarios();
  });
  document.getElementById('users-search')?.addEventListener('focus', (event) => {
    renderizarSugerenciasBusquedaUsuarios(event.target.value, true);
  });
  document.getElementById('users-search')?.addEventListener('blur', () => {
    window.setTimeout(ocultarSugerenciasBusquedaUsuarios, 120);
  });
  document.getElementById('users-search')?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moverSugerenciaBusquedaUsuarios(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moverSugerenciaBusquedaUsuarios(-1);
      return;
    }

    if (event.key === 'Escape') {
      ocultarSugerenciasBusquedaUsuarios();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      confirmarSugerenciaBusquedaUsuarios();
    }
  });
  document.getElementById('users-search-suggestions')?.addEventListener('mousedown', (event) => {
    const row = event.target.closest('[data-user-id]');

    if (!row) {
      return;
    }

    event.preventDefault();
    seleccionarSugerenciaBusquedaUsuarios(row.dataset.userId);
  });

  document.getElementById('users-role-filter')?.addEventListener('change', (event) => {
    filtroRol = event.target.value;
    paginaUsuariosActual = 1;
    renderizarTablaUsuarios();
  });

  document.getElementById('audit-user-select')?.addEventListener('change', (event) => {
    seleccionarUsuario(event.target.value);
  });
  document.getElementById('audit-user-search')?.addEventListener('input', (event) => {
    auditSuggestionIndex = -1;
    manejarBusquedaUsuarioAuditoria(event.target.value);
  });
  document.getElementById('audit-user-search')?.addEventListener('focus', (event) => {
    renderizarSugerenciasAuditoria(event.target.value, true);
  });
  document.getElementById('audit-user-search')?.addEventListener('blur', (event) => {
    window.setTimeout(() => {
      manejarBusquedaUsuarioAuditoria(event.target.value, Boolean(event.target.value.trim()), false);
      ocultarSugerenciasAuditoria();
    }, 120);
  });
  document.getElementById('audit-user-search')?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moverSugerenciaAuditoria(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moverSugerenciaAuditoria(-1);
      return;
    }

    if (event.key === 'Escape') {
      ocultarSugerenciasAuditoria();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (!confirmarSugerenciaAuditoria()) {
        manejarBusquedaUsuarioAuditoria(event.target.value, true, false);
      }
      document.getElementById('audit-inline-module')?.focus();
    }
  });
  document.getElementById('audit-user-suggestions')?.addEventListener('mousedown', (event) => {
    const row = event.target.closest('[data-user-id]');

    if (!row) {
      return;
    }

    event.preventDefault();
    seleccionarSugerenciaAuditoria(row.dataset.userId);
    document.getElementById('audit-inline-module')?.focus();
  });

  document.getElementById('confirm-users-changes')?.addEventListener('click', confirmarCambiosUsuarios);
  document.getElementById('permissions-form')?.addEventListener('submit', guardarPermisos);
  document.getElementById('close-permissions-modal')?.addEventListener('click', cerrarModalPermisos);
  document.getElementById('cancel-permissions-modal')?.addEventListener('click', cerrarModalPermisos);
  document.getElementById('change-reason-form')?.addEventListener('submit', guardarMotivoCambio);
  document.getElementById('close-change-reason-modal')?.addEventListener('click', cerrarModalMotivoCambio);
  document.getElementById('cancel-change-reason-modal')?.addEventListener('click', cerrarModalMotivoCambio);
  document.getElementById('open-audit-entry-modal')?.addEventListener('click', () => {
    document.getElementById('audit-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('audit-user-search')?.focus(), 250);
  });
  document.getElementById('focus-audit-entry-panel')?.addEventListener('click', () => document.getElementById('audit-user-search')?.focus());
  document.getElementById('audit-inline-form')?.addEventListener('submit', guardarAuditoriaInline);
  document.getElementById('audit-entry-form')?.addEventListener('submit', guardarAuditoriaManual);
  document.getElementById('close-audit-entry-modal')?.addEventListener('click', cerrarModalAuditoria);
  document.getElementById('cancel-audit-entry-modal')?.addEventListener('click', cerrarModalAuditoria);
  document.getElementById('audit-report-date-from')?.addEventListener('input', renderizarDiasRangoReporte);
  document.getElementById('audit-report-date-to')?.addEventListener('input', renderizarDiasRangoReporte);
  document.getElementById('audit-date-range-trigger')?.addEventListener('click', alternarCalendarioReporte);
  document.getElementById('audit-calendar-prev')?.addEventListener('click', () => cambiarMesCalendarioReporte(-1));
  document.getElementById('audit-calendar-next')?.addEventListener('click', () => cambiarMesCalendarioReporte(1));
  document.getElementById('audit-calendar-clear')?.addEventListener('click', limpiarRangoCalendarioReporte);
  document.getElementById('audit-calendar-today')?.addEventListener('click', seleccionarHoyCalendarioReporte);
  document.getElementById('audit-calendar-grid')?.addEventListener('click', (event) => {
    const day = event.target.closest('[data-date]');

    if (day) {
      seleccionarDiaCalendarioReporte(day.dataset.date);
    }
  });
  document.getElementById('print-audit-report')?.addEventListener('click', () => imprimirReporteAuditoria());
  document.getElementById('open-new-user-modal')?.addEventListener('click', abrirModalNuevoUsuario);
  document.getElementById('new-user-form')?.addEventListener('submit', guardarNuevoUsuario);
  document.getElementById('close-new-user-modal')?.addEventListener('click', cerrarModalNuevoUsuario);
  document.getElementById('cancel-new-user-modal')?.addEventListener('click', cerrarModalNuevoUsuario);
  document.getElementById('new-user-role')?.addEventListener('change', (event) => {
    renderizarCheckboxesPermisos('new-user-permissions', 'new-user-permissions', obtenerPermisosPorRol(event.target.value));
  });
  document.getElementById('reset-password-form')?.addEventListener('submit', guardarResetPassword);
  document.getElementById('close-reset-password-modal')?.addEventListener('click', cerrarModalResetPassword);
  document.getElementById('cancel-reset-password-modal')?.addEventListener('click', cerrarModalResetPassword);
  document.getElementById('bulk-users-file')?.addEventListener('change', (event) => {
    procesarArchivoUsuariosTxt(event.target.files?.[0]);
    event.target.value = '';
  });

  document.getElementById('permissions-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('permissions-modal')) {
      cerrarModalPermisos();
    }
  });
  document.getElementById('change-reason-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('change-reason-modal')) {
      cerrarModalMotivoCambio();
    }
  });

  document.getElementById('audit-entry-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('audit-entry-modal')) {
      cerrarModalAuditoria();
    }
  });
  document.getElementById('new-user-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('new-user-modal')) {
      cerrarModalNuevoUsuario();
    }
  });
  document.getElementById('reset-password-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('reset-password-modal')) {
      cerrarModalResetPassword();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.users-date-picker')) {
      cerrarCalendarioReporte();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cerrarCalendarioReporte();
      cerrarModalPermisos();
      cerrarModalMotivoCambio();
      cerrarModalAuditoria();
      cerrarModalNuevoUsuario();
      cerrarModalResetPassword();
    }
  });

  window.addEventListener('afterprint', () => {
    document.body.classList.remove('users-print-mode');
  });
});

window.seleccionarUsuario = seleccionarUsuario;
window.abrirModalPermisos = abrirModalPermisos;
window.abrirModalResetPassword = abrirModalResetPassword;
window.imprimirReporteAuditoria = imprimirReporteAuditoria;
window.cambiarPaginaUsuarios = cambiarPaginaUsuarios;


