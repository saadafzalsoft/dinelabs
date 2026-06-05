/* 
========================================================================
   BARTARTINE / DINELABS PIZZA HOME PAGE LOGIC
   Strict design pattern compliance, modal popup customization,
   real-time basket drawer and mobile floating cart floater
========================================================================
*/

// Application State
const state = {
  basket: [],
  deliveryMode: 'delivery', // 'delivery' or 'pickup'
  activeFilter: 'all',
  
  // Customizer Modal State
  currentPizzaId: null,
  currentPizzaPrice: 0.00,
  currentQty: 1
};

// Pizza Base Data for Modal Calculations
const pizzaData = {
  1: { id: 1, name: "Korean BBQ Chicken Cheezy Crust", basePrice: 16.90, desc: "Pan crust (a1), baked, breaded chicken (4, a1), mozzarella (g), pepper mix, jalapeños, Korean BBQ sauce (f), chili flakes", img: "assets/bbq_chicken_pizza.png" },
  2: { id: 2, name: "Korean BBQ Chicken Classic M", basePrice: 11.90, desc: "Pan crust (a1), baked, breaded chicken (4, a1), mozzarella (g), pepper mix, jalapeños, Korean BBQ sauce (f), chili flakes", img: "assets/bbq_chicken_pizza.png" },
  3: { id: 3, name: "Korean BBQ Chicken Sticks (8 Pieces)", basePrice: 9.90, desc: "Baked, breaded chicken (4, a1), Korean BBQ sauce (f), chili flakes, served golden brown in a basket", img: "assets/chicken_sticks.png" },
  4: { id: 4, name: "Korean BBQ Chicken Wings (5 pieces)", basePrice: 6.90, desc: "Baked chicken wings, seasoned liquid (4), Korean BBQ sauce (f), chili flakes", img: "assets/chicken_sticks.png" },
  5: { id: 5, name: "2x Flatzz of your choice", basePrice: 12.99, desc: "Choose your favorite Flatzz. Hand-tossed flatbread pizzas with custom fresh toppings of your choice.", img: "assets/flatzz.png" },
  6: { id: 6, name: "4x Flatzz of your choice", basePrice: 22.99, desc: "Choose your favorite Flatzz. Perfect for gatherings and groups.", img: "assets/flatzz.png" },
  7: { id: 7, name: "Medium Deal", basePrice: 21.50, desc: "2 Medium Pizzas of your choice: PAN M (26 cm) - crispy outside, soft inside", img: "assets/hero_pizza.png" },
  8: { id: 8, name: "Share Box", basePrice: 22.99, desc: "1 Large Pan or Classic Pizza of your choice with 4 toppings", img: "assets/pep_pizza.png" },
  
  // Carousel Offers
  101: { id: 101, name: "Large Deal", basePrice: 25.50, desc: "Large woodfired pizza with special sides and drinks of choice", img: "assets/hero_pizza.png" },
  102: { id: 102, name: "2x Flatzz of choice", basePrice: 12.99, desc: "Two delicious rectangular flatzz with fresh basil, mozzarella, and toppings", img: "assets/flatzz.png" },
  103: { id: 103, name: "Margherita Pan L", basePrice: 12.90, desc: "Classic pan style pizza loaded with double cheese and San Marzano sauce", img: "assets/cheese_pizza.png" },
  104: { id: 104, name: "Salami Pan L", basePrice: 14.90, desc: "Classic pan style pizza loaded with pepperoni and spicy salami slices", img: "assets/pep_pizza.png" }
};

