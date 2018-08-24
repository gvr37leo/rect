/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />


class Rect{
    pos:Vector
    size:Vector

    constructor(pos:Vector,size:Vector){
        this.pos = pos
        this.size = size
    }

    collidePoint(point:Vector){
        for (var i = 0; i < this.pos.vals.length; i++) {
			if (!inRange(this.getEdge(i, false), this.getEdge(i, true), point.vals[i])) {
				return false;
			}
		}
		return true;
    }

    collideBox(other:Rect){
        for(var i = 0; i < 2; i++){
			if(!rangeOverlap(this.getEdge(i,false), this.getEdge(i,true), other.getEdge(i,false), other.getEdge(i,true))){
				return false;
			}
		}
		return true;
    }

    collideLine(a:Vector,b:Vector,out:[number,number]):boolean{
        var clip1:[number,number] = [0,0]
        var clip2:[number,number] = [0,0]

        this.relIntersect(a.x,b.x, this.getEdge(0,false), this.getEdge(0,true), clip1)
        this.relIntersect(a.y,b.y, this.getEdge(1,false), this.getEdge(1,true), clip2)
        
        //result contains if the lines intersected
        var result = this.intersectLine(clip1[0],clip1[1],clip2[0],clip2[1],out)
        return result && inRange(0,1,out[0])// && inRange(0,1,out[1])
    }

    relIntersect(amin:number,amax:number,bmin:number,bmax:number,out:[number,number]){
        if(amin == amax){//this could use some work
            out[0] = -Infinity
            out[1] = Infinity
            return
        }
        var length = Math.abs(to(amin, amax))
        out[0] = Math.abs(to(amin,bmin)) / length;
        out[1] = Math.abs(to(amin,bmax)) / length;
        if(amin > amax){
            swap(out)
        }
    }

    intersectLine(amin:number,amax:number,bmin:number,bmax:number,out:[number,number]){
        var ibegin = max(amin,bmin)
        var iend = min(amax,bmax)
        out[0] = ibegin
        out[1] = iend
        if(ibegin <= iend){
            return true
        }else{
            return false
        }
    }

    getEdge(dim:number,takeMax:boolean){
        var result = this.pos.vals[dim];
		if(takeMax){
			result += this.size.vals[dim];
		}
		return result;
    }

    getPoint(relativePos:Vector){
        var halfsize = this.size.c().scale(0.5);
		var center = this.pos.c().add(halfsize);
        halfsize.mul(relativePos)
		return center.add(halfsize);
    }

    draw(ctxt:CanvasRenderingContext2D){
        var tl = this.getPoint(new Vector(-1,-1))
        var tr = this.getPoint(new Vector(1,-1))
        var br = this.getPoint(new Vector(1,1))
        var bl = this.getPoint(new Vector(-1,1))

        ctxt.beginPath()
        ctxt.moveTo(tl.x,tl.y)
        ctxt.lineTo(tr.x,tr.y)
        ctxt.lineTo(br.x,br.y)
        ctxt.lineTo(bl.x,bl.y)
        ctxt.lineTo(tl.x,tl.y)
        ctxt.stroke()
    }

    loop(callback:(v:Vector)=>void){
        var temp = this.size.c()

        this.size.loop(v2 => {
            temp.overwrite(v2)
            temp.add(this.pos)
            callback(temp)
        })
    }
}

function rangeOverlap(range1A:number,range1B:number,range2A:number,range2B:number){
    return range1A <= range2B && range2A <= range1B
}