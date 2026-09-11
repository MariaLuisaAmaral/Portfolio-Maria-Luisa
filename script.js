document.documentElement.style.scrollBehavior = "smooth";

let zIndexAtual = 100;
let janelaArrastando = null;
let deslocamentoX = 0;
let deslocamentoY = 0;

/* =========================
   TROCAR PÁGINA (dentro do painel principal)
   ========================= */
function mostrarPagina(paginaSelecionada) {
    // Esconde a imagem da mão (tela inicial)
    const homeMao = document.getElementById("home-mao");

    if (homeMao) {
        homeMao.style.display = "none";
    }

    const paginas = document.querySelectorAll(".pagina");

    paginas.forEach(function (pagina) {
        pagina.classList.remove("pagina-ativa");
    });

    const paginaAtiva = document.getElementById("pagina-" + paginaSelecionada);

    if (paginaAtiva) {
        paginaAtiva.classList.add("pagina-ativa");
    }

    document.querySelectorAll(".menu button").forEach(function (botao) {
        botao.classList.remove("ativo");
    });

    const botaoAtivo = document.getElementById("botao-" + paginaSelecionada);

    if (botaoAtivo) {
        botaoAtivo.classList.add("ativo");
    }
}

/* =========================
   SUB-ABAS DE PROJETOS
   ========================= */
function selecionarProjeto(numero) {
    document.querySelectorAll(".projeto-conteudo").forEach(function (projeto) {
        projeto.classList.remove("ativo");
    });

    document.querySelectorAll(".projeto-tab").forEach(function (botao) {
        botao.classList.remove("ativo");
    });

    const projetoSelecionado = document.getElementById("projeto-" + numero);
    const abaSelecionada = document.getElementById("projeto-tab-" + numero);

    if (projetoSelecionado) {
        projetoSelecionado.classList.add("ativo");
    }

    if (abaSelecionada) {
        abaSelecionada.classList.add("ativo");
    }
}

/* =========================
   JANELAS FLUTUANTES
   ========================= */
function abrirJanela(nome) {
    const janela = document.getElementById("janela-" + nome);

    if (!janela) return;

    janela.style.display = "block";
    janela.classList.remove("minimizada");
    trazerParaFrente(janela);
}

function fecharJanela(nome) {
    const janela = document.getElementById("janela-" + nome);

    if (!janela) return;

    janela.style.display = "none";
    janela.classList.remove("minimizada");
}

function minimizarJanela(nome) {
    const janela = document.getElementById("janela-" + nome);

    if (!janela) return;

    janela.classList.toggle("minimizada");
}

function trazerParaFrente(janela) {
    zIndexAtual++;
    janela.style.zIndex = zIndexAtual;
}

/* =========================
   INICIALIZAÇÃO DAS JANELAS
   ========================= */
document.querySelectorAll(".janela").forEach(function (janela) {
    janela.style.display = "none";

    janela.addEventListener("pointerdown", function () {
        trazerParaFrente(janela);
    });
});

/* =========================
   ARRASTAR JANELAS
   ========================= */
document.querySelectorAll(".janela-barra").forEach(function (barra) {
    barra.addEventListener("pointerdown", iniciarArrasto);
});

function iniciarArrasto(event) {
    const janela = event.currentTarget.closest(".janela");

    if (!janela) return;
    if (event.target.closest(".janela-controles")) return;

    janelaArrastando = janela;

    const rect = janela.getBoundingClientRect();

    deslocamentoX = event.clientX - rect.left;
    deslocamentoY = event.clientY - rect.top;

    trazerParaFrente(janela);
}

document.addEventListener("pointermove", function (event) {
    if (!janelaArrastando) return;

    const largura = janelaArrastando.offsetWidth;
    const altura = janelaArrastando.offsetHeight;

    let novaEsquerda = event.clientX - deslocamentoX;
    let novoTopo = event.clientY - deslocamentoY;

    const margem = 10;

    novaEsquerda = Math.max(
        margem,
        Math.min(novaEsquerda, window.innerWidth - largura - margem)
    );

    novoTopo = Math.max(
        margem,
        Math.min(novoTopo, window.innerHeight - altura - 20)
    );

    janelaArrastando.style.left = novaEsquerda + "px";
    janelaArrastando.style.top = novoTopo + "px";
    janelaArrastando.style.transform = "none";
});

document.addEventListener("pointerup", function () {
    janelaArrastando = null;
});

/* =========================
   DUPLO CLIQUE RECENTRALIZA
   ========================= */
document.querySelectorAll(".janela-barra").forEach(function (barra) {
    barra.addEventListener("dblclick", function (event) {
        if (event.target.closest(".janela-controles")) return;

        const janela = event.currentTarget.closest(".janela");

        if (!janela) return;

        janela.style.left = "50%";
        janela.style.top = "50%";
        janela.style.transform = "translate(-50%, -50%)";

        trazerParaFrente(janela);
    });
});

/* =========================
   ESC FECHA A JANELA DA FRENTE
   ========================= */
document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    let janelaFrente = null;
    let maiorZ = -1;

    document.querySelectorAll(".janela").forEach(function (janela) {
        if (janela.style.display === "none") return;

        const z = parseInt(janela.style.zIndex || "100", 10);

        if (z > maiorZ) {
            maiorZ = z;
            janelaFrente = janela;
        }
    });

    if (janelaFrente) {
        const nome = janelaFrente.id.replace("janela-", "");
        fecharJanela(nome);
    }
});

// Nenhuma página abre sozinha: o site carrega mostrando a imagem da mão.

/* =========================
   RELÓGIO EM TEMPO REAL
   ========================= */
function atualizarRelogio() {
    const relogio = document.getElementById("relogio");

    if (!relogio) return;

    const agora = new Date();

    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");

    relogio.textContent = horas + ":" + minutos + ":" + segundos;
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);
