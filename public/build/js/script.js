"use strict";const COINMARKETCAP_URI="https://api.coinmarketcap.com/v1/";let availableCoins,tickerData;const App={checkIfLoggedIn:function(){if(localStorage.getItem("token")&&localStorage.getItem("username")){const t=localStorage.getItem("username"),e=localStorage.getItem("currency")||"USD";App.UI.renderLoggedInNav(t),App.getTickerData(e).then(t=>{tickerData=t,App.UI.handleSettingsDropdown(),App.UI.renderPortfolio(),App.handleLogout()}).catch(t=>console.error(t))}else App.UI.renderStartPage(),App.handleSignup(),App.handleLogin()},getFetchInit:function(t){return{method:"POST",body:JSON.stringify(t),headers:{"Content-Type":"application/json"}}},handleSignup:function(){$(".register-form").submit(function(t){t.preventDefault();const e={username:$("#register-username").val(),password:$("#register-password").val(),passwordconfirm:$("#register-password-confirm").val()};App.register(e).then(t=>{$("#register-username, #register-password, #register-password-confirm").val(""),App.UI.handleSignupSuccess(t.username)}).catch(t=>{App.UI.renderSignupHelpMsg(t)})})},register:function(t){const e=this.getFetchInit(t);let n;return fetch("users",e).then(t=>(n=t).json()).then(t=>{if(n.ok)return t;throw`${t.reason}: ${t.location} ${t.message}`})},handleLogin:function(){$(".login-form").submit(function(t){t.preventDefault();const e={username:$("#login-username").val(),password:$("#login-password").val()};App.login(e).then(t=>{localStorage.setItem("username",t.username),localStorage.setItem("token",t.authToken),$("#login-username, #login-password").val(""),$(".modal").attr("hidden",!0),App.checkIfLoggedIn()}).catch(t=>{App.UI.renderLoginHelpMsg(t)})})},login:function(t){const e=this.getFetchInit(t);return fetch("auth/login",e).then(t=>{if(t.ok)return t.json();throw"ValidationError: Invalid username or password"})},handleLogout:function(){$("header").on("click",".js-logout",function(){localStorage.removeItem("username"),localStorage.removeItem("token"),App.checkIfLoggedIn()})},getTickerData:function(t){const e=COINMARKETCAP_URI+`ticker/?limit=0&convert=${t}`;return fetch(e).then(t=>{if(t.ok)return t.json();throw new Error("Network response was not ok.")})}};$(function(){App.checkIfLoggedIn(),App.UI.handleModals()}),App.Holdings={URI:"holdings",getAuthHeaders:function(){return{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}},get:function(){return fetch(this.URI,{headers:this.getAuthHeaders()}).then(t=>{if(t.ok)return t.json()})},add:function(t){return fetch(this.URI,{method:"POST",headers:this.getAuthHeaders(),body:JSON.stringify(t)}).then(t=>{if(t.ok)return t.json()})},update:function(t){return fetch(`${this.URI}/${t.id}`,{method:"PUT",headers:this.getAuthHeaders(),body:JSON.stringify(t)}).then(t=>{t.ok})},delete:function(t){return fetch(`${this.URI}/${t}`,{method:"DELETE",headers:this.getAuthHeaders()}).then(t=>{t.ok})},populate:function(t){const e=localStorage.getItem("currency").toLowerCase();let n=[];return t.forEach(t=>{const o=tickerData.filter(e=>e.symbol===t.symbol)[0],a={id:t.id,symbol:t.symbol,name:t.name,amount:t.amount,price:parseFloat(o[`price_${e}`]),value:t.amount*parseFloat(o[`price_${e}`]),percent_change_24h:parseFloat(o.percent_change_24h),percent_change_7d:parseFloat(o.percent_change_7d)};n.push(a)}),n},getTotals:function(t){const e=t.reduce((t,e)=>t+e.value,0),n=t.reduce((t,e)=>t+this.getPastValue(e.value,e.percent_change_24h),0),o=e-n,a=100*(e/n-1),r=t.reduce((t,e)=>t+this.getPastValue(e.value,e.percent_change_7d),0),i=e-r,l=100*(e/r-1),s=this.getBTCValue(e);return{total:e,totalBTC:App.Lib.round(s,3),change24Hrs:App.Lib.round(o),change24HrsPct:App.Lib.round(a),change7Days:App.Lib.round(i),change7DaysPct:App.Lib.round(l)}},getPastValue:function(t,e){return t/(1+e/100)},getBTCValue:function(t){const e=localStorage.getItem("currency").toLowerCase();return t/tickerData.find(t=>"BTC"===t.symbol)[`price_${e}`]}},App.Lib={round:function(t,e=2){return Number(Math.round(t+"e"+e)+"e-"+e).toFixed(e).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")},getCurrencySymbol:function(t){return"USD"===t?"$":"EUR"===t?"€":"GBP"===t?"£":void 0},formatForSort:function(t){return/^-?\$?\d*,?\d*\.?\d+%?$/.test(t)?parseFloat(t.replace(/[\$€£,]/g,""),10):t.toLowerCase()}},App.UI={handleModals:function(){$("body").click(function(t){$(t.target).hasClass("modal")&&$(".modal").attr("hidden",!0)}),$(".modal").on("click",".close, .cancel-edit-btn",function(){$(".modal").attr("hidden",!0)}),this.handleRegisterModal(),this.handleLoginModal(),this.handleEditPortfolioModal()},handleRegisterModal:function(){$(".js-register").click(function(){$(".js-register-modal").attr("hidden",!1)})},handleLoginModal:function(){$(".js-login").click(function(){$(".js-login-modal").attr("hidden",!1)})},renderStartPage:function(){$(".portfolio-container, .js-username, .js-logout, .js-register-success").attr("hidden",!0),$(".welcome-container, .stats-wrapper, .js-login, .js-register, .register-form").attr("hidden",!1)},handleSignupSuccess:function(t){const e=this.getSignupSuccessMsg(t);$(".register-form").attr("hidden",!0),$(".js-register-success").attr("hidden",!1).html(e),$(".modal").on("click",".first-login",function(){$(".js-register-modal").attr("hidden",!0),$(".js-login-modal").attr("hidden",!1)})},getSignupSuccessMsg:function(t){return`\n\t\t<p>Welcome aboard, ${t}! You may now log in.</p>\n\t\t<button class="button-primary first-login">Log in</button>`},renderSignupHelpMsg:function(t){const e=this.getHelpMsg(t);$("#register-password, #register-password-confirm").val(""),$(".register-help").attr("hidden",!1).html(e)},renderLoginHelpMsg:function(t){const e=this.getHelpMsg(t);$("#login-username, #login-password").val(""),$(".login-help").attr("hidden",!1).html(e)},getHelpMsg:function(t){return`\n\t\t<span class="loss">${t}</span>`},renderLoggedInNav:function(t){const e=this.getNavElements(t);$(".js-login, .js-register").attr("hidden",!0),$(".js-logout, .js-username").remove(),$(".header-container").append(e)},getNavElements:function(t){return`\n\t\t<a class="js-logout u-pull-right">\n\t\t\t<i class="fas fa-sign-out-alt"></i><span class="nav-text"> Log out</span>\n\t\t</a>\n\t\t<p class="js-username u-pull-right li-space">\n\t\t\t${t}\n\t\t</p>`},renderSearchHelpMsg:function(t){$(".search-help").attr("hidden",!1).html(t)},handleSettingsDropdown:function(){$("main").on("click",".js-drop-btn",function(){$(".dropdown-content").toggleClass("show")}),$("body").click(function(t){$(t.target).parent().hasClass("js-drop-btn")||$(".dropdown-content").removeClass("show")})},renderPortfolio:function(){let t;$(".welcome-container, .search-help, .stats-wrapper").attr("hidden",!0),App.Holdings.get().then(t=>App.Holdings.populate(t.holdings)).then(e=>{t=e;const n=this.getPortfolioHeader(t),o=this.getPortfolioTable(t),a=this.getPortfolioFooter(t);return Promise.all([n,o,a])}).then(e=>{const[n,o,a]=e;$(".portfolio-container").attr("hidden",!1).empty().append(n).append(o).append(a),t.length?(App.Vendor.renderPieChart(t),$("#chart-container").attr("hidden",!1)):$("#chart-container").attr("hidden",!0),this.handleNewCoinSubmit(),this.handleAddPortfolioItemClick(),this.handleCancelAdditionBtn(t),this.handleDeletePortfolioItem(),this.handleEditCurrencyModal(),this.handleTableSorting(),this.handleTableViewSelection()})},getPortfolioHeader:function(t){const e=App.Lib.getCurrencySymbol(localStorage.getItem("currency"));let n="<p>Your portfolio is currently empty.</p>",o={total:0,totalBTC:0};return t.length&&(o=App.Holdings.getTotals(t),t.map(t=>t.allocation=100/o.total*t.value),o.total=App.Lib.round(o.total),n=this.getPortfolioPerformance(o,e)),`\n\t\t<div class="row darkest">\n\t\t\t<div class="portfolio-header dropdown u-pull-right">\n\t\t\t\t<a class="portfolio-link portfolio-settings js-drop-btn">\n\t\t\t\t\t<i class="fas fa-cog"></i><span> Settings</span>\n\t\t\t\t</a>\n\t\t\t\t<div class="dropdown-content">\n\t\t\t\t\t<a class="js-edit-portfolio">Edit holdings</a>\n\t\t\t\t\t<a class="js-add-portfolio-item">Add holding</a>\n\t\t\t\t\t<a class="js-edit-currency">Edit currency</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="row darker portfolio-overview">\n\t\t\t<div class="three columns text-left">\n\t\t\t\t<strong>PORTFOLIO VALUE</strong>\n\t\t\t\t<p class="large-text">${e}${o.total} <small>(₿${o.totalBTC})</small></p>\n\t\t\t</div>\n\t\t\t<div class="five columns text-left">\n\t\t\t\t${n}\n\t\t\t</div>\n\t\t\t<div class="three columns chart-container u-full-width">\n\t\t\t\t<canvas id="allocation-chart" hidden></canvas>\n\t\t\t</div>\n\t\t</div>`},getPortfolioPerformance:function(t,e){const n=t.change24HrsPct>0?"gain":"loss",o=t.change7DaysPct>0?"gain":"loss";return`\n\t\t<strong>24 HOURS</strong>\n\t\t<p class="${n} large-text">${e}${t.change24Hrs} <small>(${t.change24HrsPct}%)</small></p>\n\t\t<strong>7 DAYS</strong>\n\t\t<p class="${o} large-text">${e}${t.change7Days} <small>(${t.change7DaysPct}%)</small></p>`},getPortfolioTable:function(t){const e=App.Lib.getCurrencySymbol(localStorage.getItem("currency"));let n="";return t.length&&t.forEach(t=>{const o=t.percent_change_24h>0?"gain":"loss",a=t.percent_change_7d>0?"gain":"loss",r=App.Lib.round(t.price),i=App.Lib.round(t.value),l=App.Lib.round(t.allocation);n+=`\n\t\t\t\t<tr>\n\t\t\t\t<td data-label="Coin">${t.name}</td>\n\t\t\t\t<td data-label="Price">${e}${r}</td>\n\t\t\t\t<td class="${o}" data-label="24 hrs">${t.percent_change_24h}%</td>\n\t\t\t\t<td class="${a} toggleable-view hidden" data-label="7 days">${t.percent_change_7d}%</td>\n\t\t\t\t<td data-label="Amount" class="toggleable-view hidden">${t.amount}</td>\n\t\t\t\t<td data-label="Value" class="toggleable-view hidden">${e}${i}</td>\n\t\t\t\t<td data-label="Allocation" class="toggleable-view hidden">${l}%</td>\n\t\t\t\t<td data-label="Delete" class="toggleable-view hidden"><a class="portfolio-link delete-holding" data-coin="${t.id}">x</a></td>\n\t\t\t\t</tr>`}),`\n\t\t<div class="row darkest">\n\t\t\t<a class="button table-view-btn toggled" role="button">simple view</a>\n\t\t\t<a class="button table-view-btn" role="button">detailed view</a>\n\t\t</div>\n\t\t<table class="u-full-width">\n\t\t  <thead class="darkest">\n\t\t    <tr>\n\t\t      <th><a class="js-sortable-header" data-sort="0">Name</a></th>\n\t\t      <th><a class="js-sortable-header" data-sort="1">Price</a></th>\n\t\t      <th><a class="js-sortable-header" data-sort="2">24 hrs</a></th>\n\t\t      <th class="toggleable-view hidden"><a class="js-sortable-header" data-sort="3">7 days</a></th>\n\t\t      <th class="toggleable-view hidden"><a class="js-sortable-header" data-sort="4">Amount</a></th>\n\t\t      <th class="toggleable-view hidden"><a class="js-sortable-header" data-sort="5">Value</a></th>\n\t\t      <th class="toggleable-view hidden"><a class="js-sortable-header" data-sort="6">Allocation</a></th>\n\t\t      <th class="toggleable-view hidden"></th>\n\t\t    </tr>\n\t\t  </thead>\n\t\t  <tbody class="darker">\n\t\t\t${n}\n\t\t  </tbody>\n\t\t </table>`},getPortfolioFooter:function(t){return t.length?this.subsequentAddHtml:this.firstAddHtml},firstAddHtml:'\n\t<div class="row portfolio-footer darkest">\n\t\t<button class="button-primary u-pull-left js-add-portfolio-item start-btn">Add your first coin</button>\n\t</div>\n\t',subsequentAddHtml:'\n\t<div class="row portfolio-footer darkest">\n\t\t<ul class="nav-list portfolio-footer-menu">\n\t\t\t<li class="u-pull-left li-space">\n\t\t\t\t<a class="portfolio-link js-add-portfolio-item">\n\t\t\t\t\t<i class="fas fa-plus"></i> Add\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li class="u-pull-left">\n\t\t\t\t<a class="portfolio-link js-edit-portfolio">\n\t\t\t\t\t<i class="fas fa-edit"></i> Edit\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n\t',handleAddPortfolioItemClick:function(t){$("main").on("click",".js-add-portfolio-item",function(){$(".portfolio-footer").remove(),$(".portfolio-container").append(App.UI.newItemForm),App.UI.populateSearchOptions()})},newItemForm:'\n\t<form class="js-add-coin-form">\n\t\t<div class="row portfolio-footer text-left darkest">\n\t\t\t<div class="six columns">\n\t\t\t\t<input type="search" class="coin-search" placeholder="Coin name" required />\n\t\t\t\t<input type="number" class="coin-amount" placeholder="Amount" min="0" step="any" required />\n\t\t\t\t<p class="search-help" aria-live="assertive" hidden></p>\n\t\t\t</div>\n\t\t\t<div class="four columns">\n\t\t\t\t<button type="submit" class="button-primary">Add coin</button>\n\t\t\t\t<a class="button cancel-addition-btn" role="button">Cancel</a>\n\t\t\t</div>\n\t\t</div>\n\t</form>\n\t',populateSearchOptions:function(){availableCoins=tickerData.map(t=>`${t.name} (${t.symbol})`),$(".coin-search").autocomplete({source:availableCoins})},handleCancelAdditionBtn:function(t){$("main").on("click",".cancel-addition-btn",function(){const e=App.UI.getPortfolioFooter(t);$(".js-add-coin-form, .portfolio-footer").remove(),$(".portfolio-container").append(e)})},handleNewCoinSubmit:function(){$("main").on("submit",".js-add-coin-form",function(t){t.preventDefault();const e=$(".coin-amount").val(),n=$(".coin-search").val();App.UI.validateInput(n).then(t=>{const o=n.split("("),a={symbol:o[1].slice(0,-1),name:o[0].slice(0,-1),amount:parseFloat(e,10)};return App.Holdings.add(a)}).then(t=>{App.UI.renderPortfolio()}).catch(t=>{App.UI.renderSearchHelpMsg(t)})})},validateInput:function(t){return new Promise((e,n)=>{let o=!1;for(let n=0;n<availableCoins.length&&!o;n++)if(t===availableCoins[n])return o=!0,$(".search-help").attr("hidden",!0),$(".coin-amount, .coin-search").val(""),e(o);setTimeout(()=>n("Invalid input"),200)})},handleEditPortfolioModal:function(){$("main").on("click",".js-edit-portfolio",function(){App.Holdings.get().then(t=>App.UI.getEditPortfolioForm(t.holdings)).then(t=>{$(".edit-holdings-modal").attr("hidden",!1),$(".js-edit-form-container").html(t),App.UI.handleEditPortfolioSubmit()})})},getEditPortfolioForm:function(t){let e="";return t.forEach(t=>{e+=`\n\t\t\t<div class="row">\n\t\t\t\t<div class="three columns">\n\t\t\t\t\t<label for="${t.id}">${t.name}</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="nine columns">\n\t\t\t\t\t<input type="number" name="${t.id}" value=${t.amount} min="0" step="any" />\n\t\t\t\t\t<a class="button delete-holding" role="button" data-coin="${t.id}">Delete</a>\n\t\t\t\t</div>\n\t\t\t</div>`}),`\n\t\t<form class="edit-portfolio-form">\n\t\t  ${e}\n\t\t  <div class="row">\n\t\t\t<button type="submit" class="button-primary">Update</button>\n\t\t\t<a class="button cancel-edit-btn" role="button">Cancel</a>\n\t\t</div>`},handleEditPortfolioSubmit:function(){$(".modal").on("submit",".edit-portfolio-form",function(t){t.preventDefault();const e=[];$('.edit-portfolio-form input[type="number"]').each(function(){e.push({id:this.name,amount:parseFloat($(this).val(),10)})});const n=e.map(t=>0===t.amount?App.Holdings.delete(t.id):App.Holdings.update(t));Promise.all(n).then(t=>{App.UI.renderPortfolio(),$(".modal").attr("hidden",!0)}).catch(t=>console.error(t))})},handleDeletePortfolioItem:function(){$("body").on("click",".delete-holding",function(t){const e=$(this).data("coin");App.Holdings.delete(e).then(()=>{App.UI.renderPortfolio(),$(".modal").attr("hidden",!0)}).catch(t=>console.error(t))})},handleEditCurrencyModal:function(){$("main").on("click",".js-edit-currency",function(){$(".currency-select").val(localStorage.getItem("currency")),$(".edit-currency-modal").attr("hidden",!1),App.UI.handleEditCurrencySubmit()})},handleEditCurrencySubmit:function(){$(".edit-currency-form").submit(function(t){t.preventDefault();const e=$(".currency-select").val();localStorage.setItem("currency",e),App.getTickerData(e).then(t=>{tickerData=t,App.UI.renderPortfolio(),$(".modal").attr("hidden",!0)}).catch(t=>console.error(t))})},handleTableSorting:function(){$("main").on("click",".js-sortable-header",function(t){const e=$(this),n=e.data("sort");App.UI.sortTable(n,e)})},sortTable:function(t,e){const n=$("table");let o,a=!0,r=0,i="desc";for(;a;){let l,s=n.find("tr");for(a=!1,l=1;l<s.length-1;l++){o=!1;let e=s[l].getElementsByTagName("td")[t],n=s[l+1].getElementsByTagName("td")[t],a=App.Lib.formatForSort(e.firstElementChild?e.firstElementChild.textContent:e.textContent),r=App.Lib.formatForSort(n.firstElementChild?n.firstElementChild.textContent:n.textContent);if("desc"===i){if(a<r){o=!0;break}}else if("asc"===i&&a>r){o=!0;break}}if(o){const t=this.getDirectionIcon(i);$(".direction-icon").remove(),e.append(t),s[l].parentNode.insertBefore(s[l+1],s[l]),a=!0,r++}else 0===r&&"desc"===i&&(i="asc",a=!0)}},getDirectionIcon:function(t){return`\n\t\t<span class="direction-icon">\n\t\t\t<i class="fas fa-caret-${"desc"===t?"down":"up"}"></i>\n\t\t</span>`},handleTableViewSelection:function(){$("main").on("click",".table-view-btn",function(t){if(!$(this).hasClass("toggled")){const t=$(this).html().split(" ")[0];$(".table-view-btn").toggleClass("toggled"),"detailed"===t?($(".toggleable-view").removeClass("hidden"),$("thead").addClass("hidden"),$("tr, td").addClass("detailed")):"simple"===t&&($(".toggleable-view").addClass("hidden"),$("thead").removeClass("hidden"),$("tr, td").removeClass("detailed"))}})}},App.Vendor={renderPieChart:function(t){const e=t.sort((t,e)=>e.allocation-t.allocation),n=document.getElementById("allocation-chart");new Chart(n,{type:"pie",data:{labels:this.getChartLabels(e),datasets:[{label:"Holdings",data:this.getChartData(e),backgroundColor:this.colors,borderColor:"#fff",borderWidth:1}]},options:{legend:{display:!1},animation:{duration:0},tooltips:{callbacks:{label:function(t,e){return e.labels[t.index]+": "+App.Lib.round(e.datasets[t.datasetIndex].data[t.index])+"%"}}}}})},getChartLabels:function(t){return t.map(t=>t.name)},getChartData:function(t){return t.map(t=>t.allocation)},colors:["#4D4D4D","#FAA43A","#5DA5DA","#F17CB0","#60BD68","#B2912F","#B276B2","#DECF3F","#F15854","#072A49","#108A9F","#431833"]};