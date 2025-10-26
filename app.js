// Application data
const studioData = {
  name: "Prototyping Studio",
  tagline: "Professional 3D printing, modeling and prototyping"
};

// Blog posts and services will be loaded from JSON files
let blogPosts = [];
let services = [];

const contactInfo = {
  email: "studio@3dprint.ge",
  telegram: "@3dstudio_tbilisi",
  phone: "+995 555 123 456",
  address: "Tbilisi, Georgia",
  location: {
    lat: 41.7151,
    lng: 44.8271
  }
};

// Global variables
let map = null;

// Modal functionality
function openModal(title, content) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalTitle || !modalBody) {
    console.error('Modal elements not found!');
    return;
  }
  
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.classList.add('active');
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
  
  // Restore body scroll
  document.body.style.overflow = '';
}

// Load services from JSON
async function loadServices() {
  try {
    const response = await fetch('services/index.json');
    services = await response.json();
    return services;
  } catch (error) {
    console.error('Error loading services:', error);
    return [];
  }
}

// Initialize services section
function initializeServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;
  
  servicesGrid.innerHTML = '';
  
  services.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.serviceId = service.id;
    card.innerHTML = `
      <div class="service-icon"><i class="${service.icon}"></i></div>
      <h3>${service.title}</h3>
      <p>${service.excerpt}</p>
    `;
    
    card.addEventListener('click', () => showServiceDetails(service));
    servicesGrid.appendChild(card);
  });
}

// Show service details in modal
async function showServiceDetails(service) {
  try {
    const response = await fetch(`services/${service.filename}`);
    const markdown = await response.text();
    
    // Convert markdown to HTML
    let html;
    if (typeof marked !== 'undefined') {
      html = typeof marked.parse === 'function' ? marked.parse(markdown) : marked(markdown);
    } else {
      html = '<pre>' + markdown + '</pre>';
      console.warn('Marked library not loaded, displaying raw markdown');
    }
    
    openModal(service.title, html);
  } catch (error) {
    console.error('Error loading service details:', error);
    openModal(service.title, '<p>Failed to load service details.</p>');
  }
}

// Navigation functionality
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionId) {
      link.classList.add('active');
    }
  });
  
  // Initialize section-specific functionality
  if (sectionId === 'blog' && !document.getElementById('blog-list').hasChildNodes()) {
    initializeBlog();
  } else if (sectionId === 'contacts' && !map) {
    initializeContacts();
  }
}

// Blog functionality
async function loadBlogPosts() {
  try {
    const response = await fetch('blog/index.json');
    blogPosts = await response.json();
    return true;
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return false;
  }
}

function initializeBlog() {
  const blogList = document.getElementById('blog-list');
  
  if (blogPosts.length === 0) {
    blogList.innerHTML = '<p>Loading blog posts...</p>';
    return;
  }
  
  blogList.innerHTML = '';
  
  blogPosts.forEach((post, index) => {
    const blogItem = document.createElement('div');
    blogItem.className = 'blog-item';
    blogItem.style.cursor = 'pointer';
    
    blogItem.innerHTML = `
      <h3 class="blog-title">${post.title}</h3>
      <div class="blog-date">${formatDate(post.date)}</div>
      <p class="blog-excerpt">${post.excerpt}</p>
    `;
    
    blogItem.addEventListener('click', () => {
      showBlogPost(index);
    });
    
    blogList.appendChild(blogItem);
  });
}

// Show blog post in modal
async function showBlogPost(index) {
  const post = blogPosts[index];
  
  try {
    // Fetch markdown content
    const response = await fetch(`blog/${post.filename}`);
    const markdownContent = await response.text();
    
    // Render markdown content
    let htmlContent;
    if (typeof marked !== 'undefined') {
      htmlContent = typeof marked.parse === 'function' ? marked.parse(markdownContent) : marked(markdownContent);
    } else {
      htmlContent = '<pre>' + markdownContent + '</pre>';
      console.warn('Marked library not loaded, displaying raw markdown');
    }
    
    // Open modal with content
    openModal(post.title, htmlContent);
  } catch (error) {
    console.error('Failed to load blog post:', error);
    openModal(post.title, '<p>Failed to load blog post. Please try again.</p>');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Contacts functionality
function initializeContacts() {
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded');
    return;
  }
  
  map = L.map('map').setView([contactInfo.location.lat, contactInfo.location.lng], 12);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  L.marker([contactInfo.location.lat, contactInfo.location.lng])
    .addTo(map)
    .bindPopup(`<strong>Prototyping Studio</strong><br>${contactInfo.address}`);
}

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
  // Load blog posts and services
  await Promise.all([
    loadBlogPosts(),
    loadServices()
  ]);
  
  // Initialize blog and services
  initializeBlog();
  initializeServices();
  
  // Set up navigation event listeners
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.dataset.section;
      showSection(sectionId);
    });
  });
  
  // Set up modal close handlers
  const modalClose = document.getElementById('modal-close');
  const modal = document.getElementById('modal');
  
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modal) {
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
  
  // Show blog section by default
  showSection('blog');
  
  // Initialize contacts and map
  initializeContacts();
  
  // Mobile menu toggle (basic implementation)
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }
});
