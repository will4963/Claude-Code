/* ShopAriX Luxury Theme — theme.js */
'use strict';

/* ── Utilities ────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
const off = (el, ev, fn) => el && el.removeEventListener(ev, fn);

const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

/* ── Header Scroll ────────────────────────────────────────── */
const initHeaderScroll = () => {
  const header = $('#site-header');
  if (!header) return;
  const cls = 'scrolled';
  const update = () => header.classList.toggle(cls, window.scrollY > 40);
  on(window, 'scroll', update, { passive: true });
  update();
};

/* ── Mobile Nav ───────────────────────────────────────────── */
const initMobileNav = () => {
  const toggle = $('.nav-toggle');
  const nav = $('#mobile-nav');
  const overlay = $('#overlay');
  if (!toggle || !nav) return;

  const open = () => {
    nav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    nav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  on(toggle, 'click', () =>
    toggle.getAttribute('aria-expanded') === 'true' ? close() : open()
  );
  on(overlay, 'click', close);
  on(document, 'keydown', e => e.key === 'Escape' && close());
};

/* ── Cart Drawer ──────────────────────────────────────────── */
class CartDrawer {
  constructor() {
    this.drawer = $('#cart-drawer');
    this.overlay = $('#overlay');
    if (!this.drawer) return;
    this.bindEvents();
  }

  open() {
    this.drawer.setAttribute('aria-hidden', 'false');
    this.overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    this.drawer.querySelector('.cart-drawer__close')?.focus();
  }

  close() {
    this.drawer.setAttribute('aria-hidden', 'true');
    this.overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  async refresh() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      this.updateCount(cart.item_count);
      await this.updateDrawerHTML();
    } catch (e) {
      console.error('Cart refresh failed:', e);
    }
  }

  updateCount(count) {
    $$('[data-cart-count]').forEach(el => {
      el.textContent = count;
    });
  }

  async updateDrawerHTML() {
    try {
      const res = await fetch('/?section_id=cart-drawer-section');
      if (res.ok) {
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newBody = doc.querySelector('.cart-drawer__body');
        const newFooter = doc.querySelector('.cart-drawer__footer');
        const newSubtotal = doc.querySelector('[data-cart-subtotal]');
        if (newBody) $('#cart-drawer .cart-drawer__body').innerHTML = newBody.innerHTML;
        if (newFooter) $('#cart-drawer .cart-drawer__footer').innerHTML = newFooter.innerHTML;
      }
    } catch (e) { /* silent */ }
  }

  bindEvents() {
    on(document, 'click', e => {
      if (e.target.closest('[data-cart-trigger]')) this.open();
      if (e.target.closest('[data-cart-close]')) this.close();
    });
    on(this.overlay, 'click', () => this.close());
    on(document, 'keydown', e => {
      if (e.key === 'Escape') this.close();
    });

    on(document, 'click', async e => {
      const removeBtn = e.target.closest('[data-remove-item]');
      if (removeBtn) {
        e.preventDefault();
        const key = removeBtn.dataset.removeItem;
        await this.updateItem(key, 0);
      }

      const qtyBtn = e.target.closest('[data-qty-change]');
      if (qtyBtn && qtyBtn.closest('.cart-drawer')) {
        const key = qtyBtn.dataset.qtyChange;
        const change = parseInt(qtyBtn.dataset.change);
        const item = qtyBtn.closest('.cart-item');
        const valEl = item?.querySelector('.cart-item__qty-val');
        if (valEl) {
          const newQty = Math.max(0, parseInt(valEl.textContent) + change);
          valEl.textContent = newQty;
          await this.updateItem(key, newQty);
        }
      }
    });
  }

  async updateItem(key, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      const cart = await res.json();
      this.updateCount(cart.item_count);
      const subtotalEl = $('[data-cart-subtotal]');
      if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
    } catch (e) {
      console.error('Cart update failed:', e);
    }
  }
}

/* ── Add To Cart ──────────────────────────────────────────── */
const initProductForm = () => {
  const form = $('[data-product-form]');
  if (!form) return;
  const cartDrawer = window.__cartDrawer;

  on(form, 'submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[data-add-to-cart]');
    if (!btn || btn.disabled) return;

    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Adding...';

    try {
      const formData = new FormData(form);
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Add to cart failed');

      btn.textContent = 'Added!';
      if (cartDrawer) {
        await cartDrawer.refresh();
        cartDrawer.open();
      }
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    } catch (err) {
      btn.textContent = 'Error — Try Again';
      btn.disabled = false;
      console.error(err);
      setTimeout(() => { btn.textContent = originalText; }, 2500);
    }
  });
};

