

// formActions.js
 document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const formId = urlParams.get('formId');
  if (!formId) {
    document.querySelector('#previewBtn').disabled = true;
  }
});

function getFormJSON() {
  return {
    title: document.getElementById('formTitle').innerText.trim(),
    description: document.getElementById('formDesc').value.trim(),
    fields: fields.map(f => ({
      type: f.type,
      label: f.label,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options || []
    }))
  };
}

function previewForm() {
  const data = getFormJSON();

  // Check if you're editing an existing form
  const urlParams = new URLSearchParams(window.location.search);
  const formId = urlParams.get('formId');

  if (formId) {
    // Open form.html with the existing formId
    window.open(`form.html?formId=${formId}`, '_blank');
  } else {
    // Otherwise, alert or save first
    alert("Please save the form first to preview.");
  }
}


function saveForm() {
  const data = getFormJSON();
  console.log("Saving form data:", data);

  // Get formId from URL
  const urlParams = new URLSearchParams(window.location.search);
  const formId = urlParams.get('formId');

  document.querySelector('#previewBtn').disabled = false;
  
  const url = formId
    ? `https://formhit.onrender.com/api/forms/${formId}`
    : 'https://formhit.onrender.com/api/forms';

  const method = formId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      const newFormId = result._id || (result.form && result.form._id);

      if (newFormId) {
        alert(`Form ${formId ? 'updated' : 'created'} successfully!`);
        console.log(result);

        // Change the URL after saving
        const newUrl = `form.html?formId=${newFormId}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      } else {
        alert(`Failed to ${formId ? 'update' : 'create'} form.`);
      }
    })
    .catch(err => {
      console.error(err);
      alert(`Error ${formId ? 'updating' : 'saving'} form.`);
    });
}



function publishForm() {
  const data = getFormJSON();
  // For demo purposes, we reuse the same save logic
  fetch('https://formhit.onrender.com/api/forms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      if (result.form) {
        alert("Form published successfully! (You can now display it on frontend)");
        console.log(result);
      } else {
        alert("Failed to publish form.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error publishing form.");
    });
}

