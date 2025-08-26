// Website Analytics and Interaction Tracking
class WebsiteAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = new Date();
        this.interactions = [];
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.trackPageLoad();
        this.setupEventListeners();
        this.trackTimeSpent();
    }

    trackPageLoad() {
        const data = {
            event: 'page_load',
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        this.logInteraction(data);
    }

    setupEventListeners() {
        // Track scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackScroll();
            }, 100);
        });

        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });

        // Track section views
        this.setupIntersectionObserver();
    }

    trackScroll() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        this.logInteraction({
            event: 'scroll',
            scrollPercent: scrollPercent,
            timestamp: new Date().toISOString()
        });
    }

    trackClick(event) {
        const element = event.target;
        const data = {
            event: 'click',
            element: element.tagName,
            className: element.className,
            id: element.id,
            text: element.textContent?.substring(0, 50),
            timestamp: new Date().toISOString()
        };
        this.logInteraction(data);
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.logInteraction({
                        event: 'section_view',
                        section: entry.target.id,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    trackTimeSpent() {
        setInterval(() => {
            const timeSpent = Math.round((new Date() - this.startTime) / 1000);
            this.logInteraction({
                event: 'time_update',
                timeSpent: timeSpent,
                timestamp: new Date().toISOString()
            });
        }, 30000); // Every 30 seconds
    }

    logInteraction(data) {
        this.interactions.push(data);
        // Store in localStorage for persistence
        localStorage.setItem('websiteAnalytics', JSON.stringify({
            sessionId: this.sessionId,
            interactions: this.interactions
        }));
        
        // You can also send to a server here
        console.log('Interaction tracked:', data);
    }

    getAnalytics() {
        return {
            sessionId: this.sessionId,
            totalInteractions: this.interactions.length,
            timeSpent: Math.round((new Date() - this.startTime) / 1000),
            interactions: this.interactions
        };
    }
}

// Initialize analytics
const analytics = new WebsiteAnalytics();

// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Track navigation
        analytics.logInteraction({
            event: 'navigation',
            target: sectionId,
            timestamp: new Date().toISOString()
        });
    }
}

// Navigation smooth scrolling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Quiz functionality
let currentQuestion = 1;
let quizAnswers = {};
const totalQuestions = 10;

// Correct answers for the quiz
const correctAnswers = {
    1: 'C', // British Brewing Company 🍺
    2: 'C', // your Kindness ✨
    3: 'A', // 1st October 2022
    4: 'D', // Everything about us ❤️
    5: 'D', // 11th September
    6: 'B', // Cuddles 🫂
    7: 'A', // 6th November
    8: 'D', // Everything about you ❤️
    9: 'C', // 8th October
    10: 'D' // All of the Above
};

function selectAnswer(questionNum, answer) {
    // Remove previous selection
    document.querySelectorAll(`#question-${questionNum} .quiz-option`).forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    event.target.classList.add('selected');
    
    // Store answer
    quizAnswers[questionNum] = answer;
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
    
    // Track quiz interaction
    analytics.logInteraction({
        event: 'quiz_answer',
        question: questionNum,
        answer: answer,
        timestamp: new Date().toISOString()
    });
}

function nextQuestion() {
    console.log(`Current question: ${currentQuestion}, Total questions: ${totalQuestions}`);
    
    if (currentQuestion < totalQuestions) {
        // Hide current question
        document.getElementById(`question-${currentQuestion}`).classList.remove('active');
        
        // Show next question
        currentQuestion++;
        console.log(`Moving to question: ${currentQuestion}`);
        document.getElementById(`question-${currentQuestion}`).classList.add('active');
        
        // Update navigation buttons
        document.getElementById('prev-btn').disabled = false;
        document.getElementById('next-btn').disabled = true;
        
        // Check if answer exists for this question
        if (quizAnswers[currentQuestion]) {
            document.getElementById('next-btn').disabled = false;
        }
        
        // If last question, change button text
        if (currentQuestion === totalQuestions) {
            console.log('Reached last question, changing button to Finish Quiz');
            document.getElementById('next-btn').textContent = 'Finish Quiz';
            document.getElementById('next-btn').onclick = finishQuiz;
        }
    } else {
        console.log('Already at last question');
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        // Hide current question
        document.getElementById(`question-${currentQuestion}`).classList.remove('active');
        
        // Show previous question
        currentQuestion--;
        document.getElementById(`question-${currentQuestion}`).classList.add('active');
        
        // Update navigation buttons
        document.getElementById('next-btn').disabled = false;
        document.getElementById('next-btn').textContent = 'Next';
        document.getElementById('next-btn').onclick = nextQuestion;
        
        if (currentQuestion === 1) {
            document.getElementById('prev-btn').disabled = true;
        }
    }
}

