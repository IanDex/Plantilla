$(".servlet").hide();
const headers = {
    "authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzb2Z0dGVrSldUIiwic3ViIjoiaWFuIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImlhdCI6MTU2MDUyNzA3NiwiZXhwIjoxNTk2NTI3MDc2fQ.pGPjhWuq6P_m1lAyCGTHiEENnf4oQ21yqamsXcFd4Xketrw8Sk1DAFclP35BzXl9mOZOmzX9_Pf6ekA7u7hTIw",
    "content-type": "application/json"
};
//const url = "https://admin-movistar-forms-pruebas-dot-modified-wonder-87620.appspot.com/";
const url = "http://localhost:4000/";

var settings2 = {
    "async": true,
    "crossDomain": true,
    "url": url + "api/admin/ca/users",
    "method": "POST",
    "headers": headers
}

var users = [];

$.ajax(settings2).done(function (response) {
    var array = response.datos;
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.user != undefined) {
            users.push(element.user);
        }
    }
   // cargarRoles();
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$(".poop").click(function (e) {
    $("#pass").val("••••••••••••••••••••");
});

$(".showPass").click(function (e) {
    if ($("#pass").attr("type") == "password") {
        $('#pass').get(0).type = 'text';
        $(this).removeClass("mdi-eye-off");
        $(this).addClass("mdi mdi-eye");
        $(".showPass").removeAttr("data-original-title");
        $(this).attr("data-original-title", "Ocultar contraseña");
        $(this).addClass("hidePass");
        $(this).removeClass("showPass");
    } else {
        $('#pass').get(0).type = 'password';
        $(this).removeClass("mdi-eye");
        $(this).addClass("mdi-eye-off");
        $(".showPass").removeAttr("data-original-title");
        $(this).attr("data-original-title", "Mostrar contraseña");
        $(this).addClass("showPass");
        $(this).removeClass("hidePass");
    }
});

$("#roles").change(function (e) {
    e.preventDefault();
    if ($(this).val() == 10) {
        $(".servlet").show();
        $("#servlet").focus();
    } else {
        $(".servlet").hide();
    }
});

$(".edit").click(function (e) {
    e.preventDefault();
    $("#email").removeAttr("readonly");
    $("#email").focus();
});

$("#usuario").blur(function (e) {
    e.preventDefault();
    cont = 0;
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if (element == $("#usuario").val()) {
            cont++;
            $(this).addClass("validar");
            $(".error").remove();
            $(this).after(`<div class="error">El usuario ` + $(this).val() + ` ya se encuentra en la base de datos</div>`);
            $(this).val("");
            $(this).focus();
            break;
        }
    }
    if (cont == 0) {
        $(this).removeClass("validar");
        $(".error").remove();
    }

});

function cargarTablas() {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": url + "api/admin/ca/tablas",
        "method": "POST",
        "headers": headers,
        beforeSend: function () {
            console.log("Sending...");
        },
        success: function (response) {
            $(".spin").removeClass("fa-spinner");
            $(".spin").removeClass("fa-spin");
            $(".spin").addClass("fa-check");
            var array = response.datos;
            var info = []
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if (element.info != undefined) {
                    info.push(element.info);
                }
            }
            $("#tbl_name").tabcomplete(info);
            $(".sb").removeClass('fadeInUp');
            $(".sb").addClass('fadeOutDown');
            $(".app").remove(".sb");
        }
    });
}

function cargarRoles() {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": url + "api/admin/ca/roles",
        "method": "POST",
        "headers": headers,
        beforeSend: function () {
            console.log("Sending Roles...");
        },
        success: function (response) {
            cargarTablas();
            var data = (response.datos);
            $.each(data, function (key, value) {
                if (parseInt(value.id) == 9) {
                    $("#roles").append('<option selected value="' + value.id + '">' + value.name + " - " + value.description + '</option>');
                } else {
                    $("#roles").append('<option value="' + value.id + '">' + value.name + " - " + value.description + '</option>');
                }
            }); // close each()
        }
    });
}

$(".btnEnviar").click(function (e) {
    e.preventDefault();
    $(".save").removeClass("mdi mdi-content-save");
    $(".save").addClass("fa fa-spinner fa-spin");
    $(".save").css("font-size", "2.25rem");
    $(".enviar").hide();
    $(this).attr("disabled", "disabled");
});
not("");

function not(msg) {
    $(".app").append('<span class="snackbar sb animated fadeInUp"><i class="fa fa-spinner fa-spin"></i></span>');
}

function notDis() {
    $(".sb").removeClass('fadeInUp');
    $(".sb").addClass('fadeOutDown');
    $(".app").remove(".sb");
}

function guardar() {
    var data = {
        //Users
        "nombre": $("#nombre").val(),
        "usuario": $("#usuario").val(),
        "correo": $("#email").val(),
        "pass": $("#pass").val(),
        "roles": $("#roles").val(),
        "tblname": $("#tbl_name").val(),
        "descripcion": $("#descripcion").val(),
        "descrol": $("#desc-gen").val(),
      };

    

      if($("#roles").val() == "10" || $("#roles").val() == 10){
        data["servlet"] = $("#servlet").val();
      }else{
        delete data.servlet;
      }

      $.ajax({
        async: true,
        crossDomain: true,
        method: "POST",
        url: url + "api/admin/ca/guardar",
        headers: headers,
        processData: false,
        data: JSON.stringify(data),
        beforeSend: function() {
            not("");
        },
        success: function(data) {
          res = JSON.stringify(data);
          response = JSON.parse(res);
          console.log(response.status);
        if (response.status) {
            notDis();
            alert("ok");
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("errores pass");
        }
      });
}