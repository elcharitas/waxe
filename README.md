# Waxe
[![Version][1]][2]
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)][5]
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/elcharitas/waxe/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/elcharitas/waxe)][3]
[![Twitter: elcharitas](https://img.shields.io/twitter/follow/elcharitas.svg?style=social)](https://twitter.com/elcharitas)

> A zero dependency, Laravel blade styled template engine for JavaScript

## Introduction

Waxe, pronounced as Wax (/wæks/), came out of the need for a fast, less redundant, lightweight and pluggable JavaScript template engine.

Waxe's core parser was highly inspired by [doT's][4] except Waxe is built to be pluggable whereas doT is built to be customizable.

Waxe syntax is much similar to [Laravel's Template engine: Blade](https://laravel.com) and more importantly Waxe uses certain terminologies used in Blade like: directives and conditionals. However, other than this, Waxe is pretty neat with its own definitions.

## Latest Release

The latest stable release of Waxe is [Latest Release][1]. Release notes can be found on the [github repo][0].

Changelogs for each release are also available in the `CHANGELOG.md` file.

## Install

Installing Waxe is pretty straight forward. Whether you're precompiling/rendering your templates or you simply want to use Waxe on the fly!

#### Via NPM or Yarn?

Installing via npm or yarn is advised for production (remember to always precompile templates) or if you wish to use Waxe CLI

``` zsh
$ npm i -D waxe # With NPM
$ yarn add waxe # With Yarn
```

#### Via Includes or CDNs

This is ideal for testing purposes or in cases where in the use just cant be avoided. I advise you avoid using this

``` html
<script src="/path/to/waxe.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/package/waxe"></script>
```

## Usage

Frankly, the only method you need to get familiar with is `Wax.template` which takes two arguments, the `name` of the template and its `source`.

This method returns a callable function much similar to [doT's][4] which can be reused anywhere by simply passing the context to use as an argument.

``` node
const pagefn = Wax.template("sample", `@yield('Hello World')`)

console.log(
    pagefn({})
); //outputs 'Hello World'
```

For more help on which directives Waxe supports and how to use the CLI, [check the official docs][5]

## Author

[**Jonathan Irhodia**](https://elcharitas.com.ng)
* Twitter: [@elcharitas](https://twitter.com/elcharitas)
* Github: [@elcharitas](https://github.com/elcharitas)
* LinkedIn: [@elcharitas](https://linkedin.com/in/elcharitas)

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/elcharitas/waxe/issues). You can also take a look at the [contributing guide](https://github.com/elcharitas/waxe/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!


## License

Copyright © 2021 [Jonathan Irhodia](https://github.com/elcharitas).

This project is [MIT][3] licensed.

[0]: https://github.com/elcharitas/waxe
[1]: https://img.shields.io/badge/version-0.0.1-yellow.svg?cacheSeconds=2592000
[2]: https://npmjs.org/package/waxe
[3]: https://github.com/elcharitas/waxe/blob/master/LICENSE
[4]: https://github.com/olado/doT
[5]: https://github.com/elcharitas/waxe#readme