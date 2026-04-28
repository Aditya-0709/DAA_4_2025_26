//Bellman Ford Algorithm
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int main() {
    int V, E;
    cin >> V >> E;

    vector<vector<int>> edges;

    for(int i = 0; i < E; i++){
        int u, v, w;
        cin >> u >> v >> w;
        edges.push_back({u, v, w});
    }

    int src;
    cin >> src;

    vector<int> dist(V, INT_MAX);
    dist[src] = 0;

    for(int i = 0; i < V - 1; i++){
        for(int j = 0; j < E; j++){
            int u = edges[j][0];
            int v = edges[j][1];
            int w = edges[j][2];

            if(dist[u] != INT_MAX && dist[u] + w < dist[v]){
                dist[v] = dist[u] + w;
            }
        }
    }
    for(int j = 0; j < E; j++){
        int u = edges[j][0];
        int v = edges[j][1];
        int w = edges[j][2];

        if(dist[u] != INT_MAX && dist[u] + w < dist[v]){
            cout << -1 << endl;
            return 0;
        }
    }
    for(int i = 0; i < V; i++){
        if(dist[i] == INT_MAX)
            cout << 100000000 << " ";
        else
            cout << dist[i] << " ";
    }

    return 0;
}