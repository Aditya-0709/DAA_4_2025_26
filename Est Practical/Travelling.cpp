//Travelling Salesman Problem
#include <iostream>
#include <vector>
#include <climits>
using namespace std;
int n;
vector<vector<int>> dist;
vector<vector<int>> dp;
int tsp(int mask, int pos) {
    if (mask == (1 << n) - 1)
        return dist[pos][0];

    if (dp[mask][pos] != -1)
        return dp[mask][pos];

    int ans = INT_MAX;
    for (int city = 0; city < n; city++) {
        if ((mask & (1 << city)) == 0) {
            int newAns = dist[pos][city] +
                         tsp(mask | (1 << city), city);
            ans = min(ans, newAns);
        }
    }
    return dp[mask][pos] = ans;
}

int main() {
    cin >> n;
    dist.resize(n, vector<int>(n));
    dp.resize(1 << n, vector<int>(n, -1));

    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> dist[i][j];
    cout << tsp(1, 0) << endl;
}