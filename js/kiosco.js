const PRODUCTOS_STORAGE_KEY = 'squatgym-kiosco-products';
const PRODUCTOS_ELIMINADOS_STORAGE_KEY = 'squatgym-kiosco-deleted-products';
const DESCUENTOS_STORAGE_KEY = 'squatgym-kiosco-discounts';
const HISTORIAL_VENTAS_STORAGE_KEY = 'squatgym-kiosco-sales-history';
const CAJA_CONFIG_STORAGE_KEY = 'squatgym-kiosco-cash-close-config';
const TURNO_INICIO_STORAGE_KEY = 'squatgym-kiosco-shift-start';
const SUCURSAL_STORAGE_KEY = 'squatgym-kiosco-active-branch';
const SUCURSALES_KIOSCO = ['SquatGym Central', 'Sucursal Sur'];
const SUCURSAL_DEFAULT = 'SquatGym Central';
const USUARIO_ACTIVO = 'Admin Squat';
const CAJA_DEFAULT_ID = 'Caja 01';
const CATEGORIAS_KIOSCO = ['Suplementos', 'Bebidas', 'Alimentos', 'Indumentaria', 'Preparados'];
const CATEGORIA_ALIASES = {
  proteinas: 'Suplementos',
  aminoacidos: 'Suplementos',
  'pre-entrenos': 'Suplementos',
  accesorios: 'Bebidas',
  comestibles: 'Alimentos',
  equipo: 'Indumentaria'
};
const DATOS_FACTURA_KIOSCO = {
  domicilio: 'Av. Siempreviva 123, Resistencia',
  cuit: '30-12345678-9',
  condicionFiscal: 'IVA Responsable Inscripto',
  puntoVenta: '0001'
};

const descuentosBase = [
  { id: 'sin-descuento', nombre: 'Sin descuento', porcentaje: 0 },
  { id: 'venta-rapida', nombre: 'Venta rápida', porcentaje: 10 },
  { id: 'promo-socio', nombre: 'Promo socio', porcentaje: 15 },
  { id: 'mayorista', nombre: 'Mayorista', porcentaje: 20 }
];

const productosBase = [
  {
    id: 1,
    nombre: 'Gold Standard 100% Whey',
    marca: 'Optimum Nutrition',
    codigoBarras: '7790001000010',
    precio: 45.00,
    descuento: 15,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZe1qJ5tvQvqdz1O1tKulwx4oc3dW_d3hln0r67XL6k1ySLv3VWblO_2960LjqrKXFcm3VOVwhgIFdF-hv8CFnubrL6tzTnpmvF3CoFelFLm4OkPyDEheIcECeqW5DqEddHBocLbJ6269w9Tg945mI2bz-ysyZtRkNlxRmjKmx85BkF2o-S-0usyG9qN-2yBxcatAlqzB-z3Td4cdAncXNmlqfKNerhnG9sPsYf2DE-kuKSHU3ZwZ9ktcwD2HFEhybnJhX7lr5fw',
    categoria: 'Suplementos',
    sucursal: 'SquatGym Central',
    stock: 18
  },
  {
    id: 2,
    nombre: 'Platinum Creatine 400g',
    marca: 'MuscleTech',
    codigoBarras: '7790001000027',
    precio: 22.50,
    descuento: 0,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnmb2_pU2BGAsOrSukg8jBXG2tjLO8bAnDrHWtMH0dL6uAq0yVenf6Uq8X5nhN9wDsu13HzBgqnudTndy7g8ZyASZiTNTQNAgb0pZG7rfk3VchyNJUlO6HJG70UArlfY8UHOqQrtaZLCFKg1DSk639aMEqMMZUGX6EalDxkyptIi0909zr_NUyORwP_2D2jnSOK11xKY_l4sAuT86r4apjWy7QLPoXjj2cXk7ReKA5MjbOo9Vd0tGtBpQe2fVEE_ro1UGnb-KxTw',
    categoria: 'Suplementos',
    sucursal: 'Sucursal Sur',
    stock: 7
  },
  {
    id: 3,
    nombre: 'Original BCAA - Fresa Kiwi',
    marca: 'Xtend',
    codigoBarras: '7790001000034',
    precio: 30.00,
    descuento: 0,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN6ljKm4E3r51_4gQAJU4mMU_1X05Nl903Zakxpuc4ya5qEDb03om371edVpAOBu6sTV3fyj9y9E48sT6GeB4W6wX45PE0b2KYEdFDNRpRHUSv6bPnLU_uqv8xnCWt5_floGKGoVAeCYg1dduoJGwExTsa-CT7wzHOQmzsgMdqRZY5ws_caxhnzyjU6DUtBjbBQkcx32Xoj8iPoRm3N9J1IBNYBzAhUq13xorIUWTqYLhXK3VpDmRD9TUMDqFMqvUJW1R1VZbXuA',
    categoria: 'Suplementos',
    sucursal: 'SquatGym Central',
    stock: 0
  },
  {
    id: 4,
    nombre: 'C4 Original Pre-Workout',
    marca: 'Cellucor',
    codigoBarras: '7790001000041',
    precio: 28.99,
    descuento: 0,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr20_qcQM1WvJ-yV6pa0HahbQgE3iX4iGoKiiRTvvwud2twpOe1WFj6YrJGgNhh1zNVmm3ORyWc9R06XP2QqDZZkRptfxkkiMQrL6-fO21f71k7It8PDyQuEdJqk-ErEsVmuvikp-pH2mA3N1lvKNH-o6STWZjVLinlvTj4wcBtxSqSdsrmgboPnQnTG36ciWes5e7cA-11UjOf7rlhM9XQyMmsBFIE4VGSyGmEmEK6OCgkR0IX2Jr_NBpdyuUy3QWE-yHcvbaLg',
    categoria: 'Suplementos',
    sucursal: 'Sucursal Sur',
    stock: 12
  },
  {
    id: 5,
    nombre: 'Shaker SquatGym Pro 700ml',
    marca: 'SquatGym',
    codigoBarras: '7790002000019',
    precio: 12.50,
    descuento: 0,
    img: '../../img/shaker.png',
    icono: 'water_bottle',
    categoria: 'Bebidas',
    sucursal: 'SquatGym Central',
    stock: 36
  },
  {
    id: 5,
    nombre: 'Shaker SquatGym Pro 700ml',
    marca: 'SquatGym',
    codigoBarras: '7790002000019',
    precio: 12.50,
    descuento: 0,
    img: '../../img/shaker.png',
    icono: 'water_bottle',
    categoria: 'Bebidas',
    sucursal: 'Sucursal Sur',
    stock: 14
  }
];

let productosPersonalizados = [];
let productosEliminados = [];
let productos = [...productosBase];
let carrito = [];
let catalogoStorageFirma = '';
let historialVentas = [];
let totalesActuales = {
  subtotal: 0,
  descuentoMonto: 0,
  impuestos: 0,
  total: 0,
  totalItems: 0
};
let metodoPagoActivo = 'efectivo';
let descuentosDisponibles = [...descuentosBase];
let descuentoActivoId = 'venta-rapida';
let descuentoGlobal = 10;
let sucursalActiva = SUCURSAL_DEFAULT;
let categoriaActiva = 'Todos';
let terminoBusqueda = '';
let kioscoPaginaActual = 1;
const KIOSCO_ITEMS_PER_PAGE = 8;
let productoEnEdicionId = null;
let turnoInicioISO = null;
let ultimaVentaRegistrada = null;
const IVA = 0.16;
const DIFERENCIA_CIERRE_EPSILON = 0.005;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function formatDateTime(value) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return String(value || '');
  }
}

function formatDateOnly(value) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return String(value || '');
  }
}

function formatInvoiceDate(value) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(value));
  } catch (error) {
    return String(value || '');
  }
}

function formatTimeOnly(value) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch (error) {
    return String(value || '');
  }
}

function leerMonto(value) {
  const monto = Number(value);
  return Number.isFinite(monto) ? monto : 0;
}

function normalizarMontoCaja(value) {
  return Math.max(leerMonto(value), 0);
}

function obtenerTurnoInicio() {
  try {
    const savedStart = localStorage.getItem(TURNO_INICIO_STORAGE_KEY);

    if (savedStart && !Number.isNaN(new Date(savedStart).getTime())) {
      return savedStart;
    }

    const nextStart = new Date().toISOString();
    localStorage.setItem(TURNO_INICIO_STORAGE_KEY, nextStart);
    return nextStart;
  } catch (error) {
    return new Date().toISOString();
  }
}

function reiniciarTurnoInicio() {
  turnoInicioISO = new Date().toISOString();

  try {
    localStorage.setItem(TURNO_INICIO_STORAGE_KEY, turnoInicioISO);
  } catch (error) {
    return false;
  }

  return true;
}

function obtenerInicioTurnoParaCierre(ventas = historialVentas) {
  const inicioGuardado = turnoInicioISO || obtenerTurnoInicio();
  const fechasVentas = ventas
    .map((venta) => new Date(venta.fechaISO).getTime())
    .filter((fecha) => Number.isFinite(fecha));

  if (!fechasVentas.length) {
    return inicioGuardado;
  }

  const primeraVenta = new Date(Math.min(...fechasVentas)).toISOString();

  return new Date(inicioGuardado).getTime() <= new Date(primeraVenta).getTime()
    ? inicioGuardado
    : primeraVenta;
}

function cargarConfiguracionCierreCaja() {
  try {
    const savedConfig = JSON.parse(localStorage.getItem(CAJA_CONFIG_STORAGE_KEY) || '{}');

    return {
      usuario: String(savedConfig.usuario || USUARIO_ACTIVO),
      cajaId: String(savedConfig.cajaId || CAJA_DEFAULT_ID),
      montoInicial: normalizarMontoCaja(savedConfig.montoInicial)
    };
  } catch (error) {
    return {
      usuario: USUARIO_ACTIVO,
      cajaId: CAJA_DEFAULT_ID,
      montoInicial: 0
    };
  }
}

function guardarConfiguracionCierreCaja(config) {
  try {
    localStorage.setItem(CAJA_CONFIG_STORAGE_KEY, JSON.stringify({
      usuario: config.usuario || USUARIO_ACTIVO,
      cajaId: config.cajaId || CAJA_DEFAULT_ID,
      montoInicial: normalizarMontoCaja(config.montoInicial)
    }));
    return true;
  } catch (error) {
    return false;
  }
}

function poblarConfiguracionCierreCaja() {
  const config = cargarConfiguracionCierreCaja();
  const userInput = document.getElementById('cash-close-user');
  const registerInput = document.getElementById('cash-close-register-id');
  const openingInput = document.getElementById('cash-close-opening');
  const withdrawalsInput = document.getElementById('cash-close-withdrawals');
  const countedInput = document.getElementById('cash-close-counted');
  const observationsInput = document.getElementById('cash-close-observations');

  if (userInput) {
    userInput.value = config.usuario;
  }

  if (registerInput) {
    registerInput.value = config.cajaId;
  }

  if (openingInput) {
    openingInput.value = config.montoInicial > 0 ? String(config.montoInicial) : '';
  }

  if (withdrawalsInput) {
    withdrawalsInput.value = '';
  }

  if (countedInput) {
    countedInput.value = '';
  }

  if (observationsInput) {
    observationsInput.value = '';
  }
}

function obtenerDatosCierreCaja(fechaFinISO = new Date().toISOString()) {
  const usuario = document.getElementById('cash-close-user')?.value.trim() || USUARIO_ACTIVO;
  const cajaId = document.getElementById('cash-close-register-id')?.value.trim() || CAJA_DEFAULT_ID;
  const montoInicial = normalizarMontoCaja(document.getElementById('cash-close-opening')?.value);
  const egresos = normalizarMontoCaja(document.getElementById('cash-close-withdrawals')?.value);
  const efectivoContado = normalizarMontoCaja(document.getElementById('cash-close-counted')?.value);
  const observaciones = document.getElementById('cash-close-observations')?.value.trim() || '';

  return {
    usuario,
    cajaId,
    montoInicial,
    egresos,
    efectivoContado,
    observaciones,
    fechaInicioISO: obtenerInicioTurnoParaCierre(),
    fechaFinISO
  };
}

