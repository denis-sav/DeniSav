class Calculator extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      formula: '',
      answer: "0" };

    this.clear = this.clear.bind(this);
    this.display = this.display.bind(this);
    this.calculate = this.calculate.bind(this);
  }
  clear()
  {
    this.setState(
    {
      formula: "",
      answer: "0" });

  }
  display(val)
  {
    if (val == "/" || val == "*" || val == "+" || val == "-")
    {
      if (String(this.state.formula).includes("="))
      {
        this.setState({
          answer: val,
          formula: this.state.answer + val });

      } else

      {
        if (this.state.answer[0] == "*" || this.state.answer[0] == "/" || this.state.answer[0] == "-" || this.state.answer[0] == "+")
        {
          if (val != "-")
          {
            this.setState(
            {
              answer: val,
              formula: this.state.formula.substring(0, this.state.formula.length - 1 - (this.state.formula[this.state.formula.length - 1] == "-" && this.state.formula[this.state.formula.length - 2] <= "0")) + val });

          } else

          {
            if (!String(this.state.answer).includes("-"))
            {
              this.setState({
                answer: val,
                formula: this.state.formula + val });

            }
          }
        } else

        {
          this.setState(
          {
            answer: val,
            formula: this.state.formula + val });


        }
      }
    }
    if (val >= "0" && val <= "9")
    {
      if (String(this.state.formula).includes("="))
      {
        this.setState({
          formula: val,
          answer: val });

      } else

      {
        this.setState(
        {
          formula: this.state.formula + val });

        if (this.state.answer == "0" || this.state.answer == "/" || this.state.answer == "*" || this.state.answer == "+" || this.state.answer == "-")
        {
          this.setState(
          {
            answer: "" },

          () => {
            this.setState(
            {
              answer: +val });

          });

        } else
        {this.setState(
          {
            answer: this.state.answer + val });
        }
      }
    }
    if (val == ".")
    {
      if (this.state.answer == "0" || this.state.answer == "/" || this.state.answer == "*" || this.state.answer == "+" || this.state.answer == "-")
      {
        if (this.state.formula[this.state.formula.length - 1] == "0")
        {
          this.setState({
            answer: "0.",
            formula: this.state.formula + "." });

        } else

        {
          this.setState(
          {
            answer: "0.",
            formula: this.state.formula + "0." });

        }
      } else
      {
        if (!String(this.state.answer).includes("."))
        {
          this.setState(
          {
            formula: this.state.formula + ".",
            answer: this.state.answer + "." });

        }
      }
    }
  }
  calculate()
  {
    if (this.state.formula == "")
    {
      this.setState(
      {
        formula: "0=0",
        answer: "0" });

      return;
    }
    while (this.state.formula[this.state.formula.length - 1] == "/" || this.state.formula[this.state.formula.length - 1] == "*" || this.state.formula[this.state.formula.length - 1] == "+" || this.state.formula[this.state.formula.length - 1] == "-")
    {
      console.log(this.state.formula);
      this.state.formula = this.state.formula.substring(0, this.state.formula.length - 1);
    }
    this.setState({
      answer: Math.round(eval(this.state.formula) * 1000) / 1000 },

    () => {this.setState(
      {
        formula: this.state.formula + "=" + this.state.answer });
    });

  }
  render()
  {
    return /*#__PURE__*/(
      React.createElement("div", { id: "calculator" }, /*#__PURE__*/
      React.createElement("div", { id: "container" }, /*#__PURE__*/
      React.createElement("div", { id: "formula" }, this.state.formula), /*#__PURE__*/
      React.createElement("div", { id: "display" }, this.state.answer)), /*#__PURE__*/

      React.createElement("div", { id: "clear", onClick: this.clear, className: "button" }, "AC"), /*#__PURE__*/
      React.createElement("div", { id: "divide", onClick: () => this.display("/"), className: "button operator" }, "/"), /*#__PURE__*/
      React.createElement("div", { id: "multiply", onClick: () => this.display("*"), className: "button operator" }, "x"), /*#__PURE__*/
      React.createElement("div", { id: "seven", onClick: () => this.display("7"), className: "button" }, "7"), /*#__PURE__*/
      React.createElement("div", { id: "eight", onClick: () => this.display("8"), className: "button" }, "8"), /*#__PURE__*/
      React.createElement("div", { id: "nine", onClick: () => this.display("9"), className: "button" }, "9"), /*#__PURE__*/
      React.createElement("div", { id: "subtract", onClick: () => this.display("-"), className: "button operator" }, "-"), /*#__PURE__*/
      React.createElement("div", { id: "four", onClick: () => this.display("4"), className: "button" }, "4"), /*#__PURE__*/
      React.createElement("div", { id: "five", onClick: () => this.display("5"), className: "button" }, "5"), /*#__PURE__*/
      React.createElement("div", { id: "six", onClick: () => this.display("6"), className: "button" }, "6"), /*#__PURE__*/
      React.createElement("div", { id: "add", onClick: () => this.display("+"), className: "button operator" }, "+"), /*#__PURE__*/
      React.createElement("div", { id: "one", onClick: () => this.display("1"), className: "button" }, "1"), /*#__PURE__*/
      React.createElement("div", { id: "two", onClick: () => this.display("2"), className: "button" }, "2"), /*#__PURE__*/
      React.createElement("div", { id: "three", onClick: () => this.display("3"), className: "button" }, "3"), /*#__PURE__*/
      React.createElement("div", { id: "equals", onClick: this.calculate, className: "button" }, "="), /*#__PURE__*/
      React.createElement("div", { id: "zero", onClick: () => this.display("0"), className: "button" }, "0"), /*#__PURE__*/
      React.createElement("div", { id: "decimal", onClick: () => this.display("."), className: "button" }, ".")));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Calculator, null), document.getElementById("app"));