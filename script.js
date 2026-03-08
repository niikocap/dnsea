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
	worldMap.innerHTML = `
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<!-- Background Ocean -->
			<rect x="0" y="0" width="100" height="100" class="map-water"/>
			
			<!-- Main Continent - Alteria -->
			<!-- Northern Mountains -->
			<path d="M5 15 L15 10 L25 12 L35 8 L45 10 L55 5 L65 8 L75 5 L85 10 L95 8 L95 25 L85 22 L75 25 L65 20 L55 25 L45 22 L35 25 L25 20 L15 25 L5 22 Z" class="map-mountain"/>
			
			<!-- Prairie Region (Calderock) -->
			<path d="M5 25 L25 20 L35 25 L35 40 L25 45 L15 42 L5 45 Z" class="map-forest"/>
			<text x="20" y="35" class="map-region-label">CALDEROCK</text>
			
			<!-- Lotus Marsh Region -->
			<path d="M5 45 L15 42 L25 45 L30 55 L25 65 L15 68 L5 65 L5 55 Z" class="map-water" style="fill: rgba(60, 80, 60, 0.3);"/>
			<text x="15" y="55" class="map-region-label">LOTUS MARSH</text>
			
			<!-- Saint's Haven (Central) -->
			<path d="M35 25 L55 25 L60 35 L55 50 L45 55 L35 50 L30 40 Z" class="map-region"/>
			<text x="45" y="40" class="map-region-label">SAINT'S HAVEN</text>
			
			<!-- Hermalte Port (South) -->
			<path d="M25 65 L45 55 L55 60 L50 75 L35 80 L20 75 Z" class="map-water" style="fill: rgba(40, 70, 100, 0.25);"/>
			<text x="38" y="68" class="map-region-label">HERMALTE PORT</text>
			
			<!-- Anu Arendel (East) -->
			<path d="M60 35 L75 30 L90 35 L95 50 L90 65 L75 70 L60 65 L55 50 Z" class="map-forest" style="fill: rgba(50, 100, 80, 0.15);"/>
			<text x="75" y="50" class="map-region-label">ANU ARENDEL</text>
			
			<!-- Riverwort Wharf -->
			<path d="M35 40 L45 35 L55 40 L50 50 L40 52 Z" class="map-water" style="fill: rgba(50, 70, 90, 0.2);"/>
			
			<!-- Rhadames Region -->
			<path d="M55 50 L70 45 L80 50 L75 60 L65 65 L55 60 Z" class="map-desert"/>
			<text x="67" y="55" class="map-region-label">RHADAMES</text>
			
			<!-- Merca's Heart (Far East) -->
			<path d="M80 35 L95 30 L95 55 L85 60 L75 55 L80 45 Z" class="map-forest"/>
			<text x="87" y="45" class="map-region-label">MERCA'S HEART</text>
			
			<!-- Foothills Black Mountain -->
			<path d="M5 65 L20 60 L30 65 L25 80 L15 85 L5 80 Z" class="map-mountain"/>
			<text x="15" y="75" class="map-region-label">BLACK MTN</text>
			
			<!-- Lotus Palace Area -->
			<path d="M30 65 L45 60 L55 65 L50 80 L40 85 L30 80 Z" class="map-region"/>
			<text x="42" y="75" class="map-region-label">LOTUS PALACE</text>
			
			<!-- Volcanic Area -->
			<path d="M75 55 L85 50 L95 55 L90 70 L80 75 L70 70 Z" class="map-lava"/>
			
			<!-- Islands -->
			<ellipse cx="20" cy="90" rx="8" ry="5" class="map-water" style="fill: rgba(60, 90, 60, 0.2);"/>
			<text x="20" y="92" class="map-region-label" style="font-size: 7px;">ISLANDS</text>
			
			<!-- Decorative Elements -->
			<!-- Rivers -->
			<path d="M45 50 Q50 55 48 65 Q46 75 50 85" stroke="rgba(100, 150, 200, 0.3)" stroke-width="0.5" fill="none"/>
			<path d="M35 45 Q30 50 25 55 Q20 60 15 65" stroke="rgba(100, 150, 200, 0.3)" stroke-width="0.5" fill="none"/>
			
			<!-- Roads (dashed lines) -->
			<path d="M20 35 L35 40 L45 45" stroke="rgba(200, 180, 150, 0.2)" stroke-width="0.3" stroke-dasharray="1,1" fill="none"/>
			<path d="M45 45 L55 50 L75 50" stroke="rgba(200, 180, 150, 0.2)" stroke-width="0.3" stroke-dasharray="1,1" fill="none"/>
			<path d="M45 45 L40 60 L38 70" stroke="rgba(200, 180, 150, 0.2)" stroke-width="0.3" stroke-dasharray="1,1" fill="none"/>
		</svg>
	`;
	
	// Now add markers on top of the SVG
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