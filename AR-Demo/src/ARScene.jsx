import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ARScene = () => {
    const sceneRef = useRef(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const touchStartRef = useRef(null);
    const prevDistanceRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        sceneRef.current.appendChild(renderer.domElement);

        // Add AR button
        document.body.appendChild(ARButton.createButton(renderer));

        // Lighting
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // Cube
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, -0.5);
        scene.add(cube);

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.enableRotate = false; // We'll handle rotation manually

        // Raycaster for touch detection
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        // Function to check if the cube was touched
        const getIntersectedObject = (event) => {
            const { clientX, clientY } = event.touches ? event.touches[0] : event;
            pointer.x = (clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);

            const intersects = raycaster.intersectObject(cube);
            return intersects.length > 0 ? cube : null;
        };

        // Touch start
        const onTouchStart = (event) => {
            event.preventDefault();
            const object = getIntersectedObject(event);
            if (object) {
                setSelectedObject(object);
                touchStartRef.current = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                };
            }
        };

        // Touch move (rotate the cube)
        const onTouchMove = (event) => {
            if (!selectedObject) return;

            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            const deltaX = (touchX - touchStartRef.current.x) * 0.01;
            const deltaY = (touchY - touchStartRef.current.y) * 0.01;

            selectedObject.rotation.y += deltaX;
            selectedObject.rotation.x += deltaY;

            touchStartRef.current = { x: touchX, y: touchY };
        };

        // Touch end
        const onTouchEnd = () => {
            setSelectedObject(null);
        };

        // Handle pinch zoom
        const onPinchMove = (event) => {
            if (event.touches.length === 2) {
                const dx = event.touches[0].clientX - event.touches[1].clientX;
                const dy = event.touches[0].clientY - event.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (prevDistanceRef.current) {
                    const zoomFactor = (distance - prevDistanceRef.current) * 0.005;
                    camera.position.z -= zoomFactor;
                }

                prevDistanceRef.current = distance;
            }
        };

        const onPinchEnd = () => {
            prevDistanceRef.current = null;
        };

        // Attach event listeners
        renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false });
        renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
        renderer.domElement.addEventListener("touchend", onTouchEnd);
        renderer.domElement.addEventListener("touchmove", onPinchMove, { passive: false });
        renderer.domElement.addEventListener("touchend", onPinchEnd);

        // Render loop
        const animate = () => {
            renderer.setAnimationLoop(() => {
                controls.update();
                renderer.render(scene, camera);
            });
        };
        animate();

        return () => {
            renderer.domElement.removeEventListener("touchstart", onTouchStart);
            renderer.domElement.removeEventListener("touchmove", onTouchMove);
            renderer.domElement.removeEventListener("touchend", onTouchEnd);
            renderer.domElement.removeEventListener("touchmove", onPinchMove);
            renderer.domElement.removeEventListener("touchend", onPinchEnd);
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={sceneRef} />;
};

export default ARScene;
