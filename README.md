# language-fortran

Fortran language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-fortran](https://github.com/stadelmanma/tree-sitter-fortran).
- **Syntax highlighting**: full tree-sitter grammar coverage for Fortran files.
- **Folding**: folds blocks from the parse tree rather than by indentation.

## Installation

To install `language-fortran` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-fortran`.

## Services

- `hyperlink.injection`: consumed to highlight URLs inside Fortran files as clickable links.
- `todo.injection`: consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
