document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultOutput = document.getElementById('result-output');
    const errorMessage = document.getElementById('error-message');

    analyzeBtn.addEventListener('click', async () => {
        const text = textInput.value;
        if (!text.trim()) {
            errorMessage.textContent = 'Please enter a text to analyze.';
            resultOutput.textContent = '';
            return;
        }

        errorMessage.textContent = '';
        resultOutput.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'A server error occurred.');
            }

            resultOutput.textContent = JSON.stringify(data, null, 2);

        } catch (error) {
            console.error('Error during the analysis:', error);
            resultOutput.textContent = '';
            errorMessage.textContent = `Error: ${error.message}`;
        } finally {
            analyzeBtn.disabled = false;
        }
    });
});