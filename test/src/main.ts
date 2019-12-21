import calc from "./calc";

export default 123;

export class Animal {
    name: string = "abc";
    constructor(name: string) {
        calc(1, 2);
    }

    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

export class Snake extends Animal {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        let t: any = 1;
        (t as { value: any }).value = 5;
        super.move(distanceInMeters);
    }
}

export class Horse extends Animal {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}
