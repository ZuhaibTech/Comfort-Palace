console.log("Testing fetch..."); fetch("/api/products").then(r => r.json()).then(d => console.log("Products:", d)).catch(e => console.error("Error:", e));