// DOM Elements
const elements = {
  offersCarousel: document.getElementById('offersCarousel'),
  slideLeftBtn: document.getElementById('slideLeftBtn'),
  slideRightBtn: document.getElementById('slideRightBtn'),
  itemSearch: document.getElementById('itemSearch'),
  categoryPillList: document.getElementById('categoryPillList'),
  productsMenuGrid: document.getElementById('productsMenuGrid'),
  
  // Basket Sidebar Panel
  basketSidebar: document.getElementById('basketSidebar'),
  deliveryToggle: document.getElementById('deliveryToggle'),
  pickupToggle: document.getElementById('pickupToggle'),
  basketEmptyState: document.getElementById('basketEmptyState'),
  basketItemsList: document.getElementById('basketItemsList'),
  basketFooter: document.getElementById('basketFooter'),
  basketSubtotal: document.getElementById('basketSubtotal'),
  basketDelivery: document.getElementById('basketDelivery'),
  basketDeliveryRow: document.getElementById('basketDeliveryRow'),
  basketTotal: document.getElementById('basketTotal'),
  basketCheckoutBtn: document.getElementById('basketCheckoutBtn'),
  
  // Mobile Floating Cart Floater
  mobileCartFloat: document.getElementById('mobileCartFloat'),
  mobileCartBadge: document.getElementById('mobileCartBadge'),
  mobileCartPrice: document.getElementById('mobileCartPrice'),
  
  // Customization Popup Modal
  customizationModal: document.getElementById('customizationModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalPizzaImg: document.getElementById('modalPizzaImg'),
  modalTitle: document.getElementById('modalTitle'),
  modalDescription: document.getElementById('modalDescription'),
  modalBasePrice: document.getElementById('modalBasePrice'),
  modalSizesContainer: document.getElementById('modalSizesContainer'),
  modalIngredientsContainer: document.getElementById('modalIngredientsContainer'),
  modalQtyDecrease: document.getElementById('modalQtyDecrease'),
  modalQtyIncrease: document.getElementById('modalQtyIncrease'),
  modalQtyNum: document.getElementById('modalQtyNum'),
  modalAddBtn: document.getElementById('modalAddBtn'),
  modalAddFinalPrice: document.getElementById('modalAddFinalPrice'),
  
  // Header Elements
  menuToggle: document.getElementById('menuToggle'),
  flagDropdown: document.getElementById('flagDropdown')
};

/* 
========================================================================
   INITIALIZATION
========================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
  // Load basket state
  loadBasketFromStorage();
  
  // Set up event handlers
  initCarouselControls();
  initPillFilters();
  initSearch();
  initDeliveryToggle();
  initProductAddActions();
  initMobileControls();
  initModalActions();
  
  // Render basket UI
  updateBasketUI();
});

/* 
========================================================================
   OFFERS CAROUSEL HORIZONTAL SCROLLING
========================================================================
*/
function initCarouselControls() {
  elements.slideLeftBtn.addEventListener('click', () => {
    elements.offersCarousel.scrollBy({ left: -260, behavior: 'smooth' });
  });

  elements.slideRightBtn.addEventListener('click', () => {
    elements.offersCarousel.scrollBy({ left: 260, behavior: 'smooth' });
  });
}

/* 
========================================================================
   CATEGORY PILLS FILTERING
========================================================================
*/
function initPillFilters() {
  const pills = elements.categoryPillList.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      const filterValue = pill.getAttribute('data-filter');
      state.activeFilter = filterValue;
      applyFilters();
    });
  });
}

function applyFilters() {
  const query = elements.itemSearch.value.toLowerCase().trim();
  const productCards = elements.productsMenuGrid.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const title = card.querySelector('.product-title').innerText.toLowerCase();
    const desc = card.querySelector('.product-desc').innerText.toLowerCase();
    const categories = card.getAttribute('data-category').split(' ');
    
    const matchesSearch = title.includes(query) || desc.includes(query);
    const matchesCategory = state.activeFilter === 'all' || categories.includes(state.activeFilter);
    
    if (matchesSearch && matchesCategory) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
    }
  });
}

/* 
========================================================================
   ITEM SEARCH FILTERING
========================================================================
*/
function initSearch() {
  elements.itemSearch.addEventListener('input', () => {
    applyFilters();
  });
}

