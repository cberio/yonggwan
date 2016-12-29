import React from 'react';
import Autosuggest from 'react-autosuggest';

//Imagine you have a list of users that you'd like to autosuggest.
const searchData = [
  {
    name:'이미자',
    phone: '010-1234-7777',
    rating: 'VIP'
  },
  {
    name:'김삿갓',
    phone: '010-4444-1212',
    rating: undefined
  },
  {
    name:'홍길동',
    phone: '010-6262-4444',
    rating: 'BAD'
  },
  {
    name:'최용관',
    phone: '010-9999-1200',
    rating: 'NORMAL'
  },
  {
    name:'장말숙'
  }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
 const inputValue = value.trim().toLowerCase(); // 인풋 value
 const inputLength = inputValue.length; // 인풋 value의 글자수(자,모음단위)

 return inputLength === 0 ? [] : searchData.filter(data =>
   data.name.toLowerCase().slice(0, inputLength) === inputValue
 ); // 인풋 value와 일치하는 모든 객체를 반환함
};

// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.product;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
 <div>
   <span className="suggest-name">{suggestion.name}</span>
   <span className="suggest-rating">{suggestion.rating}</span>
 </div>
);

export default class Search extends React.Component {
 constructor(props) {
   super(props);

   // Autosuggest is a controlled component.
   // This means that you need to provide an input value
   // and an onChange handler that updates this value (see below).
   // Suggestions also need to be provided to the Autosuggest,
   // and they are initially empty because the Autosuggest is closed.
   this.state = {
     value: '',
     suggestions: []
   };
 }

 onChange = (event, { newValue }) => {
   this.setState({
     value: newValue
   });
   this.props.onChange(event, newValue)
 };

 // Autosuggest will call this function every time you need to update suggestions.
 // You already implemented this logic above, so just use it.
 onSuggestionsFetchRequested = ({ value }) => {
   this.setState({
     suggestions: getSuggestions(value)
   });
 };

 // Autosuggest will call this function every time you need to clear suggestions.
 onSuggestionsClearRequested = () => {
   this.setState({
     suggestions: []
   });
 };

 render() {
   const { value, suggestions } = this.state;

   // Autosuggest will pass through all these props to the input element.
   const inputProps = {
     placeholder: this.props.placeholder,
     onChange: this.onChange,
     value
   };

   // Finally, render it!
   return (
     <div className={`react-autosuggest__wrapper ${this.props.className}`}>
       <Autosuggest
         suggestions={suggestions}
         onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
         onSuggestionsClearRequested={this.onSuggestionsClearRequested}
         getSuggestionValue={getSuggestionValue}
         renderSuggestion={renderSuggestion}
         inputProps={inputProps}
         />
     </div>
   );
 }
}
