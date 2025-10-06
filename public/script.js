document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultOutput = document.getElementById('result-output');
    const errorMessage = document.getElementById('error-message');

    const questionnaireForm = document.getElementById('questionnaire-form');
    const submitQuestionnaireBtn = document.getElementById('submit-questionnaire-btn');

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
    questionnaireForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        errorMessage.textContent = '';
        resultOutput.textContent = 'Analyzing questionnaire answers...';
        submitQuestionnaireBtn.disabled = true;

        const formData = new FormData(questionnaireForm);
        const answers = {};
        let allQuestionsAnswered = true;

        for (const [name, value] of formData.entries()) {
            answers[name] = value.toString();
        }

        const expectedQuestions = ['q1_feeling', 'q2_productivity', 'q3_sleep'];
        for (const qName of expectedQuestions) {
            if (!answers[qName]) {
                allQuestionsAnswered = false;
                break;
            }
        }

        if (!allQuestionsAnswered) {
            errorMessage.textContent = 'Please answer all questions.';
            resultOutput.textContent = '';
            submitQuestionnaireBtn.disabled = false;
            return;
        }

        try {
            const response = await fetch('/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'A server error occurred.');
            }

            resultOutput.textContent = JSON.stringify(data, null, 2);

        } catch (error) {
            console.error('Error during questionnaire analysis:', error);
            resultOutput.textContent = '';
            errorMessage.textContent = `Error: ${error.message}`;
        } finally {
            submitQuestionnaireBtn.disabled = false;
        }
    });
});