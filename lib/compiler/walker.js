"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("../debug");
var Walker = /** @class */ (function () {
    function Walker(root) {
        if (root === void 0) { root = {}; }
        if (typeof this !== "object") {
            throw debug_1.dbg(Walker, this);
        }
        this.directives = root.directives;
        this.argList = root.argList;
        this.blockSyntax = root.blockSyntax;
        this.tagName = root.tagName;
        this.text = root.text;
        this.endPrefix = root.endPrefix;
    }
    Walker.prototype.walk = function (parser, text) {
        var _this = this;
        var _a;
        if (text === void 0) { text = this.text; }
        (_a = this.directives) === null || _a === void 0 ? void 0 : _a.forEach(function (block, position) {
            var _a = block.match(_this.blockSyntax), _b = _this.tagName, tag = _a[_b], _c = _this.argList, _d = _a[_c], argLiteral = _d === void 0 ? '' : _d, result = '', node;
            argLiteral = argLiteral.replace('$', '(scope||this).');
            if (node = parser.getTag({ tag: tag, argLiteral: argLiteral, block: block, position: position })) {
                node.source = JSON.parse(_this.text);
                result = node.descriptor.call(node, _this.toArgs(argLiteral));
            }
            else if (['for', 'if', 'while', 'switch'].indexOf(tag) > -1) {
                result = tag + argLiteral + '{';
            }
            else if (tag.indexOf(_this.endPrefix) === 0) {
                result = '}';
            }
            text = text.replace(block, "\";" + result + "\nout+=\"");
        });
        return text;
    };
    Walker.prototype.toArgs = function (literal) {
        var argLiteral = new String(literal);
        argLiteral.arg = function (key) {
            return "[" + argLiteral.text() + "][" + key + "]";
        };
        argLiteral.text = function () {
            return argLiteral.replace(/^\(([\s\S]*)\)$/, '$1');
        };
        return argLiteral;
    };
    return Walker;
}());
exports.default = Walker;
