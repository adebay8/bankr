const { deposit } = require("../index");
const {
  chargeCardWithPaystack,
  submitChargePin,
  chargeCardWithAuthorization,
  verifyTransaction,
} = require("../controllers/card_transactions/paystack");
const { creditAccountFromCard, transfer } = require("../controllers");
const {
  processInitialCharge,
  submitPin,
  submitOTP,
  submitPhone,
} = require("../controllers/card_transactions/helpers");

class UseCase {
  constructor(email, amount, pan, cvv, expiry_month, expiry_year) {
    this.email = email;
    this.amount = amount;
    this.pan = pan;
    this.cvv = cvv;
    this.expiry_month = expiry_month;
    this.expiry_year = expiry_year;
    this.account_id = 4;
  }

  deposit() {
    deposit(this.account_id, this.amount).then(console.log).catch(console.log);
  }

  creditAccountFromCard() {
    return creditAccountFromCard({
      account_id: this.account_id,
      email: this.email,
      amount: this.amount,
      pan: this.pan,
      cvv: this.cvv,
      expiry_month: this.expiry_month,
      expiry_year: this.expiry_year,
    });
  }

  chargeCardWithPaystack() {
    chargeCardWithPaystack({
      account_id: this.account_id,
      email: this.email,
      amount: this.amount,
      pan: this.pan,
      cvv: this.cvv,
      expiry_month: this.expiry_month,
      expiry_year: this.expiry_year,
    })
      .then((result) => console.log(processInitialCharge(result)))
      .catch(console.log);
  }

  static submitChargePin() {
    submitChargePin({ reference: "re2rcyn37cz14yf", pin: "1111" }).then(
      console.log
    );
  }

  static submitPin(data) {
    return submitPin(data);
  }

  static submitOTP(data) {
    return submitOTP(data);
  }

  static submitPhone(data) {
    return submitPhone(data);
  }

  static chargeCardWithAuthorization({ email, amount, authorization_code }) {
    return chargeCardWithAuthorization({ email, amount, authorization_code });
  }
}

// var useCases = new UseCase(
//   "darkskindeveloper@gmail.com",
//   "1500000",
//   "4084084084084081",
//   "408",
//   "06",
//   "21"
// );

var useCases = new UseCase(
  "darkskindeveloper@gmail.com",
  "1500000",
  "4084080000005408",
  "001",
  "06",
  "21"
);

var useCases2 = new UseCase(
  "darkskindeveloper@gmail.com",
  "1500000",
  "4084084084084081",
  "408",
  "06",
  "21"
);

var useCases3 = new UseCase(
  "darkskindeveloper@gmail.com",
  "8845000",
  "5060666666666666666",
  "123",
  "06",
  "21"
);

var useCases4 = new UseCase(
  "darkskindeveloper@gmail.com",
  "9845000",
  "507850785078507804",
  "884",
  "06",
  "21"
);

var useCases5 = new UseCase(
  "darkskindeveloper@gmail.com",
  "9845000",
  "5060660000000064",
  "606",
  "06",
  "21"
);

// No validation
// useCases.creditAccountFromCard().then(console.log).catch(console.log);
// submitPin({ reference: "c0fbwx3taw39bhl", pin: "1111" }).then(console.log);
// useCases.submitChargePin();
// useCases5.chargeCardWithPaystack();
// UseCase.chargeCardWithAuthorization({
//   email: "darkskindeveloper@gmail.com",
//   amount: "42344000",
//   authorization_code: "AUTH_8s51cq5yjr",
// })
//   .then(console.log)
//   .catch(console.log);

// Pin
// useCases2.creditAccountFromCard().then(console.log).catch(console.log);

// Pin + OTP
// useCases3
//   .creditAccountFromCard()
//   .then((result) =>
//     submitPin({ reference: result.data.reference, pin: "1234" })
//   )
//   .then((res) => submitOTP({ reference: res.data.reference, otp: "123456" }))
//   .then(console.log)
//   .catch(console.log);

// Pin + OTP + phone
// useCases4
//   .creditAccountFromCard()
//   .then((result) =>
//     submitPin({ reference: result.data.reference, pin: "0000" })
//   )
//   .then((res) =>
//     submitPhone({ reference: res.data.reference, phone: "2348093631469" })
//   )
//   .then((res) => submitOTP({ reference: res.data.reference, otp: "123456" }))
//   .then(console.log)
//   .catch(console.log);

// verifyTransaction("speishxsrdzrf2s").then(console.log);

transfer(1, 2, "300000");
