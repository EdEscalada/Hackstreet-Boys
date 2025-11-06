const dowhile = {
  id: 'dowhile',
  title: 'Do-While Loop',
  pdfUrl: '/PDF/Do-While Loop.pdf',
  initialCode: `#include <iostream>\nusing namespace std;\nint main() {\n    int i = 0;\n    do {\n        cout << i << " ";\n        ++i;\n    } while (i < 5);\n    cout << endl;\n    return 0;\n}`,
  tocItems: [
    'What is do-while',
    'Syntax',
    'When to use',
    'Examples',
    'Exercises'
  ]
};

export default dowhile;
