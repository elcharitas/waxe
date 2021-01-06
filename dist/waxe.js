(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Wax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaxTemplate = exports.WaxDelimiter = exports.WaxConfig = void 0;
var WaxConfig = {
    strip: true,
    throwUndefined: false,
    autoescape: true,
    context: {
        now: Date.now()
    }
};
exports.WaxConfig = WaxConfig;
var WaxDelimiter = {
    blockSyntax: "@([_\\w]+)(\\(([^@]+)\\))*",
    tagName: 1,
    argList: 2,
    endPrefix: 'end',
};
exports.WaxDelimiter = WaxDelimiter;
var WaxTemplate = function (context) {
    if (context === void 0) { context = {}; }
    return null;
};
exports.WaxTemplate = WaxTemplate;

},{}],2:[function(require,module,exports){
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
    var template = blob_1.WaxTemplate, holder = blob_1.WaxTemplate;
    try {
        holder = new Function('out, scope', "out+=" + source + ";return out");
        template = holder.bind(parser.core.configs.context, '');
    }
    catch (e) { }
    template.source = holder.toString();
    return template;
}
exports.bind = bind;

},{"../blob":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkConfig = void 0;
var blob_1 = require("../blob");
function mkConfig(config, delimiter) {
    var cfg = blob_1.WaxConfig;
    cfg.delimiter = blob_1.WaxDelimiter;
    for (var bar in delimiter) {
        cfg.delimiter[bar] = delimiter[bar];
    }
    for (var cf in config) {
        cfg[cf] = config[cf];
    }
    return cfg;
}
exports.mkConfig = mkConfig;

},{"../blob":1}],4:[function(require,module,exports){
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

},{"../blob":1,"./binder":2,"./traverse":5,"./walker":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = void 0;
function traverse(source, delimiter) {
    var argList = delimiter.argList, blockSyntax = delimiter.blockSyntax, tagName = delimiter.tagName, endPrefix = delimiter.endPrefix, text = JSON.stringify(source), directiveSyntax = "(" + blockSyntax + ")", directives = text.match(new RegExp(directiveSyntax, 'g'));
    return {
        text: text,
        directives: directives,
        argList: argList,
        blockSyntax: blockSyntax,
        tagName: tagName,
        endPrefix: endPrefix
    };
}
exports.traverse = traverse;

},{}],6:[function(require,module,exports){
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

},{"../debug":7}],7:[function(require,module,exports){
(function (global){(function (){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbg = exports.formatDbg = void 0;
var MessageList = __importStar(require("./messages.json"));
var Message = MessageList;
function formatDbg(name, args) {
    if (Message.hasOwnProperty(name)) {
        var _a = Message, _b = name, _c = args.length - 1, _d = _a[_b][_c], msg_1 = _d === void 0 ? '' : _d;
        args.forEach(function (arg, index) {
            msg_1 = msg_1.replace("%" + (index + 1), arg === null || arg === void 0 ? void 0 : arg.toString());
        });
        return msg_1;
    }
}
exports.formatDbg = formatDbg;
function dbg(check, constraint) {
    var args = [], dbg;
    switch (typeof check) {
        case 'object':
            if (constraint && !(check instanceof constraint)) {
                dbg = "TypeError";
                args.push(check, constraint);
            }
        default:
            if (typeof check !== typeof constraint) {
                dbg = "TypeError";
                args.push(check.name || check, constraint ? typeof check : 'class', !constraint ? 'initialized' : 'declared');
            }
    }
    return dbg ? new (typeof global !== "undefined" ? global : window)[dbg](formatDbg(dbg, args)) : null;
}
exports.dbg = dbg;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./messages.json":8}],8:[function(require,module,exports){
module.exports={
    "TypeError": [
        null,
        "%1 should be of %2's type",
        "%1 should be %3 as a %2"
    ]
}

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./directives":9}],11:[function(require,module,exports){
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
        var tagDef = this.core.tags[tagOpts.tag];
        if (typeof tagDef === "object") {
            for (var def in tagOpts) {
                tagDef[def] = tagOpts[def];
            }
            return tagDef;
        }
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

},{"./blob":1,"./compiler/core":3,"./compiler/parser":4,"./debug":7,"./plugins/core":10}]},{},[11])(11)
});
