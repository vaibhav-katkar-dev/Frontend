(function () {
  // Step 1: Get current script and its formId param
  const script = document.currentScript;
  const params = new URLSearchParams(script.src.split("?")[1]);
  const formId = params.get("formId");

  if (!formId) {
    console.error("❌ formId not provided in widget.js script URL");
    return;
  }

  const baseURL = 'https://form2chat.me';
  const formURL = `${baseURL}/html/form.html?formId=${formId}`;

  // Step 2: Create floating widget button
  const widgetBtn = document.createElement("button");
  widgetBtn.innerText = "📝 Open Form";
  Object.assign(widgetBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  });
  widgetBtn.onclick = () => {
    widgetContainer.style.display = "flex";
  };

  // Step 3: Create modal container with iframe
  const widgetContainer = document.createElement("div");
  Object.assign(widgetContainer.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10000",
  });

  const iframe = document.createElement("iframe");
  iframe.src = formURL;
  Object.assign(iframe.style, {
    width: "90%",
    maxWidth: "600px",
    height: "90vh",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    background: "#fff",
  });

  // Step 3b: Create close button inside modal
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "✖";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: "10001",
    background: "#ff5c5c",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  });
  closeBtn.onclick = () => {
    widgetContainer.style.display = "none";
  };
  widgetContainer.appendChild(closeBtn);

  // Step 4: Close widget on outside click
  widgetContainer.onclick = (e) => {
    if (e.target === widgetContainer) {
      widgetContainer.style.display = "none";
    }
  };

  // Step 5: Append iframe and button to document
  widgetContainer.appendChild(iframe);
  document.body.appendChild(widgetBtn);
  document.body.appendChild(widgetContainer);

  // Step 6: Listen for form submission from iframe
  window.addEventListener("message", (event) => {
    // Only accept messages from the trusted origin
    if (event.origin !== baseURL) return;
    if (event.data?.type === "formSubmitted") {
      widgetContainer.style.display = "none";
      alert("Form submitted successfully!");
    }
  });
})();
