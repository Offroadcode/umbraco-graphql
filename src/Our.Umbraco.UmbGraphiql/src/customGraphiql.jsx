import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch'; 

const defaultQuery = `# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
`;

export class CustomGraphiQL extends React.Component {
  constructor(props) {
    super(props);
    var stateModel= {
     
      // OPTIONAL PARAMETERS
      // GraphQL artifacts
      query: this.props.query,
      variables: this.props.variables,
      response: '',

      // GraphQL Schema
      // If `undefined` is provided, an introspection query is executed
      // using the fetcher.
      schema: undefined,

      // Useful to determine which operation to run
      // when there are multiple of them.
      operationName: this.props.operationName,
      storage: null,
      defaultQuery: null,

      // Custom Event Handlers
      onEditQuery: this.props.onEditQuery,
      onEditVariables: this.props.onEditVariables,
      onEditOperationName: this.props.onEditOperationName,

      // GraphiQL automatically fills in leaf nodes when the query
      // does not provide them. Change this if your GraphQL Definitions
      // should behave differently than what's defined here:
      // (https://github.com/graphql/graphiql/blob/master/src/utility/fillLeafs.js#L75)
      getDefaultFieldNames: null,
      token:"",
    };
  
    stateModel.fetcher = function(graphQLParams) {
          // This example expects a GraphQL server at the path /graphql.
          // Change this to point wherever you host your GraphQL server.
          return fetch('/umbraco/graphql', {
              method: 'post',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'token': ''
              },
              body: JSON.stringify(graphQLParams),
              credentials: 'include',
          }).then(function (response) {
             
              return response.text();
          }).then(function (responseBody) {
              try {
                  return JSON.parse(responseBody);
              } catch (error) {
                  return responseBody;
              }
          });
      }
    this.state = stateModel;
    this.updateToken = this.updateToken.bind(this);
  }

      

  // Example of using the GraphiQL Component API via a toolbar button.
  handleClickPrettifyButton(event) {
    const editor = this.graphiql.getQueryEditor();
    const currentText = editor.getValue();
    const { parse, print } = require('graphql');
    const prettyText = print(parse(currentText));
    editor.setValue(prettyText);
  }
  handleHistoryButton(event) {
    this.graphiql.handleToggleHistory(event);
  }
  updateToken(event){
    var newToken = event.target.value
    console.log("setting token", newToken);
    this.setState({token: newToken,fetcher:function(graphQLParams) {
        // This example expects a GraphQL server at the path /graphql.
        // Change this to point wherever you host your GraphQL server.
        return fetch('/umbraco/graphql', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': newToken
            },
            body: JSON.stringify(graphQLParams),
            credentials: 'include',
        }).then(function (response) {
          
            return response.text();
        }).then(function (responseBody) {
            try {
                return JSON.parse(responseBody);
            } catch (error) {
                return responseBody;
            }
        });
    }});
    window.token = newToken;
    console.log("graphiql", this.graphiql);
    window.graphiqldebug = this.graphiql;
    
  }
  render() {
    return (
      <GraphiQL ref={c => { this.graphiql = c; }} {...this.state}>
        <GraphiQL.Logo>
          Umbraco Graphql
        </GraphiQL.Logo>
     
        <GraphiQL.Footer>
        <input type="text" value={this.state.token} onChange={this.updateToken} />
        </GraphiQL.Footer>
      </GraphiQL>
    );
  }
}