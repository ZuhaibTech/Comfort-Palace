fetch("/api/products").then(r => { console.log("Response status:", r.status); return r.json(); }).then(d => console.log("Data:", d)).catch(e => console.error("Fetch error:", e));
