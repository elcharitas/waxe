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
