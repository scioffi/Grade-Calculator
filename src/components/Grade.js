import React from 'react';
import { store } from '../index.js';
import { EditModal } from './EditModal.js';

//component that represents a single grade item as well as recursivly renders more Grades
export class Grade extends React.Component {
    constructor(props) {
        super(props);

        this.setModalState = this.setModalState.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    /*sets a piece of state with what the current state of this grade is
        in order for the modal actions to change that rather than this grade directly*/
    setModalState(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: this.props.state
        });
    }
    //provokes the action to create a new grade item
    handleAdd(event) {
        store.dispatch({
            type: 'ADD',
            h: this.props.state.heritage.concat(this.props.state.id),
            id: (new Date()).getTime()-1515569653105
        });
        //calculate the average with the new grade incorperated
        store.dispatch({
            type: 'CALCULATE_AVG',
            h: this.props.state.heritage.concat(this.props.state.id),
        });
    }

    //returns the appropriate letter grade given the gpa on a 4.0 scale
    findGPA(gpa){
        switch (gpa) {
            case 4:
                return 'A';
            case 3.67:
                return 'A-';
            case 3.33:
                return 'B+';
            case 3:
                return 'B';
            case 2.67:
                return 'B-';
            case 2.33:
                return 'C+';
            case 2:
                return 'C';
            case 1.67:
                return 'C-';
            case 1:
                return 'D';
            default:
                return 'F';
        }
    }

    render() {
        //checks hiding toggle state and changes values according
        var hideText;
        var listStyle;
        if (this.props.state.hide){
            hideText = <i className="fa fa-caret-right" aria-hidden="true"></i>;
            listStyle = {display: 'none'};
        } else {
            hideText = <i className="fa fa-caret-down" aria-hidden="true"></i>;
            listStyle = {listStyleType: 'none'};
        }
        //value to represent the value of the grade, kind is determined by a toggle
        var show = this.props.state.numeric ? (Math.round(this.props.state.avg * 100) / 100) : this.findGPA(this.props.state.avg);
        //determines if the current grade needs to be signified as expected
        var showStyle = this.props.state.expected ? {backgroundColor: '#ffc107'} : {};
        return(
            <div>
                <span>
                    {/*toggles the hiding of all of the children of the current grade*/}
                    <button className="btn btn-link btn-sm" onClick={() => {
                        store.dispatch({
                            type: 'TOGGLE_HIDE',
                            h: this.props.state.heritage.concat(this.props.state.id)
                        })
                    }}>{hideText}</button>
                    {this.props.state.name}
                    &nbsp;&nbsp;
                    <strong style={showStyle}>{show}</strong>
                    &nbsp;&nbsp;&nbsp;
                    <ins>[{this.props.state.weight}]</ins>
                    &nbsp;
                    {/*brings up the edit modal*/}
                    <button
                        className="btn btn-link" data-toggle="modal" data-target="#EditModal" onClick={this.setModalState}><i className="fa fa-cogs fa-lg" aria-hidden="true"></i>
                    </button>
                    {/*provoks the addition of a new grade as a child of the current*/}
                    <button
                        className="btn btn-link" onClick={this.handleAdd}><i className="fa fa-plus-square fa-lg" aria-hidden="true"></i>
                    </button>
                    {/*outer shell of the editing modal*/}
                    <div className="modal fade" id="EditModal" role="dialog">
                        <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                            <EditModal state={this.props.state} />
                          </div>
                        </div>
                    </div>
                </span>
                {/*list of the children grades*/}
                <ul style={listStyle}>
                    {this.props.state.grades.map(grade =>
                        <li key={grade.id}>
                            {/*passes the state of child to the component as a prop*/}
                            <Grade state={grade}/>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}