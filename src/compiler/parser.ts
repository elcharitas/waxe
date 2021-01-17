import { WaxTemplate } from '.';
import { extendProp } from '../debug';
import { Walker } from './walker';

/**
 * The identity of the output variable
 */
export const out = 'out';

/**
 * Renames a Presenter and returns it template function
 *
 * @param name - The name to use
 * @param sourceFn - The presenter
 * @param parser - The Wax Instance
 */
function renameTemplate(name: string, sourceFn: WaxPresenter, parser: Wax): WaxTemplate {
    return new Function('call', 'return function ' + name.replace(/[/\-.]+/g, '') + '(){return call(this,arguments)}')(
        Function.apply.bind(
            sourceFn.bind(parser.getConfigs().context, '')
        )
    );
}

/**
 * Bind a transpiled source to a presenter
 *
 * @param source - The transpiled source
 * @returns - The generated presenter
 */
function bind(source: string): WaxPresenter {
    let template: WaxPresenter = WaxTemplate;

    try {
        template = new Function(out, `this.merge(arguments);${out}+=${source};return ${out}`);
    } catch (error){
        throw 'Wax'+error;
    }

    return template;
}

/**
 * Transpiles a source and binds it for presentation
 *
 * @param parser - The Wax Instance
 * @param source - The source text to transpile
 * @param config - The config for the source
 * @returns - The resolved presenter
 */
function transpile(parser: Wax, source: string, config: WaxConfig): WaxPresenter {
    const treeRoot: WaxTreeRoot = traverse(source, config.delimiter);
    
    let text = new (extendProp(Walker, treeRoot))(parser).walk();
    
    if(config.strip === true){
        text = text.replace(/\\n\s+/g, '');
    }
    
    return bind(text);
}

/**
 * Traverse a source and return its Map
 *
 * @param source - The source text to traverse
 * @param delimiter - The delimiter to use
 * @returns - A Map of the source's nodes called the TreeRoot
 */
function traverse(source: string, delimiter: WaxDelimiter): WaxTreeRoot {
    const { argList, blockSyntax, tagName, endPrefix } = delimiter,
        text: string = JSON.stringify(source),
        directives: RegExpMatchArray = text.match(new RegExp(blockSyntax, 'g'));
    return {
        text,
        directives,
        argList,
        blockSyntax,
        tagName,
        endPrefix
    };
}

/**
 * Traverse a node using a walker and node's tag options
 *
 * @param walker - The Walker to use
 * @param tagOpts - A collection of options to identify a tag
 * @returns - A fully transpiled node
 */
export function traverseNode(walker: WaxWalker, tagOpts: WaxTagOpts): string {
    const { tag, argLiteral, configs } = tagOpts,
        node: WaxNode = walker.parser.getTag(tagOpts);
    let result = '';
    
    if (null !== node) {
        node.write = (value: WaxLiteral) => `${out}+=${node.exec(value)}`;
        node.exec = (value: WaxLiteral) => parseString(value, argLiteral, true);
        result = node.descriptor.call(node, argLiteral);
    }
    else if (walker.jsTags.indexOf(tag) > -1) {
        result = tag + (argLiteral as WaxLiteral).parse() + '{';
    }
    else if (walker.isBlockEnd(tag)) {
        result = '}';
    }
    else if(configs.debug){
        throw `WaxNodeError: Unknown Tag "${tag}"`;
    }
    return result;
}

/**
 * Parses a literal string for special syntax/inline transpilation
 *
 * @param literal - The literal to transpile
 * @param argLiteral - The literal holding current node's arguments
 * @param createScope - Whether or not to scope the transpiled literal
 * @returns - The transpiled literal as string
 */
export function parseString(literal: WaxLiteral, argLiteral?: WaxLiteral, createScope?: boolean): string {
    const list: string[] = literal.split('');
    let inString: string = null;

    list.forEach((char: string, index: number) => {
        const nextChar: string = list[index + 1];
        if (char != inString && (inString === '"' || inString === '\'')) {
            inString = char;
        }
        else if(inString === char) {
            inString = null;
        }
        else if(!inString && char === '$' && nextChar != '[') {
            char = 'this.';
        }
        else if (!inString && char === '$' && nextChar === '[') {
            char = 'this';
        }
        else if(!inString && char === ';') {
            const hold: string = list[index - 3] + list[index - 2] + list[index - 1];
            if(hold.match(/^&(g|l)t$/)){
                list[index - 1] = list[index - 2] = list[index - 3] = '';
                char = hold.replace('&gt', '>').replace('&lt', '<');
            }
        }
        else if(!inString && char === '#' && nextChar === '[') {
            char = 'arguments';
        }
        
        list[index] = char;
    });
    
    if(createScope === true){
        return `new Function(${JSON.stringify('return '+list.join(''))}).apply(this,[${argLiteral ? argLiteral.text() : ''}]);`;
    }
    return list.join('');
}

/**
 * Generates a new template function
 *
 * @param name - optional name for template
 * @param source - The source text to use
 * @param parser - Instance of Wax
 * @returns - The generated function
 */
export function parseTemplate(name: string = 'waxe-' + Date.now(), source = '', parser: Wax): WaxTemplate {
    return renameTemplate(name,
        transpile(parser, source, parser.getConfigs()),
        parser
    );
}