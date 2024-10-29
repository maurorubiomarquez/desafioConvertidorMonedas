// Elementos del DOM
const amountInput = document.getElementById('amount');
const currencySelect = document.getElementById('currency');
const convertBtn = document.getElementById('convert-btn');
const resultText = document.getElementById('result-text');
const ctx = document.getElementById('currency-chart').getContext('2d');

// Variables globales
const apiUrl = 'https://mindicador.cl/api/';  // URL base de la API

// Función para realizar la conversión
async function convertCurrency() {
    const amount = amountInput.value;
    const currency = currencySelect.value;

    if (amount === '' || amount <= 0) {
        alert('Por favor, ingrese un monto válido.');
        return;
    }

    try {
        // Llamada a la API para obtener el tipo de cambio
        const response = await fetch(apiUrl + currency);
        if (!response.ok) throw new Error('Error en la consulta de la API');

        const data = await response.json();
        const exchangeRate = data.serie[0].valor;
        const convertedAmount = (amount / exchangeRate).toFixed(2);

        // Mostrar el resultado en el DOM
        resultText.textContent = `${convertedAmount} ${currency.toUpperCase()}`;

        // Llamar al gráfico con el historial de los últimos 10 días
        renderChart(data.serie.slice(0, 10));
    } catch (error) {
        resultText.textContent = 'Error al consultar la API';
        console.error(error);
    }
}

// Función para renderizar el gráfico con los datos del historial
function renderChart(data) {
    const labels = data.map(entry => new Date(entry.fecha).toLocaleDateString());
    const values = data.map(entry => entry.valor);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Historial últimos 10 días',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Agregar el event listener al botón de conversión
convertBtn.addEventListener('click', convertCurrency);
