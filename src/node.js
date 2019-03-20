class Node {
	constructor(data, priority) {
		this.data = data;
		this.priority = priority;
		this.parent = null;
		this.left = null;
		this.right = null;
	}

	appendChild(node) {
		if (this.left === null) {
			this.left = node;
			node.parent = this;
		} else if (this.right === null) {
			this.right = node;
			node.parent = this;
		}
	}

	removeChild(node) {
		if (this.left === node) {
			this.left = null;
			node.parent = null;
			return;
		} else if (this.right === node) {
			this.right = null;
			node.parent = null;
			return;
		}
		throw Error("Nothing to remove")
	}

	remove() {
		if (!this.parent) return;
		this.parent.removeChild(this);
	}

	swapWithParent() {
		//updates parent.parent
		//updates parent.parent.parent
		//updates child.parent
		//updates parent.child.parent
		//updates children of node and parent node

	}
}

module.exports = Node;
