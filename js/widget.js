(function () {
  const script = document.currentScript;
  const params = new URLSearchParams(script.src.split("?")[1]);
  const formId = params.get("formId");

  if (!formId) {
    console.error("❌ formId not provided in widget.js script URL");
    return;
  }

  const baseURL = 'https://form2chat.me';
  const formURL = `${baseURL}/html/form.html?formId=${formId}`;

  // Floating button
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

  // Modal container
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

  // Inner wrapper to only cover form size
  const iframeWrapper = document.createElement("div");
  Object.assign(iframeWrapper.style, {
    position: "relative",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    maxWidth: "90%",
    width: "600px",
    padding: "0",
  });

  // Close button
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

  // iframe
  const iframe = document.createElement("iframe");
  iframe.src = formURL;
  Object.assign(iframe.style, {
    width: "100%",
    height: "90vh",
    border: "none",
    borderRadius: "10px",
  });
//   iframe.style.width = "100%";
// iframe.style.height = "90vh"; // allow scrolling for smaller/large forms
// iframe.style.border = "none";
// iframe.style.borderRadius = "10px";


  iframeWrapper.appendChild(closeBtn);
  iframeWrapper.appendChild(iframe);
  widgetContainer.appendChild(iframeWrapper);
  

  // Click outside closes modal
  widgetContainer.onclick = (e) => {
    if (e.target === widgetContainer) {
      widgetContainer.style.display = "none";
    }
  };

  // Append elements
  document.body.appendChild(widgetBtn);
  document.body.appendChild(widgetContainer);

  // Open modal on button click
  widgetBtn.onclick = () => {
    widgetContainer.style.display = "flex";
    // Adjust wrapper height dynamically
    iframeWrapper.style.height = "auto";
    setTimeout(() => {
      // Fit wrapper to iframe content
      iframeWrapper.style.height = iframe.contentWindow.document.body.scrollHeight + 40 + "px";
    }, 300);
  };

  // Listen for form submission message from iframe
  window.addEventListener("message", (event) => {
    if (event.origin !== baseURL) return; // security
    if (event.data?.type === "formSubmitted") {
      widgetContainer.style.display = "none"; // auto-close
      alert("Form submitted successfully!");
    }
  });
})();
