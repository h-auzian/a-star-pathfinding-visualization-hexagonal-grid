type QueueNode<Type> = {
  value: Type;
  priority: number;
};

/**
 * Basic implementation of a priority queue, which is basically a min-heap.
 *
 * Nodes with the lowest priority number will be at the top of the heap. The
 * lowest value means top priority.
 *
 * JavaScript arrays are not actually stored in continuous memory like in other
 * languages (like C), so this solution is far from optimal and was only
 * implemented for learning purposes.
 */
class PriorityQueue<Type> {
  private heap: QueueNode<Type>[];

  constructor() {
    this.heap = [];
  }

  /**
   * Add a new node to the queue, reordering the nodes if necessary.
   */
  public add(value: Type, priority: number): void {
    this.heap.push({ value, priority });
    this.bubbleUp();
  }

  /**
   * Returns the first node value in the heap, if it exists.
   */
  public peek(): Type | null {
    if (this.length() == 0) {
      return null;
    }

    return this.heap[0].value;
  }

  /**
   * Deletes and returns the first node value in the heap, reordering the nodes
   * if necessary.
   */
  public poll(): Type | null {
    if (this.length() == 0) {
      return null;
    }

    const firstNode = this.heap[0];

    this.swap();
    this.heap.pop();
    this.bubbleDown();

    return firstNode.value;
  }

  /**
   * Returns the amount of nodes in the heap.
   */
  public length(): number {
    return this.heap.length;
  }

  /**
   * Fully clears the heap.
   */
  public clear(): void {
    this.heap = [];
  }

  /**
   * Recursively swaps the node at a given index with its parent until the heap
   * invariant is satisfied.
   *
   * If no index is specified, then the last node is assumed.
   */
  private bubbleUp(index?: number): void {
    if (index === undefined) {
      index = this.length() - 1;
    }

    if (index <= 0) {
      return;
    }

    const currentNode = this.heap[index];

    const parentIndex = Math.floor((index - 1) / 2);
    const parentNode = this.heap[parentIndex];

    if (currentNode.priority < parentNode.priority) {
      this.swap(index, parentIndex);
      this.bubbleUp(parentIndex);
    }
  }

  /**
   * Recursively swaps the node at the given index with its lowest priority
   * child until the heap invariant is satisfied.
   *
   * If no index is specified, then the root node is assumed.
   */
  private bubbleDown(index?: number): void {
    if (index === undefined) {
      index = 0;
    }

    if (index >= this.length()) {
      return;
    }

    const leftChildIndex = index * 2 + 1;
    if (leftChildIndex >= this.length()) {
      return;
    }

    let lowestPriorityChildIndex = leftChildIndex;
    let lowestPriorityChildNode = this.heap[leftChildIndex];

    const rightChildIndex = leftChildIndex + 1;
    if (rightChildIndex < this.length()) {
      const rightChildNode = this.heap[rightChildIndex];
      if (rightChildNode.priority < lowestPriorityChildNode.priority) {
        lowestPriorityChildIndex = rightChildIndex;
        lowestPriorityChildNode = rightChildNode;
      }
    }

    const currentNode = this.heap[index];
    if (currentNode.priority > lowestPriorityChildNode.priority) {
      this.swap(index, lowestPriorityChildIndex);
      this.bubbleDown(lowestPriorityChildIndex);
    }
  }

  /**
   * Swaps two nodes in the heap.
   *
   * If the first index is not specified, it assumes the root node; if the
   * second index is not specified, then it assumes the last node.
   */
  private swap(firstIndex?: number, secondIndex?: number): void {
    if (this.length() < 2) {
      return;
    }

    if (firstIndex === undefined) {
      firstIndex = 0;
    }

    if (secondIndex === undefined) {
      secondIndex = this.length() - 1;
    }

    const firstNode = this.heap[firstIndex];
    const secondNode = this.heap[secondIndex];

    this.heap[firstIndex] = secondNode;
    this.heap[secondIndex] = firstNode;
  }
}

export default PriorityQueue;
