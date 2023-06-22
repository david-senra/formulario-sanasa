
document.addEventListener('DOMContentLoaded', function() {
    var blob = [];
    var nome = "";

    const htmlBody = document.getElementById('body');
    var estaCasado = true;
    var estaEmComunhao = true;
    var temEscrituraPublica = true;
    var temPartilha = true;
    var temContratoParticular = true;
    var temContratoParticularEmLei = true;

    var vielaPresente = false;
    var servidaoPresente = false;
    var ambasPresentes = false;

    var nomePrincipalGenero = 'indefinido';
    var nomeConjugeGenero = 'indefinido';

    const mensagemSucesso = document.getElementsByClassName('success-message');
    const elementoHeader = document.getElementsByClassName('header');

    const stateEstadoCivil = document.getElementsByClassName('select-estado-civil');
    const stateRegimeBens = document.getElementsByClassName('select-regime-bens');

    const listaRegimeBens = document.getElementById('regime-bens');
    const listaConjuge = document.getElementById('ul-conjuge');
    const selectComunhao = document.getElementById('select-comunhao');

    const stateContratoImovel = document.getElementsByClassName('select-contrato-imovel');
    const stateContratoParticular = document.getElementsByClassName('select-contrato-particular');

    const listaEscrituraPublica = document.getElementsByClassName('div-contrato-escritura');
    const listaContratoPartilha = document.getElementsByClassName('div-contrato-partilha');
    const listaContratoParticular = document.getElementsByClassName('div-contrato-particular');
    const listaLei = document.getElementsByClassName('lista-lei');

    const botaoGerador = document.getElementsByClassName('botao-gerar');
    const botaoBaixador = document.getElementsByClassName('botao-download');

    const formulario = document.getElementsByClassName('form');

    const todosInputs = document.getElementsByClassName('inputs');

    function setConfiguracaoCivil() {
        if (stateEstadoCivil[0].value === 'casad' && stateRegimeBens[0].value !== 'comunhão') {
            listaRegimeBens.classList.remove('hide');
            listaConjuge.classList.remove('hide');
            selectComunhao.classList.add('hide');
            estaCasado = true;
            estaEmComunhao = false;
        }
        else if (stateEstadoCivil[0].value === 'casad' && stateRegimeBens[0].value === 'comunhão') {
            selectComunhao.classList.remove('hide');
            listaRegimeBens.classList.remove('hide');
            listaConjuge.classList.remove('hide');
            estaCasado = true;
            estaEmComunhao = true;
        }
        else {
            selectComunhao.classList.add('hide');
            listaRegimeBens.classList.add('hide');
            listaConjuge.classList.add('hide');
            estaCasado = false;
            estaEmComunhao = false;
        }
    }

    stateEstadoCivil[0].addEventListener('change', setConfiguracaoCivil);
    stateRegimeBens[0].addEventListener('change', setConfiguracaoCivil);

    function setConfiguracaoContratos() {
        if (stateContratoImovel[0].value === 'Escritura Pública') {
            listaEscrituraPublica[0].classList.remove('hide');
            listaContratoParticular[0].classList.add('hide');
            listaContratoPartilha[0].classList.add('hide');
            temEscrituraPublica = true;
            temPartilha = false;
            temContratoParticular = false;
            temContratoParticularEmLei = false;
        }
        else if (stateContratoImovel[0].value === 'Forma de Partilha') {
            listaEscrituraPublica[0].classList.add('hide');
            listaContratoParticular[0].classList.add('hide');
            listaContratoPartilha[0].classList.remove('hide');
            temEscrituraPublica = false;
            temPartilha = true;
            temContratoParticular = false;
            temContratoParticularEmLei = false;
        }
        else if (stateContratoParticular[0].value === 'regulado pela Lei') {
            listaEscrituraPublica[0].classList.add('hide');
            listaContratoParticular[0].classList.remove('hide');
            listaContratoPartilha[0].classList.add('hide');
            listaLei[0].classList.remove('hide');
            temEscrituraPublica = false;
            temPartilha = false;
            temContratoParticular = true;
            temContratoParticularEmLei = true;
        }
        else {
            listaEscrituraPublica[0].classList.add('hide');
            listaContratoParticular[0].classList.remove('hide');
            listaContratoPartilha[0].classList.add('hide');
            listaLei[0].classList.add('hide');
            temEscrituraPublica = false;
            temPartilha = false;
            temContratoParticular = true;
            temContratoParticularEmLei = false;
        }
    }

    stateContratoImovel[0].addEventListener('change', setConfiguracaoContratos);
    stateContratoParticular[0].addEventListener('change', setConfiguracaoContratos);

    botaoGerador[0].addEventListener('click', generate);
    botaoBaixador[0].addEventListener('click', downloadFile);

    function loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
    }
    
    async function generate() {
    
        const todosErros = document.getElementsByTagName('P');
        const arrayErros = Array.from(todosErros);
        arrayErros.forEach(element => {
            element.remove();
        })
        const outrosErros = document.getElementsByClassName('loucura');
        const outraarrayErros = Array.from(outrosErros);
        outraarrayErros.forEach(element => {
            element.remove();
        })
        const inputsarray = Array.from(todosInputs);
        let contador = 0;
        const inputsArrayComErros = [];
        inputsarray.forEach(input => {
            if (input.offsetParent !== null && input.value == '') {
                var newElement = document.createElement('div')
                const elem = document.createElement("p");
                const text = document.createTextNode("Não deixe campos em branco!");
                elem.appendChild(text);
                newElement.appendChild(elem);
                elem.classList.add('error');
                newElement.classList.add('loucura');
                (input.parentNode).parentElement.insertBefore(newElement, input.parentNode.nextSibling);
                if (input.tagName == 'SELECT') {
                    elem.classList.add('error--extra');
                }
                const mensagemErroDois = document.getElementById('erro-maior')
                mensagemErroDois.classList.add('error-two--active');
                contador++;
                input.addEventListener('keydown', e => {
                    elem.remove();
                    mensagemErroDois.classList.remove('error-two--active')
                    newElement.remove();
                })
                inputsArrayComErros.push(input);
            }
        })
        if (contador > 0) {
            (inputsArrayComErros[0]).closest('.section').scrollIntoView({ behavior: 'smooth'})
            return;
        }
    
        //AQUI
        const mensagemCarregando = document.getElementById('texto-carregando');
        htmlBody.classList.add('loading');
        mensagemCarregando.classList.remove('hide');
    
        const arrayNomePrincipal = document.getElementById('1').value.split(" ");
        const nomePrincipal = arrayNomePrincipal[0];
        const linkNomePrincipal = `https://gender-api.com/get?name=${nomePrincipal}&key=54bnXdJgG83wgPqA64Mjz255VdZKULj3h267`
        await fetch(linkNomePrincipal)
            .then(function(resposta){
                if (resposta.ok) {
                    return resposta.json();
                }
                else {
                    nomePrincipalGenero = 'indefinido';
                    return
                }
            })
            .then(function(json) {
                json.accuracy >= 95? nomePrincipalGenero = json.gender : nomePrincipalGenero = 'indefinido';
                console.log(json.accuracy);
                console.log(json.gender);
                console.log(nomeConjugeGenero);
            })
            .catch(function(erro){
                nomePrincipalGenero = 'indefinido';
                return
            })
    
        const arrayNomeConjuge = document.getElementById('9').value.split(" ");
        const nomeConjuge = arrayNomeConjuge[0];
        const linkNomeConjuge = `https://gender-api.com/get?name=${nomeConjuge}&key=54bnXdJgG83wgPqA64Mjz255VdZKULj3h267`
        if (estaCasado == true) {
            await fetch(linkNomeConjuge)
            .then(function(resposta){
                if (resposta.ok) {
                    return resposta.json();
                }
                else {
                    nomeConjugeGenero = 'indefinido';
                    return
                }
            })
            .then(function(json) {
                json.accuracy >= 95? nomeConjugeGenero = json.gender : nomeConjugeGenero = 'indefinido';
                console.log(json.accuracy);
                console.log(json.gender);
                console.log(nomeConjugeGenero);
            })
            .catch(function(erro){
                nomeConjugeGenero = 'indefinido';
                return
            })
        }
        else {
            nomeConjugeGenero = 'indefinido';
        }
    
        loadFile(
            "https://servidor-estaticos-flame-eight.vercel.app/template.docx",
            function (error, content) {
                if (error) {
                    htmlBody.className.remove('loading');
                    mensagemCarregando.classList.add('hide');
                    throw error;
                }
                const zip = new PizZip(content);
                const doc = new window.docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                });
                console.log(stateEstadoCivil[0].value)
                const data1 = document.getElementById('19').value.toString();
                const data2 = document.getElementById('40').value.toString();
    
                const first1 = data1.split("-");
                const first2 = data2.split("-");
    
                const data3 = first1[2] + "/" + first1[1] + "/" + first1[0];
                const data4 = first2[2] + "/" + first2[1] + "/" + first2[0];
    
                const respostaFaixa = document.getElementById('tipo-faixa').value;
    
                vielaPresente = respostaFaixa == 'ambas' || respostaFaixa == 'viela';
                servidaoPresente = respostaFaixa == 'ambas' || respostaFaixa == 'servidao';
                ambasPresentes = respostaFaixa == 'ambas';
    
                var situacaoCivil = "";
                var portadorPrincipal = "";
                var inscritoPrincipal = "";
                var domiciliadoPrincipal = "";
                var portadorConjuge = "";
                var inscritoConjuge = "";
                var proprietarioPrincipal = "";
    
                if (nomePrincipalGenero == 'male') {
                    portadorPrincipal = 'portador';
                    inscritoPrincipal = 'inscrito';
                    domiciliadoPrincipal = 'domiciliado';
                    proprietarioPrincipal = 'proprietário';
                    situacaoCivil = `${document.getElementById('6').value}o`
                }
                else if (nomePrincipalGenero == 'female') {
                    portadorPrincipal = 'portadora';
                    inscritoPrincipal = 'inscrita';
                    domiciliadoPrincipal = 'domiciliada';
                    proprietarioPrincipal = 'proprietária';
                    situacaoCivil = `${document.getElementById('6').value}a`
                }
                else {
                    portadorPrincipal = 'portador(a)';
                    inscritoPrincipal = 'inscrito(a)';
                    domiciliadoPrincipal = 'domiciliado(a)';
                    proprietarioPrincipal = 'proprietário(a)';
                    situacaoCivil = `${document.getElementById('6').value}o(a)`
                }
    
                if (estaCasado == true) {
                    domiciliadoPrincipal = 'domiciliados';
                }
    
                if (nomeConjugeGenero == 'male') {
                    portadorConjuge = 'portador';
                    inscritoConjuge = 'inscrito';
                }
                else if (nomeConjugeGenero == 'female') {
                    portadorConjuge = 'portadora';
                    inscritoConjuge = 'inscrita';
                }
                else {
                    portadorConjuge = 'portador(a)';
                    inscritoConjuge = 'inscrito(a)';
                }
    
                // Render the document (Replace {first_name} by John, {last_name} by Doe, ...) 
                doc.render({
                    'portadorprincipal': portadorPrincipal,
                    'inscritoprincipal': inscritoPrincipal,
                    'domiciliadoprincipal': domiciliadoPrincipal,
                    'proprietarioprincipal': proprietarioPrincipal,
                    'portadorconjuge': portadorConjuge,
                    'inscritoconjuge': inscritoConjuge,
                    'casado': estaCasado,
                    'comunhao': estaEmComunhao,
                    'escritura': temEscrituraPublica,
                    'partilha' : temPartilha,
                    'particular' : temContratoParticular,
                    'regulado': temContratoParticularEmLei,
                    'transcricao': document.getElementById('transcricao-matricula').value == 'transcricao',
                    'matricula': document.getElementById('transcricao-matricula').value == 'matricula',
                    'unica': !ambasPresentes,
                    'ambas': ambasPresentes,
                    'servidao': servidaoPresente,
                    'viela': vielaPresente,
                    '1': document.getElementById('1').value,
                    '2': document.getElementById('2').value,
                    '3': document.getElementById('3').value,
                    '4': document.getElementById('4').value,
                    '5': document.getElementById('5').value,
                    '6': situacaoCivil,
                    '7': document.getElementById('7').value,
                    '8': document.getElementById('8').value,
                    '9': document.getElementById('9').value,
                    '10': document.getElementById('10').value,
                    '11': document.getElementById('11').value,
                    '12': document.getElementById('12').value,
                    '13': document.getElementById('13').value,
                    '14': document.getElementById('14').value,
                    '15': document.getElementById('15').value,
                    '16': document.getElementById('16').value,
                    '17': document.getElementById('17').value,
                    '18': document.getElementById('18').value,
                    '19': data3,
                    '20': document.getElementById('20').value,
                    '21': document.getElementById('21').value,
                    '22': document.getElementById('22').value,
                    '23': document.getElementById('23').value,
                    '24': document.getElementById('24').value,
                    '25': document.getElementById('25').value,
                    '26': document.getElementById('26').value,
                    '27': document.getElementById('27').value,
                    '28': document.getElementById('28').value,
                    '29': 'XXX',
                    '30': document.getElementById('30').value,
                    '31': document.getElementById('31').value,
                    '32': document.getElementById('32').value,
                    '33': document.getElementById('33').value,
                    '34': document.getElementById('34').value,
                    '35': document.getElementById('35').value,
                    '36': document.getElementById('36').value,
                    '37': document.getElementById('37').value,
                    '38': document.getElementById('38').value,
                    '39': document.getElementById('39').value,
                    '40': data4,
                    '41': document.getElementById('41').value,
                    '42': document.getElementById('42').value,
                    '43': document.getElementById('43').value,
                });
                
                blob = doc.getZip().generate({
                    type: "blob",
                    mimeType:
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    // compression: DEFLATE adds a compression step.
                    // For a 50MB output document, expect 500ms additional CPU time
                    compression: "DEFLATE",
                });
                // Output the document using Data-URI
                
                const nomeArquivo = document.getElementById('1').value;
                nome = nomeArquivo.replace(/\s+/g, '-').toLowerCase();
                formulario[0].classList.add('hide');
                botaoBaixador[0].classList.remove('hide');
                botaoGerador[0].classList.add('hide');
                mensagemSucesso[0].classList.remove('hide');
                elementoHeader[0].classList.add('party');
                htmlBody.classList.remove('loading');
                mensagemCarregando.classList.add('hide');
            }
        );
    };
    
    async function downloadFile() {
        saveAs(blob, `${nome}-sanasa.docx`);

        const davidServidor = `travelturtle.us-3.evennode.com`
        await fetch(davidServidor, {
            method: "POST",
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                },
            body: blob
        },)
        .then(function(resposta){
            if (resposta.ok) {
                console.log('envio bem sucedido');
            }
            else {
                console.log('erro no envio - não autorizado');
            }
        })
        .catch(function(erro){
            console.log('falha no envio');
        })
    }
})