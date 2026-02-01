#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    cin >> N;

    vector<char> arr(N);
    for(int i = 0; i < N; i++) {
        cin >> arr[i];
    }

    unordered_map<int,int> mp;
    mp[0] = -1;  

    int sum = 0;
    int maxLen = 0;

    for(int i = 0; i < N; i++) {
        if(arr[i] == 'P')
            sum += 1;
        else
            sum -= 1;

        if(mp.find(sum) != mp.end()) {
            maxLen = max(maxLen, i - mp[sum]);
        } else {
            mp[sum] = i;
        }
    }

    cout << maxLen;
    return 0;
}
