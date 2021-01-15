const fs = require('fs');
const docs = require('typedoc');
const wax = require('../lib/waxe');
const { resolve } = require('path')
const glob = require('glob');
const cwd = process.cwd();
const srcObj = glob.sync('src/**.waxe', {
    cwd: module.path
});

async function main() {
    const app = new docs.Application();
    const pages = {};
    
    app.options.addReader(new docs.TSConfigReader);
    app.options.addReader(new docs.TypeDocReader);
    
    app.bootstrap(require('./typedoc.json'));
    
    const project = app.convert();
    
    if (project) {
        const outputDir = '_dist/api';
        //this is used for special cases ;)
        process.chdir(cwd);
        await app.generateDocs(project, outputDir);
        srcObj.forEach(src => {
            const path = resolve(module.path, src);
            const outPath = src.replace('src', '_dist').replace('waxe', 'html');
            const tpl = wax.template(src, fs.readFileSync(path).toString());
            fs.writeFileSync(outPath, tpl.call({}) || '')
        });
    }
}

main(process.chdir(module.path)).catch(console.error);