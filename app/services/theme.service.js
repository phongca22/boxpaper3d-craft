(function () {
    'use strict';
    angular
        .module(APP_CONF.module)
        .factory('ThemeService', ThemeService);

    ThemeService.$inject = ['themeProvider', '$mdTheming', '$mdColorPalette'];
    function ThemeService(themeProvider, $mdTheming, $mdColorPalette) {
        var service = this;
        var themeIndex = 1;
        var stored = {};
        var generator = new ColorGen();
        var PRI_PALETTE = "customPrimary";
        var ACC_PALETTE = "customAccent";
        var HUE = {
            'default': '500',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': 'A100'
        };

        service.getHex = getHex;
        service.getName = getName;
        service.getRgb = getRgb;
        service.getTextColor = getTextColor;

        service.setTheme = function(primary, accent){
            validatePalette(primary, accent);
            var themeName = getThemeName();
            var pri = definePalette(PRI_PALETTE, primary);
            var acc = definePalette(ACC_PALETTE, accent);

            if (stored[primary + "-" + accent]) {
                return stored[primary + "-" + accent];
            } else {
                themeProvider.theme(themeName)
                .primaryPalette(pri.name, pri.hue)
                .accentPalette(acc.name, acc.hue);

                $mdTheming.generateTheme(themeName);
                stored[pri.name + "-" + acc.name] = themeName;
            }

            return themeName;
        };

        function getThemeName() {
            return "customTheme" + themeIndex++;
        }

        function validatePalette(primary, accent) {
//            primary = primary || "blue";
//            accent = accent || "pink";
        }

        function definePalette(name, hex) {
            if (isDefaultColor(hex)) {
                return {
                    name: hex,
                    hue: null
                }
            } else {
                var t = getHex(hex);
                themeProvider.definePalette(name, generator.getPalette(t));
                return {
                    name: name,
                    hue: HUE
                }
            }
        }

        function isDefaultColor(name) {
            return typeof $mdColorPalette[name] !== "undefined";
        }

        function getHex(name, shade) {
            var obj = $mdColorPalette[name];
            if (!obj) {
                var gen = generator.getPalette(name);
                return shade ? gen[shade].hex : name;
            }

            return $mdColorPalette[name][shade || (name == APP_CONF.accentPalette ? "A200" : "500")].hex;
        }

        function getName(hex) {
            for (var name in $mdColorPalette) {
                var hues = $mdColorPalette[name];
                if (hues["500"].hex == hex) return name;
            }

            return hex;
        }

        function getRgb(name, shade) {
            var hex = getHex(name, shade);
            var t = tinycolor(hex).toRgb();
            return [t.r, t.g, t.b];
        }

        function getTextColor(palette, shade) {
            var hex = getHex(palette || APP_CONF.primaryPalette, shade);
            var t = tinycolor(hex).toRgb();
            var rgb = [t.r, t.g, t.b];
            var nThreshold = 105;
            var bgDelta = (rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114);
            return ((255 - bgDelta) < nThreshold) ? "rgba(0, 0, 0, 0.54)" : "rgba(255, 255, 255, 0.78)";
        }

        return service;
    }

    function ColorGen() {
        ColorGen.prototype.get = function(hex) {
            return compute(hex);
        };

        ColorGen.prototype.getPalette = function(hex) {
            var list = this.get(hex);
            var obj = {
                contrastDefaultColor: "light",
                contrastDarkColors: [],
                contrastLightColors: [],
            };

            for (var i = 0; i < list.length; i++) {
                var name = list[i].name;
                var hex = list[i].hex;
                var rgb = tinycolor(hex).toRgb();
                obj[name] = {
                    contrast: list[i].darkContrast ? [0, 0, 0, 0.87] : [255, 255, 255, 0.87],
                    hex: hex,
                    value: [rgb.r, rgb.g, rgb.b]
                };

                if (list[i].darkContrast) {
                    obj.contrastDarkColors.push(name + "");
                } else {
                    obj.contrastLightColors.push(name + "");
                }
            }

            return obj;
        };

        function getColorObject(value, name) {
            var c = tinycolor(value);
            return {
                name : name,
                hex : c.toHexString(),
                darkContrast : c.isLight()
            };
        }

        function multiply(rgb1, rgb2){
            rgb1.b = Math.floor(rgb1.b * rgb2.b / 255);
            rgb1.g = Math.floor(rgb1.g * rgb2.g / 255);
            rgb1.r = Math.floor(rgb1.r * rgb2.r / 255);
            return tinycolor('rgb ' + rgb1.r + ' ' + rgb1.g + ' ' + rgb1.b);
        }

        function compute(hex, algorithm) {
            var baseLight = tinycolor('#ffffff');
            var baseDark = multiply(tinycolor(hex).toRgb(), tinycolor(hex).toRgb());
            var baseTriad = tinycolor(hex).tetrad();
            if (algorithm == "constantin")
            return [getColorObject(tinycolor.mix(baseLight, hex, 12), '50'),
                getColorObject(tinycolor.mix(baseLight, hex, 30), '100'),
                getColorObject(tinycolor.mix(baseLight, hex, 50), '200'),
                getColorObject(tinycolor.mix(baseLight, hex, 70), '300'),
                getColorObject(tinycolor.mix(baseLight, hex, 85), '400'),
                getColorObject(tinycolor.mix(baseLight, hex, 100), '500'),
                getColorObject(tinycolor.mix(baseDark, hex, 87), '600'),
                getColorObject(tinycolor.mix(baseDark, hex, 70), '700'),
                getColorObject(tinycolor.mix(baseDark, hex, 54), '800'),
                getColorObject(tinycolor.mix(baseDark, hex, 25), '900'),
                getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(80).lighten(65), 'A100'),
                getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(80).lighten(55), 'A200'),
                getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(100).lighten(45), 'A400'),
                getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(100).lighten(40), 'A700')];
            else
            return [
                getColorObject(tinycolor(hex).lighten(52), '50'),
                getColorObject(tinycolor(hex).lighten(37), '100'),
                getColorObject(tinycolor(hex).lighten(26), '200'),
                getColorObject(tinycolor(hex).lighten(12), '300'),
                getColorObject(tinycolor(hex).lighten(6), '400'),
                getColorObject(tinycolor(hex), '500'),
                getColorObject(tinycolor(hex).darken(6), '600'),
                getColorObject(tinycolor(hex).darken(12), '700'),
                getColorObject(tinycolor(hex).darken(18), '800'),
                getColorObject(tinycolor(hex).darken(24), '900'),
                getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
                getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
                getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
                getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700')
            ];
        }
    }
})();
