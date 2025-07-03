document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Enhanced reveal animation with intersection observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        
        // Add staggered animation for cards
        if (entry.target.classList.contains('project-card') || entry.target.classList.contains('skill-card')) {
          const cards = entry.target.parentElement.children;
          Array.from(cards).forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('show');
            }, index * 150);
          });
        }

        // Animate skill progress bars
        if (entry.target.classList.contains('skill-card')) {
          const progressBar = entry.target.querySelector('.skill-progress');
          const percentage = entry.target.querySelector('.skill-level span').textContent;
          if (progressBar) {
            progressBar.style.setProperty('--progress-width', percentage);
            setTimeout(() => {
              progressBar.style.width = percentage;
            }, 500);
          }
        }

        // Animate timeline items
        if (entry.target.classList.contains('journey-timeline')) {
          const timelineItems = entry.target.querySelectorAll('.timeline-item');
          timelineItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('show');
            }, index * 200);
          });
        }
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhanced contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Auto-resize for textarea
    const messageTextarea = contactForm.querySelector('textarea[name="message"]');
    if (messageTextarea) {
      messageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight + 2) + 'px';
      });
      // Optional: reset height on page load
      messageTextarea.style.height = 'auto';
      messageTextarea.style.height = (messageTextarea.scrollHeight + 2) + 'px';
    }

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const name = formData.get('name');
      const message = formData.get('message');
      
      // Validate form
      if (!name.trim() || !message.trim()) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
      }
      
      // Create Gmail compose URL with pre-filled information
      const subject = "New message from Portfolio - Gửi tới Phi Hùng";
      const body = `Name: ${name}\n\nMessage:\n${message}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=phihung3922@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Add loading state to button
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Đang mở Gmail...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        window.open(gmailUrl, '_blank');
        showToast('Đã mở Gmail. Vui lòng kiểm tra và gửi email!', 'success');
        
        // Reset form and button
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // Enhanced toast notification system
  function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.custom-toast').forEach(toast => toast.remove());
    
    let toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${getToastIcon(type)}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  function getToastIcon(type) {
    switch(type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  }

  // Add hover effects to project and skill cards
  document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add parallax effect to background
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('body::before');
    if (parallax) {
      const speed = scrolled * 0.5;
      document.body.style.setProperty('--parallax-y', `${speed}px`);
    }
  });

  // Add loading animation
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });

  // Add click effects to buttons
  document.querySelectorAll('button, .connect-icon, .cta-button').forEach(element => {
    element.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add scroll progress indicator
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

  // Initialize tooltips for social links
  document.querySelectorAll('.connect-icon').forEach(icon => {
    const platform = icon.getAttribute('aria-label');
    if (platform) {
      icon.setAttribute('title', `Visit my ${platform} profile`);
    }
  });

  // Add counter animation for stats
  const stats = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const counter = setInterval(() => {
          currentValue += increment;
          if (currentValue >= finalValue) {
            target.textContent = finalValue + '+';
            clearInterval(counter);
          } else {
            target.textContent = Math.floor(currentValue) + '+';
          }
        }, 30);
        
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));

  // Timeline hover effects
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('.timeline-marker').style.transform = 'translateX(-50%) scale(1.1)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.querySelector('.timeline-marker').style.transform = 'translateX(-50%) scale(1)';
    });
  });

  // Achievement tags hover effect
  document.querySelectorAll('.achievement-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Reload page when clicking logo
const logoReload = document.getElementById('logo-reload');
if (logoReload) {
  logoReload.addEventListener('click', function(e) {
    e.preventDefault();
    // Redirect to the root of the GitHub Pages site
    window.location.href = '/phihung3922.github.io/';
  });
}


  // Hero staggered animation (typing effect for h1)
  setTimeout(() => {
    const h1 = document.querySelector('.hero-animate.h1');
    if (h1) {
      const text = h1.textContent;
      h1.textContent = '';
      h1.classList.add('typing');
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '|';
      h1.appendChild(cursor);
      function typeChar() {
        if (i < text.length) {
          const span = document.createElement('span');
          span.className = 'typing-char';
          span.textContent = text.charAt(i);
          h1.insertBefore(span, cursor);
          setTimeout(() => {
            span.classList.add('visible');
          }, 10);
          i++;
          setTimeout(typeChar, 28); // chỉnh số này để điều chỉnh tốc độ xuất hiện từng chữ
        } else {
          cursor.remove();
        }
      }
      setTimeout(typeChar, 200);
    }
  }, 100);
  setTimeout(() => {
    const p = document.querySelector('.hero-animate.p');
    if (p) p.classList.add('show');
  }, 300);
  setTimeout(() => {
    const cta = document.querySelector('.hero-animate.cta');
    if (cta) cta.classList.add('show');
  }, 500);
  setTimeout(() => {
    const avatar = document.querySelector('.hero-animate.avatar');
    if (avatar) avatar.classList.add('show');
  }, 700);

  // About Me reveal on scroll (Intersection Observer, animate mỗi lần vào viewport)
  const aboutSection = document.querySelector('.about-animate');
  if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('show');
        } else {
          aboutSection.classList.remove('show');
        }
      });
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutSection);
  }

  // Back to top button
  const backToTopBtn = document.querySelector('.back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
