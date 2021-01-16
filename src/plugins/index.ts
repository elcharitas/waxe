import { extendProp } from '../debug';
import { CoreDirectives } from './core';
import { MiscDirectives } from './misc';

/** The default plugin of Waxe */
export class CoreWax implements WaxPlugin {
    /**
     * A collection of core directives
     */
    public directives: WaxPlugin['directives'];

    /**
     * Define directives and add `$core` global
     *
     * @param Wax - The Wax Instance
     */
    public constructor(Wax: Wax) {

        this.directives = new (extendProp(CoreDirectives, MiscDirectives.prototype));
        
        Wax.global('$core', this.directives);
    }
}