import React, { Component } from 'react';
import Messages from './language.json';
import moment from 'moment';
import _ from 'underscore';
import { Bar } from 'react-chartjs-2';
import FontAwesome from 'react-fontawesome';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toggle from 'material-ui/Toggle';
import './App.css';

const script = document.currentScript;
let lang =  'en';
if (script && script.hasAttribute('lan') && Messages.languages.includes(script.getAttribute('lan'))) {
  lang = script.getAttribute('lan');
}

const styles = {
  block: {
    width: 60,
  },
  thumbOff: {
    backgroundColor: '#a8a8a8',
  },
  trackOff: {
    backgroundColor: 'rgba(1,1,1,0.4)',
  },
  thumbSwitched: {
    backgroundColor: 'rgba(50,154,85,1)',
  },
  trackSwitched: {
    backgroundColor: 'rgba(1,1,1,0.4)',
  },
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      year: 10,
      initialSavings: 1000,
      interest: 7,
      monthlySavings: 2500,
      bankComparison: false,
      bankInterest: 0.5,
      givesProfit: false,
      whenProfitIsPerMonth: 1000,
    };
  }

  chartData() {
    const data = this.calculateData();
    const chartData = {
      labels: this.getYears(),
      datasets: [{
        label: Messages.EconomicalGrowth[lang],
        type: 'line',
        data: data.economicalGrowth,
        backgroundColor: 'rgba(244,179,23,0)',
        borderColor: 'rgba(244,179,23,1)'
      }]
    };
    if (this.state.bankComparison) {
      chartData.datasets.push({
        label: Messages.BankGrowth[lang],
        type: 'line',
        data: data.bankGrowth,
        backgroundColor: 'rgba(50,154,85,0)',
        borderColor: 'rgba(50,154,85,1)'
      });
    }
    if (this.state.givesProfit) {
      chartData.datasets.push({
        label: Messages.Profit[lang],
        type: 'bar',
        data: data.profit,
        backgroundColor: 'rgba(170,221,255,0.8)',
        borderColor: 'rgba(170,221,255,1)'
      });
    }
    return chartData;
  }

  getYears() {
    const currentYear = moment().year();
    const years = this.state.year === '' ? 0 : parseInt(this.state.year, 10);
    return _.range(currentYear, currentYear + years);
  }
  
  allDefined() {
    return (this.state.initialSavings !== undefined)
    && (this.state.interest !== undefined)
    && (this.state.monthlySavings !== undefined)
    && (this.state.year !== undefined);
  }
  
  calculateData() {
    const data = { economicalGrowth: [], bankGrowth: [], profit: [] };
    if (this.allDefined()) {
      const savings = this.state.initialSavings === '' ? 0 : parseFloat(this.state.initialSavings, 10);
      const interest = this.state.interest === '' ? 0 : parseFloat(this.state.interest, 10);
      const monthlySavings = this.state.monthlySavings === '' ? 0 : parseFloat(this.state.monthlySavings, 10);
      const bankInterest = this.state.bankInterest === '' ? 0 : parseFloat(this.state.bankInterest, 10);
      const profit = this.state.whenProfitIsPerMonth === '' ? 0 : parseFloat(this.state.whenProfitIsPerMonth, 10);
      
      data.economicalGrowth.push( savings + this.state.monthlySavings * 12 );
      
      if (this.state.bankComparison) {
        data.bankGrowth.push( savings + this.state.monthlySavings * 12 );
      }
      if (this.state.givesProfit) {
        data.profit.push(0);
      }
      
      for (var i = 1; i < this.state.year; i++) {
        const currentYearProfit = data.economicalGrowth[i - 1] * (interest / 100);
        const currentYearBankProfit = data.bankGrowth[i - 1] * (bankInterest / 100);
        const stopSaving = currentYearProfit > (profit * 12);
        const stopBankSaving = currentYearBankProfit > (profit * 12);
        
        if (this.state.givesProfit && stopSaving) {
          data.profit.push(Math.round(currentYearProfit / 10) * 10);
          data.economicalGrowth.push(data.economicalGrowth[i - 1]);
          
        } else {
          data.profit.push(0);
          data.economicalGrowth.push(
            Math.round(((1 + (interest / 100)) * (data.economicalGrowth[i-1]+monthlySavings*12)) / 10) * 10
          );
        }
        if (this.state.bankComparison && this.state.givesProfit && stopBankSaving) {
          data.bankGrowth.push(data.bankGrowth[i - 1]);
        } else {
          data.bankGrowth.push(
            Math.round(((1 + bankInterest / 100) * (data.bankGrowth[i-1]+monthlySavings*12)) / 10) * 10
          );
        }
      }
    }
    return data;
  }

  render() {
    return (
      <div className="App">
        <div className="input-container">
          <div className="input-field">
            <label>{Messages.Savings[lang]}</label>
            <div className="slide-input" style={{position: 'relative', margin: 0}}>
              <input type="number"
                placeholder={Messages.Savings[lang]}
                value={this.state.initialSavings}
                onChange={event => this.setState({initialSavings: event.target.value})}
              />
              <p className="icon">{Messages.Currency[lang]}</p>
            </div>
          </div>
          <div className="input-field">
            <label>{Messages.MonthlySavings[lang]}</label>
            <div className="slide-input" style={{position: 'relative', margin: 0}}>
              <input type="number"
                placeholder={Messages.MonthlySavings[lang]}
                value={this.state.monthlySavings}
                onChange={event => this.setState({monthlySavings: event.target.value})}
              />
              <p className="icon">{Messages.Currency[lang]}</p>
            </div>
          </div>
          <div className="input-field">
            <label>{Messages.AmountOfYears[lang]}</label>
            <div className="slide-input" style={{position: 'relative', margin: 0}}>   
              <input className="small-input" type="number"
                placeholder={Messages.Years[lang]}
                value={this.state.year}
                onChange={event => this.setState({year: event.target.value})}
              />
              <p className="icon">{Messages.Years[lang]}</p>
            </div>
          </div>
          <div className="input-field">
            <label>{Messages.InterestQuery[lang]}</label>
            <div className="slide-input" style={{position: 'relative', margin: 0}}>
              <input className="small-input" type="number"
                placeholder={Messages.Interest[lang]}
                value={this.state.interest}
                onChange={event => this.setState({interest: event.target.value})}
              />
              <FontAwesome name='percent' className="icon"/>
            </div>
          </div>
          <div className="checkbox-field">
            <div className="checkbox">
              <label>{Messages.BankComparison[lang]}</label>
            </div>
            <div className="slide-input" style={{position: 'relative', margin: 0}}>
              <MuiThemeProvider>
                <Toggle style={styles.block}
                  onToggle={(event, isInputChecked) => this.setState({bankComparison: isInputChecked})}
                  thumbStyle={styles.thumbOff}
                  trackStyle={styles.trackOff}
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackSwitched}
                />
              </MuiThemeProvider>
              <input className="small-input" type="number"
                placeholder={Messages.Interest[lang]}
                value={this.state.bankInterest}
                onChange={event => this.setState({bankInterest: event.target.value})}
              />
              <FontAwesome name='percent' className="icon"/>
            </div>
          </div>
          <div className="checkbox-field">
            <div className="checkbox">
              <label>{Messages.StopProfit[lang]}</label>          
            </div>
            <div className="slide-input" style={{position: 'relative', margin: 0}}>
              <MuiThemeProvider>
                <Toggle style={styles.block}
                  onToggle={(event, isInputChecked) => this.setState({givesProfit: isInputChecked})}
                  thumbStyle={styles.thumbOff}
                  trackStyle={styles.trackOff}
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackSwitched}
                />
              </MuiThemeProvider>
              <input className="small-input" type="number"
                placeholder={Messages.ProfitMonth[lang]}
                value={this.state.whenProfitIsPerMonth}
                onChange={event => this.setState({whenProfitIsPerMonth: event.target.value})}
              />
              <p className="icon">{Messages.Currency[lang]}</p>
            </div>
          </div>
        </div>
        <div className="graph-container">
          <Bar data={this.chartData()} height={250}/>
        </div>
      </div>
    );
  }
}

export default App;
