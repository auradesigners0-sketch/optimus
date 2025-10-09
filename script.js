// Initialize EmailJS with your public key
    (function() {
        emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
    })
// Home Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;
    let autoSlideInterval;


    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from current slide and indicator
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        // Set new slide as active
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    // Function to go to next slide
    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) newIndex = 0;
        showSlide(newIndex);
    }

    // Function to go to previous slide
    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        showSlide(newIndex);
    }

    // Start auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // Stop auto slide
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Start auto slide initially
    startAutoSlide();

    // Pause auto slide on hover
    const homeSlider = document.querySelector('.home-slider');
    homeSlider.addEventListener('mouseenter', stopAutoSlide);
    homeSlider.addEventListener('mouseleave', startAutoSlide);

    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Touch events for swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;

    homeSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    homeSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right
            prevSlide();
        }
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

    // Contact Popup Functionality
    const contactPopup = document.getElementById('contact-popup');
    const openPopupBtn = document.getElementById('open-contact-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const contactForm = document.getElementById('contact-form');
    
    // Function to open the popup
    function openContactPopup() {
        contactPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }
    
    // Function to close the popup
    function closeContactPopup() {
        contactPopup.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Event listener to open the popup
    if (openPopupBtn) {
        openPopupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openContactPopup();
        });
    }
    
    // Event listener to close the popup when clicking the close button
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closeContactPopup);
    }
    
    // Event listener to close the popup when clicking outside the popup content
    contactPopup.addEventListener('click', function(e) {
        if (e.target === contactPopup) {
            closeContactPopup();
        }
    });
    
    // Handle form submission with EmailJS
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const params = {
                first_name: formData.get('first-name'),
                last_name: formData.get('last-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                message: formData.get('message')
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params)
                .then(() => {
                    alert('Your message has been sent successfully!');
                    contactForm.reset();
                    closeContactPopup();
                })
                .catch(() => {
                    alert('There was an issue sending your message. Please try again later.');
                });
        });
    }

    // Counter Animation for Stats Section
    const counters = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');
    let statsAnimationId = null;
    let isStatsAnimating = false;
    
    // Function to reset stats counters to 0
    function resetStatsCounters() {
        counters.forEach(counter => {
            counter.innerText = '0';
        });
    }
    
    // Function to animate stats counters
    function animateStatsCounters() {
        if (isStatsAnimating) return; // Prevent multiple animations
        
        isStatsAnimating = true;
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
    
    // Using Intersection Observer to trigger animation when stats section is in view
    if (statsSection) {
        const observerOptions = {
            threshold: 0.5 // Trigger when 50% of the section is visible
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When section comes into view, animate counters
                    animateStatsCounters();
                } else {
                    // When section goes out of view, reset counters
                    if (statsAnimationId) {
                        cancelAnimationFrame(statsAnimationId);
                        statsAnimationId = null;
                    }
                    resetStatsCounters();
                    isStatsAnimating = false;
                }
            });
        }, observerOptions);
        
        observer.observe(statsSection);
    }

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
    
    // Hide page loader when content is loaded
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageLoader.classList.add('hidden');
            }, 2000); // 2 seconds to match the animation duration
        });
    }
});