// 1. Mock Database (To be replaced with API later)
const events = [
    { id: 1, title: "Turnhout Zomerbar Grand Opening", date: "Friday, June 12", location: "Stadspark Turnhout", category: "zomerbar", image: "https://images.unsplash.com/photo-1533143716616-98188af41df6?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Kempen Padel Open (Amateur)", date: "Saturday, June 13", location: "Padelclub Turnhout", category: "padel", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Acoustic Sunset Sessions", date: "Sunday, June 14", location: "Kasteelplein", category: "music", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Secret Garden Pop-up", date: "Next Friday", location: "Vosselaar Woods", category: "zomerbar", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80" }
];

// 2. Your E-commerce Injection (The Monetization)
const sponsorAd = {
    title: "Level Up Your Padel Game",
    description: "Premium, water-resistant padel bags designed in the Kempen. Get 15% off this weekend.",
    buttonText: "Shop Now",
    image: "https://images.unsplash.com/photo-1592709823126-7a725176b9df?auto=format&fit=crop&w=400&q=80",
    link: "https://your-shopify-store.com"
};

// 3. Render Function
function renderFeed(filter = 'all') {
    const feed = document.getElementById('event-feed');
    feed.innerHTML = ''; // Clear current feed

    // Filter logic
    const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);

    if (filteredEvents.length === 0) {
        feed.innerHTML = '<p class="text-center text-gray-500 mt-10">No events found for this category yet.</p>';
        return;
    }

    // Build the UI
    filteredEvents.forEach((event, index) => {
        // Create Event Card
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm mb-5 overflow-hidden border border-gray-100';
        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="w-full h-40 object-cover">
            <div class="p-4">
                <p class="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wider">${event.category}</p>
                <h2 class="text-lg font-bold text-gray-900 leading-tight mb-1">${event.title}</h2>
                <div class="flex items-center text-gray-500 text-sm mt-2">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>${event.date}</span>
                </div>
                <div class="flex items-center text-gray-500 text-sm mt-1">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>${event.location}</span>
                </div>
            </div>
        `;
        feed.appendChild(card);

        // Inject Ad after the 2nd event
        if (index === 1) {
            const adCard = document.createElement('div');
            adCard.className = 'bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md mb-5 overflow-hidden text-white';
            adCard.innerHTML = `
                <div class="flex">
                    <div class="p-4 flex-1">
                        <span class="bg-black bg-opacity-20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Sponsored</span>
                        <h3 class="font-bold text-lg mt-2">${sponsorAd.title}</h3>
                        <p class="text-sm text-indigo-100 mt-1 line-clamp-2">${sponsorAd.description}</p>
                        <a href="${sponsorAd.link}" target="_blank" class="inline-block mt-3 bg-white text-indigo-600 text-sm font-bold py-1 px-3 rounded-full shadow hover:bg-gray-100 transition">
                            ${sponsorAd.buttonText}
                        </a>
                    </div>
                    <div class="w-1/3">
                        <img src="${sponsorAd.image}" class="w-full h-full object-cover" alt="Ad">
                    </div>
                </div>
            `;
            feed.appendChild(adCard);
        }
    });
}

// 4. Initial Load
window.onload = () => renderFeed('all');

// 5. Global Filter Function accessible by HTML buttons
window.filterEvents = (category) => {
    renderFeed(category);
};
