const { createApp, reactive } = Vue;

class Tracker {
    constructor(id, life = 40, poison = 0, charge = 0, playerCount = 4) {
        this.id = id;
        this.life = life;
        this.poison = poison;
        this.charge = charge;

        // single or dual commander?
        this.dualCommander = false;

        // Damage TO THIS PLAYER from each opponent
        this.commanderA = {};
        this.commanderB = {};

        for (let i = 1; i <= playerCount; i++) {
            if (i !== id) {
                this.commanderA[i] = 0;
                this.commanderB[i] = 0;
            }
        }
    }

    incrementLife() { this.life++; }
    decrementLife() { this.life--; }

    setDual(state) {
        this.dualCommander = state;
    }

    incrementCmdA(from) { this.commanderA[from]++; }
    decrementCmdA(from) { this.commanderA[from] = Math.max(0, this.commanderA[from] - 1); }

    incrementCmdB(from) { this.commanderB[from]++; }
    decrementCmdB(from) { this.commanderB[from] = Math.max(0, this.commanderB[from] - 1); }

    totalCommanderDamage() {
        let totalsA = Object.values(this.commanderA).reduce((a,b)=>a+b, 0);
        let totalsB = this.dualCommander
            ? Object.values(this.commanderB).reduce((a,b)=>a+b, 0)
            : 0;
        return totalsA + totalsB;
    }

    effectiveLife() {
        return this.life - this.totalCommanderDamage();
    }
}

const app = createApp({
    data() {
        return {
            trackers: [],
            startingLife: 40,
            playersKey: 0,

            swipeStartY: 0,
            swipeDeltaY: 0,
            openCmdMenu: null,

            // Options menu UI
            showOptions: false,
            options: {
                tempPlayerCount: 4,
                tempStartingLife: 40,
            }
        };
    },

    mounted() {
        // Initialize game
        this.resetGame(4, 40);

        // Set up the floating circle click
        const optionsClick = document.getElementById("options-click");
        optionsClick.addEventListener("pointerdown", () => {
            this.openOptionsMenu();
        });
    },

    methods: {
        resetGame(playerCount, startingLife) {
            this.trackers = [];
            for (let i = 0; i < playerCount; i++) {
                this.trackers.push(reactive(new Tracker(startingLife)));
            }
            this.startingLife = startingLife;

            this.playersKey++;
        },

        // OPTIONS MENU HANDLERS
        openOptionsMenu() {
            // Preload current settings into temp model
            this.options.tempPlayerCount = this.trackers.length;
            this.options.tempStartingLife = this.startingLife;
            this.showOptions = true;
        },

        cancelOptions() {
            this.showOptions = false;
        },

        confirmOptions() {
            this.showOptions = false;

            // Apply settings
            const newCount = this.options.tempPlayerCount;
            const newLife = this.options.tempStartingLife;

            this.resetGame(newCount, newLife);
        },

        // CLICK HANDLING FOR LIFE TOTALS
        onTrackerClick(index, event) {
            const isTopRow = index % 2 === 0 && index !== this.trackers.length - 1;
            const isRightOddChild =
                index === this.trackers.length - 1 &&
                this.trackers.length % 2 !== 0;

            const rect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            let isIncrement = false;

            if (isTopRow) {
                isIncrement = clickX < rect.width / 2;
            } else if (isRightOddChild) {
                isIncrement = clickY < rect.height / 2;
            } else {
                isIncrement = clickX > rect.width / 2;
            }

            if (isIncrement) this.trackers[index].incrementLife();
            else this.trackers[index].decrementLife();
        },

        startSwipe(e, id) {
            this.swipeStartY = e.touches[0].clientY;
            this.swipeDeltaY = 0;
            console.log("start swipe");
        },

        moveSwipe(e, id) {
            this.swipeDeltaY = e.touches[0].clientY - this.swipeStartY;
        },

        endSwipe(e, id) {
            if (this.swipeDeltaY > 20) {
            // Swipe down opens commander menu
            this.openCmdMenu = id;
            } else if (this.swipeDeltaY < -40) {
            // Swipe up closes commander menu
            if (this.openCmdMenu === id) this.openCmdMenu = null;
            }
        }
    }
});

app.mount("#app");
