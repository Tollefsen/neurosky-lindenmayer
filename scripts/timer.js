const timer = function() {
    let timerId;
    let startDate;
    const updateFrequence = 100;

    const update = () => {
        const msElapsed = Date.now() - startDate;

        const ms = (msElapsed % 1000).toString().padStart(3, "0");
        const seconds = Math.floor(msElapsed / 1000).toString().padStart(2, "0");
        const timer = `${seconds}.${ms}`;

        document.getElementById("timer").innerText = timer;
    
        return msElapsed;
    };

    const start = () => {
        clearInterval(timerId)
        startDate = Date.now();
        update();
        timerId = setInterval(update, updateFrequence)
    }

    const stop = () => {
        clearInterval(timerId);
        return update();
    }

    const clear = () => {
        clearInterval(timerId)
        document.getElementById("timer").innerText = "00.000";
    }

    return { start, stop, clear };
}();