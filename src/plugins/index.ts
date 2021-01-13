import { CoreDirectives } from './core';
import { MiscDirectives } from './misc';

export class CoreWax implements WaxPlugin {

    public directives: WaxPlugin['directives'];

    public constructor(Wax: Wax) {

        this.directives = new (CoreDirectives.bind(new MiscDirectives));
    }
}