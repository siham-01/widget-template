const CONFIG = { course: "ai-story-studio-6-8", project: "ai-story-studio-6-8" };

/**
 * Represents a widget page that manages audio, UI, and 1 or more widget.
 * @class
 */
export class WidgetPage {
  /**
   * Create an instance of WidgetPage.
   * @param {string} title - The title of the widget page
   * @param {HTMLElement} container - The container element for the widget page, usually the body element
   */
  constructor(title, container) {

    // Add title and container as attributes
    this.title = title;
    this.container = container;

    // Create a canvas for confetti if none exists
    let canvas = container.querySelector("canvas");
    if (!canvas) {
      canvas = this.createCanvas();
      container.appendChild(canvas);
    }
    this.canvas = canvas;
    this.confettiParticles = [];

    // Define correct, action sounds
    this.correctSound = new Audio(this.getAssetPath("correct.mp3", "shared"));
    this.actionSound = new Audio(this.getAssetPath("action.mp3", "shared"));
    this.incorrectSound = new Audio(this.getAssetPath("incorrect.wav", "shared"));

    // Find all continue buttons
    this.continueButtons = this.container.querySelectorAll('.button-continue');

    // Create a list to store widgets
    this.widgets = [];

    // Initialize the page
    this.init();
  }

  /**
   * Initialize event listeners
   */
  init() {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.continueButtons.forEach((continueButton) => {
      continueButton.addEventListener('click', this.revealNextSection);
    });
  }

  /**
   * Generate asset paths based on the current environment.
   * @param {string} filename - The name of the asset file
   * @param {string} prefix - The prefix path for the asset
   * @returns {string} The complete asset path
   */
  getAssetPath(filename, prefix) {
    const developmentRoot = '../..';
    const productionRoot = `/assets/courses/${CONFIG.course}/${CONFIG.project}/assets/widgets/`;

    const environment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'DEVELOPMENT' : 'PRODUCTION';
    const root = (environment === 'DEVELOPMENT') ? developmentRoot : productionRoot;

    const cleanRoot = root.replace(/\/+$/, '');
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
    const cleanFilename = filename.replace(/^\/+|\/+$/g, '');

    return `${cleanRoot}/${cleanPrefix}/${cleanFilename}`;
  }

  /**
   * Register widget elements on the page.
   * @param {string} selector - CSS selector for widget containers
   * @param {class} widgetType - The class constructor for the widget element
   * @returns {Array} Array of initialized widget elements
   */
  registerWidget(selector, widgetType) {
    const widgetContainers = this.container.querySelectorAll(selector);
    widgetContainers.forEach(container => {
      try {
        const widget = new widgetType(container, this);
        this.widgets.push(widget);
      } catch (error) {
        console.error(`Failed to initialize ${selector} widget: ${error}`);
      }
    });
    return this.widgets;
  }

  /**
   * Reveal the next section when a continue button is clicked.
   * @param {Event} event - The click event
   */
  revealNextSection(event) {
    const button = event.target.closest('button');
    const nextSection = button.closest('section').nextElementSibling;
    if (!nextSection) {
      return;
    }

    nextSection.style.display = 'flex';
    button.remove();

    // Smooth scroll to the next section if animations are enabled
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Celebrate the completion of a widget.
   */
  celebrate() {
    this.triggerConfetti();
  }

  /**
   * Trigger a confetti animation effect.
   * Creates and initializes confetti particles with random properties.
   */
  triggerConfetti() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    for (let i = 0; i < 300; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        size: Math.random() * 5 + 2,
        speed: Math.random() * 3 + 1,
      });
    }

    this.drawConfetti();
  }

  /**
   * Draw and animate the confetti particles on the canvas.
   */
  drawConfetti = () => {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.confettiParticles.forEach((particle, i) => {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      particle.y += particle.speed;
      if (particle.y > this.canvas.height)
        this.confettiParticles.splice(i, 1);
    });

    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(this.drawConfetti);
    }
  }

  /**
   * Create a canvas element for confetti animation.
   * The canvas is positioned fixed and covers the entire viewport.
   * @returns {HTMLCanvasElement} The configured canvas element
   */
  createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99";
    return canvas;
  }

  /**
   * Play the correct sound effect.
   */
  playCorrectSound() {
    this.correctSound.play();
  }

  /**
   * Play the action sound effect
   */
  playActionSound() {
    this.actionSound.play();
  }

  /**
 * Play the incorrect sound effect
 */
  playIncorrectSound() {
    this.incorrectSound.play();
  }

  /**
   * Handle window resize events by notifying all widget elements.
   */
  handleResize() {
    this.widgets.forEach(widget => {
      widget.onResize();
    });
  }
}
