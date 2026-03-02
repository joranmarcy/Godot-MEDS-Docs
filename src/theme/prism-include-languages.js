/**
 * Docusaurus theme override: register additional Prism languages.
 *
 * File path is important: `src/theme/prism-include-languages.js`.
 * See `@docusaurus/theme-classic` for the default implementation.
 */
export default function prismIncludeLanguages(Prism) {
  // Minimal-but-useful GDScript grammar.
  // Goal: good readability for docs snippets, not perfect parsing.
  Prism.languages.gdscript = {
    comment: {
      pattern: /#.*/,
      greedy: true,
    },
    annotation: {
      pattern: /@\w+\b/,
      alias: 'builtin',
    },
    string: [
      {
        // Triple-quoted strings (Godot 4 supports multiline strings)
        pattern: /\"\"\"[\s\S]*?\"\"\"|'''[\s\S]*?'''/,
        greedy: true,
      },
      {
        pattern: /'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\"/,
        greedy: true,
      },
    ],
    number: /\b0x[\da-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
    keyword: [
      /\b(?:and|or|not|in|is|as)\b/,
      /\b(?:if|elif|else|for|while|match|break|continue|pass|return)\b/,
      /\b(?:class|class_name|extends|func|var|const|enum|static|signal)\b/,
      /\b(?:await|yield|super|self)\b/,
      /\b(?:true|false|null)\b/,
      /\b(?:preload|load)\b/,
    ],
    builtin: [
      /\b(?:void|bool|int|float|String|StringName|NodePath|Array|Dictionary|PackedStringArray)\b/,
      /\b(?:RID|Callable|Variant)\b/,
    ],
    // Godot shorthand node paths, e.g. $Foo or %Foo
    variable: /[$%][A-Za-z_]\w*/,
    function: /\b[_a-zA-Z]\w*(?=\s*\()/,
    operator:
      /\+\+|--|\*\*|<<|>>|<=|>=|==|!=|\+=|-=|\*=|\/=|%=|&&|\|\||[+\-*/%<>=!?~^|&]/,
    punctuation: /[{}[\];(),.:]/,
  };

  // Common aliases used in fenced code blocks.
  Prism.languages.gd = Prism.languages.gdscript;
}
