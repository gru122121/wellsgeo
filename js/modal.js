export function initializeModal() {
    document.addEventListener('showModal', (e) => {
        const movie = e.detail;
        const template = document.getElementById('movie-modal-template');
        const modal = template.content.cloneNode(true).children[0];
        modal.style.zIndex = '999999';
        
        // Set modal content
        modal.querySelector('.modal-banner').style.backgroundImage = `url(${movie.banner})`;
        modal.querySelector('h2').textContent = movie.title;
        modal.querySelector('.year').textContent = movie.year;
        modal.querySelector('.rating').textContent = movie.rating;
        
        // Set geological features
        const featuresList = modal.querySelector('.features-list');
        if (movie.geology && Array.isArray(movie.geology.features)) {
            movie.geology.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
        }
        
        // Set location and analysis
        const locationInfo = modal.querySelector('.location-info');
        if (movie.location && movie.location.place && movie.location.country) {
            locationInfo.textContent = `${movie.location.place}, ${movie.location.country}`;
        } else {
            locationInfo.textContent = 'Location information not available';
        }
        modal.querySelector('.analysis').textContent = movie.geology?.analysis || 'Analysis not available';
        modal.querySelector('.scene-details').textContent = movie.geology?.sceneDetails || 'Scene details not available';
        
        // Close button functionality
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        document.body.appendChild(modal);
    });
}