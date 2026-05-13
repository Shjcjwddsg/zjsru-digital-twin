let scene, camera, renderer, controls;
let buildings = [];
let roads = [];
let vegetation = [];
let walls = [];
let raycaster, mouse;
let selectedObject = null;
let isAutoRotating = false;

let skyBox;
let ambientLight, directionalLight, hemisphereLight;
let currentTimeOfDay = 'day';
let currentWeather = 'sunny';
let rainParticles = [];
let snowParticles = [];

const CAMPUS_DATA = {
    south: {
        name: '南校区',
        bounds: { minX: -100, maxX: 100, minZ: -130, maxZ: 10 },
        buildings: [
            {
                id: 'library',
                name: '图书馆',
                type: 'library',
                position: { x: 0, y: 0, z: -30 },
                size: { width: 38, height: 18, depth: 28 },
                color: 0x8B7355,
                info: '浙江树人学院拱宸桥校区图书馆，藏书丰富，是学生学习和研究的重要场所。馆内设有阅览室、自习室、电子资源区等现代化设施。'
            },
            {
                id: 'shuren_litang',
                name: '树人礼堂',
                type: 'service',
                position: { x: -38, y: 0, z: -22 },
                size: { width: 20, height: 7, depth: 15 },
                color: 0xC4A77D,
                info: '树人礼堂是学校举办各类大型活动和会议的重要场所。'
            },
            {
                id: 'lab_12',
                name: '12号楼(第一实验大楼)',
                type: 'teaching',
                position: { x: 30, y: 0, z: -30 },
                size: { width: 10, height: 16, depth: 5 },
                color: 0x8BA4B4,
                info: '12号楼是第一实验大楼，配备各类专业实验设备。'
            },
            {
                id: 'lab_16',
                name: '16号楼',
                type: 'teaching',
                position: { x: 30, y: 0, z: -40 },
                size: { width: 10, height: 14, depth: 5 },
                color: 0x8BA4B4,
                info: '16号楼是实验大楼之一。'
            },
            {
                id: 'lab_13',
                name: '13号楼(第三实验大楼)',
                type: 'teaching',
                position: { x: -45, y: 0, z: -35 },
                size: { width: 12, height: 14, depth: 9 },
                color: 0x8BA4B4,
                info: '13号楼是第三实验大楼，主要用于理工科实验教学。'
            },
            {
                id: 'basketball_1',
                name: '篮球场1',
                type: 'sports',
                position: { x: 30, y: 0, z: -50 },
                size: { width: 10, height: 0.3, depth: 18 },
                color: 0xFF6B6B,
                info: '标准篮球场，供师生进行体育活动。'
            },
            {
                id: 'basketball_2',
                name: '篮球场2',
                type: 'sports',
                position: { x: -42, y: 0.1, z: -52 },
                size: { width: 10, height: 0.3, depth: 18 },
                color: 0xFF6B6B,
                info: '标准篮球场，供师生进行体育活动。'
            },
            {
                id: 'basketball_3',
                name: '篮球场3',
                type: 'sports',
                position: { x: -28, y: 0.1, z: -52 },
                size: { width: 10, height: 0.3, depth: 18 },
                color: 0xFF6B6B,
                info: '标准篮球场，供师生进行体育活动。'
            },
            {
                id: 'lab_14',
                name: '14号楼(生物与环境工程学院)',
                type: 'teaching',
                position: { x: 22, y: 0, z: -12 },
                size: { width: 20, height: 14, depth: 16 },
                color: 0x8BA4B4,
                info: '14号楼是生物与环境工程学院所在地。'
            },
            {
                id: 'lab_20',
                name: '20号楼(第二实验大楼)',
                type: 'teaching',
                position: { x: 52, y: 0, z: -15 },
                size: { width: 18, height: 13, depth: 15 },
                color: 0x8BA4B4,
                info: '20号楼是第二实验大楼，支持实践教学和科研项目。'
            },
            {
                id: 'admin_center',
                name: '行政楼',
                type: 'admin',
                position: { x: 55, y: 0, z: -32 },
                size: { width: 16, height: 10, depth: 14 },
                color: 0x7A8B8B,
                info: '行政楼是学校行政办公中心，设有各职能部门办公室。'
            },
            {
                id: 'dorm_shuren',
                name: '树人之家',
                type: 'dormitory',
                position: { x: -78, y: 0, z: -20 },
                size: { width: 16, height: 18, depth: 10 },
                color: 0xD4C4A8,
                info: '树人之家是学生宿舍区，设施齐全。'
            },
            {
                id: 'dorm_18',
                name: '18号楼',
                type: 'dormitory',
                position: { x: -78, y: 0, z: -40 },
                size: { width: 16, height: 16, depth: 10 },
                color: 0xC9B99A,
                info: '18号楼是学生宿舍楼。'
            },
            {
                id: 'dorm_17',
                name: '17号楼',
                type: 'dormitory',
                position: { x: -62, y: 0, z: -45 },
                size: { width: 14, height: 14, depth: 9 },
                color: 0xC9B99A,
                info: '17号楼是学生宿舍楼。'
            },
            {
                id: 'a1_building',
                name: 'A1教学楼',
                type: 'teaching',
                position: { x: 28, y: 0, z: -95 },
                size: { width: 22, height: 14, depth: 16 },
                color: 0x9CAFB7,
                info: 'A1教学楼主要承担基础课程教学任务，配备多媒体教室和实验室。'
            },
            {
                id: 'a2_building',
                name: 'A2教学楼',
                type: 'teaching',
                position: { x: -28, y: 0, z: -95 },
                size: { width: 22, height: 14, depth: 16 },
                color: 0x9CAFB7,
                info: 'A2教学楼用于专业课程教学，设施先进。'
            },
            {
                id: 'a3_building',
                name: 'A3教学楼',
                type: 'teaching',
                position: { x: 28, y: 0, z: -78 },
                size: { width: 22, height: 14, depth: 16 },
                color: 0x9CAFB7,
                info: 'A3教学楼设有计算机房和语言实验室。'
            },
            {
                id: 'a4_building',
                name: 'A4教学楼',
                type: 'teaching',
                position: { x: -28, y: 0, z: -78 },
                size: { width: 22, height: 14, depth: 16 },
                color: 0x9CAFB7,
                info: 'A4教学楼主要用于艺术类和设计类课程教学。'
            },
            {
                id: 'b1_building',
                name: 'B1教学楼',
                type: 'teaching_b',
                position: { x: 28, y: 0, z: -60 },
                size: { width: 24, height: 16, depth: 14 },
                color: 0x7B9AAB,
                info: 'B1教学楼是教学主楼之一，承担重要的教学任务。'
            },
            {
                id: 'b2_building',
                name: 'B2教学楼',
                type: 'teaching_b',
                position: { x: -28, y: 0, z: -60 },
                size: { width: 24, height: 16, depth: 14 },
                color: 0x7B9AAB,
                info: 'B2教学楼是教学主楼之一，配备现代化教学设施。'
            },
            {
                id: 'lawn_center',
                name: '中心草坪',
                type: 'green',
                position: { x: 0, y: 0, z: -80 },
                size: { width: 40, height: 0.5, depth: 35 },
                color: 0x4A7C3F,
                info: '教学楼之间的中心草坪，是学生休息和交流的场所。'
            },
            {
                id: 'lawn_east',
                name: '东侧草坪',
                type: 'green',
                position: { x: 0, y: 0, z: -68 },
                size: { width: 35, height: 0.5, depth: 12 },
                color: 0x5A8C4F,
                info: '教学楼东侧的绿化草坪区域。'
            },
        ]
    },

    north: {
        name: '北校区',
        bounds: { minX: -100, maxX: 100, minZ: -5, maxZ: 110 },
        buildings: [
            {
                id: 'qingleyuan',
                name: '清乐园',
                type: 'service',
                position: { x: -70, y: 0, z: 20 },
                size: { width: 28, height: 10, depth: 20 },
                color: 0xC4A77D,
                info: '清乐园位于北校区西侧，是师生休闲娱乐的重要场所。'
            },
            {
                id: 'canteen',
                name: '学生食堂',
                type: 'service',
                position: { x: -60, y: 0, z: 45 },
                size: { width: 30, height: 8, depth: 20 },
                color: 0xD4A574,
                info: '学生食堂提供丰富多样的餐饮选择。'
            },
            {
                id: 'zonghe_a',
                name: '综合楼A',
                type: 'admin',
                position: { x: 55, y: 0, z: 85 },
                size: { width: 24, height: 22, depth: 18 },
                color: 0x7A8B8B,
                info: '综合楼A是学校的综合性大楼，集办公、教学于一体。'
            },
            {
                id: 'gymnasium',
                name: '体育馆',
                type: 'sports',
                position: { x: 35, y: 0, z: 35 },
                size: { width: 35, height: 12, depth: 28 },
                color: 0x8FA4A4,
                info: '体育馆设施完善，包括篮球场、羽毛球场、健身房等。'
            },
            {
                id: 'playground',
                name: '田径场',
                type: 'sports',
                position: { x: 60, y: 0.1, z: 55 },
                size: { width: 45, height: 0.5, depth: 35 },
                color: 0xCC0000,
                info: '标准400米塑胶跑道运动场，内设足球场。'
            },
            {
                id: 'student_activity',
                name: '大学生活动中心',
                type: 'service',
                position: { x: 45, y: 0, z: 25 },
                size: { width: 20, height: 10, depth: 16 },
                color: 0xC4A77D,
                info: '大学生活动中心是学生社团活动的主要场所。'
            },
            {
                id: 'library_north',
                name: '图信楼',
                type: 'library',
                position: { x: 35, y: 0, z: 15 },
                size: { width: 22, height: 14, depth: 18 },
                color: 0x8B7355,
                info: '图信楼是北校区的图书信息中心。'
            },
            {
                id: 'research_1',
                name: '交叉科学研究院',
                type: 'teaching',
                position: { x: 15, y: 0, z: 25 },
                size: { width: 18, height: 12, depth: 14 },
                color: 0x8BA4B4,
                info: '交叉科学研究院致力于跨学科研究。'
            },
            {
                id: 'research_2',
                name: '生物与环境研究所',
                type: 'teaching',
                position: { x: -15, y: 0, z: 25 },
                size: { width: 18, height: 12, depth: 14 },
                color: 0x8BA4B4,
                info: '生物与环境研究所开展相关领域科研工作。'
            },
            {
                id: 'research_3',
                name: '结构工程实验楼',
                type: 'teaching',
                position: { x: 70, y: 0, z: 40 },
                size: { width: 18, height: 10, depth: 14 },
                color: 0x8BA4B4,
                info: '结构工程实验楼配备专业实验设备。'
            },
            {
                id: 'creative_center',
                name: '创业园',
                type: 'service',
                position: { x: -30, y: 0, z: 25 },
                size: { width: 24, height: 8, depth: 16 },
                color: 0xC4A77D,
                info: '创业园为学生提供创新创业平台。'
            },
            {
                id: 'meishi_cheng',
                name: '美尔美商城',
                type: 'service',
                position: { x: -45, y: 0, z: 15 },
                size: { width: 18, height: 6, depth: 14 },
                color: 0xD4A574,
                info: '美尔美商城提供各类生活服务。'
            },
            {
                id: 'dorm_26',
                name: '26号楼',
                type: 'dormitory',
                position: { x: 70, y: 0, z: 25 },
                size: { width: 18, height: 18, depth: 12 },
                color: 0xD4C4A8,
                info: '26号楼是学生宿舍楼。'
            },
            {
                id: 'yishuguan',
                name: '艺术馆',
                type: 'service',
                position: { x: 80, y: 0, z: 38 },
                size: { width: 16, height: 8, depth: 12 },
                color: 0xB8A99A,
                info: '艺术馆用于艺术类课程教学和展览。'
            },
            {
                id: 'dorm_2',
                name: '2号楼',
                type: 'dormitory',
                position: { x: 45, y: 0, z: 60 },
                size: { width: 16, height: 16, depth: 12 },
                color: 0xC9B99A,
                info: '2号楼是学生宿舍楼。'
            },
            {
                id: 'dorm_3',
                name: '3号楼',
                type: 'dormitory',
                position: { x: 55, y: 0, z: 60 },
                size: { width: 16, height: 16, depth: 12 },
                color: 0xC9B99A,
                info: '3号楼是学生宿舍楼。'
            },
            {
                id: 'dorm_4',
                name: '4号楼',
                type: 'dormitory',
                position: { x: 65, y: 0, z: 60 },
                size: { width: 16, height: 16, depth: 12 },
                color: 0xC9B99A,
                info: '4号楼是学生宿舍楼。'
            },
            {
                id: 'dorm_5',
                name: '5号楼',
                type: 'dormitory',
                position: { x: 75, y: 0, z: 60 },
                size: { width: 16, height: 16, depth: 12 },
                color: 0xC9B99A,
                info: '5号楼是学生宿舍楼。'
            },
            {
                id: 'dorm_6',
                name: '6号楼',
                type: 'dormitory',
                position: { x: 82, y: 0, z: 60 },
                size: { width: 14, height: 14, depth: 10 },
                color: 0xD4C4A8,
                info: '6号楼是学生宿舍楼。'
            },
            {
                id: 'dorm_7',
                name: '7号楼',
                type: 'dormitory',
                position: { x: 50, y: 0, z: 75 },
                size: { width: 16, height: 14, depth: 10 },
                color: 0xD4C4A8,
                info: '7号楼是学生宿舍楼。'
            }
        ]
    }
};

