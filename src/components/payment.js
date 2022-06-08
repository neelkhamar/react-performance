import React, { useEffect, useState } from 'react';
import axios from 'axios';
const paypal = require("paypal-rest-sdk");

function MainApp() {

  const [state, setState] = useState({
    token: "",
    loading: false
  })

  useEffect(() => {
    document.addEventListener('message', (data) => {
      let paymentData = JSON.parse(data.data);
      setState({
        ...state,
        loading : true
      })
      initiatePayment(paymentData)
    })

    return (() => {})
  }, [])


  const initiatePayment = (paymentObject) => {
    setState({
      ...state,
      loading: true
    })
    
    paypal.configure({
      mode: "sandbox", //sandbox or live
      // client_id:
      //   "AVqyh1x3lmbgFyMebMfzrjy34yJiU3rd97lkYJkf-Y4npBEAYVQUUU_3AxDWeq7UwAwQCPonzZpIydSD",
      // client_secret:
      //   "EDULYQ9MdqkzxOySi-yfpObVUXbtYmcy6pRqx5_I-Xyt8Ta7kkoSGnIfdcTRMPPQvQ5bhDM3ZpeyLqi3",

      client_id: "AawHyG0EhhLYIKlp_w47-xccJzBFhOdGbOUbaQqXzOtO-IxsWBww3t4KPAA2hS1oeCvGnjjX2g1jZxzG",
      client_secret: "EB6GayHa2c7JzoT6kSleCGr-AUI-kNAB7jyxjHWiM5z7tAqnAqMIJ3b9fLcAL4NSf8Nu7TaqGlBTojF5"
    });


    paypal.generateToken({}, (err, token) => {
      let accToken = token.split(" ")[1];
      var create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/success?status=success",
          cancel_url: "http://localhost:3000/failure?status=failure",
        },
        transactions: [
          {
            item_list: {
              items: paymentObject.items,
            },
            amount: {
              currency: "USD",
              total: paymentObject.amount,
            },
            description: "This is the payment description.",
            custom: "appointmentID:12345"
            //   appointmentId: 12345,
            //   paymentId: 1
            // }
          },
        ],
      };

      let options = {
        headers: { Authorization: `Bearer ${accToken}`, "Content-Type": "application/json" }
      }
  
      axios.post("https://api-m.sandbox.paypal.com/v1/payments/payment", create_payment_json, options).then((resp) => {
        let url = resp.data.links[1].href;
        window.location.replace(url);
      }).catch((e) => {
        setState({
          ...state,
          loading: false
        })
        console.log(e)
      })
    })

  }

  return (
    <>
        {
          state.loading ? (
            <div className="loading-screen" style={{textAlign:'center', width:'100%'}}>
              <p style={{fontSize:'100%', fontWeight:'none', fontSize:'100%'}}>Please wait, we are processing your order.</p>
              <img width="350px" style={{border:'0px solid black'}} src="https://thumbs.gfycat.com/LeafyFairIchneumonfly-size_restricted.gif" />
            </div>
          ) : (
            <div className="row" style={{paddingRight:'15%', paddingLeft:'15%'}}>
              <div className="col-70">
                <div className="container">
                  <form onSubmit={() => initiatePayment({amount:'100.00', items: []})}>
                  
                    <div className="row">
                      <div className="col-100">
                        <h3>Billing Address</h3>
                        <label for="fname"><i className="fa fa-user"></i> Full Name</label>
                        <input type="text" id="fname" name="firstname" placeholder="John M. Doe" />
                        <label for="email"><i className="fa fa-envelope"></i> Email</label>
                        <input type="text" id="email" name="email" placeholder="john@example.com" />
                        <label for="adr"><i className="fa fa-address-card-o"></i> Address</label>
                        <input type="text" id="adr" name="address" placeholder="542 W. 15th Street" />
                        <label for="city"><i className="fa fa-institution"></i> City</label>
                        <input type="text" id="city" name="city" placeholder="New York" />

                        <div className="row">
                          <div className="col-50">
                            <label for="state">State</label>
                            <input type="text" id="state" name="state" placeholder="NY" />
                          </div>
                          <div className="col-50">
                            <label for="zip">Zip</label>
                            <input type="text" id="zip" name="zip" placeholder="10001" />
                          </div>
                        </div>
                      </div>

                      <div className="col-50">
                        <h3>Payment</h3>
                        <label for="fname">Accepted Cards</label>
                        <div className="icon-container">
                          <i className="fa fa-cc-visa" style={{color:"navy"}}></i>
                          <i className="fa fa-cc-amex" style={{color:"blue"}}></i>
                          <i className="fa fa-cc-mastercard" style={{color:"red"}}></i>
                          <i className="fa fa-cc-discover" style={{color:"orange"}}></i>
                        </div>
                        <label for="cname">Name on Card</label>
                        <input type="text" id="cname" name="cardname" placeholder="John More Doe" />
                        <label for="ccnum">Credit card number</label>
                        <input type="text" id="ccnum" name="cardnumber" placeholder="1111-2222-3333-4444" />
                        <label for="expmonth">Exp Month</label>
                        <input type="text" id="expmonth" name="expmonth" placeholder="September" />
                        <div className="row">
                          <div className="col-50">
                            <label for="expyear">Exp Year</label>
                            <input type="text" id="expyear" name="expyear" placeholder="2018" />
                          </div>
                          <div className="col-50">
                            <label for="cvv">CVV</label>
                            <input type="text" id="cvv" name="cvv" placeholder="352" />
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    <label>
                      <input type="checkbox" checked="checked" name="sameadr" /> Shipping address same as billing
                    </label>
                    <input style={{width:'100%'}} type="submit" value="Continue to checkout" className="btn" />
                  </form>
                </div>
              </div>
              <div className="col-25">
                <div className="container">
                  <h4>Cart <span className="price" style={{color:"black"}}><i className="fa fa-shopping-cart"></i> <b>4</b></span></h4>
                  <p><a href="#">Product 1</a> <span className="price">$1</span></p>
                  <hr/>
                  <p>Total <span className="price" style={{color:"black"}}><b>$1</b></span></p>
                </div>
              </div>
            </div>
          )
        }
    </>
  );
}

export default MainApp;
