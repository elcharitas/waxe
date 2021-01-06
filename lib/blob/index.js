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
