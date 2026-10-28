/*
 * Bluefox Cleaning Solutions — page behavior
 * ---------------------------------------------------------------------------
 * No dependencies. The page reads and works without this file; it adds:
 *   1. Company details from site.config.js; anything still missing stays a
 *      marked placeholder, or is hidden when showPlaceholders is false
 *   2. Header, mobile menu, in-page navigation
 *   3. Service scope toggles (small screens) and the mobile action bar
 *   4. The quote request form: validation, delivery, and honest status
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var CFG = window.BLUEFOX_SITE || {};
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var framed = false;
  try { framed = window.self !== window.top; } catch (err) { framed = true; }

  root.classList.add('js');

  /* ---- helpers --------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  function get(path) {
    return path.split('.').reduce(function (obj, key) { return obj == null ? obj : obj[key]; }, CFG);
  }

  function has(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return value != null && value !== false;
  }

  function el(tag, attrs, children) {
    var node = doc.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (attrs[key] == null || attrs[key] === false) return;
      if (key === 'class') node.className = attrs[key];
      else if (key === 'text') node.textContent = attrs[key];
      else node.setAttribute(key, attrs[key] === true ? '' : attrs[key]);
    });
    (children || []).forEach(function (child) {
      if (child == null) return;
      node.appendChild(typeof child === 'string' ? doc.createTextNode(child) : child);
    });
    return node;
  }

  function icon(id, small) {
    var svg = doc.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon' + (small ? ' icon--sm' : ''));
    svg.setAttribute('aria-hidden', 'true');
    var use = doc.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  function dialString() {
    var contact = CFG.contact || {};
    if (has(contact.phoneHref)) return String(contact.phoneHref).replace(/[^\d+]/g, '');
    var digits = String(contact.phone || '').replace(/\D/g, '');
    if (digits.length === 10) return '+1' + digits;
    if (digits.length === 11 && digits.charAt(0) === '1') return '+' + digits;
    return digits;
  }

  /* ---- 1. company details ---------------------------------------------- */
  function applyConfig() {
    $$('[data-bind]').forEach(function (node) {
      var value = get(node.getAttribute('data-bind'));
      if (!has(value)) return;
      node.textContent = String(value);
      node.classList.remove('ph');
      node.hidden = false;
    });

    $$('[data-list]').forEach(function (node) {
      var items = get(node.getAttribute('data-list'));
      if (!has(items)) return;
      node.textContent = '';
      items.forEach(function (item) { node.appendChild(el('li', { text: String(item) })); });
      node.hidden = false;
    });

    $$('[data-join]').forEach(function (node) {
      var items = (get(node.getAttribute('data-join')) || []).map(String).filter(has);
      if (!items.length) return;
      node.textContent = items.length < 3 ? items.join(' and ') : items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
      node.hidden = false;
    });

    $$('[data-pairs]').forEach(function (node) {
      var items = (get(node.getAttribute('data-pairs')) || []).filter(function (item) {
        return item && has(item.label) && has(item.value);
      });
      if (!items.length) return;
      node.textContent = '';
      items.forEach(function (item) { node.appendChild(el('li', { text: item.label + ': ' + item.value })); });
      node.hidden = false;
    });

    $$('[data-hide-if]').forEach(function (node) {
      if (has(get(node.getAttribute('data-hide-if')))) node.hidden = true;
    });

    $$('[data-show-if]').forEach(function (node) {
      node.hidden = !has(get(node.getAttribute('data-show-if')));
    });

    var contact = CFG.contact || {};
    $$('[data-contact]').forEach(function (node) {
      var kind = node.getAttribute('data-contact');
      var value = kind === 'phone' ? contact.phone : contact.email;
      if (!has(value)) return; // stays a placeholder (or hidden) until supplied
      node.setAttribute('href', kind === 'phone' ? 'tel:' + dialString() : 'mailto:' + String(value).trim());
      var slot = $('[data-contact-value]', node);
      if (slot) {
        slot.textContent = String(value).trim();
        slot.classList.remove('ph');
      }
      node.hidden = false;
    });

    var pdf = get('capability.pdf');
    if (has(pdf)) {
      $$('[data-download]').forEach(function (link) { link.setAttribute('href', String(pdf).trim()); });
    }

    var privacyUrl = (CFG.links || {}).privacyUrl;
    if (has(privacyUrl)) {
      $$('[data-privacy]').forEach(function (node) {
        node.textContent = 'Privacy: details submitted through this site are used only to respond to your request. ';
        node.appendChild(el('a', { href: privacyUrl, text: 'Privacy policy' }));
        node.appendChild(doc.createTextNode('. '));
      });
      $$('[data-privacy-inline]').forEach(function (node) {
        node.textContent = 'See our ';
        node.appendChild(el('a', { href: privacyUrl, text: 'privacy policy' }));
        node.appendChild(doc.createTextNode('.'));
      });
    }

    $$('[data-year]').forEach(function (node) { node.textContent = String(new Date().getFullYear()); });
  }

  function renderTrust() {
    var trust = CFG.trust || {};

    var builders = {
      clients: function (item) {
        // the name is always written out, so the logo image is decorative
        return el('li', { class: 'client' + (has(item.logo) ? ' client--logo' : '') }, [
          has(item.logo) ? el('img', { src: item.logo, alt: '', loading: 'lazy', decoding: 'async' }) : null,
          el('span', { class: 'client__name', text: String(item.name || '') })
        ]);
      },
      projects: function (item) {
        var meta = [item.scope, item.location].filter(has).join(' | ');
        return el('article', { class: 'project' }, [
          has(item.image) ? el('img', { src: item.image, alt: String(item.alt || ''), loading: 'lazy', decoding: 'async' }) : null,
          el('div', { class: 'project__body' }, [
            el('h4', { class: 'project__title', text: String(item.title || '') }),
            meta ? el('p', { class: 'project__meta', text: meta }) : null
          ])
        ]);
      }
    };

    $$('[data-trust]').forEach(function (group) {
      var key = group.getAttribute('data-trust');
      var items = trust[key];
      var holder = $('[data-trust-items]', group);
      if (has(items) && builders[key]) {
        holder.textContent = '';
        items.forEach(function (item) { holder.appendChild(builders[key](item)); });
      }
      if (key === 'clients') foldClients(group, holder);
    });
  }

  /*
   * The client wall shows the first few companies; the rest wait behind a
   * "Show more" control so the wall keeps its shape.
   */
  function foldClients(group, holder) {
    var shown = Number((CFG.trust || {}).clientsShown);
    var tiles = $$(':scope > .client', holder);
    if (!(shown > 0) || tiles.length <= shown) return;
    var extra = tiles.slice(shown);
    extra.forEach(function (tile) { tile.hidden = true; tile.classList.add('client--extra'); });
    var more = el('button', { class: 'trust__more', type: 'button', 'aria-expanded': 'false', 'aria-controls': holder.id || (holder.id = 'client-wall') }, [
      el('span', { class: 'trust__more-text', text: 'Show ' + extra.length + ' more clients' }),
      icon('i-chevron')
    ]);
    more.addEventListener('click', function () {
      var open = more.getAttribute('aria-expanded') === 'true';
      extra.forEach(function (tile) { tile.hidden = open; });
      more.setAttribute('aria-expanded', open ? 'false' : 'true');
      $('.trust__more-text', more).textContent = open ? 'Show ' + extra.length + ' more clients' : 'Show fewer clients';
      if (open) holder.scrollIntoView({ block: 'nearest' });
    });
    holder.parentNode.insertBefore(more, holder.nextSibling);
  }

  /*
   * Missing details. By default each one shows as a marked "To add" placeholder.
   * With showPlaceholders: false, every unfilled item is hidden instead, along
   * with any block or section that would be left empty (data-needs lists the
   * settings a block depends on), so nothing unfinished is public.
   */
  function finishPlaceholders() {
    if (CFG.showPlaceholders === false) {
      $$('[data-needs]').forEach(function (node) {
        var filled = node.getAttribute('data-needs').split(/\s+/).some(function (path) { return has(get(path)); });
        if (!filled) node.hidden = true;
      });
      $$('.ph, [data-slot]').forEach(function (node) { node.hidden = true; });
      $$('[data-contact]').forEach(function (node) {
        if (!node.hasAttribute('href')) node.hidden = true;
      });
    }

    // the insurance card takes the full row when nothing sits beside it
    $$('.trust__grid').forEach(function (grid) {
      var stack = $('.trust__stack', grid);
      grid.classList.toggle('trust__grid--single', !!stack && stack.hidden);
    });
  }

  /* ---- 2. header, menu, in-page navigation ------------------------------ */
  var navOpen = false;
  var refreshMobileBar = function () {};

  /*
   * Completed projects scroll sideways in a continuous loop. Copies of the
   * first few cards sit after the last one, and copies of the last few sit
   * before the first, so the row carries straight on from the end into the
   * beginning; when the view rests on a copy it is swapped, unseen, for the
   * original. Arrows move one screenful; the row can also be swiped.
   */
  function initCarousels() {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    $$('[data-carousel]').forEach(function (box) {
      var track = $('.carousel__track', box);
      var group = box.closest('[data-trust]') || box.parentNode;
      var nav = $('[data-carousel-nav]', group);
      var prev = nav && $('[data-carousel-prev]', nav);
      var next = nav && $('[data-carousel-next]', nav);
      if (!track || !nav || !prev || !next) return;

      var originals = $$(':scope > *', track).filter(function (n) { return !n.hasAttribute('data-slot'); });
      var n = originals.length;
      if (n < 2 || track.scrollWidth - track.clientWidth <= 4) return;   // everything fits: nothing to scroll
      nav.hidden = false;

      var k = Math.min(3, n);                       // copies at each end: the most cards ever in view
      originals.slice(-k).forEach(function (card) { track.insertBefore(clone(card), track.firstChild); });
      originals.slice(0, k).forEach(function (card) { track.appendChild(clone(card)); });

      function clone(card) {
        var copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.setAttribute('data-clone', '');
        $$('a, button, [tabindex]', copy).forEach(function (f) { f.setAttribute('tabindex', '-1'); });
        return copy;
      }

      var cards = $$(':scope > *', track);
      var cur = k;                                   // index of the card at the left edge
      function advance() { return cards[1].offsetLeft - cards[0].offsetLeft; }
      function perView() { return Math.max(1, Math.round(track.clientWidth / advance())); }

      function jump(x) {                             // move without gliding, whatever the CSS says
        track.classList.add('carousel__track--jump');
        track.scrollLeft = x;
        void track.offsetWidth;
        track.classList.remove('carousel__track--jump');
      }
      function glide(x) { track.scrollTo({ left: x, behavior: reduced ? 'auto' : 'smooth' }); }

      function normalize() {                         // resting on a copy: swap to the matching original
        if (cur >= k + n) cur -= n;
        else if (cur < k) cur += n;
        jump(cur * advance());
      }

      function page(direction) {
        jump(cur * advance());                       // land any glide still in flight
        normalize();
        cur += direction * perView();
        if (cur > k + n) cur = k + n;                // never ask for cards past the copies
        if (cur < 0) cur = 0;
        glide(cur * advance());
      }

      prev.addEventListener('click', function () { page(-1); });
      next.addEventListener('click', function () { page(1); });

      // after a swipe (or a glide) settles, note where we are and swap copies for originals
      var settle = null;
      function settled() {
        cur = Math.round(track.scrollLeft / advance());
        if (cur >= k + n || cur < k) normalize();
      }
      track.addEventListener('scroll', function () {
        clearTimeout(settle);
        settle = setTimeout(settled, 120);
      }, { passive: true });

      window.addEventListener('resize', function () { jump(cur * advance()); });
      jump(cur * advance());
    });
  }

  function initHeader() {
    var header = $('[data-header]');
    var nav = $('[data-nav]');
    var toggle = $('[data-nav-toggle]');
    if (!header) return;

    function onScroll() { header.classList.toggle('is-stuck', (window.pageYOffset || 0) > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!nav || !toggle) return;
    var label = $('.visually-hidden', toggle);

    function setNav(open) {
      navOpen = open;
      nav.classList.toggle('is-open', open);
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close menu' : 'Menu';
      refreshMobileBar();
    }

    toggle.addEventListener('click', function () { setNav(!navOpen); });
    nav.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) setNav(false);
    });
    doc.addEventListener('click', function (event) {
      if (navOpen && !header.contains(event.target)) setNav(false);
    });
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navOpen) {
        setNav(false);
        toggle.focus();
      }
    });
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 62rem)');
      var onWide = function () { if (navOpen) setNav(false); };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  function initAnchors() {
    doc.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      var id = link.getAttribute('href').slice(1);
      var target = id ? doc.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();

      var service = link.getAttribute('data-service');
      if (service) selectService(service);

      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      // keep keyboard and screen-reader position in step with the scroll
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
        target.style.outline = 'none';
      }
      try { target.focus({ preventScroll: true }); } catch (err) { /* older browsers */ }
      try { window.history.pushState(null, '', '#' + id); } catch (err) { /* sandboxed frame */ }
    });
  }

  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = {};
    $$('.primary-nav__list a[href^="#"]').forEach(function (link) {
      links[link.getAttribute('href').slice(1)] = link;
    });
    var sections = $$('main > section[id]');
    if (!sections.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].removeAttribute('aria-current'); });
        var link = links[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -54% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---- 3. scope toggles, mobile action bar ------------------------------ */
  function initScopes() {
    $$('[data-scope-toggle]').forEach(function (button, index) {
      var list = doc.getElementById(button.getAttribute('aria-controls'));
      if (!list) return;
      function set(open) {
        button.setAttribute('aria-expanded', String(open));
        list.setAttribute('data-collapsed', String(!open));
      }
      set(index === 0); // the lead service starts open
      button.addEventListener('click', function () {
        set(button.getAttribute('aria-expanded') !== 'true');
      });
    });
  }

  function initMobileBar() {
    var bar = $('[data-mobile-bar]');
    var heroActions = $('.hero__actions');
    var contact = $('#contact');
    if (!bar || !heroActions || !contact || !('IntersectionObserver' in window)) return;
    var pastHero = false;
    var atContact = false;

    refreshMobileBar = function () {
      bar.classList.toggle('is-visible', pastHero && !atContact && !navOpen);
    };

    new IntersectionObserver(function (entries) {
      var entry = entries[entries.length - 1];
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      refreshMobileBar();
    }).observe(heroActions);

    new IntersectionObserver(function (entries) {
      var entry = entries[entries.length - 1];
      atContact = entry.isIntersecting || entry.boundingClientRect.top < 0;
      refreshMobileBar();
    }, { rootMargin: '0px 0px -25% 0px' }).observe(contact);
  }

  /* ---- 4. quote request form -------------------------------------------- */
  var FIELDS = [
    ['name', 'Full name'],
    ['company', 'Company name'],
    ['email', 'Business email'],
    ['phone', 'Phone number'],
    ['service', 'Service required'],
    ['project_location', 'Project location'],
    ['square_footage', 'Approximate square footage'],
    ['completion_date', 'Desired completion date'],
    ['details', 'Additional project details']
  ];
  var FILE_TYPES = /\.(jpe?g|png|gif|webp|heic|heif|pdf|docx?|xlsx?)$/i;

  function todayISO() {
    var now = new Date();
    var local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function formatBytes(bytes) {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  function selectService(name) {
    var select = doc.getElementById('q-service');
    if (!select) return;
    var wanted = String(name).toLowerCase().replace(/[^a-z]/g, '');
    $$('option', select).forEach(function (option) {
      if (option.value !== '' && option.textContent.toLowerCase().replace(/[^a-z]/g, '') === wanted) {
        select.value = option.value || option.textContent;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  function initQuoteForm() {
    var form = $('[data-quote-form]');
    if (!form) return;
    form.setAttribute('novalidate', '');

    var cfg = CFG.form || {};
    var uploads = cfg.uploads || {};
    var contact = CFG.contact || {};
    var endpoint = String(cfg.endpoint || '').trim();
    var email = String(contact.email || '').trim();
    var mode = endpoint ? 'endpoint' : (email && cfg.emailFallback !== false ? 'email' : 'unconfigured');
    form.setAttribute('data-mode', mode);

    var fieldsWrap = $('[data-form-fields]', form);
    var foot = $('[data-form-foot]', form);
    var head = $('.quote__head', form);
    var done = $('[data-form-done]', form);
    var summary = $('[data-form-errors]', form);
    var summaryTitle = $('[data-form-errors-title]', form);
    var summaryList = $('[data-form-errors-list]', form);
    var statusBox = $('[data-form-status]', form);
    var setupNote = $('[data-form-setup]', form);
    var submitBtn = $('[data-form-submit]', form);
    var submitLabel = $('[data-form-submit-label]', form);
    var fileField = $('[data-upload-field]', form);
    var fileInput = fileField ? $('input[type="file"]', fileField) : null;
    var fileList = $('[data-file-list]', form);
    var fileHint = $('[data-upload-hint]', form);
    var maxFiles = Number(uploads.maxFiles) || 5;
    var maxMB = Number(uploads.maxFileMB) || 10;
    var fileFieldName = String(uploads.fieldName || 'attachments'); // some services expect their own name
    if (fileInput) fileInput.setAttribute('name', fileFieldName);
    var attempted = false;
    var sending = false;

    if (setupNote) setupNote.hidden = mode !== 'unconfigured';

    if (fileField && uploads.enabled === false) {
      fileField.parentNode.removeChild(fileField);
      fileInput = null;
    } else if (fileInput && mode === 'email') {
      // an email draft the browser opens cannot carry files, so the photos chosen here go two
      // ways: on a phone the request and the photos are handed to the mail app together through
      // the share sheet; elsewhere the photos are listed for the sender to attach by hand.
      if (fileHint) fileHint.textContent = (maxFiles === 1 ? 'One file, up to ' + maxMB + ' MB.' : 'Up to ' + maxFiles + ' files, ' + maxMB + ' MB each.') +
        ' Photos, PDF, Word, or Excel.';
    } else if (fileHint) {
      if (maxFiles === 1) fileInput.removeAttribute('multiple');
      fileHint.textContent = (maxFiles === 1 ? 'One file, up to ' + maxMB + ' MB.' : 'Up to ' + maxFiles + ' files, ' + maxMB + ' MB each.') +
        ' Photos, PDF, Word, or Excel.';
    }

    var dateInput = form.elements.completion_date;
    if (dateInput) dateInput.min = todayISO();

    /* -- validation -- */
    var rules = {
      name: function (v) { return v.length >= 2 ? '' : 'Enter your full name.'; },
      company: function (v) { return v.length >= 2 ? '' : 'Enter your company name.'; },
      email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a business email address, like name@company.com.';
      },
      phone: function (v) {
        return v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with its area code.';
      },
      service: function (v) { return v ? '' : 'Select the service you need.'; },
      project_location: function (v) { return v.length >= 2 ? '' : 'Enter the project city and state, or the site address.'; },
      square_footage: function (v) {
        if (!v) return '';
        return /^\d[\d,.\s]*(sq\.?\s*ft\.?|sf)?$/i.test(v) ? '' : 'Enter the square footage as a number, like 12,000.';
      },
      completion_date: function (v) {
        if (!v) return '';
        return v >= todayISO() ? '' : 'Choose a date that is today or later.';
      },
      details: function (v) { return v.length <= 3000 ? '' : 'Shorten the project details to 3,000 characters or fewer.'; }
    };

    function value(name) {
      var control = form.elements[name];
      return control ? String(control.value || '').trim() : '';
    }

    function setError(control, message) {
      var box = doc.getElementById(control.id + '-error');
      if (message) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
      if (!box) return;
      box.textContent = '';
      if (message) {
        box.appendChild(icon('i-alert', true));
        box.appendChild(doc.createTextNode(message));
      }
      box.hidden = !message;
    }

    function validateField(name) {
      var control = form.elements[name];
      if (!control || !rules[name]) return '';
      var message = rules[name](value(name));
      setError(control, message);
      return message;
    }

    function validateFiles() {
      if (!fileInput || fileInput.disabled) return '';
      var files = Array.prototype.slice.call(fileInput.files || []);
      var message = '';
      if (files.length > maxFiles) {
        message = 'Choose ' + maxFiles + ' files or fewer. You selected ' + files.length + '.';
      } else {
        files.some(function (file) {
          if (file.size > maxMB * 1048576) {
            message = '"' + file.name + '" is larger than ' + maxMB + ' MB. Remove it or choose a smaller file.';
          } else if (!FILE_TYPES.test(file.name)) {
            message = '"' + file.name + '" is not a supported file type. Use a photo, PDF, Word, or Excel file.';
          }
          return !!message;
        });
      }
      setError(fileInput, message);
      return message;
    }

    function validateAll() {
      var errors = [];
      FIELDS.forEach(function (pair) {
        var message = validateField(pair[0]);
        if (message) errors.push({ id: form.elements[pair[0]].id, label: pair[1], message: message });
      });
      var fileMessage = validateFiles();
      if (fileMessage) errors.push({ id: fileInput.id, label: 'Photos or documents', message: fileMessage });
      return errors;
    }

    function showSummary(errors) {
      summaryTitle.textContent = errors.length === 1
        ? 'Fix 1 field to send your request.'
        : 'Fix ' + errors.length + ' fields to send your request.';
      summaryList.textContent = '';
      errors.forEach(function (error) {
        summaryList.appendChild(el('li', null, [el('a', { href: '#' + error.id, text: error.label + ': ' + error.message })]));
      });
      summary.hidden = false;
      summary.focus();
    }

    summaryList.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      var control = doc.getElementById(link.getAttribute('href').slice(1));
      if (control) control.focus();
    });

    FIELDS.forEach(function (pair) {
      var control = form.elements[pair[0]];
      if (!control) return;
      control.addEventListener('blur', function () {
        if (attempted || value(pair[0])) validateField(pair[0]);
      });
      var live = function () {
        if (control.getAttribute('aria-invalid') === 'true') validateField(pair[0]);
      };
      control.addEventListener('input', live);
      control.addEventListener('change', live);
    });

    /* -- file list -- */
    function renderFiles() {
      if (!fileInput || !fileList) return;
      var files = Array.prototype.slice.call(fileInput.files || []);
      var canRemoveOne = typeof window.DataTransfer === 'function';
      fileList.textContent = '';
      files.forEach(function (file, index) {
        var remove = el('button', { type: 'button', text: 'Remove', 'aria-label': 'Remove ' + file.name });
        remove.addEventListener('click', function () {
          if (canRemoveOne) {
            try {
              var transfer = new DataTransfer();
              files.forEach(function (keep, i) { if (i !== index) transfer.items.add(keep); });
              fileInput.files = transfer.files;
            } catch (err) { fileInput.value = ''; }
          } else {
            fileInput.value = '';
          }
          renderFiles();
          validateFiles();
        });
        var row = el('li', null, [el('span', { text: file.name + ' (' + formatBytes(file.size) + ')' }), remove]);
        if (/^image\//.test(file.type) && window.URL && URL.createObjectURL) {
          var thumb = el('img', { alt: '', src: URL.createObjectURL(file) });
          thumb.addEventListener('load', function () { URL.revokeObjectURL(thumb.src); });
          row.insertBefore(thumb, row.firstChild);
          row.className = 'file-list__photo';
        }
        fileList.appendChild(row);
      });
    }

    function addFiles(incoming) {
      if (!fileInput || !incoming || !incoming.length) return;
      var current = Array.prototype.slice.call(fileInput.files || []);
      try {
        var transfer = new DataTransfer();
        current.concat(Array.prototype.slice.call(incoming)).forEach(function (f) { transfer.items.add(f); });
        fileInput.files = transfer.files;
      } catch (err) {
        return; // the browser cannot build a file list by hand; the picker still works
      }
      renderFiles();
      validateFiles();
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        renderFiles();
        validateFiles();
      });
      var zone = $('[data-dropzone]', form);
      if (zone) {
        ['dragenter', 'dragover'].forEach(function (name) {
          zone.addEventListener(name, function (event) { event.preventDefault(); zone.classList.add('is-over'); });
        });
        ['dragleave', 'drop'].forEach(function (name) {
          zone.addEventListener(name, function () { zone.classList.remove('is-over'); });
        });
        zone.addEventListener('drop', function (event) {
          event.preventDefault();
          // a drop onto the input itself already replaced its files; a drop onto the box adds to them
          if (event.target !== fileInput && event.dataTransfer) addFiles(event.dataTransfer.files);
          else { renderFiles(); validateFiles(); }
        });
      }
    }

    function chosenFiles() {
      return fileInput && !fileInput.disabled ? Array.prototype.slice.call(fileInput.files || []) : [];
    }

    /* -- request text (shared by the copy and email paths) -- */
    function collect() {
      var data = {};
      FIELDS.forEach(function (pair) { data[pair[0]] = value(pair[0]); });
      return data;
    }

    function requestText(data, limit) {
      var origin = (cfg.sourceNote || 'Sent from the quote form on ' + (window.location.hostname || 'the website'));
      var lines = ['Quote request for ' + (get('company.name') || 'Bluefox Cleaning Solutions'), origin, ''];
      FIELDS.forEach(function (pair) {
        var v = data[pair[0]];
        if (!v) return;
        if (pair[0] === 'details' && limit && v.length > limit) v = v.slice(0, limit) + ' […]';
        lines.push(pair[1] + ': ' + v);
      });
      var chosen = chosenFiles();
      if (chosen.length) {
        lines.push((mode === 'email' ? 'Photos or documents to attach: ' : 'Attachments: ') + chosen.map(function (f) { return f.name; }).join(', '));
      }
      return lines.join('\n');
    }

    function copyText(text, button, holder) {
      function fallback() {
        var box = $('.status__copybox', holder) || holder.appendChild(el('textarea', {
          class: 'status__copybox', readonly: true, 'aria-label': 'Request details'
        }));
        box.value = text;
        box.focus();
        box.select();
        button.textContent = 'Select and copy below';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { button.textContent = 'Copied'; }, fallback);
      } else {
        fallback();
      }
    }

    function showStatus(kind, title, paragraphs, actions) {
      var body = el('div', { class: 'status__body' }, [el('p', { class: 'status__title', text: title })]);
      (paragraphs || []).forEach(function (text) { body.appendChild(el('p', { text: text })); });
      if (actions && actions.length) {
        var row = el('div', { class: 'status__actions' });
        actions.forEach(function (action) { row.appendChild(action(body)); });
        body.appendChild(row);
      }
      statusBox.className = 'status status--' + kind;
      statusBox.setAttribute('role', kind === 'error' ? 'alert' : 'status');
      statusBox.textContent = '';
      statusBox.appendChild(icon(kind === 'error' ? 'i-alert' : 'i-info'));
      statusBox.appendChild(body);
      statusBox.hidden = false;
    }

    function copyAction(text) {
      return function (holder) {
        var button = el('button', { type: 'button', class: 'btn btn--outline btn--sm', text: 'Copy request details' });
        button.addEventListener('click', function () { copyText(text, button, holder); });
        return button;
      };
    }

    function directContact() {
      var parts = [];
      if (has(contact.phone)) parts.push('call ' + contact.phone);
      if (has(contact.email)) parts.push('email ' + contact.email);
      return parts.length ? ' You can also ' + parts.join(' or ') + '.' : '';
    }

    function setSending(on) {
      sending = on;
      submitBtn.disabled = on;
      submitBtn.setAttribute('aria-busy', String(on));
      submitLabel.textContent = on ? 'Sending' : 'Submit Request';
      var spinner = $('.spinner', submitBtn);
      if (on && !spinner) submitBtn.insertBefore(el('span', { class: 'spinner', 'aria-hidden': 'true' }), submitLabel);
      if (!on && spinner) spinner.parentNode.removeChild(spinner);
    }

    /* -- outcomes -- */
    function showSent(data) {
      var first = data.name.split(/\s+/)[0];
      var list = el('dl', { class: 'quote__summary' });
      FIELDS.forEach(function (pair) {
        if (!data[pair[0]] || pair[0] === 'details') return;
        list.appendChild(el('div', null, [el('dt', { text: pair[1] }), el('dd', { text: data[pair[0]] })]));
      });
      var again = el('button', { type: 'button', class: 'btn btn--outline btn--sm', text: 'Send another request' });
      again.addEventListener('click', function () {
        form.reset();
        renderFiles();
        done.hidden = true;
        done.textContent = '';
        head.hidden = false;
        fieldsWrap.hidden = false;
        foot.hidden = false;
        statusBox.hidden = true;
        attempted = false;
        form.elements.name.focus();
      });
      done.textContent = '';
      done.appendChild(el('p', { class: 'assurance__mark' }, [icon('i-check'), 'Request sent']));
      done.appendChild(el('h3', { class: 'quote__done-title', text: 'Thank you, ' + first + '.' }));
      done.appendChild(el('p', { text: 'We received your request. Our team will review the details and reply to ' + data.email + '.' }));
      done.appendChild(list);
      done.appendChild(again);
      head.hidden = true;
      fieldsWrap.hidden = true;
      foot.hidden = true;
      done.hidden = false;
      done.focus();
    }

    function sendToEndpoint(data) {
      var body = new FormData(form);
      body.delete('_gotcha');
      if (!fileInput || fileInput.disabled) body.delete(fileFieldName);
      // set, not append: a host may already have added one of these to the form (Netlify adds form-name)
      var extra = cfg.extraFields || {};
      Object.keys(extra).forEach(function (key) { body.set(key, extra[key]); });
      body.set(cfg.subjectField || '_subject', (cfg.subjectPrefix || 'Quote request') + ': ' + data.service + ' (' + data.company + ')');

      var controller = typeof AbortController === 'function' ? new AbortController() : null;
      var timedOut = false;
      var timer = window.setTimeout(function () {
        timedOut = true;
        if (controller) controller.abort();
      }, (Number(cfg.timeoutSeconds) || 30) * 1000);

      setSending(true);
      statusBox.hidden = true;

      window.fetch(endpoint, {
        method: 'POST',
        body: body,
        headers: { Accept: 'application/json' },
        signal: controller ? controller.signal : undefined
      }).then(function (response) {
        return response.text().then(function (text) {
          var payload = null;
          try { payload = JSON.parse(text); } catch (err) { /* not JSON: judge by status alone */ }
          return { response: response, payload: payload };
        });
      }).then(function (result) {
        window.clearTimeout(timer);
        setSending(false);
        var payload = result.payload || {};
        var refused = payload.ok === false || payload.success === false;
        var confirmed = payload.ok === true || payload.success === true;
        // "json" (default): the service must say ok/success in JSON. "status": any 2xx answer counts.
        var accepted = cfg.confirmWith === 'status' ? !refused : confirmed;
        if (result.response.ok && accepted) {
          showSent(data); // the only path that reports success
          return;
        }
        var detail = '';
        if (payload.errors && payload.errors[0] && payload.errors[0].message) detail = ' (' + payload.errors[0].message + ')';
        else if (typeof payload.message === 'string') detail = ' (' + payload.message + ')';
        else if (payload.body && typeof payload.body.message === 'string') detail = ' (' + payload.body.message + ')';
        else if (typeof payload.error === 'string') detail = ' (' + payload.error + ')';
        if (result.response.ok && !refused) {
          // a 2xx answer that never confirmed delivery: do not guess
          showStatus('error', 'We could not confirm your request was received.', [
            'The form service answered, but did not confirm delivery. Your details are still in the form.' + directContact()
          ], [copyAction(requestText(data))]);
          return;
        }
        showStatus('error', 'Your request was not sent.', [
          'The form service answered with an error, status ' + result.response.status + detail + '. Your details are still in the form. Try again in a moment.' + directContact()
        ], [copyAction(requestText(data))]);
      }).catch(function () {
        window.clearTimeout(timer);
        setSending(false);
        showStatus('error', timedOut ? 'We could not confirm your request was received.' : 'Your request was not sent.', [
          (timedOut
            ? 'The connection timed out before the form service answered.'
            : 'We could not reach the form service. Check your connection.') +
          ' Your details are still in the form, so you can try again.' + directContact()
        ], [copyAction(requestText(data))]);
      });
    }

    function handOffToEmail(data) {
      var subject = (cfg.subjectPrefix || 'Quote request') + ': ' + data.service + ' (' + data.company + ')';
      var text = requestText(data, 900);
      var href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      var files = chosenFiles();
      var canShare = files.length > 0 && navigator.share && navigator.canShare && navigator.canShare({ files: files });
      var notes = ['Your request is ready as an email draft to ' + email + '. It is not sent until you press Send in your email app.'];
      if (files.length) {
        notes.push(canShare
          ? 'Your ' + (files.length === 1 ? 'photo is' : files.length + ' photos are') + ' not in the draft. "Share with photos" opens your phone\u2019s share sheet with the request and the photos together; choose your email app and send it to ' + email + '.'
          : 'An email draft cannot carry files, so attach ' + (files.length === 1 ? 'the photo' : 'the ' + files.length + ' photos') + ' to the email before you send it: ' + files.map(function (f) { return f.name; }).join(', ') + '.');
      }
      var actions = [function () { return el('a', { class: 'btn btn--primary btn--sm', href: href, text: 'Open email draft' }); }];
      if (canShare) {
        actions.unshift(function () {
          var button = el('button', { class: 'btn btn--primary btn--sm', type: 'button', text: 'Share with photos' });
          button.addEventListener('click', function () {
            navigator.share({ title: subject, text: 'To: ' + email + '\n\n' + text, files: files }).catch(function () { /* the visitor closed the sheet */ });
          });
          return button;
        });
      }
      actions.push(copyAction(text));
      showStatus('notice', 'One step left: send the email.', notes, actions);
      // open the draft right away where that is reliable (not inside an embedded preview), unless
      // the photos should travel with it, in which case the share button is the better first step
      if (!framed && !canShare) window.location.href = href;
    }

    function showNotConnected(data) {
      if (setupNote) setupNote.hidden = true; // the message below says the same thing, with an action
      showStatus('notice', 'Not sent: this form is not connected to an inbox yet.', [
        'Your details are still in the form. Until a form endpoint or contact email is added in site.config.js, copy them and send them to us directly.'
      ], [copyAction(requestText(data))]);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (sending) return;
      attempted = true;
      var errors = validateAll();
      if (errors.length) {
        statusBox.hidden = true;
        showSummary(errors);
        return;
      }
      summary.hidden = true;
      if (form.elements._gotcha && form.elements._gotcha.value) return; // automated submission
      var data = collect();
      if (mode === 'endpoint') sendToEndpoint(data);
      else if (mode === 'email') handOffToEmail(data);
      else showNotConnected(data);
    });

    // deep links such as /?service=window-cleaning#quote
    try {
      var wanted = new URLSearchParams(window.location.search).get('service');
      if (wanted) selectService(wanted);
    } catch (err) { /* no query string available */ }
  }

  function reportSetup() {
    if (!window.console || !console.info) return;
    if (!window.BLUEFOX_SITE) {
      // the settings file failed to load or has a typing slip, so every detail falls back to its placeholder
      if (console.error) console.error('[Bluefox] assets/js/site.config.js did not load. Check it for a missing quote or comma.');
      return;
    }
    var missing = [];
    ['contact.phone', 'contact.email', 'serviceArea.primary', 'serviceArea.areas', 'company.legalName',
      'insurance.details', 'capability.pastPerformance', 'capability.capacity', 'links.privacyUrl'].forEach(function (path) {
      if (!has(get(path))) missing.push(path);
    });
    var form = CFG.form || {};
    if (!has(form.endpoint)) missing.push('form.endpoint');
    if (missing.length) console.info('[Bluefox] Still to add in assets/js/site.config.js: ' + missing.join(', '));
  }

  function init() {
    applyConfig();
    renderTrust();
    finishPlaceholders();
    initHeader();
    initAnchors();
    initScrollSpy();
    initScopes();
    initMobileBar();
    initCarousels();
    initQuoteForm();
    reportSetup();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
