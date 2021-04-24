class LinkedList {
    head: LinkedListNode;
    tail: LinkedListNode;
    length: number;

    constructor(headValue: any) {
        const node = new LinkedListNode(headValue);
        this.head = node;
        this.tail = node;
        this.length = 1;
    }
}

class LinkedListNode {
    value: any;
    next: LinkedListNode;
    prec: LinkedListNode;

    constructor(value: any) {
        this.value = value;
        this.next = null;
        this.prec = null;
    }
}

export class Snake extends LinkedList {
    constructor(headValue) {
        super(headValue);
    }

    public move(toPos: any): LinkedListNode {
        const node = new LinkedListNode(toPos);
        const currTail = this.tail;

        if (this.length == 1) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head.prec = node;
            this.head = node;
            this.tail = this.tail.prec;
        }

        return currTail;
    }

    public grow(toAdd: any) {
        const node = new LinkedListNode(toAdd);
        node.prec = this.tail;
        this.tail.next = node;
        this.tail = node;

        this.length += 1;
    }

    public reverse() {
        if (this.length <= 1) return;

        let curs = this.head;
        while (curs != null) {
            const temp = curs.prec;
            curs.prec = curs.next;
            curs.next = temp;
            curs = curs.prec;
        }

        const temp = this.head;
        this.head = this.tail;
        this.tail = temp;
    }

    public getTailOrientation(): any {
        if (this.length <= 1) return {rowDiff: 0, colDiff: 0};
            
        return {
            rowDiff: this.tail.value.row - this.tail.prec.value.row,
            colDiff: this.tail.value.col - this.tail.prec.value.col
        };
    }
}