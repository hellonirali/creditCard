describe('Test Scenario 1', function() {
  let firstCard;

  beforeEach(function() {
    firstCard = new CreditCard(1000, 35, '2018-01-01T00:00:00');
  });

  it('A customer opens a credit card with a $1,000.00 limit at a 35% APR', function() {
    expect(firstCard.limit).toEqual(1000);
    expect(firstCard.apr).toEqual(0.35);
  });

  it('The customer charges $500 on opening day (outstanding balance becomes $500)', function() {
    firstCard.charge(500, '2018-01-01T00:00:00');
    expect(firstCard.outstandingBalance).toEqual(500);
  });

  it('The total outstanding balance owed 30 days after opening should be $514.38', function() {
    firstCard.charge(500, '2018-01-01T00:00:00');
    expect(firstCard.balance('2018-01-31T00:00:00')).toEqual('30 days after account opening. Current balance due: $514.38');
  });

});


describe('Test Scenario 2', function() {
  let secondCard;

  beforeEach(function(){
    secondCard = new CreditCard(1000, 35, '2018-01-01T00:00:00');
  });

  it('A customer opens a credit card with a $1,000.00 limit at a 35% APR', function() {
    expect(secondCard.limit).toEqual(1000);
    expect(secondCard.apr).toEqual(0.35);
  });

  it('The customer charges $500 on opening day (outstanding balance becomes $500)', function() {
    secondCard.charge(500, '2018-01-01T00:00:00');
    expect(secondCard.outstandingBalance).toEqual(500);
  });

  it('15 days after opening, the customer pays $200 (outstanding balance becomes $300)', function() {
    secondCard.charge(500, '2018-01-01T00:00:00');
    secondCard.payment(200, '2018-01-15T00:00:00');
    expect(secondCard.outstandingBalance).toEqual(300);
  });

  it('25 days after opening, the customer charges another $100 (outstanding balance becomes $400)', function() {
    secondCard.charge(500, '2018-01-01T00:00:00');
    secondCard.payment(200, '2018-01-15T00:00:00');
    secondCard.charge(100, '2018-01-25T00:00:00');
    expect(secondCard.outstandingBalance).toEqual(400);
  });

  it('The total outstanding balance owed on day 30 should be 411.99', function() {
    secondCard.charge(500, '2018-01-01T00:00:00');
    secondCard.payment(200, '2018-01-16T00:00:00');
    secondCard.charge(100, '2018-01-26T00:00:00');
    expect(secondCard.balance('2018-01-31T00:00:00')).toEqual('30 days after account opening. Current balance due: $411.99');
  });

});


describe('Additional Tests', function() {
  let secondCard;

  beforeEach(function(){
    secondCard = new CreditCard(1000, 35, '2018-07-01T00:00:00');
  });

  it('The total outstanding balance owed on day 45 should be 215.77', function() {
    secondCard.charge(500, '2018-07-01T00:00:00');
    secondCard.payment(200, '2018-07-16T00:00:00');
    secondCard.charge(100, '2018-07-26T00:00:00');
    secondCard.payment(200, '2018-08-04T00:00:00');
    expect(secondCard.balance('2018-08-15T00:00:00')).toEqual('45 days after account opening. Current balance due: $215.77');
  });

  it('Multiple charges were made and the total payment had been received within the first month', function() {
    secondCard.charge(500, '2018-07-01T00:00:00');
    secondCard.payment(200, '2018-07-16T00:00:00');
    secondCard.charge(100, '2018-07-26T00:00:00');
    secondCard.payment(400, '2018-07-30T00:00:00');
    expect(secondCard.balance('2018-07-31T00:00:00')).toEqual('30 days after account opening. Current balance due: $0.00');
    expect(secondCard.balance('2018-08-15T00:00:00')).toEqual('45 days after account opening. Current balance due: $0.00');
  });

  it('Multiple charges were made and paid over multiple months', function() {
    secondCard.charge(500, '2018-07-01T00:00:00');
    secondCard.payment(200, '2018-07-16T00:00:00');
    secondCard.charge(100, '2018-07-26T00:00:00');
    secondCard.payment(400, '2018-07-30T00:00:00');
    secondCard.charge(100, '2018-08-10T00:00:00');
    secondCard.payment(100, '2018-08-28T00:00:00');
    secondCard.charge(200, '2018-09-10T00:00:00');
    expect(secondCard.balance('2018-09-15T00:00:00')).toEqual('76 days after account opening. Current balance due: $202.71');
  });

});

