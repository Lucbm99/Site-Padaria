let carrinho = [];
let modalQtd = 1;
let modalKey = 0;

const c = (el)=> document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

//listagem das padarias
padariaJson.map((item, index)=>{
    let padariaItem = c('.models .padaria-item').cloneNode(true);
    //preencher as informações em padaria item

    padariaItem.setAttribute('data-key', index);
    padariaItem.querySelector('.padaria-item--img img').src = item.img;
    padariaItem.querySelector('.padaria-item--name').innerHTML = item.name;
    padariaItem.querySelector('.padaria-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    padariaItem.querySelector('a').addEventListener('click', (e)=>{
    	
    	e.preventDefault();
    	let key = e.target.closest('.padaria-item').getAttribute('data-key');
    	modalQtd = 1;
        modalKey = key;

    	//procura o elemento mais proximo que contenha padaria-item
    	c('.padariaBig img').src = padariaJson[key].img;
    	c('.padariaInfo h1').innerHTML = padariaJson[key].name;
    	c('.padariaInfo--actualPrice').innerHTML = `R$ ${padariaJson[key].price.toFixed(2)}`;
        

    	c('.padariaInfo--qt').innerHTML = modalQtd;

    	c('.padariaWindowArea').style.opacity = 0;
    	c('.padariaWindowArea').style.display = 'flex';
    	setTimeout(()=>{
    		c('.padariaWindowArea').style.opacity = 1;
    	}, 200);
    });

    c('.padaria-area').append(padariaItem);

});

//eventos do modal 
function closeModal() {
    c('.padariaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.padariaWindowArea').style.display = 'none';
    }, 500);
}

cs('.padariaInfo--cancelButton, .padariaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.padariaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQtd > 1){
        modalQtd--;
        c('.padariaInfo--qt').innerHTML = modalQtd;   
    }
});

c('.padariaInfo--qtmais').addEventListener('click',()=>{
    modalQtd++;
    c('.padariaInfo--qt').innerHTML = modalQtd;       
});


//carrinho de compras
c('.padariaInfo--addButton').addEventListener('click', ()=>{

    let identifier = padariaJson[modalKey].id;

    let key = carrinho.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        carrinho[key].qt +=modalQtd;
    } else {
        carrinho.push({
            identifier,
            id:padariaJson[modalKey].id,
            qt:modalQtd
        });
    }
    atualizaCarrinho();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=> {
	if (carrinho.length > 0) {
		c('aside').style.left = '0';
	}
});

c('.menu-closer').addEventListener('click', ()=>{
	c('aside').style.left = '100vw';
});

function atualizaCarrinho(){
	c('.menu-openner span').innerHTML = carrinho.length;


    if(carrinho.length > 0){
        c('aside').classList.add('show');
        c('.carrinho').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in carrinho){
            let padariaItem = padariaJson.find((item)=>item.id == carrinho[i].id);
            subtotal += padariaItem.price * carrinho[i].qt;

            let carrinhoItem = c('.models .carrinho--item').cloneNode(true);

            let padariaName = `${padariaItem.name}`;

            carrinhoItem.querySelector('img').src = padariaItem.img;
            carrinhoItem.querySelector('.carrinho--item-nome').innerHTML = padariaName;
            carrinhoItem.querySelector('.carrinho--item--qt').innerHTML = carrinho[i].qt;
            
            carrinhoItem.querySelector('.carrinho--item-qtmenos').addEventListener('click',  ()=>{
            	if(carrinho[i].qt > 1){
            		carrinho[i].qt--;
            	} else {
            		carrinho.splice(i, 1);
            	}
            	atualizaCarrinho();
            });
            carrinhoItem.querySelector('.carrinho--item-qtmais').addEventListener('click',  ()=>{
            	carrinho[i].qt++;
            	atualizaCarrinho();
            });

            c('.carrinho').append(carrinhoItem);
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

$(document).ready(function() {
    $('#subir').click(function(){
        $('html, body').animate({scrollTop:0}, 'slow');
        return false;
    });
});