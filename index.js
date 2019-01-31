#!/usr/bin/env node

const si = require("systeminformation");
const mri = require("mri");
const sll = require("single-line-log").stdout;
const kleur = require("kleur");
const fork = require("child_process").fork;
const sleep = require("sleep");

async function readTemp() {
    const temp = await si.cpuTemperature();
    return { main: temp.main, cores: temp.cores };
}

function avg(arr) {
    return arr.reduce((sum, t) => t.main + sum, 0) / arr.length;
}

async function runRestaurant(targetTemp) {
    let temp = await readTemp(),
        temps = [temp, temp, temp],
        children = [];

    while (1) {
        if (avg(temps) < targetTemp) {
            if (children.length < 40) {
                children.push(fork("./cook-dish"));
            }
        } else if (avg(temps) > targetTemp) {
            if (children.length > 0) {
                children.pop().kill();
            }
        }

        temp = await readTemp();
        temps.shift();
        temps.push(temp);

        sll(
            "Current oven temperature",
            kleur.bold.red(temp.main.toFixed(2))
        );
        sleep.msleep(500);
    }
}

const args = process.argv.slice(2),
    targetTemp = mri(args, {
        alias: { temp: "t" },
        default: { temp: 85 }
    });

console.log(kleur.bold.red('Chef\'s table')),
console.log('A necessary evil')

runRestaurant(targetTemp.temp);
