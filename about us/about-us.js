document.addEventListener('DOMContentLoaded', function() {
    // Hide page loader when content is loaded
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageLoader.classList.add('hidden');
            }, 2000); // 2 seconds to match the animation duration
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const menuPanel = document.getElementById('menu-panel');
    const closeMenu = document.getElementById('close-menu');

    if (menuBtn && menuPanel && closeMenu) {
        menuBtn.addEventListener('click', () => {
            menuPanel.classList.add('active');
            menuBtn.setAttribute('aria-expanded', 'true');
        });

        closeMenu.addEventListener('click', () => {
            menuPanel.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Contact Panel Toggle
    const contactBtn = document.getElementById('contact-btn');
    const contactPanel = document.getElementById('contact-panel');
    const closeContact = document.getElementById('close-contact');

    if (contactBtn && contactPanel && closeContact) {
        contactBtn.addEventListener('click', () => {
            contactPanel.classList.add('active');
            contactBtn.setAttribute('aria-expanded', 'true');
        });

        closeContact.addEventListener('click', () => {
            contactPanel.classList.remove('active');
            contactBtn.setAttribute('aria-expanded', 'false');
        });
    }
    
    // About Button Functionality
    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => {
            // Add fade out animation
            document.body.classList.add('fade-out');
            
            // Navigate to the About page after animation completes
            setTimeout(() => {
                window.location.href = 'about.html';
            }, 500);
        });
    }
    
    // Counter Animation for About Stats Section
    const counters = document.querySelectorAll('.about-section .stat-number');
    const aboutSection = document.querySelector('.about-section');
    let statsAnimationId = null;
    let isStatsAnimating = false;
    let hasAnimated = false; // Flag to track if animation has run
    
    // Function to reset stats counters to 0
    function resetStatsCounters() {
        counters.forEach(counter => {
            counter.innerText = '0';
        });
        hasAnimated = false;
    }
    
    // Function to animate stats counters
    function animateStatsCounters() {
        if (isStatsAnimating || hasAnimated) return; // Prevent multiple animations
        
        isStatsAnimating = true;
        hasAnimated = true;
        const duration = 2000; // Animation duration in milliseconds
        const startTime = performance.now();
        
        // Store target values and initial values
        const counterData = Array.from(counters).map(counter => ({
            element: counter,
            target: parseInt(counter.getAttribute('data-target')),
            start: 0,
            current: 0
        }));
        
        function updateStatsCounters(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Update each counter
            counterData.forEach(data => {
                // Calculate the current value with easing
                data.current = Math.floor(data.start + (data.target - data.start) * progress);
                data.element.innerText = data.current;
                
                // If animation is complete, add the plus sign
                if (progress === 1) {
                    data.element.innerText = data.target + '+';
                }
            });
            
            // Continue animation if not complete
            if (progress < 1) {
                statsAnimationId = requestAnimationFrame(updateStatsCounters);
            } else {
                isStatsAnimating = false;
            }
        }
        
        // Start the animation
        statsAnimationId = requestAnimationFrame(updateStatsCounters);
    }
    
    // Using Intersection Observer to trigger animation when about section is in view
    if (aboutSection) {
        const observerOptions = {
            threshold: 0.5 // Trigger when 50% of the section is visible
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    // When section comes into view and hasn't animated yet, animate counters
                    animateStatsCounters();
                }
            });
        }, observerOptions);
        
        observer.observe(aboutSection);
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            // Page is hidden, reset counters
            resetStatsCounters();
        } else if (document.visibilityState === 'visible' && aboutSection) {
            // Page is visible again, check if about section is in view
            const rect = aboutSection.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            // If about section is visible, animate counters
            if (isVisible) {
                animateStatsCounters();
            }
        }
    });
    
    // Handle page unload (when user navigates away)
    window.addEventListener('beforeunload', function() {
        resetStatsCounters();
    });
    
    // Handle page focus (when user returns to the tab)
    window.addEventListener('focus', function() {
        if (aboutSection) {
            const rect = aboutSection.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            // If about section is visible, animate counters
            if (isVisible) {
                animateStatsCounters();
            }
        }
    });
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate the scroll position with header offset
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Smooth scroll to the target section
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add animation class to the target section
                targetSection.classList.add('animate-section');
                
                // Remove the animation class after animation completes
                setTimeout(() => {
                    targetSection.classList.remove('animate-section');
                }, 1000);
                
                // Close mobile menu if open
                if (menuPanel && menuPanel.classList.contains('active')) {
                    menuPanel.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Highlight active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.navbar ul li a');
    
    function highlightActiveLink() {
        const scrollPosition = window.scrollY + headerHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Call the function on scroll
    window.addEventListener('scroll', highlightActiveLink);
    
    // Call the function once on load to set the initial active state
    highlightActiveLink();
    
    // Add page transition animation
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
        // Only apply to internal links
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', function(e) {
                // Skip for anchor links and links that open in new tab
                if (this.getAttribute('href').startsWith('#') || this.getAttribute('target') === '_blank') {
                    return;
                }
                
                e.preventDefault();
                
                // Add fade out animation
                document.body.classList.add('fade-out');
                
                // Navigate to the new page after animation completes
                setTimeout(() => {
                    window.location.href = this.href;
                }, 500);
            });
        }
    });
    
    // Add fade in animation when page loads
    window.addEventListener('load', () => {
        document.body.classList.add('fade-in');
        
        // Remove the animation class after it completes
        setTimeout(() => {
            document.body.classList.remove('fade-in');
        }, 1000);
    });
    
    // Animate sections when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
});