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
     * Define the core directives
     */
    public constructor() {

        this.directives = new (extendProp(CoreDirectives, MiscDirectives.prototype));
    }
}