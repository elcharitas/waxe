export function traverse(source: string, delimiter: WaxDelimiter): WaxTreeRoot {
    const { argList, blockSyntax, tagName, endPrefix } = delimiter,
        text: string = JSON.stringify(source),
        directiveSyntax: string = `(${blockSyntax})`,
        directives = text.match(new RegExp(directiveSyntax, 'g'));
    return {
        text,
        directives,
        argList,
        blockSyntax,
        tagName,
        endPrefix
    };
}

export function traverseNode(walker: WaxWalker, tagOpts: WaxTagOpts): string {
    const { tag, argLiteral } = tagOpts;
    let result: string = '',
        node: WaxNode = null
    if (node = walker.parser.getTag(tagOpts)) {
        result = node.descriptor.call(node, argLiteral);
    }
    else if (walker.jsTags.indexOf(tag) > -1) {
        result = tag + (argLiteral as WaxLiteral).parse() + '{';
    }
    else if (walker.isBlockEnd(tag)) {
        result = '}';
    }
    return result;
}