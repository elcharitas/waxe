type NumStr = number | string

type WaxConfig = {
    [opts: string]: any,
    strip?: boolean,
    throwUndefined?: boolean,
    autoescape?: boolean,
    context?: {
        [x: string]: NumStr | object
    },
    delimiter?: WaxDelimiter
}

type WaxDelimiter = {
    [opts: string]: any,
    blockSyntax?: string,
    tagName?: number,
    argList?: number,
    endPrefix?: string
}

type WaxTemplate = {
    (scope?: WaxConfig["context"]): string
    source?: string
    prototype: Function
}

type WaxTagOpts = {
    [opts: string]: NumStr,
    tag: string,
    argLiteral?: string,
    block?: string
}

interface WaxLiteral extends String  {
    arg?: (key: number) => any
    text?: () => string
}

interface WaxNode {
    [opts: string]: NumStr | WaxNode["descriptor"]
    tag: string
    argLiteral?: string
    block?: string
    source?: string
    position?: number
    descriptor: (this: WaxNode, literal?: WaxLiteral) => string
}

interface Wax {
    core: {
        configs: WaxConfig
    }
    getTag: (tagOpts: WaxTagOpts) => WaxNode
}

const WaxConfig: WaxConfig = {
    strip: true,
    throwUndefined: false,
    autoescape: true,
    context: {
        now: Date.now()
    }
}

const WaxDelimiter: WaxDelimiter = {
    blockSyntax: "@([_\\w]+)(\\(([^@]+)\\))*",
    tagName: 1,
    argList: 2,
    endPrefix: 'end',
}

const WaxTemplate: WaxTemplate = (context: WaxConfig["context"] = {}) => null

export {
    WaxConfig,
    WaxDelimiter,
    WaxTemplate,
    WaxTagOpts,
    WaxLiteral,
    WaxNode,
    Wax
}