/* 
========================================================================
   DELIVERY / PICKUP TOGGLE
========================================================================
*/
function initDeliveryToggle() {
  elements.deliveryToggle.addEventListener('click', () => {
    elements.deliveryToggle.classList.add('active');
    elements.pickupToggle.classList.remove('active');
    state.deliveryMode = 'delivery';
    updateBasketUI();
  });

  elements.pickupToggle.addEventListener('click', () => {
    elements.pickupToggle.classList.add('active');
    elements.deliveryToggle.classList.remove('active');
    state.deliveryMode = 'pickup';
    updateBasketUI();
  });
}

/* 
========================================================================
   CUSTOMIZATION POPUP TRIGGER FLOW
========================================================================
*/
function initProductAddActions() {
  // Clicking anywhere on product card or its plus button opens the Customizer Modal
  const productCards = elements.productsMenuGrid.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openCustomizerModal(id);
    });
  });

  // Clicking an offer slide opens the Customizer Modal
  const offerCards = elements.offersCarousel.querySelectorAll('.offer-card');
  offerCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-pizza-id');
      openCustomizerModal(id);
    });
  });
}

/* 
========================================================================
   POPUP CUSTOMIZATION MODAL FUNCTIONS
========================================================================
*/
function initModalActions() {
  // Close Modal Button
  elements.modalCloseBtn.addEventListener('click', closeCustomizerModal);
  elements.customizationModal.addEventListener('click', (e) => {
    if (e.target === elements.customizationModal) closeCustomizerModal();
  });

  // Modal Size radios change price
  const sizeRadios = elements.modalSizesContainer.querySelectorAll('input[type="radio"]');
  sizeRadios.forEach(radio => {
    radio.addEventListener('change', recalculateModalPrice);
  });

  // Modal Ingredient checkboxes removed toggles
  const ingredientChecks = elements.modalIngredientsContainer.querySelectorAll('input[type="checkbox"]');
  ingredientChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      const parentRow = chk.closest('.remove-option-row');
      if (chk.checked) {
        parentRow.classList.add('removed');
      } else {
        parentRow.classList.remove('removed');
      }
      recalculateModalPrice();
    });
  });

  // Modal Qty Selectors
  elements.modalQtyDecrease.addEventListener('click', () => {
    if (state.currentQty > 1) {
      state.currentQty--;
      elements.modalQtyNum.innerText = state.currentQty;
      recalculateModalPrice();
    }
  });

  elements.modalQtyIncrease.addEventListener('click', () => {
    state.currentQty++;
    elements.modalQtyNum.innerText = state.currentQty;
    recalculateModalPrice();
  });

  // Add Item to Cart (Modal button)
  elements.modalAddBtn.addEventListener('click', () => {
    addCustomizedPizzaToBasket();
  });
}

function openCustomizerModal(id) {
  const pizza = pizzaData[id];
  if (!pizza) return;

  state.currentPizzaId = id;
  state.currentPizzaPrice = pizza.basePrice;
  state.currentQty = 1;

  // Reset modal values
  elements.modalPizzaImg.src = pizza.img;
  elements.modalTitle.innerText = pizza.name;
  elements.modalDescription.innerText = pizza.desc;
  elements.modalBasePrice.innerText = formatCurrency(pizza.basePrice);
  elements.modalQtyNum.innerText = "1";

  // Reset Radio selectors to Small size default
  const sizeRadios = elements.modalSizesContainer.querySelectorAll('input[type="radio"]');
  sizeRadios.forEach((radio, index) => {
    radio.checked = index === 0;
  });

  // Reset ingredients checkboxes (untoggled means ingredient is kept)
  const ingredientChecks = elements.modalIngredientsContainer.querySelectorAll('input[type="checkbox"]');
  ingredientChecks.forEach(chk => {
    chk.checked = false;
    chk.closest('.remove-option-row').classList.remove('removed');
  });

  // Recalculate price
  recalculateModalPrice();

  // Slide open modal
  elements.customizationModal.classList.add('active');
}

function closeCustomizerModal() {
  elements.customizationModal.classList.remove('active');
  state.currentPizzaId = null;
}

