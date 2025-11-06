const LoopingHard2 = {
  id: 'LoopingHard2',
  title: 'Looping Hard 2: Reverse Digits',
  problemStatement: 'Write a program that reverses a given integer number (e.g., 123 → 321).',
  initialCode: `#include <iostream>
using namespace std;

int main() {
    int n = 123;
    int rev = 0;
    while (n != 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    cout << "Reversed: " << rev << endl;
    return 0;
}`,
  EditedCode: '',
};

export default LoopingHard2;
