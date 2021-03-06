/*global define*/
define(['../Core/Enumeration'], function(Enumeration) {
    "use strict";

    /**
     * Indicates a GLSL uniform's datatype.
     *
     * @exports UniformDatatype
     * @see Uniform.getDatatype
     */
    var UniformDatatype = {
        /**
         * A <code>float</code> uniform.
         *
         * @constant
         * @type {Enumeration}
         */
        FLOAT : new Enumeration(0x1406, 'FLOAT', {
            getGLSL : function() {
                return 'float';
            }
        }), // FLOAT

        /**
         * A <code>vec2</code> uniform: a two-component floating-point vector.
         *
         * @constant
         * @type {Enumeration}
         */
        FLOAT_VECTOR2 : new Enumeration(0x8B50, 'FLOAT_VECTOR2', {
            getGLSL : function() {
                return 'vec2';
            }
        }), // FLOAT_VEC2

        /**
         * A <code>vec3</code> uniform: a three-component floating-point vector.
         *
         * @constant
         * @type {Enumeration}
         */
        FLOAT_VECTOR3 : new Enumeration(0x8B51, 'FLOAT_VECTOR3', {
            getGLSL : function() {
                return 'vec3';
            }
        }), // FLOAT_VEC3

        /**
         * A <code>vec4</code> uniform: a four-component floating-point vector.
         *
         * @constant
         * @type {Enumeration}
         */
        FLOAT_VECTOR4 : new Enumeration(0x8B52, 'FLOAT_VECTOR4', {
            getGLSL : function() {
                return 'vec4';
            }
        }), // FLOAT_VEC4

        /**
         * An <code>int</code> uniform.
         *
         * @constant
         * @type {Enumeration}
         */
        INT : new Enumeration(0x1404, 'INT', {
            getGLSL : function() {
                return 'int';
            }
        }), // INT

        /**
         * An <code>ivec2</code> uniform: a two-component integer vector.
         *
         * @constant
         * @type {Enumeration}
         */
        INT_VECTOR2 : new Enumeration(0x8B53, 'INT_VECTOR2', {
            getGLSL : function() {
                return 'ivec2';
            }
        }), // INT_VEC2

        /**
         * An <code>ivec3</code> uniform: a three-component integer vector.
         *
         * @constant
         * @type {Enumeration}
         */
        INT_VECTOR3 : new Enumeration(0x8B54, 'INT_VECTOR3', {
            getGLSL : function() {
                return 'ivec3';
            }
        }), // INT_VEC3

        /**
         * An <code>ivec4</code> uniform: a four-component integer vector.
         *
         * @constant
         * @type {Enumeration}
         */
        INT_VECTOR4 : new Enumeration(0x8B55, 'INT_VECTOR4', {
            getGLSL : function() {
                return 'ivec4';
            }
        }), // INT_VEC4

        /**
         * A <code>bool</code> uniform.
         *
         * @constant
         * @type {Enumeration}
         */
        BOOL : new Enumeration(0x8B56, 'BOOL', {
            getGLSL : function() {
                return 'bool';
            }
        }), // BOOL

        /**
         * A <code>bvec2</code> uniform: a two-component boolean vector.
         *
         * @constant
         * @type {Enumeration}
         */
        BOOL_VECTOR2 : new Enumeration(0x8B57, 'BOOL_VECTOR2', {
            getGLSL : function() {
                return 'bvec2';
            }
        }), // BOOL_VEC2

        /**
         * A <code>bvec3</code> uniform: a three-component boolean vector.
         *
         * @constant
         * @type {Enumeration}
         */
        BOOL_VECTOR3 : new Enumeration(0x8B58, 'BOOL_VECTOR3', {
            getGLSL : function() {
                return 'bvec3';
            }
        }), // BOOL_VEC3

        /**
         * A <code>bvec4</code> uniform: a four-component boolean vector.
         *
         * @constant
         * @type {Enumeration}
         */
        BOOL_VECTOR4 : new Enumeration(0x8B59, 'BOOL_VECTOR4', {
            getGLSL : function() {
                return 'bvec4';
            }
        }), // BOOL_VEC4

        /**
         * An <code>mat2</code> uniform: a 2x2 floating-point matrix.
         *
         * @constant
         * @type {Enumeration}
         */
        FLOAT_MATRIX2 : new Enumeration(0x8B5A, 'FLOAT_MATRIX2', {
            getGLSL : function() {
                return 'mat2';
            }
        }), // FLOAT_MAT2

        /**
         * An <code>mat3</code> uniform: a 3x3 floating-point matrix.
         *
         * @constant
         * @type {Enumeration}
         */
        FLOAT_MATRIX3 : new Enumeration(0x8B5B, 'FLOAT_MATRIX3', {
            getGLSL : function() {
                return 'mat3';
            }
        }), // FLOAT_MAT3

        /**
         * An <code>mat4</code> uniform: a 4x4 floating-point matrix.
         *
         * @constant
         * @type {Enumeration}
         */
        FLOAT_MATRIX4 : new Enumeration(0x8B5C, 'FLOAT_MATRIX4', {
            getGLSL : function() {
                return 'mat4';
            }
        }), // FLOAT_MAT4

        /**
         * A <code>sampler2D</code> uniform: an opaque type to access 2D textures.
         *
         * @constant
         * @type {Enumeration}
         */
        SAMPLER_2D : new Enumeration(0x8B5E, 'SAMPLER_2D', {
            getGLSL : function() {
                return 'sampler2D';
            }
        }), // SAMPLER_2D

        /**
         * A <code>samplerCube</code> uniform: an opaque type to access cube-map textures.
         *
         * @constant
         * @type {Enumeration}
         */
        SAMPLER_CUBE : new Enumeration(0x8B60, 'SAMPLER_CUBE', {
            getGLSL : function() {
                return 'samplerCube';
            }
        }) // SAMPLER_CUBE
    };

    return UniformDatatype;
});