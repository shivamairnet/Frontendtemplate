const lockedStates = {};
const cityData = {
    Mumbai: {
        image: 'img/mumbai.jpeg',
        info: 'Mumbai is the financial capital of India.',
        airports: ['Chhatrapati Shivaji Maharaj International Airport', 'Juhu Aerodrome']
    },
    Delhi: {
        image: 'img/delhi.jpeg',
        info: 'Delhi is the capital city of India.',
        airports: ['Indira Gandhi International Airport', 'Safdarjung Airport']
    },
    Bangalore: {
        image: 'img/bangalore.jpeg',
        info: 'Bangalore is known as the Silicon Valley of India.',
        airports: ['Kempegowda International Airport', 'HAL Airport']
    },
    Chennai: {
        image: 'img/chennai.jpeg',
        info: 'Chennai is known for its cultural heritage.',
        airports: ['Chennai International Airport', 'Madras Airport']
    }
};

function addCityCard() {
    const citySelector = document.getElementById('citySelector');
    const selectedCity = citySelector.value;

    if (selectedCity) {
        const dynamicCards = document.getElementById('dynamicCards');

        // Create a container for each city card
        const cityContainer = document.createElement('div');
        cityContainer.className = 'city-container flex-shrink-0 card';
        cityContainer.setAttribute('draggable', true);
        
        // Create a container for the city heading and lock icon
        const headingContainer = document.createElement('div');
        headingContainer.className = 'heading-container flex items-center space-x-2 mb-2'; // Flexbox and spacing, and bottom margin

        // Create a heading for the city
        const cityHeading = document.createElement('h4');
        cityHeading.textContent = selectedCity;
        cityHeading.className = 'text-customPurple underline';
        headingContainer.appendChild(cityHeading);

        // Create a lock icon
        const lockIcon = document.createElement('i');
        lockIcon.className = 'fas fa-lock'; // FontAwesome lock icon
        lockIcon.setAttribute('data-city', selectedCity); // Add data attribute for city
        lockIcon.onclick = function() {
            toggleLock(selectedCity); // Toggle lock when the icon is clicked
        };
        headingContainer.appendChild(lockIcon);

        // Append the heading container to the city container
        cityContainer.appendChild(headingContainer);

        // Create the city card
        const cityCard = document.createElement('div');
        cityCard.className = 'card border border-gray-300 rounded-lg shadow-md overflow-hidden w-48 fixed-height';

        const city = cityData[selectedCity];

        cityCard.innerHTML = `
            <img src="${city.image}" alt="${selectedCity} Image" class="w-full h-22 object-cover">
            <div class="container ">
                <h4 class="text-customPurple underline font-bold ">${selectedCity}</h4>
                <p class="text-customPurple">${city.info}</p>
                <ul class="text-customPurple list-disc pl-5">
                    ${city.airports.map(airport => `<li class="mb-1">${airport}</li>`).join('')}
                </ul>
            </div>
        `;
        cityContainer.addEventListener('dblclick', () => {
            cityContainer.classList.toggle('locked');
            cityContainer.setAttribute('draggable', !cityContainer.classList.contains('locked'));
        });

        dynamicCards.appendChild(cityContainer);

        addDragAndDropListeners(cityContainer);
    
        // Append the city card to the city container
        cityContainer.appendChild(cityCard);

        // Initialize nights container
        const nightsContainer = document.createElement('div');
        nightsContainer.className = 'nights-container flex items-center mt-4 bg-customPurple'; // Flexbox and top margin for spacing
        
        nightsContainer.style.color='white'
        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.className = 'bg-customOrange px-2 py-1 rounded';
        minusButton.onclick = function() {
            changeNights(selectedCity, -1);
        };

        const nightsText = document.createElement('span');
        nightsText.id = `nights-${selectedCity}`;
        nightsText.className = 'mx-12'; // Add margin for spacing
        nightsText.textContent = '0 nights';

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.className = 'px-2 py-1 rounded bg-customOrange';
        // plusButton.style.backgroundColor = '#bg-yellow';
        plusButton.onclick = function() {
            changeNights(selectedCity, 1);
        };

        nightsContainer.appendChild(minusButton);
        nightsContainer.appendChild(nightsText);
        nightsContainer.appendChild(plusButton);

        // Append the nights container to the city container
        cityContainer.appendChild(nightsContainer);

        // Append the city container to the dynamic cards container
        dynamicCards.appendChild(cityContainer);

        // Initialize the lock state and nights count for this city
        lockedStates[selectedCity] = false;
        nightsCount[selectedCity] = 0;
    }
}

const nightsCount = {};

function toggleLock(city) {
    lockedStates[city] = !lockedStates[city]; // Toggle the lock state
    const lockIcon = document.querySelector(`[data-city="${city}"]`);
    lockIcon.classList.toggle('fa-lock'); // Toggle the lock icon class
    lockIcon.classList.toggle('fa-lock-open'); // Toggle the open lock icon class
}

function changeNights(city, delta) {
    if (!lockedStates[city]) {
        nightsCount[city] += delta;
        if (nightsCount[city] < 0) nightsCount[city] = 0; // Ensure nights count doesn't go negative
        document.getElementById(`nights-${city}`).textContent = `${nightsCount[city]} nights`;
    }
}

function addDragAndDropListeners(card) {
    let draggedCard = null;

    card.addEventListener('dragstart', (e) => {
        if (card.classList.contains('locked')) return; // Disable drag-and-drop for locked cards
        draggedCard = card;
        setTimeout(() => card.classList.add('hide'), 0);
    });

    card.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedCard.classList.remove('hide');
            draggedCard = null;
        }, 0);
    });

    card.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    card.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedCard && draggedCard !== card) {
            // Swap draggedCard with the target card
            const container = document.getElementById('dynamicCards');
            const draggedCardIndex = [...container.children].indexOf(draggedCard);
            const targetCardIndex = [...container.children].indexOf(card);

            if (draggedCardIndex > targetCardIndex) {
                container.insertBefore(draggedCard, card);
                container.insertBefore(card, container.children[draggedCardIndex]);
            } else {
                container.insertBefore(card, draggedCard);
                container.insertBefore(draggedCard, container.children[targetCardIndex]);
            }
        }
    });
}