document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Stop page reload

        // Grab the user's name
        const name = document.getElementById("name").value;

        // Show popup
        alert("✅ Thank you, " + name + "! Your message has been submitted.");

        // Clear form fields
        form.reset();
    });
});