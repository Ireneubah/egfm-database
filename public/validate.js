$(document).ready(function () {
    // Initialize intl-tel-input for all phone fields dynamically
    function initializeIntlTelInputs() {
        $('.phone').each(function () {
            if (!$(this).data('iti-initialized')) {
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

    // Attach the submit event to the form
    $('form').on('submit', function (e) {
        let isValid = true; // Flag to track form validity

        // Clear previous error messages
        $('.error-message').remove();

        // Validate all adult first names
        $('.adult-member input[name="adultMembers[][first_name]"]').each(function () {
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
        $('.adult-member input[name="adultMembers[][last_name]"]').each(function () {
            const lastName = $(this).val().trim();
            if (lastName === '') {
                showError(this, 'Last name is required.');
                isValid = false;
            } else if (/\d/.test(lastName)) {
                showError(this, 'Last name should not contain numbers.');
                isValid = false;
            }
        });

        // Validate all emails
        $('.adult-member input[name="adultMembers[][email]"]').each(function () {
            const email = $(this).val().trim();
            if (email === '') {
                showError(this, 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(this, 'Please enter a valid email address.');
                isValid = false;
            }
        });

        // Validate all dates of birth for adults
        $('.adult-member input[name="adultMembers[][dob]"]').each(function () {
            const dob = $(this).val();
            if (dob === '') {
                showError(this, 'Date of birth is required.');
                isValid = false;
            } else if (!isAdult(dob)) {
                showError(this, 'Member must be 18 or older. Please add to the child section.');
                isValid = false;
            }
        });

        // Validate all phone numbers
        $('.adult-member input[name="adultMembers[][phone]"]').each(function () {
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

        // If the form is invalid, prevent submission
        if (!isValid) {
            e.preventDefault();
        }
    });

    // Function to display an error message
    function showError(element, message) {
        $(element).after(`<div class="error-message" style="color: red;">${message}</div>`);
    }

    // Function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Function to check if DOB indicates adult (18+ years)
    function isAdult(dob) {
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
});
