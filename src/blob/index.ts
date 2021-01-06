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
    [opts: string]: NumStr | WaxConfig,
    tag: string,
    argLiteral?: string,
    block?: string
    config?: WaxConfig
}

interface WaxLiteral extends String  {
    arg?: (key: number) => any
    text?: () => string
}

interface WaxNode {
    [opts: string]: NumStr | WaxConfig | WaxNode["descriptor"]
    tag: string
    argLiteral?: string
    block?: string
    source?: string
    position?: number
    configs?: WaxConfig
    descriptor: (this: WaxNode, literal?: WaxLiteral) => string
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
    WaxTagOpts,
    WaxLiteral,
    WaxNode,
    Wax
}
