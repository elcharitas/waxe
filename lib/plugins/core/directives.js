"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDirectives = void 0;
var CoreDirectives = /** @class */ (function () {
    function CoreDirectives() {
    }
    CoreDirectives.prototype.elseif = function (literal) {
        return "} else if(" + literal + ") {";
    };
    CoreDirectives.prototype.else = function () {
        return "} else {";
    };
    CoreDirectives.prototype.switch = function (literal) {
        return "switch" + literal + "{/*";
    };
    CoreDirectives.prototype.case = function (literal) {
        return "*/case " + literal + ":";
    };
    CoreDirectives.prototype.break = function () {
        return 'break;/*';
    };
    CoreDirectives.prototype.endswitch = function () {
        return '*/}';
    };
    CoreDirectives.prototype.forelse = function (literal) {
        var obj = literal.text().split(/\s+/)[2];
        return "var loopObj = " + obj + ";for" + literal + "{";
    };
    CoreDirectives.prototype.empty = function () {
        return "} if(typeof loopObj !== \"object\" || Object.keys(loopObj).length < 1){";
    };
    CoreDirectives.prototype.endforelse = function () {
        return '};delete loopObj';
    };
    CoreDirectives.prototype.define = function (literal) {
        return "scope[" + literal.arg(0) + "] = " + literal.arg(1);
    };
    CoreDirectives.prototype.yield = function (literal) {
        return 'out+=' + literal.arg(0);
    };
    CoreDirectives.prototype.bind = function (literal) {
        var hook = literal.arg(1), el = literal.arg(0);
        return "out+=this[\"bind" + el + "\"]=" + hook + ";setInterval(function(){\n            document.querySelectorAll(" + el + ").forEach(function(hook){\n                if(this[\"bind" + el + "\"] !== " + hook + "){\n                    hook.value = this[\"bind" + el + "\"] = " + hook + "\n                }\n            })\n        })";
    };
    CoreDirectives.prototype.comment = function (literal) {
        return '/*' + literal.arg(0) + '*/';
    };
    return CoreDirectives;
}());
exports.CoreDirectives = CoreDirectives;
