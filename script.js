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
const totalQuestions = 5;

// Correct answers (you can modify these based on your actual relationship)
const correctAnswers = {
    1: 'A', // Coffee Shop
    2: 'D', // Everything
    3: 'D', // Your actual song
    4: 'D', // Anywhere together
    5: 'D'  // Everything about us
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
    if (currentQuestion < totalQuestions) {
        // Hide current question
        document.getElementById(`question-${currentQuestion}`).classList.remove('active');
        
        // Show next question
        currentQuestion++;
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
            document.getElementById('next-btn').textContent = 'Finish Quiz';
            document.getElementById('next-btn').onclick = finishQuiz;
        }
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
    // Calculate score
    let score = 0;
    for (let i = 1; i <= totalQuestions; i++) {
        if (quizAnswers[i] === correctAnswers[i]) {
            score++;
        }
    }
    
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
    } else if (score >= 3) {
        message = "Great job! You know us pretty well! 😊 There's always more to discover about each other.";
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

// Special surprise message (appears after spending some time on the site)
setTimeout(() => {
    if (document.visibilityState === 'visible') {
        showSurpriseMessage();
    }
}, 60000); // After 1 minute

function showSurpriseMessage() {
    const surprise = document.createElement('div');
    surprise.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff69b4, #ff1493);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            z-index: 3000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: fadeIn 0.5s ease-in;
        ">
            <h3 style="margin-bottom: 15px; font-family: 'Dancing Script', cursive; font-size: 1.8rem;">
                💕 Special Message 💕
            </h3>
            <p style="margin-bottom: 20px; line-height: 1.6;">
                Thank you for taking the time to explore our love story. 
                Every second you spend here means the world to me! ❤️
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: white;
                color: #ff69b4;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
            ">
                Close 💖
            </button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2999;
        " onclick="this.parentElement.remove()"></div>
    `;
    
    document.body.appendChild(surprise);
    
    // Track surprise message
    analytics.logInteraction({
        event: 'surprise_message_shown',
        timestamp: new Date().toISOString()
    });
}

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

console.log('💕 Website loaded with love! All interactions are being tracked. 💕');
console.log('💡 Tip: Call getAnalyticsData() in the console to see all tracked interactions!');
