
var NotionMantencion_PaginadorCantidad = 0;
var NotionMantencion_PaginadorActual = 1;
var NotionMantencion_PaginadorRegistros;
var NotionMantencion_PaginadorRegistrosPPP;
var NotionMantencion_PaginadorPaginas = 0
var NotionMantenedor_CampoContenedor = 0;

var NotionMantenedor_RelacionObjeto;
var NotionMantenedor_RelacionCampo;
var NotionMantenedor_RelacionFuncion;
var NotionMantenedor_ValidaRut_Formato = "";
var NotionMantenedor_ValidaFramesSaved = new Array();
var NotionMantenedor_LightCache;
var NotionMantenedor_TabCache;
var NotionMantenedor_BotonFiltro = null;

var NotionMantenedor_SelMemory = ",";

var NotionMantenedor_AutoSize = true;

var NotionStyle_BarButton_Sel;
var NotionStyle_BarButton_Uns;

var NotionMantencion_ContenedoresAvz_Count;

var NotionMantencion_LastToolGrp = 0;

var NotionManenedor_ObjMan;
var NotionManenedor_ObjRea;
var NotionManenedor_ObjTxt;

var NotionManenedor_ObjPad;
var NotionManenedor_ObjLst;

var tmpInicioRecuadacionMasiva = false;

//Cache
if (document.images) {
    NotionMantenedor_LightCache = new Image(2, 2);
    NotionMantenedor_LightCache.src = "../../cmm/img/tra.gif";
    NotionStyle_BarButton_Sel = new Image();
    NotionStyle_BarButton_Sel.src = "../../cmm/img/bgbotselect.gif";
    NotionStyle_BarButton_Uns = new Image();
    NotionStyle_BarButton_Uns.src = "../../cmm/img/bg.gif";
    NotionMantenedor_TabCache = new Image();
    NotionMantenedor_TabCache.src = "../../cmm/img/indicator.gif";
}

//Funcion que setea campo "Monto Asegurado en UF" Ingevec 08-03-2018 DG
function sci30_ValorAseguradoPoliza() {
    var monto = document.getElementById("man" + IdCampo("Monto Asegurado en UF"));
    var IdNegocio = window.parent.document.getElementById("man" + IdCampo("Negocio"));

    if (typeof monto !== 'undefined' && typeof IdNegocio !== 'undefined' && IdNegocio !== null) {
        if (monto.value == "" || monto.value == "0,00") {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.status === 200) {
                    monto.value = this.responseText;
                }
                else {
                    console.log('Error: ' + this.status);
                }
            };
            xhr.open('GET', "../../sln/sci30/FuncionesAjax.aspx?opcion=CargarPoliza&idx=" + IdNegocio.value + "&rnd=" + NotionMantenedor_Aleatorio());
            xhr.send();
        }
    }
}

function GetParametro(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

//Mantenedor
function vldchg(obj) {
    var tmpItm = Notion_Componentes_Mantenedor_ValorDiccionario(obj.name.substring(3, 255));
    var tmpObj = document.getElementById("err" + tmpItm.id);
    if (tmpObj) {
        if (document.getElementById("man" + tmpItm.id).value == "   ") {
            tmpObj.className = "item_validacioncambio";
            tmpObj.innerText = "* El valor será borrado";
        } else {
            tmpObj.innerText = "";
        }
    }
}
function NotionMantencion_Ordenar(campo) {
    if (document.getElementById("ord").value == campo) {
        if (document.getElementById("dir").value == "0") {
            document.getElementById("dir").value = "1";
        }
        else {
            document.getElementById("dir").value = "0";
        }
    }
    else {
        document.getElementById("dir").value = "0"
    }
    document.getElementById("pag").value = "0";
    document.getElementById("ord").value = campo;
    NotionMantencion_Accion("ord");
}
function NotionMantencion_Edit(index) {
    document.getElementById("ind").value = index;
    NotionMantencion_Accion("edt");
}
function NotionMantencion_View(index) {
    document.getElementById("ind").value = index;
    NotionMantencion_Accion("viw");
}
function NotionMantencion_Layer(visible) {
    var tmpNom = "NotionMantencion_Layer_Layer";
    var tmpTra = 50;
    var tmpObj;
    var tmpPro;
    if (visible) {


        tmpObj = document.createElement("div");
        tmpObj.setAttribute("id", tmpNom);
        tmpObj.style.position = "absolute";
        tmpObj.style.left = 0;
        tmpObj.style.top = 0;
        tmpObj.className = "transparencia";
        tmpObj.style.width = document.documentElement.clientWidth;
        tmpPro = document.createElement("div");
        tmpPro.innerText = "Por favor espere...";
        tmpPro.className = "transparencia_pro";
        tmpObj.appendChild(tmpPro);
        document.body.appendChild(tmpObj);
        document.getElementById("NotionMantencion_Layer_Layer").style.width = document.documentElement.clientWidth + 'px';
        tmpObj.style.height = getDocHeight() + 'px';
    }
    else {
        tmpObj = document.getElementById(tmpNom);
        if (tmpObj) {
            tmpObj.style.display = "none";
            document.body.removeChild(tmpObj);
        }
    }
}
function NotionMantencion_Delete() {
    var tmpInt = NotionTable_CheckUnitario();
    var tmpRes = 0;
    var tmpObj = new Array();
    var tmpTbl = document.getElementById("tabla").tBodies[0];
    var tmpDel = document.getElementById("del");
    var tmpCat = "";
    if (tmpInt == 0) {
        alert("Seleccione los items que desea eliminar");
    } else if (tmpInt == NotionMantencion_PaginadorRegistrosPPP) {
        if (confirm("Estas pronto a eliminar registros de la página, ¿Seguro deseas continuar?")) {
            if (confirm("Ha seleccionado todos los registros de la página\n¿Desea eliminar todo?\n\nSi, todos los registros\nNo, sólo página actual")) {
                tmpRes = 2;
            } else {
                tmpRes = 1;
            }
        } else {
            tmpRes = 0;
        }
    } else {
        if (tmpInt == 1) {
            if (confirm("Se dispone a eliminar un item\n\n¿Desea continuar?")) {
                tmpRes = 1;
            } else {
                tmpRes = 0;
            }
        } else {
            if (confirm("Se dispone a eliminar " + tmpInt + " items\n\n¿Desea continuar?")) {
                tmpRes = 1;
            } else {
                tmpRes = 0;
            }
        }
    }
    try {
        tmpCat = NotionMiniMantenedor_NDelItem_Catch;
    } catch (pri) {
        tmpCat = "";
    }
    if (tmpCat != "") {
        eval("tmpRes = " + tmpCat.replace("%", tmpRes) + "; ");
    }
    if (tmpRes != 0) {
        document.getElementById("toi").value = tmpRes;
        document.getElementById("acc").value = "del";
        document.forms[0].submit();
    }
}
function NotionTable_CheckUnitario() {
    var tmpCnt = 0;
    NotionMantencion_FinishPageMemory();
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].name != "chk") {
            if (document.forms[0].elements[i].type == "checkbox") {
                if (document.forms[0].elements[i].checked) {
                    tmpCnt++;
                }
            }
        }
    }
    return tmpCnt;
}
function LlamarAyuda() {
    var tmpDir = window.location.href;
    tmpDir = tmpDir.substring(0, tmpDir.lastIndexOf("/"));
    tmpDir = tmpDir.substring(0, tmpDir.lastIndexOf("/"));
    tmpDir = tmpDir.substring(0, tmpDir.lastIndexOf("/"));
    tmpDir = window.location.href.substring(tmpDir.length + 1, 1024);
    while (tmpDir.indexOf("/") != -1) tmpDir = tmpDir.replace("/", "_");
    tmpDir = tmpDir.replace(".aspx", "");
    window.location = "../../sys/hlp/exe.aspx?" + tmpDir;
}
function NotionMantencion_Accion(valor) {
    var tmpTmp;
    var tmpRet;
    NotionMantencion_Layer(true);

    if (valor == "hlp") {
        LlamarAyuda();
        return;
    }
    if (valor == "svg") {
        valor = "sav";
        if (document.getElementById("alt") != null) document.getElementById("alt").value = "1";
    } else if (valor == "sav") {
        if (document.getElementById("alt") != null) document.getElementById("alt").value = "0";
    }
    if (valor == "add") {
        document.getElementById("ind").value = "0";
    }
    else if (valor == "sav") {
        if (!NotionMantencion_Accion_SaveA()) {
            return false;
        }
    }
    else if (valor == "del") {
        tmpTmp = true;
        if (NtOnDelete != "") tmpTmp = eval(NtOnDelete);
        if (!tmpTmp) {
            NotionMantencion_Layer(false);
            return false;
        }
    }
    else if (valor == "busrel") {
        tmpTmp = NotionTable_CheckSeleccionado();
        if (tmpTmp == 0) {
            alert("Debe seleccionar al menos un registro para relacionar");
            NotionMantencion_Layer(false);
            return false;
        }
    }
    else if (valor == "lst") {
        tmpRet = ",";
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            tmpTmp = document.getElementById("ter" + NtEstructura[tmpInt].id);
            if (tmpTmp) {
                if (tmpTmp.style.display == "none") {
                    tmpRet += NtEstructura[tmpInt].id + ",";
                }
            }
        }
        document.getElementById("ing").value = tmpRet;
    }
    else if (valor == "") {
        document.getElementById("ind").value = 0;
    }

    NotionTextParse_ParseHrd_All();
    document.getElementById("acc").value = valor;
    NotionMantencion_FinishPageMemory();
    document.forms[0].submit();
}
function CampoObligatorio(Nombre, Valor) {
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].etiqueta == Nombre) {
            NtEstructura[tmpInt].obligatorio = Valor;
            break;
        }
    }
}
function NotionMantencion_Accion_SaveA() {
    var tmpEst = false;
    //Limpiar relaciones mal ingresadas
    //NotionMantenedor_LimpiarRelacionesInvalidas();
    //Validar Obligatorios
    if (!NotionMantenedor_ValidarObligatorios()) {
        NotionMantencion_Layer(false);
        return false;
    }
    //Script Mantenedor
    tmpTmp = Function_NtOnSave();
    if (tmpTmp == false) {
        NotionMantencion_Layer(false);
        return false;
    }
    else if (tmpTmp == null) {
        return false;
    }
    //Validar Unicos
    try {
        eval(" if (NtEstructura.length > 0) tmpEst = true; ");
    }
    catch (ex) { tmpEst = false; }
    if (tmpEst) {
        NotionMantencion_Accion_SaveB(0);
    }
    else {
        NotionMantencion_Accion_SaveC();
    }
}
function NotionMantencion_Accion_SaveB(idx) {
    //Validar duplicados
    var tmpPas = true;
    var tmpVal = "";
    if (idx == 0) {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if ((NtEstructura[tmpInt].unico) && (NtEstructura[tmpInt].typ != '4')) {
                if (document.getElementById("man" + NtEstructura[tmpInt].id).value != "") {
                    tmpVal += NtEstructura[tmpInt].campo + ":";
                    switch (NtEstructura[tmpInt].typ) {
                        case "1":
                            tmpVal += "''" + document.getElementById("man" + NtEstructura[tmpInt].id).value + "''";
                            break;
                        default:
                            tmpVal += document.getElementById("man" + NtEstructura[tmpInt].id).value;
                            break;
                    }
                    tmpVal += "\\!";
                    tmpPas = false;
                }
            }
        }
    }
    else {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].id == idx) {
                if (document.getElementById("man" + NtEstructura[tmpInt].id).value != "") {
                    tmpVal += NtEstructura[tmpInt].campo + ":";
                    switch (NtEstructura[tmpInt].typ) {
                        case "1":
                            tmpVal += "''" + document.getElementById("man" + NtEstructura[tmpInt].id).value + "''";
                            break;
                        default:
                            tmpVal += document.getElementById("man" + NtEstructura[tmpInt].id).value;
                            break;
                    }
                    tmpVal += "\\!";
                    tmpPas = false;
                }
                break;
            }
        }
        tmpVal += "\\!";
    }
    if (tmpPas) {
        if (idx == 0) NotionMantencion_Accion_SaveC();
    }
    else {
        document.getElementById("fra").src = "../../com/mantenedor/ajxuni.aspx?man=" + NtMantenedor + "&val=\\!" + tmpVal + "&frm=" + idx + "&rnd=" + NotionMantenedor_Aleatorio();
    }
}
function NotionMantencion_Accion_SaveC() {
    NotionTextParse_ParseHrd_All();
    document.getElementById("acc").value = "sav";
    document.forms[0].submit();
}
function NotionMantencion_Validaciones() {
    var tmpCam;
    var tmpVal;
    var tmpVla;
    var tmpVlb;
    var tmpPas = false;
    var tmpNom;
    var tmpFlg = "";
    var tmpSig;
    /*
    0 = Archivo
    1 = Texto
    2 = CajaTexto
    3 = Numero
    4 = Fecha
    5 = Relacion
    6 = Contenedor
    7 = OpcionSimple
    8 = OpcionMultiple
    9 = VerdaderoFalso
    */
    try { eval("NtValidaciones = NtValidaciones; tmpPas = true; "); } catch (err) { tmpPas = false; }
    if (tmpPas) {
        for (var tmpInt = 0; tmpInt < NtValidaciones.length; tmpInt++) {
            tmpVal = NtValidaciones[tmpInt];
            tmpCam = tmpVal.cmp;
            for (var tmpSub = 0; tmpSub < NtEstructura.length; tmpSub++) {
                if (NtEstructura[tmpSub].campo == tmpCam) {
                    tmpCam = NtEstructura[tmpSub];
                    break;
                }
            }
            tmpVla = document.getElementById("man" + tmpCam.id).value;
            tmpVlb = tmpVal.vlr;
            if (tmpVlb.indexOf("(!") > -1) {
                for (var tmpEls = 0; tmpEls < NtEstructura.length; tmpEls++) {
                    tmpFlg = "(!" + NtEstructura[tmpEls].etiqueta + ")";
                    if (tmpVlb == tmpFlg) {
                        tmpFlg = NtEstructura[tmpEls].etiqueta;
                        tmpVlb = document.getElementById("man" + NtEstructura[tmpEls].id).value;
                        break;
                    }
                }
                if (tmpVlb.indexOf("(!") > -1) {
                    alert("No es posible resolver la formula (" + tmpVlb + ")");
                    return false;
                }
            } else {
                tmpFlg = tmpVlb;
            }
            tmpSig = true;
            switch (tmpVal.cua) {
                case "0": //Validar siempre
                    break;
                case "1": //No validar si A es vacío
                    if (tmpVla == "") tmpSig = false;
                    break;
                case "2": //No validar si B es vacío
                    if (tmpVlb == "") tmpSig = false;
                    break;
                case "3": //No validar si A o B son vacíos
                    if ((tmpVla == "") || (tmpVlb == "")) tmpSig = false;
                    break;
                case "4": //No validar si A y B son vacíos
                    if ((tmpVla == "") && (tmpVlb == "")) tmpSig = false;
                    break;
            }
            if (tmpSig) {
                switch (tmpCam.typ) {
                    case "0": //Archivo
                    case "1": //Texto
                    case "2": //CajaTexto
                    case "5": //Relacion
                    case "7": //OpcionSimple
                    case "3": //Numero
                        if (tmpCam.typ == "5") {
                            tmpVla = document.getElementById("rea" + tmpCam.id).value;
                        } else if (tmpCam.typ == "3") {
                            tmpVla = NotionMantencion_ValorNumero(tmpVla);
                            tmpVlb = NotionMantencion_ValorNumero(tmpVlb);
                        }
                        switch (tmpVal.opr) {
                            case 0: //Igual
                                if (tmpVla != tmpVlb) {

                                    alert("El campo " + tmpCam.etiqueta + " debe ser igual a " + tmpFlg + ""); return false;
                                }
                                break;
                            case 1: //Diferente
                                if (tmpVla == tmpVlb) {
                                    alert("El campo " + tmpCam.etiqueta + " debe se diferente a " + tmpFlg + ""); return false;
                                }
                                break;
                            case 2: //Contentiene
                                if (tmpCam.typ == "3") {
                                    tmpVla = tmpVla + "";
                                    tmpVlb = tmpVlb + "";
                                }
                                if (tmpVla.indexOf(tmpVlb) == -1) {
                                    alert("El campo " + tmpCam.etiqueta + " debe contener " + tmpFlg + ""); return false;
                                }
                                break;
                            case 3: //No contentiene
                                if (tmpCam.typ == "3") {
                                    tmpVla = tmpVla + "";
                                    tmpVlb = tmpVlb + "";
                                }
                                if (tmpVla.indexOf(tmpVlb) != -1) {
                                    alert("El campo " + tmpCam.etiqueta + " no debe contener " + tmpFlg + ""); return false;
                                }
                                break;
                            case 4: //Mayor que
                                if (tmpCam.typ == "7") {
                                    tmpVla = NotionMantencion_ValorNumero(NotionMantencion_ValorOpcion(tmpCam));
                                    tmpVlb = NotionMantencion_ValorNumero(tmpVlb);
                                    tmpNom = "valor";
                                } else if (tmpCam.typ == "3") {
                                    tmpNom = "valor";
                                } else {
                                    tmpVla = tmpVla.length;
                                    if (IsNumeric(tmpVlb)) { tmpVlb = parseFloat(tmpVlb); } else { tmpVlb = tmpVlb.length; }
                                    tmpNom = "largo";
                                }
                                if (!(tmpVla > tmpVlb)) {
                                    alert("El " + tmpNom + " del campo " + tmpCam.etiqueta + " debe ser mayor que " + tmpFlg + ""); return false;
                                }
                                break;
                            case 5: //Menor que
                                if (tmpCam.typ == "7") {
                                    tmpVla = NotionMantencion_ValorNumero(NotionMantencion_ValorOpcion(tmpCam));
                                    tmpVlb = NotionMantencion_ValorNumero(tmpVlb);
                                    tmpNom = "valor";
                                } else if (tmpCam.typ == "3") {
                                    tmpNom = "valor";
                                } else {
                                    tmpVla = tmpVla.length;
                                    if (IsNumeric(tmpVlb)) { tmpVlb = parseFloat(tmpVlb); } else { tmpVlb = tmpVlb.length; }
                                    tmpNom = "largo";
                                }
                                if (!(tmpVla < tmpVlb)) {
                                    alert("El " + tmpNom + " del campo " + tmpCam.etiqueta + " debe ser menor que " + tmpFlg + ""); return false;
                                }
                                break;
                            case 6: //Mayor o igual que
                                if (tmpCam.typ == "7") {
                                    tmpVla = NotionMantencion_ValorNumero(NotionMantencion_ValorOpcion(tmpCam));
                                    tmpVlb = NotionMantencion_ValorNumero(tmpVlb);
                                    tmpNom = "valor";
                                } else if (tmpCam.typ == "3") {
                                    tmpNom = "valor";
                                } else {
                                    tmpVla = tmpVla.length;
                                    if (IsNumeric(tmpVlb)) { tmpVlb = parseFloat(tmpVlb); } else { tmpVlb = tmpVlb.length; }
                                    tmpNom = "largo";
                                }
                                if (!(tmpVla >= tmpVlb)) {
                                    alert("El " + tmpNom + " del campo " + tmpCam.etiqueta + " debe ser igual o mayor que " + tmpFlg + ""); return false;
                                }
                                break;
                            case 7: //Menor o igual que
                                if (tmpCam.typ == "7") {
                                    tmpVla = NotionMantencion_ValorNumero(NotionMantencion_ValorOpcion(tmpCam));
                                    tmpVlb = NotionMantencion_ValorNumero(tmpVlb);
                                    tmpNom = "valor";
                                } else if (tmpCam.typ == "3") {
                                    tmpNom = "valor";
                                } else {
                                    tmpVla = tmpVla.length;
                                    if (IsNumeric(tmpVlb)) { tmpVlb = parseFloat(tmpVlb); } else { tmpVlb = tmpVlb.length; }
                                    tmpNom = "largo";
                                }
                                if (!(tmpVla >= tmpVlb)) {
                                    alert("El " + tmpNom + " del campo " + tmpCam.etiqueta + " debe ser igual o mayor que " + tmpFlg + ""); return false;
                                }
                                break;
                        }
                        break;
                    case "4": //Fecha
                        switch (tmpVal.opr) {
                            case 0: //Igual
                            case 2: //Contentiene
                                if ((tmpVla.length == NtRegion.dat.length) || (tmpVlb.length == NtRegion.dat.length)) {
                                    tmpVla = tmpVla.substring(0, NtRegion.dat.length);
                                    tmpVlb = tmpVlb.substring(0, NtRegion.dat.length);
                                }
                                if (tmpVla != tmpVlb) {
                                    alert("La fecha del campo " + tmpCam.etiqueta + " debe ser igual a " + tmpFlg + ""); return false;
                                }
                                break;
                            case 1: //Diferente
                            case 3: //No contentiene
                                if ((tmpVla.length == NtRegion.dat.length) || (tmpVlb.length == NtRegion.dat.length)) {
                                    tmpVla = tmpVla.substring(0, NtRegion.dat.length);
                                    tmpVlb = tmpVlb.substring(0, NtRegion.dat.length);
                                }
                                if (tmpVla == tmpVlb) {
                                    alert("La fecha del campo " + tmpCam.etiqueta + " debe se diferente a " + tmpFlg + ""); return false;
                                }
                                break;
                            case 4: //Mayor que
                                tmpVla = NotionMantencion_ValorFecha(tmpVla);
                                tmpVlb = NotionMantencion_ValorFecha(tmpVlb);
                                if (!(tmpVla > tmpVlb)) {
                                    alert("La fecha del campo " + tmpCam.etiqueta + " debe ser mayor que " + tmpFlg + ""); return false;
                                }
                                break;
                            case 5: //Menor que
                                tmpVla = NotionMantencion_ValorFecha(tmpVla);
                                tmpVlb = NotionMantencion_ValorFecha(tmpVlb);
                                if (!(tmpVla < tmpVlb)) {
                                    alert("La fecha del campo " + tmpCam.etiqueta + " debe ser menor que " + tmpFlg + ""); return false;
                                }
                                break;
                            case 6: //Mayor o igual que
                                tmpVla = NotionMantencion_ValorFecha(tmpVla);
                                tmpVlb = NotionMantencion_ValorFecha(tmpVlb);
                                if (!(tmpVla >= tmpVlb)) {
                                    alert("La fecha del campo " + tmpCam.etiqueta + " debe ser igual o mayor que " + tmpFlg + ""); return false;
                                }
                                break;
                            case 7: //Menor o igual que
                                tmpVla = NotionMantencion_ValorFecha(tmpVla);
                                tmpVlb = NotionMantencion_ValorFecha(tmpVlb);
                                if (!(tmpVla >= tmpVlb)) {
                                    alert("La fecha del campo " + tmpCam.etiqueta + " debe ser igual o mayor que " + tmpFlg + ""); return false;
                                }
                                break;
                        }
                        break;
                    case "8": //OpcionMultiple
                    case "9": //VerdaderoFalso
                    case "6":
                    case "10":
                    case "11":
                    case "12":
                    case "13":
                        //Otros campos sin validacion
                        break;
                }
            }
        }
    }
    return true;
}
function NotionMantenedor_LimpiarRelacionesInvalidas() {
    var tmpIdx;
    var tmpPas = false;
    try {
        NtEstructura = NtEstructura;
        tmpPas = true;
    } catch (ex) {
        tmppas = false;
    }
    if (tmpPas) {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].typ == "5") {
                tmpIdx = NtEstructura[tmpInt].id;
                //alert(NtEstructura[tmpInt].etiqueta + "\n\nman#" + document.getElementById("man" + tmpIdx).value + "#\ntxt#" + document.getElementById("txt" + tmpIdx).value + "#\nrea#" + document.getElementById("rea" + tmpIdx).value + "#");
                if ((document.getElementById("man" + tmpIdx).value != document.getElementById("rea" + tmpIdx).value) && (document.getElementById("txt" + tmpIdx).value != document.getElementById("rea" + tmpIdx).value)) {
                    document.getElementById("txt" + tmpIdx).value = "";
                    document.getElementById("rea" + tmpIdx).value = "";
                    document.getElementById("man" + tmpIdx).value = "";
                } else if (document.getElementById("man" + tmpIdx).value == "0") {
                    document.getElementById("txt" + tmpIdx).value = "";
                    document.getElementById("rea" + tmpIdx).value = "";
                    document.getElementById("man" + tmpIdx).value = "";
                }
            }
        }
    }
}
function NotionMantencion_ValorOpcion(Campo) {
    var tmpRet = 0;
    var tmpAct = document.getElementById("man" + Campo.id).value;
    var tmpOpc = Campo.opc;
    for (var tmpInt = 0; tmpInt < tmpOpc.length; tmpInt++) {
        if (tmpOpc[tmpInt].key == tmpAct) {
            tmpRet = tmpOpc[tmpInt].val;
            break;
        }
    }
    return tmpRet;
}
function NotionMantencion_ValorNumero(Valor) {
    var tmpRet = Valor + "";
    var tmpMil = NtRegion.sepmil;
    var tmpDec = NtRegion.sepdec;
    while (tmpRet.indexOf(tmpMil) != -1) tmpRet = tmpRet.replace(tmpMil, "");
    tmpRet = tmpRet.replace(tmpDec, ".");
    if (tmpRet == "") tmpRet = "0";
    return parseFloat(Valor);
}
function NotionMantencion_ValorFecha(Valor) {
    var tmpRet;
    var dia;
    var mes;
    var ano;
    var fecha;
    var hora;
    var seg;
    if (Valor == "") {
        tmpRet = new Date(1900, 1, 1, 0, 0, 0);
    } else {
        fecha = Valor;
        switch (NtRegion.dat) {
            case "dd mon yyyy":
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 6), 10);
                ano = parseInt(fecha.substring(7), 10);
                switch (mes) {
                    case "Ene": mes = 1; break;
                    case "Feb": mes = 2; break;
                    case "Mar": mes = 3; break;
                    case "Abr": mes = 4; break;
                    case "May": mes = 5; break;
                    case "Jun": mes = 6; break;
                    case "Jul": mes = 7; break;
                    case "Ago": mes = 8; break;
                    case "Sep": mes = 9; break;
                    case "Oct": mes = 10; break;
                    case "Nov": mes = 11; break;
                    case "Dic": mes = 12; break;
                }
                break;
            case "yy/MM/dd":
                ano = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                dia = parseInt(fecha.substring(6, 8), 10);
                break;
            case "MM-dd-yy":
                mes = parseInt(fecha.substring(0, 2), 10);
                dia = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 8), 10);
                break;
            case "dd-MM-yy":
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 8), 10);
                break;
            case "dd.MM.yy":
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 8), 10);
                break;
            case "dd/MM/yyyy":
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 10), 10);
                break;
            default:
                alert("Formato incorrecto (" + NtRegion.dat + ")");
                break;
        }
        if (fecha.length > NtRegion.dat.length) {
            hora = fecha.substring(NtRegion.dat.length + 1);
            seg = hora.substring(6, 8);
            if (seg == "") seg = 0;
            tmpRet = new Date(ano, mes, dia, hora.substring(0, 2), hora.substring(3, 5), seg);
        } else {
            tmpRet = new Date(ano, mes, dia, 0, 0, 0);
        }
    }
    return tmpRet;
}
function NotionMantencion_GuardarContenedoresAvz() {
    var tmpCon;
    var tmpCnt = 0;
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].avz == 1) {
            tmpCon = document.getElementById("con" + NtEstructura[tmpInt].id);
            if (tmpCon) {
                NotionMantencion_ContenedoresAvz_Count[NotionMantencion_ContenedoresAvz_Count.length] = NtEstructura[tmpInt].id;
                tmpCon.contentDocument.forms[0].AvzGuardar();
                tmpCnt += 1;
            }
        }
    }
    return tmpCnt;
}
function NotionMantencion_GuardarContenedoresAvz_Set(Identidad, Valor) {
    var tmpPas = false;
    for (var tmpInt = 0; tmpInt < NotionMantencion_ContenedoresAvz_Count.length; tmpInt++) {
        if (NotionMantencion_ContenedoresAvz_Count[tmpInt] == Identidad) {
            NotionMantencion_ContenedoresAvz_Count[tmpInt] = 0;
        }
    }
    for (var tmpInt = 0; tmpInt < NotionMantencion_ContenedoresAvz_Count.length; tmpInt++) {
        if (NotionMantencion_ContenedoresAvz_Count[tmpInt] != 0) {
            tmpPas = true;
            break;
        }
    }
    if (!tmpPas) {
        NotionMantencion_Accion_SaveC();
    }
}
function Function_ValidateNtRequestSave() {
    var tmpTyp;
    for (i = 0; i < document.all.length; i++) {
        if (document.all[i].nodeName == "IFRAME") {
            try {
                tmpTyp = document.all[i].contentDocument.NtRequestSave;
            }
            catch (ex) {
                tmpTyp = null;
            }
            if (tmpTyp != null) {
                tmpTyp = tmpTyp;
            }
        }
    }
    return false;
}
function NotionMantencion_Unico(valor) {
    var tmpInt = NotionTable_CheckUnitario();
    switch (tmpInt) {
        case 0:
            alert("Por favor seleccione un item");
            break;
        case 1:
            document.getElementById("ind").value = NotionTable_CheckSeleccionado();
            NotionMantencion_Accion(valor);
            break;
        default:
            alert("Por favor seleccione sólo un item");
            break;
    }
}
function NotionTable_CheckSeleccionado() {
    var tmpCnt = "";
    var tmpArr;
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].name != "chk") {
            if (document.forms[0].elements[i].type == "checkbox") {
                if (document.forms[0].elements[i].checked) {
                    tmpCnt = document.forms[0].elements[i].name.substring(3);
                    break;
                }
            }
        }
    }
    tmpArr = NotionMantenedor_SelMemory.split(",");
    for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
        if (tmpArr[tmpInt] != "") tmpCnt++;
    }
    return tmpCnt;
}
function NotionTable_CheckSeleccionaTodo(obj) {
    var tmpCnt = "";
    var tmpArr;

    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].type == "checkbox") {
            if (document.forms[0].elements[i].checked) {
                obj.checked = false;
                document.forms[0].elements[i].checked = false;
            } else {
                obj.checked = true;
                document.forms[0].elements[i].checked = true;
            }
        }
    }
}
function NotionTable_CheckAll() {
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].name != "chk") {
            if (document.forms[0].elements[i].type == "checkbox") {
                document.forms[0].elements[i].checked = document.getElementById("chk").checked;
            }
        }
    }
}
function NotionTextParse_ParseHrd_All() {
    var tmpPas;
    var tmpTst;
    for (i = 0; i < document.forms[0].elements.length; i++) {
        switch (document.forms[0].elements[i].type) {
            case "textarea":
                document.forms[0].elements[i].value = NotionTextParse_ParseHrd(document.forms[0].elements[i].value);
                break;
            case "text":
                document.forms[0].elements[i].value = NotionTextParse_ParseRealHrd(document.forms[0].elements[i].value);
                break;
        }
    }
    try {
        tmpTst = NtEstructura.length;
        tmpPas = true;
    } catch (ex) {
        tmpPas = false;
    }
    if (tmpPas) {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if ((NtEstructura[tmpInt].typ == "4") && (NtEstructura[tmpInt].avz == 1)) {
                if (document.getElementById("hor" + NtEstructura[tmpInt].id)) {
                    if (document.getElementById("man" + NtEstructura[tmpInt].id).value != "") {
                        document.getElementById("man" + NtEstructura[tmpInt].id).value = document.getElementById("man" + NtEstructura[tmpInt].id).value + " " + document.getElementById("hor" + NtEstructura[tmpInt].id).value;
                    }
                    document.getElementById("hor" + NtEstructura[tmpInt].id).style.display = "none";
                }
            }
        }
    }
}
function NotionTextParse_ParseSft_All() {
    for (i = 0; i < document.forms[0].elements.length; i++) {
        switch (document.forms[0].elements[i].type) {
            case "textarea":
                document.forms[0].elements[i].value = NotionTextParse_ParseSft(document.forms[0].elements[i].value);
                if (document.forms[0].elements[i].name.indexOf("htm") == 0) {
                    if (document.getElementById("man" + document.forms[0].elements[i].name.substring(3)) != null) {
                        document.getElementById("htm" + document.forms[0].elements[i].name.substring(3)).value = document.getElementById("man" + document.forms[0].elements[i].name.substring(3)).value;
                    }
                }
                break;
            case "text":
                document.forms[0].elements[i].value = NotionTextParse_ParseRealSft(document.forms[0].elements[i].value);
                break;
        }
    }
}
function NotionTextParse_ParseHrd(valor) {
    var tmpVal = valor;
    while (tmpVal.indexOf("<") != -1) tmpVal = tmpVal.replace("<", "!lt;");
    while (tmpVal.indexOf("&") != -1) tmpVal = tmpVal.replace("&", "!amp;");
    while (tmpVal.indexOf(">") != -1) tmpVal = tmpVal.replace(">", "!gt;");
    while (tmpVal.indexOf('"') != -1) tmpVal = tmpVal.replace('"', "!quot;");
    while (tmpVal.indexOf("'") != -1) tmpVal = tmpVal.replace("'", "!apos;");
    while (tmpVal.indexOf("\r\n") != -1) tmpVal = tmpVal.replace("\r\n", "!crlf;");
    while (tmpVal.indexOf("\r") != -1) tmpVal = tmpVal.replace("\r", "!cr;");
    while (tmpVal.indexOf("\n") != -1) tmpVal = tmpVal.replace("\n", "!lf;");
    return tmpVal;
}
function NotionTextParse_ParseSft(valor) {
    var tmpVal = valor;
    while (tmpVal.indexOf("!lt;") != -1) tmpVal = tmpVal.replace("!lt;", "<");
    while (tmpVal.indexOf("!amp") != -1) tmpVal = tmpVal.replace("!amp;", "&");
    while (tmpVal.indexOf("!gt;") != -1) tmpVal = tmpVal.replace("!gt;", ">");
    while (tmpVal.indexOf('!quot;') != -1) tmpVal = tmpVal.replace('!quot;', '"');
    while (tmpVal.indexOf("!apos;") != -1) tmpVal = tmpVal.replace("!apos;", "'");
    while (tmpVal.indexOf("!crlf;") != -1) tmpVal = tmpVal.replace("!crlf;", "\r\n");
    while (tmpVal.indexOf("!cr;") != -1) tmpVal = tmpVal.replace("!cr;", "\r");
    while (tmpVal.indexOf("!lf;") != -1) tmpVal = tmpVal.replace("!lf;", "\n");
    return tmpVal;
}
function NotionTextParse_ParseRealHrd(valor) {
    var tmpVal = valor;
    while (tmpVal.indexOf("<") != -1) tmpVal = tmpVal.replace("<", "&lt;");
    //while (tmpVal.indexOf("&") != -1) tmpVal = tmpVal.replace("&", "&amp;");
    while (tmpVal.indexOf(">") != -1) tmpVal = tmpVal.replace(">", "&gt;");
    while (tmpVal.indexOf('"') != -1) tmpVal = tmpVal.replace('"', "&quot;");
    while (tmpVal.indexOf("'") != -1) tmpVal = tmpVal.replace("'", "&apos;");
    while (tmpVal.indexOf("\r\n") != -1) tmpVal = tmpVal.replace("\r\n", "&crlf;");
    return tmpVal;
}
function NotionTextParse_ParseRealSft(valor) {
    var tmpVal = valor;
    while (tmpVal.indexOf("&lt;") != -1) tmpVal = tmpVal.replace("&lt;", "<");
    while (tmpVal.indexOf("&amp") != -1) tmpVal = tmpVal.replace("&amp;", "&");
    while (tmpVal.indexOf("&gt;") != -1) tmpVal = tmpVal.replace("&gt;", ">");
    while (tmpVal.indexOf('&quot;') != -1) tmpVal = tmpVal.replace('&quot;', '"');
    while (tmpVal.indexOf("&apos;") != -1) tmpVal = tmpVal.replace("&apos;", "'");
    while (tmpVal.indexOf("&crlf;") != -1) tmpVal = tmpVal.replace("&crlf;", "\r\n");

    while (tmpVal.indexOf("!lt;") != -1) tmpVal = tmpVal.replace("!lt;", "<");
    while (tmpVal.indexOf("!amp") != -1) tmpVal = tmpVal.replace("!amp;", "&");
    while (tmpVal.indexOf("!gt;") != -1) tmpVal = tmpVal.replace("!gt;", ">");
    while (tmpVal.indexOf('!quot;') != -1) tmpVal = tmpVal.replace('!quot;', '"');
    while (tmpVal.indexOf("!apos;") != -1) tmpVal = tmpVal.replace("!apos;", "'");
    return tmpVal;
}
function NotionMantencion_IniciarItm() {
    var tmpOnLoad;
    NotionFormulario_Iniciar();
    NotionTextParse_ParseSft_All();
    //$("body select").msDropDown({showIcon:false});
    if (document.getElementById("tab2_contenedor")) document.getElementById("tab2_contenedor").onscroll = NotionMantenedorScrollContenedor;
    if (tmpOnLoad != "") {
        try {
            eval(tmpOnLoad);
        } catch (ex) { alert("Problemas en script\n\n" + ex.description); }
    }
    //NotionMantenedor_FormulasPadre();
    NotionMantenedor_Formulas(false, false);
}
function NotionMantenedorScrollContenedor() {
    var tmpX;
    var tmpY;
    var tmpC;
    if (document.getElementById("rel").style.display == "") {
        if (document.getElementById("tab2_contenedor")) {
            tmpC = document.getElementById("tab2_contenedor");
            tmpY = document.getElementById("rel").orgY - tmpC.scrollTop;
            if (tmpY > 42) {
                tmpX = document.getElementById("rel").orgX - tmpC.scrollLeft;
                jQuery("#rel").css("left", tmpX)
                //document.getElementById("rel").style.left = tmpX;
                jQuery("#rel").css("top", tmpY)
                //document.getElementById("rel").style.top = tmpY;

            }
            else {
                document.getElementById("rel").style.display = "none";
            }
        } else {
            tmpC = document.getElementById("contenedor");
        }
    }
}
function NotionMantencion_IniciarAdvanced() {
    document.body.className = "body_";
    var tmpLst = document.getElementById("phonetic_");
    var tmpPri = true;
    var tmpRow;
    var tmpHed;
    var tmpCnt;
    var tmpAcu = 0;
    var tmpAvz = "";
    window.onload = function () {
        DragDrop.makeListContainer(tmpLst);
        tmpLst.onDragOut = function () {
            var tmpRes = "";
            tmpAvz = "";
            for (var tmpInt = 0; tmpInt < tmpLst.childNodes.length; tmpInt++) {
                if (tmpPri) {
                    tmpPri = false;
                    tmpRow = tmpLst.childNodes[tmpInt].firstChild.firstChild.firstChild.firstChild;
                    tmpHed = document.getElementById("header_row_adv");
                    tmpHed.childNodes[0].style.width = 32;
                    tmpAcu = 0;
                    for (var tmpSec = 0; tmpSec < tmpRow.childNodes.length; tmpSec++) {
                        tmpAcu += (tmpRow.childNodes[tmpSec].offsetWidth - 12);
                        tmpHed.childNodes[tmpSec + 1].style.width = (tmpRow.childNodes[tmpSec].offsetWidth - 12);
                        tmpCnt = tmpSec;
                    }
                    tmpHed.childNodes[tmpCnt + 1].style.width = (document.documentElement.clientWidth - tmpAcu);
                }
                tmpAvz += tmpLst.childNodes[tmpInt].campo + ",";
                document.getElementById("reg" + tmpLst.childNodes[tmpInt].campo).value = tmpInt;
            }
            tmpPri = true;
        }
        tmpLst.onDragOut();
        if (tmpAvz != "") tmpAvz = tmpAvz.substring(0, tmpAvz.length - 1);
        document.getElementById("avz").value = tmpAvz;
        document.forms[0].AvzGuardar = function () {
            NotionMantencion_Accion("sav");
        };
    }
}
function NotionMantencion_Iniciar(rpp, cnt, pag, mod, exo) {
    try { document.getElementById("zzr").value = ""; } catch (zzr) { }
    if (exo == "1") {
        document.getElementById("_tools").style.display = "none";
    }
    NotionMantencion_PaginadorRegistrosPPP = rpp;
    NotionMantencion_CantidadRegistros(cnt);
    NotionMantencion_MostrarPaginador();
    PaginaMover(pag);
    try {
        if (mod == "3") window.parent.NotionMantencion_NotificacionContenedor(window.location);
    } catch (ex) { }
    NotionMantenedorMedidasContenedor();
    window.onresize = function () { NotionMantenedorMedidasContenedor(); };

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2805) {
        document.getElementById("filpad").style.display = "block";
        //alert(NtMantenedor);
        //Cliente
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //proyecto
        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Etapa
        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //NumeroProductos
        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Estado Negocio
        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Fecha Periodo Promesa
        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Fecha Periodo Escritura
        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }
    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2857) {
        //Proyecto
        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Etapa
        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Numero Producto
        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Cliente
        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Estado Negocio
        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }
    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2726) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 12;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 14;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2641 || NtMantenedor == 2642 || NtMantenedor == 2643 || NtMantenedor == 2644 || NtMantenedor == 2902 || NtMantenedor == 2903 || NtMantenedor == 2904) {

        document.getElementById("NtFiltros_Box").selectedIndex = 1;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2763) {

        document.getElementById("NtFiltros_Box").selectedIndex = 1;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2853) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }


    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2788 || NtMantenedor == 2893 || NtMantenedor == 2777 || NtMantenedor == 2776 || NtMantenedor == 2905 || NtMantenedor == 2883 || NtMantenedor == 2881) {

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 9;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 15;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2670) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 1;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2753) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2684) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2648) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2750) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 1;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 12;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2710) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2669) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 9;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2751) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 13;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))



    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2577) {
        //document.getElementById("filpad").style.display = "block";


        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 13;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2836) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2932) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 9;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 21;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2956) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2930) {
        document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2957) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2958) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


    }


    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2950) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2972) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }


    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2944) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 12;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 13;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 14;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }


    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2743) {
        //document.getElementById("filpad").style.display = "block";
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }


    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2971) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2952) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 9;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 3052) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2967) {
        //document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }


    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 3043) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 3042) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 3041) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2998) {
        document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 9;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 13;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 5365) {
        //document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 4336) {
        //document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 4328) {
        //document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 6;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


        document.getElementById("NtFiltros_Box").selectedIndex = 10;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }


    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 4272) {
        //document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 12;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 4328) {
        //document.getElementById("filpad").style.display = "block";

        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 11;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        document.getElementById("NtFiltros_Box").selectedIndex = 12;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


    }

    if (NtOnLoad != "") {
        eval(NtOnLoad);
    }
    if (document.getElementById("NtBotFilAuto")) Notion_Mantenedor_GadgetFiltro(document.getElementById("NtBotFilAuto"), '', true);
    if (window.parent.NtRegistro) window.parent.NotionMantencion_ExePadreValues(NtPadreValues, NtMantenedorN);

    //alert("sss");	

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2639) {
        document.getElementById("filpad").style.display = "block";

        //Tipo Unidad
        document.getElementById("NtFiltros_Box").selectedIndex = 1;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Numero del Producto
        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Programa
        document.getElementById("NtFiltros_Box").selectedIndex = 5;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Modelo
        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Piso Producto
        document.getElementById("NtFiltros_Box").selectedIndex = 8;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Orientacion
        document.getElementById("NtFiltros_Box").selectedIndex = 7;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Dormitorios
        document.getElementById("NtFiltros_Box").selectedIndex = 9;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Precio Lista
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))
    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 2774) {
        document.getElementById("filpad").style.display = "block";

        //ID
        document.getElementById("NtFiltros_Box").selectedIndex = 1;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Punto de Venta
        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Estado
        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

        //Registrado por
        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }

    //Caso excepcion no posee comportamiento mantenedor ya que no pertenece al menu
    if (NtMantenedor == 3080) {
        document.getElementById("filpad").style.display = "block";


        document.getElementById("NtFiltros_Box").selectedIndex = 1;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


        document.getElementById("NtFiltros_Box").selectedIndex = 2;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


        document.getElementById("NtFiltros_Box").selectedIndex = 3;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))


        document.getElementById("NtFiltros_Box").selectedIndex = 4;
        NotionMantenedor_MostrarFiltro(document.getElementById("NtFiltros_Box"))

    }


    NotionMantencion_Iniciar_Filtros();
}
function NotionMantencion_Iniciar_Filtros() {
    var tmpObj;
    var tmpPad;
    var tmpHid;
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].typ == "3") {
            tmpObj = null;
            if (NtEstructura[tmpInt].ext == "Desde") {
                tmpObj = document.getElementById("filman" + NtEstructura[tmpInt].id + "d");
                tmpHid = document.getElementById("filman" + NtEstructura[tmpInt].id + "h");
                if (tmpHid) {
                    tmpHid.value = "999999999999999";
                } else {
                    tmpObj = null;
                }
            } else if (NtEstructura[tmpInt].ext == "Hasta") {
                tmpObj = document.getElementById("filman" + NtEstructura[tmpInt].id + "h");
                tmpHid = document.getElementById("filman" + NtEstructura[tmpInt].id + "d");
                if (tmpHid) {
                    tmpHid.value = "-999999999999999";
                } else {
                    tmpObj = null;
                }
            }
            if (tmpObj != null) {
                tmpHid.style.display = "none";
                tmpObj.style.width = "230px"
                tmpPad = tmpObj.parentNode;
                while (tmpPad.tagName != "TABLE") {
                    tmpPad = tmpPad.parentNode;
                }
                tmpObj.parentNode.removeChild(tmpObj);
                tmpPad.style.display = "none";
                tmpPad.parentNode.insertBefore(tmpObj, tmpPad);
            }
        }
    }
}
function NotionMantencion_IniciarMultiple(rpp, cnt, pag, mod) {
    try {
        if (mod == "3") window.parent.NotionMantencion_NotificacionContenedor(window.location);
    } catch (ex) { }
    NotionMantenedorMedidasContenedorMultiple();
    window.onresize = function () { NotionMantenedorMedidasContenedorMultiple(); };
    //NotionMiniMantenedor_NAddItem();
}
function NotionMantencion_ExePadreValues(vls, org) {
    var tmpInt;
    var tmpSub;
    var tmpExe;
    var tmpOrg;
    for (tmpInt = 0; tmpInt < vls.length; tmpInt++) {
        for (tmpSub = 0; tmpSub < NtEstructura.length; tmpSub++) {
            if (NtEstructura[tmpSub].formula == vls[tmpInt].frm) {
                document.getElementById("man" + NtEstructura[tmpSub].id).value = vls[tmpInt].val;
                if (NtEstructura[tmpSub].typ == "3") {
                    tmpExe = "" + document.getElementById("man" + NtEstructura[tmpSub].id).onblur;
                    if (tmpExe.indexOf("NotionMantenedor_ValidarNumero") > -1) {
                        tmpExe = tmpExe.substring(tmpExe.indexOf("NotionMantenedor_ValidarNumero"), 1 + tmpExe.indexOf(")", tmpExe.indexOf("{")));
                        tmpExe = tmpExe.replace("this", "document.getElementById(\"man" + NtEstructura[tmpSub].id + "\")");
                        eval(tmpExe);
                    }
                } else if (NtEstructura[tmpSub].typ == "7") {
                    document.getElementById("txt" + NtEstructura[tmpSub].id).value = vls[tmpInt].val;
                }
            }
        }
    }
    if (vls.length > 0) NotionMantenedor_Formulas(false, true);
    /*
    NotionMantenedor_Formulas(true);
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if ((NtEstructura[tmpInt].formula != "") && (NtEstructura[tmpInt].typ == "3")) {
            if (NotionMantenedor_FormulasFiltro(tmpInt)) {
                if (!((NtEstructura[tmpInt].formula.indexOf("Last(&apos;") > -1) || (NtEstructura[tmpInt].formula.indexOf("Sum(&apos;") > -1))) {
                    tmpExe = "" + document.getElementById("man" + NtEstructura[tmpInt].id).onblur;
                    if (tmpExe.indexOf("NotionMantenedor_ValidarNumero") > -1) {
                        tmpExe = tmpExe.substring(tmpExe.indexOf("NotionMantenedor_ValidarNumero"), 1 + tmpExe.indexOf(")", tmpExe.indexOf("{")));
                        tmpExe = tmpExe.replace("this", "document.getElementById(\"man" + NtEstructura[tmpInt].id + "\")");
                        eval(tmpExe);
                    }
                }
            }
        }
    }
    */
}
function NotionMantenedorMedidasContenedor() {
    var tmpAlt = 0;
    var tmpMen = 0;
    if (NotionMantenedor_AutoSize) {
        try {
            if (document.getElementById("_tools").style.display == "none") tmpMen = 24;
        } catch (ex) { }
        try {
            if ((!document.getElementById("txt")) || (document.getElementById("_map"))) tmpMen = 20;
        } catch (ex) { }
        try {
            tmpAlt = document.getElementById("filpad").clientHeight;
        } catch (ex) { }
        try {
            document.getElementById("contenedor").style.height = (document.documentElement.clientHeight - 63 - tmpAlt + tmpMen) + "px";
            document.getElementById("tabla").style.width = (document.documentElement.clientWidth - 18) + "px";
        } catch (ex) { }
        try {
            eval("NotionMantenedorMedidasContenedor_Component(); ");
        } catch (ex) { }
    }
}
function NotionMantenedorMedidasContenedorMultiple() {
    try {
        document.getElementById("contenedor").style.height = (document.documentElement.clientHeight - 43) + "px";
        document.getElementById("tabla").style.width = (document.documentElement.clientWidth - 18) + "px";
    } catch (ex) { }
}
function NotionFormulario_Iniciar() {
    var tmpInt = 0;
    var tmpTmp;
    try { document.getElementById("zzr").value = ""; } catch (zzr) { }
    NotionMantenedor_PopUpDatosPadre();
    NotionFormulario_Medidas();
    window.onresize = function () { NotionFormulario_Medidas(); };
    while (true) {
        if (document.getElementById("pes_0_" + tmpInt + "_a") != null) {
            tab_seleccionar(0, tmpInt);
        }
        else {
            break;
        }
        tmpInt += 1;
    }
    if (document.getElementById("NtBotFil") != null) {
        document.getElementById("NtBotFil").className = "bar2_des";
        document.getElementById("filpad").style.display = "";
    }
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].typ == "2") {
            document.getElementById("man" + NtEstructura[tmpInt].id).value = NotionTextParse_ParseSft(document.getElementById("man" + NtEstructura[tmpInt].id).value);
        }
    }
    NotionMantenedorMedidasContenedor();
    NotionMantenedor_FormulasPadre();
    NotionMantenedor_Formulas(false);
    ActualizarOcultamiento();
    try {
        if ((NtAccion == "viw") || (NtAccion == "edt") || (NtAccion == "add")) {
            for (var tmpItm = 0; tmpItm < NtEstructura.length; tmpItm++) {
                if (NtEstructura[tmpItm].typ == "3") {
                    tmpTmp = document.getElementById("man" + NtEstructura[tmpItm].id).onblur + "";
                    if (tmpTmp.indexOf("NotionMantenedor_ValidarNumero(") > -1) {
                        try {
                            tmpTmp = tmpTmp.substring(tmpTmp.indexOf("NotionMantenedor_ValidarNumero("), 1024);
                            tmpTmp = tmpTmp.substring(0, 1 + tmpTmp.indexOf(")"));
                            tmpTmp = tmpTmp.replace("this", "document.getElementById(\"man" + NtEstructura[tmpItm].id + "\")");
                            eval(tmpTmp);
                        }
                        catch (ex) { }
                    }
                }
            }
        }
    }
    catch (et) { }
    if (window.parent.NtRegistro) window.parent.NotionMantencion_ExePadreValues(NtPadreValues, NtMantenedorN);
    try {
        tmpOnLoad = NtOnLoad;
        eval(tmpOnLoad);
    } catch (ex) { tmpOnLoad = ""; }
}
function NotionFormulario_Medidas() {
    try {
        document.getElementById("tab2_contenedor").style.height = (document.documentElement.clientHeight - 43) + "px";
    } catch (ex) { }
}

function NotionMantenedorMedidasContenedorOLAP() {
    try {
        document.getElementById("contenedor").style.height = (document.documentElement.clientHeight - 25) + "px";
    }
    catch (ex) {
    }
}
function Notion_Mantenedor_Medidas_Item() {
    document.getElementById("item_contenedor").style.height = (document.documentElement.clientHeight - 32) + "px";
}
//Paginador
var tmpNes = document.getElementById && !document.all;
var tmpDra = false;
var tmpPsx;
function movemouse(e) {
    var tmpVal;
    if (tmpDra) {
        tmpVal = tmpNes ? tmpLox + e.clientX - tmpPsx : tmpLox + event.clientX - tmpPsx;
        if ((tmpVal > 0) && (tmpVal < 133)) {
            tmpVal = tmpVal;
        }
        else if (tmpVal < 0) {
            tmpVal = 0;
        }
        else if (tmpVal > 133) {
            tmpVal = 133;
        }
        document.getElementById("obj").style.left = tmpVal;
        return false;
    }
}
function selectmouse(e) {
    var tmpTmp = tmpNes ? e.target : event.srcElement;
    var topelement = tmpNes ? "HTML" : "BODY";
    var tmpObj;
    while (tmpTmp.tagName != topelement) {
        tmpTmp = tmpNes ? tmpTmp.parentNode : tmpTmp.parentElement;
    }
    tmpDra = true;
    tmpObj = tmpTmp;
    tmpLox = parseInt(document.getElementById("obj").style.left + 0, 10);
    tmpPsx = tmpNes ? e.clientX : event.clientX;
    document.onmousemove = movemouse;
    document.onmouseup = paginadorend;
    return false;
}
function paginadorend() {
    if (tmpDra) {
        PaginaMover(NotionMantencion_PaginaActual());
    }
    tmpDra = false;
}
function NotionMantencion_CantidadRegistros(v) {
    NotionMantencion_PaginadorRegistros = v;
    NotionMantencion_PaginadorPaginas = parseInt(NotionMantencion_PaginadorRegistros / NotionMantencion_PaginadorRegistrosPPP);
    if ((NotionMantencion_PaginadorRegistros % NotionMantencion_PaginadorRegistrosPPP) != 0) {
        NotionMantencion_PaginadorPaginas++;
    }
    NotionMantencion_PaginadorActual = 1;
}

function NotionMantencion_PaginaActual() {
    var tmpStr;
    var tmpVal;
    tmpStr = document.getElementById("obj").style.left;
    tmpStr = tmpStr.replace("px", "");
    tmpVal = parseFloat(tmpStr);
    tmpVal = 1 + (((NotionMantencion_PaginadorPaginas - 1) / 133) * tmpVal);
    return Math.round(tmpVal * Math.pow(10, 0)) / Math.pow(10, 0);
}
function NotionMantencion_FinishPageMemory() {
    var tmpArr;
    var tmpObj;
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].name != "chk") {
            if (document.forms[0].elements[i].type == "checkbox") {
                tmpNom = document.forms[0].elements[i].name.substring(3);
                if (document.forms[0].elements[i].checked) {
                    NotionMantenedor_SelMemory = NotionMantenedor_SelMemory.replace("," + tmpNom + ",", ",");
                }
            }
        }
    }
    tmpArr = NotionMantenedor_SelMemory.split(",");
    for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
        if (tmpArr[tmpInt] != "") {
            tmpObj = document.createElement("INPUT");
            tmpObj.name = "chk" + tmpArr[tmpInt];
            tmpObj.checked = true;
            tmpObj.style.display = "none";
            document.forms[0].appendChild(tmpObj);
        }
    }
}
function NotionMantencion_ActivePageMemory() {
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].name != "chk") {
            if (document.forms[0].elements[i].type == "checkbox") {
                tmpNom = "," + document.forms[0].elements[i].name.substring(3) + ",";
                if (NotionMantenedor_SelMemory.indexOf(tmpNom) > -1) {
                    document.forms[0].elements[i].checked = true;
                }
            }
        }
    }
}
function NotionMantencion_CambiarPagina(v) {
    var tmpOth = "";
    var tmpArr;
    var tmpNom;
    var tmpAcc;
    var tmpTar
    var tmpUrl;
    //Actualizar
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].name != "chk") {
            if (document.forms[0].elements[i].type == "checkbox") {
                tmpNom = document.forms[0].elements[i].name.substring(3);
                NotionMantenedor_SelMemory = NotionMantenedor_SelMemory.replace("," + tmpNom + ",", ",");
                if (document.forms[0].elements[i].checked) {
                    NotionMantenedor_SelMemory += tmpNom + ",";
                }
            }
        }
    }
    //Paginacion
    NotionMantencion_PaginadorActual = v;
    NotionMantencion_MostrarPaginador();
    if (document.getElementById("othAjxPag")) {
        tmpOth = document.getElementById("othAjxPag").value;
    }
    //tmpAcc = document.forms[0].action;
    tmpTar = document.forms[0].target;
    //document.forms[0].action = NtURLPaginador + "?acc=pag&idx=" + document.getElementById("man").value + "&pag=" + (NotionMantencion_PaginadorActual - 1) + "&ord=" + document.getElementById("ord").value + "&dir=" + document.getElementById("dir").value + "&pad=" + NtPadre + "&cam=" + NtRelacion + "&flp=" + document.getElementById("flp").value + "&rel=" + NtRelacionPadre + "&oth=" + tmpOth;
    tmpUrl = window.location.href;
    if (tmpUrl.indexOf("?") > -1) {
        tmpUrl += "&checkpassid=" + NotionMantenedor_Aleatorio();
    } else {
        tmpUrl += "?checkpassid=" + NotionMantenedor_Aleatorio();
    }
    document.forms[0].action = tmpUrl;
    document.getElementById("pgp").value = (NotionMantencion_PaginadorActual - 1);
    document.forms[0].target = "fra";
    document.forms[0].submit();
    document.forms[0].action = window.location.href;
    document.forms[0].target = tmpTar;
    document.getElementById("pgp").value = "";
}
function NotionMantencion_MostrarPaginador() {
    if (document.getElementById("txt")) document.getElementById("txt").innerHTML = "Página <b>" + NotionMantencion_PaginadorActual + "</b> de <b>" + NotionMantencion_PaginadorPaginas + "</b> (" + NotionMantencion_PaginadorRegistros + " items)";
}
function PaginaMover(n, cambiar) {
    switch (n) {
        case -1:
            if (NotionMantencion_PaginadorActual > 1) PaginaMover(NotionMantencion_PaginadorActual - 1, cambiar);
            break;
        case 0:
            if (NotionMantencion_PaginadorActual < NotionMantencion_PaginadorPaginas) PaginaMover(NotionMantencion_PaginadorActual + 1, cambiar);
            break;
        default:
            if (NotionMantencion_PaginadorActual != n) {
                if (n == 1) {
                    document.getElementById("obj").style.left = "0px";
                }
                else if (n == 1) {
                    document.getElementById("obj").style.left = "1px";
                }
                else {
                    document.getElementById("obj").style.left = ((133 / NotionMantencion_PaginadorPaginas) * n) + "px";
                }
                if (cambiar == null) {
                    NotionMantencion_CambiarPagina(n);
                }
                else {
                    NotionMantencion_PaginadorActual = n;
                    NotionMantencion_MostrarPaginador();
                }
            }
            break;
    }
}
//Item
function NotionMantenedor_AbrirRelacion(Campo, obj) {
    var tmpObj = document.getElementById("txt" + Campo);
    var tmpRel = document.getElementById("rel");
    var tmpCon = "";
    var tmpPre = Notion_Componentes_Mantenedor_ValorDiccionario(Campo);
    var tmpPos = NotionMantencion_ElementPosition(tmpObj);
    var tmpCas;
    var tmpUrl = "ajxrel.aspx";
    if (tmpPre.filtro != "") {
        tmpCon = NotionTextParse_ParseRealSft(tmpPre.filtro);
        eval("tmpCon = '" + eval(tmpCon) + "';");
    }
    NotionMantenedor_RelacionObjeto = obj;
    NotionMantenedor_RelacionCampo = Campo;
    if (obj != null) NotionMantenedor_RelacionObjeto.className = "item_relacion_abriendo";
    tmpRel.style.left = tmpPos.left + "px";
    tmpRel.style.top = (tmpPos.top + 17) + "px";
    tmpRel.orgX = tmpPos.left;
    tmpRel.orgY = (tmpPos.top + 17);
    tmpRel.style.width = document.getElementById("txt" + Campo).parentNode.parentNode.parentNode.parentNode.offsetWidth;
    tmpRel.style.height = 1;
    //tmpCas = "" + document.getElementById("man" + Campo).cascada;
    tmpCas = "" + tmpPre.cascada;
    if (tmpCas != "") tmpCas = document.getElementById("man" + tmpCas).value;
    if (tmpPre.rel == "sys_roles") tmpUrl = "ajxrelmnu.aspx";
    tmpRel.src = "../../com/mantenedor/" + tmpUrl + "?man=" + document.getElementById("man").value + "&cas=" + tmpCas + "&cam=" + Campo + "&fil=" + escape(tmpObj.value) + "&con=" + escape(NotionTextParse_ParseRealSft(tmpCon)) + "&rnd=" + NotionMantenedor_Aleatorio();
}
function NotionMantenedor_AbrirRelacionTop(Campo) {
    var tmpObj = document.getElementById("txt" + Campo.id);
    var tmpRel = document.getElementById("fra");
    var tmpCon = "";
    var tmpPos = NotionMantencion_ElementPosition(tmpObj);
    var tmpCas;
    var tmpUrl = "ajxtop.aspx";
    if (Campo.filtro != "") {
        tmpCon = NotionTextParse_ParseRealSft(Campo.filtro);
        eval("tmpCon = '" + eval(tmpCon) + "';");
        tmpCon = NotionMantenedor_FormulasResolver(tmpCon, Campo, true);
    }
    NotionMantenedor_RelacionCampo = Campo.id;
    tmpCas = "" + document.getElementById("man" + Campo.id).cascada;
    if (tmpCas != "") tmpCas = document.getElementById("man" + tmpCas).value;
    tmpRel.src = "../../com/mantenedor/" + tmpUrl + "?man=" + document.getElementById("man").value + "&cas=" + tmpCas + "&cam=" + Campo.id + "&fil=&con=" + escape(NotionTextParse_ParseRealSft(tmpCon)) + "&rnd=" + NotionMantenedor_Aleatorio();
}
function NotionMantenedor_AbrirRelacionTopListo(Campo, Valor, Txt) {
    document.getElementById("man" + Campo).value = Valor;
    document.getElementById("rea" + Campo).value = Txt;
    document.getElementById("txt" + Campo).value = Txt;
    NotionMantenedor_FormulasRelacion(Campo);
    ActualizarOcultamiento();
}

function NotionMantenedor_Aleatorio() {
    return Math.round(Math.random() * 999999999) + "";
}
function NotionMantenedor_FAbrirRelacion(Campo, obj) {
    var tmpObj = document.getElementById("filtxt" + Campo);
    var tmpRel = document.getElementById("rel");
    var tmpCon = "";
    var tmpPre = Notion_Componentes_Mantenedor_ValorDiccionario(Campo);
    var tmpPos = NotionMantencion_ElementPosition(tmpObj);
    var tmpSys = document.getElementById("filman" + Campo).rel + "";
    if (tmpSys.indexOf(".") == -1) tmpSys = "";
    //var tmpCas;
    if (tmpPre.filtro != "") {
        tmpCon = NotionTextParse_ParseRealSft(tmpPre.filtro);
        eval("tmpCon = '" + eval(tmpCon) + "';");
    }
    NotionMantenedor_RelacionObjeto = obj;
    NotionMantenedor_RelacionCampo = Campo;
    if (obj != null) NotionMantenedor_RelacionObjeto.className = "item_relacion_abriendo";
    tmpRel.style.left = tmpPos.left + "px";
    tmpRel.style.top = (tmpPos.top + 17) + "px";
    tmpRel.orgX = tmpPos.left;
    tmpRel.orgY = (tmpPos.top + 17);
    tmpRel.style.width = document.getElementById("filtxt" + Campo).parentNode.parentNode.parentNode.parentNode.offsetWidth;
    tmpRel.style.height = 1;
    //tmpCas = "" + document.getElementById("man" + Campo).cascada;
    //if (tmpCas != "") tmpCas = document.getElementById("man" + tmpCas).value;
    //tmpRel.src = "../../com/mantenedor/ajxrel.aspx?typ=fil&man=" + document.getElementById("man").value + "&cas=" + tmpCas + "&cam=" + Campo + "&fil=" + escape(tmpObj.value) + "&con=" + escape(NotionTextParse_ParseRealSft(tmpCon)) + "&rnd=" + NotionMantenedor_Aleatorio();
    tmpRel.src = "../../com/mantenedor/ajxrel.aspx?typ=fil&man=" + document.getElementById("man").value + "&cam=" + Campo + "&fil=" + escape(tmpObj.value) + "&con=" + escape(NotionTextParse_ParseRealSft(tmpCon)) + "&rnd=" + NotionMantenedor_Aleatorio() + "&sys=" + tmpSys;
}
function NotionMantencion_ElementPosition(element) {
    if (typeof element == "string")
        element = document.getElementById(element)

    if (!element) return { top: 0, left: 0 };

    var y = 0;
    var x = 0;
    while (element.offsetParent) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    }
    return { top: y, left: x };
}
function NotionMantenedor_MostrarFiltro(obj) {
    var tmpIdx = obj.options[obj.selectedIndex].value;
    document.getElementById("ter" + tmpIdx).style.display = "";
    document.getElementById("msk" + tmpIdx).style.display = "";
    obj.selectedIndex = 0;
    try {
        eval("NotionMantenedorMedidasContenedor_Component(); ");
    } catch (ex) { }
}
function NotionMantenedor_BorrarRelacion(Campo, obj) {
    var tmpObj = document.getElementById("txt" + Campo);
    var tmpRel = document.getElementById("rel");
    var tmpCon = "";
    var tmpPre = Notion_Componentes_Mantenedor_ValorDiccionario(Campo);
    var tmpPos;
    var tmpTmp;
    var tmpCas;
    var tmpUrl = "ajxrel.aspx";
    if (NtAccion == "mul") {
        tmpPos = NotionMantencion_ElementPosition(obj.parentNode.parentNode);
        NotionManenedor_ObjMan = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.firstChild.firstChild.childNodes[0];
        NotionManenedor_ObjRea = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.firstChild.firstChild.childNodes[1];
        NotionManenedor_ObjTxt = obj.parentNode.firstChild.firstChild;
    } else {
        tmpPos = NotionMantencion_ElementPosition(tmpObj);
    }

    if (tmpPre.filtro != "") {
        tmpCon = NotionTextParse_ParseRealSft(tmpPre.filtro);
        eval("tmpCon = '" + eval(tmpCon) + "';");
    }
    NotionMantenedor_RelacionObjeto = obj;
    NotionMantenedor_RelacionCampo = Campo;
    NotionMantenedor_RelacionObjeto.className = "item_relacion_abriendoborrar";
    tmpRel.style.left = tmpPos.left + "px";
    tmpRel.style.top = (tmpPos.top + 17) + "px";
    tmpRel.orgX = tmpPos.left;
    tmpRel.orgY = (tmpPos.top + 17);
    if (NtAccion == "mul") {
        tmpRel.style.width = obj.parentNode.parentNode.parentNode.parentNode.offsetWidth + "px";
    } else {
        tmpRel.style.width = document.getElementById("txt" + Campo).parentNode.parentNode.parentNode.parentNode.offsetWidth + "px";
    }
    tmpRel.style.height = 1 + "px";

    //tmpCas = "" + document.getElementById("man" + Campo).cascada;
    tmpCas = "" + tmpPre.cascada;
    if ((tmpCas != "") && (tmpCas != "undefined")) {
        tmpCas = document.getElementById("man" + tmpCas).value;
        if (tmpCas == "") tmpCas = "0";
    }
    if (tmpPre.rel == "sys_roles") {
        tmpUrl = "../../com/mantenedor/ajxrelmnu.aspx";
        if (tmpPre.avz != 0) tmpCas = NtRegistro;
    }
    if (tmpCon != "") {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].id == Campo) {
                tmpCon = NotionMantenedor_FormulasResolver(tmpCon, NtEstructura[tmpInt], false);
                break;
            }
        }
    }
    tmpRel.src = "../../com/mantenedor/" + tmpUrl + "?man=" + document.getElementById("man").value + "&cas=" + tmpCas + "&cam=" + Campo + "&fil=" + "&con=" + escape(NotionTextParse_ParseRealSft(tmpCon)) + "&rnd=" + NotionMantenedor_Aleatorio();
}
function IdCampo(etiqueta) {
    var tmpRet = 0;
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].etiqueta == etiqueta) {
            tmpRet = NtEstructura[tmpInt].id;
            break;
        }
    }
    return tmpRet;
}

function NotionMantenedor_FBorrarRelacion(Campo, obj) {
    var tmpObj = document.getElementById("filtxt" + Campo);
    var tmpRel = document.getElementById("rel");
    var tmpCon = "";
    var tmpPre = Notion_Componentes_Mantenedor_ValorDiccionario(Campo);
    var tmpPos = NotionMantencion_ElementPosition(tmpObj);
    var tmpTmp;
    var tmpCas;
    var tmpSys = document.getElementById("filman" + Campo).rel + "";
    if (tmpSys.indexOf(".") == -1) tmpSys = "";
    if (tmpPre.filtro != "") {
        tmpCon = NotionTextParse_ParseRealSft(tmpPre.filtro);
        eval("tmpCon = '" + eval(tmpCon) + "';");
    }
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].id == Campo) {
            tmpCas = NtEstructura[tmpInt].cascada;
            if (tmpCas != "") {
                if (document.getElementById("filman" + tmpCas)) {
                    tmpCas = document.getElementById("filman" + tmpCas).value;
                } else {
                    tmpCas = "";
                }
            }
            break;
        }
    }
    if (tmpCas == "0") tmpCas = "";
    if (tmpCon.indexOf("(!)") > -1) {
        if (tmpCas == "") {
            tmpCon = "";
        } else {
            tmpCon = tmpCon.replace("(!)", tmpCas)
            tmpCon = tmpCon.substring(1, 1024);
        }
        tmpCas = "";
    }
    NotionMantenedor_RelacionObjeto = obj;
    NotionMantenedor_RelacionCampo = Campo;
    NotionMantenedor_RelacionObjeto.className = "item_relacion_abriendoborrar";
    tmpRel.style.left = tmpPos.left + "px";
    tmpRel.style.top = (tmpPos.top + 17) + "px";
    tmpRel.style.width = document.getElementById("filtxt" + Campo).parentNode.parentNode.parentNode.parentNode.offsetWidth;
    tmpRel.style.height = 1;
    tmpRel.src = "../../com/mantenedor/ajxrel.aspx?typ=fil&man=" + document.getElementById("man").value + "&cam=" + Campo + "&fil=" + "&con=" + escape(NotionTextParse_ParseRealSft(tmpCon)) + "&cas=" + tmpCas + "&sys=" + tmpSys;
}

function NotionMantenedor_BusquedaOnBlur(idx) {
    alert(idx);
}

function NotionMantenedor_AbrirRelacionListo(alto, Campo, fx) {
    var tmpRel = document.getElementById("rel");
    if (document.getElementById("bor" + Campo).style.display == "none") {
        return;
    }
    tmpRel.style.display = "";
    NotionMantenedorScrollContenedor();
    try { tmpRel.focus(); } catch (ex) { }
    NotionMantenedor_RelacionFuncion = fx;
    listen("keydown", tmpRel, function (e) { var tmpEvt = e; try { fx(tmpEvt); } catch (ex) { } });
    if (NotionMantenedor_RelacionObjeto != null) {
        if (NotionMantenedor_RelacionObjeto != "") {
            if (NotionMantenedor_RelacionObjeto.className == "item_relacion_abriendoborrar") {
                NotionMantenedor_RelacionObjeto.className = "item_relacion_borrar";
                if (alto == -2) {
                    tmpRel.style.height = "140px";
                } else {
                    NotionMantenedor_AbrirRelacionListo_Efecto(alto, true);
                }
            }
            else {
                NotionMantenedor_RelacionObjeto.className = "item_relacion_abrir";
                if (!NotionMantenedor_ValidarRelacion(Campo, 0, "")) {
                    if (alto == -2) {
                        tmpRel.style.height = "140px";
                    } else {
                        NotionMantenedor_AbrirRelacionListo_Efecto(alto, true);
                    }
                }
            }
        }
        else {
            NotionMantenedor_ValidarRelacion(Campo, 0, "");
        }
    }
    else {
        if (alto == -2) {
            tmpRel.style.height = "140px";
        } else {
            NotionMantenedor_AbrirRelacionListo_Efecto(alto, true);
        }
    }
}
function NotionMantenedor_FAbrirRelacionListo(alto, Campo, fx) {
    var tmpRel = document.getElementById("rel");
    tmpRel.style.display = "";
    tmpRel.focus();
    NotionMantenedor_RelacionFuncion = fx;
    listen("keydown", tmpRel, function (e) { var tmpEvt = e; try { fx(tmpEvt); } catch (ex) { } });
    //tmpRel.
    if (NotionMantenedor_RelacionObjeto != null) {
        if (NotionMantenedor_RelacionObjeto.className == "item_relacion_abriendoborrar") {
            NotionMantenedor_RelacionObjeto.className = "item_relacion_borrar";
            NotionMantenedor_AbrirRelacionListo_Efecto(alto, true);
        }
        else {
            NotionMantenedor_RelacionObjeto.className = "item_relacion_abrir";
            if (!NotionMantenedor_FValidarRelacion(Campo, 0, "")) {
                NotionMantenedor_AbrirRelacionListo_Efecto(alto, true);
            }
        }
    }
    else {
        NotionMantenedor_AbrirRelacionListo_Efecto(alto, true);
    }
}
function NotionMantenedor_AbrirRelacionListo_Efecto(alto, typ) {
    var tmpRel = document.getElementById("rel");
    if (alto = -2) {
        if (typ) {
            tmpRel.style.height = "140px";
        } else {
            tmpRel.style.display = "none";
        }
    } else {
        var tmpAlt = tmpRel.style.height + "";
        var tmpRet;
        tmpAlt = parseFloat(tmpAlt.replace("px", ""));
        if (typ) {
            if ((tmpAlt + 10) > alto) {
                tmpRel.style.height = alto;
            }
            else {
                try { tmpRel.style.height = tmpAlt + 10; } catch (ex) { }
                setTimeout(function () { NotionMantenedor_AbrirRelacionListo_Efecto(alto, typ); }, 10);
            }
        }
        else {
            if ((tmpAlt - 10) < 10) {
                tmpRel.style.display = "none";
            }
            else {
                tmpRel.style.height = tmpAlt - 10;
                setTimeout(function () { NotionMantenedor_AbrirRelacionListo_Efecto(alto, typ); }, 10);
            }
        }
    }
}
function NotionMantenedor_AbrirRelacionOcultar() {
    removeEvent(document.getElementById("rel"), "keydown", NotionMantenedor_RelacionFuncion);
    NotionMantenedor_AbrirRelacionListo_Efecto(0, false);
    if (NtAccion == "lst") {
        NotionMantenedor_FValidarRelacion(NotionMantenedor_RelacionCampo, 0, null);
    }
    else {
        NotionMantenedor_ValidarRelacion(NotionMantenedor_RelacionCampo, 0, null);
    }
}
/*function NotionMantenedor_AbrirRelacionSeleccionado(Valor, Texto, Campo)
{
    var tmpEvn = document.createEventObject();
    if (NtAccion == "mul") {
        NotionManenedor_ObjRea.value = Texto;
        NotionManenedor_ObjTxt.value = Texto;
        NotionManenedor_ObjMan.value = Valor;
        NotionManenedor_ObjTxt.fireEvent("onblur", tmpEvn);
    } else {
        document.getElementById("rea" + Campo).value = Texto;
        document.getElementById("txt" + Campo).value = Texto;
        document.getElementById("man" + Campo).value = Valor;
        document.getElementById("txt" + Campo).fireEvent("onblur", tmpEvn);
    }
    NotionMantenedor_AbrirRelacionOcultar();
}
function NotionMantenedor_FAbrirRelacionSeleccionado(Valor, Texto, Campo) {
    var tmpEvn = document.createEventObject();
    document.getElementById("filrea" + Campo).value = Texto;
    document.getElementById("filtxt" + Campo).value = Texto;
    document.getElementById("filman" + Campo).value = Valor;
    document.getElementById("filtxt" + Campo).fireEvent("onblur", tmpEvn)
    NotionMantenedor_AbrirRelacionOcultar();
}*/


function NotionMantenedor_AbrirRelacionSeleccionado(Valor, Texto, Campo) {
    var tmpEvn = jQuery.Event("onblur");

    if (NtAccion == "mul") {
        NotionManenedor_ObjRea.value = Texto.trim();
        NotionManenedor_ObjTxt.value = Texto.trim();
        NotionManenedor_ObjMan.value = Valor;
        jQuery(NotionManenedor_ObjTxt).trigger(tmpEvn);
    } else {
        jQuery("#rea" + Campo).val(Texto.trim());
        jQuery("#txt" + Campo).val(Texto.trim());
        jQuery("#man" + Campo).val(Valor);
        jQuery("#txt" + Campo).trigger(tmpEvn);
    }
    NotionMantenedor_AbrirRelacionOcultar();
}
function NotionMantenedor_FAbrirRelacionSeleccionado(Valor, Texto, Campo) {
    //var tmpEvn = document.createEventObject();
    var tmpEvn = jQuery.Event("onblur");
    //document.getElementById("filrea" + Campo).value = Texto;
    //document.getElementById("filtxt" + Campo).value = Texto;
    //document.getElementById("filman" + Campo).value = Valor;
    jQuery("#filrea" + Campo).val(Texto);
    jQuery("#filtxt" + Campo).val(Texto);
    jQuery("#filman" + Campo).val(Valor);
    //document.getElementById("filtxt" + Campo).fireEvent("onblur", tmpEvn);
    jQuery("#filtxt" + Campo).trigger(tmpEvn);
    NotionMantenedor_AbrirRelacionOcultar();
}



function NotionMantenedor_ValidarObligatorios() {
    var tmpRet = true;
    var tmpBlk;
    var tmpVal;
    var tmpCom;
    if (typeof (NtEstructura) != "undefined") {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].obligatorio == "1") {
                try {
                    tmpBlk = (document.getElementById("man" + NtEstructura[tmpInt].id).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display == "");
                }
                catch (ex) { tmpBlk = true; }
                if (tmpBlk) {
                    try {
                        tmpBlk = (document.getElementById("man" + NtEstructura[tmpInt].id).parentNode.parentNode.parentNode.parentNode.style.display == "");
                    }
                    catch (ex) { tmpBlk = true; }
                    if (tmpBlk) {
                        try {
                            tmpBlk = (document.getElementById("man" + NtEstructura[tmpInt].id).parentNode.parentNode.parentNode.parentNode.parentNode.style.display == "");
                        }
                        catch (ex) { tmpBlk = true; }
                        if ((tmpBlk) && (NtEstructura[tmpInt].typ == "4")) {
                            try {
                                tmpBlk = (document.getElementById("blk" + NtEstructura[tmpInt].id).parentNode.style.display == "");
                            }
                            catch (ex) { tmpBlk = true; }
                            if (tmpBlk) {
                                try {
                                    tmpBlk = (document.getElementById("blk" + NtEstructura[tmpInt].id).style.display == "");
                                }
                                catch (ex) { tmpBlk = true; }
                                if (tmpBlk) {
                                    try {
                                        tmpBlk = (document.getElementById("blk" + NtEstructura[tmpInt].id).parentNode.parentNode.style.display == "");
                                    }
                                    catch (ex) { tmpBlk = true; }
                                }
                            }
                        } else if (tmpBlk) {
                            try {
                                tmpBlk = (document.getElementById("man" + NtEstructura[tmpInt].id).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display == "");
                            }
                            catch (ex) { tmpBlk = true; }
                        }
                    }
                }
                if (document.getElementById("man" + NtEstructura[tmpInt].id)) {
                    if (tmpBlk) {
                        /*
                        if (NtEstructura[tmpInt].typ == "7") {
                            tmpVal = NtgetRadioValue("rad" + NtEstructura[tmpInt].id);
                            if (tmpVal == "") {
                                if (NtEstructura[tmpInt].etiqueta == "") {
                                    alert("El campo '" + NtEstructura[tmpInt].id + "' es obligatorio");
                                }
                                else {
                                    alert("El campo '" + NtEstructura[tmpInt].etiqueta + "' es obligatorio");
                                }
                                try {
                                    document.getElementById("man" + NtEstructura[tmpInt].id).focus();
                                } catch (ex) { }
                                tmpRet = false;
                                break;
                            } else {
                                document.getElementById("man" + NtEstructura[tmpInt].id).value = tmpVal;
                            }
                        } else {
                        */
                        tmpCom = false;
                        if (NtEstructura[tmpInt].typ == "5") {
                            if (document.getElementById("txt" + NtEstructura[tmpInt].id).value != document.getElementById("rea" + NtEstructura[tmpInt].id).value) {
                                tmpCom = true;
                            } if (document.getElementById("txt" + NtEstructura[tmpInt].id).value == "") {
                                tmpCom = true;
                            }
                        } else {
                            if (document.getElementById("man" + NtEstructura[tmpInt].id).value == "" || document.getElementById("man" + NtEstructura[tmpInt].id).value == "|") {
                                tmpCom = true;
                            }
                        }
                        if (tmpCom) {
                            if (NtEstructura[tmpInt].etiqueta == "") {
                                alert("El campo '" + NtEstructura[tmpInt].id + "' es obligatorio");
                            }
                            else {
                                alert("El campo '" + NtEstructura[tmpInt].etiqueta + "' es obligatorio");
                            }
                            try {
                                document.getElementById("man" + NtEstructura[tmpInt].id).focus();
                            } catch (ex) { }
                            tmpRet = false;
                            break;
                        }
                        //}
                    }
                }
            }
        }
    }
    return tmpRet;
}

function isDefined(variable) {
    return (typeof (window[variable]) == "undefined") ? false : true;
}
function NtgetRadioValue(nom) {
    var tmpObj = document.getElementsByName(nom);
    var tmpVal = "";
    for (var tmpInt = 0; tmpInt < tmpObj.length; tmpInt++) {
        if (tmpObj[tmpInt].checked) {
            tmpVal = tmpObj[tmpInt].value;
            break;
        }
    }
    return tmpVal;
}
function NotionMantenedor_LimpiarDiccionario(Campo) {
    var tmpPri;
    var tmpSec;
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].id + "" == Campo + "") {
            tmpPri = NtEstructura[tmpInt].mantenedor + "@";
            tmpSec = NtEstructura[tmpInt].etiqueta + "$";
            for (var tmpHlp = 0; tmpHlp < NtDiccionario.length; tmpHlp++) {
                if (NtDiccionario[tmpHlp].key.indexOf(tmpPri) > -1) {
                    NtDiccionario[tmpHlp].val = "";
                } else if (NtDiccionario[tmpHlp].key.indexOf(tmpSec) > -1) {
                    NtDiccionario[tmpHlp].val = "";
                }
            }
        }
    }
}
function NotionMantenedor_LimpiarRelacion(Campo, Iteracion) {
    var tmpVue = Iteracion + 1;
    var tmpCam;
    NotionMantenedor_LimpiarDiccionario(Campo)
    if (tmpVue < 32) {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].cascada == Campo) {
                tmpCam = NtEstructura[tmpInt].id;
                NotionMantenedor_LimpiarDiccionario(tmpCam)
                document.getElementById("txt" + tmpCam).style.color = "";
                document.getElementById("txt" + tmpCam).value = "";
                document.getElementById("man" + tmpCam).value = "0";
                document.getElementById("rea" + tmpCam).value = "";
                NotionMantenedor_LimpiarRelacion(tmpCam, tmpVue);
            }
        }
    }
    else {
        alert("Se ha detectado referencia circular en las cascadas");
    }
}

function NotionMantenedor_ValidarRelacionMultiple(Campo, Tipo) {
    if (Tipo == 0) {
        NotionMantenedor_FormulasRelacionMultiple(Campo);
    }
}
function NotionMantenedor_BuscarMultiple(Nombre) {
    var tmpRet = null;
    for (var tmpInt = 0; tmpInt < NotionManenedor_ObjLst.length; tmpInt++) {
        if (NotionManenedor_ObjLst[tmpInt].name == Nombre) {
            tmpRet = NotionManenedor_ObjLst[tmpInt];
            break;
        }
    }
    return tmpRet;
}
function NotionMantenedor_PadreMultiple(Obj) {
    var tmpObj = Obj;
    var tmpCnt = 2;
    while (true) {
        tmpObj = tmpObj.parentNode;
        if (tmpObj.nodeName == "TR") {
            tmpCnt--;
            if (tmpCnt == 0) {
                break;
            }
        }
    }
    NotionManenedor_ObjPad = tmpObj;
    NotionManenedor_ObjLst = new Array();
    NotionMantenedor_HijosMultiple(tmpObj);
    NotionManenedor_ObjLst = NotionManenedor_ObjLst;
}
function NotionMantenedor_HijosMultiple(Obj) {
    var tmpObj;
    for (var tmpInt = 0; tmpInt < Obj.childNodes.length; tmpInt++) {
        tmpObj = Obj.childNodes[tmpInt];
        if (tmpObj.nodeName == "INPUT") {
            NotionManenedor_ObjLst[NotionManenedor_ObjLst.length] = tmpObj;
        } else {
            NotionMantenedor_HijosMultiple(tmpObj);
        }
    }
}

function NotionMantenedor_FormulasMultiple(Padre) {
    var tmpObj;
    var tmpTmp;
    if (Padre) {
        NotionMantenedor_PadreMultiple(Padre);
    } else {
        NotionMantenedor_PadreMultiple(event.srcElement);
    }
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if ((NtEstructura[tmpInt].formula != "") && (NtEstructura[tmpInt].formula.indexOf("(!@") != 0)) {
            tmpTmp = NotionMantenedor_FormulasResolverMultiple(NtEstructura[tmpInt]);
            if (tmpTmp.indexOf("(!") == -1) {
                tmpObj = NotionMantenedor_BuscarMultiple("man" + NtEstructura[tmpInt].id);
                tmpObj.value = tmpTmp;
            }
        }
    }
}
function NotionMantenedor_FormulasResolverMultiple(campo) {
    var tmpTmp = campo.formula;
    var tmpEnt;
    var tmpVar;
    var tmpOrg;
    var tmpAnt;
    var tmpObj;
    var tmpPrv;
    var tmpVal;
    /*
    //Constantes
    tmpTmp = Replace(tmpTmp, "(!NtRegistro)", NtRegistro);
    if (tmpTmp.indexOf("(!NtUser)") > -1) {
        tmpTmp = Replace(tmpTmp, "(!NtUser)", NtUser);
        if (campo) {
            if (campo.rel == "sys_usuarios") {
                document.getElementById("txt" + campo.id).value = NtUserN;
                document.getElementById("rea" + campo.id).value = NtUserN;
            }
        }
    }
    //Diccionario NtUser
    if (tmpTmp.indexOf("(!NtUser:") > -1) {
        tmpVar = tmpTmp.substring(2);
        tmpVar = tmpVar.substring(0, tmpVar.length - 1);
        tmpEnt = NotionMantenedor_ValorDiccionario(tmpVar);
        tmpTmp = Replace(tmpTmp, "(!" + tmpVar + ")", tmpEnt.val);
        document.getElementById("txt" + campo.id).value = tmpEnt.txt;
        document.getElementById("rea" + campo.id).value = tmpEnt.val;
    }
    if (tmpTmp.indexOf("NtUser:") > -1) {
        tmpVar = tmpTmp;
        tmpEnt = NotionMantenedor_ValorDiccionario(tmpVar);
        if (tmpEnt) {
            tmpTmp = Replace(tmpTmp, tmpVar, tmpEnt.val);
            document.getElementById("txt" + campo.id).value = tmpEnt.txt;
            document.getElementById("rea" + campo.id).value = tmpEnt.val;
        }
    }
    */
    //Campos hermanos
    if (tmpTmp.indexOf("(!") > -1) {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (tmpTmp.indexOf("(!" + NtEstructura[tmpInt].etiqueta + ")") > -1) {
                tmpVal = NotionMantenedor_BuscarMultiple("man" + NtEstructura[tmpInt].id).value;
                if (NtEstructura[tmpInt].typ == "3") {
                    tmpTmp = Replace(tmpTmp, "[(!" + NtEstructura[tmpInt].etiqueta + ")]", "{" + tmpVal + "}");
                }
                tmpTmp = Replace(tmpTmp, "(!" + NtEstructura[tmpInt].etiqueta + ")", tmpVal);
            }
        }
    }
    /*
    if (tmpTmp.indexOf("($") > -1) {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].typ == "7") {
                tmpObj = document.getElementById("man" + NtEstructura[tmpInt].id);
                if (tmpObj.options) {
                    if (tmpObj.selectedIndex == -1) tmpAnt = ""; else tmpAnt = tmpObj.options[tmpObj.selectedIndex].cal + "";
                    while (tmpAnt.indexOf(".") > -1) tmpAnt = tmpAnt.replace(".", NtRegion.sepdec);
                    if (tmpAnt == "undefined") tmpAnt = "";
                    tmpTmp = Replace(tmpTmp, "[($" + NtEstructura[tmpInt].etiqueta + ")]", "{" + tmpAnt + "}");
                    tmpTmp = Replace(tmpTmp, "($" + NtEstructura[tmpInt].etiqueta + ")", tmpAnt);
                } else if (NtEstructura[tmpInt].opc) {
                    for (var tmpSub = 0; tmpSub < NtEstructura[tmpInt].opc.length; tmpSub++) {
                        if (NtEstructura[tmpInt].opc[tmpSub].key == tmpObj.value) {
                            tmpTmp = Replace(tmpTmp, "[($" + NtEstructura[tmpInt].etiqueta + ")]", "{" + NtEstructura[tmpInt].opc[tmpSub].val + "}");
                            tmpTmp = Replace(tmpTmp, "($" + NtEstructura[tmpInt].etiqueta + ")", NtEstructura[tmpInt].opc[tmpSub].val);
                        }
                    }
                }
            }
        }
    }
    */
    //Campos de los relacionados
    //if (sololocal == true) {
    //    tmpPrv = document.getElementById("man" + campo.id).value;
    //} else {
    if (NtPadre == "") {
        if (campo.typ == "5") {
            for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
                if ("(!" + NtDiccionario[tmpPri].key + ")" == tmpTmp) {
                    tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
                    document.getElementById("txt" + campo.id).value = NtDiccionario[tmpPri].txt;
                    document.getElementById("rea" + campo.id).value = NtDiccionario[tmpPri].val;
                }
            }
        } else if (campo.typ == "1") {
            for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
                if ("(!" + NtDiccionario[tmpPri].key + ")" == tmpTmp) {
                    if (NtDiccionario[tmpPri].typ == "relacion") {
                        tmpTmp = NtDiccionario[tmpPri].txt;
                        document.getElementById("man" + campo.id).value = NtDiccionario[tmpPri].txt;
                    }
                    break;
                }
            }
        }
        tmpAnt = document.getElementById("man" + campo.id).value;
        for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
            if ((campo.typ == "1") && (NtDiccionario[tmpPri].txt != "!!!")) {
                tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
            } else {
                tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
            }
            if ((campo.typ == "5") && (tmpTmp == "")) {
                tmpTmp = tmpAnt;
                break;
            }
        }
    }
    for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
        if (tmpTmp.indexOf(NtDiccionario[tmpPri].key) > -1) {
            if ((campo.typ == "1") && (NtDiccionario[tmpPri].txt != "!!!")) {
                if (NtDiccionario[tmpPri].val == "0") {
                    tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", "");
                } else {
                    if ((NtDiccionario[tmpPri].typ == "textline") || (NtDiccionario[tmpPri].typ == "relacion")) {
                        tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", "¬¬" + NtDiccionario[tmpPri].txt);
                    } else {
                        tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].txt);
                    }
                }
            } else {
                if (NtDiccionario[tmpPri].typ == "textline") {
                    tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", "¬¬" + NtDiccionario[tmpPri].val);
                } else if ((NtDiccionario[tmpPri].typ == "relacion") && (tmpTmp == "(!" + NtDiccionario[tmpPri].key + ")")) {
                    document.getElementById("txt" + campo.id).value = NtDiccionario[tmpPri].txt;
                    document.getElementById("rea" + campo.id).value = NtDiccionario[tmpPri].val;
                    tmpTmp = NtDiccionario[tmpPri].val;
                    break;
                } else {
                    tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
                }
            }
        }
    }
    //}
    //Operaciones
    if ((campo.typ == "1") || (campo.typ == "3")) {
        while ((tmpTmp.indexOf("[") > -1) && (tmpTmp.indexOf("]") > -1)) {
            tmpVar = tmpTmp.substring(1 + tmpTmp.indexOf("["), tmpTmp.indexOf("]"));
            tmpOrg = tmpVar;
            if (tmpVar == "") tmpVar = 0;
            if (!IsNumeric(tmpVar)) tmpVar = 0;
            tmpTmp = tmpTmp.replace("[" + tmpOrg + "]", tmpVar);
        }
        while ((tmpTmp.indexOf("{") > -1) && (tmpTmp.indexOf("}") > -1)) {
            tmpVar = tmpTmp.substring(1 + tmpTmp.indexOf("{"), tmpTmp.indexOf("}"));
            tmpOrg = tmpVar;
            while (tmpVar.indexOf(NtRegion.sepmil) > -1) tmpVar = tmpVar.replace(NtRegion.sepmil, "");
            tmpVar = tmpVar.replace(NtRegion.sepdec, ".");
            if (tmpVar == "") tmpVar = 0;
            if (!IsNumeric(tmpVar)) tmpVar = 0;
            tmpTmp = tmpTmp.replace("{" + tmpOrg + "}", tmpVar);
        }
        try {
            eval("tmpTmp = " + tmpTmp + "; ");
            tmpTmp = tmpTmp + "";
            tmpTmp = tmpTmp.replace(".", NtRegion.sepdec);
        }
        catch (ex) {
            tmpTmp = tmpTmp;
        }
    }
    //Limpiar Fechas
    /*
    if (campo.typ == "4") {
        if (tmpTmp == "01-01-1900") tmpTmp = "";
        else if (tmpTmp == "01-01-1900 00:00:00") tmpTmp = "";
    }
    */
    //Limpiar Formulas de hijos
    /*
    if ((NtAccion == "add") || (NtAccion == "edt")) {
        if (tmpTmp.indexOf("Count(&apos;") == 0) tmpTmp = document.getElementById("man" + campo.id).value;
    }
    */
    //MONTHNAME
    /*
    if ((NtAccion == "add") || (NtAccion == "edt")) {
        if (tmpTmp.indexOf("MONTHNAME(") > -1) {
            tmpVar = tmpTmp.indexOf("MONTHNAME(");
            tmpVar = tmpTmp.substring(10 + tmpVar, tmpTmp.indexOf(")", 1 + tmpVar));
            tmpVar = tmpVar.replace("\'", "");
            tmpVar = tmpVar.replace("'", "");
            tmpVar = tmpVar.replace("&apos;", "");
            if ((tmpVar == "01/01/1900 00:00:00") || (tmpVar == "")) {
                tmpOrg = "";
            } else {
                tmpOrg = MONTHNAME(parseFloat(tmpVar.substring(3, 5)));
            }
            tmpTmp = tmpTmp.replace("MONTHNAME(\'" + tmpVar + "\')", tmpOrg);
            tmpTmp = tmpTmp.replace("MONTHNAME('" + tmpVar + "')", tmpOrg);
            tmpTmp = tmpTmp.replace("MONTHNAME(&apos;" + tmpVar + "&apos;)", tmpOrg);
            tmpTmp = tmpTmp.replace("MONTHNAME(" + tmpVar + ")", tmpOrg);
        }
    }
    while (tmpTmp.indexOf("¬¬") != -1) tmpTmp = tmpTmp.replace("¬¬", "");
    if (sololocal == true) {
        if (tmpTmp.indexOf("(!") != -1) tmpTmp = tmpPrv;
    }
    if (tmpTmp.indexOf("Now()") > -1) {
        var tmpNow = new Date();
        switch (NtRegion.dat) {
            case "dd/MM/yyyy": tmpOrg = Llenar("0", tmpNow.getDate(), 2) + "/" + Llenar("0", (tmpNow.getMonth() + 1), 2) + "/" + tmpNow.getFullYear(); break;
        }
        tmpOrg += " " + Llenar("0", tmpNow.getHours(), 2) + ":" + Llenar("0", tmpNow.getMinutes(), 2) + ":" + Llenar("0", tmpNow.getSeconds(), 2);
        tmpTmp = tmpTmp.replace("Now()", tmpOrg);
    }
    */
    //Year
    /*
    if ((NtAccion == "add") || (NtAccion == "edt")) {
        if (tmpTmp.indexOf("Year(") > -1) {
            tmpVar = tmpTmp.indexOf("Year(");
            tmpVar = tmpTmp.substring(5 + tmpVar, tmpTmp.indexOf(")", 1 + tmpVar));
            tmpVar = tmpVar.replace("\'", "");
            tmpVar = tmpVar.replace("'", "");
            tmpVar = tmpVar.replace("&apos;", "");
            if ((tmpVar == "01/01/1900 00:00:00") || (tmpVar == "")) {
                tmpOrg = "";
            } else {
                tmpOrg = tmpVar.substring(6, 10);
            }
            tmpTmp = tmpTmp.replace("Year(\'" + tmpVar + "\')", tmpOrg);
            tmpTmp = tmpTmp.replace("Year('" + tmpVar + "')", tmpOrg);
            tmpTmp = tmpTmp.replace("Year(&apos;" + tmpVar + "&apos;)", tmpOrg);
            tmpTmp = tmpTmp.replace("Year(" + tmpVar + ")", tmpOrg);
        }
    }
    */
    if ((tmpTmp + "_") == "NaN_") { tmpTmp = 0; }
    if ((tmpTmp + "_") == "Infinity_") { tmpTmp = 0; }
    return tmpTmp;
}
function NotionMantenedor_FormulasRelacionMultiple(idx) {
    var tmpPro = "";
    var tmpTmp = "";
    if (NotionManenedor_ObjMan.value != "") {
        NotionMantenedor_FormulasMultiple(NotionManenedor_ObjMan);
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].formula.indexOf("(!@") > -1) {
                tmpTmp = NtEstructura[tmpInt].formula.substring(3, NtEstructura[tmpInt].formula.indexOf("@", 4));
                for (var tmpSub = 0; tmpSub < NtEstructura.length; tmpSub++) {
                    if (NtEstructura[tmpSub].etiqueta == tmpTmp) {
                        tmpTmp = NtEstructura[tmpSub].id + "";
                        tmpPro += tmpTmp + "_" + NtEstructura[tmpInt].id + "_" + NotionMantenedor_BuscarMultiple("man" + tmpTmp).value + "_";
                    }
                }
            }
        }
        document.getElementById("fra").src = "../../com/mantenedor/ajxhot.aspx?man=" + NtMantenedor + "&cam=" + idx + "&val=" + NotionMantenedor_BuscarMultiple("man" + idx).value + "&fld=" + Notion_Componentes_Mantenedor_ValorDiccionario(idx).mantenedor + "&rnd=" + NotionMantenedor_Aleatorio() + "&exl=" + idx + "&pro=" + tmpPro;
    }
}


function NotionMantenedor_ValidarRelacion(Campo, Tipo, Ejecutar, Forzar) {
    if (Notion_Componentes_Mantenedor_ValorDiccionario(Campo).rel == "sys_roles") return false;
    if (NtAccion == "mul") {
        NotionMantenedor_ValidarRelacionMultiple(Campo, Tipo);
        return true;
    }
    if (Tipo == 0) {
        if (event != null) {
            if (event.keyCode == 40) {

                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                document.getElementById("bor" + Campo).focus();
                NotionMantenedor_AbrirRelacion(Campo, document.getElementById("abr" + Campo));
                return;
            }
        }
        if (document.getElementById("rea" + Campo).value == document.getElementById("txt" + Campo).value) {
            if (document.getElementById("rea" + Campo).value != "") {
                document.getElementById("txt" + Campo).style.color = "";
                document.getElementById("rel").style.display = "none";
                return true;
            }
            else {
                document.getElementById("txt" + Campo).style.color = "#B8CCE4";
                return false;
            }
        }
        else {
            document.getElementById("txt" + Campo).style.color = "#B8CCE4";
            return false;
        }
    }
    else if (Tipo == 1) {
        if (document.getElementById("txt" + Campo).value != "") {
            if (Forzar) {
                document.getElementById("rea" + Campo).value = document.getElementById("txt" + Campo).value;
                document.getElementById("txt" + Campo).style.color = "";
                NotionMantenedor_FormulasRelacion(Campo);
            }
            else if (document.getElementById("rea" + Campo).value == document.getElementById("txt" + Campo).value) {
                document.getElementById("txt" + Campo).style.color = "";
                try {
                    NotionMantenedor_LimpiarRelacion(Campo, 0);
                    NotionMantenedor_FormulasRelacion(Campo);
                    ActualizarOcultamiento();
                    eval(NotionTextParse_ParseSft(Ejecutar));
                } catch (ex) { }
            }
            else {
                document.getElementById("txt" + Campo).style.color = "";
                NotionMantenedor_AbrirRelacion(Campo, null);
            }
        }
        else {
            document.getElementById("txt" + Campo).style.color = "";
            document.getElementById("man" + Campo).value = "0";
            document.getElementById("rea" + Campo).value = "";
            NotionMantenedor_LimpiarRelacion(Campo, 0);
            NotionMantenedor_FormulasRelacion(Campo);
            ActualizarOcultamiento();
        }
    }
}

function NotionMantenedor_FValidarRelacion(Campo, Tipo, Ejecutar) {
    if (Tipo == 0) {
        if (document.getElementById("filrea" + Campo).value == document.getElementById("filtxt" + Campo).value) {
            if (document.getElementById("filrea" + Campo).value != "") {
                document.getElementById("filtxt" + Campo).style.color = "";
                document.getElementById("rel").style.display = "none";
                return true;
            }
            else {
                document.getElementById("filtxt" + Campo).style.color = "#B8CCE4";
                return false;
            }
        }
        else {
            document.getElementById("filtxt" + Campo).style.color = "#B8CCE4";
            return false;
        }
    }
    else if (Tipo == 1) {
        if (document.getElementById("filtxt" + Campo).value != "") {
            if (document.getElementById("filrea" + Campo).value == document.getElementById("filtxt" + Campo).value) {
                document.getElementById("filtxt" + Campo).style.color = "";
                try {
                    eval(NotionTextParse_ParseSft(Ejecutar));
                } catch (ex) { }
            }
            else {
                document.getElementById("filtxt" + Campo).style.color = "";
                NotionMantenedor_FAbrirRelacion(Campo, null);
            }
        }
        else {
            document.getElementById("filtxt" + Campo).style.color = "";
            document.getElementById("filman" + Campo).value = "0";
            document.getElementById("filrea" + Campo).value = "";
        }
    }
}

//Varios
function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}
function Utils_Left(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft;
            obj = obj.offsetParent;
        }
    }
    else {
        if (obj.x) {
            curleft += obj.x;
        }
    }
    return (curleft);
}
function Utils_Top(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        }
    }
    else {
        if (obj.y) {
            curtop += obj.y;
        }
    }
    return (curtop);
}
function NotionMantenedor_ObtenerNombreSistema(valor) {
    var tmpPer = "abcdefghijklmnopqrstuvwxyz0123456789";
    var tmpRet = "";
    var tmpVal = valor.toLowerCase();
    tmpVal = tmpVal.replace("ñ", "n");
    tmpVal = tmpVal.replace("á", "a");
    tmpVal = tmpVal.replace("é", "e");
    tmpVal = tmpVal.replace("í", "i");
    tmpVal = tmpVal.replace("ó", "o");
    tmpVal = tmpVal.replace("ú", "u");
    for (var tmpInt = 0; tmpInt < tmpVal.length; tmpInt++) {
        if (tmpPer.indexOf(tmpVal.substring(tmpInt, tmpInt + 1)) != -1) {
            tmpRet += tmpVal.substring(tmpInt, tmpInt + 1);
        }
    }
    return tmpRet;
}
function NotionMantenedor_ValidarNombreSistema(objeto, largo) {
    var tmpLim;
    var tmpPas;
    tmpLim = NotionMantenedor_ObtenerNombreSistema(objeto.value);
    if (tmpLim.length > largo) tmpLim = tmpLim.substring(0, largo);
    objeto.value = tmpLim;
    return true;
}
function NotionMantenedor_ValidarTexto(obj, plantilla, pisar) {
    var tmpPla;
    var tmpPas = false;
    if (obj.value != "") {
        switch (plantilla) {
            case "E-mail":
                tmpPla = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                break;
            case "Url":
                tmpPla = /^http:\/\/\w+(\.\w+)*\.\w{2,3}$/;
                break;
            case "Rut":
                tmpPla = null;
                tmpPas = Valida_Rut(obj.value);
                if (tmpPas && pisar) {
                    obj.value = NotionMantenedor_ValidaRut_Formato;
                }
                break;
            default:
                try {
                    eval("tmpPla = " + plantilla + "; ")
                }
                catch (ex) {
                    tmpPla = null;
                    tmpPas = true;
                }
                break;
        }
        if (!((tmpPla == null) || (plantilla == ""))) {
            try {
                tmpPas = tmpPla.test(obj.value);
            }
            catch (ex) {
                tmpPas = false;
            }
        }
    } else {
        tmpPas = true;
    }
    if (tmpPas) {
        obj.style.color = "";
    }
    else {
        obj.style.color = "#FF0000";
    }
}
function getURLvar(var_name) {
    var re = new RegExp(var_name + "(?:=([^&]*))?", "i");
    var pm = re.exec(decodeURIComponent(location.search));
    if (pm === null) return undefined;
    return pm[1] || "";
}
function NotionMantenedor_ValidarDuplicados(ret, frm) {
    //if (NtAccion == "edt") {
    //    NotionMantencion_Accion_SaveC();
    //} else {
    if (ret == "" || getURLvar('too') == "398" || getURLvar('too') == "435") {
        if (frm == 0) NotionMantencion_Accion_SaveC();
    }
    else {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].campo == ret) {
                alert("El valor '" + document.getElementById("man" + NtEstructura[tmpInt].id).value + "' ya ha sido ingresado en el campo '" + NtEstructura[tmpInt].etiqueta + "'");
            }
        }
        if (frm == 0) NotionMantencion_Layer(false);

    }
    //}
}
function Valida_Rut(Valor) {
    var tmpstr = "";
    var intlargo = Valor;
    if (Valor.length > 0) {
        crut = Valor
        largo = crut.length;
        if (largo < 2) {
            return false;
        }
        for (i = 0; i < crut.length; i++) {
            if (crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-') {
                tmpstr = tmpstr + crut.charAt(i);
            }
        }
        rut = tmpstr;
        crut = tmpstr;
        largo = crut.length;
        if (largo > 2) {
            rut = crut.substring(0, largo - 1);
        }
        else {
            rut = crut.charAt(0);
        }
        dv = crut.charAt(largo - 1);
        if (rut == null || dv == null) {
            return false;
        }

        var dvr = '0';
        suma = 0;
        mul = 2;
        for (i = rut.length - 1; i >= 0; i--) {
            suma = suma + rut.charAt(i) * mul;
            if (mul == 7) {
                mul = 2;
            }
            else {
                mul++;
            }
        }
        res = suma % 11;
        if (res == 1) {
            dvr = 'k';
        }
        else if (res == 0) {
            dvr = '0';
        }
        else {
            dvi = 11 - res;
            dvr = dvi + "";
        }
        NotionMantenedor_ValidaRut_Formato = rut + '-' + dvr;
        if (dvr != dv.toLowerCase()) {
            return false;
        }
        return true;
    }
}
function NotionMantenedor_ValidarFecha_Plantilla(obj, plantilla, hora) {
    var tmpFil;
    var tmpRet = false;
    var tmpFec;
    var tmpHor;
    var tmpTem;
    var tmpHor;
    var tmpEls;
    var tmpVal = obj.value;
    if (plantilla == null) tmpTem = obj.format; else tmpTem = plantilla;
    if (hora == null) tmpHor = obj.time; else tmpHor = hora;
    switch (tmpTem) {
        case "dd mon yyyy":
            if (tmpVal.length < 11) {
                tmpRet = false;
            } else {
                tmpRet = esFechaValida(tmpVal.substring(0, 11), tmpTem)
                tmpEls = tmpVal.substring(12);
            }
            break;
        case "yy/MM/dd":
            if (tmpVal.length < 8) {
                tmpRet = false;
            } else {
                tmpRet = esFechaValida(tmpVal.substring(0, 8), tmpTem)
                tmpEls = tmpVal.substring(9);
            }
            break;
        case "MM-dd-yy":
            if (tmpVal.length < 8) {
                tmpRet = false;
            } else {
                tmpRet = esFechaValida(tmpVal.substring(0, 8), tmpTem)
                tmpEls = tmpVal.substring(9);
            }
            break;
        case "dd-MM-yy":
            if (tmpVal.length < 8) {
                tmpRet = false;
            } else {
                tmpRet = esFechaValida(tmpVal.substring(0, 8), tmpTem)
                tmpEls = tmpVal.substring(9);
            }
            break;
        case "dd.MM.yy":
            if (tmpVal.length < 8) {
                tmpRet = false;
            } else {
                tmpRet = esFechaValida(tmpVal.substring(0, 8), tmpTem)
                tmpEls = tmpVal.substring(9);
            }
            break;
        case "dd/MM/yyyy":
            if (tmpVal.length < 10) {
                tmpRet = false;
            } else {
                tmpRet = esFechaValida(tmpVal.substring(0, 10), tmpTem)
                tmpEls = tmpVal.substring(11);
            }
            break;
        default:
            alert("Formato incorrecto (" + tmpTem + ")");
            break;
        /*
        
                case "dd-MM-yyyy":
                case "dd/MM/yyyy":
                    tmpRet = esFechaValida(obj.value, plantilla)
                    break;
                case "HH:mm":
                    tmpRet = esHoraValidaHHmm(obj.value)
                    break;
                case "dd-MM-yyyy HH:mm":
                    if (obj.value.length == 16)
                    {
                        tmpFec = obj.value.substring(0, 10);
                        tmpHor = obj.value.substring(11, 16);
                        tmpRet = esFechaValida(tmpFec, "dd-MM-yyyy") && esHoraValidaHHmm(tmpHor);
                    }
                    break;
        */
    }
    if (tmpRet) {
        if ((tmpHor == "1") || (tmpHor == true)) {
            tmpRet = esHoraValidaHHmm(tmpEls);
        }
    }
    if (tmpRet) {
        obj.style.color = "";
    }
    else {
        obj.style.color = "#FF0000";
    }
}
function esHoraValidaHHmm(valor) {
    var patron = /^[0-9]{2,2}\:[0-9]{2,2}$/;
    var test2 = valor.split(':');
    var hok = parseInt(test2[0]) >= 0 && parseInt(test2[0]) < 24;
    var mok = parseInt(test2[1]) >= 0 && parseInt(test2[1]) < 60;
    if (patron.test(valor) && hok && mok) {
        return true;
    }
    else {
        return false;
    }
}
function esFechaValida(fecha, plantilla) {
    var dia;
    var mes;
    var ano;
    if (fecha != "") {
        switch (plantilla) {
            case "dd mon yyyy":
                if (!/^\d{2}\ \d{3}\ \d{4}$/.test(fecha)) return false;
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 6), 10);
                ano = parseInt(fecha.substring(7), 10);
                switch (mes) {
                    case "Ene": mes = 1; break;
                    case "Feb": mes = 2; break;
                    case "Mar": mes = 3; break;
                    case "Abr": mes = 4; break;
                    case "May": mes = 5; break;
                    case "Jun": mes = 6; break;
                    case "Jul": mes = 7; break;
                    case "Ago": mes = 8; break;
                    case "Sep": mes = 9; break;
                    case "Oct": mes = 10; break;
                    case "Nov": mes = 11; break;
                    case "Dic": mes = 12; break;
                }
                break;
            case "yy/MM/dd":
                if (!/^\d{2}\/\d{2}\/\d{2}$/.test(fecha)) return false;
                ano = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                dia = parseInt(fecha.substring(6, 8), 10);
                break;
            case "MM-dd-yy":
                if (!/^\d{2}\-\d{2}\-\d{2}$/.test(fecha)) return false;
                mes = parseInt(fecha.substring(0, 2), 10);
                dia = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 8), 10);
                break;
            case "dd-MM-yy":
                if (!/^\d{2}\-\d{2}\-\d{2}$/.test(fecha)) return false;
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 8), 10);
                break;
            case "dd.MM.yy":
                if (!/^\d{2}\.\d{2}\.\d{2}$/.test(fecha)) return false;
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 8), 10);
                break;
            case "dd/MM/yyyy":
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) return false;
                dia = parseInt(fecha.substring(0, 2), 10);
                mes = parseInt(fecha.substring(3, 5), 10);
                ano = parseInt(fecha.substring(6, 10), 10);
                break;
            default:
                alert("Formato incorrecto (" + plantilla + ")");
                break;
        }
        switch (mes) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                numDias = 31;
                break;
            case 4: case 6: case 9: case 11:
                numDias = 30;
                break;
            case 2:
                if (comprobarSiBisisesto(ano)) { numDias = 29 } else { numDias = 28 };
                break;
            default:
                return false;
        }
        if (dia > numDias || dia == 0) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

function comprobarSiBisisesto(anio) {
    if ((anio % 100 != 0) && ((anio % 4 == 0) || (anio % 400 == 0))) {
        return true;
    }
    else {
        return false;
    }
}

function NotionMantenedor_ValidarNumero(obj, decimales, forzar, miles, monto) {
    var tmpVal;
    var tmpCnt = 0;
    var tmpEnt;
    var tmpDec;
    var tmpErr = false;
    var tmpPer = "1234567890";
    var tmpTmp;
    var sepmil = NtRegion.sepmil;
    var sepdec = NtRegion.sepdec;
    var tmpNeg = false;
    if (obj) {
        tmpVal = obj.value;
    } else {
        tmpVal = monto + "";
    }
    tmpVal = tmpVal.replace(/^\s*|\s*$/g, "");
    if (tmpVal == "") {
        if (obj) obj.style.color = "";
    }
    else {
        if (tmpVal.substring(0, 1) == "-") {
            tmpNeg = true;
            tmpVal = tmpVal.substring(1);
        }
        if ((tmpVal.substring(0, 1) == sepmil) || (tmpVal.substring(0, 1) == sepdec)) {
            if (obj) obj.style.color = "#FF0000";
            return false;
        }
        for (var tmpInt = 0; tmpInt < tmpVal.length; tmpInt++) {
            tmpTmp = tmpVal.substring(tmpInt, tmpInt + 1);
            if (tmpTmp == sepdec) tmpCnt++;
            if (((tmpPer.indexOf(tmpTmp) == -1) && (tmpTmp != sepmil)) && (tmpTmp != sepdec)) {
                tmpErr = true;
                break;
            }
        }
        if (tmpErr) {
            if (obj) obj.style.color = "#FF0000";
        }
        else {
            if (tmpCnt == 0) {
                tmpCnt = 1;
                tmpVal += ",0";
            }
            else if (tmpCnt == 1) { }
            else {
                if (obj) obj.style.color = "#FF0000";
            }
            if (tmpCnt == 1) {
                tmpEnt = tmpVal.substring(0, tmpVal.indexOf(sepdec));
                tmpDec = tmpVal.substring(1 + tmpVal.indexOf(sepdec));
                while (tmpEnt.indexOf(sepmil) > -1) { tmpEnt = tmpEnt.replace(sepmil, ""); }
                if (esNumero(tmpEnt, sepmil) && esNumero(tmpDec, "")) {
                    if (obj) obj.style.color = "";
                }
                if (forzar) {
                    tmpEnt = NotionMantenedor_AgruparMiles(tmpEnt, miles, sepmil);
                    if (decimales == 0) {
                        if (obj) {
                            obj.value = tmpEnt;
                        } else {
                            return tmpEnt;
                        }
                    }
                    else if (tmpDec.length > decimales) {
                        if (obj) {
                            obj.value = tmpEnt + sepdec + tmpDec.substring(0, decimales);
                        } else {
                            return tmpEnt + sepdec + tmpDec.substring(0, decimales);
                        }
                    }
                    else {
                        while (tmpDec.length < decimales) {
                            tmpDec += "0";
                        }
                        if (obj) {
                            obj.value = tmpEnt + sepdec + tmpDec;
                        } else {
                            return tmpEnt + sepdec + tmpDec;
                        }
                    }
                }
                if (tmpNeg) {
                    if (obj) obj.value = "-" + obj.value;
                }
            }
            else {
                if (obj) obj.style.color = "#FF0000";
            }
        }
    }
}
function NotionMantenedor_AgruparMiles(valor, habilitar, separador) {
    var tmpRet = valor;
    var tmpPas = "";
    var tmpHlp = "";
    if (habilitar) {
        tmpRet = StrReverse(tmpRet);
        while (tmpRet.length > 3) {
            tmpPas += tmpRet.substring(0, 3) + ".";
            tmpHlp = tmpRet.substring(3, 255);
            tmpRet = tmpHlp;
        }
        tmpPas += tmpRet;
        tmpRet = StrReverse(tmpPas);
    }
    return tmpRet;
}
function esNumero(valor) {
    var tmpSep = false;
    var tmpTmp = "";
    var tmpCnt = 0;
    var tmpPer = "1234567890"
    for (var tmpInt = 0; tmpInt < valor.length; tmpInt++) {
        if (tmpPer.indexOf(valor.substring(tmpInt, tmpInt + 1)) == -1) {
            return false;
            break;
        }
    }
    return true;
}
function StrReverse(s) {
    // Invierte la cadena
    var i = s.length;
    var t = "";

    while (i > -1) {
        t = t + s.substring(i, i + 1);
        i--;
    }
    return t;
}
function NotionMantenedor_aExcel() {
    var tmpInt = NotionTable_CheckUnitario();
    var tmpRes = 0;
    var tmpObj = new Array();
    var tmpTbl = document.getElementById("tabla").tBodies[0];
    var tmpDel = document.getElementById("del");
    if (tmpInt == 0) {
        alert("Seleccione los items que desea exportar");
    } else if (tmpInt == NotionMantencion_PaginadorRegistrosPPP) {
        if (confirm("Ha seleccionado todos los registros\n¿Desea expotar todas las páginas?\n\nSi, todas las páginas\nNo, sólo página actual")) {
            tmpRes = 2;
        } else {
            tmpRes = 1;
        }
    } else {
        tmpRes = 1;
    }
    if (tmpRes != 0) {
        document.getElementById("toi").value = tmpRes;
        document.forms[0].target = "fra";
        document.getElementById("acc").value = "xls";
        document.forms[0].submit();
        document.forms[0].target = "";
    }
}
function NotionMantenedor_Importar() {
    window.location = "../../sys/exc/imp.aspx?typ=imp&org=man&idx=" + NtMantenedor;
}
function NotionMantenedor_EditarMantenedor(idx, solucion) {
    window.location = "../../com/mantenedor/man.aspx?idx=" + idx;
}
function NotionMantenedor_EditarFormulario(idx, solucion) {
    window.location = "../../com/mantenedor/manfrm.aspx?idx=" + idx;
}
function Function_NtOnSave() {
    //OnSave Mantenedor
    var tmpRet = true;
    var tmpSav = "";
    var tmpCam;
    var tmpVis = "";
    var tmpVld;
    try {
        tmpSav = NotionTextParse_ParseRealSft(NtOnSave);
    }
    catch (ex) {
        tmpSav = "";
    }
    if (tmpSav != "") {
        try {
            tmpRet = eval(tmpSav);
        }
        catch (ex) {
            if (ex.name == "TypeError") {
                tmpRet = true;
            } else {
                //alert("Problemas al ejecutar Script\n\n" + ex + "\n\n\nData: " + tmpSav);
                tmpRet = true;
            }
        }
        return tmpRet;
    }
    //Formato
    for (i = 0; i < document.forms[0].elements.length; i++) {
        if (document.forms[0].elements[i].name != null) {
            if (document.forms[0].elements[i].name.indexOf("man") == 0) {
                tmpVis = "";
                if (tmpVis == "") try { tmpVis = document.forms[0].elements[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display; } catch (ex) { tmpVis = ""; }
                if (tmpVis == "") try { tmpVis = document.forms[0].elements[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display; } catch (ex) { tmpVis = ""; }
                if (tmpVis != "none") {
                    switch (document.forms[0].elements[i].type) {
                        case "textarea":
                        case "text":
                            if ((document.forms[0].elements[i].style.color == "#ff0000") && (document.forms[0].elements[i].value != "   ")) {
                                tmpCam = Notion_Componentes_Mantenedor_ValorDiccionario(document.forms[0].elements[i].name.substring(3));
                                switch (tmpCam.typ) {
                                    case "4": //fecha
                                        if (document.forms[0].elements[i].value != "") {
                                            alert("El valor del campo '" + tmpCam.etiqueta + "' no es válido");
                                            return false;
                                        }
                                        break;
                                    default:
                                        alert("El valor del campo '" + tmpCam.etiqueta + "' no es válido");
                                        return false;
                                        break;
                                }
                            }
                            break;
                    }
                }
            }
        }
    }
    return NotionMantencion_Validaciones();
}
function Notion_Componentes_Mantenedor_ValorDiccionario(id) {
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].id == parseInt(id)) {
            return NtEstructura[tmpInt];
            break;
        }
    }
    return null;
}
function NtGetObj(etiqueta) {
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].etiqueta == etiqueta) {
            return document.getElementById("man" + NtEstructura[tmpInt].id);
            break;
        }
    }
    return null;
}
function Notion_Componentes_Mantenedor_ValorDiccionario_Etiqueta(etiqueta) {
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].etiqueta == etiqueta) {
            return NtEstructura[tmpInt];
            break;
        }
    }
    return null;
}

function Notion_Helper_AbrirPopUp(id, url, scroll, resizable, w, h) {
    try {
        var tmpWin = window.open(url, id, "scrollbars=" + scroll + ",resizable=" + resizable + ",width=" + w + ",height=" + h + ",status=no,location=no,toolbar=no");
    } catch (ex) {
        var tmpStr = "";
        tmpStr += "dialogHeight:" + h + "px; ";
        tmpStr += "dialogWidth:" + w + "px; ";
        tmpStr += "resizable:" + resizable + "px; ";
        window.showModalDialog(url, "", tmpStr);
    }
}
function Notion_Helper_AbrirPopUp_etapa(id, url, scroll, resizable, w, h) {
    // se modifica el js para poder descargar el excel con etapa
    try {
        var etapa = document.getElementById("filman61348").value;
        var proyecto = document.getElementById("filtxt81993").value;
        url = url + "?etapa=" + etapa + "&proyecto=" + proyecto;
        var tmpWin = window.open(url, id, "scrollbars=" + scroll + ",resizable=" + resizable + ",width=" + w + ",height=" + h + ",status=no,location=no,toolbar=no");
    } catch (ex) {
        var tmpStr = "";
        tmpStr += "dialogHeight:" + h + "px; ";
        tmpStr += "dialogWidth:" + w + "px; ";
        tmpStr += "resizable:" + resizable + "px; ";
        window.showModalDialog(url, "", tmpStr);
    }
}

function Notion_Helper_AbrirPopUp_variable(id, url, scroll, resizable, w, h) {
    // se modifica el js para poder descargar el excel con etapa
    var proyecto = "";
    var fech_desde = "";
    var fech_hasta = "";
    var etapa = "";
    try {
        if (document.getElementById("ter66428").style.display != "none") {
            etapa = document.getElementById("filtxt66428").value;
        }
        if (document.getElementById("ter66415").style.display != "none") {
            proyecto = document.getElementById("filtxt66415").value;
        }

        if (document.getElementById("ter65671").style.display != "none") {
            fech_desde = document.getElementById("filman65671d").value;
            fech_hasta = document.getElementById("filman65671h").value;
        }


        url = url + "?etapa=" + etapa + "&proyecto=" + proyecto + "&fdesde=" + fech_desde + "&fhasta=" + fech_hasta;
        var tmpWin = window.open(url, id, "scrollbars=" + scroll + ",resizable=" + resizable + ",width=" + w + ",height=" + h + ",status=no,location=no,toolbar=no");
    } catch (ex) {
        var tmpStr = "";
        tmpStr += "dialogHeight:" + h + "px; ";
        tmpStr += "dialogWidth:" + w + "px; ";
        tmpStr += "resizable:" + resizable + "px; ";
        window.showModalDialog(url, "", tmpStr);
    }
}
function Notion_Helper_AbrirPopUp_escrituracion(id, url, scroll, resizable, w, h) {
    // se modifica el js para poder descargar el excel con etapa y fecha desde para proyección

    var fech_desde = "";
    var etapa = "";

    try {

        etapa = document.getElementById("filtxt" + IdCampo("Etapa")).value;

        fech_desde = document.getElementById("filman" + IdCampo("Periodo Promesa") + "d").value;

        url = url + "?etapa=" + etapa + "&fdesde=" + fech_desde;
        var tmpWin = window.open(url, id, "scrollbars=" + scroll + ",resizable=" + resizable + ",width=" + w + ",height=" + h + ",status=no,location=no,toolbar=no");
    } catch (ex) {
        var tmpStr = "";
        tmpStr += "dialogHeight:" + h + "px; ";
        tmpStr += "dialogWidth:" + w + "px; ";
        tmpStr += "resizable:" + resizable + "px; ";
        window.showModalDialog(url, "", tmpStr);
    }
}
function Notion_Helper_AbrirPopUp_reserva(id, url, scroll, resizable, w, h) {
    // se modifica el js para poder descargar el excel con etapa
    var proyecto = "";
    var tipo_unidad = "";
    var etapa = "";
    try {

        etapa = document.getElementById("filtxt" + IdCampo("Etapa")).value;
        proyecto = document.getElementById("filtxt" + IdCampo("Proyecto")).value;
        tipo_unidad = document.getElementById("filtxt" + IdCampo("Tipo Unidad")).value;

        url = url + "?etapa=" + etapa + "&proyecto=" + proyecto + "&tipounidad=" + tipo_unidad;
        var tmpWin = window.open(url, id, "scrollbars=" + scroll + ",resizable=" + resizable + ",width=" + w + ",height=" + h + ",status=no,location=no,toolbar=no");
    } catch (ex) {
        var tmpStr = "";
        tmpStr += "dialogHeight:" + h + "px; ";
        tmpStr += "dialogWidth:" + w + "px; ";
        tmpStr += "resizable:" + resizable + "px; ";
        window.showModalDialog(url, "", tmpStr);
    }
}

function Notion_Helper_AbrirPopUp_medios(id, url, scroll, resizable, w, h) {
    // se modifica el js para poder descargar el excel con etapa
    var proyecto = "";
    var etapa = "";
    var fech_desde = "";
    var fech_hasta = "";
    var medios = "";
    try {

        if (document.getElementById("ter" + IdCampo("Etapa")).style.display != "none") {
            etapa = document.getElementById("filtxt" + IdCampo("Etapa")).value;
        }
        if (document.getElementById("ter" + IdCampo("Proyecto")).style.display != "none") {
            proyecto = document.getElementById("filtxt" + IdCampo("Proyecto")).value;
        }
        if (document.getElementById("ter" + IdCampo("Medios")).style.display != "none") {
            medios = document.getElementById("filtxt" + IdCampo("Medios")).value;
        }
        if (document.getElementById("ter" + IdCampo("Fecha de registro")).style.display != "none") {
            fech_desde = document.getElementById("filman" + IdCampo("Fecha de registro") + "d").value;
            fech_hasta = document.getElementById("filman" + IdCampo("Fecha de registro") + "h").value;
        }


        url = url + "?etapa=" + etapa + "&proyecto=" + proyecto + "&medios=" + medios + "&fechad=" + fech_desde + "&fechah=" + fech_hasta;
        var tmpWin = window.open(url, id, "scrollbars=" + scroll + ",resizable=" + resizable + ",width=" + w + ",height=" + h + ",status=no,location=no,toolbar=no");
    } catch (ex) {
        var tmpStr = "";
        tmpStr += "dialogHeight:" + h + "px; ";
        tmpStr += "dialogWidth:" + w + "px; ";
        tmpStr += "resizable:" + resizable + "px; ";
        window.showModalDialog(url, "", tmpStr);
    }
}


function Notion_Helper_AbrirPopUp_proyecto(id, url, scroll, resizable, w, h) {
    // se modifica el js para poder descargar el excel con etapa
    try {
        var etapa = document.getElementById("filman" + IdCampo()).value;
        url = url + "?etapa=" + etapa;
        var tmpWin = window.open(url, id, "scrollbars=" + scroll + ",resizable=" + resizable + ",width=" + w + ",height=" + h + ",status=no,location=no,toolbar=no");
    } catch (ex) {
        var tmpStr = "";
        tmpStr += "dialogHeight:" + h + "px; ";
        tmpStr += "dialogWidth:" + w + "px; ";
        tmpStr += "resizable:" + resizable + "px; ";
        window.showModalDialog(url, "", tmpStr);
    }
}
function Notion_Helper_AbrirVentana(url) {
    if ((url != "http://") && (url != "mailto:")) window.open(url, "", "");
}
function Notion_Componentes_Mantenedor_RegenerarVista() {
    window.location = "../../com/mantenedor/manred.aspx?man=" + document.getElementById("ind").value;
}
function Notion_Componentes_Mantenedor_BusquedaAvanzada(campo) {
    var tmpObj = Notion_Componentes_Mantenedor_ValorDiccionario(campo);
    //var tmpCas = "" + document.getElementById("man" + campo).cascada;
    var tmpCas = "" + tmpObj.cascada;
    if (tmpCas != "") tmpCas = document.getElementById("man" + tmpCas).value;
    Notion_Helper_AbrirPopUp("nuevoregistro", "../../com/mantenedor/exebus.aspx?man=" + tmpObj.relacionado + "&cam=" + campo + "&cvl=" + tmpCas + "&cas=" + tmpObj.cascada + "&prd=" + document.getElementById("txt" + campo).value, "yes", "yes", 700, 500);
}
function Notion_Componentes_Mantenedor_Editar(campo) {
    var tmpObj = Notion_Componentes_Mantenedor_ValorDiccionario(campo);
    var tmpReg = document.getElementById("man" + campo).value;
    if (tmpReg != 0) Notion_Helper_AbrirPopUp("nuevoregistro", "exe.aspx?win=pop&fra=2&com=3&ind=" + tmpReg + "&man=" + tmpObj.relacionado + "&cam=" + campo, "yes", "yes", 700, 500);
}
function Notion_Componentes_Mantenedor_Navegar(campo) {
    var tmpObj = Notion_Componentes_Mantenedor_ValorDiccionario(campo);
    var tmpReg = document.getElementById("man" + campo).value;
    if (tmpReg != 0) Notion_Helper_AbrirPopUp("nuevoregistro", "exe.aspx?win=pop&fra=2&com=5&ind=" + tmpReg + "&man=" + tmpObj.relacionado + "&cam=" + campo, "yes", "yes", 700, 500);
}
function Notion_Componentes_Mantenedor_NuevoEmm(campo) {
    Notion_Helper_AbrirPopUp("nuevoregistro", "../../exe/emm/exe.aspx?&win=con&com=3&pad=" + NtRegistro + "&conbar=0&conalt=&cam=" + campo, "yes", "yes", 700, 500);
}
function Notion_Componentes_Mantenedor_NuevoRegistro(campo) {
    var tmpObj = Notion_Componentes_Mantenedor_ValorDiccionario(campo);
    Notion_Helper_AbrirPopUp("nuevoregistro", "exe.aspx?win=pop&man=" + tmpObj.relacionado + "&cam=" + campo + "&ext=add", "yes", "yes", 700, 500);
}
function Notion_Componentes_MantenedorBusqueda_Operador_OnChange() {
    var tmpEnc = true;
    var tmpCnt = 0;
    for (var tmpInt = 0; tmpInt < 13; tmpInt++) {
        if (document.getElementById("flbnxt" + tmpInt) == null) break;
        if (tmpEnc) {
            tmpCnt++;
            document.getElementById("flbrow" + tmpInt).className = "FiltroBusqueda_Principal";
            if (document.getElementById("flbnxt" + tmpInt).value == "") {
                tmpEnc = false;
            }
        }
        else {
            document.getElementById("flbnxt" + tmpInt).value = "";
            document.getElementById("flbrow" + tmpInt).className = "FiltroBusqueda";
        }
    }
    Notion_Componentes_MantenedorBusqueda_Size();
}

function Notion_Componentes_MantenedorBusqueda_Inicialziar(Rpp, Rgs) {
    NotionMantencion_PaginadorRegistrosPPP = Rpp;
    NotionMantencion_CantidadRegistros(Rgs);
    NotionMantencion_MostrarPaginador();
    Notion_Componentes_MantenedorBusqueda_Size();
    window.onresize = function () { Notion_Componentes_MantenedorBusqueda_Size(); };
}

function Notion_Componentes_MantenedorBusqueda_Size() {
    try {
        document.getElementById("contenedor").style.height = (document.documentElement.clientHeight - (24 + Utils_Top(document.getElementById("tabla")))) + "px";
        document.getElementById("tabla").style.width = (document.documentElement.clientWidth - 18) + "px";
    }
    catch (ex) {
    }
}


function Notion_Componentes_Mantenedor_BusquedaView(idx, man) {
    window.location = "../../com/mantenedor/exe.aspx?idx=" + man + "&com=5&ind=" + idx;
}
function Notion_Componentes_Mantenedor_BusquedaSeleccionar(idx) {
    document.getElementById("ind").value = idx;
    NotionMantencion_Accion("sel");
}
function Notion_Componentes_Mantenedor_BuscarListaKey(e, obj) {
    var tmpTcl = (document.all) ? e.keyCode : e.which;
    if (tmpTcl == 13) {
        Notion_Componentes_Mantenedor_BuscarLista();
        return false;
    }
    else {
        return true;
    }
}
function Notion_Componentes_Mantenedor_BuscarLista() {
    document.getElementById("acc").value = "";
    document.getElementById("ind").value = "";
    document.getElementById("pag").value = "0";
    document.forms[0].submit();

}
function Notion_Componentes_Mantenedor_ExportarPdfItem() {
    document.getElementById("acc").value = "pdf";
    document.forms[0].submit();
}
function Notion_Componentes_Mantenedor_ExportarXmlItem() {
    document.getElementById("acc").value = "xmlitm";
    document.forms[0].submit();
}
function Notion_Componentes_Mantenedor_ExportarXmlLista() {
    document.getElementById("acc").value = "xmllst";
    document.forms[0].submit();
}
function Notion_Componentes_Mantenedor_Item_ActualizarArchivo(Nombre, Valor) {
    var tmpExt = "";
    if (document.getElementById("img" + Nombre) != null) {
        if (Valor.indexOf(".") == -1) {
            tmpExt = "";
        }
        else {
            tmpExt = Valor.substring(1 + Valor.indexOf("."));
        }
        switch (tmpExt) {
            case "gif":
            case "peg":
            case "jpe":
            case "jpg":
            case "png":
                document.getElementById("img" + Nombre).src = "../../sln/" + Valor; break;
            case "txt":
                document.getElementById("img" + Nombre).src = "../../cmm/ico/bs_textFile.gif"; break;
            case "htm":
            case "xml":
            case "xsl":
            case "css":
            case "html":
            case "config":
                document.getElementById("img" + Nombre).src = "../../cmm/ico/page_world.png"; break;
            case "mp3":
            case "wav":
            case "wma":
            case "au":
            case "mid":
            case "ram":
            case "rm":
            case "snd":
            case "asf":
                document.getElementById("img" + Nombre).src = "../../cmm/ico/sound.png"; break;
            case "zip":
            case "tar":
            case "gz":
            case "rar":
            case "cab":
            case "tgz":
                document.getElementById("img" + Nombre).src = "../../cmm/ico/compress.png"; break;
            case "asp":
            case "wsh":
            case "js":
            case "vbs":
            case "aspx":
            case "cs":
            case "vb":
                document.getElementById("img" + Nombre).src = "../../cmm/ico/page_white_code.png"; break;
            default:
                document.getElementById("img" + Nombre).src = "../../cmm/ico/page_white.png"; break;
        }
    }
    console.log(document.getElementById("man" + Nombre).value);
    document.getElementById("man" + Nombre).value = Valor.substring(1 + Valor.lastIndexOf("/"));
    document.getElementById("lab" + Nombre).innerHTML = document.getElementById("man" + Nombre).value;
}


function NotionMantenedor_BuscarOpciones(idx) {
    Notion_Helper_AbrirPopUp("opcbus", "manopc.aspx?cam=" + idx, "yes", "yes", 700, 500);
}
//Funciones AJAX ******************************************************************************************************
function AjaxSQL(funcion, query, tipo) {
    //tipo -> 0 = scalar, 1 = table, 2 = nonquery
    var tmpSql = Replace(query, "+", "!pls");
    document.getElementById("fra").src = "../../com/mantenedor/ajxsql.aspx?fnc=" + funcion + "&typ=" + tipo + "&sql=" + escape(tmpSql);
}
//Funciones VB ********************************************************************************************************
function Replace(s, c, p) {
    // Reemplaza cadenas
    var t = s + "";
    while (t.indexOf(c) != -1) {
        t = t.replace(c, p);
    }
    return t;
}

function TinyMCE_SaveTrigger(element_id, html, body) {
    html = NotionTextParse_ParseHrd(html);
    document.getElementById("man" + element_id.substring(3)).value = html;
    return html;
}

var funImprimir;
function olap_imprimir() {
    var tmpTmp = funImprimir();
}

function Notion_Componentes_Mantenedor_LlamarXsl(identidad) {
    Notion_Helper_AbrirPopUp("Xsl_Win", "exexsl.aspx?man=" + document.getElementById("man").value + "&xsl=" + identidad + "&idx=" + NtRegistro, "yes", "yes", 1000, 600);
}

function Notion_Mantenedor_GadgetFiltro(obj, parametro) {
    if (document.getElementById("filpad").style.display == "none") {
        document.getElementById("filpad").style.display = "";
        obj.className = "bar2_des";
    } else {
        document.getElementById("filpad").style.display = "none";
        obj.className = "bar2_tex";
    }
    NotionMantenedorMedidasContenedor();
}
function NotionMantenedor_HidTool(obj) {
    if (obj.className == "tooGrpBody") {
        setTimeout(function () { obj.style.display = "none"; }, 300);
    } else {
        obj.parentNode.style.display = "none";
    }
}
function NotionMantenedor_HidTool_Ok(obj) {
    var tmpObj;
    if (obj.className == "tooGrpBody") {
        tmpObj = obj;
    } else {
        tmpObj = obj.parentNode;
    }
    tmpObj.style.display = "none";
}
function NotionMantenedor_ExeTool(idx, man, tipo, cantidad, parametros, reg, obj) {
    var tmpIdx = "";
    var tmpHij = "";
    var tmpUni = 0;
    var tmpCnt = 0;
    var tmpObj;
    var tmpPad;
    var tmpSub;
    var tmpPad;
    if (reg == "%%%") reg = NotionMantencion_LastToolGrp;
    if (tipo == "grupo") {
        if ((NtAccion == "lst") && (reg != null)) {
            NotionMantencion_LastToolGrp = reg;
            tmpObj = document.getElementById("spa" + idx);
            tmpPad = document.getElementById("tsp" + idx + "_" + reg);
        } else if ((NtAccion == "lst") && (reg == null)) {
            NotionMantencion_LastToolGrp = reg;
            tmpObj = document.getElementById("spa" + idx);
            tmpPad = document.getElementById("btt" + idx);
        } else {
            NotionMantencion_LastToolGrp = reg;
            tmpObj = document.getElementById("spa" + idx);
            if (obj.className == "frmButton") {
                tmpPad = obj;
            } else {
                tmpPad = document.getElementById("btt" + idx);
            }
        }
        if (tmpObj != null) {
            //tmpObj.style.left = Utils_Left(tmpPad) + 9;
            //tmpObj.style.top = Utils_Top(tmpPad) + 5;

            tmpObj.style.left = Utils_Left(tmpPad) + 3.5 + "px";
            tmpObj.style.top = Utils_Top(tmpPad) + 17 + "px";

            tmpObj.style.display = "";
            tmpObj.firstChild;

            setTimeout(function () {
                $(tmpObj).focus();
            }, 1);

            $(document).mouseup(function (e) {
                var container = $(tmpObj);
                if (!container.is(e.target)) {
                    container.hide();
                }
            });

            //tmpObj.onblur = function () { NotionMantenedor_HidTool(this); }
            //tmpObj.focus();
        }
    }
    else if (tipo == "sort") {
        Notion_Helper_AbrirPopUp("sorttool", "../../com/tool/sort.aspx?rxx=" + idx + "&" + window.location.href.substring(1 + window.location.href.indexOf("?")), "yes", "yes", 700, 500);
    }
    else if (tipo == "upload") {
        tmpSub = window.location.href.substring(1 + window.location.href.indexOf("?"));
        if (tmpSub.indexOf("man=") > -1) {
            Notion_Helper_AbrirPopUp("sorttool", "../../com/tool/upload.aspx?rnd=0&ttt=h&too=" + idx + "&acc=" + NtAccion + "&rgs=" + NtRegistro + "&" + window.location.href.substring(1 + window.location.href.indexOf("?")), "yes", "yes", 500, 300);
        } else {
            Notion_Helper_AbrirPopUp("sorttool", "../../com/tool/upload.aspx?rnd=0&ttt=l&man=" + NtMantenedor + "&too=" + idx + "&acc=" + NtAccion + "&rgs=" + NtRegistro + "&" + window.location.href.substring(1 + window.location.href.indexOf("?")), "yes", "yes", 500, 300);
        }
    }
    else if (tipo == "mergexls") {
        NotionMantenedor_ExeTool_MergeExcel(idx);
    }
    else {
        if (reg == null) {
            if (NtAccion == "lst") {
                for (i = 0; i < document.forms[0].elements.length; i++) {
                    if (document.forms[0].elements[i].name != "chk") {
                        if (document.forms[0].elements[i].type == "checkbox") {
                            if (document.forms[0].elements[i].checked) {
                                tmpCnt += 1;
                                tmpIdx += document.forms[0].elements[i].name.substring(3) + "_"
                                tmpUni = document.forms[0].elements[i].name.substring(3);
                            }
                        }
                    }
                }
                if ((tmpIdx == "") && ((tipo == "proceso") || (tipo == "sql"))) {
                    //nada
                }
                else if (tmpIdx == "") {
                    alert("Debe seleccionar al menos un registro");
                    return;
                } else {
                    tmpIdx = tmpIdx.substring(0, tmpIdx.length - 1);
                }
            }
            else {
                tmpIdx = NtRegistro;
            }
        }
        else {
            tmpIdx = reg;
        }

        if (idx !== 691)
            document.getElementById("toi").value = idx;

        switch (tipo) {
            case "proceso":
                Notion_Helper_AbrirPopUp("proceso", "../../com/tool/proceso.aspx?rxx=" + idx + "&rgs=" + tmpIdx + "&" + window.location.href.substring(1 + window.location.href.indexOf("?")), "yes", "yes", 700, 500);
            case "update":
                if (cantidad > 0) {
                    //Notion_Helper_AbrirPopUp("exetool", "../../com/mantenedor/exe.aspx?idx=" + man + "&com=1&too=" + idx + "&trs=" + tmpIdx + "&fra=0&acc=" + NtAccion, "yes", "yes", 700, 500);
                    Notion_Helper_AbrirPopUp("exetool", "../../com/mantenedor/exe.aspx?idx=" + man + "&com=1&too=" + idx + "&trs=" + tmpIdx + "&fra=0&acc=" + NtAccion + "&padUp=" + NtPadre + "&relUp=" + NtRelacionPadre + "", "yes", "yes", 700, 500);
                } else {
                    document.getElementById("fra").src = "../../com/mantenedor/exe.aspx?idx=" + man + "&com=1&too=" + idx + "&trs=" + tmpIdx + "&fra=1&acc=" + NtAccion;
                }
                break;
            case "mergepdf":
                NotionMantenedor_ExeTool_MergePDF(reg, idx);
                break;
            case "link":
                while (parametros.indexOf("(!NtMantenedor)") != -1) parametros = parametros.replace("(!NtMantenedor)", NtMantenedor);
                while (parametros.indexOf("(!NtPadre)") != -1) parametros = parametros.replace("(!NtPadre)", NtPadre);
                while (parametros.indexOf("(!NtRegistro)") != -1) parametros = parametros.replace("(!NtRegistro)", NtRegistro);
                while (parametros.indexOf("(!NtSeleccionados)") != -1) parametros = parametros.replace("(!NtSeleccionados)", tmpIdx);
                while (parametros.indexOf("(!NtUser)") != -1) parametros = parametros.replace("(!NtUser)", NtUser);
                if (NotionTable_CheckUnitario() == NotionMantencion_PaginadorRegistrosPPP) {
                    while (parametros.indexOf("(!NtTodos)") != -1) parametros = parametros.replace("(!NtTodos)", "1");
                } else {
                    while (parametros.indexOf("(!NtTodos)") != -1) parametros = parametros.replace("(!NtTodos)", "0");
                }
                if (parametros.indexOf("javascript:") == 0) {
                    eval(parametros.substring(11, 1024));
                } else {
                    if (idx == "468") {
                        Notion_Helper_AbrirPopUp_etapa("exetool", parametros, "yes", "yes", 700, 500);

                    } else if (idx == "484") {
                        Notion_Helper_AbrirPopUp_variable("exetool", parametros, "yes", "yes", 700, 500);
                    } else if (idx == "492" || idx == "494") {
                        Notion_Helper_AbrirPopUp_escrituracion("exetool", parametros, "yes", "yes", 700, 500);
                    } else if (idx == "493") {
                        Notion_Helper_AbrirPopUp_reserva("exetool", parametros, "yes", "yes", 700, 500);
                    } else if (idx == "495") {
                        Notion_Helper_AbrirPopUp_medios("exetool", parametros, "yes", "yes", 700, 500);
                    } else if (idx == "680") {
                        Notion_Helper_AbrirPopUp("exetool", parametros, "yes", "yes", 700, 500);
                        document.getElementById("toi").value = "";
                    } else {
                        parametros = parametros + "&randomalet=" + NotionMantenedor_Aleatorio();
                        Notion_Helper_AbrirPopUp("exetool", parametros, "yes", "yes", 700, 500);;
                    }

                }
                break;
            case "sav":
                NotionMantencion_Accion("sav");
                break;
            case "new":
                NotionMantencion_Accion("add");
                break;
            case "edt":
                NotionMantencion_Accion("edt");
                break;
            case "rellst":
                if (tmpUni > 0) {
                    if (tmpCnt == 1) {
                        Notion_Helper_AbrirPopUp("exetool", "../../com/mantenedor/exe.aspx?idx=" + parametros + "&pad=" + tmpUni + "&cam=-1&rea=0&mdh=1", "yes", "yes", 700, 500);
                    }
                    else {
                        alert("Debe seleccionar sólo un registro");
                    }
                }
                else {
                    if (reg == null) reg = NtRegistro;
                    Notion_Helper_AbrirPopUp("exetool", "../../com/mantenedor/exe.aspx?idx=" + parametros + "&pad=" + reg + "&cam=-1&rea=0&mdh=1", "yes", "yes", 700, 500);
                }
                break;
            case "relnew":
                if (reg == null) reg = NtRegistro;
                if (parametros.indexOf("sel=") == 0) parametros = parametros.substring(4);
                //Notion_Helper_AbrirPopUp("exetool", "../../com/mantenedor/exe.aspx?idx=" + parametros + "&pad=" + reg + "&cam=-1&rea=0&mdh=1&com=1&rlt=man&rel=" + NtMantenedor + "&hin=" + NtMantenedor + "&too=" + idx + "&tot=relnew", "yes", "yes", 700, 500);
                Notion_Helper_AbrirPopUp("exetool", "../../com/mantenedor/exe.aspx?idx=" + parametros + "&pad=" + reg + "&cam=-1&rea=0&mdh=1&com=1&rlt=man&rel=" + NtMantenedor + "&hin=" + NtMantenedor + "&too=" + idx + "&padUp=" + NtPadre + "&relUp=" + NtRelacionPadre + "&tot=relnew", "yes", "yes", 700, 500);
                break;
            case "busrel":
                NotionMantenedor_ExeTool_BuscarRelacionar(parametros, idx);
                break;
            case "emmreport":
                Notion_Helper_AbrirPopUp("exetool", "../../exe/emm/sum.aspx?man=" + NtMantenedor + "&rgs=" + tmpIdx, "no", "no", 1078, 560);
                break;
            case "map":
                Notion_Helper_AbrirPopUp("exetool", "../../com/tool/map.aspx?reg=" + tmpIdx + "&man=" + NtMantenedor + "&" + parametros, "yes", "yes", 700, 500);
                break;
            case "sql":
                while (parametros.indexOf("(!NtPadre)") != -1) parametros = parametros.replace("(!NtPadre)", NtPadre);
                while (parametros.indexOf("(!NtRegistro)") != -1) parametros = parametros.replace("(!NtRegistro)", NtRegistro);
                document.getElementById("fra").src = "../../com/tool/sql.aspx?qry=" + parametros;
                break;
            case "newdad":
                window.location = "../../com/tool/newdad.aspx?reg=" + tmpIdx + "&man=" + NtMantenedor + "&" + parametros;
                break;
            case "javascript":
                parametros = NotionTextParse_ParseSft(parametros);
                try {
                    eval(parametros);
                } catch (ex) {
                    alert("Error al ejecutar la herramienta\n\n" + ex);
                }
                break;
            case "editorhtml":
                if (tmpIdx.indexOf("_") > -1) {
                    alert("Por favor seleccione sólo un registro");
                } else {
                    Notion_Helper_AbrirPopUp("exeeditorhtml", "../../com/tool/editorhtml.aspx?reg=" + tmpIdx + "&man=" + NtMantenedor + "&par=" + parametros, "no", "yes", 1078, 560);
                }
                break;
            default:
                alert("Herramienta desconocida (" + tipo + ")");
                break;
        }
    }
}
function NotionMantenedor_ExeTool_MergeExcel(too) {
    var tmpInt = NotionTable_CheckUnitario();
    var tmpRes = 0;
    var tmpObj = new Array();
    var tmpTbl = document.getElementById("tabla").tBodies[0];
    var tmpDel = document.getElementById("del");
    if (tmpInt == 0) {
        alert("Seleccione los items que desea exportar");
    } else if (tmpInt == NotionMantencion_PaginadorRegistrosPPP) {
        if (confirm("Ha seleccionado todos los registros\n¿Desea expotar todas las páginas?\n\nSi, todas las páginas\nNo, sólo página actual")) {
            tmpRes = 2;
        } else {
            tmpRes = 1;
        }
    } else {
        tmpRes = 1;
    }
    if (tmpRes != 0) {
        alert("../../com/tool/mergexls.aspx?too=" + too + "&man=" + NtMantenedor + "toi=" + tmpRes);
        document.forms[0].target = "fra";
        alert(document.forms[0].action);
        document.forms[0].action = "../../com/tool/mergexls.aspx?too=" + too + "&man=" + NtMantenedor + "toi=" + tmpRes;
        document.forms[0].submit();
        document.forms[0].target = "";
        document.forms[0].action = "";
    }
}
function NotionMantenedor_ExeTool_BuscarRelacionar(parametros, idx) {
    Notion_Helper_AbrirPopUp("exetool", "about:blank", "yes", "yes", 900, 650);
    document.forms[0].target = "exetool";
    document.forms[0].action = "../../com/tool/busrel.aspx?too=" + idx + "&man=" + NtMantenedor + "&par=" + parametros + "&trs=" + NtRegistro;
    document.forms[0].submit();
    document.forms[0].target = "";
    document.forms[0].action = "";
}
function NotionMantenedor_ExeTool_MergePDF(reg, idx) {
    var tmpPri = 0;
    var tmpSec = 0;
    var tmpTmp;
    var tmpFrm;
    var tmpFra = new Array();
    var tmpIdx = "";
    var tmpMan;
    if (reg == null) {
        tmpIdx = NtMantenedor + ":" + NtRegistro + "_";
        while (true) {
            if (document.getElementById("pes_0_" + tmpSec + "_a") != null) {
                tmpPri = 0;
                while (true) {
                    if (document.getElementById("pes_" + tmpPri + "_" + tmpSec + "_a") != null) {
                        if (document.getElementById("_fra_" + tmpPri + "_" + tmpSec)) {
                            tmpFra[tmpFra.length] = "_fra_" + tmpPri + "_" + tmpSec;
                        }
                    }
                    else {
                        break;
                    }
                    tmpPri += 1;
                }
            }
            else {
                break;
            }
            tmpSec += 1;
        }
        for (tmpPri = 0; tmpPri < tmpFra.length; tmpPri++) {
            try {
                tmpFrm = null;
                if (document.getElementById(tmpFra[tmpPri]) != null) {
                    tmpTmp = eval("window." + tmpFra[tmpPri] + ".NtAccion");
                    if (tmpTmp == "lst") {
                        tmpMan = eval("window." + tmpFra[tmpPri] + ".NtMantenedor");
                        tmpFrm = eval("window." + tmpFra[tmpPri] + ".document.forms[0]");
                    }
                }
            }
            catch (ex) {
                tmpFrm = null;
            }
            if (tmpFrm != null) {
                for (i = 0; i < tmpFrm.elements.length; i++) {
                    if (tmpFrm.elements[i].name != "chk") {
                        if (tmpFrm.elements[i].type == "checkbox") {
                            if (tmpFrm.elements[i].checked) {
                                tmpIdx += tmpMan + ":" + tmpFrm.elements[i].name.substring(3) + "_"
                            }
                        }
                    }
                }
            }
        }
    }
    else {
        tmpIdx = NtMantenedor + ":" + reg + "_";
    }
    window.location = "../../com/tool/mergepdf.aspx?trs=" + tmpIdx + "&idx=" + idx;
}
function NotionMantenedor_ActualizarFrameMantenedor(man) {
    var tmpPri = 0;
    var tmpSec = 0;
    var tmpObj;
    while (true) {
        if (document.getElementById("pes_0_" + tmpSec + "_a") != null) {
            tmpPri = 0;
            while (true) {
                if (document.getElementById("pes_" + tmpPri + "_" + tmpSec + "_a") != null) {
                    tmpObj = document.getElementById("_fra_" + tmpPri + "_" + tmpSec);
                    if (tmpObj) {
                        if (tmpObj.src.indexOf("man=" + man)) {
                            tmpObj.src = tmpObj.src;
                        }
                    }
                }
                else {
                    break;
                }
                tmpPri += 1;
            }
        }
        else {
            break;
        }
        tmpSec += 1;
    }
}



function listen(event, elem, func) {
    if (elem.addEventListener)  // W3C DOM
        elem.addEventListener(event, func, false);
    else if (elem.attachEvent) { // IE DOM
        var r = elem.attachEvent("on" + event, func);
        return r;
    }
    else throw 'No es posible añadir evento';
}
function removeEvent(obj, evType, fn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(evType, fn, false);
    }
    else if (obj.detachEvent) {
        obj.detachEvent("on" + evType, fn);
    }
    else {
        obj['on' + evType] = function () { };
    }
}

function IsNumeric(sText) {
    var ValidChars = "0123456789.,";
    var IsNumber = true;
    var Char;
    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) IsNumber = false;
    }
    return IsNumber;
}

//SWFUpload
function SWFUpload_Download(Campo) {
    var tmpObj;
    if (document.getElementById("lab" + Campo).innerText != "") {
        //var tmpUrl = escape(document.getElementById("man" + Campo).value.substring(0, document.getElementById("man" + Campo).value.indexOf("|")));
        //document.getElementById("fra").src = "swfdow.aspx?loc=" + tmpUrl;
        document.getElementById("fra").src = "uplchk.aspx?fil=" + document.getElementById("man" + Campo).value.substring(0, document.getElementById("man" + Campo).value.indexOf("|")) + "&cam=" + Campo + "&reg=" + NtRegistro;
    }
}
function SWFUpload_Borrar(Campo) {
    var tmpObj;
    if (document.getElementById("lab" + Campo).innerText != "") {
        if (confirm("Se dispone a borrar el archivo\n\n¿Desea continuar?")) {
            tmpObj = document.getElementById("imgprv" + Campo);
            if (tmpObj != null) tmpObj.src = "swfprv.aspx";
            document.getElementById("lab" + Campo).innerText = "";
            document.getElementById("man" + Campo).value = "";
        }
    }
}
function SWFUpload_Instancia(Campo, Identidad, W, H) {
    var tmpIns = new SWFUpload({
        // Backend Settings
        upload_url: "../../com/mantenedor/swfupl.aspx",
        post_params: { "F": Campo, "I": Identidad, "W": W, "H": H },

        // File Upload Settings
        file_size_limit: "1024 MB",
        file_types: "*.*",
        file_types_description: "Todos los archivo",
        file_upload_limit: "0",

        // Event Handler Settings - these functions as defined in Handlers.js
        //  The handlers are not part of SWFUpload but are part of my website and control how
        //  my website reacts to the SWFUpload events.
        file_queue_error_handler: fileQueueError,
        file_dialog_complete_handler: fileDialogComplete,
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccess,
        upload_complete_handler: uploadComplete,

        // Button Settings
        button_image_url: "../../cmm/scr/swfupload/SmallSpyGlass.png",
        button_placeholder_id: "swfbot" + Campo,
        button_width: 18,
        button_height: 18,
        button_text: '<span class="button">Upload</span>',
        button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
        button_text_top_padding: 0,
        button_text_left_padding: 18,
        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
        button_cursor: SWFUpload.CURSOR.HAND,

        // Flash Settings
        flash_url: "../../cmm/scr/swfupload/swfupload.swf",

        custom_settings: {
            upload_target: "divFileProgressContainer"
        },

        // Debug Settings
        debug: false
    });
    return tmpIns;
}

function openFileDialog(id) {

    document.getElementById("filedata_" + id).click();
}

function Upload_file(inputFile) {

    var campo = $(inputFile).attr("data-campo");
    var identidad = $(inputFile).attr("data-identidad");

    //var w = $(inputFile).attr("data-w");
    //var h = $(inputFile).attr("data-h");

    var data = new FormData();

    data.append("Filedata", inputFile.files[0]);
    data.append("F", campo);
    data.append("I", identidad);

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            uploadSuccess2(null, xhttp.responseText);
        }
    };

    xhttp.open("POST", "../../com/mantenedor/swfupl.aspx", false);
    xhttp.send(data);
}

function uploadSuccess2(file, serverData) {

    var tmpObj;
    var tmpVar = { idx: 0, url: '', nom: '' };
    try {
        eval("tmpVar = " + serverData);
        tmpObj = document.getElementById("imgprv" + tmpVar.idx);
        if (tmpObj != null) tmpObj.src = "swfprv.aspx?w=100&h=100&loc=" + tmpVar.url;
        document.getElementById("lab" + tmpVar.idx).innerText = tmpVar.nom;
        document.getElementById("man" + tmpVar.idx).value = unescape(tmpVar.url) + "|" + tmpVar.nom;
    } catch (ex) {
        this.debug(ex);
    }
}

//Multiple Avanzado

function NotionMantenedor_MulPasarItem(idx, typ) {
    //0 - 1 a la izquierda
    //1 - 1 a la derecha
    //2 - * a la izquierda
    //3 - * a la derecha
    var tmpIzq = document.getElementById("sel" + idx)
    var tmpDer = document.getElementById("opc" + idx)
    var tmpStr = "";
    switch (typ + "") {
        case "0":
            if (tmpDer.selectedIndex != -1) {
                tmpIzq.options[tmpIzq.length] = new Option(tmpDer.options[tmpDer.selectedIndex].text, tmpDer.options[tmpDer.selectedIndex].value);
                tmpDer.options[tmpDer.selectedIndex] = null;
            }
            else {
                alert("Debe seleccionar un item");
            }
            break;
        case "1":
            if (tmpIzq.selectedIndex != -1) {
                tmpDer.options[tmpDer.length] = new Option(tmpIzq.options[tmpIzq.selectedIndex].text, tmpIzq.options[tmpIzq.selectedIndex].value);
                tmpIzq.options[tmpIzq.selectedIndex] = null;
            }
            else {
                alert("Debe seleccionar un item");
            }
            break;
        case "2":
            if (tmpDer.length > 0) {
                while (tmpDer.length > 0) {
                    tmpIzq.options[tmpIzq.length] = new Option(tmpDer.options[0].text, tmpDer.options[0].value);
                    tmpDer.options[0] = null;
                }
            }
            else {
                alert("La lista se encuentra vacía");
            }
            break;
        case "3":
            if (tmpIzq.length > 0) {
                while (tmpIzq.length > 0) {
                    tmpDer.options[tmpDer.length] = new Option(tmpIzq.options[0].text, tmpIzq.options[0].value);
                    tmpIzq.options[0] = null;
                }
            }
            else {
                alert("La lista se encuentra vacía");
            }
            break;
    }
    //Actualizar
    for (var tmpInt = 0; tmpInt < tmpIzq.length; tmpInt++) {
        tmpStr += tmpIzq.options[tmpInt].value + ",";
    }
    if (tmpStr != "") tmpStr = tmpStr.substring(0, tmpStr.length - 1);
    document.getElementById("man" + idx).value = tmpStr;
}


//TABs
var tmpSel = -1;
if (document.images) {
    NotionMantenedor_LightCache = new Image(2, 2);
    NotionMantenedor_LightCache.src = "../../cmm/img/tra.gif";
}
var preA = new Image(); preA.src = "../../cmm/img/a_left.gif";
var preB = new Image(); preB.src = "../../cmm/img/a_middle.gif";
var preC = new Image(); preC.src = "../../cmm/img/a_right.gif";
var preD = new Image(); preD.src = "../../cmm/img/p_left.gif";
var preE = new Image(); preE.src = "../../cmm/img/p_middle.gif";
var preG = new Image(); preG.src = "../../cmm/img/p_right.gif";


function NotionMantencion_NotificacionContenedor(url) {
    var tmpPri = 0;
    var tmpSec = 0;
    var tmpTmp;
    var tmpMed;
    while (true) {
        if (document.getElementById("pes_0_" + tmpSec + "_a") != null) {
            tmpPri = 0;
            while (true) {
                if (document.getElementById("pes_" + tmpPri + "_" + tmpSec + "_a") != null) {
                    tmpTmp = url + "";
                    tmpMed = "" + document.getElementById("_tab_" + tmpPri + "_" + tmpSec).url;
                    tmpMed = tmpMed.replace("../../", "");
                    if (tmpTmp.indexOf(tmpMed, 0) > -1) {
                        //alert(url);
                        document.getElementById("_fra_" + tmpPri + "_" + tmpSec).style.display = "";
                        document.getElementById("_msk_" + tmpPri + "_" + tmpSec).style.display = "none";
                        break;
                    }
                }
                else {
                    break;
                }
                tmpPri += 1;
            }
        }
        else {
            break;
        }
        tmpSec += 1;
    }
}
function tab_seleccionar(idx, pad) {
    var tmpInt = 0;
    tmpSel = -1;
    document.getElementById("pes_" + idx + "_" + pad + "_a").parentNode.parentNode.Act = -1;
    while (true) {
        if (document.getElementById("pes_" + tmpInt + "_" + pad + "_a") != null) {
            tab_destacar(tmpInt + "_" + pad, false);
        }
        else {
            break;
        }
        tmpInt += 1;
    }
    tmpSel = idx;
    //document.getElementById("pes_" + idx + "_" + pad + "_b").style.verticalAlign = "";
    document.getElementById("pes_" + idx + "_" + pad + "_a").parentNode.parentNode.Act = idx;
    document.getElementById("pes_" + idx + "_" + pad + "_a").style.backgroundImage = "url('../../cmm/img/p_left.gif')";
    document.getElementById("pes_" + idx + "_" + pad + "_b").style.backgroundImage = "url('../../cmm/img/p_middle.gif')";
    document.getElementById("pes_" + idx + "_" + pad + "_c").style.backgroundImage = "url('../../cmm/img/p_right.gif')";
    tmpInt = 0;
    while (true) {
        if (document.getElementById("_tab_" + tmpInt + "_" + pad) != null) {
            document.getElementById("_tab_" + tmpInt + "_" + pad).style.display = "none";
        }
        else {
            break;
        }
        tmpInt += 1;
    }
    document.getElementById("_tab_" + idx + "_" + pad).style.display = "";
    if (document.getElementById("_fra_" + idx + "_" + pad) != null) {
        if ((document.getElementById("_fra_" + idx + "_" + pad).src == "") || (document.getElementById("_fra_" + idx + "_" + pad).src == "about:blank")) {
            document.getElementById("_fra_" + idx + "_" + pad).style.display = "none";
            document.getElementById("_msk_" + idx + "_" + pad).style.display = "";
            document.getElementById("_fra_" + idx + "_" + pad).src = document.getElementById("_tab_" + idx + "_" + pad).url;
        }
    }
}
function tab_destacar(idx, sel) {
    var tmpDef = "" + document.getElementById("pes_" + idx + "_a").parentNode.parentNode.Act;
    if (tmpDef == "undefined") tmpDef = 0;
    if ((idx != tmpSel) && (tmpDef != idx.substr(0, idx.indexOf("_")))) {
        if (sel) {
            //document.getElementById("pes_" + idx + "_b").style.verticalAlign = "";
            document.getElementById("pes_" + idx + "_a").style.backgroundImage = "url('../../cmm/img/p_left.gif')";
            document.getElementById("pes_" + idx + "_b").style.backgroundImage = "url('../../cmm/img/p_middle.gif')";
            document.getElementById("pes_" + idx + "_c").style.backgroundImage = "url('../../cmm/img/p_right.gif')";
        }
        else {
            //document.getElementById("pes_" + idx + "_b").style.verticalAlign = "bottom";
            document.getElementById("pes_" + idx + "_a").style.backgroundImage = "url('../../cmm/img/a_left.gif')";
            document.getElementById("pes_" + idx + "_b").style.backgroundImage = "url('../../cmm/img/a_middle.gif')";
            document.getElementById("pes_" + idx + "_c").style.backgroundImage = "url('../../cmm/img/a_right.gif')";
        }
    }
}
function tab_setear(idx) {
    var tmpInt = 0;
    while (true) {
        if (document.getElementById("pes_" + tmpInt + "_a") != null) {
            if (document.getElementById("pes_" + tmpInt + "_a").real == idx) {
                //document.getElementById("pes_" + tmpInt + "_b").style.verticalAlign = "";
                document.getElementById("pes_" + tmpInt + "_a").style.backgroundImage = "url('../../cmm/img/p_left.gif')";
                document.getElementById("pes_" + tmpInt + "_b").style.backgroundImage = "url('../../cmm/img/p_middle.gif')";
                document.getElementById("pes_" + tmpInt + "_c").style.backgroundImage = "url('../../cmm/img/p_right.gif')";
                break;
            }
        }
        else {
            break;
        }
        tmpInt += 1;
    }
}

function NotionMantenedor_LimpiarCampo(idx) {
    Notion_Helper_AbrirPopUp("camclean", "../../com/mantenedor/camclean.aspx?cam=" + idx + "&man=" + NtPadre, "yes", "yes", 400, 300);
}
function NotionMantenedor_GenDateTimePart(idx) {
    Notion_Helper_AbrirPopUp("camdat", "../../com/mantenedor/camdat.aspx?cam=" + idx + "&man=" + NtPadre, "yes", "yes", 400, 300);
}
//Ejecucion 
function NotionMantenedor_EjecutarFormula(idx) {
    if (confirm("Se dispone a ejecuar la formula del campo " + document.getElementById("cel" + idx + "_5").innerText + "\n\n¿Desea continuar?")) {
        Notion_Helper_AbrirPopUp("funply", "../../sys/fun/ply.aspx?cam=" + idx, "yes", "yes", 800, 400);
    }
}
function NotionMantenedor_EjecutarRegla(pad, idx) {
    if (confirm("Se dispone a ejecuar la regla \n'" + document.getElementById("nmb" + idx).innerText + "'\n\n¿Desea continuar?")) {
        Notion_Helper_AbrirPopUp("rulply", "../../sys/fun/ply.aspx?pad=" + pad + "&typ=rul&idx=" + idx, "yes", "yes", 800, 400);
    }
}
function NotionMantenedor_EjecutarReglaTodas(pad) {
    if (confirm("Se dispone a ejecuar todas las reglas de la tabla\n\n¿Desea continuar?")) {
        Notion_Helper_AbrirPopUp("rulply", "../../sys/fun/ply.aspx?typ=rul&pad=" + pad, "yes", "yes", 800, 400);
    }
}

function NotionMantenedor_FormulasPadre() {
    var tmpPad;
    var tmpEst;
    var tmpTmp;
    var tmpAnt;
    var tmpObj;
    //if ((NtEstructura[tmpInt].exeedt && (NtAccion == "edt")) || (NtEstructura[tmpInt].exeadd && (NtAccion == "add"))) {
    //if ((NtAccion == "add") || (NtAccion == "edt")) {
    try {
        tmpPad = window.parent.NtMantenedorN;
        tmpEst = window.parent.NtEstructura;
    }
    catch (ex) { tmpPad = ""; }
    if ((tmpPad != "") && (tmpEst != null)) {
        tmpPad = "(!" + tmpPad + "@";
        for (var tmpInt = 0; tmpInt < tmpEst.length; tmpInt++) {
            tmpTmp = tmpPad + tmpEst[tmpInt].etiqueta + ")";
            for (var tmpSec = 0; tmpSec < NtEstructura.length; tmpSec++) {
                if ((NtEstructura[tmpSec].exeedt && (NtAccion == "edt")) || (NtEstructura[tmpSec].exeadd && (NtAccion == "add"))) {
                    if (NtEstructura[tmpSec].formula == tmpTmp) {
                        if (NtEstructura[tmpSec].rel != "") {
                            tmpObj = document.getElementById("man" + NtEstructura[tmpSec].id)
                            tmpAnt = tmpObj.value;
                            tmpObj.value = window.parent.document.getElementById("man" + tmpEst[tmpInt].id).value;
                            if ((tmpObj.value.indexOf("Count(") > -1) || (tmpObj.value.indexOf("Count(") > -1)) {
                                tmpObj.value = tmpAnt;
                            } else {
                                if (window.parent.document.getElementById("txt" + tmpEst[tmpInt].id) != null) document.getElementById("txt" + NtEstructura[tmpSec].id).value = window.parent.document.getElementById("txt" + tmpEst[tmpInt].id).value;
                                //NotionMantenedor_ValidarRelacion(NtEstructura[tmpSec].id, 1, null, true);
                                //NotionMantenedor_ValidarRelacion(NtEstructura[tmpSec].id, 1, true);
                            }
                        }
                        else {
                            document.getElementById("man" + NtEstructura[tmpSec].id).value = window.parent.document.getElementById("man" + tmpEst[tmpInt].id).value;
                        }
                    }
                }
            }
        }
    }
    try {
        window.parent.NotionMantenedor_Formulas(false, true);
    }
    catch (ex) { }
    //}
}
function NotionMantenedor_SetRadio(Id, Valor) {
    var tmpObj = document.getElementsByName("rad" + Id);
    if (tmpObj.length > 0) {
        for (var tmpInt = 0; tmpInt < tmpObj.length; tmpInt++) {
            tmpObj[tmpInt].checked = (tmpObj[tmpInt].value == Valor);
        }
    }
}
function NotionMantenedor_Formulas(forzar, desdehijo, excluir) {
    var tmpExe = "";
    var tmpObj;
    var tmpAnt;
    if (NtAccion == "mul") {
        NotionMantenedor_FormulasMultiple(event.srcElement);
        return false;
    }
    if (((NtAccion == "add") || (NtAccion == "edt")) || desdehijo) {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            //if ((NtEstructura[tmpInt].formula != "") && (NtEstructura[tmpInt].lectura == "0")) {
            if ((NtEstructura[tmpInt].formula != "") && (NtEstructura[tmpInt].formula.indexOf("(!@") != 0)) {
                if (NotionMantenedor_FormulasFiltro(tmpInt)) {
                    if (!((NtEstructura[tmpInt].formula.indexOf("Last(&apos;") > -1) || (NtEstructura[tmpInt].formula.indexOf("Sum(&apos;") > -1))) {
                        if ((forzar) || (desdehijo)) {
                            if (excluir != NtEstructura[tmpInt].id) {
                                tmpObj = document.getElementById("man" + NtEstructura[tmpInt].id);
                                tmpAnt = tmpObj.value;
                                tmpObj.value = NotionMantenedor_FormulasResolver(NtEstructura[tmpInt].formula, NtEstructura[tmpInt], desdehijo);
                                NotionMantenedor_SetRadio(NtEstructura[tmpInt].id, tmpObj.value);
                                if ((tmpObj.value.indexOf("Count(") > -1) || (tmpObj.value.indexOf("Last(") > -1)) {
                                    tmpObj.value = tmpAnt;
                                    NotionMantenedor_SetRadio(NtEstructura[tmpInt].id, tmpAnt);
                                } else {
                                    if (NtEstructura[tmpInt].typ == "3") {
                                        tmpExe = "" + document.getElementById("man" + NtEstructura[tmpInt].id).onblur;
                                        if (tmpExe.indexOf("NotionMantenedor_ValidarNumero") > -1) {
                                            tmpExe = tmpExe.substring(tmpExe.indexOf("NotionMantenedor_ValidarNumero"), 1 + tmpExe.indexOf(")", tmpExe.indexOf("{")));
                                            tmpExe = tmpExe.replace("this", "document.getElementById(\"man" + NtEstructura[tmpInt].id + "\")");
                                            eval(tmpExe);
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (excluir != NtEstructura[tmpInt].id) {
                                if ((NtEstructura[tmpInt].exeedt && (NtAccion == "edt")) || (NtEstructura[tmpInt].exeadd && (NtAccion == "add"))) {
                                    document.getElementById("man" + NtEstructura[tmpInt].id).value = NotionMantenedor_FormulasResolver(NtEstructura[tmpInt].formula, NtEstructura[tmpInt]);
                                    if (NtEstructura[tmpInt].typ == "3") {
                                        tmpExe = "" + document.getElementById("man" + NtEstructura[tmpInt].id).onblur;
                                        if (tmpExe.indexOf("NotionMantenedor_ValidarNumero") > -1) {
                                            tmpExe = tmpExe.substring(tmpExe.indexOf("NotionMantenedor_ValidarNumero"), 1 + tmpExe.indexOf(")", tmpExe.indexOf("{")));
                                            tmpExe = tmpExe.replace("this", "document.getElementById(\"man" + NtEstructura[tmpInt].id + "\")");
                                            eval(tmpExe);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function NotionMantenedor_FormulasFiltro(campo) {
    var tmpRet = true;
    var tmpFil;
    if (NtEstructura[campo].where != "") {
        tmpFil = NotionMantenedor_ProcesarFiltro(NtEstructura[campo].where);
        try {
            eval("tmpRet = (" + tmpFil + ");");
        }
        catch (ex) {
            tmpRet = false;
        }
    }
    NtEstructura[campo].id = NtEstructura[campo].id;
    return tmpRet;
}
function NotionMantenedor_ProcesarFiltro(Valor) {
    var tmpRet = "";
    var tmpStr;
    var tmpPri;
    var tmpSec;
    var tmpCnt = 0;
    var tmpUlt = 0;
    var tmpTmp = "";
    var tmpCam;
    tmpPri = Valor.split("//|");
    for (var tmpHl1 = 0; tmpHl1 < tmpPri.length; tmpHl1++) {
        tmpItm = tmpPri[tmpHl1];
        tmpCnt += 1;
        tmpSec = tmpItm.split("//,");
        tmpStr = "";
        //Abre Parentesis
        while (parseInt(tmpSec[0]) > tmpUlt) {
            tmpUlt += 1;
            tmpStr += "(";
        }
        if (tmpSec[1] != "0") {
            //Campo
            tmpCam = Notion_Componentes_Mantenedor_ValorDiccionario(tmpSec[1]);
            if (tmpCam != null) {
                switch (tmpCam.typ) {
                    case '0': //Archivo
                        tmpStr += "(document.getElementById(\"man" + tmpSec[1] + "\").value.replace(\"|\", \"\")";
                        break;
                    case '5': //Relacion
                        tmpStr += "(document.getElementById(\"txt" + tmpSec[1] + "\").value";
                        break;
                    default:
                        tmpStr += "(document.getElementById(\"man" + tmpSec[1] + "\").value";
                        break;
                }
            } else {
                tmpStr += "(document.getElementById(\"man" + tmpSec[1] + "\").value";
            }
            //Comparacion
            switch (tmpSec[2]) {
                case "1": tmpStr += " == "; break;
                case "2": tmpStr += " != "; break;
                case "3": tmpStr += " < "; break;
                case "4": tmpStr += " > "; break;
                case "5": tmpStr += " <= "; break;
                case "6": tmpStr += " >= "; break;
                //case "7" : tmpStr += " Like "; break;
                //case "8" : tmpStr += " Not Like "; break; 
            }
            //Valor
            tmpTmp = tmpSec[3];
            tmpStr += "\"" + tmpTmp + "\") ";
            /*
            Select Case Me.Campos.getByCampo(tmpSec(1)).Tipo
                Case Notion.Componentes.Mantenedor.TipoCampo.OpcionSimple
                    tmpStr += "'" & Notion.Utilidades.ParseSft(tmpSec(3)) & "'"
                Case Notion.Componentes.Mantenedor.TipoCampo.OpcionMultiple
                    tmpStr += "'%" & Notion.Utilidades.ParseSft(tmpSec(3)) & "%'"
                Case Notion.Componentes.Mantenedor.TipoCampo.Texto
                    If tmpSec(2) = "7" Or tmpSec(2) = "8" Then
                        tmpStr += "'%" & Notion.Utilidades.ParseSft(tmpSec(3)) & "%'"
                    Else
                        tmpStr += "'" & Notion.Utilidades.ParseSft(tmpSec(3)) & "'"
                    End If
                Case Notion.Componentes.Mantenedor.TipoCampo.Relacion
                    If tmpSec(3).IndexOf("NtUser:") <> -1 Then
                        tmpStr = tmpStr.Substring(0, tmpStr.Length - 2) & " In " & Notion.Utilidades.ObtenerRelacionUsuario(tmpSec(3).Substring(7))
                    Else
                        tmpStr += Notion.Utilidades.ParseSft(tmpSec(3))
                    End If
                Case Else
                    tmpTmp = Notion.Utilidades.ParseSft(tmpSec(3))
                    tmpTmp = tmpTmp.Replace("Now()", "GetDate()")
                    tmpTmp = tmpTmp.Replace("Now(", "dbo.app_Now(" & tmpSec(2).Trim() & ", ")
                    tmpStr += tmpTmp
            End Select
            */
        }
        else {
            //Personalizado
            //tmpStr += Me.Campos.getByCampo("!" & tmpSec(4)).Campo
        }
        while (parseInt(tmpSec[0]) < tmpUlt) {
            tmpUlt -= 1;
            tmpStr += ")";
        }
        if (tmpCnt != tmpPri.length) {
            //Logico
            if (tmpSec[5] == "1") {
                tmpStr += " && ";
            }
            else if (tmpSec[5] == "2") {
                tmpStr += " || ";
            }
        }
        tmpRet += tmpStr;
    }
    while (tmpUlt > 0) {
        tmpUlt -= 1;
        tmpRet += ")";
    }
    return tmpRet;
}
function NotionMantenedor_FormulasResolver(formula, campo, sololocal) {
    var tmpTmp = formula;
    var tmpEnt;
    var tmpVar;
    var tmpOrg;
    var tmpAnt;
    var tmpObj;
    var tmpPrv;
    //Top
    if (tmpTmp == "!") {
        if (sololocal != true) {
            tmpTmp = "0";
            NotionMantenedor_AbrirRelacionTop(campo);
        } else {
            tmpTmp = document.getElementById("man" + campo.id).value;
        }
    } else {
        //Constantes
        tmpTmp = Replace(tmpTmp, "(!NtRegistro)", NtRegistro);
        if (tmpTmp.indexOf("(!NtUser)") > -1) {
            tmpTmp = Replace(tmpTmp, "(!NtUser)", NtUser);
            if (campo) {
                if (campo.rel == "sys_usuarios") {
                    document.getElementById("txt" + campo.id).value = NtUserN;
                    document.getElementById("rea" + campo.id).value = NtUserN;
                }
            }
        }
        //Diccionario NtUser
        if (tmpTmp.indexOf("(!NtUser:") > -1) {
            tmpVar = tmpTmp.substring(2);
            tmpVar = tmpVar.substring(0, tmpVar.length - 1);
            tmpEnt = NotionMantenedor_ValorDiccionario(tmpVar);
            tmpTmp = Replace(tmpTmp, "(!" + tmpVar + ")", tmpEnt.val);
            document.getElementById("txt" + campo.id).value = tmpEnt.txt;
            document.getElementById("rea" + campo.id).value = tmpEnt.val;
        }
        if (tmpTmp.indexOf("NtUser:") > -1) {
            tmpVar = tmpTmp;
            tmpEnt = NotionMantenedor_ValorDiccionario(tmpVar);
            if (tmpEnt) {
                tmpTmp = Replace(tmpTmp, tmpVar, tmpEnt.val);
                document.getElementById("txt" + campo.id).value = tmpEnt.txt;
                document.getElementById("rea" + campo.id).value = tmpEnt.val;
            }
        }
        //Campos hermanos
        if (tmpTmp.indexOf("(!") > -1) {
            for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
                if (NtEstructura[tmpInt].typ == "3") {
                    tmpTmp = Replace(tmpTmp, "[(!" + NtEstructura[tmpInt].etiqueta + ")]", "{" + document.getElementById("man" + NtEstructura[tmpInt].id).value + "}");
                } else {
                    tmpTmp = Replace(tmpTmp, "(!" + NtEstructura[tmpInt].etiqueta + ")", document.getElementById("man" + NtEstructura[tmpInt].id).value);
                }
            }
        }
        if (tmpTmp.indexOf("($") > -1) {
            for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
                if (NtEstructura[tmpInt].typ == "7") {
                    tmpObj = document.getElementById("man" + NtEstructura[tmpInt].id);
                    if (tmpObj.options) {
                        if (tmpObj.selectedIndex == -1) tmpAnt = ""; else tmpAnt = tmpObj.options[tmpObj.selectedIndex].cal + "";
                        while (tmpAnt.indexOf(".") > -1) tmpAnt = tmpAnt.replace(".", NtRegion.sepdec);
                        if (tmpAnt == "undefined") tmpAnt = "";
                        tmpTmp = Replace(tmpTmp, "[($" + NtEstructura[tmpInt].etiqueta + ")]", "{" + tmpAnt + "}");
                        tmpTmp = Replace(tmpTmp, "($" + NtEstructura[tmpInt].etiqueta + ")", tmpAnt);
                    } else if (NtEstructura[tmpInt].opc) {
                        for (var tmpSub = 0; tmpSub < NtEstructura[tmpInt].opc.length; tmpSub++) {
                            if (NtEstructura[tmpInt].opc[tmpSub].key == tmpObj.value) {
                                tmpTmp = Replace(tmpTmp, "[($" + NtEstructura[tmpInt].etiqueta + ")]", "{" + NtEstructura[tmpInt].opc[tmpSub].val + "}");
                                tmpTmp = Replace(tmpTmp, "($" + NtEstructura[tmpInt].etiqueta + ")", NtEstructura[tmpInt].opc[tmpSub].val);
                            }
                        }
                    }
                }
            }
        }
        //Campos de los relacionados
        if (sololocal == true) {
            tmpPrv = document.getElementById("man" + campo.id).value;
        } else {
            if (NtPadre == "") {
                if (campo.typ == "5") {
                    for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
                        if ("(!" + NtDiccionario[tmpPri].key + ")" == tmpTmp) {
                            tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
                            document.getElementById("txt" + campo.id).value = NtDiccionario[tmpPri].txt;
                            document.getElementById("rea" + campo.id).value = NtDiccionario[tmpPri].val;
                        }
                    }
                } else if (campo.typ == "1") {
                    for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
                        if ("(!" + NtDiccionario[tmpPri].key + ")" == tmpTmp) {
                            if (NtDiccionario[tmpPri].typ == "relacion") {
                                tmpTmp = NtDiccionario[tmpPri].txt;
                                document.getElementById("man" + campo.id).value = NtDiccionario[tmpPri].txt;
                            }
                            break;
                        }
                    }
                }
                tmpAnt = document.getElementById("man" + campo.id).value;
                for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
                    if ((campo.typ == "1") && (NtDiccionario[tmpPri].txt != "!!!")) {
                        tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
                    } else {
                        tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
                    }
                    if ((campo.typ == "5") && (tmpTmp == "")) {
                        tmpTmp = tmpAnt;
                        break;
                    }
                }
            }
            for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
                if (tmpTmp.indexOf(NtDiccionario[tmpPri].key) > -1) {
                    if ((campo.typ == "1") && (NtDiccionario[tmpPri].txt != "!!!")) {
                        if (NtDiccionario[tmpPri].val == "0") {
                            tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", "");
                        } else {
                            if ((NtDiccionario[tmpPri].typ == "textline") || (NtDiccionario[tmpPri].typ == "relacion")) {
                                tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", "¬¬" + NtDiccionario[tmpPri].txt);
                            } else {
                                tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].txt);
                            }
                        }
                    } else {
                        if (NtDiccionario[tmpPri].typ == "textline") {
                            tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", "¬¬" + NtDiccionario[tmpPri].val);
                        } else if ((NtDiccionario[tmpPri].typ == "relacion") && (tmpTmp == "(!" + NtDiccionario[tmpPri].key + ")")) {
                            document.getElementById("txt" + campo.id).value = NtDiccionario[tmpPri].txt;
                            document.getElementById("rea" + campo.id).value = NtDiccionario[tmpPri].val;
                            tmpTmp = NtDiccionario[tmpPri].val;
                            break;
                        } else {
                            tmpTmp = Replace(tmpTmp, "(!" + NtDiccionario[tmpPri].key + ")", NtDiccionario[tmpPri].val);
                        }
                    }
                }
            }
        }
        //Operaciones
        if ((campo.typ == "1") || (campo.typ == "3")) {
            while ((tmpTmp.indexOf("[") > -1) && (tmpTmp.indexOf("]") > -1)) {
                tmpVar = tmpTmp.substring(1 + tmpTmp.indexOf("["), tmpTmp.indexOf("]"));
                tmpOrg = tmpVar;
                if (tmpVar == "") tmpVar = 0;
                if (!IsNumeric(tmpVar)) tmpVar = 0;
                tmpTmp = tmpTmp.replace("[" + tmpOrg + "]", tmpVar);
            }
            while ((tmpTmp.indexOf("{") > -1) && (tmpTmp.indexOf("}") > -1)) {
                tmpVar = tmpTmp.substring(1 + tmpTmp.indexOf("{"), tmpTmp.indexOf("}"));
                tmpOrg = tmpVar;
                while (tmpVar.indexOf(NtRegion.sepmil) > -1) tmpVar = tmpVar.replace(NtRegion.sepmil, "");
                tmpVar = tmpVar.replace(NtRegion.sepdec, ".");
                if (tmpVar == "") tmpVar = 0;
                if (!IsNumeric(tmpVar)) tmpVar = 0;
                tmpTmp = tmpTmp.replace("{" + tmpOrg + "}", tmpVar);
            }
            try {
                eval("tmpTmp = " + tmpTmp + "; ");
                tmpTmp = tmpTmp + "";
                tmpTmp = tmpTmp.replace(".", NtRegion.sepdec);
            }
            catch (ex) {
                tmpTmp = tmpTmp;
            }
        }
        //Limpiar Fechas
        if (campo.typ == "4") {
            if (tmpTmp == "01-01-1900") tmpTmp = "";
            else if (tmpTmp == "01-01-1900 00:00:00") tmpTmp = "";
        }
        //Limpiar Formulas de hijos
        if ((NtAccion == "add") || (NtAccion == "edt")) {
            if (tmpTmp.indexOf("Count(&apos;") == 0) tmpTmp = document.getElementById("man" + campo.id).value;
        }
        //MONTHNAME
        if ((NtAccion == "add") || (NtAccion == "edt")) {
            if (tmpTmp.indexOf("MONTHNAME(") > -1) {
                tmpVar = tmpTmp.indexOf("MONTHNAME(");
                tmpVar = tmpTmp.substring(10 + tmpVar, tmpTmp.indexOf(")", 1 + tmpVar));
                tmpVar = tmpVar.replace("\'", "");
                tmpVar = tmpVar.replace("'", "");
                tmpVar = tmpVar.replace("&apos;", "");
                if ((tmpVar == "01/01/1900 00:00:00") || (tmpVar == "")) {
                    tmpOrg = "";
                } else {
                    tmpOrg = MONTHNAME(parseFloat(tmpVar.substring(3, 5)));
                }
                tmpTmp = tmpTmp.replace("MONTHNAME(\'" + tmpVar + "\')", tmpOrg);
                tmpTmp = tmpTmp.replace("MONTHNAME('" + tmpVar + "')", tmpOrg);
                tmpTmp = tmpTmp.replace("MONTHNAME(&apos;" + tmpVar + "&apos;)", tmpOrg);
                tmpTmp = tmpTmp.replace("MONTHNAME(" + tmpVar + ")", tmpOrg);
            }
        }
        while (tmpTmp.indexOf("¬¬") != -1) tmpTmp = tmpTmp.replace("¬¬", "");
        if (sololocal == true) {
            if (tmpTmp.indexOf("(!") != -1) tmpTmp = tmpPrv;
        }
        if (tmpTmp.indexOf("Now()") > -1) {
            var tmpNow = new Date();
            switch (NtRegion.dat) {
                case "dd/MM/yyyy": tmpOrg = Llenar("0", tmpNow.getDate(), 2) + "/" + Llenar("0", (tmpNow.getMonth() + 1), 2) + "/" + tmpNow.getFullYear(); break;
            }
            tmpOrg += " " + Llenar("0", tmpNow.getHours(), 2) + ":" + Llenar("0", tmpNow.getMinutes(), 2) + ":" + Llenar("0", tmpNow.getSeconds(), 2);
            tmpTmp = tmpTmp.replace("Now()", tmpOrg);
        }
        //Year
        if ((NtAccion == "add") || (NtAccion == "edt")) {
            if (tmpTmp.indexOf("Year(") > -1) {
                tmpVar = tmpTmp.indexOf("Year(");
                tmpVar = tmpTmp.substring(5 + tmpVar, tmpTmp.indexOf(")", 1 + tmpVar));
                tmpVar = tmpVar.replace("\'", "");
                tmpVar = tmpVar.replace("'", "");
                tmpVar = tmpVar.replace("&apos;", "");
                if ((tmpVar == "01/01/1900 00:00:00") || (tmpVar == "")) {
                    tmpOrg = "";
                } else {
                    tmpOrg = tmpVar.substring(6, 10);
                }
                tmpTmp = tmpTmp.replace("Year(\'" + tmpVar + "\')", tmpOrg);
                tmpTmp = tmpTmp.replace("Year('" + tmpVar + "')", tmpOrg);
                tmpTmp = tmpTmp.replace("Year(&apos;" + tmpVar + "&apos;)", tmpOrg);
                tmpTmp = tmpTmp.replace("Year(" + tmpVar + ")", tmpOrg);
            }
        }
    }
    if ((tmpTmp + "_") == "NaN_") { tmpTmp = 0; }
    if ((tmpTmp + "_") == "Infinity_") { tmpTmp = 0; }
    return tmpTmp;
}
function Llenar(caracter, cadena, largo) {
    var tmpTmp = cadena + "";
    while (tmpTmp.length < largo) {
        tmpTmp = caracter + tmpTmp;
    }
    return tmpTmp;
}
function NotionMantenedor_FormulasRelacion(idx) {
    var tmpPro = "";
    var tmpTmp = "";
    if (document.getElementById("man" + idx).value != "") {
        NotionMantenedor_Formulas(true, false, idx);
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].formula.indexOf("(!@") > -1) {
                tmpTmp = NtEstructura[tmpInt].formula.substring(3, NtEstructura[tmpInt].formula.indexOf("@", 4));
                for (var tmpSub = 0; tmpSub < NtEstructura.length; tmpSub++) {
                    if (NtEstructura[tmpSub].etiqueta == tmpTmp) {
                        tmpTmp = NtEstructura[tmpSub].id + "";
                        tmpPro += tmpTmp + "_" + NtEstructura[tmpInt].id + "_" + document.getElementById("man" + tmpTmp).value + "_";
                    }
                }
            }
        }
        document.getElementById("fra").src = "../../com/mantenedor/ajxhot.aspx?man=" + NtMantenedor + "&cam=" + idx + "&val=" + document.getElementById("man" + idx).value + "&fld=" + Notion_Componentes_Mantenedor_ValorDiccionario(idx).mantenedor + "&rnd=" + NotionMantenedor_Aleatorio() + "&exl=" + idx + "&pro=" + tmpPro;
    }
}
function NotionMantenedor_FormulasRelacionCome(arr, exl, cmp) {
    var tmpPas;
    for (var tmpNew = 0; tmpNew < arr.length; tmpNew++) {
        tmpPas = false;
        for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
            if (NtDiccionario[tmpPri].key == arr[tmpNew].key) {
                NtDiccionario[tmpPri].val = arr[tmpNew].val;
                NtDiccionario[tmpPri].txt = arr[tmpNew].txt;
                tmpPas = true;
                break;
            }
        }
        if (!tmpPas) {
            NtDiccionario.push(arr[tmpNew]);
        }
    }
    if (cmp) {
        for (var tmpInt = 0; tmpInt < cmp.length; tmpInt++) {
            document.getElementById("man" + cmp[tmpInt].cmp).value = cmp[tmpInt].val;
        }
    }
    if (NtAccion == "mul") {
        NotionMantenedor_FormulasMultiple(NotionManenedor_ObjMan);
    } else {
        NotionMantenedor_Formulas(true, false, exl);
    }
}

function NotionMantenedor_ValorDiccionario(key) {
    var tmpRet = null;
    for (var tmpPri = 0; tmpPri < NtDiccionario.length; tmpPri++) {
        if (key == NtDiccionario[tmpPri].key) {
            tmpRet = NtDiccionario[tmpPri];
            break;
        }
    }
    return tmpRet;
}

function NotionMantenedor_PopUpDatosPadre() {
    var tmpEst;
    var tmpRel = "";
    var tmpIdx = "";
    var tmpNom = "";

    if ((NtAccion == "add") && (NtFEjecucion == 1)) {
        tmpEst = window.opener.NtEstructura;
        //Busco relacion
        for (var tmpPri = 0; tmpPri < tmpEst.length; tmpPri++) {
            if (tmpEst[tmpPri].id == NtRelacion) {
                tmpRel = tmpEst[tmpPri].cascada;
                break;
            }
        }
        //Busca tabla de relacion padre
        for (var tmpPri = 0; tmpPri < tmpEst.length; tmpPri++) {
            if (tmpEst[tmpPri].id == tmpRel) {
                tmpNom = tmpEst[tmpPri].rel;
                break;
            }
        }
        //Busca tabla de relacion hijo
        for (var tmpPri = 0; tmpPri < NtEstructura.length; tmpPri++) {
            if (NtEstructura[tmpPri].rel == tmpNom) {
                document.getElementById("man" + NtEstructura[tmpPri].id).value = window.opener.document.getElementById("man" + tmpRel).value;
                document.getElementById("rea" + NtEstructura[tmpPri].id).value = window.opener.document.getElementById("man" + tmpRel).value;
                document.getElementById("txt" + NtEstructura[tmpPri].id).value = window.opener.document.getElementById("txt" + tmpRel).value;
                break;
            }
        }
    }
}

//Agregar Multiple
function NotionMiniMantenedor_NAddItem() {
    var tmpTbl = document.getElementById("tabla");
    var tmpLst = tmpTbl.rows.length;
    var tmpBas = tmpTbl.rows[0];
    var tmpRow = tmpTbl.insertRow(tmpLst);
    var tmpCll;
    for (var tmpInt = 0; tmpInt < tmpBas.cells.length; tmpInt++) {
        tmpCll = tmpRow.insertCell(tmpInt);
        tmpCll.innerHTML = tmpBas.cells[tmpInt].innerHTML;
    }
}
function NotionMiniMantenedor_NDelItem() {
    var tmpInt = NotionTable_CheckUnitario();
    var tmpPas = false;
    var tmpObj = new Array();
    var tmpTbl = document.getElementById("tabla").tBodies[0];
    var tmpDel = document.getElementById("del");
    switch (tmpInt) {
        case 0:
            alert("Seleccione los items que desea eliminar");
            break;
        case 1:
            if (confirm("De dispone a quitar un item de la lista\n¿Desea continuar?")) {
                tmpPas = true;
            }
            break;
        default:
            if (confirm("De dispone a quitar " + tmpInt + " items de la lista\n¿Desea continuar?")) {
                tmpPas = true;
            }
            break;
    }
    if (tmpPas) {
        for (var tmpInt = 0; tmpInt < document.forms[0].elements.length; tmpInt++) {
            if (document.forms[0].elements[tmpInt].name != "chk") {
                if (document.forms[0].elements[tmpInt].type == "checkbox") {
                    if (document.forms[0].elements[tmpInt].checked) {
                        tmpObj[tmpObj.length] = document.forms[0].elements[tmpInt].parentNode.parentNode;
                        tmpDel.value = tmpDel.value + "," + tmpObj[tmpObj.length - 1].Idx;
                    }
                }
            }
        }
        for (var tmpSec = 0; tmpSec < tmpObj.length; tmpSec++) {
            tmpTbl.deleteRow(tmpObj[tmpSec].rowIndex);
        }
    }
}
function NotionMiniMantenedor_NAdd() {
    var tmpSub;
    var tmpInt;
    var tmpPri;
    var tmpSec;
    for (tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {

        // valida campos multiples

        // detalle
        if (NtEstructura[tmpInt].id == IdCampo("Detalle")) {

            tmpPri = document.getElementsByName("man" + NtEstructura[tmpInt].id);
            for (tmpSub = 1; tmpSub < tmpPri.length; tmpSub++) {
                if (tmpPri[tmpSub].value == "") {
                    alert("Ingrese Detalle");
                    return false;
                }
            }
        }
        // Clasificación
        if (NtEstructura[tmpInt].id == IdCampo("Clasificación")) {

            tmpPri = document.getElementsByName("man" + NtEstructura[tmpInt].id);
            for (tmpSub = 1; tmpSub < tmpPri.length; tmpSub++) {
                if (tmpPri[tmpSub].value == "") {
                    alert("Seleccione Clasificación");
                    return false;
                }
            }
        }
        // aplica
        if (NtEstructura[tmpInt].id == IdCampo("Aplica")) {

            tmpPri = document.getElementsByName("man" + NtEstructura[tmpInt].id);
            for (tmpSub = 1; tmpSub < tmpPri.length; tmpSub++) {
                if (tmpPri[tmpSub].value == "") {
                    alert("Seleccione Aplica");
                    return false;
                }
            }
        }

        if (NtEstructura[tmpInt].typ == "9") {
            tmpPri = document.getElementsByName("man" + NtEstructura[tmpInt].id);
            tmpSec = document.getElementsByName("cnf" + NtEstructura[tmpInt].id);
            for (tmpSub = 0; tmpSub < tmpPri.length; tmpSub++) {
                if (tmpPri[tmpSub].checked) {
                    tmpSec[tmpSub].value = "on";
                } else {
                    tmpSec[tmpSub].value = "";
                }
            }
        }
    }
    NotionMantencion_Accion("svm");
}

//Ocultamiento
function ActualizarOcultamiento() {
    var tmpCfg = NtOcultamiento;
    var tmpFil;
    var tmpRet;
    var tmpArr;
    var tmpObj;
    var tmpHid = ",";
    var tmpArr;
    //Mostrar Todos
    for (var tmpPri = 0; tmpPri < NtEstructura.length; tmpPri++) {
        tmpObj = document.getElementById("blk" + NtEstructura[tmpPri].id);
        if (tmpObj) {
            if (tmpObj.hid == "s") {
                tmpObj.style.display = "";
                tmpObj.hid = "n";
            }
        }
    }
    for (var tmpPri = 0; tmpPri < document.forms[0].elements.length; tmpPri++) {
        if (document.forms[0].elements[tmpPri].id.indexOf("bot") == 0) {
            tmpObj = document.getElementById(document.forms[0].elements[tmpPri].id + "tr");
            if (tmpObj) {
                if (tmpObj.hid == "s") {
                    tmpObj.style.display = "";
                    tmpObj.hid = "n";
                }
            }
        }
    }
    tmpArr = document.getElementsByTagName("DIV");
    for (var tmpPri = 0; tmpPri < tmpArr.length; tmpPri++) {
        tmpObj = tmpArr[tmpPri];
        if (tmpObj.name == "btti") {
            if ((tmpObj.hid == "s") || (tmpObj.hid == undefined)) {
                tmpObj.style.display = "";
                tmpObj.hid = "n";
            }
        }
    }
    //Ocultar
    for (var tmpPri = 0; tmpPri < tmpCfg.length; tmpPri++) {
        tmpFil = NotionMantenedor_ProcesarFiltro(tmpCfg[tmpPri].fil);
        try {
            eval("tmpRet = (" + tmpFil + ");");
            //document.getElementById("man768").value;
        }
        catch (ex) {
            tmpRet = false;
        }
        if (tmpRet) {
            tmpArr = tmpCfg[tmpPri].cmp.split(",");
            for (var tmpSec = 0; tmpSec < tmpArr.length; tmpSec++) {
                tmpObj = tmpArr[tmpSec];
                if (tmpObj.indexOf("bot") == 0) {
                    tmpObj = document.getElementById(tmpObj + "tr");
                    if (tmpObj) {
                        tmpObj.hid = "s";
                        tmpObj.style.display = "none";
                        tmpHid += tmpArr[tmpSec] + ",";
                    }
                    tmpObj = document.getElementById(tmpArr[tmpSec].replace("bot", "btt"));
                    if (tmpObj) {
                        tmpObj.hid = "s";
                        tmpObj.style.display = "none";
                        tmpHid += tmpArr[tmpSec] + ",";
                    }
                }
                else {
                    if ((tmpObj != "") && (tmpObj != "0")) {
                        tmpObj = document.getElementById("blk" + tmpObj);
                        if (tmpObj) {
                            tmpObj.hid = "s";
                            tmpObj.style.display = "none";
                            ActualizarOcultamiento_Borrar(tmpObj.id.substring(3));
                            tmpHid += tmpArr[tmpSec] + ",";
                        }
                    }
                }
            }
        }
    }
    document.getElementById("hid").value = tmpHid;
    sci30_VariableEscrituraTipo();
}
function ActualizarOcultamiento_Borrar(idx) {
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].id == idx) {
            switch (NtEstructura[tmpInt].typ) {
                case "1":
                    document.getElementById("man" + idx).value = "";
                    break;
                case "5":
                    document.getElementById("man" + idx).value = "0";
                    document.getElementById("txt" + idx).value = "";
                    document.getElementById("rea" + idx).value = "";
                    break;
                default:
                    document.getElementById("man" + idx).value = "";
                    break;
            }
            break;
        }
    }
}

function radio_change(obj) {
    var tmpArr = document.getElementsByName(obj.name);
    for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
        if (tmpArr[tmpInt].checked) {
            document.getElementById("man" + obj.name.substring(3)).value = tmpArr[tmpInt].value;
            break;
        }
    }
    try {
        if (mpr_calc) {
            mpr_calc();
        }
    } catch (ex) { }
    ActualizarOcultamiento();
}


function cambiandoformato(valor, obj) {
    var tmpVal = "";
    switch (valor) {
        case "E-mail":
        case "Url":
        case "Rut":
            tmpVal = valor;
            break;
        default: tmpVal = ""; break;
    }
    obj.value = tmpVal;
}

function hfo(idx) {
    var tmpMsk = document.getElementById("msk" + idx);
    if (tmpMsk.style.display == "none") {
        tmpMsk.style.display = "";
    } else {
        tmpMsk.style.display = "none";
    }
    document.getElementById("ter" + idx).style.display = tmpMsk.style.display;
}

function MONTHNAME(idx) {
    var tmpOrg = "";
    switch (idx) {
        case 1: tmpOrg = "Enero"; break;
        case 2: tmpOrg = "Febrero"; break;
        case 3: tmpOrg = "Marzo"; break;
        case 4: tmpOrg = "Abril"; break;
        case 5: tmpOrg = "Mayo"; break;
        case 6: tmpOrg = "Junio"; break;
        case 7: tmpOrg = "Julio"; break;
        case 8: tmpOrg = "Agosto"; break;
        case 9: tmpOrg = "Septiembre"; break;
        case 10: tmpOrg = "Octubre"; break;
        case 11: tmpOrg = "Noviembre"; break;
        case 12: tmpOrg = "Diciembre"; break;
    }
    return tmpOrg;
}

function NtFiltro_Deshabilitar(campo) {
    //alert(campo);
    if (NtAccion == "lst") {
        tmpObj = document.getElementById("NtFiltros_Box");
        if (tmpObj) {
            for (var tmpInt = 0; tmpInt < tmpObj.options.length; tmpInt++) {
                if (tmpObj.options[tmpInt].text == campo) {
                    tmpObj.options[tmpInt] = null;
                    break;
                }
            }
        }
    }
}
function NtFiltro_Abrir(campo) {
    if (NtAccion == "lst") {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].etiqueta == campo) {
                if (document.getElementById("ter" + NtEstructura[tmpInt].id)) document.getElementById("ter" + NtEstructura[tmpInt].id).style.display = "";
                if (document.getElementById("msk" + NtEstructura[tmpInt].id)) document.getElementById("msk" + NtEstructura[tmpInt].id).style.display = "";
                try {
                    eval("NotionMantenedorMedidasContenedor_Component(); ");
                } catch (ex) { }
                break;
            }
        }
    }
}

function NtCampo_SoloLectura(campo) {
    var tmpIdx;
    if (NtAccion != "lst") {
        for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
            if (NtEstructura[tmpInt].etiqueta == campo) {
                tmpIdx = NtEstructura[tmpInt].id;
                switch (NtEstructura[tmpInt].typ) {
                    case "5":
                        document.getElementById("txt" + tmpIdx).onkeyup = "";
                        //document.getElementById("txt" + tmpIdx).onblur = "";
                        document.getElementById("txt" + tmpIdx).readOnly = true;
                        document.getElementById("bor" + tmpIdx).style.display = "none";
                        for (var tmpInt = 1; tmpInt < document.getElementById("bor" + tmpIdx).parentNode.childNodes.length; tmpInt++) {
                            document.getElementById("bor" + tmpIdx).parentNode.childNodes[tmpInt].style.display = "none";
                        }
                        break;
                }
            }
        }
    }
}

function NtCampo_Ocultar(campo) {
    var tmpObj;
    var tmpPad;
    var tmpHid;
    var tmpInt;
    if (NtAccion == "lst") {
        tmpObj = document.getElementById("tabla");
        tmpPad = tmpObj.childNodes[0];
        if (tmpPad.tagName != "TBODY") {
            tmpPad = tmpObj;
        }
        tmpObj = tmpPad.childNodes[0];
        for (tmpInt = 1; tmpInt < tmpObj.childNodes.length; tmpInt++) {
            if (tmpObj.childNodes[tmpInt].innerText == campo) {
                tmpObj.childNodes[tmpInt].style.display = "none";
                tmpHid = tmpInt;
            }
        }
        for (tmpInt = 1; tmpInt < tmpPad.childNodes.length; tmpInt++) {
            tmpPad.childNodes[tmpInt].childNodes[tmpHid].style.display = "none";
        }
    }
}


function sci30_CrearCof() {
    NotionMantencion_Layer(true);
    document.getElementById("fra").src = "../../sln/sci30/CrearCOF.aspx?idx=" + NtRegistro + "&rnd=" + NotionMantenedor_Aleatorio();
}

function sci30_DuplicarCotizacion() {
    NotionMantencion_Layer(true);
    document.getElementById("fra").src = "../../sln/sci30/DuplicarCOT.aspx?idx=" + NtRegistro + "&rnd=" + NotionMantenedor_Aleatorio();
}

function sci30_CrearCofValidar() {

    alert("Imposible crear COF, existen productos No Disponibles");
    NotionMantencion_Layer(false);
    return false;

}

/*
function sci30_ImpedirCrear() {
    var tmpPad;
    var tmpArr;
    var tmpOcu = ",2640,";
    if (NtAccion == "lst" && window.parent) {
        tmpArr = window.parent.NtMantenedor;
        if (tmpOcu.indexOf("," + tmpArr + ",") > -1) {
            tmpPad = document.getElementById("_barra");
            while (tmpPad.nodeName != "TR") { tmpPad = tmpPad.childNodes[0]; }
            tmpPad = tmpPad.parentNode; tmpPad = tmpPad.childNodes[1];
            tmpPad = tmpPad.childNodes[0];
            tmpPad.childNodes[0].style.display = "none";
            tmpPad.childNodes[1].style.display = "none";
        }
    }
}
*/


function sci30_ImpedirCrear() {
    var tmpPad;
    var tmpArr;
    var tmpOcu = ",2771,";
    if (NtAccion == "lst" && window.parent) {
        tmpArr = window.parent.NtMantenedor;
        if (tmpOcu.indexOf("," + tmpArr + ",") > -1) {
            tmpPad = document.getElementById("_barra");
            while (tmpPad.nodeName != "TR") { tmpPad = tmpPad.childNodes[0]; }
            tmpPad = tmpPad.parentNode; tmpPad = tmpPad.childNodes[1];
            tmpPad = tmpPad.childNodes[0];
            tmpPad.childNodes[0].style.display = "none";
            tmpPad.childNodes[1].style.display = "none";
        }
    }
}




function sci30_ModuloRecaudacion() {

    var tmpArr;
    var tmpInt;
    var tmpPad;
    var tmpDiv;
    var tmpLst;
    var tmpInp;
    var tmpObj;
    var tmpArrayTotales = [
        "Total Efectivo"
        , "Total Transferencia Electronica"
        , "Total Boleta Depósito"
        , "Total Cheque"
        , "Total Vale Vista"
        , "Total Transbank"
        , "Total Pagaré"
        , "Total Traspaso"
        , "Total Depósito a Plazo"
        , "Total PAT"
        , "Total PAC"
        , "Total Forpay"
        , "Total ONECLICK"
        , "Total a Pagar"
        , "Total Forpay UF"
        , "Total Credipie"
        , "Total Reserva Broker"
    ]
    if (NtAccion != "lst") {
        notBloqueoCampoRelacion("Nombre Cliente");
        notBloqueoCampoRelacion("Punto de venta");
        tmpObj = document.getElementById("itmlst");
        if (tmpObj) {
            document.getElementById("fra").src = "../../sln/sci30/ModuloRecaudacion.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Negocio").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&man=" + NtMantenedor;

        } else {
            tmpArr = document.getElementsByTagName("LEGEND");
            for (tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
                if (tmpArr[tmpInt].innerText == "DETALLE") {
                    tmpPad = tmpArr[tmpInt];
                    break;
                }
            }
            if (tmpPad) {
                //Estilo
                var tmpLength = tmpArrayTotales.length;
                for (var i = 0; i < tmpLength; i++) {
                    sci30_ModuloRecaudacionBuscaCampo(tmpArrayTotales[i]).parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                    sci30_ModuloRecaudacionBuscaCampo(tmpArrayTotales[i]).style.fontSize = "14px";
                    sci30_ModuloRecaudacionBuscaCampo(tmpArrayTotales[i]).style.height = "16px";
                    sci30_ModuloRecaudacionBuscaCampo(tmpArrayTotales[i]).readOnly = true;
                    sci30_ModuloRecaudacionBuscaCampo(tmpArrayTotales[i]).style.fontWeight = "bold";
                }


                //Crear espacio
                tmpDiv = document.createElement("DIV");
                tmpDiv.style.paddingLeft = "6px";
                tmpPad.parentNode.insertBefore(tmpDiv, tmpPad.nextSibling);
                tmpLst = document.createElement("DIV");
                tmpLst.id = "itmlst";
                tmpDiv.appendChild(tmpLst);
                document.getElementById("fra").src = "../../sln/sci30/ModuloRecaudacion.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Negocio").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor;

                tmpInp = document.createElement("INPUT");
                tmpInp.type = "hidden";
                tmpInp.name = "sci30_MRIdx";
                tmpInp.id = "sci30_MRIdx";
                document.body.appendChild(tmpInp);
                //Timer
                //setInterval("sci30_ModuloRecaudacionDatesTest()", 5000);
                //SCI30_SET_Campos_RecaudacionMasiva();
            }
        }
    }
}
function sci30_ModuloRecaudacionCOF() {
    sci30_ModuloRecaudacion();
}
function sci30_ModuloRecaudacionValidar() {
    var tmpArr;
    var tmpObj;
    var tmpTyp;
    var tmpTotalPagar;
    var tmpId;
    var tmpIdRegistro = 0;
    var tmpModoPago = "";
    tmpTotalPagar = sci30_ModuloRecaudacionBuscaCampo("Total a Pagar").value;
    if (tmpTotalPagar == "0" || tmpTotalPagar == "") {
        alert("Seleccione los registros de desea pagar");
        return false;
    }

    var tmpArrayCheckPago = document.getElementsByClassName("recaudacionCheckPago");
    var tmpLength = tmpArrayCheckPago.length;
    if (tmpLength > 0) {
        for (var i = 0; i < tmpLength; i++) {
            if (tmpArrayCheckPago[i].checked) {
                tmpId = tmpArrayCheckPago[i].id;
                tmpIdRegistro = SCI30_fnc_ParsetNum(tmpId);
                tmpModoPago = $("#mod" + tmpIdRegistro).val();
                if (tmpModoPago === "") {
                    alert("Debe seleccionar el modo de pago");
                    $("#mod" + tmpIdRegistro).focus();
                    return false;
                }
                else if ($("#empi" + tmpIdRegistro).val() == "0") {
                    alert("Seleccione Empresa inmobiliaria");
                    $("#empi" + tmpIdRegistro).focus();
                    return false;
                }
                //else if (tmpModoPago === "PAT" || tmpModoPago === "ONECLICK") {
                //    if ($("#ban" + tmpIdRegistro).val() == "") {
                //        alert("Seleccione el banco");
                //        $("#ban" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //    else if ($("#ttl" + tmpIdRegistro).val() == "") {
                //        alert("Debe ingresar Titular");
                //        $("#ttl" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //    else if ($("#rut" + tmpIdRegistro).val() == "") {
                //        alert("Debe ingresar Rut");
                //        $("#rut" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //    else if ($("#dir" + tmpIdRegistro).val() == "") {
                //        alert("Debe ingresar Dirección");
                //        $("#dir" + tmpIdRegistro).focus();
                //        return false;
                //    }

                //    else if ($("#tel" + tmpIdRegistro).val() == "") {
                //        alert("Debe ingresar Teléfono");
                //        $("#tel" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //    else if ($("#eml" + tmpIdRegistro).val() == "") {
                //        alert("Debe ingresar E-Mail");
                //        $("#eml" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //    else if ($("#tar" + tmpIdRegistro).val() == "") {
                //        alert("Debe seleccionar tarjeta");
                //        $("#tar" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //    else if ($("#ntc" + tmpIdRegistro).val() == "") {
                //        alert("Debe ingresar Número Tarjeta");
                //        $("#ntc" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //    else if ($("#fvt" + tmpIdRegistro).val() == "") {
                //        alert("Debe ingresar Fecha Vencimiento Tarjeta");
                //        $("#fvt" + tmpIdRegistro).focus();
                //        return false;
                //    }
                //}
                else if (tmpModoPago === "Transbank") {
                    //if ($("#ban" + tmpIdRegistro).val() == "") {
                    //    alert("Seleccione el banco");
                    //    $("#ban" + tmpIdRegistro).focus();
                    //    return false;
                    //}
                    //else if ($("#num" + tmpIdRegistro).value == "") {
                    if ($("#num" + tmpIdRegistro).value == "") {
                        alert("Ingrese el número del documento");
                        $("#num" + tmpIdRegistro).focus();
                        return false;
                    }
                    else if ($("#cuo" + tmpIdRegistro).val() == "") {
                        alert("Ingresar Número de cuotas");
                        $("#cuo" + tmpIdRegistro).focus();
                        return false;
                    }
                    else if ($("#cuo" + tmpIdRegistro).val() == "1") {
                        if ($("#tcc" + tmpIdRegistro).val() == "") {
                            alert("Ingresar Tipo Tarjajeta");
                            $("#tcc" + tmpIdRegistro).focus();
                            return false;
                        }
                    }
                    //else if ($("#tar" + tmpIdRegistro).val() == "") {
                    //    alert("Ingresar Nombre Tarjeta");
                    //    $("#tar" + tmpIdRegistro).focus();
                    //    return false;
                    //}
                    //else if ($("#ntc" + tmpIdRegistro).val() == "") {
                    //    alert("Ingresar Número de Tarjeta");
                    //    $("#ntc" + tmpIdRegistro).focus();
                    //    return false;
                    //}
                    //else if ($("#fvt" + tmpIdRegistro).val() == "") {
                    //    alert("Ingresar Fecha Vencimiento Tarjeta");
                    //    $("#fvt" + tmpIdRegistro).focus();
                    //    return false;
                    //}

                }
                else {
                    if ($("#num" + tmpIdRegistro).value == "") {
                        alert("Ingrese el número del documento");
                        $("#num" + tmpIdRegistro).focus();
                        return false;
                    }
                    else if (tmpValue != "PAT" || tmpModoPago != "PAC" || tmpModoPago != "Forpay" || tmpModoPago != "ONECLICK") {
                        if ($("#ban" + tmpIdRegistro).val() == "") {
                            alert("Seleccione el banco");
                            $("#ban" + tmpIdRegistro).focus();
                            return false;
                        }
                    }

                    //else if (tmpTyp != "Efectivo" && tmpTyp != "Traspaso") {

                    //    if (tmpValue == "PAT" || tmpModoPago == "PAC" || tmpModoPago == "Forpay" || tmpModoPago == "ONECLICK") {

                    //    }
                    //    else {
                    //        if ($("#ban" + tmpIdRegistro).val() == "") {
                    //            alert("Seleccione el banco");
                    //            $("#ban" + tmpIdRegistro).focus();
                    //            return false;
                    //        }
                    //    }
                    //}
                }
            }
        }
    }

    return true;
}
function sci30_ModuloRecaudacionActualizar(obEvent) {
    var tmpModoPago;
    var tmpVal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var tmpContinue = false;
    var tmpDat = new Date();
    var tmpNum;
    var tmpIndex = 0;
    var tmpValue = 0;
    var tmpMontoPesos = 0;
    var tmpTotalMontoPesos = 0;
    var tmpArrayCheckPago;
    var tmpExistePAT = false;
    //var tmpInicio = true;
    try {

        if (NtAccion == "add" || NtAccion == "edt") {
            SCI30_fnc_SET_ITEM_PIE_ModoPago_PAT(obEvent);
            tmpExistePAT = SCI30_fnc_Exist_PAT();
            //SCI30_fnc_DisableImput();
            if (tmpExistePAT) {
                $(".ModoGeneral").hide();
                $(".ModoPAT").show();
            }
            else {
                $(".ModoPAT").hide();

            }
            tmpArrayCheckPago = document.getElementsByClassName("recaudacionCheckPago");
            var tmpLength = tmpArrayCheckPago.length;
            var tmpId = 0;
            var tmpIdRegistro = 0;
            if (tmpLength > 0) {
                for (var i = 0; i < tmpLength; i++) {

                    tmpId = tmpArrayCheckPago[i].id;
                    tmpIdRegistro = SCI30_fnc_ParsetNum(tmpId);
                    $("#img" + tmpIdRegistro).hide();
                    tmpModoPago = $("#mod" + tmpIdRegistro).val();

                    if (SCI30_fnc_Requerido(tmpModoPago)) {
                        //tmpInicio = false;
                        switch (tmpModoPago) {
                            case "": tmpIndex = -1; break;
                            case "Efectivo": tmpIndex = 0; break;
                            case "Transferencia Electronica": tmpIndex = 1; break;
                            case "Vale Vista": tmpIndex = 2; break;
                            case "Cheque": tmpIndex = 3; break;
                            case "Boleta Depósito": tmpIndex = 4; break;
                            case "Crédito":
                            case "WebPay Crédito":
                            case "Transbank": tmpIndex = 5; break;
                            case "Pagaré": tmpIndex = 6; break;
                            case "Traspaso": tmpIndex = 7; break;
                            case "Depósito a Plazo": tmpIndex = 8; break;
                            case "Tarjeta de Crédito": tmpIndex = 10; break;
                            case "PAT": tmpIndex = 11; break;
                            case "ONECLICK": tmpIndex = 12; break;
                            case "PAC": tmpIndex = 13; break;
                            case "Forpay": tmpIndex = 14; break;
							case "Forpay UF": tmpIndex = 15; break;
                            case "Credipie": tmpIndex = 16; break;
                            case "Reserva Broker": tmpIndex = 17; break;

                        }
                        //if (tmpIndex > 0 && (tmpIndex < 11 || tmpIndex < 12)) {
                        //    $(".ModoGeneral").show();
                        //}

						if (tmpIndex == 15) {

                            document.getElementById("mps" + tmpIdRegistro).value = document.getElementById("hddmp" + tmpIdRegistro).value;
                        }
                        if (tmpIndex > 0 && tmpArrayCheckPago[i].checked) {
                            tmpValue = $("#mps" + tmpIdRegistro).val();
                            tmpMontoPesos = SCI30_fnc_ParsetNum(tmpValue);
                            tmpVal[tmpIndex] = tmpVal[tmpIndex] + tmpMontoPesos;
                            tmpTotalMontoPesos += tmpMontoPesos;
                        }

                        document.getElementById("tcc" + tmpIdRegistro).style.display = "none";
                        document.getElementById("fct" + tmpIdRegistro).style.display = "none";
                        document.getElementById("imgpmp" + tmpIdRegistro).style.display = "none";
                        document.getElementById("mps" + tmpIdRegistro).readOnly = "";
                        //document.getElementById("imgPat" + tmpIdRegistro).style.display = "none";

                        if (tmpIndex == 7) {
                            document.getElementById("ban" + tmpIdRegistro).style.display = "none";
                            document.getElementById("num" + tmpIdRegistro).style.display = "";
                            document.getElementById("ser" + tmpIdRegistro).style.display = "";
                            document.getElementById("img" + tmpIdRegistro).style.display = "";
                            document.getElementById("cuo" + tmpIdRegistro).style.display = "none";

                        } else if (tmpIndex == 9) {
                            document.getElementById("ban" + tmpIdRegistro).style.display = "none";
                            document.getElementById("num" + tmpIdRegistro).style.display = "";
                            document.getElementById("ser" + tmpIdRegistro).style.display = "";
                            document.getElementById("img" + tmpIdRegistro).style.display = "";
                            document.getElementById("cuo" + tmpIdRegistro).style.display = "none";

                        } else if (tmpIndex == 5) {
                            document.getElementById("ban" + tmpIdRegistro).style.display = "none";
                            document.getElementById("num" + tmpIdRegistro).style.display = "";
                            document.getElementById("img" + tmpIdRegistro).style.display = "";
                            document.getElementById("cuo" + tmpIdRegistro).style.display = "";
                            document.getElementById("ser" + tmpIdRegistro).style.display = "none";
                            document.getElementById("tcc" + tmpIdRegistro).style.display = "";
                            //document.getElementById("tar" + tmpIdRegistro).style.display = "";
                            document.getElementById("fct" + tmpIdRegistro).style.display = "";
                            document.getElementById("imgpmp" + tmpIdRegistro).style.display = "";
                            //document.getElementById("ntc" + tmpIdRegistro).style.display = "";
                            //document.getElementById("fvt" + tmpIdRegistro).style.display = "";
                            //document.getElementById("imgPat" + tmpIdRegistro).style.display = "";

                        }
                        else if (tmpIndex > 0 && tmpIndex < 11 || tmpIndex == 17) {
                            document.getElementById("ban" + tmpIdRegistro).style.display = "";
                            document.getElementById("num" + tmpIdRegistro).style.display = "";
                            document.getElementById("ser" + tmpIdRegistro).style.display = "";
                            document.getElementById("img" + tmpIdRegistro).style.display = "";
                            document.getElementById("cuo" + tmpIdRegistro).style.display = "none";

                            //document.getElementById("tar" + tmpIdRegistro).style.display = "none";
                            //document.getElementById("ntc" + tmpIdRegistro).style.display = "none";
                            //document.getElementById("fvt" + tmpIdRegistro).style.display = "none";
                        }
                        else if (tmpIndex >= 11) {
                            document.getElementById("ban" + tmpIdRegistro).style.display = "none";
                            document.getElementById("num" + tmpIdRegistro).style.display = "";
                            document.getElementById("ser" + tmpIdRegistro).style.display = "";
                            document.getElementById("img" + tmpIdRegistro).style.display = "";
                            document.getElementById("cuo" + tmpIdRegistro).style.display = "none";

                            if (tmpIndex == 14) {
                                document.getElementById("ser" + tmpIdRegistro).style.display = "none";
                            }

                            if (tmpIndex == 15) {
                                document.getElementById("mps" + tmpIdRegistro).value = document.getElementById("hddmp" + tmpIdRegistro).value;
                                document.getElementById("mps" + tmpIdRegistro).readOnly = "readOnly";
                                document.getElementById("ser" + tmpIdRegistro).style.display = "none";
                            }
                            //document.getElementById("tar" + tmpIdRegistro).style.display = "none";
                            //document.getElementById("ntc" + tmpIdRegistro).style.display = "none";
                            //document.getElementById("fvt" + tmpIdRegistro).style.display = "none";


                        }
                        //else if (tmpIndex === 11 || tmpIndex === 12) {
                        //    document.getElementById("ban" + tmpIdRegistro).style.display = "";
                        //    document.getElementById("imgPat" + tmpIdRegistro).style.display = "";
                        //}

                    }
                    else {
                        document.getElementById("ban" + tmpIdRegistro).style.display = "none";
                        document.getElementById("num" + tmpIdRegistro).style.display = "none";
                        document.getElementById("img" + tmpIdRegistro).style.display = "none";
                        document.getElementById("cuo" + tmpIdRegistro).style.display = "none";
                        document.getElementById("ser" + tmpIdRegistro).style.display = "none";

                        document.getElementById("tcc" + tmpIdRegistro).style.display = "none";
                        document.getElementById("fct" + tmpIdRegistro).style.display = "none";
                        document.getElementById("imgpmp" + tmpIdRegistro).style.display = "none";
                        //document.getElementById("imgPat" + tmpIdRegistro).style.display = "none";


                    }

                }
                //if (tmpInicio) {
                //    $(".ModoGeneral").hide();
                //    $(".ModoPAT").hide();
                //}

            }

            sci30_ModuloRecaudacionBuscaCampo("Total Efectivo").value = sci30_ModuloRecaudacionMoneda(tmpVal[0]);
            sci30_ModuloRecaudacionBuscaCampo("Total Transferencia Electronica").value = sci30_ModuloRecaudacionMoneda(tmpVal[1]);
            sci30_ModuloRecaudacionBuscaCampo("Total Vale Vista").value = sci30_ModuloRecaudacionMoneda(tmpVal[2]);
            sci30_ModuloRecaudacionBuscaCampo("Total Cheque").value = sci30_ModuloRecaudacionMoneda(tmpVal[3]);
            sci30_ModuloRecaudacionBuscaCampo("Total Boleta Depósito").value = sci30_ModuloRecaudacionMoneda(tmpVal[4]);
            sci30_ModuloRecaudacionBuscaCampo("Total Transbank").value = sci30_ModuloRecaudacionMoneda(tmpVal[5]);
            sci30_ModuloRecaudacionBuscaCampo("Total Pagaré").value = sci30_ModuloRecaudacionMoneda(tmpVal[6]);
            sci30_ModuloRecaudacionBuscaCampo("Total Traspaso").value = sci30_ModuloRecaudacionMoneda(tmpVal[7]);
            sci30_ModuloRecaudacionBuscaCampo("Total Depósito a Plazo").value = sci30_ModuloRecaudacionMoneda(tmpVal[8]);
            sci30_ModuloRecaudacionBuscaCampo("Total PAT").value = sci30_ModuloRecaudacionMoneda(tmpVal[11]);
            sci30_ModuloRecaudacionBuscaCampo("Total ONECLICK").value = sci30_ModuloRecaudacionMoneda(tmpVal[12]);
            sci30_ModuloRecaudacionBuscaCampo("Total PAC").value = sci30_ModuloRecaudacionMoneda(tmpVal[13]);
            sci30_ModuloRecaudacionBuscaCampo("Total Forpay").value = sci30_ModuloRecaudacionMoneda(tmpVal[14]);
			sci30_ModuloRecaudacionBuscaCampo("Total Forpay UF").value = sci30_ModuloRecaudacionMoneda(tmpVal[15]);
            sci30_ModuloRecaudacionBuscaCampo("Total Credipie").value = sci30_ModuloRecaudacionMoneda(tmpVal[16]);
            sci30_ModuloRecaudacionBuscaCampo("Total Reserva Broker").value = sci30_ModuloRecaudacionMoneda(tmpVal[17]);

            sci30_ModuloRecaudacionBuscaCampo("Total a Pagar").value = sci30_ModuloRecaudacionMoneda(tmpTotalMontoPesos);

        }
    } catch (e) {
        console.log(e);
    }

}

function SCI30_SET_ReplicarPagos_RecaudacionMasiva(tmpEvent) {
    try {
        var tmpReclicarPago = false;

        var tmpAccionCuota = "";
        if ($(tmpEvent).val() == "Si") {
            tmpChecked = true;
        }
        else {
            tmpChecked = false;
        }
        var tmpIdRegistro = SCI30_fnc_ParsetNum(tmpEvent.id);
        var tmpIdRegistro2 = 0;
        var tmpOrder1 = parseInt($("#hddOrden" + tmpIdRegistro).val());
        var tmpOrder2 = 0;
       

        var tmpArrayCheckPago = document.getElementsByClassName("recaudacionCheckPago");
        var tmpLength = tmpArrayCheckPago.length;
        if (tmpLength > 0) {
            $.each($(".clReplicarPago"), function () {
                if ($(this).val() == "Si") {
                    tmpReclicarPago = true;
                }
            });
            if (tmpChecked) {
                for (var i = 0; i < tmpLength; i++) {
                    tmpIdRegistro2 = SCI30_fnc_ParsetNum(tmpArrayCheckPago[i].id);
                    tmpOrder2 = parseInt($("#hddOrden" + tmpIdRegistro2).val());
                    if (tmpOrder1 <= tmpOrder2) {
                        tmpArrayCheckPago[i].checked = tmpChecked;
                        $("#epp" + tmpIdRegistro2).val("");
                        $("#epp" + tmpIdRegistro2).trigger("change");

                    }
                }
            }
            else {

                tmpReclicarPago = false;
                for (var i = 0; i < tmpLength; i++) {
                    tmpIdRegistro = SCI30_fnc_ParsetNum(tmpArrayCheckPago[i].id);
                    if ($("#rpp" + tmpIdRegistro).val() == "Si") {
                        tmpAccionCuota = $("#epp" + tmpIdRegistro).val();
                        tmpOrder1 = parseInt($("#hddOrden" + tmpIdRegistro).val());
                        tmpArrayCheckPago[i].checked = true;
                        tmpReclicarPago = true;


                    }

                    if (tmpReclicarPago) {
                        tmpArrayCheckPago[i].checked = true;
                    }
                    else {
                        tmpArrayCheckPago[i].checked = tmpChecked;
                    }

                    $("#epp" + tmpIdRegistro).val(tmpAccionCuota);
                    $("#epp" + tmpIdRegistro).trigger("change");
                }
            }



            var tmpArrayClass = ["clModoPago", "clBancoCliente", "clTitular", "clRutTitular", "clDireccion", "clTelefono", "clEmail", "clTarjeta", "clNumTarjeta", "clFechaTarjeta", "clNumeroDocumento", "clSerie", "clAccionCuota"];
            //tmpArrayClass.forEach(function (tmpClass) {
            //    $("." + tmpClass).val("");
            //});
            $(".ModoGeneral").hide();
            $(".ModoPAT").hide();
            sci30_ModuloRecaudacionActualizar();

            if (tmpReclicarPago) {

                tmpArrayClass.forEach(function (tmpClass) {
                    switch (tmpClass) {
                        case "clNumeroDocumento":
                        case "clSerie":
                            $("." + tmpClass).blur(function () {
                                if (tmpClass == "clNumeroDocumento") {
                                    SCI30_fnc_RecuadacionMasiva_Set_InputNum(this, tmpClass, tmpChecked);

                                }
                                else {
                                    SCI30_fnc_RecuadacionMasiva_Set_InputText(this, tmpClass, tmpChecked);
                                }
                            });
                            break;
                        default:
                            $("." + tmpClass).change(function () {
                                if (tmpClass == "clNumeroDocumento") {
                                    SCI30_fnc_RecuadacionMasiva_Set_InputNum(this, tmpClass, tmpChecked);
                                }
                                else {
                                    SCI30_fnc_RecuadacionMasiva_Set_InputText(this, tmpClass, tmpChecked);
                                }

                            });
                            break;
                    }
                    //$("." + tmpClass).change(function () {
                    //    if (tmpClass == "clNumeroDocumento") {
                    //        SCI30_fnc_RecuadacionMasiva_Set_InputNum(this, tmpClass, tmpReclicarPago);
                    //    }
                    //    else {
                    //        SCI30_fnc_RecuadacionMasiva_Set_InputText(this, tmpClass, tmpReclicarPago);
                    //    }

                    //});
                });
            }

        }


        $(".clImageCalendar").hide();


    } catch (e) {

    }
}

function SCI_Set_ValoresPlandepagoCuotasRecuadadas() {
    try {

        var tmpArrayClass = ["clModoPago", "clBancoCliente"];
        var tmpValue = "";
        var tmpIdRegistro = 0;
        var tmpId = "";
        var tmpArrayPagos = document.getElementsByClassName("clModoPago");
        var tmpArrayBanco = document.getElementsByClassName("clBancoCliente");
        for (var i = 0; i < tmpArrayPagos.length; i++) {
            tmpId = String(tmpArrayPagos[i].id);
            tmpIdRegistro = SCI30_fnc_ParsetNum(tmpId);
            tmpValue = $("#hddModoPago" + tmpIdRegistro).val();
            $("#" + tmpArrayPagos[i].id).val(tmpValue);
        }

        for (var i = 0; i < tmpArrayBanco.length; i++) {
            tmpId = String(tmpArrayBanco[i].id);
            tmpIdRegistro = SCI30_fnc_ParsetNum(tmpId);
            tmpValue = $("#hddBanco" + tmpIdRegistro).val();
            $("#" + tmpArrayBanco[i].id).val(tmpValue);
        }
        if (NtMantenedor == "2766") {
            $(".recaudacionCheckPago").hide();
        }


    } catch (e) {
        console.log(e);
    }
}
function SCI30_SET_Campos_DevolucionMasiva() {
    try {
        var tmpChecked = false;

        $("#man" + IdCampo("Devolución Masiva")).change(function () {
            if ($(this).val() == "Si") {
                tmpChecked = true;
            }
            else {
                tmpChecked = false;
            }

            var tmpArrayCheckPago = document.getElementsByClassName("devolucionCheckPago");
            var tmpLength = tmpArrayCheckPago.length;
            if (tmpLength > 0) {
                for (var i = 0; i < tmpLength; i++) {
                    tmpArrayCheckPago[i].checked = tmpChecked;
                    pag_onchangeDevolucion(tmpArrayCheckPago[i].name);
                }

                var tmpArrayClass = ["clMotiDevolucion"];
                tmpArrayClass.forEach(function (tmpClass) {
                    $("." + tmpClass).val("");
                });


                if (tmpChecked) {



                    tmpArrayClass.forEach(function (tmpClass) {
                        $("." + tmpClass).change(function () {

                            SCI30_fnc_DevoluionMasiva_Set_InputText(this, tmpClass, tmpChecked);

                        });
                    });
                }

            }
        });

    } catch (e) {

    }
}

function SCI30_SET_Campos_RecaudacionMasiva() {
    try {
        var tmpChecked = false;



        $("#man" + IdCampo("Recaudación Masiva")).change(function () {
            if ($(this).val() == "Si") {
                tmpChecked = true;
            }
            else {
                tmpChecked = false;
            }

            var tmpArrayCheckPago = document.getElementsByClassName("recaudacionCheckPago");
            var tmpLength = tmpArrayCheckPago.length;
            if (tmpLength > 0) {
                for (var i = 0; i < tmpLength; i++) {
                    tmpArrayCheckPago[i].checked = tmpChecked;
                }

                var tmpArrayClass = ["clModoPago", "clBancoCliente", "clTitular", , "clRutTitular", "clDireccion", "clTelefono", "clEmail", "clTarjeta", "clNumTarjeta", "clFechaTarjeta", "clNumeroDocumento", "clSerie", "clAccionCuota"];
                tmpArrayClass.forEach(function (tmpClass) {
                    $("." + tmpClass).val("");
                });
                $(".ModoGeneral").hide();
                $(".ModoPAT").hide();
                sci30_ModuloRecaudacionActualizar();

                if (tmpChecked) {

                    tmpArrayClass.forEach(function (tmpClass) {
                        switch (tmpClass) {
                            case "clNumeroDocumento":
                            case "clSerie":
                                $("." + tmpClass).blur(function () {
                                    if (tmpClass == "clNumeroDocumento") {
                                        SCI30_fnc_RecuadacionMasiva_Set_InputNum(this, tmpClass, tmpChecked);
                                    }
                                    else {
                                        SCI30_fnc_RecuadacionMasiva_Set_InputText(this, tmpClass, tmpChecked);
                                    }

                                });
                                break;
                            default:
                                $("." + tmpClass).change(function () {
                                    if (tmpClass == "clNumeroDocumento") {
                                        SCI30_fnc_RecuadacionMasiva_Set_InputNum(this, tmpClass, tmpChecked);
                                    }
                                    else {
                                        SCI30_fnc_RecuadacionMasiva_Set_InputText(this, tmpClass, tmpChecked);
                                    }

                                });
                                break;
                        }




                    });
                }

            }
        });

    } catch (e) {

    }
}

function SCI30_fnc_RecuadacionMasiva_Set_InputNum(obEvent, tmpClass, tmpMasivo) {

    var tmpModoPago = "";

    try {
        if ($(obEvent).val() !== "") {
            var tmpValue = $(obEvent).val();
            tmpValue = tmpValue.trim();
            var tmpNumber = SCI30_fnc_GET_Number_EndChain(tmpValue);
            var tmpText = SCI30_fnc_GET_text_StarChain(tmpValue);
            var tmpIdRegistro = SCI30_fnc_ParsetNum(obEvent.id);
            var tmpIdRegistro2 = 0;
            var tmpOrder1 = parseInt($("#hddOrden" + tmpIdRegistro).val());
            var tmpOrder2 = 0;
            tmpModoPago = $("#mod" + tmpIdRegistro).val();

            if (tmpMasivo) {

                if (tmpNumber == 0) {
                    tmpNumber = 1;
                }
                $(obEvent).val(tmpText + tmpNumber.toString());
                $.each($("." + tmpClass), function () {
                    if ($("#rpp" + tmpIdRegistro).val() == "Si") {
                        tmpIdRegistro2 = SCI30_fnc_ParsetNum($(this).attr("id"));
                        tmpOrder2 = parseInt($("#hddOrden" + tmpIdRegistro2).val());

                        if (tmpOrder1 <= tmpOrder2 ) {
                            if (tmpModoPago == "Forpay" || tmpModoPago == "Forpay UF") {
                                $(this).val(tmpValue);
                                tmpNumber;
                            }
                            else {

                                $(this).val(tmpText + tmpNumber.toString());
                                tmpNumber++;
                            }
                        }

                    }
                    //if ($(this).val() == "") {
                    //    $(this).val(tmpText + tmpNumber.toString());

                    //}


                });
            }
        }


    } catch (e) {

    }

}

function SCI30_fnc_GET_text_StarChain(vbValue) {
    var vbCount = 0;
    var vbSoloTexto = "";
    if (SCI30_fnc_Requerido(vbValue)) {
        vbCount = vbValue.length;
        var vbChar = "";

        while (vbCount > 0) {
            vbChar = vbValue.substring(vbCount - 1, vbCount);
            if (SCI30_fnc_SoloNumeros(vbChar) == "") {
                vbSoloTexto = vbValue.substring(0, vbCount);
                vbCount = 0;
            }
            vbCount--;
        }
    }

    return vbSoloTexto;
}
function SCI30_fnc_GET_Number_EndChain(vbValue) {
    var vbCount = 0;
    var vbSoloNumero = "";
    if (SCI30_fnc_Requerido(vbValue)) {
        vbCount = vbValue.length;
        var vbChar = "";
        while (vbCount > 0) {
            vbChar = vbValue.substring(vbCount - 1, vbCount);
            if (SCI30_fnc_SoloNumeros(vbChar) == "") {
                vbCount = 0;
            } else {
                vbSoloNumero = vbChar + vbSoloNumero;
            }

            vbCount--;
        }
    }
    if (vbSoloNumero == "") {
        vbSoloNumero = "0";
    }

    return parseInt(vbSoloNumero);
}
function SCI30_fnc_RecuadacionMasiva_Set_InputText(obEvent, tmpClass, tmpMasivo) {

    try {

        var tmpValue = $(obEvent).val();
        var tmpIdRegistro = SCI30_fnc_ParsetNum(obEvent.id);
        var tmpIdRegistro2 = 0;
        var tmpFormaFinanciamiento = $("#hddFormaFi" + tmpIdRegistro).val();
        var tmpContinue = true;
        var tmpOrder1 = parseInt($("#hddOrden" + tmpIdRegistro).val());
        var tmpOrder2 = 0;
        var tmpExistePAT = SCI30_fnc_Exist_PAT();
        if (tmpFormaFinanciamiento === "PIE" && tmpExistePAT) {
            sci30_ModuloRecaudacionActualizar(obEvent);
            tmpContinue = false;

        }


        if (tmpMasivo && tmpContinue) {
            $.each($("." + tmpClass), function () {
                if (!tmpExistePAT) {
                    if ($("#rpp" + tmpIdRegistro).val() == "Si") {
                        tmpIdRegistro2 = SCI30_fnc_ParsetNum($(this).attr("id"));
                        tmpOrder2 = parseInt($("#hddOrden" + tmpIdRegistro2).val());
                        if (tmpOrder1 <= tmpOrder2) {
                            $(this).val(tmpValue);
                        }

                    }
                    else {
                        if (tmpClass == "clModoPago") {
                            $("#ban" + tmpIdRegistro).val("");
                            $("#num" + tmpIdRegistro).val("");
                            $("#ser" + tmpIdRegistro).val("");
                        }
                    }
                }

            });


        }
        if (tmpClass === "clModoPago") {
            sci30_ModuloRecaudacionActualizar(obEvent);
        }


    } catch (e) {

    }

}

function SCI30_fnc_DisableImput() {
    try {
        var tmpIdRegistro = 0;
        var tmpFormaFinanciamiento = "";
        var tmpModoPago = "";
        var tmpExistePAT = SCI30_fnc_Exist_PAT();
        var tmpElement;
        var tmpArrayImputPat = ["ttl", "rut", "dir", "tel", "eml"];
        var tmpArrayImputGeneral = ["cuo", "num", "ser"];

        $.each($(".recaudacionCheckPago"), function () {
            tmpIdRegistro = SCI30_fnc_ParsetNum(this.id);
            tmpFormaFinanciamiento = $("#hddFormaFi" + tmpIdRegistro).val();
            tmpModoPago = $("#mod" + tmpIdRegistro).val();
            if (tmpExistePAT) {
                if (tmpFormaFinanciamiento == "PIE") {
                    tmpArrayImputPat.forEach(function (tmpInput) {
                        tmpElement = tmpInput + tmpIdRegistro;
                        document.getElementById(tmpElement).style.display = "";
                    });
                    tmpArrayImputGeneral.forEach(function (tmpInput) {
                        tmpElement = tmpInput + tmpIdRegistro;
                        $(tmpElement).val("");
                        document.getElementById(tmpElement).style.display = "none";
                    });
                }
                else {
                    tmpArrayImputPat.forEach(function (tmpInput) {
                        tmpElement = tmpInput + tmpIdRegistro;
                        $(tmpElement).val("");
                        document.getElementById(tmpElement).style.display = "none";
                    });
                    tmpArrayImputGeneral.forEach(function (tmpInput) {
                        tmpElement = tmpInput + tmpIdRegistro;
                        document.getElementById(tmpElement).style.display = "";
                    });
                }

            }

            else {
                tmpArrayImputPat.forEach(function (tmpInput) {
                    tmpElement = tmpInput + tmpIdRegistro;
                    $(tmpElement).val("");
                    document.getElementById(tmpElement).style.display = "none";
                });
            }
        });


        return tmpExistePAT;
    } catch (e) {

    }
}
function SCI30_fnc_Exist_PAT() {
    try {
        var tmpIdRegistro = 0;
        var tmpFormaFinanciamiento = "";
        var tmpModoPago = "";
        var tmpExistePAT = false;

        $.each($(".recaudacionCheckPago"), function () {
            tmpIdRegistro = SCI30_fnc_ParsetNum(this.id);
            tmpFormaFinanciamiento = $("#hddFormaFi" + tmpIdRegistro).val();
            tmpModoPago = $("#mod" + tmpIdRegistro).val();
            if (tmpFormaFinanciamiento == "PIE" && (tmpModoPago == "PAT" || tmpModoPago == "PAC" || tmpModoPago == "ONECLICK")) {
                tmpExistePAT = true;
            }

        });
        return tmpExistePAT;
    } catch (e) {

    }

}
function SCI30_fnc_SET_ITEM_PIE_ModoPago_PAT(obEvent) {
    try {
        var tmpClass;
        var tmpValue;
        if (SCI30_fnc_Requerido(obEvent)) {
            tmpValue = $(obEvent).val();
            tmpClass = obEvent.className;
            var tmpMensaje = "";
            var tmpIdRegistro = SCI30_fnc_ParsetNum(obEvent.id);
            var tmpFormaFinanciamiento = $("#hddFormaFi" + tmpIdRegistro).val();
            var tmpModoPago = "";
            var tmpIsClassPat = SCI30_ClassIdPAT(tmpClass);
            var tmpExistePAT = SCI30_fnc_Exist_PAT();
            if (tmpExistePAT) {

                SCI30_fnc_Checked_ItemPie(true);

                if (tmpClass === "clModoPago") {
                    SCI30_InicialiceClassIdPAT();
                    //tmpModoPago = "PAT";
                    tmpModoPago = tmpValue;
                    if (tmpFormaFinanciamiento === "PIE" && (tmpValue == "PAT" || tmpModoPago == "PAC" || tmpModoPago == "ONECLICK")) {
                        tmpMensaje = " Item PIE tiene seleccionado modo de pago " + tmpValue + " \n";
                        tmpMensaje += "¿Desea mantener el modo de pago?";
                        if (!SCI30_Confirm(tmpMensaje)) {
                            tmpModoPago = "";
                            $(".ModoPAT").hide();
                            SCI30_fnc_Checked_ItemPie(false);
                        }

                    }
                    $.each($("." + tmpClass), function () {
                        tmpIdRegistro = SCI30_fnc_ParsetNum(this.id);
                        tmpFormaFinanciamiento = $("#hddFormaFi" + tmpIdRegistro).val();
                        if (tmpFormaFinanciamiento === "PIE") {
                            $(this).val(tmpModoPago);
                        }
                    });
                }
                else if (tmpIsClassPat) {
                    $.each($("." + tmpClass), function () {
                        tmpIdRegistro = SCI30_fnc_ParsetNum(this.id);
                        tmpFormaFinanciamiento = $("#hddFormaFi" + tmpIdRegistro).val();
                        if (tmpFormaFinanciamiento === "PIE") {
                            $(this).val(tmpValue);
                        }
                    });
                }


            }
        }




    } catch (e) {

    }
}
function SCI30_fnc_Checked_ItemPie(tmpChecked) {
    try {
        var tmpArrayCheckPago = document.getElementsByClassName("recaudacionCheckPago");
        var tmpLength = tmpArrayCheckPago.length;
        var tmpIdRegistro = 0;
        var tmpFormaFinanciamiento = "";
        if (tmpLength > 0) {
            for (var i = 0; i < tmpLength; i++) {
                tmpIdRegistro = SCI30_fnc_ParsetNum(tmpArrayCheckPago[i].id);
                tmpFormaFinanciamiento = $("#hddFormaFi" + tmpIdRegistro).val();
                if (tmpFormaFinanciamiento === "PIE") {
                    if (tmpChecked) {
                        if (tmpArrayCheckPago[i].checked === false) {
                            tmpArrayCheckPago[i].checked = true;
                        }
                    }
                    else {
                        if (tmpArrayCheckPago[i].checked === true) {
                            tmpArrayCheckPago[i].checked = false;
                        }
                    }

                }
            }
        }
    } catch (e) {

    }
}
function SCI30_ClassIdPAT(tmpClassIn) {
    try {
        var tmpContinue = false;
        var tmpArrayClass = ["clBancoCliente", "clTitular", , "clRutTitular", "clDireccion", "clTelefono", "clEmail", "clTarjeta", "clNumTarjeta", "clFechaTarjeta"];
        if (SCI30_fnc_Requerido(tmpClassIn)) {
            tmpArrayClass.forEach(function (tmpClass) {

                if (tmpClass == tmpClassIn) {
                    tmpContinue = true;
                }
            });
        }
        return tmpContinue;
    } catch (e) {
        console.log(e);
    }

}
function SCI30_InicialiceClassIdPAT() {
    try {

        var tmpArrayClass = ["clBancoCliente", "clTitular", , "clRutTitular", "clDireccion", "clTelefono", "clEmail", "clTarjeta", "clNumTarjeta", "clFechaTarjeta"];

        tmpArrayClass.forEach(function (tmpClass) {

            if (tmpClass === "clRutTitular") {
                $("." + tmpClass).keyup(function () {
                    SCI30_fnc_SET_FormatRut(this);
                });
                $("." + tmpClass).blur(function () {
                    if (!SCI30_fnc_ValidarRut(this)) {
                        SCI30_fnc_SET_ITEM_PIE_ModoPago_PAT(this);
                    }
                });
            }
            if (tmpClass === "clEmail") {
                $("." + tmpClass).blur(function () {
                    if (!SCI30_fnc_ValidarEmail(this)) {
                        SCI30_fnc_SET_ITEM_PIE_ModoPago_PAT(this);
                    }
                });
            }

            $("." + tmpClass).change(function () {
                SCI30_fnc_SET_ITEM_PIE_ModoPago_PAT(this);
            });
        });

        function SCI30_fnc_SET_FormatRut(obEvent) {
            try {
                var tmpValue = $(obEvent).val();
                var tmpRut = "";
                var tmpLength = 0;
                var tmpDv = "";
                var tmpFormat = false;
                var tmpRutFormat = "";
                if (SCI30_fnc_Requerido(tmpValue)) {
                    tmpValue = tmpValue.trim();
                    tmpValue = tmpValue.replace("-");
                    tmpLength = tmpValue.length;

                    if (tmpLength === 2) {
                        tmpRut = tmpValue.substring(0, tmpLength - 1);
                        tmpDv = tmpValue.substring(tmpLength - 1, tmpLength);
                        tmpRutFormat = tmpRut + "-" + tmpDv;
                        $(obEvent).val(tmpRutFormat);
                    }
                    else if (tmpLength > 2) {
                        tmpRut = tmpValue.substring(0, tmpLength - 1);
                        tmpDv = tmpValue.substring(tmpLength - 1, tmpLength);
                        tmpRut = SCI30_fnc_SoloNumeros(tmpRut);
                        tmpFormat = true;
                    }



                    if (tmpFormat) {
                        tmpRut = sci30_Formato_SepadorMilesFormatoPesos(tmpRut);
                        tmpRutFormat = tmpRut + "-" + tmpDv;
                        $(obEvent).val(tmpRutFormat);
                    }
                }
            } catch (e) {

            }
        }
        function SCI30_fnc_ValidarRut(obEvent) {
            try {
                var tmpValue = $(obEvent).val();
                if (SCI30_fnc_Requerido(tmpValue)) {
                    if (!Valida_Rut(tmpValue)) {
                        alert("Formato de rut no valido ");
                        $(obEvent).val("");
                    }
                }

            } catch (e) {

            }
        }
        function SCI30_fnc_ValidarEmail(obEvent) {
            try {
                var tmpValue = $(obEvent).val();
                if (SCI30_fnc_Requerido(tmpValue)) {
                    var pattern = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+.)+[A-Z]{2,4}$/i;
                    if (pattern.test(tmpValue) === false) {
                        alert("Formato de email no valido ");
                        $(obEvent).val("");
                    }
                }

            } catch (e) {

            }
        }
    } catch (e) {
        console.log(e);
    }

}
function SCI30_Set_CantidadCuotasTransbank(tmpEvent) {
    try {
        var tmpIdRegistro = SCI30_fnc_ParsetNum(tmpEvent.id);
        var tmpMontoAPagar = $("#mps" + tmpIdRegistro).val();
        var tmpCantidadCuotas = sci30_ValidacionSoloNumeros(tmpEvent.value);
		var tmpCantidadCuotasTransbank =  $("#hddCantidadCuotasTransbank").val();
		tmpCantidadCuotasTransbank = sci30_ValidacionSoloNumeros(tmpCantidadCuotasTransbank);
        //new code 20210623
        if (tmpCantidadCuotas == 0) {
			tmpCantidadCuotas = 1;
		}
		else if(tmpCantidadCuotas>tmpCantidadCuotasTransbank){
			tmpCantidadCuotas =tmpCantidadCuotasTransbank;
			$(tmpEvent).val(tmpCantidadCuotas);
		}
        $("#cuo" + tmpIdRegistro).val(tmpCantidadCuotas);
        if (tmpCantidadCuotas > 1) {
            $("#tcc" + tmpIdRegistro).val("Credito");
            document.getElementById("tcc" + tmpIdRegistro).disabled = true;
        }
        else {
            $("#tcc" + tmpIdRegistro).val("");
            document.getElementById("tcc" + tmpIdRegistro).disabled = false;
        }

    } catch (e) {
        console.log(e);
    }
}
function SCI30_Confirm(tmpMessage) {
    var tmpResult;
    tmpResult = confirm(tmpMessage);
    return tmpResult;
}


/*
function sci30_Recaudacion_Set_ModoPago(tmpModoPago) {
    var tmpRecuadacionMasiva = document.getElementById("man" + IdCampo("Recaudación Masiva")).value;

    if (tmpRecuadacionMasiva == "Si") {
        var tmpArrayModoPago = document.getElementsByClassName("recaudacionModoPago");
        var tmpLeng = tmpArrayModoPago.length;
        for (var i = 0; i < tmpLeng; i++) {
            if (tmpArrayModoPago[i].value == "") {
                tmpArrayModoPago[i].value = tmpModoPago;
            }
        }
    }


}

function sci30_Set_Campos_Modulo_Recuadacion() {

    var idRecuadacionMasiva = "man" + IdCampo("Recaudación Masiva");


    $("#" + idRecuadacionMasiva).change(function () {
        var tmpValueRecuadacionMasiva = document.getElementById("man" + IdCampo("Recaudación Masiva")).value;
        if (tmpValueRecuadacionMasiva != "Si") {
            var tmpArrayModoPago = document.getElementsByClassName("recaudacionModoPago");
            var tmpArrayBanco = document.getElementsByClassName("recuadacionBancoOrigen");
            var tmpArrayNumeroDoc = document.getElementsByClassName("recaudacionNumeroDocumento");

            var tmpLeng = tmpArrayModoPago.length;

            for (var a = 0; a < tmpLeng; a++) {

                tmpArrayModoPago[a].value = "";

            }

            tmpLeng = tmpArrayBanco.length;

            for (var b = 0; b < tmpLeng; b++) {

                tmpArrayBanco[b].value = "";

            }

            tmpLeng = tmpArrayNumeroDoc.length;

            for (var c = 0; c < tmpLeng; c++) {

                tmpArrayNumeroDoc[c].value = "";

            }
            var tmpArrayFormaFinancia = document.getElementsByClassName("recaudacionCheckPago");
            tmpLeng = tmpArrayFormaFinancia.length;
            for (var i = 0; i < tmpLeng; i++) {

                tmpArrayFormaFinancia[i].checked = false;

            }
            sci30_ModuloRecaudacionActualizar();

        }
        else if (tmpValueRecuadacionMasiva == "Si") {
            tmpInicioRecuadacionMasiva = true;
            var tmpArrayFormaFinancia = document.getElementsByClassName("recaudacionCheckPago");
            var tmpCount = tmpArrayFormaFinancia.length;
            for (var i = 0; i < tmpCount; i++) {

                tmpArrayFormaFinancia[i].checked = true;

            }

            //document.getElementsByName("selTot").checked = true;
        }
    });


}
function sci30_Recaudacion_Set_NumeroDocumento(tmpNumeroDoc) {

    var tmpRecuadacionMasiva = document.getElementById("man" + IdCampo("Recaudación Masiva")).value

    if (tmpRecuadacionMasiva == "Si") {

        var tmpSoloNumeros = sci30_ValidacionSoloNumeros($(tmpNumeroDoc).val());
        var tmpArrayNumDoc = document.getElementsByClassName("recaudacionNumeroDocumento");
        var tmpLeng = tmpArrayNumDoc.length;
        if (tmpSoloNumeros > 0) {
            for (var i = 0; i < tmpLeng; i++) {
                if (tmpInicioRecuadacionMasiva === true) {

                    tmpArrayNumDoc[i].value = tmpSoloNumeros++; ;

                }

            }

            tmpInicioRecuadacionMasiva = false;
        }

        else {
            for (var i = 0; i < tmpLeng; i++) {

                tmpArrayBanco[i].value = "";

            }

        }
    }
}
function sci30_Validacion_NumeroDocumento(tmpId) {
    var tmpTipoRecaudar = "";
    var tmpMontoPesos = "";
    var tmpMilesPesos = "";
    tmpNumeroDoc = $("#num" + tmpId).val();
    tmpValNum = sci30_ValidacionSoloNumeros(tmpNumeroDoc);
    if (tmpValNum > 0) {
        $("#num" + tmpId).val(tmpValNum);
    }
}
*/

function sci30_Validar_IngresoPesosAjuste(tmpIdPago) {
    var tmpTipoRecaudar = "";
    var tmpMontoPesos = "";
    var tmpMilesPesos = "";
    tmpMontoPesos = $("#mps" + tmpIdPago).val();
    tmpMontoPesos = sci30_ValidacionSoloNumeros(tmpMontoPesos);
    if (tmpMontoPesos > 0) {

        sci30_Validacion_IngresoMontoAjuste(tmpIdPago, tmpMontoPesos);
    }

    else if (tmpMontoPesos == 0) {
        tmpValorPesos = $("#hddmp" + tmpIdPago).val();

        $("#mps" + tmpIdPago).val(tmpValorPesos);
    }


}

function sci30_Validacion_IngresoMontoAjuste(tmpIdPago, tmpMontoPesos) {

    var tmpMaxPesos
    var tmpMinPesos;
    var tmpMensaje = "";
    var tmpResul = true;
    var tmpValorOriginalPesos = sci30_ValidacionSoloNumeros($("#hddmp" + tmpIdPago).val());

    tmpMaxPesos = tmpValorOriginalPesos + 500000000;
    tmpMinPesos = tmpValorOriginalPesos - 500000000;

    if (tmpMontoPesos < parseInt(tmpMinPesos)) {

        tmpMinPesos = sci30_Formato_SepadorMilesFormatoPesos(String(tmpMinPesos));

        tmpMensaje += "El valor ingresado es inferior al monto  mínimo de ajuste";
        tmpMensaje += "\n Monto mímino de ajuste: " + String(tmpMinPesos);
        tmpResul = false;

    }


    else if (tmpMontoPesos > parseInt(tmpMaxPesos)) {
        tmpMaxPesos = sci30_Formato_SepadorMilesFormatoPesos(String(tmpMaxPesos));
        tmpMensaje += "El valor ingresado es superior al monto  maximo de ajuste";
        tmpMensaje += "\n Monto maximo de ajuste: " + String(tmpMaxPesos);
        tmpResul = false;

    }

    if (tmpResul == false) {
        tmpValorPesos = $("#hddmp" + tmpIdPago).val();

        $("#mps" + tmpIdPago).val(tmpValorPesos);
        alert(tmpMensaje);
    }
    return tmpResul;

}

function sci30_Validacion_IngresoMontoPesos(tmpIdPago) {
    var tmpTipoRecaudar = "";
    var tmpMontoPesos = "";
    var tmpMilesPesos = "";
    tmpMontoPesos = $("#mps" + tmpIdPago).val();
    tmpMontoPesos = sci30_ValidacionSoloNumeros(tmpMontoPesos);

    if (tmpMontoPesos > 0) {
        tmpMilesPesos = sci30_Formato_SepadorMilesFormatoPesos(String(tmpMontoPesos));
        $("#mps" + tmpIdPago).val(tmpMilesPesos);

    }
    else if (tmpMontoPesos == 0) {
        $("#mps" + tmpIdPago).val("0");
    }


}

function sci30_Formato_SepadorMilesFormatoPesos(tmpValue) {

    var mtpLength = 0;
    var montoIn = "";
    var montoOut = "";
    if (tmpValue != "") {
        mtpLength = tmpValue.length;
        if (mtpLength > 3) {
            while (mtpLength > 0) {
                if (mtpLength < 4) {
                    montoIn = tmpValue.substring(0, mtpLength);
                    montoOut = montoIn + montoOut;
                    break;
                }
                else {
                    montoIn = tmpValue.substring(mtpLength - 3, mtpLength);
                }
                tmpValue = tmpValue.substring(0, mtpLength - 3);
                montoIn = "." + montoIn;
                montoOut = montoIn + montoOut;
                mtpLength = tmpValue.length;
            }
        }
        else {
            montoOut = tmpValue;
        }


    }
    return montoOut;
}




function sci30_Recaudacion_Set_BancoOrigen(tmpBanco) {

    var tmpRecuadacionMasiva = document.getElementById("man" + IdCampo("Recaudación Masiva")).value;

    if (tmpRecuadacionMasiva == "Si") {
        var tmpBancoVal = $(tmpBanco).val();
        //alert(tmpBancoVal);
        var tmpArrayBanco = document.getElementsByClassName("recuadacionBancoOrigen");
        var tmpLeng = tmpArrayBanco.length;
        for (var i = 0; i < tmpLeng; i++) {

            if (tmpArrayBanco[i].value == "") {
                tmpArrayBanco[i].value = tmpBancoVal;
            }
        }
    }

}

function SCI30_fnc_Requerido(vbValue) {
    try {
        vbValue = typeof vbValue != "undefined" ? String(vbValue) : "";
        if (vbValue != "" && vbValue.trim().length > 0) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}
function SCI30_fnc_ParsetNum(tmpValue) {
    var tmpSoloNumero = "";
    var tmpNum = 0;
    var tmpSoloNumero = SCI30_fnc_SoloNumeros(tmpValue);
    if (tmpSoloNumero == "") {
        tmpSoloNumero = "0";
    }
    tmpNum = parseInt(tmpSoloNumero);
    return tmpNum;
}
function SCI30_fnc_SoloNumeros(tmpValue) {
    var tmpSoloNumero = "";
    var tmpSoloNumero = tmpValue.replace(/[^0-9]/g, '');
    return tmpSoloNumero;
}

function sci30_ValidacionSoloNumeros(tmpValue) {
    var tmpSoloNumero = "";
    var tmpNum = 0;
    var tmpSoloNumero = tmpValue.replace(/[^0-9]/g, '');
    if (tmpSoloNumero == "") {
        tmpSoloNumero = "0";
    }
    tmpNum = parseInt(tmpSoloNumero);
    return tmpNum;
}
function sci30_ModuloRecaudacionMoneda(Vlr) {
    return NotionMantenedor_ValidarNumero(null, 0, true, true, Vlr);
}
//function sci30_ModuloRecaudacionFecha(idx) {
//    NotionMantencion_Calendario("rea" + idx, "%d-%m-%Y", false, this);
//}

// new code 20190802
function sci30_ModuloRecaudacionFecha(num, idx) {
    var prefi = "";
    if (num == 1) { prefi = "rea"; }
    if (num == 2) { prefi = "tarFe"; }
    if (num == 3) { prefi = "fvt"; }
    if (num == 4) { prefi = "fct"; }
    NotionMantencion_Calendario(prefi + idx, "%d-%m-%Y", false, this);
}
function sci30_ModuloRecaudacionFechaTarjeta(idx) {

    NotionMantencion_Calendario("fvt" + idx, "%d-%m-%Y", false, this);
}
//end of new code 20190802

function sci30_ModuloRecaudacionLlenar(valor) {
    var tmpVal = valor + "";
    if (tmpVal.length == 1) {
        return "0" + tmpVal;
    } else {
        return tmpVal;
    }
}
function sci30_ModuloRecaudacionBuscaCampo(campo) {
    for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
        if (NtEstructura[tmpInt].etiqueta == campo) {
            return document.getElementById("man" + NtEstructura[tmpInt].id);
            break;
        }
    }
    return null;
}
function notBloqueoCampoRelacion(campo) {
    var tmpObj;
    try {
        if (NtAccion != "lst") {
            for (var tmpInt = 0; tmpInt < NtEstructura.length; tmpInt++) {
                if (NtEstructura[tmpInt].etiqueta == campo) {
                    document.getElementById("txt" + NtEstructura[tmpInt].id).readOnly = true;
                    document.getElementById("txt" + NtEstructura[tmpInt].id).onkeyup = "";
                    document.getElementById("bor" + NtEstructura[tmpInt].id).style.display = "none";
                }
            }
        }
    } catch (ex) { }
}

var sci30_ModuloRecaudacionDates = "";
function sci30_ModuloRecaudacionDatesTest() {
    var tmpArr = document.getElementsByTagName("INPUT");
    var tmpAcu = "";
    for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
        tmpObj = tmpArr[tmpInt];
        if ((tmpObj.type == "checkbox") && (tmpObj.name.indexOf("pag") == 0) && (tmpObj.name != "selTot")) {
            tmpNom = tmpObj.name.substring(3);
            tmpAcu += document.getElementById("rea" + tmpNom).value + "|";
        }
    }
    if (sci30_ModuloRecaudacionDates != tmpAcu) {
        sci30_ModuloRecaudacionDates = tmpAcu;
        tmpAcu = "";
        for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
            tmpObj = tmpArr[tmpInt];
            if ((tmpObj.type == "checkbox") && (tmpObj.name.indexOf("pag") == 0) && (tmpObj.name != "selTot")) {
                tmpNom = tmpObj.name.substring(3);
                if (document.getElementById("for" + tmpNom).value !== "RESERVA" || $("#hddUFPeso" + tmpNom).val() !== "Peso") {
                    tmpAcu += tmpNom + "_" + document.getElementById("rea" + tmpNom).value + "x" + $("#mpu" + tmpNom).val() + "|";
                }
            }
        }
        try {
            document.getElementById("fra").src = "../../sln/sci30/ModuloRecaudacion.aspx?typ=duf&rnd=" + NotionMantenedor_Aleatorio() + "&dat=" + tmpAcu;
        } catch (e) {

        }

    }
}

var vbPuntoVenta = "";

function sci30_NominaPago() {

    var tmpArr;
    var tmpInt;
    var tmpPad;
    var tmpDiv;
    var tmpLst;
    var tmpInp;
    var tmpObj;
    var vbNegocio = "0";
    if (NtAccion != "lst") {
        tmpObj = document.getElementById("itmlst");

        if (vbPuntoVenta == "") {
            vbPuntoVenta = $("#man" + IdCampo("Punto de venta")).val();
        }
        if (vbPuntoVenta != $("#man" + IdCampo("Punto de venta")).val()) {
            vbPuntoVenta = $("#man" + IdCampo("Punto de venta")).val();
            $("#man" + IdCampo("Negocio")).val("");
            $("#rea" + IdCampo("Negocio")).val("");
            $("#txt" + IdCampo("Negocio")).val("");
            vbNegocio = "0";
        }
        else {
            vbNegocio = $("#man" + IdCampo("Negocio")).val();
        }

        if (tmpObj) {
            //alert(document.getElementById("fra").src = "../../sln/sci30/NominaPago.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Punto de venta").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&man=" + NtMantenedor);
            document.getElementById("fra").src = "../../sln/sci30/NominaPago.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Punto de venta").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&man=" + NtMantenedor + "&negocio=" + vbNegocio;
        } else {
            tmpArr = document.getElementsByTagName("LEGEND");
            for (tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
                if (tmpArr[tmpInt].innerText == "DETALLE") {
                    tmpPad = tmpArr[tmpInt];
                    break;
                }
            }
            if (tmpPad) {
                //Estilo
                sci30_ModuloRecaudacionBuscaCampo("Total Efectivo").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Transferencia Electronica").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Boleta Depósito").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Cheque").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                //sci30_ModuloRecaudacionBuscaCampo("Total Letras").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Vale Vista").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Transbank").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Pagaré").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Traspaso").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total PAT").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total ONECLICK").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay UF").parentNode.parentNode.childNodes[0].style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Reserva Broker").parentNode.parentNode.childNodes[0].style.fontSize = "14px";

                sci30_ModuloRecaudacionBuscaCampo("Total Nomina").parentNode.parentNode.childNodes[0].style.fontSize = "14px";

                sci30_ModuloRecaudacionBuscaCampo("Total Efectivo").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Transferencia Electronica").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Boleta Depósito").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Cheque").style.fontSize = "14px";
                //sci30_ModuloRecaudacionBuscaCampo("Total Letras").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Vale Vista").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Transbank").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Pagaré").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Traspaso").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total PAT").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total ONECLICK").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay UF").style.fontSize = "14px";
                sci30_ModuloRecaudacionBuscaCampo("Total Reserva Broker").style.fontSize = "14px";

                sci30_ModuloRecaudacionBuscaCampo("Total Nomina").style.fontSize = "14px";

                sci30_ModuloRecaudacionBuscaCampo("Total Efectivo").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Transferencia Electronica").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Boleta Depósito").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Cheque").style.height = "16px";
                //sci30_ModuloRecaudacionBuscaCampo("Total Letras").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Vale Vista").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Transbank").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Pagaré").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Traspaso").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total PAT").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total ONECLICK").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay UF").style.height = "16px";
                sci30_ModuloRecaudacionBuscaCampo("Total Reserva Broker").style.height = "16px";

                sci30_ModuloRecaudacionBuscaCampo("Total Nomina").style.height = "16px";

                sci30_ModuloRecaudacionBuscaCampo("Total Efectivo").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Transferencia Electronica").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Boleta Depósito").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Cheque").readOnly = true;
                //sci30_ModuloRecaudacionBuscaCampo("Total Letras").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Vale Vista").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Transbank").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Pagaré").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Traspaso").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total PAT").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total ONECLICK").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay UF").readOnly = true;
                sci30_ModuloRecaudacionBuscaCampo("Total Reserva Broker").readOnly = true;

                sci30_ModuloRecaudacionBuscaCampo("Total Nomina").readOnly = true;

                sci30_ModuloRecaudacionBuscaCampo("Total Efectivo").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Transferencia Electronica").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Boleta Depósito").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Cheque").style.fontWeight = "bold";
                //sci30_ModuloRecaudacionBuscaCampo("Total Letras").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Vale Vista").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Transbank").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Pagaré").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Traspaso").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total PAT").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total ONECLICK").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Forpay UF").style.fontWeight = "bold";
                sci30_ModuloRecaudacionBuscaCampo("Total Reserva Broker").style.fontWeight = "bold";

                sci30_ModuloRecaudacionBuscaCampo("Total Nomina").style.fontWeight = "bold";
                //Crear espacio
                tmpDiv = document.createElement("DIV");
                tmpDiv.style.paddingLeft = "6px";
                tmpPad.parentNode.insertBefore(tmpDiv, tmpPad.nextSibling);
                tmpLst = document.createElement("DIV");
                tmpLst.id = "itmlst";
                tmpDiv.appendChild(tmpLst);
                document.getElementById("fra").src = "../../sln/sci30/NominaPago.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Punto de venta").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor + "&negocio=" + vbNegocio;
                tmpInp = document.createElement("INPUT");
                tmpInp.type = "hidden";
                tmpInp.name = "sci30_MRIdx";
                tmpInp.id = "sci30_MRIdx";
                document.body.appendChild(tmpInp);
            }
        }
    }
}

function sci30_NominaPagoValidar() {
    var tmpArr;
    var tmpRet = true;
    tmpArr = sci30_ModuloRecaudacionBuscaCampo("Total Nomina").value;

    /*
    if (tmpArr == "0" || tmpArr == "") {
        alert("No se puede generar la Nómina, no ha seleccionado Documentos de pago");
    tmpRet = false;        
    }
    */
    return tmpRet;
}
function sci30_NominaPagoActualizar() {
    var tmpArr;
    var tmpObj;
    var tmpVal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
    var tmpTyp;
    var tmpMon;
    var tmpTot = 0;
    var tmpNom;
    var tmpDat = new Date();
    var tmpNum;
    if ((NtAccion == "add") || (NtAccion == "edt")) {
        tmpArr = document.getElementsByTagName("INPUT");
        for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
            tmpObj = tmpArr[tmpInt];
            if ((tmpObj.type == "checkbox") && (tmpObj.name.indexOf("pag") == 0)) {
                tmpNom = tmpObj.name.substring(3);
                //tmpTyp = tmpObj.parentNode.parentNode.childNodes[6].innerText;
                tmpTyp = document.getElementById("forpag_" + tmpNom).innerText;
                switch (tmpTyp) {
                    case "": tmpTyp = -1; break;
                    case "Efectivo": tmpTyp = 0; break;
                    case "Transferencia Electronica": tmpTyp = 1; break;
                    case "Vale Vista": tmpTyp = 2; break;
                    case "Cheque": tmpTyp = 3; break;
                    case "Boleta Depósito": tmpTyp = 4; break;
                    case "Transbank": tmpTyp = 5; break;
                    case "Pagaré": tmpTyp = 6; break;
                    case "PAT": tmpTyp = 7; break;
                    case "Traspaso": tmpTyp = 8; break;
                    case "ONECLICK": tmpTyp = 9; break;
                    case "Forpay": tmpTyp = 10; break;
                    case "Forpay UF": tmpTyp = 11; break;
                    case "Reserva Broker": tmpTyp = 12; break;

                }
                if (tmpTyp != -1 && tmpObj.checked) {
                    //tmpNum = tmpObj.parentNode.parentNode.childNodes[5].innerText;
                    //tmpNum = document.getElementById("mps" + tmpNom).value;
                    tmpNum = document.getElementById("monpes_" + tmpNom).innerText;

                    while (tmpNum.indexOf(".") > -1) { tmpNum = tmpNum.replace(".", ""); }
                    tmpMon = parseInt(tmpNum);
                    tmpVal[tmpTyp] = tmpVal[tmpTyp] + tmpMon;
                    console.debug(tmpVal[tmpTyp] + tmpMon);
                    tmpTot = tmpTot + tmpMon;
                }
            }
        }

        console.debug(tmpVal[10]);

        sci30_ModuloRecaudacionBuscaCampo("Total Efectivo").value = sci30_ModuloRecaudacionMoneda(tmpVal[0]);
        sci30_ModuloRecaudacionBuscaCampo("Total Transferencia Electronica").value = sci30_ModuloRecaudacionMoneda(tmpVal[1]);
        sci30_ModuloRecaudacionBuscaCampo("Total Vale Vista").value = sci30_ModuloRecaudacionMoneda(tmpVal[2]);
        sci30_ModuloRecaudacionBuscaCampo("Total Cheque").value = sci30_ModuloRecaudacionMoneda(tmpVal[3]);
        //sci30_ModuloRecaudacionBuscaCampo("Total Letras").value = sci30_ModuloRecaudacionMoneda(tmpVal[3]);
        sci30_ModuloRecaudacionBuscaCampo("Total Boleta Depósito").value = sci30_ModuloRecaudacionMoneda(tmpVal[4]);
        sci30_ModuloRecaudacionBuscaCampo("Total Transbank").value = sci30_ModuloRecaudacionMoneda(tmpVal[5]);
        sci30_ModuloRecaudacionBuscaCampo("Total Pagaré").value = sci30_ModuloRecaudacionMoneda(tmpVal[6]);
        sci30_ModuloRecaudacionBuscaCampo("Total PAT").value = sci30_ModuloRecaudacionMoneda(tmpVal[7]);
        sci30_ModuloRecaudacionBuscaCampo("Total Traspaso").value = sci30_ModuloRecaudacionMoneda(tmpVal[8]);
        sci30_ModuloRecaudacionBuscaCampo("Total ONECLICK").value = sci30_ModuloRecaudacionMoneda(tmpVal[9]);
        sci30_ModuloRecaudacionBuscaCampo("Total Forpay").value = sci30_ModuloRecaudacionMoneda(tmpVal[10]);
        sci30_ModuloRecaudacionBuscaCampo("Total Forpay UF").value = sci30_ModuloRecaudacionMoneda(tmpVal[11]);
        sci30_ModuloRecaudacionBuscaCampo("Total Reserva Broker").value = sci30_ModuloRecaudacionMoneda(tmpVal[12]);

        sci30_ModuloRecaudacionBuscaCampo("Total Nomina").value = sci30_ModuloRecaudacionMoneda(tmpTot);
    }
}

function OcultarGuardar() {
    var tmpArr;
    tmpArr = document.getElementsByTagName("DIV");
    for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
        if (tmpArr[tmpInt].name == "btti") {
            //alert(tmpArr[tmpInt].innerHTML);
            if (tmpArr[tmpInt].innerHTML.indexOf('Crear') > -1) {
                tmpArr[tmpInt].style.display = "none";
            } else if (tmpArr[tmpInt].innerHTML.indexOf('Editar') > -1) {
                tmpArr[tmpInt].style.display = "none";
            } else if (tmpArr[tmpInt].innerHTML.indexOf('Eliminar') > -1) {
                tmpArr[tmpInt].style.display = "none";
            } else if (tmpArr[tmpInt].innerHTML.indexOf('Importar') > -1) {
                tmpArr[tmpInt].style.display = "none";
            }
        }

    }
    //ocultando herramientas

    //var tmpArrIdHerramientas = [168, 169, 410, 400, 399, 389, 370, 396, 403, 390, 385, 382, 381, 398, 395, 367, 366, 360, 407, 409, 404, 402, 372, 371, 394, 393, 388, 383, 405, 377, 378, 379, 374, 375, 376, 373, 368, 369, 380,416,417];

    //for (var tmpHerr = 0; tmpHerr < tmpArrIdHerramientas.length; tmpHerr++) {
    for (var tmpHerr = 0; tmpHerr < 1000; tmpHerr++) {
        try {
            //document.getElementById("btt" + tmpArrIdHerramientas[tmpHerr].toString()).style.display = 'none';
            document.getElementById("btt" + tmpHerr.toString()).style.display = 'none';
        }
        catch (ex) { }
    }
}


function ocultarSegunEjecDeVenta() {
    try {
        document.getElementById("btt416").style.display = 'none';
    }
    catch (ex) { }
}

function sci30_ValidarCotizacion() {
    var tmpVal = sci30_ModuloRecaudacionBuscaCampo("Valor Total De Productos").value;

    if ((tmpVal == "0") || (tmpVal == "") || (tmpVal == "0,00")) {
        alert("Debe agregar productos a la cotización");
        return false;
    }
    return true;
}






function sci30_VariablePromesaBancos() {
    var tmpArr;
    var tmpInt;
    var tmpPad;
    var tmpDiv;
    var tmpLst;
    var tmpInp;
    var tmpObj;

    if (NtAccion != "lst") {
        tmpObj = document.getElementById("itmlst");
        if (tmpObj) {
            //alert(document.getElementById("fra").src = "../../sln/sci30/VariablePromesaBancos.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Negocio").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&man=" + NtMantenedor);
            document.getElementById("fra").src = "../../sln/sci30/VariablePromesaBancos.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Negocio").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&man=" + NtMantenedor;
        } else {
            tmpArr = document.getElementsByTagName("LEGEND");
            for (tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
                if (tmpArr[tmpInt].innerText == "BANCO DEL CREDITO") {
                    tmpPad = tmpArr[tmpInt];
                    break;
                }
            }

            if (tmpPad) {
                //Crear espacio		
                tmpDiv = document.createElement("DIV");
                tmpDiv.style.paddingLeft = "6px";
                tmpPad.parentNode.insertBefore(tmpDiv, tmpPad.nextSibling);
                tmpLst = document.createElement("DIV");
                tmpLst.id = "itmlst";
                tmpLst.innerText = "";
                tmpDiv.appendChild(tmpLst);
                //alert(document.getElementById("fra").src = "../../sln/sci30/VariablePromesaBancos.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Negocio").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor);		
                document.getElementById("fra").src = "../../sln/sci30/VariablePromesaBancos.aspx?idx=" + sci30_ModuloRecaudacionBuscaCampo("Negocio").value + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor;
                tmpInp = document.createElement("INPUT");
                tmpInp.type = "hidden";
                tmpInp.name = "sci30_MRIdx";
                tmpInp.id = "sci30_MRIdx";
                document.body.appendChild(tmpInp);
            }
        }
    }
    if (getURLvar('too') == "525") {
       
        var idpromesa = getURLvar('trs');
        var tmpUrl = "../../sln/sci30/ajax.aspx?typ=EstadoEtapa&idPromesa=" + idpromesa + "&rnd=" + NotionMantenedor_Aleatorio();
        sci30_Ajax(tmpUrl, seteaRequierePoliza);
    }
}
function sci30_VariablePromesaBancosAdd() {
    var tmpRow;
    var tmpCel;
    var tmpSel;
    var tmpImg;
    var tmpPad;
    var tmpMod;
    var tmpIdx = "ban_" + fGetNumUnico();
    tmpMod = document.getElementById("modcux").options;
    tmpPad = document.getElementById("itmcux").childNodes[0];
    tmpRow = document.createElement("TR");

    tmpCel = document.createElement("TD");
    tmpImg = document.createElement("IMG");
    tmpImg.src = "../../cmm/ico/delete.png";
    tmpImg.style.cursor = "pointer";
    tmpImg.onclick = function () {
        sci30_VariablePromesaBancosDel(this);
    }
    tmpCel.appendChild(tmpImg);
    tmpRow.appendChild(tmpCel);

    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("SELECT");
    tmpSel.id = tmpIdx;
    tmpSel.name = tmpIdx;
    for (var tmpInt = 0; tmpInt < tmpMod.length; tmpInt++) {
        tmpSel.options[tmpSel.options.length] = new Option(tmpMod[tmpInt].text, tmpMod[tmpInt].value)
    }
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);

    tmpPad.appendChild(tmpRow);
}
function sci30_VariablePromesaGuardar() {
    var tmpPad = document.getElementById("itmcux").childNodes[0];
    if (sci30_ModuloRecaudacionBuscaCampo("Operacion Con Credito").value == "Si") {
        if (tmpPad.childNodes.length == 1) {
            alert("Ingrese el Banco del Crédito");
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function sci30_VariablePromesaBancosDel(frm) {
    var tmpRow;
    tmpRow = frm.parentNode.parentNode;
    tmpRow.parentNode.removeChild(tmpRow);
}

function fGetNumUnico() {
    var Dia = new Date();
    var d = Dia.getDay();
    var n = Dia.getMonth();
    var a = Dia.getFullYear();
    var m = Dia.getMinutes();
    var h = Dia.getHours();
    var s = Dia.getSeconds();
    var Num = "" + a + n + d + h + m + s;
    return parseInt(Num);
}
function fGetNumUnico() {
    var Dia = new Date();
    var d = Dia.getDay();
    var n = Dia.getMonth();
    var a = Dia.getFullYear();
    var m = Dia.getMinutes();
    var h = Dia.getHours();
    var s = Dia.getSeconds();
    var Num = "" + a + n + d + h + m + s;
    return parseInt(Num);
}


function sci30_VariableEscrituraGuardar() {
    var tmpNom = sci30_ModuloRecaudacionBuscaCampo("Tipo Financiamiento").id.replace("man", "rad");
    var tmpSub;
    var tmpCnt;
    var tmpRet = true;
    tmpNom = sci30_getRadioValue(tmpNom);
    if (tmpNom == "Credito Hipotecario") {
        tmpSub = parseInt(sci30_ModuloRecaudacionBuscaCampo("Sub Estado").value);
        tmpCnt = document.getElementById("itmcux").childNodes[0].childNodes.length - 1;
        if (tmpSub >= 5 && tmpSub <= 16) {
            //Solo uno
            if (tmpCnt == 0) {
                tmpRet = false;
                alert("Debe seleccionar un banco");
            } else if (tmpCnt != 1) {
                tmpRet = false;
                alert("Debe seleccionar sólo un banco");
            }
        } else {
            //Al menos uno
            if (tmpCnt == 0) {
                tmpRet = false;
                alert("Debe seleccionar al menos un banco");
            }
        }
    }
    return tmpRet;
}
function sci30_VariableEscrituraBancos() {
    var tmpArr;
    var tmpInt;
    var tmpPad;
    var tmpDiv;
    var tmpLst;
    var tmpInp;
    var tmpObj;
    if (NtAccion != "lst") {
        try { document.getElementById(sci30_ModuloRecaudacionBuscaCampo("Banco").id.replace("man", "blk")).style.display = "none"; } catch (ex) { }
        tmpObj = document.getElementById("itmlst");
        if (tmpObj) {
            document.getElementById("fra").src = "../../sln/sci30/VariableEscrituraBancos.aspx?idx=" + "0" + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&man=" + NtMantenedor;
        } else {
            tmpArr = document.getElementsByTagName("LEGEND");
            for (tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
                if (tmpArr[tmpInt].innerText == "BANCO DEL CREDITO") {
                    tmpPad = tmpArr[tmpInt];
                    break;
                }
            }
            if (tmpPad) {
                //Crear espacio
                tmpDiv = document.createElement("DIV");
                tmpDiv.style.paddingLeft = "6px";
                tmpPad.parentNode.insertBefore(tmpDiv, tmpPad.nextSibling);
                tmpLst = document.createElement("DIV");
                tmpLst.id = "itmlst";
                tmpLst.innerText = "";
                tmpDiv.appendChild(tmpLst);
                document.getElementById("fra").src = "../../sln/sci30/VariableEscrituraBancos.aspx?idx=" + "0" + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor;
                tmpInp = document.createElement("INPUT");
                tmpInp.type = "hidden";
                tmpInp.name = "sci30_MRIdx";
                tmpInp.id = "sci30_MRIdx";
                document.appendChild(tmpInp);
            }
        }
    }
}
function sci30_VariableEscrituraBancosChg(obj) {
    if (obj.options[obj.selectedIndex].className.length == 0) {
        sci30_ModuloRecaudacionBuscaCampo("Hito De Pago").selectedIndex = 0;
    } else {
        sci30_ModuloRecaudacionBuscaCampo("Hito De Pago").value = obj.options[obj.selectedIndex].className;
    }
    document.getElementById(sci30_ModuloRecaudacionBuscaCampo("Hito De Pago").id.replace("man", "txt")).value = obj.options[obj.selectedIndex].className;
}
function sci30_VariableEscrituraBancosAdd() {
    var tmpRow;
    var tmpCel;
    var tmpSel;
    var tmpImg;
    var tmpPad;
    var tmpMod;
    var tmpIdx = "ban_" + fGetNumUnico();
    tmpMod = document.getElementById("modcux").options;
    tmpPad = document.getElementById("itmcux").childNodes[0];
    tmpRow = document.createElement("TR");

    tmpCel = document.createElement("TD");
    tmpImg = document.createElement("IMG");
    tmpImg.src = "../../cmm/ico/delete.png";
    tmpImg.style.cursor = "pointer";
    tmpImg.onclick = function () {
        sci30_VariablePromesaBancosDel(this);
    }
    tmpCel.appendChild(tmpImg);
    tmpRow.appendChild(tmpCel);

    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("SELECT");
    tmpSel.id = tmpIdx;
    tmpSel.name = tmpIdx;
    tmpSel.onchange = function () {
        sci30_VariableEscrituraBancosChg(this);
    }
    for (var tmpInt = 0; tmpInt < tmpMod.length; tmpInt++) {
        tmpSel.options[tmpSel.options.length] = new Option(tmpMod[tmpInt].text, tmpMod[tmpInt].value)
        tmpSel.options[tmpSel.options.length - 1].className = tmpMod[tmpInt].className;
    }
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);

    tmpPad.appendChild(tmpRow);
}
function sci30_VariableEscrituraBancosDel(frm) {
    var tmpRow;
    tmpRow = frm.parentNode.parentNode;
    tmpRow.parentNode.removeChild(tmpRow);
}

function sci30_VariableEscrituraTipo() {
    var tmpPer;
    var tmpNom;
    //Escritura
    tmpPer = ",2816,2817,2819,2820,2821,2822,2823,2715,2743,2698,";
    if (tmpPer.indexOf(NtMantenedor) > -1) {
        if (document.getElementById("itmlst")) {
            tmpNom = sci30_ModuloRecaudacionBuscaCampo("Tipo Financiamiento").id.replace("man", "rad");
            tmpNom = sci30_getRadioValue(tmpNom);
            if (tmpNom == "Credito Hipotecario") {
                document.getElementById("itmlst").style.display = "";
            } else {
                document.getElementById("itmlst").style.display = "none";
            }
        }
    }
    //Promesa
    tmpPer = ",2810,2811,2801,2812,2804,2818,";
    if (tmpPer.indexOf(NtMantenedor) > -1) {
        if (document.getElementById("itmlst")) {
            tmpNom = sci30_ModuloRecaudacionBuscaCampo("Operacion Con Credito").id.replace("man", "rad");
            tmpNom = sci30_getRadioValue(tmpNom);
            if (tmpNom == "Si") {
                document.getElementById("itmlst").style.display = "";
            } else {
                document.getElementById("itmlst").style.display = "none";
            }
        }
    }
}
function sci30_getRadioValue(nom) {
    var tmpObj = document.getElementsByName(nom);
    var tmpVal = "";
    for (var tmpInt = 0; tmpInt < tmpObj.length; tmpInt++) {
        if (tmpObj[tmpInt].checked) {
            tmpVal = tmpObj[tmpInt].value;
            break;
        }
    }
    return tmpVal;
}









var sci30DicCat;
var sci30DicSub;
var sci30DicUbi;
var sci30DicTip;

function sci30_Atencion() {
    var tmpArr;
    var tmpInt;
    var tmpPad;
    var tmpDiv;
    var tmpLst;
    var tmpInp;
    var tmpObj;
    if (NtAccion != "lst") {
        document.getElementById("bot430").parentNode.style.display = "none";
        tmpObj = document.getElementById("itmlst");
        if (tmpObj) {
            document.getElementById("fra").src = "../../sln/sci30/Atencion.aspx?idx=" + "0" + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&man=" + NtMantenedor;
        } else {
            tmpArr = document.getElementsByTagName("LEGEND");
            for (tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
                if (tmpArr[tmpInt].innerText == "DETALLE") {
                    tmpPad = tmpArr[tmpInt];
                    break;
                }
            }
            if (tmpPad) {
                //Crear espacio
                tmpDiv = document.createElement("DIV");
                tmpDiv.style.paddingLeft = "6px";
                tmpPad.parentNode.insertBefore(tmpDiv, tmpPad.nextSibling);
                tmpLst = document.createElement("DIV");
                tmpLst.id = "itmlst";
                tmpDiv.appendChild(tmpLst);
                document.getElementById("fra").src = "../../sln/sci30/Atencion.aspx?idx=" + "0" + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor;
                tmpInp = document.createElement("INPUT");
                tmpInp.type = "hidden";
                tmpInp.name = "sci30_MRIdx";
                tmpInp.id = "sci30_MRIdx";
                document.appendChild(tmpInp);
            }
        }
    }
    if (NtAccion == "add" || NtAccion == "edt") {
        document.getElementById("man" + IdCampo("Fecha Desde")).onchange = sci30_AtencionFechaDesdeChg;
        document.getElementById("hor" + IdCampo("Fecha Desde")).onchange = sci30_AtencionFechaDesdeChg;
    }
}
function sci30_AtencionFechaDesdeChg() {
    var tmpObj;
    document.getElementById("man" + IdCampo("Fecha Hasta")).value = document.getElementById("man" + IdCampo("Fecha Desde")).value;
    tmpObj = document.getElementById("hor" + IdCampo("Fecha Hasta"));
    tmpObj.value = document.getElementById("hor" + IdCampo("Fecha Desde")).value;
    tmpObj.selectedIndex = tmpObj.selectedIndex + 1;
    tmpObj.selectedIndex = tmpObj.selectedIndex + 1;
}
function sci30_AtencionSet(cat, sub, ubi, tip) {
    sci30DicCat = cat;
    sci30DicSub = sub;
    sci30DicUbi = ubi;
    sci30DicTip = tip;
}
function sci30_AtencionCat(idx) {
    var tmpSel;
    var tmpPad;
    var tmpExi = false;
    tmpSel = document.getElementById("sub" + idx).value;
    tmpPad = document.getElementById("cat" + idx).value;
    document.getElementById("sub" + idx).options.length = 1;
    for (var tmpInt = 0; tmpInt < sci30DicSub.length; tmpInt++) {
        if (sci30DicSub[tmpInt].p == tmpPad) {
            document.getElementById("sub" + idx).options[document.getElementById("sub" + idx).options.length] = new Option(sci30DicSub[tmpInt].v, sci30DicSub[tmpInt].i);
            if (tmpSel == sci30DicSub[tmpInt].i) tmpExi = true;
        }
    }
    if (tmpExi) document.getElementById("sub" + idx).value = tmpSel;
    sci30_AtencionSub(idx);
}
function sci30_AtencionSub(idx) {
    var tmpSel;
    var tmpPad;
    var tmpExi = false;
    tmpSel = document.getElementById("ubi" + idx).value;
    tmpPad = document.getElementById("sub" + idx).value;
    document.getElementById("ubi" + idx).options.length = 1;
    for (var tmpInt = 0; tmpInt < sci30DicUbi.length; tmpInt++) {
        if (sci30DicUbi[tmpInt].p == tmpPad) {
            document.getElementById("ubi" + idx).options[document.getElementById("ubi" + idx).options.length] = new Option(sci30DicUbi[tmpInt].v, sci30DicUbi[tmpInt].i);
            if (tmpSel == sci30DicUbi[tmpInt].i) tmpExi = true;
        }
    }
    if (tmpExi) document.getElementById("ubi" + idx).value = tmpSel;
    sci30_AtencionUbi(idx);
}
function sci30_AtencionUbi(idx) {
    var tmpSel;
    var tmpPad;
    var tmpExi = false;
    tmpSel = document.getElementById("tip" + idx).value;
    tmpPad = document.getElementById("ubi" + idx).value;
    document.getElementById("tip" + idx).options.length = 1;
    for (var tmpInt = 0; tmpInt < sci30DicTip.length; tmpInt++) {
        if (sci30DicTip[tmpInt].p == tmpPad) {
            document.getElementById("tip" + idx).options[document.getElementById("tip" + idx).options.length] = new Option(sci30DicTip[tmpInt].v, sci30DicTip[tmpInt].i);
            if (tmpSel == sci30DicTip[tmpInt].i) tmpExi = true;
        }
    }
    if (tmpExi) document.getElementById("tip" + idx).value = tmpSel;
}
function sci30_AtencionAdd() {
    var tmpRow;
    var tmpCel;
    var tmpSel;
    var tmpImg;
    var tmpPad;
    var tmpMod;
    var tmpIdx = "_" + fGetNumUnico();
    tmpPad = document.getElementById("itmcux").childNodes[0];
    tmpRow = document.createElement("TR");

    tmpCel = document.createElement("TD");
    tmpImg = document.createElement("IMG");
    tmpImg.src = "../../cmm/ico/delete.png";
    tmpImg.style.cursor = "pointer";
    tmpImg.onclick = function () {
        sci30_AtencionDel(tmpIdx);
    }
    tmpCel.appendChild(tmpImg);
    tmpRow.appendChild(tmpCel);
    //Cat
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "cat" + tmpIdx;
    tmpSel.name = "cat" + tmpIdx;
    tmpSel.onchange = function () { sci30_AtencionCat(tmpIdx); }
    tmpSel.options[0] = new Option("(Seleccione)", 0);
    for (var tmpInt = 0; tmpInt < sci30DicCat.length; tmpInt++) {
        tmpSel.options[tmpSel.options.length] = new Option(sci30DicCat[tmpInt].v, sci30DicCat[tmpInt].i);
    }
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //Sub
    tmpCel = document.createElement("TD");
    tmpCel.style.textAlign = "left";
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "sub" + tmpIdx;
    tmpSel.name = "sub" + tmpIdx;
    tmpSel.onchange = function () { sci30_AtencionCat(tmpIdx); }
    tmpSel.options[0] = new Option("(Seleccione)", 0);
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //Ubi
    tmpCel = document.createElement("TD");
    tmpCel.style.textAlign = "left";
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "ubi" + tmpIdx;
    tmpSel.name = "ubi" + tmpIdx;
    tmpSel.onchange = function () { sci30_AtencionCat(tmpIdx); }
    tmpSel.options[0] = new Option("(Seleccione)", 0);
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //Tip
    tmpCel = document.createElement("TD");
    tmpCel.style.textAlign = "left";
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "tip" + tmpIdx;
    tmpSel.name = "tip" + tmpIdx;
    tmpSel.onchange = function () { sci30_AtencionCat(tmpIdx); }
    tmpSel.options[0] = new Option("(Seleccione)", 0);
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //Det
    tmpCel = document.createElement("TD");
    tmpCel.style.textAlign = "left";
    tmpSel = document.createElement("INPUT");
    tmpSel.id = "det" + tmpIdx;
    tmpSel.name = "det" + tmpIdx;
    tmpSel.style.textAlign = "left";
    tmpSel.style.width = "200px";
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    if (NtAccion != "add") {
        //Cor
        tmpCel = document.createElement("TD");
        tmpCel.style.textAlign = "left";
        tmpSel = document.createElement("SELECT");
        tmpSel.id = "cor" + tmpIdx;
        tmpSel.name = "cor" + tmpIdx;
        tmpSel.onchange = function () { sci30_AtencionCor(tmpIdx); }
        tmpSel.options[0] = new Option("", "");
        tmpSel.options[1] = new Option("Si", "Si");
        tmpSel.options[2] = new Option("No", "No");
        tmpCel.appendChild(tmpSel);
        tmpRow.appendChild(tmpCel);
        //Causas
        tmpCel = document.createElement("TD");
        tmpCel.style.textAlign = "left";

        tmpSel = document.createElement("DIV");
        tmpSel.innerHTML = "<input type='checkbox' id='ca0" + tmpIdx + "' name='ca0" + tmpIdx + "' /><label for='ca0" + tmpIdx + "'>Material</label>\n";
        tmpCel.appendChild(tmpSel);
        tmpSel = document.createElement("DIV");
        tmpSel.innerHTML = "<input type='checkbox' id='ca1" + tmpIdx + "' name='ca1" + tmpIdx + "' /><label for='ca1" + tmpIdx + "'>Constructivo</label>\n";
        tmpCel.appendChild(tmpSel);
        tmpSel = document.createElement("DIV");
        tmpSel.innerHTML = "<input type='checkbox' id='ca2" + tmpIdx + "' name='ca2" + tmpIdx + "' /><label for='ca2" + tmpIdx + "'>Diseño</label>";
        tmpCel.appendChild(tmpSel);

        tmpRow.appendChild(tmpCel);
        //Est
        tmpCel = document.createElement("TD");
        tmpCel.style.textAlign = "left";
        tmpCel.id = "est" + tmpIdx;
        tmpRow.appendChild(tmpCel);
    }
    //Row
    tmpPad.appendChild(tmpRow);
}
function sci30_AtencionCalendario() {
    var tmpEje;
    tmpEje = document.getElementById("man" + IdCampo("Ejecutivo de Post Venta")).value;
    if (tmpEje == "" || tmpEje == "0") {
        alert("Seleccione a un ejecutivo");
    } else {
        Notion_Helper_AbrirPopUp("agendapostventa", "../../com/calendario/CalendarioPostVenta.aspx?eje=" + tmpEje, "yes", "yes", 700, 500);
    }
}
function sci30_AtencionCor(idx) {
    var tmpTmp = document.getElementById("cor" + idx).value;
    switch (tmpTmp) {
        case "": tmpTmp = ""; break;
        case "Si": tmpTmp = "PENDIENTE"; break;
        case "No": tmpTmp = "ANULADA"; break;
    }
    document.getElementById("est" + idx).innerText = tmpTmp;
}
function sci30_AtencionDel(idx) {
    var tmpPad;
    tmpPad = document.getElementById("itmcux").childNodes[0];
    tmpPad.removeChild(document.getElementById("cat" + idx).parentNode.parentNode);
}



function sci30_OcultarBarraCOFDesistidas() {
    var tmpArr;
    var tmpEst = "";
    try {
        tmpEst = window.parent.document.getElementById("man" + window.parent.IdCampo("Estado Comercial")).value;
    } catch (ex) { /*alert("Xerr " + ex);*/ }
    if (tmpEst == "Desistimiento") {
        tmpArr = document.getElementsByTagName("DIV");
        for (var tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
            if (tmpArr[tmpInt].name == "btti") {
                if (tmpArr[tmpInt].innerHTML.indexOf('Crear') > -1) {
                    tmpArr[tmpInt].style.display = "none";
                } else if (tmpArr[tmpInt].innerHTML.indexOf('Editar') > -1) {
                    tmpArr[tmpInt].style.display = "none";
                } else if (tmpArr[tmpInt].innerHTML.indexOf('Eliminar') > -1) {
                    tmpArr[tmpInt].style.display = "none";
                } else if (tmpArr[tmpInt].innerHTML.indexOf('Importar') > -1) {
                    tmpArr[tmpInt].style.display = "none";
                }
            }

        }
    }
    /*
    for (var tmpHerr = 0; tmpHerr < 1000; tmpHerr++) {
    try {
    document.getElementById("btt" + tmpHerr.toString()).style.display = 'none';
    }
    catch (ex) { }
    }
    */
}

function CampoLectura(Idx) {

    window.parent.document.getElementById("txt" + Idx).onkeyup = "";
    window.parent.document.getElementById("txt" + Idx).onblur = "";
    window.parent.document.getElementById("txt" + Idx).readOnly = true;
    window.parent.document.getElementById("bor" + Idx).style.display = "none";
    for (var tmpInt = 1; tmpInt < window.parent.document.getElementById("bor" + Idx).parentNode.childNodes.length; tmpInt++) {
        window.parent.document.getElementById("bor" + Idx).parentNode.childNodes[tmpInt].style.display = "none";
    }

}

function CampoLectura2(Idx) {
    document.getElementById("txt" + Idx).onkeyup = "";
    document.getElementById("txt" + Idx).onblur = "";
    document.getElementById("txt" + Idx).readOnly = true;
    document.getElementById("bor" + Idx).style.display = "none";
    document.getElementById("bor" + Idx).nextSibling.style.display = "none";
    document.getElementById("bor" + Idx).nextSibling.nextSibling.style.display = "none";
    document.getElementById("bor" + Idx).nextSibling.nextSibling.nextSibling.style.display = "none";
    document.getElementById("bor" + Idx).nextSibling.nextSibling.nextSibling.style.display = "none";
    for (var tmpInt = 1; tmpInt < window.parent.document.getElementById("bor" + Idx).parentNode.childNodes.length; tmpInt++) {
        document.getElementById("bor" + Idx).parentNode.childNodes[tmpInt].style.display = "none";
    }
}

function sci30_entregas() {
    var tmpArr;
    var tmpInt;
    var tmpPad;
    var tmpDiv;
    var tmpLst;
    var tmpInp;


    var tmpObj;


    if (NtAccion != "lst") {
        //document.getElementById("fra").style.display = "";
        tmpObj = document.getElementById("itmlst");
        if (tmpObj) {
            document.getElementById("fra").src = "../../sln/sci30/_entregas/Entregas.aspx?idx=" + "0" + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor;
        } else {
            tmpArr = document.getElementsByTagName("LEGEND");
            for (tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
                if (tmpArr[tmpInt].innerText == "DETALLE SOLICITUD") {
                    tmpPad = tmpArr[tmpInt];
                    break;
                }
            }
            if (tmpPad) {
                //Crear espacio
                tmpDiv = document.createElement("DIV");
                tmpDiv.style.paddingLeft = "6px";
                tmpPad.parentNode.insertBefore(tmpDiv, tmpPad.nextSibling);
                tmpLst = document.createElement("DIV");
                tmpLst.id = "itmlst";
                tmpLst.innerText = "DETALLE SOLICITUD";
                tmpDiv.appendChild(tmpLst);
                document.getElementById("fra").src = "../../sln/sci30/_entregas/Entregas.aspx?idx=" + "0" + "&typ=ren&rnd=" + NotionMantenedor_Aleatorio() + "&acc=" + NtAccion + "&rec=" + NtRegistro + "&man=" + NtMantenedor;
                tmpInp = document.createElement("INPUT");
                tmpInp.type = "hidden";
                tmpInp.name = "sci30_MRIdx";
                tmpInp.id = "sci30_MRIdx";
                document.appendChild(tmpInp);
            }
        }
    }
}

function sci30_entregas_add() {
    var tmpRow;
    var tmpCel;
    var tmpSel;
    var tmpImg;
    var tmpPad;
    var tmpMod;
    var tmpIdx = "_" + sci30_prefijo();
    tmpcate = document.getElementById("cate").options;
    tmpsubcate = document.getElementById("subcate").options;
    tmphora = document.getElementById("horas").options;
    tmpPad = document.getElementById("itmcux").childNodes[0];
    tmpRow = document.createElement("TR");
    //Eliminar
    tmpCel = document.createElement("TD");
    tmpImg = document.createElement("IMG");
    tmpImg.src = "../../cmm/ico/delete.png";
    tmpImg.style.cursor = "pointer";
    tmpImg.onclick = function () {
        sci30_entregas_del(this);
    }
    tmpCel.appendChild(tmpImg);
    tmpRow.appendChild(tmpCel);
    //Categoria
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "cat" + tmpIdx;
    tmpSel.name = "cat" + tmpIdx;
    //tmpSel.onchange = function () { linkhumano_RecursosClasificacionChange(this); }
    for (var tmpInt = 0; tmpInt < tmpcate.length; tmpInt++) {
        tmpSel.options[tmpSel.options.length] = new Option(tmpcate[tmpInt].text, tmpcate[tmpInt].value)
    }
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //Sub Categoria
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "sub" + tmpIdx;
    tmpSel.name = "sub" + tmpIdx;
    tmpSel.options[0] = new Option("(Seleccione)", 0);
    for (var tmpInt = 0; tmpInt < tmpsubcate.length; tmpInt++) {
        tmpSel.options[tmpSel.options.length] = new Option(tmpsubcate[tmpInt].text, tmpsubcate[tmpInt].value)
    }
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //Observación
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("INPUT");
    tmpSel.style.width = "200px";
    tmpSel.style.textAlign = "left";
    tmpSel.id = "des" + tmpIdx;
    tmpSel.name = "des" + tmpIdx;
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //Fecha Desde
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("INPUT");
    tmpSel.id = "fde" + tmpIdx;
    tmpSel.name = "fde" + tmpIdx;
    tmpSel.value = "";
    //tmpSel.onclick = function (e) { NotionMantencion_Calendario('fde' + tmpIdx, '%d-%m-%Y', false, this); };

    //tmpSel.onblur = linkhumano_actualizar;
    //tmpSel.onkeypress = function (e) { return linkhumano_ValidaNum(event); };
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    // Hora Desde
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "hde" + tmpIdx;
    tmpSel.name = "hde" + tmpIdx;
    for (var tmpInt = 0; tmpInt < tmphora.length; tmpInt++) {
        tmpSel.options[tmpSel.options.length] = new Option(tmphora[tmpInt].value, tmphora[tmpInt].value)
    }
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //    //calendario
    tmpCel = document.createElement("TD");
    tmpImg = document.createElement("IMG");
    tmpImg.src = "../../cmm/ico/calendar.png";
    tmpImg.style.cursor = "pointer";
    tmpImg.onclick = function () {
        NotionMantencion_Calendario('fde' + tmpIdx, '%d-%m-%Y', false, this);
    }
    tmpCel.appendChild(tmpImg);
    tmpRow.appendChild(tmpCel);
    //Fecha Hasta
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("INPUT");
    tmpSel.id = "fha" + tmpIdx;
    tmpSel.name = "fha" + tmpIdx;
    tmpSel.value = "";


    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    // Hora hasta
    tmpCel = document.createElement("TD");
    tmpSel = document.createElement("SELECT");
    tmpSel.id = "hha" + tmpIdx;
    tmpSel.name = "hha" + tmpIdx;
    for (var tmpInt = 0; tmpInt < tmphora.length; tmpInt++) {
        tmpSel.options[tmpSel.options.length] = new Option(tmphora[tmpInt].value, tmphora[tmpInt].value)
    }
    tmpCel.appendChild(tmpSel);
    tmpRow.appendChild(tmpCel);
    //    //calendario
    tmpCel = document.createElement("TD");
    tmpImg = document.createElement("IMG");
    tmpImg.src = "../../cmm/ico/calendar.png";
    tmpImg.style.cursor = "pointer";
    tmpImg.onclick = function () {
        NotionMantencion_Calendario('fha' + tmpIdx, '%d-%m-%Y', false, this);
    }
    tmpCel.appendChild(tmpImg);
    tmpRow.appendChild(tmpCel);

    tmpPad.appendChild(tmpRow);
}

function sci30_entregas_del(frm) {
    var tmpRow;
    tmpRow = frm.parentNode.parentNode;
    tmpRow.parentNode.removeChild(tmpRow);
}
function sci30_prefijo() {
    var Dia = new Date();
    var d = Dia.getDay();
    var n = Dia.getMonth();
    var a = Dia.getFullYear();
    var m = Dia.getMinutes();
    var h = Dia.getHours();
    var s = Dia.getSeconds();
    var mi = Dia.getMilliseconds()
    var Num = "" + h + m + s + mi;
    return parseInt(Num);
}

function sci30_calculaValoresDesistimiento() {
    var tmpMotivo = document.getElementById("man" + IdCampo("Motivo Excepción")).value;
    var tmpValorVenta = document.getElementById("man" + IdCampo("Valor Venta")).value;
    var tmpCof = $("#man" + IdCampo("Negocio")).val();
	if(tmpCof =="" && $("#acc").val()=="add"){
		
		tmpCof = getURLvar("pad");
		$("#man" + IdCampo("Negocio")).val(tmpCof);
	}
    var tmpTipo = document.getElementById("man" + IdCampo("Tipo De excepcion")).value;

    if (tmpTipo == "Sol. Desistimiento") { document.getElementById("fra").src = "../../sln/sci30/CalculoDesistimiento.aspx?typ=cal&mtv=" + tmpMotivo + "&vlv=" + tmpValorVenta + "&cof=" + tmpCof; }
    if (tmpTipo == "Sol. Resciliación") { document.getElementById("fra").src = "../../sln/sci30/CalculoResciliacion.aspx?typ=cal&mtv=" + tmpMotivo + "&vlv=" + tmpValorVenta + "&cof=" + tmpCof; }


}
function sci30_calculaValoresDesistimientoAprobacion() {
    var tmpMulta = document.getElementById("man" + IdCampo("Multa a Cobrar")).value;
    var tmpDescuento = document.getElementById("man" + IdCampo("Descuento")).value;
    var tmpCof = document.getElementById("man" + IdCampo("Negocio")).value;
    var tmpTipo = document.getElementById("man" + IdCampo("Tipo De excepcion")).value;

    if (parseFloat(tmpDescuento.toString().replace(",", ".")) <= 100.00) {
        if (tmpTipo == "Sol. Desistimiento") { document.getElementById("fra").src = "../../sln/sci30/CalculoDesistimiento.aspx?typ=calf&mul=" + tmpMulta + "&des=" + tmpDescuento + "&cof=" + tmpCof; }
        if (tmpTipo == "Sol. Resciliación") { document.getElementById("fra").src = "../../sln/sci30/CalculoResciliacion.aspx?typ=calf&mul=" + tmpMulta + "&des=" + tmpDescuento + "&cof=" + tmpCof; }
    }
    else {
        alert("Excede el 100% de Descuento");
        document.getElementById("man" + IdCampo("Descuento")).value = "0,00";
        document.getElementById("man" + IdCampo("Descuento")).focus();
    }
}


function calendariosHandler() {

    var seleccion;

    if (NtMantenedor == "2665" || NtMantenedor == "2679") {
        //////INICIO ALTERNATIVA 1


        document.getElementById("man" + IdCampo("Fecha Hasta")).readOnly = true;
        var tRow = document.getElementById("blk" + IdCampo("Fecha Desde")).getElementsByTagName("td");

        //obteniendo el select de la hora
        var selHor = document.getElementById("hor" + IdCampo("Fecha Desde"));

        //Removiendo Options del select desde las 00:00 hasta las 08:00
        for (i = 0; i <= 15; i++) {
            selHor.remove(0);
        }

        //Removiendo Options del select desde las 21:00 hasta las 00:00
        for (i = 27; i <= 32; i++) {
            selHor.remove(27);
        }

        // Removiendo Options del select 2
        for (i = 0; i <= 15; i++) {
            document.getElementById("hor" + IdCampo("Fecha Hasta")).remove(0);
        }

        //Removiendo Options del select desde las 21:00 hasta las 00:00
        for (i = 31; i <= 34; i++) {
            document.getElementById("hor" + IdCampo("Fecha Hasta")).remove(31);
        }



        //añadir evento
        $('#' + selHor.id).bind('change', function () {
            seleccion = $('#' + selHor.id)[0].selectedIndex;
            $('#hor' + IdCampo("Fecha Hasta") + ' option:eq(' + (parseInt(seleccion) + 4) + ')').attr("selected", "selected");

        });

        //Esconder Boton Calendario
        tRow = document.getElementById("blk" + IdCampo("Fecha Hasta")).getElementsByTagName("td");
        tRow[4].style.display = 'none';

        //////FIN ALTERNATIVA 1

    }









    if (NtMantenedor == "4125" || NtMantenedor == "4119") {
        //////INICIO ENTREGA PROMESA


        document.getElementById("man" + IdCampo("Fecha Entrega Promesa Hasta")).readOnly = true;
        var tRow = document.getElementById("blk" + IdCampo("Fecha Entrega Promesa Dede")).getElementsByTagName("td");

        //obteniendo el select de la hora
        var selHor = document.getElementById("hor" + IdCampo("Fecha Entrega Promesa Dede"));

        //Removiendo Options del select desde las 00:00 hasta las 08:00
        for (i = 0; i <= 15; i++) {
            selHor.remove(0);
        }

        //Removiendo Options del select desde las 21:00 hasta las 00:00
        for (i = 27; i <= 32; i++) {
            selHor.remove(27);
        }

        // Removiendo Options del select 2
        for (i = 0; i <= 15; i++) {
            document.getElementById("hor" + IdCampo("Fecha Entrega Promesa Hasta")).remove(0);
        }

        //Removiendo Options del select desde las 21:00 hasta las 00:00
        for (i = 31; i <= 34; i++) {
            document.getElementById("hor" + IdCampo("Fecha Entrega Promesa Hasta")).remove(31);
        }



        //añadir evento
        $('#' + selHor.id).bind('change', function () {
            seleccion = $('#' + selHor.id)[0].selectedIndex;
            $('#hor' + IdCampo("Fecha Entrega Promesa Hasta") + ' option:eq(' + (parseInt(seleccion) + 2) + ')').attr("selected", "selected");

        });

        //Esconder Boton Calendario
        tRow = document.getElementById("blk" + IdCampo("Fecha Entrega Promesa Hasta")).getElementsByTagName("td");
        tRow[4].style.display = 'none';

        //////FIN FECHA ENTREGA PROMESA

    }

}


//function sci30_cargaPoliza() 
//{
//    var monto = window.parent.document.getElementById("man" + IdCampo("Monto Asegurado en UF")).value;

//    if (monto == "") 
//    {
//        var IdNegocio = NtRegistro;

//        var xhr = new XMLHttpRequest();
//        xhr.open('GET', "../../sln/sci30/ActualizaOperaSubsidio.aspx?id=" + IdNegocio + "&opcion=" + Opcion + "&rnd=" + NotionMantenedor_Aleatorio());
//        xhr.onload = function () {
//            if (xhr.status === 200)
//                console.log("Opera con subsidio actualizado.");
//            else
//                console.log('Error: ' + xhr.status);
//        };
//        xhr.send();
//        document.getElementById("man" + IdCampo("Opera Subsidio")).value = Opcion;     
//    }
//}

function sci30_ctaCorrienteCliente(id) {


    document.getElementById("fra").src = "../../sln/sci30/LiquidacionNegocio.aspx?idx=" + document.getElementById("txt" + IdCampo("COF")).value + "&rnd=" + NotionMantenedor_Aleatorio();


}

function Solo_Numerico(val) {
    Numer = parseInt(val.value);
    if (isNaN(Numer)) {
        val.value = "";
    }

}


function sci30_SoloNumeros(tmpValue) {
    var tmpSoloNumero = "";
    var tmpNum = 0;
    var tmpSoloNumero = tmpValue.replace(/[^0-9]/g, '');
    return tmpSoloNumero;
}
function SCI30_Requerido(vbData) {
    vbData = String(vbData);
    if (vbData !== "undefined" && vbData !== "null" && vbData.trim().length > 0) {
        return true;
    }
    return false;
}
function SCI30_Mantenedor_DataPicker(vbOject) {
    var vbURL = "";
    try {
        var vbMantenedor = SCI30_GetMantenedor();
        var vbIdInput = String(vbOject.id);
        var vbIdRegistro = SCI30_fnc_ParsetNum(vbIdInput);

        switch (vbMantenedor) {
            case "2764":
                var vbModoPago = $("#mod" + vbIdRegistro).val().toUpperCase();
                if (vbModoPago === "PAT" || vbModoPago === "ONECLICK") {
                    SCI30_fnc_SET_ITEM_PIE_ModoPago_PAT(vbOject);
                }
                else {
                    var vbUFPeso = $("#hddUFPeso" + vbIdRegistro).val().toLowerCase();
                    var vbMontoUF = $("#mpu" + vbIdRegistro).val(); //document.getElementById("mpu" + tmpNom).innerText

                    var vbFormaFinan = $("#hddFormaFi" + vbIdRegistro).val();
                    vbMontoUF = vbMontoUF.replace(".", "").replace(",", ".");
                    var vbFecha = vbOject.value;
                    if (vbUFPeso == "uf" && vbFormaFinan != "RESERVA") {
                        if (vbIdInput.indexOf("rea") > 0) {
                            vbURL = "../../sln/sci30/Ajax.aspx?typ=RecuadacionMontoPeso&vbFecha=" + vbFecha + "&vbMontoUF=" + vbMontoUF + "&rnd=" + NotionMantenedor_Aleatorio();
                            sci30_Ajax(vbURL, SCI30_SET_MontoPeso_ModuloRecuadacion, vbOject);
                        }

                    }

                }

                break;
        }
    } catch (e) {

    }
}

function SCI30_GetMantenedor() {
    try {
        var vbMantenedor = 0;
        var tmpIdx = getURLvar("mantn");
        if (SCI30_Requerido(tmpIdx)) {
            vbMantenedor = tmpIdx;
        }
        else {
            vbMantenedor = NtMantenedor;
        }
    } catch (e) {

    }

}


function SCI30_SET_MontoPeso_ModuloRecuadacion(vbResponse, vbOject) {

    if (SCI30_Requerido(vbResponse)) {
        var vbIdInput = String(vbOject.id);
        vbIdInput = sci30_SoloNumeros(vbIdInput);
        $("#mps" + vbIdInput).val(vbResponse);
    }
}


function validaCofCondiciones() {

    var retorno = true;
    var condicion = document.getElementById("man" + IdCampo("Tipo Reserva")).value;

    if (condicion == "Condicionada") {
        retorno = false;

        $("[data-masivo=condicion]").each(function () {
            // if ($.trim($(this).val()).length == 0) {
            //$(this).val($("#fechadesdemaestra").val());
            //}
            retorno = true;

        });

        if (retorno == false) {

            alert("Debe agregar condicion a la reserva");

        }
    }

    return retorno

}

function sci30_GetImageB64FromChart() {
    var deferred = $.Deferred();
    var allCharts = AmCharts.charts;
    var cnt = 0;

    $.each(allCharts, function (index, item) {
        var chart = item;
        chart["export"].capture({}, function () {
            this.toPNG({}, function (data) {
                //console.log(chart.div.id);
                $("input[data-for='" + chart.div.id + "']").val(data);
                cnt = cnt + 1;
                if (cnt === AmCharts.charts.length) {
                    deferred.resolve("OK");
                }
            });
        });
    });
    return deferred.promise();
}


function sci30_GenPdf() {
    $.when(sci30_GetImageB64FromChart()).done(function (results) {
        document.forms[0].target = "fra";
        document.getElementById("acc").value = "com_pdf";
        document.forms[0].submit();
        document.forms[0].target = "";
        document.getElementById("acc").value = "";
    })
}


function SCI_LiquidarDiferenciaPagosVariableNegocio() {
    try {
        var tmpRegistro = getURLvar("trs");
        var tmpUrl = "../../sln/sci30/ajax.aspx?typ=LiquidarNegocio&registro=" + tmpRegistro + "&origen=Var" + "&rnd=" + NotionMantenedor_Aleatorio();


        sci30_Ajax(tmpUrl, SCI30_GetValoresDiferenciaLiquidacion);
    } catch (e) {
        console.log(e);
    }
}

function SCI_LiquidarDiferenciaPagosNegocio() {

    try {
        var tmpRegistro = getURLvar("trs");
        var tmpUrl = "../../sln/sci30/ajax.aspx?typ=LiquidarNegocio&registro=" + tmpRegistro + "&origen=Cof" + "&rnd=" + NotionMantenedor_Aleatorio();


        sci30_Ajax(tmpUrl, SCI30_GetValoresDiferenciaLiquidacion);
    } catch (e) {
        console.log(e);
    }
}

function SCI30_GetValoresDiferenciaLiquidacion(tmpRespuesta) {
    try {

        var tmpArr;
        var tmpInt;
        var tmpPad;
        var tmpDiv;
        var tmpLst;
        var tmpTabl;
        var tmpIdAgenda = "0";
        tmpArr = document.getElementsByTagName("LEGEND");
        for (tmpInt = 0; tmpInt < tmpArr.length; tmpInt++) {
            if (tmpArr[tmpInt].innerText == "Detalle Liquidación") {
                tmpPad = tmpArr[tmpInt];
                break;
            }
        }

        debugger;
        if (tmpPad) {
            tmpDiv = document.createElement("DIV");
            tmpDiv.style.paddingLeft = "6px";
            tmpPad.parentNode.insertBefore(tmpDiv, tmpPad.nextSibling);
            tmpTabl = document.createElement("DIV");
            tmpTabl.id = "dvDetalleSolicitud";


            tmpDiv.appendChild(tmpTabl);
            if (tmpRespuesta != "") {
                var tmpArray = tmpRespuesta.split("}");
                var tmpTotales = tmpArray[0].split("|");
                $("#man" + IdCampo("Monto Liquidación UF")).val(tmpTotales[0]);
                $("#man" + IdCampo("Monto Liquidación $")).val(tmpTotales[1]);
                tmpTabl.innerHTML = tmpArray[1];


            }
        }
    } catch (e) {

    }
}



function sci30_Ajax(url, Callback, vbOject) {
    url = url;

    var vbResponse = "";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            vbResponse = xhttp.responseText;
            Callback(vbResponse, vbOject);

        }
    };

    xhttp.send();
}


function SCI30_SET_HTML_LEGEND(tmpTagName, tmpText, tmpIdDiv, tmpAddHtml) {
    try {
        var tmpArrayElement;
        var tmpElement;
        tmpArrayElement = document.getElementsByTagName(tmpTagName);
        for (var i = 0; i < tmpArrayElement.length; i++) {
            if (tmpArrayElement[i].innerText == tmpText) {
                tmpElement = tmpArrayElement[i];
            }
        }
        if (tmpElement) {
            tmpDiv = document.createElement("DIV");
            tmpDiv.style.paddingLeft = "6px";
            tmpElement.parentNode.insertBefore(tmpDiv, tmpElement.nextSibling);
            tmpLst = document.createElement("DIV");
            tmpLst.id = tmpIdDiv;
            tmpDiv.appendChild(tmpLst);
            //  $("#dvcontenedorPrincipal").html(tmpAddHtml);

        }

    } catch (e) {

    }
}
function SCI_Add_FileDoom(tmpNombre) {
    try {
        var tmpElement;
        var tmpArrayFile = tmpNombre.split(".");
        var tmpLength = tmpArrayFile.length;

        if (tmpLength > 0) {
            var tmpTypeElement = tmpArrayFile[tmpLength - 1].toLowerCase();
            switch (tmpTypeElement) {
                case "js":
                    tmpElement = document.createElement("script");
                    tmpElement.type = "text/javascript";
                    tmpElement.src = tmpNombre;
                    document.querySelector("head").appendChild(tmpElement);
                    break;
                case "css":
                    tmpElement = document.createElement("link");
                    tmpElement.rel = "stylesheet";
                    tmpElement.type = "text/css";
                    tmpElement.media = "all";
                    tmpElement.href = tmpNombre;
                    document.querySelector("head").appendChild(tmpElement);
                    break;
                default:
            }
        }

    } catch (e) {
        console.log(e);
    }
}


function sci30_onLoadModuloDevolucion() {

    try {

        SCI30_SET_HTML_LEGEND("LEGEND", "DETALLE", "dvContenedorPrincipal", "");

        var tmpArrayFile = [
            "../../sln/sci30/_sys/content/js/SCI_ModuloDevoluciones.js"
        ];

        tmpArrayFile.forEach(function (tmpFile) {
            SCI_Add_FileDoom(tmpFile);
        });

    } catch (e) {

    }


}

function sci30_checklistcoordinadorventa() {
    if (NtAccion == "add") {
        var checkboxes = document.getElementsByName("man" + IdCampo("Checklist Coordinador Venta"));
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = true;
        }
    }
}

function toggleCheckbox(source) {
    var checkboxes = document.querySelectorAll('input[type="checkbox"][data-tipo="checks-nomina"]');
    var idNegocio = $("#man" + IdCampo("Negocio")).val();

    if (idNegocio != "" && idNegocio != "0") {
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = source.checked;
        }
        sci30_NominaPagoActualizar();
    } else {
        alert("No es posible seleccionar masivo, asegúrese de seleccionar un negocio primero");
        $("#checkNominasMasivo").prop("checked", false);
    }
}

function setFieldValue(name, valor) {

    try {
        $("#man" + IdCampo(name) + "").val(valor);
    } catch (e) {

    }

    try {
        $("#rea" + IdCampo(name) + "").val(valor);
    } catch (e) {

    }

    try {
        $("#txt" + IdCampo(name) + "").val(valor);
    } catch (e) {

    }

}

var checkboxesSeleccionados = [];

function sci30_UltimaSeleccion(obj) {
    var checkboxId = obj.dataset.id;

    if (obj.checked) {
        checkboxesSeleccionados.push(checkboxId);
    } else {
        var index = checkboxesSeleccionados.indexOf(checkboxId);
        if (index !== -1) {
            checkboxesSeleccionados.splice(index, 1);
        }
    }

    if (checkboxesSeleccionados.length > 0) {
        var ultimoSeleccionadoId = checkboxesSeleccionados[checkboxesSeleccionados.length - 1];
        document.getElementById("ultimoSeleccionado").value = ultimoSeleccionadoId;
    } else {
        document.getElementById("ultimoSeleccionado").value = 0;
    }
}

function seteaRequierePoliza(respuesta) {

    if (respuesta == "Entrega Inmediata") {

        document.getElementById("man" + IdCampo("Requiere Póliza")).value = "No";
    } else {
        document.getElementById("man" + IdCampo("Requiere Póliza")).value = "Si";

    }
    

}