function finishQuiz() {
    console.log('finishQuiz called!');
    console.log('Current question:', currentQuestion);
    console.log('Total questions:', totalQuestions);
    console.log('User answers:', quizAnswers);
    
    // Calculate score
    let score = 0;
    for (let i = 1; i <= totalQuestions; i++) {
        if (quizAnswers[i] === correctAnswers[i]) {
            score++;
        }
    }
    
    console.log('Final score:', score, 'out of', totalQuestions);
    
    // Hide current question
    document.getElementById(`question-${currentQuestion}`).classList.remove('active');
    
    // Show result
    const resultDiv = document.getElementById('quiz-result');
    const scoreText = document.getElementById('quiz-score');
    const messageText = document.getElementById('quiz-message');
    
    scoreText.textContent = `You scored ${score} out of ${totalQuestions}!`;
    
    // Personalized messages based on score
    let message = '';
    if (score === totalQuestions) {
        message = "Perfect! You know us so well! 💕 You truly pay attention to every detail of our relationship.";
    } else if (score >= 8) {
        message = "Amazing! You know us incredibly well! 🌟 You're truly connected to every aspect of our relationship.";
    } else if (score >= 6) {
        message = "Great job! You know us pretty well! 😊 There's always more to discover about each other.";
    } else if (score >= 4) {
        message = "Good effort! You're learning about us! 💕 Keep discovering more about our beautiful relationship.";
    } else {
        message = "We have so much more to learn about each other! 💖 That's what makes our journey exciting.";
    }
    
    messageText.textContent = message;
    resultDiv.style.display = 'block';
    
    // Hide navigation buttons
    document.querySelector('.quiz-navigation').style.display = 'none';
    
    // Track quiz completion
    analytics.logInteraction({
        event: 'quiz_completed',
        score: score,
        totalQuestions: totalQuestions,
        answers: quizAnswers,
        timestamp: new Date().toISOString()
    });
}

function restartQuiz() {
    // Reset quiz state
    currentQuestion = 1;
    quizAnswers = {};
    
    // Hide result
    document.getElementById('quiz-result').style.display = 'none';
    
    // Show first question
    document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
    document.getElementById('question-1').classList.add('active');
    
    // Reset navigation
    document.querySelector('.quiz-navigation').style.display = 'flex';
    document.getElementById('prev-btn').disabled = true;
    document.getElementById('next-btn').disabled = true;
    document.getElementById('next-btn').textContent = 'Next';
    document.getElementById('next-btn').onclick = nextQuestion;
    
    // Clear selections
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Track quiz restart
    analytics.logInteraction({
        event: 'quiz_restarted',
        timestamp: new Date().toISOString()
    });
}

// Memory gallery functionality
const memories = {
    1: {
        title: "Our First Date",
        description: "The day that started our beautiful journey together. I was so nervous, but you made me feel so comfortable. That's when I knew you were special.",
        image: "https://via.placeholder.com/600x400/ff69b4/ffffff?text=Our+First+Date"
    },
    2: {
        title: "Our First Trip",
        description: "Remember our first adventure together? We laughed so much, got a little lost, but found each other even more. Every trip with you is a new chapter in our story.",
        image: "https://via.placeholder.com/600x400/ff1493/ffffff?text=Our+First+Trip"
    },
    3: {
        title: "Special Moments",
        description: "All those little moments that mean everything - morning coffee together, late night talks, silly jokes, and quiet embraces. These are the moments I treasure most.",
        image: "https://via.placeholder.com/600x400/ff69b4/ffffff?text=Special+Moments"
    },
    4: {
        title: "Celebrations",
        description: "Every celebration is better with you by my side. Birthdays, holidays, achievements - you make every moment feel like a celebration of our love.",
        image: "https://via.placeholder.com/600x400/ff1493/ffffff?text=Celebrations"
    }
};

