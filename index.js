const express = require('express');
const app = express();
const path = require('path');
const { toWords } = require('number-to-words');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('billForm');
});

app.post('/generateBill', (req, res) => {
    const data = req.body;
    let totalAmt = 0.00;
    for (let i = 0; i < data.productName.length; i++) {
        totalAmt += data.rate[i] * data.quantity[i];
    }

    // Calculate GSTs if checked
    let temp = totalAmt;
    let sgst = 0;
    let cgst = 0;
    let igst = 0;

    if (data.sgst) {
        sgst = (temp * 0.09).toFixed(2);
        totalAmt += parseFloat(sgst);
    }
    if (data.cgst) {
        cgst = (temp * 0.09).toFixed(2);
        totalAmt += parseFloat(cgst);
    }
    if (data.igst) {
        igst = (temp * 0.09).toFixed(2);
        totalAmt += parseFloat(igst);
    }

    totalAmt = parseFloat(totalAmt).toFixed(2);
    // Round off finalAmt
    let finalAmt = Math.round(totalAmt);

    // Calculate round-off
    let roundOff = (finalAmt - totalAmt).toFixed(3);

    // Convert totalAmt to words
    let totalAmtWords = Number.isFinite(finalAmt) ? toWords(finalAmt) : '';

    res.render('bill', { data, totalAmt, totalAmtWords, finalAmt, sgst, cgst, igst, roundOff });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
