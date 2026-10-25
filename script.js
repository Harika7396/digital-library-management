const categoryButtons = document.querySelectorAll('.category');
const searchInput = document.querySelector('#searchInput');
const availabilityFilter = document.querySelector('#availabilityFilter');
const sortBooks = document.querySelector('#sortBooks');
const bookGrid = document.querySelector('#bookGrid');
const bookCount = document.querySelector('#bookCount');
const emptyMessage = document.querySelector('#emptyMessage');
const catalogTable = document.querySelector('#catalogTable');
let activeCategory = 'all';

function updateBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const availability = availabilityFilter.value;
  const cards = [...bookGrid.querySelectorAll('.book-card')];
  let visible = [];
  cards.forEach(card => {
    const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
    const matchesAvailability = availability === 'all' || card.dataset.availability === availability;
    const matchesSearch = (card.dataset.title + ' ' + card.dataset.author).toLowerCase().includes(query);
    const show = matchesCategory && matchesAvailability && matchesSearch;
    card.classList.toggle('hidden', !show);
    if (show) visible.push(card);
  });
  visible.sort((a,b) => a.dataset[sortBooks.value].localeCompare(b.dataset[sortBooks.value]));
  visible.forEach(card => bookGrid.appendChild(card));
  bookCount.textContent = `${visible.length} BOOK${visible.length === 1 ? '' : 'S'}`;
  emptyMessage.hidden = visible.length > 0;

  catalogTable.innerHTML = visible.map(card => {
    const category = card.dataset.category;
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    const year = card.querySelector('.book-bottom span:last-child').textContent;
    const status = card.dataset.availability === 'available' ? 'Available' : 'Borrowed';
    return `<tr><td>${card.dataset.title}</td><td>${card.dataset.author}</td><td>${categoryLabel}</td><td>${year}</td><td>${status}</td></tr>`;
  }).join('');
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  categoryButtons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  activeCategory = button.dataset.category;
  updateBooks();
}));
searchInput.addEventListener('input', updateBooks);
availabilityFilter.addEventListener('change', updateBooks);
sortBooks.addEventListener('change', updateBooks);
updateBooks();
