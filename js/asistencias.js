const ASISTENCIAS_STORAGE_KEY = 'squatgym-attendance-records';
const ASISTENCIAS_VERSION_KEY = 'squatgym-attendance-records-version';
const ASISTENCIAS_DATA_VERSION = '2026-05-09-categorias-nombres';
const ASISTENCIAS_ITEMS_PER_PAGE = 10;
const NOMBRES_ASISTENCIA_POR_DNI = {
  30123456: 'Valeria Mendez',
  27666777: 'Martin Silva',
  34111222: 'Lucia Benitez',
  35888999: 'Sofia Romero',
  32999111: 'Diego Molina',
  36777222: 'Paula Acosta',
  29555444: 'Nicolas Sosa',
  28987654: 'Carlos Ruiz',
  30444555: 'Ramon Pereira',
  32123450: 'Julieta Torres',
  33777888: 'Fernando Castro',
  35222444: 'Mariana Rios',
  36888111: 'Gaston Arias',
  27999000: 'Claudia Luna',
  31222333: 'Pablo Duarte',
  33555123: 'Elena Gomez',
  28666111: 'Beatriz Sanchez',
  34333999: 'Diana Lopez',
  30111000: 'Agustin Vera'
};

function crearFechaRelativa(minutos) {
  return new Date(Date.now() - minutos * 60 * 1000).toISOString();
}

const asistenciasDemo = [
  { id: 'as-c-1', socio: '30123456', plan: 'Clientes', estado: 'presente', fechaISO: crearFechaRelativa(3) },
  { id: 'as-c-2', socio: '27666777', plan: 'Clientes', estado: 'presente', fechaISO: crearFechaRelativa(9) },
  { id: 'as-c-3', socio: '34111222', plan: 'Clientes', estado: 'ausente', fechaISO: crearFechaRelativa(16) },
  { id: 'as-c-4', socio: '35888999', plan: 'Clientes', estado: 'presente', fechaISO: crearFechaRelativa(24) },
  { id: 'as-c-5', socio: '32999111', plan: 'Clientes', estado: 'ausente-sin-justificativo', fechaISO: crearFechaRelativa(31) },
  { id: 'as-c-6', socio: '36777222', plan: 'Clientes', estado: 'presente', fechaISO: crearFechaRelativa(43) },
  { id: 'as-c-7', socio: '29555444', plan: 'Clientes', estado: 'ausente', fechaISO: crearFechaRelativa(55) },
  { id: 'as-p-1', socio: '28987654', plan: 'Profesores', estado: 'presente', fechaISO: crearFechaRelativa(7) },
  { id: 'as-p-2', socio: '30444555', plan: 'Profesores', estado: 'ausente', fechaISO: crearFechaRelativa(14) },
  { id: 'as-p-3', socio: '32123450', plan: 'Profesores', estado: 'presente', fechaISO: crearFechaRelativa(21) },
  { id: 'as-p-4', socio: '33777888', plan: 'Profesores', estado: 'presente', fechaISO: crearFechaRelativa(28) },
  { id: 'as-p-5', socio: '35222444', plan: 'Profesores', estado: 'ausente-sin-justificativo', fechaISO: crearFechaRelativa(36) },
  { id: 'as-p-6', socio: '36888111', plan: 'Profesores', estado: 'presente', fechaISO: crearFechaRelativa(46) },
  { id: 'as-p-7', socio: '27999000', plan: 'Profesores', estado: 'ausente', fechaISO: crearFechaRelativa(58) },
  { id: 'as-p-8', socio: '31222333', plan: 'Profesores', estado: 'presente', fechaISO: crearFechaRelativa(70) },
  { id: 'as-e-1', socio: '33555123', plan: 'Encargados', estado: 'presente', fechaISO: crearFechaRelativa(12) },
  { id: 'as-e-2', socio: '28666111', plan: 'Encargados', estado: 'ausente', fechaISO: crearFechaRelativa(27) },
  { id: 'as-e-3', socio: '34333999', plan: 'Encargados', estado: 'presente', fechaISO: crearFechaRelativa(41) },
  { id: 'as-e-4', socio: '30111000', plan: 'Encargados', estado: 'ausente-sin-justificativo', fechaISO: crearFechaRelativa(63) }
];

