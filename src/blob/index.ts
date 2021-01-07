type NumStr = number | string | WaxLiteral

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

interface WaxTagOpts {
    [opts: string]: NumStr | WaxConfig
    tag?: string
    argLiteral?: string | WaxLiteral
    block?: string
    configs?: WaxConfig
    context?: WaxConfig["context"]
}

interface WaxLiteral extends String  {
    arg?: (key: number) => any
    text?: () => string
    build?: () => string
}

interface WaxNode extends WaxTagOpts {
    [opts: string]: NumStr | WaxConfig | WaxNode["descriptor"]
    source?: string
    position?: number
    descriptor: (this: WaxNode, literal?: WaxLiteral) => string
}

interface WaxTreeRoot {
    text?: string,
    directives?: RegExpMatchArray,
    argList?: number,
    blockSyntax?: string,
    tagName?: number,
    endPrefix?: string
}

interface WaxWalker extends WaxTreeRoot, WaxTagOpts {
    [prop: string]: any
    walk(): string
    toArgs(argList: string): WaxLiteral
    isBlockEnd(tag: string): boolean
}

interface Wax {
    core: {
        configs: WaxConfig,
        delimiter: WaxDelimiter,
        templates: {
            [name: string]: WaxTemplate
        }
    }
    global(name: string, value: any): any
    directive(tag: string, descriptor: WaxNode["descriptor"]): WaxNode
    getConfigs(): WaxConfig
    getDelimiter(): WaxDelimiter
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
    WaxWalker,
    WaxTreeRoot,
    WaxTagOpts,
    WaxLiteral,
    WaxNode,
    Wax
}
