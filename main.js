document.addEventListener("DOMContentLoaded", () => {
    
    fetch("https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        document.getElementById("quote").innerText = data[0].q + " — " + data[0].a;
      })
      .catch(err => {
        document.getElementById("quote").innerText = "Could not load quote.";
      });
  
    
    if (annyang) {
      const commands = {
        'hello': () => alert("Hello there!"),
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          const cleanPage = page.toLowerCase();
          if (cleanPage.includes("stock")) location.href = "stocks.html";
          else if (cleanPage.includes("dog")) location.href = "dogs.html";
          else if (cleanPage.includes("home")) location.href = "home_page.html";
        }
      };
  
      annyang.addCommands(commands);
  
      document.getElementById("start-voice").onclick = () => annyang.start();
      document.getElementById("stop-voice").onclick = () => annyang.abort();
    }
  });
  