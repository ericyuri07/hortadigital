function atualizarContador() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contador = document.getElementById('contador-carrinho');
    const cont = document.getElementById("continuar");

    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

    if (contador) {
        contador.textContent = totalItens;
    }

    if (cont) {
        if (totalItens === 0) {
            cont.textContent = "Escolha seus produtos";
        } else {
            cont.textContent = "Continuar comprando";
        }
    }
}


function adicionarAoCarrinho(nome, preco, imagem) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = carrinho.findIndex(item => item.nome === nome);
    if (index > -1) {
        carrinho[index].quantidade += 1;
    } else {
        carrinho.push({ nome, preco, imagem, quantidade: 1 });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContador();
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();

    const botoesComprar = document.querySelectorAll('.btn-comprar');
    const itemAdd = document.getElementById("item-add");

    botoesComprar.forEach(btn => {
        btn.addEventListener('click', () => {
            const nome = btn.getAttribute('data-nome');
            const preco = btn.getAttribute('data-preco');
            const imagem = btn.getAttribute('data-imagem');
            const botao = document.getElementById("continuar");

            adicionarAoCarrinho(nome, preco, imagem);

            itemAdd.style.backgroundColor = 'green';
            itemAdd.style.borderRadius = '10px';
            itemAdd.style.opacity = '0.8';
            itemAdd.style.padding = '10px 20px';
            itemAdd.innerText = `${nome} foi adicionada(o) ao carrinho ✅`;

            setTimeout(() => {
                itemAdd.innerText = "";
                itemAdd.style.backgroundColor = 'transparent';
            }, 3000);
        });
    });

    const container = document.getElementById('lista-carrinho');

    function renderCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (!container) return;

        container.innerHTML = '';

        if (carrinho.length === 0) {
            container.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }

        carrinho.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item-carrinho';

            const precoNumerico = parseFloat(item.preco.toString().replace('R$', '').replace(',', '.').trim());
            const totalItem = (precoNumerico * item.quantidade).toFixed(2);

            div.innerHTML = `
        <div class="item-info">
            <img src="${item.imagem}" alt="${item.nome}">
            <div>
                <p><strong>${item.nome}</strong></p>
                <p class="produto">produto</p>
                <div class="total">
                    <p class="subtotal">subtotal</p>
                    <p class="preco-item">R$ ${totalItem}</p>
                </div>
                <input type="number" min="1" value="${item.quantidade}" class="quantidade-input" data-index="${index}">
                <p class="quantidade">Quantidade</p>
            </div>
        </div>
        <button class="remover-btn" data-index="${index}">
            <svg fill="#17922f" xmlns="http://www.w3.org/2000/svg" width="50px" height="20px" viewBox="0 0 461.363 461.363">
                <polygon points="95.088,461.363 366.276,461.363 389.653,105.984 71.71,105.984 "/>
                <path d="M279.192,0h-97.02L71.71,23.557v50.83h317.943v-50.83L279.192,0z M301.683,47.871h-142V26.516h142V47.871z"/>
            </svg>
        </button>
    `;
            container.appendChild(div);
        });

        let subtotal = 0;
        carrinho.forEach(item => {
            const preco = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
            subtotal += preco * item.quantidade;
            return subtotal
        });
        const desconto = subtotal >= 100 ? subtotal * 0.1 : 0;
        const total = subtotal - desconto;

        const totaisHTML = `
            <p class="linha-totais">Totais</p>
            <div class="totais-carrinho">
                <div class="linha-total">
                    <p class="linha-sub">Subtotal:</p>
                    <p class="linha-subtotal" id="subtotal">R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="linha-total">
                    <p class="linha-desconto">Desconto:</p>
                    <p class="linha-descontos" id="desconto">R$ ${desconto.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="linha-total">
                    <p class="linha-final">Total:</p>
                    <p class="linha-total-final" id="total">R$ ${total.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', totaisHTML);

        const botoesRemover = container.querySelectorAll('.remover-btn');
        botoesRemover.forEach(botao => {
            botao.addEventListener('click', () => {
                const index = botao.getAttribute('data-index');
                const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                atualizarContador();
                renderCarrinho();
                if (msgFinal) msgFinal.textContent = '';
            });
        });

        const inputsQuantidade = container.querySelectorAll('.quantidade-input');
        inputsQuantidade.forEach(input => {
            input.addEventListener('change', () => {
                const idx = input.getAttribute('data-index');
                const val = parseInt(input.value);
                const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

                if (val > 0) {
                    carrinho[idx].quantidade = val;
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    atualizarContador();
                    renderCarrinho();
                } else {
                    input.value = carrinho[idx].quantidade;
                }
            });
        });
    }

    renderCarrinho();

    let msgFinal = document.getElementById('mensagem-final');
    const btnFinalizar = document.querySelector('.finalizar-btn');

    if (!msgFinal) {
        msgFinal = document.createElement('p');
        msgFinal.id = 'mensagem-final';
        msgFinal.style.color = 'red';
        btnFinalizar.insertAdjacentElement('afterend', msgFinal);
    }

    btnFinalizar.addEventListener('click', (e) => {
        e.preventDefault();
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (carrinho.length === 0) {
            container.innerHTML = '<p>Seu carrinho está vazio, adicione itens para seguir.</p>';

        } else {
            window.location.href = 'compra.html';
        }

    });
});

function enviarPedidoWhatsApp() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const nome = document.getElementById("nome").value.trim();
    const end = document.getElementById("endereco").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const complemento = document.getElementById("complemento").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const numeroVendedora = "5542999145187";

    // ✅ Verificação dos campos obrigatórios
    if (!nome || !end || !bairro || !numero || !cidade || !estado) {
        alert("Por favor, preencha todos os campos obrigatórios antes de finalizar o pedido.");
        return;
    }

    const total = carrinho.reduce((soma, item) => {
        const precoNumero = parseFloat(item.preco.replace("R$ ", "").replace(",", "."));
        return soma + precoNumero * item.quantidade;
    }, 0);

    const listaProdutos = carrinho
        .map(item => `• ${item.nome} - x ${item.quantidade}`)
        .join("\n");

    const mensagem = `Olá! Me chamo ${nome} gostaria de finalizar o pedido com os seguintes itens: \n\n${listaProdutos}\n\n*Total:* R$ ${total.toFixed(2)} \n\n📦 Instruções para entrega: \n*Endereço:* ${end} \n*Bairro:* ${bairro} \n*Número:* ${numero} \n*Complemento:* ${complemento ? complemento : 'Nenhum'} \n*Cidade:* ${cidade} \n*Estado:* ${estado} \n\nAguardo instruções para pagamento.`;

    const link = `https://api.whatsapp.com/send?phone=${numeroVendedora}&text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");

    localStorage.removeItem('carrinho');
    atualizarContador();

    window.location.href = 'index.html';
}



