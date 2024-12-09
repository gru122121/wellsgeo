export async function loadMovies() {
    try {
        const response = await fetch('data/movies.json');
        const data = await response.json();
        
        const movieGrid = document.querySelector('.movie-grid');
        if (!movieGrid) return;
        
        movieGrid.innerHTML = data.movies.map(movie => `
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
        `).join('');
        
    } catch (error) {
        console.error('Error loading movies:', error);
    }
} 