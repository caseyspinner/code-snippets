import React from "react";
import { injectStripe } from "react-stripe-elements";
import CardSection from "./CardSection";
import AddressSection from "./AddressSection";
import "./test.css";
import * as usersService from "../../services/users.service";
import * as validationHelper from "../../helpers/validation.helper";
import { Redirect } from "react-router-dom";

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      thisUser: null,
      formData: {
        name: "",
        city: "",
        state: "",
        streetAddress: "",
        zip: ""
      }
    };
    this.convertPropsToFormData = this.convertPropsToFormData.bind(this);
    this.onChange = validationHelper.onChange.bind(this);
  }

  componentDidMount() {
    usersService.getProfile().then(userProfile => {
        this.setState(
          { 
            thisUser: userProfile
          }
        );
        this.convertPropsToFormData(this.state.thisUser);
    });
    this.convertPropsToFormData(this.state.thisUser);
  }

  convertPropsToFormData(user) {
    const initialUserData = {
      firstName: user ? user.firstName : "",
      lastName: user ? user.lastName : "",
      city: user ? user.city : "",
      state: user ? user.state : "",
      streetAddress: user ? user.streetAddress : "",
      zip: user ? user.zip : ""
    };

    let formData = {
      name: {
        originalValue: `${initialUserData.firstName} ${
          initialUserData.lastName
        }`,
        value:
          initialUserData.firstName && initialUserData.lastName
            ? `${initialUserData.firstName} ${initialUserData.lastName}`
            : null,
        valid: true,
        validation: {
          required: true
        },
        touched: false
      },
      city: {
        originalValue: initialUserData.city,
        value: initialUserData.city,
        valid: true,
        validation: {
          required: true
        },
        touched: false
      },
      state: {
        originalValue: initialUserData.state,
        value: initialUserData.state,
        valid: true,
        validation: {
          required: true
        },
        touched: false
      },
      streetAddress: {
        originalValue: initialUserData.streetAddress,
        value: initialUserData.streetAddress,
        valid: true,
        validation: {
          required: true
        },
        touched: false
      },
      zip: {
        originalValue: initialUserData.zip,
        value: initialUserData.zip,
        valid: true,
        validation: {
          required: true
        },
        touched: false
      }
    };

    for (let fieldName in formData) {
      const field = formData[fieldName];
      field.valid = validationHelper.validate(field.value, field.validation);
    }
    this.setState({ formData: formData });
    return formData;
  }

  handleSubmit = ev => {
    ev.target[7].disabled = true;
    ev.preventDefault();
    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe
      .createToken({
        name: this.state.formData.name.value,
        address_city: this.state.formData.city.value,
        address_line1: this.state.formData.streetAddress.value,
        address_state: this.state.formData.state.value,
        address_zip: this.state.formData.zip.value
      })
      .then(({ token }) => {
        console.log("Received Stripe token:", token);
        let data = {
          email: this.state.thisUser.email,
          source: token.id
        };
        usersService.registerPayment(data).then(result => {
          let thisUserCopy = JSON.parse(
            JSON.stringify({ ...this.state.thisUser })
          );
          thisUserCopy.isPremiumUser = result.item;
          this.setState({
            thisUser: thisUserCopy
          });
          localStorage.setItem(
            "userProfile",
            JSON.stringify(this.state.thisUser)
          );
        });
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.thisUser && (
          <React.Fragment>
            {this.state.thisUser.isPremiumUser ? (
              <Redirect to={`/user-profile/${this.state.thisUser.id}`} />
            ) : (
              <div className="outlayer">
                <form
                  className="form"
                  onSubmit={this.handleSubmit}
                  method="post"
                >
                  <h2 className="subtitle">Poor-Dawg Premium</h2>
                  <AddressSection
                    name={this.state.formData.name.value}
                    city={this.state.formData.city.value}
                    state={this.state.formData.state.value}
                    streetAddress={this.state.formData.streetAddress.value}
                    zip={this.state.formData.zip.value}
                    onChange={this.onChange}
                  />
                  <CardSection />
                  <button className="button" disabled={false}>
                    Confirm order
                  </button>
                </form>
              </div>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default injectStripe(CheckoutForm);
