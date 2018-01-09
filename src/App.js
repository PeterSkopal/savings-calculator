import React, { Component } from 'react';
import './App.css';

const DefaultMessages = {
  SavingQuestion: 'Do you want to know how much you can save in 10, 25 or 50 years?',
  InitialSavings: 'What is your initial savings capital?',
  IncomeQuery: 'What is your income?',
  InterestQuery: 'How much yield are you expecting each year?',
  MonthlySavings: 'How much will you invest each month?'
}
const Messages = {
  SavingQuestion: document.currentScript.getAttribute('SavingQuestion') || DefaultMessages.SavingQuestion,
  InitialSavings: document.currentScript.getAttribute('InitialSavings') || DefaultMessages.InitialSavings,
  IncomeQuery: document.currentScript.getAttribute('IncomeQuery') || DefaultMessages.IncomeQuery,
  InterestQuery: document.currentScript.getAttribute('InterestQuery') || DefaultMessages.InterestQuery,
  MonthlySavings: document.currentScript.getAttribute('MonthlySavings') || DefaultMessages.MonthlySavings
}

class App extends Component {

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
