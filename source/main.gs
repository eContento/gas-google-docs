//Este código se ejecuta en el lado del servidor

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Start','start')
    .addSeparator()
    .addItem('Help', 'help')
    .addToUi();
  
  simpleMenuItem();
}

function start(){
  var ui = HtmlService.createTemplateFromFile('sidebar').evaluate()
                      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
                      .setTitle('Beautify SQL Code');
  DocumentApp.getUi().showSidebar(ui);
}

function help(){

}


function getText(){
  var txt = "";
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection){
    var rangeElements = selection.getRangeElements();
    for (i in rangeElements){
      if (rangeElements[i].isPartial()) {
        var startIndex = rangeElements[i].getStartOffset();
        var endIndex = rangeElements[i].getEndOffsetInclusive();
        txt += rangeElements[i].getElement().asText().getText().substring(startIndex, endIndex + 1) + " ";
      } else {
        txt += rangeElements[i].getElement().asText().getText() + " ";
      }
    }
  }
  return txt;
}



/* funcion que reemplaza el texto. Copiada del ejemplo del traductor
 * https://developers.google.com/apps-script/quickstart/docs
 * */
function insertText(newText) {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var replaced = false;
    var elements = selection.getSelectedElements();
    if (elements.length === 1 && elements[0].getElement().getType() ===
        DocumentApp.ElementType.INLINE_IMAGE) {
      throw "Can't insert text into an image.";
    }
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          var parent = element.getParent();
          var remainingText = element.getText().substring(endIndex + 1);
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        var element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only translate elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    var surroundingText = cursor.getSurroundingText().getText();
    var surroundingTextOffset = cursor.getSurroundingTextOffset();

    // If the cursor follows or preceds a non-space character, insert a space
    // between the character and the translation. Otherwise, just insert the
    // translation.
    if (surroundingTextOffset > 0) {
      if (surroundingText.charAt(surroundingTextOffset - 1) != ' ') {
        newText = ' ' + newText;
      }
    }
    if (surroundingTextOffset < surroundingText.length) {
      if (surroundingText.charAt(surroundingTextOffset) != ' ') {
        newText += ' ';
      }
    }
    cursor.insertText(newText);
  }
}



function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}