let asistencias = [];
let attendanceFilter = 'todos';
let attendanceStatusFilter = 'todos';
let attendanceSearch = '';
let asistenciasPaginaActual = 1;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatHora(fechaISO) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(fechaISO));
}

function normalizarCategoria(value) {
  const raw = String(value || '').trim();
  const categoriasLegacy = {
    'Plan Gold': 'Clientes',
    'Plan Basico': 'Profesores',
    'Plan VIP': 'Encargados',
    Cliente: 'Clientes',
    Profesor: 'Profesores',
    Encargado: 'Encargados'
  };

  return categoriasLegacy[raw] || raw || 'Clientes';
}

function normalizarEstado(value) {
  const estado = String(value || '').trim().toLowerCase();

  if (estado === 'activa' || estado === 'activo' || estado === 'presente') {
    return 'presente';
  }

  if (estado === 'vencido' || estado === 'ausente') {
    return 'ausente';
  }

  if (estado.includes('justificativo') || estado === 'ausente-sin-justificativo') {
    return 'ausente-sin-justificativo';
  }

  return 'presente';
}

function formatoEstado(estado) {
  const estadoNormalizado = normalizarEstado(estado);
  const clases = {
    presente: 'bg-primary-container/15 text-primary',
    ausente: 'bg-[#fff4d6] text-[#7a5700]',
    'ausente-sin-justificativo': 'bg-error-container text-error'
  };
  const puntos = {
    presente: 'bg-primary',
    ausente: 'bg-[#b67800]',
    'ausente-sin-justificativo': 'bg-error'
  };
  const labels = {
    presente: 'Presente',
    ausente: 'Ausente',
    'ausente-sin-justificativo': 'Ausente sin justificativo'
  };

  return `<span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${clases[estadoNormalizado]}"><span class="h-2 w-2 rounded-full ${puntos[estadoNormalizado]}"></span>${labels[estadoNormalizado]}</span>`;
}

function mostrarToast(message, error = false) {
  const toast = document.getElementById('attendance-toast');

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.toggle('hidden', !message);
  toast.classList.toggle('text-error', error);
  toast.classList.toggle('text-primary', !error);

  window.clearTimeout(mostrarToast.timeout);
  mostrarToast.timeout = window.setTimeout(() => toast.classList.add('hidden'), 2600);
}

function normalizarAsistencia(item) {
  const socio = String(item?.socio || '').trim();
  const nombre = String(item?.nombre || NOMBRES_ASISTENCIA_POR_DNI[socio] || '').trim();
  const plan = normalizarCategoria(item?.plan);
  const estado = normalizarEstado(item?.estado);
  const fechaISO = String(item?.fechaISO || '').trim() || new Date().toISOString();

  if (!socio) {
    return null;
  }

  return {
    id: String(item?.id || `as-${Date.now()}`),
    socio,
    nombre,
    plan,
    estado,
    fechaISO
  };
}

function cargarAsistencias() {
  try {
    const version = localStorage.getItem(ASISTENCIAS_VERSION_KEY);
    const guardadas = version === ASISTENCIAS_DATA_VERSION
      ? JSON.parse(localStorage.getItem(ASISTENCIAS_STORAGE_KEY) || '[]')
      : [];
    const normalizadas = Array.isArray(guardadas)
      ? guardadas.map(normalizarAsistencia).filter(Boolean)
      : [];

    asistencias = normalizadas.length
      ? normalizadas
      : asistenciasDemo.map(normalizarAsistencia).filter(Boolean);

    if (version !== ASISTENCIAS_DATA_VERSION) {
      guardarAsistencias();
    }
  } catch (error) {
    asistencias = asistenciasDemo.map(normalizarAsistencia).filter(Boolean);
    guardarAsistencias();
  }
}

