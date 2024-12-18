function addAdultSection(sectionId, templateId) {
    const section = document.getElementById(sectionId);
    const template = document.getElementById(templateId).content.cloneNode(true);
    section.appendChild(template);
    const addButton = document.getElementById('add-adult-btn');
    section.appendChild(addButton);
}

function addChildSection(sectionId, templateId) {
    const section = document.getElementById(sectionId);
    const template = document.getElementById(templateId).content.cloneNode(true);
    section.appendChild(template);
    const addButton = document.getElementById('add-child-btn');
    section.appendChild(addButton);
}

function removeSection(button) {
    const section = button.parentElement;
    section.parentElement.removeChild(section);
}

document.querySelector("#submit-btn").addEventListener('click', async (event) => {
    event.preventDefault();

    // Collect Adult Member Data
    const adults = [];
    document.querySelectorAll('.adult-member').forEach(adult => {
        adults.push({
            first_name: adult.querySelector('input[name="adultMembers[][first_name]"]').value,
            last_name: adult.querySelector('input[name="adultMembers[][last_name]"]').value,
            marital_status: adult.querySelector('select[name="adultMembers[][marital_status]"]').value,
            email: adult.querySelector('input[name="adultMembers[][email]"]').value,
            phone: adult.querySelector('input[name="adultMembers[][phone]"]').value,
            dob: adult.querySelector('input[name="adultMembers[][dob]"]').value,
            nationality: adult.querySelector('input[name="adultMembers[][nationality]"]').value
        });
    });

    // Collect Child Member Data
    const children = [];
    document.querySelectorAll('.child-member').forEach(child => {
        children.push({
            first_name: child.querySelector('input[name="childMembers[][first_name]"]').value,
            last_name: child.querySelector('input[name="childMembers[][last_name]"]').value,
            dob: child.querySelector('input[name="childMembers[][dob]"]').value,
            nationality: child.querySelector('input[name="childMembers[][nationality]"]').value
        });
    });

    // Collect Home Address Data
    const address = {
        address_line1: document.querySelector('input[name="address[address-line-1]"]').value,
        address_line2: document.querySelector('input[name="address[address-line-2]"]').value,
        city: document.querySelector('input[name="address[city]"]').value,
        postcode: document.querySelector('input[name="address[postcode]"]').value,
        country: document.querySelector('input[name="address[country]"]').value
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
        alert('An error occurred: ${error.message}');
    }
});
