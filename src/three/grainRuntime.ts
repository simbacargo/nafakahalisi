import { BufferAttribute, BufferGeometry, PerspectiveCamera, Points, PointsMaterial, Scene, Vector2, WebGLRenderer } from "three";

export function mountGrainScene(host: HTMLElement) {
  const scene = new Scene();
  const camera = new PerspectiveCamera(46, 1, .1, 30);
  camera.position.z = 6;
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "three-grain-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.prepend(renderer.domElement);

  const count = host.classList.contains("hero") ? 105 : 72;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (Math.random() - .5) * 11;
    positions[offset + 1] = (Math.random() - .5) * 6;
    positions[offset + 2] = (Math.random() - .5) * 4;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  const material = new PointsMaterial({
    color: host.classList.contains("hero") ? 0xc28b24 : 0xf5bd38,
    size: host.classList.contains("hero") ? .045 : .04,
    transparent: true,
    opacity: host.classList.contains("hero") ? .24 : .2,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const grains = new Points(geometry, material);
  grains.rotation.z = -.08;
  scene.add(grains);

  const pointer = new Vector2();
  let animationFrame = 0;
  let active = true;
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
    camera.aspect = Math.max(width, 1) / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };
  const handlePointer = (event: PointerEvent) => {
    const bounds = host.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width - .5) * .32;
    pointer.y = ((event.clientY - bounds.top) / bounds.height - .5) * .2;
  };
  const clearPointer = () => pointer.set(0, 0);
  const animate = () => {
    if (active) {
      grains.rotation.y += .00045;
      grains.rotation.z += .00008;
      camera.position.x += (pointer.x - camera.position.x) * .025;
      camera.position.y += (-pointer.y - camera.position.y) * .025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animationFrame = window.requestAnimationFrame(animate);
  };
  const visibilityObserver = new IntersectionObserver(([entry]) => { active = entry.isIntersecting && !document.hidden; }, { threshold: 0 });
  const handleVisibility = () => { active = !document.hidden && host.getBoundingClientRect().bottom > 0; };
  const resizeObserver = new ResizeObserver(resize);

  resize();
  resizeObserver.observe(host);
  visibilityObserver.observe(host);
  host.addEventListener("pointermove", handlePointer, { passive: true });
  host.addEventListener("pointerleave", clearPointer);
  document.addEventListener("visibilitychange", handleVisibility);
  animate();

  return () => {
    window.cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    host.removeEventListener("pointermove", handlePointer);
    host.removeEventListener("pointerleave", clearPointer);
    document.removeEventListener("visibilitychange", handleVisibility);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
