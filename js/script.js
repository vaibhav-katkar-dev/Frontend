



let fields = [];

let selectedFieldId = null;

const formArea = document.getElementById('formArea');
const formTitle = document.getElementById('formTitle');
const formDesc = document.getElementById('formDesc');
const propPanel = document.getElementById('propertiesPanel');
const propLabel = document.getElementById('propLabel');
const propPlaceholder = document.getElementById('propPlaceholder');
const propRequired = document.getElementById('propRequired');
const propOptions = document.getElementById('propOptions');
const optionInputs = document.getElementById('optionInputs');

const urlParams = new URLSearchParams(window.location.search);
const formId = urlParams.get('formId');

document.addEventListener('DOMContentLoaded', () => {
  
  if (formId) {
    const id = formId.trim();
    console.log("Editing form with ID:", id);
    // Editing mode
    fetch(`http://127.0.0.1:5000/api/forms/by-id/${formId}`)
      .then(res => res.json())
      .then(data => {
  console.log("Editing form with ID:", data);

  // ✅ Set form title and WhatsApp number (description)
  formTitle.innerText = data.title || 'Untitled Form';
  formDesc.value = data.description || '';  // WhatsApp number goes here

  // Clear previous fields
  fields = [];

  // Load saved fields
  const existingFields = data.fields.map(field => ({
    ...field,
    id: field.id || ('field_' + Date.now() + Math.random())
  }));
  console.log("Loaded fields:", data.description );

  fields.push(...existingFields);
  renderForm();
})

      .catch(err => console.error("Error loading form:", err));
  }
});



function addField(type, existingField = null) {
  const id = 'field_' + Date.now();

  // If existingField is passed, log it for debugging
  if (existingField) {
    console.log("👉 Adding existing field:", existingField);
  }

  const newField = existingField || {
    id,
    type,
    label: `New ${type} field`,
    placeholder: type === 'textarea' ? 'Enter your response...' : 'Enter text...',
    required: false,
    options: (type === 'radio' || type === 'select') ? ['Option 1', 'Option 2'] : []
  };

  fields.push(newField);
  renderForm();
  selectField(newField.id);
}


function renderForm() {
  formArea.innerHTML = '';

  fields.forEach((field, index) => {
    const div = document.createElement('div');
    div.className = 'field-card' + (selectedFieldId === field.id ? ' selected' : '');
    div.setAttribute('draggable', true);
    div.dataset.index = index;

    // Drag events
    div.addEventListener('dragstart', dragStart);
    div.addEventListener('dragover', dragOver);
    div.addEventListener('drop', dragDrop);
    div.addEventListener('dragend', dragEnd);

    div.onclick = (e) => {
      e.stopPropagation();
      selectField(field.id);
    };

    div.innerHTML = `
      <div style="position: relative; border: 0.1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: #f7f7f7ff;">
        <i 
          class="fa-solid fa-xmark" 
          onclick="event.stopPropagation(); removeField('${field.id}')"
          style="position: absolute; top: 8px; right: 8px; background-color: #ff4d4d; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; font-size: 14px; line-height: 25px; text-align: center; cursor: pointer;"
          title="Remove Field"
        ></i>
        <label style="font-weight: bold;">${field.label} ${field.required ? '<span style="color:red">*</span>' : ''}</label><br/>
        ${renderInput(field)}
      </div>
    `;

    formArea.appendChild(div);
  });
}
function renderInput(field) {
  switch (field.type) {
    case 'textarea':
      return `<textarea placeholder="${field.placeholder}" disabled></textarea>`;
    case 'checkbox':
      return `
        <div class="checkbox-option">
          <input type="checkbox" disabled />
          <label>${field.label}</label>
        </div>
      `;
    case 'radio':
      return field.options.map(opt =>
        `<div class="radio-option">
          <input type="radio" name="${field.id}" disabled />
          <label>${opt}</label>
        </div>`
      ).join('');
    case 'select':
      return `
        <select disabled>
          ${field.options.map(opt => `<option>${opt}</option>`).join('')}
        </select>
      `;
    default:
      return `<input type="${field.type}" placeholder="${field.placeholder}" disabled />`;
  }
}


function removeField(id) {
  fields = fields.filter(f => f.id !== id);
  if (selectedFieldId === id) selectedFieldId = null;
  propPanel.classList.add('hidden');
  renderForm();
}

function selectField(id) {
  selectedFieldId = id;
  const field = fields.find(f => f.id === id);
  propLabel.value = field.label;
  propPlaceholder.value = field.placeholder || '';
  propRequired.checked = field.required || false;
  renderOptions(field);
  propPanel.classList.remove('hidden');
  renderForm();
}

function renderOptions(field) {
  if (field.type === 'radio' || field.type === 'select') {
    propOptions.classList.remove('hidden');
    optionInputs.innerHTML = '';

    field.options.forEach((opt, idx) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '8px';
      wrapper.style.marginBottom = '8px';

      const input = document.createElement('input');
      input.value = opt;
      input.style.flex = '1';
      input.oninput = (e) => {
        field.options[idx] = e.target.value;
        renderForm();
      };

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✕';
      removeBtn.title = 'Remove Option';
      removeBtn.style.padding = '4px 8px';
      removeBtn.style.background = '#ff4d4d';
      removeBtn.style.color = '#fff';
      removeBtn.style.border = 'none';
      removeBtn.style.borderRadius = '4px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.onclick = () => {
        field.options.splice(idx, 1);
        renderOptions(field);
        renderForm();
      };

      wrapper.appendChild(input);
      wrapper.appendChild(removeBtn);
      optionInputs.appendChild(wrapper);
    });
  } else {
    propOptions.classList.add('hidden');
  }
}


propLabel.oninput = () => {
  const field = fields.find(f => f.id === selectedFieldId);
  field.label = propLabel.value;
  renderForm();
};

propPlaceholder.oninput = () => {
  const field = fields.find(f => f.id === selectedFieldId);
  field.placeholder = propPlaceholder.value;
  renderForm();
};

propRequired.onchange = () => {
  const field = fields.find(f => f.id === selectedFieldId);
  field.required = propRequired.checked;
  renderForm();
};

function addOption() {
  const field = fields.find(f => f.id === selectedFieldId);
  field.options.push('New Option');
  renderOptions(field);
  renderForm();
}

function closeProperties() {
  const panel = document.getElementById('propertiesPanel');
  if (panel) {
    panel.classList.add('hidden');
  }
}



//dragabke
let dragStartIndex = null;

function dragStart(e) {
  dragStartIndex = +this.dataset.index;
  this.classList.add('dragging');
}

function dragOver(e) {
  e.preventDefault(); // Required to allow drop
  this.classList.add('drag-over');
}

function dragDrop(e) {
  const dragEndIndex = +this.dataset.index;
  swapFields(dragStartIndex, dragEndIndex);
  renderForm();
}

function dragEnd(e) {
  this.classList.remove('dragging');
  const cards = document.querySelectorAll('.field-card');
  cards.forEach(card => card.classList.remove('drag-over'));
}

function swapFields(from, to) {
  const temp = fields[from];
  fields.splice(from, 1);
  fields.splice(to, 0, temp);
}
