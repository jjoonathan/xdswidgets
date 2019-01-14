import {DOMWidgetView,DOMWidgetModel} from '@jupyter-widgets/base';
import _ from 'lodash';

console.log('xdswidgets/js/lib/SelectableImageView.js')

let point_in_rect = function([x,y],[rx0,ry0,rx1,ry1]) {
    let x_in_range = (rx0<x && x<rx1) || (rx1<x && x<rx0);
    let y_in_range = (ry0<y && y<ry1) || (ry1<y && y<ry0);
    return x_in_range && y_in_range;
};

export class SelectableImageModel extends DOMWidgetModel {
    defaults() {
        return _.extend(super.defaults(), {
            _model_name : 'SelectableImageModel',
            _view_name : 'SelectableImageView',
            _model_module : 'xdswidgets',
            _view_module : 'xdswidgets',
            _model_module_version : '0.1.0',
            _view_module_version : '0.1.0',

            img_fmt         : 'jpg',  // let mimetype = `image/${this.model.get('img_fmt')}`
            img_bytes       : null,   // let bin_blob = new Blob([this.model.get('img_bytes')], {type:mimetype})
            last_click_xy   : [],     // Last click
            last_click_xy_1 : [],     // Click before last click
            selected_rects  : []      // Red squares. Elements like [x0,y0,x1,y1]
        })
    }
}

export class SelectableImageView extends DOMWidgetView {
    draw_vert_line(c, ctx, x, style_str) {
        ctx.beginPath();
        ctx.moveTo(x+.5,0);
        ctx.lineTo(x+.5,c.height);
        ctx.strokeStyle = style_str;
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    draw_horiz_line(c, ctx, y, style_str) {
        ctx.beginPath();
        ctx.moveTo(0,y+.5);
        ctx.lineTo(c.width,y+.5);
        ctx.strokeStyle = style_str;
        ctx.lineWidth = 1;
        ctx.stroke();
    };
    
    draw_cross(c, ctx, xy, style_str) {
        this.draw_vert_line(c, ctx, xy[0], style_str);
        this.draw_horiz_line(c, ctx, xy[1], style_str);
    };
    
    draw_canvas() {
        let c = this.canvas_child;
        let ctx = c.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0,0,c.width,c.height);

        // Draw crosshairs
        let last_click_xy = this.model.get('last_click_xy');
        let last_click_xy_1 = this.model.get('last_click_xy_1');
        if (this.last_move_xy) {this.draw_cross(c,ctx,this.last_move_xy,"rgba(0,0,0,128)");}
        if (last_click_xy) {this.draw_cross(c,ctx,last_click_xy,"#f97306");}
        if (last_click_xy_1) {this.draw_cross(c,ctx,last_click_xy_1,"#0343df");}

        // Draw saved rectangles
        let rects = this.model.get('selected_rects');
        for (const r of rects) {
            //ctx.fillStyle = "rgba(255,0,0,0.99)";
            //ctx.fillRect(r[0],r[1],r[2],r[3]);
            ctx.strokeStyle = "rgba(255,0,0,0.99)";
            ctx.lineWidth = 2;
            ctx.strokeRect(r[0], r[1], r[2]-r[0], r[3]-r[1]);
        }

        // Draw drag-in-progres rectangle
        if (this.current_drag_rect) {
            let r = this.current_drag_rect;
            ctx.strokeStyle = "rgba(255,0,0,1.00)";
            ctx.lineWidth = 2;
            ctx.strokeRect(r[0], r[1],r[2]-r[0],r[3]-r[1]);
        }
    };
    
    render() { // Called once to init a new widget instance
        this.widget_container = document.createElement('div');
        this.widget_container.style.display = 'inline-block';
        this.widget_container.style.position = 'relative';
        this.img_child = document.createElement('img')
        this.widget_container.appendChild(this.img_child);

        this.canvas_child = document.createElement('canvas');
        this.canvas_child.style.position = "absolute";
        this.canvas_child.style.top = 0;
        this.canvas_child.style.left = 0;
        this.widget_container.appendChild(this.canvas_child);

        this.el.appendChild(this.widget_container);
        this.img_changed();
        let widget = this;
        this.el.addEventListener('mousedown', function(event){
            event.preventDefault();
            let x=event.offsetX, y=event.offsetY;
            widget.current_drag_rect = [x,y,x,y];
            widget.draw_canvas();
            widget.model.set('last_click_xy_1',widget.model.get('last_click_xy'))
            widget.model.set('last_click_xy',[x,y]);
            widget.touch();
            widget.send({event:'mousedown', x:x, y:y});
            //console.log("MSG SENT: mousedown")
        });
        this.el.addEventListener('mousemove', function(event){
            try {
                let x=event.offsetX, y=event.offsetY;
                widget.last_move_xy = [x,y];
                console.log("MSG SENT: mousemove")
                widget.send({event:'mousemove', x:x, y:y})
                if (!widget.current_drag_rect) {return;}
                event.preventDefault();
                let x0 = widget.current_drag_rect[0];
                let y0 = widget.current_drag_rect[1];
                widget.current_drag_rect = [x0,y0,x,y];
            } finally {
                widget.draw_canvas();
            }
        });
        this.el.addEventListener('mouseup', function(event){
            event.preventDefault();
            let cdr = widget.current_drag_rect;
            if (cdr) {
                let w = Math.abs(cdr[2]-cdr[0]), h = Math.abs(cdr[3]-cdr[1]);
                let rect_list = widget.model.get('selected_rects').slice();
                if (w+h < 5) {
                    for (const r of rect_list) {
                        if (point_in_rect([cdr[0],cdr[1]],r)) {
                            rect_list.splice(rect_list.indexOf(r),1); // remove rect
                            break;
                        }
                    }
                } else {
                    rect_list.push(widget.current_drag_rect);
                }
                widget.model.set('selected_rects',rect_list);
                widget.touch();
                delete widget.current_drag_rect;
            }
            widget.draw_canvas();
            //widget.send({event:'mouseup'})
            //console.log("MSG SENT: mouseup")
        });
        this.el.addEventListener('mouseout', function(event) {
            widget.last_move_xy = null;
            widget.draw_canvas();
        });
        this.el.addEventListener('dblclick', function(event) {
            widget.model.set('last_click_xy',[]);
            widget.model.set('last_click_xy_1',[]);
            widget.touch();
            widget.draw_canvas();
        });
        this.model.on('change:img_fmt', this.img_changed, this);
        this.model.on('change:img_bytes', this.img_changed, this);
        this.model.on('change:last_click_xy', this.draw_canvas, this);
        this.model.on('change:last_click_xy_1', this.draw_canvas, this);
        this.draw_canvas();
    };
    
    img_changed() {
        let mimetype = `image/${this.model.get('img_fmt')}`
        let bin_blob = new Blob([this.model.get('img_bytes')], {type:mimetype})
        let bin_url = URL.createObjectURL(bin_blob)
        let old_url = this.el.src;
        this.img_child.src = bin_url;
        var widget = this;
        this.img_child.onload = function() {
            let w = widget.img_child.clientWidth, h = widget.img_child.clientHeight;
            widget.canvas_child.width = w;
            widget.canvas_child.height = h;
            widget.draw_canvas();
        }
        this.selected_rects = []
        if (old_url && typeof old_url !== 'string') {
            URL.revokeObjectURL(old_url)
        }
    };
}
