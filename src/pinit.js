/**
 * Created by Christophe on 27/05/2016.
 */
(function(factory) {
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["backbone", "jquery", "underscore", "TweenLite"], function(Backbone, $, _, TweenLite) {
            return factory(Backbone, $, _, TweenLite);
        });
    } else {
        root.PinIt = factory(root.Backbone, root.$, root._, root.TweenLite);
    }
})(function(Backbone, $, _, TweenLite) {

    return function(config) {

        var dynamicCouples = [];

        var DynamicPointModel = Backbone.Model.extend({
            defaults: config.props,
            initialize: function() {
                this.on("change", this.modelChanged);
            },
            modelChanged: function() {

            }
        });


        var DynamicCouple = function(dynamicPoint, $element) {
            var t = this;
            this.point = dynamicPoint;
            this.element = $element;
            var cssValues = {};

            this.init = function() {

                // écoute du modèle
                this.point.on("change", onPointChanged);

                // écoute du DOM
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        onElementChanged(mutation);
                    });
                });

                var config = { attributes: true };
                observer.observe($element.get(0), config);

                // on initialise les propriétés du DOM
                _.each(config.props, function(value, key) {
                    if (isGreensockTransformKey(config.bindings[key].css)) {
                        TweenLite.set($element.get(0), {
                            css: {

                            }
                        });
                    } else {

                    }
                });
            };

            function onPointChanged(e) {
                console.log("Point changed:");
                console.log(e);
            }


            function isGreensockTransformKey(key) {
                return (key === "x" || key === "y" || key === "scale");
            }


            function onElementChanged(mutation) {
                console.log("Element changed:");
                console.log(mutation);

                // l'élément a subi un changement dans ses attributs. On enregistre les changements dans le modèle
                if (mutation.type === "attributes" && mutation.attributeName === "style") {

                    _.each(config.props, function(value, key) {

                        var cssKeyName = config.bindings[key].css;
                        var currentValue;

                        if (isGreensockTransformKey(cssKeyName)) {
                            // cas particulier de transform gérés par les classes Greensock, en attendant mieux
                            currentValue = mutation.target._gsTransform[cssKeyName];
                        } else {
                            // cas basique de style inline
                            currentValue = $element.css(cssKeyName);
                        }

                        if (currentValue !== cssValues[key]) {
                            t.set(key, currentValue);
                            cssValues[key] = currentValue;
                        }
                    });
                }
            }

            this.set = function(key, value) {
                t.point.set(key, value);
            }
        };


        this.createCouple = function(initProps, element) {

            var point = new DynamicPointModel(initProps);
            var couple = new DynamicCouple(point, element);
            couple.init();

            return couple;
        }
    }
});