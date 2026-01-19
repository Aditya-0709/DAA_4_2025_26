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

    void position(int position, int a) {
        node* newNode = new node;
        newNode->data = a;

        if (position == 0) {
            newNode->next = header;
            header = newNode;
            return;
        }

        node* temp = header;
        for (int i = 0; i < position - 1 && temp != NULL; i++) {
            temp = temp->next;
        }

        if (temp == NULL) {
            delete newNode;
            return;
        }

        newNode->next = temp->next;
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
    obj.position(2, 25); 
    obj.traverse(); 

    return 0;
}
