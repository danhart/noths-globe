var markers = [];

function attachMarker(vector, $content) {
    var container = $("#visualization");
    var marker = {};
    marker.$el = $content;

    marker.$el.appendTo(container);

    marker.setPosition = function(x, y, z) {
        this.$el[0].style.left = x + 'px';
        this.$el[0].style.top = y + 'px';
        this.$el[0].style.zIndex = z;
    }

    marker.setVisible = function(visible){
        if (visible) {
            this.$el[0].style.display = 'block';
        } else {
            this.$el[0].style.display = 'none';
        }
    }

    marker.setScale = function(scale) {
        this.$el[0].style["font-size"] = (scale * 5) + "px";
        this.$el.find("img")[0].style["width"] = (scale * 30) + "px";
    }

    marker.update = function() {
        var matrix = rotating.matrixWorld;
        // var abspos = matrix.multiplyVector3( vector );
        var abspos = vector.clone().applyMatrix4(matrix);
        var screenPos = screenXY(abspos);

        this.setVisible(abspos.z > 0.60);

        var zIndex = Math.floor( 1000 - abspos.z);

        this.setScale(camera.scale.z);

        this.setPosition( screenPos.x, screenPos.y, zIndex );
    }

    markers.push(marker);
}

function removeMarkers() {
    markers.forEach(function(marker, index) {
        marker.$el.remove();
        marker = undefined;
    });
}
