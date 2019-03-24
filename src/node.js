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
		if (this.parent) {
			const parent = this.parent;
			const parentOfParent = parent.parent;

			const left = this.left;
			const right = this.right;

			if (parent.left === this) {
				//current node is a left child
				this.left = parent;
				this.right = parent.right;
				if (parent.right) {
					parent.right.parent = this;
				}
			} else if (parent.right === this) {
				//current node is a right child
				this.right = parent;
				this.left = parent.left;
				if (parent.left) {
					parent.left.parent = this;
				}
			}

			// set parent for this node
			this.parent = parentOfParent;

			// adjust parent: now node is its parent, and node children are its new children
			parent.parent = this;
			parent.right = right;
			parent.left = left;

			// left and right have a new parent
			if (left) {
				left.parent = parent;
			}
			if (right) {
				right.parent = parent;
			}

			// adjust grandpa links
			if (parentOfParent) {
				if (parentOfParent.left === parent) {
					parentOfParent.left = this;
				} else if (parentOfParent.right == parent) {
					parentOfParent.right = this;
				}
			}
		}
	}
}

module.exports = Node;
