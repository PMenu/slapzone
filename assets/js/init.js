const OwnerID = 3;
const DecimalNumber = 2;

$(document).ready(function () {
	const settings = {
		async: true,
		crossDomain: true,
		url: "https://pmenu.link/api/Data/Get_Menu_By_OWNER_ID",
		method: "POST",
		headers: {
			"Accept": "*/*",
			"Content-Type": "application/json"
		},
		processData: false,
		data: JSON.stringify({ "OWNER_ID": OwnerID })
	};

	$.ajax(settings).done(function (response) {
		console.log(response);
		const categories = {};
		response.My_Result[0].My_Menu_item.forEach(item => {
			const categoryName = item.My_Item.My_Category.NAME_L1.trim();
			if (!categories[categoryName]) {
				categories[categoryName] = {
					description: item.My_Item.My_Category.DESCRIPTION_L1 ? item.My_Item.My_Category.DESCRIPTION_L1.trim() : '',
					items: []
				};
			}
			categories[categoryName].items.push({
				name: item.My_Item.NAME_L1 ? item.My_Item.NAME_L1.trim() : '',
				description: item.My_Item.DESCRIPTION_L1 ? item.My_Item.DESCRIPTION_L1.trim() : '',
				price: item.My_Item.PRICE,
				Symbol: item.My_Item.My_Currency.SYMBOL
			});
		});
		console.log(categories);
		const menuFilters = $('#menu-flters');
		menuFilters.append('<li data-filter="*" class="filter-active">Show All</li>');
		Object.keys(categories).forEach(category => {
			const className = `filter-${category.toLowerCase().replace(/\s+/g, '-')}`;
			menuFilters.append(`<li data-filter=".${className}">${category}</li>`);
		});

		const menuContainer = $('#menu-container');
		menuContainer.empty();
		Object.keys(categories).forEach(category => {
			const className = `filter-${category.toLowerCase().replace(/\s+/g, '-')}`;
			const categoryData = categories[category];
			let categoryHeader = `
            <div class="col-lg-12 menu-item ${className}">
              <br>
              <div class="text-center">
                <b>${category}</b>
              </div>
              ${categoryData.description ? `<div class="sub">${categoryData.description}</div>` : ''}
            </div>
          `;
			menuContainer.append(categoryHeader);

			categoryData.items.forEach(item => {
				let itemElement = `
              <div class="col-lg-6 menu-item ${className}">
                <div class="menu-content">
                  ${item.name} <span>${item.price !== -1 ? `${item.price.toFixed(DecimalNumber)} ${item.Symbol}` : '--'}</span>
                </div>
                ${item.description ? `<div class="menu-ingredients">${item.description}</div>` : ''}
              </div>
            `;
				menuContainer.append(itemElement);
			});

			menuContainer.append(`<div class="col-lg-12 menu-item ${className}"><hr></div>`);
		});

		// Initialize Isotope after content is loaded
		const menuIsotope = new Isotope('.menu-container', {
			itemSelector: '.menu-item',
			layoutMode: 'fitRows'
		});

		$('#menu-flters li').on('click', function (e) {
			e.preventDefault();
			$('#menu-flters li').removeClass('filter-active');
			$(this).addClass('filter-active');
			menuIsotope.arrange({
				filter: $(this).attr('data-filter')
			});
		});
	});
});