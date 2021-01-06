import { WaxNode } from "../blob"

interface WaxPlugin {
    directives: {
        [directive: string]: WaxNode["descriptor"]
    }
}

type WaxPluginConstructor = {
    new(Wax: any): WaxPlugin
    prototype: WaxPlugin
}

export {
    WaxPlugin,
    WaxPluginConstructor
}