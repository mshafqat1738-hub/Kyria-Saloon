document.addEventListener('DOMContentLoaded', () => {
  const SALON_WHATSAPP_NUMBER = '96550754655'; // +965 507 54655

  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Service Category Filter Tabs
  const filterButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const category = button.dataset.filter;
      serviceCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 3. Auto-fill Service & Scroll to Booking Tab from Service Cards
  const serviceSelect = document.getElementById('serviceSelect');
  const bookingSection = document.getElementById('booking');

  document.querySelectorAll('.service-book-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenService = btn.dataset.service;
      if (serviceSelect && chosenService) {
        serviceSelect.value = chosenService;
      }
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.getElementById('clientName')?.focus();
      }, 500);
    });
  });

  // 4. Set Minimum Booking Date to Today
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  // 5. Submit Booking Directly to WhatsApp
  const bookingForm = document.getElementById('whatsappBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const date = document.getElementById('preferredDate').value;
      const time = document.getElementById('preferredTime').value;
      const notes = document.getElementById('bookingNotes').value.trim();

      const messageLines = [
        'Hello Kyria Saloon! I would like to book an appointment:',
        '',
        `*Name:* ${name}`,
        phone ? `*Client Phone:* ${phone}` : null,
        `*Service:* ${service}`,
        `*Preferred Date:* ${date}`,
        `*Preferred Time:* ${time}`,
        notes ? `*Notes:* ${notes}` : null,
        '',
        'Location: Block 10, Salmiya, Kuwait'
      ].filter(line => line !== null);

      const encodedMessage = encodeURIComponent(messageLines.join('\n'));
      const whatsappUrl = `https://wa.me/${SALON_WHATSAPP_NUMBER}?text=${encodedMessage}`;

      const a = document.createElement('a');
      a.href = whatsappUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
});