function guardarAsistencias() {
  try {
    localStorage.setItem(ASISTENCIAS_STORAGE_KEY, JSON.stringify(asistencias));
    localStorage.setItem(ASISTENCIAS_VERSION_KEY, ASISTENCIAS_DATA_VERSION);
  } catch (error) {
    mostrarToast('No se pudo guardar en este navegador.', true);
  }
}

function obtenerAsistenciasFiltradas() {
  const query = attendanceSearch.trim().toLowerCase();

  return asistencias.filter((item) => {
    const coincideCategoria = attendanceFilter === 'todos' || item.plan === attendanceFilter;
    const coincideEstado = attendanceStatusFilter === 'todos' || item.estado === attendanceStatusFilter;
    const coincideBusqueda = !query
      || item.socio.toLowerCase().includes(query)
      || item.nombre.toLowerCase().includes(query)
      || item.plan.toLowerCase().includes(query)
      || item.estado.toLowerCase().includes(query);
    return coincideCategoria && coincideEstado && coincideBusqueda;
  });
}

function renderMetricas() {
  const hoy = new Date();
  const totalHoy = asistencias.filter((item) => {
    const date = new Date(item.fechaISO);
    return date.getDate() === hoy.getDate()
      && date.getMonth() === hoy.getMonth()
      && date.getFullYear() === hoy.getFullYear();
  }).length;
  const presentes = asistencias.filter((item) => item.estado === 'presente').length;
  const ausentes = asistencias.filter((item) => item.estado !== 'presente').length;

  document.getElementById('metric-total-today').textContent = String(totalHoy);
  document.getElementById('metric-active-membership').textContent = String(presentes);
  document.getElementById('metric-expired-membership').textContent = String(ausentes);
}

function renderTabla() {
  const body = document.getElementById('attendance-table-body');

  if (!body) {
    return;
  }

  const items = obtenerAsistenciasFiltradas();
  const countLabel = document.getElementById('attendance-count');
  const paginationDiv = document.getElementById('attendance-pagination');
  const totalPages = Math.max(1, Math.ceil(items.length / ASISTENCIAS_ITEMS_PER_PAGE));

  asistenciasPaginaActual = Math.min(Math.max(asistenciasPaginaActual, 1), totalPages);

  if (!items.length) {
    body.innerHTML = `
      <tr>
        <td colspan="6" class="px-5 py-10 text-center text-secondary">
          <span class="material-symbols-outlined text-4xl">event_busy</span>
          <p class="mt-2 font-bold text-on-surface">No hay asistencias para mostrar</p>
        </td>
      </tr>
    `;
    if (countLabel) countLabel.textContent = '0 asistencias';
    if (paginationDiv) paginationDiv.innerHTML = '';
    return;
  }

  const startIndex = (asistenciasPaginaActual - 1) * ASISTENCIAS_ITEMS_PER_PAGE;
  const endIndex = startIndex + ASISTENCIAS_ITEMS_PER_PAGE;
  const itemsPagina = items.slice(startIndex, endIndex);

  body.innerHTML = itemsPagina
    .map((item) => `
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-5 py-4 text-sm font-bold text-on-surface">${escapeHtml(item.socio)}</td>
        <td class="px-5 py-4 text-sm font-semibold text-on-surface">${escapeHtml(item.nombre || 'Sin nombre')}</td>
        <td class="px-5 py-4 text-sm font-semibold text-on-surface">${escapeHtml(item.plan)}</td>
        <td class="px-5 py-4 text-sm font-semibold text-secondary">${escapeHtml(formatHora(item.fechaISO))}</td>
        <td class="px-5 py-4">${formatoEstado(item.estado)}</td>
        <td class="px-5 py-4 text-right">
          <button type="button" class="users-icon-button text-primary" onclick="abrirEdicionAsistencia('${escapeHtml(item.id)}')" title="Editar asistencia">
            <span class="material-symbols-outlined text-lg">edit</span>
          </button>
        </td>
      </tr>
    `)
    .join('');

  if (countLabel) {
    countLabel.textContent = `Mostrando ${startIndex + 1}-${Math.min(endIndex, items.length)} de ${items.length} asistencias`;
  }

  if (paginationDiv) {
    if (items.length <= ASISTENCIAS_ITEMS_PER_PAGE) {
      paginationDiv.innerHTML = '';
    } else {
      let html = `<button onclick="cambiarPaginaAsistencias(${asistenciasPaginaActual - 1})" class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-surface-container active:scale-95 disabled:opacity-50" ${asistenciasPaginaActual === 1 ? 'disabled' : ''}><span class="material-symbols-outlined text-sm">chevron_left</span></button>`;
      for (let i = 1; i <= totalPages; i += 1) {
        html += i === asistenciasPaginaActual
          ? `<button class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-on-primary">${i}</button>`
          : `<button onclick="cambiarPaginaAsistencias(${i})" class="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-on-surface hover:bg-surface-container">${i}</button>`;
      }
      html += `<button onclick="cambiarPaginaAsistencias(${asistenciasPaginaActual + 1})" class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-surface-container active:scale-95 disabled:opacity-50" ${asistenciasPaginaActual === totalPages ? 'disabled' : ''}><span class="material-symbols-outlined text-sm">chevron_right</span></button>`;
      paginationDiv.innerHTML = html;
    }
  }
}

