class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        this.drawRectangle({x: 100, y: 100}, {x: 600, y: 300}, [107, 252, 3, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        this.drawCirle({x: 400, y: 400}, 100, [252, 3, 161, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        this.drawBezierCurve({x: 100, y: 100}, {x: 200, y: 300}, {x: 400, y: 200}, {x: 500, y: 150}, [3, 198, 252, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        this.drawName([252, 3, 161, 255], framebuffer);

    }

    drawName(color, framebuffer){
        //J
        this.drawLine({x: 100, y: 400}, {x: 300, y: 400}, color, framebuffer);
        this.drawBezierCurve({x: 100, y: 100}, {x: 225, y: 50}, {x: 300, y: 100}, {x: 200, y: 400}, color, framebuffer);

        //a
        this.drawCirle({x: 350, y: 150}, 50, color, framebuffer);
        this.drawLine({x: 400, y: 100}, {x: 400, y: 200}, color, framebuffer);

        //c
        this.drawBezierCurve({x: 525, y: 200}, {x: 400, y: 200}, {x: 400, y: 100}, {x: 525, y: 100}, color, framebuffer);

        //k
        this.drawLine({x: 600, y: 400}, {x: 600, y: 100}, color, framebuffer);
        this.drawLine({x: 600, y: 150}, {x: 725, y: 250}, color, framebuffer);
        this.drawLine({x: 600, y: 150}, {x: 725, y: 100}, color, framebuffer);

    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
        var right_bottom = {x: right_top.x, y: left_bottom.y};
        var left_top = {x: left_bottom.x, y: right_top.y};
        
        //bottom
        this.drawLine(left_bottom, right_bottom, color, framebuffer);
        //right
        this.drawLine(right_bottom, right_top, color, framebuffer);
        //left
        this.drawLine(left_bottom, left_top, color, framebuffer);
        //top edge
        this.drawLine(left_top, right_top, color, framebuffer);
        if (this.show_points) {
            //this.drawCirle(left_bottom, 5, [13, 13, 12, 250], framebuffer);
            //this.drawCirle(right_bottom, 5, [13, 13, 12, 250], framebuffer);
        }
        
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCirle(center, radius, color, framebuffer) {
        var x0, y0, x1, y1;
        var interval = (2 * Math.PI) / this.num_curve_sections;
        for (var i = 0; i < 2*Math.PI; i += interval){
            x0 = Math.round(center.x + (radius * Math.cos(i - interval)));
            y0 = Math.round(center.y + (radius * Math.sin(i - interval)));
            x1 = Math.round(center.x + (radius * Math.cos(i)));
            y1 = Math.round(center.y + (radius * Math.sin(i)));
            this.drawLine({x: x0, y: y0}, {x: x1, y: y1}, color, framebuffer);
            if (this.show_points){
                this.drawCirle({x: x0, y: y0}, 5, [13, 13, 12, 250], framebuffer);
                //drawCirle({x: x1, y: y1}, 5, [13, 13, 12, 250], framebuffer);
            }
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        var coordinate0, coordinate1, x0, y0, x1, y1;
        var interval = 1 / this.num_curve_sections;
        var t1;
        console.log("interval" + interval);
        console.log("num sections" + this.num_curve_sections);
        for (var t = 0; t < 1; t += interval) {
            t1 = t + interval;
            x0 = Math.round((Math.pow((1-t), 3) * pt0.x) + (3*Math.pow((1-t), 2) * t * pt1.x) + (3 * (1-t) * Math.pow(t, 2) * pt2.x) + (Math.pow(t, 3) * pt3.x));
            y0 = Math.round((Math.pow((1-t), 3) * pt0.y) + (3*Math.pow((1-t), 2) * t * pt1.y) + (3 * (1-t) * Math.pow(t, 2) * pt2.y) + (Math.pow(t, 3) * pt3.y));

            x1 = Math.round((Math.pow((1-t1), 3) * pt0.x) + (3*Math.pow((1-t1), 2) * (t1) * pt1.x) + (3 * (1-t1) * Math.pow(t1, 2) * pt2.x) + (Math.pow(t1, 3) * pt3.x));
            y1 = Math.round((Math.pow((1-t1), 3) * pt0.y) + (3*Math.pow((1-t1), 2) * (t1) * pt1.y) + (3 * (1-t1) * Math.pow(t1, 2) * pt2.y) + (Math.pow(t1, 3) * pt3.y));
            
            console.log(x0, y0, x1, y1);
            this.drawLine({x: x0, y: y0}, {x: x1, y: y1}, color, framebuffer);
            if (this.show_points){
                this.drawCirle({x: x0, y: y0}, 5, [37, 204, 81, 250], framebuffer);
                //drawCirle({x: x1, y: y1}, 5, [37, 204, 81, 250], framebuffer);
            }

        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    pixelIndex(x, y, framebuffer)
    {
        return 4 * y * framebuffer.width + 4 * x;
    }

    setFramebufferColor(framebuffer, px, color)
    {
        framebuffer.data[px + 0] = color[0];
        framebuffer.data[px + 1] = color[1];
        framebuffer.data[px + 2] = color[2];
        framebuffer.data[px + 3] = color[3];
    }
    
    drawLine(pt0, pt1, color, framebuffer)
    {
        var x0 = pt0.x;
        var y0 = pt0.y;
        var x1 = pt1.x;
        var y1 = pt1.y;
            
        if (Math.abs(y1-y0) <= Math.abs(x1-x0)){ // aka: abs value of slope (m)  <= 1
            if(x0 < x1){
                this.drawLineLow({x: x0, y: y0}, {x: x1, y: y1}, color, framebuffer);
            }
            else{
                this.drawLineLow({x: x1, y: y1}, {x: x0, y: y0}, color, framebuffer);
        }
    }
        else{
            if(y0 < y1){
                this.drawLineHigh({x: x0, y: y0},{x: x1, y: y1}, color, framebuffer);
            }
            else{
                this.drawLineHigh({x: x1, y: y1}, {x: x0, y: y0}, color, framebuffer);
            }
        }
    }

    drawLineLow(pt0, pt1, color, framebuffer)
    {       
        var x0 = pt0.x;
        var y0 = pt0.y;
        var x1 = pt1.x;
        var y1 = pt1.y;
    
        var A = y1 - y0;
        var B = x0 - x1;
        var iy = 1;
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        var D = 2 * A + B;
        var x = x0;
        var y = y0;
        var px;
        while (x <= x1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            x += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                y += iy;
            }
        }
    }

    drawLineHigh(pt0, pt1, color, framebuffer)
    {
        
        var x0 = pt0.x;
        var y0 = pt0.y;
        var x1 = pt1.x;
        var y1 = pt1.y;
        
        var A = x1 - x0;
        var B = y0 - y1;
        var ix = 1;
        if (A < 0) {
            ix = -1;
            A *= -1;
        }
        var D = 2 * A + B;
        var x = x0;
        var y = y0;
        
        var px;
        while (y <= y1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            y += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                x += ix;
            }
        }
    }
    
};

