async function loadMovieDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        
        const [moviesResponse, ratingsResponse] = await Promise.all([
            fetch('data/movies.json'),
            fetch('data/oreratings.json')
        ]);
        const [moviesData, ratingsData] = await Promise.all([
            moviesResponse.json(),
            ratingsResponse.json()
        ]);
        
        const movie = moviesData.movies.find(m => m.id === movieId);
        const ratings = ratingsData.movies.find(r => r.id === movieId);
        if (!movie) {
            window.location.href = 'index.html';
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

        // Set ORE ratings
        const overallRating = ratings ? (parseFloat(ratings.realism) + parseFloat(ratings.enjoyability)) / 2 : 0;
        
        function createStarRating(rating) {
            const fullStars = Math.floor(rating);
            let starsHtml = '<span style="margin-left: 10px;">';
            
            // Add full stars
            for (let i = 0; i < fullStars; i++) {
                starsHtml += '<i class="fas fa-star star"></i>';
            }
            
            // Add empty stars
            for (let i = fullStars; i < 5; i++) {
                starsHtml += '<i class="far fa-star star empty"></i>';
            }
            
            starsHtml += '</span>';
            return starsHtml;
        }
        
        document.querySelector('.overall-rating').innerHTML = createStarRating(overallRating);
        document.querySelector('.realism-rating').innerHTML = createStarRating(parseFloat(movie.realism));
        document.querySelector('.enjoyment-rating').innerHTML = createStarRating(parseFloat(movie.enjoyability));

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
                window.location.href = '/index.html';
            }
        });

    } catch (error) {
        console.error('Error loading movie details:', error);
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', loadMovieDetails);