/* ── Variant Selection ────────────────────────────────────── */
const initVariantSelection = () => {
  const form = $('[data-product-form]');
  if (!form) return;

  const variantInput = form.querySelector('[data-variant-id]');
  if (!variantInput) return;

  const productData = window.ShopAriX?.product;

  const getSelectedOptions = () => {
    const opts = {};
    $$('[data-option-index]').forEach(el => {
      const idx = parseInt(el.dataset.optionIndex);
      if (el.tagName === 'SELECT') {
        opts[idx] = el.value;
      }
    });
    $$('.product-option__color-swatch.is-selected, .product-option__size.is-selected').forEach(el => {
      const idx = parseInt(el.dataset.optionIndex);
      opts[idx] = el.dataset.value;
    });
    return Object.values(opts);
  };

  const updateVariant = () => {
    if (!productData) return;
    const selected = getSelectedOptions();
    const variant = productData.variants.find(v =>
      v.options.every((opt, i) => opt === selected[i])
    );
    if (!variant) return;

    variantInput.value = variant.id;

    const atcBtn = $('[data-add-to-cart]');
    const priceEl = $('.product-info__price');

    if (atcBtn) {
      atcBtn.disabled = !variant.available;
      atcBtn.textContent = variant.available ? 'Add to Cart' : 'Sold Out';
    }

    if (priceEl && variant.price) {
      priceEl.textContent = formatMoney(variant.price);
    }
  };

  on(document, 'click', e => {
    const swatch = e.target.closest('.product-option__color-swatch');
    if (swatch) {
      const idx = swatch.dataset.optionIndex;
      $$(`[data-option-index="${idx}"]`).forEach(el => el.classList.remove('is-selected'));
      swatch.classList.add('is-selected');
      const valueEl = $(`.product-option__selected[data-option-value="${idx}"]`);
      if (valueEl) valueEl.textContent = swatch.dataset.value;
      updateVariant();
    }

    const sizeBtn = e.target.closest('.product-option__size');
    if (sizeBtn) {
      const idx = sizeBtn.dataset.optionIndex;
      $$(`[data-option-index="${idx}"].product-option__size`).forEach(el => el.classList.remove('is-selected'));
      sizeBtn.classList.add('is-selected');
      updateVariant();
    }
  });

  on(document, 'change', e => {
    if (e.target.closest('.product-option__select')) updateVariant();
  });
};

/* ── Product Gallery ──────────────────────────────────────── */
const initProductGallery = () => {
  const gallery = $('#product-gallery');
  if (!gallery) return;

  const slides = $$('.product-gallery__slide', gallery);
  const thumbs = $$('.product-gallery__thumb', gallery);

  const goTo = idx => {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    thumbs.forEach((t, i) => t.classList.toggle('is-active', i === idx));
  };

  thumbs.forEach((thumb, i) => {
    on(thumb, 'click', () => goTo(i));
    on(thumb, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
    });
  });

  on(document, 'keydown', e => {
    if (!gallery.closest('.product-page')) return;
    const active = slides.findIndex(s => s.classList.contains('is-active'));
    if (e.key === 'ArrowRight' && active < slides.length - 1) goTo(active + 1);
    if (e.key === 'ArrowLeft' && active > 0) goTo(active - 1);
  });
};

/* ── Quantity Inputs ──────────────────────────────────────── */
const initQtyInputs = () => {
  on(document, 'click', e => {
    const btn = e.target.closest('[data-qty-change]');
    if (!btn || btn.closest('.cart-drawer')) return;

    const change = parseInt(btn.dataset.qtyChange);
    const wrap = btn.closest('.product-info__qty, .cart-item__qty');
    if (!wrap) return;

    const input = wrap.querySelector('.qty-input');
    if (input) {
      const newVal = Math.max(1, parseInt(input.value || 1) + change);
      input.value = newVal;
    }
  });
};

/* ── Scroll Animations ────────────────────────────────────── */
const initScrollAnimations = () => {
  const els = $$('[data-animate]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
};

/* ── Collection Sidebar (Mobile) ──────────────────────────── */
const initCollectionSidebar = () => {
  const sidebar = $('.collection-sidebar');
  const openBtn = $('[data-sidebar-open]');
  const closeBtn = $('[data-sidebar-close]');
  const overlay = $('#overlay');
  if (!sidebar) return;

  const open = () => {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  on(openBtn, 'click', open);
  on(closeBtn, 'click', close);
  on(overlay, 'click', close);
  on(document, 'keydown', e => e.key === 'Escape' && close());
};

/* ── Sort By ──────────────────────────────────────────────── */
const initSortBy = () => {
  const sortSelect = $('[data-sort-by]');
  if (!sortSelect) return;
  on(sortSelect, 'change', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', sortSelect.value);
    window.location.href = url.toString();
  });
};

/* ── Money Formatter ──────────────────────────────────────── */
const formatMoney = (cents) => {
  const amount = (cents / 100).toFixed(2);
  const [dollars, pence] = amount.split('.');
  return `$${parseInt(dollars).toLocaleString()}.${pence}`;
};

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollAnimations();
  initProductGallery();
  initVariantSelection();
  initProductForm();
  initQtyInputs();
  initCollectionSidebar();
  initSortBy();

  window.__cartDrawer = new CartDrawer();
});
