// Traz o item que ele encontrou
const c = (el) =>document.querySelector(el);
// Tras o array com os itens que ele encontrou
const cs = (el) =>document.querySelectorAll(el);
let modalQt =1 ;
let modalKey = 0;

// array do carrinho
let cart = [];
// Listagem das pizzas
pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // atribuindo data-key em cada pizza-item, para assim tem o controle da pizza que foi clicada
    pizzaItem.setAttribute('data-key', index);
    // prencher as informações pizzaItem
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
   
    //Evento de click para a pagina não atualizar quando clicar na pizza
    pizzaItem.querySelector('a').addEventListener('click', (e) =>{
        e.preventDefault();
        // Pegando meu a href mais proximo de pizza item, quando clicar ele vai pegar o atributo data-key
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        modalQt = 1;
        // Aprensentado as informações da pizza na tela
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2 )
                size.classList.add('selected');
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        c('.pizzaInfo--qt').innerHTML = modalQt;
        
        // Mostrando o modal, e criando animação para abertura
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() =>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    //Pegando as informações dentro de Pizza item e clonando na div pizza-area
    c('.pizza-area').append(pizzaItem);
     
});

// Abrindo o modal com efeito

function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
// Fechando o Modal, quando clicar em voltar e cancelar 
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener('click', closeModal);
});
// Diminuindo quantidade de pizza
c('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
// Adicionado mais uma pizza
c('.pizzaInfo--qtmenos').addEventListener('click',() =>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
// Selecionado o tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e) =>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected');
    });
       
});
// Adcionando Pizza ao carrinho 
c('.pizzaInfo--addButton').addEventListener('click', () =>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier =  pizzaJson[modalKey].id+'@'+size;
    // Verifica no carrinho se já possui um item com mesmo indentificador
    let key = cart.findIndex((item) => item.identifier == identifier);
    // Se possui ele apenas adicionado a quantidade;
    if(key > -1){
        cart[key].qt += modalQt;
    // Se não adiciona novo indentificador
    } else{
        // Criando  um array e adicioando pizza, tamanho e quantidade
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    } 
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click',()=>{
    c('aside').style.left = '100vw';
});

function updateCart(){

    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0; 
        let total = 0;
        let desconto = 0;

        for( let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            subtotal  += pizzaItem.price * cart[i].qt;
            

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                pizzaSizeName = 'G';
                    break;
            }

            let pizzaName =  `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; 
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',() =>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i,1);
                }

                updateCart();

            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',() =>{
                cart[i].qt++;
                updateCart();
            });
            
            c('.cart').append(cartItem);
            

            console.log(pizzaItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';

    }
}
