import { runDemoScene } from "@syntheticmagus/physics-post-loader";

let assetsHostUrl;
if (DEV_BUILD) {
    assetsHostUrl = "http://127.0.0.1:8181/";
} else {
    assetsHostUrl = "https://syntheticmagus.github.io/post-loader-physics-assets/";
}

const ammoScript = document.createElement("script");
ammoScript.src = `${assetsHostUrl}ammo/ammo.wasm.js`;
document.body.appendChild(ammoScript);

document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.padding = "0";

const title = document.createElement("p");
title.innerText = "Physics Post-Loader Demo Scene";
title.style.fontSize = "32pt";
title.style.textAlign = "center";
document.body.appendChild(title);

const div = document.createElement("div");
div.style.width = "60%";
div.style.margin = "0 auto";
div.style.aspectRatio = "16 / 9";
document.body.appendChild(div);

const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.display = "block";
div.appendChild(canvas);

setTimeout(() => {
    Ammo().then(() => {
        runDemoScene(canvas, assetsHostUrl);
    });
}, 1000);