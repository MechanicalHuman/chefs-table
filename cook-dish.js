
function mySlowFunction(baseNumber) {
    let result = 0;
    for (let i = Math.pow(baseNumber, 10); i >= 0; i--) {
        result += Math.atan(i) * Math.tan(i);
    };
    return result;
}


mySlowFunction(64); // 8 cores

