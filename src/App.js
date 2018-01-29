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
    year: undefined,
    initialSavings: undefined,
    interest: undefined,
    monthlySavings: undefined
  }

  chartOptions() {
    return {
      scaleShowGridLines: true,
      scaleGridLineColor: 'rgba(0,0,0,.05)',
      scaleGridLineWidth: 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      bezierCurve: true,
      bezierCurveTension: 0.4,
      pointDot: true,
      pointDotRadius: 4,
      pointDotStrokeWidth: 1,
      pointHitDetectionRadius: 20,
      datasetStroke: true,
      datasetStrokeWidth: 2,
      datasetFill: true
    }
  }

  chartData() {
    return {
      labels: this.getYears(),
      datasets: [
        {
          label: 'Economical Growth',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: this.calculateData(),
        }
      ]
    }
  }

  getYears() {
    const currentYear = moment().year();
    const years = this.state.year ? this.state.year : 0;
    return _.range(currentYear, currentYear + years);
  }

  allDefined() {
    return (this.state.initialSavings !== undefined)
      && (this.state.interest !== undefined)
      && (this.state.monthlySavings !== undefined)
      && (this.state.year !== undefined);
  }

  calculateData() {
    if (this.allDefined()) {
      var growth = [];
      growth.push( this.state.initialSavings + this.state.monthlySavings * 12 )
      for (var i = 1; i < this.state.year; i++) {
        growth.push(parseInt((1 + (this.state.interest / 100)) * (growth[i-1]+this.state.monthlySavings*12), 10))
      }
      return growth;
    } else {
      return [];
    }
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
              onChange={event => this.setState({initialSavings: parseFloat(event.target.value, 10)})}
            />
          </div>
          <div className="input-field">
            <label>Interest in %</label>          
            <input type="number"
              placeholder="Interest in %"
              value={this.state.interest}
              onChange={event => this.setState({interest: parseFloat(event.target.value, 10)})}
            />
          </div>
          <div className="input-field">
            <label>Montly Savings</label>          
            <input type="number"
              placeholder="Monthly Savings"
              value={this.state.monthlySavings}
              onChange={event => this.setState({monthlySavings: parseFloat(event.target.value, 10)})}
            />
          </div>
          <div className="input-field">
            <label>Years to Save</label>          
            <input type="number"
              placeholder="Years"
              value={this.state.year}
              onChange={event => this.setState({year: parseFloat(event.target.value, 10)})}
            />
          </div>
        </div>
        <div className="graph-container">
          <LineChart data={this.chartData()}
            options={this.chartOptions()} width="600" height="250"/>
        </div>
      </div>
    );
  }
}

export default App;
