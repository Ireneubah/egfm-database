$(document).ready(function () {
    // Function to add a new adult section to the form
    window.addAdultSection = function(sectionId, templateId) {
        const section = document.getElementById(sectionId);
        const template = document.getElementById(templateId).content.cloneNode(true);
        section.insertBefore(template, document.getElementById('add-adult-btn'));
        initializeIntlTelInputs(); // Re-initialize for new phone fields
        populateNationalityDropdowns(); // Re-populate for new nationality fields
    }

    // Function to add a new child section to the form
    window.addChildSection = function(sectionId, templateId) {
        const section = document.getElementById(sectionId);
        const template = document.getElementById(templateId).content.cloneNode(true);
        section.insertBefore(template, document.getElementById('add-child-btn'));
        populateNationalityDropdowns(); // Re-populate for new nationality fields
    }

    // Function to remove a dynamically added section from the form
    window.removeSection = function(button) {
        const section = button.parentElement;
        section.parentElement.removeChild(section);
    }

    // Array of countries for the nationality dropdown
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

    // Function to populate nationality dropdowns
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
    $(document).on('click', '.add-button', function () {
        populateNationalityDropdowns();
    });

    // Initialize intl-tel-input for all phone fields dynamically
    function initializeIntlTelInputs() {
        $('.phone').each(function () {
            if (!$(this).data('iti-initialized')){ 
                window.intlTelInput(this, {
                    initialCountry: "gb", // Default to the UK
                    preferredCountries: ["gb", "us", "ng","zm","ca","pl","ke"],
                    separateDialCode: true,
                    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
                });
                $(this).data('iti-initialized', true);
            }
        });
    }

    // Call the initialization on page load
    initializeIntlTelInputs();

    // Re-initialize intl-tel-input when new sections are added dynamically
    $(document).on('click', '.add-button', function () {
        setTimeout(initializeIntlTelInputs, 0);
    });

    // Function to display an error message
    function showError(element, message) {
        $(element).next('.error-message').remove();
        $(element).after(`<div class="error-message" style="color: red;">${message}</div>`);
    }

    // Function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // Function to check if a date is valid
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    // Function to check if DOB indicates adult (18+ years)
    function isAdult(dob) {
        if (!isValidDate(dob)) return false;
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthdate hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    }

    // Attach the submit event to the form using event delegation
    $(document).on('submit', 'form', function (e) {
        let isValid = true; // Flag to track form validity

        // Clear previous error messages
        $('.error-message').remove();

        // Validate all adult first names
        $('.adult-member input[name="adultMembers[].first_name"]').each(function () {
            const firstName = $(this).val().trim();
            if (firstName === '') {
                showError(this, 'First name is required.');
                isValid = false;
            } else if (/\d/.test(firstName)) {
                showError(this, 'First name should not contain numbers.');
                isValid = false;
            }
        });

        // Validate all adult last names
        $('.adult-member input[name="adultMembers[].last_name"]').each(function () {
            const lastName = $(this).val().trim();
            if (lastName === '') {
                showError(this, 'Last name is required.');
                isValid = false;
            } else if (/\d/.test(lastName)) {
                showError(this, 'Last name should not contain numbers.');
                isValid = false;
            }
        });

        // Validate all adult emails
        $('.adult-member input[name="adultMembers[].email"]').each(function () {
            const email = $(this).val().trim();
            if (email === '') {
                showError(this, 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(this, 'Please enter a valid email address.');
                isValid = false;
            }
        });

        // Validate all adult dates of birth
        $('.adult-member input[name="adultMembers[].dob"]').each(function () {
            const dob = $(this).val();
            if (dob === '') {
                showError(this, 'Date of birth is required.');
                isValid = false;
            } else if (!isAdult(dob)) {
                showError(this, 'Member must be 18 or older. Please add to the child section.');
                isValid = false;
            }
        });

        // Validate all adult phone numbers
        $('.adult-member input[name="adultMembers[].phone"]').each(function () {
            const phoneInput = this;
            const iti = window.intlTelInputGlobals.getInstance(phoneInput);

            if (phoneInput.value.trim() === '') {
                showError(phoneInput, 'Phone number is required.');
                isValid = false;
            } else if (!iti.isValidNumber()) {
                showError(phoneInput, 'Please enter a valid phone number.');
                isValid = false;
            }
        });

        // Validate all child first names
        $('.child-member input[name="childMembers[].first_name"]').each(function () {
            const firstName = $(this).val().trim();
            if (firstName === '') {
                showError(this, 'First name is required.');
                isValid = false;
            } else if (/\d/.test(firstName)) {
                showError(this, 'First name should not contain numbers.');
                isValid = false;
            }
        });

        // Validate all child last names
        $('.child-member input[name="childMembers[].last_name"]').each(function () {
            const lastName = $(this).val().trim();
            if (lastName === '') {
                showError(this, 'Last name is required.');
                isValid = false;
            } else if (/\d/.test(lastName)) {
                showError(this, 'Last name should not contain numbers.');
                isValid = false;
            }
        });

        // Validate all child dates of birth
        $('.child-member input[name="childMembers[].dob"]').each(function () {
            const dob = $(this).val();
            if (dob === '') {
                showError(this, 'Date of birth is required.');
                isValid = false;
            }
            // You might want to add an age restriction for children here
        });

        // Validate address fields
        if ($('input[name="address[address-line-1]"]').val().trim() === '') {
            showError($('input[name="address[address-line-1]"]')[0], 'Address line 1 is required.');
            isValid = false;
        }
        if ($('input[name="address[address-line-2]"]').val().trim() === '') {
            showError($('input[name="address[address-line-2]"]')[0], 'Address line 2 is required.');
            isValid = false;
        }
        if ($('input[name="address[city]"]').val().trim() === '') {
            showError($('input[name="address[city]"]')[0], 'City is required.');
            isValid = false;
        }
        if ($('input[name="address[country]"]').val().trim() === '') {
            showError($('input[name="address[country]"]')[0], 'Country is required.');
            isValid = false;
        }
        // You might want to add postcode validation based on the country

        // If the form is invalid, prevent submission
        if (!isValid) {
            e.preventDefault();
            return false;
        }

        // If the form is valid, proceed with data collection and submission
        // Collect Adult Member Data
        const adults = [];
        document.querySelectorAll('.adult-member').forEach(adult => {
            // Get the intlTelInput instance for the phone field
            const phoneInput = adult.querySelector('input[name="adultMembers[].phone"]');
            const iti = window.intlTelInputGlobals.getInstance(phoneInput);
            const fullNumber = iti.getNumber(); // Get the full international number
            adults.push({
                first_name: adult.querySelector('input[name="adultMembers[].first_name"]').value,
                last_name: adult.querySelector('input[name="adultMembers[].last_name"]').value,
                marital_status: adult.querySelector('select[name="adultMembers[].marital_status"]').value,
                email: adult.querySelector('input[name="adultMembers[].email"]').value,
                phone: fullNumber,
                dob: adult.querySelector('input[name="adultMembers[].dob"]').value,
                nationality: adult.querySelector('select[name="adultMembers[].nationality"]').value
            });
        });

        // Collect Child Member Data
        const children = [];
        document.querySelectorAll('.child-member').forEach(child => {
            children.push({
                first_name: child.querySelector('input[name="childMembers[].first_name"]').value,
                last_name: child.querySelector('input[name="childMembers[].last_name"]').value,
                dob: child.querySelector('input[name="childMembers[].dob"]').value,
                nationality: child.querySelector('select[name="childMembers[].nationality"]').value
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

        // Create the Data Object
        const data = {
            adultMembers: adults,
            childMembers: children,
            address: address
        };

        // Send Data to the Server using AJAX (no changes needed here)
        $.ajax({
            url: '/submit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                if (response.success) {
                    // Redirect to the success page
                    window.location.href = response.redirectUrl;
                } else {
                    alert('Submission failed: ' + response.message);
                }
            },
            error: function(error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while submitting the form.');
            }
        });
    });
});