function openMemory(memoryId) {
    const memory = memories[memoryId];
    const modal = document.getElementById('memory-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    
    modalImage.src = memory.image;
    modalTitle.textContent = memory.title;
    modalDescription.textContent = memory.description;
    
    modal.style.display = 'block';
    
    // Track memory view
    analytics.logInteraction({
        event: 'memory_viewed',
        memoryId: memoryId,
        title: memory.title,
        timestamp: new Date().toISOString()
    });
}

function closeMemory() {
    document.getElementById('memory-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('memory-modal');
    if (event.target === modal) {
        closeMemory();
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe timeline items and memory cards
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const memoryCards = document.querySelectorAll('.memory-card');
    
    [...timelineItems, ...memoryCards].forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});



// Track when user leaves the page
window.addEventListener('beforeunload', () => {
    const finalAnalytics = analytics.getAnalytics();
    
    // Store final analytics
    localStorage.setItem('finalAnalytics', JSON.stringify({
        ...finalAnalytics,
        exitTime: new Date().toISOString()
    }));
    
    // You could send this to a server here
    console.log('Final analytics:', finalAnalytics);
});

// Function to get all analytics data (you can call this from browser console)
window.getAnalyticsData = () => {
    const current = analytics.getAnalytics();
    const stored = JSON.parse(localStorage.getItem('websiteAnalytics') || '{}');
    const final = JSON.parse(localStorage.getItem('finalAnalytics') || '{}');
    
    return {
        current,
        stored,
        final,
        allSessions: Object.keys(localStorage)
            .filter(key => key.startsWith('websiteAnalytics'))
            .map(key => JSON.parse(localStorage.getItem(key)))
    };
};

// Add some interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to hearts
    document.querySelectorAll('.heart').forEach(heart => {
        heart.addEventListener('click', () => {
            heart.style.animation = 'none';
            setTimeout(() => {
                heart.style.animation = 'float 6s ease-in-out infinite';
            }, 100);
        });
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active', 'prev'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    // Track carousel interaction
    analytics.logInteraction({
        event: 'carousel_slide_viewed',
        slideIndex: index,
        timestamp: new Date().toISOString()
    });
}

function nextSlide() {
    const prevIndex = currentSlideIndex;
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    
    // Add prev class to previous slide for animation
    if (slides[prevIndex]) {
        slides[prevIndex].classList.add('prev');
    }
    
    showSlide(currentSlideIndex);
    
    analytics.logInteraction({
        event: 'carousel_next_clicked',
        fromSlide: prevIndex,
        toSlide: currentSlideIndex,
        timestamp: new Date().toISOString()
    });
}

function prevSlide() {
    const prevIndex = currentSlideIndex;
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
    
    analytics.logInteraction({
        event: 'carousel_prev_clicked',
        fromSlide: prevIndex,
        toSlide: currentSlideIndex,
        timestamp: new Date().toISOString()
    });
}

function currentSlide(index) {
    const prevIndex = currentSlideIndex;
    currentSlideIndex = index - 1; // Convert to 0-based index
    showSlide(currentSlideIndex);
    
    analytics.logInteraction({
        event: 'carousel_indicator_clicked',
        fromSlide: prevIndex,
        toSlide: currentSlideIndex,
        timestamp: new Date().toISOString()
    });
}

// Auto-play carousel with smart pausing
let autoPlayInterval;
let progressInterval;
let isAutoPlayActive = true;
let autoPlayPaused = false;
let progressWidth = 0;

function startCarouselAutoPlay() {
    const progressBar = document.querySelector('.progress-bar');
    
    autoPlayInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && isAutoPlayActive && !autoPlayPaused) {
            nextSlide(false); // false = automatic, not manual
            progressWidth = 0; // Reset progress
            if (progressBar) progressBar.style.width = '0%';
        }
    }, 4000); // Change slide every 4 seconds
    
    // Animate progress bar
    progressInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && isAutoPlayActive && !autoPlayPaused) {
            progressWidth += 0.625; // 100% / 160 intervals = 0.625% per 25ms (4000ms / 25ms = 160)
            if (progressBar) {
                progressBar.style.width = Math.min(progressWidth, 100) + '%';
            }
            if (progressWidth >= 100) {
                progressWidth = 0;
            }
        }
    }, 25); // Update every 25ms for smooth animation
}

