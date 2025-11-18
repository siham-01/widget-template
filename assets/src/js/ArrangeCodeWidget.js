import { Widget } from "./Widget.js";

export class ArrangeCodeWidget extends Widget {
  constructor(container, page) {
    super(container, page);

    this.SELECTORS = Object.freeze({
      BLOCK_CONTAINER: '.block-container',
      CODE_CONTAINER: '.code-container'
    });

    this.codeContainer = this.container.querySelector(this.SELECTORS.CODE_CONTAINER);
    this.blockContainers = this.getBlockContainers();
    this.draggedContainer;
    this.draggedContainerIndex;

    this.init();
  }

  init() {
    this.blockContainers.forEach((blockContainer) => {
      blockContainer.addEventListener('dragstart', this.onDragStart);
      blockContainer.addEventListener('dragover', this.onDragOver);
      blockContainer.addEventListener('dragenter', this.onDragEnter);
      blockContainer.addEventListener('dragleave', this.onDragLeave);
      blockContainer.addEventListener('drop', this.onDrop);
      blockContainer.addEventListener('dragend', this.onDragEnd);
    });
  }

  onDragStart = (event) => {
    this.draggedContainer = this.getClosestBlockContainer(event.target);
    this.draggedContainer.classList.add('dragged');
    this.draggedContainerIndex = this.getBlockContainers().indexOf(this.draggedContainer);
  }

  onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  onDragEnter = (event) => {
    const dragEnterContainer = this.getClosestBlockContainer(event.target);
    const targetIndex = this.getBlockContainers().indexOf(dragEnterContainer);
    if (this.draggedContainerIndex > targetIndex) {
      dragEnterContainer.classList.add('dragover-up');
    } else if (this.draggedContainerIndex < targetIndex) {
      dragEnterContainer.classList.add('dragover-down');
    }
  }

  onDragLeave = (event) => {
    const dragLeaveContainer = this.getClosestBlockContainer(event.target);
    dragLeaveContainer.classList.remove('dragover-up');
    dragLeaveContainer.classList.remove('dragover-down');
  }

  onDrop = (event) => {
    event.preventDefault();

    const dropContainer = this.getClosestBlockContainer(event.target);
    const targetIndex = this.getBlockContainers().indexOf(dropContainer);
    if (!this.draggedContainer || this.draggedContainer === dropContainer) return;

    dropContainer.classList.remove('dragover-up');
    dropContainer.classList.remove('dragover-down');

    this.codeContainer.removeChild(this.draggedContainer);
    if (targetIndex >= this.codeContainer.children.length) {
      this.codeContainer.appendChild(this.draggedContainer);
    } else {
      this.codeContainer.insertBefore(
        this.draggedContainer,
        this.codeContainer.children[targetIndex]
      );
    }
    this.page.playActionSound();

    if (this.checkOrder(this.getBlockContainers())) {
      this.codeContainer.classList.add('correct');
      this.page.playCorrectSound();
      this.page.celebrate();
    } else {
      this.codeContainer.classList.remove('correct');
    }
  }

  onDragEnd = () => {
    this.draggedContainer.classList.remove('dragged');
    this.draggedContainerIndex = null;
  }

  getBlockContainers() {
    return Array.from(this.container.querySelectorAll(this.SELECTORS.BLOCK_CONTAINER));
  }

  getClosestBlockContainer(target) {
    return target.closest(this.SELECTORS.BLOCK_CONTAINER);
  }

  checkOrder(blockContainers) {
    for (let i = 0; i < blockContainers.length - 1; i++) {
      const firstIndex = blockContainers[i].getAttribute('data-index');
      const secondIndex = blockContainers[i + 1].getAttribute('data-index');
      if (!firstIndex || !secondIndex || firstIndex > secondIndex) {
        return false;
      }
    }
    return true;
  }
}