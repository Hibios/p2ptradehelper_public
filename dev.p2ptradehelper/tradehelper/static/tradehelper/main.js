function fillPage(data) {
  const chainsList = document.getElementById("chains-container");
  chainsList.innerHTML = "";

  (JSON.parse(data.context)).forEach(chain => {
      const todoHTMLElement = `
      <div class="row" style="display:flex; flex-direction: row; justify-content: space-between; align-items: center; margin-left: 100px; margin-right: 100px">
            <div style="display:flex; flex-direction: row; justify-content: center; align-items: center;">
                <p style="margin: 5px 10px; color: #EF6848; font-size: 35px;"><b>${chain.buy_role}</b></p>
                <a target="_blank" rel="noopener noreferrer" href="${chain.buy_link}" style="margin: 5px 10px; color: black;">${chain.buy_detail}</a>
                <p style="margin: 5px 10px; font-size: 40px; color: #EF6848;">➡</p>
                <p style="margin: 5px 10px; color: #EF6848; font-size: 35px;"><b>${chain.sell_role}</b></p>
                <a target="_blank" rel="noopener noreferrer" href="${chain.sell_link}" style="margin: 5px 10px; color: black;">${chain.sell_detail}</a>
            </div>
            <p style="margin: 5px 10px; color: #04DE34;">${chain.profit_percent} %</p>
        </div>
        <hr style="margin-left: 100px; margin-right: 100px; color: #EF6848; background-color: #EF6848; border: none; height: 1px"/>
      `
    chainsList.innerHTML += todoHTMLElement;
  });
}