let gltfLoader;

const NAME_MAPPING = {
    'tsg': {
        name: '浙江树人学院图书馆',
        comment: '藏书丰富，是学生学习和研究的重要场所'
    },
    'srlt': {
        name: '树人礼堂',
        comment: '学校举办各类大型活动和会议的重要场所'
    },
    'srzj': {
        name: '树人之家',
        comment: '创业园区'
    },
    'jggcsyl': {
        name: '结构工程实验楼',
        comment: '配备专业实验设备，用于工程实践教学'
    },
    'msg': {
        name: '美术馆',
        comment: '用于艺术类课程教学和作品展览'
    },
    'dysydl': {
        name: '第一实验大楼',
        comment: '配备各类专业实验设备，支持多学科实验'
    },
    'desydl': {
        name: '第二实验大楼',
        comment: '支持实践教学和科研项目'
    },
    'dssydl': {
        name: '第三实验大楼',
        comment: '主要用于理工科实验教学'
    },
    'xzl': {
        name: '行政楼',
        comment: '学校行政办公中心，各职能部门所在地'
    },
    'zjmdl': {
        name: '查济民大楼',
        comment: '重要的教学科研大楼'
    },
    'qcy': {
        name: '清乐园',
        comment: '学生宿舍'
    },
    'jxkxyjy': {
        name: '交叉科学研究院',
        comment: '致力于跨学科研究和创新'
    },
    'hyxy': {
        name: '行业学院',
        comment: '产教融合，培养应用型人才'
    },
    'dsg': {
        name: '雕塑馆',
        comment: '展示雕塑艺术作品的艺术空间'
    },
    'tjc': {
        name: '田径场',
        comment: '标准400米塑胶跑道，内设足球场'
    },
    'tyg': {
        name: '体育馆',
        comment: '设施完善，包括篮球场、羽毛球场等'
    },
    'zqd': {
        name: '致勤东',
        comment: '宿舍楼'
    },
    'zqx': {
        name: '致勤西',
        comment: '宿舍楼'
    },
    'zhl': {
        name: '综合楼',
        comment: '宿舍楼'
    },
    'xm': {
        name: '校门',
        comment: '学校的标志性建筑，师生进出的主要通道'
    },
    'bxqnm': {
        name: '北校区南门',
        comment: '北校区的主要出入口之一'
    }
};

