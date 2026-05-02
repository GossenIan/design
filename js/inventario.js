const INVENTORY_STORAGE_KEY = 'squatgym-inventory-products';
const KIOSCO_PRODUCTS_STORAGE_KEY = 'squatgym-kiosco-products';
const KIOSCO_DELETED_STORAGE_KEY = 'squatgym-kiosco-deleted-products';
const SUPPLIER_ORDER_STORAGE_KEY = 'squatgym-inventory-supplier-order';
const LAST_RESTOCK_STORAGE_KEY = 'squatgym-inventory-last-restock';
const SUCURSALES = ['SquatGym Central', 'Sucursal Sur'];
const CATEGORIAS = ['Suplementos', 'Bebidas', 'Alimentos', 'Indumentaria', 'Preparados'];
const LOW_STOCK_DEFAULT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const LOT_WARNING_DAYS = 30;
const LOT_HEALTHY_DAYS = 180;
const PEDIDO_REPOSICION_EJEMPLO = {
  codigo: 'PED-GENERAL-001',
  proveedor: 'Proveedor general',
  items: [
    { nombre: 'Gold Standard 100% Whey', codigoBarras: '7790001000010', cantidad: 6 },
    { nombre: 'Original BCAA - Fresa Kiwi', codigoBarras: '7790001000034', cantidad: 4 },
    { nombre: 'Shaker SquatGym Pro 700ml', codigoBarras: '7790002000019', cantidad: 10 }
  ]
};

const productosBaseInventario = [
  {
    id: 1,
    nombre: 'Gold Standard 100% Whey',
    codigoBarras: '7790001000010',
    categoria: 'Suplementos',
    sucursal: 'SquatGym Central',
    precio: 45,
    stock: 18,
    stockMinimo: 6,
    descripcion: 'Proteina premium para recuperacion muscular.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZe1qJ5tvQvqdz1O1tKulwx4oc3dW_d3hln0r67XL6k1ySLv3VWblO_2960LjqrKXFcm3VOVwhgIFdF-hv8CFnubrL6tzTnpmvF3CoFelFLm4OkPyDEheIcECeqW5DqEddHBocLbJ6269w9Tg945mI2bz-ysyZtRkNlxRmjKmx85BkF2o-S-0usyG9qN-2yBxcatAlqzB-z3Td4cdAncXNmlqfKNerhnG9sPsYf2DE-kuKSHU3ZwZ9ktcwD2HFEhybnJhX7lr5fw'
  },
  {
    id: 2,
    nombre: 'Platinum Creatine 400g',
    codigoBarras: '7790001000027',
    categoria: 'Suplementos',
    sucursal: 'Sucursal Sur',
    precio: 22.5,
    stock: 7,
    stockMinimo: 8,
    descripcion: 'Creatina monohidratada para rendimiento.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnmb2_pU2BGAsOrSukg8jBXG2tjLO8bAnDrHWtMH0dL6uAq0yVenf6Uq8X5nhN9wDsu13HzBgqnudTndy7g8ZyASZiTNTQNAgb0pZG7rfk3VchyNJUlO6HJG70UArlfY8UHOqQrtaZLCFKg1DSk639aMEqMMZUGX6EalDxkyptIi0909zr_NUyORwP_2D2jnSOK11xKY_l4sAuT86r4apjWy7QLPoXjj2cXk7ReKA5MjbOo9Vd0tGtBpQe2fVEE_ro1UGnb-KxTw'
  },
  {
    id: 3,
    nombre: 'Original BCAA - Fresa Kiwi',
    codigoBarras: '7790001000034',
    categoria: 'Suplementos',
    sucursal: 'SquatGym Central',
    precio: 30,
    stock: 0,
    stockMinimo: 4,
    descripcion: 'Aminoacidos para recuperacion.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN6ljKm4E3r51_4gQAJU4mMU_1X05Nl903Zakxpuc4ya5qEDb03om371edVpAOBu6sTV3fyj9y9E48sT6GeB4W6wX45PE0b2KYEdFDNRpRHUSv6bPnLU_uqv8xnCWt5_floGKGoVAeCYg1dduoJGwExTsa-CT7wzHOQmzsgMdqRZY5ws_caxhnzyjU6DUtBjbBQkcx32Xoj8iPoRm3N9J1IBNYBzAhUq13xorIUWTqYLhXK3VpDmRD9TUMDqFMqvUJW1R1VZbXuA'
  },
  {
    id: 4,
    nombre: 'C4 Original Pre-Workout',
    codigoBarras: '7790001000041',
    categoria: 'Suplementos',
    sucursal: 'Sucursal Sur',
    precio: 28.99,
    stock: 12,
    stockMinimo: 6,
    descripcion: 'Pre entrenamiento sabor frutal.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr20_qcQM1WvJ-yV6pa0HahbQgE3iX4iGoKiiRTvvwud2twpOe1WFj6YrJGgNhh1zNVmm3ORyWc9R06XP2QqDZZkRptfxkkiMQrL6-fO21f71k7It8PDyQuEdJqk-ErEsVmuvikp-pH2mA3N1lvKNH-o6STWZjVLinlvTj4wcBtxSqSdsrmgboPnQnTG36ciWes5e7cA-11UjOf7rlhM9XQyMmsBFIE4VGSyGmEmEK6OCgkR0IX2Jr_NBpdyuUy3QWE-yHcvbaLg'
  },
  {
    id: 5,
    nombre: 'Shaker SquatGym Pro 700ml',
    codigoBarras: '7790002000019',
    categoria: 'Bebidas',
    sucursal: 'SquatGym Central',
    precio: 12.5,
    stock: 36,
    stockMinimo: 10,
    descripcion: 'Shaker plastico con tapa hermetica.',
    img: ''
  },
  {
    id: 5,
    nombre: 'Shaker SquatGym Pro 700ml',
    codigoBarras: '7790002000019',
    categoria: 'Bebidas',
    sucursal: 'Sucursal Sur',
    precio: 12.5,
    stock: 14,
    stockMinimo: 10,
    descripcion: 'Shaker plastico con tapa hermetica.',
    img: ''
  }
];

let productosInventario = [];
let listaPedidoProveedor = [];
let reposicionPendiente = {};
let controlStockPendiente = {};
let estadoInventario = {
  busqueda: '',
  sucursal: 'todas',
  categoria: 'todas',
  estado: 'todos',
  orden: 'sucursal-asc',
  editandoId: null,
  reposicion: false,
  controlStock: false,
  filaDestacada: null,
  filaOperacionExpandida: null,
  ordenReposicion: '',
  ordenReposicionConfirmada: false
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function esCodigoBarrasNumerico(value) {
  return /^\d+$/.test(String(value || '').trim());
}

function normalizarFechaSolo(value) {
  const fecha = String(value || '').trim();

  if (!fecha) {
    return '';
  }

  const parsed = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return fecha.slice(0, 10);
}

function normalizarLotes(rawLotes = [], stock = 0, vencimientoFallback = '') {
  const lotesFuente = Array.isArray(rawLotes) ? rawLotes : [];
  const lotes = lotesFuente
    .map((lote, index) => {
      const cantidad = Math.max(Math.floor(Number(lote?.cantidad ?? lote?.stock ?? 0)), 0);
      const fechaVencimiento = normalizarFechaSolo(lote?.fechaVencimiento ?? lote?.vencimiento ?? lote?.fecha);

      if (!cantidad && !fechaVencimiento) {
        return null;
      }

      return {
        id: String(lote?.id || `lote-${Date.now()}-${index}`),
        cantidad,
        fechaVencimiento,
        fechaIngreso: normalizarFechaSolo(lote?.fechaIngreso) || normalizarFechaSolo(new Date().toISOString())
      };
    })
    .filter(Boolean);
  const vencimiento = normalizarFechaSolo(vencimientoFallback);

  if (!lotes.length && vencimiento) {
    return [{
      id: `lote-${Date.now()}`,
      cantidad: Math.max(Math.floor(Number(stock) || 0), 0),
      fechaVencimiento: vencimiento,
      fechaIngreso: normalizarFechaSolo(new Date().toISOString())
    }];
  }

  return lotes;
}

function normalizarReposicionActiva(value) {
  if (value === false || value === 'false' || value === 0 || value === '0') {
    return false;
  }

  return true;
}

function obtenerLotesConVencimiento(producto) {
  return (Array.isArray(producto?.lotes) ? producto.lotes : [])
    .map((lote) => ({
      ...lote,
      fechaVencimiento: normalizarFechaSolo(lote.fechaVencimiento)
    }))
    .filter((lote) => lote.fechaVencimiento && Number(lote.cantidad || 0) > 0)
    .sort((a, b) => new Date(`${a.fechaVencimiento}T00:00:00`) - new Date(`${b.fechaVencimiento}T00:00:00`));
}

function obtenerFechaProximoVencimiento(producto) {
  return obtenerLotesConVencimiento(producto)[0]?.fechaVencimiento || '';
}

function obtenerDiasHastaFecha(fecha) {
  if (!fecha) {
    return null;
  }

  const hoy = new Date();
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const objetivo = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(objetivo.getTime())) {
    return null;
  }

  return Math.ceil((objetivo - base) / DAY_MS);
}

