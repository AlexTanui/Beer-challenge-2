// src/index.js

// Function to fetch data from the local API
async function fetchBeers() {
    try {
      const response = await fetch('http://localhost:3000/beers');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
  
  // Function to update the beer list in the navigation
  function updateBeerList(beers) {
    const beerListElement = document.getElementById('beer-list');
    beerListElement.innerHTML = beers.map(beer => `<li>${beer.name}</li>`).join('');
  
    // Add event listeners to handle the click event on each beer in the navigation
    const beerListItems = beerListElement.getElementsByTagName('li');
    for (let i = 0; i < beerListItems.length; i++) {
      beerListItems[i].addEventListener('click', () => handleBeerClick(beers[i]));
    }
  }
  
  // Function to update the beer details section with selected beer data
  function updateBeerDetails(beer) {
    const beerNameElement = document.getElementById('beer-name');
    const beerImageElement = document.getElementById('beer-image');
    const beerDescriptionElement = document.getElementById('beer-description');
    const descriptionForm = document.getElementById('description-form');
    const reviewListElement = document.getElementById('review-list');
    const reviewForm = document.getElementById('review-form');
  
    beerNameElement.textContent = beer.name;
    beerImageElement.src = beer.image_url;
    beerDescriptionElement.textContent = beer.description;
  
    // Update the description form value with the current description
    document.getElementById('description').value = beer.description;
  
    // Update the review list for the selected beer
    reviewListElement.innerHTML = beer.reviews.map(review => `<li>${review}</li>`).join('');
  
    // Add an event listener to the description form to handle the PATCH request
    descriptionForm.onsubmit = async (event) => {
      event.preventDefault();
      const updatedDescription = document.getElementById('description').value;
  
      try {
        // Perform the PATCH request to update the beer description
        const response = await fetch(`http://localhost:3000/beers/${beer.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description: updatedDescription }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update beer description.');
        }
  
        // Update the beer description on the page after a successful PATCH request
        beerDescriptionElement.textContent = updatedDescription;
      } catch (error) {
        console.error('Error updating beer description:', error);
      }
    };
  
    // Add an event listener to the review form to handle the PATCH request
    reviewForm.onsubmit = async (event) => {
      event.preventDefault();
      const newReview = document.getElementById('review').value;
  
      try {
        // Perform the PATCH request to update the beer's reviews
        const response = await fetch(`http://localhost:3000/beers/${beer.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reviews: [...beer.reviews, newReview] }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add new review.');
        }
  
        // Update the review list on the page after a successful PATCH request
        reviewListElement.innerHTML += `<li>${newReview}</li>`;
      } catch (error) {
        console.error('Error adding new review:', error);
      }
    };
  }
  
  // Function to handle the click event on a beer in the navigation
  function handleBeerClick(beer) {
    updateBeerDetails(beer);
  }
  
  // Main function to fetch data and update the DOM
  async function init() {
    const beers = await fetchBeers();
    if (beers.length > 0) {
      // Update the beer list in the navigation
      updateBeerList(beers);
  
      // Display details of the first beer initially
      updateBeerDetails(beers[0]);
    } else {
      console.warn('No beers found.');
    }
  }
  
  // Call the init function to start the process
  init();
  