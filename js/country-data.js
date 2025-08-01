// Country data for dynamic content loading
const countryData = {
  uk: {
    title: "Study in United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=800&fit=crop",
    description1: "Embark on your UK education journey with Melford International! We offer comprehensive support to help you access world-renowned universities and navigate the application process seamlessly.",
    description2: "Experience the rich academic heritage of the UK with globally recognized qualifications that open doors worldwide!",
    benefits: [
      "World-Class Universities", "Globally Recognized Degrees", "Rich Cultural Heritage", "Research Excellence",
      "Graduate Immigration Route", "Diverse Academic Programs", "English Language Advantage", "Gateway to Europe"
    ]
  },
  canada: {
    title: "Study in Canada",
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1200&h=800&fit=crop",
    description1: "Begin your Canadian education adventure with Melford International! We guide you through Canada's excellent education system and help secure your path to success.",
    description2: "Explore Canada's top-ranked universities and colleges while experiencing one of the world's most welcoming countries!",
    benefits: [
      "High Quality Education", "Post-Graduation Work Permit", "Pathway to Permanent Residency", "Affordable Tuition Fees",
      "Multicultural Environment", "Safe & Peaceful Country", "Bilingual Opportunities", "Co-op Programs Available"
    ]
  },
  australia: {
    title: "Study in Australia",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    description1: "Start your Australian study journey with Melford International! We provide expert guidance to help you access Australia's world-renowned education system and vibrant student life.",
    description2: "Discover Australia's top universities and endless opportunities in one of the world's most liveable countries!",
    benefits: [
      "Top Quality Education", "Work Ready Graduates", "Work while studying", "Post Study Work Visa",
      "Diverse Course Options", "Multi-Cultural Community", "Diverse and Inclusive Environment", "Excellent Quality of Life"
    ]
  },
  germany: {
    title: "Study in Germany",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=800&fit=crop",
    description1: "Start your German study adventure with Melford International! We guide you through Germany's excellent education system and help you access some of Europe's finest universities.",
    description2: "Study in the heart of Europe with world-class education, cutting-edge research, and excellent career prospects!",
    benefits: [
      "Tuition-Free Education", "World-Class Universities", "Strong Economy", "Research Excellence",
      "Stay-Back Options", "Central European Location", "Industrial Powerhouse", "English-Taught Programs"
    ]
  },
  malaysia: {
    title: "Study in Malaysia",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop",
    description1: "Begin your Malaysian education journey with Melford International! We help you access quality education at affordable costs in one of Asia's most vibrant countries.",
    description2: "Experience Malaysia's multicultural environment and excellent education system with international university campuses!",
    benefits: [
      "Affordable Education", "International University Branches", "Multicultural Society", "English-Taught Programs",
      "Strategic Location in Asia", "Modern Infrastructure", "Cultural Diversity", "Gateway to Southeast Asia"
    ]
  },
  ireland: {
    title: "Study in Ireland",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=1200&h=800&fit=crop",
    description1: "Start your Irish study journey with Melford International! We provide expert guidance, helping you find the perfect course, navigate applications, and secure your visa.",
    description2: "Discover Ireland's top universities and endless opportunities – let's make your dream a reality!",
    benefits: [
      "Top Quality Education", "Work Ready Graduates", "Work while studying", "Post Study Work Visa",
      "Diverse Course Options", "Multi-Cultural Community", "English Speaking Country", "EU Access & Opportunities"
    ]
  },
  newzealand: {
    title: "Study in New Zealand",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
    description1: "Begin your New Zealand education journey with Melford International! We help you navigate the pathway to world-class education in one of the most beautiful countries on Earth.",
    description2: "Experience New Zealand's innovative teaching methods and stunning natural environment while building your future!",
    benefits: [
      "Innovative Education System", "Small Class Sizes", "Safe & Peaceful Environment", "Post-Study Work Rights",
      "Practical Learning Approach", "English Speaking Country", "Adventure & Lifestyle", "Pathway to Residency"
    ]
  },
  dubai: {
    title: "Study in Dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop",
    description1: "Launch your Dubai study experience with Melford International! We connect you with prestigious international universities and provide comprehensive support for your academic journey.",
    description2: "Study in the heart of the Middle East's business hub with world-class facilities and global networking opportunities!",
    benefits: [
      "International University Branches", "Tax-Free Income", "Strategic Business Location", "Modern Infrastructure",
      "Multicultural Society", "Gateway to Middle East & Asia", "English-Taught Programs", "Excellent Career Prospects"
    ]
  }
};

// Function to change country content dynamically
function changeCountry(country) {
  const data = countryData[country];
  if (!data) return;

  // Update title
  if (document.querySelector('.country-title')) {
    document.querySelector('.country-title').textContent = data.title;
    document.title = `Melford International - ${data.title}`;
  }

  // Update image
  if (document.querySelector('.content-section')) {
    document.querySelector('.content-section').style.backgroundImage = 
      `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('${data.image}')`;
  }

  // Update descriptions
  const descriptions = document.querySelectorAll('.description');
  if (descriptions.length >= 2) {
    descriptions[0].textContent = data.description1;
    descriptions[1].textContent = data.description2;
  }

  // Update benefits
  const benefitItems = document.querySelectorAll('.benefit-item');
  data.benefits.forEach((benefit, index) => {
    if (benefitItems[index]) {
      benefitItems[index].innerHTML = `<span class="check-icon">✓</span>${benefit}`;
    }
  });
}