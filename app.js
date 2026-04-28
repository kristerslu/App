// --- GLOBAL STATE ---
let appEvents = []; 

// --- 1. INITIALIZE & FETCH DATA ---
async function initializeApp() {
    const feed = document.getElementById('event-feed');
    
    // Show a loading spinner while fetching
    feed.innerHTML = `
        <div class="text-center mt-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="text-gray-500 mt-4 font-medium">Loading the latest events...</p>
        </div>
    `;

    try {
        // Fetch the locally generated JSON file created by your GitHub scraper
        // Note: Make sure 'events.json' is pushed to your repository for this to work
        const response = await fetch('./events.json');
        
        if (!response.ok) {
            throw new Error('events.json not found or not ready yet.');
        }
        
        appEvents = await response.json();
        renderFeed('all');

    } catch (error) {
        console.warn("Fetch warning:", error.message);
        console.log("Loading Demo Data as a fallback.");
        appEvents = getMockData(); // Fallback to demo data if the file isn't ready
        
        // Small delay to make the loading transition look smooth
        setTimeout(() => {
            renderFeed('all');
        }, 500);
    }
}

// --- 2. RENDER THE EVENT FEED ---
function renderFeed(filter = 'all') {
    const feed = document.getElementById('event-feed');
    feed.innerHTML = ''; 

    // Filter logic: Check if the category matches the button pressed
    const filteredEvents = filter === 'all' 
        ? appEvents 
        : appEvents.filter(e => e.category.toLowerCase().includes(filter.toLowerCase()) || e.id.includes(filter));

    // Handle empty states
    if (filteredEvents.length === 0) {
        feed.innerHTML = `
            <div class="text-center mt-20">
                <p class="text-gray-500 font-medium">No events found for this category.</p>
                <button onclick="filterEvents('all')" class="mt-4 text-indigo-600 font-bold text-sm">View all events</button>
            </div>
        `;
        return;
    }

    // Build the UI Cards
    filteredEvents.forEach((event, index) => {
        const card = document.createElement('div');
        // Make the entire card clickable
        card.className = 'bg-white rounded-2xl shadow-sm mb-5 overflow-hidden border border-gray-100 cursor-pointer transform transition hover:shadow-md hover:-translate-y-1 fade-in';
        card.onclick = () => openModal(event.id); 
        
        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="w-full h-44 object-cover">
            <div class="p-5">
                <p class="text-[10px] font-bold text-indigo-600 mb-1.5 uppercase tracking-widest">${event.category}</p>
                <h2 class="text-lg font-extrabold text-gray-900 leading-tight mb-2">${event.title}</h2>
                <div class="flex items-center text-gray-500 text-sm mt-2">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span class="truncate">${event.date}</span>
                </div>
            </div>
        `;
        feed.appendChild(card);

        // --- MONETIZATION: Inject your eCommerce Ad after the 2nd event ---
        if (index === 1) {
            const adCard = document.createElement('div');
            adCard.className = 'bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl shadow-md mb-5 overflow-hidden text-white flex cursor-pointer fade-in';
            adCard.onclick = () => window.open('https://your-shopify-store.com', '_blank'); // Link to your store
            adCard.innerHTML = `
                <div class="p-5 flex-1 flex flex-col justify-center">
                    <span class="bg-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded w-max uppercase tracking-wider mb-2">Sponsored</span>
                    <h3 class="font-extrabold text-lg leading-tight">Pro Padel Gear</h3>
                    <p class="text-xs text-indigo-200 mt-1.5 mb-3 line-clamp-2">Designer bags engineered in the Kempen. Elevate your post-match style.</p>
                    <span class="text-sm font-bold text-indigo-400">Shop Now →</span>
                </div>
                <div class="w-2/5">
                    <img src="https://images.unsplash.com/photo-1592709823126-7a725176b9df?auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover" alt="Ad">
                </div>
            `;
            feed.appendChild(adCard);
        }
    });
}

// --- 3. MODAL LOGIC (The Bottom Sheet) ---
window.openModal = (id) => {
    // Find the specific event clicked
    const event = appEvents.find(e => e.id === id);
    if (!event) return;

    // Populate the modal content
    document.getElementById('modal-image').src = event.image;
    document.getElementById('modal-title').textContent = event.title;
    document.getElementById('modal-category').textContent = event.category;
    document.getElementById('modal-date').textContent = event.date;
    document.getElementById('modal-location').textContent = event.location;
    document.getElementById('modal-description').innerHTML = event.description;
    
    const linkBtn = document.getElementById('modal-link');
    if (event.link && event.link !== '#') {
        linkBtn.href = event.link;
        linkBtn.style.display = 'block';
    } else {
        linkBtn.style.display = 'none'; // Hide button if there is no link
    }

    // Trigger animations to show the modal
    const modal = document.getElementById('event-modal');
    const content = document.getElementById('modal-content');
    
    modal.classList.remove('hidden');
    // Micro-delay ensures the CSS transition fires correctly
    setTimeout(() => {
        content.classList.remove('translate-y-full');
    }, 10);
};

window.closeModal = () => {
    const modal = document.getElementById('event-modal');
    const content = document.getElementById('modal-content');
    
    // Slide down animation first
    content.classList.add('translate-y-full');
    
    // Hide overlay after the slide animation finishes (300ms)
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

// --- 4. FILTERING ROUTER ---
window.filterEvents = (category) => {
    renderFeed(category);
};

// --- 5. FALLBACK DATA (Demo Mode) ---
function getMockData() {
    return [
        { 
            id: "mock-1", 
            title: "Zomerbar Den Hof Opening", 
            date: "Friday, 19:00", 
            location: "Kasteelplein, Turnhout", 
            category: "Zomerbar", 
            image: "https://images.unsplash.com/photo-1533143716616-98188af41df6?auto=format&fit=crop&w=400&q=80", 
            description: "The biggest pop-up summer bar in Turnhout is back. Enjoy signature cocktails, local craft beers, and a live DJ set as the sun goes down.", 
            link: "https://example.com/zomerbar" 
        },
        { 
            id: "mock-2", 
            title: "Kempen Padel Open", 
            date: "Saturday, 09:00 - 18:00", 
            location: "Padelclub Turnhout", 
            category: "Padel", 
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80", 
            description: "A highly anticipated amateur padel tournament. Food trucks and an open bar will be available for spectators. Registration required for players.", 
            link: "#" 
        },
        { 
            id: "mock-3", 
            title: "Acoustic Forest Sessions", 
            date: "Sunday, 15:00", 
            location: "Vosselaar Woods", 
            category: "Music", 
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80", 
            description: "An intimate, unplugged concert hidden deep in the woods. Bring your own blanket and drinks. Location will be sent upon ticket purchase.", 
            link: "#" 
        },
        { 
            id: "mock-4", 
            title: "Sunday Local Market", 
            date: "Sunday, 08:00 - 13:00", 
            location: "Grote Markt, Turnhout", 
            category: "Market", 
            image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80", 
            description: "Discover the best local produce, handmade crafts, and fresh food from vendors all across the Kempen region.", 
            link: "#" 
        }
    ];
}

// --- BOOT UP ---
window.onload = initializeApp;
