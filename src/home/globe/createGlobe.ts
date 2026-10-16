import * as THREE from "three";
import { REGIONAL_MARKETS } from "./markets";

export type GlobeController = { focus: (index: number) => void; setVisible: (visible: boolean) => void; dispose: () => void };

export async function createGlobe(canvas: HTMLCanvasElement, labels: (HTMLSpanElement | null)[], signal: AbortSignal): Promise<GlobeController> {
  const response = await fetch("/globe/land-points.bin", { signal });
  if (!response.ok) throw new Error("Globe land data unavailable");
  const vertices = new Float32Array(await response.arrayBuffer());
  if (signal.aborted) throw new Error("Globe setup cancelled");
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => styles.getPropertyValue(name).trim();
  const ink = new THREE.Color(token("--color-ink"));
  const muted = new THREE.Color(token("--color-grey-300"));
  const regional = new THREE.Color(token("--color-grey-700"));
  const blue = new THREE.Color(token("--color-machine"));
  // Retain the static globe when reduced motion stops its render loop.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.34, 1.34, 1.34, -1.34, .1, 20);
  camera.position.z = 5;
  const earth = new THREE.Group();
  scene.add(earth);
  earth.rotation.set(THREE.MathUtils.degToRad(22), THREE.MathUtils.degToRad(-132), 0);
  const target = earth.quaternion.clone();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(resource: T): T => { disposables.push(resource); return resource; };
  const surface = new THREE.Mesh(track(new THREE.SphereGeometry(.998, 64, 32)), track(new THREE.MeshBasicMaterial({ color: token("--color-paper") })));
  earth.add(surface);
  const colors = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i += 3) {
    const lat = THREE.MathUtils.radToDeg(Math.asin(vertices[i + 1]));
    const lon = THREE.MathUtils.radToDeg(Math.atan2(vertices[i], vertices[i + 2]));
    const color = lon > 90 && lon < 180 && lat > -50 && lat < 60 ? regional : muted;
    colors.set([color.r, color.g, color.b], i);
    vertices[i] *= 1.003; vertices[i + 1] *= 1.003; vertices[i + 2] *= 1.003;
  }
  const dotCanvas = document.createElement("canvas");
  dotCanvas.width = dotCanvas.height = 16;
  const context = dotCanvas.getContext("2d")!;
  context.fillStyle = "white"; context.beginPath(); context.arc(8, 8, 7, 0, Math.PI * 2); context.fill();
  const dots = track(new THREE.CanvasTexture(dotCanvas));
  const land = track(new THREE.BufferGeometry());
  land.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  land.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  earth.add(new THREE.Points(land, track(new THREE.PointsMaterial({ map: dots, size: .007, vertexColors: true, alphaTest: .5 }))));

  const toPoint = (lat: number, lon: number, radius = 1.012) => {
    const phi = THREE.MathUtils.degToRad(lat), theta = THREE.MathUtils.degToRad(lon);
    return new THREE.Vector3(Math.cos(phi) * Math.sin(theta), Math.sin(phi), Math.cos(phi) * Math.cos(theta)).multiplyScalar(radius);
  };
  const points = REGIONAL_MARKETS.map((market) => toPoint(market.latitude, market.longitude));
  const pinMaterials = points.map(() => track(new THREE.MeshBasicMaterial({ color: ink })));
  const pinGeometry = track(new THREE.SphereGeometry(.013, 12, 8));
  const ringGeometry = track(new THREE.TorusGeometry(.028, .002, 6, 32));
  const ringMaterial = track(new THREE.MeshBasicMaterial({ color: blue }));
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  earth.add(ring);
  points.forEach((point, i) => { const pin = new THREE.Mesh(pinGeometry, pinMaterials[i]); pin.position.copy(point); earth.add(pin); });
  const setPin = (index: number) => {
    pinMaterials.forEach((material, i) => material.color.copy(i === index ? blue : ink));
    ring.position.copy(points[index]); ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), points[index].clone().normalize());
  };
  setPin(0);
  const routeMaterial = track(new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: .23 }));
  points.slice(1).forEach((point, marketIndex) => {
    // Separate the Manila arc from the almost collinear Singapore route.
    const bend = REGIONAL_MARKETS[marketIndex + 1].city === "Manila" ? points[0].clone().cross(point).normalize() : null;
    const angle = points[0].clone().normalize().angleTo(point.clone().normalize());
    const path = Array.from({ length: 65 }, (_, i) => {
      const t = i / 64;
      const start = points[0].clone().multiplyScalar(Math.sin((1 - t) * angle));
      const end = point.clone().multiplyScalar(Math.sin(t * angle));
      const direction = start.add(end).normalize();
      if (bend) direction.addScaledVector(bend, -Math.sin(Math.PI * t) * .055).normalize();
      return direction.multiplyScalar(1.014 + Math.sin(Math.PI * t) * .13);
    });
    earth.add(new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(path)), routeMaterial));
  });

  let visible = true, frame = 0, destroyed = false;
  const projected = new THREE.Vector3();
  const worldPoint = new THREE.Vector3();
  const animatedTarget = new THREE.Quaternion();
  const drift = new THREE.Quaternion();
  const verticalAxis = new THREE.Vector3(0, 1, 0);
  const requestDraw = () => { if (!frame && !destroyed && visible && !document.hidden) frame = requestAnimationFrame(draw); };
  function draw(time: number) {
    frame = 0;
    if (destroyed || !visible || document.hidden) return;
    animatedTarget.copy(target);
    if (!reduce.matches && !dragging) animatedTarget.premultiply(drift.setFromAxisAngle(verticalAxis, Math.sin(time / 11000) * .06));
    earth.quaternion.slerp(animatedTarget, reduce.matches ? 1 : .12);
    earth.updateMatrixWorld();
    renderer.render(scene, camera);
    const width = canvas.clientWidth, height = canvas.clientHeight;
    points.forEach((point, i) => {
      const label = labels[i]; if (!label) return;
      worldPoint.copy(point).applyMatrix4(earth.matrixWorld);
      projected.copy(worldPoint).project(camera);
      label.style.opacity = worldPoint.z > .15 ? "1" : "0";
      label.style.transform = `translate(${(projected.x + 1) * width / 2 + REGIONAL_MARKETS[i].labelX}px, ${(1 - projected.y) * height / 2 + REGIONAL_MARKETS[i].labelY}px)`;
    });
    const moving = earth.quaternion.angleTo(target) > .001;
    if (!reduce.matches) ring.scale.setScalar(1 + Math.sin(time / 800) * .08);
    if (moving || !reduce.matches) requestDraw();
  }
  const resize = new ResizeObserver(() => {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -1.34 * aspect; camera.right = 1.34 * aspect; camera.updateProjectionMatrix();
    requestDraw();
  });
  resize.observe(canvas);
  const visibility = () => requestDraw();
  document.addEventListener("visibilitychange", visibility);
  reduce.addEventListener("change", visibility);
  let dragging = false, startX = 0, startY = 0;
  const orientation = new THREE.Euler(0, 0, 0, "XYZ");
  const pointerDown = (event: PointerEvent) => { dragging = true; startX = event.clientX; startY = event.clientY; orientation.setFromQuaternion(target); canvas.setPointerCapture(event.pointerId); };
  const pointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    target.setFromEuler(new THREE.Euler(Math.max(-1.05, Math.min(1.05, orientation.x + (event.clientY - startY) * .006)), orientation.y + (event.clientX - startX) * .006, 0));
    requestDraw();
  };
  const pointerUp = () => { dragging = false; };
  canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("pointercancel", pointerUp);
  requestDraw();
  return {
    focus(index) {
      const market = REGIONAL_MARKETS[index];
      target.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(market.latitude), THREE.MathUtils.degToRad(-market.longitude), 0));
      setPin(index); requestDraw();
    },
    setVisible(value) { visible = value; if (visible) requestDraw(); },
    dispose() {
      destroyed = true; cancelAnimationFrame(frame); resize.disconnect();
      document.removeEventListener("visibilitychange", visibility); reduce.removeEventListener("change", visibility);
      canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("pointercancel", pointerUp);
      disposables.forEach((resource) => resource.dispose()); renderer.dispose();
    },
  };
}
