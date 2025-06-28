// main.js - Enhanced version with improved functionality

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Enhanced smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  });
});

// Enhanced header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('header');

const handleScroll = throttle(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Add/remove shadow based on scroll position
  if (scrollTop > 10) {
    header.classList.add('shadow-lg');
    header.classList.remove('shadow');
  } else {
    header.classList.add('shadow');
    header.classList.remove('shadow-lg');
  }
  
  // Hide/show header on scroll (optional)
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    header.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    header.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);

// Enhanced theme toggle with system preference detection
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlEl = document.documentElement;

// Check for saved theme preference or default to system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme
const applyTheme = (theme) => {
  if (theme === 'dark') {
    htmlEl.classList.add('dark');
    updateThemeIcon('light');
  } else {
    htmlEl.classList.remove('dark');
    updateThemeIcon('dark');
  }
  localStorage.setItem('theme', theme);
};

// Update theme icon
const updateThemeIcon = (nextTheme) => {
  if (nextTheme === 'dark') {
    // Show moon icon (will switch to dark mode)
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    `;
  } else {
    // Show sun icon (will switch to light mode)
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 3v1m0 16v1m8.66-9h-1M3.34 12h-1M17.657 6.343l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707" />
    `;
  }
};

// Initialize theme
const currentTheme = getInitialTheme();
applyTheme(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
  const isDark = htmlEl.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  
  // Add ripple effect
  const ripple = document.createElement('span');
  ripple.classList.add('absolute', 'inset-0', 'rounded-lg', 'bg-current', 'opacity-20', 'scale-0');
  themeToggle.appendChild(ripple);
  
  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(1)';
    ripple.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    
    setTimeout(() => {
      ripple.style.opacity = '0';
      setTimeout(() => ripple.remove(), 300);
    }, 200);
  });
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

// Enhanced project filtering with animations
const filterButtons = document.querySelectorAll('[data-filter]');
const projectItems = document.querySelectorAll('.project-item');

const filterProjects = (filter) => {
  projectItems.forEach((item, index) => {
    const itemType = item.getAttribute('data-type');
    const shouldShow = filter === 'all' || itemType === filter;
    
    if (shouldShow) {
      // Show with staggered animation
      setTimeout(() => {
        item.style.display = 'block';
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
          item.style.transition = 'all 0.4s ease-out';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        });
      }, index * 100);
    } else {
      // Hide with animation
      item.style.transition = 'all 0.3s ease-out';
      item.style.opacity = '0';
      item.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
};

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    
    // Update active button styles
    filterButtons.forEach(btn => {
      if (btn === button) {
        btn.className = 'px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium';
      } else {
        btn.className = 'px-6 py-3 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full shadow-md hover:shadow-lg border border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-600 transition-all duration-200 font-medium';
      }
    });
    
    // Filter projects
    filterProjects(filter);
  });
});

// Enhanced back to top button
const backToTopButton = document.getElementById('back-to-top');
let isVisible = false;

const toggleBackToTop = throttle(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const shouldShow = scrollTop > 300;
  
  if (shouldShow && !isVisible) {
    isVisible = true;
    backToTopButton.classList.remove('hidden');
    backToTopButton.style.opacity = '0';
    backToTopButton.style.transform = 'translateY(20px) scale(0.8)';
    
    requestAnimationFrame(() => {
      backToTopButton.style.transition = 'all 0.3s ease-out';
      backToTopButton.style.opacity = '1';
      backToTopButton.style.transform = 'translateY(0) scale(1)';
    });
  } else if (!shouldShow && isVisible) {
    isVisible = false;
    backToTopButton.style.transition = 'all 0.3s ease-out';
    backToTopButton.style.opacity = '0';
    backToTopButton.style.transform = 'translateY(20px) scale(0.8)';
    
    setTimeout(() => {
      backToTopButton.classList.add('hidden');
    }, 300);
  }
}, 100);

window.addEventListener('scroll', toggleBackToTop);

backToTopButton.addEventListener('click', () => {
  // Add click animation
  backToTopButton.style.transform = 'translateY(0) scale(0.9)';
  
  setTimeout(() => {
    backToTopButton.style.transform = 'translateY(0) scale(1)';
  }, 150);
  
  // Smooth scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Animate skill bars when they come into view
const animateSkillBars = () => {
  const skillBars = document.querySelectorAll('[style*="width"]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        
        // Reset and animate
        bar.style.width = '0%';
        bar.style.transition = 'width 1.5s ease-out';
        
        setTimeout(() => {
          bar.style.width = width;
        }, 200);
        
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => observer.observe(bar));
};

// Initialize skill bar animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(animateSkillBars, 500);
});

// Enhanced form handling (if contact form exists)
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Đang gửi...';
    submitButton.disabled = true;
    
    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      showNotification('Tin nhắn đã được gửi thành công!', 'success');
      contactForm.reset();
    } catch (error) {
      // Show error message
      showNotification('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
    } finally {
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}

// Enhanced notification system
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center justify-between">
      <span>${message}</span>
      <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(full)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
};

// Enhanced lazy loading for images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('animate-fadeInUp');
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

// Performance optimization: Reduce motion for users who prefer it
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty('--transition-fast', '0s');
  document.documentElement.style.setProperty('--transition-normal', '0s');
  document.documentElement.style.setProperty('--transition-slow', '0s');
}

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
  // ESC key to close any open modals or reset filters
  if (e.key === 'Escape') {
    // Reset project filters to show all
    const allButton = document.querySelector('[data-filter="all"]');
    if (allButton) {
      allButton.click();
    }
  }
  
  // Enter key on filter buttons
  if (e.key === 'Enter' && e.target.hasAttribute('data-filter')) {
    e.target.click();
  }
});

console.log('🚀 Portfolio enhanced scripts loaded successfully!');