let audioCtx;

// Habilitar o áudio após a primeira interação
document.addEventListener("pointerdown", () => {
    audioCtx = new AudioContext();
    audioCtx.resume();
}, { once: true });


function tocarSom() {

    if (!audioCtx || audioCtx.state !== "running") {
        return;
    }

    const tempo = audioCtx.currentTime;
    const duracao = 0.055;

    // Criar um ruído curto, parecido com um toque físico
    const buffer = audioCtx.createBuffer(
        1,
        Math.ceil(audioCtx.sampleRate * duracao),
        audioCtx.sampleRate
    );

    const dados = buffer.getChannelData(0);

    for (let i = 0; i < dados.length; i++) {
        dados[i] = Math.random() * 2 - 1;
    }

    const som = audioCtx.createBufferSource();
    som.buffer = buffer;

    // Suavizar o som
    const filtro = audioCtx.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = 300;

    // Controlar volume e duração
    const volume = audioCtx.createGain();

    volume.gain.setValueAtTime(0.50, tempo);
    volume.gain.exponentialRampToValueAtTime(
        0.0001,
        tempo + duracao
    );

    // Conectar os componentes
    som.connect(filtro);
    filtro.connect(volume);
    volume.connect(audioCtx.destination);

    som.start(tempo);
    som.stop(tempo + duracao);
}


// Detectar quando o mouse entra nos cards
document.querySelectorAll(
    ".tecnologias span, .card-projeto"
).forEach(card => {
    card.addEventListener("mouseenter", tocarSom);
}); 