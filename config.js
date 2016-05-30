/**
 * Created by Christophe on 19/05/2016.
 */
require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        TweenLite: {
            exports: 'TweenLite'
        },
        Draggable: {
            deps: ['TweenMax']
        },
        treeview: {
            deps: ["css!treeviewCss"]
        }
    },
    paths: {
        backbone: 'bower_components/backbone/backbone',
        jquery: 'bower_components/jquery/dist/jquery',
        underscore: 'bower_components/underscore/underscore',
        TweenMax: 'bower_components/gsap/src/uncompressed/TweenMax',
        TweenLite: 'bower_components/gsap/src/uncompressed/TweenLite',
        Draggable: 'bower_components/gsap/src/uncompressed/utils/Draggable',
        marionette: 'bower_components/backbone.marionette/lib/backbone.marionette',
        pinit: 'src/pinit'
    },
    map: {
        '*': {
            css: 'bower_components/require-css/css'
        }
    },
    waitSeconds: 60
});