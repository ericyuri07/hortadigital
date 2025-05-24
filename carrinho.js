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
            <svg fill="#17922f" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 461.363 461.363">
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
        msgFinal.style.marginTop = '1em';
        btnFinalizar.insertAdjacentElement('afterend', msgFinal);
    }

    btnFinalizar.addEventListener('click', (e) => {
        e.preventDefault();
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (carrinho.length === 0) {
            msgFinal.textContent = "Seu carrinho está vazio, adicione itens para prosseguir.";
            setTimeout(() => {
                msgFinal.innerText = "";
            }, 4000);
            return;
        } else {
            msgFinal.textContent = "";
            window.location.href = 'compra.html';
        }
    });
});

function enviarPedidoWhatsApp() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const nome = document.getElementById("nome").value;
    const numeroVendedora = "5542984331060";
    const end = document.getElementById("endereco").value;
    const bairro = document.getElementById("bairro").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    const total = carrinho.reduce((soma, item) => {
        const precoNumero = parseFloat(item.preco.replace("R$ ", "").replace(",", "."));
        return soma + precoNumero * item.quantidade;
    }, 0);

    const listaProdutos = carrinho
        .map(item => `• ${item.nome} - x ${item.quantidade}`)
        .join("\n");

    const mensagem = `Olá! ${nome} gostaria de finalizar o pedido com os seguintes itens: \n\n${listaProdutos}\n\n*Total:* R$ ${total.toFixed(2)} \n\n📦 Instruções para entrega: \n*Endereço:* ${end} \n*Bairro:* ${bairro} \n*Número:* ${numero} \n*Complemento:* ${complemento} \n*Cidade:* ${cidade} \n*Estado:* ${estado} \n\nAguardo instruções para pagamento.`;

    const link = `https://api.whatsapp.com/send?phone=${numeroVendedora}&text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");

    localStorage.removeItem('carrinho');
    atualizarContador();

    window.location.href = 'index.html';
}
