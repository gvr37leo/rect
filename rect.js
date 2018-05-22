/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
class Rect {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }
    collidePoint(point) {
        for (var i = 0; i < this.pos.vals.length; i++) {
            if (!inRange(this.getEdge(i, false), this.getEdge(i, true), point.vals[i])) {
                return false;
            }
        }
        return true;
    }
    collideBox(other) {
        for (var i = 0; i < 2; i++) {
            if (!rangeOverlap(this.getEdge(i, false), this.getEdge(i, true), other.getEdge(i, false), other.getEdge(i, true))) {
                return false;
            }
        }
        return true;
    }
    getEdge(dim, takeMax) {
        var result = this.pos[dim];
        if (takeMax) {
            result += this.size[dim];
        }
        return result;
    }
    getPoint(relativePos) {
        var halfsize = this.size.c().scale(0.5);
        var center = this.pos.add(halfsize);
        halfsize.mul(relativePos);
        return center.add(halfsize);
    }
    draw(ctxt) {
        var tl = this.getPoint(new Vector2(-1, -1));
        var tr = this.getPoint(new Vector2(1, -1));
        var br = this.getPoint(new Vector2(1, 1));
        var bl = this.getPoint(new Vector2(-1, 1));
        ctxt.beginPath();
        ctxt.moveTo(tl.x, tl.y);
        ctxt.lineTo(tr.x, tr.y);
        ctxt.lineTo(br.x, br.y);
        ctxt.lineTo(br.x, br.y);
        ctxt.lineTo(tl.x, tl.y);
        ctxt.stroke();
    }
}
function rangeOverlap(range1A, range1B, range2A, range2B) {
    return range1A <= range2B && range2A <= range1B;
}
