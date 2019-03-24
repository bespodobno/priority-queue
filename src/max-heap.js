const Node = require('./node');

class MaxHeap {
	constructor() {
		this.root = null; // max element/node
		this.parentNodes = [];
	}

	push(data, priority) {
		const node = new Node(data, priority);
		this.insertNode(node);
		this.shiftNodeUp(node);
	}

	pop() {
		if (this.isEmpty()) return;

		const detachedRoot = this.detachRoot();
		this.restoreRootFromLastInsertedNode(detachedRoot);
		if (this.root) {
			this.shiftNodeDown(this.root);
		}
		return detachedRoot.data;

	}

	detachRoot() {
		const root = this.root;
		this.root = null;
		// remove root from array
		this.parentNodes = this.parentNodes.filter(node => node !== root);
		if (root.left) {
			root.left.parent = null;
		}
		if (root.right) {
			root.right.parent = null;
		}
		return root;
	}

	restoreRootFromLastInsertedNode(detached) {
		if (this.parentNodes.length === 0) {
			return;
		}

		//take last inserted element - it will be the last element of array
		const lastInserted = this.parentNodes[this.parentNodes.length - 1];

		//remove this last element from the array
		this.parentNodes.pop();

		//assign children of detached node as children of our new root
		lastInserted.left = detached.left;
		lastInserted.right = detached.right;

		//set new parent for new children
		if (lastInserted.left) {
			lastInserted.left.parent = lastInserted;
		}
		if (lastInserted.right) {
			lastInserted.right.parent = lastInserted;
		}

		//change parent if lastInserted has one
		const oldLastInsertedParent = lastInserted.parent;
		if (lastInserted.parent) {
			if (lastInserted.parent.left === lastInserted) {
				lastInserted.parent.left = null;
			} else {
				lastInserted.parent.right = null;
			}
		}

		//set parent=null because lastInserted is a root element now
		lastInserted.parent = null;
		this.root = lastInserted;

		//add new root as the first array element if one of its children is not set
		if (!lastInserted.left || !lastInserted.right) {
			this.parentNodes.unshift(lastInserted);
		}

		if (oldLastInsertedParent && oldLastInsertedParent !== lastInserted) {
			this.parentNodes.unshift(oldLastInsertedParent);
		}
	}

	size() {
		return this.calcSize(this.root);
	}

	/**
	 * Recursively calculates heap size - i.e. number of nodes in heap
	 * @param {Node} node
	 * @returns {number}
	 */
	calcSize(node) {
		let size = 0;
		if (!node) {
			return 0;
		}
		size += this.calcSize(node.left);
		size += this.calcSize(node.right);
		size++;
		return size;
	}

	isEmpty() {
		return this.root === null;
	}

	clear() {
		this.root = null;
		this.parentNodes = [];
	}

	// inserts a given node to heap, and correct parentNodes array
	insertNode(node) {
		if (!this.root) {
			this.root = node;
			this.parentNodes.push(node);
			return;
		}
		this.parentNodes[0].appendChild(node);
		if (this.parentNodes[0].left !== null && this.parentNodes[0].right !== null) {
			this.parentNodes.shift(); //remove 1st element, because it already has both children
		}
		// make a node a parent node, i.e. later we can add children to it
		this.parentNodes.push(node);
	}

	shiftNodeUp(node) {
		const parent = node.parent;
		if (parent && node.priority > parent.priority) {
			node.swapWithParent();

			//if after swapping node becomes without a parent, then update a root
			if (node.parent == null) {
				this.root = node;
			}

			// maintain parentNodes array - i.e. swap parent with node if necessary
			const nodeIndex = this.parentNodes.findIndex(parentNode => parentNode === node);
			const parentIndex = this.parentNodes.findIndex(parentNode => parentNode === parent);

			if (parentIndex !== -1) {
				this.parentNodes[parentIndex] = node;
			}

			if (nodeIndex !== -1) {
				this.parentNodes[nodeIndex] = parent;
			}

			this.shiftNodeUp(node);
		}
	}

	shiftNodeDown(node) {
		const parent = node.parent;
		const left = node.left;
		const right = node.right;

		// if node has no children - it is already on the bottom
		if (!left && !right) {
			return;
		}

		// define direction - go down left or right
		let goDownLeft = true;
		if (left && right) {
			if (left.priority > right.priority) {
				goDownLeft = true;
			} else {
				goDownLeft = false;
			}
		}
		const child = goDownLeft ? left : right;

		// check priority
		if (node.priority < child.priority) {
			child.swapWithParent();

			// set child as a root if necessary
			if (parent === null) {
				this.root = child;
			}

			// maintain parentNodes array - i.e. swap left/right with node if necessary
			const nodeIndex = this.parentNodes.findIndex(parentNode => parentNode === node);
			const childIndex = this.parentNodes.findIndex(parentNode => parentNode === child);

			if (nodeIndex !== -1) {
				this.parentNodes[nodeIndex] = child;
			}

			if (childIndex !== -1) {
				this.parentNodes[childIndex] = node;
			}

			this.shiftNodeDown(node);
		}

	}
}

module.exports = MaxHeap;
