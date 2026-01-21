/* =========================================================
   CONFIGURATION
   ========================================================= */

const GITHUB_USER = "ers-code"; // <-- change this
const REPO_NAME = "AWS-Cloud-Foundation";
const BRANCH = "main";

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const cards = document.getElementById("cards");
const sectionTitle = document.getElementById("section-title");
const searchInput = document.getElementById("search");

let currentItems = [];
let currentPath = "";

/* =========================================================
   CORE FETCH FUNCTION
   ========================================================= */

async function fetchContents(path) {
    cards.innerHTML = "Loading...";

    try {
        const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("GitHub API error");
        }

        const data = await response.json();
        currentItems = data;
        renderItems(data);

    } catch (error) {
        cards.innerHTML = "Failed to load content.";
        console.error(error);
    }
}

/* =========================================================
   RENDER LOGIC
   ========================================================= */

function renderItems(items) {
    cards.innerHTML = "";

    // Back button (only inside category folders)
    if (currentPath && currentPath !== "PDFs" && currentPath !== "tutorials") {
        const backCard = document.createElement("div");
        backCard.className = "card back-card";
        backCard.innerHTML = `<a>⬅ Back</a><span>Return to categories</span>`;
        backCard.onclick = () => loadPDFRoot();
        cards.appendChild(backCard);
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        /* ---------- FOLDER (CATEGORY) ---------- */
        if (item.type === "dir") {
            card.innerHTML = `
                <a>📂 ${item.name}</a>
                <span>Category</span>
            `;
            card.onclick = () => {
                currentPath = item.path;
                sectionTitle.textContent = item.name;
                searchInput.value = "";
                fetchContents(item.path);
            };
            cards.appendChild(card);
        }

        /* ---------- PDF FILES ONLY ---------- */
        if (
            item.type === "file" &&
            item.name.toLowerCase().endsWith(".pdf")
        ) {
            card.innerHTML = `
                <a href="${item.download_url}" target="_blank">
                    📄 ${item.name}
                </a>
                <span>PDF</span>
            `;
            cards.appendChild(card);
        }
    });

    // Empty folder safety
    if (cards.children.length === 0) {
        cards.innerHTML = "<div class='welcome'>No documents found.</div>";
    }
}

/* =========================================================
   SEARCH
   ========================================================= */

function filterItems() {
    const query = searchInput.value.toLowerCase();

    const filtered = currentItems.filter(item =>
        item.name.toLowerCase().includes(query)
    );

    renderItems(filtered);
}

/* =========================================================
   LOADERS
   ========================================================= */

function loadPDFRoot() {
    sectionTitle.textContent = "PDF Categories";
    currentPath = "PDFs";
    searchInput.value = "";
    fetchContents("PDFs");
}

function loadTutorials() {
    sectionTitle.textContent = "Tutorials";
    currentPath = "Tutorials";
    searchInput.value = "";
    fetchContents("Tutorials");
}
