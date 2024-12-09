export function initializeModal() {
    document.addEventListener('showModal', (e) => {
        const movie = e.detail;
        const template = document.getElementById('movie-modal-template');
        const modal = template.content.cloneNode(true).children[0];
        
        // Set modal content
        modal.querySelector('.modal-banner').style.backgroundImage = `url(${movie.banner})`;
        modal.querySelector('h2').textContent = movie.title;
        modal.querySelector('.year').textContent = movie.year;
        modal.querySelector('.rating').textContent = movie.rating;
        
        // Set geological features
        const featuresList = modal.querySelector('.features-list');
        movie.geology.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        // Set location and analysis
        modal.querySelector('.location-info').textContent = 
            `${movie.location.place}, ${movie.location.country}`;
        modal.querySelector('.analysis').textContent = movie.geology.analysis;
        modal.querySelector('.scene-details').textContent = movie.geology.sceneDetails;
        
        // Close button functionality
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        document.body.appendChild(modal);
    });
} 