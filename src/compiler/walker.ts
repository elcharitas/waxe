import { dbg } from "../debug"
import { WaxTreeRoot } from "./traverse"
import { Wax, WaxLiteral } from "../blob"

export default class Walker implements WaxTreeRoot {
    
    public directives: RegExpMatchArray
    
    public text: string
    
    public argList: number
    
    public blockSyntax: string
    
    public tagName: number
    
    public endPrefix: string
    
    public constructor(root: WaxTreeRoot = {}){
        if(typeof this !== "object") {
            throw dbg(Walker, this)
        }
        this.directives = root.directives
        this.argList = root.argList
        this.blockSyntax = root.blockSyntax
        this.tagName = root.tagName
        this.text = root.text
        this.endPrefix = root.endPrefix
    }
    
    public walk(parser: Wax, text: string = this.text)
    {
        this.directives?.forEach((block: string, position: number) => {
            let { [this.tagName]: tag, [this.argList]: argLiteral = '' } = block.match(this.blockSyntax)
                ,result: string = '', node
            argLiteral = argLiteral.replace('$', '(scope||this).')
            if(node = parser.getTag({tag, argLiteral, block, position})){
                node.source = JSON.parse(this.text)
                result = node.descriptor.call(node, this.toArgs(argLiteral))
            } else if(['for','if','while','switch'].indexOf(tag) > -1) {
                result = tag+argLiteral+'{'
            } else if(tag.indexOf(this.endPrefix) === 0){
                result = '}'
            }
            text = text.replace(block, `";${result}\nout+="`)
        })
        return text
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