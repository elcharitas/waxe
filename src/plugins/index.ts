import { CoreDirectives } from './core';

export class CoreWax implements WaxPlugin {

    public directives: WaxPlugin['directives'];

    public constructor(Wax: Wax) {

        this.directives = new CoreDirectives;

    }
}