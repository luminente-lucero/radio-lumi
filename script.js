document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".audio-container").forEach(container => {
        const audio = document.createElement("audio");
        audio.src = container.dataset.src;
        audio.controls = true;
        container.appendChild(audio);

        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 100;
        container.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            dataArray.forEach(value => {
                const barHeight = value / 2;
                ctx.fillStyle = `rgb(${value}, 50, 100)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            });
        }

        draw();
    });
});
