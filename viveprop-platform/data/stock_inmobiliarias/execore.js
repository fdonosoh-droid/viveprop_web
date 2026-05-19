//Public functions

function NotionMantencion_InitDataPicker() {

    if (jQuery().datepicker) {

        $('.date-picker').datepicker({

            rtl: true,
            orientation: 'auto',
            autoclose: true,
            format: 'dd/mm/yyyy',
            language: 'es',
            todayBtn: 'linked',
            todayHighlight: true,
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true
        });
    }
}

function NotionMantencion_InternalOcultarMostraFiltro(e) {

    var data = e.params.data;

    var selected = data.selected;

    var id = data.id.toString();

    if (selected) {
        $("#ter" + id).css("display", "block");
    }
    else {
        $("#ter" + id).css("display", "none");
    }

    NotionMantencion_SetSelectFilter($("#cmbFiltros").val());
};

function NotionMantencion_InternalOcultarMostraFiltroLink(id) {

    $("#ter" + id).css("display", "none");


    var selectValuesTmp = $('#cmbFiltros').select2('val');

    var selectValues = [];

    if (selectValuesTmp !== null && selectValuesTmp !== "null") {

        selectValues = selectValuesTmp.toString().split(",");
    }
    else {

        selectValues = [];
    }

    selectValues.splice(selectValues.indexOf(id.toString()), 1);

    $('#cmbFiltros').val(null).trigger('change');

    $('#cmbFiltros').val(selectValues);

    $('#cmbFiltros').trigger('change');
};

function NotionMantencion_InitFilterSelector() {

    var deferred = $.Deferred();

    $(".select2Fil").select2({ placeholder: "Filtros disponibles", language: "es", width: '250' });

    $(".select2Fil").on('select2:select', function (e) {

        NotionMantencion_InternalOcultarMostraFiltro(e);
    });

    $(".select2Fil").on('select2:unselect', function (e) {

        NotionMantencion_InternalOcultarMostraFiltro(e);
    });

    deferred.resolve("OK");

    return deferred.promise();

}


function NotionMantencion_InitSelect2TextFil() {

    $(document).find("[data-tipo='filText']").each(function () {

        var tmpUrl = "ajxrelnew2.aspx";

        var idFiltro = String($(this).attr("data-id"));

        idFiltro = idFiltro.replace("filman", "");

        $(this).select2({
            width: '250',
            language: 'es',
            ajax: {
                url: "../../com/mantenedor/" + tmpUrl,
                dataType: "json",
                delay: 250,
                data: function (params) {

                    return NotionMantencion_Select2Param2(idFiltro, params.term);
                },
                processResults: function (data) {

                    return {
                        results: data
                    };
                },
                cache: true
            }
        });

        $(this).addClass("select2-multiple");
    });
}

function NotionMantencion_Select2FilterTextAttachEvent() {

    $(document).find("[data-tipo='filText']").each(function () {

        $(this).on('select2:select', function (e) {
            NotionMantencion_SetFilter($(this).attr("id"), $(this).select2("val"), $(this).select2("data").text);
        });

    });

    $(document).find("[data-tipo='filText']").each(function () {

        $(this).on('select2:unselect', function (e) {

            NotionMantencion_SetFilter($(this).attr("id"), $(this).select2("val"), $(this).select2("data").text);

        });
    });
};


function NotionMantencion_InitSelect2OpcionSimpleFil() {

    $(document).find("[data-tipo='filOpcionSimple']").each(function () {

        $(this).select2({
            width: '250',
            language: 'es',
        });

        $(this).addClass("select2-multiple");
    });
}

function NotionMantencion_Select2FilterOpcionSimpleAttachEvent() {

    $(document).find("[data-tipo='filOpcionSimple']").each(function () {

        $(this).on('select2:select', function (e) {
            NotionMantencion_SetFilter($(this).attr("id"), $(this).select2("val"), $(this).select2("data").text);
        });

    });

    $(document).find("[data-tipo='filOpcionSimple']").each(function () {

        $(this).on('select2:unselect', function (e) {

            NotionMantencion_SetFilter($(this).attr("id"), $(this).select2("val"), $(this).select2("data").text);

        });
    });
};


function NotionMantencion_InitSelect2Rel() {

    $(document).find("[data-tipo='filRel']").each(function () {

        var Campo = $(this).attr("name");

        var Sel = $("#man" + Campo).val();

        var tmpPre = Notion_Componentes_Mantenedor_ValorDiccionario(Campo);
        var tmpCon = "";
        var tmpCas;
        var tmpUrl = "ajxrelnew.aspx";
        if (tmpPre.filtro != "") {
            tmpCon = NotionTextParse_ParseRealSft(tmpPre.filtro);
            eval("tmpCon = '" + eval(tmpCon) + "';");
        }
        var tmpMan = document.getElementById("man").value;
        tmpCas = "" + tmpPre.cascada;

        $(this).select2({
            width: '250',
            language: 'es',
            ajax: {
                url: "../../com/mantenedor/" + tmpUrl,
                dataType: "json",
                delay: 250,
                data: function (params) {

                    return NotionMantencion_Select2Param(tmpMan, Campo, params.term, tmpCon, Sel, NotionMantenedor_Aleatorio(), tmpPre.cascada);
                },
                processResults: function (data) {

                    return {
                        results: data
                    };
                },
                cache: true
            }
        });

        $(this).addClass("select2-multiple");
    });
}

