function MeshHelper() {
    MeshHelper.prototype.subtract = function(list, material) {
        var item = new ThreeBSP(list[0]);
        for (var i = 1; i < list.length; i++) {
            item = item.subtract(new ThreeBSP(list[i]));
        }

        return item.toMesh(material);
    };

    MeshHelper.prototype.createCircle = function(normal, parentSize, size) {
        var h = parentSize.t + 4;
        var s = size ? size.r : 10;
        var cylinder_geometry = new THREE.CylinderGeometry(s, s, h, 64);
        if (normal.z == 1) {
            cylinder_geometry.translate(0, h/2, 0);
        } else if (normal.z == -1) {
            cylinder_geometry.translate(0, -h/2, 0);
        } else if (normal.x == 1) {
            cylinder_geometry.translate(h/2, 0, 0);
        } else if (normal.x == -1) {
            cylinder_geometry.translate(-h/2, 0, 0);
        }

        var cylinder_mesh = new THREE.Mesh(cylinder_geometry);
        if (normal.z == 1) {
            cylinder_mesh.rotation.x = 0.5 * Math.PI;
            cylinder_mesh.position.z = parentSize.w/2 - h/2;
            cylinder_mesh.position.x = size ? size.x : 0;
            cylinder_mesh.position.y = size ? size.y : 0;
        } else if (normal.z == -1) {
            cylinder_mesh.rotation.x = 0.5 * Math.PI;
            cylinder_mesh.position.z = -parentSize.w/2 + h/2;
            cylinder_mesh.position.x = size ? -size.x : 0;
            cylinder_mesh.position.y = size ? size.y : 0;
        } else if (normal.x == 1) {
            cylinder_mesh.rotation.z = 0.5 * Math.PI;
            cylinder_mesh.position.x = parentSize.w/2 - h/2;
            cylinder_mesh.position.z = size ? -size.x : 0;
            cylinder_mesh.position.y = size ? size.y : 0;
        } else if (normal.x == -1) {
            cylinder_mesh.rotation.z = 0.5 * Math.PI;
            cylinder_mesh.position.x = -parentSize.w/2 + h/2;
            cylinder_mesh.position.z = size ? size.x : 0;
            cylinder_mesh.position.y = size ? size.y : 0;
        } else if (Math.floor(normal.y) == -1) {
            cylinder_mesh.position.y = -parentSize.h/2;
            cylinder_mesh.position.x = size ? size.x : 0;
            cylinder_mesh.position.z = size ? size.y : 0;
        }

        return cylinder_mesh;
    };
}
