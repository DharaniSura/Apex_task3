const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));
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
class Quiz {
    constructor() {
        this.questions = [
            {
                question: "What does 'DOM' stand for in JavaScript?",
                options: [
                    "Document Object Model",
                    "Data Object Management",
                    "Dynamic Object Method",
                    "Document Oriented Markup"
                ],
                correct: 0
            },
            {
                question: "Which of the following is NOT a JavaScript data type?",
                options: [
                    "undefined",
                    "boolean",
                    "float",
                    "symbol"
                ],
                correct: 2
            },
            {
                question: "What will console.log(typeof null) output?",
                options: [
                    "null",
                    "undefined",
                    "object",
                    "boolean"
                ],
                correct: 2
            },
            {
                question: "Which method is used to add an element to the end of an array?",
                options: [
                    "push()",
                    "pop()",
                    "shift()",
                    "unshift()"
                ],
                correct: 0
            },
            {
                question: "What is the correct way to create a function in JavaScript?",
                options: [
                    "function = myFunction() {}",
                    "function myFunction() {}",
                    "create myFunction() {}",
                    "def myFunction() {}"
                ],
                correct: 1
            }
        ];        
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];        
        this.startBtn = document.getElementById('start-quiz-btn');
        this.restartBtn = document.getElementById('restart-quiz-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.quizStart = document.getElementById('quiz-start');
        this.quizGame = document.getElementById('quiz-game');
        this.quizResults = document.getElementById('quiz-results');
        this.questionText = document.getElementById('question-text');
        this.answerOptions = document.getElementById('answer-options');
        this.questionCounter = document.getElementById('question-counter');
        this.progress = document.getElementById('progress');
        this.scoreDisplay = document.getElementById('score-display');
        this.scoreMessage = document.getElementById('score-message');
        this.init();
    }    
    init() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
    }    
    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];        
        this.quizStart.classList.add('hidden');
        this.quizGame.classList.remove('hidden');
        this.quizResults.classList.add('hidden');
        this.showQuestion();
    }    
    showQuestion() {
        const question = this.questions[this.currentQuestion];        
        this.questionText.textContent = question.question;
        this.questionCounter.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        const progressPercent = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progress.style.width = progressPercent + '%';
        this.answerOptions.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectAnswer(index, optionElement));
            this.answerOptions.appendChild(optionElement);
        });
        this.nextBtn.classList.add('hidden');
    }    
    selectAnswer(selectedIndex, optionElement) {
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.answer-option');
        options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
        this.userAnswers[this.currentQuestion] = selectedIndex;
        options.forEach((opt, index) => {
            if (index === question.correct) {
                opt.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== question.correct) {
                opt.classList.add('incorrect');
            }
        });
        if (selectedIndex === question.correct) {
            this.score++;
        }
        this.nextBtn.classList.remove('hidden');
        options.forEach(opt => opt.style.pointerEvents = 'none');
    }    
    nextQuestion() {
        this.currentQuestion++;        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }    
    showResults() {
        this.quizGame.classList.add('hidden');
        this.quizResults.classList.remove('hidden');        
        const percentage = Math.round((this.score / this.questions.length) * 100);        
        this.scoreDisplay.innerHTML = `
            <div class="score-display">${this.score}/${this.questions.length}</div>
            <div style="font-size: 1.5rem; color: #667eea;">${percentage}%</div>
        `;        
        let message = '';
        if (percentage >= 80) {
            message = '🎉 Excellent! You have a great understanding of JavaScript!';
        } else if (percentage >= 60) {
            message = '👍 Good job! You have a solid foundation in JavaScript.';
        } else if (percentage >= 40) {
            message = '📖 Not bad! Keep studying to improve your JavaScript skills.';
        } else {
            message = '💪 Keep learning! JavaScript takes practice to master.';
        }        
        this.scoreMessage.innerHTML = `<div class="score-message">${message}</div>`;
    }    
    restartQuiz() {
        this.quizResults.classList.add('hidden');
        this.quizStart.classList.remove('hidden');
    }
}
const quiz = new Quiz();
class Carousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.nextBtn = document.getElementById('next-btn-carousel');
        this.prevBtn = document.getElementById('prev-btn');
        this.indicators = Array.from(document.querySelectorAll('.indicator'));        
        this.currentSlide = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;        
        this.init();
    }    
    init() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        this.addTouchSupport();
        this.startAutoPlay();
        const carouselContainer = document.querySelector('.carousel');
        carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
        carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }    
    updateCarousel() {
        if (this.isAnimating) return;
        this.isAnimating = true;        
        const slideWidth = this.slides[0].getBoundingClientRect().width;
        this.track.style.transform = `translateX(-${this.currentSlide * slideWidth}px)`;
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });        
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            e.preventDefault();
        });
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - currentX;
            const threshold = 50;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            this.startAutoPlay();
        });
    }
}
const carousel = new Carousel();
class APIManager {
    constructor() {
        this.weatherBtn = document.getElementById('get-weather-btn');
        this.cityInput = document.getElementById('city-input');
        this.weatherDisplay = document.getElementById('weather-display');
        this.weatherLocation = document.getElementById('weather-location');
        this.weatherTemp = document.getElementById('weather-temp');
        this.weatherDescription = document.getElementById('weather-description');
        this.weatherDetails = document.getElementById('weather-details');        
        this.factBtn = document.getElementById('get-fact-btn');
        this.factDisplay = document.getElementById('fact-display');        
        this.init();
    }    
    init() {
        this.weatherBtn.addEventListener('click', () => this.getWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.getWeather();
        });
        this.factBtn.addEventListener('click', () => this.getFact());
        this.getFact();
    }    
    async getWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            alert('Please enter a city name');
            return;
        }        
        this.weatherBtn.textContent = 'Loading...';
        this.weatherBtn.disabled = true;        
        try {
            const weatherData = await this.simulateWeatherAPI(city);
            this.displayWeather(weatherData);
        } catch (error) {
            console.error('Weather API Error:', error);
            this.weatherLocation.textContent = 'Error fetching weather data';
            this.weatherTemp.textContent = '';
            this.weatherDescription.textContent = 'Please try again later';
            this.weatherDetails.textContent = '';
        } finally {
            this.weatherBtn.textContent = 'Get Weather';
            this.weatherBtn.disabled = false;
        }
    }    
    async simulateWeatherAPI(city) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const weatherConditions = [
            { temp: 22, description: 'sunny', details: 'Clear sky, light breeze' },
            { temp: 18, description: 'cloudy', details: 'Partly cloudy, mild wind' },
            { temp: 15, description: 'rainy', details: 'Light rain, high humidity' },
            { temp: 28, description: 'hot', details: 'Hot and dry, no wind' },
            { temp: 12, description: 'cool', details: 'Cool and crisp, gentle breeze' }
        ];       
        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];        
        return {
            name: city.charAt(0).toUpperCase() + city.slice(1),
            main: {
                temp: randomWeather.temp,
                feels_like: randomWeather.temp + Math.floor(Math.random() * 4) - 2,
                humidity: Math.floor(Math.random() * 40) + 40
            },
            weather: [{
                description: randomWeather.description,
                main: randomWeather.description.charAt(0).toUpperCase() + randomWeather.description.slice(1)
            }],
            wind: {
                speed: Math.random() * 10 + 2
            }
        };
    }    displayWeather(data) {
        this.weatherLocation.textContent = data.name;
        this.weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
        this.weatherDescription.textContent = data.weather[0].description;
        this.weatherDetails.innerHTML = `
            Feels like: ${Math.round(data.main.feels_like)}°C<br>
            Humidity: ${data.main.humidity}%<br>
            Wind: ${Math.round(data.wind.speed)} m/s
        `;
    }
    async getFact() {
        this.factBtn.textContent = 'Loading...';
        this.factBtn.disabled = true;        
        try {
            const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
            const data = await response.json();            
            this.factDisplay.innerHTML = `<p>${data.text}</p>`;
        } catch (error) {
            console.error('Facts API Error:', error);
            this.displayFallbackFact();
        } finally {
            this.factBtn.textContent = 'Get Random Fact';
            this.factBtn.disabled = false;
        }
    }    
    displayFallbackFact() {
        const facts = [            
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
            "Why do Java developers wear glasses? Because they can't C#!",
            "What's a programmer's favorite hangout place? Foo Bar!",
            "Why did the programmer quit his job? He didn't get arrays!",
            "What do you call a programmer from Finland? Nerdic!",
            "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
            "What's the object-oriented way to become wealthy? Inheritance!",
            "Why did the developer go broke? Because he used up all his cache!",
            "What do you call 8 hobbits? A hobbyte!",
            "The first computer bug was an actual bug - a moth trapped in a Harvard Mark II computer in 1947.",
            "JavaScript was created in just 10 days by Brendan Eich in 1995.",
            "The @ symbol was used in email addresses for the first time in 1971.",
            "The first website ever created is still online at info.cern.ch.",
            "CSS was first proposed in 1994, but wasn't widely adopted until the early 2000s.",
            "The term 'responsive web design' was coined by Ethan Marcotte in 2010.",
            "HTML5 was finalized as a standard in 2014, even though parts were used much earlier.",
            "The most popular programming language on GitHub is JavaScript."
        ];        
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        this.factDisplay.innerHTML = `<p>${randomFact}</p>`;
    }
}
const apiManager = new APIManager();
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };        
        this.init();
    }    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);
        this.observeElements();
        this.addScrollToTop();
    }    
    observeElements() {
        const elementsToAnimate = document.querySelectorAll('.quiz-container, .carousel-container, .weather-widget, .facts-widget');        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            this.observer.observe(el);
        });
    }    
    addScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        `;        
        document.body.appendChild(scrollBtn);
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
const scrollAnimations = new ScrollAnimations();
class PerformanceOptimizer {
    constructor() {
        this.init();
    }    
    init() {
        this.lazyLoadImages();
        this.debounceResize();
        this.preloadResources();
    }    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });        
        images.forEach(img => imageObserver.observe(img));
    }    
    debounceResize() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (carousel && carousel.updateCarousel) {
                    carousel.updateCarousel();
                }
            }, 250);
        });
    }    
    preloadResources() {
        const preloadNextImage = () => {
            const nextIndex = (carousel.currentSlide + 1) % carousel.slides.length;
            const nextImg = carousel.slides[nextIndex].querySelector('img');
            if (nextImg && nextImg.src) {
                const preloadImg = new Image();
                preloadImg.src = nextImg.src;
            }
        };
        setTimeout(preloadNextImage, 2000);
    }
}
const performanceOptimizer = new PerformanceOptimizer();
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }    
    init() {
        this.addAriaLabels();
        this.manageFocus();
        this.enhanceKeyboardNav();
    }    
    addAriaLabels() {
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.setAttribute('role', 'application');
            quizContainer.setAttribute('aria-label', 'Interactive JavaScript Quiz');
        }
        const carouselEl = document.querySelector('.carousel');
        if (carouselEl) {
            carouselEl.setAttribute('role', 'region');
            carouselEl.setAttribute('aria-label', 'Image carousel');
        }
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent || 'Button');
            }
        });
    }    
    manageFocus() {
        const focusFirstAnswerOption = () => {
            const firstOption = document.querySelector('.answer-option');
            if (firstOption) {
                firstOption.focus();
            }
        };
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    }
    enhanceKeyboardNav() {
        const carouselEl = document.querySelector('.carousel');
        if (carouselEl) {
            carouselEl.setAttribute('tabindex', '0');
            carouselEl.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    carousel.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    carousel.nextSlide();
                }
            });
        }
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #667eea;
                outline-offset: 2px;
            }            
            .answer-option:focus {
                outline: none;
                border-color: #667eea !important;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
}
const accessibilityEnhancer = new AccessibilityEnhancer();
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Advanced Web Development Project Loaded!');
    console.log('Features: Responsive Design, Interactive Quiz, Image Carousel, API Integration');
});