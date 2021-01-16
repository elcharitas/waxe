import { dbg } from './debug';
import { WaxConfig } from './compiler';
import { parseTemplate } from './compiler/parser';
import { CoreWax } from './plugins';

/** Default export Wax add support for esModules */
export = class Wax implements Wax {
    /**
     * Waxe Configuration options
     */
    public configs: WaxConfig;

    /**
     * A collection of resolved templates
     */
    public templates: WaxCollection<WaxTemplate>;
    
    /**
     * A collection of tags
     */
    public tags: WaxCollection<WaxNode>;

    /**
     * The Wax Instance holder
     */
    private static _core: Wax = null;

    /**
     * This creates a singleton of Wax
     *
     * @throws TypeErrors - When called directly or attempt to reinstantiate
     */
    private constructor()
    {
        dbg('Wax', this);
        dbg('Wax', Wax._core, null);
        this.configs = WaxConfig;
        this.tags = {};
        this.templates = {};
    }

    /**
     * Assigns a value to a variable globally
     * 
     * **Example**
     * ```js
     * Wax.global('monkey', 'Buboo');
     * ```
     * Now you can use it in any template
     * ```waxe
     * @yield($monkey)
     * ```
     * @param name - The Name of new variable
     * @param value - Value to be assigned
     * @returns - The assigned value
     */
    public static global(name: string, value: any = null): any {
        return this.core.configs.context[name] = value;
    }

    /**
     * Create a new directive
     * 
     * **Example**
     * ```js
     * Wax.directive('monkey', function(){
     *      return 'prompt("I am a monkey!");'
     * });
     * ```
     * Now it can be used in a template
     * ```waxe
     * @monkey
     * ```
     * @param tagName - The name of the directive
     * @param descriptor - The directive's descriptor
     * @returns - The created node for type checks
     */
    public static directive(tag: string, descriptor: WaxDescriptor): WaxNode {
        return this.core.tags[tag] = {tag, descriptor};
    }

    /**
     * Creates a template using its `name` and `source` text
     * Can also be used to get a template by using the name only
     *
     * **Example**
     * ```js
     * var tpl = Wax.template('hello.waxe', '@yield("Hello")');
     * tpl === Wax.template('hello.waxe') // true
     * ```
     * @param name - The name of the template
     * @param source - The source text for the template
     * @returns - The resolved {@link WaxTemplate | template function}
     */
    public static template(name: string, source: string, config: WaxConfig = this.getConfigs()): WaxTemplate
    {
        if(typeof source === 'string') {
            this.core.templates[name] = parseTemplate(name, source, Wax);
        }
        
        return this.core.templates[name];
    }

    /**
     * Resolves a DOM's content
     *
     * **N/B**: Use this only in browsers
     * 
     * **Example**
     * ```js
     * Wax.resolve('.waxe');
     * //renders all elements with class waxe
     * ```
     * 
     * @param selectors - CSS-like query selectors to use
     * @param context - The context to apply
     * @param visible - Whether or not to make elements visible
     */
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

    /**
     * Sets the {@link WaxDelimiter | delimiter options}
     *
     * @returns - The new delimiter
     */
    public static setDelimiter(delimiter: WaxDelimiter): WaxDelimiter {
        return Wax.core.configs.delimiter = {...Wax.getDelimiter(), ...delimiter};
    }

    /**
     * Gets the {@link WaxConfig | configuration options}
     */
    public static getConfigs(): WaxConfig {
        return Wax.core.configs;
    }

    /**
     * Gets the current {@link WaxDelimiter | delimiter}
     */
    public static getDelimiter(): WaxDelimiter {
        return Wax.getConfigs().delimiter;
    }

    /**
     * Get a directive/creates a fake using its options
     *
     * @param tagOpts - A convienent match of tag options to search
     * @returns - The directive node
     */
    public static getTag(tagOpts: WaxTagOpts): WaxNode {
        let tagDef = this.core.tags[tagOpts.tag] || null;
        if(typeof tagDef === 'object' && tagDef !== null){
            tagDef = {...tagDef, ...tagOpts};
        }
        return tagDef;
    }

    /**
     * Add a Plugin's directives using its constructor
     *
     * **Example**
     * ```js
     * import SomePlugin from "some-plugin";
     * //register the plugin seamlessly
     * Wax.addPlugin(SomePlugin);
     * ```
     * 
     * @param classLabel - The constructor of the plugin
     */
    public static addPlugin(classLabel: WaxPluginConstruct){
        const { directives = {} } = new classLabel(this);
        for (const tag in directives) {
            if(typeof directives[tag] === 'function') {
                this.directive(tag, directives[tag]);
            }
        }
    }
}