function applyNameMapping(id) {
    if (NAME_MAPPING[id]) {
        return NAME_MAPPING[id].name;
    }
    return id;
}

function getCommentMapping(id) {
    if (NAME_MAPPING[id]) {
        return NAME_MAPPING[id].comment;
    }
    return '';
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 150, 350);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 40, -130);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    gltfLoader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 30;
    controls.maxDistance = 300;
    controls.target.set(0, 10, -50);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    createSkyBox();
    setupLights();
    createGround();
    createCampusBuildings();
    createRoads();
    createWalls();
    createVegetation();
    createMiddleRoad();
    createWeatherParticles();

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);

    animate();

    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);

        setView('southgate');
    }, 1500);
}

function setupLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 150, 80);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    scene.add(directionalLight);

    hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x3D5C3D, 0.4);
    scene.add(hemisphereLight);
}

function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(400, 400);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x7CBA5F });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);
}

function createBuilding(data) {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry(data.size.width, data.size.height, data.size.depth);
    const material = new THREE.MeshLambertMaterial({ 
        color: data.color,
        transparent: true,
        opacity: 0.95
    });

    const building = new THREE.Mesh(geometry, material);
    building.position.set(
        data.position.x,
        data.size.height / 2,
        data.position.z
    );
    building.castShadow = true;
    building.receiveShadow = true;
    const comment = getCommentMapping(data.id);
    building.userData = {
        id: data.id,
        name: applyNameMapping(data.id),
        type: data.type,
        info: comment || data.info,
        campus: data.campus
    };

    group.add(building);

    if (data.type === 'library') {
        createLibraryRoof(group, data);
    } else if (data.type === 'dormitory') {
        createDormitoryRoof(group, data);
    } else if (data.type === 'teaching') {
        createTeachingRoof(group, data);
    } else if (data.type === 'teaching_b') {
        createTeachingBRoof(group, data);
    } else {
        createStandardRoof(group, data);
    }

    if (data.type === 'dormitory') {
        createDormitoryWindows(group, data);
    } else if (data.type === 'library') {
        createLibraryWindows(group, data);
    } else {
        createStandardWindows(group, data);
    }

    return group;
}

