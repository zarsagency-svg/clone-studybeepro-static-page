import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { BOOK_OBJ_DATA } from '../assets/book/bookObj';
import baseColorUrl from '../assets/book/baseColor.jpg';
import emissiveUrl from '../assets/book/emissive.jpg';
import metallicUrl from '../assets/book/metallic.jpg';
import normalUrl from '../assets/book/normal.jpg';
import roughnessUrl from '../assets/book/roughness.jpg';

interface PaladinsBook3DProps {
  onSparkPulse?: () => void;
  sparkTriggerCount?: number;
}

export const PaladinsBook3D: React.FC<PaladinsBook3DProps> = ({
  onSparkPulse,
  sparkTriggerCount = 0,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const burstRef = useRef(0);

  useEffect(() => {
    if (sparkTriggerCount > 0) {
      burstRef.current = 1.0;
    }
  }, [sparkTriggerCount]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 300;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 6.2);

    // Rich Ultramarine + Warm Gold studio lighting to harmonize with #071039 - #E6EDFD palette
    const ambientLight = new THREE.AmbientLight(0xafc5f8, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe6edfd, 2.8);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const ultramarineRimLeft = new THREE.PointLight(0x2e5de6, 5.5, 14);
    ultramarineRimLeft.position.set(-4.2, 2.0, 2.5);
    scene.add(ultramarineRimLeft);

    const periwinkleRimRight = new THREE.PointLight(0x6e92f2, 4.5, 14);
    periwinkleRimRight.position.set(4.2, -1.8, 3.0);
    scene.add(periwinkleRimRight);

    const goldWarmFill = new THREE.PointLight(0xffcf70, 2.2, 10);
    goldWarmFill.position.set(0, 3.5, 2.5);
    scene.add(goldWarmFill);

    // Master group for levitation and interactive rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const bookPivot = new THREE.Group();
    rootGroup.add(bookPivot);

    // Load PBR textures
    const texLoader = new THREE.TextureLoader();
    const baseColorMap = texLoader.load(baseColorUrl);
    baseColorMap.colorSpace = THREE.SRGBColorSpace;

    const emissiveMap = texLoader.load(emissiveUrl);
    emissiveMap.colorSpace = THREE.SRGBColorSpace;

    const normalMap = texLoader.load(normalUrl);
    const roughnessMap = texLoader.load(roughnessUrl);
    const metalnessMap = texLoader.load(metallicUrl);

    const bookMaterial = new THREE.MeshStandardMaterial({
      map: baseColorMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(1.1, 1.1),
      roughnessMap: roughnessMap,
      roughness: 0.65,
      metalnessMap: metalnessMap,
      metalness: 0.45,
      emissiveMap: emissiveMap,
      emissive: new THREE.Color(0x6e92f2),
      emissiveIntensity: 1.35,
    });

    // Parse the Paladin's Book OBJ geometry synchronously
    try {
      const objLoader = new OBJLoader();
      const parsedObj = objLoader.parse(BOOK_OBJ_DATA);

      // Compute bounding box across all meshes to normalize and center
      const box = new THREE.Box3().setFromObject(parsedObj);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scaleFactor = 2.85 / maxDim;

      parsedObj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.translate(-center.x, -center.y, -center.z);
            mesh.geometry.computeVertexNormals();
          }
          mesh.material = bookMaterial;
        }
      });

      parsedObj.scale.setScalar(scaleFactor);
      // Tilt the book into an iconic heroic angled tome stance
      parsedObj.rotation.set(0.48, -0.52, 0.18);
      bookPivot.add(parsedObj);
      setIsLoaded(true);
    } catch (err) {
      console.error('Error parsing book OBJ:', err);
    }

    // Add dual Ultramarine glassmorphic orbital energy rings around the 3D book
    const ringGeo1 = new THREE.TorusGeometry(1.95, 0.018, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x6e92f2,
      transparent: true,
      opacity: 0.42,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.set(Math.PI / 2.3, 0.25, 0);
    rootGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.28, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x2e5de6,
      transparent: true,
      opacity: 0.28,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.set(Math.PI / 1.85, -0.35, 0.2);
    rootGroup.add(ring2);

    // Add floating Ultramarine & Alabaster Spark Particles around the Tome
    const particleCount = 65;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const paletteColors = [
      new THREE.Color('#E6EDFD'),
      new THREE.Color('#AFC5F8'),
      new THREE.Color('#6E92F2'),
      new THREE.Color('#2E5DE6'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 1.75;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const c = paletteColors[i % paletteColors.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      speeds[i] = 0.4 + Math.random() * 0.8;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Interactive pointer & drag rotation state
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = -0.35;
    let currentRotY = -1.6; // starts rotated for dramatic entrance spin!
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let manualOffsetY = 0;
    let manualOffsetX = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (isPointerDown) {
        const dx = e.clientX - prevPointerX;
        const dy = e.clientY - prevPointerY;
        manualOffsetY += dx * 0.012;
        manualOffsetX = Math.max(-0.8, Math.min(0.8, manualOffsetX + dy * 0.01));
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      } else {
        targetRotY = normX * 0.45;
        targetRotX = normY * 0.28;
      }
    };

    const handlePointerUp = () => {
      isPointerDown = false;
      setIsDragging(false);
    };

    const handlePointerLeave = () => {
      isPointerDown = false;
      setIsDragging(false);
      targetRotX = 0;
      targetRotY = 0;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let reqId = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Decay burst energy
      if (burstRef.current > 0.001) {
        burstRef.current *= 0.94;
      } else {
        burstRef.current = 0;
      }

      // Smooth levitation + gentle orbital sway synchronized with MIND SPARK title
      const floatY = Math.sin(elapsed * 1.9) * 0.16;
      const autoSpinY = Math.sin(elapsed * 0.75) * 0.28 + elapsed * 0.22;
      const burstSpin = burstRef.current * Math.PI * 1.65;

      const desiredY = autoSpinY + targetRotY + manualOffsetY + burstSpin;
      const desiredX = Math.cos(elapsed * 1.2) * 0.08 + targetRotX + manualOffsetX;

      currentRotY += (desiredY - currentRotY) * 0.075;
      currentRotX += (desiredX - currentRotX) * 0.075;

      bookPivot.position.y = floatY;
      bookPivot.rotation.y = currentRotY;
      bookPivot.rotation.x = currentRotX;

      // Pulse emissive intensity with the book's breathing & spark burst
      bookMaterial.emissiveIntensity =
        1.25 + Math.sin(elapsed * 2.6) * 0.35 + burstRef.current * 2.2;

      // Animate orbital rings
      ring1.rotation.z = elapsed * 0.45;
      ring1.position.y = floatY * 0.5;
      ring2.rotation.z = -elapsed * 0.32;
      ring2.position.y = floatY * 0.35;

      // Animate rising spark particles
      const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let py = posAttr.getY(i);
        py += (0.008 + burstRef.current * 0.04) * speeds[i];
        if (py > 1.4) py = -1.4;
        posAttr.setY(i, py);
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = elapsed * 0.18;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const handleTriggerSpark = () => {
    burstRef.current = 1.0;
    onSparkPulse?.();
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Ambient Ultramarine Volumetric Glow behind the 3D Paladin's Book */}
      <div
        className="pointer-events-none absolute inset-0 mx-auto my-auto h-52 w-52 sm:h-64 sm:w-64 rounded-full blur-[65px] transition-all duration-700"
        style={{
          background:
            'radial-gradient(circle, rgba(110,146,242,0.52) 0%, rgba(46,93,230,0.34) 45%, rgba(15,34,112,0) 75%)',
        }}
      />

      {/* Interactive 3D Canvas Container */}
      <div
        ref={mountRef}
        onClick={handleTriggerSpark}
        title="Drag to rotate the 3D Paladin's Tome · Click to unleash a Mind Spark pulse"
        className={`relative z-10 h-[230px] w-[280px] sm:h-[270px] sm:w-[340px] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Fallback or loading shimmer */}
      {!isLoaded && webglSupported && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-2 border-[#6E92F2]/40 border-t-[#E6EDFD] animate-spin" />
        </div>
      )}

      {/* Subtle Interactive Hint Pill */}
      <button
        type="button"
        onClick={handleTriggerSpark}
        className="group relative z-20 -mt-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
        style={{
          background:
            'linear-gradient(135deg, rgba(110,146,242,0.22) 0%, rgba(26,59,176,0.38) 100%)',
          border: '1px solid rgba(175,197,248,0.32)',
          boxShadow: '0 8px 24px -6px rgba(7,16,57,0.7), inset 0 1px 1px rgba(230,237,253,0.35)',
          backdropFilter: 'blur(12px)',
          color: '#AFC5F8',
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#6E92F2] shadow-[0_0_8px_#6E92F2] group-hover:bg-[#E6EDFD] transition-colors" />
        <span className="group-hover:text-[#E6EDFD] transition-colors">
          3D Arcane Tome · Drag or Click to Spark
        </span>
      </button>
    </div>
  );
};
