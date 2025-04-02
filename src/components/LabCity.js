import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TweenMax, Power1 } from "gsap/gsap-core";

const ThreeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        let createCarPos = true;
        const uSpeed = 0.001;
        // ---------- Renderer ---------- //
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (window.innerWidth > 800) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.needsUpdate = true;
        };
        mountRef.current.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        };
        // ---------- Renderer ---------- //

        // ---------- Scene && Objects ---------- //
        const scene = new THREE.Scene();
        const city = new THREE.Object3D();
        const smoke = new THREE.Object3D();
        const town = new THREE.Object3D();
        // ---------- Scene && Objects---------- //

        // ---------- Camera ---------- //
        const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.set(0, 2, 14);
        // ---------- Camera ---------- //

        // ---------- Fog and Background ---------- //
        const setcolor = 0xF02050;
        // const setcolor = 0xF2F111;
        // const setcolor = 0xFF6347;
        scene.background = new THREE.Color(setcolor);
        scene.fog = new THREE.Fog(setcolor, 10, 16);
        // scene.fog = new THREE.FogExp2(setcolor, 0.05);
        // ---------- Fog and Background ---------- //

        // ---------- Lights ---------- //
        const ambientLight = new THREE.AmbientLight(0xffffff, 40);
        const lightFront = new THREE.SpotLight(0xffffff, 20, 10);
        lightFront.rotation.x = 45 * Math.PI / 180;
        lightFront.rotation.z = -45 * Math.PI / 180;
        lightFront.position.set(5, 5, 5);
        lightFront.castShadow = true;
        lightFront.shadow.mapSize.width = 6000;
        lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
        lightFront.penumbra = 0.1;
        // const spotLightHelper = new THREE.SpotLightHelper( lightFront );
        //scene.add( spotLightHelper );
        const lightBack = new THREE.PointLight(0xFFFFFF, 50);
        lightBack.position.set( 0, 6, 0 );
        scene.add(ambientLight);
        scene.add(lightBack);

        smoke.position.y = 2;

        city.add(lightFront);
        scene.add(city);
        city.add(smoke);
        city.add(town);
        
        // ---------- RANDOM Function ----------
        function mathRandom(num = 8) {
            const numValue = - Math.random() * num + Math.random() * num;
            return numValue;
        };
        // ---------- CHANGE bluilding colors ---------- //
        let setTintNum = true;
        function setTintColor() {
            let setColor;
            if (setTintNum) {
                setTintNum = false;
                setColor = 0x000000;
            } else {
                setTintNum = true;
                setColor = 0x000000;
            };
            return setColor;
        };

        // ---------- CREATE City ---------- //
        function init() {
            let segments = 2;
            for (let i = 1; i < 100; i++) {
                const geometry = new THREE.BoxGeometry(1, 0.8, 1, segments, segments, segments);
                const material = new THREE.MeshStandardMaterial({
                    color:setTintColor(),
                    wireframe:false,
                    //opacity:0.9,
                    //transparent:true,
                    //roughness: 0.3,
                    //metalness: 1,
                    // shading: THREE.SmoothShading,
                    // shading:THREE.FlatShading,
                    side:THREE.DoubleSide});
                const wmaterial = new THREE.MeshLambertMaterial({
                    color:0xFFFFFF,
                    wireframe:true,
                    transparent:true,
                    opacity: 0.03,
                    side:THREE.DoubleSide/*,
                    shading:THREE.FlatShading*/});
            
                const cube = new THREE.Mesh(geometry, material);
                // const wire = new THREE.Mesh(geometry, wmaterial);
                const floor = new THREE.Mesh(geometry, material);
                const wfloor = new THREE.Mesh(geometry, wmaterial);
                
                cube.add(wfloor);
                cube.castShadow = true;
                cube.receiveShadow = true;
                cube.rotationValue = 0.1+Math.abs(mathRandom(8));
                
                //floor.scale.x = floor.scale.z = 1+mathRandom(0.33);
                floor.scale.y = 0.05;//+mathRandom(0.5);
                cube.scale.y = 0.1+Math.abs(mathRandom(8));
                //TweenMax.to(cube.scale, 1, {y:cube.rotationValue, repeat:-1, yoyo:true, delay:i*0.005, ease:Power1.easeInOut});
                /*cube.setScale = 0.1+Math.abs(mathRandom());
                
                TweenMax.to(cube.scale, 4, {y:cube.setScale, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});
                TweenMax.to(cube.position, 4, {y:cube.setScale / 2, ease:Elastic.easeInOut, delay:0.2*i, yoyo:true, repeat:-1});*/
                
                const cubeWidth = 0.9;
                cube.scale.x = cube.scale.z = cubeWidth+mathRandom(1-cubeWidth);
                //cube.position.y = cube.scale.y / 2;
                cube.position.x = Math.round(mathRandom());
                cube.position.z = Math.round(mathRandom());
                
                floor.position.set(cube.position.x, 0/*floor.scale.y / 2*/, cube.position.z)
                
                town.add(floor);
                town.add(cube);
            };
            //----------------------------------------------------------------- Particular
            
            const gmaterial = new THREE.MeshToonMaterial({color:0xFFFF00, side:THREE.DoubleSide});
            const gparticular = new THREE.CircleGeometry(0.01, 3);
            const aparticular = 5;
            
            for (let h = 1; h<300; h++) {
            const particular = new THREE.Mesh(gparticular, gmaterial);
            particular.position.set(mathRandom(aparticular), mathRandom(aparticular),mathRandom(aparticular));
            particular.rotation.set(mathRandom(),mathRandom(),mathRandom());
            smoke.add(particular);
            };
            
            const pmaterial = new THREE.MeshPhongMaterial({
            color:0x000000,
            side:THREE.DoubleSide,
            opacity:0.9,
            transparent:true});
            const pgeometry = new THREE.PlaneGeometry(60,60);
            const pelement = new THREE.Mesh(pgeometry, pmaterial);
            pelement.rotation.x = -90 * Math.PI / 180;
            pelement.position.y = -0.001;
            pelement.receiveShadow = true;
            city.add(pelement);
        };

        const gridHelper = new THREE.GridHelper( 60, 120, 0xFF0000, 0x000000);
        city.add( gridHelper );

        scene.add(city);

        const mouse = new THREE.Vector2();

        const onMouseMove = (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove, false);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
            city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;
            if (city.rotation.x < -0.05) city.rotation.x = -0.05;
            else if (city.rotation.x>1) city.rotation.x = 1;
            smoke.rotation.y += 0.01;
            smoke.rotation.x += 0.01;
            
            camera.lookAt(city.position);
            renderer.render(scene, camera);
        };

        //----------------------------------------------------------------- LINES world

        const createCars = function(cScale = 2, cPos = 20, cColor = 0xFFFF00) {
            const cMat = new THREE.MeshToonMaterial({color:cColor, side:THREE.DoubleSide});
            const cGeo = new THREE.BoxGeometry(1, cScale/40, cScale/40);
            const cElem = new THREE.Mesh(cGeo, cMat);
            const cAmp = 3;
            
            if (createCarPos) {
            createCarPos = false;
            cElem.position.x = -cPos;
            cElem.position.z = (mathRandom(cAmp));
        
            TweenMax.to(cElem.position, 3, {x:cPos, repeat:-1, yoyo:true, delay:mathRandom(3)});
            } else {
            createCarPos = true;
            cElem.position.x = (mathRandom(cAmp));
            cElem.position.z = -cPos;
            cElem.rotation.y = 90 * Math.PI / 180;
            
            TweenMax.to(cElem.position, 5, {z:cPos, repeat:-1, yoyo:true, delay:mathRandom(3), ease:Power1.easeInOut});
            };
            cElem.receiveShadow = true;
            cElem.castShadow = true;
            cElem.position.y = Math.abs(mathRandom(5));
            city.add(cElem);
        };
        
        const generateLines = () => {
            for (let i = 0; i < 60; i++) {
            createCars(0.1, 20);
            };
        };

        generateLines();
        init();
        animate();

        return () => {
            // mountRef.current.removeChild(renderer.domElement);
            // window.removeEventListener("resize", onResize);
        };
    }, []);

    return <div ref={mountRef} />;
};

export default ThreeScene;