function obtenerEstadoLote(producto) {
  const proximoVencimiento = obtenerFechaProximoVencimiento(producto);
  const dias = obtenerDiasHastaFecha(proximoVencimiento);

  if (dias === null) {
    return {
      estado: 'sin-vencimiento',
      texto: 'Sin vencimiento',
      detalle: 'No hay lotes con fecha cargada.',
      clase: 'inventory-lot inventory-lot-none',
      bloqueaVenta: false
    };
  }

  if (dias < 0) {
    return {
      estado: 'vencido',
      texto: 'Vencido',
      detalle: `Vencio el ${proximoVencimiento}`,
      clase: 'inventory-lot inventory-lot-expired',
      bloqueaVenta: true
    };
  }

  if (dias <= LOT_WARNING_DAYS) {
    return {
      estado: 'por-vencer',
      texto: `Vence en ${dias} dias`,
      detalle: `Proximo vencimiento: ${proximoVencimiento}`,
      clase: 'inventory-lot inventory-lot-warning',
      bloqueaVenta: false
    };
  }

  if (dias >= LOT_HEALTHY_DAYS) {
    return {
      estado: 'saludable',
      texto: '+6 meses',
      detalle: `Proximo vencimiento: ${proximoVencimiento}`,
      clase: 'inventory-lot inventory-lot-ok',
      bloqueaVenta: false
    };
  }

  return {
    estado: 'vigente',
    texto: proximoVencimiento,
    detalle: `Proximo vencimiento: ${proximoVencimiento}`,
    clase: 'inventory-lot inventory-lot-valid',
    bloqueaVenta: false
  };
}

function productoBloqueadoPorVencimiento(producto) {
  const lotes = obtenerLotesConVencimiento(producto);
  const lotesConCantidad = (Array.isArray(producto?.lotes) ? producto.lotes : [])
    .filter((lote) => Number(lote.cantidad || 0) > 0);

  if (!lotes.length || Number(producto.stock || 0) <= 0) {
    return false;
  }

  if (lotes.length !== lotesConCantidad.length) {
    return false;
  }

  return lotes.every((lote) => {
    const dias = obtenerDiasHastaFecha(lote.fechaVencimiento);

    return dias !== null && dias < 0;
  });
}

function construirTooltipLotes(producto) {
  const lotes = Array.isArray(producto.lotes) ? producto.lotes : [];

  if (!lotes.length) {
    return 'Sin lotes cargados';
  }

  return lotes
    .map((lote, index) => {
      const fecha = normalizarFechaSolo(lote.fechaVencimiento);
      const dias = obtenerDiasHastaFecha(fecha);
      const estado = !fecha
        ? 'sin vencimiento'
        : dias < 0
          ? 'vencido'
          : dias === 0
            ? 'vence hoy'
            : `vence en ${dias} dias`;

      return `Lote ${index + 1}: ${Number(lote.cantidad || 0)} unidades (${estado})`;
    })
    .join(' | ');
}

function obtenerClaveProducto(producto) {
  return `${Number(producto.id)}__${producto.sucursal}`;
}

function buscarProductoPorClave(clave) {
  return productosInventario.find((producto) => obtenerClaveProducto(producto) === clave) || null;
}

function sincronizarDatosCompartidos(productoActualizado) {
  productosInventario = productosInventario.map((producto) => {
    if (producto.id !== productoActualizado.id) {
      return producto;
    }

    return {
      ...producto,
      nombre: productoActualizado.nombre,
      codigoBarras: productoActualizado.codigoBarras,
      sku: productoActualizado.codigoBarras,
      categoria: productoActualizado.categoria,
      precio: productoActualizado.precio,
      descripcion: productoActualizado.descripcion,
      img: productoActualizado.img,
      imgNombre: productoActualizado.imgNombre,
      reposicionActiva: producto.reposicionActiva
    };
  });
}

function normalizarProducto(producto) {
  const id = Number(producto.id) || Date.now();
  const precio = Number(producto.precio);
  const stock = Number(producto.stock);
  const stockMinimo = Number(producto.stockMinimo ?? producto.minStock ?? LOW_STOCK_DEFAULT);
  const stockEntero = Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : 0;
  const categoria = CATEGORIAS.includes(producto.categoria) ? producto.categoria : CATEGORIAS[0];
  const sucursalGuardada = producto.sucursal === 'Sucursal Norte' ? 'Sucursal Sur' : producto.sucursal;
  const sucursal = SUCURSALES.includes(sucursalGuardada) ? sucursalGuardada : SUCURSALES[0];
  const nombre = String(producto.nombre || '').trim();
  const codigoBarras = String(producto.codigoBarras ?? producto.barcode ?? producto.sku ?? '').trim();
  const lotes = normalizarLotes(
    producto.lotes,
    stockEntero,
    producto.proximoVencimiento ?? producto.vencimiento ?? producto.fechaVencimiento
  );

  if (!nombre || !codigoBarras || !Number.isFinite(precio) || precio <= 0 || !Number.isFinite(stock) || stock < 0) {
    return null;
  }

  return {
    id,
    nombre,
    codigoBarras,
    sku: codigoBarras,
    categoria,
    sucursal,
    precio,
    stock: stockEntero,
    stockMinimo: Number.isFinite(stockMinimo) && stockMinimo >= 0 ? Math.floor(stockMinimo) : LOW_STOCK_DEFAULT,
    descripcion: String(producto.descripcion || '').trim(),
    img: String(producto.img || '').trim(),
    imgNombre: String(producto.imgNombre || '').trim(),
    lotes,
    reposicionActiva: normalizarReposicionActiva(producto.reposicionActiva)
  };
}

function cargarProductosDesdeKiosco() {
  try {
    const guardados = JSON.parse(localStorage.getItem(KIOSCO_PRODUCTS_STORAGE_KEY) || '[]');

    if (!Array.isArray(guardados) || !guardados.length) {
      return [];
    }

    return guardados
      .map((producto) => normalizarProducto({
        id: producto.id,
        nombre: producto.nombre,
        codigoBarras: producto.codigoBarras || producto.barcode || producto.sku || producto.marca || `KIO-${producto.id}`,
        categoria: producto.categoria,
        sucursal: producto.sucursal,
        precio: producto.precio,
        stock: producto.stock ?? producto.cantidad ?? 0,
        stockMinimo: producto.stockMinimo ?? LOW_STOCK_DEFAULT,
        descripcion: producto.descripcion,
        img: producto.img,
        imgNombre: producto.imgNombre,
        lotes: producto.lotes,
        proximoVencimiento: producto.proximoVencimiento,
        reposicionActiva: producto.reposicionActiva
      }))
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

function fusionarProductosIniciales(productosMigrados = []) {
  const productosPorSucursal = new Map(productosBaseInventario.map((producto) => [obtenerClaveProducto(producto), producto]));

  productosMigrados.forEach((producto) => {
    const clave = obtenerClaveProducto(producto);
    const productoBase = productosPorSucursal.get(clave);
    const codigoBarras = productoBase?.codigoBarras && /^SG-/i.test(producto.codigoBarras)
      ? productoBase.codigoBarras
      : producto.codigoBarras;

    productosPorSucursal.set(clave, {
      ...(productoBase || {}),
      ...producto,
      codigoBarras,
      sku: codigoBarras
    });
  });

  return Array.from(productosPorSucursal.values()).map(normalizarProducto).filter(Boolean);
}

function cargarProductos() {
  try {
    const guardados = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY) || '[]');
    const productos = Array.isArray(guardados)
      ? guardados.map(normalizarProducto).filter(Boolean)
      : [];

    if (productos.length) {
      return fusionarProductosIniciales(productos);
    }

    const productosMigrados = cargarProductosDesdeKiosco();

    return productosMigrados.length ? fusionarProductosIniciales(productosMigrados) : productosBaseInventario;
  } catch (error) {
    const productosMigrados = cargarProductosDesdeKiosco();

    return productosMigrados.length ? fusionarProductosIniciales(productosMigrados) : productosBaseInventario;
  }
}

function guardarProductos(mostrarError = false) {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(productosInventario));
    sincronizarKiosco();
    return true;
  } catch (error) {
    if (mostrarError) {
      mostrarErrorProducto('No se pudo guardar el inventario. Si subiste una imagen muy pesada, proba con una mas liviana.');
    }

    return false;
  }
}

function sincronizarKiosco() {
  const productosKiosco = productosInventario
    .map((producto) => {
      const estadoLote = obtenerEstadoLote(producto);

      return {
        id: producto.id,
        nombre: producto.nombre,
        marca: producto.categoria,
        codigoBarras: producto.codigoBarras,
        sku: producto.codigoBarras,
        precio: producto.precio,
        descuento: 0,
        img: producto.img,
        imgNombre: producto.imgNombre,
        icono: 'inventory_2',
        categoria: producto.categoria,
        sucursal: producto.sucursal,
        stock: producto.stock,
        stockMinimo: producto.stockMinimo,
        descripcion: producto.descripcion,
        lotes: producto.lotes,
        proximoVencimiento: obtenerFechaProximoVencimiento(producto),
        estadoLote: estadoLote.estado,
        reposicionActiva: producto.reposicionActiva,
        ventaBloqueada: productoBloqueadoPorVencimiento(producto)
      };
    });
  const clavesEnKiosco = new Set(productosKiosco.map((producto) => obtenerClaveProducto(producto)));
  const clavesBaseOcultas = productosBaseInventario
    .filter((producto) => !clavesEnKiosco.has(obtenerClaveProducto(producto)))
    .map(obtenerClaveProducto);

  localStorage.setItem(KIOSCO_PRODUCTS_STORAGE_KEY, JSON.stringify(productosKiosco));
  localStorage.setItem(KIOSCO_DELETED_STORAGE_KEY, JSON.stringify(clavesBaseOcultas));
}

function obtenerEstadoStock(producto) {
  if (producto.stock <= 0) {
    return 'sin-stock';
  }

  if (producto.stock <= producto.stockMinimo) {
    return 'bajo';
  }

  return 'ok';
}

