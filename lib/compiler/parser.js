"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genTemplate = exports.transpile = void 0;
var binder_1 = require("./binder");
var traverse_1 = require("./traverse");
var blob_1 = require("../blob");
var walker_1 = __importDefault(require("./walker"));
function transpile(source, config) {
    var treeRoot = traverse_1.traverse(source, config.delimiter);
    var text = new walker_1.default(treeRoot).walk(this);
    if (config.strip === true) {
        text = text.replace(/\\n\s+/g, '');
    }
    return binder_1.bind(this, text);
}
exports.transpile = transpile;
exports.genTemplate = function (template, name) {
    if (template === void 0) { template = blob_1.WaxTemplate; }
    if (name === void 0) { name = 'waxe-' + Date.now(); }
    return binder_1.namefn(name, template);
};
