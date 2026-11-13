const CASES = require("./fixtures/upstream-empty-parameters.json");

describe("Fortran upstream empty parameter lists", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-fortran");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.fortran"));
  });

  afterEach(() => editor?.destroy());

  const rootNode = () => editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);

  function check(test) {
    const root = rootNode();
    expect(root.hasError).toBe(false);
    expect(root.descendantsOfType("parameters").length).toBe(test.parametersCount);
    for (const expected of test.statements) {
      const statement = root
        .descendantsOfType(expected.type)
        .find((node) => node.childForFieldName("name")?.text === expected.name);
      expect(statement).withContext(expected.name).toBeDefined();
      const parameters = statement?.childForFieldName("parameters");
      if (expected.parameters === null) {
        expect(parameters).toBeNull();
      } else {
        expect(parameters?.type).toBe("parameters");
        expect(parameters?.text).toBe(expected.parameters.text);
        expect(parameters?.namedChildren.map((node) => node.text)).toEqual(
          expected.parameters.names,
        );
      }
    }
  }

  for (const test of CASES) {
    it(test.name + " through incremental edits and undo", async () => {
      editor.setText(test.text);
      expect(await editor.whenGrammarSettled()).toBe(true);
      check(test);
      editor.getBuffer().clearUndoStack();
      editor.getBuffer().append("program upstream_tail\nend program upstream_tail\n");
      expect(await editor.whenGrammarSettled()).toBe(true);
      check(test);
      editor.undo();
      expect(await editor.whenGrammarSettled()).toBe(true);
      expect(editor.getText()).toBe(test.text);
      check(test);
    });
  }
});
