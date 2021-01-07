import { dbg } from "../debug"
import { traverseNode } from "./traverse"
import { Wax, WaxLiteral, WaxNode, WaxWalker, WaxTreeRoot } from "../blob"

export default class Walker implements WaxWalker {
    
    public directives: RegExpMatchArray
    
    public text: string
    
    public argList: number
    
    public blockSyntax: string
    
    public tagName: number
    
    public endPrefix: string
    
    public jsTags: string[]
    
    public parser: Wax
    
    public constructor(parser: Wax, root: WaxTreeRoot = {}){
        if(typeof this !== "object") {
            throw dbg("Walker", this)
        }
        this.directives = root.directives
        this.argList = root.argList
        this.blockSyntax = root.blockSyntax
        this.tagName = root.tagName
        this.text = root.text
        this.endPrefix = root.endPrefix
        this.jsTags = ['for','if','while','switch']
        this.parser = parser
    }
    
    public walk(text: string = this.text)
    {
        this.directives?.forEach((block: string, position: number) => {
            let { [this.tagName]: tag, [this.argList]: argList = '' } = JSON.parse('"'+block+'"').match(this.blockSyntax)
                ,{ configs = {}, configs: { context = {} } } = this.parser.core
                ,argLiteral: WaxLiteral = this.toArgs(argList)
            
            text = text.replace(block, `";${traverseNode(this, { tag, argLiteral, block, position, configs, context })}\nout+="`)
        })
        return text
    }
    
    public isBlockEnd(realTag: string, tag: string = realTag.replace(this.endPrefix,'')): boolean {
        return realTag.indexOf(this.endPrefix) === 0 && (this.jsTags.indexOf(tag) > -1 || this.parser.getTag({tag}) !== null)
    }
    
    public toArgs(list: string): WaxLiteral {
        const argLiteral: WaxLiteral = new String(list)
        
        argLiteral.arg = function(key: number): string {
            return `[${argLiteral.text()}][${key}]`
        }
        
        argLiteral.build = function(): string {
            return argLiteral.replace('$', '(scope||this).')
        }
        
        argLiteral.text = function(): string {
            return argLiteral.build().replace(/^\(([\s\S]*)\)$/, '$1')
        }
        
        return argLiteral
    }
}