document.addEventListener("DOMContentLoaded", () => {
    const breedButtons = document.getElementById("breed-buttons");
    const dogTitle = document.getElementById("dog-title");
    const dogImage = document.getElementById("dog-image");
    const dogFact = document.getElementById("dog-fact");
  
    const dogBreeds = ["labrador", "husky", "beagle", "shiba", "pug"];
  
    function getDogImage(breed) {
      return fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(res => res.json())
        .then(data => data.message);
    }
  
    function getDogFact() {
      return fetch("https://dog-api.kinduff.com/api/facts")
        .then(res => res.json())
        .then(data => data.facts[0]);
    }
  
    async function displayDogInfo(breed) {
      const [image, fact] = await Promise.all([
        getDogImage(breed),
        getDogFact()
      ]);
      dogTitle.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
      dogImage.src = image;
      dogFact.textContent = fact;
    }
  
    dogBreeds.forEach(breed => {
      const btn = document.createElement("button");
      btn.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
      btn.addEventListener("click", () => displayDogInfo(breed));
      breedButtons.appendChild(btn);
    });
  
    
    if (annyang) {
      const commands = {
        'show me a *breed': (breed) => {
          if (dogBreeds.includes(breed.toLowerCase())) {
            displayDogInfo(breed.toLowerCase());
          }
        },
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          const p = page.toLowerCase();
          if (p.includes("dog")) location.href = "dogs.html";
          else if (p.includes("home")) location.href = "home_page.html";
          else if (p.includes("stock")) location.href = "stocks.html";
        }
      };
      annyang.addCommands(commands);
      document.getElementById("start-voice").onclick = () => annyang.start();
      document.getElementById("stop-voice").onclick = () => annyang.abort();
    }
  });
  