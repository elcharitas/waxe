"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeHTML = exports.encodeJS = void 0;
/**
 * Encodes JavaScript to prevent malicious input
 *
 * @param {string} js - The suspected js
 * @returns string
 */
function encodeJS(js) {
    var encodeRules = {
        "&": "&#38;",
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "/": "&#47;",
    };
    var matchJS = /&(?!#?\w+;)|<|>|"|'|\//g;
    return typeof js === "string" ? js.replace(matchJS, function (m) { return encodeRules[m] || m; }) : js;
}
exports.encodeJS = encodeJS;
/**
 * Encodes HTML to prevent malicious input
 *
 * @param {string} html - The suspected html
 * @returns string
 */
function encodeHTML(html) {
    var encodeRules = {
        "&": "&#38;",
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "/": "&#47;",
    };
    var matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
    return typeof html === "string" ? html.replace(matchHTML, function (m) { return encodeRules[m] || m; }) : html;
}
exports.encodeHTML = encodeHTML;
