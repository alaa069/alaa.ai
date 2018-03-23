/* #####################################################################
   #
   #   Project       : Modal Login with jQuery Effects
   #   Author        : Rodrigo Amarante (rodrigockamarante)
   #   Version       : 1.0
   #   Created       : 07/29/2015
   #   Last Change   : 08/04/2015
   #
   ##################################################################### */

   $(function () {

    var $formLogin = $('#login-form');
    var $formLost = $('#lost-form');
    var $formRegister = $('#register-form');
    var $divForms = $('#div-forms');
    var $modalAnimateTime = 300;
    var $msgAnimateTime = 150;
    var $msgShowTime = 3000;

    $("form").submit(function () {
        switch (this.id) {
            case "login-form":
                var $lg_username = $('#login_username').val();
                var $lg_password = $('#login_password').val();
                /*var data = { Username: $lg_username, Password: $lg_password }
                $.ajax({
                    type: 'POST',
                    url: '/signin',
                    data: data,
                    success: function (data) {
                        var div = document.createElement('div');
                        var cont = document.getElementById("div-login-msg")
                        div.className = 'alert alert-success';
                        div.innerHTML = data.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                        cont.appendChild(div);
                        setTimeout(function(){
                            cont.removeChild(div)
                            window.location.href = '/dashboard';
                        }, 1000)
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var div = document.createElement('div');
                        var cont = document.getElementById("div-login-msg")
                        div.className = 'alert alert-danger';
                        div.innerHTML = jqXHR.responseJSON.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                        cont.appendChild(div);
                        setTimeout(function(){
                            cont.removeChild(div)
                        }, 3000)
                    }
                });*/
                return false;
                break;
            case "lost-form":
                var $ls_email = $('#lost_email').val();
                if ($ls_email == "ERROR") {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "glyphicon-remove", "Send error");
                } else {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "success", "glyphicon-ok", "Send OK");
                }
                return false;
                break;
            case "register-form":
                var $rg_firstname = $('#register_firstname').val();
                var $rg_lastname = $('#register_lastname').val();
                var $rg_username = $('#register_username').val();
                var $rg_email = $('#register_email').val();
                var $rg_password = $('#register_password').val();
                /*var data = { FullName: $rg_fullname, Username: $rg_username, Mail: $rg_email, Password: $rg_password }
                $.ajax({
                    type: 'POST',
                    url: '/signup',
                    data: data,
                    success: function (data) {
                        console.log(data)
                        var div = document.createElement('div');
                        var cont = document.getElementById("div-register-msg")
                        div.className = 'alert alert-success';
                        div.innerHTML = data.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                        cont.appendChild(div);
                        setTimeout(function(){
                            cont.removeChild(div)
                            window.location.href = '/dashboard';
                        }, 1000)
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.responseJSON)
                        var div = document.createElement('div');
                        var cont = document.getElementById("div-register-msg")
                        div.className = 'alert alert-danger';
                        div.innerHTML = jqXHR.responseJSON.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                        cont.appendChild(div);
                        setTimeout(function(){
                            cont.removeChild(div)
                        }, 3000)
                    }
                });*/
                return false;
                break;
            default:
                return false;
        }
        return false;
    });

    $('#login_register_btn').click(function () { modalAnimate($formLogin, $formRegister) });
    $('#register_login_btn').click(function () { modalAnimate($formRegister, $formLogin); });
    $('#login_lost_btn').click(function () { modalAnimate($formLogin, $formLost); });
    $('#lost_login_btn').click(function () { modalAnimate($formLost, $formLogin); });
    $('#lost_register_btn').click(function () { modalAnimate($formLost, $formRegister); });
    $('#register_lost_btn').click(function () { modalAnimate($formRegister, $formLost); });

    function modalAnimate($oldForm, $newForm) {
        var $oldH = $oldForm.height();
        var $newH = $newForm.height();
        $divForms.css("height", "auto");
        $oldForm.fadeToggle($modalAnimateTime, function () {
            $divForms.animate({ height: "auto" }, $modalAnimateTime, function () {
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    }

    function msgFade($msgId, $msgText) {
        $msgId.fadeOut($msgAnimateTime, function () {
            $(this).text($msgText).fadeIn($msgAnimateTime);
        });
    }

    function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
        var $msgOld = $divTag.text();
        msgFade($textTag, $msgText);
        $divTag.addClass($divClass);
        $iconTag.removeClass("glyphicon-chevron-right");
        $iconTag.addClass($iconClass + " " + $divClass);
        setTimeout(function () {
            msgFade($textTag, $msgOld);
            $divTag.removeClass($divClass);
            $iconTag.addClass("glyphicon-chevron-right");
            $iconTag.removeClass($iconClass + " " + $divClass);
        }, $msgShowTime);
    }

});