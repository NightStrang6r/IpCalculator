const input1Octet = document.querySelector('#input1Octet');
const input2Octet = document.querySelector('#input2Octet');
const input3Octet = document.querySelector('#input3Octet');
const input4Octet = document.querySelector('#input4Octet');
const inputPrefix = document.querySelector('#inputPrefix');

const resultMask = document.querySelector('#resultMask');
const resultNetwork = document.querySelector('#resultNetwork');
const resultNode = document.querySelector('#resultNode');
const resultNodeCount = document.querySelector('#resultNodeCount');

input1Octet.addEventListener('input', (ev) => calculate(ev.target));
input2Octet.addEventListener('input', (ev) => calculate(ev.target));
input3Octet.addEventListener('input', (ev) => calculate(ev.target));
input4Octet.addEventListener('input', (ev) => calculate(ev.target));
inputPrefix.addEventListener('input', (ev) => calculate(ev.target));

calculate();

function validate(value, min, max) {
    if(!value) return false;

    value = Number(value);
    if(isNaN(value)) return false;
    if(value < min) return false;
    if(value > max) return false;

    return true;
}

function calculate() {
    if(!validate(input1Octet.value, 0, 255)) { input1Octet.classList.add('error-input'); return; };
    if(!validate(input2Octet.value, 0, 255)) { input2Octet.classList.add('error-input'); return; };
    if(!validate(input3Octet.value, 0, 255)) { input3Octet.classList.add('error-input'); return; };
    if(!validate(input4Octet.value, 0, 255)) { input4Octet.classList.add('error-input'); return; };
    if(!validate(inputPrefix.value, 8, 30)) { inputPrefix.classList.add('error-input'); return; };
    clearErrors();

    let ip = input1Octet.value + '.' + input2Octet.value + '.' + input3Octet.value + '.' + input4Octet.value;
    let mask = calcMask(inputPrefix.value);
    let addres = calcAddres(ip, mask);
    let node = calcNodeNumber(ip,mask);
    let maxNodes = calcMaxNodes(inputPrefix.value);

    resultMask.innerHTML = mask;
    resultNetwork.innerHTML = addres;
    resultNode.innerHTML = node;
    resultNodeCount.innerHTML = maxNodes;
}

function calcMask(prefix) {
    let count = Number(prefix);
    let binary = '';
    let result = '';

    for(let i = 0; i < 32; i++) {
        if(count > 0) {
            binary += '1';
        } else {
            binary += '0';
        }

        if(i % 8 == 7) {
            result += bin2dec(binary);
            if(i != 31) result += '.';
            binary = '';
        }

        count--;
    }

    return result;
}

function calcAddres(ip, mask) {
    let result = '';

    ip = ip.split('.');
    mask = mask.split('.');

    for(let i = 0; i < 4; i++) {
        result += ip[i] & mask[i];
        if(i != 3) result += '.';
    }

    return result;
}

function calcMaxNodes(prefix) {
    let count = 32 - Number(prefix);
    let result = 1;

    for(let i = 0; i < count; i++) {
        result *= 2;
    }

    return result - 2;
}

function calcNodeNumber(ip, mask) {
    let result = '';
    let count = 0;

    ip = ip.split('.');
    mask = mask.split('.');

    for(let i = 0; i < 4; i++) {
        ip[i] = dec2bin(ip[i]);
        mask[i] = dec2bin(mask[i]);
    }

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 8; j++) {
            if(mask[i][j] == 0) {
                count++;
            }
        }
    }

    ip = ip.join('').split('').reverse().join('');

    for(let i = 0; i < count; i++) {
        result += ip[i];
    }

    result = result.split('').reverse().join('');

    result = bin2dec(result);
    return result;
}

function bin2dec(n) {
    let num = Number(n);
    let dec_value = 0;
    let base = 1;
 
    let temp = num;
    while(temp) {
        let last_digit = temp % 10;
        temp = Math.floor(temp / 10);
 
        dec_value += last_digit * base;
 
        base = base * 2;
    }
 
    return dec_value;
}

function dec2bin(number) {
    let result = [],
        integerPart,
        digit;

    while(number >= 1) {
        integerPart = parseInt(number / 2);
        digit = number - 2 * integerPart;
        if(digit >= 10) digit = String.fromCharCode(digit + 87);
        result.unshift(digit);
        number = integerPart;
    }

    if(result.length < 8) {
        for(let i = result.length; i < 8; i++) {
            result.unshift(0);
        }
    }

    return result.join('');
}

function clearErrors() {
    input1Octet.classList.remove('error-input');
    input2Octet.classList.remove('error-input');
    input3Octet.classList.remove('error-input');
    input4Octet.classList.remove('error-input');
    inputPrefix.classList.remove('error-input');
}