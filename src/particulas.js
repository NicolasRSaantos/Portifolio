import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.js";

//Selecionar o elemento HTML
const container = document.getElementById("particulas");

//Criar cena e câmera
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.z = 500;

//renderizador
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

//partículas
const quantidade = 2500;

const cores = [
    "#dfdfdf", // Azul
    "#d8d8d8", // Amarelo
    "#b9b9b9", // Vermelho
    "#FFFFFF"  // Branco
];

const posicoes = new Float32Array(quantidade * 3);
const posicoesOriginais = new Float32Array(quantidade * 3);
const coresParticulas = new Float32Array(quantidade * 3);

//Distribuir as partículas aleatoriamente
for (let i = 0; i < quantidade; i++) {

    const x = (Math.random() - 0.5) * 1500;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 800;

    const indice = i * 3;

    posicoes[indice] = x;
    posicoes[indice + 1] = y;
    posicoes[indice + 2] = z;

    posicoesOriginais[indice] = x;
    posicoesOriginais[indice + 1] = y;
    posicoesOriginais[indice + 2] = z;

    const cor = new THREE.Color(
        cores[Math.floor(Math.random() * cores.length)]
    );

    coresParticulas[indice] = cor.r;
    coresParticulas[indice + 1] = cor.g;
    coresParticulas[indice + 2] = cor.b;
}

//Criar a geometria
const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posicoes, 3)
);

geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(coresParticulas, 3)
);

// 7. Criar textura circular
const canvas = document.createElement("canvas");
canvas.width = 32;
canvas.height = 32;

const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(16, 16, 14, 0, Math.PI * 2);
ctx.fill();

const textura = new THREE.CanvasTexture(canvas);

//Definir a aparência
const material = new THREE.PointsMaterial({
    size: 4,
    map: textura,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    alphaTest: 0.5
});

//Criar as partículas
const particles = new THREE.Points(geometry, material);

scene.add(particles);

//Ajustar o tamanho do canvas
function ajustarTela() {
    const largura = container.clientWidth;
    const altura = container.clientHeight;

    if (!largura || !altura) return;

    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();

    renderer.setSize(largura, altura);
}

window.addEventListener("resize", ajustarTela);
ajustarTela();

//Animar as partículas
function animar(tempo) {

    const t = tempo * 0.001;

    const atributo = geometry.attributes.position;
    const array = atributo.array;

    for (let i = 0; i < quantidade; i++) {

        const indice = i * 3;

        const xOriginal = posicoesOriginais[indice];
        const yOriginal = posicoesOriginais[indice + 1];

        // Flutuação horizontal
        array[indice] =
            xOriginal + Math.sin(t * 0.5 + i) * 5;

        // Flutuação vertical
        array[indice + 1] =
            yOriginal + Math.cos(t * 0.4 + i) * 5;
    }

    atributo.needsUpdate = true;

    renderer.render(scene, camera);

    requestAnimationFrame(animar);
}

requestAnimationFrame(animar);
