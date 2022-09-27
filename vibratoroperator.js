let gPatternEnded = false;

function patternLog(str) {
    let linetime;
    if(gPattern[gNowCount] ?? false)
        linetime = gPattern[gNowCount].TimeOffseted();
    else
        linetime = "outofrange"
    console.log(
        `currentTime:  ${AUDIO_ELEM.currentTime}, patternNow = ${gNowCount}, LineTime = ${linetime}, ${str}."`
    );
}

function gNowCountValidate() {
    gPatternEnded = false;
    gNowCount = 0;

    const nowTime = AUDIO_ELEM.currentTime;

    patternLog("gNowCountValidate() called.");
    while (gNowCount > 0 && nowTime <= gPattern[gNowCount - 1].TimeOffseted()) {
        gNowCount--;
        gPreviousTime = gPattern[gNowCount - 1].TimeOffseted();
        //patternLog("Backed.");
    }

    while (gNowCount < gPattern.length && nowTime > gPattern[gNowCount + 1].TimeOffseted()) {
        gNowCount++;
        gPreviousTime = gPattern[gNowCount - 1].TimeOffseted();
        //patternLog("Skipped.");
    }

    patternLog("validated.");
}


async function videoTimeUpdated() {
    if (!(gPattern ?? false)) return;
    if (!(gDevice ?? false)) return;
    if (gPatternEnded) return;

    const nowTime = AUDIO_ELEM.currentTime;

    if (gNowCount > 0 && nowTime <= gPattern[gNowCount - 1].TimeOffseted())
        gNowCountValidate();

    if (gNowCount >= gPattern.length )
    {
        console.log("pattern ended.")
        gDevice.vibrate(0);
        gPatternEnded = true;
        return;
    }

    if (nowTime > gPattern[gNowCount].TimeOffseted()) {
        gDevice.vibrate(gPattern[gNowCount].ButtPower());
        patternLog(`LinePower = ${gPattern[gNowCount].ButtPower()}`);
        gNowCount++;
        gPreviousTime = nowTime;
        return;
    }
}