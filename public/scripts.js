document.addEventListener('DOMContentLoaded', () => {
  try {
    const ver = document.querySelector('meta[name="app-version"]')?.getAttribute('content') || 'dev';
    console.log(`YellowCars app version: ${ver}`);
  } catch {}
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const burger = document.querySelector('.burger');
  const mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      if (mobileNav.hasAttribute('hidden')) {
        mobileNav.removeAttribute('hidden');
        mobileNav.setAttribute('open', '');
      } else {
        mobileNav.setAttribute('hidden', '');
        mobileNav.removeAttribute('open');
      }
    });
  }

  // Form: phone mask, client validation, success plate
  const form = document.querySelector('form.contact-form');
  const success = document.getElementById('form-success');
  const phoneInput = form?.querySelector('input[name="phone"]');
  const nameInput = form?.querySelector('input[name="name"]');

  function updateFormStateFromStorage() {
    const sent = sessionStorage.getItem('contactSent') === '1';
    if (form && success) {
      if (sent) {
        form.classList.add('is-hidden');
        success.classList.remove('is-hidden');
      } else {
        success.classList.add('is-hidden');
        form.classList.remove('is-hidden');
      }
    }
  }
  updateFormStateFromStorage();

  function maskPhone(digits) {
    // Only digits, limit to 12: 375 + 2 + 3 + 2 + 2 = 12
    const d = digits.replace(/\D/g, '').slice(0, 12);
    const a = d.slice(0, 3); // 375
    const b = d.slice(3, 5);
    const c = d.slice(5, 8);
    const e = d.slice(8, 10);
    const f = d.slice(10, 12);
    let out = '';
    if (a) out += `+${a}`;
    if (b) out += ` (${b}${b.length===2 ? ') ' : ''}`;
    if (c) out += c.length===3 ? `${c}-` : c;
    if (e) out += e.length===2 ? `${e}-` : e;
    if (f) out += f;
    return out;
  }

  if (phoneInput) {
    const start = '+375 ';
    if (!phoneInput.value) phoneInput.value = start;
    phoneInput.addEventListener('beforeinput', (e) => {
      // Block non-digits except deletion
      const allowed = ['deleteContentBackward','deleteContentForward'];
      if (e.data && /\D/.test(e.data)) e.preventDefault();
      if (e.inputType && !allowed.includes(e.inputType) && e.data && /\D/.test(e.data)) e.preventDefault();
    });
    phoneInput.addEventListener('input', (e) => {
      const v = String(e.target.value || '');
      const digits = v.replace(/\D/g, '');
      let withCountry = digits;
      if (!digits.startsWith('375')) withCountry = '375' + digits;
      e.target.value = maskPhone(withCountry);
    });
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = start;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      // Client validation
      const nameOk = Boolean(nameInput?.value?.trim());
      const phoneOk = /^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/.test(String(phoneInput?.value || ''));
      if (!nameOk || !phoneOk) {
        e.preventDefault();
        if (!nameOk) nameInput?.focus();
        else phoneInput?.focus();
        return;
      }

      // Netlify will handle submit; prevent page jump and show success plate optimistically
      e.preventDefault();
      const formData = new FormData(form);
      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        params.append(key, String(value));
      }
      const action = form.getAttribute('action') || '/';
      fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      })
        .then(() => {
          sessionStorage.setItem('contactSent', '1');
          form.classList.add('is-hidden');
          success?.classList.remove('is-hidden');
          success?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(() => {
          sessionStorage.setItem('contactSent', '1');
          form.classList.add('is-hidden');
          success?.classList.remove('is-hidden');
        });
    });
  }

  // Handle bfcache (back-forward cache)
  window.addEventListener('pageshow', () => updateFormStateFromStorage());
});

