import React, { Component } from "react";
import debounce from 'lodash.debounce';
import axios from 'axios';

class Chains extends Component {
    constructor(props) {
    super(props);
    this.state = {
        all_chains: 0,
        updatetime: "",
        countdown: false,
        update_attempts: 0,
        countdown_interval: null,
        chains: [],
        subscribe: 0,
        buy_on: "Купить на",
        sell_on: "Продать на",
        coin: "Коин",
        buy_place: "Место покупки",
        sell_place: "Место продажи",
        buy_as: "Купить как",
        sell_as: "Продать как",
        lower_limit: "Нижний лимит покупки",
        upper_limit: "Нижний лимит продажи",
    };

    this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.getChains();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.updatetime !== this.state.updatetime) {
            //console.log("Время обновления связок изменилось, запускаем получение актуальных связок с прошлого обновления");
            this.getChains();
        }
    }

    handleChange(name, event) {
        let obj = {};
        obj[name] = event.target.value;
        this.setState(obj, () => { this.getChains(); });
    }

    TxtInput = (nm) => {
        const printValue = debounce(value => console.log(value), 300);
        const onChange = ({ target }) => printValue(target.value);
        return <input className="form-control" id={ nm } name={ nm } placeholder="Нижний лимит покупки" type="text" onChange={ onChange }
                      onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}}/>;
    };

    countdownInterval = (countDown) => {
        const second = 1000, minute = second * 60;
        let now = new Date().getTime();
        let distance = countDown - now;
        if (distance <= 0) {
            //console.log("Сервер обновил связки, запрашиваем новые...");
            document.getElementById('seconds').innerHTML = "Обновляем...";
            if (this.state.update_attempts <= 2) {
                //console.log(`Попытка ${this.state.update_attempts}, обновляем связки.`);
                this.getChains();
            }
            else {
                //console.log(`Слишком много попыток, ждём: ${this.state.update_attempts * 10} секунд.`);
                setTimeout(this.getChains, this.state.update_attempts * 10000);
            }
            this.state.update_attempts += 1;
            clearInterval(this.state.countdown_interval);
            return false;
        }
        else
            this.state.update_attempts = 0;
        document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);
    }

    startCountdown = () => {
        if (!this.state.countdown) {
            // Обратный отсчёт должен запускаться единожды.
            this.state.countdown = true;
            let countDown = new Date(this.state.updatetime).getTime();
            //console.log("Время запроса новых связок: " + countDown);
            this.state.countdown_interval = setInterval(this.countdownInterval, 1000, countDown)
        }
    };

    getChains = () => {
        this.state.countdown = false;

        axios.get("api/chains/", {params: {
            buy_on: this.state.buy_on,
            sell_on: this.state.sell_on,
            coin: this.state.coin,
            buy_place: this.state.buy_place,
            sell_place: this.state.sell_place,
            buy_as: this.state.buy_as,
            sell_as: this.state.sell_as,
            lower_limit: this.state.lower_limit,
            upper_limit: this.state.upper_limit,
            }
        }).then(res => {
            const updatetime = res.data["updatetime"];
            const all_chains = res.data["all_chains"];
            const chains = res.data["chains"];
            const subscribe = res.data["subscribe"];
            this.setState({ all_chains, updatetime, chains, subscribe }, () => { this.startCountdown(); });
        })
    };

  render() {
    console.log(this.state.subscribe);
    const sbsrb = this.state.subscribe;
    return (
        <div>
            <div className="chainCountContainer">
                <p className="greenText"><i>Прибыльных связок: {this.state.all_chains}</i></p>
            </div>

            <hr className="splitLineGray"/>

            <div className="chainCountContainer form-group">
                    <label className="filter_label">
                        <p id="seconds" className="countdownText"/>
                    </label>
                    <label className="filter_label">
                        <img id="app_icon" src="static/frontend/images/countdown_icon.png" width="35px" height="35px" alt=""/>
                    </label>
                    <label className="filter_label">
                        <select id="buy_on" onChange={this.handleChange.bind(this, 'buy_on')} className="form-control" name="buy_on">
                            <option value="Купить на">Купить на</option>
                            <option value="PochtaBank">PochtaBank</option>
                            <option value="Yandex.Money">Yandex.Money</option>
                            <option value="Raiffaizen">Raiffaizen</option>
                            <option value="AlphaBank">AlphaBank</option>
                            <option value="VTB">VTB</option>
                            <option value="HomeCreditBank">HomeCreditBank</option>
                            <option value="QiWi">QiWi</option>
                            <option value="AkBarsBank">AkBarsBank</option>
                            <option value="Rosbank">Rosbank</option>
                            <option value="MTSBank">MTSBank</option>
                            <option value="Tinkoff">Tinkoff</option>
                            <option value="A-Bank">A-Bank</option>
                            <option value="Gasprombank">Gasprombank</option>
                            <option value="Sberbank">Sberbank</option>
                        </select>
                    </label>
                    <label className="filter_label">
                        <select id="sell_on" onChange={this.handleChange.bind(this, 'sell_on')} className="form-control" name="sell_on">
                            <option value="Продать на">Продать на</option>
                            <option value="PochtaBank">PochtaBank</option>
                            <option value="Yandex.Money">Yandex.Money</option>
                            <option value="Raiffaizen">Raiffaizen</option>
                            <option value="AlphaBank">AlphaBank</option>
                            <option value="VTB">VTB</option>
                            <option value="HomeCreditBank">HomeCreditBank</option>
                            <option value="QiWi">QiWi</option>
                            <option value="AkBarsBank">AkBarsBank</option>
                            <option value="Rosbank">Rosbank</option>
                            <option value="MTSBank">MTSBank</option>
                            <option value="Tinkoff">Tinkoff</option>
                            <option value="A-Bank">A-Bank</option>
                            <option value="Gasprombank">Gasprombank</option>
                            <option value="Sberbank">Sberbank</option>
                        </select>
                    </label>
                    <label className="filter_label">
                        <select id="coin" onChange={this.handleChange.bind(this, 'coin')} className="form-control" name="coin">
                            <option value="Коин">Коин</option>
                            <option value="USDT">USDT</option>
                            <option value="ETH">ETH</option>
                            <option value="BTC">BTC</option>
                            <option value="BUSD">BUSD</option>
                            <option value="BNB">BNB</option>
                        </select>
                    </label>
                    <label className="filter_label">
                        <select id="buy_place" onChange={this.handleChange.bind(this, 'buy_place')} className="form-control" name="buy_place">
                            <option value="Место покупки">Место покупки</option>
                            <option value="Binance">Binance</option>
                            <option value="Huobi">Huobi</option>
                            <option value="ByBit">ByBit</option>
                            <option value="OKX">OKX</option>
                            <option value="BESTCHANGE">Bestchange</option>
                        </select>
                    </label>
                    <label className="filter_label">
                        <select id="sell_place" onChange={this.handleChange.bind(this, 'sell_place')} className="form-control" name="sell_place">
                            <option value="Место продажи">Место продажи</option>
                            <option value="Binance">Binance</option>
                            <option value="Huobi">Huobi</option>
                            <option value="ByBit">ByBit</option>
                            <option value="OKX">OKX</option>
                            <option value="BESTCHANGE">Bestchange</option>
                        </select>
                    </label>
                    <label className="filter_label">
                        <select id="buy_as" onChange={this.handleChange.bind(this, 'buy_as')} className="form-control" name="buy_as">
                            <option value="Купить как">Купить как</option>
                            <option value="Тейкер">Тейкер</option>
                            <option value="Мейкер">Мейкер</option>
                        </select>
                    </label>
                    <label className="filter_label">
                        <select id="sell_as" onChange={this.handleChange.bind(this, 'sell_as')} className="form-control" name="sell_as">
                            <option value="Продать как">Продать как</option>
                            <option value="Тейкер">Тейкер</option>
                            <option value="Мейкер">Мейкер</option>
                        </select>
                    </label>
                    <label className="filter_label">
                        <input className="form-control" id="lower_limit" name="lower_limit" placeholder="Нижний лимит покупки" onChange={ debounce(this.handleChange.bind(this, 'lower_limit'), 500) }
                               onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}}/>
                    </label>
                    <label className="filter_label">
                        <input className="form-control" id="upper_limit" name="upper_limit" placeholder="Нижний лимит продажи" onChange={ debounce(this.handleChange.bind(this, 'upper_limit'), 500) }
                               onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}}/>
                    </label>
                </div>

            <hr className="splitLineYellow"/>

            { sbsrb ? (
            <div className="column">
                {this.state.chains.map(chain =>
                    <div key={chain.id}>
                        <div className="chainContainer">
                            <div className="row rowContainer">
                                <div className="infoContainer">
                                    <p className="interaction"><b>{chain.buy_role}</b></p>
                                    <a target="_blank" rel="noopener noreferrer" href={chain.buy_link}
                                       className="linkStyle">{chain.buy_detail}</a>
                                    <p className="arrowSign">➡</p>
                                    <p className="interaction"><b>{chain.sell_role}</b></p>
                                    <a target="_blank" rel="noopener noreferrer" href={chain.sell_link}
                                       className="linkStyle">{chain.sell_detail}</a>
                                </div>
                                <p className="greenTextPercent">{chain.profit_percent} %</p>
                            </div>
                            <p className="grayHintStyle">Лимит покупки: {chain.buy_min_limit} - {chain.buy_max_limit}</p>
                            <p className="grayHintStyle">Лимит продажи: {chain.sell_min_limit} - {chain.sell_max_limit}</p>
                        </div>
                        <hr className="splitLineYellow"/>
                    </div>
                )}
            </div>) : (<p className="black_text">Для просмотра связок нужна базовая подписка</p>)}
        </div>
    );
  }
}

export default Chains;