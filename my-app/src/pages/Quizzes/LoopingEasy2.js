const LoopingEasy2 = {
  id: 'LoopingEasy2',
  title: 'Looping Easy 2: Summing Numbers',
  problemStatement: 'Write a for loop that calculates and prints the sum of numbers from 1 to 10.',
  initialCode: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum += i;
    }
    cout << "Sum: " << sum << endl;
    return 0;
}`,
  EditedCode: '',
};

export default LoopingEasy2;
