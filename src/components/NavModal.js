import React from 'react';
import { store } from '../index.js';

//modal component created from one of the nav bar links
export class NavModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.onFileSubmit = this.onFileSubmit.bind(this);
    }

    //updates a piece of state that keeps track of the desired filename entered
    handleChange(event) {
        store.dispatch({
            type: 'UPDATE_FILENAME',
            fileName: event.target.value
        });
    }

    //updates a piece of state that holds the actual file uploaded
    onChangeFile(event) {
        store.dispatch({
            type: 'UPDATE_FILE',
            file: event.target.files[0]
        });
    }

    //takes the file stored, extracts the data, and sets the rootgrade to the data
    onFileSubmit(event) {
        var json;
        var file = store.getState().file;
        var fileReader = new FileReader();
        fileReader.onload = (function (theFile) {
            return function(e) {
                try {
                    json = JSON.parse(e.target.result);
                    if (json.isGude){
                        store.dispatch({
                            type: 'UPLOAD_GRADE',
                            state: json
                        });
                    }
                    else {
                        throw {message:"Invalid file upload", name:"UserUpload"}
                    }
                } catch (ex) {
                    alert('JSON files created from this Website only please!');
                }
            }
        })(file);
        fileReader.readAsText(file);
    }

    render() {
        //determines which content the modal should be filled with based on which linked provoked it
        switch (store.getState().navModal) {
            case 'Hints':
                return (<div>
                    <div className="modal-header">
                      <h4 className="modal-title">Hints and How-Tos</h4>
                      <button type="button" className="close btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        {/*various how-tos on how to use and navigate the application as a user*/}
                        <ul>
                            <li>The arrow on the left can hide or show the breakdown of that grade.</li>
                            <li>The bolded number/letter to the right of the name is the value of that grade.</li>
                            <li>If the value is highlighted, it or a component of it is marked as expected.</li>
                            <li>The number in [_] is the weight of the grade.</li>
                            <li>When editing a grade be sure to hit the "Save" button. The "Close" button will not apply the changes you made.</li>
                            <li>To have multiple parts be weighted equal, set all the weights to 1.</li>
                            <li>For course grade, use the credits of the course for the weight value.</li>
                            <li>To encorperate your esiting GPA, set the 'Points recieved' to your GPA, 'Points available' to 100, and 'Weight' to how many credits you have taken.</li>
                            <li>The <i className="fa fa-download"></i> Download is to dowload the current grades.</li>
                            <li>The <i className="fa fa-upload"></i> Upload to to load a previously dowloaded grades.</li>
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <div className="flex-container">
                            {/*button to set the root grade to an example grade*/}
                            <button  data-dismiss="modal" className="btn btn-outline-primary btn-sm flex-element" onClick={() => {
                                store.dispatch({
                                    type: 'UPLOAD_GRADE',
                                    state: require('../ExampleGrades.json')
                                })
                            }}>Set to example grades</button>
                            <button className="btn btn-outline-dark flex-element" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>);
            case 'Upload':
                return (<div>
                    <div className="modal-header">
                      <h4 className="modal-title">Upload Grades</h4>
                      <button type="button" className="close btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <h6>FILES SAVED FROM THIS SITE ONLY PLEASE</h6>
                        {/*form for the user to select a file from their computer*/}
                        <div className="form-group">
                            <input accept="json" className="form-control pointer" type="file" onChange={this.onChangeFile} />
                        </div>
                    </div>
                    {/*activates the funtion to upload the file*/}
                    <div className="modal-footer">
                        <div className="flex-container">
                            <button className="btn btn-outline-dark flex-element" data-dismiss="modal" onClick={this.onFileSubmit}>UPLOAD</button>
                        </div>
                    </div>
                </div>);
            case 'Download':
                var data = ("text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState().grade)));
                return (<div>
                    <div className="modal-header">
                      <h4 className="modal-title">Download Grades</h4>
                      <button type="button" className="close btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <form className="form-horizontal">
                            {/*text form to type the desired name of the file of the download*/}
                            <div className="form-group">
                                <label className="control-label">Name of file: </label>
                                <input type="text" defaultValue={store.getState().fileName}
                                onChange={this.handleChange} className="form-control" placeholder="Enter file name"/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {/*dowloads the json of the root grade to the user's computer*/}
                        <div className="flex-container">
                          <a className="btn btn-outline-dark flex-element"  href={"data:" + data} download={store.getState().fileName + ".json"}>DOWNLOAD</a>
                        </div>
                    </div>
                </div>);
            default:
                return(<div></div>);
        }
    }
}
