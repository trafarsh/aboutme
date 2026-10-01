// Load Three.js defensively so the page still works if the CDN or WebGL is unavailable
let THREE = null;
try {
  THREE = await import("three");
} catch (err) {
  console.warn("Three.js failed to load; showing static background.", err);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

/* ======================================================================
   Loader
   ====================================================================== */
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
document.body.classList.add("loading");
let loadProgress = 0;
const loadTick = setInterval(() => {
  loadProgress = Math.min(loadProgress + Math.random() * 22, 90);
  loaderBar.style.width = loadProgress + "%";
}, 120);

function finishLoading() {
  clearInterval(loadTick);
  loaderBar.style.width = "100%";
  setTimeout(() => {
    loader.classList.add("done");
    document.body.classList.remove("loading");
    revealHero();
  }, 250);
}

/* ======================================================================
   Three.js scene
   ====================================================================== */
const canvas = document.getElementById("scene");
let renderer;
try {
  if (THREE) renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
} catch (err) {
  console.warn("WebGL unavailable, falling back to static background.", err);
}

const state = {
  mouse: { x: 0, y: 0 },
  mouseTarget: { x: 0, y: 0 },
  scroll: 0, // 0..1 across the whole page
  scrollTarget: 0,
};

if (renderer) initScene();
else {
  canvas.style.background = "radial-gradient(circle at 70% 40%, #2a0f0a, #07080c 60%)";
}

function initScene() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x07080c, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080c, 0.045);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  /* ---------- Core: noise-displaced shader blob ---------- */
  const noiseGLSL = /* glsl */ `
    vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
      vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
      float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
      vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
      return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }
  `;

  const coreUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.32 },
    uFreq: { value: 0.9 },
    uColorA: { value: new THREE.Color(0xff4d2e) },
    uColorB: { value: new THREE.Color(0x3ecf8e) },
    uMouse: { value: new THREE.Vector2() },
  };

  const coreVertex = /* glsl */ `
    uniform float uTime; uniform float uAmp; uniform float uFreq; uniform vec2 uMouse;
    varying float vNoise; varying vec3 vNormal; varying vec3 vView;
    ${noiseGLSL}
    void main(){
      float n = snoise(position * uFreq + vec3(uTime * 0.25, uTime * 0.18, uMouse.x * 0.6));
      n += 0.5 * snoise(position * uFreq * 2.3 - uTime * 0.3);
      vNoise = n;
      vec3 displaced = position + normal * n * uAmp;
      vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `;
  const coreFragment = /* glsl */ `
    uniform vec3 uColorA; uniform vec3 uColorB;
    varying float vNoise; varying vec3 vNormal; varying vec3 vView;
    void main(){
      float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
      vec3 base = mix(vec3(0.03, 0.035, 0.05), uColorA * 0.55, smoothstep(-0.6, 0.9, vNoise));
      vec3 col = base + mix(uColorA, uColorB, smoothstep(0.35, 1.0, vNoise) * 0.6) * fres * 1.3;
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  const detail = isTouch ? 48 : 96;
  const coreGeo = new THREE.IcosahedronGeometry(1.6, detail);
  const core = new THREE.Mesh(
    coreGeo,
    new THREE.ShaderMaterial({ uniforms: coreUniforms, vertexShader: coreVertex, fragmentShader: coreFragment })
  );
  coreGroup.add(core);

  // Wireframe shell sharing the same displacement for a "CAD" overlay
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.62, 6),
    new THREE.ShaderMaterial({
      uniforms: coreUniforms,
      vertexShader: coreVertex,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA; varying vec3 vNormal; varying vec3 vView;
        void main(){
          float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 1.5);
          gl_FragColor = vec4(uColorA, 0.12 + fres * 0.35);
        }`,
      wireframe: true,
      transparent: true,
      depthWrite: false,
    })
  );
  coreGroup.add(shell);

  /* ---------- Orbit rings ---------- */
  const rings = new THREE.Group();
  coreGroup.add(rings);
  const ringMat = new THREE.LineBasicMaterial({ color: 0xe9ecf2, transparent: true, opacity: 0.18 });
  [2.5, 2.9, 3.4].forEach((r, i) => {
    const pts = [];
    for (let a = 0; a <= 128; a++) {
      const t = (a / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, 0));
    }
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat.clone());
    ring.material.opacity = 0.22 - i * 0.05;
    ring.rotation.x = Math.PI / 2 + (i - 1) * 0.35;
    ring.rotation.y = i * 0.4;
    rings.add(ring);
  });

  // Small satellites riding the rings
  const satGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const satellites = rings.children.map((ring, i) => {
    const sat = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: i === 1 ? 0x3ecf8e : 0xff4d2e }));
    ring.add(sat);
    return { mesh: sat, r: [2.5, 2.9, 3.4][i], speed: 0.4 + i * 0.15, offset: i * 2 };
  });

  /* ---------- Particle field ---------- */
  const count = isTouch ? 1400 : 3200;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 6 + Math.random() * 26;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = r * Math.cos(phi) - 6;
    scales[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  const pUniforms = { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } };
  const particles = new THREE.Points(
    pGeo,
    new THREE.ShaderMaterial({
      uniforms: pUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uPixelRatio; attribute float aScale; varying float vA;
        void main(){
          vec3 p = position;
          p.y += sin(uTime * 0.2 + position.x * 0.3) * 0.25;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (2.0 + aScale * 4.0) * uPixelRatio * (8.0 / -mv.z);
          vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aScale) + aScale * 40.0));
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vA;
          gl_FragColor = vec4(vec3(0.92, 0.94, 1.0), a * 0.8);
        }`,
    })
  );
  scene.add(particles);

  /* ---------- Perspective grid floor ---------- */
  const grid = new THREE.GridHelper(80, 80, 0xff4d2e, 0x1b1e2a);
  grid.position.y = -4;
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  scene.add(grid);

  /* ---------- Resize ---------- */
  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    pUniforms.uPixelRatio.value = renderer.getPixelRatio();
  }
  window.addEventListener("resize", layout);
  layout();

  /* ---------- Loop ---------- */
  const clock = new THREE.Clock();
  const tmpColorA = new THREE.Color();
  const palette = [new THREE.Color(0xff4d2e), new THREE.Color(0xff8a2e), new THREE.Color(0x2e9bff), new THREE.Color(0xb44dff), new THREE.Color(0xff4d2e)];

  function render() {
    const t = reduceMotion ? 0 : clock.getElapsedTime();

    state.mouse.x += (state.mouseTarget.x - state.mouse.x) * 0.05;
    state.mouse.y += (state.mouseTarget.y - state.mouse.y) * 0.05;
    state.scroll += (state.scrollTarget - state.scroll) * 0.08;
    const s = state.scroll;
    const wide = window.innerWidth > 900;

    coreUniforms.uTime.value = t;
    coreUniforms.uMouse.value.set(state.mouse.x, state.mouse.y);
    coreUniforms.uAmp.value = 0.28 + Math.sin(s * Math.PI) * 0.35;
    coreUniforms.uFreq.value = 0.9 + s * 0.8;
    pUniforms.uTime.value = t;

    // Colour drifts through a palette as you scroll
    const seg = s * (palette.length - 1);
    const i0 = Math.min(Math.floor(seg), palette.length - 2);
    tmpColorA.copy(palette[i0]).lerp(palette[i0 + 1], seg - i0);
    coreUniforms.uColorA.value.copy(tmpColorA);
    satellites[0].mesh.material.color.copy(tmpColorA);

    // Core path: right of hero → centre & back → left → centre for contact
    const xPath = wide ? Math.cos(s * Math.PI * 2.2) * 2.4 : 0;
    const yPath = wide ? 0 : -3.1 + Math.sin(s * Math.PI) * 2.4;
    coreGroup.position.x += (xPath - coreGroup.position.x) * 0.06;
    coreGroup.position.y += (yPath + Math.sin(t * 0.6) * 0.12 - coreGroup.position.y) * 0.06;
    const scale = (wide ? 1 : 0.5) * (1 - Math.sin(s * Math.PI) * 0.25);
    coreGroup.scale.setScalar(scale);

    core.rotation.y = t * 0.12 + s * Math.PI * 2;
    core.rotation.x = s * Math.PI * 0.6;
    shell.rotation.copy(core.rotation);
    rings.rotation.z = t * 0.08;
    rings.rotation.x = state.mouse.y * 0.3 + s * 1.2;

    satellites.forEach((sat) => {
      const a = t * sat.speed + sat.offset;
      sat.mesh.position.set(Math.cos(a) * sat.r, Math.sin(a) * sat.r, 0);
    });

    particles.rotation.y = t * 0.015 + s * 0.8;
    grid.position.z = (t * 0.6) % 1;
    grid.material.opacity = 0.35 * (1 - Math.min(s * 3, 1)) + 0.08;

    // Camera parallax + scroll dolly
    camera.position.x += (state.mouse.x * 0.6 - camera.position.x) * 0.05;
    camera.position.y += (state.mouse.y * 0.4 + s * -1.5 - camera.position.y) * 0.05;
    camera.position.z = 8 + Math.sin(s * Math.PI) * 1.2;
    camera.lookAt(0, s * -1.2, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // Render one frame before revealing so there's no flash
  renderer.compile(scene, camera);
  requestAnimationFrame(render);
}

/* ======================================================================
   Input
   ====================================================================== */
window.addEventListener("pointermove", (e) => {
  state.mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
  state.mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  state.scrollTarget = max > 0 ? window.scrollY / max : 0;
  document.getElementById("nav").classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ======================================================================
   UI behaviours
   ====================================================================== */
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

// Stagger siblings inside each group
document.querySelectorAll(".stack-grid, .work-list, .timeline").forEach((group) => {
  [...group.children].forEach((el, i) => el.style.setProperty("--d", `${i * 0.08}s`));
});

function revealHero() {
  document.querySelectorAll("#hero .reveal").forEach((el, i) => {
    el.style.setProperty("--d", `${i * 0.1}s`);
    el.classList.add("in");
  });
  document.querySelectorAll(".reveal:not(#hero .reveal)").forEach((el) => revealObserver.observe(el));
  startTyping();
}

// Number count-up
function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = target > 1000 ? target - 30 : 0;
  const dur = 1400;
  const t0 = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (target - start) * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

// Typing effect
const phrases = [
  "building Kurukshetra Racing's digital stack",
  "full-stack: React / Next.js / Node / MongoDB",
  "parametric chassis in CadQuery → STEP",
  "ESP32 sensors → digital twins",
  "shipping real products, not tutorials",
];
function startTyping() {
  const el = document.getElementById("typed");
  if (reduceMotion) { el.textContent = phrases[0]; return; }
  let p = 0, c = 0, deleting = false;
  (function tick() {
    const word = phrases[p];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    let delay = deleting ? 28 : 55;
    if (!deleting && c === word.length) { deleting = true; delay = 1800; }
    else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 400; }
    setTimeout(tick, delay);
  })();
}

// 3D tilt + spotlight on cards
if (!isTouch && !reduceMotion) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// Custom cursor
const cursor = document.getElementById("cursor");
if (!isTouch) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; cursor.classList.add("on"); });
  document.addEventListener("pointerleave", () => cursor.classList.remove("on"));
  document.querySelectorAll("a, button, .tilt").forEach((el) => {
    el.addEventListener("pointerenter", () => cursor.classList.add("hover"));
    el.addEventListener("pointerleave", () => cursor.classList.remove("hover"));
  });
  (function follow() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(follow);
  })();
}

// Active nav link
const sections = [...document.querySelectorAll("main section[id]")];
const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = linkFor(entry.target.id);
      if (link && entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => activeObserver.observe(s));

finishLoading();