function obtenerProductosFiltrados() {
  const busqueda = estadoInventario.busqueda.trim().toLowerCase();

  return productosInventario
    .filter((producto) => {
      const coincideBusqueda = !busqueda
        || producto.nombre.toLowerCase().includes(busqueda)
        || producto.codigoBarras.toLowerCase().includes(busqueda)
        || producto.categoria.toLowerCase().includes(busqueda)
        || producto.sucursal.toLowerCase().includes(busqueda);
      const coincideSucursal = estadoInventario.sucursal === 'todas' || producto.sucursal === estadoInventario.sucursal;
      const coincideCategoria = estadoInventario.categoria === 'todas' || producto.categoria === estadoInventario.categoria;
      const coincideEstado = estadoInventario.estado === 'todos' || obtenerEstadoStock(producto) === estadoInventario.estado;

      return coincideBusqueda && coincideSucursal && coincideCategoria && coincideEstado;
    })
    .sort((a, b) => {
      const [campo, direccion] = estadoInventario.orden.split('-');
      const factor = direccion === 'desc' ? -1 : 1;
      const valores = {
        sucursal: [a.sucursal, b.sucursal],
        precio: [a.precio, b.precio],
        stock: [a.stock, b.stock],
        nombre: [a.nombre, b.nombre]
      }[campo] || [a.sucursal, b.sucursal];

      if (typeof valores[0] === 'number') {
        return (valores[0] - valores[1]) * factor;
      }

      return valores[0].localeCompare(valores[1], 'es') * factor;
    });
}

function renderizarOpciones() {
  const branchFilter = document.getElementById('branch-filter');
  const branchTabs = document.getElementById('branch-context-tabs');
  const branchContextSelect = document.getElementById('branch-context-select');
  const categoryFilter = document.getElementById('category-filter');
  const productBranch = document.getElementById('product-branch');
  const productCategory = document.getElementById('product-category');
  const opcionesSucursal = [
    { value: 'todas', label: 'Todas' },
    ...SUCURSALES.map((sucursal) => ({ value: sucursal, label: sucursal.replace('SquatGym ', '') }))
  ];

  if (branchFilter) {
    branchFilter.innerHTML = '<option value="todas">Todas las sucursales</option>'
      + SUCURSALES.map((sucursal) => `<option value="${escapeHtml(sucursal)}">${escapeHtml(sucursal)}</option>`).join('');
  }

  if (branchTabs) {
    branchTabs.innerHTML = opcionesSucursal
      .map((opcion) => `
        <button type="button" class="inventory-branch-tab" data-branch-context="${escapeHtml(opcion.value)}" role="tab">
          ${escapeHtml(opcion.label)}
        </button>
      `)
      .join('');
  }

  if (branchContextSelect) {
    branchContextSelect.innerHTML = opcionesSucursal
      .map((opcion) => `<option value="${escapeHtml(opcion.value)}">${escapeHtml(opcion.value === 'todas' ? 'Todas las sucursales' : opcion.value)}</option>`)
      .join('');
  }

  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="todas">Todas las categorias</option>'
      + CATEGORIAS.map((categoria) => `<option value="${escapeHtml(categoria)}">${escapeHtml(categoria)}</option>`).join('');
  }

  if (productBranch) {
    productBranch.innerHTML = SUCURSALES.map((sucursal) => `<option value="${escapeHtml(sucursal)}">${escapeHtml(sucursal)}</option>`).join('');
  }

  if (productCategory) {
    productCategory.innerHTML = CATEGORIAS.map((categoria) => `<option value="${escapeHtml(categoria)}">${escapeHtml(categoria)}</option>`).join('');
  }

  renderizarSelectorSucursalContexto();
}

function renderizarMetricas(productosFiltrados) {
  const totalProductos = productosFiltrados.length;
  const valorInventario = productosFiltrados.reduce((acc, producto) => acc + (producto.precio * producto.stock), 0);
  const stockBajo = productosFiltrados.filter((producto) => obtenerEstadoStock(producto) !== 'ok').length;

  document.getElementById('metric-products').textContent = String(totalProductos);
  document.getElementById('metric-value').textContent = formatCurrency(valorInventario);
  document.getElementById('metric-low-stock').textContent = String(stockBajo);
  renderizarSelectorSucursalContexto();
}

function renderizarSelectorSucursalContexto() {
  const titulo = document.getElementById('branch-context-title');
  const branchContextSelect = document.getElementById('branch-context-select');

  if (titulo) {
    titulo.textContent = estadoInventario.sucursal === 'todas'
      ? 'Todas las sucursales'
      : estadoInventario.sucursal;
  }

  if (branchContextSelect) {
    branchContextSelect.value = estadoInventario.sucursal;
  }

  document.querySelectorAll('[data-branch-context]').forEach((button) => {
    const activo = button.dataset.branchContext === estadoInventario.sucursal;

    button.classList.toggle('inventory-branch-tab-active', activo);
    button.setAttribute('aria-selected', String(activo));
  });
}

function animarMetricasInventario() {
  document.querySelectorAll('.inventory-metric').forEach((card) => {
    card.classList.remove('inventory-metric-pulse');
    window.requestAnimationFrame(() => {
      card.classList.add('inventory-metric-pulse');
    });
  });
}

function cambiarSucursalInventario(sucursal) {
  const nuevaSucursal = sucursal === 'todas' || SUCURSALES.includes(sucursal) ? sucursal : 'todas';

  if (estadoInventario.sucursal === nuevaSucursal) {
    renderizarSelectorSucursalContexto();
    return;
  }

  estadoInventario.sucursal = nuevaSucursal;
  sincronizarFiltrosEnPantalla();
  animarMetricasInventario();
  renderizarInventario();
}

function formatFechaEmision(value = new Date()) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(value);
}

function obtenerFechaUltimaReposicion() {
  try {
    const saved = localStorage.getItem(LAST_RESTOCK_STORAGE_KEY);

    if (saved && !Number.isNaN(new Date(saved).getTime())) {
      return saved;
    }
  } catch (error) {
    // Sin almacenamiento, se informa como pendiente.
  }

  return '';
}

function registrarFechaUltimaReposicion() {
  const fechaISO = new Date().toISOString();

  try {
    localStorage.setItem(LAST_RESTOCK_STORAGE_KEY, fechaISO);
  } catch (error) {
    return fechaISO;
  }

  return fechaISO;
}

function renderizarFechaUltimaReposicion() {
  const issuedDate = document.getElementById('inventory-issued-date');
  const fecha = obtenerFechaUltimaReposicion();

  if (issuedDate) {
    issuedDate.textContent = fecha ? formatFechaEmision(fecha) : 'Sin reposiciones';
  }
}

function obtenerEstadoInventarioVisual(producto) {
  const estado = obtenerEstadoStock(producto);

  if (estado === 'sin-stock') {
    return {
      texto: 'Sin stock',
      clase: 'inventory-status inventory-status-empty'
    };
  }

  if (estado === 'bajo') {
    return {
      texto: 'Stock bajo',
      clase: 'inventory-status inventory-status-low'
    };
  }

  return {
    texto: 'Disponible',
    clase: 'inventory-status inventory-status-ok'
  };
}

function agruparProductosPorSucursal(productos) {
  const grupos = new Map();

  productos.forEach((producto) => {
    if (!grupos.has(producto.sucursal)) {
      grupos.set(producto.sucursal, []);
    }

    grupos.get(producto.sucursal).push(producto);
  });

  const ordenSucursales = estadoInventario.orden === 'sucursal-desc'
    ? [...SUCURSALES].reverse()
    : [...SUCURSALES];
  const sucursalesVisibles = estadoInventario.sucursal === 'todas'
    ? ordenSucursales.filter((sucursal) => grupos.has(sucursal))
    : [estadoInventario.sucursal].filter((sucursal) => grupos.has(sucursal));
  const sucursalesExtra = [...grupos.keys()].filter((sucursal) => !sucursalesVisibles.includes(sucursal));

  return [...sucursalesVisibles, ...sucursalesExtra].map((sucursal) => ({
    sucursal,
    productos: grupos.get(sucursal) || []
  }));
}

function renderizarResumenSucursal(productosSucursal) {
  const stockBajo = productosSucursal.filter((producto) => obtenerEstadoStock(producto) === 'bajo').length;
  const sinStock = productosSucursal.filter((producto) => obtenerEstadoStock(producto) === 'sin-stock').length;

  return `
    <dl class="inventory-branch-summary">
      <div>
        <dt>Productos con stock bajo</dt>
        <dd>${stockBajo}</dd>
      </div>
      <div>
        <dt>Productos sin stock</dt>
        <dd>${sinStock}</dd>
      </div>
      <div>
        <dt>Total de productos</dt>
        <dd>${productosSucursal.length}</dd>
      </div>
    </dl>
  `;
}

function obtenerResumenMultisucursal(producto) {
  const registros = productosInventario.filter((item) => item.codigoBarras === producto.codigoBarras);

  if (registros.length <= 1) {
    return '';
  }

  return registros
    .sort((a, b) => SUCURSALES.indexOf(a.sucursal) - SUCURSALES.indexOf(b.sucursal))
    .map((item) => `${item.sucursal.replace('SquatGym ', '').replace('Sucursal ', '')}: ${item.stock}`)
    .join(' | ');
}

