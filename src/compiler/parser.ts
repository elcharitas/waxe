import { bind, namefn } from "./binder"
import { traverse, WaxTreeRoot } from "./traverse"
import { Wax, WaxConfig, WaxTemplate } from "../blob"
import Walker from "./walker"

export function transpile(this: Wax, source: string, config: WaxConfig): WaxTemplate {
    let treeRoot: WaxTreeRoot = traverse(source, config.delimiter)
    
    let text = new Walker(treeRoot).walk(this)
    
    if(config.strip === true){
        text = text.replace(/\\n\s+/g, '')
    }
    
    return bind(this, text)
}

export const genTemplate = (template: WaxTemplate = WaxTemplate, name: string = 'waxe-'+Date.now()) => namefn(name, template)