import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

export default function ThreeScene() {
  // Optional flags: loadJSON (default false) and useFavicon (default false)
  const useFavicon = true;
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Booleans to toggle features (no explicit UI; just local state for logic)
  const [enableRotation] = useState(true);
  const [enableWaves] = useState(true);
  const [enableRandomPhase] = useState(false);
  // Toggle between points and lines
  const [showLines, _setShowLines] = useState(false);
  const [isSolid, _setIsSolid] = useState(true);

  useEffect(() => {
    let scene, renderer, camera, points, lineSegments, solidMesh;
    const clock = new THREE.Clock();
    let targetX = -window.innerWidth / 1.2;
    let initialPositions = null;
    let initialLinePositions = null;
    let randomPhases = null;
    let waveOrigin = null;
    let topologyGroup = null;

    // Arrays to store velocities for each particle (points + lines)
    let velocities = null;
    let lineVelocities = null;

    // Repulsion config
    const repulsionRadius = 1500;
    const repulsionStrength = 800;
    const damping = 0.9;

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-9999, -9999); // start offscreen
    const mouseIntersectionWorld = new THREE.Vector3(); // intersection in world coords

    // We'll create an invisible bounding sphere to handle intersections
    let boundingSphereMesh = null;

    const init = () => {
      scene = new THREE.Scene();
      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(WIDTH, HEIGHT);
      renderer.setClearColor(0x000000, 0);
      // Enable shadow mapping
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      camera = new THREE.PerspectiveCamera(10, WIDTH / HEIGHT, 0.1, 100000);
      camera.position.set(100, 2000, -25000);
      camera.rotation.x = 0.2;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(camera);

      // Lighting setup for better depth perception
      const ambientLight = new THREE.AmbientLight(0xffffff, 3);
      scene.add(ambientLight);
      
      const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
      mainLight.position.set(-1, 1, 1);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      mainLight.shadow.camera.near = 0.1;
      mainLight.shadow.camera.far = 100000;
      mainLight.shadow.camera.left = -2000;
      mainLight.shadow.camera.right = 2000;
      mainLight.shadow.camera.top = 2000;
      mainLight.shadow.camera.bottom = -2000;
      scene.add(mainLight);
      
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
      fillLight.position.set(1, 0, -1);
      scene.add(fillLight);

      // Create environment map for reflections
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
      const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
      scene.add(cubeCamera);

      // Create a simple environment
      const envGeometry = new THREE.SphereGeometry(50000, 32, 32);
      const envMaterial = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        color: 0xffffff,
        gradientMap: new THREE.DataTexture(new Uint8Array([0, 128, 255]), 1, 1)
      });
      const envMesh = new THREE.Mesh(envGeometry, envMaterial);
      scene.add(envMesh);

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // Loader logic
      const loader = new GLTFLoader();
      if (useFavicon) {
        loader.load(
          '/helpers/favicon.glb',
          (gltf) => {
            let faviconMesh = null;
            gltf.scene.traverse((child) => {
              if (child.isMesh && child.geometry) {
                faviconMesh = child;
              }
            });
            if (!faviconMesh) {
              setIsLoading(false);
              return;
            }
            // Clone & fix orientation
            const clonedMesh = faviconMesh.clone();
            clonedMesh.geometry = faviconMesh.geometry.clone();
            clonedMesh.geometry.scale(10, 10, 10);
            clonedMesh.geometry.center();
            // Flip 180° around X
            clonedMesh.rotateX(Math.PI);

            clonedMesh.geometry.computeBoundingBox();

            // Use MeshSurfaceSampler
            const sampler = new MeshSurfaceSampler(clonedMesh).build();
            const sampleCount = 10000;
            const sampledPositions = new Float32Array(sampleCount * 3);
            const tempPosition = new THREE.Vector3();
            for (let i = 0; i < sampleCount; i++) {
              sampler.sample(tempPosition);
              sampledPositions[i * 3] = tempPosition.x;
              sampledPositions[i * 3 + 1] = tempPosition.y;
              sampledPositions[i * 3 + 2] = tempPosition.z;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(sampledPositions, 3));
            geometry.center();
            geometry.computeBoundingBox();
            initialPositions = sampledPositions.slice();

            // Random phases for wave animation
            randomPhases = new Float32Array(sampleCount);
            for (let i = 0; i < randomPhases.length; i++) {
              randomPhases[i] = Math.random() * Math.PI * 2;
            }

            const bbox = geometry.boundingBox;
            waveOrigin = new THREE.Vector3(0, bbox.max.y, 0);

            // Set alpha=1 for all
            const alphaValues = new Float32Array(sampleCount).fill(1.0);
            geometry.setAttribute('alpha', new THREE.BufferAttribute(alphaValues, 1));

            // Points material
            const pointsMaterial = new THREE.ShaderMaterial({
              uniforms: {
                pointColor: { value: new THREE.Color(0x083d68) },
                size: { value: 140 },
              },
              vertexShader: `
                attribute float alpha;
                uniform float size;
                varying float vAlpha;
                void main() {
                  vAlpha = alpha;
                  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                  gl_PointSize = size * (300.0 / -mvPosition.z);
                  gl_Position = projectionMatrix * mvPosition;
                }
              `,
              fragmentShader: `
                uniform vec3 pointColor;
                varying float vAlpha;
                void main() {
                  gl_FragColor = vec4(pointColor, vAlpha);
                }
              `,
              transparent: true,
            });
            // Use the sampled geometry only for points
            const geometryPoints = geometry;
            points = new THREE.Points(geometryPoints, pointsMaterial);
            // Use the original clonedMesh.geometry for the solid object
            const geometryMesh = clonedMesh.geometry.clone();
            geometryMesh.scale(.5, .5, .5);
            geometryMesh.center();
            
            // Create a toon material with custom shader
            const toonMaterial = new THREE.ShaderMaterial({
              uniforms: {
                color: { value: new THREE.Color(0xB8D5F4) },
                lightPosition: { value: new THREE.Vector3(1, 1, 1) },
                shininess: { value: 50.0 },
                specularColor: { value: new THREE.Color(0xffffff) },
                envMap: { value: cubeRenderTarget.texture },
                reflectivity: { value: 0.3 }
              },
              vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vWorldPosition;
                
                void main() {
                  vNormal = normalize(normalMatrix * normal);
                  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                  vWorldPosition = worldPosition.xyz;
                  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                  vViewPosition = -mvPosition.xyz;
                  gl_Position = projectionMatrix * mvPosition;
                }
              `,
              fragmentShader: `
                uniform vec3 color;
                uniform vec3 lightPosition;
                uniform float shininess;
                uniform vec3 specularColor;
                uniform samplerCube envMap;
                uniform float reflectivity;
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vWorldPosition;
                
                void main() {
                  vec3 normal = normalize(vNormal);
                  vec3 lightDir = normalize(lightPosition);
                  vec3 viewDir = normalize(vViewPosition);
                  
                  // Diffuse
                  float diffuse = dot(normal, lightDir);
                  
                  // Create discrete steps for toon shading
                  if (diffuse > 0.7) {
                    diffuse = 1.0;
                  } else if (diffuse > 0.4) {
                    diffuse = 0.6;
                  } else if (diffuse > 0.1) {
                    diffuse = 0.4;
                  } else {
                    diffuse = 0.2;
                  }
                  
                  // Specular (sharp shine)
                  vec3 reflectDir = reflect(-lightDir, normal);
                  float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
                  float specularIntensity = spec > 0.8 ? 1.0 : 0.0;
                  
                  // Environment reflections
                  vec3 worldNormal = normalize(mat3(viewMatrix) * normal);
                  vec3 worldView = normalize(vWorldPosition - cameraPosition);
                  vec3 worldReflect = reflect(worldView, worldNormal);
                  vec3 envColor = textureCube(envMap, worldReflect).rgb;
                  
                  // Rim light
                  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
                  rim = smoothstep(0.6, 1.0, rim);
                  
                  vec3 finalColor = color * (diffuse + rim * 0.5) + 
                                  specularColor * specularIntensity * 0.7 +
                                  envColor * reflectivity;
                  
                  gl_FragColor = vec4(finalColor, 1.0);
                }
              `,
              side: THREE.DoubleSide
            });
            
            // Add ground plane for shadows
            const planeGeometry = new THREE.PlaneGeometry(4000, 4000);
            const planeMaterial = new THREE.MeshStandardMaterial({ 
              color: 0xffffff,
              roughness: 0.8,
              metalness: 0.2
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = -200;
            plane.receiveShadow = true;
            scene.add(plane);

            solidMesh = new THREE.Mesh(geometryMesh, toonMaterial);
            solidMesh.rotation.x = Math.PI * 1.05;
            solidMesh.rotation.y = Math.PI * 1.05;
            solidMesh.rotation.z = 0;
            solidMesh.castShadow = true;
            solidMesh.visible = false;

            // Lines from sampled points
            const wireframeGeometry = new THREE.WireframeGeometry(geometryPoints);
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.6,
            });
            lineSegments = new THREE.LineSegments(wireframeGeometry, lineMaterial);
            const wirePosAttr = wireframeGeometry.getAttribute('position');
            const lineArray = new Float32Array(wirePosAttr.count * 3);
            for (let i = 0; i < wirePosAttr.count; i++) {
              lineArray[i * 3] = wirePosAttr.getX(i);
              lineArray[i * 3 + 1] = wirePosAttr.getY(i);
              lineArray[i * 3 + 2] = wirePosAttr.getZ(i);
            }
            wireframeGeometry.setAttribute('position', new THREE.BufferAttribute(lineArray, 3));
            initialLinePositions = lineArray.slice(0);

            topologyGroup = new THREE.Group();
            topologyGroup.add(points);
            topologyGroup.add(lineSegments);
            topologyGroup.add(solidMesh);
            topologyGroup.position.set(-2000, 1200, -1000);
            topologyGroup.rotation.set(0.1, -0.2, 0);
            scene.add(topologyGroup);

            velocities = new Float32Array(initialPositions.length).fill(0);
            lineVelocities = new Float32Array(initialLinePositions.length).fill(0);

            // Create bounding sphere in local space of the group
            // We'll attach the invisible sphere as a child
            geometryPoints.computeBoundingSphere();
            // Use the bounding sphere radius from geometryPoints as a starting point
            const sphereRadius = geometryPoints.boundingSphere.radius * 1.1; // pad slightly
            const sphereGeom = new THREE.SphereGeometry(sphereRadius, 32, 32);
            const sphereMat = new THREE.MeshBasicMaterial({ visible: false });
            boundingSphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            boundingSphereMesh.position.set(0, 0, 0);
            topologyGroup.add(boundingSphereMesh);

            setIsLoading(false);
          },
          undefined,
          () => {
            setIsLoading(false);
          }
        );
      } else {
        // Load Everest
        loader.load(
          '/helpers/everest/everest.gltf',
          (gltf) => {
            let everestMesh = null;
            gltf.scene.traverse((child) => {
              if (child.isMesh && child.geometry) {
                everestMesh = child;
              }
            });
            if (!everestMesh) {
              setIsLoading(false);
              return;
            }
            const geometry = everestMesh.geometry.clone();
            geometry.scale(100, 100, 100);
            geometry.center();
            geometry.computeBoundingBox();

            const posAttr = geometry.getAttribute('position');
            const positionArray = new Float32Array(posAttr.count * 3);
            for (let i = 0; i < posAttr.count; i++) {
              positionArray[i * 3] = posAttr.getX(i);
              positionArray[i * 3 + 1] = posAttr.getY(i);
              positionArray[i * 3 + 2] = posAttr.getZ(i);
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
            initialPositions = positionArray.slice(0);

            randomPhases = new Float32Array(posAttr.count);
            for (let i = 0; i < randomPhases.length; i++) {
              randomPhases[i] = Math.random() * Math.PI * 2;
            }

            const bbox = geometry.boundingBox;
            waveOrigin = new THREE.Vector3(0, bbox.max.y, 0);

            let maxDistance = 0;
            const alphaValues = [];
            for (let i = 0; i < initialPositions.length; i += 3) {
              const px = initialPositions[i];
              const pz = initialPositions[i + 2];
              const d = Math.sqrt(px * px + pz * pz);
              if (d > maxDistance) maxDistance = d;
              alphaValues.push(d);
            }
            for (let i = 0; i < alphaValues.length; i++) {
              alphaValues[i] = 1.0 - (alphaValues[i] / maxDistance) * 2.0;
            }
            geometry.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(alphaValues), 1));

            const pointsMaterial = new THREE.ShaderMaterial({
              uniforms: {
                pointColor: { value: new THREE.Color(0x083d68) },
                size: { value: 140 },
              },
              vertexShader: `
                attribute float alpha;
                uniform float size;
                varying float vAlpha;
                void main() {
                  vAlpha = alpha;
                  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                  gl_PointSize = size * (300.0 / -mvPosition.z);
                  gl_Position = projectionMatrix * mvPosition;
                }
              `,
              fragmentShader: `
                uniform vec3 pointColor;
                varying float vAlpha;
                void main() {
                  gl_FragColor = vec4(pointColor, vAlpha);
                }
              `,
              transparent: true,
            });
            const geometryPoints = geometry.clone();
            points = new THREE.Points(geometryPoints, pointsMaterial);

            // Create solid mesh with light blue color
            const geometryMesh = everestMesh.geometry.clone();
            geometryMesh.scale(1, 1, 1);
            geometryMesh.center();
            // Glassy physical material
            const glassMaterial = new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              side: THREE.DoubleSide,
              transmission: 1.0,
              thickness: 2.0,
              roughness: 0,
              metalness: 0,
              reflectivity: 0.9,
              ior: 1.45,
              clearcoat: 1.0,
              clearcoatRoughness: 0
            });
            solidMesh = new THREE.Mesh(geometryMesh, glassMaterial);
            solidMesh.rotation.x = Math.PI;
            solidMesh.rotation.y = Math.PI;
            solidMesh.visible = false;

            // Remove duplicate solid mesh creation
            const wireframeGeometry = new THREE.WireframeGeometry(geometryPoints);
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.6,
            });
            lineSegments = new THREE.LineSegments(wireframeGeometry, lineMaterial);
            const wirePosAttr = wireframeGeometry.getAttribute('position');
            const lineArray = new Float32Array(wirePosAttr.count * 3);
            for (let i = 0; i < wirePosAttr.count; i++) {
              lineArray[i * 3] = wirePosAttr.getX(i);
              lineArray[i * 3 + 1] = wirePosAttr.getY(i);
              lineArray[i * 3 + 2] = wirePosAttr.getZ(i);
            }
            wireframeGeometry.setAttribute('position', new THREE.BufferAttribute(lineArray, 3));
            initialLinePositions = lineArray.slice(0);

            topologyGroup = new THREE.Group();
            topologyGroup.add(points);
            topologyGroup.add(lineSegments);
            topologyGroup.add(solidMesh);
            topologyGroup.position.set(-2000, -200, -1000);
            scene.add(topologyGroup);

            velocities = new Float32Array(initialPositions.length).fill(0);
            lineVelocities = new Float32Array(initialLinePositions.length).fill(0);

            // Create bounding sphere in local space
            geometryPoints.computeBoundingSphere();
            const sphereRadius = geometryPoints.boundingSphere.radius * 1.1;
            const sphereGeom = new THREE.SphereGeometry(sphereRadius, 32, 32);
            const sphereMat = new THREE.MeshBasicMaterial({ visible: false });
            boundingSphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            boundingSphereMesh.position.set(0, 0, 0);
            topologyGroup.add(boundingSphereMesh);

            setIsLoading(false);
          },
          undefined,
          () => {
            setIsLoading(false);
          }
        );
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      if (points && lineSegments && waveOrigin && initialPositions && randomPhases && boundingSphereMesh) {
        const time = clock.getElapsedTime();
        points.visible = !showLines && !isSolid;
        lineSegments.visible = showLines && !isSolid;
        if (solidMesh) {
          solidMesh.visible = isSolid;
        }
        if (useFavicon && isSolid && solidMesh) {
          if (!solidMesh.userData.baseRotation) {
            solidMesh.userData.baseRotation = solidMesh.rotation.clone();
            solidMesh.userData.basePosition = solidMesh.position.clone();
          }
          const jumpPeriod = 6.0;
          const tmod = time % jumpPeriod;
          if (tmod < 1.0 || tmod > 3.0) {
            // Pause phase: maintain base orientation and position
            solidMesh.rotation.copy(solidMesh.userData.baseRotation);
            solidMesh.position.y = solidMesh.userData.basePosition.y;
          } else {
            // Active coin flip phase between 1.0s and 3.0s
            const progress = (tmod - 1.0) / 2.0; // normalized progress over 2 seconds
            const H = 100;
            
            // Sine wave for jump (smooth loop)
            const jumpOffset = H * Math.sin(Math.PI * progress);
            
            // Keep cubic easing for rotation
            const easeInOutCubic = x => x < 0.5 
                ? 4 * x * x * x 
                : 1 - Math.pow(-2 * x + 2, 3) / 2;
            
            const rotations = 8;
            const extraRotation = Math.PI * easeInOutCubic(progress) * rotations;
            
            solidMesh.rotation.y = solidMesh.userData.baseRotation.y + extraRotation;
            solidMesh.rotation.x = solidMesh.userData.baseRotation.x;
            solidMesh.rotation.z = solidMesh.userData.baseRotation.z;
            solidMesh.position.y = solidMesh.userData.basePosition.y + jumpOffset;
          }
        }

        // Optionally rotate if not Favicon
        if (!useFavicon && enableRotation) {
          topologyGroup.rotation.y += 0.0005;
        }

        // Wave logic (Everest only)
        const waveSpeed = 1.0;
        const waveHeight = 120;
        const waveSpread = 0.002;
        const distanceAtten = 0.0004;
        if (!useFavicon && enableWaves) {
          // Points
          const posAttr = points.geometry.getAttribute('position');
          const positions = posAttr.array;
          for (let i = 0; i < positions.length; i += 3) {
            const idx = i / 3;
            const x0 = initialPositions[i];
            const y0 = initialPositions[i + 1];
            const z0 = initialPositions[i + 2];
            const dx = x0 - waveOrigin.x;
            const dy = y0 - waveOrigin.y;
            const dz = z0 - waveOrigin.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const phase = enableRandomPhase ? randomPhases[idx] : 0.0;
            const waveFactor = Math.sin(time * waveSpeed - dist * waveSpread + phase);
            const attenuation = Math.exp(-dist * distanceAtten);
            const offsetY = waveFactor * waveHeight * attenuation;
            positions[i] = x0;
            positions[i + 1] = y0 + offsetY;
            positions[i + 2] = z0;
          }
          posAttr.needsUpdate = true;

          // Lines
          const linePosAttr = lineSegments.geometry.getAttribute('position');
          const linePositions = linePosAttr.array;
          for (let i = 0; i < linePositions.length; i += 3) {
            const idx = i / 3;
            const x0 = initialLinePositions[i];
            const y0 = initialLinePositions[i + 1];
            const z0 = initialLinePositions[i + 2];
            const dx = x0 - waveOrigin.x;
            const dy = y0 - waveOrigin.y;
            const dz = z0 - waveOrigin.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const phase = enableRandomPhase ? randomPhases[idx] : 0.0;
            const waveFactor = Math.sin(time * waveSpeed - dist * waveSpread + phase);
            const attenuation = Math.exp(-dist * distanceAtten);
            const offsetY = waveFactor * waveHeight * attenuation;
            linePositions[i] = x0;
            linePositions[i + 1] = y0 + offsetY;
            linePositions[i + 2] = z0;
          }
          linePosAttr.needsUpdate = true;
        }

        // Update bounding sphere based on current geometry
        const activeGeometry = showLines ? lineSegments.geometry : points.geometry;
        activeGeometry.computeBoundingSphere();
        const newBoundingSphere = activeGeometry.boundingSphere;
        
        // Update collision mesh to match new bounding sphere
        const scale = newBoundingSphere.radius / boundingSphereMesh.geometry.parameters.radius;
        boundingSphereMesh.scale.set(scale, scale, scale);
        boundingSphereMesh.position.copy(newBoundingSphere.center);

        // Raycast against updated boundingSphereMesh
        raycaster.setFromCamera(mouseNDC, camera);
        const intersects = raycaster.intersectObject(boundingSphereMesh, false);
        if (intersects.length > 0) {
          mouseIntersectionWorld.copy(intersects[0].point);
        } else {
          // Offscreen so no repulsion
          mouseIntersectionWorld.set(999999, 999999, 999999);
        }

        if (points && velocities && lineSegments && lineVelocities) {
          // Convert intersection from world to local
          const localIntersection = topologyGroup.worldToLocal(mouseIntersectionWorld.clone());

          // Repel points
          const posAttr = points.geometry.getAttribute('position');
          const positions = posAttr.array;
          for (let i = 0; i < positions.length; i += 3) {
            const px = positions[i];
            const py = positions[i + 1];
            const pz = positions[i + 2];
            const ox = initialPositions[i];
            const oy = initialPositions[i + 1];
            const oz = initialPositions[i + 2];

            const vx = velocities[i];
            const vy = velocities[i + 1];
            const vz = velocities[i + 2];

            const dx = px - localIntersection.x;
            const dy = py - localIntersection.y;
            const dz = pz - localIntersection.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            let fx = 0, fy = 0, fz = 0;
            if (distSq < repulsionRadius * repulsionRadius) {
              const dist = Math.sqrt(distSq) || 1;
              const forceMag = repulsionStrength / dist;
              fx = (dx / dist) * forceMag;
              fy = (dy / dist) * forceMag;
              fz = (dz / dist) * forceMag;
            } else {
              // Spring to original
              const sx = ox - px;
              const sy = oy - py;
              const sz = oz - pz;
              const springFactor = 0.02;
              fx = sx * springFactor;
              fy = sy * springFactor;
              fz = sz * springFactor;
            }

            const nvx = (vx + fx) * damping;
            const nvy = (vy + fy) * damping;
            const nvz = (vz + fz) * damping;
            velocities[i] = nvx;
            velocities[i + 1] = nvy;
            velocities[i + 2] = nvz;

            positions[i] = px + nvx;
            positions[i + 1] = py + nvy;
            positions[i + 2] = pz + nvz;
          }
          posAttr.needsUpdate = true;

          // Repel lines
          const linePosAttr = lineSegments.geometry.getAttribute('position');
          const linePositions = linePosAttr.array;
          for (let i = 0; i < linePositions.length; i += 3) {
            const px = linePositions[i];
            const py = linePositions[i + 1];
            const pz = linePositions[i + 2];
            const ox = initialLinePositions[i];
            const oy = initialLinePositions[i + 1];
            const oz = initialLinePositions[i + 2];

            const vx = lineVelocities[i];
            const vy = lineVelocities[i + 1];
            const vz = lineVelocities[i + 2];

            const dx = px - localIntersection.x;
            const dy = py - localIntersection.y;
            const dz = pz - localIntersection.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            let fx = 0, fy = 0, fz = 0;
            if (distSq < repulsionRadius * repulsionRadius) {
              const dist = Math.sqrt(distSq) || 1;
              const forceMag = repulsionStrength / dist;
              fx = (dx / dist) * forceMag;
              fy = (dy / dist) * forceMag;
              fz = (dz / dist) * forceMag;
            } else {
              // Spring to original
              const sx = ox - px;
              const sy = oy - py;
              const sz = oz - pz;
              const springFactor = 0.02;
              fx = sx * springFactor;
              fy = sy * springFactor;
              fz = sz * springFactor;
            }

            const nvx = (vx + fx) * damping;
            const nvy = (vy + fy) * damping;
            const nvz = (vz + fz) * damping;
            lineVelocities[i] = nvx;
            lineVelocities[i + 1] = nvy;
            lineVelocities[i + 2] = nvz;

            linePositions[i] = px + nvx;
            linePositions[i + 1] = py + nvy;
            linePositions[i + 2] = pz + nvz;
          }
          linePosAttr.needsUpdate = true;
        }

        // Smooth x-position approach
        if (topologyGroup) {
          topologyGroup.position.x += (targetX - topologyGroup.position.x) * 0.1;
        }

        renderer.render(scene, camera);
      }
    };

    const handleResize = () => {
      if (!renderer || !camera) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      targetX = -newWidth / 1.2;
    };

    const handlePointerMove = (event) => {
      mouseNDC.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = - (event.clientY / window.innerHeight) * 2 + 1;
    };

    const handlePointerLeave = () => {
      mouseNDC.set(-9999, -9999);
    };

    init();
    animate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (mountRef.current && renderer?.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-screen relative">
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue">
          Loading terrain...
        </div>
      )}
    </div>
  );
}