function pauseAutoPlay(duration = 8000) {
    autoPlayPaused = true;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = '0%';
    progressWidth = 0;
    
    setTimeout(() => {
        autoPlayPaused = false;
    }, duration); // Resume after 8 seconds of user inactivity
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        isAutoPlayActive = false;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = '0%';
}

function resumeAutoPlay() {
    if (!isAutoPlayActive) {
        isAutoPlayActive = true;
        startCarouselAutoPlay();
    }
}

// Enhanced Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
    isSwiping = false;
}

function handleTouchMove(event) {
    // Prevent default scrolling when swiping horizontally
    const touchCurrentX = event.changedTouches[0].screenX;
    const touchCurrentY = event.changedTouches[0].screenY;
    const deltaX = Math.abs(touchCurrentX - touchStartX);
    const deltaY = Math.abs(touchCurrentY - touchStartY);
    
    // If horizontal movement is greater than vertical, prevent vertical scroll
    if (deltaX > deltaY && deltaX > 10) {
        event.preventDefault();
        isSwiping = true;
    }
}

function handleTouchEnd(event) {
    if (!isSwiping) return;
    
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 30; // Reduced threshold for better sensitivity
    const swipeDistance = touchEndX - touchStartX;
    const verticalDistance = Math.abs(touchEndY - touchStartY);
    
    // Only process horizontal swipes
    if (Math.abs(swipeDistance) > swipeThreshold && verticalDistance < 100) {
        if (swipeDistance > 0) {
            // Swipe right - go to previous slide
            prevSlide();
        } else {
            // Swipe left - go to next slide
            nextSlide();
        }
        
        analytics.logInteraction({
            event: 'carousel_swipe',
            direction: swipeDistance > 0 ? 'right' : 'left',
            distance: Math.abs(swipeDistance),
            timestamp: new Date().toISOString()
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    showSlide(0);
    
    // Add touch event listeners for mobile swipe
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    
    // Auto-play disabled - manual navigation only
    // startCarouselAutoPlay();
    
    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            prevSlide();
        } else if (event.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Video interaction tracking
    setupVideoTracking();
});

// Video interaction tracking
function setupVideoTracking() {
    // Track when video section comes into view
    const videoSection = document.getElementById('video');
    if (videoSection) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    analytics.logInteraction({
                        event: 'video_section_viewed',
                        timestamp: new Date().toISOString()
                    });
                }
            });
        }, { threshold: 0.5 });
        
        videoObserver.observe(videoSection);
    }
    
    // Track clicks on video area (YouTube handles the actual play tracking)
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
        videoWrapper.addEventListener('click', () => {
            analytics.logInteraction({
                event: 'video_clicked',
                videoUrl: 'https://youtube.com/shorts/QvwWWXjPoGM',
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // Track video navigation clicks
    const videoNavLink = document.querySelector('a[href="#video"]');
    if (videoNavLink) {
        videoNavLink.addEventListener('click', () => {
            analytics.logInteraction({
                event: 'video_nav_clicked',
                timestamp: new Date().toISOString()
            });
        });
    }
}

// Mobile Navigation Functions
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Track mobile menu interaction
    analytics.logInteraction({
        event: 'mobile_menu_toggled',
        isOpen: navMenu.classList.contains('active'),
        timestamp: new Date().toISOString()
    });
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    
    // Track mobile menu close
    analytics.logInteraction({
        event: 'mobile_menu_closed',
        timestamp: new Date().toISOString()
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (navMenu.classList.contains('active') && !navbar.contains(e.target)) {
        closeMobileMenu();
    }
});

// Close mobile menu on window resize if it's open
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Memory Gallery Lightbox Functionality
let currentLightboxIndex = 0;
let lightboxImages = [];

// Initialize memory gallery
document.addEventListener('DOMContentLoaded', () => {
    initializeMemoryGallery();
});

function initializeMemoryGallery() {
    // Get all memory items and store them for lightbox navigation
    const memoryItems = document.querySelectorAll('.memory-item');
    lightboxImages = Array.from(memoryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            title: '',
            description: ''
        };
    });
}

// Lightbox functionality
function openLightbox(imageSrc, title = '', description = '') {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxInfo = document.querySelector('.lightbox-info');
    const lightboxContent = document.querySelector('.lightbox-content');

    // Find the index of the current image
    currentLightboxIndex = lightboxImages.findIndex(img => img.src.includes(imageSrc));
    
    // Reset any previous styling
    lightboxContent.classList.remove('portrait-image', 'landscape-image');
    
    lightboxImage.src = imageSrc;
    
    // Detect image aspect ratio and adjust layout
    lightboxImage.onload = function() {
        const aspectRatio = this.naturalWidth / this.naturalHeight;
        
        if (aspectRatio < 1) {
            // Portrait image
            lightboxContent.classList.add('portrait-image');
        } else {
            // Landscape image
            lightboxContent.classList.add('landscape-image');
        }
    };
    
    // Hide info section if no title or description provided
    if (!title && !description) {
        lightboxInfo.style.display = 'none';
    } else {
        lightboxInfo.style.display = 'block';
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Track lightbox open
    analytics.logInteraction({
        event: 'lightbox_opened',
        image: imageSrc,
        title: title || 'Gallery Image',
        timestamp: new Date().toISOString()
    });
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling

    analytics.logInteraction({
        event: 'lightbox_closed',
        timestamp: new Date().toISOString()
    });
}

function prevLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}

function nextLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxContent = document.querySelector('.lightbox-content');
    
    const currentImage = lightboxImages[currentLightboxIndex];
    
    // Reset aspect ratio classes
    lightboxContent.classList.remove('portrait-image', 'landscape-image');
    
    lightboxImage.src = currentImage.src;
    lightboxTitle.textContent = currentImage.title;
    lightboxDescription.textContent = currentImage.description;
    
    // Detect new image aspect ratio
    lightboxImage.onload = function() {
        const aspectRatio = this.naturalWidth / this.naturalHeight;
        
        if (aspectRatio < 1) {
            // Portrait image
            lightboxContent.classList.add('portrait-image');
        } else {
            // Landscape image
            lightboxContent.classList.add('landscape-image');
        }
    };

    analytics.logInteraction({
        event: 'lightbox_navigation',
        direction: 'next',
        imageIndex: currentLightboxIndex,
        timestamp: new Date().toISOString()
    });
}

