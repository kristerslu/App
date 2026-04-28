const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeEvents() {
    console.log('Starting the scraper...');
    
    // Launch an invisible browser
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // The target website (Replace this with your chosen Turnhout/Padel site)
    const targetUrl = 'https://example-turnhout-events-site.be/agenda';
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });

    // Extract data from the page
    const events = await page.evaluate(() => {
        const eventArray = [];
        // Target the HTML elements containing the events
        const eventNodes = document.querySelectorAll('.event-card'); // <-- We will change this class later

        eventNodes.forEach((node, index) => {
            eventArray.push({
                id: `scraped-${index}`,
                title: node.querySelector('.title')?.innerText || 'Unknown Event',
                date: node.querySelector('.date')?.innerText || 'TBA',
                location: node.querySelector('.location')?.innerText || 'Turnhout',
                category: 'Local Event', // We can write logic to guess this later
                image: node.querySelector('img')?.src || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
                description: node.querySelector('.desc')?.innerText || '',
                link: node.querySelector('a')?.href || '#'
            });
        });
        return eventArray;
    });

    console.log(`Successfully scraped ${events.length} events!`);

    // Save the data to a JSON file
    fs.writeFileSync('events.json', JSON.stringify(events, null, 2));
    
    await browser.close();
}

scrapeEvents().catch(console.error);
