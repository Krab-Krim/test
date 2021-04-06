/*MODAL*/
!function (e) {
    "function" != typeof e.matches && (e.matches = e.msMatchesSelector || e.mozMatchesSelector ||
        e.webkitMatchesSelector || function (e) {
            for (var t = this, o = (t.document || t.ownerDocument).querySelectorAll(e), n = 0; o[n] && o[n] !== t;) ++n;
            return Boolean(o[n])
        }), "function" != typeof e.closest && (e.closest = function (e) {
        for (var t = this; t && 1 === t.nodeType;) {
            if (t.matches(e)) return t;
            t = t.parentNode
        }
        return null
    })
}(window.Element.prototype);
document.addEventListener('DOMContentLoaded', function () {
    var modalButtons = document.querySelectorAll('.js-open-modal'),
        overlay = document.querySelector('.js-overlay-modal'),
        closeButtons = document.querySelectorAll('.js-modal-close');
    modalButtons.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            var modalId = this.getAttribute('data-modal'),
                modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');
            modalElem.classList.add('active');
            overlay.classList.add('active');
        });
    });
    closeButtons.forEach(function (item) {
        item.addEventListener('click', function (e) {
            var parentModal = this.closest('.modal');
            parentModal.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
    document.body.addEventListener('keyup', function (e) {
        var key = e.keyCode;
        if (key == 27) {
            document.querySelector('.modal.active').classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
        }
        ;
    }, false);
    overlay.addEventListener('click', function () {
        document.querySelector('.modal.active').classList.remove('active');
        this.classList.remove('active');
    });
});

/*PHONE*/
function setCursorPosition(pos, e) {
    e.focus();
    if (e.setSelectionRange) e.setSelectionRange(pos, pos);
    else if (e.createTextRange) {
        var range = e.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select()
    }
}

function mask(e) {
    var matrix = this.placeholder,// .defaultValue
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, "");
    def.length >= val.length && (val = def);
    matrix = matrix.replace(/[_\d]/g, function (a) {
        return val.charAt(i++) || "_"
    });
    this.value = matrix;
    i = matrix.lastIndexOf(val.substr(-1));
    i < matrix.length && matrix != this.placeholder ? i++ : i = matrix.indexOf("_");
    setCursorPosition(i, this)
}

window.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector("#online_phone");
    input.addEventListener("input", mask, false);
    input.focus();
    setCursorPosition(3, input);
});

/*SLIDER*/
'use strict';
var slideShow = (function () {
    return function (selector, config) {
        var
            _slider = document.querySelector(selector),
            _sliderContainer = _slider.querySelector('.slider__items'),
            _sliderItems = _slider.querySelectorAll('.slider__item'),
            _sliderControls = _slider.querySelectorAll('.slider__control'),
            _currentPosition = 0,
            _transformValue = 0,
            _transformStep = 100,
            _itemsArray = [],
            _timerId,
            _indicatorItems,
            _indicatorIndex = 0,
            _indicatorIndexMax = _sliderItems.length - 1,
            _stepTouch = 50,
            _config = {
                isAutoplay: false,
                directionAutoplay: 'next',
                delayAutoplay: 10000,
                isPauseOnHover: true
            };
        for (var key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }
        for (var i = 0, length = _sliderItems.length; i < length; i++) {
            _itemsArray.push({item: _sliderItems[i], position: i, transform: 0});
        }
        var position = {
            getItemIndex: function (mode) {
                var index = 0;
                for (var i = 0, length = _itemsArray.length; i < length; i++) {
                    if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') ||
                        (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
                        index = i;
                    }
                }
                return index;
            },
            getItemPosition: function (mode) {
                return _itemsArray[position.getItemIndex(mode)].position;
            }
        };
        var _move = function (direction) {
            var nextItem, currentIndicator = _indicatorIndex;
            ;
            if (direction === 'next') {
                _currentPosition++;
                if (_currentPosition > position.getItemPosition('max')) {
                    nextItem = position.getItemIndex('min');
                    _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
                    _itemsArray[nextItem].transform += _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue -= _transformStep;
                _indicatorIndex = _indicatorIndex + 1;
                if (_indicatorIndex > _indicatorIndexMax) {
                    _indicatorIndex = 0;
                }
            } else {
                _currentPosition--;
                if (_currentPosition < position.getItemPosition('min')) {
                    nextItem = position.getItemIndex('max');
                    _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
                    _itemsArray[nextItem].transform -= _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue += _transformStep;
                _indicatorIndex = _indicatorIndex - 1;
                if (_indicatorIndex < 0) {
                    _indicatorIndex = _indicatorIndexMax;
                }
            }
            _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
            _indicatorItems[currentIndicator].classList.remove('active');
            _indicatorItems[_indicatorIndex].classList.add('active');
        };
        var _moveTo = function (index) {
            var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
            while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
                _move(direction);
                i++;
            }
        };
        var _startAutoplay = function () {
            if (!_config.isAutoplay) {
                return;
            }
            _stopAutoplay();
            _timerId = setInterval(function () {
                _move(_config.directionAutoplay);
            }, _config.delayAutoplay);
        };
        var _stopAutoplay = function () {
            clearInterval(_timerId);
        };
        var _addIndicators = function () {
            var indicatorsContainer = document.createElement('ol');
            indicatorsContainer.classList.add('slider__indicators');
            for (var i = 0, length = _sliderItems.length; i < length; i++) {
                var sliderIndicatorsItem = document.createElement('li');
                if (i === 0) {
                    sliderIndicatorsItem.classList.add('active');
                }
                sliderIndicatorsItem.setAttribute("data-slide-to", i);
                indicatorsContainer.appendChild(sliderIndicatorsItem);
            }
            _slider.appendChild(indicatorsContainer);
            _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
        };
        var _isTouchDevice = function () {
            return !!('ontouchstart' in window || navigator.maxTouchPoints);
        };
        var _setUpListeners = function () {
            var _startX = 0;
            if (_isTouchDevice()) {
                _slider.addEventListener('touchstart', function (e) {
                    _startX = e.changedTouches[0].clientX;
                    _startAutoplay();
                });
                _slider.addEventListener('touchend', function (e) {
                    var
                        _endX = e.changedTouches[0].clientX,
                        _deltaX = _endX - _startX;
                    if (_deltaX > _stepTouch) {
                        _move('prev');
                    } else if (_deltaX < -_stepTouch) {
                        _move('next');
                    }
                    _startAutoplay();
                });
            } else {
                for (var i = 0, length = _sliderControls.length; i < length; i++) {
                    _sliderControls[i].classList.add('slider__control_show');
                }
            }
            _slider.addEventListener('click', function (e) {
                if (e.target.classList.contains('slider__control')) {
                    e.preventDefault();
                    _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
                    _startAutoplay();
                } else if (e.target.getAttribute('data-slide-to')) {
                    e.preventDefault();
                    _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
                    _startAutoplay();
                }
            });
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === "hidden") {
                    _stopAutoplay();
                } else {
                    _startAutoplay();
                }
            }, false);
            if (_config.isPauseOnHover && _config.isAutoplay) {
                _slider.addEventListener('mouseenter', function () {
                    _stopAutoplay();
                });
                _slider.addEventListener('mouseleave', function () {
                    _startAutoplay();
                });
            }
        };
        _addIndicators();
        _setUpListeners();
        _startAutoplay();

        return {
            next: function () {
                _move('next');
            },
            left: function () {
                _move('prev');
            },
            stop: function () {
                _config.isAutoplay = false;
                _stopAutoplay();
            },
            cycle: function () {
                _config.isAutoplay = true;
                _startAutoplay();
            }
        }
    }
}());

