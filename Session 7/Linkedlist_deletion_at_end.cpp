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
    void deleteatend(){
        node*temp;
        temp=header;
        node*prev=NULL;
        while(temp->next!=NULL)
        {
            prev=temp;
            temp=temp->next;

        }
        prev->next=NULL;
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
    obj.deleteatend();
    obj.display();
}   