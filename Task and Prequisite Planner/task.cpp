#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <fstream>
using namespace std;

class TaskPlanner {
    int V;
    vector<vector<int>> adj;
    vector<int> priority;
    map<int, string> taskName;

public:
    TaskPlanner(int v) {
        V = v;
        adj.resize(V);
        priority.resize(V);
        loadFromFile();
    }

    void addTask(int id) {
        if (id < 0 || id >= V) {
            cout << "Invalid ID!\n";
            return;
        }

        if (taskName.count(id)) {
            cout << "Task ID already exists!\n";
            return;
        }

        string name;
        int pr;

        cin.ignore();
        cout << "Enter task name: ";
        getline(cin, name);

        cout << "Enter priority: ";
        cin >> pr;

        taskName[id] = name;
        priority[id] = pr;

        saveToFile();
        cout << "Task Added!\n";
    }

    void addDependency() {
        int u, v;
        cout << "Enter prerequisite task ID (u): ";
        cin >> u;
        cout << "Enter dependent task ID (v): ";
        cin >> v;

        if (u < 0 || u >= V || v < 0 || v >= V) {
            cout << "Invalid IDs!\n";
            return;
        }

        if (u == v) {
            cout << "Task cannot depend on itself!\n";
            return;
        }

        if (!taskName.count(u) || !taskName.count(v)) {
            cout << "Both tasks must exist first!\n";
            return;
        }

        for (int x : adj[u]) {
            if (x == v) {
                cout << "Dependency already exists!\n";
                return;
            }
        }

        adj[u].push_back(v);
        saveToFile();

        cout << "Dependency Added!\n";
    }

    void showTasks() {
        cout << "\nTasks:\n";
        for (auto &t : taskName) {
            cout << "ID: " << t.first
                 << " | Name: " << t.second
                 << " | Priority: " << priority[t.first] << endl;
        }
    }

    void executeTasks() {
        vector<int> indegree(V, 0);

        for (int i = 0; i < V; i++)
            for (int j : adj[i])
                indegree[j]++;

        priority_queue<pair<int,int>> pq;

        for (int i = 0; i < V; i++) {
            if (indegree[i] == 0 && taskName.count(i))
                pq.push({priority[i], i});
        }

        cout << "\nExecution Order:\n";

        int count = 0;

        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();

            cout << taskName[u] << " (P=" << priority[u] << ") -> ";
            count++;

            for (int v : adj[u]) {
                if (--indegree[v] == 0)
                    pq.push({priority[v], v});
            }
        }

        if (count != taskName.size()) {
            cout << "\nCycle detected or invalid dependencies!\n";
        }
    }

    void saveToFile() {
        ofstream file("tasks.txt");

        for (auto &t : taskName) {
            file << t.first << " "
                 << t.second << " "
                 << priority[t.first] << endl;
        }

        file << "#DEPENDENCIES\n";

        for (int i = 0; i < V; i++) {
            for (int j : adj[i]) {
                file << i << " " << j << endl;
            }
        }

        file.close();
    }

    void loadFromFile() {
        ifstream file("tasks.txt");
        if (!file) return;

        taskName.clear();

        int id, pr;
        string name;

        while (file >> id >> name >> pr) {
            if (name == "#DEPENDENCIES") break;

            taskName[id] = name;
            priority[id] = pr;
        }

        int u, v;
        while (file >> u >> v) {
            adj[u].push_back(v);
        }

        file.close();
    }
};

int main() {
    int n;
    cout << "Enter max tasks: ";
    cin >> n;

    TaskPlanner planner(n);

    int choice, id;

    while (true) {
        cout << "\n===== MENU =====\n";
        cout << "1. Add Task\n";
        cout << "2. Add Dependency\n";
        cout << "3. Show Tasks\n";
        cout << "4. Execute Tasks\n";
        cout << "5. Exit\n";
        cout << "Choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Enter Task ID: ";
                cin >> id;
                planner.addTask(id);
                break;

            case 2:
                planner.addDependency();
                break;

            case 3:
                planner.showTasks();
                break;

            case 4:
                planner.executeTasks();
                break;

            case 5:
                cout << "Exiting...\n";
                return 0;

            default:
                cout << "Invalid choice!\n";
        }
    }
}