export class screenControl {
    constructor() {
        this.canvas = document.getElementById('game_sreen');
        this.ctx =  this.canvas.getContext('2d');
        this.images = [];
        this.loadImages();
        this.setScreen();
    }

    loadImages () {
        const imageURL = ['p_s_01.jpg', 'p_s_02.jpg', 'p_w_01.jpg', 'p_w_02.jpg', 'p_e_01.jpg', 'p_e_02.jpg'];
        let images = [];
        imageURL.forEach(imageName => {
            const image = new Image();
            image.src = `/assets/images/${imageName}`;
            images.push(image);
        })
        this.images  = images;
    }

    // 設定畫面
    setImage (imageA, imageB = null) {
        this.clearCanvas();
        let ratioHeight = this.images[0].height * ((this.canvas.height / 2) / this.images[0].height);
        let ratioWidth = this.images[0].width * ((this.canvas.width / 2) / this.images[0].width);
        
        setTimeout(() => {
            if (imageA) {
                this.ctx.drawImage(imageA, 10, 30, ratioHeight, ratioWidth);
            }
            if (imageB) {
                this.ctx.drawImage(imageB, 150, 30, ratioHeight, ratioWidth);
            }
         }, 100);
    }

    // 清除畫面
    clearCanvas () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 設定文字
    setText (text, align = 'center', size = '24') {
        this.clearCanvas()

        let x = this.canvas.width / 2;
        let y = this.canvas.height / 2

        this.ctx.font = `${size}px STheiti, SimHei`;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    // 調整畫面
    setScreen () {
        let dpr = window.devicePixelRatio; 
        let { width: cssWidth, height: cssHeight } = this.canvas.getBoundingClientRect();
        this.canvas.style.width = this.canvas.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';

        this.canvas.width = dpr * cssWidth;
        this.canvas.height = dpr * cssHeight;
        this.ctx.scale(dpr, dpr);
    }

    step (step, data = null) {
        switch (step) {
            case 'init': {
                this.setText('剪刀 X 石頭 X 布');
                break;
            }
            case 'match': {
                console.log(1123);
                this.setImage(this.images[2]);
                this.setText('等待中', 'start');
                break;
            }
            case 'ready': {
                this.setImage(this.images[2], this.images[3]);
                break;
            }
            case 'start': {
                this.setImage(this.images[0], this.images[1]);
                break;
            }
            case 'end': {
                if (data.result == 'W') {
                    this.setImage(this.images[4]);
                    this.setText(data.text, 'start', '12');
                } else if (data.result == 'T') {
                    this.setText(data.text);
                } else {
                    this.setImage(null, this.images[5]);
                    this.setText(data.text, 'end', '12');
                }
                
                break;
            }
            default: {
                break;
            }
        }
    } 
}