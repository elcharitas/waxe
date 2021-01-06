import { dbg } from "../debug"
import { WaxTreeRoot } from "./traverse"
import { Wax, WaxLiteral, WaxNode } from "../blob"

export default class Walker implements WaxTreeRoot {
    
    public directives: RegExpMatchArray
    
    public text: string
    
    public argList: number
    
    public blockSyntax: string
    
    public tagName: number
    
    public endPrefix: string
    
    public jsTags: string[]
    
    public constructor(root: WaxTreeRoot = {}){
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
    }
    
    public walk(parser: Wax, text: string = this.text)
    {
        this.directives?.forEach((block: string, position: number) => {
            let { [this.tagName]: tag, [this.argList]: argLiteral = '' } = block.match(this.blockSyntax)
                ,{ configs, configs: { throwUndefined } } = parser.core
                ,result: string = ''
                ,node: WaxNode = null
                
            argLiteral = argLiteral.replace('$', '(scope||this).')
            
            if (node = parser.getTag({ tag, argLiteral, block, position, configs })) {
                node.source = JSON.parse(this.text)
                result = node.descriptor.call(node, this.toArgs(argLiteral))
            }
            else if (this.jsTags.indexOf(tag) > -1) {
                result = tag + argLiteral + '{'
            }
            else if (this.isBlockEnd(parser, tag)) {
                result = '}'
            }
            text = text.replace(block, `";${result}\nout+="`)
        })
        return text
    }
    
    public isBlockEnd(parser: Wax, realTag: string, tag: string = realTag.replace(this.endPrefix,'')): boolean {
        return realTag.indexOf(this.endPrefix) === 0 && (this.jsTags.indexOf(tag) > -1 || parser.getTag({tag}) !== null)
    }
    
    public toArgs(literal: string): WaxLiteral {
        const argLiteral: WaxLiteral = new String(literal)
        argLiteral.arg = function(key: number) {
            return `[${argLiteral.text()}][${key}]`
        }
        argLiteral.text = function(){
            return argLiteral.replace(/^\(([\s\S]*)\)$/, '$1')
        }
        return argLiteral
    }
}