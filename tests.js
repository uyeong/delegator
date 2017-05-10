describe('Test of the Delegator.', function() {
    before(function() {
        window.__html__ = window.__html__ || {};
        document.body.innerHTML = window.__html__.fixture;
    });

    describe('Something Test', function() {
        it('should be ...', function() {
            assert.isNotNull(document.querySelector('.wrap'));
        });

        it('should be ...', function() {
            assert.isFunction(Delegator);
        });
    });
});
