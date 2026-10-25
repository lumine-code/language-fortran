describe("language-fortran indentation boundaries", () => {
  let editor;
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-fortran");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.fortran"));
    editor.update({ tabLength: 4, softTabs: true });
    await editor.whenGrammarSettled();
  });
  afterEach(() => editor?.destroy());

  for (const [name, text, row, indent] of [
    ["uppercase header", "PROGRAM demo\nEND PROGRAM demo", 0, 4],
    ["implicit program", "print *, 1\nend", 0, 0],
    ["block if header", "program demo\n    if (ready) then\n    end if\nend program demo", 1, 8],
    [
      "block if body",
      "program demo\n    if (ready) then\n        print *, 1\n    end if\nend program demo",
      2,
      8,
    ],
    [
      "else header",
      "program demo\n    if (ready) then\n        print *, 1\n    else\n    end if\nend program demo",
      3,
      8,
    ],
    [
      "else body",
      "program demo\n    if (ready) then\n        print *, 1\n    else\n        print *, 2\n    end if\nend program demo",
      4,
      8,
    ],
    ["loop header", "program demo\n    do i = 1, 5\n    end do\nend program demo", 1, 8],
    [
      "loop body",
      "program demo\n    do i = 1, 5\n        print *, i\n    end do\nend program demo",
      2,
      8,
    ],
    ["inline where", "program demo\n    where (values > 0) values = 1\nend program demo", 1, 4],
    [
      "block where header",
      "program demo\n    where (values > 0)\n    end where\nend program demo",
      1,
      8,
    ],
    [
      "block where body",
      "program demo\n    where (values > 0)\n        values = 1\n    end where\nend program demo",
      2,
      8,
    ],
  ]) {
    it(`keeps the correct indentation after ${name}`, async () => {
      editor.setText(text);
      await editor.whenGrammarSettled();
      editor.setCursorBufferPosition([row, Infinity]);
      editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
      await editor.whenGrammarSettled();
      expect(editor.lineTextForBufferRow(row + 1)).toBe(" ".repeat(indent));
      expect(editor.getCursorBufferPosition().column).toBe(indent);
    });
  }

  it("does not accumulate indentation inside a program", async () => {
    editor.setText("program demo\n    print *, 1\nend program demo");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([1, Infinity]);
    editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(2)).toBe(" ".repeat(4));
    expect(editor.getCursorBufferPosition().column).toBe(4);
  });

  it("does not indent after an inline if", async () => {
    editor.setText("program demo\n    if (ready) print *, 1\nend program demo");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([1, Infinity]);
    editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(2)).toBe(" ".repeat(4));
    expect(editor.getCursorBufferPosition().column).toBe(4);
  });

  it("still indents a program header", async () => {
    editor.setText("program demo\nend program demo");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([0, Infinity]);
    editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(1)).toBe(" ".repeat(4));
    expect(editor.getCursorBufferPosition().column).toBe(4);
  });
});
