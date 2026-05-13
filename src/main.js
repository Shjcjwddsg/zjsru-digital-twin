import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let raycaster, mouse;
let buildings = [];
let roads = [];
let vegetation = [];
let facilities = [];
let layers = {
    buildings: null,
    roads: null,
    vegetation: null,
    facilities: null,
    walls: null
};
let isNightMode = false;
let isAutoRotating = false;
let selectedObject = null;
let ambientLight, directionalLight;

// 浙江树人学院拱宸桥校区建筑数据 - 根据地图布局
const buildingData = [
    // 南校区建筑 (z < -20)
    { name: '南校区南门', position: [0, 0, -115], size: [10, 6, 2], color: 0xffd700, info: { desc: '南校区主入口', floors: '1层', area: '校门', built: '主校门' }, isGate: true },
    { name: '致和园1号楼', position: [-40, 0, -100], size: [12, 10, 10], color: 0x4a90e2, info: { desc: '学生宿舍', floors: '5层', area: '4000平方米', built: '2005年' } },
    { name: '致和园2号楼', position: [-20, 0, -100], size: [12, 10, 10], color: 0x4a90e2, info: { desc: '学生宿舍', floors: '5层', area: '4000平方米', built: '2005年' } },
    { name: 'A1教学楼', position: [-30, 0, -60], size: [18, 12, 12], color: 0x7cb342, info: { desc: '主要教学楼', floors: '6层', area: '8000平方米', built: '2003年' } },
    { name: 'A2教学楼', position: [-10, 0, -60], size: [18, 12, 12], color: 0x7cb342, info: { desc: '主要教学楼', floors: '6层', area: '8000平方米', built: '2003年' } },
    { name: 'A3教学楼', position: [10, 0, -60], size: [18, 12, 12], color: 0x7cb342, info: { desc: '主要教学楼', floors: '6层', area: '8000平方米', built: '2004年' } },
    { name: 'A4教学楼', position: [30, 0, -60], size: [18, 12, 12], color: 0x7cb342, info: { desc: '主要教学楼', floors: '6层', area: '8000平方米', built: '2004年' } },
    { name: '图书馆', position: [0, 0, -35], size: [25, 15, 15], color: 0x4a90e2, info: { desc: '学校标志性建筑，藏书丰富', floors: '5层', area: '12000平方米', built: '2005年' } },
    
    // 中间马路 - 舟山东路 (z = -15 到 5)
    
    // 北校区建筑 (z > 5)
    { name: '北校区南门', position: [0, 0, 5], size: [10, 6, 2], color: 0xffd700, info: { desc: '北校区入口', floors: '1层', area: '校门', built: '校门' }, isGate: true },
    { name: '树人之家', position: [-40, 0, 20], size: [15, 8, 12], color: 0xff9800, info: { desc: '餐饮服务中心', floors: '3层', area: '5000平方米', built: '2006年' } },
    { name: '校医院', position: [-55, 0, 30], size: [12, 6, 10], color: 0xe91e63, info: { desc: '校园医疗服务', floors: '2层', area: '2000平方米', built: '2002年' } },
    { name: '第二实验大楼', position: [-25, 0, 25], size: [16, 14, 12], color: 0x3f51b5, info: { desc: '实验教学中心', floors: '7层', area: '9000平方米', built: '2010年' } },
    { name: '行政楼', position: [0, 0, 20], size: [18, 12, 10], color: 0xe91e63, info: { desc: '学校行政管理中心', floors: '5层', area: '6000平方米', built: '2002年' } },
    { name: '创新创业学院', position: [25, 0, 20], size: [14, 10, 10], color: 0x00bcd4, info: { desc: '创新创业教育', floors: '5层', area: '4500平方米', built: '2015年' } },
    { name: '体育馆', position: [45, 0, 20], size: [25, 12, 20], color: 0x9c27b0, info: { desc: '综合体育场馆', floors: '2层', area: '15000平方米', built: '2012年' } },
    { name: '科研楼', position: [-35, 0, 50], size: [15, 14, 12], color: 0x3f51b5, info: { desc: '科学研究中心', floors: '7层', area: '8000平方米', built: '2014年' } },
    { name: '大学生活动中心', position: [-10, 0, 55], size: [18, 10, 14], color: 0x00bcd4, info: { desc: '学生社团活动中心', floors: '4层', area: '6000平方米', built: '2015年' } },
    { name: '北校区北门', position: [0, 0, 95], size: [10, 6, 2], color: 0xffd700, info: { desc: '北校区主入口', floors: '1层', area: '校门', built: '主校门' }, isGate: true },
    { name: '综合楼', position: [30, 0, 60], size: [16, 12, 12], color: 0x7cb342, info: { desc: '综合教学楼', floors: '6层', area: '7000平方米', built: '2008年' } },
    { name: '精宏楼', position: [50, 0, 50], size: [14, 10, 10], color: 0x607d8b, info: { desc: '教学实验楼', floors: '5层', area: '4000平方米', built: '2007年' } },
    { name: '清乐园', position: [60, 0, 80], size: [10, 8, 10], color: 0x4a90e2, info: { desc: '学生宿舍区', floors: '4层', area: '3000平方米', built: '2006年' } },
];

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 150, 400);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 初始视角：南校区南门，朝向校园内部
    camera.position.set(0, 50, -140);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 300;
    controls.target.set(0, 10, -60);  // 看向南校区中心

    setupLights();
    createGround();
    createWalls();
    createBuildings();
    createRoads();
    createVegetation();
    createFacilities();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);

    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2200);

    animate();
}

function setupLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x3d5c3d, 0.4);
    scene.add(hemisphereLight);
}

function createGround() {
    // 整个校园的大地面
    const groundGeometry = new THREE.PlaneGeometry(200, 250);
    const groundMaterial = new THREE.MeshLambertMaterial({
        color: 0x4a7c59,
        transparent: true,
        opacity: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 南校区地面（稍微不同的颜色）
    const southGroundGeometry = new THREE.PlaneGeometry(140, 100);
    const southGroundMaterial = new THREE.MeshLambertMaterial({
        color: 0x5a8c69
    });
    const southGround = new THREE.Mesh(southGroundGeometry, southGroundMaterial);
    southGround.rotation.x = -Math.PI / 2;
    southGround.position.set(0, 0.02, -70);
    southGround.receiveShadow = true;
    scene.add(southGround);

    // 北校区地面
    const northGroundGeometry = new THREE.PlaneGeometry(160, 110);
    const northGroundMaterial = new THREE.MeshLambertMaterial({
        color: 0x6a9c79
    });
    const northGround = new THREE.Mesh(northGroundGeometry, northGroundMaterial);
    northGround.rotation.x = -Math.PI / 2;
    northGround.position.set(0, 0.02, 55);
    northGround.receiveShadow = true;
    scene.add(northGround);
}

function createWalls() {
    layers.walls = new THREE.Group();
    const wallHeight = 4;
    const wallColor = 0x8b7355;
    const wallWidth = 1;
    
    const wallMaterial = new THREE.MeshLambertMaterial({ color: wallColor });
    
    // 南校区围墙
    // 南校区范围：x从-70到70，z从-120到-20
    createWallSegment(-70, wallHeight/2, -70, 1, wallHeight, 100, layers.walls, wallMaterial);  // 西墙
    createWallSegment(70, wallHeight/2, -70, 1, wallHeight, 100, layers.walls, wallMaterial);   // 东墙
    createWallSegment(0, wallHeight/2, -120, 140, wallHeight, 1, layers.walls, wallMaterial);  // 南墙（带门）
    createWallSegment(-35, wallHeight/2, -20, 70, wallHeight, 1, layers.walls, wallMaterial);  // 北墙（左）
    createWallSegment(35, wallHeight/2, -20, 70, wallHeight, 1, layers.walls, wallMaterial);   // 北墙（右）
    
    // 北校区围墙
    // 北校区范围：x从-80到80，z从10到110
    createWallSegment(-80, wallHeight/2, 60, 1, wallHeight, 100, layers.walls, wallMaterial); // 西墙
    createWallSegment(80, wallHeight/2, 60, 1, wallHeight, 100, layers.walls, wallMaterial);  // 东墙
    createWallSegment(-40, wallHeight/2, 10, 80, wallHeight, 1, layers.walls, wallMaterial);  // 南墙（左）
    createWallSegment(40, wallHeight/2, 10, 80, wallHeight, 1, layers.walls, wallMaterial);   // 南墙（右）
    createWallSegment(0, wallHeight/2, 110, 160, wallHeight, 1, layers.walls, wallMaterial); // 北墙（带门）
    
    scene.add(layers.walls);
}

function createWallSegment(x, y, z, width, height, depth, group, material) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
}

function createBuildings() {
    layers.buildings = new THREE.Group();
    
    buildingData.forEach((data, index) => {
        const buildingGroup = new THREE.Group();
        
        if (data.isGate) {
            // 创建校门
            createGate(buildingGroup, data);
        } else {
            // 创建普通建筑
            const geometry = new THREE.BoxGeometry(data.size[0], data.size[1], data.size[2]);
            const material = new THREE.MeshPhongMaterial({
                color: data.color,
                shininess: 30,
                flatShading: false
            });
            
            const building = new THREE.Mesh(geometry, material);
            building.position.set(data.position[0], data.size[1] / 2, data.position[2]);
            building.castShadow = true;
            building.receiveShadow = true;
            building.userData = {
                type: 'building',
                name: data.name,
                info: data.info,
                originalColor: data.color
            };
            
            buildingGroup.add(building);
            buildings.push(building);
            
            addWindows(buildingGroup, data.size, data.position);
            addRoof(buildingGroup, data.size, data.position);
        }
        
        layers.buildings.add(buildingGroup);
    });
    
    scene.add(layers.buildings);
}

function createGate(group, data) {
    // 校门柱子
    const pillarGeometry = new THREE.BoxGeometry(2, data.size[1], 2);
    const pillarMaterial = new THREE.MeshPhongMaterial({ color: data.color, shininess: 50 });
    
    const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    leftPillar.position.set(data.position[0] - 6, data.size[1]/2, data.position[2]);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    leftPillar.userData = {
        type: 'building',
        name: data.name,
        info: data.info,
        originalColor: data.color
    };
    
    const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    rightPillar.position.set(data.position[0] + 6, data.size[1]/2, data.position[2]);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    
    // 校门横梁
    const beamGeometry = new THREE.BoxGeometry(14, 1.5, 1);
    const beam = new THREE.Mesh(beamGeometry, pillarMaterial);
    beam.position.set(data.position[0], data.size[1], data.position[2]);
    beam.castShadow = true;
    
    group.add(leftPillar);
    group.add(rightPillar);
    group.add(beam);
    buildings.push(leftPillar);  // 主要交互对象
}

function addWindows(group, size, position) {
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xadd8e6,
        emissive: 0x1a237e,
        emissiveIntensity: 0.2,
        shininess: 100
    });

    const floors = Math.floor(size[1] / 3);
    const windowsPerFloor = Math.floor(size[0] / 3);

    for (let floor = 0; floor < floors; floor++) {
        for (let w = 0; w < windowsPerFloor; w++) {
            const windowGeom = new THREE.PlaneGeometry(1.5, 2);
            
            const windowFront = new THREE.Mesh(windowGeom, windowMaterial);
            windowFront.position.set(
                position[0] - size[0] / 2 + 2 + w * 3,
                2 + floor * 3,
                position[2] + size[2] / 2 + 0.1
            );
            group.add(windowFront);

            const windowBack = new THREE.Mesh(windowGeom, windowMaterial);
            windowBack.position.set(
                position[0] - size[0] / 2 + 2 + w * 3,
                2 + floor * 3,
                position[2] - size[2] / 2 - 0.1
            );
            windowBack.rotation.y = Math.PI;
            group.add(windowBack);
        }
    }
}

