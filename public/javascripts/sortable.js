const tbody = document.querySelector('tbody');
const sortable = Sortable.create(tbody, {
    handle: '.handle',
    dataIdAttr: 'data-id',
    // direction: 'vertical',
    swapThreshold: 0.5,
    onSort: () => {
        document.querySelector('.container').classList.add('save');
    },

    store: {
        set: function (sortable) {
            var order = sortable.toArray();
            tbody.setAttribute('sort', order);
        }
    }
});