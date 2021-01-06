import { WaxDelimiter } from "../blob"

export interface WaxTreeRoot {
    text?: string,
    directives?: RegExpMatchArray,
    argList?: number,
    blockSyntax?: string,
    tagName?: number,
    endPrefix?: string
}

export function traverse(source: string, delimiter: WaxDelimiter): WaxTreeRoot {
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