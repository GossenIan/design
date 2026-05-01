const INVENTORY_STORAGE_KEY = 'squatgym-inventory-products';
const KIOSCO_PRODUCTS_STORAGE_KEY = 'squatgym-kiosco-products';
const KIOSCO_DELETED_STORAGE_KEY = 'squatgym-kiosco-deleted-products';
const SUCURSALES = ['SquatGym Central', 'Sucursal Sur'];
const CATEGORIAS = ['Suplementos', 'Bebidas', 'Alimentos', 'Indumentaria', 'Preparados'];
const LOW_STOCK_DEFAULT = 5;

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
let estadoInventario = {
  busqueda: '',
  sucursal: 'todas',
  categoria: 'todas',
  estado: 'todos',
  orden: 'sucursal-asc',
  editandoId: null
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
      imgNombre: productoActualizado.imgNombre
    };
  });
}

function normalizarProducto(producto) {
  const id = Number(producto.id) || Date.now();
  const precio = Number(producto.precio);
  const stock = Number(producto.stock);
  const stockMinimo = Number(producto.stockMinimo ?? producto.minStock ?? LOW_STOCK_DEFAULT);
  const categoria = CATEGORIAS.includes(producto.categoria) ? producto.categoria : CATEGORIAS[0];
  const sucursalGuardada = producto.sucursal === 'Sucursal Norte' ? 'Sucursal Sur' : producto.sucursal;
  const sucursal = SUCURSALES.includes(sucursalGuardada) ? sucursalGuardada : SUCURSALES[0];
  const nombre = String(producto.nombre || '').trim();
  const codigoBarras = String(producto.codigoBarras ?? producto.barcode ?? producto.sku ?? '').trim();

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
    stock: Math.floor(stock),
    stockMinimo: Number.isFinite(stockMinimo) && stockMinimo >= 0 ? Math.floor(stockMinimo) : LOW_STOCK_DEFAULT,
    descripcion: String(producto.descripcion || '').trim(),
    img: String(producto.img || '').trim(),
    imgNombre: String(producto.imgNombre || '').trim()
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
        imgNombre: producto.imgNombre
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

function guardarProductos() {
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(productosInventario));
  sincronizarKiosco();
}

