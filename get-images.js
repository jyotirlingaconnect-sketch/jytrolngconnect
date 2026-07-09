const fs = require('fs');

async function getImageUrl(pageTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=1000`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;
    return pages[pageId].thumbnail?.source || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function main() {
  const places = [
    "Mahakaleshwar Jyotirlinga",
    "Kal Bhairav Temple, Ujjain",
    "Omkareshwar",
    "Amareshwar",
    "Maheshwar",
    "Mandu, Madhya Pradesh",
    "Khajrana Ganesh Temple"
  ];
  
  for (const place of places) {
    const url = await getImageUrl(place);
    console.log(`${place}: ${url}`);
  }
}

main();
