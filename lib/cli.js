"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var waxe_1 = __importDefault(require("./waxe"));
var fs_1 = require("fs");
var _a = process.argv, action = _a[2], path = _a[3], _b = require("../package.json"), version = _b.version, description = _b.description, log = console.log, error = console.error, parse = function (src, pagefn) {
    if (pagefn === void 0) { pagefn = waxe_1.default.template("cliTest", src); }
    switch (action) {
        case "render":
            src ? log(pagefn({})) : help(action);
            break;
        case "compile":
            src ? log(pagefn.source) : help(action);
            break;
        case "help":
            help(path);
            break;
        case "version":
            log(version);
            break;
        default: action ? error("Unrecognized Command!")
            : help();
    }
}, help = function (action) {
    var cmdHelp = {
        render: "[path]\tRenders a template",
        compile: "[path]\tRenders a template",
        version: '\tDisplays version info',
        help: '[topic]\tShows this help or help [topic]'
    };
    log("Usage: waxe " + (action || "[command]") + " [path]\n");
    log(description);
    var commands = "\nStandard Commands:\n";
    for (var command in cmdHelp) {
        commands += "\t" + command + "\t" + cmdHelp[command] + "\n";
    }
    log(commands);
};
parse(path ? fs_1.readFileSync(path).toString() : "");