function renderizarFilaInforme(producto) {
  const clave = obtenerClaveProducto(producto);
  const claveJson = escapeHtml(JSON.stringify(clave));
  const estadoVisual = obtenerEstadoInventarioVisual(producto);
  const estadoLote = obtenerEstadoLote(producto);
  const resumenMultisucursal = obtenerResumenMultisucursal(producto);
  const estaDestacado = estadoInventario.filaDestacada === clave;
  const esStockBajo = obtenerEstadoStock(producto) !== 'ok';
  const botonReordenar = `
    <button type="button" onclick='agregarAListaPedido(${claveJson})' class="inventory-action-button inventory-action-reorder" aria-label="Agregar ${escapeHtml(producto.nombre)} a pedido al proveedor" title="Agregar a pedido">
      <span class="material-symbols-outlined text-base">shopping_cart</span>
    </button>
  `;
  const stockCell = `<span title="${escapeHtml(construirTooltipLotes(producto))}">${escapeHtml(producto.stock)}</span>`;

  return `
    <tr class="inventory-report-row ${esStockBajo ? 'inventory-report-row-low' : ''} ${estaDestacado ? 'inventory-report-row-highlight' : ''}" data-product-row="${escapeHtml(clave)}">
      <td>${escapeHtml(producto.categoria)}</td>
      <td>
        <div class="font-bold text-on-surface">${escapeHtml(producto.nombre)}</div>
        <div class="inventory-code-cell">Codigo: ${escapeHtml(producto.codigoBarras)}</div>
        ${resumenMultisucursal ? `<div class="text-[11px] font-black text-primary">Stock sedes: ${escapeHtml(resumenMultisucursal)}</div>` : ''}
        <div class="text-[11px] font-semibold text-secondary">${escapeHtml(producto.descripcion || 'Sin descripcion')}</div>
      </td>
      <td class="text-right font-black">${stockCell}</td>
      <td class="text-right font-bold">${escapeHtml(producto.stockMinimo)}</td>
      <td title="${escapeHtml(estadoLote.detalle)}">
        <span class="${estadoLote.clase}">${escapeHtml(estadoLote.texto)}</span>
      </td>
      <td>
        <span class="${estadoVisual.clase}">${estadoVisual.texto}</span>
      </td>
      <td>
        <span class="inventory-row-actions">
          ${botonReordenar}
          <button type="button" onclick='abrirModalProducto(${claveJson})' class="inventory-action-button inventory-action-edit" aria-label="Editar ${escapeHtml(producto.nombre)}">
            <span class="material-symbols-outlined text-base">edit</span>
          </button>
          <button type="button" onclick='eliminarProducto(${claveJson})' class="inventory-action-button inventory-action-delete" aria-label="Eliminar ${escapeHtml(producto.nombre)}">
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        </span>
      </td>
    </tr>
  `;
}

function renderizarBloqueSucursal({ sucursal, productos }) {
  return `
    <article class="inventory-branch-report">
      <header class="inventory-branch-header">
        <div>
          <p>Nombre Sucursal</p>
          <h3>${escapeHtml(sucursal)}</h3>
        </div>
        <span>${productos.length} productos</span>
      </header>
      <div class="inventory-table-wrap">
        <table class="inventory-report-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Producto</th>
              <th class="text-right">Stock</th>
              <th class="text-right">Stock Minimo</th>
              <th>Prox. vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map(renderizarFilaInforme).join('')}
          </tbody>
        </table>
      </div>
      ${renderizarResumenSucursal(productos)}
    </article>
  `;
}

