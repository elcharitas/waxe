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