function sincronizarKiosco() {
  const productosKiosco = productosInventario
    .map((producto) => ({
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
      descripcion: producto.descripcion
    }));
  const clavesEnKiosco = new Set(productosKiosco.map((producto) => obtenerClaveProducto(producto)));
  const idsBaseOcultos = productosBaseInventario
    .filter((producto) => !clavesEnKiosco.has(obtenerClaveProducto(producto)))
    .map((producto) => producto.id);

  localStorage.setItem(KIOSCO_PRODUCTS_STORAGE_KEY, JSON.stringify(productosKiosco));
  localStorage.setItem(KIOSCO_DELETED_STORAGE_KEY, JSON.stringify(idsBaseOcultos));
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
  const categoryFilter = document.getElementById('category-filter');
  const productBranch = document.getElementById('product-branch');
  const productCategory = document.getElementById('product-category');

  if (branchFilter) {
    branchFilter.innerHTML = '<option value="todas">Todas las sucursales</option>'
      + SUCURSALES.map((sucursal) => `<option value="${escapeHtml(sucursal)}">${escapeHtml(sucursal)}</option>`).join('');
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
}

function renderizarMetricas(productosFiltrados) {
  const totalProductos = productosFiltrados.length;
  const valorInventario = productosFiltrados.reduce((acc, producto) => acc + (producto.precio * producto.stock), 0);
  const stockBajo = productosFiltrados.filter((producto) => obtenerEstadoStock(producto) !== 'ok').length;

  document.getElementById('metric-products').textContent = String(totalProductos);
  document.getElementById('metric-value').textContent = formatCurrency(valorInventario);
  document.getElementById('metric-low-stock').textContent = String(stockBajo);
  document.getElementById('metric-branch').textContent = estadoInventario.sucursal === 'todas' ? 'Todas' : estadoInventario.sucursal.replace('Sucursal ', 'Suc. ');
}

function renderizarInventario() {
  const list = document.getElementById('inventory-list');
  const productos = obtenerProductosFiltrados();

  renderizarMetricas(productos);
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

  list.innerHTML = productos.map((producto) => {
    const clave = obtenerClaveProducto(producto);
    const claveJson = JSON.stringify(clave);
    const estado = obtenerEstadoStock(producto);
    const estadoTexto = estado === 'sin-stock' ? 'Sin stock' : estado === 'bajo' ? 'Stock bajo' : 'Disponible';
    const estadoClase = estado === 'sin-stock'
      ? 'bg-error-container text-error'
      : estado === 'bajo'
        ? 'bg-[#fff6d6] text-[#7a5700]'
        : 'bg-primary-container/20 text-primary';
    const media = producto.img
      ? `<img src="${escapeHtml(producto.img)}" alt="${escapeHtml(producto.nombre)}" class="h-full w-full object-cover">`
      : '<span class="material-symbols-outlined text-secondary">inventory_2</span>';

    return `
      <article class="grid gap-4 px-5 py-5 transition-colors hover:bg-surface-container-low lg:grid-cols-12 lg:items-center">
        <div class="flex items-center gap-4 lg:col-span-3">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-highest">${media}</div>
          <div class="min-w-0">
            <h3 class="truncate font-headline text-base font-extrabold text-on-surface">${escapeHtml(producto.nombre)}</h3>
            <p class="text-xs font-semibold text-secondary">Codigo: ${escapeHtml(producto.codigoBarras)}</p>
            <p class="mt-1 line-clamp-1 text-xs text-on-surface-variant">${escapeHtml(producto.descripcion || 'Sin descripcion')}</p>
          </div>
        </div>
        <div class="lg:col-span-2">
          <p class="text-xs font-bold uppercase tracking-wider text-secondary lg:hidden">Sucursal</p>
          <span class="font-bold text-on-surface">${escapeHtml(producto.sucursal)}</span>
        </div>
        <div class="lg:col-span-2">
          <p class="text-xs font-bold uppercase tracking-wider text-secondary lg:hidden">Categoria</p>
          <span class="rounded-full bg-surface-container-high px-3 py-1 text-xs font-black uppercase text-on-surface-variant">${escapeHtml(producto.categoria)}</span>
        </div>
        <div class="font-headline text-lg font-black text-primary lg:col-span-1">${formatCurrency(producto.precio)}</div>
        <div class="lg:col-span-1">
          <p class="text-xs font-bold uppercase tracking-wider text-secondary lg:hidden">Stock</p>
          <span class="font-black ${estado === 'sin-stock' || estado === 'bajo' ? 'text-error' : 'text-on-surface'}">${escapeHtml(producto.stock)}</span>
        </div>
        <div class="lg:col-span-1">
          <p class="text-xs font-bold uppercase tracking-wider text-secondary lg:hidden">Minimo</p>
          <span class="text-sm font-bold text-on-surface-variant">${escapeHtml(producto.stockMinimo)}</span>
        </div>
        <div class="flex items-center justify-between gap-3 lg:col-span-2 lg:justify-end">
          <span class="rounded-full px-3 py-1 text-xs font-bold ${estadoClase}">${estadoTexto}</span>
          <div class="flex gap-2">
            <button type="button" onclick="abrirModalProducto(${claveJson})" class="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary hover:bg-primary hover:text-on-primary" aria-label="Editar ${escapeHtml(producto.nombre)}">
              <span class="material-symbols-outlined text-lg">edit</span>
            </button>
            <button type="button" onclick="eliminarProducto(${claveJson})" class="flex h-9 w-9 items-center justify-center rounded-lg bg-error-container/60 text-error hover:bg-error hover:text-on-error" aria-label="Eliminar ${escapeHtml(producto.nombre)}">
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
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

function processImageFile(file) {
  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    mostrarErrorProducto('Seleccioná una imagen válida.');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    setImagePreview(String(reader.result || ''), file.name);
    mostrarErrorProducto('');
  });
  reader.readAsDataURL(file);
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
    asignarValor('product-description', producto.descripcion);
    setImagePreview(producto.img, producto.imgNombre);
  } else {
    document.getElementById('product-modal-title').textContent = 'Agregar producto';
    document.getElementById('product-submit-button').textContent = 'Aceptar';
    asignarValor('product-id', '');
    asignarValor('product-branch', SUCURSALES[0]);
    asignarValor('product-category', CATEGORIAS[0]);
    asignarValor('product-min-stock', LOW_STOCK_DEFAULT);
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

function guardarProductoDesdeFormulario(event) {
  event.preventDefault();

  const codigoFormulario = String(document.getElementById('product-barcode')?.value || '').trim();
  const productoEditado = estadoInventario.editandoId ? buscarProductoPorClave(estadoInventario.editandoId) : null;
  const productoMismaIdentidad = productosInventario.find((item) => item.codigoBarras.toLowerCase() === codigoFormulario.toLowerCase());
  const producto = normalizarProducto({
    id: productoEditado?.id || productoMismaIdentidad?.id || Date.now(),
    nombre: document.getElementById('product-name')?.value,
    codigoBarras: codigoFormulario,
    sucursal: document.getElementById('product-branch')?.value,
    categoria: document.getElementById('product-category')?.value,
    precio: document.getElementById('product-price')?.value,
    stock: document.getElementById('product-stock')?.value,
    stockMinimo: document.getElementById('product-min-stock')?.value,
    descripcion: document.getElementById('product-description')?.value,
    img: document.getElementById('product-image')?.value,
    imgNombre: document.getElementById('product-image-name')?.value
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

  const index = productosInventario.findIndex((item) => obtenerClaveProducto(item) === estadoInventario.editandoId);

  if (index >= 0) {
    productosInventario[index] = producto;
  } else {
    productosInventario.push(producto);
  }

  sincronizarDatosCompartidos(producto);
  guardarProductos();
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

  productosInventario = productosInventario.filter((item) => obtenerClaveProducto(item) !== clave);
  guardarProductos();
  renderizarInventario();
}

function limpiarFiltros() {
  estadoInventario = {
    ...estadoInventario,
    busqueda: '',
    sucursal: 'todas',
    categoria: 'todas',
    estado: 'todos',
    orden: 'sucursal-asc'
  };
  document.getElementById('inventory-search').value = '';
  document.getElementById('branch-filter').value = 'todas';
  document.getElementById('category-filter').value = 'todas';
  document.getElementById('status-filter').value = 'todos';
  document.getElementById('sort-select').value = 'sucursal-asc';
  renderizarInventario();
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarOpciones();
  productosInventario = cargarProductos();
  guardarProductos();
  renderizarInventario();

  document.getElementById('open-product-modal')?.addEventListener('click', () => abrirModalProducto());
  document.getElementById('close-product-modal')?.addEventListener('click', cerrarModalProducto);
  document.getElementById('cancel-product-modal')?.addEventListener('click', cerrarModalProducto);
  document.getElementById('product-form')?.addEventListener('submit', guardarProductoDesdeFormulario);
  document.getElementById('product-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('product-modal')) {
      cerrarModalProducto();
    }
  });

  document.getElementById('inventory-search')?.addEventListener('input', (event) => {
    estadoInventario.busqueda = event.target.value;
    renderizarInventario();
  });
  document.getElementById('branch-filter')?.addEventListener('change', (event) => {
    estadoInventario.sucursal = event.target.value;
    renderizarInventario();
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
      cerrarModalProducto();
    }
  });
});

window.abrirModalProducto = abrirModalProducto;
window.eliminarProducto = eliminarProducto;