function renderizarInventario() {
  const list = document.getElementById('inventory-list');
  const productos = obtenerProductosFiltrados();

  renderizarMetricas(productos);
  renderizarListaPedidoProveedor();
  actualizarPanelReposicion();
  actualizarPanelControlStock();
  renderizarFechaUltimaReposicion();
  document.getElementById('inventory-count').textContent = `Mostrando ${productos.length} de ${productosInventario.length} productos`;

  if (!list) {
    return;
  }

  if (!productos.length) {
    list.innerHTML = `
      <div class="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center text-secondary">
        <span class="material-symbols-outlined text-4xl">inventory_2</span>
        <p class="mt-3 font-bold text-on-surface">No hay productos para mostrar</p>
        <p class="mt-1 text-sm">Probá cambiando filtros o agregá un nuevo producto.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = agruparProductosPorSucursal(productos)
    .map(renderizarBloqueSucursal)
    .join('');
}

function setImagePreview(src = '', fileName = '') {
  const preview = document.getElementById('product-image-preview');
  const empty = document.getElementById('product-image-empty');
  const label = document.getElementById('product-image-label');

  document.getElementById('product-image').value = src;
  document.getElementById('product-image-name').value = fileName;

  if (preview) {
    preview.src = src || '';
    preview.classList.toggle('hidden', !src);
  }

  empty?.classList.toggle('hidden', !!src);

  if (label) {
    label.textContent = fileName ? `img/${fileName}` : '';
    label.classList.toggle('hidden', !fileName);
  }
}

function leerImagenTemporal(file) {
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

async function processImageFile(file) {
  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    mostrarErrorProducto('Seleccioná una imagen válida.');
    return;
  }

  try {
    const label = document.getElementById('product-image-label');

    if (label) {
      label.textContent = 'Subiendo imagen...';
      label.classList.remove('hidden');
    }

    const image = window.SquatGymImageUpload
      ? await window.SquatGymImageUpload.resolve(file)
      : await leerImagenTemporal(file);

    setImagePreview(image.url, image.fileName);
    mostrarErrorProducto('');
  } catch (error) {
    mostrarErrorProducto(error.message || 'No se pudo cargar la imagen.');
  }
}

function mostrarErrorProducto(message) {
  const box = document.getElementById('product-form-error');

  if (!box) {
    return;
  }

  box.textContent = message;
  box.classList.toggle('hidden', !message);
}

function asignarValor(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value;
  }
}

function abrirModalProductoNuevoConCodigo(codigoBarras = '') {
  abrirModalProducto();
  asignarValor('product-barcode', codigoBarras);

  if (estadoInventario.sucursal !== 'todas') {
    asignarValor('product-branch', estadoInventario.sucursal);
  }

  window.setTimeout(() => document.getElementById('product-name')?.focus(), 0);
}

function abrirModalProducto(clave = null) {
  const form = document.getElementById('product-form');
  const modal = document.getElementById('product-modal');
  const producto = clave ? buscarProductoPorClave(clave) : null;

  form?.reset();
  estadoInventario.editandoId = producto ? obtenerClaveProducto(producto) : null;
  mostrarErrorProducto('');

  if (producto) {
    document.getElementById('product-modal-title').textContent = 'Editar producto';
    document.getElementById('product-submit-button').textContent = 'Guardar cambios';
    asignarValor('product-id', producto.id);
    asignarValor('product-name', producto.nombre);
    asignarValor('product-barcode', producto.codigoBarras);
    asignarValor('product-branch', producto.sucursal);
    asignarValor('product-category', producto.categoria);
    asignarValor('product-price', producto.precio);
    asignarValor('product-stock', producto.stock);
    asignarValor('product-min-stock', producto.stockMinimo);
    asignarValor('product-expiration', obtenerFechaProximoVencimiento(producto));
    asignarValor('product-description', producto.descripcion);
    setImagePreview(producto.img, producto.imgNombre);
  } else {
    document.getElementById('product-modal-title').textContent = 'Agregar producto';
    document.getElementById('product-submit-button').textContent = 'Aceptar';
    asignarValor('product-id', '');
    asignarValor('product-branch', SUCURSALES[0]);
    asignarValor('product-category', CATEGORIAS[0]);
    asignarValor('product-min-stock', LOW_STOCK_DEFAULT);
    asignarValor('product-expiration', '');
    setImagePreview('', '');
  }

  modal?.classList.remove('hidden');
  window.setTimeout(() => document.getElementById('product-name')?.focus(), 0);
}

function cerrarModalProducto() {
  document.getElementById('product-modal')?.classList.add('hidden');
  document.getElementById('product-form')?.reset();
  estadoInventario.editandoId = null;
  setImagePreview('', '');
  mostrarErrorProducto('');
}

function obtenerValorFormulario(...ids) {
  const element = ids
    .map((id) => document.getElementById(id))
    .find(Boolean);

  return element?.value ?? '';
}

function sincronizarFiltrosEnPantalla() {
  const valores = {
    'inventory-search': estadoInventario.busqueda,
    'branch-filter': estadoInventario.sucursal,
    'category-filter': estadoInventario.categoria,
    'status-filter': estadoInventario.estado,
    'sort-select': estadoInventario.orden
  };

  Object.entries(valores).forEach(([id, value]) => {
    const element = document.getElementById(id);

    if (element) {
      element.value = value;
    }
  });
}

function restablecerFiltrosInventario(renderizar = true) {
  estadoInventario = {
    ...estadoInventario,
    busqueda: '',
    sucursal: 'todas',
    categoria: 'todas',
    estado: 'todos',
    orden: 'sucursal-asc'
  };
  sincronizarFiltrosEnPantalla();

  if (renderizar) {
    renderizarInventario();
  }
}

function guardarProductoDesdeFormulario(event) {
  event.preventDefault();

  const codigoFormulario = String(obtenerValorFormulario('product-barcode', 'product-sku')).trim();

  if (!esCodigoBarrasNumerico(codigoFormulario)) {
    mostrarErrorProducto('El codigo de barras debe contener solo numeros.');
    document.getElementById('product-barcode')?.focus();
    return;
  }

  const productoEditado = estadoInventario.editandoId ? buscarProductoPorClave(estadoInventario.editandoId) : null;
  const productoMismaIdentidad = productosInventario.find((item) => item.codigoBarras.toLowerCase() === codigoFormulario.toLowerCase());
  const stockFormulario = obtenerValorFormulario('product-stock');
  const producto = normalizarProducto({
    id: productoEditado?.id || productoMismaIdentidad?.id || Date.now(),
    nombre: obtenerValorFormulario('product-name'),
    codigoBarras: codigoFormulario,
    sucursal: obtenerValorFormulario('product-branch'),
    categoria: obtenerValorFormulario('product-category'),
    precio: obtenerValorFormulario('product-price'),
    stock: stockFormulario,
    stockMinimo: obtenerValorFormulario('product-min-stock'),
    descripcion: obtenerValorFormulario('product-description'),
    img: obtenerValorFormulario('product-image'),
    imgNombre: obtenerValorFormulario('product-image-name'),
    lotes: construirLotesFormulario(productoEditado, stockFormulario, obtenerValorFormulario('product-expiration'))
  });

  if (!producto) {
    mostrarErrorProducto('Completá nombre, código de barras, sucursal, categoría, precio y stock.');
    return;
  }

  const productoExistenteMismaSucursal = productosInventario.find((item) => item.codigoBarras.toLowerCase() === producto.codigoBarras.toLowerCase() && item.sucursal === producto.sucursal);
  const codigoDuplicado = productoExistenteMismaSucursal && obtenerClaveProducto(productoExistenteMismaSucursal) !== estadoInventario.editandoId;

  if (codigoDuplicado) {
    mostrarErrorProducto('Ya existe ese producto en esta sucursal. Editá esa fila para cambiar el stock.');
    return;
  }

  const productosPrevios = productosInventario.map((item) => ({ ...item }));
  const index = productosInventario.findIndex((item) => obtenerClaveProducto(item) === estadoInventario.editandoId);
  const esProductoNuevo = index < 0;

  if (index >= 0) {
    productosInventario[index] = producto;
  } else {
    productosInventario.push(producto);
  }

  sincronizarDatosCompartidos(producto);

  if (!guardarProductos(true)) {
    productosInventario = productosPrevios;
    return;
  }

  if (esProductoNuevo) {
    restablecerFiltrosInventario(false);
  }

  cerrarModalProducto();
  renderizarInventario();
}

function eliminarProducto(clave) {
  const producto = buscarProductoPorClave(clave);

  if (!producto) {
    return;
  }

  const confirmar = window.confirm(`¿Eliminar "${producto.nombre}" de ${producto.sucursal}?`);

  if (!confirmar) {
    return;
  }

  const productosPrevios = productosInventario.map((item) => ({ ...item }));
  productosInventario = productosInventario.filter((item) => obtenerClaveProducto(item) !== clave);

  if (!guardarProductos(true)) {
    productosInventario = productosPrevios;
    return;
  }

  renderizarInventario();
}

function limpiarFiltros() {
  restablecerFiltrosInventario();
}

function cargarListaPedidoProveedor() {
  try {
    const guardada = JSON.parse(localStorage.getItem(SUPPLIER_ORDER_STORAGE_KEY) || '[]');

    return Array.isArray(guardada)
      ? guardada
        .filter((item) => item?.clave)
        .map((item) => ({
          clave: String(item.clave),
          cantidadSugerida: Math.max(Math.floor(Number(item.cantidadSugerida ?? item.cantidad ?? 1)), 1),
          fechaISO: item.fechaISO || new Date().toISOString()
        }))
      : [];
  } catch (error) {
    return [];
  }
}

function guardarListaPedidoProveedor() {
  try {
    localStorage.setItem(SUPPLIER_ORDER_STORAGE_KEY, JSON.stringify(listaPedidoProveedor));
    return true;
  } catch (error) {
    return false;
  }
}

function obtenerProductosParaPedidoProveedor() {
  return productosInventario
    .sort((a, b) => {
      const sucursalCompare = a.sucursal.localeCompare(b.sucursal, 'es');

      return sucursalCompare || a.nombre.localeCompare(b.nombre, 'es');
    });
}

function renderizarSelectorProductosProveedor() {
  const select = document.getElementById('supplier-product-select');

  if (!select) {
    return;
  }

  const productos = obtenerProductosParaPedidoProveedor();

  if (!productos.length) {
    select.innerHTML = '<option value="">Sin productos activos para reposicion</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = productos
    .map((producto) => {
      const clave = obtenerClaveProducto(producto);
      const label = `${producto.sucursal} - ${producto.nombre} (${producto.codigoBarras})`;

      return `<option value="${escapeHtml(clave)}">${escapeHtml(label)}</option>`;
    })
    .join('');
}

function renderizarListaPedidoProveedor() {
  const title = document.getElementById('supplier-order-title');
  const list = document.getElementById('supplier-order-list');
  const confirmButton = document.getElementById('confirm-supplier-order');
  const pedidosValidos = listaPedidoProveedor
    .map((item) => ({
      ...item,
      producto: buscarProductoPorClave(item.clave)
    }))
    .filter((item) => item.producto);

  renderizarSelectorProductosProveedor();

  if (title) {
    title.textContent = `${pedidosValidos.length} ${pedidosValidos.length === 1 ? 'producto' : 'productos'} por reordenar`;
  }

  if (confirmButton) {
    confirmButton.disabled = !pedidosValidos.length;
  }

  if (list) {
    list.innerHTML = pedidosValidos.length
      ? pedidosValidos
        .map(({ producto, cantidadSugerida }) => {
          const clave = obtenerClaveProducto(producto);
          const claveJson = escapeHtml(JSON.stringify(clave));

          return `
        <article class="supplier-order-row rounded-lg border border-outline-variant/15 bg-surface-container-low p-3">
          <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_8rem_auto] md:items-center">
            <div>
              <p class="text-sm font-black text-on-surface">${escapeHtml(producto.nombre)}</p>
              <p class="mt-1 text-xs font-semibold text-secondary">${escapeHtml(producto.sucursal)} - Codigo ${escapeHtml(producto.codigoBarras)}</p>
            </div>
            <label class="flex flex-col gap-1 text-xs font-black uppercase tracking-wider text-secondary">
              Cantidad
              <input class="supplier-order-quantity rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-black text-on-surface focus:border-primary focus:ring-primary" type="number" min="1" step="1" value="${escapeHtml(cantidadSugerida || Math.max(producto.stockMinimo - producto.stock, 1))}" onchange='actualizarCantidadPedidoProveedor(${claveJson}, this.value)' aria-label="Cantidad de ${escapeHtml(producto.nombre)}">
            </label>
            <button type="button" onclick='eliminarItemPedidoProveedor(${claveJson})' class="inventory-action-button inventory-action-delete justify-self-start md:justify-self-end" aria-label="Eliminar ${escapeHtml(producto.nombre)} del pedido">
              <span class="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </article>
      `;
        })
        .join('')
      : `
        <div class="rounded-lg border border-dashed border-outline-variant/40 bg-surface-container-low px-4 py-6 text-center text-secondary">
          <span class="material-symbols-outlined text-3xl">inventory_2</span>
          <p class="mt-2 text-sm font-bold text-on-surface">Lista vacia</p>
          <p class="mt-1 text-xs">Agrega productos manualmente o usa el carrito de reorden en la tabla.</p>
        </div>
      `;
  }
}

function agregarAListaPedido(clave) {
  const producto = buscarProductoPorClave(clave);

  if (!producto) {
    return;
  }

  const existente = listaPedidoProveedor.find((item) => item.clave === clave);
  const cantidadSugerida = Math.max(producto.stockMinimo - producto.stock, 1);

  if (existente) {
    existente.cantidadSugerida = Math.max(existente.cantidadSugerida || 0, cantidadSugerida);
  } else {
    listaPedidoProveedor.push({
      clave,
      cantidadSugerida,
      fechaISO: new Date().toISOString()
    });
  }

  guardarListaPedidoProveedor();
  renderizarListaPedidoProveedor();
}

function agregarProductoSeleccionadoAListaPedido() {
  const select = document.getElementById('supplier-product-select');
  const quantityInput = document.getElementById('supplier-quantity-input');
  const clave = select?.value || '';
  const cantidad = Math.max(Math.floor(Number(quantityInput?.value || 1)), 1);

  if (!clave) {
    renderizarToastPedido('Selecciona un producto para agregar al pedido.', true);
    return;
  }

  const existente = listaPedidoProveedor.find((item) => item.clave === clave);

  if (existente) {
    existente.cantidadSugerida = Math.max(Math.floor(Number(existente.cantidadSugerida || 0)), 0) + cantidad;
  } else {
    listaPedidoProveedor.push({
      clave,
      cantidadSugerida: cantidad,
      fechaISO: new Date().toISOString()
    });
  }

  if (quantityInput) {
    quantityInput.value = '1';
  }

  guardarListaPedidoProveedor();
  renderizarListaPedidoProveedor();
}

function actualizarCantidadPedidoProveedor(clave, value) {
  const cantidad = Math.max(Math.floor(Number(value) || 1), 1);
  const item = listaPedidoProveedor.find((pedido) => pedido.clave === clave);

  if (!item) {
    return;
  }

  item.cantidadSugerida = cantidad;
  guardarListaPedidoProveedor();
}

function eliminarItemPedidoProveedor(clave) {
  listaPedidoProveedor = listaPedidoProveedor.filter((item) => item.clave !== clave);
  guardarListaPedidoProveedor();
  renderizarListaPedidoProveedor();
}

function limpiarListaPedidoProveedor() {
  listaPedidoProveedor = [];
  guardarListaPedidoProveedor();
  renderizarListaPedidoProveedor();
  renderizarToastPedido('');
}

function renderizarToastPedido(message, error = false) {
  const toast = document.getElementById('supplier-order-toast');

  if (!toast) {
    return;
  }

  if (!message) {
    toast.classList.add('hidden');
    return;
  }

  toast.classList.remove('hidden');
  toast.classList.toggle('text-error', error);
  toast.classList.toggle('text-primary', !error);
  const text = toast.querySelector('p');
  const icon = toast.querySelector('.material-symbols-outlined');

  if (text) {
    text.textContent = message;
  }

  if (icon) {
    icon.textContent = error ? 'error' : 'check';
  }
}

function confirmarPedidoProveedor() {
  const pedidosValidos = listaPedidoProveedor
    .map((item) => ({ ...item, producto: buscarProductoPorClave(item.clave) }))
    .filter((item) => item.producto);

  if (!pedidosValidos.length) {
    renderizarToastPedido('Agrega productos antes de confirmar el pedido.', true);
    return;
  }

  listaPedidoProveedor = [];
  guardarListaPedidoProveedor();
  renderizarListaPedidoProveedor();
  renderizarToastPedido('El pedido de reposicion fue enviado al encargado.');
}

function obtenerProductosParaOperacionStock() {
  return obtenerProductosFiltrados();
}

function renderizarEstadoVacioOperacion(message) {
  return `
    <div class="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant/40 bg-surface-container-low px-6 py-10 text-center text-secondary">
      <span class="material-symbols-outlined text-4xl">inventory_2</span>
      <p class="mt-3 font-bold text-on-surface">${escapeHtml(message)}</p>
      <p class="mt-1 text-sm">Cambia los filtros o escanea otro codigo para continuar.</p>
    </div>
  `;
}

function renderizarImagenProductoOperacion(producto) {
  if (producto.img) {
    return `
      <img src="${escapeHtml(producto.img)}" alt="${escapeHtml(producto.nombre)}" class="inventory-operation-image" loading="lazy">
    `;
  }

  return `
    <span class="material-symbols-outlined text-3xl text-secondary">inventory_2</span>
  `;
}

function renderizarItemsPedidoReposicionEjemplo() {
  return PEDIDO_REPOSICION_EJEMPLO.items
    .map((item) => `
      <li class="flex items-center justify-between gap-3 rounded-md bg-white/80 px-3 py-2 text-xs font-bold">
        <span class="min-w-0">
          <span class="block truncate text-on-surface">${escapeHtml(item.nombre)}</span>
          <span class="block text-[11px] text-secondary">Codigo ${escapeHtml(item.codigoBarras)}</span>
        </span>
        <span class="rounded-full bg-[#4f46e5] px-2.5 py-1 text-white">${escapeHtml(item.cantidad)}</span>
      </li>
    `)
    .join('');
}

function renderizarOrdenReposicion(options = {}) {
  const input = document.getElementById('restock-order-input');
  const checkbox = document.getElementById('restock-order-confirm');
  const summary = document.getElementById('restock-order-summary');
  const status = document.getElementById('restock-order-status');
  const saveButton = document.getElementById('save-restock-changes');
  const ordenCargada = Boolean(estadoInventario.ordenReposicion);

  if (input && !options.preservarInput) {
    input.value = estadoInventario.ordenReposicion;
  }

  if (checkbox) {
    checkbox.disabled = !ordenCargada;
    checkbox.checked = ordenCargada && estadoInventario.ordenReposicionConfirmada;
  }

  if (saveButton) {
    saveButton.disabled = !estadoInventario.ordenReposicionConfirmada;
  }

  if (status) {
    status.textContent = ordenCargada
      ? estadoInventario.ordenReposicionConfirmada
        ? `Orden ${estadoInventario.ordenReposicion} confirmada. Ya puedes guardar la carga.`
        : 'Revisa el pedido solicitado y confirma que coincide con lo recibido.'
      : 'Carga una orden para habilitar la confirmacion.';
    status.classList.toggle('text-primary', ordenCargada && estadoInventario.ordenReposicionConfirmada);
    status.classList.toggle('text-secondary', !ordenCargada || !estadoInventario.ordenReposicionConfirmada);
  }

  if (summary) {
    const codigoVisible = estadoInventario.ordenReposicion || PEDIDO_REPOSICION_EJEMPLO.codigo;

    summary.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[11px] font-black uppercase tracking-wider">Pedido solicitado</p>
          <h3 class="mt-1 font-headline text-lg font-black">${escapeHtml(codigoVisible)}</h3>
          <p class="mt-1 text-xs font-semibold">Ejemplo general - ${escapeHtml(PEDIDO_REPOSICION_EJEMPLO.proveedor)}</p>
        </div>
        <span class="rounded-full bg-white px-3 py-1 text-xs font-black ${estadoInventario.ordenReposicionConfirmada ? 'text-primary' : 'text-[#4f46e5]'}">
          ${estadoInventario.ordenReposicionConfirmada ? 'Confirmado' : 'Pendiente'}
        </span>
      </div>
      <ul class="mt-3 grid gap-2">
        ${renderizarItemsPedidoReposicionEjemplo()}
      </ul>
    `;
  }
}

