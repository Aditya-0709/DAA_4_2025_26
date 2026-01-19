#include<iostream>
using namespace std;
struct node{
    int data;
    node*next;
};
class linkedlist{
    public:
    node*node1,*header;
    linkedlist()
    {
        header=NULL;
    }   
    void insert(int a){
        node1=new node;
        node1->data=a;
        node1->next=header;
        header=node1;
    }
    void deleteatspec(int pos){
        int c;
        node*temp;
        temp=header;
        node*prev;
        c=1;
        while(c!=pos)
        {
            prev=temp;
            temp=temp->next;
            c++;

        }
        prev->next=temp->next;
        delete(temp);
    }
    void display()
    {
        node *temp = header;
        while (temp != NULL) {
            cout << temp->data << "  ";
            temp = temp->next;
        }
    }
};
int main(){
    linkedlist obj;
    obj.insert(10);
    obj.insert(20);
    obj.insert(30);
    obj.insert(40);
    obj.insert(50);
    obj.deleteatspec(2);
    obj.display();
}   