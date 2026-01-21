/* ================= CONFIG ================= */

const GITHUB_USER = "YOUR_GITHUB_USERNAME";
const REPO_NAME = "AWS-Cloud-Foundation";
const BRANCH = "main";

/* ================= ELEMENTS ================= */

const cards = document.getElementById("cards");
const sectionTitle = document.getElementById("section-title");

let currentItems = [];
let currentPath = "";

/* ================= API ================= */

async function fetchContents(path) {
    cards.innerHTML = "Loading...";

    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
    const response = await fetch(url);
    const data = await response.json();

    currentItems = data;
    renderItems(data);
}

/* ================= RENDER ================= */

function renderItems(items) {
    cards.innerHTML = "";

    if (currentPath && currentPath !== "PDFs") {
        const back = document.createElement("div");
        back.className = "card back-card";
        back.innerHTML = `<a>⬅ Back</a><span>Return</span>`;
        back.onclick = () => loadPDFRoot();
        cards.appendChild(back);
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        if (item.type === "dir") {
            card.innerHTML = `
                <a>PDFs/01-Networking ${item.name}</a>
                <span>Category</span>
            `;
            card.onclick = () => {
                currentPath = item.path;
                sectionTitle.textContent = item.name;
                fetchContents(item.path);
            };
        }

        if (item.type === "file" && item.name.endsWith(".pdf")) {
            card.innerHTML = `
                <a href="${item.download_url}" target="_blank">
                    📄 ${item.name}
                </a>
                <span>PDF</span>
            `;
        }

        if (item.type === "file" && !item.name.endsWith(".pdf")) {
            card.innerHTML = `
                <a href="${item.html_url}" target="_blank">
                    📘 ${item.name}
                </a>
                <span>Tutorial</span>
            `;
        }

        cards.appendChild(card);
    });
}

/* ================= SEARCH ================= */

function filterItems() {
    const value = document.getElementById("search").value.toLowerCase();
    const filtered = currentItems.filter(item =>
        item.name.toLowerCase().includes(value)
    );
    renderItems(filtered);
}

/* ================= LOADERS ================= */

function loadPDFRoot() {
    sectionTitle.textContent = "PDF Categories";
    currentPath = "PDFs";
    fetchContents("PDFs");
}

function loadTutorials() {
    sectionTitle.textContent = "Tutorials";
    currentPath = "tutorials";
    fetchContents("tutorials");
}
