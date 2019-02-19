// Library to track gpuUsage
const smi = require('node-nvidia-smi');

// Library to send signal to Q keyboards
const q = require('daskeyboard-applet');

// Color associated to gpu activity from low (green), middle (yellow), to high (red).
const colors = ['#00FF00', '#33FF00','#FFFF00', '#FF6600', '#FF0000'];

const logger = q.logger;


class GPUUsage extends q.DesktopApp {
    constructor() {
        super();
        this.pollingInterval = 3000; // run every 3 seconds
    }

    // call this function every pollingInterval
    async run() {
        return this.getGPUUsage().then(percent => {
            // return signal every 3000ms
            return new q.Signal({
                points: [this.generateColor(percent)],
                name: "GPU Usage",
                message: "GPU Memory used: " + Math.round(percent) + "%",
                isMuted: true, // don't flash the Q button on each signal
            });
        });
    }

    async getGPUUsage() {
        return new Promise((resolve) => {
            smi(function (err, data) {
                // handle errors
                if (err) {
                  logger.error(err);
                }
                var memory_object = data.nvidia_smi_log.gpu.fb_memory_usage
                var used = parseInt(memory_object.used.replace(' MiB', ''))
                var total = parseInt(memory_object.total.replace(' MiB', ''))
                var percent = (used / total) * 100
                resolve(percent)
            });
        })
    }

    generateColor(percent) {
        let color =[];

        switch (true){
        case percent < 20:
            // return first color
            color.push(new q.Point(colors[0]));
            break;

        case percent < 40:
            // return second color
            color.push(new q.Point(colors[1]));
            break;

        case percent < 60:
            // return third color
            color.push(new q.Point(colors[2]));
            break;
        
        case percent < 80:
            // return fourth color
            color.push(new q.Point(colors[3]));
            break;

        case percent <= 100:
            // return fifth color
            color.push(new q.Point(colors[4]));
            break;

        default:
            // Should not happen: percent>100, return white color
            color.push(new q.Point("#FFFFFF"));
            break;
        };
        return color;
    }

}

module.exports = {
    GPUUsage: GPUUsage
};

const applet = new GPUUsage();