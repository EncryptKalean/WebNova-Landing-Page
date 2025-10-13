function carrossel(quantidade_de_itens, progresso_carrossel, trilho, quantidade_para_mostrar, casa_por_giro, direcao) {

  // Pega os valores do trilho
  const tamanho_do_trilho = +window.getComputedStyle(trilho).getPropertyValue('width').split('px')[0];

  const divPai = trilho.parentElement;
  let posicao_Scroll = divPai.scrollLeft;

  // Pega o tamanho dos itens de acordo com o tamanho do trilho
  const tamanho_item = tamanho_do_trilho / quantidade_de_itens;

  // Faz o calculo de quantos itens faltam
  const falta = quantidade_de_itens - progresso_carrossel.valor;

  // Se não houver mais casas para percorrer, reinicia o carrossel
  if (progresso_carrossel.valor >= quantidade_de_itens) {
    posicao_Scroll = 0;
    progresso_carrossel.valor = quantidade_para_mostrar - casa_por_giro;
  }

  // Reinicia no final quando o carrossel está no começo (loop infinito)
  else if (progresso_carrossel.valor < quantidade_para_mostrar - casa_por_giro) {
    posicao_Scroll = divPai.clientWidth;
    progresso_carrossel.valor = quantidade_de_itens - casa_por_giro;
  }

  // Se o número de casas_por_giro for maior que a quantidade de casas faltantes,
  // desacelera o carrossel proporcionalmente ao tamanho dos itens
  else if (casa_por_giro > falta && falta > 0) posicao_Scroll += (direcao === 'setaEsquerda' ? -1 : 1) * tamanho_item * falta;

  // Caso contrário, continua normalmente com o deslocamento padrão
  else posicao_Scroll += (direcao === 'setaEsquerda' ? -1 : 1) * tamanho_item * casa_por_giro;

  // Atualiza o progresso do carrossel, somando as casas percorridas
  progresso_carrossel.valor += (direcao === 'setaEsquerda' ? -1 : 1) * casa_por_giro;

  // Aplica a nova posição ao trilho
  divPai.scrollLeft = posicao_Scroll;
};



// Animação de quando um item entrar na tela

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // isIntersecting é um boolean, true or false, então aqui no toggle é como se ele estivesse falando "classe show = true" ou "classe show = false"
    entry.target.classList.toggle('show', entry.isIntersecting);
  })
})


// ---------------------------------------------------- Carrossel Automatico de projetos

const projetos = document.querySelectorAll('.projeto_card');
const trilho_projeto = document.getElementById('trilho');

/* Número de itens visíveis simultaneamente no carrossel */
let quantidade_exposta_projetos = +getComputedStyle(document.documentElement).getPropertyValue('--quantidade_exposta');

/* Tempo que o carrossel demora para andar */
let velocidade_projetos = +getComputedStyle(document.documentElement).getPropertyValue('--tempo_carrossel');

/* Quantidade de itens que o carrossel avança por ciclo */
let valorCss_projetos = +getComputedStyle(document.documentElement).getPropertyValue('--casas_por_giro');
const casa_por_giro_projetos = valorCss_projetos > quantidade_exposta_projetos ? quantidade_exposta_projetos : valorCss_projetos;

let casa_carrossel_projetos = { valor: quantidade_exposta_projetos };

// Ativa o carrossel de projetos apenas se houver mais itens do que os visíveis simultaneamente
let ativar_carrossel_projetos;

const padraoCarrosselProjetos = setInterval(() => {

  carrossel(projetos.length, casa_carrossel_projetos, trilho_projeto, quantidade_exposta_projetos, casa_por_giro_projetos)

}, velocidade_projetos * 1000);

if (projetos.length > quantidade_exposta_projetos) ativar_carrossel_projetos = padraoCarrosselProjetos;

// Animação de quando o item aparece na tela
projetos.forEach((el) => {
  el.classList.add('show');
  observer.observe(el);
});

// ---------------------------------------------------- Carrossel Automatico de comentarios

const comentarios = document.querySelectorAll('.comentario_card');
const trilho_comentario = document.getElementById('trilho_comentarios');

