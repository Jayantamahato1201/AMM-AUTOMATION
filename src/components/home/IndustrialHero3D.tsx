import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Cpu, Activity, Zap, Shield, Radio, CheckCircle2 } from 'lucide-react';

interface IndustrialHero3DProps {
  mouseX: number;
  mouseY: number;
}

export const IndustrialHero3D: React.FC<IndustrialHero3DProps> = ({ mouseX, mouseY }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetRotation = useRef({ x: 0.15, y: -0.35 });
  const currentRotation = useRef({ x: 0.15, y: -0.35 });
  const [webglSupported, setWebglSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    // 2. WebGL Renderer with Antialiasing and Alpha
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

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup - Industrial Warm & Cool Contrast
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(8, 12, 10);
    scene.add(dirLight1);

    const orangeLight = new THREE.PointLight(0xf27d26, 4, 25);
    orangeLight.position.set(-5, 4, 6);
    scene.add(orangeLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3.5, 25);
    blueLight.position.set(6, -4, 5);
    scene.add(blueLight);

    // Master Group for 3D Isometric Industrial Automation Rig
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ----------------------------------------------------
    // ELEMENT A: PLC Industrial Controller Rack Assembly
    // ----------------------------------------------------
    const plcGroup = new THREE.Group();
    masterGroup.add(plcGroup);

    // Main PLC Chassis (Navy/Slate metallic box)
    const chassisGeo = new THREE.BoxGeometry(4.8, 3.2, 1.4);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0a192f,
      roughness: 0.35,
      metalness: 0.75,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    plcGroup.add(chassis);

    // Wireframe edges on Chassis
    const chassisEdgesGeo = new THREE.EdgesGeometry(chassisGeo);
    const chassisEdgesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const chassisEdges = new THREE.LineSegments(chassisEdgesGeo, chassisEdgesMat);
    plcGroup.add(chassisEdges);

    // Modular I/O Terminal Slots (3 vertical sub-modules)
    for (let i = -1; i <= 1; i++) {
      const slotGeo = new THREE.BoxGeometry(1.2, 2.6, 0.2);
      const slotMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0x1e293b : 0x0f172a,
        roughness: 0.4,
        metalness: 0.8,
      });
      const slot = new THREE.Mesh(slotGeo, slotMat);
      slot.position.set(i * 1.45, 0, 0.75);
      plcGroup.add(slot);

      // Status LED indicator dots
      const ledGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const ledColor = i === -1 ? 0x10b981 : i === 0 ? 0xf27d26 : 0x38bdf8;
      const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(i * 1.45 - 0.35, 1.0, 0.88);
      plcGroup.add(led);

      // Additional secondary indicator
      const subLed = new THREE.Mesh(
        ledGeo,
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      subLed.position.set(i * 1.45 + 0.35, 1.0, 0.88);
      plcGroup.add(subLed);
    }

    // Heatsink Fin Wireframes on Top
    for (let f = -1.8; f <= 1.8; f += 0.4) {
      const finGeo = new THREE.BoxGeometry(0.08, 0.35, 1.2);
      const finMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.9,
      });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(f, 1.75, 0);
      plcGroup.add(fin);
    }

    // ----------------------------------------------------
    // ELEMENT B: Concentric Precision Engineering Rings
    // ----------------------------------------------------
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    // Large outer ring (cyan wireframe)
    const outerRingGeo = new THREE.RingGeometry(4.2, 4.25, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2.3;
    ringGroup.add(outerRing);

    // Mid orange technical encoder ring
    const midRingGeo = new THREE.TorusGeometry(3.4, 0.04, 16, 64);
    const midRingMat = new THREE.MeshStandardMaterial({
      color: 0xf27d26,
      emissive: 0xf27d26,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    midRing.rotation.x = Math.PI / 2.8;
    ringGroup.add(midRing);

    // Thin inner dashed ring
    const innerRingGeo = new THREE.RingGeometry(2.4, 2.44, 32);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 3.2;
    ringGroup.add(innerRing);

    // ----------------------------------------------------
    // ELEMENT C: Constellation of Connected Sensor Nodes
    // ----------------------------------------------------
    const sensorNodeCount = 14;
    const sensorPositions: THREE.Vector3[] = [];
    const sensorGroup = new THREE.Group();
    masterGroup.add(sensorGroup);

    for (let i = 0; i < sensorNodeCount; i++) {
      const radius = 3.6 + Math.random() * 2.8;
      const theta = (i / sensorNodeCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const phi = (Math.random() - 0.5) * 1.6;

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.cos(phi),
        radius * Math.sin(phi) + (Math.random() - 0.5) * 1.2,
        radius * Math.sin(theta) * Math.cos(phi)
      );
      sensorPositions.push(pos);

      // Node Geometry (small diamond / octahedron)
      const nodeGeo = new THREE.OctahedronGeometry(0.18 + (i % 3) * 0.06);
      const isAccent = i % 4 === 0;
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isAccent ? 0xf27d26 : 0x38bdf8,
        emissive: isAccent ? 0xf27d26 : 0x0284c7,
        emissiveIntensity: 0.7,
        metalness: 0.9,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      sensorGroup.add(nodeMesh);
    }

    // Interconnected Telemetry Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.3,
    });

    const lineGeo = new THREE.BufferGeometry();
    const linePoints: number[] = [];

    for (let i = 0; i < sensorPositions.length; i++) {
      for (let j = i + 1; j < sensorPositions.length; j++) {
        if (sensorPositions[i].distanceTo(sensorPositions[j]) < 4.2) {
          linePoints.push(
            sensorPositions[i].x, sensorPositions[i].y, sensorPositions[i].z,
            sensorPositions[j].x, sensorPositions[j].y, sensorPositions[j].z
          );
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const telemetryLines = new THREE.LineSegments(lineGeo, lineMaterial);
    sensorGroup.add(telemetryLines);

    // ----------------------------------------------------
    // ELEMENT D: Flowing Data Packet Particle Streams
    // ----------------------------------------------------
    const packetCount = 45;
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    const packetSpeeds: number[] = [];

    for (let p = 0; p < packetCount; p++) {
      const angle = (p / packetCount) * Math.PI * 2;
      const r = 3.2 + Math.sin(p * 3) * 1.5;
      packetPositions[p * 3] = Math.cos(angle) * r;
      packetPositions[p * 3 + 1] = Math.sin(p * 2) * 1.6;
      packetPositions[p * 3 + 2] = Math.sin(angle) * r;
      packetSpeeds.push(0.008 + Math.random() * 0.012);
    }

    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0xf27d26,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
    });
    const packetParticles = new THREE.Points(packetGeo, packetMat);
    masterGroup.add(packetParticles);

    // Initial Master Group Orientation (Isometric Industrial Stance)
    masterGroup.rotation.x = 0.22;
    masterGroup.rotation.y = -0.38;

    // ----------------------------------------------------
    // 4. Animation Loop with Smooth Damped Mouse Parallax
    // ----------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle mechanical rotations
      outerRing.rotation.z = elapsedTime * 0.12;
      midRing.rotation.z = -elapsedTime * 0.18;
      midRing.rotation.y = Math.sin(elapsedTime * 0.4) * 0.15;
      innerRing.rotation.z = elapsedTime * 0.08;

      // Gentle breathing float on PLC
      plcGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;
      plcGroup.rotation.y = Math.sin(elapsedTime * 0.6) * 0.06;

      // Animate flowing data packets
      const positions = packetGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < packetCount; i++) {
        const speed = packetSpeeds[i];
        const currentAngle = Math.atan2(positions[i * 3 + 2], positions[i * 3]) + speed;
        const r = 3.2 + Math.sin(elapsedTime * 1.5 + i) * 1.2;
        positions[i * 3] = Math.cos(currentAngle) * r;
        positions[i * 3 + 1] = Math.sin(elapsedTime * 0.8 + i) * 1.4;
        positions[i * 3 + 2] = Math.sin(currentAngle) * r;
      }
      packetGeo.attributes.position.needsUpdate = true;

      // Smooth mouse parallax lerp
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

      masterGroup.rotation.x = 0.22 + currentRotation.current.x;
      masterGroup.rotation.y = -0.38 + currentRotation.current.y;

      renderer.render(scene, camera);
    };

    animate();

    // 5. Resize Handler with ResizeObserver
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update target rotation from mouse prop
  useEffect(() => {
    targetRotation.current.x = mouseY * 0.45;
    targetRotation.current.y = mouseX * 0.55;
  }, [mouseX, mouseY]);

  return (
    <div
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 transition-transform duration-300"
        style={{
          perspective: '1200px',
        }}
      />

      {/* Fallback CSS 3D Model if WebGL is unavailable */}
      {!webglSupported && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-64 h-64 border border-[#F27D26]/40 bg-[#0A192F]/80 backdrop-blur-md rounded p-4 text-center flex flex-col items-center justify-center shadow-2xl">
            <Cpu className="w-12 h-12 text-[#F27D26] animate-pulse mb-3" />
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Turnkey Automation PLC</h4>
            <p className="text-slate-400 text-xs mt-1">Smart Industrial Process Integration</p>
          </div>
        </div>
      )}

      {/* Layered Floating Telemetry Badges with 3D Depth */}
      
      {/* Top Right: System Status HUD Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-4 right-2 sm:right-6 z-20 pointer-events-none"
        style={{
          transform: `translate3d(${mouseX * -15}px, ${mouseY * -15}px, 30px)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="bg-white/90 dark:bg-[#0A192F]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 shadow-lg px-3.5 py-2.5 rounded-xs flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#0A192F] dark:text-white uppercase">
                PLC // RUN 4.0
              </span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Scan Cycle: 0.8ms • Normal
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Left: OEE & Telemetry Metrics Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-6 left-2 sm:left-4 z-20 pointer-events-none"
        style={{
          transform: `translate3d(${mouseX * 20}px, ${mouseY * 20}px, 40px)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="bg-white/90 dark:bg-[#0A192F]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 shadow-xl p-3.5 rounded-xs space-y-2 max-w-[210px]">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F27D26] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Plant Telemetry</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              99.8% OEE
            </span>
          </div>

          <div className="space-y-1.5 text-[9px] font-mono text-slate-600 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span>BUS: MODBUS TCP</span>
              <span className="text-[#F27D26] font-semibold">SYNCED</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-[#F27D26] h-full w-[94%] animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Left: ISO / SIL Safety Compliance Chip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute top-12 left-0 sm:left-2 z-20 pointer-events-none"
        style={{
          transform: `translate3d(${mouseX * -10}px, ${mouseY * -10}px, 20px)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="bg-slate-100/90 dark:bg-[#071324]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xs flex items-center gap-2 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-[9px] font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 font-mono">
            SIL-3 / IEC 61508
          </span>
        </div>
      </motion.div>

      {/* Bottom Right: Interactive Drag Cue */}
      <div className="absolute bottom-2 right-4 z-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-[#F27D26] animate-spin" />
          <span>Interactive 3D Stage</span>
        </span>
      </div>
    </div>
  );
};
