import React, { Component } from 'react';

var $this;

class Pagination extends Component {

  constructor(props) {
    super(props);
    $this = this;
    
    this.state = { pager: '', perPages: ''};
  }

  componentWillReceiveProps(newProps) {
    this.setState({
         pager: newProps.paginate,
     })
     
  }

  render() {
    
        var pager = $this.state.pager;
        
        const pages = [];

        if (pager.lastPage <= 1) {
            // don't display pager if there is only 1 page
            
            return (
            <div className="col-sm-6">
                <div className="dataTables_paginate paging_simple_numbers" id="dataTable_paginate">
                    <label> 
                        <select className="pagination form-control" value={pager.perPage}  onChange={$this.props.onChangePagi}>
                            <option value="5" >5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select >
                    </label>
                </div>
            </div>
              );
        }
        var totalPage = 10;
        var startPage, endPage;
        if (pager.lastPage <= totalPage) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = pager.lastPage;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (pager.currentPage <= 6) {
                startPage = 1;
                endPage = totalPage;
            } else if (pager.currentPage + 4 >= pager.lastPage) {
                startPage = pager.lastPage - 9;
                endPage = pager.lastPage;
            } else {
                startPage = pager.currentPage - 5;
                endPage = pager.currentPage + 4;
            }
        }
 

        for (let i = startPage; i <= endPage; i++) {
             
            pages.push(
                <li key={i} className={pager.currentPage === i ? 'paginate_button active' : 'paginate_button'}>
                <a onClick={() => $this.props.onPageChange(i)}>{i}</a>
            </li>
              );
        
        }
        return (
            <div className="col-sm-12">
            
                <div className="col-sm-6">
                    <div id="dataTable_paginate" className="dataTables_paginate paging_simple_numbers" >
                        <ul className="pagination">
                            <li className={pager.currentPage === 1 ? 'paginate_button disabled' : 'paginate_button'}>
                                <a onClick={() => $this.props.onPageChange(1)}>First</a>
                            </li>
                            <li className={pager.currentPage === 1 ? 'paginate_button disabled' : 'paginate_button'}>
                                <a onClick={() => $this.props.onPageChange(pager.currentPage - 1)}>Previous</a>
                            </li>
                            {pages}
                            <li className={pager.currentPage === pager.lastPage ? 'paginate_button disabled' : 'paginate_button'}>
                                <a onClick={() => {pager.currentPage === pager.lastPage ? '' : $this.props.onPageChange(pager.currentPage + 1)}}>Next</a>
                            </li>
                            <li className={pager.currentPage === pager.lastPage ? 'paginate_button disabled' : 'paginate_button'}>
                                <a onClick={() => $this.props.onPageChange(pager.lastPage)}>Last</a>
                            </li>
                            
                        </ul>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="dataTables_paginate paging_simple_numbers" id="dataTable_paginate">
                        <label>
                            <select className="pagination form-control" value={pager.perPage} onChange={$this.props.onChangePagi}>
                                <option value="5" >5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select >
                        </label>
                    </div>
                </div>
            </div>
        );
    
  }
}

export default Pagination;