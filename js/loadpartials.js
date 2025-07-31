// Determine correct path based on location
let basePath = '';
if (window.location.pathname.includes('/pages/')) {
  basePath = '../';
}

// Load Topbar
fetch(basePath + 'partials/topbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('topbar-placeholder').innerHTML = data;
  })
  .catch(error => console.error('Topbar load error:', error));

// Load Navbar
fetch(basePath + 'partials/navbar.html')
  .then(response => response.text())
  .then(data => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.innerHTML = data;
    } else {
      console.warn('Navbar div not found on this page.');
    }
  })
  .catch(error => console.error('Navbar load error:', error));

// Load Footer
fetch(basePath + 'partials/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  })
  .catch(error => console.error('Footer load error:', error));
