// Determine the correct base path to partials dynamically
let depth = window.location.pathname.split('/').length - 2;
let basePath = '../'.repeat(depth);

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
