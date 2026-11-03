describe("Fortran upstream syntax regressions", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-fortran");
    editor = await lumine.workspace.open("constructs.f90");
  });

  afterEach(() => editor?.destroy());

  async function parse(text) {
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBe(false);
    return root;
  }

  it("parses non_recursive procedures", async () => {
    const root = await parse("non_recursive subroutine foo()\nend subroutine foo\n");
    expect(root.namedChildren.filter((node) => node.type === "subroutine").length).toBe(1);
    expect(root.descendantsOfType("procedure_qualifier")[0].text).toBe("non_recursive");
  });

  it("supports derived types in array constructors and scopes end-type names", async () => {
    await parse(
      [
        "program sample",
        "  type :: item",
        "    integer :: value",
        "  end type item",
        "  type(item) :: values(1)",
        "  values = [item :: item(1)]",
        "end program sample",
        "",
      ].join("\n"),
    );
    const column = editor.lineTextForBufferRow(3).indexOf("item");
    expect(editor.scopeDescriptorForBufferPosition([3, column]).getScopesArray()).toContain(
      "support.type.fortran",
    );
  });

  it("continues lexical tokens across a line and a comment", async () => {
    await parse(
      "program sample\n  x = .&\n    ! comment\n    &5\n  x = 4.5d-&\n    ! comment\n    &2\nend program sample\n",
    );
  });

  it("preserves string content and continuation boundaries", async () => {
    const root = await parse(
      "program sample\n  character(len=30) :: text\n" +
        "  text = '  a&!b'\n  text = \"left&\n    & right\"\nend program sample\n",
    );
    const contents = root.descendantsOfType("string_content").map((node) => node.text);
    expect(contents).toContain("  a&!b");
    expect(contents).toContain("left");
    expect(contents).toContain(" right");
    expect(root.descendantsOfType("string_literal").length).toBe(2);
  });

  it("parses negative format scale factors and named block labels", async () => {
    const root = await parse(
      "program sample\n  outer: block\n    print 100, 1.0\n100 format(-1p,e10.3)\n  end block outer\nend program sample\n",
    );
    expect(root.descendantsOfType("block_label").map((node) => node.text)).toEqual([
      "outer",
      "outer",
    ]);
    expect(root.descendantsOfType("edit_descriptor").map((node) => node.text)).toContain("-1p");
  });

  it("scopes DATA, ELSE IF THEN and loop-label references", async () => {
    await parse(
      "program sample\n  integer :: value\n  data value /1/\n  outer: do\n" +
        "    if (value == 1) then\n      cycle outer\n    else if (value == 2) then\n" +
        "      exit outer\n    end if\n  end do outer\nend program sample\n",
    );
    for (const [row, text, scope] of [
      [2, "data", "keyword.control.fortran"],
      [6, "then", "keyword.control.fortran"],
      [5, "outer", "entity.other.attribute-name.fortran"],
    ]) {
      expect(
        editor
          .scopeDescriptorForBufferPosition([row, editor.lineTextForBufferRow(row).indexOf(text)])
          .getScopesArray(),
      ).toContain(scope);
    }
  });
});
