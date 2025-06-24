// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Navigation functionality
function showSection(targetSectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === targetSectionId) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top of section
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.dataset.section;
        showSection(targetSection);
        
        // Update URL hash without scrolling
        history.pushState(null, null, `#${targetSection}`);
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    } else {
        showSection('overview');
    }
});

// Initialize page based on URL hash
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    } else {
        showSection('overview');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effects to cards
function addHoverEffects() {
    const cards = document.querySelectorAll(
        '.stat-card, .chart-card, .innings-card, .quote-card, .theory-card, .solution-card'
    );
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', addHoverEffects);

// Intersection Observer for section detection (optional enhancement)
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observe all sections for scroll-based navigation updates
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Add loading animation for images
function handleImageLoading() {
    const images = document.querySelectorAll('.chart-image');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease-in-out';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
        });
        
        // Handle error cases
        img.addEventListener('error', () => {
            img.style.border = '2px dashed var(--color-border)';
            img.style.padding = '20px';
            img.alt = 'Chart could not be loaded';
        });
    });
}

// Initialize image loading effects
document.addEventListener('DOMContentLoaded', handleImageLoading);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        const currentActiveLink = document.querySelector('.nav-link.active');
        const currentIndex = Array.from(navLinks).indexOf(currentActiveLink);
        
        if (e.key === 'ArrowRight' && currentIndex < navLinks.length - 1) {
            e.preventDefault();
            navLinks[currentIndex + 1].click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            navLinks[currentIndex - 1].click();
        }
    }
});

// Add tooltip functionality for statistics
function addTooltips() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const parentItem = stat.closest('.stat-item');
        const label = parentItem?.querySelector('.stat-label')?.textContent;
        
        if (label) {
            stat.setAttribute('title', `${label}: ${stat.textContent}`);
        }
    });
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', addTooltips);

// Add progressive enhancement for better UX
function enhanceUserExperience() {
    // Add loading states
    document.body.classList.add('loaded');
    
    // Animate cards on section change
    const animateCards = (section) => {
        const cards = section.querySelectorAll(
            '.stat-card, .chart-card, .innings-card, .quote-card, .theory-card, .solution-card'
        );
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    };
    
    // Override showSection to include animations
    const originalShowSection = showSection;
    showSection = function(targetSectionId) {
        originalShowSection(targetSectionId);
        
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            setTimeout(() => animateCards(targetSection), 100);
        }
    };
}

// Initialize enhanced UX
document.addEventListener('DOMContentLoaded', enhanceUserExperience);

// Add search functionality for sections (bonus feature)
function addQuickSearch() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            
            const searchTerm = prompt('Quick navigate to section (overview, charts, innings, insights, mystery, solutions):');
            if (searchTerm) {
                const normalizedTerm = searchTerm.toLowerCase().trim();
                const validSections = ['overview', 'charts', 'innings', 'insights', 'mystery', 'solutions'];
                
                if (validSections.includes(normalizedTerm)) {
                    showSection(normalizedTerm);
                } else {
                    // Try partial matching
                    const match = validSections.find(section => section.includes(normalizedTerm));
                    if (match) {
                        showSection(match);
                    } else {
                        alert('Section not found. Available sections: ' + validSections.join(', '));
                    }
                }
            }
        }
    });
}

// Initialize quick search
document.addEventListener('DOMContentLoaded', addQuickSearch);

// Analytics tracking (placeholder for future implementation)
function trackSectionView(sectionId) {
    // Placeholder for analytics tracking
    console.log(`Section viewed: ${sectionId}`);
}

// Track section views
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        trackSectionView(link.dataset.section);
    });
});

// Add print styles support
function handlePrint() {
    window.addEventListener('beforeprint', () => {
        // Show all sections for printing
        sections.forEach(section => {
            section.classList.add('active');
        });
    });
    
    window.addEventListener('afterprint', () => {
        // Restore original state
        const activeNavLink = document.querySelector('.nav-link.active');
        if (activeNavLink) {
            showSection(activeNavLink.dataset.section);
        }
    });
}

// Initialize print handling
document.addEventListener('DOMContentLoaded', handlePrint);

// Add performance monitoring
function monitorPerformance() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        }
    });
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', monitorPerformance);