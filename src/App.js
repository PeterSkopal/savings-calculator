import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import _ from 'underscore';
import { Bar } from 'react-chartjs-2';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toggle from 'material-ui/Toggle';

const DefaultMessages = {
  InitialSavings: 'Initial Savings',
  InterestQuery: 'Interest Expectation',
  MonthlySavings: 'Montly Investments',
  AmountOfYears: 'Years to Save',
  BankComparison: 'Compare to Bank Saving',
  StopProfit: 'Stop When Profit/Month is'
}
const script = document.currentScript;
const Messages = {
  InitialSavings: script && script.hasAttribute('InitialSavings') ? script.getAttribute('InitialSavings') : DefaultMessages.InitialSavings,
  InterestQuery: script && script.hasAttribute('InterestQuery') ? script.getAttribute('InterestQuery') : DefaultMessages.InterestQuery,
  MonthlySavings: script && script.hasAttribute('MonthlySavings') ? script.getAttribute('MonthlySavings') : DefaultMessages.MonthlySavings,
  AmountOfYears: script && script.hasAttribute('AmountOfYears') ? script.getAttribute('AmountOfYears') : DefaultMessages.AmountOfYears,
  BankComparison: script && script.hasAttribute('BankComparison') ? script.getAttribute('BankComparison') : DefaultMessages.BankComparison,
  StopProfit: script && script.hasAttribute('StopProfit') ? script.getAttribute('StopProfit') : DefaultMessages.StopProfit
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

  state = {
    year: 10,
    initialSavings: 1000,
    interest: 7,
    monthlySavings: 2500,
    bankComparison: false,
    bankInterest: 0.5,
    givesProfit: false,
    whenProfitIsPerMonth: 1000,
  }

  chartData() {
    const data = this.calculateData();
    const chartData = {
      labels: this.getYears(),
      datasets: [{
        label: 'Economical Growth',
        type: 'line',
        data: data.economicalGrowth,
        backgroundColor: 'rgba(244,179,23,0)',
        borderColor: 'rgba(244,179,23,1)'
      }]
    };
    if (this.state.bankComparison) {
      chartData.datasets.push({
        label: 'Bank Growth',
        type: 'line',
        data: data.bankGrowth,
        backgroundColor: 'rgba(50,154,85,0)',
        borderColor: 'rgba(50,154,85,1)'
      });
    }
    if (this.state.givesProfit) {
      chartData.datasets.push({
        label: 'Profit',
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
      
      data.economicalGrowth.push( savings + this.state.monthlySavings * 12 )
      
      if (this.state.bankComparison) {
        data.bankGrowth.push( savings + this.state.monthlySavings * 12 )
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
          data.economicalGrowth.push(Math.round(((1 + (interest / 100)) * (data.economicalGrowth[i-1]+monthlySavings*12)) / 10) * 10);
        }
        if (this.state.bankComparison && this.state.givesProfit && stopBankSaving) {
          data.bankGrowth.push(data.bankGrowth[i - 1]);
        } else {
          data.bankGrowth.push(Math.round(((1 + bankInterest / 100) * (data.bankGrowth[i-1]+monthlySavings*12)) / 10) * 10);
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
            <label>{Messages.InitialSavings}</label>
            <input type="number"
              placeholder="Savings"
              value={this.state.initialSavings}
              onChange={event => this.setState({initialSavings: event.target.value})}
            />
          </div>
          <div className="input-field">
            <label>{Messages.MonthlySavings}</label>          
            <input type="number"
              placeholder="Monthly Savings"
              value={this.state.monthlySavings}
              onChange={event => this.setState({monthlySavings: event.target.value})}
            />
          </div>
          <div className="input-field">
            <label>{Messages.AmountOfYears}</label>          
            <input className="small-input" type="number"
              placeholder="Years"
              value={this.state.year}
              onChange={event => this.setState({year: event.target.value})}
            />
          </div>
          <div className="input-field">
            <label>{Messages.InterestQuery}</label>          
            <input className="small-input" type="number"
              placeholder="Interest"
              value={this.state.interest}
              onChange={event => this.setState({interest: event.target.value})}
            />
            <i className="fa fa-percent icon"></i>
          </div>
          <div className="checkbox-field">
            <div className="checkbox">
              <MuiThemeProvider>
                <Toggle style={styles.block}
                  onToggle={(event, isInputChecked) => this.setState({bankComparison: isInputChecked})}
                  thumbStyle={styles.thumbOff}
                  trackStyle={styles.trackOff}
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackSwitched}
                />
              </MuiThemeProvider>
              <label>{Messages.BankComparison}</label>
            </div>
            <input className="small-input" type="number"
              placeholder="Interest"
              value={this.state.bankInterest}
              onChange={event => this.setState({bankInterest: event.target.value})}
            />
            <i className="fa fa-percent icon"></i>
          </div>
          <div className="checkbox-field">
            <div className="checkbox">
              <MuiThemeProvider>
                <Toggle style={styles.block}
                  onToggle={(event, isInputChecked) => this.setState({givesProfit: isInputChecked})}
                  thumbStyle={styles.thumbOff}
                  trackStyle={styles.trackOff}
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackSwitched}
                />
              </MuiThemeProvider>
              <label>{Messages.StopProfit}</label>          
            </div>
            <input className="small-input" type="number"
              placeholder="Profit/Month"
              value={this.state.whenProfitIsPerMonth}
              onChange={event => this.setState({whenProfitIsPerMonth: event.target.value})}
            />
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
