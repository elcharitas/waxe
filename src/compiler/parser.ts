import { WaxTemplate } from "."
import { bind, namefn } from "./binder"
import { traverse } from "./traverse"
import Walker from "./walker"

export function transpile(parser: Wax, source: string, config: WaxConfig): WaxTemplate {
    let treeRoot: WaxTreeRoot = traverse(source, config.delimiter)
    
    let text = new Walker(parser, treeRoot).walk()
    
    if(config.strip === true){
        text = text.replace(/\\n\s+/g, '')
    }
    
    return bind(parser, text)
}

export const genTemplate = (template: WaxTemplate = WaxTemplate, name: string = 'waxe-'+Date.now()) => namefn(name, template)