// Close lightbox when clicking outside the image
document.addEventListener('click', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (e.target === modal) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (modal.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevLightboxImage();
                break;
            case 'ArrowRight':
                nextLightboxImage();
                break;
        }
    }
});

// Local Video Player Functionality
function toggleVideoPlay() {
    const video = document.getElementById('love-story-video');
    const playIcon = document.getElementById('play-icon');
    const playBtn = document.querySelector('.custom-play-btn');
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (video.paused) {
        video.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        playBtn.classList.add('playing');
        videoWrapper.classList.add('playing');
        
        // Track video play
        analytics.logInteraction({
            event: 'video_played',
            video_id: 'love-story-video',
            timestamp: new Date().toISOString()
        });
    } else {
        video.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        playBtn.classList.remove('playing');
        videoWrapper.classList.remove('playing');
        
        // Track video pause
        analytics.logInteraction({
            event: 'video_paused',
            video_id: 'love-story-video',
            timestamp: new Date().toISOString()
        });
    }
}

// Enhanced video control handling
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('love-story-video');
    const overlay = document.querySelector('.video-controls-overlay');
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (video && overlay && videoWrapper) {
        // Hide custom overlay when video plays
        video.addEventListener('play', () => {
            const playIcon = document.getElementById('play-icon');
            const playBtn = document.querySelector('.custom-play-btn');
            
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            playBtn.classList.add('playing');
            videoWrapper.classList.add('playing');
            overlay.style.opacity = '0';
        });
        
        // Show custom overlay when video pauses
        video.addEventListener('pause', () => {
            const playIcon = document.getElementById('play-icon');
            const playBtn = document.querySelector('.custom-play-btn');
            
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            playBtn.classList.remove('playing');
            videoWrapper.classList.remove('playing');
        });
        
        // Handle video ended
        video.addEventListener('ended', () => {
            const playIcon = document.getElementById('play-icon');
            const playBtn = document.querySelector('.custom-play-btn');
            
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            playBtn.classList.remove('playing');
            videoWrapper.classList.remove('playing');
            overlay.style.opacity = '1';
            
            // Track video completed
            analytics.logInteraction({
                event: 'video_completed',
                video_id: 'love-story-video',
                timestamp: new Date().toISOString()
            });
        });
        
        // Allow native controls to work by clicking through the wrapper when video is playing
        video.addEventListener('click', (e) => {
            // If video is playing, let the native controls handle the click
            if (!video.paused) {
                e.stopPropagation();
            }
        });
        
        // Track when user seeks in the video
        video.addEventListener('seeked', () => {
            analytics.logInteraction({
                event: 'video_seeked',
                video_id: 'love-story-video',
                currentTime: video.currentTime,
                timestamp: new Date().toISOString()
            });
        });
    }
});

