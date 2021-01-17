import { out, traverseNode, parseString } from './parser';

/** Walker is used to walk a traversed source */
export class Walker implements WaxWalker {
    
    public directives: RegExpMatchArray;
    
    public text: string;
    
    public argList: number;
    
    public blockSyntax: string;
    
    public tagName: number;
    
    public endPrefix: string;
    
    public jsTags: string[] = ['for', 'if', 'while', 'switch'];
    
    public parser: Wax;
    
    /**
     * Creates a new Walker using the Wax Instance
     *
     * @param parser - The Wax Instance
     */
    public constructor(parser: Wax)
    {
        this.parser = parser;
    }

    /**
     * Start walking through the nodes...
     *
     * @rerurns - The transpiled text
     */
    public walk(): string
    {
        let text = this.text,
            layout = '';
        this.directives?.forEach((rawBlock: string, position: number) => {
            const block = JSON.parse(`"${rawBlock}"`),
                {
                    [this.tagName]: tag,
                    [this.argList]: argList = ''
                } = block.match(this.blockSyntax),
                configs = this.parser.getConfigs(),
                argLiteral: WaxLiteral = this.toArgs(argList);
            //handle template extending specially
            if(tag === "extends" && position === 0){
                layout = parseString(`+$template(#[0])`, argLiteral);
                return text = text.replace(rawBlock, '');
            }
            text = text.replace(rawBlock, `";${traverseNode(this, { tag, argLiteral, block, position, configs, context: configs.context })}\n${out}+="`);
        });
        return text + layout;
    }

    /**
     * Checks if an end tag exist or if one can be temporarily created
     *
     * @param realTag - The tag name sent in e.g `endblock`
     * @param tag - The base name of tag name e.g `block`
     * @returns - `true` if can end else `false`
     */
    public isBlockEnd(realTag = '', tag = realTag.replace(this.endPrefix, '')): boolean {
        return realTag.indexOf(this.endPrefix) === 0 && (this.jsTags.indexOf(tag) > -1 || this.parser.getTag({tag}) !== null);
    }

    /**
     * Create an argLiteral from the argList
     *
     * @param list - the string holding args
     * @returns - A literal of `list`
     */
    public toArgs(list: string): WaxLiteral {
        const argLiteral: WaxLiteral = new String(list);
        
        argLiteral.arg = function(key: number): string {
            return `[${argLiteral.text()}][${key}]`;
        };
        
        argLiteral.parse = function(): string {
            return parseString(argLiteral);
        };
        
        argLiteral.text = function(): string {
            return argLiteral.parse().replace(/^\(([\s\S]*)\)$/, '$1');
        };
        
        return argLiteral;
    }
}