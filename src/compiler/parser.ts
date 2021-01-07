import { bind, namefn } from "./binder"
import { traverse } from "./traverse"
import * as blob from "../blob"
import Walker from "./walker"

export function transpile(parser: blob.Wax, source: string, config: blob.WaxConfig): blob.WaxTemplate {
    let treeRoot: blob.WaxTreeRoot = traverse(source, config.delimiter)
    
    let text = new Walker(parser, treeRoot).walk()
    
    if(config.strip === true){
        text = text.replace(/\\n\s+/g, '')
    }
    
    return bind(parser, text)
}

export const genTemplate = (template: blob.WaxTemplate = blob.WaxTemplate, name: string = 'waxe-'+Date.now()) => namefn(name, template)