function addRoof(group, size, position) {
    const roofGeometry = new THREE.ConeGeometry(
        Math.max(size[0], size[2]) * 0.7,
        4,
        4
    );
    const roofMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b4513,
        shininess: 10
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(position[0], size[1] + 2, position[2]);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
}

function createRoads() {
    layers.roads = new THREE.Group();

    const roadMaterial = new THREE.MeshLambertMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.95
    });

    // 舟山东路 - 中间马路（隔开南北校区）
    const zhouShanRoad = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 25),
        roadMaterial
    );
    zhouShanRoad.rotation.x = -Math.PI / 2;
    zhouShanRoad.position.set(0, 0.02, -7.5);
    zhouShanRoad.receiveShadow = true;
    layers.roads.add(zhouShanRoad);

    // 南校区内部道路
    // 主干道 - 从南门到图书馆
    const southMainRoad = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 90),
        roadMaterial
    );
    southMainRoad.rotation.x = -Math.PI / 2;
    southMainRoad.position.set(0, 0.025, -75);
    southMainRoad.receiveShadow = true;
    layers.roads.add(southMainRoad);

    // 南校区横向道路
    const southCrossRoad1 = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 10),
        roadMaterial
    );
    southCrossRoad1.rotation.x = -Math.PI / 2;
    southCrossRoad1.position.set(0, 0.025, -50);
    southCrossRoad1.receiveShadow = true;
    layers.roads.add(southCrossRoad1);

    // 北校区内部道路
    // 主干道 - 从南门到北门
    const northMainRoad = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 105),
        roadMaterial
    );
    northMainRoad.rotation.x = -Math.PI / 2;
    northMainRoad.position.set(0, 0.025, 60);
    northMainRoad.receiveShadow = true;
    layers.roads.add(northMainRoad);

    // 北校区横向道路
    const northCrossRoad1 = new THREE.Mesh(
        new THREE.PlaneGeometry(120, 10),
        roadMaterial
    );
    northCrossRoad1.rotation.x = -Math.PI / 2;
    northCrossRoad1.position.set(0, 0.025, 35);
    northCrossRoad1.receiveShadow = true;
    layers.roads.add(northCrossRoad1);

    const northCrossRoad2 = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 10),
        roadMaterial
    );
    northCrossRoad2.rotation.x = -Math.PI / 2;
    northCrossRoad2.position.set(0, 0.025, 75);
    northCrossRoad2.receiveShadow = true;
    layers.roads.add(northCrossRoad2);

    addRoadMarkings(layers.roads);

    roads = layers.roads.children;
    scene.add(layers.roads);
}

