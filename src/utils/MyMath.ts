﻿export type Point = {
    x: number;
    y: number;
};

export class RectABCD {
    a: Point;
    b: Point;
    c: Point;
    d: Point;
    constructor(a: Point, b: Point, c: Point, d: Point) {
        this.a = a; this.b = b; this.c = c; this.d = d;
    }
}

export class MyMath {

    public static randomInRange(aMin: number, aMax: number, auto = false): number {
        if (auto && aMin > aMax) {
            var tmp = aMin;
            aMin = aMax;
            aMax = tmp;
        }
        return Math.random() * Math.abs(aMax - aMin) + aMin;
    }

    public static randomIntInRange(aMin: number, aMax: number): number {
        return Math.round(MyMath.randomInRange(aMin, aMax));
    }

    public static clamp(x, min, max): number {
        return Math.min(Math.max(x, min), max);
    }

    public static sat(x: number): number {
        return this.clamp(x, 0, 1);
    }

    public static lerp(t, a, b): number {
        return a + (b - a) * t;
    }

    public static toRadian(aDeg: number): number {
        return aDeg * Math.PI / 180;
    }

    public static toDeg(aRad: number): number {
        return aRad * 180 / Math.PI;
    }

    public static getVectorLength(x1: number, y1: number, x2: number, y2: number): number {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static IsPointInTriangle(ax, ay, bx, by, cx, cy, px, py: number): boolean {
        var b0x, b0y, c0x, c0y, p0x, p0y: number;
        var m, l: number; // мю и лямбда
        var res = false;
        // переносим треугольник точкой А в (0;0).
        b0x = bx - ax; b0y = by - ay;
        c0x = cx - ax; c0y = cy - ay;
        p0x = px - ax; p0y = py - ay;
        //
        m = (p0x * b0y - b0x * p0y) / (c0x * b0y - b0x * c0y);
        if (m >= 0 && m <= 1) {
            l = (p0x - m * c0x) / b0x;
            if (l >= 0 && (m + l) <= 1)
                res = true;
        }
        return res;
    }

    public static isPointInRect(rect: RectABCD, p: Point): boolean {
        return MyMath.IsPointInTriangle(rect.a.x, rect.a.y, rect.b.x, rect.b.y, rect.c.x, rect.c.y, p.x, p.y) &&
            MyMath.IsPointInTriangle(rect.c.x, rect.c.y, rect.d.x, rect.d.y, rect.a.x, rect.a.y, p.x, p.y);
    }

    public static isPointInCircle(x: number, y: number, cx: number, cy: number, r: number): boolean {
        return MyMath.getVectorLength(x, y, cx, cy) <= r;
    }

    public static isCirclesIntersect(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
        return MyMath.getVectorLength(x1, y1, x2, y2) <= r1 + r2;
    }

    public static shuffleArray(mas: any[], factor = 4) {
        for (let i = 0; i < mas.length * factor; i++) {
            const id1 = this.randomIntInRange(0, mas.length - 1);
            const id2 = this.randomIntInRange(0, mas.length - 1);
            let item = mas[id1];
            mas[id1] = mas[id2];
            mas[id2] = item;
        }
    }

}

export class LinearSpline {
    private _points = [];
    private _lerp: Function;

    constructor(lerp: Function) {
        this._points = [];
        this._lerp = lerp;
    }

    addPoint(t: number, val) {
        this._points.push([t, val]);
    }

    get(t: number) {
        let p1 = 0;

        for (let i = 0; i < this._points.length; i++) {
            const p = this._points[i];
            if (p[0] >= t) {
                break;
            }
            p1 = i;
        }

        const p2 = Math.min(this._points.length - 1, p1 + 1);

        if (p1 == p2) {
            return this._points[p1][1];
        }

        return this._lerp(
            (t - this._points[p1][0]) / (this._points[p2][0] - this._points[p1][0]),
            this._points[p1][1],
            this._points[p2][1]
        );
    }

}