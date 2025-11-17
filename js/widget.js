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

  // Ultra-premium floating circular widget button
const widgetBtn = document.createElement("button");

widgetBtn.innerHTML = `
  <img src="https://lh3.googleusercontent.com/a/ACg8ocIU1JBzzHmQKxFc10ByX2jqUxv1mWc6U42O_2AcQICPutASiOrhh7h4PmXHTPBhGShe9i8XsVTsWjz0d9zZbPFzZDR4Yzk=s288-c-no"
       alt="Form2Chat"
       style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
`;

Object.assign(widgetBtn.style, {
  position: "fixed",
  bottom: "26px",
  right: "26px",
  zIndex: "99999",
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  border: "0px solid transparent",
  background: "rgba(255, 255, 255, 0.7)",   // semi-transparent universal
  backdropFilter: "blur(8px)",              // glass effect
  padding: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.18)", // soft universal shadow
  cursor: "pointer",
  transition: "0.25s ease",
});

// Hover effects (premium micro-interaction)
widgetBtn.onmouseenter = () => {
  widgetBtn.style.transform = "scale(1.10)";
  widgetBtn.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.28)";
  widgetBtn.style.background = "rgba(255, 255, 255, 0.85)";
};

widgetBtn.onmouseleave = () => {
  widgetBtn.style.transform = "scale(1)";
  widgetBtn.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.18)";
  widgetBtn.style.background = "rgba(255, 255, 255, 0.7)";
};

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

  // Inner wrapper
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

  // iframe (preload hidden in background)
  const iframe = document.createElement("iframe");
  iframe.src = formURL;
  Object.assign(iframe.style, {
    width: "100%",
    height: "90vh",
    border: "none",
    borderRadius: "10px",
    display: "none", // hidden initially
  });

  // Append elements
  iframeWrapper.appendChild(closeBtn);
  iframeWrapper.appendChild(iframe);
  widgetContainer.appendChild(iframeWrapper);
  document.body.appendChild(widgetBtn);
  document.body.appendChild(widgetContainer);

  // Click outside closes modal
  widgetContainer.onclick = (e) => {
    if (e.target === widgetContainer) {
      widgetContainer.style.display = "none";
    }
  };

  // Show/hide iframe when button is clicked
  widgetBtn.onclick = () => {
    widgetContainer.style.display = "flex";
    iframe.style.display = "block"; // reveal iframe
    iframeWrapper.style.height = "auto";
    setTimeout(() => {
      try {
        iframeWrapper.style.height = iframe.contentWindow.document.body.scrollHeight + 40 + "px";
      } catch (e) {
        // ignore cross-origin issues
      }
    }, 300);
  };

  // Listen for form submission message from iframe
  window.addEventListener("message", (event) => {
    if (event.origin !== baseURL) return;
    if (event.data?.type === "formSubmitted") {
      widgetContainer.style.display = "none";
      alert("Form submitted successfully!");
    }
  });
})();
