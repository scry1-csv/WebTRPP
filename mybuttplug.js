const ELEM_LOG = document.getElementById("log");
const ELEM_DEVICE = document.getElementById("device");

const LANG = location.href.endsWith("index_ja.html") ? "ja" : "en";
const MSG_INIT = LANG === "ja" ? "buttplugを初期化しています..." : "Initializing Buttplug...";
const MSG_DETECT = LANG === "ja" ? "デバイスが検出されました" : "Device detected";
const MSG_NOTSUPPORT = LANG === "ja" ? "振動に対応していないデバイスです" : "Device does not support vibration";
const MSG_TEST = LANG === "ja" ? "振動テスト中..." : "Testing vibration...";
const MSG_ERROR = LANG === "ja" ? "デバイスエラーです" : "Got a device error!";
const MSG_LOST = LANG === "ja" ? "デバイスとの接続が切れました" : "Connection lost";
const MSG_WAITING = LANG === "ja" ? "デバイス接続待機中..." : "Waiting for device connection...";

let gButtplugInit;
let gButtplugClient;

function hLog(str){
    ELEM_LOG.appendChild(document.createTextNode(str));
    ELEM_LOG.appendChild(document.createElement("br"));
}

async function runDeviceControl() {
    ELEM_LOG.innerHTML = "";
    hLog(MSG_INIT);
    if (!gButtplugInit)
        await Buttplug.buttplugInit();

    if (!gButtplugClient){
        const connector = new Buttplug.ButtplugEmbeddedConnectorOptions();
        const client = new Buttplug.ButtplugClient("test");
        gButtplugClient = client;
        await gButtplugClient.connect(connector);
    }

    gButtplugClient.addListener("deviceadded", async (device) => {
        hLog(`${MSG_DETECT}: ${device.Name}`);
        //hLog(`${device.Name} - Index: ${device.Index}`);

        /*
        hLog("Client currently knows about these devices:");
        client.Devices.forEach((device) => hLog(`- ${device.Name}`));
        */

        if (
            !device.messageAttributes(
                Buttplug.ButtplugDeviceMessageType.VibrateCmd
            )
        ) {
            hLog(MSG_NOTSUPPORT);
            return;
        }
        /*
        hLog(
            `${device.Name} - AllowedMessages: ${device.AllowedMessages}`
        );

        let allowedMessages = device.AllowedMessages;
        for (let message of allowedMessages) {
            hLog(`${device.Name} - AllowedMessages: ${message}`);
        }*/

        hLog(MSG_TEST);
        try {
            await device.vibrate(0.6);
        } catch (e) {
            hLog(e);
            if (e instanceof Buttplug.ButtplugDeviceError) {
                hLog(MSG_ERROR);
            }
        }
        await new Promise((r) => setTimeout(r, 500));
        await device.stop();

        ELEM_DEVICE.textContent = device.Name;
        gDevice = device;
    });

    gButtplugClient.addListener("deviceremoved", (device) =>
    {
        hLog(`${MSG_LOST}: ${device.Name}`);
        ELEM_DEVICE.textContent = "";
    }
    );

    // Now that everything is set up, we can scan.
    hLog(MSG_WAITING);
    await gButtplugClient.startScanning();
}
