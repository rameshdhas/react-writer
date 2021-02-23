import React from 'react';
import Dexie from 'dexie';
import ContentEditable from 'react-contenteditable'
import SyncClient from 'sync-client';

const dbVersions = [{
                      version: 1,
                      stores: {
                        test: 'id',
                      },
                    }];
const syncClient = new SyncClient('reactEditor', dbVersions);
let options = { table: 'test', pollInterval: 500};


export default class EditorPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
                    text: '',
                    db: new Dexie("reactEditor"),
                    currentID: 5,
                    title: '',
                    author: '',
                    documents: [],
                    sidebarReady: false,
                    saving: false
                }

	}



	componentDidMount() {
	 this.getAllDocs();
	}

    handleTitleChange = evt => {
        this.setState({title: evt.target.value});
    };

    handleAuthorChange = evt => {
        this.setState({author: evt.target.value});
    };

    handleTextChange = evt => {
        this.setState({text: evt.target.value});
    };

    getAllDocs = () => {
        this.state.db.version(1).stores({
            content: "++id, title, text, dateCreated, dateModified"
        });
        this.state.db.content.each((res) => {
            this.setState({documents: this.state.documents.concat(res)})

        }).then(() => {
            this.setState({sidebarReady: true})
            this.getDataFromDB(5);
            if (this.state.documents.length > 0) {
                return true
            } else {
                this.openDB();
                return false
            }
    });


    }
    openDB = () => {
        this.state.db.open();
        this.state.db.content.add({
            title: "Sampler text",
            author: "Name",
            text: '',
            dateCreated: new Date(),
            dateModified: new Date()
        });


syncClient.connect ("http://localhost:5000", options).then(function () {
        console.log ("Connected to sync server!! ");
    }, function (error) {
        console.error("Connection error: " + error);

    }).catch(err => {
        console.error (`Failed to connect: ${err.stack || err}`);
    });

    }

    updateContent = () => {

        }

        getDataFromDB = (docID) => {
            this.state.db.content.get(docID, (res) => {
                if(res !== undefined){
                    let textContent = res.text;
                    this.setState({currentID: docID, text: textContent, author: res.author, title: res.title})
                }

            })
        }

    saveText = () => {
        this.setState({saving: true})
        let addToDb = {
            title: this.state.title,
            author: this.state.author,
            text: this.state.text,
            dateCreated: '01/01/2019',
            dateModified: new Date()
        };

        this.state.db.transaction("rw", this.state.db.content, () => {
            this.state.db.open();
            this.state.db.content.add(addToDb);
            let _this = this;
            this.state.db.content.update(this.state.currentID, addToDb).then(function (updated) {
                _this.setState({saving: false})
            });
            this.state.db.content.update(1, {addToDb});

        }).catch(function (error) {
            console.log('error: ', error.stack);
        });

    }

    loadDoc = (docID, title) => {
            this.getDataFromDB(docID)
            this.setState({title: title})
    }

    addTitle = (title) => {
            this.setState({title: title})
    }

    createNewDoc = () => {
            alert('new doc being created')
            this.state.db.content.add({
                title: "Untitled document",
                text: 'Enter somtething new here',
                author: 'name',
                dateCreated: new Date(),
                dateModified: new Date()
            });
            window.location.reload();
    }


	render() {

		return (
            <section style={{'width': '30em', 'margin': 'auto'}}>


                <header>


                <button className={'btn btn-primary'} onClick={() => this.saveText()}>
                                                        {this.state.saving === false ? 'Save' : 'Saving...'
                                                        }
                                                        </button>

                    <ContentEditable
                                  html={this.state.title}
                                  disabled={false}
                                  onChange={this.handleTitleChange}
                                  className="single-line"
                                  spellCheck="false"
                                  placeholder= "The Title"
                                  tagName='h1'
                                />

                    <ContentEditable
                                  html={this.state.author}
                                  disabled={false}
                                  onChange={this.handleAuthorChange}
                                  className="byline single-line"
                                  spellCheck="false"
                                  placeholder= "Author Name"
                                  tagName='div'
                                />

                </header>

                <ContentEditable
                                                  html={this.state.text}
                                                  disabled={false}
                                                  onChange={this.handleTextChange}
                                                  spellCheck="false"
                                                  placeholder= "Start something great..."
                                                  id="content"
                                                  tagName='p'
                                                />

            </section>
        );
	}

}