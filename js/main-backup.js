const { createApp, reactive } = Vue;


class Tracker {
    constructor(life = 20, poison = 0, charge = 0) {
        this.life = life;
        this.poison = poison;
        this.charge = charge;
    }

    incrementLife() { this.life++; }
    decrementLife() { this.life--; }
    incrementPoison() { this.poison++; }
    decrementPoison() { this.poison--; }
    incrementCharge() { this.charge++; }
    decrementCharge() { this.charge--; }
}

var mainContainer = null;
var trackerContainer = null;
var optionsContainer = null;
var trackers = [];

function setPlayerCount(_count=4)
{
    if (trackerContainer === null) return;

    trackerContainer.innerHTML = "";
    
    for(let i = 0; i < _count; i++)
    {
        const child = document.createElement("div");
        child.classList.add("tracker-child");

        const content = document.createElement("div");
        content.classList.add("tracker-content");

        // Life total
        const life = document.createElement("div");
        life.classList.add("life-total");
        life.textContent = 40; // starting life
        content.appendChild(life);

        // Counters container
        const counters = document.createElement("div");
        counters.classList.add("counters");

        // Poison counter
        const poison = document.createElement("div");
        poison.classList.add("counter", "poison");

        const poisonIcon = document.createElement("i");
        poisonIcon.classList.add("ms", "ms-p"); // Mana font poison symbol
        poison.appendChild(poisonIcon);

        const poisonValue = document.createElement("span");
        poisonValue.textContent = 0; // starting poison counter
        poison.appendChild(poisonValue);

        // Charge counter
        const charge = document.createElement("div");
        charge.classList.add("counter", "charge");

        const chargeIcon = document.createElement("i");
        chargeIcon.classList.add("ms", "ms-counter-charge"); // Mana font charge symbol
        charge.appendChild(chargeIcon);

        const chargeValue = document.createElement("span");
        chargeValue.textContent = 0; // starting charge counter
        charge.appendChild(chargeValue);

        // Append counters
        counters.appendChild(poison);
        counters.appendChild(charge);
        content.appendChild(counters);

        // Append content to child
        child.appendChild(content);
        trackerContainer.appendChild(child);
    }

    applyLifeTrackingFunctionality();
}

function applyLifeTrackingFunctionality()
{
    const trackerChildren = document.querySelectorAll("#tracker-container .tracker-child");

    trackerChildren.forEach((child, index) => {
        const content = child.querySelector(".tracker-content");
        const lifeTotal = content.querySelector(".life-total");

        child.addEventListener("pointerdown", (e) => {
            e.preventDefault();

            const rect = child.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const width = rect.width;
            const height = rect.height;

            let isIncrement = false;

            // Determine logical rotation based on position
            const isTopRow = index % 2 === 0 && index !== trackerChildren.length - 1; // odd-numbered DOM = visually top row
            const isRightOddChild = index === trackerChildren.length - 1 && trackerChildren.length % 2 !== 0;

            if (isTopRow) {
                // Top row elements are rotated 180°
                isIncrement = clickX < width / 2; // left side = increment when upside down
            } else if (isRightOddChild) {
                // Rightmost odd child rotated -90°
                isIncrement = clickY < height / 2; // bottom half = increment
            } else {
                // normal orientation
                isIncrement = clickX > width / 2; // right side = increment
            }

            // Update life total
            let current = parseInt(lifeTotal.textContent, 10);
            lifeTotal.textContent = isIncrement ? current + 1 : current - 1;
        });
    });

}

(()=>{
    console.log("hello world");
    mainContainer = document.querySelector("#main-container");
    trackerContainer = document.querySelector("#tracker-container");
    optionsContainer = document.querySelector("#options-container");

    setPlayerCount(5);
})();