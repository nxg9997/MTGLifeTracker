const { createApp, reactive } = Vue;

createApp({
    setup() {
        const playerCount = 5;

        // Reactive array of tracker objects
        const trackers = reactive(
            Array.from({ length: playerCount }, () => ({
                life: 40,
                poison: 0,
                charge: 0
            }))
        );

        // Determine rotation class based on index
        const rotationClass = (index) => {
            const isTopRow = index % 2 === 0 && index !== trackers.length - 1;
            const isRightOddChild = index === trackers.length - 1 && trackers.length % 2 !== 0;
            if (isTopRow) return 'rotated';
            if (isRightOddChild) return 'rotated-sideways';
            return '';
        };

        // Handle click/tap for increment/decrement
        const onPointerDown = (event, index) => {
            const tracker = trackers[index];
            const child = event.currentTarget;
            const rect = child.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            const width = rect.width;
            const height = rect.height;

            let isIncrement = false;

            // Map logical orientation
            const isTopRow = index % 2 === 0 && index !== trackers.length - 1;
            const isRightOddChild = index === trackers.length - 1 && trackers.length % 2 !== 0;

            if (isTopRow) isIncrement = clickX < width / 2;
            else if (isRightOddChild) isIncrement = clickY < height / 2;
            else isIncrement = clickX > width / 2;

            // Update reactive value (DOM updates automatically)
            if (isIncrement) tracker.life++;
            else tracker.life--;
        };

        return { trackers, rotationClass, onPointerDown };
    }
}).mount('#app');