// Dragon Nest SEA Dungeon Finder

const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const dungeonList = document.getElementById('dungeonList');
const dungeonCount = document.getElementById('dungeonCount');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

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

let currentFilter = 'all';

function init() {
	renderDungeonList(dungeonData);
	setupEventListeners();
	updateDungeonCount(dungeonData);
}

function renderDungeonList(dungeons) {
	dungeonList.innerHTML = '';
	
	const filtered = currentFilter === 'all' 
		? dungeons 
		: dungeons.filter(d => d.type === currentFilter);
	
	filtered.forEach(dungeon => {
		if (!dungeon.name) return;
		
		const card = document.createElement('div');
		card.className = 'dungeon-card';
		card.innerHTML = `
			<div class="dungeon-card-header">
				<h3>${dungeon.name}</h3>
				<span class="dungeon-card-type ${dungeon.type.toLowerCase()}">${dungeon.type}</span>
			</div>
			<div class="dungeon-card-info">
				<span>${dungeon.location}</span>
				<span>Lv.${dungeon.level}</span>
				<span>${dungeon.partySize}P</span>
			</div>
		`;
		card.addEventListener('click', () => openModal(dungeon));
		dungeonList.appendChild(card);
	});
	
	updateDungeonCount(filtered);
}

function openModal(dungeon) {
	dungeonTitle.textContent = dungeon.name;
	dungeonType.textContent = dungeon.type;
	dungeonType.className = `badge ${dungeon.type.toLowerCase()}`;
	dungeonLocation.textContent = dungeon.location;
	dungeonGate.textContent = dungeon.gate;
	dungeonEntrance.textContent = dungeon.entrance;
	dungeonBoss.textContent = dungeon.boss;
	dungeonLevel.textContent = dungeon.level;
	dungeonParty.textContent = dungeon.partySize;
	dungeonDescription.textContent = dungeon.description;
	dungeonKeywords.innerHTML = dungeon.keywords
		.map(kw => `<span class="keyword-tag">${kw}</span>`)
		.join('');
	
	modal.classList.add('active');
}

function closeModal() {
	modal.classList.remove('active');
}

function searchDungeons(query) {
	if (!query.trim()) return [];
	const q = query.toLowerCase();
	return dungeonData.filter(d => 
		d.name && (
			d.name.toLowerCase().includes(q) ||
			d.keywords.some(kw => kw.toLowerCase().includes(q)) ||
			d.location.toLowerCase().includes(q)
		)
	);
}

function renderSuggestions(results) {
	if (!results.length) {
		searchSuggestions.classList.remove('active');
		return;
	}
	
	searchSuggestions.innerHTML = results.slice(0, 6).map(d => `
		<div class="suggestion-item" data-id="${d.id}">
			<span class="badge ${d.type.toLowerCase()}">${d.type}</span>
			<span>${d.name}</span>
		</div>
	`).join('');
	
	searchSuggestions.classList.add('active');
}

function updateDungeonCount(dungeons) {
	dungeonCount.textContent = dungeons.filter(d => d.name).length;
}

function setupEventListeners() {
	searchInput.addEventListener('input', e => {
		const results = searchDungeons(e.target.value);
		renderSuggestions(results);
	});
	
	searchSuggestions.addEventListener('click', e => {
		const item = e.target.closest('.suggestion-item');
		if (item) {
			const dungeon = dungeonData.find(d => d.id === parseInt(item.dataset.id));
			if (dungeon) {
				openModal(dungeon);
				searchInput.value = '';
				searchSuggestions.classList.remove('active');
			}
		}
	});
	
	searchInput.addEventListener('keydown', e => {
		if (e.key === 'Enter') {
			const results = searchDungeons(e.target.value);
			if (results.length) openModal(results[0]);
		}
	});
	
	document.addEventListener('click', e => {
		if (!e.target.closest('.search-box')) {
			searchSuggestions.classList.remove('active');
		}
	});
	
	filterButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			filterButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			currentFilter = btn.dataset.filter;
			renderDungeonList(dungeonData);
		});
	});
	
	modalClose.addEventListener('click', closeModal);
	modal.addEventListener('click', e => {
		if (e.target === modal) closeModal();
	});
	
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeModal();
	});
}

document.addEventListener('DOMContentLoaded', init);