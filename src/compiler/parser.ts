import { WaxTemplate } from '.';
import { extendProp } from '../debug';
import { Walker } from './walker';

export const out = 'out';

function renameTemplate(name: string, sourceFn: WaxPresenter, parser: Wax): WaxTemplate {
    return new Function('call', 'return function ' + name.replace(/\/-\./g, '') + '(){return call(this,arguments)}')(Function.apply.bind(sourceFn.bind(parser.getConfigs().context, '')));
}

function bind(source: string): WaxPresenter {
    let template: WaxPresenter = WaxTemplate;

    try {
        template = new Function(out, `this.merge(arguments);${out}+=${source};return ${out}`);
    } catch (e){
        throw 'Error occured while parsing template';
    }

    return template;
}

function transpile(parser: Wax, source: string, config: WaxConfig): WaxPresenter {
    const treeRoot: WaxTreeRoot = traverse(source, config.delimiter);
    
    let text = new (extendProp(Walker, treeRoot))(parser).walk();
    
    if(config.strip === true){
        text = text.replace(/\\n\s+/g, '');
    }
    
    return bind(text);
}

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

export function traverseNode(walker: WaxWalker, tagOpts: WaxTagOpts): string {
    const { tag, argLiteral } = tagOpts,
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
    return result;
}

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

export function parseTemplate(name: string = 'waxe-' + Date.now(), source = '', parser: Wax = null): WaxTemplate {
    return renameTemplate(name,
        transpile(parser, source, parser.getConfigs()),
        parser
    );
}