function obtenerTotalEsperadoCierre(resumen, datosCierre) {
  return datosCierre.montoInicial + resumen.efectivo - datosCierre.egresos;
}

function esDiferenciaCierreSignificativa(diferencia) {
  return Math.abs(diferencia) >= DIFERENCIA_CIERRE_EPSILON;
}

function asignarTexto(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function cargarHistorialVentas() {
  try {
    const savedSales = JSON.parse(localStorage.getItem(HISTORIAL_VENTAS_STORAGE_KEY) || '[]');

    return Array.isArray(savedSales) ? savedSales : [];
  } catch (error) {
    return [];
  }
}

function guardarHistorialVentas() {
  try {
    localStorage.setItem(HISTORIAL_VENTAS_STORAGE_KEY, JSON.stringify(historialVentas));
    return true;
  } catch (error) {
    return false;
  }
}

function normalizarClaveCategoria(value) {
  return String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function normalizarCategoria(value) {
  const clave = normalizarClaveCategoria(value);
  const categoriaPermitida = CATEGORIAS_KIOSCO.find((categoria) => normalizarClaveCategoria(categoria) === clave);

  return categoriaPermitida || CATEGORIA_ALIASES[clave] || 'Suplementos';
}

function normalizarSucursal(value) {
  if (value === 'Sucursal Norte') {
    return 'Sucursal Sur';
  }

  const sucursal = SUCURSALES_KIOSCO.find((item) => item === value);

  return sucursal || SUCURSAL_DEFAULT;
}

function obtenerClaveProducto(producto) {
  return `${Number(producto.id)}__${normalizarSucursal(producto.sucursal)}`;
}

function normalizarClaveProducto(clave) {
  const claveTexto = String(clave ?? '').trim();

  if (claveTexto.includes('__')) {
    return claveTexto;
  }

  const producto = obtenerProductoPorId(claveTexto);

  return producto ? obtenerClaveProducto(producto) : claveTexto;
}

function obtenerProductoPorClave(clave) {
  const claveNormalizada = normalizarClaveProducto(clave);

  return productos.find((producto) => obtenerClaveProducto(producto) === claveNormalizada) || null;
}

function cargarSucursalActiva() {
  try {
    return normalizarSucursal(localStorage.getItem(SUCURSAL_STORAGE_KEY));
  } catch (error) {
    return SUCURSAL_DEFAULT;
  }
}

function guardarSucursalActiva() {
  try {
    localStorage.setItem(SUCURSAL_STORAGE_KEY, sucursalActiva);
  } catch (error) {
    // La tienda puede seguir funcionando aunque el navegador bloquee el guardado.
  }
}

function renderizarSucursalActiva() {
  const branchSelect = document.getElementById('branch-select');
  const branchSelectLabel = document.getElementById('branch-select-label');
  const branchFixedLabel = document.getElementById('branch-fixed-label');
  const branchFixedName = document.getElementById('branch-fixed-name');

  asignarTexto('active-branch-title', sucursalActiva);

  if (tieneSucursalFija()) {
    if (branchSelectLabel) {
      branchSelectLabel.classList.add('hidden');
    }

    if (branchFixedLabel) {
      branchFixedLabel.classList.remove('hidden');
    }

    if (branchFixedName) {
      branchFixedName.textContent = sucursalActiva;
    }
  } else {
    if (branchSelectLabel) {
      branchSelectLabel.classList.remove('hidden');
    }

    if (branchFixedLabel) {
      branchFixedLabel.classList.add('hidden');
    }

    if (branchSelect) {
      branchSelect.innerHTML = SUCURSALES_KIOSCO
        .map((sucursal) => `<option value="${escapeHtml(sucursal)}">${escapeHtml(sucursal)}</option>`)
        .join('');
      branchSelect.value = sucursalActiva;
    }
  }
}

function cambiarSucursalActiva(nuevaSucursal) {
  const sucursalNormalizada = normalizarSucursal(nuevaSucursal);

  if (sucursalNormalizada === sucursalActiva) {
    renderizarSucursalActiva();
    return;
  }

  if (carrito.length) {
    const confirmar = window.confirm('Cambiar de sucursal vaciara el carrito actual. ¿Continuar?');

    if (!confirmar) {
      renderizarSucursalActiva();
      return;
    }

    carrito = [];
    actualizarInterfaz();
  }

  sucursalActiva = sucursalNormalizada;
  guardarSucursalActiva();
  categoriaActiva = 'Todos';
  terminoBusqueda = '';

  const productSearch = document.getElementById('product-search');

  if (productSearch) {
    productSearch.value = '';
  }
  
  kioscoPaginaActual = 1;

  renderizarSucursalActiva();
  renderizarProductos();
}

function normalizarDescuento(value) {
  const descuento = Number(value);

  if (!Number.isFinite(descuento)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(descuento), 0), 90);
}

function normalizarDescuentoGuardado(descuento) {
  const id = String(descuento?.id || '').trim();
  const nombre = String(descuento?.nombre || '').trim();

  if (!id || !nombre) {
    return null;
  }

  return {
    id,
    nombre,
    porcentaje: normalizarDescuento(descuento.porcentaje)
  };
}

function cargarDescuentosGuardados() {
  try {
    const savedDiscounts = JSON.parse(localStorage.getItem(DESCUENTOS_STORAGE_KEY) || '[]');
    const descuentosNormalizados = Array.isArray(savedDiscounts)
      ? savedDiscounts.map(normalizarDescuentoGuardado).filter(Boolean)
      : [];

    return descuentosNormalizados.length ? descuentosNormalizados : descuentosBase.map((descuento) => ({ ...descuento }));
  } catch (error) {
    return descuentosBase.map((descuento) => ({ ...descuento }));
  }
}

function guardarDescuentosDisponibles() {
  try {
    localStorage.setItem(DESCUENTOS_STORAGE_KEY, JSON.stringify(descuentosDisponibles));
    return true;
  } catch (error) {
    return false;
  }
}

function obtenerDescuentoActivo() {
  return descuentosDisponibles.find((descuento) => descuento.id === descuentoActivoId)
    || descuentosDisponibles[0]
    || { id: 'sin-descuento', nombre: 'Sin descuento', porcentaje: 0 };
}

function sincronizarDescuentoActivo() {
  const descuentoActivo = obtenerDescuentoActivo();

  descuentoActivoId = descuentoActivo.id;
  descuentoGlobal = descuentoActivo.porcentaje;
}

function crearIdDescuento(nombre) {
  const base = normalizarClaveCategoria(nombre)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'descuento';

  return `${base}-${Date.now()}`;
}

function cargarProductosPersonalizados() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(PRODUCTOS_STORAGE_KEY) || '[]');
    return Array.isArray(savedProducts) ? savedProducts : [];
  } catch (error) {
    return [];
  }
}

function guardarProductosPersonalizados() {
  try {
    localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productosPersonalizados));
    return true;
  } catch (error) {
    mostrarErrorProducto('No se pudo guardar el producto en este navegador.');
    return false;
  }
}

function cargarProductosEliminados() {
  try {
    const savedDeleted = JSON.parse(localStorage.getItem(PRODUCTOS_ELIMINADOS_STORAGE_KEY) || '[]');

    return Array.isArray(savedDeleted)
      ? savedDeleted
        .map((value) => String(value ?? '').trim())
        .filter(Boolean)
      : [];
  } catch (error) {
    return [];
  }
}

function guardarProductosEliminados() {
  try {
    localStorage.setItem(PRODUCTOS_ELIMINADOS_STORAGE_KEY, JSON.stringify(productosEliminados));
    return true;
  } catch (error) {
    return false;
  }
}

function sincronizarProductos() {
  const productosGuardadosPorClave = new Map(productosPersonalizados.map((producto) => [obtenerClaveProducto(producto), producto]));
  const clavesBase = new Set(productosBase.map(obtenerClaveProducto));
  const clavesEliminadas = new Set(productosEliminados.map(String));
  const productosBaseActualizados = productosBase
    .filter((producto) => {
      const clave = obtenerClaveProducto(producto);

      return !clavesEliminadas.has(clave) && !clavesEliminadas.has(String(producto.id));
    })
    .map((producto) => productosGuardadosPorClave.get(obtenerClaveProducto(producto)) || producto);
  const productosCreados = productosPersonalizados.filter((producto) => !clavesBase.has(obtenerClaveProducto(producto)));

  productos = [...productosBaseActualizados, ...productosCreados];
}

function obtenerFirmaCatalogoGuardado() {
  try {
    return [
      localStorage.getItem(PRODUCTOS_STORAGE_KEY) || '[]',
      localStorage.getItem(PRODUCTOS_ELIMINADOS_STORAGE_KEY) || '[]'
    ].join('::');
  } catch (error) {
    return '';
  }
}

function actualizarCarritoConCatalogoActual(carritoPrevio) {
  carrito = carritoPrevio
    .map((item) => {
      const productoActualizado = obtenerProductoPorClave(item.clave);

      if (!productoActualizado) {
        return null;
      }

      return {
        ...productoActualizado,
        cantidad: item.cantidad,
        precioEfectivo: obtenerPrecioFinal(productoActualizado)
      };
    })
    .filter(Boolean);
}

function recargarCatalogoDesdeInventario({ forzar = false, renderizar = true } = {}) {
  const firmaActual = obtenerFirmaCatalogoGuardado();

  if (!forzar && firmaActual === catalogoStorageFirma) {
    return false;
  }

  const carritoPrevio = carrito.map((item) => ({
    clave: obtenerClaveProducto(item),
    cantidad: item.cantidad
  }));

  catalogoStorageFirma = firmaActual;
  productosPersonalizados = cargarProductosPersonalizados()
    .map(normalizarProductoGuardado)
    .filter(Boolean);
  productosEliminados = cargarProductosEliminados();
  sincronizarProductos();
  actualizarCarritoConCatalogoActual(carritoPrevio);

  if (renderizar) {
    renderizarProductos();
    actualizarInterfaz();
  }

  return true;
}

function normalizarProductoGuardado(producto) {
  const id = Number(producto.id);
  const precio = Number(producto.precio);
  const descuento = Number(producto.descuento) || 0;
  const stock = Number(producto.stock ?? producto.cantidad ?? 0);
  const categoria = normalizarCategoria(producto.categoria);
  const sucursal = normalizarSucursal(producto.sucursal);
  const nombre = String(producto.nombre || '').trim();
  const marca = String(producto.marca || categoria).trim() || categoria;
  const codigoBarras = String(producto.codigoBarras ?? producto.barcode ?? producto.sku ?? '').trim();

  if (!id || !nombre || !producto.categoria || !Number.isFinite(precio) || precio <= 0) {
    return null;
  }

  return {
    id,
    nombre,
    marca,
    codigoBarras,
    precio,
    descuento: Math.min(Math.max(descuento, 0), 90),
    img: String(producto.img || '').trim(),
    imgNombre: String(producto.imgNombre || '').trim(),
    icono: String(producto.icono || 'inventory_2').trim(),
    categoria,
    sucursal,
    stock: Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : 0,
    descripcion: String(producto.descripcion || '').trim(),
    lotes: Array.isArray(producto.lotes) ? producto.lotes : [],
    proximoVencimiento: String(producto.proximoVencimiento || '').trim(),
    estadoLote: String(producto.estadoLote || '').trim(),
    ventaBloqueada: Boolean(producto.ventaBloqueada),
    personalizado: true
  };
}

