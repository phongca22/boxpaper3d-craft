function Box3DViewer(element) {
    var ID = {
        BODY: "body",
        LID: "lid"
    };

    var meshHelper = new MeshHelper();
    var shapeIndex = 1;
    this.LISTENER = {};

    var thiz = this;
    var gui = null;
    var scene = null;
    var camera = null;
    var renderer = null;
    var orbit = null;
    var raycaster = null;
    var mouse = null;
    var objects = [];
    var containerWidth = 0;
    var containerHeight = 0;
    var shapes = [];
    var body = {
        size: {
            w: 100,
            h: 60,
            d: 100,
            t: 2
        },
        mesh: null,
        material: 'box-material/basic-03.jpg',
        color: null,
        shapes: []
    };

    var lid = {
        size: {
            w: 5,
            h: 10,
            d: 5,
            t: 2
        },
        mesh: null,
        material: 'box-material/basic-05.jpg',
        open: true,
        color: null
    };

    function createBody() {
        var list = [];
        var cubeGeo1 = new THREE.BoxGeometry(body.size.w, body.size.h, body.size.d);
        var cubeMesh1 = new THREE.Mesh(cubeGeo1);

        var cubeGeo2 = new THREE.BoxGeometry(body.size.w - body.size.t, body.size.h - body.size.t, body.size.d - body.size.t);
        var cubeMesh2 = new THREE.Mesh(cubeGeo2);
        cubeMesh2.position.y = 1;

        list = [cubeMesh1, cubeMesh2];

        for (var i = 0; i < body.shapes.length; i++) {
            list.push(body.shapes[i].mesh);
        }

        var material = null;
        if (body.color) {
            material = new THREE.MeshBasicMaterial({
                flatShading: THREE.SmoothShading,
                color: body.color
            });
        } else {
            material = new THREE.MeshBasicMaterial({
                flatShading: THREE.SmoothShading,
                map: new THREE.TextureLoader().load(getImageResource(body.material))
            });
        }

        var result = meshHelper.subtract(list, material);
        result.geometry.computeVertexNormals();
        result.geometry.computeFaceNormals();

        if (body.mesh) {
            var obj = scene.getObjectByName(ID.BODY);
            scene.remove(obj);
        }

        result.name = ID.BODY;
        body.mesh = new THREE.Object3D();
        body.mesh.add(result);
        scene.add(result);
        objects.push(result);
    }

    function createLid() {
        var cubeGeo1 = new THREE.BoxGeometry(body.size.w + lid.size.w, lid.size.h, body.size.d + lid.size.d);
        var cubeMesh1 = new THREE.Mesh(cubeGeo1);
        var cube1_bsp = new ThreeBSP(cubeMesh1);

        var cubeGeo2 = new THREE.BoxGeometry(body.size.w + lid.size.w - lid.size.t, lid.size.h - lid.size.t, body.size.d + lid.size.d - lid.size.t);
        var cubeMesh2 = new THREE.Mesh(cubeGeo2);

        cubeMesh2.position.y = -1;
        var cube2_bsp = new ThreeBSP(cubeMesh2);

        var subtract_bsp = cube1_bsp.subtract(cube2_bsp);
        var result = subtract_bsp.toMesh(new THREE.MeshBasicMaterial({
            flatShading: THREE.SmoothShading,
            map: new THREE.TextureLoader().load(getImageResource(lid.material))
        }));

        result.geometry.computeVertexNormals();
        result.geometry.computeFaceNormals();

        if (lid.open) {
            result.position.y = body.size.h / 2 + (lid.size.h + 35);
        } else {
            result.position.y = body.size.h / 2 - (lid.size.h / 2) + 2;
        }

        if (body.mesh) {
            var obj = scene.getObjectByName("lid");
            scene.remove(obj);
        }

        result.name = "lid";
        lid.mesh = new THREE.Object3D();
        lid.mesh.add(result);
        scene.add(result);
        objects.push(result);
    }

    function setupControl() {
        orbit = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function updateBodySize() {
        createBody();
        createLid();
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 1000);
        camera.position.z = 200;
        camera.position.y = 150;
        camera.position.x = 100;
        camera.lookAt(scene.position);
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerWidth, containerHeight);
        renderer.setClearColor(0xffffff, 1);

        element.appendChild(renderer.domElement);
    }

    function autoResize() {
        window.addEventListener('resize', function () {
            camera.aspect = containerWidth / containerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerWidth, containerHeight);
        }, false);
    }

    function start() {
        function animate() {
            requestAnimationFrame(animate);
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }

        animate();
    }

    function initContainer() {
        var b = element.getBoundingClientRect();
        containerWidth = b.right - b.left;
        containerHeight = b.bottom - b.top;
    }

    function setupMouseEvent() {
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        element.addEventListener('dragover', function(ev){
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
        });

        element.addEventListener('drop', onDocumentMouseDown, false);
    }

    function onDocumentMouseDown(event) {
        mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(objects);
        handleSelection(intersects);
    }

    function handleSelection(data) {
        var item = data[0];
        if (!item) return;
        thiz.addShape(item);
    }

    function initScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
    }

    Box3DViewer.prototype.updateBodySize = function (data) {
        body.size.w = data.width;
        body.size.h = data.height;
        body.size.d = data.depth;
        updateBodySize();
    };

    Box3DViewer.prototype.updateBodyMaterial = function (data) {
        if (data.material) {
            body.material = data.material;
            body.color = null;
        } else {
            body.material = null;
            body.color = data.color;
        }

        createBody();
    };

    Box3DViewer.prototype.updateLidSize = function (data) {
        if (!isNaN(data.height)) lid.size.h = data.height;
        if (typeof (lid.open) !== "undefined") lid.open = data.open;
        createLid();
    };

    Box3DViewer.prototype.updateLidMaterial = function (data) {
        if (data.material) {
            lid.material = data.material;
            lid.color = null;
        } else {
            lid.material = null;
            lid.color = data.color;
        }
        createLid();
    };

    Box3DViewer.prototype.addShape = function (data) {
        if (data.object.name == ID.BODY) {
            var mesh = meshHelper.createCircle(data.face.normal, body.size);
            body.shapes.push({
                name: "Circle " + shapeIndex++,
                normal: data.face.normal,
                mesh: mesh,
                coordinate: {
                    x: 0,
                    y: 0,
                    r: 10
                }
            });
        }

        createBody();
        var cb = this.LISTENER.shape;
        if (cb) cb(body.shapes);
    };

    Box3DViewer.prototype.addListener = function (id, callback) {
        this.LISTENER[id] = callback;
    };

    Box3DViewer.prototype.updateBodyShape = function (shape) {
        for (var i = 0; i < body.shapes.length; i++) {
            if (shape.mesh.uuid == body.shapes[i].mesh.uuid) {
                var m = meshHelper.createCircle(body.shapes[i].normal, body.size, shape.coordinate);
                body.shapes[i].coordinate = shape.coordinate;
                body.shapes[i].mesh = m;

                // scene.add(m);
                // return;

                createBody();
                break;
            }
        }
    };

    function test() {
        var axes2 = new THREE.AxisHelper(100);
        scene.add(axes2);

        var el = document.getElementById("circleShape");
        el.draggable = true;
        el.addEventListener("dragstart", function(ev){
            ev.dataTransfer.setData("text/plain", ev.target.id);
            ev.dataTransfer.setDragImage(this, 10, 10);
        }, false);

        return;

        var a = new THREE.BoxGeometry(20, 20, 20);
        var b = new THREE.Mesh(a, new THREE.MeshBasicMaterial({
            flatShading: THREE.SmoothShading,
            map: new THREE.TextureLoader().load(getImageResource(body.material))
        }));
        b.position.x = -10;
        b.position.y = -10;
        b.position.z = -10;
        scene.add(b);
    }

    function init() {
        initScene();
        initContainer();
        initCamera();
        createBody();
        createLid();
        initRenderer();
        setupControl();
        setupMouseEvent();
        autoResize();
        start();
        test();
    }

    init();
}