function cargarOrdenReposicion(codigo = '') {
  const input = document.getElementById('restock-order-input');
  const codigoOrden = String(codigo || input?.value || '').trim();

  if (!codigoOrden) {
    estadoInventario.ordenReposicion = '';
    estadoInventario.ordenReposicionConfirmada = false;
    renderizarOrdenReposicion({ preservarInput: true });
    mostrarFeedbackReposicion('Ingresa una orden de pedido antes de cargar stock.', true);
    return;
  }

  estadoInventario.ordenReposicion = codigoOrden;
  estadoInventario.ordenReposicionConfirmada = false;
  renderizarOrdenReposicion();
  mostrarFeedbackReposicion(`Orden ${codigoOrden} cargada. Confirma que coincide con el pedido solicitado.`);
}

function usarPedidoReposicionEjemplo() {
  cargarOrdenReposicion(PEDIDO_REPOSICION_EJEMPLO.codigo);
}

function confirmarOrdenReposicion(confirmada) {
  if (!estadoInventario.ordenReposicion) {
    estadoInventario.ordenReposicionConfirmada = false;
    renderizarOrdenReposicion();
    mostrarFeedbackReposicion('Primero carga una orden de pedido.', true);
    return;
  }

  estadoInventario.ordenReposicionConfirmada = Boolean(confirmada);
  renderizarOrdenReposicion();
}

function manejarCambioInputOrdenReposicion(event) {
  const value = String(event.target.value || '').trim();

  if (value !== estadoInventario.ordenReposicion) {
    estadoInventario.ordenReposicion = '';
    estadoInventario.ordenReposicionConfirmada = false;
    renderizarOrdenReposicion({ preservarInput: true });
  }
}

function renderizarListaReposicionModal() {
  const list = document.getElementById('restock-products-list');
  const count = document.getElementById('restock-products-count');

  if (!list) {
    return;
  }

  const productos = obtenerProductosParaOperacionStock();

  if (count) {
    count.textContent = `${productos.length} ${productos.length === 1 ? 'producto visible' : 'productos visibles'}`;
  }

  if (!productos.length) {
    list.innerHTML = renderizarEstadoVacioOperacion('No hay productos para reponer');
    return;
  }

  list.innerHTML = productos
    .map((producto) => {
      const clave = obtenerClaveProducto(producto);
      const claveJson = escapeHtml(JSON.stringify(clave));
      const reposicion = reposicionPendiente[clave] || {};
      const estaDestacado = estadoInventario.filaDestacada === clave;
      const estaExpandido = estadoInventario.filaOperacionExpandida === clave;

      return `
        <article class="inventory-operation-row ${estaDestacado ? 'inventory-report-row-highlight' : ''} ${estaExpandido ? 'inventory-operation-row-expanded' : ''}" data-operation-row="${escapeHtml(clave)}" onclick='alternarExpansionOperacion(${claveJson}, event)'>
          <div class="inventory-operation-product">
            <div class="inventory-operation-media">
              ${renderizarImagenProductoOperacion(producto)}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-black text-on-surface">${escapeHtml(producto.nombre)}</p>
              <p class="mt-1 text-xs font-semibold text-secondary">${escapeHtml(producto.sucursal)} - Codigo ${escapeHtml(producto.codigoBarras)}</p>
              <p class="mt-2 text-xs font-black text-[#4f46e5]">Stock actual: ${escapeHtml(producto.stock)}</p>
            </div>
          </div>
          <label class="flex flex-col gap-1 text-xs font-black uppercase tracking-wider text-secondary">
            Cantidad llegada
            <input data-restock-qty="${escapeHtml(clave)}" class="inventory-restock-input" type="number" min="0" step="1" value="${escapeHtml(reposicion.cantidad || '')}" placeholder="+0" oninput='actualizarReposicion(${claveJson}, this.value, null)' onkeydown="if (event.key === 'Enter') enfocarSiguienteReposicion('${escapeHtml(clave)}')">
          </label>
          <label class="flex flex-col gap-1 text-xs font-black uppercase tracking-wider text-secondary">
            Vencimiento
            <input data-restock-expiration="${escapeHtml(clave)}" class="inventory-restock-date" type="date" value="${escapeHtml(reposicion.vencimiento || '')}" oninput='actualizarReposicion(${claveJson}, null, this.value)'>
          </label>
        </article>
      `;
    })
    .join('');
}

function renderizarListaControlStockModal() {
  const list = document.getElementById('stock-control-products-list');
  const count = document.getElementById('stock-control-products-count');

  if (!list) {
    return;
  }

  const productos = obtenerProductosParaOperacionStock();

  if (count) {
    count.textContent = `${productos.length} ${productos.length === 1 ? 'producto visible' : 'productos visibles'}`;
  }

  if (!productos.length) {
    list.innerHTML = renderizarEstadoVacioOperacion('No hay productos para controlar');
    return;
  }

  list.innerHTML = productos
    .map((producto) => {
      const clave = obtenerClaveProducto(producto);
      const claveJson = escapeHtml(JSON.stringify(clave));
      const conteo = controlStockPendiente[clave];
      const diferencia = conteo === undefined || conteo === '' ? null : Number(conteo) - producto.stock;
      const estaDestacado = estadoInventario.filaDestacada === clave;
      const estaExpandido = estadoInventario.filaOperacionExpandida === clave;

      return `
        <article class="inventory-operation-row ${estaDestacado ? 'inventory-report-row-highlight' : ''} ${estaExpandido ? 'inventory-operation-row-expanded' : ''}" data-operation-row="${escapeHtml(clave)}" onclick='alternarExpansionOperacion(${claveJson}, event)'>
          <div class="inventory-operation-product">
            <div class="inventory-operation-media">
              ${renderizarImagenProductoOperacion(producto)}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-black text-on-surface">${escapeHtml(producto.nombre)}</p>
              <p class="mt-1 text-xs font-semibold text-secondary">${escapeHtml(producto.sucursal)} - Codigo ${escapeHtml(producto.codigoBarras)}</p>
              <p class="mt-2 text-xs font-black text-primary">Sistema: ${escapeHtml(producto.stock)}</p>
            </div>
          </div>
          <label class="flex flex-col gap-1 text-xs font-black uppercase tracking-wider text-secondary">
            Stock contado
            <input data-stock-count="${escapeHtml(clave)}" class="inventory-restock-input" type="number" min="0" step="1" value="${escapeHtml(conteo ?? '')}" placeholder="Contado" oninput='actualizarConteoStock(${claveJson}, this.value)' onkeydown="if (event.key === 'Enter') enfocarSiguienteControlStock('${escapeHtml(clave)}')">
          </label>
          <div class="flex flex-col gap-1 text-xs font-black uppercase tracking-wider text-secondary">
            Diferencia
            <span data-stock-diff="${escapeHtml(clave)}" class="rounded-lg bg-surface-container px-3 py-2 text-sm font-black normal-case ${diferencia === null || diferencia === 0 ? 'text-primary' : 'text-error'}">
              ${diferencia === null ? 'Sin contar' : `Dif. ${diferencia}`}
            </span>
          </div>
        </article>
      `;
    })
    .join('');
}