function obtenerProductoPorId(id) {
  const productId = Number(id);

  return productos.find((producto) => producto.id === productId && normalizarSucursal(producto.sucursal) === sucursalActiva)
    || productos.find((producto) => producto.id === productId)
    || null;
}

function guardarProductoEditado(productoActualizado) {
  const index = productosPersonalizados.findIndex((producto) => obtenerClaveProducto(producto) === obtenerClaveProducto(productoActualizado));

  if (index >= 0) {
    productosPersonalizados[index] = productoActualizado;
    return;
  }

  productosPersonalizados.push(productoActualizado);
}

function actualizarProductoEnCarrito(productoActualizado) {
  const claveActualizada = obtenerClaveProducto(productoActualizado);

  carrito = carrito.map((item) => {
    if (obtenerClaveProducto(item) !== claveActualizada) {
      return item;
    }

    return {
      ...productoActualizado,
      cantidad: item.cantidad,
      precioEfectivo: obtenerPrecioFinal(productoActualizado)
    };
  });
}

function eliminarProducto(clave) {
  const producto = obtenerProductoPorClave(clave);

  if (!producto) {
    return;
  }

  const confirmar = window.confirm(`¿Eliminar "${producto.nombre}" del inventario del kiosco?`);

  if (!confirmar) {
    return;
  }

  productosPersonalizados = productosPersonalizados.filter((item) => obtenerClaveProducto(item) !== clave);

  if (productosBase.some((item) => obtenerClaveProducto(item) === clave) && !productosEliminados.includes(clave)) {
    productosEliminados.push(clave);
    guardarProductosEliminados();
  }

  guardarProductosPersonalizados();
  carrito = carrito.filter((item) => obtenerClaveProducto(item) !== clave);
  cerrarMenusProducto();
  sincronizarProductos();
  renderizarProductos();
  actualizarInterfaz();
}

function obtenerPrecioFinal(producto) {
  return producto.descuento > 0
    ? producto.precio * (1 - producto.descuento / 100)
    : producto.precio;
}

function renderizarImagenProducto(producto, sizeClass) {
  if (producto.img) {
    return `<img src="${escapeHtml(producto.img)}" alt="${escapeHtml(producto.nombre)}" class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500">`;
  }

  return `<div class="${sizeClass} flex items-center justify-center bg-surface-container-high"><span class="material-symbols-outlined text-secondary text-3xl">${escapeHtml(producto.icono || 'inventory_2')}</span></div>`;
}

function asignarTextoProducto(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function asignarValorProducto(id, value) {
  const input = document.getElementById(id);

  if (input) {
    input.value = value;
  }
}

function actualizarVistaImagenProducto(src = '', nombreArchivo = '') {
  const preview = document.getElementById('product-image-preview');
  const emptyState = document.getElementById('product-image-empty');
  const fileName = document.getElementById('product-image-name');
  const imageInput = document.getElementById('new-product-image');
  const imageNameInput = document.getElementById('new-product-image-name');

  if (imageInput) {
    imageInput.value = src;
  }

  if (imageNameInput) {
    imageNameInput.value = nombreArchivo;
  }

  if (preview) {
    preview.src = src || '';
    preview.classList.toggle('hidden', !src);
  }

  emptyState?.classList.toggle('hidden', !!src);

  if (fileName) {
    fileName.textContent = nombreArchivo ? `img/${nombreArchivo}` : '';
    fileName.classList.toggle('hidden', !nombreArchivo);
  }
}

function leerImagenTemporalProducto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => resolve({
      url: String(reader.result || ''),
      fileName: file.name,
      fallback: true
    }));
    reader.addEventListener('error', () => reject(new Error('No se pudo leer la imagen.')));
    reader.readAsDataURL(file);
  });
}

async function procesarArchivoImagenProducto(file) {
  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    mostrarErrorProducto('Seleccioná un archivo de imagen válido.');
    return;
  }

  try {
    const fileName = document.getElementById('product-image-name');

    if (fileName) {
      fileName.textContent = 'Subiendo imagen...';
      fileName.classList.remove('hidden');
    }

    const image = window.SquatGymImageUpload
      ? await window.SquatGymImageUpload.resolve(file)
      : await leerImagenTemporalProducto(file);

    actualizarVistaImagenProducto(image.url, image.fileName);
    mostrarErrorProducto('');
  } catch (error) {
    mostrarErrorProducto(error.message || 'No se pudo cargar la imagen.');
  }
}

function abrirModalProducto(clave = null) {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const nameInput = document.getElementById('new-product-name');
  const producto = clave !== null ? obtenerProductoPorClave(clave) : null;

  if (clave !== null && !producto) {
    return;
  }

  form?.reset();
  productoEnEdicionId = producto ? obtenerClaveProducto(producto) : null;
  asignarValorProducto('editing-product-id', productoEnEdicionId || '');

  if (producto) {
    asignarTextoProducto('product-modal-title', 'Editar producto');
    asignarTextoProducto('product-modal-description', 'Actualizá los datos del catálogo de kiosco');
    asignarTextoProducto('product-submit-button', 'Guardar cambios');
    asignarValorProducto('new-product-name', producto.nombre);
    asignarValorProducto('new-product-brand', producto.marca);
    asignarValorProducto('new-product-category', producto.categoria);
    asignarValorProducto('new-product-price', producto.precio);
    asignarValorProducto('new-product-discount', producto.descuento || 0);
    asignarValorProducto('new-product-stock', producto.stock ?? 0);
    asignarValorProducto('new-product-description', producto.descripcion || '');
    actualizarVistaImagenProducto(producto.img || '', producto.imgNombre || '');
  } else {
    asignarTextoProducto('product-modal-title', 'Agregar producto');
    asignarTextoProducto('product-modal-description', 'Ingrese la información del producto para agregar al catálogo.');
    asignarTextoProducto('product-submit-button', 'Aceptar');
    asignarValorProducto('new-product-discount', 0);
    asignarValorProducto('new-product-stock', 0);
    actualizarVistaImagenProducto('', '');
  }

  cerrarMenusProducto();
  modal?.classList.remove('hidden');
  mostrarErrorProducto('');
  window.setTimeout(() => nameInput?.focus(), 0);
}

function cerrarModalProducto() {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');

  modal?.classList.add('hidden');
  form?.reset();
  productoEnEdicionId = null;
  asignarValorProducto('editing-product-id', '');
  actualizarVistaImagenProducto('', '');
  mostrarErrorProducto('');
}

function mostrarErrorProducto(message) {
  const errorBox = document.getElementById('product-form-error');

  if (!errorBox) {
    return;
  }

  errorBox.textContent = message;
  errorBox.classList.toggle('hidden', !message);
}

function agregarProductoPersonalizado(event) {
  event.preventDefault();

  const nombre = document.getElementById('new-product-name')?.value.trim();
  const categoria = document.getElementById('new-product-category')?.value;
  const precio = Number(document.getElementById('new-product-price')?.value);
  const descuento = Number(document.getElementById('new-product-discount')?.value || 0);
  const img = document.getElementById('new-product-image')?.value.trim() || '';
  const imgNombre = document.getElementById('new-product-image-name')?.value.trim() || '';
  const stock = Number(document.getElementById('new-product-stock')?.value || 0);
  const descripcion = document.getElementById('new-product-description')?.value.trim() || '';
  const productoExistente = productoEnEdicionId ? obtenerProductoPorClave(productoEnEdicionId) : null;
  const marca = productoExistente?.marca || categoria;

  if (!nombre || !categoria || !Number.isFinite(precio) || precio <= 0) {
    mostrarErrorProducto('Completá nombre, categoría y precio.');
    return;
  }

  if (!Number.isFinite(stock) || stock < 0) {
    mostrarErrorProducto('La cantidad debe ser un número válido.');
    return;
  }

  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 90) {
    mostrarErrorProducto('El descuento debe estar entre 0 y 90.');
    return;
  }

  const imagenValida = !img
    || /^https?:\/\//i.test(img)
    || /^data:image\//i.test(img)
    || /^\/?img\/uploads\//i.test(img)
    || /^\.\.\/\.\.\/img\/uploads\//i.test(img);

  if (!imagenValida) {
    mostrarErrorProducto('La imagen debe ser una URL web o una imagen subida desde el equipo.');
    return;
  }

  const productoGuardado = normalizarProductoGuardado({
    id: productoExistente?.id || Date.now(),
    nombre,
    marca,
    codigoBarras: productoExistente?.codigoBarras || `KIO-${Date.now()}`,
    categoria,
    sucursal: productoExistente?.sucursal || sucursalActiva,
    precio,
    descuento,
    img,
    imgNombre,
    stock,
    descripcion,
    icono: productoExistente?.icono || 'inventory_2'
  });

  if (!productoGuardado) {
    mostrarErrorProducto('No se pudo guardar el producto.');
    return;
  }

  const productosPrevios = [...productosPersonalizados];
  guardarProductoEditado(productoGuardado);

  if (!guardarProductosPersonalizados()) {
    productosPersonalizados = productosPrevios;
    return;
  }

  sincronizarProductos();

  if (productoExistente) {
    actualizarProductoEnCarrito(productoGuardado);
    actualizarInterfaz();
  } else {
    categoriaActiva = 'Todos';
    terminoBusqueda = '';
    kioscoPaginaActual = 1;

    const productSearch = document.getElementById('product-search');

    if (productSearch) {
      productSearch.value = '';
    }
  }

  renderizarProductos();
  cerrarModalProducto();
}

function obtenerProductosFiltrados() {
  const busqueda = terminoBusqueda.trim().toLowerCase();

  return productos.filter((producto) => {
    const coincideSucursal = normalizarSucursal(producto.sucursal) === sucursalActiva;
    const coincideCategoria = categoriaActiva === 'Todos' || producto.categoria === categoriaActiva;
    const disponibleParaVenta = !producto.ventaBloqueada;
    const coincideBusqueda = !busqueda
      || producto.nombre.toLowerCase().includes(busqueda)
      || producto.marca.toLowerCase().includes(busqueda)
      || producto.codigoBarras.toLowerCase().includes(busqueda)
      || producto.categoria.toLowerCase().includes(busqueda)
      || normalizarSucursal(producto.sucursal).toLowerCase().includes(busqueda);

    return coincideSucursal && coincideCategoria && coincideBusqueda && disponibleParaVenta;
  });
}

function actualizarFiltrosCategoria() {
  document.querySelectorAll('[data-category]').forEach((button) => {
    const isActive = button.dataset.category === categoriaActiva;
    button.className = isActive
      ? 'category-filter whitespace-nowrap px-6 py-2 rounded-full bg-primary text-on-primary font-medium text-sm transition-all shadow-[0px_4px_14px_rgba(0,109,55,0.2)]'
      : 'category-filter whitespace-nowrap px-6 py-2 rounded-full bg-surface-container-low text-secondary font-medium text-sm hover:bg-surface-container-high transition-all';
  });
}

function cerrarMenusProducto() {
  document.querySelectorAll('[data-product-menu]').forEach((menu) => {
    menu.classList.add('hidden');
  });

  document.querySelectorAll('[data-product-menu-button]').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });
}

function toggleProductMenu(event, id) {
  event.stopPropagation();

  const menu = document.querySelector(`[data-product-menu="${id}"]`);
  const button = document.querySelector(`[data-product-menu-button="${id}"]`);
  const estabaAbierto = menu ? !menu.classList.contains('hidden') : false;

  cerrarMenusProducto();

  if (menu && !estabaAbierto) {
    menu.classList.remove('hidden');
    button?.setAttribute('aria-expanded', 'true');
  }
}