/* Número de itens visíveis simultaneamente no carrossel */
let quantidade_exposta_comentarios = +getComputedStyle(document.documentElement).getPropertyValue('--quantidade_exposta_comentario');

/* Tempo que o carrossel demora para andar */
let velocidade_comentarios = +getComputedStyle(document.documentElement).getPropertyValue('--tempo_carrossel_comentario');

/* Quantidade de itens que o carrossel avança por ciclo */
let valorCss_comentarios = +getComputedStyle(document.documentElement).getPropertyValue('--casas_por_giro_comentario');
const casa_por_giro_comentarios = valorCss_comentarios > quantidade_exposta_comentarios ? quantidade_exposta_comentarios : valorCss_comentarios;

let casa_carrossel_comentarios = { valor: quantidade_exposta_comentarios };

let ativar_carrossel_comentarios;

const padraoCarrosselComentarios = setInterval(() => {

  carrossel(comentarios.length, casa_carrossel_comentarios, trilho_comentario, quantidade_exposta_comentarios, casa_por_giro_comentarios)

}, velocidade_comentarios * 1000);

if (comentarios.length > quantidade_exposta_comentarios) ativar_carrossel_comentarios = padraoCarrosselComentarios;

// Animação de quando o item aparece na tela
comentarios.forEach((el) => {
  el.classList.add('show');
  observer.observe(el);
});


// ---------------------------------------------------- EventListener dos botões do carrossel

const containers_btn_carrossel = document.querySelectorAll('.setasCarrossel_container');

containers_btn_carrossel.forEach((el) => {
  el.addEventListener('click', (click) => {
    // Só ativa se clicar em um btn valido
    const btn = click.target.closest('button') ?? false;

    if (btn) {
      // Pega qual foi o carrossel ativado e a direção escolhida
      const carrossel_tipo = btn.parentElement.getAttribute('name');
      const direcao = btn.classList[0];

      if (carrossel_tipo === 'projetos') {
        carrossel(projetos.length, casa_carrossel_projetos, trilho_projeto, quantidade_exposta_projetos, casa_por_giro_projetos, direcao);

        // Interrompe o carrossel automático e reativa após 10 segundos
        clearInterval(ativar_carrossel_projetos);
        setTimeout(() => { ativar_carrossel_projetos = padraoCarrosselProjetos; }, 10000);
      }

      else if (carrossel_tipo === 'comentarios') {
        carrossel(comentarios.length, casa_carrossel_comentarios, trilho_comentario, quantidade_exposta_comentarios, casa_por_giro_comentarios, direcao);

        // Interrompe o carrossel automático e reativa após 10 segundos
        clearInterval(ativar_carrossel_comentarios);
        setTimeout(() => { ativar_carrossel_comentarios = padraoCarrosselComentarios; }, 10000);
      }
    };
  })
})



// ---------------- Atualiza variáveis relacionadas ao layout ao redimensionar a janela

window.addEventListener('resize', () => {
  /* Número de itens visíveis simultaneamente no carrossel */
  quantidade_exposta_projetos = +getComputedStyle(document.documentElement).getPropertyValue('--quantidade_exposta');
  quantidade_exposta_comentarios = +getComputedStyle(document.documentElement).getPropertyValue('--quantidade_exposta_comentario');

  /* Tempo que o carrossel demora para andar */
  velocidade_projetos = +getComputedStyle(document.documentElement).getPropertyValue('--tempo_carrossel');
  velocidade_comentarios = +getComputedStyle(document.documentElement).getPropertyValue('--tempo_carrossel_comentario');

  /* Quantidade de itens que o carrossel avança por ciclo */
  valorCss_projetos = +getComputedStyle(document.documentElement).getPropertyValue('--casas_por_giro');
  valorCss_comentarios = +getComputedStyle(document.documentElement).getPropertyValue('--casas_por_giro_comentario');
});


// Transição do header
const header = document.querySelector('header');

const headerObserver = new IntersectionObserver((entry) => {
  entry.forEach((el) => {
    el.target.classList.toggle('isSticky', !el.isIntersecting);
  })
}, { threshold: 1 });

headerObserver.observe(header);