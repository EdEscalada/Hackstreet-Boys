const controlstatements = {
  id: 'controlstatements',
  title: 'Control Statements',
  pdfUrl: '/PDF/Control Statements.pdf',
  initialCode: `#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 0; i < 5; ++i) {\n        if (i % 2 == 0) continue;\n        if (i == 3) break;\n        cout << i << " ";\n    }\n    cout << endl;\n    return 0;\n}`,
  tocItems: [
    'if / else',
    'switch',
    'break & continue',
    'return',
    'Exercises'
  ]
};

export default controlstatements;
