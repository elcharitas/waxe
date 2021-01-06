"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreWax = void 0;
var directives_1 = require("./directives");
var CoreWax = /** @class */ (function () {
    function CoreWax(Wax) {
        this.directives = new directives_1.CoreDirectives;
    }
    return CoreWax;
}());
exports.CoreWax = CoreWax;
