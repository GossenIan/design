(() => {
  const TRACK_PREFIX = 'squatgym-';
  const SNAPSHOT_VERSION_KEY = 'squatgym-data-snapshot-version';
  const SNAPSHOT_APPLIED_KEY = 'squatgym-data-snapshot-applied-at';
  const CONTROL_KEYS = new Set([SNAPSHOT_VERSION_KEY, SNAPSHOT_APPLIED_KEY]);
  let applyingSnapshot = false;
  let silentPersistDisabled = false;
  let persistTimer = 0;

  function canUseLocalStorage() {
    try {
      const testKey = '__squatgym_storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function shouldTrackKey(key) {
    return typeof key === 'string' && key.startsWith(TRACK_PREFIX) && !CONTROL_KEYS.has(key);
  }

  function readTrackedData() {
    const data = {};

    if (!canUseLocalStorage()) {
      return data;
    }

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (shouldTrackKey(key)) {
        data[key] = localStorage.getItem(key) || '';
      }
    }

    return data;
  }

  function hasBusinessData(data) {
    return Object.keys(data).some((key) => key !== 'squatgym-theme');
  }

  function sanitizeSnapshotData(snapshot) {
    const rawData = snapshot && typeof snapshot === 'object' ? snapshot.data : null;
    const data = {};

    if (!rawData || typeof rawData !== 'object') {
      return data;
    }

    Object.entries(rawData).forEach(([key, value]) => {
      if (shouldTrackKey(key)) {
        data[key] = String(value ?? '');
      }
    });

    return data;
  }

  function buildSnapshot() {
    return {
      version: String(Date.now()),
      createdAt: new Date().toISOString(),
      origin: window.location.origin,
      data: readTrackedData()
    };
  }

  function applySnapshot(snapshot, options = {}) {
    const data = sanitizeSnapshotData(snapshot);
    const keys = Object.keys(data);

    if (!keys.length || !canUseLocalStorage()) {
      return false;
    }

    applyingSnapshot = true;

    try {
      keys.forEach((key) => {
        localStorage.setItem(key, data[key]);
      });
      localStorage.setItem(SNAPSHOT_VERSION_KEY, String(snapshot.version || snapshot.createdAt || 'manual'));
      localStorage.setItem(SNAPSHOT_APPLIED_KEY, new Date().toISOString());
    } finally {
      applyingSnapshot = false;
    }

    window.dispatchEvent(new CustomEvent('squatgym:data-imported', { detail: { keys } }));

    if (options.reload) {
      window.setTimeout(() => window.location.reload(), 250);
    }

    return true;
  }

  function applyEmbeddedBackup() {
    const backup = window.SquatGymDataBackup;

    if (!backup || !backup.data || !Object.keys(backup.data).length) {
      return false;
    }

    const existingData = readTrackedData();

    if (hasBusinessData(existingData)) {
      return false;
    }

    return applySnapshot(backup, { reload: false });
  }

  function downloadSnapshot(snapshot = buildSnapshot()) {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = 'squatgym-datos-' + date + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function persistData(options = {}) {
    const silent = Boolean(options.silent);
    const snapshot = buildSnapshot();

    if (!Object.keys(snapshot.data).length) {
      if (!silent) {
        window.alert('No hay datos de SquatGym para guardar todavia.');
      }
      return false;
    }

    if (silent && silentPersistDisabled) {
      return false;
    }

    try {
      const response = await fetch('/api/persist-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const payload = await response.json().catch(() => ({}));
      localStorage.setItem(SNAPSHOT_VERSION_KEY, payload.version || snapshot.version);
      localStorage.setItem(SNAPSHOT_APPLIED_KEY, new Date().toISOString());

      if (!silent) {
        window.alert('Datos guardados en js/squatgym-data-backup.js. El exe va a usar esta copia.');
      }

      return true;
    } catch (error) {
      if (silent) {
        silentPersistDisabled = true;
        return false;
      }

      downloadSnapshot(snapshot);
      window.alert('Live Server no puede escribir archivos del proyecto. Se descargo un backup JSON; abrilo luego desde Importar datos en SquatGym.exe.');
      return false;
    }
  }

  function readFileText(file) {
    if (file && typeof file.text === 'function') {
      return file.text();
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('No se pudo leer el archivo.'));
      reader.readAsText(file);
    });
  }

  async function importFile(file) {
    if (!file) {
      return false;
    }

    try {
      const text = await readFileText(file);
      const snapshot = JSON.parse(text);
      const imported = applySnapshot(snapshot, { reload: false });

      if (!imported) {
        throw new Error('El archivo no tiene datos validos de SquatGym.');
      }

      await persistData({ silent: true });
      window.alert('Datos importados. La pagina se va a recargar para mostrarlos.');
      window.location.reload();
      return true;
    } catch (error) {
      window.alert('No se pudo importar el backup: ' + (error && error.message ? error.message : error));
      return false;
    }
  }

  function scheduleSilentPersist(key) {
    if (applyingSnapshot || silentPersistDisabled || !shouldTrackKey(String(key || ''))) {
      return;
    }

    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(() => {
      persistData({ silent: true });
    }, 1400);
  }

  function installStorageHooks() {
    if (window.__squatGymDataSyncHooked || !canUseLocalStorage()) {
      return;
    }

    window.__squatGymDataSyncHooked = true;

    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;

    Storage.prototype.setItem = function patchedSetItem(key, value) {
      const result = originalSetItem.apply(this, arguments);

      if (this === localStorage) {
        scheduleSilentPersist(key);
      }

      return result;
    };

    Storage.prototype.removeItem = function patchedRemoveItem(key) {
      const result = originalRemoveItem.apply(this, arguments);

      if (this === localStorage) {
        scheduleSilentPersist(key);
      }

      return result;
    };
  }

  applyEmbeddedBackup();
  installStorageHooks();

  window.SquatGymDataSync = {
    buildSnapshot,
    exportData: () => downloadSnapshot(buildSnapshot()),
    importFile,
    persistData,
    applySnapshot
  };
})();
