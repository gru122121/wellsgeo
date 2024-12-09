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
}); 