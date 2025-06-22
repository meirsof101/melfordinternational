// js/loadNavbar.js

// Determine correct path to navbar.html based on current page location
let navbarPath = 'partials/navbar.html';

// If this page is inside a folder (like /pages/), go up one level
if (window.location.pathname.includes('/pages/')) {
  navbarPath = '../partials/navbar.html';
}

fetch(navbarPath)
  .then(response => response.text())
  .then(data => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.innerHTML = data;
    } else {
      console.warn('Navbar div not found on this page.');
    }
  })
  .catch(error => console.error('Error loading navbar:', error));
