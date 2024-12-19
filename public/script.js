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

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
    "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
    "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
    "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
    "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
    "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

function populateNationalityDropdowns() {
    const nationalitySelects = document.querySelectorAll('.nationality-select');
    nationalitySelects.forEach(select => {
        // Clear any existing options except the placeholder
        select.innerHTML = '<option value="">Select Nationality</option>';
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            select.appendChild(option);
        });
    });
}

// Call the function to populate the dropdowns on page load
populateNationalityDropdowns();

// Re-populate nationality dropdowns when new sections are added dynamically
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('add-button')) {
        setTimeout(populateNationalityDropdowns, 0);
    }
});


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
            nationality: adult.querySelector('select[name="adultMembers[][nationality]"]').value
        });
    });

    // Collect Child Member Data
    const children = [];
    document.querySelectorAll('.child-member').forEach(child => {
        children.push({
            first_name: child.querySelector('input[name="childMembers[][first_name]"]').value,
            last_name: child.querySelector('input[name="childMembers[][last_name]"]').value,
            dob: child.querySelector('input[name="childMembers[][dob]"]').value,
            nationality: child.querySelector('select[name="childMembers[][nationality]"]').value
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
