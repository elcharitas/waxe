export class CoreDirectives {

    [name: string]: WaxDescriptor;
    
    public set(literal: WaxLiteral): string {
        return `eval(${literal.arg(0)}+"="+${JSON.stringify(literal.arg(1))});`;
    }
    
    public define(literal: WaxLiteral): string {
        return `this[${literal.arg(0)}] = ${literal.arg(1)};`;
    }
    
    public macro(literal: WaxLiteral): string {
        return `this[${literal.arg(0)}] = function(){var name = ${literal.arg(0)}; var call = this[name]; var args=[].slice.call(arguments);var out = "";`;
    }
    
    public endmacro(): string {
        return `return out;}`;
    }

    public include(literal: WaxLiteral): string {
        return `out+=Wax.template(${literal.arg(0)})(${literal.arg(1)},this);`;
    }
    
    public yield(this: WaxNode, literal: WaxLiteral): string {
        return `out+=(${this.configs.autoescape} ? this.escape: String)(${literal.arg(0)||literal.arg(1)});`;
    }
    
    public elseif(literal: WaxLiteral): string {
        return `} else if(${literal}) {`;
    }

    public else(): string {
        return '} else {';
    }

    public switch(literal: WaxLiteral): string {
        return `switch${literal}{/*`;
    }

    public case(literal: WaxLiteral): string {
        return `*/case ${literal}:`;
    }

    public break(literal: WaxLiteral){
        return 'break;/*';
    }
    
    public continue(literal: WaxLiteral){
        return `continue;`;
    }

    public endswitch(): string {
        return '*/}';
    }
    
    public forelse(literal: WaxLiteral): string {
        const obj: string = literal.text().split(/\s+/)[2];
        return `var loopObj = ${obj};for${literal}{`;
    }
    
    public empty(): string {
        return `} if(typeof loopObj !== "object" || Object.keys(loopObj).length < 1){`;
    }
    
    public endforelse(): string {
        return `};delete loopObj;`;
    }
}