function createStandardRoof(group, data) {
    if (data.size.height <= 5) return;
    const roofGeometry = new THREE.BoxGeometry(
        data.size.width + 1,
        1,
        data.size.depth + 1
    );
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(data.position.x, data.size.height + 0.5, data.position.z);
    roof.castShadow = true;
    group.add(roof);
}

function createTeachingRoof(group, data) {
    const roofGeometry = new THREE.ConeGeometry(data.size.width / 2.5, 3, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(data.position.x, data.size.height + 1.5, data.position.z);
    roof.castShadow = true;
    group.add(roof);
}

function createTeachingBRoof(group, data) {
    const roofGeometry = new THREE.BoxGeometry(data.size.width + 2, 2.5, data.size.depth + 2);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x5C4033 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(data.position.x, data.size.height + 1.25, data.position.z);
    roof.castShadow = true;
    group.add(roof);

    const towerGeometry = new THREE.CylinderGeometry(2, 2.5, 5, 6);
    const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x4A3728 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(data.position.x, data.size.height + 4, data.position.z);
    tower.castShadow = true;
    group.add(tower);

    const towerTopGeometry = new THREE.ConeGeometry(3, 2, 6);
    const towerTopMaterial = new THREE.MeshLambertMaterial({ color: 0x3D2914 });
    const towerTop = new THREE.Mesh(towerTopGeometry, towerTopMaterial);
    towerTop.position.set(data.position.x, data.size.height + 7.5, data.position.z);
    towerTop.castShadow = true;
    group.add(towerTop);
}

function createDormitoryRoof(group, data) {
    const roofGeometry = new THREE.BoxGeometry(
        data.size.width + 2,
        2,
        data.size.depth + 2
    );
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x708090 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(data.position.x, data.size.height + 1, data.position.z);
    roof.castShadow = true;
    group.add(roof);

    const roofEdgeGeometry = new THREE.BoxGeometry(data.size.width + 2.5, 0.3, 0.3);
    const edgeMaterial = new THREE.MeshLambertMaterial({ color: 0x505050 });
    const edge1 = new THREE.Mesh(roofEdgeGeometry, edgeMaterial);
    edge1.position.set(data.position.x, data.size.height + 2.15, data.position.z + data.size.depth / 2 + 1);
    group.add(edge1);
    const edge2 = new THREE.Mesh(roofEdgeGeometry, edgeMaterial);
    edge2.position.set(data.position.x, data.size.height + 2.15, data.position.z - data.size.depth / 2 - 1);
    group.add(edge2);
}

function createLibraryRoof(group, data) {
    const mainRoofGeometry = new THREE.BoxGeometry(data.size.width + 2, 1.5, data.size.depth + 2);
    const mainRoofMaterial = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
    const mainRoof = new THREE.Mesh(mainRoofGeometry, mainRoofMaterial);
    mainRoof.position.set(data.position.x, data.size.height + 0.75, data.position.z);
    mainRoof.castShadow = true;
    group.add(mainRoof);

    const towerGeometry = new THREE.CylinderGeometry(3, 4, 6, 8);
    const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x6D4C41 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(data.position.x, data.size.height + 5, data.position.z);
    tower.castShadow = true;
    group.add(tower);

    const towerTopGeometry = new THREE.ConeGeometry(2.5, 3, 8);
    const towerTopMaterial = new THREE.MeshLambertMaterial({ color: 0x4E342E });
    const towerTop = new THREE.Mesh(towerTopGeometry, towerTopMaterial);
    towerTop.position.set(data.position.x, data.size.height + 9.5, data.position.z);
    towerTop.castShadow = true;
    group.add(towerTop);
}

function createStandardWindows(group, data) {
    const windowRows = Math.floor(data.size.height / 4);
    const windowCols = Math.floor(data.size.width / 5);
    
    for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
            const windowGeometry = new THREE.PlaneGeometry(2, 2.5);
            const windowMaterial = new THREE.MeshBasicMaterial({
                color: 0xAADDFF,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });

            const windowFront = new THREE.Mesh(windowGeometry, windowMaterial);
            windowFront.position.set(
                data.position.x - data.size.width / 2 + 2.5 + col * 5,
                2 + row * 4,
                data.position.z + data.size.depth / 2 + 0.1
            );
            group.add(windowFront);

            const windowBack = new THREE.Mesh(windowGeometry, windowMaterial);
            windowBack.position.set(
                data.position.x - data.size.width / 2 + 2.5 + col * 5,
                2 + row * 4,
                data.position.z - data.size.depth / 2 - 0.1
            );
            group.add(windowBack);

            const windowLeft = new THREE.Mesh(windowGeometry, windowMaterial);
            windowLeft.position.set(
                data.position.x - data.size.width / 2 - 0.1,
                2 + row * 4,
                data.position.z - data.size.depth / 2 + 2.5 + col * 5
            );
            windowLeft.rotation.y = Math.PI / 2;
            group.add(windowLeft);

            const windowRight = new THREE.Mesh(windowGeometry, windowMaterial);
            windowRight.position.set(
                data.position.x + data.size.width / 2 + 0.1,
                2 + row * 4,
                data.position.z - data.size.depth / 2 + 2.5 + col * 5
            );
            windowRight.rotation.y = -Math.PI / 2;
            group.add(windowRight);
        }
    }
}

function createDormitoryWindows(group, data) {
    const windowRows = Math.floor(data.size.height / 3);
    const windowCols = Math.floor(data.size.width / 4);
    
    for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
            const windowGeometry = new THREE.PlaneGeometry(1.5, 2);
            const windowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFE4B5,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });

            const windowFront = new THREE.Mesh(windowGeometry, windowMaterial);
            windowFront.position.set(
                data.position.x - data.size.width / 2 + 2 + col * 4,
                1.5 + row * 3,
                data.position.z + data.size.depth / 2 + 0.05
            );
            group.add(windowFront);

            const windowBack = new THREE.Mesh(windowGeometry, windowMaterial);
            windowBack.position.set(
                data.position.x - data.size.width / 2 + 2 + col * 4,
                1.5 + row * 3,
                data.position.z - data.size.depth / 2 - 0.05
            );
            group.add(windowBack);
        }
    }
}

