// Determine the correct base path to partials dynamically
let depth = window.location.pathname.split('/').length - 2;
let basePath = '../'.repeat(depth);

// Load Navbar
fetch(basePath + 'partials/navbar.html')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.innerHTML = data;
      setTimeout(() => {
        initializeHamburgerMenu();
      }, 200);
    } else {
      console.warn('Navbar div not found on this page.');
    }
  })
  .catch(error => console.error('Navbar load error:', error));

// Load Footer
fetch(basePath + 'partials/footer.html')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = data;
    } else {
      console.warn('Footer placeholder not found on this page.');
    }
  })
  .catch(error => console.error('Footer load error:', error));

// Initialize Hamburger Menu
function initializeHamburgerMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (navToggle && mobileMenu) {
    // Remove any existing event listeners to prevent duplicates
    navToggle.replaceWith(navToggle.cloneNode(true));
    const newNavToggle = document.getElementById('navToggle');
    
    newNavToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = mobileMenu.classList.contains('active');
      
      if (isActive) {
        mobileMenu.classList.remove('active');
        newNavToggle.classList.remove('active');
      } else {
        mobileMenu.classList.add('active');
        newNavToggle.classList.add('active');
      }
    });
    
    // Close menu when clicking on menu links
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        newNavToggle.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!newNavToggle.contains(event.target) && 
          !mobileMenu.contains(event.target) &&
          mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        newNavToggle.classList.remove('active');
      }
    });
  } else {
    // Retry initialization after another delay
    setTimeout(() => {
      initializeHamburgerMenu();
    }, 500);
  }
}

// Fallback: Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if navbar elements already exist (in case fetch was very fast)
  const existingNavToggle = document.getElementById('navToggle');
  if (existingNavToggle) {
    initializeHamburgerMenu();
  }
});