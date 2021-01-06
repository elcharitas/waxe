import { Wax } from "../../blob"
import { WaxPlugin } from "../"
import { CoreDirectives } from "./directives"

export class CoreWax implements WaxPlugin {

    public directives: WaxPlugin["directives"]
    
    public constructor(Wax: Wax){
        
        this.directives = new CoreDirectives
        
    }
}