function actualizarPanelReposicion() {
  const panel = document.getElementById('restock-panel');
  const toggle = document.getElementById('toggle-restock-mode');

  panel?.classList.toggle('hidden', !estadoInventario.reposicion);
  renderizarOrdenReposicion();
  renderizarListaReposicionModal();

  if (toggle) {
    toggle.setAttribute('aria-expanded', String(estadoInventario.reposicion));
    toggle.innerHTML = '<span class="material-symbols-outlined">add_shopping_cart</span>Reponer stock';
  }
}

function actualizarPanelControlStock() {
  const panel = document.getElementById('stock-control-panel');
  const toggle = document.getElementById('toggle-stock-control-mode');

  panel?.classList.toggle('hidden', !estadoInventario.controlStock);
  renderizarListaControlStockModal();

  if (toggle) {
    toggle.setAttribute('aria-expanded', String(estadoInventario.controlStock));
    toggle.innerHTML = '<span class="material-symbols-outlined">fact_check</span>Control de stock';
  }
}

function alternarExpansionOperacion(clave, event = null) {
  if (event?.target?.closest('input, select, textarea, button, label')) {
    return;
  }

  estadoInventario.filaOperacionExpandida = estadoInventario.filaOperacionExpandida === clave ? null : clave;

  if (estadoInventario.controlStock) {
    renderizarListaControlStockModal();
  } else {
    renderizarListaReposicionModal();
  }
}

function mostrarFeedbackReposicion(message, error = false) {
  const feedback = document.getElementById('restock-feedback');

  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.classList.toggle('hidden', !message);
  feedback.classList.toggle('text-error', error);
}

function mostrarFeedbackControlStock(message, error = false) {
  const feedback = document.getElementById('stock-control-feedback');

  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.classList.toggle('hidden', !message);
  feedback.classList.toggle('text-error', error);
}

function mostrarFeedbackEscaneo(message, error = false) {
  if (estadoInventario.controlStock) {
    mostrarFeedbackControlStock(message, error);
  } else {
    mostrarFeedbackReposicion(message, error);
  }
}

function alternarModoReposicion(force = null) {
  estadoInventario.reposicion = force === null ? !estadoInventario.reposicion : Boolean(force);
  estadoInventario.filaDestacada = null;
  estadoInventario.filaOperacionExpandida = null;

  if (estadoInventario.reposicion) {
    estadoInventario.controlStock = false;
    controlStockPendiente = {};
    mostrarFeedbackControlStock('');
  }

  if (!estadoInventario.reposicion) {
    reposicionPendiente = {};
    estadoInventario.ordenReposicion = '';
    estadoInventario.ordenReposicionConfirmada = false;
    mostrarFeedbackReposicion('');
  }

  actualizarPanelReposicion();
  renderizarInventario();

  if (estadoInventario.reposicion) {
    window.setTimeout(() => document.getElementById('restock-scan-input')?.focus(), 0);
  }
}

function alternarModoControlStock(force = null) {
  estadoInventario.controlStock = force === null ? !estadoInventario.controlStock : Boolean(force);
  estadoInventario.filaDestacada = null;
  estadoInventario.filaOperacionExpandida = null;

  if (estadoInventario.controlStock) {
    estadoInventario.reposicion = false;
    reposicionPendiente = {};
    mostrarFeedbackReposicion('');
  }

  if (!estadoInventario.controlStock) {
    controlStockPendiente = {};
    mostrarFeedbackControlStock('');
  }

  actualizarPanelReposicion();
  actualizarPanelControlStock();
  renderizarInventario();

  if (estadoInventario.controlStock) {
    window.setTimeout(() => document.getElementById('stock-control-scan-input')?.focus(), 0);
  }
}

function actualizarReposicion(clave, cantidad, vencimiento) {
  const actual = reposicionPendiente[clave] || {};
  const nuevaCantidad = cantidad === null ? actual.cantidad : Math.max(Math.floor(Number(cantidad) || 0), 0);
  const nuevoVencimiento = vencimiento === null ? actual.vencimiento : normalizarFechaSolo(vencimiento);

  if (!nuevaCantidad && !nuevoVencimiento) {
    delete reposicionPendiente[clave];
    return;
  }

  reposicionPendiente[clave] = {
    cantidad: nuevaCantidad || '',
    vencimiento: nuevoVencimiento || ''
  };
}

function enfocarSiguienteReposicion(claveActual) {
  const inputs = [...document.querySelectorAll('[data-restock-qty]')];
  const index = inputs.findIndex((input) => input.dataset.restockQty === claveActual);
  const siguiente = inputs[index + 1] || document.getElementById('save-restock-changes');

  siguiente?.focus();
}

function actualizarConteoStock(clave, value) {
  const valueText = String(value ?? '').trim();
  const producto = buscarProductoPorClave(clave);
  const diffElement = document.querySelector(`[data-stock-diff="${CSS.escape(clave)}"]`);

  if (!valueText) {
    delete controlStockPendiente[clave];

    if (diffElement) {
      diffElement.textContent = 'Sin contar';
      diffElement.classList.remove('text-error');
      diffElement.classList.add('text-primary');
    }

    return;
  }

  const cantidad = Math.max(Math.floor(Number(valueText) || 0), 0);
  controlStockPendiente[clave] = cantidad;

  if (diffElement && producto) {
    const diferencia = cantidad - producto.stock;
    diffElement.textContent = `Dif. ${diferencia}`;
    diffElement.classList.toggle('text-primary', diferencia === 0);
    diffElement.classList.toggle('text-error', diferencia !== 0);
  }
}

function enfocarSiguienteControlStock(claveActual) {
  const inputs = [...document.querySelectorAll('[data-stock-count]')];
  const index = inputs.findIndex((input) => input.dataset.stockCount === claveActual);
  const siguiente = inputs[index + 1] || document.getElementById('save-stock-control');

  siguiente?.focus();
}

function crearProductoEnSucursalDesdePlantilla(plantilla, sucursal) {
  const producto = normalizarProducto({
    ...plantilla,
    sucursal,
    stock: 0,
    lotes: [],
    reposicionActiva: true
  });

  if (!producto) {
    return null;
  }

  productosInventario.push(producto);
  sincronizarDatosCompartidos(producto);

  if (!guardarProductos(true)) {
    productosInventario = productosInventario.filter((item) => obtenerClaveProducto(item) !== obtenerClaveProducto(producto));
    return null;
  }

  return producto;
}

function enfocarProductoPorCodigo(codigo) {
  const codigoLimpio = String(codigo || '').trim();

  if (!codigoLimpio) {
    return;
  }

  const productosVisibles = obtenerProductosFiltrados();
  let producto = productosVisibles.find((item) => item.codigoBarras === codigoLimpio);
  const productosMismoCodigo = productosInventario.filter((item) => item.codigoBarras === codigoLimpio);

  if (!producto) {
    producto = productosInventario.find((item) => item.codigoBarras === codigoLimpio && (estadoInventario.sucursal === 'todas' || item.sucursal === estadoInventario.sucursal))
      || productosInventario.find((item) => item.codigoBarras === codigoLimpio);
  }

  if (productosMismoCodigo.length && estadoInventario.sucursal !== 'todas') {
    const existeEnSucursal = productosMismoCodigo.find((item) => item.sucursal === estadoInventario.sucursal);

    if (!existeEnSucursal) {
      const plantilla = productosMismoCodigo[0];
      const confirmarSucursal = window.confirm(`El producto existe en otra sucursal. ¿Agregar "${plantilla.nombre}" a ${estadoInventario.sucursal}?`);

      if (!confirmarSucursal) {
        mostrarFeedbackEscaneo('Operacion cancelada.');
        return;
      }

      producto = crearProductoEnSucursalDesdePlantilla(plantilla, estadoInventario.sucursal);

      if (!producto) {
        mostrarFeedbackEscaneo('No se pudo crear el producto en esta sucursal.', true);
        return;
      }
    }
  }

  if (!producto) {
    const confirmarAlta = window.confirm('No existe un producto con ese codigo. ¿Quieres agregarlo ahora?');

    if (confirmarAlta) {
      abrirModalProductoNuevoConCodigo(codigoLimpio);
      mostrarFeedbackEscaneo('Completa el alta del producto para cargarlo al inventario.');
    } else {
      mostrarFeedbackEscaneo('No se encontro un producto con ese codigo.', true);
    }

    return;
  }

  estadoInventario.busqueda = codigoLimpio;
  estadoInventario.categoria = 'todas';
  estadoInventario.estado = 'todos';
  estadoInventario.filaDestacada = obtenerClaveProducto(producto);
  estadoInventario.filaOperacionExpandida = estadoInventario.filaDestacada;
  sincronizarFiltrosEnPantalla();
  mostrarFeedbackEscaneo(`Producto seleccionado: ${producto.nombre}`);
  renderizarInventario();

  window.setTimeout(() => {
    const selector = estadoInventario.controlStock
      ? `[data-stock-count="${CSS.escape(estadoInventario.filaDestacada)}"]`
      : `[data-restock-qty="${CSS.escape(estadoInventario.filaDestacada)}"]`;

    document.querySelector(selector)?.focus();
  }, 0);
}

