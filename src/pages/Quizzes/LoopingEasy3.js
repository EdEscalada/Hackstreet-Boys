const LoopingEasy3 = {
  id: 'LoopingEasy3',
  title: 'Looping Easy 3: Counting Down',
  problemStatement: 'Write a program that prints numbers from 10 down to 1 using a while loop.',
  initialCode: `#include <iostream>
using namespace std;

int main() {
    int n = 10;
    while (n >= 1) {
        cout << n << " ";
        n--;
    }
    return 0;
}`,
  EditedCode: '',
};

export default LoopingEasy3;
