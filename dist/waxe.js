(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Wax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflictProp = exports.encodeHTML = exports.WaxDelimiter = exports.WaxTemplate = exports.WaxConfig = void 0;
/**
 * Encodes HTML to prevent malicious input
 *
 * @param {string} html - The suspected html
 * @returns string
 */
function encodeHTML(html) {
    var encodeRules = {
        '&': '&#38;',
        '<': '&#60;',
        '>': '&#62;',
        '"': '&#34;',
        '\'': '&#39;',
        '/': '&#47;',
    };
    var matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
    return typeof html === 'string' ? html.replace(matchHTML, function (m) { return encodeRules[m] || m; }) : html;
}
exports.encodeHTML = encodeHTML;
function conflictProp(context, props) {
    if (props === void 0) { props = Object.keys(context); }
    var config = {
        writable: false,
        configurable: false
    };
    props.forEach(function (name) {
        Object.defineProperty(context, name, config);
    });
}
exports.conflictProp = conflictProp;
var WaxTemplate = function (context) {
    if (context === void 0) { context = {}; }
    return null;
};
exports.WaxTemplate = WaxTemplate;
var WaxDelimiter = {
    blockSyntax: '@(\\w+)(\\([^@]+\\))?',
    tagName: 1,
    argList: 2,
    endPrefix: 'end'
};
exports.WaxDelimiter = WaxDelimiter;
/** The default configurations */
var WaxConfig = {
    strip: true,
    throwUndefined: false,
    autoescape: true,
    delimiter: WaxDelimiter,
    context: {
        startTime: Date.now(),
        now: function () {
            return Date.now();
        },
        escape: function (text, strict) {
            if (strict === void 0) { strict = false; }
            text = encodeHTML(text);
            if (strict === true) {
                text = (escape || String)(text);
            }
            return text;
        },
        merge: function (args) {
            var _this = this;
            if (args === void 0) { args = []; }
            args = [].slice.call(args);
            args.forEach(function (arg) {
                for (var name_1 in arg) {
                    _this[name_1] = arg[name_1];
                }
            });
        },
        reverse: function (text, delimiter) {
            if (delimiter === void 0) { delimiter = ''; }
            return text.split(delimiter).reverse().join(delimiter);
        }
    }
};
exports.WaxConfig = WaxConfig;
/** prevent mutation */
conflictProp(WaxConfig.context);

},{}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTemplate = exports.parseString = exports.traverseNode = void 0;
var _1 = require(".");
var walker_1 = __importDefault(require("./walker"));
function renameTemplate(name, sourceFn, parser) {
    return new Function('call', 'return function ' + name + '(){return call(this,arguments)}')(Function.apply.bind(sourceFn.bind(parser.getConfigs().context, '')));
}
function bind(source) {
    var template = _1.WaxTemplate;
    try {
        template = new Function('out', "this.merge(arguments);out+=" + source + ";return out");
    }
    catch (e) { }
    return template;
}
function transpile(parser, source, config) {
    var treeRoot = traverse(source, config.delimiter);
    var text = new walker_1.default(parser, treeRoot).walk();
    if (config.strip === true) {
        text = text.replace(/\\n\s+/g, '');
    }
    return bind(text);
}
function traverse(source, delimiter) {
    var argList = delimiter.argList, blockSyntax = delimiter.blockSyntax, tagName = delimiter.tagName, endPrefix = delimiter.endPrefix, text = JSON.stringify(source), directives = text.match(new RegExp("(" + blockSyntax + ")", 'g'));
    return {
        text: text,
        directives: directives,
        argList: argList,
        blockSyntax: blockSyntax,
        tagName: tagName,
        endPrefix: endPrefix
    };
}
function traverseNode(walker, tagOpts) {
    var tag = tagOpts.tag, argLiteral = tagOpts.argLiteral;
    var result = '', node = null;
    if (node = walker.parser.getTag(tagOpts)) {
        result = node.descriptor.call(node, argLiteral);
    }
    else if (walker.jsTags.indexOf(tag) > -1) {
        result = tag + argLiteral.parse() + '{';
    }
    else if (walker.isBlockEnd(tag)) {
        result = '}';
    }
    return result;
}
exports.traverseNode = traverseNode;
function parseString(literal) {
    var list = literal.split('');
    var inString = null;
    list.forEach(function (char, index) {
        if (char != inString && (inString == '"' || inString == '\'')) {
            inString = char;
        }
        else if (inString == char) {
            inString = null;
        }
        else if (!inString && char == '$') {
            char = 'this.';
        }
        else if (!inString && char == ';') {
            var hold = list[index - 3] + list[index - 2] + list[index - 1];
            if (hold.match(/^&(g|l)t$/)) {
                list[index - 1] = list[index - 2] = list[index - 3] = '';
                char = hold.replace('&gt', '>')
                    .replace('&lt', '<');
            }
        }
        list[index] = char;
    });
    return list.join('');
}
exports.parseString = parseString;
;
function parseTemplate(name, source, parser) {
    if (name === void 0) { name = 'waxe-' + Date.now(); }
    if (source === void 0) { source = ''; }
    if (parser === void 0) { parser = null; }
    return renameTemplate(name, transpile(parser, source, parser.getConfigs()), parser);
}
exports.parseTemplate = parseTemplate;
;

},{".":1,"./walker":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("../debug");
var parser_1 = require("./parser");
var Walker = /** @class */ (function () {
    function Walker(parser, root) {
        if (root === void 0) { root = {}; }
        debug_1.dbg('Walker', this);
        this.directives = root.directives;
        this.argList = root.argList;
        this.blockSyntax = root.blockSyntax;
        this.tagName = root.tagName;
        this.text = root.text;
        this.endPrefix = root.endPrefix;
        this.jsTags = ['for', 'if', 'while', 'switch'];
        this.parser = parser;
    }
    Walker.prototype.walk = function (text) {
        var _this = this;
        var _a;
        if (text === void 0) { text = this.text; }
        (_a = this.directives) === null || _a === void 0 ? void 0 : _a.forEach(function (rawBlock, position) {
            var block = JSON.parse("\"" + rawBlock + "\""), _a = block.match(_this.blockSyntax), _b = _this.tagName, tag = _a[_b], _c = _this.argList, _d = _a[_c], argList = _d === void 0 ? '' : _d, configs = _this.parser.getConfigs(), argLiteral = _this.toArgs(argList);
            text = text.replace(rawBlock, "\";" + parser_1.traverseNode(_this, { tag: tag, argLiteral: argLiteral, block: block, position: position, configs: configs, context: configs.context }) + "\nout+=\"");
        });
        return text;
    };
    Walker.prototype.isBlockEnd = function (realTag, tag) {
        if (realTag === void 0) { realTag = ''; }
        if (tag === void 0) { tag = realTag.replace(this.endPrefix, ''); }
        return realTag.indexOf(this.endPrefix) === 0 && (this.jsTags.indexOf(tag) > -1 || this.parser.getTag({ tag: tag }) !== null);
    };
    Walker.prototype.toArgs = function (list) {
        var argLiteral = new String(list);
        argLiteral.arg = function (key) {
            return "[" + argLiteral.text() + "][" + key + "]";
        };
        argLiteral.parse = function () {
            return parser_1.parseString(argLiteral);
        };
        argLiteral.text = function () {
            return argLiteral.parse().replace(/^\(([\s\S]*)\)$/, '$1');
        };
        return argLiteral;
    };
    return Walker;
}());
exports.default = Walker;

},{"../debug":4,"./parser":2}],4:[function(require,module,exports){
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
exports.dbg = exports.formatDbg = exports.dbgType = exports.debugProp = exports.debugkit = void 0;
var MessageList = __importStar(require("./list.json"));
var Message = MessageList;
exports.debugkit = typeof global !== 'undefined' ? global : window;
function debugProp(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}
exports.debugProp = debugProp;
function dbgType(args, constraint, expected) {
    if (typeof constraint !== typeof expected) {
        args.push(typeof expected);
    }
    if (typeof constraint === 'undefined' && typeof expected === 'object') {
        args.push('initialized');
    }
    else if (typeof expected !== 'object') {
        args.push('declared');
    }
    return args;
}
exports.dbgType = dbgType;
function formatDbg(name, args) {
    if (debugProp(Message, name)) {
        var _a = Message, _b = name, _c = args.length - 2, _d = _a[_b][_c], msg_1 = _d === void 0 ? '' : _d;
        args.forEach(function (arg, index) {
            msg_1 = msg_1.replace("%" + (index + 1), arg === null || arg === void 0 ? void 0 : arg.toString());
        });
        return msg_1;
    }
}
exports.formatDbg = formatDbg;
function dbg(check, constraint, expected, dbgFor) {
    if (expected === void 0) { expected = {}; }
    if (dbgFor === void 0) { dbgFor = 'Type'; }
    var args = [], debugArg = check === null || check === void 0 ? void 0 : check.toString(), debugStack = null;
    dbgFor += 'Error';
    if (debugProp(exports.debugkit, dbgFor)) {
        args = dbgType([check], constraint, expected);
        debugStack = exports.debugkit[dbgFor];
        debugArg = formatDbg(dbgFor, args);
    }
    if (args.length > 1 && debugStack !== null) {
        throw new debugStack(debugArg);
    }
}
exports.dbg = dbg;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./list.json":5}],5:[function(require,module,exports){
module.exports={
    "TypeError": [
        "%1 should be of %2's type",
        "%1 should be %3 as a %2"
    ]
}

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDirectives = void 0;
var CoreDirectives = /** @class */ (function () {
    function CoreDirectives() {
    }
    CoreDirectives.prototype.set = function (literal) {
        return "eval(" + literal.arg(0) + "+\"=\"+" + JSON.stringify(literal.arg(1)) + ");";
    };
    CoreDirectives.prototype.define = function (literal) {
        return "this[" + literal.arg(0) + "] = " + literal.arg(1) + ";";
    };
    CoreDirectives.prototype.macro = function (literal) {
        return "this[" + literal.arg(0) + "] = function(){var name = " + literal.arg(0) + "; var call = this[name]; var args=[].slice.call(arguments);var out = \"\";";
    };
    CoreDirectives.prototype.endmacro = function () {
        return "return out;}";
    };
    CoreDirectives.prototype.include = function (literal) {
        return "out+=Wax.template(" + literal.arg(0) + ")(" + literal.arg(1) + ",this);";
    };
    CoreDirectives.prototype.yield = function (literal) {
        return "out+=(" + this.configs.autoescape + " ? this.escape: String)(" + (literal.arg(0) || literal.arg(1)) + ");";
    };
    CoreDirectives.prototype.elseif = function (literal) {
        return "} else if(" + literal + ") {";
    };
    CoreDirectives.prototype.else = function () {
        return '} else {';
    };
    CoreDirectives.prototype.switch = function (literal) {
        return "switch" + literal + "{/*";
    };
    CoreDirectives.prototype.case = function (literal) {
        return "*/case " + literal + ":";
    };
    CoreDirectives.prototype.break = function (literal) {
        return 'break;/*';
    };
    CoreDirectives.prototype.continue = function (literal) {
        return "continue;";
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
        return "};delete loopObj;";
    };
    return CoreDirectives;
}());
exports.CoreDirectives = CoreDirectives;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreWax = void 0;
var core_1 = require("./core");
var misc_1 = require("./misc");
var CoreWax = /** @class */ (function () {
    function CoreWax(Wax) {
        this.directives = new (core_1.CoreDirectives.bind(new misc_1.MiscDirectives));
    }
    return CoreWax;
}());
exports.CoreWax = CoreWax;

},{"./core":6,"./misc":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscDirectives = void 0;
var MiscDirectives = /** @class */ (function () {
    function MiscDirectives() {
    }
    MiscDirectives.prototype.includeIf = function (literal) {
        return "out+=(Wax.template(" + literal.arg(0) + ")||new Function(\"return ''\"))(" + literal.arg(1) + ",this);";
    };
    MiscDirectives.prototype.includeWhen = function (literal) {
        return "out+=" + literal.arg(0) + "?Wax.template(" + literal.arg(1) + ")(" + literal.arg(2) + ",this):\"\";";
    };
    MiscDirectives.prototype.bind = function (literal) {
        var hook = literal.arg(1), el = literal.arg(0);
        return "out+=this[\"bind" + el + "\"]=" + hook + ";setInterval(function(){\n            document.querySelectorAll(" + el + ").forEach(function(hook){\n                if(this[\"bind" + el + "\"] !== " + hook + "){\n                    hook.value = this[\"bind" + el + "\"] = " + hook + "\n                }\n            })\n        });";
    };
    MiscDirectives.prototype.escape = function (literal) {
        return "out+=this.escape(" + (literal.arg(0) || literal.arg(1)) + ");";
    };
    MiscDirectives.prototype.json = function (literal) {
        return "out+=JSON.stringify" + literal;
    };
    MiscDirectives.prototype.js = function () {
        return 'var holdjs = out;';
    };
    MiscDirectives.prototype.endjs = function () {
        return 'holdjs=this.reverse(out).replace(this.reverse(holdjs), "");out=this.reverse(this.reverse(out).replace(holdjs, ""));(new Function(this.reverse(holdjs))).bind(this)();delete holdjs';
    };
    MiscDirectives.prototype.comment = function (literal) {
        return "/*" + literal + "*/";
    };
    return MiscDirectives;
}());
exports.MiscDirectives = MiscDirectives;

},{}],9:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var debug_1 = require("./debug");
var compiler_1 = require("./compiler");
var parser_1 = require("./compiler/parser");
var plugins_1 = require("./plugins");
module.exports = /** @class */ (function () {
    function Wax() {
        debug_1.dbg('Wax', this);
        this.configs = compiler_1.WaxConfig;
        this.tags = {};
        this.plugins = {};
        this.templates = {};
    }
    Wax.global = function (name, value) {
        if (value === void 0) { value = null; }
        return this.core.configs.context[name] = value;
    };
    Wax.directive = function (tag, descriptor) {
        return this.core.tags[tag] = { tag: tag, descriptor: descriptor };
    };
    Wax.setDelimiter = function (delimiter) {
        return Wax.core.configs.delimiter = __assign(__assign({}, Wax.getDelimiter()), delimiter);
    };
    Wax.getConfigs = function () {
        return Wax.core.configs;
    };
    Wax.getDelimiter = function () {
        return Wax.getConfigs().delimiter;
    };
    Wax.getTag = function (tagOpts) {
        var tagDef = this.core.tags[tagOpts.tag] || null;
        if (typeof tagDef === 'object' && tagDef !== null) {
            tagDef = __assign(__assign({}, tagDef), tagOpts);
        }
        return tagDef;
    };
    Wax.addPlugin = function (classLabel) {
        var _a = new classLabel(this).directives, directives = _a === void 0 ? {} : _a;
        for (var tag in directives) {
            this.directive(tag, directives[tag]);
        }
    };
    Wax.template = function (name, source, config) {
        if (config === void 0) { config = this.getConfigs(); }
        if (typeof source === 'string') {
            this.core.templates[name] = parser_1.parseTemplate(name, source, Wax);
        }
        return this.core.templates[name];
    };
    Wax.resolve = function (selectors, context, visible) {
        if (context === void 0) { context = {}; }
        if (visible === void 0) { visible = true; }
        if (typeof document !== 'undefined') {
            document.querySelectorAll(selectors).forEach(function (element) {
                element.innerHTML = element.value = Wax.template(element.id, element.value || element.innerHTML)(context);
                if ('hidden' in element)
                    element.hidden = !visible;
            });
        }
        ;
    };
    Object.defineProperty(Wax, "core", {
        /**
         * Gets or Creates the Wax instance
         *
         * @returns The created Wax Instance
         */
        get: function () {
            if (!(this._core instanceof Wax)) {
                this._core = new Wax;
                Wax.addPlugin(plugins_1.CoreWax);
            }
            return this._core;
        },
        enumerable: false,
        configurable: true
    });
    return Wax;
}());

},{"./compiler":1,"./compiler/parser":2,"./debug":4,"./plugins":7}]},{},[9])(9)
});
