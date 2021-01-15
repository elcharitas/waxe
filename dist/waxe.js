(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Wax = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflictProp = exports.encodeHTML = exports.WaxDelimiter = exports.WaxTemplate = exports.WaxConfig = void 0;
var debug_1 = require("../debug");
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
        json: JSON.stringify,
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
                    if (!(name_1 in _this) || Object.getOwnPropertyDescriptor(_this, name_1).configurable === true) {
                        _this[name_1] = arg[name_1];
                    }
                }
            });
        },
        reverse: function (text, delimiter) {
            if (delimiter === void 0) { delimiter = ''; }
            return text.split(delimiter).reverse().join(delimiter);
        },
        template: function (name, context, safe) {
            if (context === void 0) { context = {}; }
            if (safe === void 0) { safe = false; }
            var template = require("../waxe").template(name);
            if (safe == false && !template) {
                debug_1.dbg(template, WaxTemplate);
            }
            return (template || WaxTemplate)(context);
        }
    }
};
exports.WaxConfig = WaxConfig;
/** prevent mutation */
conflictProp(WaxConfig);
conflictProp(WaxConfig.context);

},{"../debug":4,"../waxe":8}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTemplate = exports.parseString = exports.traverseNode = exports.out = void 0;
var _1 = require(".");
var walker_1 = __importDefault(require("./walker"));
exports.out = 'out';
function renameTemplate(name, sourceFn, parser) {
    return new Function('call', 'return function ' + name + '(){return call(this,arguments)}')(Function.apply.bind(sourceFn.bind(parser.getConfigs().context, '')));
}
function bind(source) {
    var template = _1.WaxTemplate;
    try {
        template = new Function(exports.out, "this.merge(arguments);" + exports.out + "+=" + source + ";return " + exports.out);
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
        node.write = function (value) { return exports.out + "+=" + node.exec(value); };
        node.exec = function (value) { return parseString(value, argLiteral, true); };
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
function parseString(literal, argLiteral, createScope) {
    var list = literal.split('');
    var inString = null;
    list.forEach(function (char, index) {
        var nextChar = list[index + 1];
        if (char != inString && (inString == '"' || inString == '\'')) {
            inString = char;
        }
        else if (inString == char) {
            inString = null;
        }
        else if (!inString && char == '$' && nextChar != '[') {
            char = 'this.';
        }
        else if (!inString && char == '$' && nextChar == '[') {
            char = 'this';
        }
        else if (!inString && char == ';') {
            var hold = list[index - 3] + list[index - 2] + list[index - 1];
            if (hold.match(/^&(g|l)t$/)) {
                list[index - 1] = list[index - 2] = list[index - 3] = '';
                char = hold.replace('&gt', '>').replace('&lt', '<');
            }
        }
        else if (!inString && char == '#' && nextChar == '[') {
            char = 'arguments';
        }
        list[index] = char;
    });
    if (createScope == true) {
        return "new Function(" + JSON.stringify('return ' + list.join('')) + ").apply(this,[" + (argLiteral ? argLiteral.text() : '') + "]);";
    }
    return list.join('');
}
exports.parseString = parseString;
function parseTemplate(name, source, parser) {
    if (name === void 0) { name = 'waxe-' + Date.now(); }
    if (source === void 0) { source = ''; }
    if (parser === void 0) { parser = null; }
    return renameTemplate(name, transpile(parser, source, parser.getConfigs()), parser);
}
exports.parseTemplate = parseTemplate;

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
    Walker.prototype.walk = function (text, layout) {
        var _this = this;
        var _a;
        if (text === void 0) { text = this.text; }
        if (layout === void 0) { layout = ''; }
        (_a = this.directives) === null || _a === void 0 ? void 0 : _a.forEach(function (rawBlock, position) {
            var block = JSON.parse("\"" + rawBlock + "\""), _a = block.match(_this.blockSyntax), _b = _this.tagName, tag = _a[_b], _c = _this.argList, _d = _a[_c], argList = _d === void 0 ? '' : _d, configs = _this.parser.getConfigs(), argLiteral = _this.toArgs(argList);
            if (tag == "extends" && position == 0) {
                layout = "+this.template(" + argLiteral.arg(0) + ")";
                return text = text.replace(rawBlock, '');
            }
            text = text.replace(rawBlock, "\";" + parser_1.traverseNode(_this, { tag: tag, argLiteral: argLiteral, block: block, position: position, configs: configs, context: configs.context }) + "\n" + parser_1.out + "+=\"");
        });
        return text + layout;
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbg = exports.debugProp = void 0;
var debugMessages = [
    "%1 should be %2 as %3",
    "%1 should be %3 as a %2"
];
var debugStack = TypeError;
function debugType(args, constraint, expected) {
    var expectedType = typeof expected;
    if (typeof constraint !== expectedType) {
        args.push((expected === null || expected === void 0 ? void 0 : expected.name) || expectedType);
    }
    if (typeof constraint === 'undefined' && expectedType === 'object') {
        args.push('initialized');
    }
    else if (expectedType !== 'object' || expected === null && constraint !== null) {
        args.push(expectedType);
        args.push('declared');
    }
    return args;
}
function debugProp(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}
exports.debugProp = debugProp;
function dbg(check, constraint, expected) {
    if (expected === void 0) { expected = {}; }
    var args = debugType([check], constraint, expected), dbgFor = '', _a = debugMessages, _b = args.length - 2, _c = _a[_b], debugInfo = _c === void 0 ? 'Unknown' : _c;
    args.forEach(function (arg, index) {
        debugInfo = debugInfo.replace("%" + (index + 1), arg);
    });
    if (args.length > 1 && debugStack !== null) {
        throw new debugStack(debugInfo);
    }
}
exports.dbg = dbg;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDirectives = void 0;
var CoreDirectives = /** @class */ (function () {
    function CoreDirectives() {
    }
    CoreDirectives.prototype.set = function () {
        return this.exec("eval(#[0]+\"=\"+$escape($json(#[1])));");
    };
    CoreDirectives.prototype.define = function () {
        return this.exec("$[#[0]]=#[1];");
    };
    CoreDirectives.prototype.comment = function () {
        return;
    };
    CoreDirectives.prototype.macro = function () {
        return this.exec("$[#[0]]=function(){var name=#[0];var call=$[name];var args=[].slice.call(arguments);var out = \"\";");
    };
    CoreDirectives.prototype.endmacro = function () {
        return "return out;}";
    };
    CoreDirectives.prototype.include = function () {
        return this.write("$template(#[0],#[1])");
    };
    CoreDirectives.prototype.yield = function () {
        return this.write("(" + this.configs.autoescape + "?$escape:String)(#[0]||#[1])");
    };
    CoreDirectives.prototype.elseif = function (literal) {
        return "}else if(" + literal + "){";
    };
    CoreDirectives.prototype.else = function () {
        return '}else{';
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
        return "if(" + (literal.text() || literal.length == 0) + "){continue}";
    };
    CoreDirectives.prototype.endswitch = function () {
        return '*/}';
    };
    CoreDirectives.prototype.forelse = function (literal) {
        var obj = literal.text().split(/\s+/)[2];
        return "var loopObj=" + obj + ";for" + literal + "{";
    };
    CoreDirectives.prototype.empty = function () {
        return "} if(typeof loopObj!==\"object\"||Object.keys(loopObj).length<1){";
    };
    CoreDirectives.prototype.endforelse = function () {
        return "};delete loopObj;";
    };
    return CoreDirectives;
}());
exports.CoreDirectives = CoreDirectives;

},{}],6:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreWax = void 0;
var core_1 = require("./core");
var misc_1 = require("./misc");
var CoreWax = /** @class */ (function () {
    function CoreWax(Wax) {
        Object.defineProperty(core_1.CoreDirectives, 'prototype', {
            value: __assign(__assign({}, core_1.CoreDirectives.prototype), misc_1.MiscDirectives.prototype)
        });
        this.directives = new core_1.CoreDirectives;
    }
    return CoreWax;
}());
exports.CoreWax = CoreWax;

},{"./core":5,"./misc":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscDirectives = void 0;
var MiscDirectives = /** @class */ (function () {
    function MiscDirectives() {
    }
    MiscDirectives.prototype.includeIf = function () {
        return this.write("$template(#[0],#[1],1)");
    };
    MiscDirectives.prototype.includeWhen = function () {
        return this.write("#[0]?$template(#[1],#[2]):''");
    };
    MiscDirectives.prototype.bind = function () {
        return this.write("$[\"bind\"+#[0]]=#[1];setInterval(function(){document.querySelectorAll(#[0]).forEach(function(hook){if($[\"bind\"+#[0]]!==#[1]){hook.value = this[\"bind\"+#[0]]=#[1]}})})");
    };
    MiscDirectives.prototype.escape = function () {
        return this.write("$escape(#[0]||#[1])");
    };
    MiscDirectives.prototype.json = function (literal) {
        return this.write("$json" + literal);
    };
    MiscDirectives.prototype.js = function () {
        return 'var hjs=out;';
    };
    MiscDirectives.prototype.endjs = function () {
        return this.exec("hjs=$reverse(out).replace($reverse(hjs),\"\");out=$reverse($reverse(out).replace(hjs,\"\"));(new Function($reverse(hjs))).bind(this)();delete hjs");
    };
    return MiscDirectives;
}());
exports.MiscDirectives = MiscDirectives;
;

},{}],8:[function(require,module,exports){
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
var _a;
var debug_1 = require("./debug");
var compiler_1 = require("./compiler");
var parser_1 = require("./compiler/parser");
var plugins_1 = require("./plugins");
module.exports = (_a = /** @class */ (function () {
        function Wax() {
            debug_1.dbg('Wax', this);
            debug_1.dbg('Wax', Wax._core, null);
            this.configs = compiler_1.WaxConfig;
            this.tags = {};
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
                if (typeof directives[tag] === 'function') {
                    this.directive(tag, directives[tag]);
                }
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
    }()),
    _a._core = null,
    _a);

},{"./compiler":1,"./compiler/parser":2,"./debug":4,"./plugins":6}]},{},[8])(8)
});
