import { dbg } from "./debug"
import { mkConfig, WaxDelimiter, WaxConfig } from "./compiler"
import { transpile, genTemplate } from "./compiler/parser"
import { CoreWax } from "./plugins"

export = class Wax implements Wax {
    
    public configs: WaxConfig
    
    public delimiter: WaxDelimiter
    
    public templates: {
        [name: string]: WaxTemplate
    }
    
    public tags: {
        [tag: string]: WaxNode
    }

    public plugins: {
        [label: string]: WaxPlugin
    }

    private static _core?: Wax

    private constructor()
    {
        dbg("Wax", this)
        this.configs = WaxConfig
        this.delimiter = WaxDelimiter
        this.tags = {}
        this.plugins = {}
        this.templates = {}
    }
    
    public static global(name: string, value: any = null): any {
        return this.core.configs.context[name] = value;
    }
    
    public static directive(tag: string, descriptor: WaxNode["descriptor"]): WaxNode {
        return this.core.tags[tag] = {tag, descriptor}
    }
    
    public static setDelimiter(delimiter: WaxDelimiter): WaxDelimiter {
        return Wax.core.delimiter = delimiter
    }
    
    public static getConfigs(): WaxConfig {
        return Wax.core.configs
    }
    
    public static getDelimiter(): WaxDelimiter {
        return Wax.core.delimiter
    }
    
    public static getTag(tagOpts: WaxTagOpts): WaxNode {
        const tagDef = this.core.tags[tagOpts.tag] || null
        if(typeof tagDef === "object" && tagDef !== null){
            for (const def in tagOpts) {
                tagDef[def] = tagOpts[def]
            }
        }
        return tagDef
    }
    
    public static addPlugin(classLabel: WaxPluginConstruct){
        const { directives = {} } = new classLabel(this)
        for (const tag in directives) {
            this.directive(tag, directives[tag])
        }
    }

    public static template(name: string, source: string, config: WaxConfig = this.getConfigs()): WaxTemplate
    {
        if(typeof source === "string") {
            this.core.templates[name] = genTemplate(
                transpile(Wax, source, mkConfig(config, Wax.getDelimiter())),
                name
            )
        }
        
        return this.core.templates[name]
    }
    
    public static resolve(selectors: string, context: WaxConfig["context"] = {}, visible: boolean = true): void
    {
        if(typeof document !== "undefined"){
            document.querySelectorAll(selectors).forEach((element: any) => {
                element.innerHTML = element.value = Wax.template(element.id, element.value||element.innerHTML)(context)
                if('hidden' in element) element.hidden = !visible
            })
        }
    }

    /**
     * Gets or Creates the Wax instance
     *
     * @returns Wax
     */
    public static get core(){
        if(!(this._core instanceof Wax)){
            this._core = new Wax
            Wax.addPlugin(CoreWax)
        }
        return this._core
    }
}