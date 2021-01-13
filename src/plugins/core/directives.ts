export class CoreDirectives {
    
    [directive: string]: WaxNode["descriptor"];

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
        let obj: string = literal.text().split(/\s+/)[2];
        return `var loopObj = ${obj};for${literal}{`;
    }
    
    public empty(): string {
        return `} if(typeof loopObj !== "object" || Object.keys(loopObj).length < 1){`;
    }
    
    public endforelse(): string {
        return `};delete loopObj;`;
    }
    
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

    public yield(literal: WaxLiteral): string {
        return `out+=this.escape(${literal.arg(0)||literal.arg(1)});`;
    }
    
    public escape(literal: WaxLiteral): string {
        return `out+=this.escape(${literal.arg(0)||literal.arg(1)});`;
    }
    
    public extends(literal: WaxLiteral): string {
        return ``;
    }
    
    public include(literal: WaxLiteral): string {
        return `out+=Wax.template(${literal.arg(0)})(${literal.arg(1)},this);`;
    }
    
    public includeIf(literal: WaxLiteral): string {
        return `out+=(Wax.template(${literal.arg(0)})||new Function("return ''"))(${literal.arg(1)},this);`;
    }

    public includeWhen(literal: WaxLiteral): string {
        return `out+=${literal.arg(0)}?Wax.template(${literal.arg(1)})(${literal.arg(2)},this):"";`;
    }
    
    public bind(literal: WaxLiteral): string {
        let hook: string = literal.arg(1)
            ,el: string = literal.arg(0);
        return `out+=this["bind${el}"]=${hook};setInterval(function(){
            document.querySelectorAll(${el}).forEach(function(hook){
                if(this["bind${el}"] !== ${hook}){
                    hook.value = this["bind${el}"] = ${hook}
                }
            })
        });`;
    }
    
    public json(literal: WaxLiteral): string {
        return `out+=JSON.stringify${literal}`;
    }
    
    public js(): string {
        return 'var holdjs = out;';
    }
    
    public endjs(): string {
        return 'holdjs=this.reverse(out).replace(this.reverse(holdjs), "");out=this.reverse(this.reverse(out).replace(holdjs, ""));(new Function(this.reverse(holdjs))).bind(this)();delete holdjs';
    }

    public comment(literal: WaxLiteral): string {
        return `/*${literal}*/`;
    }
}