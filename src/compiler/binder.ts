import { Wax, WaxTemplate } from "../blob"

interface Function {
    bind(this: Function, thisArg: any, ...argArray: any[]): WaxTemplate
}

export function namefn(name:string, fn: WaxTemplate): WaxTemplate {
    let finalFn: WaxTemplate = (new Function("return function (call) { return function " + name + " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
    finalFn.source = fn.source.replace('anonymous', name)
    return finalFn
}

export function bind(parser: Wax, source: string): WaxTemplate {
    let template: WaxTemplate = WaxTemplate
        ,holder: Function = WaxTemplate
    try {
        holder = new Function('out, scope', `out+=${source};return out`)
        template = holder.bind(parser.core.configs.context, '')
    } catch(e){}
    template.source = holder.toString()
    return template
}