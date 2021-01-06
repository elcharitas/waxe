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
