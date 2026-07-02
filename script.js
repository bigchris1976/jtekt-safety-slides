// Slideshow configuration
const SLIDE_INTERVAL = 10000; // 10 seconds in milliseconds
const PROGRESS_UPDATE_INTERVAL = 100; // Update progress bar every 100ms

let currentSlide = 0;
let slides = [];
let autoplayTimer = null;
let progressTimer = null;
let timeRemaining = SLIDE_INTERVAL;

// Initialize slideshow on page load
document.addEventListener('DOMContentLoaded', () => {
    slides = document.querySelectorAll('.slide');
    
    // Update total slides count
    document.getElementById('totalSlides').textContent = slides.length;
    
    // Show first slide
    showSlide(0);
    
    // Start autoplay
    startAutoplay();
    
    // Add event listeners for navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        pauseAutoplay();
        previousSlide();
        startAutoplay();
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        pauseAutoplay();
        nextSlide();
        startAutoplay();
    });
    
    // Optional: pause autoplay on hover
    document.querySelector('.slideshow-container').addEventListener('mouseenter', pauseAutoplay);
    document.querySelector('.slideshow-container').addEventListener('mouseleave', startAutoplay);
});

/**
 * Display a specific slide
 * @param {number} index - The slide index to display
 */
function showSlide(index) {
    // Validate index
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Add active class to current slide
    slides[currentSlide].classList.add('active');
    
    // Update slide counter
    document.getElementById('slideNumber').textContent = currentSlide + 1;
    
    // Reset progress bar
    timeRemaining = SLIDE_INTERVAL;
    updateProgressBar();
}

/**
 * Show next slide
 */
function nextSlide() {
    showSlide(currentSlide + 1);
}

/**
 * Show previous slide
 */
function previousSlide() {
    showSlide(currentSlide - 1);
}

/**
 * Start automatic slide advancement
 */
function startAutoplay() {
    if (autoplayTimer) return; // Already running
    
    timeRemaining = SLIDE_INTERVAL;
    
    autoplayTimer = setInterval(() => {
        nextSlide();
    }, SLIDE_INTERVAL);
    
    // Update progress bar
    progressTimer = setInterval(updateProgressBar, PROGRESS_UPDATE_INTERVAL);
}

/**
 * Pause automatic slide advancement
 */
function pauseAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
}

/**
 * Update progress bar to show time remaining for current slide
 */
function updateProgressBar() {
    timeRemaining -= PROGRESS_UPDATE_INTERVAL;
    const percentage = Math.max(0, (SLIDE_INTERVAL - timeRemaining) / SLIDE_INTERVAL * 100);
    document.getElementById('progressFill').style.width = percentage + '%';
}

/**
 * Update slide images from an external source (optional)
 * Call this function to dynamically update slides from a JSON file or API
 * @param {Array} slideUrls - Array of image URLs
 */
function updateSlides(slideUrls) {
    const slidesWrapper = document.querySelector('.slides-wrapper');
    slidesWrapper.innerHTML = '';
    
    slideUrls.forEach((url, index) => {
        const img = document.createElement('img');
        img.className = 'slide';
        img.src = url;
        img.alt = `Slide ${index + 1}`;
        slidesWrapper.appendChild(img);
    });
    
    slides = document.querySelectorAll('.slide');
    document.getElementById('totalSlides').textContent = slides.length;
    
    pauseAutoplay();
    showSlide(0);
    startAutoplay();
}