function renderizarProductos() {
  const grid = document.getElementById('product-grid');

  if (!grid) {
    return;
  }

  const productosFiltrados = obtenerProductosFiltrados();
  
  const startIndex = (kioscoPaginaActual - 1) * KIOSCO_ITEMS_PER_PAGE;
  const endIndex = startIndex + KIOSCO_ITEMS_PER_PAGE;
  const productosPagina = productosFiltrados.slice(startIndex, endIndex);

  grid.innerHTML = productosPagina.length ? productosPagina.map((producto) => {
    const precioFinal = obtenerPrecioFinal(producto);
    const mediaProducto = renderizarImagenProducto(producto, 'w-full h-full');
    const nombreSeguro = escapeHtml(producto.nombre);
    const marcaSegura = escapeHtml(producto.marca);
    const badgeDescuento = producto.descuento > 0
      ? `<span class="absolute top-3 left-3 bg-primary-container text-on-primary-container text-xs font-bold px-2 py-1 rounded-md">-${producto.descuento}%</span>`
      : '';
    const precioAnterior = producto.descuento > 0
      ? `<span class="text-sm text-secondary line-through">${formatCurrency(producto.precio)}</span>`
      : '';
  const botonColor = producto.descuento > 0
    ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
    : 'bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary';
    const claveProducto = obtenerClaveProducto(producto);
    const claveProductoJson = escapeHtml(JSON.stringify(claveProducto));
    const claveProductoHtml = escapeHtml(claveProducto);
    const menuProducto = esEncargadoOSuperior() ? `
        <div class="absolute right-3 top-3 z-30">
          <button type="button" onclick='toggleProductMenu(event, ${claveProductoJson})' class="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest/90 text-secondary shadow-sm ring-1 ring-outline-variant/30 backdrop-blur hover:bg-surface-container hover:text-on-surface active:scale-95" aria-label="Opciones de ${nombreSeguro}" aria-haspopup="menu" aria-expanded="false" data-product-menu-button="${claveProductoHtml}">
            <span class="material-symbols-outlined text-xl">more_vert</span>
          </button>
          <div class="absolute right-0 top-11 hidden w-40 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest shadow-xl" data-product-menu="${claveProductoHtml}" role="menu">
            <button type="button" onclick='abrirModalProducto(${claveProductoJson})' class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-on-surface hover:bg-surface-container" role="menuitem">
              <span class="material-symbols-outlined text-lg">edit</span>
              Editar
            </button>
            <button type="button" onclick='eliminarProducto(${claveProductoJson})' class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-error hover:bg-error-container/60" role="menuitem">
              <span class="material-symbols-outlined text-lg">delete</span>
              Eliminar
            </button>
          </div>
        </div>` : '';
    return `
      <div class="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-4 relative group hover:bg-surface-container-low transition-colors border border-outline-variant/15">
        ${menuProducto}
        <button type="button" onclick='agregarAlCarrito(${claveProductoJson})' class="relative block h-48 w-full overflow-hidden rounded-lg bg-surface-container-highest text-left group" aria-label="Agregar ${nombreSeguro} al carrito">
          ${mediaProducto}
          ${badgeDescuento}
        </button>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-secondary font-medium uppercase tracking-wider">${marcaSegura}</span>
          <h3 class="font-headline font-semibold text-lg leading-tight line-clamp-2">${nombreSeguro}</h3>
          <span class="mt-1 text-xs font-bold text-on-surface-variant">Stock: ${escapeHtml(producto.stock ?? 0)} · ${escapeHtml(normalizarSucursal(producto.sucursal))}</span>
          <div class="flex justify-between items-end mt-2">
            <div class="flex flex-col">
              ${precioAnterior}
              <span class="font-headline text-xl font-black text-on-surface leading-none">${formatCurrency(precioFinal)}</span>
            </div>
            <button type="button" onclick='agregarAlCarrito(${claveProductoJson})' class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold transition-all active:scale-95 ${botonColor}" aria-label="Agregar ${nombreSeguro}">
              <span class="material-symbols-outlined text-[20px]" data-icon="add_shopping_cart">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="col-span-full flex flex-col items-center justify-center py-20 text-center text-secondary">
      <span class="material-symbols-outlined text-5xl opacity-50 mb-4" data-icon="search_off">search_off</span>
      <h3 class="font-headline font-bold text-xl text-on-surface">No hay productos</h3>
      <p class="mt-2 text-sm max-w-sm">No encontramos productos que coincidan con los filtros o en esta sucursal.</p>
      <button type="button" onclick="document.getElementById('toggle-filters').click()" class="mt-6 text-sm font-bold text-primary hover:text-primary-container">Cambiar filtros</button>
    </div>
  `;

  const container = document.getElementById('kiosco-pagination-container');
  const countLabel = document.getElementById('kiosco-count');
  const paginationDiv = document.getElementById('kiosco-pagination');

  if (container) {
    if (productosFiltrados.length <= KIOSCO_ITEMS_PER_PAGE) {
       container.classList.add('hidden');
    } else {
       container.classList.remove('hidden');
       
       const totalPages = Math.ceil(productosFiltrados.length / KIOSCO_ITEMS_PER_PAGE);
       if (countLabel) {
         countLabel.textContent = `Mostrando ${startIndex + 1}-${Math.min(endIndex, productosFiltrados.length)} de ${productosFiltrados.length} productos`;
       }
       
       let paginationHtml = `<button onclick="cambiarPaginaKiosco(${kioscoPaginaActual - 1})" class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-surface-container active:scale-95 disabled:opacity-50" ${kioscoPaginaActual === 1 ? 'disabled' : ''}><span class="material-symbols-outlined text-sm">chevron_left</span></button>`;
       
       for(let i=1; i<=totalPages; i++) {
         if (i === kioscoPaginaActual) {
           paginationHtml += `<button class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-on-primary">${i}</button>`;
         } else {
           paginationHtml += `<button onclick="cambiarPaginaKiosco(${i})" class="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-on-surface hover:bg-surface-container">${i}</button>`;
         }
       }
       
       paginationHtml += `<button onclick="cambiarPaginaKiosco(${kioscoPaginaActual + 1})" class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-surface-container active:scale-95 disabled:opacity-50" ${kioscoPaginaActual === totalPages ? 'disabled' : ''}><span class="material-symbols-outlined text-sm">chevron_right</span></button>`;
       
       if (paginationDiv) paginationDiv.innerHTML = paginationHtml;
    }
  }

  actualizarFiltrosCategoria();
}

window.cambiarPaginaKiosco = function(page) {
  kioscoPaginaActual = page;
  renderizarProductos();
  document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function agregarAlCarrito(clave) {
  const producto = obtenerProductoPorClave(clave);

  if (!producto) {
    return;
  }

  if (producto.stock <= 0) {
    window.alert('Este producto no tiene stock disponible.');
    return;
  }

  const claveProducto = obtenerClaveProducto(producto);
  const itemEnCarrito = carrito.find((item) => obtenerClaveProducto(item) === claveProducto);

  if (itemEnCarrito) {
    itemEnCarrito.cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1,
      precioEfectivo: obtenerPrecioFinal(producto)
    });
  }

  actualizarInterfaz();
}

function mostrarFeedbackBaja(message = '', error = false) {
  const feedback = document.getElementById('product-loss-feedback');

  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.classList.toggle('hidden', !message);
  feedback.classList.toggle('bg-error-container', error);
  feedback.classList.toggle('text-error', error);
  feedback.classList.toggle('bg-primary-container', !error);
  feedback.classList.toggle('text-primary', !error);
}

function obtenerProductosSucursalActiva() {
  return productos
    .filter((producto) => normalizarSucursal(producto.sucursal) === sucursalActiva)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

function poblarModalBajaProductos() {
  const select = document.getElementById('product-loss-product');

  if (!select) {
    return;
  }

  const productosSucursal = obtenerProductosSucursalActiva();

  select.innerHTML = productosSucursal.length
    ? productosSucursal.map((producto) => `
      <option value="${escapeHtml(obtenerClaveProducto(producto))}">
        ${escapeHtml(producto.nombre)} · Stock: ${escapeHtml(producto.stock ?? 0)}
      </option>
    `).join('')
    : '<option value="">Sin productos en la sucursal</option>';
}

function abrirModalBajaProducto() {
  const modal = document.getElementById('product-loss-modal');
  const form = document.getElementById('product-loss-form');
  const quantity = document.getElementById('product-loss-quantity');

  poblarModalBajaProductos();
  form?.reset();
  if (quantity) {
    quantity.value = '1';
  }
  mostrarFeedbackBaja('');
  modal?.classList.remove('hidden');
}

function cerrarModalBajaProducto() {
  document.getElementById('product-loss-modal')?.classList.add('hidden');
  document.getElementById('product-loss-form')?.reset();
  mostrarFeedbackBaja('');
}

function guardarBajaProducto(event) {
  event.preventDefault();
  const clave = document.getElementById('product-loss-product')?.value;
  const motivo = document.getElementById('product-loss-reason')?.value || 'mal-estado';
  const cantidad = Math.floor(Number(document.getElementById('product-loss-quantity')?.value || 0));
  const nota = document.getElementById('product-loss-note')?.value.trim() || '';
  const producto = obtenerProductoPorClave(clave);

  if (!producto) {
    mostrarFeedbackBaja('Selecciona un producto valido.', true);
    return;
  }

  if (!Number.isFinite(cantidad) || cantidad <= 0) {
    mostrarFeedbackBaja('La cantidad debe ser mayor a 0.', true);
    return;
  }

  if ((producto.stock ?? 0) < cantidad) {
    mostrarFeedbackBaja(`Stock insuficiente. Disponible: ${producto.stock ?? 0}.`, true);
    return;
  }

  const stockActualizado = Math.max(0, (producto.stock ?? 0) - cantidad);
  const productoActualizado = normalizarProductoGuardado({
    ...producto,
    stock: stockActualizado,
    descripcion: `${producto.descripcion || ''}${nota ? `\n[Baja ${motivo}] ${nota}` : ''}`.trim()
  });

  if (!productoActualizado) {
    mostrarFeedbackBaja('No se pudo procesar la baja.', true);
    return;
  }

  guardarProductoEditado(productoActualizado);
  if (!guardarProductosPersonalizados()) {
    mostrarFeedbackBaja('No se pudo guardar la baja en este navegador.', true);
    return;
  }

  sincronizarProductos();
  renderizarProductos();
  actualizarInterfaz();
  cerrarModalBajaProducto();
}

function cambiarCantidad(clave, delta) {
  const claveNormalizada = normalizarClaveProducto(clave);
  const item = carrito.find((producto) => obtenerClaveProducto(producto) === claveNormalizada);

  if (!item) {
    return;
  }

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    carrito = carrito.filter((producto) => obtenerClaveProducto(producto) !== claveNormalizada);
  }

  actualizarInterfaz();
}

function actualizarCantidadCarrito(clave, value) {
  const claveNormalizada = normalizarClaveProducto(clave);
  const item = carrito.find((producto) => obtenerClaveProducto(producto) === claveNormalizada);
  const cantidad = Math.floor(Number(value));

  if (!item) {
    return;
  }

  if (!Number.isFinite(cantidad)) {
    actualizarInterfaz();
    return;
  }

  if (cantidad <= 0) {
    carrito = carrito.filter((producto) => obtenerClaveProducto(producto) !== claveNormalizada);
  } else {
    item.cantidad = cantidad;
  }

  actualizarInterfaz();
}

function seleccionarDescuento(id) {
  const descuento = descuentosDisponibles.find((item) => item.id === id);

  if (!descuento) {
    return;
  }

  descuentoActivoId = descuento.id;
  descuentoGlobal = descuento.porcentaje;
  actualizarInterfaz();
}

function renderizarOpcionesDescuento() {
  const discountOptions = document.getElementById('discount-options');

  if (!discountOptions) {
    return;
  }

  discountOptions.innerHTML = descuentosDisponibles.map((descuento) => {
    const isActive = descuento.id === descuentoActivoId;
    const nombreSeguro = escapeHtml(descuento.nombre);
    const activeClass = isActive ? ' discount-option-active' : '';

    return `
      <button type="button" class="discount-option${activeClass} min-h-14 rounded-lg px-3 py-2 text-left active:scale-95" data-discount-id="${escapeHtml(descuento.id)}" aria-pressed="${isActive}">
        <span class="block truncate text-[11px] font-semibold leading-tight">${nombreSeguro}</span>
        <span class="block text-sm font-black">${descuento.porcentaje}%</span>
      </button>
    `;
  }).join('');
}

function actualizarFormularioDescuento(descuento) {
  const discountNameInput = document.getElementById('discount-name-input');
  const discountRateInput = document.getElementById('discount-rate-input');

  if (discountNameInput) {
    discountNameInput.value = descuento.nombre;
  }

  if (discountRateInput) {
    discountRateInput.value = descuento.porcentaje;
  }
}

function actualizarSelectorDescuento() {
  sincronizarDescuentoActivo();
  renderizarOpcionesDescuento();

  const descuentoActivo = obtenerDescuentoActivo();
  const discountActiveName = document.getElementById('discount-active-name');
  const discountSummary = document.getElementById('discount-summary-rate');

  if (discountActiveName) {
    discountActiveName.textContent = descuentoActivo.nombre;
  }

  if (discountSummary) {
    discountSummary.textContent = descuentoActivo.porcentaje > 0 ? `${descuentoActivo.porcentaje}%` : 'Sin descuento';
  }

  actualizarFormularioDescuento(descuentoActivo);
}

function guardarDescuentoActivo() {
  const descuentoActivo = obtenerDescuentoActivo();
  const discountNameInput = document.getElementById('discount-name-input');
  const discountRateInput = document.getElementById('discount-rate-input');
  const nombre = discountNameInput?.value.trim();
  const porcentaje = normalizarDescuento(discountRateInput?.value);

  if (!nombre) {
    discountNameInput?.focus();
    return;
  }

  descuentoActivo.nombre = nombre;
  descuentoActivo.porcentaje = porcentaje;
  descuentoGlobal = porcentaje;
  guardarDescuentosDisponibles();
  actualizarInterfaz();
}

function agregarDescuentoDesdeFormulario() {
  const discountNameInput = document.getElementById('discount-name-input');
  const discountRateInput = document.getElementById('discount-rate-input');
  const nombre = discountNameInput?.value.trim();
  const porcentaje = normalizarDescuento(discountRateInput?.value);

  if (!nombre) {
    discountNameInput?.focus();
    return;
  }

  const nuevoDescuento = {
    id: crearIdDescuento(nombre),
    nombre,
    porcentaje
  };

  descuentosDisponibles.push(nuevoDescuento);
  descuentoActivoId = nuevoDescuento.id;
  descuentoGlobal = nuevoDescuento.porcentaje;
  guardarDescuentosDisponibles();
  actualizarInterfaz();
}

function eliminarDescuentoActivo() {
  if (descuentosDisponibles.length <= 1) {
    descuentosDisponibles = [{ id: 'sin-descuento', nombre: 'Sin descuento', porcentaje: 0 }];
  } else {
    descuentosDisponibles = descuentosDisponibles.filter((descuento) => descuento.id !== descuentoActivoId);
  }

  descuentoActivoId = descuentosDisponibles[0]?.id || 'sin-descuento';
  sincronizarDescuentoActivo();
  guardarDescuentosDisponibles();
  actualizarInterfaz();
}

function mostrarErrorPago(message) {
  const errorBox = document.getElementById('payment-error');

  if (!errorBox) {
    return;
  }

  errorBox.textContent = message;
  errorBox.classList.toggle('hidden', !message);
}

function actualizarResumenPago() {
  const paymentSubtotal = document.getElementById('payment-subtotal');
  const paymentDiscount = document.getElementById('payment-discount');
  const paymentTax = document.getElementById('payment-tax');
  const paymentTotal = document.getElementById('payment-total');

  if (paymentSubtotal) {
    paymentSubtotal.textContent = formatCurrency(totalesActuales.subtotal);
  }

  if (paymentDiscount) {
    paymentDiscount.textContent = totalesActuales.descuentoMonto > 0
      ? `-${formatCurrency(totalesActuales.descuentoMonto)}`
      : formatCurrency(0);
  }

  if (paymentTax) {
    paymentTax.textContent = formatCurrency(totalesActuales.impuestos);
  }

  if (paymentTotal) {
    paymentTotal.textContent = formatCurrency(totalesActuales.total);
  }
}

function actualizarVueltoEfectivo() {
  const cashReceived = document.getElementById('cash-received');
  const cashChange = document.getElementById('cash-change');
  const recibido = Number(cashReceived?.value || 0);
  const vuelto = Number.isFinite(recibido) ? Math.max(recibido - totalesActuales.total, 0) : 0;

  if (cashChange) {
    cashChange.textContent = formatCurrency(vuelto);
  }
}

function actualizarMetodoPagoUI() {
  document.querySelectorAll('[data-payment-method]').forEach((button) => {
    const isActive = button.dataset.paymentMethod === metodoPagoActivo;
    button.classList.toggle('border-primary', isActive);
    button.classList.toggle('bg-primary-container/15', isActive);
    button.classList.toggle('shadow-[0px_12px_32px_rgba(0,109,55,0.14)]', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  const cashFields = document.getElementById('cash-payment-fields');
  const nonCashNote = document.getElementById('non-cash-payment-note');
  const isCash = metodoPagoActivo === 'efectivo';

  cashFields?.classList.toggle('hidden', !isCash);
  nonCashNote?.classList.toggle('hidden', isCash);
  actualizarVueltoEfectivo();
}

function abrirModalPago() {
  const modal = document.getElementById('payment-modal');
  const cashReceived = document.getElementById('cash-received');

  if (totalesActuales.totalItems <= 0) {
    return;
  }

  metodoPagoActivo = 'efectivo';
  mostrarErrorPago('');
  actualizarResumenPago();
  actualizarMetodoPagoUI();

  if (cashReceived) {
    cashReceived.value = '';
  }

  modal?.classList.remove('hidden');
  window.setTimeout(() => cashReceived?.focus(), 0);
}

function cerrarModalPago() {
  document.getElementById('payment-modal')?.classList.add('hidden');
  mostrarErrorPago('');
}

function seleccionarMetodoPago(method) {
  metodoPagoActivo = method;
  mostrarErrorPago('');
  actualizarMetodoPagoUI();

  if (method === 'efectivo') {
    window.setTimeout(() => document.getElementById('cash-received')?.focus(), 0);
  }
}

function obtenerNombreMetodoPago(method) {
  const labels = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    qr: 'QR'
  };

  return labels[method] || 'Pago';
}

function crearRegistroVenta() {
  const descuentoActivo = obtenerDescuentoActivo();
  const recibido = metodoPagoActivo === 'efectivo'
    ? Number(document.getElementById('cash-received')?.value || 0)
    : null;
  const vuelto = metodoPagoActivo === 'efectivo'
    ? Math.max((Number.isFinite(recibido) ? recibido : 0) - totalesActuales.total, 0)
    : null;

  return {
    id: Date.now(),
    fechaISO: new Date().toISOString(),
    sucursal: sucursalActiva,
    metodoPago: metodoPagoActivo,
    metodoPagoNombre: obtenerNombreMetodoPago(metodoPagoActivo),
    recibido,
    vuelto,
    descuento: {
      nombre: descuentoActivo.nombre,
      porcentaje: descuentoActivo.porcentaje,
      monto: totalesActuales.descuentoMonto
    },
    subtotal: totalesActuales.subtotal,
    impuestos: totalesActuales.impuestos,
    total: totalesActuales.total,
    totalItems: totalesActuales.totalItems,
    items: carrito.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      marca: item.marca,
      categoria: item.categoria || 'Producto',
      codigoBarras: item.codigoBarras,
      cantidad: item.cantidad,
      precioUnitario: item.precioEfectivo,
      total: item.precioEfectivo * item.cantidad
    }))
  };
}

