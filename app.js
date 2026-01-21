const GITHUB_USER = "YOUR_GITHUB_USERNAME";
const REPO_NAME = "AWS-Cloud-Foundation";
const BRANCH = "main";

const cards = document.getElementById("cards");
const sectionTitle = document.getElementById("section-title");

let currentItems = [];

async function loadSection(folder) {
    sectionTitle.textContent = folder.toUpperCase();
    cards.innerHTML = "Loading...";

    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${folder}?ref=${BRANCH}`;
    const response = await fetch(url);
    const data = await response.json();

    currentItems = data;
    renderCards(data);
}

function renderCards(items) {
    cards.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <a href="${item.download_url || item.html_url}" target="_blank">
                ${item.name}
            </a>
        `;
        cards.appendChild(card);
    });
}

function filterItems() {
    const value = document.getElementById("search").value.toLowerCase();
    const filtered = currentItems.filter(i =>
        i.name.toLowerCase().includes(value)
    );
    renderCards(filtered);
}
