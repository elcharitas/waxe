import { encodeJS, encodeHTML } from "./compiler"

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
    (...scopes: WaxConfig["context"][]): string
    source?: string
    merge?: (args: {[x: string]: any}[]) => void
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
    parse?: () => string
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

interface Waxer {
    configs: WaxConfig,
    delimiter: WaxDelimiter,
    templates: {
        [name: string]: WaxTemplate
    }
}

interface Wax {
    prototype: Waxer
    core: Waxer
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
        startTime: Date.now(),
        now: function(): number {
            return Date.now()
        },
        escape: function(text: string, useJs: boolean = false){
            return (useJs? encodeJS: encodeHTML)(text)
        },
        merge: function(this: WaxConfig["context"], args: WaxConfig["context"][] = []): void {
            args = [].slice.call(args);
            args.forEach(arg => {
                for (let name in arg) {
                    this[name] = arg[name]
                }
            })
        }
    }
}

Object.defineProperties(WaxConfig.context, {
    merge: { writable: false, configurable: false },
    escape: { writable: false, configurable: false }
})

const WaxDelimiter: WaxDelimiter = {
    blockSyntax: "@(\\w+)(\\([^@]+\\))?",
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
    Waxer,
    Wax
}
