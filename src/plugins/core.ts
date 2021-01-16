
export class CoreDirectives {

    [name: string]: WaxDescriptor;
    
    public set(this: WaxNode): string {
        return this.exec(`eval(#[0]+"="+$escape($json(#[1])));`);
    }
    
    public define(this: WaxNode): string {
        return this.exec(`$[#[0]]=#[1];`);
    }

    public comment(): string {
        return;
    }

    public macro(this: WaxNode): string {
        return this.exec(`$[#[0]]=function(){var name=#[0];var call=$[name];var args=[].slice.call(arguments);var out = "";`);
    }
    
    public endmacro(): string {
        return `return out;}`;
    }

    public include(this: WaxNode): string {
        return this.write(`$template(#[0],#[1])`);
    }
    
    public yield(this: WaxNode): string {
        return this.write(`(${this.configs.autoescape}?$escape:String)(#[0]||#[1])`);
    }
    
    public elseif(literal: WaxLiteral): string {
        return `}else if(${literal}){`;
    }

    public else(): string {
        return '}else{';
    }

    public switch(literal: WaxLiteral): string {
        return `switch${literal}{/*`;
    }

    public case(literal: WaxLiteral): string {
        return `*/case ${literal}:`;
    }

    public break(literal: WaxLiteral): string {
        return 'break;/*';
    }
    
    public continue(literal: WaxLiteral): string {
        return `if(${literal.text()||literal.length==0}){continue}`;
    }

    public endswitch(): string {
        return '*/}';
    }
    
    public forelse(literal: WaxLiteral): string {
        const obj: string = literal.text().split(/\s+/)[2];
        return `var loopObj=${obj};for${literal}{`;
    }
    
    public empty(): string {
        return `} if(typeof loopObj!=="object"||Object.keys(loopObj).length<1){`;
    }
    
    public endforelse(): string {
        return `};delete loopObj;`;
    }
}