function addRoadMarkings(roadGroup) {
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const yellowLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // 舟山东路中间黄线
    for (let x = -95; x <= 95; x += 10) {
        const line = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 0.3),
            yellowLineMaterial
        );
        line.rotation.x = -Math.PI / 2;
        line.position.set(x, 0.04, -7.5);
        roadGroup.add(line);
    }

    // 南校区主干道标线
    for (let z = -115; z <= -35; z += 8) {
        const line = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.2),
            lineMaterial
        );
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.04, z);
        roadGroup.add(line);
    }

    // 北校区主干道标线
    for (let z = 10; z <= 105; z += 8) {
        const line = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.2),
            lineMaterial
        );
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.04, z);
        roadGroup.add(line);
    }
}

function createVegetation() {
    layers.vegetation = new THREE.Group();

    // 南校区树木
    for (let x = -60; x <= 60; x += 15) {
        for (let z = -110; z <= -30; z += 15) {
            // 避开建筑物和道路
            if (!isNearBuilding(x, z, 20)) {
                const tree = createTree(x + (Math.random() - 0.5) * 5, z + (Math.random() - 0.5) * 5);
                layers.vegetation.add(tree);
                vegetation.push(tree);
            }
        }
    }

    // 北校区树木
    for (let x = -70; x <= 70; x += 15) {
        for (let z = 20; z <= 100; z += 15) {
            if (!isNearBuilding(x, z, 20)) {
                const tree = createTree(x + (Math.random() - 0.5) * 5, z + (Math.random() - 0.5) * 5);
                layers.vegetation.add(tree);
                vegetation.push(tree);
            }
        }
    }

    scene.add(layers.vegetation);
}

function isNearBuilding(x, z, distance) {
    for (const building of buildingData) {
        const dx = Math.abs(x - building.position[0]);
        const dz = Math.abs(z - building.position[2]);
        if (dx < distance && dz < distance) return true;
    }
    // 避开道路
    if (Math.abs(x) < 12) return true;  // 主干道
    if (Math.abs(z + 50) < 10) return true;  // 南校区横向路
    if (Math.abs(z - 35) < 10 || Math.abs(z - 75) < 10) return true;  // 北校区横向路
    return false;
}

function createTree(x, z) {
    const treeGroup = new THREE.Group();

    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.6, 4, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const foliageGeometry = new THREE.SphereGeometry(3, 8, 6);
    const foliageMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.7, 0.4)
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 6;
    foliage.castShadow = true;
    treeGroup.add(foliage);

    treeGroup.position.set(x, 0, z);
    return treeGroup;
}

