// checkout.js
class CheckoutForm {
    constructor() {
        this.form = document.getElementById('checkout-form');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Real-time validation
        const fields = ['name', 'email', 'phone', 'address', 'zip', 'city', 'country'];
        fields.forEach(field => {
            document.getElementById(field).addEventListener('blur', this.validateField.bind(this));
        });
    }

    validateField(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}-error`);

        if (field.value.trim() === '') {
            errorElement.textContent = `Please enter your ${field.placeholder.toLowerCase()}`;
            field.classList.add('error');
            return false;
        }

        // Special validation for email
        if (field.id === 'email' && !this.isValidEmail(field.value)) {
            errorElement.textContent = 'Please enter a valid email';
            field.classList.add('error');
            return false;
        }

        // Clear errors if valid
        errorElement.textContent = '';
        field.classList.remove('error');
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    handleSubmit(e) {
        e.preventDefault();
        let isValid = true;

        // Validate all fields
        const fields = ['name', 'email', 'phone', 'address', 'zip', 'city', 'country'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });

        if (isValid) {
            this.processOrder();
        }
    }

    processOrder() {
        // Show confirmation modal
        const confirmation = new OrderConfirmation(cart.calculateTotals());
        confirmation.show();

        // Clear cart after successful order
        cart.clearCart();
    }
  }