module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^([A-Z]+-\d+):\s(fix|feat|doc|chore|style|refactor|test|perf):\s(.+)$/,
      headerCorrespondence: ['ticket', 'type', 'subject']
    }
  },
  rules: {
    'header-match-team-pattern': [2, 'always'],
    'type-enum': [
      2,
      'always',
      ['fix', 'feat', 'doc', 'chore', 'style', 'refactor', 'test', 'perf']
    ]
  },
  plugins: [
    {
      rules: {
        'header-match-team-pattern': (parsed) => {
          const { header } = parsed;
          const pattern = /^[A-Z]+-\d+:\s(fix|feat|doc|chore|style|refactor|test|perf):\s.+$/;

          if (!pattern.test(header)) {
            return [
              false,
              `Commit message must match pattern: ISSUE-ID: type: message

Example: PROJ-123: feat: add login feature

Valid types: fix | feat | doc | chore | style | refactor | test | perf`
            ];
          }
          return [true];
        }
      }
    }
  ]
};
