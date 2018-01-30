import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import _ from 'underscore';
var LineChart = require("react-chartjs").Line;

const DefaultMessages = {
  SavingQuestion: 'Do you want to know how much you can save in 10, 25 or 50 years?',
  InitialSavings: 'What is your initial savings capital?',
  MonthlySavings: 'How much will you invest each month?',
  IncomeQuery: 'What is your income?',
  InterestQuery: 'How much yield are you expecting each year?',
  AmountOfYears: 'How many years would you like to save?'
}
const Messages = {
  SavingQuestion: document.currentScript.getAttribute('SavingQuestion') || DefaultMessages.SavingQuestion,
  InitialSavings: document.currentScript.getAttribute('InitialSavings') || DefaultMessages.InitialSavings,
  MonthlySavings: document.currentScript.getAttribute('MonthlySavings') || DefaultMessages.MonthlySavings,
  IncomeQuery: document.currentScript.getAttribute('IncomeQuery') || DefaultMessages.IncomeQuery,
  InterestQuery: document.currentScript.getAttribute('InterestQuery') || DefaultMessages.InterestQuery,
  AmountOfYears: document.currentScript.getAttribute('AmountOfYears') || DefaultMessages.AmountOfYears,
}

class App extends Component {

  state = {
    year: 10,
    initialSavings: 100,
    interest: 7,
    monthlySavings: 100
  }

  chartData() {
    const data = this.calculateData();
    return {
      labels: this.getYears(),
      datasets: [
        {
          label: 'Economical Growth',
          data: data.economicalGrowth,
          fillColor: 'rgba(244,179,23,0.2)',
          strokeColor: 'rgba(244,179,23,1)',
          pointColor: 'rgba(244,179,23,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)'
        },
        {
          label: 'Bank Growth',
          data: data.bankGrowth,
          fillColor: 'rgba(50,154,85,0.2)',
          strokeColor: 'rgba(50,154,85,1)',
          pointColor: 'rgba(50,154,85,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)'
        }
      ]
    }
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
    const data = { economicalGrowth: [], bankGrowth: [] };
    if (this.allDefined()) {
      const savings = this.state.initialSavings === '' ? 0 : parseFloat(this.state.initialSavings, 10);
      const interest = this.state.interest === '' ? 0 : parseFloat(this.state.interest, 10);
      const monthlySavings = this.state.monthlySavings === '' ? 0 : parseFloat(this.state.monthlySavings, 10);
      data.economicalGrowth.push( savings + this.state.monthlySavings * 12 )
      data.bankGrowth.push( savings + this.state.monthlySavings * 12 )
      
      for (var i = 1; i < this.state.year; i++) {
        data.economicalGrowth.push(Math.round(((1 + (interest / 100)) * (data.economicalGrowth[i-1]+monthlySavings*12)) / 10) * 10)
        data.bankGrowth.push(Math.round((1.01 * (data.bankGrowth[i-1]+monthlySavings*12)) / 10) * 10)
      }
    }
    return data;
  }

  render() {
    return (
      <div className="App">
        <div className="input-container">
          <div className="input-field">
            <label>Initial Savings Capital</label>
            <input type="number"
              placeholder="Initial Savings Capital"
              value={this.state.initialSavings}
              onChange={event => this.setState({initialSavings: event.target.value})}
            />
          </div>
          <div className="input-field">
            <label>Interest in %</label>          
            <input type="number"
              placeholder="Interest in %"
              value={this.state.interest}
              onChange={event => this.setState({interest: event.target.value})}
            />
          </div>
          <div className="input-field">
            <label>Montly Savings</label>          
            <input type="number"
              placeholder="Monthly Savings"
              value={this.state.monthlySavings}
              onChange={event => this.setState({monthlySavings: event.target.value})}
            />
          </div>
          <div className="input-field">
            <label>Years to Save</label>          
            <input type="number"
              placeholder="Years"
              value={this.state.year}
              onChange={event => this.setState({year: event.target.value})}
            />
          </div>
        </div>
        <div className="graph-container">
          <LineChart data={this.chartData()} width="600" height="250" redraw/>
        </div>
      </div>
    );
  }
}

export default App;