function recalculateModalPrice() {
  if (!state.currentPizzaId) return;

  let base = pizzaData[state.currentPizzaId].basePrice;
  
  // Add extra size cost
  const selectedRadio = elements.modalSizesContainer.querySelector('input[type="radio"]:checked');
  if (selectedRadio) {
    base += parseFloat(selectedRadio.getAttribute('data-price-add') || 0);
  }

  const finalTotal = base * state.currentQty;
  elements.modalAddFinalPrice.innerText = formatCurrency(finalTotal);
}

function addCustomizedPizzaToBasket() {
  if (!state.currentPizzaId) return;

  const id = state.currentPizzaId;
  const pizza = pizzaData[id];
  
  // Selected Size
  const sizeRadio = elements.modalSizesContainer.querySelector('input[type="radio"]:checked');
  const size = sizeRadio ? sizeRadio.value : 'S';
  const sizeAdd = sizeRadio ? parseFloat(sizeRadio.getAttribute('data-price-add') || 0) : 0;
  
  // Selected removed ingredients
  const removedList = [];
  elements.modalIngredientsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(chk => {
    removedList.push(chk.value);
  });

  // Calculated individual item price
  const itemPrice = pizza.basePrice + sizeAdd;

  // Add compiled customized item to cart array
  // Check if identical item already exists (same pizza id, size, and removed ingredients)
  const cartIndex = state.basket.findIndex(item => 
    item.id === id && 
    item.size === size && 
    JSON.stringify(item.removedIngredients) === JSON.stringify(removedList)
  );

  if (cartIndex > -1) {
    state.basket[cartIndex].quantity += state.currentQty;
  } else {
    state.basket.push({
      cartId: Date.now() + Math.random().toString(36).substr(2, 9),
      id: id,
      name: pizza.name,
      image: pizza.img,
      size: size,
      removedIngredients: removedList,
      price: parseFloat(itemPrice.toFixed(2)),
      quantity: state.currentQty
    });
  }

  saveBasketToStorage();
  updateBasketUI();
  
  // Close customize overlay
  closeCustomizerModal();

  // Highlight add animations on desktop sidebar
  if (window.innerWidth > 992) {
    elements.basketSidebar.style.borderColor = 'var(--brand-red)';
    setTimeout(() => { elements.basketSidebar.style.borderColor = ''; }, 600);
  }
}

/* 
========================================================================
   REAL-TIME BASKET DRAWER RENDERING & ARITHMETICS
========================================================================
*/
function updateBasketUI() {
  elements.basketItemsList.innerHTML = '';
  
  if (state.basket.length === 0) {
    elements.basketEmptyState.style.display = 'flex';
    elements.basketItemsList.style.display = 'none';
    elements.basketFooter.style.display = 'none';
    
    // Hide mobile view cart floater
    elements.mobileCartFloat.classList.remove('visible');
    return;
  }

  elements.basketEmptyState.style.display = 'none';
  elements.basketItemsList.style.display = 'flex';
  elements.basketFooter.style.display = 'block';

  // Render Basket Row Items
  state.basket.forEach(item => {
    const basketRow = document.createElement('div');
    basketRow.className = 'basket-item';
    
    // Format removed ingredients label
    const removedText = item.removedIngredients.length > 0 ? `(No ${item.removedIngredients.join(', ')})` : '';
    const detailsLabel = `${item.size} ${removedText}`;
    
    const itemTotalFormatted = formatCurrency(item.price * item.quantity);
    
    basketRow.innerHTML = `
      <div class="basket-item-info">
        <h4 class="basket-item-name">${item.name}</h4>
        <div class="basket-item-customizations">${detailsLabel}</div>
        <div class="basket-item-price">${itemTotalFormatted}</div>
      </div>
      <div class="basket-qty-control">
        <span class="basket-qty-btn decrease-qty" data-id="${item.cartId}">&minus;</span>
        <span class="basket-qty-num">${item.quantity}</span>
        <span class="basket-qty-btn increase-qty" data-id="${item.cartId}">&plus;</span>
      </div>
    `;

    elements.basketItemsList.appendChild(basketRow);
  });

  // Attach dynamic list click handlers
  elements.basketItemsList.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cartId = btn.getAttribute('data-id');
      changeItemQuantity(cartId, -1);
    });
  });

  elements.basketItemsList.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cartId = btn.getAttribute('data-id');
      changeItemQuantity(cartId, 1);
    });
  });

  // Execute computations and update mobile float view cart
  calculateArithmetics();
}