function createLibraryWindows(group, data) {
    const windowRows = Math.floor(data.size.height / 5);
    const windowCols = Math.floor(data.size.width / 6);
    
    for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
            const windowGeometry = new THREE.PlaneGeometry(2.5, 3);
            const windowMaterial = new THREE.MeshBasicMaterial({
                color: 0xE0F4FF,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });

            const windowFront = new THREE.Mesh(windowGeometry, windowMaterial);
            windowFront.position.set(
                data.position.x - data.size.width / 2 + 3 + col * 6,
                2.5 + row * 5,
                data.position.z + data.size.depth / 2 + 0.1
            );
            group.add(windowFront);

            const windowBack = new THREE.Mesh(windowGeometry, windowMaterial);
            windowBack.position.set(
                data.position.x - data.size.width / 2 + 3 + col * 6,
                2.5 + row * 5,
                data.position.z - data.size.depth / 2 - 0.1
            );
            group.add(windowBack);
        }
    }

    const cornerWindowGeometry = new THREE.PlaneGeometry(3, 4);
    const cornerWindowMaterial = new THREE.MeshBasicMaterial({
        color: 0xC0E6FF,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    
    const cornerWindow1 = new THREE.Mesh(cornerWindowGeometry, cornerWindowMaterial);
    cornerWindow1.position.set(
        data.position.x + data.size.width / 2 + 0.1,
        data.size.height / 2,
        data.position.z
    );
    cornerWindow1.rotation.y = -Math.PI / 4;
    group.add(cornerWindow1);
}

function createCampusBuildings() {
    loadCampusGLB();
}

function createRoads() {
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });

    const mainRoadH = new THREE.BoxGeometry(180, 0.2, 6);
    const mainRoadHM = new THREE.Mesh(mainRoadH, roadMaterial);
    mainRoadHM.position.set(0, 0.05, 0);
    mainRoadHM.receiveShadow = true;
    roads.push(mainRoadHM);
    scene.add(mainRoadHM);

    const lineGeometry = new THREE.BoxGeometry(175, 0.22, 0.3);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
    centerLine.position.set(0, 0.11, 0);
    roads.push(centerLine);
    scene.add(centerLine);

    const southVerticalRoad = new THREE.BoxGeometry(5, 0.2, 90);
    const southVRM = new THREE.Mesh(southVerticalRoad, roadMaterial);
    southVRM.position.set(0, 0.05, -55);
    southVRM.receiveShadow = true;
    roads.push(southVRM);
    scene.add(southVRM);

    const northVerticalRoad = new THREE.BoxGeometry(5, 0.2, 85);
    const northVRM = new THREE.Mesh(northVerticalRoad, roadMaterial);
    northVRM.position.set(0, 0.05, 57);
    northVRM.receiveShadow = true;
    roads.push(northVRM);
    scene.add(northVRM);

    [-40, 40].forEach(x => {
        const crossRoad = new THREE.BoxGeometry(4, 0.2, 70);
        const crossRM = new THREE.Mesh(crossRoad, roadMaterial);
        crossRM.position.set(x, 0.05, -55);
        crossRM.receiveShadow = true;
        roads.push(crossRM);
        scene.add(crossRM);
    });
}

function createMiddleRoad() {
    const middleRoadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const middleRoad = new THREE.BoxGeometry(200, 0.3, 10);
    const middleRoadMesh = new THREE.Mesh(middleRoad, middleRoadMaterial);
    middleRoadMesh.position.set(0, 0.05, 0);
    middleRoadMesh.receiveShadow = true;
    roads.push(middleRoadMesh);
    scene.add(middleRoadMesh);

    for (let i = -4; i <= 4; i++) {
        const laneLine = new THREE.BoxGeometry(190, 0.32, 0.2);
        const laneMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const laneMesh = new THREE.Mesh(laneLine, laneMaterial);
        laneMesh.position.set(i * 10, 0.16, 0);
        roads.push(laneMesh);
        scene.add(laneMesh);
    }
}

function createWalls() {
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });

    const southWall = createWallSegment(228, 6, -131);
    walls.push(southWall);
    scene.add(southWall);

    const northWall = createWallSegment(228, 6, 132);
    walls.push(northWall);
    scene.add(northWall);

    const westWallSouth = createWallSegmentVertical(6, -116, -126, -5);
    walls.push(westWallSouth);
    scene.add(westWallSouth);

    const westWallNorth = createWallSegmentVertical(6, -116, 5, 127);
    walls.push(westWallNorth);
    scene.add(westWallNorth);

    const eastWallSouth = createWallSegmentVertical(6, 116, -126, -5);
    walls.push(eastWallSouth);
    scene.add(eastWallSouth);

    const eastWallNorth = createWallSegmentVertical(6, 116, 5, 127);
    walls.push(eastWallNorth);
    scene.add(eastWallNorth);

    createGate(-115, -131, 'south');
    createGate(0, -131, 'south_main');
    createGate(115, -131, 'south');

    createGate(-115, 132, 'north');
    createGate(0, 132, 'north_main');
    createGate(115, 132, 'north');

    createGate(-116, 0, 'west');
    createGate(116, 0, 'east');
}

function createWallSegment(width, height, z) {
    const group = new THREE.Group();
    const wallGeometry = new THREE.BoxGeometry(width, height, 1);
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    for (let i = -width / 2 + 10; i < width / 2; i += 20) {
        const pillarGeometry = new THREE.BoxGeometry(2, height + 2, 1.5);
        const pillarMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.set(i, (height + 2) / 2, z);
        pillar.castShadow = true;
        group.add(pillar);
    }

    return group;
}

function createWallSegmentVertical(height, x, zMin, zMax) {
    const group = new THREE.Group();
    const length = Math.abs(zMax - zMin);
    const wallGeometry = new THREE.BoxGeometry(1, height, length);
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, height / 2, (zMax + zMin) / 2);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    for (let z = zMin + 10; z < zMax; z += 20) {
        const pillarGeometry = new THREE.BoxGeometry(1.5, height + 2, 2);
        const pillarMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.set(x, (height + 2) / 2, z);
        pillar.castShadow = true;
        group.add(pillar);
    }

    return group;
}



