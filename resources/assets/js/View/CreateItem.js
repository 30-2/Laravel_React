// CreateItem.js

import React, {Component} from 'react';

class CreateItem extends Component {
  constructor(props){
    super(props);
    this.state = {productName: '', productPrice: ''};

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange1(e){
    this.setState({
      productName: e.target.value
    })
  }
  handleChange2(e){
    this.setState({
      productPrice: e.target.value
    })
  }
  handleSubmit(e){
    e.preventDefault();
    const products = {
      name: this.state.productName,
      price: this.state.productPrice
    }
    let uri = 'http://localhost:8000/items';
    axios.post(uri, products).then((response) => {
      // browserHistory.push('/display-item');
    });
  }

    render() {
      return (
        
        <div id="collapseOne" class="body">

                <form onSubmit={this.handleSubmit} class="form-horizontal" id="block-validate">

                    <div class="form-group">
                        <label class="control-label col-lg-4">Required</label>
                        <div class="col-lg-4">
                            <input type="text" onChange={this.handleChange1} class="form-control"/>
                            
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-lg-4">E-mail</label>
                        <div class="col-lg-4">
                            <input type="text" onChange={this.handleChange2} class="form-control"/>
                            
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-lg-4">E-mail</label>
                        <div class="col-lg-4">
                            <input type="text" onChange={this.handleChange2} class="form-control"/>
                            
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-lg-4">E-mail</label>
                        <div class="col-lg-4">
                            <input type="text" onChange={this.handleChange2} class="form-control"/>
                            
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-lg-4">E-mail</label>
                        <div class="col-lg-4">
                            <input type="text" onChange={this.handleChange2} class="form-control"/>
                            
                        </div>
                    </div><div class="form-group">
                        <label class="control-label col-lg-4">E-mail</label>
                        <div class="col-lg-4">
                            <input type="text" onChange={this.handleChange2} class="form-control"/>
                            
                        </div>
                    </div>
                 </form>
        </div>
      )
    }
}
export default CreateItem;