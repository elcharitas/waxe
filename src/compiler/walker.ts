import { dbg } from "../debug"
import { traverseNode } from "./traverse"
import * as blob from "../blob"

export default class Walker implements blob.WaxWalker {
    
    public directives: RegExpMatchArray
    
    public text: string
    
    public argList: number
    
    public blockSyntax: string
    
    public tagName: number
    
    public endPrefix: string
    
    public jsTags: string[]
    
    public parser: blob.Wax
    
    public constructor(parser: blob.Wax, root: blob.WaxTreeRoot = {}){
        dbg("Walker", this)
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
        this.directives?.forEach((rawBlock: string, position: number) => {
            let block = JSON.parse(`"${rawBlock}"`)
                ,{ [this.tagName]: tag, [this.argList]: argList = '' } = block.match(this.blockSyntax)
                ,{ configs = {}, configs: { context = {} } } = this.parser.core
                ,argLiteral: blob.WaxLiteral = this.toArgs(argList)
            text = text.replace(rawBlock, `";${traverseNode(this, { tag, argLiteral, block, position, configs, context })}\nout+="`)
        })
        return text
    }
    
    public isBlockEnd(realTag: string="", tag: string = realTag.replace(this.endPrefix,'')): boolean {
        return realTag.indexOf(this.endPrefix) === 0 && (this.jsTags.indexOf(tag) > -1 || this.parser.getTag({tag}) !== null)
    }
    
    public toArgs(list: string): blob.WaxLiteral {
        const argLiteral: blob.WaxLiteral = new String(list)
        
        argLiteral.arg = function(key: number): string {
            return `[${argLiteral.text()}][${key}]`
        }
        
        argLiteral.parse = function(): string {
            return argLiteral.replace(/\$/g, 'this.')
        }
        
        argLiteral.text = function(): string {
            return argLiteral.parse().replace(/^\(([\s\S]*)\)$/, '$1')
        }
        
        return argLiteral
    }
}