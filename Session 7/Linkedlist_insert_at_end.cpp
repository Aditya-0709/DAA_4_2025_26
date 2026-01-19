#include<iostream>
using namespace std;

struct node {
    int data;
    node* next;
};

class linkedlist {
public:
    node* header;

    linkedlist() {
        header = NULL;
    }

    void insert(int a) {
        node* newNode = new node;
        newNode->data = a;
        newNode->next = header;
        header = newNode;
    }

    void end(int a) {
        node* newNode = new node;
        newNode->data = a;
        newNode->next = NULL;

        if (header == NULL) { 
            header = newNode;
            return;
        }

        node* temp = header;
        while (temp->next != NULL) {
            temp = temp->next;
        }
        temp->next = newNode; 
    }

    void traverse() {
        node* temp = header;
        while (temp != NULL) {
            cout << temp->data << "  ";
            temp = temp->next;
        }
        cout << endl;
    }
};

int main() {
    linkedlist obj;

    obj.insert(10);
    obj.insert(20);
    obj.insert(30);
    obj.insert(40);
    obj.insert(50);    
    obj.traverse();
    obj.end(80);    
    obj.traverse();
    return 0;
}