function createBush(x, z) {
    const bushGroup = new THREE.Group();

    const bushGeometry = new THREE.SphereGeometry(1.5, 6, 6);
    const bushMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.28 + Math.random() * 0.08, 0.65, 0.35)
    });
    
    for (let i = 0; i < 3; i++) {
        const bushPart = new THREE.Mesh(bushGeometry, bushMaterial);
        bushPart.position.set(
            (Math.random() - 0.5) * 2,
            0.75,
            (Math.random() - 0.5) * 2
        );
        bushPart.scale.setScalar(0.6 + Math.random() * 0.4);
        bushPart.castShadow = true;
        bushGroup.add(bushPart);
    }

    bushGroup.position.set(x, 0, z);
    return bushGroup;
}

function createFacilities() {
    layers.facilities = new THREE.Group();

    // 南校区篮球场
    const basketballCourt1 = new THREE.Group();
    const courtGeometry = new THREE.PlaneGeometry(15, 12);
    const courtMaterial = new THREE.MeshLambertMaterial({ color: 0xc1440e });
    const court1 = new THREE.Mesh(courtGeometry, courtMaterial);
    court1.rotation.x = -Math.PI / 2;
    court1.position.y = 0.1;
    basketballCourt1.add(court1);

    const linesMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const centerLine1 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 12), linesMaterial);
    centerLine1.rotation.x = -Math.PI / 2;
    centerLine1.position.y = 0.11;
    basketballCourt1.add(centerLine1);

    basketballCourt1.position.set(55, 0, -80);
    basketballCourt1.userData = { type: 'facility', name: '南校区篮球场' };
    facilities.push(basketballCourt1);
    layers.facilities.add(basketballCourt1);

    // 北校区操场 - 足球场和跑道
    const stadiumGroup = new THREE.Group();
    
    const fieldGeometry = new THREE.PlaneGeometry(35, 22);
    const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.position.y = 0.1;
    field.receiveShadow = true;
    stadiumGroup.add(field);

    const trackGeometry = new THREE.RingGeometry(20, 23, 32);
    const trackMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xc1440e,
        side: THREE.DoubleSide
    });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.rotation.x = -Math.PI / 2;
    track.position.y = 0.11;
    stadiumGroup.add(track);

    const goalPostGeometry = new THREE.BoxGeometry(0.3, 3, 7);
    const goalPostMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    
    const goal1 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
    goal1.position.set(0, 1.5, 11);
    stadiumGroup.add(goal1);
    
    const goal2 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
    goal2.position.set(0, 1.5, -11);
    stadiumGroup.add(goal2);

    stadiumGroup.position.set(-55, 0, 70);
    stadiumGroup.userData = { type: 'facility', name: '北校区田径场' };
    facilities.push(stadiumGroup);
    layers.facilities.add(stadiumGroup);

    // 北校区篮球场
    const basketballCourt2 = new THREE.Group();
    const court2 = new THREE.Mesh(courtGeometry, courtMaterial);
    court2.rotation.x = -Math.PI / 2;
    court2.position.y = 0.1;
    basketballCourt2.add(court2);

    const centerLine2 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 12), linesMaterial);
    centerLine2.rotation.x = -Math.PI / 2;
    centerLine2.position.y = 0.11;
    basketballCourt2.add(centerLine2);

    basketballCourt2.position.set(65, 0, 40);
    basketballCourt2.userData = { type: 'facility', name: '北校区篮球场' };
    facilities.push(basketballCourt2);
    layers.facilities.add(basketballCourt2);

    scene.add(layers.facilities);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const allObjects = [...buildings, ...facilities];
    const intersects = raycaster.intersectObjects(allObjects, true);

    if (intersects.length > 0) {
        let object = intersects[0].object;
        
        while (object && !object.userData.name && object.parent) {
            object = object.parent;
        }

        if (object && object.userData.name) {
            selectObject(object);
        }
    } else {
        deselectObject();
    }
}

function selectObject(object) {
    if (selectedObject) {
        resetObjectColor(selectedObject);
    }

    selectedObject = object;
    
    if (object.userData.type === 'building') {
        object.material.emissive.setHex(0x444444);
        object.material.emissiveIntensity = 0.5;
    }

    showInfoPanel(object.userData);
}

