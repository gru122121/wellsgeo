async function loadMovieDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        
        // Only fetch movies.json
        const moviesResponse = await fetch('data/movies.json');
        const moviesData = await moviesResponse.json();
        
        const movie = moviesData.movies.find(m => m.id === movieId);
        if (!movie) {
            window.location.href = 'main.html';
            return;
        }

        // Update page title
        document.title = `${movie.title} - GeoFlix`;

        // Set background image
        const heroBackground = document.querySelector('.hero-background');
        heroBackground.style.backgroundImage = `url(${movie.thumbnail})`;

        // Set movie details
        document.querySelector('.movie-title').textContent = movie.title;
        document.querySelector('.year').textContent = movie.year;
        document.querySelector('.rating').textContent = movie.rating;

        // Add IMDb search functionality to play button
        const playBtn = document.querySelector('.play-btn');
        const netflixSound = new Audio('/audio/netflix-sound.mp3');
        playBtn.addEventListener('click', () => {
            netflixSound.play();
            const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}`;
            window.open(searchUrl, '_blank');
        });

        // Calculate overall rating as average of realism and enjoyability
        const overallRating = (parseFloat(movie.realism) + parseFloat(movie.enjoyability)) / 2;
        
        function createStarRating(rating) {
            // Extract number from "X/5" format
            const ratingValue = parseFloat(rating.split('/')[0]);
            let starsHtml = '<span style="margin-left: 10px;">';
            
            // Add full stars
            for (let i = 0; i < ratingValue; i++) {
                starsHtml += '<i class="fas fa-star star"></i>';
            }
            
            // Add empty stars
            for (let i = ratingValue; i < 5; i++) {
                starsHtml += '<i class="far fa-star star empty"></i>';
            }
            
            starsHtml += '</span>';
            return starsHtml;
        }
        
        // Set ratings using values directly from movie object
        document.querySelector('.overall-rating').innerHTML = createStarRating(`${overallRating}/5`);
        document.querySelector('.realism-rating').innerHTML = createStarRating(movie.realism);
        document.querySelector('.enjoyment-rating').innerHTML = createStarRating(movie.enjoyability);

        // Setup trailer functionality
        const trailerBtn = document.querySelector('.trailer-btn');
        const trailerModal = document.querySelector('.trailer-modal');
        const trailerFrame = document.querySelector('#trailerFrame');
        const closeModalBtn = document.querySelector('.close-modal-btn');

        if (movie.trailer) {
            trailerBtn.addEventListener('click', () => {
                trailerFrame.src = movie.trailer;
                trailerModal.style.display = 'flex';
                setTimeout(() => trailerModal.classList.add('active'), 10);
            });

            closeModalBtn.addEventListener('click', () => {
                trailerFrame.src = '';
                trailerModal.classList.remove('active');
                setTimeout(() => trailerModal.style.display = 'none', 300);
            });

            // Close modal when clicking outside the video
            trailerModal.addEventListener('click', (e) => {
                if (e.target === trailerModal) {
                    closeModalBtn.click();
                }
            });
        } else {
            trailerBtn.style.display = 'none';
        }

        // Set geological features
        const featuresList = document.querySelector('.features-list');
        featuresList.innerHTML = movie.geology.features
            .map(feature => `<li>${feature}</li>`)
            .join('');

        // Update the text setting functions to handle markdown
        function formatText(text) {
            return text
                .split('\n').join('<br>') // Handle line breaks
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Handle bold text
        }

        // Set location and analysis
        document.querySelector('.location').textContent = 
            `${movie.geology.location.place}, ${movie.geology.location.country}`;
        document.querySelector('.analysis').innerHTML = formatText(movie.geology.analysis);
        document.querySelector('.scene-details').innerHTML = formatText(movie.geology.sceneDetails);

        // Setup close button
        const closeButton = document.getElementById('closeButton');
        closeButton.addEventListener('click', () => {
            // Try to go back if there's history
            if (document.referrer.includes(window.location.host)) {
                window.history.back();
            } else {
                // Fallback to index if no history
                window.location.href = '/main.html';
            }
        });

    } catch (error) {
        console.error('Error loading movie details:', error);
        window.location.href = 'main.html';
    }
}

document.addEventListener('DOMContentLoaded', loadMovieDetails);