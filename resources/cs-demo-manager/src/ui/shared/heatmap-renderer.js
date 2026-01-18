export class HeatmapRenderer {
    ctx;
    points = [];
    width = 0;
    height = 0;
    radius = 0;
    max = 1;
    defaultRadius = 25;
    alpha = 1;
    minOpacity = 0.05;
    circle;
    gradient = new Uint8ClampedArray();
    defaultGradient = {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1: 'red',
    };
    constructor(canvas) {
        this.ctx = canvas.getContext('2d', {
            willReadFrequently: true,
        });
        this.width = canvas.width;
        this.height = canvas.height;
        this.circle = this.createCanvas();
        this.setGradient(this.defaultGradient);
        this.setRadius(this.defaultRadius);
    }
    setPoints(points) {
        this.points = points;
        return this;
    }
    setAlpha(alpha) {
        this.alpha = alpha;
        return this;
    }
    setRadius(r, blur = 15) {
        // create a grayscale blurred circle image that we'll use for drawing points
        const ctx = this.circle.getContext('2d');
        this.radius = r + blur;
        this.circle.width = this.radius * 2;
        this.circle.height = this.radius * 2;
        ctx.shadowOffsetX = ctx.shadowOffsetY = this.radius * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.arc(-this.radius, -this.radius, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return this;
    }
    setGradient(grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (const i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);
        this.gradient = ctx.getImageData(0, 0, 1, 256).data;
        return this;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // draw a grayscale heatmap by putting a blurred circle at each data point
        for (const point of this.points) {
            this.ctx.globalAlpha = Math.max(point[2] / this.max, this.minOpacity);
            this.ctx.drawImage(this.circle, point[0] - this.radius, point[1] - this.radius);
        }
        if (this.width > 0 && this.height > 0) {
            // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
            const colored = this.ctx.getImageData(0, 0, this.width, this.height);
            this.colorize(colored.data, this.gradient);
            this.ctx.putImageData(colored, 0, 0);
        }
        return this;
    }
    colorize(pixels, gradient) {
        for (let i = 0; i < pixels.length; i += 4) {
            const j = pixels[i + 3] * 4; // get gradient color from opacity value
            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
                pixels[i + 3] = pixels[i + 3] * this.alpha;
            }
        }
    }
    createCanvas() {
        return document.createElement('canvas');
    }
}
//# sourceMappingURL=heatmap-renderer.js.map