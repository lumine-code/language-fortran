const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "fortran-highlights.scm");

describe("Fortran Tree-sitter highlights", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-fortran");
  });

  afterEach(() => editor?.destroy());

  async function setUp(text) {
    editor = await lumine.workspace.open("parameters.f90");
    editor.setText(text);
    await editor.getBuffer().languageMode.ready;
  }

  function rawCaptures(startRow, endRow) {
    const layer = editor.getBuffer().languageMode.rootLanguageLayer;
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
  }

  it("keeps a large parameter list leaf-rooted and tile captures local", async () => {
    const lines = ["subroutine generated("];
    for (let index = 0; index < 6000; index++) {
      lines.push(`  parameter_${index}${index < 5999 ? "," : ""}`);
    }
    lines.push(")", "end subroutine generated");
    await setUp(lines.join("\r\n"));

    expect(editor.scopeDescriptorForBufferPosition([1, 2]).getScopesArray()).toContain(
      "variable.parameter.fortran",
    );

    const captures = rawCaptures(3000, 3006);
    const parameters = captures.filter((capture) => capture.name === "variable.parameter.fortran");
    expect(captures.length).toBeLessThanOrEqual(20);
    expect(parameters.length).toBe(6);
    expect(
      parameters.every(
        (capture) =>
          capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
      ),
    ).toBe(true);

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8").replaceAll("\r\n", "\n");
    expect(query).toContain(
      "((identifier) @variable.parameter.fortran\n  (#is? test.childOfType parameters))",
    );
    expect(query).not.toContain("(parameters\n  (identifier) @variable.parameter.fortran)");
  });
});
