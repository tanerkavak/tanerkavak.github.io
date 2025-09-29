// Masaüstü butonları için tooltip
const tooltipButtons = document.querySelectorAll('.desktop-buttons [data-bs-toggle="tooltip"]');

tooltipButtons.forEach(btn => {
  const tooltip = new bootstrap.Tooltip(btn, { 
    trigger: 'manual',
    customClass: 'custom-tooltip'
  });
  let visible = false;

  btn.addEventListener('mouseenter', () => {
    tooltip.show();
    visible = true;
  });

  btn.addEventListener('mouseleave', () => {
    if (visible) {
      tooltip.hide();
      visible = false;
    }
  });
});

// Mobil menü butonları için tooltip
const mobileMenuButtons = document.querySelectorAll('.mobile-menu-button');

mobileMenuButtons.forEach(btn => {
  const tooltip = new bootstrap.Tooltip(btn, { 
    trigger: 'hover',
    customClass: 'custom-tooltip'
  });
});

// Hamburger Menü Script
const menuToggle = document.getElementById('menuToggle');
const navbarMenu = document.getElementById('navbarMenu');

menuToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  if (navbarMenu.style.display === 'grid') {
    navbarMenu.style.display = 'none';
  } else {
    navbarMenu.style.display = 'grid';
  }
});

document.addEventListener('click', (event) => {
  if (!navbarMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    navbarMenu.style.display = 'none';
  }
});
