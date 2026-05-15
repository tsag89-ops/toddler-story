const storyTitle = document.getElementById('story-title');
const storyText = document.getElementById('story-text');
const storyImage = document.getElementById('story-image');
const nextBtn = document.getElementById('next-btn');
const readBtn = document.getElementById('read-btn');

// Curated toddler-friendly Wikipedia slugs
const topics = [
    "The_Tortoise_and_the_Hare", "The_Lion_and_the_Mouse", "The_Ant_and_the_Grasshopper", 
    "The_Fox_and_the_Grapes", "The_Crow_and_the_Pitcher", "The_Town_Mouse_and_the_Country_Mouse", 
    "The_Boy_Who_Cried_Wolf", "The_Goose_That_Laid_the_Golden_Eggs", "The_Fox_and_the_Stork", 
    "The_Dog_and_Its_Reflection", "The_Wind_and_the_Sun", "Anansi", "Momotarō", 
    "Kaguya-hime", "Urashima_Tarō", "The_Enormous_Turnip", "The_Gingerbread_Man", 
    "Stone_Soup", "The_Three_Little_Pigs", "Goldilocks_and_the_Three_Bears", 
    "Jack_and_the_Beanstalk", "The_Ugly_Duckling", "The_Princess_and_the_Pea", 
    "Thumbelina", "The_Elves_and_the_Shoemaker", "The_Magic_Porridge_Pot", "Pegasus", 
    "Phoenix_(mythology)", "Unicorn", "Selkie", "Tanuki", "Kitsune", "Leprechaun", 
    "Pixie", "Gnome", "Chinese_zodiac", "The_Nutcracker", "Rainbow", "Milky_Way", 
    "Aurora", "Constellation", "Shooting_star", "Coral_reef", "Waterfall", "Desert_oasis"
];

async function getNewStory() {
    window.speechSynthesis.cancel(); // Stop reading if a story is skipped
    
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    
    try {
        const response = await fetch(wikiUrl);
        const data = await response.json();
        
        storyTitle.innerText = data.title;
        storyText.innerText = data.extract;
        
        // Use Wikipedia's built-in media images safely
        if (data.originalimage && data.originalimage.source) {
            storyImage.src = data.originalimage.source;
        } else if (data.thumbnail && data.thumbnail.source) {
            storyImage.src = data.thumbnail.source;
        } else {
            // Stable, public fallback image link if Wikipedia lacks art
            storyImage.src = "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=600&fit=crop&q=80";
        }
        storyImage.style.display = 'block';
    } catch (err) {
        storyText.innerText = "Check your connection for a new story!";
    }
}

function readStory() {
    window.speechSynthesis.cancel(); // Reset audio queue
    const utterance = new SpeechSynthesisUtterance(storyText.innerText);
    utterance.rate = 0.8; // Gentle, slower pace for toddlers
    window.speechSynthesis.speak(utterance);
}

nextBtn.addEventListener('click', getNewStory);
readBtn.addEventListener('click', readStory);

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}