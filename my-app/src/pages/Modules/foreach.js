const foreach = {
  id: 'foreach',
  title: 'For-Each Loop',
  // Use the actual file name present in public/PDF (hyphenated)
  pdfUrl: '/PDF/For-Each Loop.pdf',
  initialCode: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> v = {1,2,3,4,5};\n    for (int x : v) {\n        cout << x << " ";\n    }\n    cout << endl;\n    return 0;\n}`,
  tocItems: [
    'Range-based for',
    'Syntax',
    'Examples',
    'When to prefer',
    'Exercises'
  ]
};

export default foreach;