function deselectObject() {
    if (selectedObject) {
        resetObjectColor(selectedObject);
        selectedObject = null;
    }
    closeInfoPanel();
}

function resetObjectColor(object) {
    if (object.userData.type === 'building') {
        object.material.emissive.setHex(0x000000);
        object.material.emissiveIntensity = 0;
    }
}

function showInfoPanel(userData) {
    const panel = document.getElementById('info-panel');
    const nameEl = document.getElementById('building-name');
    const infoEl = document.getElementById('building-info');

    nameEl.textContent = userData.name;

    let html = '';
    if (userData.info) {
        html += `<p><strong>简介：</strong>${userData.info.desc}</p>`;
        html += `<p><strong>层数：</strong>${userData.info.floors}</p>`;
        html += `<p><strong>面积：</strong>${userData.info.area}</p>`;
        html += `<p><strong>建成时间：</strong>${userData.info.built}</p>`;
    }
    
    if (userData.type === 'facility') {
        html += `<p><strong>类型：</strong>体育设施</p>`;
        html += `<p><strong>功能：</strong>${userData.name === '标准足球场' ? '体育教学、比赛训练、大型活动' : '篮球教学、课外活动'}</p>`;
    }

    infoEl.innerHTML = html;
    panel.style.display = 'block';
}

function closeInfoPanel() {
    document.getElementById('info-panel').style.display = 'none';
}

window.setView = function(viewType) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');

    const duration = 1000;
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    let endPos, endTarget;

    switch(viewType) {
        case 'perspective':
            // 默认视角：校园全景
            endPos = new THREE.Vector3(100, 80, -20);
            endTarget = new THREE.Vector3(0, 10, -10);
            break;
        case 'birdseye':
            // 鸟瞰视角
            endPos = new THREE.Vector3(0, 200, -10);
            endTarget = new THREE.Vector3(0, 0, -10);
            break;
        case 'south':
            // 南校区视角
            endPos = new THREE.Vector3(60, 50, -100);
            endTarget = new THREE.Vector3(0, 10, -60);
            break;
        case 'north':
            // 北校区视角
            endPos = new THREE.Vector3(-60, 60, 100);
            endTarget = new THREE.Vector3(0, 15, 50);
            break;
    }

    animateCamera(startPos, endPos, startTarget, endTarget, duration);
};

function animateCamera(startPos, endPos, startTarget, endTarget, duration) {
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        camera.position.lerpVectors(startPos, endPos, easeProgress);
        controls.target.lerpVectors(startTarget, endTarget, easeProgress);
        controls.update();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

window.toggleLayer = function(layerName) {
    if (layers[layerName]) {
        layers[layerName].visible = !layers[layerName].visible;
    }
};

window.toggleDayNight = function() {
    isNightMode = !isNightMode;

    if (isNightMode) {
        scene.background = new THREE.Color(0x0a1628);
        scene.fog = new THREE.Fog(0x0a1628, 80, 250);
        ambientLight.intensity = 0.15;
        directionalLight.intensity = 0.2;
        directionalLight.color.setHex(0x8888ff);

        buildings.forEach(building => {
            if (building.userData.type === 'building') {
                building.material.emissive.setHex(0xffaa00);
                building.material.emissiveIntensity = 0.3;
            }
        });
    } else {
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog = new THREE.Fog(0x87ceeb, 100, 300);
        ambientLight.intensity = 0.6;
        directionalLight.intensity = 0.8;
        directionalLight.color.setHex(0xffffff);

        buildings.forEach(building => {
            if (building !== selectedObject) {
                building.material.emissive.setHex(0x000000);
                building.material.emissiveIntensity = 0;
            }
        });
    }
};

window.toggleAutoRotate = function() {
    isAutoRotating = !isAutoRotating;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.0;
};

window.resetCamera = function() {
    setView('perspective');
};

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();

    if (isNightMode) {
        const time = Date.now() * 0.001;
        buildings.forEach((building, index) => {
            if (building.userData.type === 'building') {
                const flicker = Math.sin(time * 2 + index) * 0.1 + 0.3;
                building.material.emissiveIntensity = flicker;
            }
        });
    }

    renderer.render(scene, camera);
}

init();
