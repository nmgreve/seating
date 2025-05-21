let data = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/seating.csv')
    .then(response => response.text())
    .then(csv => {
      data = parseCSV(csv);
    });

  const input = document.getElementById('nameInput');
  const list = document.getElementById('autocomplete-list');

  input.addEventListener('input', function () {
    const value = this.value.toLowerCase();
    list.innerHTML = '';

    if (!value) return;

    const matches = data.filter(item => item.name.toLowerCase().includes(value));
    matches.slice(0, 10).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name;
      li.addEventListener('click', () => selectName(item.name));
      list.appendChild(li);
    });
  });
});

function selectName(name) {
  const input = document.getElementById('nameInput');
  input.value = name;
  document.getElementById('autocomplete-list').innerHTML = '';

  const entry = data.find(item => item.name === name);
  if (!entry) return;

  const tablemates = data.filter(item => item.table === entry.table && item.name !== name);
  document.getElementById('tableNumber').textContent = entry.table;
  document.getElementById('tableImage').src = `map/table${entry.table.padStart(2, '0')}.png`;

  const matesList = document.getElementById('tablemates');
  matesList.innerHTML = '';
  tablemates.forEach(person => {
    const li = document.createElement('li');
    li.textContent = person.name;
    matesList.appendChild(li);
  });

  document.getElementById('result').classList.remove('hidden');
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n').slice(1); // Skip header
  return lines.map(line => {
    const [name, table] = line.split(',');
    return { name: name.trim(), table: table.trim() };
  });
}
