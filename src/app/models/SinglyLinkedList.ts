export class SinglyLinkedList {
    head: LinkedListNode;
    tail: LinkedListNode;

    constructor(headValue: any) {
        const node = new LinkedListNode(headValue);
        this.head = node;
        this.tail = node;
    }
}

export class LinkedListNode {
    value: any;
    next: LinkedListNode;

    constructor(value: any) {
        this.value = value;
        this.next = null;
    }
}