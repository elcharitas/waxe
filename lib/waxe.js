"use strict";
var debug_1 = require("./debug");
var core_1 = require("./compiler/core");
var parser_1 = require("./compiler/parser");
var blob_1 = require("./blob");
var core_2 = require("./plugins/core");
module.exports = /** @class */ (function () {
    function Wax() {
        if (typeof this !== "object") {
            throw debug_1.dbg("Wax", this);
        }
        this.configs = blob_1.WaxConfig;
        this.delimiter = blob_1.WaxDelimiter;
        this.tags = {};
        this.plugins = {};
        this.templates = {};
    }
    Wax.setDelimiter = function (delimiter) {
        return Wax.core.delimiter = delimiter;
    };
    Wax.getDelimiter = function () {
        return Wax.core.delimiter;
    };
    Wax.getConfigs = function () {
        return Wax.core.configs;
    };
    Wax.template = function (name, text, config) {
        if (config === void 0) { config = this.getConfigs(); }
        if (typeof text === "string") {
            return this.core.templates[name] = parser_1.genTemplate(parser_1.transpile.call(Wax, text, core_1.mkConfig(config, Wax.getDelimiter())), name);
        }
        else {
            throw debug_1.dbg("text", text);
        }
    };
    Wax.parseEl = function (selectors, context, visible) {
        if (context === void 0) { context = {}; }
        if (visible === void 0) { visible = true; }
        if (typeof document !== "undefined") {
            document.querySelectorAll(selectors).forEach(function (element) {
                element.innerHTML = element.value = Wax.template(element.id, element.value || element.innerHTML)(context);
                if ('hidden' in element)
                    element.hidden = !visible;
            });
        }
    };
    Wax.directive = function (tag, descriptor) {
        return this.core.tags[tag] = { tag: tag, descriptor: descriptor };
    };
    Wax.global = function (name, value) {
        if (value === void 0) { value = null; }
        return this.core.configs.context[name] = value;
    };
    Wax.getTag = function (tagOpts) {
        var tagDef = this.core.tags[tagOpts.tag] || null;
        if (typeof tagDef === "object" && tagDef !== null) {
            for (var def in tagOpts) {
                tagDef[def] = tagOpts[def];
            }
        }
        return tagDef;
    };
    Wax.addPlugin = function (classLabel) {
        var _a = new classLabel(this).directives, directives = _a === void 0 ? {} : _a;
        for (var tag in directives) {
            this.directive(tag, directives[tag]);
        }
    };
    Object.defineProperty(Wax, "core", {
        /**
         * Gets or Creates the Wax instance
         *
         * @returns Wax
         */
        get: function () {
            if (!(this._core instanceof Wax)) {
                this._core = new Wax;
                Wax.addPlugin(core_2.CoreWax);
            }
            return this._core;
        },
        enumerable: false,
        configurable: true
    });
    return Wax;
}());