function loadCampusGLB() {
    gltfLoader.load(
        'models/校园建模新.glb',
        function (gltf) {
            const campusModel = gltf.scene;
            
            campusModel.position.set(0, 0, -100);
            campusModel.scale.set(15, 15, 15);
            campusModel.rotation.y = 180 * Math.PI / 180;
            
            campusModel.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        child.material = child.material.clone();
                    }
                    
                    const comment = getCommentMapping(child.name);
                    child.userData = {
                        id: child.name || 'campus_building',
                        name: applyNameMapping(child.name) || '校园建筑',
                        type: 'building',
                        info: comment || '校园模型建筑',
                        campus: 'south'
                    };
                }
            });
            
            buildings.push(campusModel);
            scene.add(campusModel);
            console.log('GLB校园模型加载成功！');
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% 加载中');
        },
        function (error) {
            console.error('GLB校园模型加载失败:', error);
        }
    );
}

function createGate(x, z, type) {
    const gateGroup = new THREE.Group();
    const gateHeight = 8;
    const gateWidth = 15;

    const leftPillarGeo = new THREE.BoxGeometry(2, gateHeight + 2, 2);
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
    const leftPillar = new THREE.Mesh(leftPillarGeo, pillarMat);
    leftPillar.position.set(-gateWidth / 2 - 1, (gateHeight + 2) / 2, z);
    leftPillar.castShadow = true;
    gateGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(leftPillarGeo, pillarMat);
    rightPillar.position.set(gateWidth / 2 + 1, (gateHeight + 2) / 2, z);
    rightPillar.castShadow = true;
    gateGroup.add(rightPillar);

    const topBeamGeo = new THREE.BoxGeometry(gateWidth + 4, 2, 2);
    const topBeam = new THREE.Mesh(topBeamGeo, pillarMat);
    topBeam.position.set(0, gateHeight + 1, z);
    topBeam.castShadow = true;
    gateGroup.add(topBeam);

    if (type.includes('main')) {
        const signGeo = new THREE.BoxGeometry(gateWidth - 2, 3, 0.5);
        const signMat = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, gateHeight - 1, z);
        gateGroup.add(sign);
    }

    gateGroup.position.x = x;
    walls.push(gateGroup);
    scene.add(gateGroup);
}

function createVegetation() {
    const treePositions = [
        { x: -65, z: -70 }, { x: -70, z: -40 }, { x: 65, z: -70 },
        { x: 70, z: -40 }, { x: -65, z: -85 }, { x: 68, z: -85 },
        { x: -50, z: -45 }, { x: 50, z: -45 }, { x: -30, z: -60 },
        { x: 30, z: -60 }, { x: -55, z: 20 }, { x: 55, z: 20 },
        { x: -60, z: 45 }, { x: 60, z: 45 }, { x: -50, z: 70 },
        { x: 50, z: 70 }, { x: -65, z: 85 }, { x: 65, z: 85 },
        { x: 20, z: 45 }, { x: -20, z: 45 }, { x: 0, z: 75 }
    ];

    treePositions.forEach(pos => {
        const tree = createTree(pos.x, pos.z);
        vegetation.push(tree);
        scene.add(tree);
    });

    const lawnPositions = [
        { x: -45, z: -62, w: 20, d: 15 },
        { x: 25, z: -62, w: 20, d: 15 },
        { x: -30, z: 45, w: 18, d: 12 },
        { x: 30, z: 45, w: 18, d: 12 },
        { x: 0, z: 72, w: 25, d: 18 }
    ];

    lawnPositions.forEach(lawn => {
        const lawnGeo = new THREE.PlaneGeometry(lawn.w, lawn.d);
        const lawnMat = new THREE.MeshLambertMaterial({ color: 0x4A7C3F });
        const lawnMesh = new THREE.Mesh(lawnGeo, lawnMat);
        lawnMesh.rotation.x = -Math.PI / 2;
        lawnMesh.position.set(lawn.x, 0.02, lawn.z);
        lawnMesh.receiveShadow = true;
        vegetation.push(lawnMesh);
        scene.add(lawnMesh);
    });
}

function createTree(x, z) {
    const treeGroup = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const leavesGeo = new THREE.ConeGeometry(3, 7, 8);
    const leavesMat = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 6.5;
    leaves.castShadow = true;
    treeGroup.add(leaves);

    treeGroup.position.set(x, 0, z);

    const scale = 0.8 + Math.random() * 0.6;
    treeGroup.scale.set(scale, scale, scale);

    return treeGroup;
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

    const allObjects = [];
    buildings.forEach(group => {
        group.traverse(child => {
            if (child.isMesh && child.userData.name) {
                allObjects.push(child);
            }
        });
    });

    const intersects = raycaster.intersectObjects(allObjects);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.name) {
            showInfo(object.userData.name, object.userData.info);
            highlightBuilding(object);
        }
    } else {
        hideInfo();
        removeHighlight();
    }
}

function highlightBuilding(object) {
    removeHighlight();

    selectedObject = object;
    const originalColor = object.material.color.getHex();
    object.material.color.setHex(0xFFFF00);
    object.userData.originalColor = originalColor;
}

function removeHighlight() {
    if (selectedObject && selectedObject.userData.originalColor !== undefined) {
        selectedObject.material.color.setHex(selectedObject.userData.originalColor);
        selectedObject = null;
    }
}

function showInfo(title, content) {
    document.getElementById('infoTitle').textContent = title;
    document.getElementById('infoContent').textContent = content;
    document.getElementById('infoPanel').classList.add('show');
}

function hideInfo() {
    document.getElementById('infoPanel').classList.remove('show');
}

