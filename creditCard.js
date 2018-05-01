'use strict';

/**
 * Count the number of days between two dates
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {number} the difference between two dates
 */
function countDays(startDate, endDate) {
  let msToDays = 1000 * 60 * 60 * 24;
  return (endDate.getTime() - startDate.getTime()) / msToDays;
}

/**
 * Create an account (e.g. opening a new credit card) where each card has an APR and Credit Limit
 * @param {number} limit
 * @param {number} apr
 * @param {string | number | Date} date
 * @constructor
 */
function CreditCard(limit, apr, date){
  this.limit = limit;
  this.apr = apr / 100;
  this.outstandingBalance = 0;
  this.openingDay = new Date(date);
  this.accumulatedInterest = 0;
  this.lastActivity = new Date(this.openingDay.getTime());
  this.lastActivity.setDate(this.openingDay.getDate() - 1);
}

/**
 * Keep track of charges (e.g. card swipes)
 * @param {number} chargedAmount
 * @param {string | number | Date} date
 * @throws Insufficient credit limit
 */
CreditCard.prototype.charge = function(chargedAmount, date){
  this.updateBalanceAsOfDayBefore(date);

  // Throws an error if customer tries to charge more than their credit limit
  if (chargedAmount + this.outstandingBalance > this.limit){
    throw new Error('Insufficient credit limit.');
  } else {
    // Add the amount charged to the outstanding balance
    this.outstandingBalance += chargedAmount;
  }
};

/**
 * Keep track of payments
 * @param {number} paidAmount
 * @param {string | number | Date} date
 * @throws Maximum payment allowed
 */
CreditCard.prototype.payment = function(paidAmount, date){
  let today = new Date(date);
  let dayBefore = this.updateBalanceAsOfDayBefore(date);

  // Throws an error if the customer overpays
  if (paidAmount > this.outstandingBalance){
    throw new Error(`Maximum payment allowed is ${(this.outstandingBalance).toFixed(2)}`);
  } else {
    // Subtract the paid amount from the outstanding balance
    this.outstandingBalance -= paidAmount;

    // If the payment was for the full oustanding balance, reset the interest
    if (this.outstandingBalance <= 0) {
      let days = countDays(this.openingDay, dayBefore);
      if (days < 30) {
        this.accumulatedInterest = 0;
      } else {
        // Otherwise add the interest to the outstanding balance and reset the interest
        this.outstandingBalance += this.accumulatedInterest;
        this.accumulatedInterest = 0;
        // If the new outstanding balance is less than zero, reset the opening day value to today
        if (this.outstandingBalance <= 0) {
          this.openingDay = today;
        }
      }
    }
  }
};

/**
 * Calculate the interest for the current outstanding balance based on the number of days that have passed
 * @param {number} outstandingBalance
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {number} interest that has been calculated
 */
CreditCard.prototype.calculateInterest = function(outstandingBalance, startDate, endDate){
  let daysPassed = countDays(startDate, endDate);
  let result = outstandingBalance * (this.apr / 365) * daysPassed;
  return result;
};

/**
 * Calculate and update the interest based on the closing of the prior day and return the date of the prior day
 * @param {Date} date
 * @returns {Date} day before transaction date
 */
CreditCard.prototype.updateBalanceAsOfDayBefore = function(date){
  let dayBefore = new Date(date);
  dayBefore.setDate(dayBefore.getDate() - 1);

  // Throw error if customer tries to backdate a transaction
  if (dayBefore.getTime() < this.lastActivity.getTime()){
    throw new Error('Inaccurate Date. Cannot make backdated transactions.');
  }

  // Interest is calculated daily at the close of each day, but not applied
  if (this.lastActivity.getTime() !== dayBefore.getTime()){
    this.accumulatedInterest += this.calculateInterest(this.outstandingBalance, this.lastActivity, dayBefore);
    this.lastActivity = dayBefore;
  }

  // Apply interest to the outstanding balance after 30 days
  if (countDays(this.openingDay, dayBefore) >= 29){
    this.outstandingBalance += this.accumulatedInterest;
    this.accumulatedInterest = 0;
  }

  return dayBefore;
};

/**
 * Provide the outstanding balance for any given day (such as "10 days after account opening")
 * @param {string | number | Date} dateInput
 * @returns {string} informing the customer how many days it's been since the account was open and what the outstanding balance is
 */
CreditCard.prototype.balance = function(dateInput){
  this.updateBalanceAsOfDayBefore(dateInput);
  let date = new Date(dateInput);
  let totalDaysPassed = countDays(this.openingDay, date);
  return `${totalDaysPassed} days after account opening. Current balance due: $${(this.outstandingBalance).toFixed(2)}`;
};

