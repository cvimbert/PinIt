/**
 * Created by Christophe on 27/05/2016.
 */
(function(factory) {
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["underscore", "TweenLite", "dynamicpoint"], function(_, TweenLite, DynamicPoint) {
            return factory(_, TweenLite, DynamicPoint);
        });
    } else {
        root.PinIt = factory(root._, root.TweenLite, root.DynamicPoint);
    }
})(function(_, TweenLite, DynamicPoint) {

    return function(config) {

        var dynamicCouples = [];


        /**
         * Dynamic couple object
         * @param dynamicPoint
         * @param $element
         * @constructor
         */
        var DynamicCouple = function(dynamicPoint, $element) {
            var t = this;
            var cssValues = {};

            this.init = function() {

                // écoute du modèle
                dynamicPoint.on("change", onPointChanged);

                // écoute du DOM
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        onElementChanged(mutation);
                    });
                });

                var observerConfig = { attributes: true };
                observer.observe($element.get(0), observerConfig);

                // initialisation de l'objet cssValues (valeurs courantes des attributs)
                dynamicPoint.foreach(function(e) {
                    cssValues[e.key] = e.value;
                });

                // on met à jour toutes les objets liés
                dynamicPoint.triggerChanges();
            };

            function onPointChanged(e) {
                console.log("Point changed:");
                console.log(e);

                var bindedAttributeName = config.bindings[e.key].css;

                if (isGreensockTransformKey(bindedAttributeName)) {
                    var cssObject = {};
                    cssObject[bindedAttributeName] = e.value;

                    TweenLite.set($element.get(0), {
                        css: cssObject
                    });
                } else {
                    $element.css(bindedAttributeName, e.value);
                }
            }


            function isGreensockTransformKey(key) {
                return (key === "x" || key === "y" || key === "scale");
            }


            function onElementChanged(mutation) {
                console.log("Element changed:");

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
                            dynamicPoint.set(key, currentValue);
                            cssValues[key] = currentValue;
                        }
                    });

                    console.log(cssValues);
                }
            }
        };


        this.createCouple = function(initProps, element) {
            var point = new DynamicPoint(initProps);
            var couple = new DynamicCouple(point, element);
            couple.init();

            return couple;
        };


        this.bind = function(dynamicPoint, element) {
            var couple = new DynamicCouple(dynamicPoint, element);
            couple.init();

            return couple;
        };
    }
});