function NotionMantencion_Select2FilterRelAttachEvent() {

    $(document).find("[data-tipo='filRel']").each(function () {

        $(this).on('select2:select', function (e) {
            NotionMantencion_SetFilter($(this).attr("id"), $(this).select2("val"), $(this).select2("data").text);
        });

    });

    $(document).find("[data-tipo='filRel']").each(function () {

        $(this).on('select2:unselect', function (e) {

            NotionMantencion_SetFilter($(this).attr("id"), $(this).select2("val"), $(this).select2("data").text);

        });
    });
};

/***********************************************/

//Private functions

function NotionMantencion_Select2Param(man, cam, fil, con, sel, rnd, idParent) {

    return {
        man: man,
        cas: $("#man" + idParent).val(),
        cam: cam,
        fil: fil,
        con: con,
        sel: sel,
        rnd: rnd,
        rJson: 1
    };

}

function NotionMantencion_Select2Param2(idFiltro, fil) {

    return {
        idFiltro: idFiltro,
        fil: fil
    };

}

function NotionMantencion_SetFilterValue() {

    if ($("#filSelected").val() !== null && $("#filSelected").val() !== undefined && $("#filSelected").val().trim().length>0) {

        var valueArray = $("#filSelected").val().split(",");

        $("#cmbFiltros").val(valueArray);
        $("#cmbFiltros").trigger('change');
    }

    $(document).find("[data-tipo='filTextVal']").each(function () {

        var idSelect = $(this).attr("id").replace("filman", "");
        var valueArray = $(this).val().split(",")

        $(valueArray).each(function (index, item) {

            if (item.trim().length > 0) {

                var data = {

                    id: item,
                    text: item
                };

                if (!$("#" + idSelect).find("option[value='" + data.id + "']").length) {
                    var newOption = new Option(data.text, data.id, false, true);
                    $("#" + idSelect).append(newOption).trigger("change");
                }
            }
        })
    });

    $(document).find("[data-tipo='filOpcionSimpleVal']").each(function () {

        var idSelect = $(this).attr("id").replace("filman", "");
        var valueArray = $(this).val().split(",")

        $("#" + idSelect).val(valueArray);
        $("#" + idSelect).trigger('change');
    });

    if ($("#filSelect2Data").val() !== null && $("#filSelect2Data").val() !== undefined && $("#filSelect2Data").val().trim().length > 0) {

        var $Data = JSON.parse(window.atob($("#filSelect2Data").val()));

        $($Data).each(function (index, item) {

            $(document).find("[data-tipo='filRel']").each(function () {

                var idFiltros = $(this).data("id");
                if (idFiltros === item.idFiltro) {

                    if (item.idFiltro.trim().length > 0) {

                        var data = {

                            id: item.valor,
                            text: item.texto
                        };

                        if (!$(this).find("option[value='" + data.id + "']").length) {
                            var newOption = new Option(data.text, data.id, false, true);
                            $(this).append(newOption).trigger("change");
                        }
                    }
                }
            });
        });
    }
}

function NotionMantencion_SetFilter(idFiltro, valor, texto) {

    $("#filman" + idFiltro).val(valor);

    var filSelect2DataArray = [];

    $("[data-tipo='filRel']").each(function () {

        var idFiltro = $(this).data("id");

        var data = $(this).select2("data");

        $.each(data, function (index, item) {

            var filSelect2DataItem = {
                valor: item.id,
                texto: item.text,
                idFiltro: idFiltro
            }

            filSelect2DataArray.push(filSelect2DataItem);
        });
    });

    $("#filSelect2Data").val(window.btoa(JSON.stringify(filSelect2DataArray)));


}

function NotionMantencion_SetSelectFilter(valor) {

    if (valor !== undefined && valor !== null) {

        $("#filSelected").val(valor);
    }
    else {

        $("#filSelected").val("");
    }

}

/***********************************************/
//Load Event
$(document).ready(function () {

    NotionMantencion_InitDataPicker();

    NotionMantencion_InitFilterSelector();


    NotionMantencion_InitSelect2TextFil();
    NotionMantencion_Select2FilterTextAttachEvent();

    NotionMantencion_InitSelect2OpcionSimpleFil();
    NotionMantencion_Select2FilterOpcionSimpleAttachEvent();


    NotionMantencion_InitSelect2Rel();
    NotionMantencion_Select2FilterRelAttachEvent();

    NotionMantencion_SetFilterValue();

});

/***********************************************/