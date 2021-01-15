import { CoreDirectives } from './core';
import { MiscDirectives } from './misc';

export class CoreWax implements WaxPlugin {

    public directives: WaxPlugin['directives'];

    public constructor(Wax: Wax) {
        
        Object.defineProperty(CoreDirectives, 'prototype', {
            value: { ...CoreDirectives.prototype, ...MiscDirectives.prototype }
        })

        this.directives = new CoreDirectives;
    }
}