(() => {
  const THEME_KEY = 'squatgym-theme';
  let unreadNotificationCount = 0;
  const ROLE_PERMISSIONS = {
    Administrador: ['inicio', 'kiosco', 'inventario', 'asistencias', 'usuarios'],
    Encargado: ['inicio', 'kiosco', 'inventario', 'asistencias'],
    Secretaria: ['inicio', 'kiosco', 'inventario', 'asistencias']
  };

  function readCurrentUser() {
    try {
      return JSON.parse(sessionStorage.getItem('squatgym-user') || 'null');
    } catch (error) {
      return null;
    }
  }

  function normalizeRole(role) {
    return role === 'Encargado Sucursal' ? 'Encargado' : role || 'Administrador';
  }

  function getSectionFromHref(href = '') {
    if (href.includes('kiosco')) return 'kiosco';
    if (href.includes('inventario')) return 'inventario';
    if (href.includes('asistencias')) return 'asistencias';
    if (href.includes('usuarios')) return 'usuarios';
    return 'inicio';
  }

  function applyRoleVisibility() {
    const currentUser = readCurrentUser();
    const role = normalizeRole(currentUser?.role);
    const allowedSections = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.Administrador;

    document.querySelectorAll('.nav-tab').forEach((link) => {
      const section = getSectionFromHref(link.getAttribute('href') || '');
      link.classList.toggle('hidden', !allowedSections.includes(section));
    });

    const currentSection = getSectionFromHref(window.location.pathname);
    if (!allowedSections.includes(currentSection)) {
      const homeLink = document.querySelector('.nav-tab[href$="home.html"]')?.getAttribute('href') || '../home.html';
      window.location.href = homeLink;
      return;
    }

    document.querySelectorAll('[data-role-visible]').forEach((element) => {
      const roles = element.dataset.roleVisible.split(',').map((item) => item.trim()).filter(Boolean);
      element.classList.toggle('hidden', roles.length > 0 && !roles.includes(role));
    });

    document.querySelectorAll('[data-role-hidden]').forEach((element) => {
      const roles = element.dataset.roleHidden.split(',').map((item) => item.trim()).filter(Boolean);
      element.classList.toggle('hidden', roles.includes(role));
    });

    document.querySelectorAll('#profile-menu-button [class*="text-[10px]"], #profile-dropdown .text-xs.text-on-surface-variant').forEach((element) => {
      element.textContent = role;
    });
  }


  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      // El navegador puede bloquear localStorage en algunos contextos locales.
    }
  }

  function readSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch (error) {
      return 'light';
    }
  }

  function setTheme(theme) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    const html = document.documentElement;
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const themeButton = document.getElementById('theme-toggle');

    html.classList.remove('light', 'dark');
    html.classList.add(selectedTheme);
    saveTheme(selectedTheme);

    if (darkIcon && lightIcon) {
      darkIcon.classList.toggle('hidden', selectedTheme === 'dark');
      lightIcon.classList.toggle('hidden', selectedTheme === 'light');
    }

    if (themeButton) {
      themeButton.setAttribute(
        'aria-label',
        selectedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }

  function updateNotificationState() {
    const notificationDot = document.getElementById('notification-dot');
    const notificationButton = document.getElementById('notifications-button');
    const notificationStatus = document.getElementById('notification-status');
    const hasUnread = unreadNotificationCount > 0;

    if (notificationDot) {
      notificationDot.classList.toggle('hidden', !hasUnread);
    }

    if (notificationButton) {
      notificationButton.setAttribute(
        'aria-label',
        hasUnread
          ? `Ver notificaciones, ${unreadNotificationCount} sin leer`
          : 'Ver notificaciones'
      );
    }

    if (notificationStatus) {
      notificationStatus.textContent = hasUnread
        ? `${unreadNotificationCount} sin leer`
        : 'Sin novedades pendientes';
    }
  }

  function animateNotificationBell() {
    const notificationIcon = document.getElementById('notifications-icon');

    if (!notificationIcon) {
      return;
    }

    notificationIcon.classList.remove('bell-ring');
    void notificationIcon.offsetWidth;
    notificationIcon.classList.add('bell-ring');
  }

  function prependNotification({ icon, title, body, time }) {
    const notificationsList = document.getElementById('notifications-list');

    if (!notificationsList) {
      return;
    }

    const article = document.createElement('article');
    article.className = 'rounded-md px-3 py-3 hover:bg-surface-container';

    const row = document.createElement('div');
    row.className = 'flex items-start gap-3';

    const iconElement = document.createElement('span');
    iconElement.className = 'material-symbols-outlined mt-0.5 text-lg text-primary';
    iconElement.textContent = icon;

    const content = document.createElement('div');

    const titleElement = document.createElement('p');
    titleElement.className = 'text-sm font-semibold text-on-surface';
    titleElement.textContent = title;

    const bodyElement = document.createElement('p');
    bodyElement.className = 'text-xs leading-5 text-on-surface-variant';
    bodyElement.textContent = body;

    const timeElement = document.createElement('p');
    timeElement.className = 'mt-1 text-[11px] font-semibold text-primary';
    timeElement.textContent = time;

    content.append(titleElement, bodyElement, timeElement);
    row.append(iconElement, content);
    article.append(row);
    notificationsList.prepend(article);
  }

  function receiveNotification(notification) {
    unreadNotificationCount += 1;
    prependNotification(notification);
    updateNotificationState();
    animateNotificationBell();
  }

  function markNotificationsRead() {
    unreadNotificationCount = 0;
    updateNotificationState();
  }

  function getPageNotification() {
    const { notificationIcon, notificationTitle, notificationBody, notificationTime } = document.body.dataset;

    if (!notificationTitle || !notificationBody) {
      return null;
    }

    return {
      icon: notificationIcon || 'notifications',
      title: notificationTitle,
      body: notificationBody,
      time: notificationTime || 'Ahora'
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-toggle');
    const profileButton = document.getElementById('profile-menu-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const notificationsButton = document.getElementById('notifications-button');
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    const markNotificationsReadButton = document.getElementById('mark-notifications-read');

    setTheme(readSavedTheme());
    updateNotificationState();
    applyRoleVisibility();

    themeButton?.addEventListener('click', toggleTheme);

    if (notificationsButton && notificationsDropdown) {
      notificationsButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isHidden = notificationsDropdown.classList.toggle('hidden');
        notificationsButton.setAttribute('aria-expanded', String(!isHidden));
        profileDropdown?.classList.add('hidden');
        profileButton?.setAttribute('aria-expanded', 'false');
      });

      notificationsDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }

    markNotificationsReadButton?.addEventListener('click', markNotificationsRead);

    if (profileButton && profileDropdown) {
      profileButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isHidden = profileDropdown.classList.toggle('hidden');
        profileButton.setAttribute('aria-expanded', String(!isHidden));
        notificationsDropdown?.classList.add('hidden');
        notificationsButton?.setAttribute('aria-expanded', 'false');
      });

      profileDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }

    window.addEventListener('click', () => {
      profileDropdown?.classList.add('hidden');
      profileButton?.setAttribute('aria-expanded', 'false');
      notificationsDropdown?.classList.add('hidden');
      notificationsButton?.setAttribute('aria-expanded', 'false');
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        profileDropdown?.classList.add('hidden');
        profileButton?.setAttribute('aria-expanded', 'false');
        notificationsDropdown?.classList.add('hidden');
        notificationsButton?.setAttribute('aria-expanded', 'false');
      }
    });

    const notification = getPageNotification();

    if (notification) {
      window.setTimeout(() => {
        receiveNotification(notification);
      }, 900);
    }
  });

  window.SquatGymHeader = {
    setTheme,
    receiveNotification,
    markNotificationsRead,
    applyRoleVisibility
  };
})();



