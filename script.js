import { loadMovies } from './js/movies.js';
import { initializeModal } from './js/modal.js';



document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    initializeModal();
    
    // Smooth scroll function for the explore button
    window.scrollToMovies = () => {
        console.log('Scrolling to movies section...');
        const moviesSection = document.querySelector('.movies-section');
        if (moviesSection) {
            moviesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Movies section not found');
        }
    };

    document.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}); 



async function setFeaturedBackground() {
    try {
        const response = await fetch('data/movies.json');
        const data = await response.json();
        const movies = data.movies;

        if (!Array.isArray(movies)) {
            throw new Error('Movies data is not an array');
        }

        const thumbnails = movies
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .map(movie => movie.thumbnail);

        // Create the stripes container
        const featuredSection = document.querySelector('#featured');
        featuredSection.innerHTML = ''; // Clear existing content
        
        // Calculate stripe width
        const stripeWidth = 100 / thumbnails.length;
        
        // Create a div for each stripe
        thumbnails.forEach((url, index) => {
            const stripe = document.createElement('div');
            stripe.className = 'background-stripe';
            stripe.style.cssText = `
                position: absolute;
                top: 0;
                left: ${index * stripeWidth}%;
                width: ${stripeWidth}%;
                height: 100%;
                background: url(${url}) 50% center / auto 100%;
                overflow: hidden;
                z-index: 0;
            `;
            featuredSection.appendChild(stripe);
        });

        // Add back the content container
        const content = document.createElement('div');
        content.className = 'featured-content';
        content.innerHTML = `
            <div class="featured-text">
                <h1>GeoFlix</h1>
                <p>Where Geology Meets Cinema</p>
                <button class="explore-btn" onclick="scrollToMovies()">
                    <i class="fas fa-chevron-down"></i> Explore Movies
                </button>
            </div>
        `;
        featuredSection.appendChild(content);
    } catch (error) {
        console.error('Error fetching movie thumbnails:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setFeaturedBackground();
});
