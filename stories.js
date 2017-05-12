let original;
let button;
let input;
let delegator;

describe('Stories of the delegator.', function() {
    before(() => {
        window.__html__ = window.__html__ || {};
        document.body.innerHTML = window.__html__.fixture;

        original = document.querySelector('.wrap');
        button = original.querySelector('.action-btn');
        input = original.querySelector('.action-input');
        delegator = createDelegator(original);
    });

    afterEach(() => {
        delegator.clear();
    });

    describe('특정 엘리먼트를 타겟으로 이벤트를 위임할 수 있다.', () => {
        it('.on()를 통해 이벤트를 위임할 수 있다.', function() {
            // Given
            const spyClickEvent = sinon.spy();
            const spyTouchEvent = sinon.spy();

            // When
            delegator.on('click', '.action-btn', spyClickEvent);
            delegator.on('keyup', '.action-input', spyTouchEvent);

            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
            input.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true}));

            // Then
            assert.equal(spyClickEvent.callCount, 1);
            assert.equal(spyTouchEvent.callCount, 1);
        });

        it('위임 이벤트 리스너의 인자를 통해 오리지널 엘리먼트를 알 수 있다.', () => {
            // Given
            const spy = sinon.spy();

            // When
            delegator.on('click', '.action-btn', spy);

            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));

            // Then
            assert.equal(spy.callCount, 1);
            assert.equal(spy.args[0][0].target, button);
            assert.equal(spy.args[0][0].delegateTarget, original);
        });

        it('캡쳐링 단계에서 이벤트를 위임할 수 있다.', () => {
            // Given
            const spyClickEvent1 = sinon.spy();
            const spyClickEvent2 = sinon.spy((e) => e.stopPropagation());
            const capturing = createDelegator(original, {capture: true});

            // When
            delegator.on('click', '.action-btn', spyClickEvent1);
            capturing.on('click', '.action-btn', spyClickEvent2);

            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));

            // Then
            assert.equal(spyClickEvent1.callCount, 0);
            assert.equal(spyClickEvent2.callCount, 1);

            capturing.clear();
        });
    });

    describe('특정 엘리먼트를 타겟으로한 이벤트 위임을 해제할 수 있다.', () => {
        it('.off()를 통해 이벤트 위임을 해제할 수 있다.', () => {
            // Given
            const spy1 = sinon.spy();
            const spy2 = sinon.spy();

            delegator.on('click', '.action-btn', spy1);
            delegator.on('click', '.action-btn', spy2);

            // When
            delegator.off('click', '.action-btn', spy1);

            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));

            // Then
            assert.equal(spy1.callCount, 0);
            assert.equal(spy2.callCount, 1);
        });

        it('clear()를 통해 이벤트 위임을 일괄 해제할 수 있다.', () => {
            // Given
            const spy1 = sinon.spy();
            const spy2 = sinon.spy();

            delegator.on('click', '.action-btn', spy1);
            delegator.on('click', '.action-btn', spy2);

            // When
            delegator.clear();

            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));

            // Then
            assert.equal(spy1.callCount, 0);
            assert.equal(spy2.callCount, 0);
        });
    });
});
