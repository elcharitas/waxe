# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Eslint to check coding styles
- Added buildURL helper

### Changed
- fixed bugs in docs generator 

## [0.0.7] (2021-01-15)
### Added
- Strict directive scopes
- Strict no construction rule
- Site pages using Waxe
- Community CODE OF CONDUCT
- CodeQL security analysis workflow
- Dependabot to track dependencies

### Changed
- Updated debug handler
- Updated Contribution guide

## [0.0.6] (2021-01-13)
### Changed
- Patched up the parser
- Fixed more [tslint][2] issues

## [0.0.5] (2021-01-13)
### Changed
- Changed version specific links
- Fixed Function binding strategy
- Addressed and fixed tslint issues on [code climate][2]

## [0.0.4] (2021-01-12)
### Changed
- Fixed [vercel app][1] build issues
- Added patches for Travis CI

## [0.0.3] (2021-01-12)
### Added
- Documentation theme to `docs/theme`
- API introduction at `docs/index.md`
- Patch up samples and add full support to *schip* script
- `waxe.d.ts` to hold global types definition

### Changed
- Edited Changelog links to prevent further breaking
- Change docs generator to typedoc v0.20
- Refactor code for [code climate][2] issues

### Removed
- Rendered templates from vcs

## [0.0.2] (2021-01-08)
### Added
- New Directives, [Access full list here][1]
- Global `merge` to merge multiple contexts
- New methods to *argLiterals* as `WaxLiteral`
- `Wax.template` Tests
- Types definition in `src/blob`

### Changed
- Walker process and node traverser
- Rename `Wax.parseEl` to `Wax.resolve`
- Autoblock Discosvery tag look up and parsing
- Improved Package README.md
- Improved File Structure

### Removed
- Support for `lib` in vcs


## [0.0.1] (2021-01-06)
### Added
- Directives to CoreWax Plugin
- Default Plugin, CoreWax
- Sample html and template file
- Autoblock Discovery for JavaScript keywords and end blocks
- Support for DOM parsing
- Waxe setup with easy configure


[Unreleased]: https://github.com/elcharitas/waxe/releases
[0.0.1]: https://github.com/elcharitas/waxe/releases/tag/0.0.1
[0.0.2]: https://github.com/elcharitas/waxe/releases/tag/0.0.2
[0.0.3]: https://github.com/elcharitas/waxe/releases/tag/0.0.3
[0.0.4]: https://github.com/elcharitas/waxe/releases/tag/0.0.4
[0.0.5]: https://github.com/elcharitas/waxe/releases/tag/0.0.5
[0.0.6]: https://github.com/elcharitas/waxe/releases/tag/0.0.6
[0.0.7]: https://github.com/elcharitas/waxe/releases/tag/0.0.7

[1]: https://waxe.now.sh
[2]: https://codeclimate.com/github/elcharitas/waxe