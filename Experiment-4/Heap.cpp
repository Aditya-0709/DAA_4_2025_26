#include <bits/stdc++.h>
#define MAX 100

using namespace std;

int heap[MAX];
int heapSize = 0;

void heapifyDown(int i) {
    int smallest = i;
    int left = 2*i + 1;
    int right = 2*i + 2;

    if (left < heapSize && heap[left] < heap[smallest])
        smallest = left;

    if (right < heapSize && heap[right] < heap[smallest])
        smallest = right;

    if (smallest != i) {
        swap(heap[smallest], heap[i]);
        heapifyDown(smallest);
    }
}

void heapifyUp(int i) {
    while (i > 0 && heap[(i-1)/2] > heap[i]) {
        swap(heap[i], heap[(i-1)/2]);
        i = (i-1)/2;
    }
}

void insert(int val) {
    if (heapSize == MAX) {
        cout << "heap full";
        return;
    }

    heap[heapSize] = val;
    heapSize++;

    heapifyUp(heapSize - 1);
}

void deleteMin() {
    if (heapSize == 0) {
        cout << "no element";
        return;
    }

    heap[0] = heap[heapSize - 1];
    heapSize--;

    heapifyDown(0);
}

int main() {
    insert(2);
    insert(4);
    insert(6);
    insert(1);
    deleteMin();

    for (int i = 0; i < heapSize; i++) {
        cout << heap[i] << " ";
    }
}
