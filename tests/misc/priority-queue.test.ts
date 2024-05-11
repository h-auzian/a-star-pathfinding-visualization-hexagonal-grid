import PriorityQueue from "../../src/misc/priority-queue";

test("Add node to empty queue", function() {
  const queue = new PriorityQueue<string>();
  queue.add("One", 1);
  expect(queue.peek()).toBe("One");
  expect(queue.length()).toBe(1);
});

test.each([
  ["One", 1, "One"],
  ["Two", 2, "Two"],
  ["Three", 3, "Three"],
  ["Four", 4, "Three"],
])("Add node '%s' to queue with existing nodes", function(
  value,
  priority,
  expectedPeek,
) {
  const queue = new PriorityQueue<string>();
  queue.add("Three", 3);
  queue.add("Five", 5);
  queue.add("Seven", 7);

  queue.add(value, priority);
  expect(queue.peek()).toBe(expectedPeek);
  expect(queue.length()).toBe(4);
});

test("Polling elements from queue with existing nodes should return them in priority order", function() {
  const queue = new PriorityQueue<string>();
  queue.add("Five", 5);
  queue.add("Nine", 9);
  queue.add("Seven", 7);
  queue.add("Three", 3);
  queue.add("Four", 4);
  queue.add("Eight", 8);
  queue.add("Two", 2);
  queue.add("Six", 6);
  queue.add("One", 1);

  expect(queue.poll()).toBe("One");
  expect(queue.poll()).toBe("Two");
  expect(queue.poll()).toBe("Three");
  expect(queue.poll()).toBe("Four");
  expect(queue.poll()).toBe("Five");
  expect(queue.poll()).toBe("Six");
  expect(queue.poll()).toBe("Seven");
  expect(queue.poll()).toBe("Eight");
  expect(queue.poll()).toBe("Nine");
  expect(queue.poll()).toBeNull();
});
