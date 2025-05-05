document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "DAu4pT4LCjDjpRbeI540b1ZBYRrZiA2r"; 
    let currentChart; 
  
    async function fetchStockData(ticker, days) {
      const today = new Date();
      const endDate = today.toISOString().split("T")[0];
  
      const startDate = new Date();
      startDate.setDate(today.getDate() - parseInt(days));
      const start = startDate.toISOString().split("T")[0];
  
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${start}/${endDate}?adjusted=true&sort=asc&limit=100&apiKey=${API_KEY}`;
  
      const res = await fetch(url);
      if (!res.ok) throw new Error("Polygon API error");
      const data = await res.json();
      return data.results || [];
    }
  
    function renderChart(data, ticker) {
      const ctx = document.getElementById("stockChart").getContext("2d");
      const labels = data.map(d => new Date(d.t).toLocaleDateString());
      const prices = data.map(d => d.c);
  
      if (currentChart) currentChart.destroy();
  
      currentChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: `${ticker.toUpperCase()} Closing Prices`,
            data: prices,
            borderColor: "blue",
            fill: false
          }]
        }
      });
    }
  
    document.getElementById("loadChart").addEventListener("click", async () => {
      const ticker = document.getElementById("ticker").value;
      const days = document.getElementById("range").value;
      if (!ticker) return;
  
      try {
        const data = await fetchStockData(ticker, days);
        console.log("Fetched Stock Data:", data);
        renderChart(data, ticker);
      } catch (err) {
        console.error("Error loading stock data:", err);
      }
    });
  
    
    fetch("https://tradestie.com/api/v1/apps/reddit")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load Reddit stocks");
        return res.json();
      })
      .then(data => {
        const top5 = data.slice(0, 5);
        const tbody = document.querySelector("#redditStocks tbody");
        tbody.innerHTML = "";
  
        top5.forEach(stock => {
          const row = document.createElement("tr");
          const sentimentIcon = stock.sentiment === "Bullish"
            ? "📈"
            : stock.sentiment === "Bearish"
            ? "📉"
            : "";
  
          row.innerHTML = `
            <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
            <td>${stock.no_of_mentions}</td>
            <td>${stock.sentiment} ${sentimentIcon}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => {
        console.error("Reddit fetch error:", err);
        const tbody = document.querySelector("#redditStocks tbody");
        tbody.innerHTML = "<tr><td colspan='3'>Could not load Reddit stock data.</td></tr>";
      });
  
    
    if (window.annyang) {
      const commands = {
        'lookup *stock': (stock) => {
          document.getElementById("ticker").value = stock.toUpperCase();
          document.getElementById("range").value = "30";
          document.getElementById("loadChart").click();
        },
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          const p = page.toLowerCase();
          if (p.includes("dog")) location.href = "dogs.html";
          else if (p.includes("home")) location.href = "index.html";
          else if (p.includes("stock")) location.href = "stocks.html";
        },
        'hello': () => {
          alert("Hello world!");
        }
      };
      annyang.addCommands(commands);
      document.getElementById("start-voice").onclick = () => annyang.start();
      document.getElementById("stop-voice").onclick = () => annyang.abort();
    }
  });
  