class PatternLine {
    Time = 0;
    Power = 0;
    constructor(time, power) {
        this.Time = time;

        if(power < 0)
            this.Power = 0;
        else if(power > 1000)
            this.Power = 1;
        else
            this.Power = power;
    }

    TimeOffseted() {
        return this.Time - gOffset;
    }

    ButtPower() {
        return this.Power / 1000;
    }
}
PatternLine.prototype.toString = function() {
    return "Time: " + this.Time + ", Power: " + this.ButtPower();
};

function loadPattern(str) {
    let r = str.replace("\r", "\n");
    while(r.match(/\n{2,}/))
        r = r.replace("\n\n", "\n");
    let array = str.split(/\n/);
    let result = [];
    array.forEach((l) => {
        const s = l.split(/,/);
        const line = new PatternLine(Number(s[0]), Number(s[1]));
        result.push(line);
    });

    return result;
}

const gTestPattern = [
    new PatternLine(0.5, 800),
    new PatternLine(0.55, 0),
    new PatternLine(1.5, 400),
    new PatternLine(1.55, 0),
    new PatternLine(2.5, 800),
    new PatternLine(2.55, 0),
    new PatternLine(3.5, 400),
    new PatternLine(3.55, 0),
    new PatternLine(4.5, 800),
    new PatternLine(4.55, 0),
    new PatternLine(5.5, 400),
    new PatternLine(5.55, 0),
    new PatternLine(6.5, 800),
    new PatternLine(6.55, 0),
    new PatternLine(7.5, 400),
    new PatternLine(7.55, 0),
];