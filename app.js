// ========== STATE ==========
let extraCounts = {}; // e.g., {22: 1, 23: 2}

const content = document.getElementById('content');
const statusEl = document.getElementById('status');

function getRel(order) {
  return relations.find(r => r.order === order);
}

function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + type;
  setTimeout(() => statusEl.className = 'status', 2500); // Reset class instead of display:none
}

// ========== ADD / REMOVE ==========
function addAnother(baseOrder) {
  const currentData = collectData();
  
  if (!extraCounts[baseOrder]) {
    extraCounts[baseOrder] = 1;
  } else {
    extraCounts[baseOrder]++;
  }

  render(currentData);
  showStatus('Added another entry', 'success');
}

function removeRow(base, displayOrder) {
  let currentData = collectData();
  
  // 1. Remove the targeted row
  currentData = currentData.filter(item => String(item.order) !== String(displayOrder));
  
  // 2. Extract remaining extra rows for this specific base
  let extras = currentData.filter(item => String(item.order).startsWith(base + '-'));
  
  // 3. Filter out those extra rows from the main dataset temporarily
  currentData = currentData.filter(item => !String(item.order).startsWith(base + '-'));
  
  // 4. Re-inject them with corrected sequential numbering 
  extras.forEach((item, index) => {
    item.order = base + '-' + (index + 2);
    currentData.push(item);
  });
  
  extraCounts[base]--;
  render(currentData);
  showStatus('Row removed', 'success');
}

// ========== SYNC & BLUR HANDLERS ==========
function syncGotras() {
  const pGotra = document.getElementById('gotra-paternal')?.value || '';
  const mGotra = document.getElementById('gotra-maternal')?.value || '';

  document.querySelectorAll('#other-tbody tr').forEach(tr => {
    const base = parseInt(tr.dataset.base);
    const gotraInput = tr.querySelector('.person-gotra');
    if (base <= 19) {
      gotraInput.value = pGotra;
    } else if (base === 20 || base === 21) {
      gotraInput.value = mGotra;
    }
  });
}

function updateTotalCount() {
  const currentData = collectData();
  const count = currentData.filter(item => item.include === true).length;
  const countEl = document.getElementById('total-count');
  if (countEl) {
    countEl.textContent = `Total Included: ${count}`;
  }
}

function handleFieldInput(input) {
  const container = input.closest('.person, tr');
  if (container) {
    const checkbox = container.querySelector('.inc');
    if (!checkbox) return;

    if (input.classList.contains('name-input')) {
      // For Name: Check if typing, uncheck if cleared completely
      checkbox.checked = (input.value.trim() !== '');
    } else if (input.classList.contains('person-gotra')) {
      // For Gotra: Check if typing (don't auto-uncheck if they just clear Gotra to change it)
      if (input.value.trim() !== '') {
        checkbox.checked = true;
      }
    }
    updateTotalCount();
  }
}

function handleNameBlur(input, gender) {
  if (input.value.trim() === '') {
    input.value = gender === 'female' ? DEFAULT_FEMALE_NAME : DEFAULT_MALE_NAME;
  }
}

function handleGotraBlur(input) {
  if (input.value.trim() === '') {
    input.value = DEFAULT_GOTRA;
  }
  syncGotras(); // Ensure defaults cascade down to rows 14-21
}

