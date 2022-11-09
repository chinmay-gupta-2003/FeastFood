import PreviewView from './previewView.js';

class ResultsView extends PreviewView {
  _parentCont = document.querySelector('.results');
  _errorMessage =
    'No recipe found for your search! Please try a different search :(';
  _message = `Start by searching for a recipe or an ingredient. Have fun!`;
}

export default new ResultsView();