function guardarControlStock() {
  const entradas = Object.entries(controlStockPendiente)
    .map(([clave, cantidad]) => ({
      clave,
      cantidad: Math.max(Math.floor(Number(cantidad) || 0), 0)
    }));

  if (!entradas.length) {
    mostrarFeedbackControlStock('No hay conteos para guardar.', true);
    return;
  }

  const productosPrevios = productosInventario.map((producto) => ({ ...producto, lotes: [...(producto.lotes || [])] }));
  let ajustes = 0;

  entradas.forEach((entrada) => {
    const producto = buscarProductoPorClave(entrada.clave);

    if (!producto) {
      return;
    }

    if (producto.stock !== entrada.cantidad) {
      ajustes += 1;
    }

    producto.stock = entrada.cantidad;
  });

  if (!guardarProductos(true)) {
    productosInventario = productosPrevios;
    return;
  }

  controlStockPendiente = {};
  estadoInventario.filaDestacada = null;
  mostrarFeedbackControlStock(`Control guardado: ${ajustes} ${ajustes === 1 ? 'ajuste aplicado' : 'ajustes aplicados'}.`);
  renderizarInventario();
}

function guardarReposicion() {
  if (!estadoInventario.ordenReposicion || !estadoInventario.ordenReposicionConfirmada) {
    mostrarFeedbackReposicion('Confirma que la orden recibida coincide con el pedido solicitado antes de guardar.', true);
    renderizarOrdenReposicion();
    return;
  }

  const entradas = Object.entries(reposicionPendiente)
    .map(([clave, data]) => ({
      clave,
      cantidad: Math.max(Math.floor(Number(data.cantidad) || 0), 0),
      vencimiento: normalizarFechaSolo(data.vencimiento)
    }))
    .filter((entrada) => entrada.cantidad > 0);

  if (!entradas.length) {
    mostrarFeedbackReposicion('No hay cantidades para guardar.', true);
    return;
  }

  const productosPrevios = productosInventario.map((producto) => ({ ...producto, lotes: [...(producto.lotes || [])] }));

  entradas.forEach((entrada) => {
    const producto = buscarProductoPorClave(entrada.clave);

    if (!producto) {
      return;
    }

    producto.stock += entrada.cantidad;

    if (entrada.vencimiento) {
      producto.lotes = [
        ...(producto.lotes || []),
        {
          id: `lote-${Date.now()}-${entrada.clave}`,
          cantidad: entrada.cantidad,
          fechaVencimiento: entrada.vencimiento,
          fechaIngreso: normalizarFechaSolo(new Date().toISOString())
        }
      ];
    }
  });

  if (!guardarProductos(true)) {
    productosInventario = productosPrevios;
    return;
  }

  const totalUnidades = entradas.reduce((acc, entrada) => acc + entrada.cantidad, 0);
  const ordenConfirmada = estadoInventario.ordenReposicion;

  registrarFechaUltimaReposicion();
  reposicionPendiente = {};
  estadoInventario.ordenReposicion = '';
  estadoInventario.ordenReposicionConfirmada = false;
  estadoInventario.filaDestacada = null;
  mostrarFeedbackReposicion(`Stock actualizado: ${totalUnidades} unidades cargadas desde la orden ${ordenConfirmada}.`);
  renderizarInventario();
}

function filtrarCodigoBarrasNumerico(event) {
  const input = event.target;
  const soloNumeros = input.value.replace(/\D+/g, '');

  if (input.value !== soloNumeros) {
    input.value = soloNumeros;
  }
}

function construirLotesFormulario(productoEditado, stock, vencimiento) {
  const fechaVencimiento = normalizarFechaSolo(vencimiento);

  if (!fechaVencimiento) {
    return [];
  }

  const loteExistente = Array.isArray(productoEditado?.lotes) ? productoEditado.lotes[0] : null;

  return [{
    id: String(loteExistente?.id || `lote-${Date.now()}`),
    cantidad: Math.max(Math.floor(Number(stock) || 0), 0),
    fechaVencimiento,
    fechaIngreso: normalizarFechaSolo(loteExistente?.fechaIngreso) || normalizarFechaSolo(new Date().toISOString())
  }];
}

function imprimirInformeInventario() {
  document.body.classList.add('inventory-print-mode');
  window.print();
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarOpciones();
  productosInventario = cargarProductos();
  listaPedidoProveedor = cargarListaPedidoProveedor();
  guardarProductos();
  renderizarInventario();

  document.getElementById('open-product-modal')?.addEventListener('click', () => abrirModalProducto());
  document.getElementById('toggle-restock-mode')?.addEventListener('click', () => alternarModoReposicion());
  document.getElementById('toggle-stock-control-mode')?.addEventListener('click', () => alternarModoControlStock());
  document.getElementById('cancel-restock-mode')?.addEventListener('click', () => alternarModoReposicion(false));
  document.getElementById('cancel-stock-control-mode')?.addEventListener('click', () => alternarModoControlStock(false));
  document.getElementById('close-restock-modal')?.addEventListener('click', () => alternarModoReposicion(false));
  document.getElementById('close-stock-control-modal')?.addEventListener('click', () => alternarModoControlStock(false));
  document.getElementById('save-restock-changes')?.addEventListener('click', guardarReposicion);
  document.getElementById('save-stock-control')?.addEventListener('click', guardarControlStock);
  document.getElementById('load-restock-order')?.addEventListener('click', () => cargarOrdenReposicion());
  document.getElementById('use-sample-restock-order')?.addEventListener('click', usarPedidoReposicionEjemplo);
  document.getElementById('restock-order-confirm')?.addEventListener('change', (event) => confirmarOrdenReposicion(event.target.checked));
  document.getElementById('restock-order-input')?.addEventListener('input', manejarCambioInputOrdenReposicion);
  document.getElementById('restock-order-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      cargarOrdenReposicion();
    }
  });
  document.getElementById('add-supplier-order-item')?.addEventListener('click', agregarProductoSeleccionadoAListaPedido);
  document.getElementById('confirm-supplier-order')?.addEventListener('click', confirmarPedidoProveedor);
  document.getElementById('clear-supplier-order')?.addEventListener('click', limpiarListaPedidoProveedor);
  document.getElementById('restock-scan-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      enfocarProductoPorCodigo(event.target.value);
      event.target.select();
    }
  });
  document.getElementById('stock-control-scan-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      enfocarProductoPorCodigo(event.target.value);
      event.target.select();
    }
  });
  document.getElementById('branch-context-select')?.addEventListener('change', (event) => {
    cambiarSucursalInventario(event.target.value);
  });
  document.querySelectorAll('[data-branch-context]').forEach((button) => {
    button.addEventListener('click', () => cambiarSucursalInventario(button.dataset.branchContext || 'todas'));
  });
  document.getElementById('close-product-modal')?.addEventListener('click', cerrarModalProducto);
  document.getElementById('cancel-product-modal')?.addEventListener('click', cerrarModalProducto);
  document.getElementById('product-form')?.addEventListener('submit', guardarProductoDesdeFormulario);
  document.getElementById('product-barcode')?.addEventListener('input', filtrarCodigoBarrasNumerico);
  document.getElementById('product-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('product-modal')) {
      cerrarModalProducto();
    }
  });
  document.getElementById('restock-panel')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('restock-panel')) {
      alternarModoReposicion(false);
    }
  });
  document.getElementById('stock-control-panel')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('stock-control-panel')) {
      alternarModoControlStock(false);
    }
  });

  document.getElementById('inventory-search')?.addEventListener('input', (event) => {
    estadoInventario.busqueda = event.target.value;
    renderizarInventario();
  });
  document.getElementById('branch-filter')?.addEventListener('change', (event) => {
    cambiarSucursalInventario(event.target.value);
  });
  document.getElementById('category-filter')?.addEventListener('change', (event) => {
    estadoInventario.categoria = event.target.value;
    renderizarInventario();
  });
  document.getElementById('status-filter')?.addEventListener('change', (event) => {
    estadoInventario.estado = event.target.value;
    renderizarInventario();
  });
  document.getElementById('sort-select')?.addEventListener('change', (event) => {
    estadoInventario.orden = event.target.value;
    renderizarInventario();
  });
  document.getElementById('clear-filters')?.addEventListener('click', limpiarFiltros);
  document.getElementById('print-inventory-report')?.addEventListener('click', imprimirInformeInventario);
  document.querySelectorAll('[data-sort-shortcut]').forEach((button) => {
    button.addEventListener('click', () => {
      estadoInventario.orden = button.dataset.sortShortcut;
      document.getElementById('sort-select').value = estadoInventario.orden;
      renderizarInventario();
    });
  });

  const dropzone = document.getElementById('product-image-dropzone');
  const fileInput = document.getElementById('product-image-file');

  fileInput?.addEventListener('change', (event) => processImageFile(event.target.files?.[0]));
  dropzone?.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('border-primary', 'bg-primary-container/10');
  });
  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-primary', 'bg-primary-container/10');
  });
  dropzone?.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('border-primary', 'bg-primary-container/10');
    processImageFile(event.dataTransfer?.files?.[0]);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const productModalOpen = !document.getElementById('product-modal')?.classList.contains('hidden');

      if (productModalOpen) {
        cerrarModalProducto();
        return;
      }

      alternarModoReposicion(false);
      alternarModoControlStock(false);
    }
  });
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('inventory-print-mode');
  });
});

window.abrirModalProducto = abrirModalProducto;
window.eliminarProducto = eliminarProducto;
window.actualizarReposicion = actualizarReposicion;
window.enfocarSiguienteReposicion = enfocarSiguienteReposicion;
window.agregarAListaPedido = agregarAListaPedido;
window.actualizarConteoStock = actualizarConteoStock;
window.enfocarSiguienteControlStock = enfocarSiguienteControlStock;
window.alternarExpansionOperacion = alternarExpansionOperacion;
window.actualizarCantidadPedidoProveedor = actualizarCantidadPedidoProveedor;
window.eliminarItemPedidoProveedor = eliminarItemPedidoProveedor;