slideShow('.slider', {
    isAutoplay: true
});

/*CALCULATOR*/

const totalCost = document.getElementById('total-cost'),
    anInitialFre = document.getElementById('an-initial-fee'),
    creditTerm = document.getElementById('credit-term');

const totalCostRange = document.getElementById('total-cost-range'),
    anInitialFeeRange = document.getElementById('an-initial-fee-range'),
    creditTermRange = document.getElementById('credit-term-range');

const totalAmountOfCredit = document.getElementById('amount-of-credit'),
    totalMonthlyPayment = document.getElementById('monthly-payment'),
    totalRecommendedIncome = document.getElementById('recommended-income'),
    totalSum = document.getElementById('sum');

const inputsRange = document.querySelectorAll('.input-range');

const bankBtns = document.querySelectorAll('.bank');

const assignValue = () => {
    totalCost.value = totalCostRange.value;
    anInitialFre.value = anInitialFeeRange.value;
    creditTerm.value = creditTermRange.value;
}

console.log(assignValue())

assignValue();

const banks = [
    {
        name: 'alfa',
        precents: 8.7
    },
    {
        name: 'sberbank',
        precents: 8.4
    },
    {
        name: 'pochta',
        precents: 7.9
    },
    {
        name: 'tinkoff',
        precents: 9.2
    },
]

let currentPrecent = banks[0].precents;

for (let bank of bankBtns) {
    bank.addEventListener('click', () => {
        for (let item of bankBtns) {
            item.classList.remove('active');
        }
        bank.classList.add('active');
        takeActiveBank(bank);
    })
}

const takeActiveBank = currentActive => {
    const dataAttrValue = currentActive.dataset.name;
    const currentBank = banks.find(bank => bank.name === dataAttrValue);
    currentPrecent = currentBank.precents;
    calculation(totalCost.value, anInitialFre.value, creditTerm.value);
};

for (let input of inputsRange) {
    input.addEventListener('input', () => {
        assignValue();
        calculation(totalCost.value, anInitialFre.value, creditTerm.value);
    })
}

const calculation = (totalCost = 0, anInitialFre = 10, creditTerm = 1) => {
    let monthlyPayment;
    let lounAmount = totalCost - ((totalCost * anInitialFre) / 100);
    let interestRate = currentPrecent;
    let mouth = creditTerm;


    monthlyPayment = (totalCost - lounAmount) * (interestRate / (1 + interestRate) - (mouth - 1));
    const monthlyPaymentArounded = Math.round(monthlyPayment);

    let sum = lounAmount + (mouth * monthlyPayment);
    const sumSum = Math.round(sum)

    if (monthlyPaymentArounded < 0) {
        return false;
    } else {
        totalAmountOfCredit.innerHTML = `${lounAmount} ₽`;
        totalMonthlyPayment.innerHTML = `${monthlyPaymentArounded} ₽`;
        totalRecommendedIncome.innerHTML = `${monthlyPaymentArounded + ((monthlyPaymentArounded / 100) * 35)} ₽`
        totalSum.innerHTML = `${sumSum} ₽`
    }
}

//SCROLL

window.onscroll = function () {
    myFunction()
};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

//MENU
