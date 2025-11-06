const LoopingHard1 = {
  id: 'LoopingHard1',
  title: 'Looping Hard 1: Pattern Printing',
  problemStatement: 'Write a nested for loop that prints a right triangle of stars (*) with 5 rows.',
  initialCode: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}`,
  EditedCode: '',
};

export default LoopingHard1;
