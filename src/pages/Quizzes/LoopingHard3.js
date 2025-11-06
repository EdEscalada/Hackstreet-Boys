const LoopingHard3 = {
  id: 'LoopingHard3',
  title: 'Looping Hard 3: Prime Number Detector',
  problemStatement: 'Write a program that checks whether a number n = 17 is prime using loops.',
  initialCode: `#include <iostream>
using namespace std;

int main() {
    int n = 17;
    bool isPrime = true;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            isPrime = false;
            break;
        }
    }
    cout << (isPrime ? "Prime" : "Not Prime") << endl;
    return 0;
}`,
  EditedCode: '',
};

export default LoopingHard3;
