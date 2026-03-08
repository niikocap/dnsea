// Dragon Nest SEA Dungeon Finder - Main Script

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const worldMap = document.getElementById('worldMap');
const dungeonList = document.getElementById('dungeonList');
const dungeonCount = document.getElementById('dungeonCount');
const filterButtons = document.querySelectorAll('.filter-btn');

// Info Panel Elements
const dungeonTitle = document.getElementById('dungeonTitle');
const dungeonType = document.getElementById('dungeonType');
const dungeonLocation = document.getElementById('dungeonLocation');
const dungeonGate = document.getElementById('dungeonGate');
const dungeonEntrance = document.getElementById('dungeonEntrance');
const dungeonBoss = document.getElementById('dungeonBoss');
const dungeonLevel = document.getElementById('dungeonLevel');
const dungeonParty = document.getElementById('dungeonParty');
const dungeonDescription = document.getElementById('dungeonDescription');
const dungeonKeywords = document.getElementById('dungeonKeywords');

// State
let currentFilter = 'all';
let selectedDungeon = null;

// Initialize the application
function init() {
	renderMap();
	renderDungeonList(dungeonData);
	setupEventListeners();
	updateDungeonCount(dungeonData);
}

// Render map markers
function renderMap() {
	worldMap.innerHTML = '';
	
	dungeonData.forEach(dungeon => {
		if (dungeon.name && dungeon.mapX && dungeon.mapY) {
			const marker = document.createElement('div');
			marker.className = `map-marker ${dungeon.type.toLowerCase()}`;
			marker.style.left = `${dungeon.mapX}%`;
			marker.style.top = `${dungeon.mapY}%`;
			
			const tooltip = document.createElement('div');
			tooltip.className = 'map-tooltip';
			tooltip.textContent = dungeon.name;
			tooltip.style.left = '50%';
			tooltip.style.top = '-35px';
			tooltip.style.transform = 'translateX(-50%)';
			
			marker.appendChild(tooltip);
			
			marker.addEventListener('click', () => selectDungeon(dungeon));
			worldMap.appendChild(marker);
		}
	});
}

// Render dungeon list
function renderDungeonList(dungeons) {
	dungeonList.innerHTML = '';
	
	const filteredDungeons = currentFilter === 'all' 
		? dungeons 
		: dungeons.filter(d => d.type === currentFilter);
	
	filteredDungeons.forEach((dungeon, index) => {
		if (dungeon.name) {
			const card = document.createElement('div');
			card.className = 'dungeon-card';
			card.style.animationDelay = `${index * 0.05}s`;
			
			card.innerHTML = `
				<div class="dungeon-card-header">
					<h3>${dungeon.name}</h3>
					<span class="dungeon-card-type ${dungeon.type.toLowerCase()}">${dungeon.type}</span>
				</div>
				<div class="dungeon-card-info">
					<span><i class="fas fa-map-marker-alt"></i> ${dungeon.location}</span>
					<span><i class="fas fa-level-up-alt"></i> Level ${dungeon.level}</span>
					<span><i class="fas fa-users"></i> ${dungeon.partySize} Players</span>
				</div>
			`;
			
			card.addEventListener('click', () => selectDungeon(dungeon));
			dungeonList.appendChild(card);
		}
	});
	
	updateDungeonCount(filteredDungeons);
}

// Select a dungeon and display its info
function selectDungeon(dungeon) {
	selectedDungeon = dungeon;
	
	// Update info panel
	dungeonTitle.textContent = dungeon.name;
	dungeonType.textContent = dungeon.type;
	dungeonType.className = `dungeon-type ${dungeon.type.toLowerCase()}`;
	dungeonLocation.textContent = dungeon.location;
	dungeonGate.textContent = dungeon.gate;
	dungeonEntrance.textContent = dungeon.entrance;
	dungeonBoss.textContent = dungeon.boss;
	dungeonLevel.textContent = dungeon.level;
	dungeonParty.textContent = dungeon.partySize;
	dungeonDescription.textContent = dungeon.description;
	
	// Update keywords
	dungeonKeywords.innerHTML = dungeon.keywords
		.map(kw => `<span class="keyword-tag">${kw}</span>`)
		.join('');
	
	// Scroll to info panel on mobile
	if (window.innerWidth < 900) {
		document.getElementById('infoPanel').scrollIntoView({ behavior: 'smooth' });
	}
	
	// Clear search
	searchInput.value = '';
	searchSuggestions.classList.remove('active');
}

// Search functionality
function searchDungeons(query) {
	if (!query.trim()) {
		searchSuggestions.classList.remove('active');
		return [];
	}
	
	const queryLower = query.toLowerCase();
	
	return dungeonData.filter(dungeon => {
		if (!dungeon.name) return false;
		
		// Search in name
		if (dungeon.name.toLowerCase().includes(queryLower)) return true;
		
		// Search in keywords
		if (dungeon.keywords.some(kw => kw.toLowerCase().includes(queryLower))) return true;
		
		// Search in location
		if (dungeon.location.toLowerCase().includes(queryLower)) return true;
		
		return false;
	});
}

// Render search suggestions
function renderSuggestions(results) {
	if (results.length === 0) {
		searchSuggestions.classList.remove('active');
		return;
	}
	
	searchSuggestions.innerHTML = results.slice(0, 8).map(dungeon => `
		<div class="suggestion-item" data-id="${dungeon.id}">
			<span class="type-badge ${dungeon.type.toLowerCase()}">${dungeon.type}</span>
			<span>${dungeon.name}</span>
		</div>
	`).join('');
	
	searchSuggestions.classList.add('active');
}

// Update dungeon count
function updateDungeonCount(dungeons) {
	const count = dungeons.filter(d => d.name).length;
	dungeonCount.textContent = count;
}

// Setup event listeners
function setupEventListeners() {
	// Search input
	searchInput.addEventListener('input', (e) => {
		const results = searchDungeons(e.target.value);
		renderSuggestions(results);
	});
	
	// Search suggestions click
	searchSuggestions.addEventListener('click', (e) => {
		const item = e.target.closest('.suggestion-item');
		if (item) {
			const id = parseInt(item.dataset.id);
			const dungeon = dungeonData.find(d => d.id === id);
			if (dungeon) selectDungeon(dungeon);
		}
	});
	
	// Search on Enter
	searchInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			const results = searchDungeons(e.target.value);
			if (results.length > 0) {
				selectDungeon(results[0]);
			}
		}
	});
	
	// Close suggestions on click outside
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.search-container')) {
			searchSuggestions.classList.remove('active');
		}
	});
	
	// Filter buttons
	filterButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			filterButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			currentFilter = btn.dataset.filter;
			renderDungeonList(dungeonData);
		});
	});
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);