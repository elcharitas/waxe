const Wax = require("../lib/waxe")
const { strictEqual } = require("assert")

describe("Template Parser", function(){
    
    describe("#yield directive", function(){
        var test = "Hi",
            tpl = Wax.template("test", `@yield("${test}")`)
        strictEqual(tpl({}), test)
    })
    
    describe("#template context", function(){
        var test = "Hi",
            tpl = Wax.template("test", `@yield($test)`)
        strictEqual(tpl({test}), test)
    })
    
    describe("#define directive", function(){
        var test = "Hi",
            tpl = Wax.template("test", `@define("test", "${test}")@yield($test)`)
        strictEqual(tpl({}), test)
    })
});