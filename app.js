// --- CONFIGURATION ---
// You will replace this with your real key from Platform Publiq later
const PUBLIQ_API_KEY = 'YOUR_API_KEY_HERE'; 
const POSTAL_CODE = '2300'; // Turnhout

let appEvents = []; // Global state to hold fetched events

// --- 1. FETCH LIVE DATA ---
async function initializeApp() {
    const feed = document.getElementById('event-feed');
    feed.innerHTML = '<div class="text-center mt-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div><p class="text-gray-500 mt-4 font-medium">Finding events in the Kempen...</p></div>';

    if (PUBLIQ_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn("No API key detected. Booting in Demo Mode.");
        appEvents = getMockData(); // Load dummy data for UI testing
        setTimeout(() => renderFeed('all'), 800);
        return;
    }

    try {
        // Fetching real events from UiTdatabank for Turnhout area
        const response = await fetch(`https://search.uitdatabank.be/events/?q=postalCode:${POSTAL_CODE}&embed=true&limit=15`, {
            headers: { 'X-Api-Key': PUBLIQ_API_KEY }
        });
        
        if (!response.ok) throw new Error('API Request Failed');
        
        const data = await response.json();
        
        // Map the complex Publiq JSON into our clean App format
        appEvents = data.member.map((item, index) => ({
            id: item['@id'] || `event-${index}`,
            title: item.name?.nl || item.name || 'Local Event',
            date: item.startDate ? new Date(item.startDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' }) : 'Date TBA',
            location: item.location?.name?.nl || 'Turnhout',
            category: item.terms ? item.terms[0]?.label : 'Event',
            image: item.image || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
            description: item.description?.nl || 'Join us for this exciting local event in the heart of the Kempen.',
            link: item.url || item['@id']
        }));

        renderFeed('all');

    } catch (error) {
        console.error("Fetch error:", error);
        appEvents = getMockData(); // Graceful fallback
        renderFeed('all');
    }
}

// --- 2. RENDER THE UI ---
function renderFeed(filter = 'all') {
    const feed = document.getElementById('event-feed');
    feed.innerHTML = ''; 

    // Normalize filter matching
    const filteredEvents = filter === 'all' 
        ? appEvents 
        : appEvents.filter(e => e.category.toLowerCase().includes(filter.toLowerCase()) || e.id.includes(filter));

    if (filteredEvents.length === 0) {
        feed.innerHTML = '<p class="text-center text-gray-500 mt-10">No events found for this filter.</p>';
        return;
    }

    filteredEvents.forEach((event, index) => {
        const card = document.createElement('div');
        // Make the entire card clickable
        card.className = 'bg-white rounded-2xl shadow-sm mb-5 overflow-hidden border border-gray-100 cursor-pointer transform transition hover:shadow-md hover:-translate-y-1';
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

        // Inject your eCommerce Ad after the 2nd event
        if (index === 1) {
            const adCard = document.createElement('div');
            adCard.className = 'bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl shadow-md mb-5 overflow-hidden text-white flex cursor-pointer';
            adCard.onclick = () => window.open('https://your-shopify-store.com', '_blank');
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

// --- 3. MODAL LOGIC (The "In-Depth" View) ---
window.openModal = (id) => {
    const event = appEvents.find(e => e.id === id);
    if(!event) return;

    document.getElementById('modal-image').src = event.image;
    document.getElementById('modal-title').textContent = event.title;
    document.getElementById('modal-category').textContent = event.category;
    document.getElementById('modal-date').textContent = event.date;
    document.getElementById('modal-location').textContent = event.location;
    document.getElementById('modal-description').innerHTML = event.description;
    document.getElementById('modal-link').href = event.link;

    const modal = document.getElementById('event-modal');
    const content = document.getElementById('modal-content');
    
    modal.classList.remove('hidden');
    // Micro-delay ensures the CSS transition fires
    setTimeout(() => {
        content.classList.remove('translate-y-full');
    }, 10);
};

window.closeModal = () => {
    const modal = document.getElementById('event-modal');
    const content = document.getElementById('modal-content');
    
    // Slide down first
    content.classList.add('translate-y-full');
    // Hide overlay after animation finishes
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

window.filterEvents = (category) => renderFeed(category);

// --- 4. FALLBACK DATA (Demo Mode) ---
function getMockData() {
    return [
        { id: "mock-1", title: "Zomerbar Den Hof", date: "Friday, 19:00", location: "Kasteelplein, Turnhout", category: "Zomerbar", image: "https://images.unsplash.com/photo-1533143716616-98188af41df6?auto=format&fit=crop&w=400&q=80", description: "The biggest pop-up summer bar in Turnhout is back. Enjoy signature cocktails, local craft beers, and a live DJ set as the sun goes down.", link: "https://zomerbardenhof.be" },
        { id: "mock-2", title: "Kempen Padel Open", date: "Saturday, 09:00 - 18:00", location: "Padelclub Turnhout", category: "Padel", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80", description: "A highly anticipated amateur padel tournament. Food trucks and an open bar will be available for spectators. Registration required for players.", link: "#" },
        { id: "mock-3", title: "Acoustic Forest Sessions", date: "Sunday, 15:00", location: "Vosselaar Woods", category: "Music", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80", description: "An intimate, unplugged concert hidden deep in the woods. Bring your own blanket and drinks. Location will be sent upon ticket purchase.", link: "#" }
    ];
}

// Start the app!
window.onload = initializeApp;
