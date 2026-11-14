// Getting HTML elements
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const convertedAmount = document.getElementById("convertedAmount");
const exchangeRate = document.getElementById("exchangeRate");
const message = document.getElementById("message");

// Currency conversion function
async function convertCurrency() {

    const amount = Number(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Input validation
    if (!amountInput.value || !Number.isFinite(amount) || amount <= 0) {
        message.textContent = "Please enter a valid amount.";
        convertedAmount.textContent = "--";
        exchangeRate.textContent = "";
        return;
    }

    message.textContent = "Fetching exchange rate...";
    convertBtn.disabled = true;

    try {

        // Fetching exchange rate from API
        const API_URL = `https://open.er-api.com/v6/latest/${from}`;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch exchange rates.");
        }

        const data = await response.json();

        if (data.result !== "success" || !data.rates[to]) {
            throw new Error("Currency rate not available.");
        }

        // Getting exchange rate
        const rate = data.rates[to];

        // Calculating converted amount
        const result = amount * rate;

        // Displaying result
        convertedAmount.textContent =
            `${result.toLocaleString("en-US", {
                maximumFractionDigits: 4
            })} ${to}`;

        exchangeRate.textContent =
            `1 ${from} = ${rate.toFixed(4)} ${to}`;

        message.textContent = "";

    } catch (error) {

        message.textContent = "Something went wrong. Please try again.";
        convertedAmount.textContent = "--";
        exchangeRate.textContent = "";

        console.error(error);

    } finally {

        convertBtn.disabled = false;

    }
}

// Convert button click event
convertBtn.addEventListener("click", convertCurrency);

// Swap currencies
swapBtn.addEventListener("click", () => {

    const temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    convertCurrency();

});