function registrarVentaActual() {
  const venta = crearRegistroVenta();

  historialVentas = [venta, ...historialVentas].slice(0, 100);
  guardarHistorialVentas();
  renderizarHistorialVentas();
  return venta;
}

function renderizarHistorialVentas() {
  const list = document.getElementById('sales-history-list');

  if (!list) {
    return;
  }

  if (!historialVentas.length) {
    list.innerHTML = `
      <div class="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/40 px-4 text-center text-secondary">
        <span class="material-symbols-outlined mb-2 text-4xl">history</span>
        <p class="font-semibold text-on-surface">Sin ventas registradas</p>
        <p class="mt-1 text-sm">Cuando confirmes cobros, aparecerán acá con su hora.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = historialVentas.map((venta) => {
    const itemsResumen = (venta.items || [])
      .map((item) => `${escapeHtml(item.cantidad)} x ${escapeHtml(item.nombre)}`)
      .join(', ');

    return `
      <article class="mb-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm font-bold text-on-surface">Venta #${escapeHtml(venta.id)}</p>
            <div class="mt-2 grid gap-1 text-xs font-semibold text-on-surface-variant sm:grid-cols-3">
              <span>Sucursal: <strong class="text-on-surface">${escapeHtml(venta.sucursal || SUCURSAL_DEFAULT)}</strong></span>
              <span>Fecha: <strong class="text-on-surface">${escapeHtml(formatDateOnly(venta.fechaISO))}</strong></span>
              <span>Hora: <strong class="text-on-surface">${escapeHtml(formatTimeOnly(venta.fechaISO))}</strong></span>
            </div>
            <p class="mt-2 text-sm text-secondary">${itemsResumen || 'Sin detalle de productos'}</p>
          </div>
          <div class="text-left sm:text-right">
            <span class="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">${escapeHtml(venta.metodoPagoNombre || obtenerNombreMetodoPago(venta.metodoPago))}</span>
            <p class="mt-3 font-headline text-2xl font-extrabold text-primary">${formatCurrency(Number(venta.total) || 0)}</p>
            <p class="text-xs text-secondary">${escapeHtml(venta.totalItems || 0)} items</p>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function abrirHistorialVentas() {
  renderizarHistorialVentas();
  document.getElementById('sales-history-modal')?.classList.remove('hidden');
}

function cerrarHistorialVentas() {
  document.getElementById('sales-history-modal')?.classList.add('hidden');
}

function calcularResumenCierre(ventas = historialVentas) {
  return ventas.reduce((resumen, venta) => {
    const totalVenta = Number(venta.total) || 0;
    const metodo = venta.metodoPago || 'otro';
    const subtotalVenta = Number(venta.subtotal);
    const descuentoVenta = Number(venta.descuento?.monto) || 0;
    const impuestosVenta = Number(venta.impuestos) || 0;

    resumen.cantidad += 1;
    resumen.total += totalVenta;
    resumen.totalBruto += Number.isFinite(subtotalVenta) ? subtotalVenta : totalVenta;
    resumen.descuentos += descuentoVenta;
    resumen.impuestos += impuestosVenta;
    resumen.porMetodo[metodo] = (resumen.porMetodo[metodo] || 0) + totalVenta;

    if (metodo === 'efectivo') {
      resumen.efectivo += totalVenta;
    } else {
      resumen.noEfectivo += totalVenta;
    }

    return resumen;
  }, {
    cantidad: 0,
    total: 0,
    totalBruto: 0,
    descuentos: 0,
    impuestos: 0,
    efectivo: 0,
    noEfectivo: 0,
    porMetodo: {}
  });
}

function mostrarErrorCierreCaja(message) {
  const errorBox = document.getElementById('cash-close-error');

  if (!errorBox) {
    return;
  }

  errorBox.textContent = message;
  errorBox.classList.toggle('hidden', !message);
}

function actualizarDiferenciaCierreCaja() {
  const resumen = calcularResumenCierre();
  const datosCierre = obtenerDatosCierreCaja();
  const differenceBox = document.getElementById('cash-close-difference');
  const statusBanner = document.getElementById('cash-close-status-banner');
  const statusIcon = document.getElementById('cash-close-status-icon');
  const statusTitle = document.getElementById('cash-close-status-title');
  const statusMessage = document.getElementById('cash-close-status-message');
  const observationsWrap = document.getElementById('cash-close-observations-wrap');
  const confirmButton = document.getElementById('confirm-cash-close');
  const totalEsperado = obtenerTotalEsperadoCierre(resumen, datosCierre);
  const diferencia = datosCierre.efectivoContado - totalEsperado;
  const tieneDiferencia = esDiferenciaCierreSignificativa(diferencia);
  const requiereObservacion = tieneDiferencia && !datosCierre.observaciones;

  if (differenceBox) {
    differenceBox.textContent = formatCurrency(diferencia);
    differenceBox.className = `font-headline text-2xl font-extrabold ${!tieneDiferencia ? 'cash-close-difference-balanced' : diferencia < 0 ? 'cash-close-difference-shortage' : 'cash-close-difference-surplus'}`;
  }

  if (statusBanner && statusIcon && statusTitle && statusMessage) {
    if (!tieneDiferencia) {
      statusBanner.className = 'cash-close-status-balanced mt-4 flex items-start gap-3 rounded-lg border px-3 py-3 transition-colors';
      statusIcon.textContent = 'check_circle';
      statusTitle.textContent = 'Caja cuadrada';
      statusMessage.textContent = 'El efectivo real coincide con el total esperado.';
    } else if (diferencia < 0) {
      statusBanner.className = 'cash-close-status-shortage mt-4 flex items-start gap-3 rounded-lg border px-3 py-3 transition-colors';
      statusIcon.textContent = 'warning';
      statusTitle.textContent = 'Faltante detectado';
      statusMessage.textContent = 'Revisá tickets, cobros manuales y retiros antes de cerrar.';
    } else {
      statusBanner.className = 'cash-close-status-surplus mt-4 flex items-start gap-3 rounded-lg border px-3 py-3 transition-colors';
      statusIcon.textContent = 'priority_high';
      statusTitle.textContent = 'Sobrante detectado';
      statusMessage.textContent = 'Verificá registros manuales o ingresos no cargados.';
    }
  }

  if (observationsWrap) {
    observationsWrap.classList.toggle('hidden', !tieneDiferencia);
  }

  if (confirmButton) {
    confirmButton.disabled = requiereObservacion;
  }
}

function actualizarResumenCierreCaja() {
  const resumen = calcularResumenCierre();
  const datosCierre = obtenerDatosCierreCaja();
  const transferenciaQr = (resumen.porMetodo.transferencia || 0) + (resumen.porMetodo.qr || 0);
  const tarjeta = resumen.porMetodo.tarjeta || 0;
  const otrosMetodos = Math.max(resumen.noEfectivo - transferenciaQr - tarjeta, 0);
  const totalEsperado = obtenerTotalEsperadoCierre(resumen, datosCierre);

  asignarTexto('cash-close-start', formatDateTime(datosCierre.fechaInicioISO));
  asignarTexto('cash-close-end', formatDateTime(datosCierre.fechaFinISO));
  asignarTexto('cash-close-sales-count', `${resumen.cantidad} ${resumen.cantidad === 1 ? 'venta' : 'ventas'}`);
  asignarTexto('cash-close-cash-income', formatCurrency(resumen.efectivo));
  asignarTexto('cash-close-expected', formatCurrency(totalEsperado));
  asignarTexto('cash-close-method-cash', formatCurrency(resumen.efectivo));
  asignarTexto('cash-close-method-transfer', formatCurrency(transferenciaQr));
  asignarTexto('cash-close-method-card', formatCurrency(tarjeta));
  asignarTexto('cash-close-non-cash', formatCurrency(otrosMetodos));
  asignarTexto('cash-close-gross', formatCurrency(resumen.totalBruto));
  asignarTexto('cash-close-discounts', resumen.descuentos > 0 ? `-${formatCurrency(resumen.descuentos)}` : formatCurrency(0));
  asignarTexto('cash-close-tax', formatCurrency(resumen.impuestos));
  asignarTexto('cash-close-total', formatCurrency(resumen.total));
  actualizarDiferenciaCierreCaja();
}

function abrirCierreCaja() {
  const modal = document.getElementById('cash-close-modal');
  const countedInput = document.getElementById('cash-close-counted');

  mostrarErrorCierreCaja('');
  poblarConfiguracionCierreCaja();

  actualizarResumenCierreCaja();
  modal?.classList.remove('hidden');
  window.setTimeout(() => countedInput?.focus(), 0);
}

function cerrarCierreCaja() {
  document.getElementById('cash-close-modal')?.classList.add('hidden');
  cerrarConfirmacionCierreCaja();
  mostrarErrorCierreCaja('');
}

function construirListadoCierreCaja(ventas, resumen, datosCierre) {
  const transferenciaQr = (resumen.porMetodo.transferencia || 0) + (resumen.porMetodo.qr || 0);
  const tarjeta = resumen.porMetodo.tarjeta || 0;
  const otrosMetodos = Math.max(resumen.noEfectivo - transferenciaQr - tarjeta, 0);
  const totalEsperado = obtenerTotalEsperadoCierre(resumen, datosCierre);
  const diferencia = datosCierre.efectivoContado - totalEsperado;
  const observacionesCierre = datosCierre.observaciones
    ? `<h2 style="font-size: 18px; margin: 18px 0 8px;">Observaciones</h2><p style="border: 1px solid #dddddd; padding: 10px; margin: 0 0 18px;">${escapeHtml(datosCierre.observaciones)}</p>`
    : '';
  const ventasOrdenadas = [...ventas].reverse();
  const filasVentas = ventasOrdenadas.length
    ? ventasOrdenadas.map((venta) => `
        <tr>
          <td>${escapeHtml(formatDateOnly(venta.fechaISO))}</td>
          <td>${escapeHtml(formatTimeOnly(venta.fechaISO))}</td>
          <td>${escapeHtml(venta.sucursal || SUCURSAL_DEFAULT)}</td>
          <td>${escapeHtml(venta.metodoPagoNombre || obtenerNombreMetodoPago(venta.metodoPago))}</td>
          <td>${escapeHtml(venta.totalItems || 0)}</td>
          <td>${formatCurrency(Number(venta.subtotal) || Number(venta.total) || 0)}</td>
          <td>${formatCurrency(Number(venta.descuento?.monto) || 0)}</td>
          <td>${formatCurrency(Number(venta.impuestos) || 0)}</td>
          <td>${formatCurrency(Number(venta.total) || 0)}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="9">Sin ventas registradas.</td></tr>';
  const filasMetodos = [
    ['Efectivo', resumen.efectivo],
    ['Transferencia / QR', transferenciaQr],
    ['Tarjeta crédito / débito', tarjeta],
    ['Otros métodos', otrosMetodos]
  ].map(([metodo, total]) => `
    <tr>
      <td>${escapeHtml(metodo)}</td>
      <td>${formatCurrency(Number(total) || 0)}</td>
    </tr>
  `).join('');

  return `
    <section>
      <h1 style="font-size: 28px; margin: 0 0 6px;">Cierre de caja</h1>
      <p style="margin: 0 0 18px;">${escapeHtml(sucursalActiva)} · ${escapeHtml(formatDateOnly(datosCierre.fechaFinISO))} · ${escapeHtml(formatTimeOnly(datosCierre.fechaFinISO))}</p>
      <h2 style="font-size: 18px; margin: 18px 0 8px;">Encabezado de sesión</h2>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px;">
        <div><strong>Usuario</strong><br>${escapeHtml(datosCierre.usuario)}</div>
        <div><strong>ID de caja</strong><br>${escapeHtml(datosCierre.cajaId)}</div>
        <div><strong>Inicio turno</strong><br>${escapeHtml(formatDateTime(datosCierre.fechaInicioISO))}</div>
        <div><strong>Fin turno</strong><br>${escapeHtml(formatDateTime(datosCierre.fechaFinISO))}</div>
      </div>
      <h2 style="font-size: 18px; margin: 18px 0 8px;">Resumen de efectivo</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px;">
        <div><strong>Monto inicial</strong><br>${formatCurrency(datosCierre.montoInicial)}</div>
        <div><strong>Ingresos en efectivo</strong><br>${formatCurrency(resumen.efectivo)}</div>
        <div><strong>Egresos / retiros</strong><br>${formatCurrency(datosCierre.egresos)}</div>
        <div><strong>Total esperado</strong><br>${formatCurrency(totalEsperado)}</div>
        <div><strong>Efectivo real</strong><br>${formatCurrency(datosCierre.efectivoContado)}</div>
        <div><strong>Diferencia efectivo</strong><br>${formatCurrency(diferencia)}</div>
      </div>
      ${observacionesCierre}
      <h2 style="font-size: 18px; margin: 18px 0 8px;">Desglose por método de pago</h2>
      <table class="print-table">
        <thead><tr><th>Método</th><th>Total</th></tr></thead>
        <tbody>${filasMetodos}</tbody>
      </table>
      <h2 style="font-size: 18px; margin: 22px 0 8px;">Métricas de venta</h2>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px;">
        <div><strong>Total bruto</strong><br>${formatCurrency(resumen.totalBruto)}</div>
        <div><strong>Descuentos aplicados</strong><br>${formatCurrency(resumen.descuentos)}</div>
        <div><strong>IVA 16%</strong><br>${formatCurrency(resumen.impuestos)}</div>
        <div><strong>Cantidad de ventas</strong><br>${escapeHtml(resumen.cantidad)}</div>
      </div>
      <h2 style="font-size: 18px; margin: 22px 0 8px;">Listado de ventas</h2>
      <table class="print-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Sucursal</th>
            <th>Método</th>
            <th>Items</th>
            <th>Bruto</th>
            <th>Desc.</th>
            <th>IVA</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${filasVentas}</tbody>
      </table>
    </section>
  `;
}

function prepararCierreCaja() {
  const userInput = document.getElementById('cash-close-user');
  const registerInput = document.getElementById('cash-close-register-id');
  const openingInput = document.getElementById('cash-close-opening');
  const withdrawalsInput = document.getElementById('cash-close-withdrawals');
  const countedInput = document.getElementById('cash-close-counted');
  const observationsInput = document.getElementById('cash-close-observations');
  const usuario = userInput?.value.trim();
  const cajaId = registerInput?.value.trim();
  const montoInicial = Number(openingInput?.value || 0);
  const egresos = Number(withdrawalsInput?.value || 0);
  const efectivoContadoRaw = countedInput?.value.trim() || '';
  const efectivoContado = Number(efectivoContadoRaw);

  if (!usuario || !cajaId) {
    mostrarErrorCierreCaja('Ingresá el usuario y el ID de caja para cerrar el turno.');
    (usuario ? registerInput : userInput)?.focus();
    return null;
  }

  if (!Number.isFinite(montoInicial) || montoInicial < 0 || !Number.isFinite(egresos) || egresos < 0) {
    mostrarErrorCierreCaja('El monto inicial y los egresos deben ser valores válidos.');
    (!Number.isFinite(montoInicial) || montoInicial < 0 ? openingInput : withdrawalsInput)?.focus();
    return null;
  }

  if (!efectivoContadoRaw || !Number.isFinite(efectivoContado) || efectivoContado < 0) {
    mostrarErrorCierreCaja('Ingresá el efectivo real en caja para cerrar el turno.');
    countedInput?.focus();
    return null;
  }

  const ventasParaImprimir = [...historialVentas];
  const resumen = calcularResumenCierre(ventasParaImprimir);
  const datosCierre = obtenerDatosCierreCaja(new Date().toISOString());
  datosCierre.fechaInicioISO = obtenerInicioTurnoParaCierre(ventasParaImprimir);
  datosCierre.efectivoContado = efectivoContado;
  const totalEsperado = obtenerTotalEsperadoCierre(resumen, datosCierre);
  const diferencia = efectivoContado - totalEsperado;

  if (esDiferenciaCierreSignificativa(diferencia) && !datosCierre.observaciones) {
    mostrarErrorCierreCaja('Justificá el sobrante o faltante en observaciones antes de cerrar.');
    observationsInput?.focus();
    actualizarResumenCierreCaja();
    return null;
  }

  return {
    ventasParaImprimir,
    resumen,
    datosCierre,
    diferencia
  };
}

function abrirConfirmacionCierreCaja(detalle) {
  const differenceSummary = document.getElementById('cash-close-confirm-difference');

  asignarTexto('cash-close-confirm-sales', `${detalle.resumen.cantidad}`);
  asignarTexto('cash-close-confirm-total', formatCurrency(detalle.resumen.total));
  asignarTexto('cash-close-confirm-difference', formatCurrency(detalle.diferencia));

  if (differenceSummary) {
    differenceSummary.className = !esDiferenciaCierreSignificativa(detalle.diferencia)
      ? 'cash-close-difference-balanced'
      : detalle.diferencia < 0
        ? 'cash-close-difference-shortage'
        : 'cash-close-difference-surplus';
  }

  document.getElementById('cash-close-confirm-modal')?.classList.remove('hidden');
}

function cerrarConfirmacionCierreCaja() {
  document.getElementById('cash-close-confirm-modal')?.classList.add('hidden');
}

function confirmarCierreCaja() {
  const detalle = prepararCierreCaja();

  if (!detalle) {
    return;
  }

  mostrarErrorCierreCaja('');
  abrirConfirmacionCierreCaja(detalle);
}

function ejecutarCierreCaja() {
  const detalle = prepararCierreCaja();

  if (!detalle) {
    cerrarConfirmacionCierreCaja();
    return;
  }

  const printArea = document.getElementById('cash-close-print-area');

  if (printArea) {
    printArea.innerHTML = construirListadoCierreCaja(detalle.ventasParaImprimir, detalle.resumen, detalle.datosCierre);
  }

  guardarConfiguracionCierreCaja(detalle.datosCierre);
  historialVentas = [];
  guardarHistorialVentas();
  renderizarHistorialVentas();
  reiniciarTurnoInicio();
  cerrarConfirmacionCierreCaja();
  cerrarCierreCaja();
  window.print();
}

function obtenerNumeroFactura(venta) {
  const numero = String(Math.abs(Number(venta?.id) || Date.now())).slice(-8).padStart(8, '0');

  return `N°${DATOS_FACTURA_KIOSCO.puntoVenta}-0000${numero.slice(-4)}`;
}

function obtenerNombreSucursalFactura(sucursal = sucursalActiva) {
  return String(sucursal || SUCURSAL_DEFAULT)
    .replace(/^SquatGym\s*/i, '')
    .replace(/^Sucursal\s*/i, '')
    .trim() || 'Central';
}

function construirFacturaVenta(venta) {
  const porcentajeDescuento = Number(venta?.descuento?.porcentaje) || 0;
  const subtotalNeto = Math.max((Number(venta?.subtotal) || 0) - (Number(venta?.descuento?.monto) || 0), 0);
  const cliente = venta?.cliente || {
    nombre: 'Consumidor Final',
    documento: 'Sin identificar',
    condicionIva: 'Consumidor Final'
  };
  const filasItems = (venta?.items || []).length
    ? venta.items.map((item) => {
      const cantidad = Number(item.cantidad) || 0;
      const precioUnitario = Number(item.precioUnitario) || 0;
      const subtotalLinea = precioUnitario * cantidad * (1 - porcentajeDescuento / 100);

      return `
        <tr>
          <td class="receipt-invoice-center">${escapeHtml(cantidad)}</td>
          <td>${escapeHtml(item.nombre)}</td>
          <td>${escapeHtml(item.categoria || 'Producto')}</td>
          <td class="receipt-invoice-money">${formatCurrency(precioUnitario)}</td>
          <td class="receipt-invoice-center">${escapeHtml(porcentajeDescuento)}%</td>
          <td class="receipt-invoice-money">${formatCurrency(subtotalLinea)}</td>
        </tr>
      `;
    }).join('')
    : '<tr><td colspan="6">Sin productos cargados.</td></tr>';

  return `
    <section class="receipt-invoice">
      <header class="receipt-invoice-header">
        <div>
          <h1>Squat <span>Gym</span></h1>
          <p>${escapeHtml(DATOS_FACTURA_KIOSCO.domicilio)}</p>
          <p>CUIT: ${escapeHtml(DATOS_FACTURA_KIOSCO.cuit)}</p>
          <p>${escapeHtml(DATOS_FACTURA_KIOSCO.condicionFiscal)}</p>
        </div>
        <div class="receipt-invoice-meta">
          <h2>FACTURA</h2>
          <p>${escapeHtml(obtenerNumeroFactura(venta))}</p>
          <p>Fecha: ${escapeHtml(formatInvoiceDate(venta?.fechaISO))}</p>
          <p>Sede: ${escapeHtml(obtenerNombreSucursalFactura(venta?.sucursal))}</p>
        </div>
      </header>
      <div class="receipt-invoice-divider"></div>
      <section class="receipt-invoice-client">
        <div>
          <p><strong>CLIENTE:</strong> ${escapeHtml(cliente.nombre)}</p>
          <p><strong>DNI/CUIL:</strong> ${escapeHtml(cliente.documento)}</p>
        </div>
        <div>
          <p><strong>Cond. IVA:</strong> ${escapeHtml(cliente.condicionIva)}</p>
          <p><strong>Pago:</strong> ${escapeHtml(venta?.metodoPagoNombre || obtenerNombreMetodoPago(venta?.metodoPago))}</p>
        </div>
      </section>
      <table class="receipt-invoice-table">
        <thead>
          <tr>
            <th>CANT.</th>
            <th>DESCRIPCIÓN</th>
            <th>CATEGORÍA</th>
            <th>P.UNIT(S/IVA)</th>
            <th>DESC.</th>
            <th>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${filasItems}
        </tbody>
      </table>
      <section class="receipt-invoice-totals">
        <div>
          <span>SUBTOTAL NETO:</span>
          <strong>${formatCurrency(subtotalNeto)}</strong>
        </div>
        <div>
          <span>IVAS(${Math.round(IVA * 100)}%)</span>
          <strong>${formatCurrency(Number(venta?.impuestos) || 0)}</strong>
        </div>
        <div class="receipt-invoice-total-final">
          <span>TOTAL FINAL:</span>
          <strong>${formatCurrency(Number(venta?.total) || 0)}</strong>
        </div>
      </section>
    </section>
  `;
}

function prepararImpresionTicketVenta(venta = ultimaVentaRegistrada) {
  const printArea = document.getElementById('cash-close-print-area');

  if (!printArea || !venta) {
    return false;
  }

  printArea.innerHTML = construirFacturaVenta(venta);
  return true;
}

function confirmarCobro() {
  if (totalesActuales.totalItems <= 0) {
    mostrarErrorPago('Agregá productos al carrito antes de cobrar.');
    return;
  }

  if (metodoPagoActivo === 'efectivo') {
    const recibido = Number(document.getElementById('cash-received')?.value || 0);

    if (!Number.isFinite(recibido) || recibido < totalesActuales.total) {
      mostrarErrorPago('El monto recibido debe cubrir el total de la venta.');
      return;
    }
  }

  ultimaVentaRegistrada = registrarVentaActual();
  prepararImpresionTicketVenta(ultimaVentaRegistrada);
  carrito = [];
  actualizarInterfaz();
  cerrarModalPago();
  document.getElementById('receipt-modal')?.classList.remove('hidden');
}

function finalizarVenta({ imprimir = false } = {}) {
  if (imprimir) {
    if (prepararImpresionTicketVenta()) {
      window.print();
    }
  }

  document.getElementById('receipt-modal')?.classList.add('hidden');
  actualizarInterfaz();
}

function actualizarInterfaz() {
  const contenedor = document.getElementById('cart-items');

  if (contenedor) {
    contenedor.innerHTML = carrito.length
      ? carrito.map((item) => {
        const nombreSeguro = escapeHtml(item.nombre);
        const claveCarrito = obtenerClaveProducto(item);
        const claveCarritoJson = escapeHtml(JSON.stringify(claveCarrito));
        const mediaCarrito = item.img
          ? `<img src="${escapeHtml(item.img)}" alt="${nombreSeguro}" class="w-full h-full object-cover mix-blend-multiply">`
          : `<span class="material-symbols-outlined text-secondary text-2xl">${escapeHtml(item.icono || 'inventory_2')}</span>`;

        return `
        <div class="group flex min-w-0 items-start gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-3">
          <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-low flex items-center justify-center 2xl:h-20 2xl:w-20">
            ${mediaCarrito}
          </div>
          <div class="flex min-w-0 flex-1 flex-col">
            <h4 class="line-clamp-2 font-semibold text-sm leading-tight text-on-surface">${nombreSeguro}</h4>
            <span class="text-primary font-bold mt-1">${formatCurrency(item.precioEfectivo * item.cantidad)}</span>
            <div class="mt-3 flex flex-wrap items-center gap-2" aria-label="Modificar cantidad de ${nombreSeguro}">
              <button type="button" onclick='cambiarCantidad(${claveCarritoJson}, -1)' class="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-secondary transition-colors hover:bg-secondary hover:text-on-secondary active:scale-95" aria-label="Quitar ${nombreSeguro}">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <input type="number" min="0" step="1" value="${item.cantidad}" onchange='actualizarCantidadCarrito(${claveCarritoJson}, this.value)' onkeydown="if (event.key === 'Enter') this.blur()" class="h-8 w-14 rounded-lg border border-outline-variant bg-surface-container-lowest px-2 text-center text-sm font-bold text-on-surface focus:border-primary focus:ring-primary" aria-label="Cantidad de ${nombreSeguro}">
              <button type="button" onclick='cambiarCantidad(${claveCarritoJson}, 1)' class="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-secondary transition-colors hover:bg-primary hover:text-on-primary active:scale-95" aria-label="Agregar ${nombreSeguro}">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
          <button type="button" onclick='cambiarCantidad(${claveCarritoJson}, -${item.cantidad})' class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-secondary opacity-100 transition-colors hover:bg-error-container hover:text-error xl:opacity-0 xl:group-hover:opacity-100" aria-label="Eliminar ${nombreSeguro}">
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      `;
      }).join('')
      : '<div class="flex h-full min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/40 px-4 text-center text-secondary"><span class="material-symbols-outlined mb-2 text-3xl">shopping_cart</span><p class="text-sm font-semibold">Carrito vacío</p><p class="mt-1 text-xs">Agregue productos para iniciar la venta.</p></div>';
  }

  const subtotal = carrito.reduce((acc, item) => acc + (item.precioEfectivo * item.cantidad), 0);
  const descuentoMonto = subtotal * (descuentoGlobal / 100);
  const baseImponible = subtotal - descuentoMonto;
  const impuestos = baseImponible * IVA;
  const total = baseImponible + impuestos;
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  totalesActuales = {
    subtotal,
    descuentoMonto,
    impuestos,
    total,
    totalItems
  };

  document.getElementById('subtotal-amount').textContent = formatCurrency(subtotal);
  document.getElementById('discount-amount').textContent = descuentoMonto > 0 ? `-${formatCurrency(descuentoMonto)}` : formatCurrency(0);
  document.getElementById('tax-amount').textContent = formatCurrency(impuestos);
  document.getElementById('total-amount').textContent = formatCurrency(total);
  document.getElementById('cart-count').textContent = `${totalItems} Ítems`;
  const openPaymentModal = document.getElementById('open-payment-modal');

  if (openPaymentModal) {
    openPaymentModal.disabled = totalItems <= 0;
  }

  actualizarResumenPago();
  actualizarVueltoEfectivo();
  actualizarSelectorDescuento();
}

function actualizarEstadoFiltrosRapidos(abierto) {
  const filtersContainer = document.getElementById('quick-filters');
  const toggleButton = document.getElementById('toggle-filters');
  const toggleIcon = document.getElementById('toggle-filters-icon');

  filtersContainer?.classList.toggle('hidden', !abierto);
  toggleButton?.setAttribute('aria-expanded', String(abierto));

  if (toggleIcon) {
    toggleIcon.textContent = abierto ? 'expand_less' : 'expand_more';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const branchSelect = document.getElementById('branch-select');
  const productSearch = document.getElementById('product-search');
  const toggleFilters = document.getElementById('toggle-filters');
  const quickFilters = document.getElementById('quick-filters');
  const productModal = document.getElementById('product-modal');
  const openProductModal = document.getElementById('open-product-modal');
  const closeProductModal = document.getElementById('close-product-modal');
  const cancelProductModal = document.getElementById('cancel-product-modal');
  const productForm = document.getElementById('product-form');
  const productImageDropzone = document.getElementById('product-image-dropzone');
  const productImageFile = document.getElementById('new-product-image-file');
  const discountOptions = document.getElementById('discount-options');
  const discountNameInput = document.getElementById('discount-name-input');
  const discountRateInput = document.getElementById('discount-rate-input');
  const saveDiscount = document.getElementById('save-discount');
  const addDiscount = document.getElementById('add-discount');
  const deleteDiscount = document.getElementById('delete-discount');
  const openPaymentModal = document.getElementById('open-payment-modal');
  const paymentModal = document.getElementById('payment-modal');
  const closePaymentModal = document.getElementById('close-payment-modal');
  const cancelPaymentModal = document.getElementById('cancel-payment-modal');
  const confirmPayment = document.getElementById('confirm-payment');
  const cashReceived = document.getElementById('cash-received');
  const skipReceipt = document.getElementById('skip-receipt');
  const printReceipt = document.getElementById('print-receipt');
  const openSalesHistory = document.getElementById('open-sales-history');
  const salesHistoryModal = document.getElementById('sales-history-modal');
  const closeSalesHistory = document.getElementById('close-sales-history');
  const openCashClose = document.getElementById('open-cash-close');
  const cashCloseModal = document.getElementById('cash-close-modal');
  const closeCashClose = document.getElementById('close-cash-close');
  const cancelCashClose = document.getElementById('cancel-cash-close');
  const confirmCashClose = document.getElementById('confirm-cash-close');
  const cashCloseUser = document.getElementById('cash-close-user');
  const cashCloseRegister = document.getElementById('cash-close-register-id');
  const cashCloseOpening = document.getElementById('cash-close-opening');
  const cashCloseWithdrawals = document.getElementById('cash-close-withdrawals');
  const cashCloseCounted = document.getElementById('cash-close-counted');
  const cashCloseObservations = document.getElementById('cash-close-observations');
  const cashCloseConfirmModal = document.getElementById('cash-close-confirm-modal');
  const cancelCashCloseConfirm = document.getElementById('cancel-cash-close-confirm');
  const executeCashClose = document.getElementById('execute-cash-close');
  const openProductLossModal = document.getElementById('open-product-loss-modal');
  const productLossModal = document.getElementById('product-loss-modal');
  const closeProductLossModal = document.getElementById('close-product-loss-modal');
  const cancelProductLossModal = document.getElementById('cancel-product-loss-modal');
  const productLossForm = document.getElementById('product-loss-form');

  historialVentas = cargarHistorialVentas();
  turnoInicioISO = obtenerTurnoInicio();
  descuentosDisponibles = cargarDescuentosGuardados();

  // Fijar sucursal según rol
  const sucursalFija = obtenerSucursalUsuario();

  if (sucursalFija) {
    sucursalActiva = sucursalFija;
    guardarSucursalActiva();
  } else {
    sucursalActiva = cargarSucursalActiva();
  }

  renderizarSucursalActiva();
  sincronizarDescuentoActivo();
  recargarCatalogoDesdeInventario({ forzar: true, renderizar: false });
  renderizarProductos();
  actualizarInterfaz();
  aplicarPermisosKiosco();

  branchSelect?.addEventListener('change', (event) => cambiarSucursalActiva(event.target.value));
  openProductModal?.addEventListener('click', () => abrirModalProducto());
  closeProductModal?.addEventListener('click', cerrarModalProducto);
  cancelProductModal?.addEventListener('click', cerrarModalProducto);
  productForm?.addEventListener('submit', agregarProductoPersonalizado);
  productImageFile?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    procesarArchivoImagenProducto(file);
  });
  productImageDropzone?.addEventListener('dragover', (event) => {
    event.preventDefault();
    productImageDropzone.classList.add('border-primary', 'bg-primary-container/10');
  });
  productImageDropzone?.addEventListener('dragleave', () => {
    productImageDropzone.classList.remove('border-primary', 'bg-primary-container/10');
  });
  productImageDropzone?.addEventListener('drop', (event) => {
    event.preventDefault();
    productImageDropzone.classList.remove('border-primary', 'bg-primary-container/10');
    procesarArchivoImagenProducto(event.dataTransfer?.files?.[0]);
  });
  productModal?.addEventListener('click', (event) => {
    if (event.target === productModal) {
      cerrarModalProducto();
    }
  });
  openProductLossModal?.addEventListener('click', abrirModalBajaProducto);
  closeProductLossModal?.addEventListener('click', cerrarModalBajaProducto);
  cancelProductLossModal?.addEventListener('click', cerrarModalBajaProducto);
  productLossForm?.addEventListener('submit', guardarBajaProducto);
  productLossModal?.addEventListener('click', (event) => {
    if (event.target === productLossModal) {
      cerrarModalBajaProducto();
    }
  });

  openPaymentModal?.addEventListener('click', abrirModalPago);
  closePaymentModal?.addEventListener('click', cerrarModalPago);
  cancelPaymentModal?.addEventListener('click', cerrarModalPago);
  paymentModal?.addEventListener('click', (event) => {
    if (event.target === paymentModal) {
      cerrarModalPago();
    }
  });
  paymentModal?.querySelectorAll('[data-payment-method]').forEach((button) => {
    button.addEventListener('click', () => seleccionarMetodoPago(button.dataset.paymentMethod || 'efectivo'));
  });
  cashReceived?.addEventListener('input', () => {
    mostrarErrorPago('');
    actualizarVueltoEfectivo();
  });
  confirmPayment?.addEventListener('click', confirmarCobro);
  skipReceipt?.addEventListener('click', () => finalizarVenta({ imprimir: false }));
  printReceipt?.addEventListener('click', () => finalizarVenta({ imprimir: true }));
  openSalesHistory?.addEventListener('click', (event) => {
    event.preventDefault();
    abrirHistorialVentas();
  });
  closeSalesHistory?.addEventListener('click', cerrarHistorialVentas);
  salesHistoryModal?.addEventListener('click', (event) => {
    if (event.target === salesHistoryModal) {
      cerrarHistorialVentas();
    }
  });
  openCashClose?.addEventListener('click', abrirCierreCaja);
  closeCashClose?.addEventListener('click', cerrarCierreCaja);
  cancelCashClose?.addEventListener('click', cerrarCierreCaja);
  cashCloseModal?.addEventListener('click', (event) => {
    if (event.target === cashCloseModal) {
      cerrarCierreCaja();
    }
  });
  [cashCloseUser, cashCloseRegister].forEach((input) => {
    input?.addEventListener('input', () => mostrarErrorCierreCaja(''));
  });
  [cashCloseOpening, cashCloseWithdrawals, cashCloseCounted].forEach((input) => {
    input?.addEventListener('input', () => {
      mostrarErrorCierreCaja('');
      actualizarResumenCierreCaja();
    });
  });
  cashCloseCounted?.addEventListener('change', () => {
    mostrarErrorCierreCaja('');
    actualizarDiferenciaCierreCaja();
  });
  cashCloseObservations?.addEventListener('input', () => {
    mostrarErrorCierreCaja('');
    actualizarResumenCierreCaja();
  });
  confirmCashClose?.addEventListener('click', confirmarCierreCaja);
  cancelCashCloseConfirm?.addEventListener('click', cerrarConfirmacionCierreCaja);
  executeCashClose?.addEventListener('click', ejecutarCierreCaja);
  cashCloseConfirmModal?.addEventListener('click', (event) => {
    if (event.target === cashCloseConfirmModal) {
      cerrarConfirmacionCierreCaja();
    }
  });

  toggleFilters?.addEventListener('click', () => {
    const shouldOpen = quickFilters ? quickFilters.classList.contains('hidden') : false;
    actualizarEstadoFiltrosRapidos(shouldOpen);
  });

  productSearch?.addEventListener('input', (event) => {
    terminoBusqueda = event.target.value;
    renderizarProductos();
  });

  document.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      categoriaActiva = button.dataset.category || 'Todos';
      renderizarProductos();
    });
  });

  discountOptions?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-discount-id]') : null;

    if (button) {
      seleccionarDescuento(button.dataset.discountId);
    }
  });

  saveDiscount?.addEventListener('click', guardarDescuentoActivo);
  addDiscount?.addEventListener('click', agregarDescuentoDesdeFormulario);
  deleteDiscount?.addEventListener('click', eliminarDescuentoActivo);

  [discountNameInput, discountRateInput].forEach((input) => {
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        guardarDescuentoActivo();
      }
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element) || (!target.closest('[data-product-menu]') && !target.closest('[data-product-menu-button]'))) {
      cerrarMenusProducto();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const productModalOpen = !document.getElementById('product-modal')?.classList.contains('hidden');
      const discountModalOpen = !document.getElementById('discount-modal')?.classList.contains('hidden');
      const paymentModalOpen = !document.getElementById('payment-modal')?.classList.contains('hidden');

      if (productModalOpen) {
        cerrarModalProducto();
        return;
      }
      cerrarModalProducto();
      cerrarModalPago();
      cerrarModalBajaProducto();
      cerrarHistorialVentas();
      cerrarCierreCaja();
      document.getElementById('receipt-modal')?.classList.add('hidden');
      cerrarMenusProducto();
    }
  });
  window.addEventListener('storage', (event) => {
    if ([PRODUCTOS_STORAGE_KEY, PRODUCTOS_ELIMINADOS_STORAGE_KEY].includes(event.key)) {
      recargarCatalogoDesdeInventario();
    }
  });
  window.addEventListener('focus', () => recargarCatalogoDesdeInventario());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      recargarCatalogoDesdeInventario();
    }
  });
});

window.abrirModalProducto = abrirModalProducto;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCantidadCarrito = actualizarCantidadCarrito;
window.cambiarCantidad = cambiarCantidad;
window.toggleProductMenu = toggleProductMenu;
window.eliminarProducto = eliminarProducto;

function aplicarPermisosKiosco() {
  actualizarHeaderUsuario();

  // Cerrar caja: solo encargado o superior
  aplicarPermisoVisibilidad('open-cash-close', esEncargadoOSuperior());

  // Dar de baja: solo encargado o superior
  aplicarPermisoVisibilidad('open-product-loss-modal', esEncargadoOSuperior());

  // Descuentos: secretaria solo selecciona, no edita
  aplicarPermisoVisibilidad('discount-edit-controls', esEncargadoOSuperior());
}
