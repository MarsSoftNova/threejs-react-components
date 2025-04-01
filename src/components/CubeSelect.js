import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Scene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        scene.fog = new THREE.Fog(0x000000, 15, 30);

        // Raycaster setup
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredCube = null;
        let isPaused = false;

        const particles = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02,
            });
        }

        particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: new THREE.Color(0x88ccff),
            size: 0.05,
            transparent: true,
            opacity: 0.6,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        const cubes = [];
        const gridSize = 5;
        const spacing = 2;

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    const geometry = new THREE.BoxGeometry(1, 1, 1);
                    const material = new THREE.MeshPhongMaterial({
                        color: new THREE.Color(`hsl(${(x + y + z) * 30}, 70%, 50%)`),
                        shininess: 100,
                        transparent: true,
                        opacity: 0.8,
                        emissive: 0x000000, // Fix: Ensure emissive property exists
                    });

                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(
                        (x - gridSize / 2) * spacing,
                        (y - gridSize / 2) * spacing,
                        (z - gridSize / 2) * spacing
                    );

                    cube.userData = {
                        initialScale: 1,
                        targetScale: 1,
                        initialColor: material.color.clone(),
                        isSelected: false,
                        initialX: cube.position.x,
                        initialY: cube.position.y,
                        initialZ: cube.position.z,
                        rotationSpeed: 0.01,
                        pulsePhase: Math.random() * Math.PI * 2
                    };

                    scene.add(cube);
                    cubes.push(cube);
                }
            }
        }

        const light1 = new THREE.DirectionalLight(0xffffff, 5);
        light1.position.set(1, 1, 1);
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 2.5);
        light2.position.set(-1, -1, -1);
        scene.add(light2);

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        camera.position.z = 15;

        // Mouse move handler
        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cubes);

            // Reset previous hover effect
            if (hoveredCube && (!intersects.length || intersects[0].object !== hoveredCube)) {
                if (!hoveredCube.userData.isSelected) {
                    hoveredCube.material.opacity = 0.8;
                    hoveredCube.material.emissive.setHex(0x000000);
                }
                hoveredCube = null;
            }

            // Apply new hover effect
            if (intersects.length) {
                const cube = intersects[0].object;
                if (cube !== hoveredCube) {
                    hoveredCube = cube;
                    if (!cube.userData.isSelected) {
                        cube.material.opacity = 1;
                        cube.material.emissive.setHex(0x333333);
                    }
                }
            }
        }

        // Click handler
        function onMouseClick(event) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cubes);

            if (intersects.length > 0) {
                const cube = intersects[0].object;
                cube.userData.isSelected = !cube.userData.isSelected;

                if (cube.userData.isSelected) {
                    cube.userData.targetScale = 1.5;
                    cube.userData.rotationSpeed = 0.05;
                    cube.material.color.setHSL(Math.random(), 1, 0.5);
                    cube.material.opacity = 1;
                } else {
                    cube.userData.targetScale = 1;
                    cube.userData.rotationSpeed = 0.01;
                    cube.material.color.copy(cube.userData.initialColor);
                    cube.material.opacity = 0.8;
                }
            }
        }

        // Zoom handler
        function onWheel(event) {
            const zoomSpeed = 0.01;
            camera.position.z = Math.max(5, Math.min(30, camera.position.z + event.deltaY * zoomSpeed));
        }

        const animate = () => {

            if (!isPaused) {
                requestAnimationFrame(animate);

                const time = Date.now() * 0.001;

                // Update particles
                const positions = particleSystem.geometry.attributes.position.array;
                for (let i = 0; i < particleCount; i++){
                    positions[i * 3] += velocities[i].x;
                    positions[i * 3 + 1] += velocities[i].y;
                    positions[i * 3 + 2] += velocities[i].z;
        
                    // Reset particles that go too far
                    if (Math.abs(positions[i * 3]) > 15) positions[i * 3] = -positions[i * 3];
                    if (Math.abs(positions[i * 3 + 1]) > 15) positions[i * 3 + 1] = -positions[i * 3 + 1];
                    if (Math.abs(positions[i * 3 + 2]) > 15) positions[i * 3 + 2] = -positions[i * 3 + 2];                
                }
                particleSystem.geometry.attributes.position.needsUpdate = true;
            
                // Update cubes
                cubes.forEach((cube, i) => {
                    const offset = i * 0.1;

                    // Position animation
                    cube.position.x = cube.userData.initialX + Math.sin(time + offset) * 0.5;
                    cube.position.y = cube.userData.initialY + Math.cos(time + offset) * 0.5;

                    // Pulse effect
                    const pulse = Math.sin(time * 2 + cube.userData.pulsePhase) * 0.1;
                    const targetScale = cube.userData.targetScale + pulse;

                    // Smooth scale transition
                    cube.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

                    // Rotation
                    cube.rotation.x += cube.userData.rotationSpeed;
                    cube.rotation.y += cube.userData.rotationSpeed;
                });

                // Camera orbit
                camera.position.x = Math.sin(time * 0.5) * 15;
                camera.position.z = Math.cos(time * 0.5) * 15;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onMouseClick);
        window.addEventListener('wheel', onWheel);
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                isPaused = !isPaused;
                if (!isPaused) animate();
            }
        });
        
        animate();

        return () => {
            // window.removeEventListener('mousemove', onMouseMove);
            // window.removeEventListener('click', onMouseClick);
            // if (mountRef.current && renderer.domElement) {
            //     mountRef.current.removeChild(renderer.domElement);
            // }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} />;
};

export default Scene;