function setView(viewType) {
    document.querySelectorAll('.control-panel .btn-group:first-child .btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(viewType)) {
            btn.classList.add('active');
        }
    });

    let targetPosition, targetLookAt;

    switch (viewType) {
        case 'perspective':
            targetPosition = { x: 80, y: 60, z: 100 };
            targetLookAt = { x: 0, y: 0, z: 0 };
            break;
        case 'birdseye':
            targetPosition = { x: 0, y: 250, z: 0 };
            targetLookAt = { x: 0, y: 0, z: 0 };
            break;
        case 'southgate':
            targetPosition = { x: 0, y: 40, z: -130 };
            targetLookAt = { x: 0, y: 10, z: -50 };
            break;
        case 'northgate':
            targetPosition = { x: 0, y: 40, z: 140 };
            targetLookAt = { x: 0, y: 10, z: 50 };
            break;
    }

    animateCamera(targetPosition, targetLookAt);
}

function animateCamera(targetPos, targetLookAt) {
    const startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    const startTarget = controls.target.clone();
    const duration = 1500;
    const startTime = Date.now();

    function updateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        camera.position.x = startPosition.x + (targetPos.x - startPosition.x) * easeProgress;
        camera.position.y = startPosition.y + (targetPos.y - startPosition.y) * easeProgress;
        camera.position.z = startPosition.z + (targetPos.z - startPosition.z) * easeProgress;

        controls.target.x = startTarget.x + (targetLookAt.x - startTarget.x) * easeProgress;
        controls.target.y = startTarget.y + (targetLookAt.y - startTarget.y) * easeProgress;
        controls.target.z = startTarget.z + (targetLookAt.z - startTarget.z) * easeProgress;

        controls.update();

        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        }
    }

    updateCamera();
}

function toggleLayer(layerType, visible) {
    switch (layerType) {
        case 'buildings':
            buildings.forEach(b => b.visible = visible);
            break;
        case 'roads':
            roads.forEach(r => r.visible = visible);
            break;
        case 'vegetation':
            vegetation.forEach(v => v.visible = visible);
            break;
        case 'walls':
            walls.forEach(w => w.visible = visible);
            break;
    }
}

function toggleAutoRotate() {
    isAutoRotating = !isAutoRotating;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 2.0;
    event.target.classList.toggle('active');
}

function resetCamera() {
    setView('southgate');
}

function showAllInfo() {
    const allInfo = `
        <strong>浙江树人学院拱宸桥校区</strong><br><br>
        <strong>南校区：</strong>主要包括图书馆、清乐园、A1-A6教学楼、树人园等建筑，
        是教学和学习的核心区域。<br><br>
        <strong>北校区：</strong>主要包括1-5号宿舍楼、学生食堂、体育馆、运动场、实验实训楼、
        行政楼、艺术中心等，是生活和服务的主要区域。<br><br>
        <strong>交通：</strong>南北校区由城市道路分隔，设有多个校门供师生通行。
        南门为主入口，北门连接城市主干道。<br><br>
        <strong>本系统特点：</strong><br>
        • 基于Three.js构建的三维数字孪生平台<br>
        • 支持多种视角切换和交互操作<br>
        • 提供建筑信息查询功能<br>
        • 支持图层显示控制<br>
        • 浙江树人学院期中作业项目
    `;
    showInfo('校区总览', allInfo);
}