function cambiarPaginaAsistencias(page) {
  asistenciasPaginaActual = Number(page) || 1;
  renderTabla();
}

function renderTodo() {
  renderMetricas();
  renderTabla();
}

function abrirEdicionAsistencia(id) {
  const item = asistencias.find((registro) => registro.id === id);
  if (!item) {
    return;
  }

  document.getElementById('attendance-edit-id').value = item.id;
  document.getElementById('attendance-edit-member').value = item.socio;
  document.getElementById('attendance-edit-name').value = item.nombre || '';
  document.getElementById('attendance-edit-plan').value = item.plan;
  document.getElementById('attendance-edit-status').value = item.estado;
  document.getElementById('attendance-modal')?.classList.remove('hidden');
}

function cerrarModalEdicion() {
  document.getElementById('attendance-modal')?.classList.add('hidden');
  document.getElementById('attendance-edit-form')?.reset();
}

function abrirModalManual() {
  document.getElementById('manual-entry-modal')?.classList.remove('hidden');
  window.setTimeout(() => document.getElementById('attendance-member-input')?.focus(), 0);
}

function cerrarModalManual() {
  document.getElementById('manual-entry-modal')?.classList.add('hidden');
  document.getElementById('manual-attendance-form')?.reset();
}

function normalizarDniInput(input) {
  if (!input) {
    return '';
  }

  const limpio = String(input.value || '').replace(/\D/g, '').slice(0, 8);
  if (input.value !== limpio) {
    input.value = limpio;
  }

  return limpio;
}

function activarSoloNumerosDni(input) {
  if (!input) {
    return;
  }

  input.addEventListener('beforeinput', (event) => {
    if (event.inputType?.startsWith('delete') || event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
      return;
    }

    if (event.data && /\D/.test(event.data)) {
      event.preventDefault();
    }
  });

  input.addEventListener('input', () => normalizarDniInput(input));
}

function obtenerPerfilAsistenciaPorDni(socio) {
  const registro = asistencias.find((item) => item.socio === socio)
    || asistenciasDemo.find((item) => item.socio === socio);

  return {
    nombre: String(registro?.nombre || NOMBRES_ASISTENCIA_POR_DNI[socio] || '').trim(),
    plan: normalizarCategoria(registro?.plan || 'Clientes')
  };
}

