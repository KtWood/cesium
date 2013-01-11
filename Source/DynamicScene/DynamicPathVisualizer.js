/*global define*/
define([
        '../Core/DeveloperError',
        '../Core/destroyObject',
        '../Core/Cartesian3',
        '../Core/Matrix4',
        '../Core/Color',
        '../Core/Transforms',
        '../Scene/PolylineCollection'
       ], function(
         DeveloperError,
         destroyObject,
         Cartesian3,
         Matrix4,
         Color,
         Transforms,
         PolylineCollection) {
    "use strict";

    function samplePositions(currentTime, positionProperty, availability, leadTime, trailTime, result) {
        var hasAvailability = typeof availability !== 'undefined';
        var hasLeadTime = typeof leadTime !== 'undefined';
        var hasTrailTime = typeof trailTime !== 'undefined';

        if (!hasAvailability && (!hasLeadTime || !hasTrailTime)) {
            return [];
        }

        var sampleStart;
        var sampleStop;
        if (hasTrailTime) {
            sampleStart = currentTime.addSeconds(-trailTime);
        }
        if (hasAvailability && (!hasTrailTime || availability.start.greaterThan(sampleStart))) {
            sampleStart = availability.start;
        }

        if (hasLeadTime) {
            sampleStop = currentTime.addSeconds(leadTime);
        }
        if (hasAvailability && (!hasLeadTime || availability.stop.lessThan(sampleStop))) {
            sampleStop = availability.stop;
        }

        return positionProperty.getValueRangeCartesian(sampleStart, sampleStop, currentTime, result);
    }

    /**
     * A DynamicObject visualizer which maps the DynamicPath instance
     * in DynamicObject.path to a Polyline primitive.
     * @alias DynamicPathVisualizer
     * @constructor
     *
     * @param {Scene} scene The scene the primitives will be rendered in.
     * @param {DynamicObjectCollection} [dynamicObjectCollection] The dynamicObjectCollection to visualize.
     *
     * @exception {DeveloperError} scene is required.
     *
     * @see DynamicPath
     * @see Polyline
     * @see Scene
     * @see DynamicObject
     * @see DynamicObjectCollection
     * @see CompositeDynamicObjectCollection
     * @see VisualizerCollection
     * @see DynamicBillboardVisualizer
     * @see DynamicConeVisualizer
     * @see DynamicConeVisualizerUsingCustomSensorr
     * @see DynamicLabelVisualizer
     * @see DynamicPointVisualizer
     * @see DynamicPolygonVisualizer
     * @see DynamicPyramidVisualizer
     *
     */
    var DynamicPathVisualizer = function(scene, dynamicObjectCollection) {
        if (typeof scene === 'undefined') {
            throw new DeveloperError('scene is required.');
        }
        this._scene = scene;
        this._primitives = scene.getPrimitives();

        var polylineCollections = this._polylineCollections = {
            FIXED : new PolylineCollection(),
            INERTIAL : new PolylineCollection()
        };

        scene.getPrimitives().add(polylineCollections.FIXED);
        scene.getPrimitives().add(polylineCollections.INERTIAL);
        this._dynamicObjectCollection = undefined;
        this.setDynamicObjectCollection(dynamicObjectCollection);
    };

    /**
     * Returns the scene being used by this visualizer.
     *
     * @returns {Scene} The scene being used by this visualizer.
     */
    DynamicPathVisualizer.prototype.getScene = function() {
        return this._scene;
    };

    /**
     * Gets the DynamicObjectCollection being visualized.
     *
     * @returns {DynamicObjectCollection} The DynamicObjectCollection being visualized.
     */
    DynamicPathVisualizer.prototype.getDynamicObjectCollection = function() {
        return this._dynamicObjectCollection;
    };

    /**
     * Sets the DynamicObjectCollection to visualize.
     *
     * @param dynamicObjectCollection The DynamicObjectCollection to visualizer.
     */
    DynamicPathVisualizer.prototype.setDynamicObjectCollection = function(dynamicObjectCollection) {
        var oldCollection = this._dynamicObjectCollection;
        if (oldCollection !== dynamicObjectCollection) {
            if (typeof oldCollection !== 'undefined') {
                oldCollection.objectsRemoved.removeEventListener(DynamicPathVisualizer.prototype._onObjectsRemoved);
                this.removeAllPrimitives();
            }
            this._dynamicObjectCollection = dynamicObjectCollection;
            if (typeof dynamicObjectCollection !== 'undefined') {
                dynamicObjectCollection.objectsRemoved.addEventListener(DynamicPathVisualizer.prototype._onObjectsRemoved, this);
            }
        }
    };

    /**
     * Updates all of the primitives created by this visualizer to match their
     * DynamicObject counterpart at the given time.
     *
     * @param {JulianDate} time The time to update to.
     *
     * @exception {DeveloperError} time is required.
     */
    DynamicPathVisualizer.prototype.update = function(time) {
        if (typeof time === 'undefined') {
            throw new DeveloperError('time is requied.');
        }

        this._polylineCollections.INERTIAL.modelMatrix = Matrix4.fromRotationTranslation(Transforms.computeTemeToPseudoFixedMatrix(time), Cartesian3.ZERO);

        if (typeof this._dynamicObjectCollection !== 'undefined') {
            var dynamicObjects = this._dynamicObjectCollection.getObjects();
            for ( var i = 0, len = dynamicObjects.length; i < len; i++) {
                this._updateObject(time, dynamicObjects[i]);
            }
        }
    };

    /**
     * Removes all primitives from the scene.
     */
    DynamicPathVisualizer.prototype.removeAllPrimitives = function() {
        var i;
        this._polylineCollections.FIXED.removeAll();
        this._polylineCollections.INERTIAL.removeAll();

        if (typeof this._dynamicObjectCollection !== 'undefined') {
            var dynamicObjects = this._dynamicObjectCollection.getObjects();
            for (i = dynamicObjects.length - 1; i > -1; i--) {
                dynamicObjects[i]._pathVisualizerIndex = undefined;
            }
        }
    };

    /**
     * Returns true if this object was destroyed; otherwise, false.
     * <br /><br />
     * If this object was destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
     *
     * @memberof DynamicPathVisualizer
     *
     * @return {Boolean} True if this object was destroyed; otherwise, false.
     *
     * @see DynamicPathVisualizer#destroy
     */
    DynamicPathVisualizer.prototype.isDestroyed = function() {
        return false;
    };

    /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
     * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
     * <br /><br />
     * Once an object is destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
     * assign the return value (<code>undefined</code>) to the object as done in the example.
     *
     * @memberof DynamicPathVisualizer
     *
     * @return {undefined}
     *
     * @exception {DeveloperError} This object was destroyed, i.e., destroy() was called.
     *
     * @see DynamicPathVisualizer#isDestroyed
     *
     * @example
     * visualizer = visualizer && visualizer.destroy();
     */
    DynamicPathVisualizer.prototype.destroy = function() {
        this.removeAllPrimitives();
        this._scene.getPrimitives().remove(this._polylineCollections.FIXED);
        this._scene.getPrimitives().remove(this._polylineCollections.INERTIAL);
        return destroyObject(this);
    };

    DynamicPathVisualizer.prototype._updateObject = function(time, dynamicObject) {
        var dynamicPath = dynamicObject.path;
        if (typeof dynamicPath === 'undefined') {
            return;
        }

        var positionProperty = dynamicObject.position;
        if (typeof positionProperty === 'undefined') {
            return;
        }

        var polyline;
        var referenceFrame = positionProperty.referenceFrame;
        var showProperty = dynamicPath.show;
        var pathVisualizerIndex = dynamicObject._pathVisualizerIndex;
        var show = (typeof showProperty === 'undefined' || showProperty.getValue(time));

        if (!show) {
            //don't bother creating or updating anything else
            if (typeof pathVisualizerIndex !== 'undefined') {
                if (referenceFrame === 'INERTIAL') {
                    this._polylineCollections.INERTIAL.remove(polyline);
                } else {
                    this._polylineCollections.FIXED.remove(polyline);
                }
                dynamicObject._pathVisualizerIndex = undefined;
            }
            return;
        }

        if (typeof pathVisualizerIndex === 'undefined') {
            var polylineCollection;
            if (referenceFrame === 'INERTIAL') {
                polylineCollection = this._polylineCollections.INERTIAL;
            } else {
                polylineCollection = this._polylineCollections.FIXED;
            }

            pathVisualizerIndex = polylineCollection.getLength();
            polyline = polylineCollection.add();
            dynamicObject._pathVisualizerIndex = pathVisualizerIndex;
            polyline.dynamicObject = dynamicObject;

            // CZML_TODO Determine official defaults
            polyline.setColor(Color.WHITE);
            polyline.setOutlineColor(Color.BLACK);
            polyline.setOutlineWidth(1);
            polyline.setWidth(1);
        } else {
            if (referenceFrame === 'INERTIAL') {
                polyline = this._polylineCollections.INERTIAL.get(pathVisualizerIndex);
            } else {
                polyline = this._polylineCollections.FIXED.get(pathVisualizerIndex);
            }
        }

        polyline.setShow(true);

        var property = dynamicPath.leadTime;
        var leadTime;
        if (typeof property !== 'undefined') {
            leadTime = property.getValue(time);
        }

        property = dynamicPath.trailTime;
        var trailTime;
        if (typeof property !== 'undefined') {
            trailTime = property.getValue(time);
        }

        polyline.setPositions(samplePositions(time, positionProperty, dynamicObject.availability, leadTime, trailTime, polyline.getPositions()));

        property = dynamicPath.color;
        if (typeof property !== 'undefined') {
            polyline.setColor(property.getValue(time, polyline.getColor()));
        }

        property = dynamicPath.outlineColor;
        if (typeof property !== 'undefined') {
            polyline.setOutlineColor(property.getValue(time, polyline.getOutlineColor()));
        }

        property = dynamicPath.outlineWidth;
        if (typeof property !== 'undefined') {
            var outlineWidth = property.getValue(time);
            if (typeof outlineWidth !== 'undefined') {
                polyline.setOutlineWidth(outlineWidth);
            }
        }

        property = dynamicPath.width;
        if (typeof property !== 'undefined') {
            var width = property.getValue(time);
            if (typeof width !== 'undefined') {
                polyline.setWidth(width);
            }
        }
    };

    DynamicPathVisualizer.prototype._onObjectsRemoved = function(dynamicObjectCollection, dynamicObjects) {
        for ( var i = dynamicObjects.length - 1; i > -1; i--) {
            var dynamicObject = dynamicObjects[i];
            var pathVisualizerIndex = dynamicObject._pathVisualizerIndex;
            if (typeof pathVisualizerIndex !== 'undefined') {
                var thisPolylineCollection;
                if (dynamicObject.referenceFrame === 'INERTIAL') {
                    thisPolylineCollection = this._polylineCollections.INERTIAL;
                } else {
                    thisPolylineCollection = this._polylineCollections.FIXED;
                }
                var polyline = thisPolylineCollection.get(pathVisualizerIndex);
                thisPolylineCollection.remove(polyline);
                dynamicObject._pathVisualizerIndex = undefined;
            }
        }
    };

    return DynamicPathVisualizer;
});