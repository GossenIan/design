const ASISTENCIAS_STORAGE_KEY = 'squatgym-attendance-records';
const asistenciasDemo = [
  { id: 'as-1', socio: 'Valeria Mendez (#8210)', plan: 'Plan Gold', estado: 'activa', fechaISO: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  { id: 'as-2', socio: 'Carlos Ruiz (#4492)', plan: 'Plan Basico', estado: 'vencido', fechaISO: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: 'as-3', socio: 'Elena Gomez (#1023)', plan: 'Plan VIP', estado: 'activa', fechaISO: new Date(Date.now() - 22 * 60 * 1000).toISOString() },
  { id: 'as-4', socio: 'Martin Silva (#5561)', plan: 'Plan Gold', estado: 'activa', fechaISO: new Date(Date.now() - 48 * 60 * 1000).toISOString() }
];
let asistencias = [];

let attendanceFilter = 'todos';
let attendanceSearch = '';

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

function formatoEstado(estado) {
  return estado === 'vencido'
    ? '<span class="inline-flex items-center gap-2 rounded-full bg-error-container px-3 py-1 text-xs font-black text-error"><span class="h-2 w-2 rounded-full bg-error"></span>Vencido</span>'
    : '<span class="inline-flex items-center gap-2 rounded-full bg-primary-container/15 px-3 py-1 text-xs font-black text-primary"><span class="h-2 w-2 rounded-full bg-primary"></span>Activa</span>';
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
  const plan = String(item?.plan || '').trim() || 'Plan Gold';
  const estado = item?.estado === 'vencido' ? 'vencido' : 'activa';
  const fechaISO = String(item?.fechaISO || '').trim() || new Date().toISOString();

  if (!socio) {
    return null;
  }

  return {
    id: String(item?.id || `as-${Date.now()}`),
    socio,
    plan,
    estado,
    fechaISO
  };
}

function cargarAsistencias() {
  try {
    const guardadas = JSON.parse(localStorage.getItem(ASISTENCIAS_STORAGE_KEY) || '[]');
    const normalizadas = Array.isArray(guardadas)
      ? guardadas.map(normalizarAsistencia).filter(Boolean)
      : [];

    asistencias = normalizadas.length
      ? normalizadas
      : asistenciasDemo.map((item) => ({ ...item }));
  } catch (error) {
    asistencias = asistenciasDemo.map((item) => ({ ...item }));
  }
}

function guardarAsistencias() {
  try {
    localStorage.setItem(ASISTENCIAS_STORAGE_KEY, JSON.stringify(asistencias));
  } catch (error) {
    mostrarToast('No se pudo guardar en este navegador.', true);
  }
}

function obtenerAsistenciasFiltradas() {
  const query = attendanceSearch.trim().toLowerCase();

  return asistencias.filter((item) => {
    const coincideEstado = attendanceFilter === 'todos' || item.estado === attendanceFilter;
    const coincideBusqueda = !query
      || item.socio.toLowerCase().includes(query)
      || item.plan.toLowerCase().includes(query);
    return coincideEstado && coincideBusqueda;
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
  const activas = asistencias.filter((item) => item.estado === 'activa').length;
  const vencidas = asistencias.filter((item) => item.estado === 'vencido').length;

  document.getElementById('metric-total-today').textContent = String(totalHoy);
  document.getElementById('metric-active-membership').textContent = String(activas);
  document.getElementById('metric-expired-membership').textContent = String(vencidas);
}

function renderTabla() {
  const body = document.getElementById('attendance-table-body');

  if (!body) {
    return;
  }

  const items = obtenerAsistenciasFiltradas();

  if (!items.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5" class="px-5 py-10 text-center text-secondary">
          <span class="material-symbols-outlined text-4xl">event_busy</span>
          <p class="mt-2 font-bold text-on-surface">No hay asistencias para mostrar</p>
        </td>
      </tr>
    `;
    return;
  }

  body.innerHTML = items
    .map((item) => `
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-5 py-4 text-sm font-bold text-on-surface">${escapeHtml(item.socio)}</td>
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
  document.getElementById('attendance-edit-plan').value = item.plan;
  document.getElementById('attendance-edit-status').value = item.estado;
  document.getElementById('attendance-modal')?.classList.remove('hidden');
}

function cerrarModalEdicion() {
  document.getElementById('attendance-modal')?.classList.add('hidden');
  document.getElementById('attendance-edit-form')?.reset();
}

function guardarEdicion(event) {
  event.preventDefault();
  const id = document.getElementById('attendance-edit-id')?.value;
  const item = asistencias.find((registro) => registro.id === id);

  if (!item) {
    mostrarToast('No se encontro el registro para editar.', true);
    return;
  }

  item.socio = document.getElementById('attendance-edit-member')?.value.trim() || item.socio;
  item.plan = document.getElementById('attendance-edit-plan')?.value || item.plan;
  item.estado = document.getElementById('attendance-edit-status')?.value || item.estado;
  guardarAsistencias();
  cerrarModalEdicion();
  renderTodo();
  mostrarToast('Asistencia actualizada correctamente.');
}

function guardarManual(event) {
  event.preventDefault();
  const socio = document.getElementById('attendance-member-input')?.value.trim();
  const plan = document.getElementById('attendance-plan-input')?.value;
  const estado = document.getElementById('attendance-status-input')?.value || 'activa';

  if (!socio) {
    mostrarToast('Ingresa un socio o nombre valido.', true);
    return;
  }

  asistencias = [
    {
      id: `as-${Date.now()}`,
      socio,
      plan,
      estado,
      fechaISO: new Date().toISOString()
    },
    ...asistencias
  ];

  document.getElementById('manual-attendance-form')?.reset();
  document.getElementById('attendance-plan-input').value = 'Plan Gold';
  document.getElementById('attendance-status-input').value = 'activa';
  guardarAsistencias();
  renderTodo();
  mostrarToast('Asistencia manual registrada.');
}

document.addEventListener('DOMContentLoaded', () => {
  cargarAsistencias();
  renderTodo();

  document.getElementById('attendance-search')?.addEventListener('input', (event) => {
    attendanceSearch = event.target.value;
    renderTabla();
  });

  document.getElementById('attendance-filter')?.addEventListener('change', (event) => {
    attendanceFilter = event.target.value;
    renderTabla();
  });

  document.getElementById('manual-attendance-form')?.addEventListener('submit', guardarManual);
  document.getElementById('attendance-edit-form')?.addEventListener('submit', guardarEdicion);
  document.getElementById('close-attendance-modal')?.addEventListener('click', cerrarModalEdicion);
  document.getElementById('cancel-attendance-modal')?.addEventListener('click', cerrarModalEdicion);
  document.getElementById('open-manual-entry-modal')?.addEventListener('click', () => {
    document.getElementById('manual-entry-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('attendance-member-input')?.focus(), 200);
  });

  document.getElementById('attendance-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('attendance-modal')) {
      cerrarModalEdicion();
    }
  });
});

window.abrirEdicionAsistencia = abrirEdicionAsistencia;
