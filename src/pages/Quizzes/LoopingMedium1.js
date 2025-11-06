const LoopingMedium1 = {
  id: 'LoopingMedium1',
  title: 'Looping Medium 1: Multiplication Table',
  problemStatement: 'Write a for loop that prints the multiplication table of 5 (from 1 × 5 to 10 × 5).',
  initialCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    for (int i = 1; i <= 10; i++) {
        cout << n << " x " << i << " = " << n * i << endl;
    }
    return 0;
}`,
  EditedCode: '',
};

export default LoopingMedium1;
