# Contributions

First a big thanks to you for wanting to contribute to this project. I really want to make contributing to this project as easy and transparent as possible and so I wrote [the docs][1] which should make the specs of `Waxe` pretty clear and answer any questions you may have. If you still have unanswered queries, feel free to open an [issue][3].

## Guideline

All development of Waxe happens on [github][2] and as such in order to avoid clobbering the project, I have outlined below some common pre-contributing heads up.

### Common Heads up
- Are you making changes to less than 5 lines of code? Consider opening an [issue][3] instead describing what you'd want implemented.
- Are you thinking of adding more than 2 new directives/globals at a time? Consider creating a plugin instead.

### Coding Style
- Use Typescript only
- Use camelCase for naming
- Use 4 spaces(no tabs) for indentation
- Avoid indentation in directive sources
- Use ' instead of " except when expressly required
- Use semicolons(;) especially in exports
- Avoid abbreviations. Words like `fn` are allowed as suffixes

### Development Setup

- Fork [the github repo][2] and create your branch from `master`.
- Install all dependencies using any of below
    ``` bash
    $ npm install # Using NPM, or
    $ yarn add # If using yarn
    ```
- Add tests for every new directives/globals or Wax methods
- Update the docs for every noticeable change you've made
- Run tests and ensure it passes

**N/B**: Your PR tends to be merged quickly if it leads to less code redundancy.

[1]: https://waxe.now.sh
[2]: https://github.com/elcharitas/waxe
[3]: https://github.com/elcharitas/waxe/issues