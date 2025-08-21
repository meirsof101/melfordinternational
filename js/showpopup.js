// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to show success popup
function showSuccessPopup(formType) {
    const popup = document.getElementById('successPopup');
    const title = popup.querySelector('.success-title');
    const message = popup.querySelector('.success-message');
    
    // Update content based on form type
    switch(formType) {
        case 'newsletter':
            popup.className = 'success-popup newsletter';
            title.textContent = 'Subscription Successful!';
            message.textContent = 'Thank you for subscribing to our newsletter. You\'ll receive updates about our latest programs and opportunities.';
            break;
        case 'enquiry':
            popup.className = 'success-popup enquiry';
            title.textContent = 'Enquiry Submitted Successfully!';
            message.textContent = 'Thank you for your enquiry. Our admissions team will review your information and contact you within 24-48 hours.';
            break;
        case 'contact':
        default:
            popup.className = 'success-popup contact';
            title.textContent = 'Message Sent Successfully!';
            message.textContent = 'Thank you for contacting us. We\'ll get back to you as soon as possible.';
            break;
    }
    
    // Show popup with animation
    popup.classList.add('show');
    
    // Auto close after 10 seconds
    setTimeout(() => {
        closeSuccessPopup();
    }, 10000);
}

// Function to close success popup
function closeSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.remove('show');
    
    // Clean URL by removing success parameters
    if (window.history && window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.delete('success');
        url.searchParams.delete('form');
        window.history.replaceState({}, document.title, url.toString());
    }
}

// Check for success parameter on page load
document.addEventListener('DOMContentLoaded', function() {
    const success = getUrlParameter('success');
    const formType = getUrlParameter('form');
    
    if (success === 'true') {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
            showSuccessPopup(formType);
        }, 500);
    }
});

// Close popup when clicking outside the content
document.getElementById('successPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSuccessPopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuccessPopup();
    }
});
