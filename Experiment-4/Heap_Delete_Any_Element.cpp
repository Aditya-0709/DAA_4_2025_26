#include <bits/stdc++.h>
#define MAX 100
using namespace std;

int heap[MAX];
int heapSize = 0;

void heapifyUp(int i) {
    while (i > 0 && heap[(i-1)/2] > heap[i]) {
        swap(heap[i], heap[(i-1)/2]);
        i = (i-1)/2;
    }
}

void heapifyDown(int i) {
    int smallest = i;
    int left = 2*i + 1;
    int right = 2*i + 2;

    if (left < heapSize && heap[left] < heap[smallest])
        smallest = left;

    if (right < heapSize && heap[right] < heap[smallest])
        smallest = right;

    if (smallest != i) {
        swap(heap[i], heap[smallest]);
        heapifyDown(smallest);
    }
}

void insert(int val) {
    if (heapSize == MAX) return;
    heap[heapSize] = val;
    heapSize++;
    heapifyUp(heapSize - 1);
}

void deleteAtIndex(int index) {
    if (index < 0 || index >= heapSize) return;

    heap[index] = heap[heapSize - 1];
    heapSize--;

    if (index > 0 && heap[index] < heap[(index-1)/2])
        heapifyUp(index);
    else
        heapifyDown(index);
}

void printHeap() {
    for (int i = 0; i < heapSize; i++)
        cout << heap[i] << " ";
    cout << endl;
}

int main() {
    insert(10);
    insert(5);
    insert(20);
    insert(2);
    insert(15);

    printHeap();

    deleteAtIndex(1);

    printHeap();

    return 0;
}
