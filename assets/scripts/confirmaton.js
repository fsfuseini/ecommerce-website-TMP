// confirmation.js
class OrderConfirmation {
    constructor(totals) {
        this.totals = totals;
        this.modal = document.createElement('div');
        this.modal.className = 'confirmation-modal';

        this.modal.innerHTML = `
        <div class="confirmation-content">
          <div class="confirmation-header">
            <h2>Thank you for your order</h2>
            <p>You will receive an email confirmation shortly.</p>
          </div>
          
          <div class="order-summary">
            <div class="items-list">
              <!-- First item -->
              <div class="item">
                <div class="item-info">
                  <img src="" alt="">
                  <div>
                    <h4>Product Name</h4>
                    <p>$ Price</p>
                  </div>
                </div>
                <div class="quantity">x1</div>
              </div>
              
              <!-- Other items count -->
              <div class="other-items" v-if="cart.items.length > 1">
                and ${cart.items.length - 1} other item(s)
              </div>
            </div>
            
            <div class="grand-total">
              <div class="total-row">
                <span>Grand Total</span>
                <span>$ ${totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <button class="btn-primary" onclick="window.location.href='/'">
            Back to Home
          </button>
        </div>
      `;
    }

    show() {
        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';
    }

    hide() {
        document.body.removeChild(this.modal);
        document.body.style.overflow = '';
    }
  }