const inputPesquisa = document.getElementById("pesquisa");

inputPesquisa.addEventListener("input", function () {
    const termo = this.value.toLowerCase().trim();

    const secoesCatalogo = document.querySelectorAll(".caixa-catalogo");
    const headerProdutos = document.querySelector(".header-produtos");
    const todosProdutos = document.querySelectorAll(".caixa-catalogo > div");
    const headerArtesanais = document.querySelector(".caixa-artesanais");
    const headerFrutas = document.querySelector(".caixa-frutas");

    // Container dos resultados
    let resultadoPesquisa = document.querySelector(".resultado-pesquisa");
    if (!resultadoPesquisa) {
        resultadoPesquisa = document.createElement("div");
        resultadoPesquisa.classList.add("resultado-pesquisa");
        resultadoPesquisa.style.display = "flex";
        resultadoPesquisa.style.flexWrap = "wrap";
        resultadoPesquisa.style.gap = "20px";
        resultadoPesquisa.style.margin = "40px";
        resultadoPesquisa.style.padding = "40px";
        resultadoPesquisa.style.border = "2px solid #4caf50";
        resultadoPesquisa.style.width = "300px";
        resultadoPesquisa.style.marginTop = "15vh";
        resultadoPesquisa.style.borderRadius = "40px";
        resultadoPesquisa.style.backgroundColor = "#FFFFFF";
        resultadoPesquisa.style.boxShadow = "4px 4px 9px -2px rgba(0, 0, 0, 0.2)";
        document.body.insertBefore(resultadoPesquisa, document.body.children[1]);
    }

    resultadoPesquisa.innerHTML = "";

    if (termo !== "") {
        let encontrouAlgum = false;

        todosProdutos.forEach(produto => {
            const nomeProduto = produto.querySelector("p").textContent.toLowerCase();

            if (nomeProduto.includes(termo)) {
                const clone = produto.cloneNode(true);

                // Adiciona o evento ao botão "comprar" dentro do clone
                const botao = clone.querySelector(".btn-comprar");
                if (botao) {
                    botao.addEventListener("click", () => {
                        const nome = botao.getAttribute("data-nome");
                        const preco = botao.getAttribute("data-preco");
                        const imagem = botao.getAttribute("data-imagem");

                        adicionarAoCarrinho(nome, preco, imagem);

                        const itemAdd = document.getElementById("item-add");
                        itemAdd.style.backgroundColor = "green";
                        itemAdd.style.borderRadius = "10px";
                        itemAdd.style.opacity = "0.8";
                        itemAdd.style.padding = "10px 20px";
                        itemAdd.innerText = `${nome} foi adicionada(o) ao carrinho ✅`;

                        setTimeout(() => {
                            itemAdd.innerText = "";
                            itemAdd.style.backgroundColor = "transparent";
                        }, 3000);
                    });
                }

                resultadoPesquisa.appendChild(clone);
                encontrouAlgum = true;
            }
        });

        if (encontrouAlgum) {
            resultadoPesquisa.style.display = "flex";
        } else {
            resultadoPesquisa.innerHTML = "<p>Nenhum produto encontrado.</p>";
            resultadoPesquisa.style.display = "flex";
        }

        // Esconde catálogo original
        secoesCatalogo.forEach(secao => secao.style.display = "none");
        if (headerProdutos) headerProdutos.style.display = "none";
        if (headerArtesanais) headerArtesanais.style.display = "none";
        if (headerFrutas) headerFrutas.style.display = "none"
    } else {
        // Mostrar o catálogo original
        resultadoPesquisa.style.display = "none";
        secoesCatalogo.forEach(secao => secao.style.display = "flex");
        if (headerProdutos) headerProdutos.style.display = "flex";
        if (headerArtesanais) headerArtesanais.style.display = "flex";
        if (headerFrutas) headerFrutas.style.display = "flex"

    }
});
