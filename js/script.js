var Validator = function(formSelector) {
    var formElement = document.querySelector(formSelector);


    var getParent = function(cur, selector) {
        while(cur.parentElement){
            if(cur.parentElement.matches(selector))
            return cur.parentElement;
            else cur = cur.parentElement;
        }

    }

    var formRules = {};
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'xin mời nhập dữ liệu';
        },
        email: function (value) {
            var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(value) ? undefined : 'xin mời nhập lại email';
        },
        min: function (value, min) {
            return value.length >= min ? undefined : `vui lòng nhập ${min} kí tự`;
        },
        confirmed: function (value, checkValue) {
            return value === checkValue ? undefined : 'vui lòng nhập lại password';
        }

    };

    if(formElement) {
        var checkValue;
        var inputs = formElement.querySelectorAll('[name][rules]');
        // console.log(inputs)
        inputs.forEach((input) => {
            var rulesAttribute = input.getAttribute('rules');
            var rules = rulesAttribute.split('|');
            for(var rule of rules) {
                rule.includes(':') ? rule = rule.split(':')[0] : '';

                // lưu lại password
                if(input.name === 'password' && rulesAttribute.includes(':')) {
                    checkValue = input.value;
                }

                if(Array.isArray(formRules[input.name])) 
                    formRules[input.name].push(validatorRules[rule]);
                else formRules[input.name] = [validatorRules[rule]];
            }
           

        // handle event

            input.onblur = handleValidate;
            input.oninput = handleInputAgain;
                
        })
      

    }
    // hàm thực thi sự kiện khi blur
    function handleValidate(e) {
            // console.log(e.target.value);

        var rules = formRules[e.target.name];
        var errorMessage;

        rules.find(function (rule) {

            var lengthValue = e.target.getAttribute('rules');
          

            errorMessage = rule(e.target.value);
            

            
            // nếu rule là password để kiểm tra độ dài tối thiểu
            if(e.target.name === 'password' && lengthValue.includes(':')){
                lengthValue.split(':');
                errorMessage = rule(e.target.value, lengthValue.split(':')[1]);
                checkValue = e.target.value;
            }
            //kiểm tra password lại
            else if(e.target.name === 'password_confirmation') {
                errorMessage = rule(e.target.value, checkValue);

            }
            // console.log() ;
            return errorMessage;

            
        })

        if(errorMessage) {
            var formGroup = getParent(e.target, '.form-group');

            var message = formGroup.querySelector('.form-message');

            formGroup.classList.add('invalid');
            message.innerHTML = errorMessage;
        }


       
        
    }
    // hàm thực thi sự kiện khi input
    function handleInputAgain(e) {
        var formGroup = getParent(e.target, '.form-group');
        var message = formGroup.querySelector('.form-message');

        if(formGroup.classList.contains('invalid'))
            formGroup.classList.remove('invalid');

        message.innerText = '';



    }

    
}