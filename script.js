const current = document.getElementById('current');
const previous = document.getElementById('previous');

let value = '0';
let stored = '';
let op = null;
let reset = false;

function show() {
    current.textContent = value;
    previous.textContent = op && stored ? `${stored} ${op}` : '';
}

function number(n) {
    if (reset) {
        value = n === '.' ? '0.' : n;
        reset = false;
    } else if (n === '.' && value.includes('.')) {
        return;
    } else {
        value = value === '0' && n !== '.' ? n : value + n;
    }
    show();
}

function choose(next) {
    if (value === 'Cannot divide by zero') return;
    if (op && !reset) calc();
    stored = value;
    op = next;
    reset = true;
    show();
}

function calc() {
    if (!op || stored === '') return;
    let a = Number(stored);
    let b = Number(value);
    let r;

    if (op === '+') r = a + b;
    if (op === '−') r = a - b;
    if (op === '×') r = a * b;
    if (op === '÷') {
        if (b === 0) {
            value = 'Cannot divide by zero';
            stored = '';
            op = null;
            reset = true;
            show();
            return;
        }
        r = a / b;
    }

    value = String(Number(r.toPrecision(10)));
    stored = '';
    op = null;
    reset = true;
    show();
}

function clear() {
    value = '0';
    stored = '';
    op = null;
    reset = false;
    show();
}

function del() {
    if (reset || value.length <= 1 || value === 'Cannot divide by zero') {
        value = '0';
        reset = false;
    } else {
        value = value.slice(0, -1);
    }
    show();
}

document.querySelector('.keys').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;

    if (b.dataset.num !== undefined) number(b.dataset.num);
    if (b.dataset.op) choose(b.dataset.op);
    if (b.dataset.action === 'clear') clear();
    if (b.dataset.action === 'delete') del();
    if (b.dataset.action === 'equals') calc();
});

document.addEventListener('keydown', (e) => {
    if (/^[0-9.]$/.test(e.key)) {
        number(e.key);
    } else if (e.key === '+') {
        choose('+');
    } else if (e.key === '-') {
        choose('−');
    } else if (e.key === '*') {
        choose('×');
    } else if (e.key === '/') {
        e.preventDefault();
        choose('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calc();
    } else if (e.key === 'Backspace') {
        del();
    } else if (e.key === 'Escape') {
        clear();
    }
});

show();
