#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u, v, weight;
};

bool cmp(Edge a, Edge b) {
    return a.weight < b.weight;
}

const int MAX = 100005;
int parent[MAX];
int Rank[MAX];

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);
    return parent[x];
}

void Union(int x, int y) {
    int px = find(x);
    int py = find(y);

    if (px == py) return;

    if (Rank[px] < Rank[py])
        parent[px] = py;
    else if (Rank[px] > Rank[py])
        parent[py] = px;
    else {
        parent[py] = px;
        Rank[px]++;
    }
}

int main() {
    int V = 4; 
    vector<Edge> edges = {
        {0, 1, 10},
        {0, 2, 6},
        {0, 3, 5},
        {1, 3, 15},
        {2, 3, 4}
    };

    sort(edges.begin(), edges.end(), cmp);

    for (int i = 0; i < V; i++) {
        parent[i] = i;
        Rank[i] = 0;
    }

    int mstWeight = 0;
    for (Edge e : edges) {
        if (find(e.u) != find(e.v)) {
            Union(e.u, e.v);
            mstWeight += e.weight;
            cout << e.u << " - " << e.v << " : " << e.weight << endl;
        }
    }

    cout << "Total MST Weight: " << mstWeight << endl;

    return 0;
}