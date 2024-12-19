$(document).ready(function () {
    // Initialize intl-tel-input
    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "gb", // Set default country to the UK (adjust as needed)
        preferredCountries: ["gb", "us", "ng"], // Example preferred countries
        separateDialCode: true,
    });

    // Attach the submit event to the form
    $('#registrationForm').on('submit', function (e) {
        let isValid = true; // Flag to track form validity

        // Clear previous error messages
        $('.error-message').remove();

        // Validate First Name (Required & No Numbers)
        const firstName = $('#firstName').val().trim();
        if (firstName === '') {
            showError('#firstName', 'First name is required.');
            isValid = false;
        } else if (/\d/.test(firstName)) {
            showError('#firstName', 'First name should not contain numbers.');
            isValid = false;
        }

        // Validate Last Name (Required & No Numbers)
        const lastName = $('#lastName').val().trim();
        if (lastName === '') {
            showError('#lastName', 'Last name is required.');
            isValid = false;
        } else if (/\d/.test(lastName)) {
            showError('#lastName', 'Last name should not contain numbers.');
            isValid = false;
        }

        // Validate Email (Format)
        const email = $('#email').val().trim();
        if (email === '') {
            showError('#email', 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('#email', 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate Date of Birth (Required & Age Check)
        const dob = $('#dob').val();
        if (dob === '') {
            showError('#dob', 'Date of birth is required.');
            isValid = false;
        } else if (!isAdult(dob)) {
            showError('#dob', 'Member must be 18 or older. Please add to the child section.');
            isValid = false;
        }

        // Validate Phone Number (Format)
        const phoneNumber = phoneInput.value.trim();
        if (phoneNumber === '') {
            showError('#phone', 'Phone number is required.');
            isValid = false;
        } else if (!iti.isValidNumber()) {
            showError('#phone', 'Please enter a valid phone number.');
            isValid = false;
        }

        // If the form is invalid, prevent submission
        if (!isValid) {
            e.preventDefault();
        }
    });

    // Function to display an error message
    function showError(selector, message) {
        $(selector).after(`<div class="error-message" style="color: red;">${message}</div>`);
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