function createSkyBox() {
    const skyBoxGeometry = new THREE.BoxGeometry(500, 500, 500);
    const skyBoxMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vWorldPosition;
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `,
        uniforms: {
            topColor: { value: new THREE.Color(0x87CEEB) },
            bottomColor: { value: new THREE.Color(0xE0F6FF) },
            offset: { value: 33 },
            exponent: { value: 0.6 }
        },
        side: THREE.BackSide
    });
    
    skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);
}

function createWeatherParticles() {
    for (let i = 0; i < 500; i++) {
        const rainGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const rainMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAFF, transparent: true, opacity: 0.6 });
        const rainDrop = new THREE.Mesh(rainGeometry, rainMaterial);
        rainDrop.position.set(
            (Math.random() - 0.5) * 400,
            Math.random() * 150,
            (Math.random() - 0.5) * 400
        );
        rainDrop.userData.speed = 2 + Math.random() * 3;
        rainDrop.userData.originalY = rainDrop.position.y;
        rainDrop.visible = false;
        rainParticles.push(rainDrop);
        scene.add(rainDrop);

        const snowGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const snowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.8 });
        const snowflake = new THREE.Mesh(snowGeometry, snowMaterial);
        snowflake.position.set(
            (Math.random() - 0.5) * 400,
            Math.random() * 150,
            (Math.random() - 0.5) * 400
        );
        snowflake.userData.speed = 0.5 + Math.random() * 0.5;
        snowflake.userData.sway = Math.random() * Math.PI * 2;
        snowflake.userData.swaySpeed = 0.02 + Math.random() * 0.02;
        snowflake.userData.originalY = snowflake.position.y;
        snowflake.visible = false;
        snowParticles.push(snowflake);
        scene.add(snowflake);
    }
}

function updateWeatherParticles() {
    if (currentWeather === 'rain') {
        rainParticles.forEach(drop => {
            drop.visible = true;
            drop.position.y -= drop.userData.speed;
            if (drop.position.y < 0) {
                drop.position.y = drop.userData.originalY;
            }
        });
    } else {
        rainParticles.forEach(drop => drop.visible = false);
    }

    if (currentWeather === 'snow') {
        snowParticles.forEach(snowflake => {
            snowflake.visible = true;
            snowflake.position.y -= snowflake.userData.speed;
            snowflake.position.x += Math.sin(snowflake.userData.sway) * 0.3;
            snowflake.userData.sway += snowflake.userData.swaySpeed;
            if (snowflake.position.y < 0) {
                snowflake.position.y = snowflake.userData.originalY;
            }
        });
    } else {
        snowParticles.forEach(snowflake => snowflake.visible = false);
    }
}

function setTimeOfDay(time) {
    currentTimeOfDay = time;
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const timeSettings = {
        day: {
            skyTop: 0x87CEEB,
            skyBottom: 0xE0F6FF,
            ambient: 0xFFFFFF,
            ambientIntensity: 0.6,
            directional: 0xFFFFFF,
            directionalIntensity: 0.8,
            fog: 0x87CEEB,
            fogNear: 150,
            fogFar: 350
        },
        sunset: {
            skyTop: 0xFF6B35,
            skyBottom: 0xFFE4B5,
            ambient: 0xFFD4A3,
            ambientIntensity: 0.5,
            directional: 0xFFAA66,
            directionalIntensity: 0.6,
            fog: 0xFFB347,
            fogNear: 120,
            fogFar: 300
        },
        night: {
            skyTop: 0x0A0A20,
            skyBottom: 0x1A1A40,
            ambient: 0x333366,
            ambientIntensity: 0.2,
            directional: 0xCCCCFF,
            directionalIntensity: 0.3,
            fog: 0x0A0A20,
            fogNear: 100,
            fogFar: 280
        },
        dawn: {
            skyTop: 0xFFB347,
            skyBottom: 0xFFE4E1,
            ambient: 0xFFE4E1,
            ambientIntensity: 0.35,
            directional: 0xFFB347,
            directionalIntensity: 0.4,
            fog: 0xFFDAB9,
            fogNear: 130,
            fogFar: 320
        }
    };

    const settings = timeSettings[time];
    if (settings) {
        skyBox.material.uniforms.topColor.value.setHex(settings.skyTop);
        skyBox.material.uniforms.bottomColor.value.setHex(settings.skyBottom);
        ambientLight.color.setHex(settings.ambient);
        ambientLight.intensity = settings.ambientIntensity;
        directionalLight.color.setHex(settings.directional);
        directionalLight.intensity = settings.directionalIntensity;
        scene.fog.color.setHex(settings.fog);
        scene.fog.near = settings.fogNear;
        scene.fog.far = settings.fogFar;
    }
}

function setWeather(weather) {
    currentWeather = weather;
    document.querySelectorAll('.weather-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const weatherSettings = {
        sunny: {
            fogEnabled: false,
            fogDensity: 0
        },
        cloudy: {
            fogEnabled: true,
            fogDensity: 0.003
        },
        rain: {
            fogEnabled: true,
            fogDensity: 0.008
        },
        snow: {
            fogEnabled: true,
            fogDensity: 0.006
        }
    };

    const settings = weatherSettings[weather];
    if (settings) {
        scene.fog.enabled = settings.fogEnabled;
        if (settings.fogEnabled) {
            scene.fog = new THREE.FogExp2(scene.fog.color.getHex(), settings.fogDensity);
        } else {
            scene.fog = new THREE.Fog(scene.fog.color.getHex(), 150, 350);
        }
    }
}

function updateCompass() {
    const compass = document.getElementById('compass');
    if (!compass) return;

    const angle = Math.atan2(camera.position.x, -camera.position.z);
    const rotationDeg = angle * (180 / Math.PI);
    compass.style.setProperty('--rotation', `${rotationDeg}deg`);
}

function toggleMinimap() {
    const minimapPanel = document.getElementById('minimapPanel');
    const minimapToggle = document.getElementById('minimapToggle');
    
    minimapPanel.classList.toggle('show');
    minimapToggle.classList.toggle('active');
    
    if (minimapPanel.classList.contains('show')) {
        drawMinimap();
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 100, g: 100, b: 100 };
}

function drawMinimap() {
    const canvas = document.getElementById('minimapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    const worldMinX = -100;
    const worldMaxX = 100;
    const worldMinZ = -130;
    const worldMaxZ = 130;
    
    const worldWidth = worldMaxX - worldMinX;
    const worldHeight = worldMaxZ - worldMinZ;
    
    const padding = 8;
    const mapWidth = width - padding * 2;
    const mapHeight = height - padding * 2;
    
    function worldToMap(x, z) {
        const mapX = padding + ((x - worldMinX) / worldWidth) * mapWidth;
        const mapY = padding + ((worldMaxZ - z) / worldHeight) * mapHeight;
        return { x: mapX, y: mapY };
    }
    
    function worldToMapSize(width, depth) {
        return {
            w: (width / worldWidth) * mapWidth,
            h: (depth / worldHeight) * mapHeight
        };
    }
    
    ctx.fillStyle = '#7CBA5F';
    ctx.fillRect(padding, padding, mapWidth, mapHeight);
    
    ctx.fillStyle = '#444444';
    const roadY = worldToMap(0, 0).y;
    ctx.fillRect(padding, roadY - 2, mapWidth, 4);
    
    const verticalRoadX = worldToMap(0, 0).x;
    ctx.fillRect(verticalRoadX - 2, padding, 4, mapHeight);
    
    for (let i = -40; i <= 40; i += 80) {
        const crossX = worldToMap(i, 0).x;
        ctx.fillRect(crossX - 2, roadY - 35, 4, 70);
    }
    
    const allBuildings = [];
    Object.values(CAMPUS_DATA).forEach(campus => {
        campus.buildings.forEach(building => {
            allBuildings.push(building);
        });
    });
    
    allBuildings.forEach(building => {
        const pos = worldToMap(building.position.x, building.position.z);
        const size = worldToMapSize(building.size.width, building.size.depth);
        
        const color = hexToRgb('#' + building.color.toString(16).padStart(6, '0'));
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.85)`;
        ctx.fillRect(pos.x - size.w / 2, pos.y - size.h / 2, size.w, size.h);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(pos.x - size.w / 2, pos.y - size.h / 2, size.w, size.h);
    });
    
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    
    const southLabelPos = worldToMap(0, -100);
    ctx.fillText('南区', southLabelPos.x, southLabelPos.y);
    
    const northLabelPos = worldToMap(0, 100);
    ctx.fillText('北区', northLabelPos.x, northLabelPos.y);
    
    ctx.fillStyle = '#FFC107';
    ctx.font = 'bold 8px Arial';
    ctx.fillText('N', width / 2, padding + 10);
    ctx.fillText('S', width / 2, height - 5);
    ctx.fillText('E', width - 5, height / 2 + 3);
    ctx.fillText('W', padding + 5, height / 2 + 3);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    updateWeatherParticles();
    renderer.render(scene, camera);

    updateCompass();
}

init();
