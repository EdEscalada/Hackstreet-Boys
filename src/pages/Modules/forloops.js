// Module descriptor for the For Loops module
const forloops = {
  id: 'forloops',
  title: 'For Loops',
  pdfUrl: '/PDF/For Loop.pdf',
  initialCode: `#include <iostream>\nusing namespace std;\nint main() {\n    // Example: print numbers 0..4 using a for loop\n    for (int i = 0; i < 5; ++i) {\n        cout << i << \" ";\n    }\n    cout << endl;\n    return 0;\n}`,
  tocItems: [
    'Introduction to For Loops',
    'Syntax',
    'Examples',
    'Common Patterns',
    'Exercises'
  ]
};

export default forloops;