function changeItemQuantity(cartId, change) {
  const index = state.basket.findIndex(item => item.cartId === cartId);
  if (index > -1) {
    state.basket[index].quantity += change;
    
    if (state.basket[index].quantity <= 0) {
      state.basket.splice(index, 1);
    }
    
    saveBasketToStorage();
    updateBasketUI();
  }
}

function calculateArithmetics() {
  const subtotal = state.basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = state.basket.reduce((sum, item) => sum + item.quantity, 0);
  
  // Mode checks
  let deliveryCost = 0;
  if (state.deliveryMode === 'delivery') {
    // Deliver charge: Free above $35.00, else $3.99
    deliveryCost = subtotal >= 35.00 ? 0.00 : 3.99;
    elements.basketDeliveryRow.style.display = 'flex';
  } else {
    elements.basketDeliveryRow.style.display = 'none';
  }

  const total = subtotal + deliveryCost;

  // Render to UI using custom Comma currency formatter
  elements.basketSubtotal.innerText = formatCurrency(subtotal);
  elements.basketDelivery.innerText = deliveryCost === 0 ? 'FREE' : formatCurrency(deliveryCost);
  elements.basketTotal.innerText = formatCurrency(total);

  // Sync Mobile Floating Cart Floater!
  elements.mobileCartBadge.innerText = totalItemsCount;
  elements.mobileCartPrice.innerText = formatCurrency(total);
  
  // Display mobile cart floater
  if (totalItemsCount > 0) {
    elements.mobileCartFloat.classList.add('visible');
  } else {
    elements.mobileCartFloat.classList.remove('visible');
  }
}

// Custom currency formatter following user's design ($25,50 style)
function formatCurrency(val) {
  const formatted = val.toFixed(2).replace('.', ',');
  return `$${formatted}`;
}

// Storage Helpers
function saveBasketToStorage() {
  localStorage.setItem('bartartine_basket', JSON.stringify(state.basket));
}

function loadBasketFromStorage() {
  const saved = localStorage.getItem('bartartine_basket');
  if (saved) {
    try {
      state.basket = JSON.parse(saved);
      // Ensure all loaded items are valid and have the removedIngredients array to prevent TypeErrors
      state.basket.forEach(item => {
        if (!item.removedIngredients) item.removedIngredients = [];
      });
    } catch (e) {
      state.basket = [];
    }
  }
}

/* 
========================================================================
   MOBILE INTERACTION CONTROLS
========================================================================
*/
function initMobileControls() {
  // Toggle navigation menu
  elements.menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    alert("🔗 bartartine bistro navigation menu toggled! Welcome to our premium pizza system.");
  });

  // Clicking language flag dropdown
  elements.flagDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    alert("🌍 Language selector clicked! Setting region and country.");
  });

  // Clicking mobile float View Cart bar toggles/slides open the basket sidebar
  elements.mobileCartFloat.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.basketSidebar.classList.toggle('active');
  });

  // Click outside to close cart sidebar on mobile
  document.addEventListener('click', (e) => {
    if (!elements.basketSidebar.contains(e.target) && !elements.mobileCartFloat.contains(e.target)) {
      elements.basketSidebar.classList.remove('active');
    }
  });

  // Confirm order action
  elements.basketCheckoutBtn.addEventListener('click', () => {
    const total = elements.basketTotal.innerText;
    alert(`🎉 Order Confirmed!\nTotal due: ${total}\n\nOur kitchen is hand-tossing your dough right now. Standard delivery time is 25-40 minutes!`);
    
    state.basket = [];
    saveBasketToStorage();
    updateBasketUI();
    
    // Close sidebar on mobile
    elements.basketSidebar.classList.remove('active');
  });
}
