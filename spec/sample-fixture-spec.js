const path = require("path");

// The fixture beside this file is a plain sample of the language — the file to
// open when you want to look at the highlighting rather than assert on it. This
// spec is only what stops the sample quietly rotting: the grammar still claims
// it, it still parses, and the scopes that took real work to get right are
// still there.

describe("Fortran sample fixture", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-fortran");
    lumine.config.set("editor.useTreeSitterParsers", true);
    editor = await lumine.workspace.open(path.join(__dirname, "fixtures", "sample.f90"));
    await editor.getBuffer().getLanguageMode().ready;
  });

  function scopesAt(text, offset = 0) {
    const lines = editor.getBuffer().getLines();
    const row = lines.findIndex((line) => line.includes(text));
    expect(row).toBeGreaterThan(-1);
    const column = lines[row].indexOf(text) + offset;
    return editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray();
  }

  it("parses without error", () => {
    expect(editor.getGrammar().scopeName).toBe("source.fortran");
    expect(editor.getBuffer().getLanguageMode().tree.rootNode.hasError).toBe(false);
  });

  it("scopes the punctuation this port had to split by hand", () => {
    // Upstream captured all of these as one Neovim `@punctuation.*` name.
    expect(scopesAt("self%width", 4)).toContain("keyword.operator.accessor.fortran");
    expect(scopesAt("totals = [ (real", 9)).toContain(
      "punctuation.definition.array.begin.bracket.square.fortran",
    );
    expect(scopesAt("integer, parameter :: dp", 7)).toContain(
      "punctuation.separator.comma.fortran",
    );
    expect(scopesAt("integer, parameter :: dp", 19)).toContain(
      "punctuation.separator.declaration.fortran",
    );
  });

  it("scopes the line continuation", () => {
    expect(scopesAt("floor%width, &", 13)).toContain("punctuation.separator.continuation.fortran");
  });

  it("scopes strings without claiming a quoting style the node cannot tell apart", () => {
    // A single `string_literal` node covers both `'…'` and `"…"`.
    expect(scopesAt("'Fortran sample'", 1)).toContain("string.quoted.fortran");
  });

  it("scopes comments, types and functions", () => {
    expect(scopesAt("! A Fortran sample", 0)).toContain("comment.line.exclamation.fortran");
    expect(scopesAt("real(dp) :: a", 0)).toContain("support.type.builtin.fortran");
    expect(scopesAt("function rectangle_area", 9)).toContain("entity.name.function.fortran");
  });
});
