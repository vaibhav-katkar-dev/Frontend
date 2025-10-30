

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
    ? `https://api.form2chat.me/api/forms/by-id/${formId}`
    : 'https://api.form2chat.me/api/forms';

  const method = formId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
    body: JSON.stringify({data,token: localStorage.getItem("token"),userId:localStorage.getItem("userId")})
  })
    .then(res => res.json())
    .then(result => {


       // 🚫 Stop if plan limit triggered
  if (result.upgradeRequired) {
    alert(result.message);
    window.location.href = "/html/billing.html"; // optional redirect
    return; // ❗ stop execution
  }

  // ❗ Stop if any other error
  if (!result.success && result.message) {
    alert(result.message);
    return;
  }

  // ✅ Success
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
 console.log('publichs');
   
}

