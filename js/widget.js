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

  // Loading overlay
  const loader = document.createElement("div");
  loader.innerHTML = `
    <div style="
      position: absolute;
      top:0; left:0; right:0; bottom:0;
      display:flex; align-items:center; justify-content:center;
      background: rgba(255,255,255,0.8);
      z-index:10002;
    ">
      <div style="
        border: 6px solid #f3f3f3;
        border-top: 6px solid #007bff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      "></div>
    </div>
  `;
  // Spin animation
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
  `;
  document.head.appendChild(style);

  // iframe (preload hidden)
  const iframe = document.createElement("iframe");
  iframe.src = formURL;
  Object.assign(iframe.style, {
    width: "100%",
    height: "90vh",
    border: "none",
    borderRadius: "10px",
    display: "none", // hidden until fully loaded
  });

  // Show iframe and hide loader when loaded
  iframe.onload = () => {
    loader.style.display = "none";
    iframe.style.display = "block";
  };

  iframeWrapper.appendChild(closeBtn);
  iframeWrapper.appendChild(loader);
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
    iframeWrapper.style.height = "auto";
    setTimeout(() => {
      try {
        iframeWrapper.style.height = iframe.contentWindow.document.body.scrollHeight + 40 + "px";
      } catch(e) {
        // ignore cross-origin issues
      }
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
