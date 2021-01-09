
type NumStr = number | string | WaxLiteral;

declare interface WaxContext {
    [x: string]: undefined | NumStr | object;
}

declare interface WaxConfig {
    [opts: string]: undefined | boolean | WaxContext;
    strip?: boolean;
    throwUndefined?: boolean;
    autoescape?: boolean;
    context?: WaxContext;
    delimiter?: WaxDelimiter;
}

declare interface WaxDelimiter {
    [opts: string]: undefined | any;
    blockSyntax?: string;
    tagName?: number;
    argList?: number;
    endPrefix?: string;
}

declare interface WaxTemplate {
    (...scopes: WaxContext[]): string;
    source?: string;
    prototype: Function;
}

declare interface WaxPlugin {
    directives?: {
        [directive: string]: undefined | WaxDescriptor;
    };
}

declare interface WaxPluginConstructor {
    new(Wax: any): WaxPlugin;
    prototype: WaxPlugin;
}

declare interface WaxTagOpts {
    [opts: string]: undefined | NumStr | WaxConfig | WaxContext | WaxDescriptor
    tag?: string
    argLiteral?: string | WaxLiteral
    block?: string
    configs?: WaxConfig
    context?: WaxContext
}

declare interface WaxLiteral extends String {
    arg?: (key: number) => any
    text?: () => string
    parse?: () => string
}

declare interface WaxNode extends WaxTagOpts {
    source?: string
    position?: number
    descriptor?: WaxDescriptor
}

declare interface WaxDescriptor {
    (this: WaxNode, literal: WaxLiteral): string
}

declare interface WaxTreeRoot {
    text?: string;
    directives?: RegExpMatchArray;
    argList?: number;
    blockSyntax?: string;
    tagName?: number;
    endPrefix?: string;
}

declare interface WaxWalker extends WaxTreeRoot, WaxTagOpts {
    [prop: string]: undefined | any;
    walk(): string;
    toArgs(argList: string): WaxLiteral;
    isBlockEnd(tag: string): boolean;
}

declare interface Waxer {
    configs?: WaxConfig;
    delimiter?: WaxDelimiter;
    templates?: {
        [name: string]: undefined | WaxTemplate;
    };
}

declare interface Wax {
    prototype: Waxer;
    core?: Waxer;
    global(name: string, value: any): any;
    directive(tag: string, descriptor: WaxDescriptor): WaxNode;
    getConfigs(): WaxConfig;
    template(name: string, source?: string): WaxTemplate
    getDelimiter(): WaxDelimiter;
    getTag(tagOpts?: WaxTagOpts): WaxNode;
}


declare module "waxe" {
    const _default: Wax
    export = _default
}