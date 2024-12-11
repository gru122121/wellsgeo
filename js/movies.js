export async function loadMovies() {
    try {
        const response = await fetch('data/movies.json');
        const data = await response.json();
        
        // Load movies for each category
        data.categories.forEach(category => {
            const categoryMovies = category.movies.map(movieId => 
                data.movies.find(m => m.id === movieId)
            ).filter(Boolean);

            const categoryGrid = document.querySelector(`#${category.name.toLowerCase().replace(/\s+/g, '-')} .movie-grid`);
            if (categoryGrid) {
                categoryGrid.innerHTML = categoryMovies.map(movie => createMoviePoster(movie)).join('');
            }
        });
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function createMoviePoster(movie) {
    return `
        <div class="poster" onclick="window.location.href='/movie.html?id=${movie.id}'">
            <img src="${movie.thumbnail}" alt="${movie.title}">
            <div class="poster-overlay">
                <div class="poster-content">
                    <div class="poster-title">${movie.title}</div>
                    <div class="poster-meta">
                        <span class="year">${movie.year}</span>
                        <span class="rating">${movie.rating}</span>
                    </div>
                    <div class="poster-features">
                        ${movie.geology.features.slice(0, 3).join(' | ')}
                    </div>
                </div>
            </div>
        </div>
    `;
} 