// Footer button functionality
document.addEventListener('DOMContentLoaded', () => {
    const sendLoveBtn = document.querySelector('.footer-btn:first-of-type');
    const rateUsBtn = document.querySelector('.footer-btn:last-of-type');
    
    if (sendLoveBtn) {
        sendLoveBtn.addEventListener('click', () => {
            // Track the interaction
            analytics.logInteraction({
                event: 'footer_button_clicked',
                button: 'send_love',
                timestamp: new Date().toISOString()
            });
            
            // Show a sweet message
            showFooterMessage('💌 Love sent! Your message has been delivered to the heart! 💕');
        });
    }
    
    if (rateUsBtn) {
        rateUsBtn.addEventListener('click', () => {
            // Track the interaction
            analytics.logInteraction({
                event: 'footer_button_clicked',
                button: 'rate_us',
                timestamp: new Date().toISOString()
            });
            
            // Show rating options
            showRatingOptions();
        });
    }
});

// Show footer messages
function showFooterMessage(message) {
    // Create a temporary message element
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #ff69b4, #3498db);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
        animation: slideInUp 0.5s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOutDown 0.5s ease-out';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 500);
    }, 3000);
}

// Show rating options
function showRatingOptions() {
    const ratings = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
    const message = `Rate our love story: ${ratings.join(' ')}`;
    
    // Track rating interaction
    analytics.logInteraction({
        event: 'rating_requested',
        timestamp: new Date().toISOString()
    });
    
    showFooterMessage(message);
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Quiz initialization started!');
    console.log('Total questions:', totalQuestions);
    console.log('First question should be active');
    
    // Ensure first question is active
    const firstQuestion = document.getElementById('question-1');
    if (firstQuestion) {
        firstQuestion.classList.add('active');
        console.log('First question activated');
    }
    
    // Initialize navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.disabled = true; // Can't go back from first question
        nextBtn.disabled = true; // Can't go next without answering
        console.log('Navigation buttons initialized');
    }
});

console.log('💕 Website loaded with love! All interactions are being tracked. 💕');
console.log('🎠 Beautiful carousel is ready with manual navigation and swipe support! 🎠');
console.log('🎬 Local video player ready with custom controls and analytics! 🎬');
console.log('📱 Mobile navigation is ready with hamburger menu! 📱');
console.log('🖼️ Interactive memory gallery with lightbox is ready! 🖼️');
console.log('🎯 Quiz system ready with 10 questions! 🎯');
console.log('💡 Tip: Call getAnalyticsData() in the console to see all tracked interactions!');
