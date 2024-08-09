async function query(data) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1",
            {
                headers: {
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}. ${errorText}`);
        }

        const result = await response.blob();
        return result;
    } catch (error) {
        console.error("Error during API request:", error);
        alert("Failed to generate image. Please check the console for details.");
    }
}

document.getElementById('imageForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const spinner = document.getElementById('spinner');
    const imageElement = document.getElementById('generatedImage');
    const downloadLink = document.getElementById('downloadLink');
    
    // Show the spinner
    spinner.style.display = 'block';
    imageElement.style.display = 'none';
    downloadLink.style.display = 'none';

    try {
        const imageBlob = await query({ "inputs": prompt });
        
        if (imageBlob) {
            const imageUrl = URL.createObjectURL(imageBlob);
            imageElement.src = imageUrl;
            imageElement.style.display = 'block';

            downloadLink.href = imageUrl;
            downloadLink.style.display = 'block';
        }
    } catch (error) {
        console.error("Error generating image:", error);
    } finally {
        // Hide the spinner
        spinner.style.display = 'none';
    }
});
