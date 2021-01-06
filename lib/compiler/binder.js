"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = exports.namefn = void 0;
var blob_1 = require("../blob");
function namefn(name, fn) {
    var finalFn = (new Function("return function (call) { return function " + name + " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
    finalFn.source = fn.source.replace('anonymous', name);
    return finalFn;
}
exports.namefn = namefn;
function bind(parser, source) {
    var template = blob_1.WaxTemplate, holder;
    try {
        holder = new Function('out, scope', "out+=" + source + ";return out");
        template = holder.bind(parser.core.configs.context, '');
        template.source = holder.toString();
    }
    catch (e) { }
    return template;
}
exports.bind = bind;
