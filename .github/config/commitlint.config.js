module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'revert'],
    ],
    'subject-case': [2, 'never', ['sentence-case']], // Customize case rules
  },
};
