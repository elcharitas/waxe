import * as blob from "../blob"

export function traverse(source: string, delimiter: blob.WaxDelimiter): blob.WaxTreeRoot {
    let { argList, blockSyntax, tagName, endPrefix } = delimiter
        ,text: string = JSON.stringify(source)
        ,directiveSyntax: string = `(${blockSyntax})`
        ,directives = text.match(new RegExp(directiveSyntax, 'g'))
    return {
        text,
        directives,
        argList,
        blockSyntax,
        tagName,
        endPrefix
    }
}

export function traverseNode(walker: blob.WaxWalker, tagOpts: blob.WaxTagOpts): string {
    let { tag, argLiteral } = tagOpts
        ,result: string = ''
        ,node: blob.WaxNode = null
    if (node = walker.parser.getTag(tagOpts)) {
        result = node.descriptor.call(node, argLiteral)
    }
    else if (walker.jsTags.indexOf(tag) > -1) {
        result = tag + argLiteral + '{'
    }
    else if (walker.isBlockEnd(tag)) {
        result = '}'
    }
    return result
}