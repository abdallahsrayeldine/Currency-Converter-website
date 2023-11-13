    function showSection(sectionId) {
    document.getElementById("converterSection").style.display = "none";
    document.getElementById("exchangerSection").style.display = "none";
    document.getElementById("history").style.display = "block";

    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "exchangerSection") {
        document.getElementById("exchangerAmount").value = 1;
    }
}

function convert(section) {
    let fromCurrency, toCurrency, amount, result;

    if (section === "converter") {
        fromCurrency = document.getElementById("converterFrom").value;
        toCurrency = document.getElementById("converterTo").value;
        amount = 1;
        result = document.getElementById("converterResult");
    } else {
        fromCurrency = document.getElementById("exchangerFrom").value;
        toCurrency = document.getElementById("exchangerTo").value;
        amount = document.getElementById("exchangerAmount").value;
        result = document.getElementById("exchangerResult");
    }

    fetch(`https://v6.exchangerate-api.com/v6/c6c07ad6315d78a9e38573a0/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            let rate = data.conversion_rates[toCurrency];
            let convertedAmount = amount * rate;

            result.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;

            if (section === "exchanger") {
                // Add the conversion to the history
                let historyList = document.getElementById("recentConversions");
                let listItem = document.createElement("li");
                listItem.innerText = `${amount} ${fromCurrency} =  ${convertedAmount.toFixed(2)} ${toCurrency}`;
                historyList.prepend(listItem);

                // Limit the history to the last 5 conversions
                let historyItems = historyList.getElementsByTagName("li");
                if (historyItems.length > 5) {
                    historyList.removeChild(historyItems[5]);
                }

                // Save the history to local storage
                let history = Array.from(historyItems).map(item => item.innerText);
                localStorage.setItem("conversionHistory", JSON.stringify(history));

                // Show the history section
                document.getElementById("history").style.display = "block";
            }
        })
        .catch(error => console.log(error));
}

// Load the conversion history from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    let history = localStorage.getItem("conversionHistory");
    if (history) {
        history = JSON.parse(history);

        let historyList = document.getElementById("recentConversions");
        history.forEach(itemText => {
            let listItem = document.createElement("li");
            listItem.innerText = itemText;
            historyList.appendChild(listItem);
        });
    }
});