// ========== RENDER ==========
function render(savedData = null) {
  content.innerHTML = '';

  let paternalGotra = DEFAULT_GOTRA;
  let maternalGotra = DEFAULT_GOTRA;

  if (savedData) {
    const p = savedData.find(s => s.order === 1);
    const m = savedData.find(s => s.order === 8);
    if (p && p.gotra) paternalGotra = p.gotra;
    if (m && m.gotra) maternalGotra = m.gotra;
  }

  // ===== 1. Pitru Varga =====
  renderVarga("1. Pitru Varga (Father's Side)", "gotra-paternal", paternalGotra, [[1,4],[2,5],[3,6],[7]], savedData);

  // ===== 2. Maataamaha Varga =====
  renderVarga("2. Maataamaha Varga (Mother's Father Side)", "gotra-maternal", maternalGotra, [[8,11],[9,12],[10,13]], savedData);

  // ===== 3. Other Pitrugalu =====
  const otherHeader = document.createElement('div');
  otherHeader.className = 'group-header';
  otherHeader.innerHTML = `<div class="group-title">3. Other Pitrugalu</div>`;
  content.appendChild(otherHeader);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'table-responsive';
  
  const table = document.createElement('table');
  table.className = 'other-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th class="col-order">Order</th>
        <th>Relation</th>
        <th class="col-gotra">Gotra</th>
        <th class="col-name">Name</th>
        <th class="col-include">Include</th>
        <th class="col-action">Action</th>
      </tr>
    </thead>
    <tbody id="other-tbody"></tbody>
  `;
  tableWrapper.appendChild(table);
  content.appendChild(tableWrapper);

  const tbody = document.getElementById('other-tbody');

  // Create rows for 14 to 41
  for (let base = 14; base <= 41; base++) {
    const rel = getRel(base);
    if (!rel) continue;

    const maxCount = extraCounts[base] || 0;

    for (let i = 0; i <= maxCount; i++) {
      const displayOrder = i === 0 ? base : base + '-' + (i + 1);
      const saved = savedData ? savedData.find(s => s.order == displayOrder) : null;

      let gotraVal = DEFAULT_GOTRA;
      if (base <= 19) gotraVal = paternalGotra;
      else if (base <= 21) gotraVal = maternalGotra;
      else if (saved && saved.gotra) gotraVal = saved.gotra;

      const nameVal = saved?.name || (rel.gender === 'female' ? DEFAULT_FEMALE_NAME : DEFAULT_MALE_NAME);
      const isChecked = saved ? saved.include === true : false;
      const readonlyGotra = base <= 21;

      createRow(tbody, base, displayOrder, rel, gotraVal, nameVal, isChecked, readonlyGotra, i === 0);
    }
  }
  updateTotalCount();
}

function renderVarga(title, gotraId, gotraValue, pairs, savedData) {
  const header = document.createElement('div');
  header.className = 'group-header';
  header.innerHTML = `
    <div class="group-title">${title}</div>
    <div class="group-gotra">
      <label>Gotra:</label>
      <input type="text" id="${gotraId}" value="${gotraValue}" oninput="syncGotras()" onblur="handleGotraBlur(this)">
    </div>
  `;
  content.appendChild(header);

  pairs.forEach(pair => {
    const pairDiv = document.createElement('div');
    pairDiv.className = 'pair' + (pair.length === 1 ? ' single' : '');

    pair.forEach(order => {
      const rel = getRel(order);
      const saved = savedData ? savedData.find(s => s.order === order) : null;
      const nameVal = saved?.name || '';
      const isChecked = saved ? saved.include === true : false;

      const person = document.createElement('div');
      person.className = 'person';
      person.dataset.order = order;

      const checkedAttr = isChecked ? 'checked' : '';

      person.innerHTML = `
        <div class="order">${order}</div>
        <div class="names">
          <div class="k">${rel.kannada}</div>
          <div class="s">${rel.sanskrit} • ${rel.english}</div>
        </div>
        <input type="text" class="name-input" value="${nameVal}" placeholder="Name" oninput="handleFieldInput(this)" onblur="handleNameBlur(this, '${rel.gender}')">
        <input type="checkbox" class="inc" ${checkedAttr} onchange="updateTotalCount()">
      `;
      pairDiv.appendChild(person);
    });

    if (pair.length === 1) pairDiv.appendChild(document.createElement('div'));
    content.appendChild(pairDiv);
  });
}

function createRow(tbody, base, displayOrder, rel, gotraVal, nameVal, isChecked, readonlyGotra, isMainRow) {
  const tr = document.createElement('tr');
  
  const disabledAttr = readonlyGotra ? 'disabled' : '';
  const checkedAttr = isChecked ? 'checked' : '';

  tr.innerHTML = `
    <td>
      <span class="order-badge">${displayOrder}</span>
    </td>
    <td>
      <strong>${rel.kannada}</strong>
      <br>
      <small class="text-muted">${rel.sanskrit} • ${rel.english}</small>
    </td>
    <td>
      <input type="text" class="person-gotra" value="${gotraVal}" ${disabledAttr} oninput="handleFieldInput(this)" onblur="handleGotraBlur(this)">
    </td>
    <td>
      <input type="text" class="name-input" value="${nameVal}" oninput="handleFieldInput(this)" onblur="handleNameBlur(this, '${rel.gender}')">
    </td>
    <td class="text-center">
      <input type="checkbox" class="inc" ${checkedAttr} onchange="updateTotalCount()">
    </td>
    <td>
      ${isMainRow 
        ? `<button type="button" class="btn-add" onclick="addAnother(${base})">+ Add</button>` 
        : `<button type="button" class="btn-remove" onclick="removeRow(${base}, '${displayOrder}')">- Remove</button>`}
    </td>
  `;

  tr.dataset.base = base;
  tr.dataset.display = displayOrder;
  tbody.appendChild(tr);
}

// ========== COLLECT ==========
function collectData() {
  const paternalGotra = document.getElementById('gotra-paternal')?.value.trim() || DEFAULT_GOTRA;
  const maternalGotra = document.getElementById('gotra-maternal')?.value.trim() || DEFAULT_GOTRA;

  const result = [];

  // Core 1-13
  document.querySelectorAll('.person').forEach(p => {
    const order = parseInt(p.dataset.order);
    result.push({
      order: order,
      name: p.querySelector('.name-input').value.trim(),
      gotra: order <= 7 ? paternalGotra : maternalGotra,
      include: p.querySelector('.inc').checked
    });
  });

  // Other table
  document.querySelectorAll('#other-tbody tr').forEach(tr => {
    const base = parseInt(tr.dataset.base);
    const display = tr.dataset.display; 

    let gotra = tr.querySelector('.person-gotra').value.trim() || DEFAULT_GOTRA;
    if (base <= 19) gotra = paternalGotra;
    if (base === 20 || base === 21) gotra = maternalGotra;

    result.push({
      order: display,
      name: tr.querySelector('.name-input').value.trim(),
      gotra: gotra,
      include: tr.querySelector('.inc').checked
    });
  });

  return result;
}

// ========== BUTTONS ==========
function saveData() {
  localStorage.setItem('pindaPradanaData', JSON.stringify(collectData()));
  showStatus('Data saved successfully!', 'success');
}

function loadData(silent = false) {
  const saved = localStorage.getItem('pindaPradanaData');
  if (saved) {
    const parsedData = JSON.parse(saved);
    
    extraCounts = {};
    parsedData.forEach(item => {
      if (typeof item.order === 'string' && item.order.includes('-')) {
        const parts = item.order.split('-');
        const base = parseInt(parts[0]);
        const num = parseInt(parts[1]); 
        if (!extraCounts[base] || extraCounts[base] < (num - 1)) {
          extraCounts[base] = num - 1;
        }
      }
    });

    render(parsedData);
    if (!silent) showStatus('Data loaded!', 'success');
  } else {
    if (!silent) showStatus('No saved data found', 'error');
  }
}

function resetToDefaults() {
  extraCounts = {};
  render(null);
  showStatus('Reset done', 'success');
}

// ========== START ==========
// Automatically load saved data if it exists, otherwise render defaults
if (localStorage.getItem('pindaPradanaData')) {
  loadData(true);
} else {
  render(null);
}

// ========== PDF GENERATION (PDFMAKE) ==========
function generatePDF() {
  const currentData = collectData();
  let includedData = currentData.filter(item => item.include);

  // 1. Sort the data numerically by Order
  // Handles parsing base numbers and sub-numbers (e.g., '22-2')
  includedData.sort((a, b) => {
    const parse = (ord) => {
      const parts = String(ord).split('-');
      return { 
        base: parseInt(parts[0]), 
        sub: parts[1] ? parseInt(parts[1]) : 0 
      };
    };
    const valA = parse(a.order);
    const valB = parse(b.order);
    
    if (valA.base !== valB.base) {
      return valA.base - valB.base;
    }
    return valA.sub - valB.sub;
  });

  // 2. Initialize the table body with 5 columns
  const tableBody = [
    [
      { text: 'S.No.', style: 'tableHeader', alignment: 'center' },
      { text: 'Order', style: 'tableHeader', alignment: 'center' },
      { text: 'Relation', style: 'tableHeader' },
      { text: 'Gotra', style: 'tableHeader' },
      { text: 'Name', style: 'tableHeader' }
    ]
  ];

  // 3. Map included data to table rows
  includedData.forEach((item, index) => {
    const baseOrder = (typeof item.order === 'string' && item.order.includes('-')) 
      ? parseInt(item.order.split('-')[0]) 
      : parseInt(item.order);
      
    const rel = getRel(baseOrder);
    
    // Skip Sanskrit, format as single line: Kannada (English)
    const relationText = rel ? `${rel.kannada} (${rel.english})` : '';

    tableBody.push([
      { text: (index + 1).toString(), alignment: 'center', margin: [0, 2, 0, 2] },
      { text: item.order.toString(), alignment: 'center', margin: [0, 2, 0, 2] },
      { text: relationText, margin: [0, 2, 0, 2] },
      { text: item.gotra, margin: [0, 2, 0, 2] },
      { text: item.name, margin: [0, 2, 0, 2] }
    ]);
  });

  // Add this right before const docDefinition = { ... }
  pdfMake.fonts = {
    NotoSansKannada: {
      normal: 'NotoSansKannada-Regular.ttf',
      bold: 'NotoSansKannada-Regular.ttf',       // Fallback to regular file
      italics: 'NotoSansKannada-Regular.ttf',    // Fallback to regular file
      bolditalics: 'NotoSansKannada-Regular.ttf' // Fallback to regular file
    }
  };


  // 4. Document Definition
  const docDefinition = {
    content: [
      { text: 'Pinda Pradana - Sequence List', style: 'header' },
      { text: `Total Persons Included: ${includedData.length}`, style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['8%', '10%', '37%', '20%', '25%'], // Added S.No. width
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex) {
            return (rowIndex === 0) ? '#f3f3f3' : null;
          }
        }
      }
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 11,
        alignment: 'center',
        margin: [0, 0, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: '#333'
      }
    },
    defaultStyle: {
      font: 'NotoSansKannada', // Ensure your custom font is active
      fontSize: 9
    },
    pageMargins: [40, 40, 40, 40]
  };

  // Generate and download
  pdfMake.createPdf(docDefinition).download('Pinda-Pradana-Sequence.pdf');
}