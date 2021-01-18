
export class CoreDirectives {

    [name: string]: WaxDescriptor;

    /**
     * Sets a local variable for use
     */
    public set(this: WaxNode): string {
        return this.exec(`eval(#[0]+"="+$escape($json(#[1])));`);
    }

    /**
     * Creates a referenced/scoped variable
     */
    public define(this: WaxNode): string {
        return this.exec(`$[#[0]]=#[1];`);
    }

    /**
     * Creates a block, which is essentially for layouts
     */
    public section(this: WaxNode, sec: WaxLiteral): string {
        return this.exec(`$__super=$__env[${sec}]||new Function('s','return s()');var _block=$__env[${sec}]=$__super.bind(this,function(s,_block){var out='';`, false);
    }

    /**
     * Closes and evaluates a block
     */
    public endsection(this: WaxNode): string {
        return this.exec(`return out});delete _block`, false);
    }

    /**
     * Displays a block
     */
    public show(this: WaxNode): string {
        return this.argLiteral.length > 0 ? this.write(`$__env[#[0]].bind(this)()`) : this.exec(`return out});out+=_block.bind(this)();delete _block`, false);
    }

    /**
     * Creates a new macro
     */
    public macro(this: WaxNode): string {
        return this.exec(`$[#[0]]=(function(){var name=#[0];var call=$[name];var args=[].slice.call(arguments);var out = "";`, false);
    }

    /**
     * Closes a macro and binds the context
     */
    public endmacro(): string {
        return `return out;}).bind(this)`;
    }

    /**
     * Includes a template.
     */
    public include(this: WaxNode): string {
        return this.write(`$template(#[0],#[1])`);
    }

    /**
     * Outputs a value
     */
    public yield(this: WaxNode): string {
        return this.write(`(${this.configs.autoescape}?$escape:String)(#[0]||#[1])`);
    }

    /**
     * If conditional directive
     */
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

    /**
     * Conditional loop/switch breaking
     */
    public break(literal: WaxLiteral): string {
        return literal.length === 0 ? 'break/*': `if(${literal.text()}){break}`;
    }

    /**
     * Conditional loop/switch continue
     */
    public continue(literal: WaxLiteral): string {
        return `if(${literal.text()||literal.length==0}){continue}`;
    }

    /**
     * Close a switch statement
     */
    public endswitch(): string {
        return '*/}';
    }

    /**
     * Forelse directive
     */
    public forelse(literal: WaxLiteral): string {
        const obj: string = literal.text().split(/\s+/)[2];
        return `var loopObj=${obj};for${literal}{`;
    }

    /**
     * When a loopObj is empty
     */
    public empty(): string {
        return `} if(typeof loopObj!=="object"||Object.keys(loopObj).length<1){`;
    }

    /**
     * Close a forelse
     */
    public endforelse(): string {
        return `};delete loopObj;`;
    }
}
