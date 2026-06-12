/**
 * Ground Control "ghosted Tron" Shiki theme.
 *
 * Syntax tones are fixed (the terminal is always dark, in both light and dark
 * site modes), so the hexes are hardcoded to the `--gc-term-*` token values:
 *   comment → dim italic · keyword/type → cyan · function → blue
 *   string → green · number/constant → spot · punctuation → muted steel
 *
 * Shared by the markdown pipeline (astro.config) and the <CodeBlock> component.
 */
const TERM = {
  bg: '#0A0D12',
  text: '#B9C9D6',
  dim: '#435A6B',
  // comments sit a notch brighter than the structural dim (gutters) so prose-in-code stays readable
  comment: '#6E8799',
  cyan: '#74BBD8',
  blue: '#8FB2D4',
  green: '#86B8A6',
  spot: '#CB8E5C',
  punct: '#5D7585',
};

const tron = {
  name: 'gc-tron',
  type: 'dark' as const,
  colors: {
    'editor.background': TERM.bg,
    'editor.foreground': TERM.text,
  },
  settings: [
    { settings: { foreground: TERM.text, background: TERM.bg } },
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: TERM.comment, fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'storage',
        'storage.type',
        'storage.modifier',
        'variable.language',
        'constant.language.boolean',
      ],
      settings: { foreground: TERM.cyan },
    },
    {
      scope: ['entity.name.type', 'support.type', 'entity.name.class', 'support.class', 'entity.name.tag'],
      settings: { foreground: TERM.cyan },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'entity.name.method'],
      settings: { foreground: TERM.blue },
    },
    { scope: ['entity.other.attribute-name'], settings: { foreground: TERM.blue } },
    {
      scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'],
      settings: { foreground: TERM.green },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'],
      settings: { foreground: TERM.spot },
    },
    {
      scope: ['punctuation', 'meta.brace', 'punctuation.separator', 'punctuation.terminator', 'keyword.operator'],
      settings: { foreground: TERM.punct },
    },
    {
      scope: ['variable', 'variable.other', 'variable.parameter', 'meta.definition.variable'],
      settings: { foreground: TERM.text },
    },
  ],
};

export default tron;
