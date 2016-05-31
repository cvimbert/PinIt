/**
 * Created by Christophe on 27/05/2016.
 */
(function(factory) {
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);

    if (typeof define === 'function' && define.amd) {
        define(["backbone"], function(Backbone) {
            return factory(Backbone);
        });
    } else {
        root.PinIt = factory(root.Backbone);
    }
})(function(Backbone) {

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

            // écoute du modèle
            this.point.on("change", onPointChanged);

            // écoute de l'élément lié dans le DOM
            // DOMAttrModified
            $element.get(0).addEventListener("DOMSubtreeModified", onElementChanged);
            //$element.on("DOMSubtreeModified", onElementChanged);

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    console.log(mutation);
                });
            });

            var config = { attributes: true, childList: true, characterData: true };
            observer.observe($element.get(0), config);

            function onPointChanged(e) {
                console.log("Point changed:");
                console.log(e);
            }

            function onElementChanged(e) {
                console.log("Element changed:");
                console.log(e);
            }

            this.set = function(key, value) {
                t.point.set(key, value);
            }
        };


        this.createCouple = function(initProps, element) {

            var point = new DynamicPointModel(initProps);
            var couple = new DynamicCouple(point, element);

            return couple;
        }
    }
});