import { dbg } from './debug';
import { WaxConfig } from './compiler';
import { parseTemplate } from './compiler/parser';
import { CoreWax } from './plugins';

/**  */
export = class Wax implements Wax {
    /**
     * Waxe Configuration options
     *
     * @var WaxConfig
     */
    public configs: WaxConfig;

    /**
     * A list of resolved templates
     */
    public templates: WaxCollection<WaxTemplate>;
    
    public tags: WaxCollection<WaxNode>;

    private static _core?: Wax;

    private constructor()
    {
        dbg('Wax', this);
        this.configs = WaxConfig;
        this.tags = {};
        this.templates = {};
    }
    
    public static global(name: string, value: any = null): any {
        return this.core.configs.context[name] = value;
    }
    
    public static directive(tag: string, descriptor: WaxDescriptor): WaxNode {
        return this.core.tags[tag] = {tag, descriptor};
    }
    
    public static setDelimiter(delimiter: WaxDelimiter): WaxDelimiter {
        return Wax.core.configs.delimiter = {...Wax.getDelimiter(), ...delimiter};
    }
    
    public static getConfigs(): WaxConfig {
        return Wax.core.configs;
    }
    
    public static getDelimiter(): WaxDelimiter {
        return Wax.getConfigs().delimiter;
    }
    
    public static getTag(tagOpts: WaxTagOpts): WaxNode {
        let tagDef = this.core.tags[tagOpts.tag] || null;
        if(typeof tagDef === 'object' && tagDef !== null){
            tagDef = {...tagDef, ...tagOpts};
        }
        return tagDef;
    }
    
    public static addPlugin(classLabel: WaxPluginConstruct){
        const { directives = {} } = new classLabel(this);
        for (const tag in directives) {
            if(typeof directives[tag] === 'function') {
                this.directive(tag, directives[tag]);
            }
        }
    }

    public static template(name: string, source: string, config: WaxConfig = this.getConfigs()): WaxTemplate
    {
        if(typeof source === 'string') {
            this.core.templates[name] = parseTemplate(name, source, Wax);
        }
        
        return this.core.templates[name];
    }
    
    public static resolve(selectors: string, context: WaxContext = {}, visible: boolean = true): void
    {
        if(typeof document !== 'undefined'){
            document.querySelectorAll(selectors).forEach((element: any) => {
                element.innerHTML = element.value = Wax.template(element.id, element.value||element.innerHTML)(context);
                if('hidden' in element) element.hidden = !visible;
            });
        };
    }

    /**
     * Gets or Creates the Wax instance
     *
     * @returns The created Wax Instance
     */
    public static get core(){
        if(!(this._core instanceof Wax)){
            this._core = new Wax;
            Wax.addPlugin(CoreWax);
        }
        return this._core;
    }
}