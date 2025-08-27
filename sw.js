$(document).ready(function() {
    let itemCounter = 0;

    function formatCurrency(amount) {
        return 'Rp ' + parseFloat(amount).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculateTotal() {
        let subtotal = 0;
        $('.item-row').each(function() {
            const price = parseFloat($(this).find('.item-price').val()) || 0;
            const qty = parseInt($(this).find('.item-qty').val()) || 0;
            subtotal += price * qty;
        });

        const taxRate = parseFloat($('#tax-rate').val()) || 0;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        $('#subtotal').text(formatCurrency(subtotal));
        $('#tax-rate-display').text(taxRate);
        $('#tax-amount').text(formatCurrency(taxAmount));
        $('#total-amount').text(formatCurrency(total));
    }

    function addItemRow() {
        itemCounter++;
        const newItemRow = `
            <div class="form-row item-row mb-2">
                <div class="col">
                    <input type="text" class="form-control item-name" placeholder="Nama Item" required>
                </div>
                <div class="col">
                    <input type="number" class="form-control item-price" placeholder="Harga" min="0" required>
                </div>
                <div class="col">
                    <input type="number" class="form-control item-qty" placeholder="Jumlah" min="1" required>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-danger remove-item">Hapus</button>
                </div>
            </div>
        `;
        $('#item-list').append(newItemRow);
    }

    $('#add-item').on('click', addItemRow);

    $('#item-list').on('click', '.remove-item', function() {
        $(this).closest('.item-row').remove();
        calculateTotal();
    });
    
    $(document).on('input', '.item-price, .item-qty, #tax-rate', calculateTotal);

    addItemRow(); // Add one item row initially

    $('#invoice-form').on('submit', function(e) {
        e.preventDefault();

        // Populate customer info
        const customerName = $('#customer-name').val();
        const customerEmail = $('#customer-email').val();
        const customerAddr = $('#customer-addr').val().replace(/\n/g, '<br>');
        
        let customerAddressHtml = `<strong>${customerName}</strong><br>`;
        if (customerEmail) customerAddressHtml += `${customerEmail}<br>`;
        if (customerAddr) customerAddressHtml += `${customerAddr}`;
        $('#customer-address').html(customerAddressHtml);

        // Populate invoice date and number
        $('#invoice-date').text(new Date().toLocaleDateString('id-ID'));
        $('#invoice-number').text('INV-' + Date.now());

        // Clear and populate invoice table
        $('#invoice-table tbody').empty();
        $('.item-row').each(function() {
            const name = $(this).find('.item-name').val();
            const price = parseFloat($(this).find('.item-price').val()) || 0;
            const qty = parseInt($(this).find('.item-qty').val()) || 0;
            const total = price * qty;

            const row = `
                <tr>
                    <td>${name}</td>
                    <td class="text-center">${formatCurrency(price)}</td>
                    <td class="text-center">${qty}</td>
                    <td class="text-right">${formatCurrency(total)}</td>
                </tr>
            `;
            $('#invoice-table tbody').append(row);
        });
        
        calculateTotal();

        // Show invoice and print button, hide form
        $('#invoice-container').show();
        $('#print-invoice').show();
        $('#controls').hide();
    });

    $('#print-invoice').on('click', function() {
        window.print();
    });
});