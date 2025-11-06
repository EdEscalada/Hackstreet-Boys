const whileloop = {
  id: 'whileloop',
  title: 'While Loop',
  // Updated to match actual file in public/PDF (no space in filename)
  pdfUrl: '/PDF/WhileLoop.pdf',
  initialCode: `#include <iostream>\nusing namespace std;\nint main() {\n    int i = 0;\n    while (i < 5) {\n        cout << i << " ";\n        ++i;\n    }\n    cout << endl;\n    return 0;\n}`,
  tocItems: [
    'Introduction',
    'Syntax',
    'Examples',
    'Infinite loops & safety',
    'Exercises'
  ]
};

export default whileloop;
