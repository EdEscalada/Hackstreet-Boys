const LoopingMedium3 = {
  id: 'LoopingMedium3',
  title: 'Looping Medium 3: Factorial Calculator',
  problemStatement: 'Write a program that computes the factorial of a number n = 5 using a while loop.',
  initialCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    int fact = 1;
    while (n > 1) {
        fact *= n;
        n--;
    }
    cout << "Factorial: " << fact << endl;
    return 0;
}`,
  EditedCode: '',
};

export default LoopingMedium3;
