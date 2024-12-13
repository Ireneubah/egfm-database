function addSection(sectionId, templateId) {
    const section = document.getElementById(sectionId);
    const template = document.getElementById(templateId).content.cloneNode(true);
    section.appendChild(template);
}

function removeSection(button) {
    const section = button.parentElement;
    section.parentElement.removeChild(section);
}

document.querySelector('button[type="submit"]').addEventListener('click', async (event) => {
    event.preventDefault();

    // Collect Adult Member Data
    const adults = [];
    document.querySelectorAll('.adult-member').forEach(adult => {
        adults.push({
            first_name: adult.querySelector('input[name="adult_first_name[]"]').value,
            last_name: adult.querySelector('input[name="adult_last_name[]"]').value,
            marital_status: adult.querySelector('select[name="marital_status[]"]').value,
            email: adult.querySelector('input[name="adult_email[]"]').value,
            phone: adult.querySelector('input[name="adult_phone[]"]').value,
            dob: adult.querySelector('input[name="adult_dob[]"]').value,
            nationality: adult.querySelector('input[name="adult_nationality[]"]').value
        });
    });

    // Collect Child Member Data
    const children = [];
    document.querySelectorAll('.child-member').forEach(child => {
        children.push({
            first_name: child.querySelector('input[name="child_first_name[]"]').value,
            last_name: child.querySelector('input[name="child_last_name[]"]').value,
            dob: child.querySelector('input[name="child_dob[]"]').value,
            nationality: child.querySelector('input[name="child_nationality[]"]').value
        });
    });

    // Collect Home Address Data
    const address = {
        postcode: document.querySelector('input[name="postcode"]').value,
        city: document.querySelector('input[name="city"]').value,
        country: document.querySelector('input[name="country"]').value
    };

    // Send Data to the Server
    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adultMembers: adults,
                childMembers: children,
                address: address
            })
        });

        if (response.ok) {
            alert('Registration submitted successfully!');
        } else {
            alert('Error submitting registration.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});
