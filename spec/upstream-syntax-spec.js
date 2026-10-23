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
});
