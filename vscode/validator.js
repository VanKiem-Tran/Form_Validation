function Validator(options) {
  var selectorRules = {}  
    function validate(inputElement, rule) {
        var errorMessage
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]
        // Lặp qua từng rule & check 
           for (var i=0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break
           }
            if (errorMessage) {
                errorElement.innerText = errorMessage
                inputElement.parentElement.classList.add('invalid')
            } else {
                errorElement.innerText = ''
                inputElement.parentElement.classList.remove('invalid')
                    }    
                    return !errorMessage  
    }
var formElement = document.querySelector(options.form)
    if (formElement) {
        formElement.onsubmit = function(e) {
        var isFormValid = true
        e.preventDefault()
            // Thực hiện lặp qua từng rule và validate
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector)
            var isValid = validate(inputElement,rule)
            if (!isValid) {
                    isFormValid = false
                }
            })
        if (isFormValid) {
            if (typeof options.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]')
                var formValues = Array.from(enableInputs).reduce(function(values,input) {
                     values[input.name] = input.value
                        return values
                },{}) 
            console.log(formValues)
                options.onSubmit({

                })
            }
        }
        }
        // Lặp qua mỗi rule và xử lí
        options.rules.forEach(function(rule) {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
           var inputElement = formElement.querySelector(rule.selector)
           if (inputElement) {
               //    Xử lí trường hợp blur ra khỏi input
               inputElement.onblur = function() {
                  validate(inputElement,rule)
               }
               //   Xử lí trường hợp nhập vào input
               inputElement.oninput = function() {
                var errorElement = inputElement.parentElement.querySelector('.form-message')
                errorElement.innerText = ''
                inputElement.parentElement.classList.remove('invalid')
               }
               
           }
        }) 
        
    }
}
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Trường này phải là email'
        }
    }
}
Validator.minLength = function(selector,min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}