function guardarEdicion(event) {
  event.preventDefault();
  const id = document.getElementById('attendance-edit-id')?.value;
  const item = asistencias.find((registro) => registro.id === id);

  if (!item) {
    mostrarToast('No se encontro el registro para editar.', true);
    return;
  }

  const editMemberInput = document.getElementById('attendance-edit-member');
  const socioEditado = normalizarDniInput(editMemberInput);

  if (!/^\d{7,8}$/.test(socioEditado)) {
    mostrarToast('Ingresa un DNI valido.', true);
    editMemberInput?.focus();
    return;
  }

  item.socio = socioEditado;
  item.nombre = document.getElementById('attendance-edit-name')?.value.trim() || item.nombre;
  item.plan = normalizarCategoria(document.getElementById('attendance-edit-plan')?.value || item.plan);
  item.estado = normalizarEstado(document.getElementById('attendance-edit-status')?.value || item.estado);
  guardarAsistencias();
  cerrarModalEdicion();
  renderTodo();
  mostrarToast('Asistencia actualizada correctamente.');
}

function guardarManual(event) {
  event.preventDefault();
  const input = document.getElementById('attendance-member-input');
  const socio = normalizarDniInput(input);

  if (!/^\d{7,8}$/.test(socio)) {
    mostrarToast('Ingresa un DNI valido.', true);
    input?.focus();
    return;
  }

  const perfil = obtenerPerfilAsistenciaPorDni(socio);

  asistencias = [
    {
      id: `as-${Date.now()}`,
      socio,
      nombre: perfil.nombre,
      plan: perfil.plan,
      estado: 'presente',
      fechaISO: new Date().toISOString()
    },
    ...asistencias
  ];

  document.getElementById('manual-attendance-form')?.reset();
  guardarAsistencias();
  asistenciasPaginaActual = 1;
  renderTodo();
  cerrarModalManual();
  mostrarToast('Asistencia registrada por DNI.');
}

document.addEventListener('DOMContentLoaded', () => {
  cargarAsistencias();
  renderTodo();
  activarSoloNumerosDni(document.getElementById('attendance-member-input'));
  activarSoloNumerosDni(document.getElementById('attendance-edit-member'));

  document.getElementById('attendance-search')?.addEventListener('input', (event) => {
    attendanceSearch = event.target.value;
    asistenciasPaginaActual = 1;
    renderTabla();
  });

  document.getElementById('attendance-filter')?.addEventListener('change', (event) => {
    attendanceFilter = event.target.value;
    asistenciasPaginaActual = 1;
    renderTabla();
  });

  document.getElementById('attendance-status-filter')?.addEventListener('change', (event) => {
    attendanceStatusFilter = event.target.value;
    asistenciasPaginaActual = 1;
    renderTabla();
  });

  document.getElementById('manual-attendance-form')?.addEventListener('submit', guardarManual);
  document.getElementById('attendance-edit-form')?.addEventListener('submit', guardarEdicion);
  document.getElementById('close-attendance-modal')?.addEventListener('click', cerrarModalEdicion);
  document.getElementById('cancel-attendance-modal')?.addEventListener('click', cerrarModalEdicion);
  document.getElementById('open-manual-entry-modal')?.addEventListener('click', abrirModalManual);
  document.getElementById('close-manual-entry-modal')?.addEventListener('click', cerrarModalManual);
  document.getElementById('cancel-manual-entry-modal')?.addEventListener('click', cerrarModalManual);

  document.getElementById('manual-entry-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('manual-entry-modal')) {
      cerrarModalManual();
    }
  });

  document.getElementById('attendance-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('attendance-modal')) {
      cerrarModalEdicion();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    const manualModalOpen = !document.getElementById('manual-entry-modal')?.classList.contains('hidden');
    const editModalOpen = !document.getElementById('attendance-modal')?.classList.contains('hidden');

    if (manualModalOpen) {
      cerrarModalManual();
      return;
    }

    if (editModalOpen) {
      cerrarModalEdicion();
    }
  });
});

window.abrirEdicionAsistencia = abrirEdicionAsistencia;
window.cambiarPaginaAsistencias = cambiarPaginaAsistencias;